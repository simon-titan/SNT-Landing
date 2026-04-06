import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

type PageviewPayload = {
  slug?: string;
  sessionId?: string;
  referrer?: string;
};

const DEDUP_WINDOW_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PageviewPayload;
    const slug = body.slug?.trim().toLowerCase();
    const sessionId = body.sessionId?.trim();

    if (!slug || !sessionId) {
      return NextResponse.json(
        { error: "slug and sessionId are required." },
        { status: 400 }
      );
    }

    const { data: version, error: versionError } = await supabaseAdmin
      .from("landing_page_versions")
      .select("id")
      .eq("slug", slug)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: "Landing page version not found." },
        { status: 404 }
      );
    }

    const dedupThreshold = new Date(
      Date.now() - DEDUP_WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const { data: recentView, error: dedupError } = await supabaseAdmin
      .from("landing_page_views")
      .select("id")
      .eq("landing_page_version_id", version.id)
      .eq("session_id", sessionId)
      .gte("viewed_at", dedupThreshold)
      .maybeSingle();

    if (dedupError) {
      console.error("Landing page view deduplication error:", dedupError);
      return NextResponse.json({ error: "Unable to track pageview." }, { status: 500 });
    }

    if (recentView) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    const { error: insertError } = await supabaseAdmin.from("landing_page_views").insert({
      landing_page_version_id: version.id,
      session_id: sessionId,
      referrer: body.referrer ?? null,
      user_agent: request.headers.get("user-agent"),
    });

    if (insertError) {
      console.error("Landing page view insert error:", insertError);
      return NextResponse.json({ error: "Unable to track pageview." }, { status: 500 });
    }

    // Dual-Write: auch in neue Analytics-Tabelle schreiben
    await supabaseAdmin
      .from("page_events")
      .insert({
        session_id: sessionId,
        page_variant: slug,
        event_type: "page_view",
        referrer: body.referrer ?? null,
        metadata: {},
      })
      .then(({ error: evtErr }) => {
        if (evtErr) console.error("[tracking.pageview] page_events insert error:", evtErr.message);
      });

    return NextResponse.json({ success: true, deduplicated: false });
  } catch (error) {
    console.error("[tracking.pageview] unexpected error", error);
    return NextResponse.json({ error: "Unable to track pageview." }, { status: 500 });
  }
}
