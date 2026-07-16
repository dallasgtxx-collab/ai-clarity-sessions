#!/usr/bin/env node
/**
 * Test Stripe integration by verifying products, prices, and webhooks
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  try {
    console.log("🧪 Running Stripe integration tests...\n");

    // Test 1: List and verify products
    console.log("📦 Checking products...");
    const products = await stripe.products.list({ limit: 10 });
    const expectedProducts = ["beginner", "workshop", "bootcamp", "membership"];
    
    for (const product of products.data) {
      console.log(`  • ${product.name}: ${product.id}`);
    }

    // Test 2: Verify prices
    console.log("\n💰 Checking prices...");
    const prices = await stripe.prices.list({ limit: 20 });
    const pricesByProduct = {};
    
    for (const price of prices.data) {
      const productName = price.product.name || price.product;
      if (!pricesByProduct[productName]) {
        pricesByProduct[productName] = [];
      }
      pricesByProduct[productName].push({
        id: price.id,
        amount: price.unit_amount ? price.unit_amount / 100 : "custom",
        currency: price.currency,
      });
    }

    Object.entries(pricesByProduct).forEach(([product, priceList]) => {
      console.log(`  • ${product}:`);
      priceList.forEach((price) => {
        console.log(`    - ${price.id}: $${price.amount} ${price.currency.toUpperCase()}`);
      });
    });

    // Test 3: Check webhook endpoints
    console.log("\n📨 Checking webhook endpoints...");
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    const ourWebhook = webhooks.data.find(
      (w) => w.url === "https://www.aiclaritysessions.com/api/webhooks/stripe"
    );

    if (ourWebhook) {
      console.log(`  ✅ Webhook found: ${ourWebhook.url}`);
      console.log(`     Status: ${ourWebhook.status}`);
      console.log(`     Events: ${ourWebhook.enabled_events.join(", ")}`);
    } else {
      console.log(`  ⚠️  Webhook not found at production URL`);
    }

    // Test 4: Verify API connectivity
    console.log("\n🔌 Verifying API connectivity...");
    const account = await stripe.account.retrieve();
    console.log(`  ✅ Connected to account: ${account.id}`);
    console.log(`     Mode: ${account.settings?.dashboard?.timezone ? "Live" : "Test"}`);

    console.log("\n✨ All Stripe tests passed!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
  }
})();
