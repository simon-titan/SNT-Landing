import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { createAffiliateCode } from "@/lib/affiliates/service";
import { requireAdminCredentials } from "@/lib/affiliates/admin-auth";

type CreateAffiliatePayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  initialCode?: string;
  initialLabel?: string;
};

export async function POST(request: NextRequest) {
  const unauthorized = requireAdminCredentials(request);
  if (unauthorized) return unauthorized;

  const body = (await request.json()) as CreateAffiliatePayload;
  if (!body.email || !body.password || !body.firstName || !body.lastName) {
    return NextResponse.json(
      { error: "Missing required affiliate fields." },
      { status: 400 }
    );
  }

  if (body.password.length < 8) {
    return NextResponse.json(
      { error: "Password should be at least 8 characters." },
      { status: 400 }
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      firstName: body.firstName,
      lastName: body.lastName,
    },
  });

  if (userError || !user) {
    console.error("[affiliate][create] supabase user error", userError);
    return NextResponse.json(
      { error: userError?.message ?? "Unable to create auth user." },
      { status: 400 }
    );
  }

  const { data: affiliate, error: affiliateError } = await supabaseAdmin
    .from("affiliates")
    .insert({
      auth_user_id: user.id,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
    })
    .select("id, first_name, last_name, email, created_at")
    .maybeSingle();

  if (affiliateError || !affiliate) {
    console.error("[affiliate][create] record error", affiliateError);
    return NextResponse.json(
      { error: affiliateError?.message ?? "Unable to persist affiliate." },
      { status: 500 }
    );
  }

  const code = await createAffiliateCode({
    affiliateId: affiliate.id,
    label: body.initialLabel ?? "Primary Link",
    preferredCode: body.initialCode,
  });

  return NextResponse.json({ affiliate: affiliate as typeof affiliate, code });
}

