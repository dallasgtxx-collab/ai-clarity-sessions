#!/usr/bin/env node
/**
 * Test checkout flow by creating a sandbox checkout session
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  try {
    console.log("🛒 Testing checkout flow...\n");

    const priceId = process.env.STRIPE_BEGINNER_PRICE_ID || "price_1TrwWELRLtEYa2nsETxc7VX2";

    // Create checkout session
    console.log("📝 Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: "https://www.aiclaritysessions.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://www.aiclaritysessions.com/cancel",
      metadata: {
        business: "ai_clarity_sessions",
        product_key: "beginner",
        product_name: "AI Clarity Beginner Session",
      },
    });

    console.log(`✅ Session created: ${session.id}`);
    console.log(`   URL: ${session.url}`);
    console.log(`   Status: ${session.payment_status}`);
    console.log(`   Amount: $${session.amount_total / 100} ${session.currency.toUpperCase()}`);

    // Retrieve and verify
    console.log("\n🔍 Retrieving session details...");
    const retrieved = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    console.log(`✅ Session verified`);
    console.log(`   Items: ${retrieved.line_items.data.length}`);
    retrieved.line_items.data.forEach((item) => {
      console.log(`     • ${item.description} x${item.quantity}`);
    });

    // Test metadata
    console.log("\n📋 Checking metadata...");
    console.log(`   Business: ${retrieved.metadata.business}`);
    console.log(`   Product Key: ${retrieved.metadata.product_key}`);
    console.log(`   Product Name: ${retrieved.metadata.product_name}`);

    console.log("\n✨ Checkout test passed!");
    console.log(`\n🧪 Test checkout URL: ${session.url}`);
  } catch (err) {
    console.error("❌ Checkout test failed:", err.message);
    process.exit(1);
  }
})();
