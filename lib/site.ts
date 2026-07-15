export const siteConfig = {
  name: "AI Clarity Sessions",
  domain: "aiclaritysessions.com",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
    "hello@aiclaritysessions.com",
  schedulingWindow: "within 2 business days",
  policyEffectiveDate: "July 15, 2026",
} as const;

export function isCheckoutEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  return process.env.ENABLE_LIVE_CHECKOUT === "true";
}

export function isStripeTestMode(): boolean {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? false;
}
