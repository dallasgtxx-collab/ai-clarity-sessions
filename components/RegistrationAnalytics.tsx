"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function RegistrationAnalytics({ productKey, value }: { productKey: string; value?: number }) {
  useEffect(() => {
    const key = `registration-tracked:${productKey}:${value ?? "unknown"}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");
    trackEvent("registration_complete", { product_key: productKey, value, currency: "USD" });
  }, [productKey, value]);
  return null;
}
