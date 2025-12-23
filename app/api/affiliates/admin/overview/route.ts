import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";

type AffiliateSalesSummary = {
  saleCount: number;
  revenue: number;
  monthlySales: number;
  monthlyRevenue: number;
  lifetimeSales: number;
  lifetimeRevenue: number;
};

type AffiliateCodeSummary = {
  id: string;
  code: string;
  label: string | null;
  isActive: boolean;
  createdAt: string;
  saleCount: number;
  revenue: number;
};

type AffiliateOverviewEntry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  paid_amount: number | null;
  codes: AffiliateCodeSummary[];
  metrics: AffiliateSalesSummary;
};

export async function GET(request: NextRequest) {
  const unauthorized = requireAdminCredentials(request);
  if (unauthorized) return unauthorized;

  const { data: affiliates } = await supabaseAdmin
    .from("affiliates")
    .select("id, first_name, last_name, email, created_at, paid_amount, affiliate_codes(id, code, label, is_active, created_at)")
    .order("created_at", { ascending: false });

  const { data: sales } = await supabaseAdmin
    .from("affiliate_sales")
    .select("id, amount, currency, product, provider, sale_at, affiliate_code_id, metadata")
    .order("sale_at", { ascending: false });

  const overview: AffiliateOverviewEntry[] = (affiliates ?? []).map((affiliate) => ({
    id: affiliate.id,
    firstName: affiliate.first_name,
    lastName: affiliate.last_name,
    email: affiliate.email,
    createdAt: affiliate.created_at,
    paid_amount: affiliate.paid_amount ?? 0,
    codes:
      affiliate.affiliate_codes?.map((code) => ({
        id: code.id,
        code: code.code,
        label: code.label,
        isActive: code.is_active,
        createdAt: code.created_at,
        saleCount: 0,
        revenue: 0,
      })) ?? [],
    metrics: {
      saleCount: 0,
      revenue: 0,
      monthlySales: 0,
      monthlyRevenue: 0,
      lifetimeSales: 0,
      lifetimeRevenue: 0,
    },
  }));

  const summaryMap = new Map(overview.map((entry) => [entry.id, entry]));
  const codeLookup = new Map<string, { affiliateId: string; codeEntry: AffiliateCodeSummary }>();

  for (const entry of overview) {
    for (const codeEntry of entry.codes) {
      codeLookup.set(codeEntry.id, { affiliateId: entry.id, codeEntry });
    }
  }

  const totals = {
    saleCount: 0,
    revenue: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    lifetimeSales: 0,
    lifetimeRevenue: 0,
  };

  const latestSales = (sales ?? [])
    .slice(0, 20)
    .map((sale) => {
      const codeInfo = codeLookup.get(sale.affiliate_code_id);
      const amount = typeof sale.amount === "string" ? Number(sale.amount) : sale.amount;
      return {
        id: sale.id,
        amount: typeof amount === "number" ? amount : Number(amount) || 0,
        currency: sale.currency,
        product: sale.product,
        provider: sale.provider,
        saleAt: sale.sale_at,
        affiliateCode: codeInfo ? codeInfo.codeEntry.code : null,
        metadata: sale.metadata ?? null,
      };
    });

  for (const sale of sales ?? []) {
    const codeInfo = codeLookup.get(sale.affiliate_code_id);
    const entry = codeInfo ? summaryMap.get(codeInfo.affiliateId) : undefined;
    if (!entry) continue;
    const amountValue =
      typeof sale.amount === "string" ? Number(sale.amount) : sale.amount;
    const numericAmount = typeof amountValue === "number" ? amountValue : Number(amountValue) || 0;

    totals.saleCount += 1;
    totals.revenue += numericAmount;

    entry.metrics.saleCount += 1;
    entry.metrics.revenue += numericAmount;

    if (sale.product === "lifetime") {
      totals.lifetimeSales += 1;
      totals.lifetimeRevenue += numericAmount;
      entry.metrics.lifetimeSales += 1;
      entry.metrics.lifetimeRevenue += numericAmount;
    } else {
      totals.monthlySales += 1;
      totals.monthlyRevenue += numericAmount;
      entry.metrics.monthlySales += 1;
      entry.metrics.monthlyRevenue += numericAmount;
    }

    if (codeInfo?.codeEntry) {
      codeInfo.codeEntry.saleCount += 1;
      codeInfo.codeEntry.revenue += numericAmount;
    }
  }

  const affiliatesWithStats = overview.map((entry) => ({
    ...entry,
    paidAmount: entry.paid_amount ?? 0,
    codes: entry.codes,
    metrics: entry.metrics,
  }));

  return NextResponse.json({
    affiliates: affiliatesWithStats,
    totals,
    latestSales,
  });
}

