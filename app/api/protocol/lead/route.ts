import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      trading_duration,
      current_level,
      holding_back,
      snt_duration,
      snt_source,
      investment_willingness,
      why_candidate,
      session_id,
      referrer,
    } = body;

    // Pflichtfelder validieren
    if (
      !trading_duration ||
      !current_level ||
      !holding_back ||
      !snt_duration ||
      !investment_willingness ||
      !why_candidate
    ) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt sein." },
        { status: 400 }
      );
    }

    if (holding_back.length < 30) {
      return NextResponse.json(
        { error: "Bitte beschreibe dein Problem etwas ausführlicher (mindestens 30 Zeichen)." },
        { status: 400 }
      );
    }

    if (why_candidate.length < 50) {
      return NextResponse.json(
        { error: "Bitte erkläre ausführlicher, warum du der richtige Kandidat bist (mindestens 50 Zeichen)." },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Settings für Calendly-URL abrufen
    const { data: settings } = await supabaseAdmin
      .from("protocol_settings")
      .select("calendly_url")
      .eq("id", 1)
      .single();

    const baseCalendlyUrl = settings?.calendly_url ?? "https://calendly.com/websitetitan110/30min";

    // Lead in Supabase speichern
    const { data: lead, error } = await supabaseAdmin
      .from("protocol_leads")
      .insert({
        trading_duration,
        current_level,
        holding_back,
        snt_duration,
        snt_source: snt_source || null,
        investment_willingness,
        why_candidate,
        session_id: session_id || null,
        page_variant: "protocol",
        referrer: referrer || null,
        user_agent: userAgent || null,
        status: "submitted",
      })
      .select("lead_id")
      .single();

    if (error) {
      console.error("Fehler beim Speichern des Protocol-Leads:", error);
      return NextResponse.json(
        { error: "Bewerbung konnte nicht gespeichert werden. Bitte versuche es erneut." },
        { status: 500 }
      );
    }

    const leadId = lead.lead_id;
    const calendlyUrl = `${baseCalendlyUrl}?utm_content=${leadId}&utm_source=snt_protocol&utm_medium=funnel`;

    return NextResponse.json({ success: true, leadId, calendlyUrl }, { status: 201 });
  } catch (error) {
    console.error("Unerwarteter Fehler beim Protocol-Lead:", error);
    return NextResponse.json(
      { error: "Interner Server-Fehler" },
      { status: 500 }
    );
  }
}
