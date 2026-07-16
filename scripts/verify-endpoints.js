#!/usr/bin/env node
/**
 * Verify all production endpoints are reachable
 */

const https = require("https");

const endpoints = [
  {
    url: "https://www.aiclaritysessions.com/",
    name: "Homepage",
    expectedStatus: 200,
  },
  {
    url: "https://www.aiclaritysessions.com/success",
    name: "Success page",
    expectedStatus: 200,
  },
  {
    url: "https://www.aiclaritysessions.com/cancel",
    name: "Cancel page",
    expectedStatus: 200,
  },
  {
    url: "https://www.aiclaritysessions.com/api/webhooks/stripe",
    name: "Webhook endpoint",
    expectedStatus: 405, // GET not allowed, but endpoint exists
  },
  {
    url: "https://www.aiclaritysessions.com/privacy",
    name: "Privacy page",
    expectedStatus: 200,
  },
  {
    url: "https://www.aiclaritysessions.com/refunds",
    name: "Refunds page",
    expectedStatus: 200,
  },
];

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    https
      .get(endpoint.url, { timeout: 5000 }, (res) => {
        const success = res.statusCode === endpoint.expectedStatus;
        resolve({
          ...endpoint,
          actualStatus: res.statusCode,
          success,
        });
      })
      .on("error", (err) => {
        resolve({
          ...endpoint,
          error: err.message,
          success: false,
        });
      });
  });
}

(async () => {
  try {
    console.log("🌐 Verifying production endpoints...\n");

    const results = await Promise.all(endpoints.map(checkEndpoint));

    let allPassed = true;
    results.forEach((result) => {
      const status = result.success ? "✅" : "❌";
      const statusInfo = result.error
        ? `Error: ${result.error}`
        : `Status: ${result.actualStatus}`;
      console.log(`${status} ${result.name}`);
      console.log(`   ${statusInfo}`);
      if (!result.success) allPassed = false;
    });

    if (allPassed) {
      console.log("\n✨ All endpoints are reachable!");
    } else {
      console.log("\n⚠️  Some endpoints failed verification");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    process.exit(1);
  }
})();
