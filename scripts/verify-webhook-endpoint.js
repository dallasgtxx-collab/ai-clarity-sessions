#!/usr/bin/env node
/**
 * Verify webhook endpoint configuration in Stripe
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  try {
    console.log("📨 Checking webhook endpoints...\n");

    const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });

    if (endpoints.data.length === 0) {
      console.log("⚠️  No webhook endpoints configured");
      return;
    }

    const ourEndpoint = endpoints.data.find(
      (e) => e.url === "https://www.aiclaritysessions.com/api/webhooks/stripe"
    );

    if (ourEndpoint) {
      console.log("✅ Webhook endpoint found!");
      console.log(`\n   URL: ${ourEndpoint.url}`);
      console.log(`   Status: ${ourEndpoint.status}`);
      console.log(`   Created: ${new Date(ourEndpoint.created * 1000).toISOString()}`);
      console.log(`\n   Listening for events:`);
      ourEndpoint.enabled_events.forEach((event) => {
        console.log(`     • ${event}`);
      });
    } else {
      console.log("⚠️  Webhook endpoint for production URL not found");
      console.log("\n   Configured endpoints:");
      endpoints.data.forEach((ep) => {
        console.log(`     • ${ep.url} (${ep.status})`);
      });
    }
  } catch (err) {
    console.error("❌ Failed to verify webhook:", err.message);
    process.exit(1);
  }
})();
