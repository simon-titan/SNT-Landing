import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/client";

function verifyCalendlySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = createHmac("sha256", secret);
    hmac.update(payload, "utf8");
    const digest = hmac.digest("hex");
    const expected = Buffer.from(digest, "hex");
    const received = Buffer.from(signature, "hex");
    if (expected.length !== received.length) return false;
    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

    // Signature-Verification (falls Signing Key konfiguriert)
    if (signingKey) {
      const signature = request.headers.get("calendly-webhook-signature") ?? "";
      // Calendly sendet "t=<timestamp>,v1=<signature>"
      const parts = Object.fromEntries(signature.split(",").map((p) => p.split("=")));
      const v1 = parts["v1"] ?? "";
      const timestamp = parts["t"] ?? "";

      if (!v1 || !timestamp) {
        console.warn("Calendly Webhook: Ungültige Signatur-Header");
        return NextResponse.json({ error: "Invalid signature format" }, { status: 401 });
      }

      // Prüfe ob Timestamp nicht älter als 5 Minuten ist (Replay-Schutz)
      const ts = parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - ts) > 300) {
        console.warn("Calendly Webhook: Timestamp zu alt");
        return NextResponse.json({ error: "Timestamp too old" }, { status: 401 });
      }

      const isValid = verifyCalendlySignature(`${timestamp}.${rawBody}`, v1, signingKey);
      if (!isValid) {
        console.warn("Calendly Webhook: Signatur ungültig");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event;
    const payload = event?.payload;

    if (!eventType || !payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Nur invitee.created und invitee.canceled verarbeiten
    if (eventType === "invitee.created") {
      const trackingUtmContent = payload?.tracking?.utm_content as string | undefined;
      const inviteeName = payload?.name as string | undefined;
      const inviteeEmail = payload?.email as string | undefined;
      const inviteePhone = payload?.questions_and_answers
        ?.find((q: any) => q.question?.toLowerCase().includes("phone") || q.question?.toLowerCase().includes("telefon"))
        ?.answer as string | undefined;
      const scheduledEventUri = payload?.event as string | undefined;
      const inviteeUri = payload?.uri as string | undefined;
      const scheduledAt = payload?.event_start_time as string | undefined;

      if (trackingUtmContent) {
        const { error } = await supabaseAdmin
          .from("protocol_leads")
          .update({
            status: "booked",
            invitee_name: inviteeName ?? null,
            invitee_email: inviteeEmail ?? null,
            invitee_phone: inviteePhone ?? null,
            calendly_event_uri: scheduledEventUri ?? null,
            calendly_invitee_uri: inviteeUri ?? null,
            scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
            booked_at: new Date().toISOString(),
          })
          .eq("lead_id", trackingUtmContent);

        if (error) {
          console.error("Fehler beim Aktualisieren des Protocol-Leads via Calendly-Webhook:", error);
        } else {
          console.log(`Protocol-Lead ${trackingUtmContent} als gebucht markiert (${inviteeEmail})`);
        }

        // Funnel-Event tracken
        await supabaseAdmin.from("protocol_funnel_events").insert({
          session_id: trackingUtmContent,
          event_type: "calendly_booked",
          metadata: {
            invitee_email: inviteeEmail,
            scheduled_at: scheduledAt,
            lead_id: trackingUtmContent,
          },
        });
      }
    } else if (eventType === "invitee.canceled") {
      const trackingUtmContent = payload?.tracking?.utm_content as string | undefined;
      const cancellationReason = payload?.cancellation?.reason as string | undefined;

      if (trackingUtmContent) {
        const { error } = await supabaseAdmin
          .from("protocol_leads")
          .update({
            status: "submitted",
            cancelled_at: new Date().toISOString(),
          })
          .eq("lead_id", trackingUtmContent)
          .eq("status", "booked");

        if (error) {
          console.error("Fehler beim Stornieren des Protocol-Lead-Termins:", error);
        } else {
          console.log(`Protocol-Lead ${trackingUtmContent}: Calendly-Termin storniert`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Unerwarteter Fehler im Calendly Webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
