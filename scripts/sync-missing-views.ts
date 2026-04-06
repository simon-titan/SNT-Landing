/**
 * Sync-Script: Fehlende Views aus landing_page_views -> page_events nachziehen.
 * Nur Eintraege, die noch NICHT in page_events existieren (kein Duplikat-Risiko).
 *
 * Ausfuehren:
 *   npx tsx scripts/sync-missing-views.ts --dry-run
 *   npx tsx scripts/sync-missing-views.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// .env.local laden
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.warn("Could not load .env.local");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const isDryRun = process.argv.includes("--dry-run");
const PAGE_SIZE = 1000;

async function fetchAll<T>(table: string, select: string, orderCol: string): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order(orderCol, { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) { console.error(`Error fetching ${table}:`, error.message); break; }
    if (!data || data.length === 0) break;
    all.push(...(data as T[]));
    console.log(`  ... ${all.length} Zeilen aus ${table} geladen`);
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

async function main() {
  console.log(`\n=== Sync fehlender Views ${isDryRun ? "(DRY RUN)" : "(LIVE)"} ===\n`);

  // 1. Slug-Map laden
  const { data: versions, error: vErr } = await supabase
    .from("landing_page_versions")
    .select("id, slug");
  if (vErr || !versions) { console.error("Fehler beim Laden der Versionen:", vErr?.message); process.exit(1); }
  const slugMap = new Map(versions.map((v) => [v.id, v.slug]));
  console.log(`${versions.length} Landing Page Versionen geladen`);

  // 2. Alle alten Views laden
  type OldView = { id: string; landing_page_version_id: string; session_id: string | null; referrer: string | null; viewed_at: string };
  console.log("\n--- Lade alte Views aus landing_page_views ---");
  const oldViews = await fetchAll<OldView>(
    "landing_page_views",
    "id, landing_page_version_id, session_id, referrer, viewed_at",
    "viewed_at"
  );
  console.log(`Gesamt alte Views: ${oldViews.length}`);

  // 3. Alle vorhandenen page_events (nur session_id + created_at) laden
  //    um Duplikate zu erkennen
  console.log("\n--- Lade vorhandene page_events (session_id + created_at) ---");
  type ExistingEvent = { session_id: string; created_at: string };
  const existingEvents = await fetchAll<ExistingEvent>(
    "page_events",
    "session_id, created_at",
    "created_at"
  );

  // Lookup-Set: "session_id|datum_minute" (minutengenau, da viewed_at und created_at leicht abweichen koennen)
  const existingSet = new Set(
    existingEvents.map((e) => {
      const minute = e.created_at?.slice(0, 16) ?? ""; // "2024-01-15T14:32"
      return `${e.session_id}|${minute}`;
    })
  );
  console.log(`${existingEvents.length} vorhandene page_events geladen`);

  // 4. Fehlende Views ermitteln
  const missing = oldViews.filter((v) => {
    const sessionId = v.session_id || v.id;
    const minute = v.viewed_at?.slice(0, 16) ?? "";
    return !existingSet.has(`${sessionId}|${minute}`);
  });

  console.log(`\n--- Ergebnis ---`);
  console.log(`Alte Views gesamt:      ${oldViews.length}`);
  console.log(`Bereits in page_events: ${oldViews.length - missing.length}`);
  console.log(`Fehlende Views:         ${missing.length}`);

  if (missing.length === 0) {
    console.log("\nAlle Views sind bereits synchronisiert. Nichts zu tun.");
    return;
  }

  if (isDryRun) {
    console.log("\nMode: DRY RUN (nichts geschrieben)");
    console.log("Beispiel fehlende Views (erste 5):");
    for (const v of missing.slice(0, 5)) {
      const slug = slugMap.get(v.landing_page_version_id) || "legacy";
      console.log(`  session=${v.session_id || v.id} slug=${slug} time=${v.viewed_at}`);
    }
    return;
  }

  // 5. Fehlende Views einfuegen
  console.log("\n--- Schreibe fehlende Views in page_events ---");
  const rows = missing.map((v) => ({
    session_id: v.session_id || v.id,
    page_variant: slugMap.get(v.landing_page_version_id) || "legacy",
    event_type: "page_view",
    referrer: v.referrer,
    metadata: {},
    created_at: v.viewed_at,
  }));

  const BATCH_SIZE = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("page_events").insert(batch);
    if (error) {
      console.error(`  Fehler bei Batch ${i}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Eingefuegt: ${inserted}/${rows.length}`);
    }
  }

  // 6. page_stats_daily fuer betroffene Tage neu aggregieren
  console.log("\n--- Aktualisiere page_stats_daily fuer betroffene Tage ---");
  const affectedDays = new Map<string, Map<string, { views: number; sessions: Set<string> }>>();
  for (const row of rows) {
    const date = row.created_at?.split("T")[0] ?? "unknown";
    if (!affectedDays.has(date)) affectedDays.set(date, new Map());
    const dayMap = affectedDays.get(date)!;
    if (!dayMap.has(row.page_variant)) dayMap.set(row.page_variant, { views: 0, sessions: new Set() });
    const entry = dayMap.get(row.page_variant)!;
    entry.views++;
    entry.sessions.add(row.session_id);
  }

  for (const [date, variantMap] of affectedDays.entries()) {
    for (const [page_variant, data] of variantMap.entries()) {
      const { error } = await supabase
        .from("page_stats_daily")
        .upsert(
          {
            date,
            page_variant,
            views: data.views,
            unique_sessions: data.sessions.size,
          },
          { onConflict: "date,page_variant" }
        );
      if (error) {
        console.error(`  Upsert-Fehler ${date}/${page_variant}:`, error.message);
      }
    }
  }
  console.log(`  ${affectedDays.size} Tage aktualisiert`);

  console.log(`\n=== Fertig: ${inserted} fehlende Views synchronisiert ===\n`);
}

main().catch((err) => {
  console.error("Sync fehlgeschlagen:", err);
  process.exit(1);
});
