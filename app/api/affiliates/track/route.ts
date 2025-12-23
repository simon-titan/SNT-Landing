import { NextRequest, NextResponse } from "next/server";
import { getCurrentPricing } from "@/config/pricing-config";
import { getAffiliateByCode } from "@/lib/affiliates/service";
import { supabaseAdmin } from "@/lib/supabase/client";

type TrackPayload = {
  affiliateCode?: string;
  product?: string;
  provider?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  saleDate?: string;
};

const sanitizeProduct = (value?: string) => {
  if (value === "lifetime") return "lifetime";
  if (value === "monthly") return "monthly";
  return "monthly";
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackPayload;
    const rawCode = body.affiliateCode?.trim();
    if (!rawCode) {
      return NextResponse.json({ error: "Affiliate code is required." }, { status: 400 });
    }

    const affiliateCode = rawCode.toUpperCase();
    const affiliateCodeRecord = await getAffiliateByCode(affiliateCode);
    if (!affiliateCodeRecord || !affiliateCodeRecord.is_active) {
      return NextResponse.json({ error: "Affiliate code not found." }, { status: 404 });
    }

    const product = sanitizeProduct(body.product);
    const pricing = getCurrentPricing();
    const defaultAmount =
      product === "lifetime" ? pricing.lifetime.price : pricing.monthly.price;
    const amount = typeof body.amount === "number" ? body.amount : defaultAmount;

    const saleTimestamp =
      body.saleDate && !Number.isNaN(new Date(body.saleDate).getTime())
        ? new Date(body.saleDate)
        : new Date();

    const metadata =
      typeof body.metadata === "object" && body.metadata !== null
        ? body.metadata
        : {};

    const { error } = await supabaseAdmin.from("affiliate_sales").insert({
      affiliate_code_id: affiliateCodeRecord.id,
      product,
      provider: body.provider ?? "outseta",
      amount,
      currency: body.currency ?? "EUR",
      sale_at: saleTimestamp.toISOString(),
      metadata,
    });

    if (error) {
      console.error("Affiliate tracking error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[affiliate.track] unexpected error", error);
    return NextResponse.json(
      { error: "Unable to track sale at the moment." },
      { status: 500 }
    );
  }
}

