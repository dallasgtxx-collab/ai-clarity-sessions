import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { cancelCheckoutRegistration, verifyCheckout } from "@/lib/fulfillment";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured.");
    return new NextResponse("Webhook is not configured.", { status: 503 });
  }

  if (!signature) {
    return new NextResponse("Missing Stripe signature.", { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return new NextResponse("Invalid webhook signature.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await verifyCheckout(event.data.object.id, "webhook");
        break;
      case "checkout.session.async_payment_failed":
        await cancelCheckoutRegistration(event.data.object.id, "failed");
        console.warn("A delayed Checkout payment failed.", event.data.object.id);
        break;
      case "checkout.session.expired":
        await cancelCheckoutRegistration(event.data.object.id, "unpaid");
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Stripe webhook handling failed for ${event.id}:`, error);
    return new NextResponse("Webhook processing failed.", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
