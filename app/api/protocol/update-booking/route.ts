import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

/**
 * POST /api/protocol/update-booking
 *
 * Wird von der /protocol/booked Seite aufgerufen, nachdem Calendly den Benutzer
 * mit allen Buchungsdaten als URL-Parameter weitergeleitet hat.
 *
 * Calendly-Redirect-URL-Parameter (wenn "Pass event details" aktiviert ist):
 *   utm_content      → unsere lead_id
 *   invitee_full_name
 *   invitee_email
 *   event_start_time (ISO 8601)
 *   event_end_time
 *   invitee_uuid     → Calendly-interne ID
 *   event_type_name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      lead_id,
      invitee_full_name,
      invitee_email,
      event_start_time,
      event_end_time,
      invitee_uuid,
      event_type_name,
    } = body;

    if (!lead_id) {
      return NextResponse.json({ error: "lead_id ist erforderlich." }, { status: 400 });
    }

    // Lead in der Datenbank suchen
    const { data: existing, error: findError } = await supabaseAdmin
      .from("protocol_leads")
      .select("id, status")
      .eq("lead_id", lead_id)
      .single();

    if (findError || !existing) {
      // Kein Fehler nach außen geben, der Lead existiert evtl. noch nicht (Race Condition)
      console.warn(`Protocol update-booking: Lead ${lead_id} nicht gefunden.`);
      return NextResponse.json({ success: false, reason: "lead_not_found" });
    }

    // Nicht nochmal überschreiben wenn bereits gebucht
    const updateData: Record<string, string | null> = {
      status: "booked",
      booked_at: new Date().toISOString(),
    };

    if (invitee_full_name) updateData.invitee_name = invitee_full_name;
    if (invitee_email) updateData.invitee_email = invitee_email;
    if (event_start_time) {
      try {
        updateData.scheduled_at = new Date(event_start_time).toISOString();
      } catch {
        updateData.scheduled_at = event_start_time;
      }
    }
    if (invitee_uuid) updateData.calendly_invitee_uri = invitee_uuid;

    const { error: updateError } = await supabaseAdmin
      .from("protocol_leads")
      .update(updateData)
      .eq("lead_id", lead_id);

    if (updateError) {
      console.error("Fehler beim Aktualisieren des Protocol-Leads:", updateError);
      return NextResponse.json({ error: "Aktualisierung fehlgeschlagen." }, { status: 500 });
    }

    // Funnel-Event tracken (fire-and-forget, Fehler ignorieren)
    void supabaseAdmin.from("protocol_funnel_events").insert({
      session_id: lead_id,
      event_type: "calendly_booked",
      metadata: {
        invitee_email: invitee_email ?? null,
        scheduled_at: event_start_time ?? null,
        invitee_uuid: invitee_uuid ?? null,
        source: "redirect_params",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unerwarteter Fehler in update-booking:", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
