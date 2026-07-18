# Email and reminder setup

## 1. Create Resend and verify the sender

Create a Resend account, add `aiclaritysessions.com`, and install the SPF and DKIM DNS records shown by Resend. Wait for the domain to show **Verified** before using a domain sender in production.

Create a server API key with sending access. Store it only in Vercel environment variables:

```text
RESEND_API_KEY
EMAIL_FROM=AI Clarity Sessions <classes@aiclaritysessions.com>
EMAIL_REPLY_TO=hello@aiclaritysessions.com
ADMIN_NOTIFICATION_EMAIL
```

Do not put the API key in any `NEXT_PUBLIC_` variable.

## 2. Templates and delivery behavior

`emails/class-email.tsx` contains responsive React Email templates for confirmation, 24-hour reminder, 2-hour reminder, schedule changes, cancellations, and internal registration notifications. Student messages attach a valid ICS calendar event. Online meeting links appear only in authorized email, never in public schedule data or analytics.

Confirmation and internal-notification timestamps are stored on each registration. Resend also receives deterministic idempotency keys, protecting webhook retries from duplicate sends.

## 3. Configure Vercel Cron

Generate a long random value for `CRON_SECRET` and add it to Vercel Production environment variables. `vercel.json` invokes `/api/cron/class-reminders` hourly. Vercel calls it with `Authorization: Bearer $CRON_SECRET`.

Hourly cron requires a Vercel plan that supports hourly schedules. If the production plan only supports daily cron, upgrade the plan; a daily schedule cannot reliably send a two-hour reminder.

Manual production test:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://aiclaritysessions.com/api/cron/class-reminders
```

The response contains only aggregate counts. It does not expose names, addresses, emails, meeting links, or registration IDs.

## 4. Test safely

Use a Resend test recipient and Stripe test mode. Create sessions approximately 24 hours and 2 hours ahead, register, invoke the cron route, and verify each timestamp is written once. Invoke it again and confirm the send counts stay at zero.

Schedule-change and cancellation templates are available through `sendClassEmail`; use them from a controlled server-side operations workflow when changing or cancelling sessions. No public email-sending endpoint exists.

SMS reminders are not implemented. The registration model keeps reminder responsibilities isolated so an SMS provider can be added later without claiming current SMS delivery.
