import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout canceled",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-soft px-4 py-12 text-ink sm:px-6"
    >
      <section className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-2xl shadow-ink/10">
        <div className="h-3 bg-sky" />
        <div className="p-6 text-center sm:p-10 lg:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-soft text-3xl font-black" aria-hidden="true">
            ×
          </div>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-cobalt">
            Checkout canceled safely
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
            Your card was not charged.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-ink/65">
            No session was reserved. You can review the options again and return
            to Stripe whenever you feel ready.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/#pricing" className="button-primary">
              Review sessions
            </Link>
            <Link href="/" className="button-secondary">
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
