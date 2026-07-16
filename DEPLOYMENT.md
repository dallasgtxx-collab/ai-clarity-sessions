# Deployment & Automation Guide

## Overview
This guide covers the complete setup, testing, and deployment workflow for AI Clarity Sessions using integrated Vercel, Stripe, and GitHub Actions automation.

## Prerequisites
- Node.js 24.x or later
- Git
- Stripe account (sandbox and live)
- Vercel account with project created
- GitHub repository connected to Vercel

## Quick Start

### 1. Local Setup
```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Stripe keys and URLs
```

### 2. Build Verification
```bash
# Verify build works
npm run build

# Run all tests
npm run test:all
```

### 3. Deploy to Vercel
```bash
# Push to main branch
git push origin main

# GitHub Actions will automatically:
# - Run build and linting
# - Deploy to Vercel production
# - Verify deployment
```

## Environment Variables

### Required in `.env.local` and Vercel

```
# Stripe API Keys (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from Webhooks page)

# Product Price IDs (from Stripe Products)
STRIPE_BEGINNER_PRICE_ID=price_...
STRIPE_WORKSHOP_PRICE_ID=price_...
STRIPE_BOOTCAMP_PRICE_ID=price_...
STRIPE_MEMBERSHIP_PRICE_ID=price_...

# Site Configuration
SITE_URL=https://www.aiclaritysessions.com
ENABLE_LIVE_CHECKOUT=true

# Support
NEXT_PUBLIC_SUPPORT_EMAIL=hello@aiclaritysessions.com
```

## Testing Commands

### Local Testing

```bash
# Test Stripe integration (products, prices, webhooks)
npm run test:stripe

# Test checkout flow (create sandbox session)
npm run test:checkout

# Test webhook signature validation
npm run test:webhook

# Verify all endpoints are reachable
npm run test:endpoints

# Run all tests sequentially
npm run test:all
```

### Create Test Checkout Sessions

```bash
# Create a beginner session (default)
npm run stripe:create-session

# Create a specific product session
npm run stripe:create-session -- price_1TrwWELRLtEYa2nsETxc7VX2
```

### List Products

```bash
# List all products and prices configured in Stripe
npm run stripe:list-products
```

### Verify Webhook Endpoint

```bash
# Check webhook configuration in Stripe
npm run stripe:verify-webhook
```

## GitHub Actions Workflows

### Deploy Workflow (`.github/workflows/deploy.yml`)
Triggers on:
- Push to main branch
- Pull requests to main

Actions:
1. Install dependencies
2. Run linting
3. Build project
4. Deploy to Vercel
5. Verify deployment

### Test Workflow (`.github/workflows/test-checkout.yml`)
Triggers on:
- Schedule: Every 6 hours (cron)
- Manual trigger (workflow_dispatch)

Tests:
1. Stripe API connectivity
2. Product and price verification
3. Checkout session creation
4. Webhook endpoint status
5. Production endpoint accessibility

## Stripe Integration Checklist

### Sandbox Setup (Testing)
- [ ] Create Stripe account at stripe.com
- [ ] Enable test mode (toggle in dashboard)
- [ ] Create 4 products:
  - [ ] Beginner ($49 one-time)
  - [ ] Workshop ($99 one-time)
  - [ ] Bootcamp ($199 one-time)
  - [ ] Membership ($0.90/month recurring)
- [ ] Get sandbox API keys (sk_test_...)
- [ ] Copy price IDs to environment variables
- [ ] Register webhook endpoint: https://www.aiclaritysessions.com/api/webhooks/stripe
- [ ] Get webhook signing secret (whsec_...)

### Live Setup (Production)
- [ ] Complete Stripe account activation (business info)
- [ ] Enable live mode
- [ ] Create live products (same as sandbox)
- [ ] Get live API keys (sk_live_...)
- [ ] Update STRIPE_SECRET_KEY with live key
- [ ] Update price IDs with live versions
- [ ] Register webhook endpoint with live signing secret
- [ ] Set ENABLE_LIVE_CHECKOUT=true when ready

