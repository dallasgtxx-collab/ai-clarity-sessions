import type Stripe from "stripe";
import {
  getStripePriceId,
  isProductKey,
  products,
} from "@/lib/products";
import { getStripe } from "@/lib/stripe";

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

  if (session.metadata.payment_record_status === "verified") {
    return session;
  }

  const fulfillmentMetadata: Record<string, string> =
    product.mode === "subscription"
      ? {
          membership_status: "active",
        }
      : {
          booking_status: "awaiting_schedule",
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
