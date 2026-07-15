import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact AI Clarity Sessions about training, group sessions, or an existing booking.",
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
          Ask about private training, family sessions, church or community
          groups, accessibility needs, or an existing payment.
        </p>
        <a className="button-primary mt-8" href={`mailto:${siteConfig.supportEmail}`}>
          Email {siteConfig.supportEmail}
        </a>
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
