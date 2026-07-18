import type { Metadata } from "next";
import Link from "next/link";
import type Stripe from "stripe";
import { verifyCheckout } from "@/lib/fulfillment";
import { siteConfig } from "@/lib/site";
import { formatSessionDate, formatSessionTime, getPrivateClassSession, getRegistrationByCheckoutId } from "@/lib/scheduling";
import type { PrivateClassSession, Registration } from "@/lib/database.types";
import { RegistrationAnalytics } from "@/components/RegistrationAnalytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reservation confirmed",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

function formatAmount(session: Stripe.Checkout.Session): string | null {
  if (session.amount_total === null || !session.currency) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: session.currency.toUpperCase(),
  }).format(session.amount_total / 100);
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;
  let session: Stripe.Checkout.Session | null = null;
  let registration: Registration | null = null;
  let classSession: PrivateClassSession | null = null;
  let verificationMessage = "We could not find a Checkout Session to verify.";

  if (sessionId) {
    try {
      session = await verifyCheckout(sessionId, "success_page");
      registration = await getRegistrationByCheckoutId(sessionId);
      classSession = registration ? await getPrivateClassSession(registration.session_id) : null;
      verificationMessage =
        "Your payment may still be processing. Check your email before trying again.";
    } catch (error) {
      console.error("Unable to verify Stripe Checkout Session:", error);
      verificationMessage =
        "We could not verify this payment right now. Check your email for the Stripe confirmation.";
    }
  }

  const belongsToThisSite =
    session?.metadata?.business === "ai_clarity_sessions";
  const isPaid =
    session?.payment_status === "paid" ||
    session?.payment_status === "no_payment_required";
  const isConfirmed =
    Boolean(session) &&
    belongsToThisSite &&
    session?.status === "complete" &&
    isPaid &&
    session?.metadata?.payment_record_status === "verified";
  const amount = session ? formatAmount(session) : null;
  const productName =
    session?.metadata?.product_name ??
    session?.line_items?.data[0]?.description ??
    "AI Clarity Session";
  const email = session?.customer_details?.email;
  const reference = session ? session.id.slice(-8).toUpperCase() : null;
  const isMembership = session?.metadata?.product_key === "membership";

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-soft px-4 py-12 text-ink sm:px-6"
    >
      <section className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-2xl shadow-ink/10">
        <div className={`h-3 ${isConfirmed ? "bg-mint" : "bg-sky"}`} />
        <div className="p-6 text-center sm:p-10 lg:p-12">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-black ${
              isConfirmed ? "bg-mint" : "bg-sky"
            }`}
            aria-hidden="true"
          >
            {isConfirmed ? "✓" : "…"}
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-cobalt">
            {isConfirmed ? "Payment confirmed" : "Verification in progress"}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
            {isConfirmed
              ? isMembership
                ? "Your membership is active."
                : "Your booking request is in."
              : "Let’s double-check your payment."}
          </h1>

          {isConfirmed && session ? (
            <>
              <RegistrationAnalytics productKey={session.metadata?.product_key || "unknown"} value={session.amount_total ? session.amount_total / 100 : undefined} />
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink/65">
                Thank you. We received payment for <strong className="text-ink">{productName}</strong>.
              </p>

              <dl className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-paper text-left">
                {amount ? (
                  <div className="flex flex-col gap-1 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    <dt className="text-sm font-bold text-ink/55">Total paid</dt>
                    <dd className="font-black">{amount}</dd>
                  </div>
                ) : null}
                <div className="flex flex-col gap-1 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <dt className="text-sm font-bold text-ink/55">Session</dt>
                  <dd className="font-black sm:text-right">{productName}</dd>
                </div>
                {classSession ? <>
                  <div className="flex flex-col gap-1 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><dt className="text-sm font-bold text-ink/55">Date</dt><dd className="font-black sm:text-right">{formatSessionDate(classSession)}</dd></div>
                  <div className="flex flex-col gap-1 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><dt className="text-sm font-bold text-ink/55">Time</dt><dd className="font-black sm:text-right">{formatSessionTime(classSession)} · {classSession.timezone}</dd></div>
                  <div className="flex flex-col gap-1 border-b border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5"><dt className="text-sm font-bold text-ink/55">Location</dt><dd className="font-black sm:text-right">{classSession.location_type === "online" ? "Online — private access sent by email" : [classSession.location_name, classSession.location_address].filter(Boolean).join(", ")}</dd></div>
                </> : null}
                <div className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <dt className="text-sm font-bold text-ink/55">Confirmation email</dt>
                  <dd className="break-all font-black sm:text-right">
                    {email ?? "The address used at checkout"}
                  </dd>
                </div>
                {reference ? (
                  <div className="flex flex-col gap-1 border-t border-ink/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    <dt className="text-sm font-bold text-ink/55">Reference</dt>
                    <dd className="font-black">{reference}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-7 rounded-2xl bg-ink p-5 text-left text-white sm:p-6">
                <p className="font-black text-mint">What happens next</p>
                <p className="mt-2 leading-7 text-white/70">
                  {isMembership ? (
                    <>
                      Keep your Stripe confirmation. Your membership renews
                      monthly until canceled. Membership access details will be
                      sent to the email used at checkout.
                    </>
                  ) : (
                    <>
                      Keep your Stripe confirmation and class email. Add the attached calendar event, bring a charged laptop or tablet, and do not share any private online-class link. Contact us if you need accessibility support or scheduling help.
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-ink/65">
              {verificationMessage}
            </p>
          )}

          <Link href="/" className="button-primary mt-8">
            Return to AI Clarity Sessions
          </Link>
          <p className="mt-5 text-sm font-semibold text-ink/60">
            Need help?{" "}
            <a className="font-black text-cobalt underline" href={`mailto:${siteConfig.supportEmail}`}>
              {siteConfig.supportEmail}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
