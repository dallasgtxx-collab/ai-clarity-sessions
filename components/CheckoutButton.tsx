"use client";

import { useState } from "react";
import type { ProductKey } from "@/lib/products";

type CheckoutButtonProps = {
  product: ProductKey;
  label?: string;
  disabled?: boolean;
  disabledMessage?: string;
};

export default function CheckoutButton({
  product,
  label = "Reserve this session",
  disabled = false,
  disabledMessage = "Live registration is opening soon.",
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ?? "Secure checkout could not be opened. Please try again.",
        );
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Secure checkout could not be opened. Please try again.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-auto pt-7">
      <button
        type="button"
        onClick={startCheckout}
        disabled={isLoading || disabled}
        aria-busy={isLoading}
        className="button-primary w-full disabled:cursor-wait disabled:opacity-65"
      >
        {isLoading ? <span className="checkout-spinner" aria-hidden="true" /> : null}
        {isLoading
          ? "Opening secure checkout..."
          : disabled
            ? "Registration opening soon"
            : label}
      </button>

      <p className="mt-3 text-center text-xs font-semibold text-ink/55">
        {disabled ? disabledMessage : "Secure checkout powered by Stripe"}
      </p>

      <p
        aria-live="polite"
        role={error ? "alert" : undefined}
        className="mt-3 min-h-5 text-center text-sm font-bold text-red-600"
      >
        {error}
      </p>
    </div>
  );
}
