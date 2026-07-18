# Reviews and student photo setup

## Submission and privacy

Students submit through `/reviews`. The server validates text lengths, a required 1–5 rating, explicit publication consent, a timing check, and a hidden honeypot. Optional photos must be JPG, PNG, or WebP and no larger than 5 MB.

Every submission starts as `pending` and `featured = false`. Photos are stored in the private `review-photos` bucket. Nothing is published automatically.

## Moderation in Supabase

1. Open **Table Editor → reviews**.
2. Read the review and verify `consent_to_publish = true`.
3. If a photo exists, inspect it through the authenticated Storage dashboard. Confirm it matches the review and contains no unwanted private information.
4. Reject spam, misleading claims, or content you cannot verify by setting `status = rejected`.
5. To publish, set `status = approved` and `approved_at` to the current timestamp. Set `featured = true` only for reviews intentionally selected for prominence.
6. To remove a published review, change its status to `rejected` or `pending`. Delete the stored photo separately if removal was requested.

The database constraint prevents approval without consent and an approval timestamp. The homepage queries only the approved public view and creates short-lived signed photo URLs on the server.

## Operational rules

- Never rewrite a student review in a way that changes its meaning.
- Never create names, ratings, outcomes, or photos.
- Keep records of removal requests and respond through the support mailbox.
- For stronger high-volume spam protection, add a managed challenge provider and server-side rate store before promoting the form broadly.
