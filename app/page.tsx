import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { ExperienceLayer } from "@/components/ExperienceLayer";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { SessionRecommender } from "@/components/SessionRecommender";
import { products, type ProductKey } from "@/lib/products";
import { isCheckoutEnabled, siteConfig } from "@/lib/site";

type CheckoutProduct = {
  title: string;
  price: string;
  productKey: ProductKey;
  duration: string;
  description: string;
  featured?: boolean;
  recurring?: boolean;
};

const audiences = [
  "Beginners who feel left behind",
  "Parents and families",
  "Teenagers and students",
  "Artists and content creators",
  "Business owners and entrepreneurs",
  "Church and community groups",
  "Seniors learning new technology",
  "Anyone curious or skeptical about AI",
];

const lessons = [
  "What artificial intelligence actually is",
  "How to use ChatGPT correctly",
  "How AI can help with work and business",
  "How to create images, music, videos, and documents",
  "How to save time with everyday tasks",
  "How to recognize scams and unsafe information",
];

const classOptions: CheckoutProduct[] = [
  {
    title: "Beginner Session",
    price: products.beginner.displayPrice,
    productKey: "beginner",
    duration: "2 hours",
    description:
      "A welcoming introduction for people who are completely new to artificial intelligence.",
  },
  {
    title: "Practical Workshop",
    price: products.workshop.displayPrice,
    productKey: "workshop",
    duration: "Half day",
    description:
      "Hands-on guidance for using AI in everyday life, work, school, content creation, and business.",
    featured: true,
  },
  {
    title: "AI Clarity Bootcamp",
    price: products.bootcamp.displayPrice,
    productKey: "bootcamp",
    duration: "Full day",
    description:
      "A complete learning experience covering AI tools, practical projects, safety, and strategy.",
  },
];

const membership: CheckoutProduct = {
  title: "AI Clarity Daily Access Membership",
  price: products.membership.displayPrice,
  productKey: "membership",
  duration: "Billed monthly",
  description:
    "Ongoing AI tips, educational resources, updates, and member benefits. Renews automatically until canceled.",
  recurring: true,
};

const frequentlyAskedQuestions = [
  {
    question: "Do I need experience with AI?",
    answer:
      "No. These sessions are designed for complete beginners and people who may feel uncomfortable with technology.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring your phone or laptop and its charger. A pen and notebook are optional.",
  },
  {
    question: "Can teenagers or children attend?",
    answer:
      "Yes. Family-friendly and age-appropriate sessions can be made available.",
  },
  {
    question: "Will everything be explained slowly?",
    answer:
      "Yes. Questions are encouraged, and every step is explained in plain English without judgment.",
  },
  {
    question: "How does payment work?",
    answer:
      "Payments are securely processed through Stripe Checkout. Available methods may include credit cards, debit cards, Apple Pay, Google Pay, and Link, depending on the customer's device and Stripe settings.",
  },
];

