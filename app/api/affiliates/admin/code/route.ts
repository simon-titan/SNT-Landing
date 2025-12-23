import { NextRequest, NextResponse } from "next/server";
import { createAffiliateCode } from "@/lib/affiliates/service";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";

type CreateCodePayload = {
  affiliateId?: string;
  label?: string;
  code?: string;
};

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminCredentials(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json()) as CreateCodePayload;
  if (!body.affiliateId) {
    return NextResponse.json(
      { error: "Affiliate ID is required to create a link." },
      { status: 400 }
    );
  }

  try {
    const affiliateCode = await createAffiliateCode({
      affiliateId: body.affiliateId,
      label: body.label ?? "Additional Link",
      preferredCode: body.code,
    });

    return NextResponse.json({ code: affiliateCode });
  } catch (error) {
    console.error("[affiliate][code] creation error", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Unable to generate link." },
      { status: 500 }
    );
  }
}

