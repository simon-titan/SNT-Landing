import { NextRequest, NextResponse } from "next/server";
import { getCurrentPricing } from "@/config/pricing-config";
import { supabaseAdmin } from "@/lib/supabase/client";

type SalePayload = {
  landingSlug?: string;
  product?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  transactionId?: string | null;
  saleDate?: string;
};

const normalizeProduct = (value?: string) => {
  const normalized = value?.toLowerCase().trim();
  if (normalized === "quarterly") return "quarterly";
  if (normalized === "annual") return "annual";
  if (normalized === "lifetime") return "lifetime";
  return "monthly";
};

const normalizeProvider = (value?: string) => {
  const normalized = value?.toLowerCase().trim();
  return normalized === "paypal" ? "paypal" : "outseta";
};

const getDefaultAmount = (product: "monthly" | "quarterly" | "annual" | "lifetime") => {
  const pricing = getCurrentPricing();
  if (product === "quarterly") return pricing.quarterly.price;
  if (product === "annual") return pricing.annual.price;
  if (product === "lifetime") return pricing.lifetime.price;
  return pricing.monthly.price;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SalePayload;
    const landingSlug = body.landingSlug?.trim().toLowerCase();

    if (!landingSlug) {
      return NextResponse.json({ error: "landingSlug is required." }, { status: 400 });
    }

    const { data: version, error: versionError } = await supabaseAdmin
      .from("landing_page_versions")
      .select("id")
      .eq("slug", landingSlug)
      .single();

    if (versionError || !version) {
      return NextResponse.json(
        { error: "Landing page version not found." },
        { status: 404 }
      );
    }

    const product = normalizeProduct(body.product);
    const provider = normalizeProvider(body.provider);
    const amount = typeof body.amount === "number" ? body.amount : getDefaultAmount(product);
    const saleAt =
      body.saleDate && !Number.isNaN(new Date(body.saleDate).getTime())
        ? new Date(body.saleDate).toISOString()
        : new Date().toISOString();

    const { error } = await supabaseAdmin.from("landing_page_sales").insert({
      landing_page_version_id: version.id,
      product,
      provider,
      amount,
      currency: body.currency ?? "EUR",
      transaction_id: body.transactionId ?? null,
      sale_at: saleAt,
    });

    if (error) {
      console.error("Landing page sale tracking error:", error);
      return NextResponse.json({ error: "Unable to track sale." }, { status: 500 });
    }

    // Dual-Write: auch in neue Analytics-Tabellen schreiben
    const amountCents = Math.round(amount * 100);
    const sessionId = request.cookies.get("snt_session")?.value || null;

    await supabaseAdmin
      .from("sales_events")
      .insert({
        session_id: sessionId,
        page_variant: landingSlug,
        plan_name: product,
        product,
        amount_cents: amountCents,
        currency: body.currency ?? "EUR",
        provider,
        transaction_id: body.transactionId ?? null,
        created_at: saleAt,
      })
      .then(({ error: saleErr }) => {
        if (saleErr) console.error("[tracking.sale] sales_events insert error:", saleErr.message);
      });

    const today = new Date(saleAt).toISOString().split("T")[0];
    await supabaseAdmin
      .from("page_stats_daily")
      .upsert(
        {
          date: today,
          page_variant: landingSlug,
          conversions: 1,
          revenue_cents: amountCents,
        },
        { onConflict: "date,page_variant" }
      )
      .then(({ error: statsErr }) => {
        if (statsErr) console.error("[tracking.sale] page_stats_daily upsert error:", statsErr.message);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[tracking.sale] unexpected error", error);
    return NextResponse.json({ error: "Unable to track sale." }, { status: 500 });
  }
}
