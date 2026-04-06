import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

type SaleEvent = {
  id: string;
  created_at: string;
  page_variant: string | null;
  product: string | null;
  provider: string | null;
  amount_cents: number | null;
  currency: string | null;
  session_id: string | null;
  outseta_account_id: string | null;
  plan_name: string | null;
  transaction_id: string | null;
};

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
    const PAGE = 1000;

    // page_events: alle Seiten laden
    const allEvents: { page_variant: string; event_type: string; session_id: string; created_at: string }[] = [];
    {
      let offset = 0;
      while (true) {
        const { data, error } = await supabaseAdmin
          .from("page_events")
          .select("page_variant, event_type, session_id, created_at")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true })
          .range(offset, offset + PAGE - 1);
        if (error) { console.error("[analytics] page_events error:", error.message); break; }
        if (!data || data.length === 0) break;
        allEvents.push(...data);
        if (data.length < PAGE) break;
        offset += PAGE;
      }
    }

    // sales_events: alle Seiten laden
    const sales: SaleEvent[] = [];
    {
      let offset = 0;
      while (true) {
        const { data, error } = await supabaseAdmin
          .from("sales_events")
          .select("*")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .range(offset, offset + PAGE - 1);
        if (error) { console.error("[analytics] sales_events error:", error.message); break; }
        if (!data || data.length === 0) break;
        sales.push(...(data as SaleEvent[]));
        if (data.length < PAGE) break;
        offset += PAGE;
      }
    }

    // Aggregiere page_events direkt (kein Umweg ueber page_stats_daily)
    // Nur "page_view" Events zaehlen als View; alle Events einer Session = 1 unique Session
    const variantMap: Record<string, {
      views: number;
      sessions: Set<string>;
      ctaClicks: number;
      checkoutStarts: number;
      conversions: number;
      revenueCents: number;
    }> = {};

    const viewsByDateRaw: Record<string, Record<string, { views: number; sessions: Set<string> }>> = {};

    for (const e of allEvents) {
      const variant = e.page_variant || "default";
      if (!variantMap[variant]) {
        variantMap[variant] = { views: 0, sessions: new Set(), ctaClicks: 0, checkoutStarts: 0, conversions: 0, revenueCents: 0 };
      }
      variantMap[variant].sessions.add(e.session_id);
      if (e.event_type === "page_view") variantMap[variant].views++;
      if (e.event_type === "cta_click") variantMap[variant].ctaClicks++;
      if (e.event_type === "checkout_start") variantMap[variant].checkoutStarts++;

      // Views by date
      const date = e.created_at.split("T")[0];
      if (!viewsByDateRaw[date]) viewsByDateRaw[date] = {};
      if (!viewsByDateRaw[date][variant]) viewsByDateRaw[date][variant] = { views: 0, sessions: new Set() };
      viewsByDateRaw[date][variant].sessions.add(e.session_id);
      if (e.event_type === "page_view") viewsByDateRaw[date][variant].views++;
    }

    for (const sale of sales) {
      const variant = sale.page_variant || "default";
      if (!variantMap[variant]) {
        variantMap[variant] = { views: 0, sessions: new Set(), ctaClicks: 0, checkoutStarts: 0, conversions: 0, revenueCents: 0 };
      }
      variantMap[variant].conversions++;
      variantMap[variant].revenueCents += sale.amount_cents || 0;
    }

    // KPIs
    const totalViews = Object.values(variantMap).reduce((s, v) => s + v.views, 0);
    const totalSessions = new Set(allEvents.map((e) => e.session_id)).size;
    const totalConversions = sales.length;
    const totalRevenueCents = sales.reduce((s, r) => s + (r.amount_cents || 0), 0);
    const totalCheckoutStarts = Object.values(variantMap).reduce((s, v) => s + v.checkoutStarts, 0);

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

    // Views by date (serialisierbar machen: Set -> number)
    const viewsByDate: Record<string, Record<string, { views: number; sessions: number }>> = {};
    for (const [date, variants] of Object.entries(viewsByDateRaw)) {
      viewsByDate[date] = {};
      for (const [v, d] of Object.entries(variants)) {
        viewsByDate[date][v] = { views: d.views, sessions: d.sessions.size };
      }
    }

    const variants = Object.entries(variantMap)
      .map(([name, d]) => ({
        name,
        views: d.views,
        sessions: d.sessions.size,
        ctaClicks: d.ctaClicks,
        checkoutStarts: d.checkoutStarts,
        conversions: d.conversions,
        revenueCents: d.revenueCents,
        conversionRate: d.sessions.size > 0 ? (d.conversions / d.sessions.size) * 100 : 0,
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
      const daySales = sales.filter((s) => s.created_at.startsWith(dateStr));

      const dayVariants: Record<string, { views: number; sales: number; checkoutStarts: number }> = {};
      const dayData = viewsByDateRaw[dateStr] || {};
      for (const [v, data] of Object.entries(dayData)) {
        dayVariants[v] = { views: data.views, sales: 0, checkoutStarts: 0 };
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
