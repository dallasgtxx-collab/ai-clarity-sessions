import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Refund and rescheduling policy",
  description: "Refund, cancellation, and rescheduling terms for AI Clarity Sessions.",
};

export default function RefundsPage() {
  return (
    <PolicyPage
      eyebrow="Customer protection"
      title="Refund and rescheduling policy"
      intro="The goal is simple: make scheduling fair, clear, and low-pressure for both the learner and the instructor."
    >
      <section>
        <h2>Flexible-scheduling purchases</h2>
        <p>
          Unless a specific date is displayed at checkout, your purchase covers
          the selected training format and duration—not a particular calendar
          date. We contact you within 2 business days to agree on the date,
          delivery format, location, and preparation details.
        </p>
      </section>

      <section>
        <h2>Before a date is confirmed</h2>
        <p>
          You may request a full refund before a date is mutually confirmed. If
          no workable date is agreed within 14 days of payment, you may also
          request a full refund.
        </p>
      </section>

      <section>
        <h2>After a date is confirmed</h2>
        <ul>
          <li>Cancel at least 48 hours before the session for a full refund.</li>
          <li>Request one free reschedule at least 24 hours before the session.</li>
          <li>Late cancellations and no-shows are reviewed case by case.</li>
        </ul>
      </section>

      <section>
        <h2>Provider changes</h2>
        <p>
          If AI Clarity Sessions must cancel and cannot offer a suitable new
          date, you receive a full refund to the original payment method.
        </p>
      </section>

      <section>
        <h2>How to request help</h2>
        <p>
          Include the purchaser name, checkout email, and the last eight
          characters of the confirmation reference. Do not send card numbers or
          other sensitive payment information.
        </p>
      </section>
    </PolicyPage>
  );
}
