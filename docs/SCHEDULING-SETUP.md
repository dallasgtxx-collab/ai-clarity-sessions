# Scheduling setup

## 1. Create or select the Supabase project

Use separate Supabase projects for development and production. In each project, open **Project Settings → API** and record the project URL, anonymous key, and service-role key. The service-role key is server-only and must never use a `NEXT_PUBLIC_` prefix.

## 2. Apply the migration

Install and authenticate the Supabase CLI, link the correct project, then run:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

The migration at `supabase/migrations/20260718150000_scheduling_reviews.sql` creates scheduling and review tables, safe public views, indexes, constraints, RLS policies, service-only reservation RPCs, and a private `review-photos` bucket.

Confirm in the SQL editor that `anon` cannot select from `registrations`, cannot see `meeting_url` or `notes`, and can only see published future rows through `public_class_sessions`.

## 3. Configure environment variables

Set these in Vercel for Production and Preview, using separate projects/keys where appropriate:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Redeploy after changing environment variables.

## 4. Create production sessions

Create sessions manually in Supabase Table Editor. Start with `status = draft`, verify every date/time/timezone/capacity/location field, then change to `published`. Use `America/Chicago` for Dallas-area sessions unless the class operates in another timezone.

For online sessions, add the private `meeting_url`; it is excluded from the public view. Do not place secrets or attendee information in `notes`. The public site shows only safe location information.

The `supabase/seed.sql` file is development-only. It inserts rows only if the SQL session has `app.environment = development`; never set that value in production.

## 5. Test capacity and Stripe

1. Publish a test-mode class with capacity `1`.
2. Start two Stripe test checkouts for the same class.
3. Complete both with Stripe test cards.
4. Confirm only one registration is `confirmed`, `seats_reserved` never exceeds capacity, and the class becomes `sold_out`. The later paid checkout is recorded as `requires_refund` without consuming a seat or receiving a class confirmation.
5. Confirm replaying the same webhook does not add a second registration or seat.
6. Confirm an expired or failed session cannot leave a confirmed registration.

The final reservation occurs in the row-locked `register_paid_checkout` database function. Browser counts are never accepted as authority. If a payment completes after another buyer takes the final seat, the database records `requires_refund` rather than overselling; operations must review it and issue the appropriate refund or alternate placement.

## 6. Production checks

- Keep Stripe webhook events enabled for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`.
- Confirm `/api/create-checkout-session` requires an eligible session UUID for class products.
- Confirm memberships still check out without a class session.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code, logs, or screenshots.
