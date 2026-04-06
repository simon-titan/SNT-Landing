import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

function authenticateAdmin(request: NextRequest): boolean {
  const username = request.headers.get("x-admin-username");
  const password = request.headers.get("x-admin-password");
  const expected_u = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
  const expected_p = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";
  return username === expected_u && password === expected_p;
}

export async function GET(request: NextRequest) {
  if (!authenticateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = parseInt(request.nextUrl.searchParams.get("days") || "30", 10);
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  try {
    const [statsResult, salesResult, recentEventsResult] = await Promise.all([
      supabaseAdmin
        .from("page_stats_daily")
        .select("*")
        .gte("date", sinceStr)
        .order("date", { ascending: false }),

      supabaseAdmin
        .from("sales_events")
        .select("*")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("page_events")
        .select("page_variant, event_type, session_id, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);

    if (statsResult.error) {
      console.error("[analytics] stats error:", statsResult.error.message);
    }
    if (salesResult.error) {
      console.error("[analytics] sales error:", salesResult.error.message);
    }

    const stats = statsResult.data || [];
    const sales = salesResult.data || [];
    const recentEvents = recentEventsResult.data || [];

    // KPIs
    const totalViews = stats.reduce((s, r) => s + (r.views || 0), 0);
    const totalSessions = stats.reduce((s, r) => s + (r.unique_sessions || 0), 0);
    const totalConversions = sales.length;
    const totalRevenueCents = sales.reduce((s, r) => s + (r.amount_cents || 0), 0);
    const totalCheckoutStarts = stats.reduce((s, r) => s + (r.checkout_starts || 0), 0);

    // Sales by date
    const salesByDate: Record<string, { count: number; revenue: number; products: Record<string, number> }> = {};
    for (const sale of sales) {
      const date = sale.created_at.split("T")[0];
      if (!salesByDate[date]) salesByDate[date] = { count: 0, revenue: 0, products: {} };
      salesByDate[date].count++;
      salesByDate[date].revenue += sale.amount_cents || 0;
      const p = sale.product || "unknown";
      salesByDate[date].products[p] = (salesByDate[date].products[p] || 0) + 1;
    }

    // Views by date (from page_stats_daily)
    const viewsByDate: Record<string, Record<string, { views: number; sessions: number }>> = {};
    for (const row of stats) {
      if (!viewsByDate[row.date]) viewsByDate[row.date] = {};
      viewsByDate[row.date][row.page_variant] = {
        views: row.views || 0,
        sessions: row.unique_sessions || 0,
      };
    }

    // Also count from recent events if today's stats haven't been aggregated
    const today = new Date().toISOString().split("T")[0];
    const todayEvents = recentEvents.filter((e) => e.created_at.startsWith(today));
    if (todayEvents.length > 0 && !viewsByDate[today]) {
      viewsByDate[today] = {};
      const byVariant: Record<string, { views: number; sessions: Set<string> }> = {};
      for (const e of todayEvents) {
        if (!byVariant[e.page_variant]) byVariant[e.page_variant] = { views: 0, sessions: new Set() };
        byVariant[e.page_variant].sessions.add(e.session_id);
        if (e.event_type === "page_view") byVariant[e.page_variant].views++;
      }
      for (const [v, d] of Object.entries(byVariant)) {
        viewsByDate[today][v] = { views: d.views, sessions: d.sessions.size };
      }
    }

    // Variant comparison
    const variantMap: Record<string, {
      views: number; sessions: number; ctaClicks: number;
      checkoutStarts: number; conversions: number; revenueCents: number;
    }> = {};

    for (const row of stats) {
      if (!variantMap[row.page_variant]) {
        variantMap[row.page_variant] = {
          views: 0, sessions: 0, ctaClicks: 0,
          checkoutStarts: 0, conversions: 0, revenueCents: 0,
        };
      }
      const v = variantMap[row.page_variant];
      v.views += row.views || 0;
      v.sessions += row.unique_sessions || 0;
      v.ctaClicks += row.cta_clicks || 0;
      v.checkoutStarts += row.checkout_starts || 0;
    }

    for (const sale of sales) {
      const variant = sale.page_variant || "default";
      if (!variantMap[variant]) {
        variantMap[variant] = {
          views: 0, sessions: 0, ctaClicks: 0,
          checkoutStarts: 0, conversions: 0, revenueCents: 0,
        };
      }
      variantMap[variant].conversions++;
      variantMap[variant].revenueCents += sale.amount_cents || 0;
    }

    const variants = Object.entries(variantMap)
      .map(([name, d]) => ({
        name,
        ...d,
        conversionRate: d.sessions > 0 ? (d.conversions / d.sessions) * 100 : 0,
        abandonRate: d.checkoutStarts > 0 ? ((d.checkoutStarts - d.conversions) / d.checkoutStarts) * 100 : 0,
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate);

    // Timeline (last 14 days)
    const timelineDays = 14;
    const timeline: Array<{ date: string; variants: Record<string, { views: number; sales: number; checkoutStarts: number }> }> = [];
    for (let i = timelineDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayStats = stats.filter((r) => r.date === dateStr);
      const daySales = sales.filter((s) => s.created_at.startsWith(dateStr));

      const dayVariants: Record<string, { views: number; sales: number; checkoutStarts: number }> = {};
      for (const r of dayStats) {
        dayVariants[r.page_variant] = {
          views: r.views || 0,
          sales: 0,
          checkoutStarts: r.checkout_starts || 0,
        };
      }
      for (const s of daySales) {
        const v = s.page_variant || "default";
        if (!dayVariants[v]) dayVariants[v] = { views: 0, sales: 0, checkoutStarts: 0 };
        dayVariants[v].sales++;
      }

      timeline.push({ date: dateStr, variants: dayVariants });
    }

    // Sales detail list
    const salesDetail = sales.map((s) => ({
      id: s.id,
      date: s.created_at,
      pageVariant: s.page_variant,
      product: s.product,
      provider: s.provider,
      amountCents: s.amount_cents,
      currency: s.currency,
    }));

    return NextResponse.json({
      kpis: {
        totalViews,
        totalSessions,
        totalConversions,
        totalRevenueCents,
        totalCheckoutStarts,
        abandonRate: totalCheckoutStarts > 0
          ? ((totalCheckoutStarts - totalConversions) / totalCheckoutStarts) * 100
          : 0,
      },
      salesByDate,
      viewsByDate,
      variants,
      timeline,
      salesDetail,
    });
  } catch (err) {
    console.error("[analytics] unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
