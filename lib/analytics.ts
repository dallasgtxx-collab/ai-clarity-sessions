"use client";

declare global { interface Window { gtag?: (...args: unknown[]) => void; clarity?: (...args: unknown[]) => void; } }

export function trackEvent(name: string, parameters: Record<string, string | number | boolean | undefined> = {}) {
  const safe = Object.fromEntries(Object.entries(parameters).filter(([, value]) => value !== undefined));
  window.gtag?.("event", name, safe);
}
