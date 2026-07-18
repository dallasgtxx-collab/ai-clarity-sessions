import { NextResponse } from "next/server";
import type { PrivateClassSession, Registration } from "@/lib/database.types";
import { sendClassEmail } from "@/lib/email";
import { getSessionStart } from "@/lib/scheduling";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ReminderRow = Registration & { class_sessions: PrivateClassSession };

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse("Unauthorized", { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ ok: false, error: "scheduling_not_configured" }, { status: 503 });

  const supabase = getSupabaseServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase.from("registrations").select("*, class_sessions!inner(*)").eq("registration_status", "confirmed").gte("class_sessions.session_date", today).limit(200);
  if (error) return NextResponse.json({ ok: false, error: "query_failed" }, { status: 500 });

  const summary = { checked: 0, sent24h: 0, sent2h: 0, failed: 0 };
  const now = Date.now();
  for (const row of (data ?? []) as unknown as ReminderRow[]) {
    if (!row.class_sessions) continue;
    summary.checked++;
    const hours = (getSessionStart(row.class_sessions).getTime() - now) / 3_600_000;
    const kind = hours > 22 && hours <= 25 && !row.reminder_24h_sent_at ? "reminder_24h" : hours > 1 && hours <= 3 && !row.reminder_2h_sent_at ? "reminder_2h" : null;
    if (!kind) continue;
    try {
      const result = await sendClassEmail(kind, row, row.class_sessions);
      if (result.skipped) continue;
      const column = kind === "reminder_24h" ? "reminder_24h_sent_at" : "reminder_2h_sent_at";
      await supabase.from("registrations").update({ [column]: new Date().toISOString() }).eq("id", row.id).is(column, null);
      if (kind === "reminder_24h") summary.sent24h++; else summary.sent2h++;
    } catch (sendError) {
      summary.failed++;
      console.error("Reminder send failed:", sendError instanceof Error ? sendError.message : "unknown error");
    }
  }
  return NextResponse.json({ ok: summary.failed === 0, ...summary });
}
