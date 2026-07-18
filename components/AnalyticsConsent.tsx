"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Consent = "accepted" | "rejected" | null;
const key = "ai-clarity-analytics-consent";

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  useEffect(() => {
    const saved = localStorage.getItem(key) as Consent;
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
    else setVisible(true);
    const manage = () => setVisible(true);
    window.addEventListener("manage-analytics-consent", manage);
    return () => window.removeEventListener("manage-analytics-consent", manage);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    if (gaId && !document.querySelector(`script[data-ga4="${gaId}"]`)) {
      window.gtag = function gtag(...args: unknown[]) { (window as unknown as { dataLayer: unknown[] }).dataLayer = (window as unknown as { dataLayer: unknown[] }).dataLayer || []; (window as unknown as { dataLayer: unknown[] }).dataLayer.push(args); };
      window.gtag("js", new Date());
      window.gtag("config", gaId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = document.createElement("script"); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`; script.dataset.ga4 = gaId; document.head.appendChild(script);
    }
    if (clarityId && !document.querySelector(`script[data-clarity="${clarityId}"]`)) {
      const queue = function clarity(...args: unknown[]) { (queue as unknown as { q: unknown[] }).q = (queue as unknown as { q: unknown[] }).q || []; (queue as unknown as { q: unknown[] }).q.push(args); };
      window.clarity = queue;
      const script = document.createElement("script"); script.async = true; script.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`; script.dataset.clarity = clarityId; document.head.appendChild(script);
    }
  }, [consent, gaId, clarityId]);

  useEffect(() => {
    if (consent !== "accepted" || !gaId) return;
    const query = searchParams.toString();
    window.gtag?.("event", "page_view", { page_path: query ? `${pathname}?${query}` : pathname, page_location: window.location.href, page_title: document.title });
  }, [pathname, searchParams, consent, gaId]);

  function choose(value: Exclude<Consent, null>) { localStorage.setItem(key, value); setConsent(value); setVisible(false); if (value === "rejected") window.clarity?.("consent", false); }
  if (!visible) return null;
  return <aside className="consent-banner" aria-label="Analytics preferences" role="dialog" aria-modal="false"><div><strong>Choose your analytics preference</strong><p>Essential site and Stripe functions always work. With permission, privacy-conscious analytics help us understand which educational content is useful. No contact or payment details are sent.</p></div><div className="consent-actions"><button onClick={() => choose("accepted")}>Accept analytics</button><button onClick={() => choose("rejected")}>Reject nonessential analytics</button></div></aside>;
}

export function ManageConsentButton() { return <button className="manage-consent" type="button" onClick={() => window.dispatchEvent(new Event("manage-analytics-consent"))}>Manage analytics preference</button>; }
