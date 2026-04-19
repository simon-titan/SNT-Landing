import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

const VALID_EVENT_TYPES = [
  "page_view",
  "form_open",
  "step_1_complete",
  "step_2_complete",
  "step_3_complete",
  "form_submit",
  "calendly_redirect",
  "calendly_booked",
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, event_type, metadata } = body;

    if (!session_id || !event_type) {
      return NextResponse.json({ error: "session_id und event_type sind erforderlich." }, { status: 400 });
    }

    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json({ error: "Ungültiger event_type." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("protocol_funnel_events").insert({
      session_id,
      event_type,
      metadata: metadata || {},
    });

    if (error) {
      console.error("Fehler beim Tracking:", error);
      return NextResponse.json({ error: "Tracking fehlgeschlagen." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unerwarteter Fehler beim Protocol-Tracking:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
