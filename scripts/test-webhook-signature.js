#!/usr/bin/env node
/**
 * Test webhook signature validation
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  try {
    console.log("🔐 Testing webhook signature validation...\n");

    // Get webhook secret
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || secret === "whsec_placeholder" || secret.startsWith("whsec_")) {
      console.log("⚠️  STRIPE_WEBHOOK_SECRET not configured properly");
      console.log("   This is needed for webhook signature validation");
      console.log("   Retrieve it from Stripe Dashboard → Developers → Webhooks");
      return;
    }

    // Create a test event
    const timestamp = Math.floor(Date.now() / 1000);
    const event = {
      id: "evt_test_" + Date.now(),
      object: "event",
      type: "checkout.session.completed",
      created: timestamp,
      data: {
        object: {
          id: "cs_test_" + Date.now(),
          object: "checkout.session",
          payment_status: "paid",
          status: "complete",
          metadata: {
            business: "ai_clarity_sessions",
            product_key: "beginner",
            product_name: "AI Clarity Beginner Session",
          },
        },
      },
    };

    const signedContent = `${timestamp}.${JSON.stringify(event)}`;

    // Create HMAC signature
    const crypto = require("crypto");
    const signature = crypto
      .createHmac("sha256", secret)
      .update(signedContent)
      .digest("hex");

    const stripeSignature = `t=${timestamp},v1=${signature}`;

    console.log("✅ Webhook signature created");
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Signature: ${stripeSignature.substring(0, 50)}...`);

    // Verify signature (as done in the webhook handler)
    try {
      const verifiedEvent = stripe.webhooks.constructEvent(
        signedContent,
        stripeSignature,
        secret
      );
      console.log("\n✅ Signature verified successfully");
      console.log(`   Event type: ${verifiedEvent.type}`);
      console.log(`   Event ID: ${verifiedEvent.id}`);
    } catch (err) {
      console.error("❌ Signature verification failed:", err.message);
      throw err;
    }

    console.log("\n✨ Webhook signature test passed!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
  }
})();
