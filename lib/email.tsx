import "server-only";
import type { PrivateClassSession, Registration } from "@/lib/database.types";
import { CancellationEmail, ConfirmationEmail, InternalRegistrationEmail, Reminder2HourEmail, Reminder24HourEmail, ScheduleChangeEmail } from "@/emails/class-email";
import { createSessionIcs } from "@/lib/calendar";
import { getResend, isEmailConfigured } from "@/lib/resend";
import { formatSessionDate, formatSessionTime } from "@/lib/scheduling";

type EmailKind = "confirmation" | "reminder_24h" | "reminder_2h" | "schedule_change" | "cancellation" | "internal";

function details(session: PrivateClassSession, registration: Registration) {
  const location = session.location_type === "online" ? "Online — private access details are included in this email" : [session.location_name, session.location_address].filter(Boolean).join(", ");
  return { studentName: registration.customer_name || "Student", className: session.title, date: formatSessionDate(session), time: formatSessionTime(session), timezone: session.timezone, location, meetingUrl: session.location_type !== "in_person" ? session.meeting_url : null, supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@aiclaritysessions.com" };
}

export async function sendClassEmail(kind: EmailKind, registration: Registration, session: PrivateClassSession) {
  if (!isEmailConfigured()) return { skipped: true as const, reason: "email_not_configured" };
  const shared = details(session, registration);
  const templates = { confirmation: <ConfirmationEmail {...shared} />, reminder_24h: <Reminder24HourEmail {...shared} />, reminder_2h: <Reminder2HourEmail {...shared} />, schedule_change: <ScheduleChangeEmail {...shared} />, cancellation: <CancellationEmail {...shared} />, internal: <InternalRegistrationEmail {...shared} /> };
  const subjects: Record<EmailKind,string> = { confirmation:`Registration confirmed: ${session.title}`, reminder_24h:`Tomorrow: ${session.title}`, reminder_2h:`Starting soon: ${session.title}`, schedule_change:`Schedule updated: ${session.title}`, cancellation:`Class cancelled: ${session.title}`, internal:`New registration: ${session.title}` };
  const to = kind === "internal" ? process.env.ADMIN_NOTIFICATION_EMAIL : registration.customer_email;
  if (!to) return { skipped: true as const, reason: "recipient_not_configured" };
  const result = await getResend().emails.send({ from: process.env.EMAIL_FROM!, to, replyTo: process.env.EMAIL_REPLY_TO, subject: subjects[kind], react: templates[kind], attachments: kind === "internal" ? undefined : [{ filename: "ai-clarity-session.ics", content: Buffer.from(createSessionIcs(session, registration.id)).toString("base64") }] }, { idempotencyKey: `${kind}-${registration.id}` });
  if (result.error) throw new Error(`Email provider rejected ${kind}: ${result.error.message}`);
  return { skipped: false as const, id: result.data?.id };
}