## Vercel Configuration

### Project Settings
- Production branch: `main`
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`

### Environment Variables
```
STRIPE_SECRET_KEY - marked as sensitive
STRIPE_WEBHOOK_SECRET - marked as sensitive
STRIPE_BEGINNER_PRICE_ID
STRIPE_WORKSHOP_PRICE_ID
STRIPE_BOOTCAMP_PRICE_ID
STRIPE_MEMBERSHIP_PRICE_ID
SITE_URL
ENABLE_LIVE_CHECKOUT
NEXT_PUBLIC_SUPPORT_EMAIL
```

### GitHub Integration
- Project connected via Vercel GitHub app
- Auto-deploy on push to main
- Preview deployments for PRs

## Testing the Payment Flow

### Manual Testing with Test Cards
1. Run: `npm run stripe:create-session`
2. Open the returned checkout URL
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Verify success page displays

### Automated Testing
- Run: `npm run test:all`
- Checks build, Stripe API, endpoints, webhooks
- Runs automatically via GitHub Actions every 6 hours

## Security Best Practices

### API Key Management
✅ Store secret keys in environment variables only
✅ Never commit `.env.local` to git
✅ Mark sensitive vars as "sensitive" in Vercel
✅ Rotate keys periodically
✅ Use webhook signing secrets for verification

### CSP Headers
The `next.config.ts` includes Content-Security-Policy headers that:
- Allow Stripe scripts and styles from m.stripe.network
- Allow frame embeds from Stripe domains
- Prevent inline scripts except from trusted sources
- Restrict resource loading to https only

### Webhook Verification
The `/api/webhooks/stripe` route:
- Verifies Stripe signature using webhook secret
- Validates checkout session metadata
- Updates session status atomically
- Logs verification for audit trail

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Stripe Integration Issues
```bash
# Verify products and prices
npm run test:stripe

# Create a test session to check API connectivity
npm run stripe:create-session

# Check webhook configuration
npm run stripe:verify-webhook
```

### Deployment Issues
1. Check GitHub Actions logs (GitHub → Actions)
2. Check Vercel deployment logs (Vercel → Deployments)
3. Verify environment variables are set in Vercel
4. Ensure webhook endpoint is publicly accessible

### CSP Errors in Console
If you see Content-Security-Policy violations:
1. Check browser console for blocked resources
2. Update `next.config.ts` to allow resource domain
3. Add domain to appropriate CSP directive (script-src, style-src, etc.)
4. Redeploy and verify

## Monitoring & Debugging

### View Recent Deployments
```bash
# In Vercel dashboard: Deployments tab
# Shows status, URL, build logs
```

### Monitor Webhook Events
```bash
# In Stripe dashboard: Developers → Webhooks
# Shows recent events and delivery status
# Can manually retry failed deliveries
```

### Check Application Logs
```bash
# In Vercel: Logs tab
# Shows runtime errors and console output
```

### Test Webhook Locally
```bash
# Using Stripe CLI (if installed)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Next Steps

1. **Activate Stripe Account**
   - Complete business information form
   - Enable live mode
   - Create live products

2. **Verify Production**
   - Test checkout on production site
   - Confirm webhook delivery in Stripe dashboard
   - Check success page displays correctly

3. **Monitor & Maintain**
   - Review webhook deliveries daily
   - Monitor failed payments
   - Check application logs for errors
   - Update security policies as needed

4. **Scale**
   - Add more products as needed
   - Implement subscription management
   - Add customer email notifications
   - Set up fulfillment automation

## Support

For Stripe-specific issues, see: https://stripe.com/docs/api
For Vercel-specific issues, see: https://vercel.com/docs
For project-specific questions, contact: hello@aiclaritysessions.com
