"use client";

import { useEffect } from "react";
import { tracker } from "@/lib/tracker";

type CheckoutTrackerProps = {
  product: "monthly" | "quarterly" | "annual" | "lifetime";
};

export function CheckoutTracker({ product }: CheckoutTrackerProps) {
  useEffect(() => {
    tracker.trackEvent("checkout_start", { product });
  }, [product]);

  return null;
}
