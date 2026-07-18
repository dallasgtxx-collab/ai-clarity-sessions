import "server-only";
import type { ApprovedReview } from "@/lib/database.types";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase-server";

export type PublicReview = ApprovedReview & { photoUrl: string | null };

export async function getApprovedReviews(): Promise<PublicReview[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.from("public_approved_reviews").select("*").order("featured", { ascending: false }).order("approved_at", { ascending: false }).limit(6);
  if (error) {
    console.error("Unable to load approved reviews:", error.message);
    return [];
  }
  return Promise.all(((data ?? []) as ApprovedReview[]).map(async (review) => {
    if (!review.photo_url) return { ...review, photoUrl: null };
    const { data: signed } = await supabase.storage.from("review-photos").createSignedUrl(review.photo_url, 3600);
    return { ...review, photoUrl: signed?.signedUrl ?? null };
  }));
}