export default function Home() {
  const checkoutEnabled = isCheckoutEnabled();

  function checkoutButton(product: CheckoutProduct, label: string) {
    return (
      <CheckoutButton
        product={product.productKey}
        label={label}
        disabled={!checkoutEnabled}
        disabledMessage="Secure registration is opening soon."
      />
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-slate-950 text-white">
      <ExperienceLayer />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xl font-black tracking-tight">
              AI Clarity Sessions
            </p>
            <p className="text-xs text-white/60">
              AI made easy for everyday people
            </p>
          </div>

          <a
            href="#pricing"
            className="magnetic-cta rounded-full px-5 py-3 text-sm font-black text-slate-950"
          >
            Reserve My Seat
          </a>
        </div>
      </header>

      <section className="hero-live relative overflow-hidden">
        <div className="aurora aurora-one" aria-hidden="true" />
        <div className="aurora aurora-two" aria-hidden="true" />
        <div className="hero-mesh absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:py-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
              <span className="mr-2 inline-block animate-pulse" aria-hidden="true">●</span>
              No coding. No experience. No judgment.
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.055em] sm:text-7xl">
              AI is moving fast.
              <span className="animated-gradient-text block">
                You can move with it.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
              Turn curiosity into confidence with a fun, hands-on experience
              built for everyday people, creators, families, and businesses.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#pricing"
              className="magnetic-cta w-full rounded-2xl px-8 py-4 text-center text-lg font-black text-slate-950 sm:w-auto"
            >
              Choose My Experience →
            </a>

            <a
              href="#demo"
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-center text-lg font-bold backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
            >
              Try the AI Demo
            </a>
          </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white/55">
              <span>✓ Plain English</span>
              <span>✓ Real practice</span>
              <span>✓ Secure checkout</span>
            </div>
          </div>

          <div className="hero-experience-card">
            <div className="experience-orbit" aria-hidden="true">AI</div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
              Your confidence upgrade
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              From “I don’t get it” to “watch what I can do.”
            </h2>
            <div className="mt-7 grid gap-3">
              {["Ask smarter questions", "Create useful content", "Save hours every week"].map((item, index) => (
                <div key={item} className="experience-row">
                  <span className="experience-number">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-lime-300/20 bg-lime-300/10 p-4 text-sm font-bold text-lime-100">
              Bring your phone or laptop. Leave with skills you can use immediately.
            </div>
          </div>
        </div>
      </section>

      <div className="marquee-shell" aria-label="AI Clarity Sessions learning benefits">
        <div className="marquee-track">
          <span>CREATE SMARTER</span><span>•</span><span>SAVE TIME</span><span>•</span>
          <span>GROW CONFIDENCE</span><span>•</span><span>BUILD YOUR FUTURE</span><span>•</span>
          <span aria-hidden="true">CREATE SMARTER</span><span aria-hidden="true">•</span>
          <span aria-hidden="true">SAVE TIME</span><span aria-hidden="true">•</span>
          <span aria-hidden="true">GROW CONFIDENCE</span><span aria-hidden="true">•</span>
          <span aria-hidden="true">BUILD YOUR FUTURE</span><span aria-hidden="true">•</span>
        </div>
      </div>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-center sm:grid-cols-3">
          <div>
            <p className="animated-gradient-text text-3xl font-black">Plain English</p>
            <p className="mt-2 text-white/60">
              No confusing technology language
            </p>
          </div>

          <div>
            <p className="animated-gradient-text text-3xl font-black">Hands-On</p>
            <p className="mt-2 text-white/60">
              Learn by actually using the tools
            </p>
          </div>

          <div>
            <p className="animated-gradient-text text-3xl font-black">Real Skills</p>
            <p className="mt-2 text-white/60">
              Leave knowing what to do next
            </p>
          </div>
        </div>
      </section>

      <section id="learn" className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-cyan-300">
              What you will learn
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              AI explained for real people.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/65">
              This is not a confusing technical lecture. You will watch,
              practice, ask questions, and receive clear step-by-step guidance.
            </p>
          </div>

          <div className="grid gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson}
                className="reveal-section service-card flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 font-black text-slate-950">
                  ✓
                </div>

                <p className="leading-7 text-white/80">{lesson}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InteractiveDemo />

      <SessionRecommender />

      <section className="bg-white/[0.03]">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.25em] text-cyan-300">
              Who this is for
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              Nobody gets left behind.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="reveal-section audience-card rounded-2xl border border-white/10 bg-slate-900 p-6 text-center font-bold text-white/80"
              >
                {audience}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-5 py-24">
        <div className="text-center">
          <p className="font-bold uppercase tracking-[0.25em] text-cyan-300">
            Choose your experience
          </p>

          <h2 className="mt-4 text-4xl font-black sm:text-5xl">
            Simple pricing. Real value.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/60">
            Secure checkout powered by Stripe. Your seat is confirmed after
            successful payment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {classOptions.map((classOption) => (
            <article
              key={classOption.title}
              className={`price-card-live rounded-3xl border p-7 ${
                classOption.featured
                  ? "border-cyan-300 bg-cyan-300/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {classOption.featured && (
                <p className="mb-5 inline-flex rounded-full bg-cyan-300 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-950">
                  Most Popular
                </p>
              )}

              <h3 className="text-2xl font-black">{classOption.title}</h3>

              <div className="mt-5 flex items-end gap-2">
                <p className="text-5xl font-black">{classOption.price}</p>
                <p className="pb-1 text-white/50">per person</p>
              </div>

              <p className="mt-2 font-bold text-cyan-200">
                {classOption.duration}
              </p>

              <p className="mt-5 leading-7 text-white/60">
                {classOption.description}
              </p>

              {checkoutButton(classOption, "Reserve This Class")}
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-4xl px-5 py-24">
          <article className="rounded-3xl border border-cyan-300/40 bg-cyan-300/10 p-8 sm:p-10">
            <p className="font-bold uppercase tracking-[0.2em] text-cyan-300">
              Optional monthly membership
            </p>

            <div className="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-3xl font-black">{membership.title}</h2>

                <p className="mt-4 max-w-2xl leading-7 text-white/65">
                  {membership.description}
                </p>

                <p className="mt-4 text-sm font-bold text-white/55">
                  This is separate from your class purchase. It automatically
                  renews monthly until canceled.
                </p>
              </div>

              <div className="min-w-56">
                <p className="text-5xl font-black">{membership.price}</p>

                {checkoutButton(membership, "Join Membership")}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-cyan-300 text-slate-950">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            You do not have to figure AI out alone.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium text-slate-950/70">
            Come curious. Bring your questions. Leave confident enough to use
            AI in your everyday life.
          </p>

          <a
            href="#pricing"
            className="mt-8 inline-flex rounded-2xl bg-slate-950 px-8 py-4 text-lg font-black text-white"
          >
            View Available Classes
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24">
        <h2 className="text-center text-4xl font-black">
          Questions people usually ask
        </h2>

        <div className="mt-10 space-y-4">
          {frequentlyAskedQuestions.map((item) => (
            <details
              key={item.question}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <summary className="cursor-pointer font-black">
                {item.question}
              </summary>

              <p className="mt-4 leading-7 text-white/65">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-center text-sm text-white/45">
        <p className="font-bold text-white">AI Clarity Sessions</p>
        <p className="mt-2">
          Practical AI education presented clearly, safely, and personally.
        </p>
        <nav aria-label="Footer" className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href="/contact" className="underline hover:text-white">Contact</Link>
          <Link href="/privacy" className="underline hover:text-white">Privacy</Link>
          <Link href="/terms" className="underline hover:text-white">Terms</Link>
          <Link href="/refunds" className="underline hover:text-white">Refunds</Link>
        </nav>
        <a className="mt-4 inline-block underline hover:text-white" href={`mailto:${siteConfig.supportEmail}`}>
          {siteConfig.supportEmail}
        </a>
      </footer>
    </main>
  );
}
