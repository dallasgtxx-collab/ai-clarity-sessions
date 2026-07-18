import type { Metadata } from "next";
import Link from "next/link";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata: Metadata = { title: "Share your class review", description: "Submit an honest AI Clarity Sessions class review for moderation and optional publication.", alternates: { canonical: "/reviews" } };

export default function ReviewsPage() {
  return <main id="main-content" className="review-page"><div className="site-container review-layout"><section><p className="eyebrow">Student feedback</p><h1>Share your honest experience.</h1><p>Your feedback helps future students decide whether a class is right for them. Every submission is reviewed before publication, and nothing is published without explicit consent.</p><ul><li>Reviews are never published automatically.</li><li>Photos are optional and remain private while pending.</li><li>You may contact support to request removal.</li></ul><Link href="/">Return home</Link></section><ReviewForm /></div></main>;
}
