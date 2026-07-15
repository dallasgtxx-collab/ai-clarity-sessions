import Link from "next/link";
import { siteConfig } from "@/lib/site";

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function PolicyPage({
  eyebrow,
  title,
  intro,
  children,
}: PolicyPageProps) {
  return (
    <main id="main-content" className="min-h-screen bg-paper text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="site-container flex min-h-18 items-center justify-between gap-4 py-4">
          <Link className="font-black" href="/">
            AI Clarity Sessions
          </Link>
          <Link className="button-small" href="/#pricing">
            View sessions
          </Link>
        </div>
      </header>

      <article className="site-container max-w-4xl py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-ink/70">
          {intro}
        </p>
        <p className="mt-4 text-sm font-bold text-ink/55">
          Effective {siteConfig.policyEffectiveDate}
        </p>

        <div className="policy-copy mt-12">{children}</div>

        <div className="mt-12 rounded-2xl bg-ink p-6 text-white">
          <h2 className="text-xl font-black text-mint">Questions about this policy?</h2>
          <p className="mt-2 leading-7 text-white/70">
            Email{" "}
            <a className="font-black text-white underline" href={`mailto:${siteConfig.supportEmail}`}>
              {siteConfig.supportEmail}
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
