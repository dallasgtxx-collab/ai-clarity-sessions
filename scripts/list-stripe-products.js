#!/usr/bin/env node
/**
 * List all Stripe products and prices
 */

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

(async () => {
  try {
    console.log("📦 Listing Stripe products and prices...\n");

    const products = await stripe.products.list({ limit: 100 });

    for (const product of products.data) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);

      const prices = await stripe.prices.list({
        product: product.id,
        limit: 10,
      });

      prices.data.forEach((price) => {
        const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : "custom";
        const recurring = price.recurring ? ` / ${price.recurring.interval}` : "";
        console.log(`   💰 ${price.id}: $${amount}${recurring}`);
      });
    }

    console.log("\n✨ Done!");
  } catch (err) {
    console.error("❌ Failed to list products:", err.message);
    process.exit(1);
  }
})();
