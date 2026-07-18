# Analytics and consent setup

## Google Analytics 4

1. Create a GA4 property for `https://aiclaritysessions.com`.
2. Create a Web data stream and copy its measurement ID (`G-...`).
3. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel Production.
4. Deploy, accept analytics in the consent banner, and verify page views/events in GA4 DebugView or Realtime.

Tracked events: `view_class_schedule`, `select_class_session`, `begin_checkout`, `checkout_error`, `registration_complete`, `view_pricing`, `demo_interaction`, `session_recommender_complete`, and `contact_click`. Parameters contain product/category state only. Names, email addresses, phone numbers, free-form review text, Stripe IDs, Supabase IDs, and meeting links must never be added.

## Microsoft Clarity

1. Create a Clarity project for the production domain.
2. Copy the project ID into `NEXT_PUBLIC_CLARITY_PROJECT_ID` in Vercel Production.
3. In Clarity settings, keep masking enabled for sensitive text and form inputs.
4. Verify review forms and approved-review regions remain masked.

## Consent behavior

GA4 and Clarity load only when their ID exists and the visitor selects **Accept analytics**. Rejecting analytics leaves Stripe, scheduling, email, and all essential site behavior operational. The choice is stored in local storage. **Manage analytics preference** in the footer reopens the control.

To test: clear local storage, reload, confirm no requests to Google or Clarity before consent, reject and confirm they remain absent, then accept and confirm configured scripts load. Leaving either environment variable blank disables that provider.
