"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AFFILIATE_QUERY_KEYS,
  extractAffiliateCodeFromQuery,
  persistAffiliateCode,
} from "@/lib/affiliate/affiliate-storage";

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const code = extractAffiliateCodeFromQuery(searchParams);
    if (!code) return;

    const persisted = persistAffiliateCode(code);
    if (!persisted) return;

    const currentUrl = new URL(window.location.href);
    let changed = false;

    for (const key of AFFILIATE_QUERY_KEYS) {
      if (currentUrl.searchParams.has(key)) {
        currentUrl.searchParams.delete(key);
        changed = true;
      }
    }

    if (changed) {
      window.history.replaceState(null, "", `${pathname}${currentUrl.search}`);
    }
  }, [searchParams, pathname]);

  return null;
}

