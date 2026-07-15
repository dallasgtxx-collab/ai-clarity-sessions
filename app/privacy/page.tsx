import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How AI Clarity Sessions handles visitor and customer information.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Your information"
      title="Privacy policy"
      intro="This policy explains what information is used to answer questions, process payments, and schedule training."
    >
      <section>
        <h2>Information we collect</h2>
        <p>
          We may receive your name, email address, phone number, selected
          training option, payment status, messages you send, and basic website
          activity such as pages visited and technical logs.
        </p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          Checkout is hosted by Stripe. AI Clarity Sessions does not receive or
          store your full card number. Stripe processes payment information
          under its own privacy terms and shares the details needed to confirm
          payment and provide the service.
        </p>
      </section>

      <section>
        <h2>How information is used</h2>
        <ul>
          <li>Process and verify payments.</li>
          <li>Schedule, deliver, and support your training.</li>
          <li>Send service-related confirmations and updates.</li>
          <li>Prevent fraud, troubleshoot problems, and meet legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>Sharing and selling</h2>
        <p>
          We do not sell personal information. Information is shared only with
          service providers needed to operate the site and payments, when you
          ask us to share it, or when required by law.
        </p>
      </section>

      <section>
        <h2>Children and families</h2>
        <p>
          A parent or legal guardian must make the purchase for a minor. This
          website is not designed to collect information directly from children
          under 13.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You may ask to review, correct, or delete information we control,
          subject to payment, fraud-prevention, tax, and other legal retention
          requirements.
        </p>
      </section>
    </PolicyPage>
  );
}
