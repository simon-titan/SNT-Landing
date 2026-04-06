import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const adminUsername = request.headers.get("x-admin-username");
    const adminPassword = request.headers.get("x-admin-password");
    const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
    const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";

    if (adminUsername !== expectedUsername || adminPassword !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const startOfDay = `${dateStr}T00:00:00.000Z`;
    const endOfDay = `${dateStr}T23:59:59.999Z`;

    const { data: events, error: eventsError } = await supabaseAdmin
      .from("page_events")
      .select("page_variant, event_type, session_id")
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);

    if (eventsError) {
      console.error("[aggregate-stats] fetch error:", eventsError.message);
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    if (!events || events.length === 0) {
      return NextResponse.json({ message: "No events to aggregate", date: dateStr });
    }

    const byVariant: Record<
      string,
      { views: number; sessions: Set<string>; ctaClicks: number; checkoutStarts: number }
    > = {};

    for (const event of events) {
      const v = event.page_variant;
      if (!byVariant[v]) {
        byVariant[v] = { views: 0, sessions: new Set(), ctaClicks: 0, checkoutStarts: 0 };
      }
      byVariant[v].sessions.add(event.session_id);

      switch (event.event_type) {
        case "page_view":
          byVariant[v].views++;
          break;
        case "cta_click":
          byVariant[v].ctaClicks++;
          break;
        case "checkout_start":
          byVariant[v].checkoutStarts++;
          break;
      }
    }

    const upsertRows = Object.entries(byVariant).map(([variant, data]) => ({
      date: dateStr,
      page_variant: variant,
      views: data.views,
      unique_sessions: data.sessions.size,
      cta_clicks: data.ctaClicks,
      checkout_starts: data.checkoutStarts,
    }));

    for (const row of upsertRows) {
      const { error } = await supabaseAdmin
        .from("page_stats_daily")
        .upsert(row, { onConflict: "date,page_variant" });

      if (error) {
        console.error(`[aggregate-stats] upsert error for ${row.page_variant}:`, error.message);
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { error: deleteError } = await supabaseAdmin
      .from("page_events")
      .delete()
      .lt("created_at", thirtyDaysAgo.toISOString());

    if (deleteError) {
      console.error("[aggregate-stats] cleanup error:", deleteError.message);
    }

    return NextResponse.json({
      message: "Aggregation complete",
      date: dateStr,
      variants: Object.keys(byVariant).length,
      totalEvents: events.length,
    });
  } catch (err) {
    console.error("[aggregate-stats] unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
