"use client";

import { useEffect } from "react";
import { tracker } from "@/lib/tracker";

type LandingPageTrackerProps = {
  slug: string;
};

const LANDING_SLUG_KEY = "snt_landing_slug";

export function LandingPageTracker({ slug }: LandingPageTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    const normalizedSlug = slug.toLowerCase();
    localStorage.setItem(LANDING_SLUG_KEY, normalizedSlug);
    tracker.setVariant(normalizedSlug);
    tracker.trackEvent("page_view", { slug: normalizedSlug });
  }, [slug]);

  return null;
}
