import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

type StatsPeriod = "today" | "week" | "month" | "all";

function authenticateAdmin(request: NextRequest) {
  const adminUsername = request.headers.get("x-admin-username");
  const adminPassword = request.headers.get("x-admin-password");

  const expectedUsername = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_PASSWORD ?? "sntsecure";

  return adminUsername === expectedUsername && adminPassword === expectedPassword;
}

const getPeriodStart = (period: StatsPeriod): string | null => {
  const now = new Date();
  if (period === "all") return null;

  if (period === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }

  if (period === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return weekAgo.toISOString();
  }

  const monthAgo = new Date(now);
  monthAgo.setMonth(now.getMonth() - 1);
  return monthAgo.toISOString();
};

export async function GET(request: NextRequest) {
  try {
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const periodParam = request.nextUrl.searchParams.get("period") as StatsPeriod | null;
    const period: StatsPeriod =
      periodParam === "today" || periodParam === "week" || periodParam === "month" || periodParam === "all"
        ? periodParam
        : "all";

    const periodStart = getPeriodStart(period);

    const { data: versions, error: versionsError } = await supabaseAdmin
      .from("landing_page_versions")
      .select("id,name,slug,course_type,is_active,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (versionsError) {
      console.error("Landing stats versions error:", versionsError);
      return NextResponse.json({ error: "Unable to load versions." }, { status: 500 });
    }

    const { data: allViews, error: viewsError } = await supabaseAdmin
      .from("landing_page_views")
      .select("landing_page_version_id,viewed_at");

    if (viewsError) {
      console.error("Landing stats views error:", viewsError);
      return NextResponse.json({ error: "Unable to load views." }, { status: 500 });
    }

    const { data: allSales, error: salesError } = await supabaseAdmin
      .from("landing_page_sales")
      .select("landing_page_version_id,product,provider,amount,sale_at,currency");

    if (salesError) {
      console.error("Landing stats sales error:", salesError);
      return NextResponse.json({ error: "Unable to load sales." }, { status: 500 });
    }

    const isInPeriod = (iso: string) => !periodStart || new Date(iso).getTime() >= new Date(periodStart).getTime();

    const versionsWithStats = (versions ?? []).map((version) => {
      const versionViews = (allViews ?? []).filter((v) => v.landing_page_version_id === version.id);
      const versionSales = (allSales ?? []).filter((s) => s.landing_page_version_id === version.id);

      const periodViews = versionViews.filter((v) => isInPeriod(v.viewed_at));
      const periodSales = versionSales.filter((s) => isInPeriod(s.sale_at));

      const productBreakdown = {
        monthly: { sales: 0, revenue: 0 },
        quarterly: { sales: 0, revenue: 0 },
        annual: { sales: 0, revenue: 0 },
        lifetime: { sales: 0, revenue: 0 },
      };

      const providerBreakdown = {
        outseta: { sales: 0, revenue: 0 },
        paypal: { sales: 0, revenue: 0 },
      };

      for (const sale of periodSales) {
        if (sale.product in productBreakdown) {
          const key = sale.product as keyof typeof productBreakdown;
          productBreakdown[key].sales += 1;
          productBreakdown[key].revenue += Number(sale.amount ?? 0);
        }
        if (sale.provider === "paypal" || sale.provider === "outseta") {
          providerBreakdown[sale.provider].sales += 1;
          providerBreakdown[sale.provider].revenue += Number(sale.amount ?? 0);
        }
      }

      const periodRevenue = periodSales.reduce((sum, sale) => sum + Number(sale.amount ?? 0), 0);
      const totalRevenue = versionSales.reduce((sum, sale) => sum + Number(sale.amount ?? 0), 0);
      const conversionRate = periodViews.length > 0 ? (periodSales.length / periodViews.length) * 100 : 0;

      return {
        ...version,
        stats: {
          totalViews: versionViews.length,
          periodViews: periodViews.length,
          totalSales: versionSales.length,
          periodSales: periodSales.length,
          totalRevenue,
          periodRevenue,
          conversionRate,
          productBreakdown,
          providerBreakdown,
        },
      };
    });

    const totals = versionsWithStats.reduce(
      (acc, version) => {
        acc.periodViews += version.stats.periodViews;
        acc.periodSales += version.stats.periodSales;
        acc.periodRevenue += version.stats.periodRevenue;
        return acc;
      },
      { periodViews: 0, periodSales: 0, periodRevenue: 0 }
    );

    const averageConversionRate =
      totals.periodViews > 0 ? (totals.periodSales / totals.periodViews) * 100 : 0;

    return NextResponse.json({
      period,
      versions: versionsWithStats,
      totals: {
        ...totals,
        averageConversionRate,
      },
    });
  } catch (error) {
    console.error("[admin.landing.stats] unexpected error", error);
    return NextResponse.json({ error: "Interner Server-Fehler" }, { status: 500 });
  }
}
