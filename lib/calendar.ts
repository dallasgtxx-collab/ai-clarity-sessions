import type { PrivateClassSession } from "@/lib/database.types";

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function toCalendarDate(date: string, time: string) {
  return `${date.replaceAll("-", "")}T${time.slice(0, 8).replaceAll(":", "")}`;
}

export function createSessionIcs(session: PrivateClassSession, registrationId: string) {
  const location = session.location_type === "online" ? "Online class" : [session.location_name, session.location_address].filter(Boolean).join(", ");
  const description = `AI Clarity Sessions with ${session.instructor_name}. Bring a charged laptop or tablet and your questions. Support: ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@aiclaritysessions.com"}`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AI Clarity Sessions//Class Registration//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${registrationId}@aiclaritysessions.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=${session.timezone}:${toCalendarDate(session.session_date, session.start_time)}`,
    `DTEND;TZID=${session.timezone}:${toCalendarDate(session.session_date, session.end_time)}`,
    `SUMMARY:${escapeIcs(session.title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location || "Location details will be emailed")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
