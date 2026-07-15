import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-soft px-5 py-12 text-center text-ink"
    >
      <section className="max-w-xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cobalt">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">
          This page needs a little clarity.
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink/65">
          The address may have changed, but your way back is simple.
        </p>
        <Link href="/" className="button-primary mt-8">
          Go to the homepage
        </Link>
      </section>
    </main>
  );
}
