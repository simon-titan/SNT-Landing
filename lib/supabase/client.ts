import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing Supabase URL (set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL) for affiliate helpers"
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing Supabase anon key (set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY)"
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing Supabase service role key (set SUPABASE_SERVICE_ROLE_KEY)");
}

export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, storage: undefined },
  global: {
    headers: {
      "x-application-name": "snt-affiliate-app",
    },
  },
});

export function getAffiliateAdminSecret(): string {
  return (
    process.env.NEXT_PUBLIC_AFFILIATE_ADMIN_SECRET ??
    process.env.AFFILIATE_ADMIN_SECRET ??
    ""
  );
}

