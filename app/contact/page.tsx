import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { TrackedContactLink } from "@/components/AnalyticsEvents";

export const metadata: Metadata = {
  title: "Contact for AI Training in Dallas",
  description: "Contact AI Clarity Sessions about beginner classes, private tutoring, community training, or corporate AI workshops across Dallas–Fort Worth.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="flex min-h-screen items-center justify-center bg-soft px-5 py-14 text-ink">
      <section className="w-full max-w-2xl rounded-[2rem] border border-ink/10 bg-white p-7 shadow-2xl shadow-ink/10 sm:p-12">
        <p className="eyebrow">Talk with a real person</p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
          Questions are welcome.
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink/70">
          Ask about private AI tutoring, family sessions, business workshops,
          church or community groups, accessibility needs, or an existing payment.
        </p>
        <p className="mt-4 leading-7 text-ink/60">
          Service is available by arrangement across Dallas, Oak Cliff, Cockrell Hill,
          Cedar Hill, DeSoto, Duncanville, Lancaster, Grand Prairie, Irving,
          Arlington, Fort Worth, and the wider DFW Metroplex. AI Clarity Sessions
          does not represent a walk-in storefront.
        </p>
        <TrackedContactLink className="button-primary mt-8" href={`mailto:${siteConfig.supportEmail}`}>
          Email {siteConfig.supportEmail}
        </TrackedContactLink>
        <p className="mt-4 text-sm font-bold text-ink/55">
          Normal response time: {siteConfig.schedulingWindow}.
        </p>
        <Link className="mt-8 inline-flex font-black text-cobalt underline" href="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
