# AI Clarity Sessions

The official website and secure Stripe Checkout flow for AI Clarity Sessions.

## Local setup

1. Copy `.env.example` to `.env.local` and add test-mode Stripe values.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Required production settings

- `STRIPE_SECRET_KEY`
- `STRIPE_BEGINNER_PRICE_ID`
- `STRIPE_WORKSHOP_PRICE_ID`
- `STRIPE_BOOTCAMP_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `ENABLE_LIVE_CHECKOUT=true`
- `NEXT_PUBLIC_SUPPORT_EMAIL=hello@aiclaritysessions.com`
- `SITE_URL=https://aiclaritysessions.com`

The public webhook endpoint is `/api/webhooks/stripe`. Keep `.env.local`
private and never commit Stripe secret keys.

Live checkout is intentionally disabled in production until
`ENABLE_LIVE_CHECKOUT=true` is set. Local development keeps Stripe sandbox
checkout available for testing.
