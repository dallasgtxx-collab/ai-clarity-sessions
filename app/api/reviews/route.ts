import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase-server";

export const runtime = "nodejs";

const schema = z.object({
  studentName: z.string().trim().min(2).max(100),
  studentRole: z.string().trim().max(100).optional(),
  organization: z.string().trim().max(140).optional(),
  reviewText: z.string().trim().min(20).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  consent: z.literal("on"),
  website: z.string().max(0),
  startedAt: z.coerce.number().int().positive(),
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Review collection is not configured yet." }, { status: 503 });
  try {
    const form = await request.formData();
    const parsed = schema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success || Date.now() - parsed.data.startedAt < 3000) {
      return NextResponse.json({ error: "Please review the form and try again." }, { status: 400 });
    }
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0 && (!allowedTypes.has(photo.type) || photo.size > 5 * 1024 * 1024)) {
      return NextResponse.json({ error: "Photos must be JPG, PNG, or WebP and no larger than 5 MB." }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    const reviewId = crypto.randomUUID();
    let photoPath: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
      photoPath = `${reviewId}/student-photo.${extension}`;
      const { error } = await supabase.storage.from("review-photos").upload(photoPath, photo, { contentType: photo.type, upsert: false });
      if (error) throw error;
    }

    const { error } = await supabase.from("reviews").insert({
      id: reviewId,
      student_name: parsed.data.studentName,
      student_role: parsed.data.studentRole || null,
      organization: parsed.data.organization || null,
      review_text: parsed.data.reviewText,
      rating: parsed.data.rating,
      photo_url: photoPath,
      consent_to_publish: true,
      status: "pending",
      featured: false,
    });
    if (error) {
      if (photoPath) await supabase.storage.from("review-photos").remove([photoPath]);
      throw error;
    }
    return NextResponse.json({ ok: true, message: "Thank you. Your review is pending moderation and will not appear publicly unless approved." });
  } catch (error) {
    console.error("Review submission failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "Your review could not be submitted. Please try again." }, { status: 500 });
  }
}
