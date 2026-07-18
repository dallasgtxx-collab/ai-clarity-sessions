import type Stripe from "stripe";
import {
  getStripePriceId,
  isProductKey,
  products,
} from "@/lib/products";
import { getStripe } from "@/lib/stripe";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase-server";
import { getPrivateClassSession, getRegistrationByCheckoutId } from "@/lib/scheduling";
import { sendClassEmail } from "@/lib/email";

type FulfillmentSource = "success_page" | "webhook";

export async function verifyCheckout(
  checkoutSessionId: string,
  source: FulfillmentSource,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
    expand: ["line_items"],
  });

  const isPaid =
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required";

  if (session.status !== "complete" || !isPaid) {
    return session;
  }

  if (session.metadata?.business !== "ai_clarity_sessions") {
    throw new Error("Checkout Session does not belong to this business.");
  }

  const productKey = session.metadata.product_key;

  if (!isProductKey(productKey)) {
    throw new Error("Checkout Session has an invalid product.");
  }

  const product = products[productKey];
  const expectedPriceId = getStripePriceId(product);
  const lineItem = session.line_items?.data[0];
  const actualPriceId = lineItem?.price?.id;

  if (
    !expectedPriceId ||
    actualPriceId !== expectedPriceId ||
    session.currency !== product.currency ||
    session.amount_subtotal !== product.expectedAmount ||
    session.mode !== product.mode
  ) {
    throw new Error("Checkout Session failed product verification.");
  }

  const classSessionId = session.metadata.class_session_id;

  if (classSessionId && product.mode === "payment" && isSupabaseConfigured()) {
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const { error } = await getSupabaseServiceClient().rpc("register_paid_checkout", {
      p_session_id: classSessionId,
      p_product_key: product.key,
      p_checkout_session_id: session.id,
      p_payment_intent_id: paymentIntentId ?? "",
      p_customer_id: customerId ?? "",
      p_customer_name: session.customer_details?.name || "Student",
      p_customer_email: session.customer_details?.email || "",
      p_customer_phone: session.customer_details?.phone || "",
      p_quantity: 1,
      p_payment_status: session.payment_status,
    });
    if (error) throw new Error(`Class registration failed: ${error.message}`);

    const registration = await getRegistrationByCheckoutId(session.id);
    const classSession = await getPrivateClassSession(classSessionId);
    if (registration?.registration_status === "requires_refund") {
      return stripe.checkout.sessions.update(session.id, {
        metadata: {
          payment_record_status: "attention_required",
          booking_status: "requires_refund",
          verification_source: source,
        },
      });
    }
    if (registration && classSession && !registration.confirmation_sent_at) {
      const confirmation = await sendClassEmail("confirmation", registration, classSession);
      if (!confirmation.skipped) {
        await getSupabaseServiceClient().from("registrations").update({ confirmation_sent_at: new Date().toISOString() }).eq("id", registration.id).is("confirmation_sent_at", null);
      }
    }
    if (registration && classSession && !registration.internal_notification_sent_at) {
      try {
        const internal = await sendClassEmail("internal", registration, classSession);
        if (!internal.skipped) await getSupabaseServiceClient().from("registrations").update({ internal_notification_sent_at: new Date().toISOString() }).eq("id", registration.id).is("internal_notification_sent_at", null);
      } catch (error) { console.error("Internal registration email failed:", error); }
    }
  }

  if (session.metadata.payment_record_status === "verified") return session;

  const fulfillmentMetadata: Record<string, string> =
    product.mode === "subscription"
      ? {
          membership_status: "active",
        }
      : {
          booking_status: classSessionId ? "confirmed" : "awaiting_schedule",
        };

  return stripe.checkout.sessions.update(session.id, {
    metadata: {
      payment_record_status: "verified",
      ...fulfillmentMetadata,
      verified_at: new Date().toISOString(),
      verification_source: source,
    },
  });
}

export async function cancelCheckoutRegistration(checkoutSessionId: string, paymentStatus = "failed") {
  if (!isSupabaseConfigured()) return false;
  const { data, error } = await getSupabaseServiceClient().rpc("cancel_registration", {
    p_checkout_session_id: checkoutSessionId,
    p_payment_status: paymentStatus,
  });
  if (error) throw new Error(`Unable to cancel registration: ${error.message}`);
  return Boolean(data);
}
