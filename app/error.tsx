"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="error-screen" id="main-content">
      <section>
        <span aria-hidden="true">AC</span>
        <p>Something interrupted the session</p>
        <h1>Let’s get you back to clarity.</h1>
        <p>The page could not finish loading. Your payment information has not been changed.</p>
        <div><button type="button" className="button-primary" onClick={reset}>Try again</button><Link className="button-secondary" href="/">Return home</Link></div>
      </section>
    </main>
  );
}
