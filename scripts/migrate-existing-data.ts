/**
 * Migration Script: Bestandsdaten aus landing_page_views + landing_page_sales
 * in die neuen Tabellen page_events, sales_events, page_stats_daily uebertragen.
 *
 * Ausfuehren:
 *   npx tsx scripts/migrate-existing-data.ts --dry-run
 *   npx tsx scripts/migrate-existing-data.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// .env.local laden (tsx/node laedt das nicht automatisch wie Next.js)
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
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  console.warn("Could not load .env.local, using existing environment variables");
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate-existing-data.ts");
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

    if (error) {
      console.error(`  Error fetching ${table} at offset ${offset}:`, error.message);
      break;
    }
    if (!data || data.length === 0) break;

    all.push(...(data as T[]));
    console.log(`  ... loaded ${all.length} rows from ${table}`);

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

async function main() {
  console.log(`\n=== Tracking Data Migration ${isDryRun ? "(DRY RUN)" : "(LIVE)"} ===\n`);

  // 1. Load landing_page_versions for slug mapping
  const { data: versions, error: versionsError } = await supabase
    .from("landing_page_versions")
    .select("id, slug");

  if (versionsError || !versions) {
    console.error("Failed to load landing_page_versions:", versionsError?.message);
    process.exit(1);
  }

  const slugMap = new Map(versions.map((v) => [v.id, v.slug]));
  console.log(`Found ${versions.length} landing page versions:`);
  for (const v of versions) {
    console.log(`  ${v.id} -> ${v.slug}`);
  }

  // 2. Migrate landing_page_views -> page_events
  console.log("\n--- Migrating Views ---");
  type ViewRow = { id: string; landing_page_version_id: string; session_id: string | null; referrer: string | null; viewed_at: string };
  const views = await fetchAll<ViewRow>(
    "landing_page_views",
    "id, landing_page_version_id, session_id, referrer, viewed_at",
    "viewed_at"
  );

  console.log(`Found ${views.length} existing page views`);

  const viewRows = views.map((v) => ({
    session_id: v.session_id || v.id,
    page_variant: slugMap.get(v.landing_page_version_id) || "legacy",
    event_type: "page_view",
    referrer: v.referrer,
    metadata: {},
    created_at: v.viewed_at,
  }));

  if (!isDryRun && viewRows.length > 0) {
    const BATCH_SIZE = 500;
    let inserted = 0;
    for (let i = 0; i < viewRows.length; i += BATCH_SIZE) {
      const batch = viewRows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("page_events").insert(batch);
      if (error) {
        console.error(`  Batch insert error at offset ${i}:`, error.message);
      } else {
        inserted += batch.length;
        console.log(`  Inserted ${inserted}/${viewRows.length} view events`);
      }
    }
  }

  // 3. Migrate landing_page_sales -> sales_events
  console.log("\n--- Migrating Sales ---");
  type SaleRow = { id: string; landing_page_version_id: string; product: string; provider: string; amount: number; currency: string; transaction_id: string | null; sale_at: string };
  const sales = await fetchAll<SaleRow>(
    "landing_page_sales",
    "id, landing_page_version_id, product, provider, amount, currency, transaction_id, sale_at",
    "sale_at"
  );

  console.log(`Found ${sales.length} existing sales`);

  const saleRows = (sales || []).map((s) => ({
    session_id: null,
    page_variant: slugMap.get(s.landing_page_version_id) || "legacy",
    outseta_account_id: null,
    plan_name: s.product,
    product: s.product,
    amount_cents: Math.round(Number(s.amount) * 100),
    currency: s.currency || "EUR",
    provider: s.provider,
    transaction_id: s.transaction_id,
    created_at: s.sale_at,
  }));

  if (!isDryRun && saleRows.length > 0) {
    const BATCH_SIZE = 500;
    let inserted = 0;
    for (let i = 0; i < saleRows.length; i += BATCH_SIZE) {
      const batch = saleRows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("sales_events").insert(batch);
      if (error) {
        console.error(`  Batch insert error at offset ${i}:`, error.message);
      } else {
        inserted += batch.length;
        console.log(`  Inserted ${inserted}/${saleRows.length} sale events`);
      }
    }
  }

  // 4. Aggregate into page_stats_daily
  console.log("\n--- Aggregating Daily Stats ---");

  const dailyMap = new Map<string, {
    views: number;
    sessions: Set<string>;
    conversions: number;
    revenueCents: number;
  }>();

  for (const row of viewRows) {
    const date = row.created_at?.split("T")[0] || "unknown";
    const key = `${date}|${row.page_variant}`;
    if (!dailyMap.has(key)) {
      dailyMap.set(key, { views: 0, sessions: new Set(), conversions: 0, revenueCents: 0 });
    }
    const entry = dailyMap.get(key)!;
    entry.views++;
    entry.sessions.add(row.session_id);
  }

  for (const row of saleRows) {
    const date = row.created_at?.split("T")[0] || "unknown";
    const key = `${date}|${row.page_variant}`;
    if (!dailyMap.has(key)) {
      dailyMap.set(key, { views: 0, sessions: new Set(), conversions: 0, revenueCents: 0 });
    }
    const entry = dailyMap.get(key)!;
    entry.conversions++;
    entry.revenueCents += row.amount_cents;
  }

  const statsRows = [...dailyMap.entries()].map(([key, data]) => {
    const [date, page_variant] = key.split("|");
    return {
      date,
      page_variant,
      views: data.views,
      unique_sessions: data.sessions.size,
      cta_clicks: 0,
      checkout_starts: 0,
      conversions: data.conversions,
      revenue_cents: data.revenueCents,
    };
  });

  console.log(`Aggregated ${statsRows.length} daily stat rows`);

  if (!isDryRun && statsRows.length > 0) {
    const BATCH_SIZE = 200;
    let upserted = 0;
    for (let i = 0; i < statsRows.length; i += BATCH_SIZE) {
      const batch = statsRows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from("page_stats_daily")
        .upsert(batch, { onConflict: "date,page_variant" });
      if (error) {
        console.error(`  Upsert error at offset ${i}:`, error.message);
      } else {
        upserted += batch.length;
        console.log(`  Upserted ${upserted}/${statsRows.length} daily stats`);
      }
    }
  }

  // Summary
  console.log("\n=== Summary ===");
  console.log(`Views to migrate:       ${viewRows.length}`);
  console.log(`Sales to migrate:       ${saleRows.length}`);
  console.log(`Daily stats to create:  ${statsRows.length}`);
  console.log(`Mode:                   ${isDryRun ? "DRY RUN (nothing written)" : "LIVE (data written)"}`);
  console.log("");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
