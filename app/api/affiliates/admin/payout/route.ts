import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";

type PayoutPayload = {
  affiliateId?: string;
  paidAmount?: number;
};

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminCredentials(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json()) as PayoutPayload;
  if (!body.affiliateId || typeof body.paidAmount !== "number") {
    return NextResponse.json(
      { error: "Affiliate ID and paid amount are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("affiliates")
    .update({ paid_amount: body.paidAmount })
    .eq("id", body.affiliateId)
    .select("paid_amount")
    .maybeSingle();

  if (error) {
    console.error("Payout update failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ paidAmount: data?.paid_amount ?? 0 });
}

