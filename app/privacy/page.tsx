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
      intro="This policy explains how information is used to answer questions, process payments, schedule training, send service messages, understand optional website analytics, and moderate student reviews."
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
          <li>Send class reminders and schedule or cancellation notices.</li>
          <li>Moderate reviews and optional photos submitted with publication consent.</li>
          <li>Prevent fraud, troubleshoot problems, and meet legal obligations.</li>
        </ul>
      </section>

      <section><h2>Scheduling, records, and email</h2><p>Supabase stores class schedules, seat availability, registration records, reminder status, and review submissions. Resend delivers registration confirmations, reminders, and operational notices. Online meeting links and attendee contact information are restricted to operational access and authorized communications.</p></section>

      <section><h2>Optional analytics and session insights</h2><p>With your permission, Google Analytics 4 may collect page and interaction measurements, and Microsoft Clarity may collect privacy-masked interaction and session information. These services are not loaded after you reject nonessential analytics. We configure analytics events not to include names, email addresses, phone numbers, payment identifiers, or review-form contents. You can reopen analytics preferences from the site footer.</p></section>

      <section><h2>Reviews and student photos</h2><p>Review submissions remain pending until manually moderated. A review or photo is eligible for publication only when the submitter explicitly consents and an administrator approves it. Photos are optional, stored privately while pending, and not published automatically. You may contact us to request removal of content we control.</p></section>

      <section>
        <h2>Sharing and selling</h2>
        <p>
          We do not sell personal information. Information is shared only with
          service providers needed to operate the site, registration, email, optional analytics, and payments, when you
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
