import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms for purchasing and attending AI Clarity Sessions training.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Clear expectations"
      title="Terms of service"
      intro="These terms describe the training service, payment process, scheduling, and responsible use expectations."
    >
      <section>
        <h2>The service</h2>
        <p>
          AI Clarity Sessions provides educational training about artificial
          intelligence tools. The selected product description and duration
          define what you purchase. Unless checkout names a specific date, the
          purchase uses flexible scheduling confirmed after payment.
        </p>
      </section>

      <section>
        <h2>Payment and scheduling</h2>
        <p>
          Payments are processed by Stripe. We use the contact details provided
          at checkout to schedule the session. A purchase is not a reservation
          for a particular date, venue, or online room until those details are
          confirmed in writing.
        </p>
      </section>

      <section>
        <h2>Cancellations and refunds</h2>
        <p>
          The separate refund and rescheduling policy is part of these terms.
          It includes a full-refund option before a flexible-scheduling date is
          confirmed and protections if the provider must cancel.
        </p>
      </section>

      <section>
        <h2>Educational limits</h2>
        <p>
          Training is educational and does not replace legal, medical,
          financial, cybersecurity, or other licensed professional advice. AI
          can be inaccurate. Participants remain responsible for reviewing
          outputs and deciding how to use them.
        </p>
      </section>

      <section>
        <h2>Safe participation</h2>
        <p>
          Participants must not use the session to create unlawful, harmful, or
          abusive material; invade privacy; infringe intellectual property; or
          expose another person&apos;s confidential information. A parent or legal
          guardian must book for a minor.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          Material changes apply only after an updated effective date is posted.
          The terms shown when you purchase govern that purchase unless a change
          is required by law or is more favorable to you.
        </p>
      </section>
    </PolicyPage>
  );
}
