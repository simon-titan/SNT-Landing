import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/client";

export type AffiliateCodeEntity = {
  id: string;
  affiliate_id: string;
  code: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
};

export type AffiliateEntity = {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

const MAX_CODE_ATTEMPTS = 5;

function sanitizeCode(candidate?: string | null): string | null {
  if (!candidate) return null;
  const normalized = candidate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return normalized.length >= 3 ? normalized : null;
}

function generateRandomCode() {
  return `AFF-${randomUUID().split("-")[0].toUpperCase()}`;
}

export function buildAffiliateCode(candidate?: string) {
  const sanitized = sanitizeCode(candidate);
  return sanitized ?? generateRandomCode();
}

export async function createAffiliateCode(params: {
  affiliateId: string;
  label?: string | null;
  preferredCode?: string;
  attempts?: number;
}): Promise<AffiliateCodeEntity> {
  const { affiliateId, label = null, preferredCode, attempts = 0 } = params;
  if (attempts >= MAX_CODE_ATTEMPTS) {
    throw new Error("Unable to create unique affiliate code after several attempts.");
  }

  const code = buildAffiliateCode(preferredCode);
  const { data, error } = await supabaseAdmin
    .from("affiliate_codes")
    .insert({
      affiliate_id: affiliateId,
      code,
      label,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return createAffiliateCode({ affiliateId, label, attempts: attempts + 1 });
    }
    throw error;
  }

  if (!data) {
    throw new Error("Affiliate code could not be created.");
  }

  return data as AffiliateCodeEntity;
}

export async function getAffiliateByCode(code: string) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  const { data } = await supabaseAdmin
    .from("affiliate_codes")
    .select("id, affiliate_id, code, label, is_active")
    .eq("code", normalized)
    .maybeSingle();
  return data as AffiliateCodeEntity | null;
}

export async function getAffiliateByAuthId(authUserId: string) {
  const { data } = await supabaseAdmin
    .from("affiliates")
    .select("id, auth_user_id, first_name, last_name, email, created_at")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  return data as AffiliateEntity | null;
}

