import { NextResponse } from "next/server";
import { getStripePriceId, isBookableProductKey, isProductKey, products } from "@/lib/products";
import { isCheckoutEnabled } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { getEligibleClassSession } from "@/lib/scheduling";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isCheckoutEnabled()) {
      return NextResponse.json(
        { error: "Registration is not open yet. Please check back shortly." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as {
      product?: string;
      sessionId?: string;
    };

    if (!body.product || !isProductKey(body.product)) {
      return NextResponse.json(
        { error: "Please select a valid class." },
        { status: 400 },
      );
    }

    const selectedProduct = products[body.product];
    const requiresSchedule = isBookableProductKey(body.product);
    const classSession = requiresSchedule && body.sessionId
      ? await getEligibleClassSession(body.sessionId, body.product)
      : null;

    if (requiresSchedule && !classSession) {
      return NextResponse.json(
        { error: "Please choose an available class date before checkout." },
        { status: 409 },
      );
    }
    const priceId = getStripePriceId(selectedProduct);

    if (!priceId) {
      console.error(`Missing Stripe Price ID for ${body.product}`);

      return NextResponse.json(
        { error: "This class is not available for checkout yet." },
        { status: 500 },
      );
    }

    const requestOrigin = new URL(request.url).origin;
    const siteUrl =
      process.env.SITE_URL?.replace(/\/$/, "") ||
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      requestOrigin;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: selectedProduct.mode,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      phone_number_collection: {
        enabled: true,
      },
      ...(selectedProduct.mode === "subscription"
        ? {
            consent_collection: { terms_of_service: "required" as const },
            custom_text: {
              terms_of_service_acceptance: {
                message:
                  "I agree to the AI Clarity Sessions terms, refund policy, and recurring monthly billing until canceled.",
              },
            },
          }
        : {}),
      metadata: {
        business: "ai_clarity_sessions",
        product_key: selectedProduct.key,
        product: selectedProduct.key,
        product_name: selectedProduct.name,
        ...(classSession ? { class_session_id: classSession.id } : {}),
      },
      ...(selectedProduct.mode === "payment"
        ? {
            customer_creation: "always" as const,
          }
        : {}),
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({
      url: session.url,
      checkoutSessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      {
        error: "Secure checkout could not be opened. Please try again.",
      },
      { status: 500 },
    );
  }
}
