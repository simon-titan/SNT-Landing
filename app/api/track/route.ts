import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export const runtime = "nodejs";

const MAX_EVENTS_PER_REQUEST = 10;
const SESSION_COOKIE = "snt_session";
const VARIANT_COOKIE = "page_variant";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

interface IncomingEvent {
  type: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events: IncomingEvent[] = Array.isArray(body.events)
      ? body.events.slice(0, MAX_EVENTS_PER_REQUEST)
      : [];

    if (!events.length) {
      return NextResponse.json({ ok: true });
    }

    let sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    const needsSessionCookie = !sessionId;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const pageVariant =
      body.pageVariant ||
      request.cookies.get(VARIANT_COOKIE)?.value ||
      "default";

    const rows = events.map((e) => ({
      session_id: sessionId,
      page_variant: pageVariant,
      event_type: e.type,
      referrer: typeof document !== "undefined" ? null : null,
      metadata: e.metadata ?? {},
    }));

    const { error } = await supabaseAdmin.from("page_events").insert(rows);
    if (error) {
      console.error("[/api/track] insert error:", error.message);
    }

    const response = NextResponse.json({ ok: true });

    if (needsSessionCookie) {
      response.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        path: "/",
        maxAge: SESSION_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch (err) {
    console.error("[/api/track] unexpected error:", err);
    return NextResponse.json({ ok: true });
  }
}
