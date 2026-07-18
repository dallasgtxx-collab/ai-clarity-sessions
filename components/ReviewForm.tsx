"use client";

import { useState } from "react";

export function ReviewForm() {
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true); setStatus("");
    const form = event.currentTarget;
    const response = await fetch("/api/reviews", { method: "POST", body: new FormData(form) });
    const result = await response.json() as { error?: string; message?: string };
    setStatus(result.message || result.error || "Unable to submit review.");
    setSubmitting(false);
    if (response.ok) form.reset();
  }

  return <form className="review-form" onSubmit={submit} encType="multipart/form-data" data-clarity-mask="true">
    <input type="hidden" name="startedAt" value={startedAt} />
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-grid"><label>Your name<input name="studentName" required minLength={2} maxLength={100} autoComplete="name" /></label><label>Your role <span>(optional)</span><input name="studentRole" maxLength={100} /></label></div>
    <label>Organization <span>(optional)</span><input name="organization" maxLength={140} autoComplete="organization" /></label>
    <label>Your review<textarea name="reviewText" required minLength={20} maxLength={2000} rows={6} /></label>
    <label>Rating<select name="rating" required defaultValue=""><option value="" disabled>Choose a rating</option>{[5,4,3,2,1].map((value) => <option value={value} key={value}>{value} star{value === 1 ? "" : "s"}</option>)}</select></label>
    <label>Student photo <span>(optional, JPG/PNG/WebP, max 5 MB)</span><input type="file" name="photo" accept="image/jpeg,image/png,image/webp" /></label>
    <label className="consent-check"><input type="checkbox" name="consent" required /><span>I consent to AI Clarity Sessions publishing my submitted name, review, rating, optional role/organization, and optional photo after moderation. I understand submission does not guarantee publication.</span></label>
    <button className="button-primary" disabled={submitting}>{submitting ? "Submitting…" : "Submit review for approval"}</button>
    <p className="form-status" aria-live="polite">{status}</p>
  </form>;
}
