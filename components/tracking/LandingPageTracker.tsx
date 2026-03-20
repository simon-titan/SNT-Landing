"use client";

import { useEffect } from "react";

type LandingPageTrackerProps = {
  slug: string;
};

const SESSION_KEY = "snt_landing_session_id";
const LANDING_SLUG_KEY = "snt_landing_slug";

const ensureSessionId = () => {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  sessionStorage.setItem(SESSION_KEY, generated);
  return generated;
};

export function LandingPageTracker({ slug }: LandingPageTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    const normalizedSlug = slug.toLowerCase();
    const sessionId = ensureSessionId();
    localStorage.setItem(LANDING_SLUG_KEY, normalizedSlug);

    void fetch("/api/tracking/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: normalizedSlug,
        sessionId,
        referrer: document.referrer || null,
      }),
    });
  }, [slug]);

  return null;
}
