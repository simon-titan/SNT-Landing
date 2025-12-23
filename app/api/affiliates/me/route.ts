import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing authentication token." }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    console.error("Affiliate portal auth failed", error);
    return NextResponse.json({ error: "Invalid affiliate session." }, { status: 401 });
  }

  const { data: affiliate } = await supabaseAdmin
    .from("affiliates")
    .select("id, first_name, last_name, email, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!affiliate) {
    return NextResponse.json({ error: "Affiliate profile not found." }, { status: 404 });
  }

  const { data: codes } = await supabaseAdmin
    .from("affiliate_codes")
    .select("id, code, label, is_active, created_at")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false });

  const codeIds = (codes ?? []).map((entry) => entry.id);
  let sales: any[] = [];
  if (codeIds.length > 0) {
    const salesResult = await supabaseAdmin
      .from("affiliate_sales")
      .select("id, amount, currency, provider, product, sale_at, metadata, affiliate_code_id")
      .in("affiliate_code_id", codeIds)
      .order("sale_at", { ascending: false })
      .limit(50);
    if (salesResult.error) {
      console.error("Affiliate sales read error", salesResult.error);
    } else {
      sales = salesResult.data ?? [];
    }
  }

  const codeMap = new Map<string, string>();
  (codes ?? []).forEach((entry) => {
    codeMap.set(entry.id, entry.code);
  });

  const metrics = {
    saleCount: 0,
    revenue: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    lifetimeSales: 0,
    lifetimeRevenue: 0,
  };

  const normalizedSales = (sales ?? []).map((sale) => {
    const amount =
      typeof sale.amount === "string" ? Number(sale.amount) : sale.amount;
    const numericAmount =
      typeof amount === "number" ? amount : Number(amount) || 0;

    metrics.saleCount += 1;
    metrics.revenue += numericAmount;
    if (sale.product === "lifetime") {
      metrics.lifetimeSales += 1;
      metrics.lifetimeRevenue += numericAmount;
    } else {
      metrics.monthlySales += 1;
      metrics.monthlyRevenue += numericAmount;
    }

    return {
      id: sale.id,
      amount: numericAmount,
      currency: sale.currency,
      provider: sale.provider,
      product: sale.product,
      saleAt: sale.sale_at,
      affiliateCode: codeMap.get(sale.affiliate_code_id) ?? null,
      metadata: sale.metadata ?? null,
    };
  });

  return NextResponse.json({
    affiliate,
    codes: codes ?? [],
    metrics,
    recentSales: normalizedSales,
  });
}

