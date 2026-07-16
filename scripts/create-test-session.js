#!/usr/bin/env node
/**
 * Create a test checkout session and output the URL
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceId = process.argv[2] || process.env.STRIPE_BEGINNER_PRICE_ID || "price_1TrwWELRLtEYa2nsETxc7VX2";

(async () => {
  try {
    console.log(`Creating checkout session for price: ${priceId}\n`);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://www.aiclaritysessions.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.aiclaritysessions.com/cancel",
      metadata: {
        business: "ai_clarity_sessions",
        product_key: "beginner",
        product_name: "AI Clarity Beginner Session",
      },
    });

    console.log("✅ Checkout session created!");
    console.log(`\n📝 Session ID: ${session.id}`);
    console.log(`🔗 Checkout URL: ${session.url}\n`);

    console.log("💳 To test with a card, use Stripe test cards:");
    console.log("   • 4242 4242 4242 4242 (visa, success)");
    console.log("   • 4000 0000 0000 0002 (visa, card declined)");
    console.log("   • 3782 822463 10005 (amex, success)");
  } catch (err) {
    console.error("❌ Failed to create session:", err.message);
    process.exit(1);
  }
})();
