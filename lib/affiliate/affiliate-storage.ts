const AFFILIATE_LOCAL_KEY = "snt_affiliate_code";
const AFFILIATE_SESSION_KEY = "snt_affiliate_code_session";
export const AFFILIATE_QUERY_KEYS = ["aff", "affiliate", "ref", "partner", "utm_affiliate"];

function normalizeAffiliateCode(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.replace(/\s+/g, "").toUpperCase();
}

function readFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem(AFFILIATE_LOCAL_KEY) ||
    sessionStorage.getItem(AFFILIATE_SESSION_KEY) ||
    null
  );
}

export function getPersistedAffiliateCode(): string | null {
  return readFromStorage();
}

export function persistAffiliateCode(value: string | null) {
  const normalized = normalizeAffiliateCode(value);
  if (!normalized) return null;
  if (typeof window === "undefined") return null;
  localStorage.setItem(AFFILIATE_LOCAL_KEY, normalized);
  sessionStorage.setItem(AFFILIATE_SESSION_KEY, normalized);
  return normalized;
}

export function extractAffiliateCodeFromQuery(
  params: URLSearchParams
): string | null {
  for (const key of AFFILIATE_QUERY_KEYS) {
    const maybe = normalizeAffiliateCode(params.get(key));
    if (maybe) return maybe;
  }
  return null;
}

export function clearAffiliateCodeStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AFFILIATE_LOCAL_KEY);
  sessionStorage.removeItem(AFFILIATE_SESSION_KEY);
}

