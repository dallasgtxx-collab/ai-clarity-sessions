import type { ClassSession } from "@/lib/database.types";
import { ScheduleViewTracker } from "@/components/AnalyticsEvents";
import { formatSessionDate, formatSessionTime } from "@/lib/scheduling";

export function UpcomingSchedule({ sessions }: { sessions: ClassSession[] }) {
  return <section className="upcoming-section" aria-labelledby="upcoming-title"><ScheduleViewTracker /><div className="site-container"><div className="upcoming-heading"><div><p className="kicker">Upcoming class calendar</p><h2 id="upcoming-title">Choose a date that works.</h2></div><p>Availability updates from the registration system. Final eligibility is always checked securely before Stripe Checkout opens.</p></div>
    {sessions.length ? <div className="upcoming-grid">{sessions.map((session) => <article key={session.id}><div><time dateTime={session.session_date}>{formatSessionDate(session)}</time><span>{formatSessionTime(session)} · {session.timezone}</span></div><div><strong>{session.title}</strong><span>{session.location_type === "online" ? "Live online class" : session.location_name || "Dallas-area venue"}</span></div><div><b className={session.seats_remaining <= 3 ? "low-seats" : ""}>{session.seats_remaining > 0 ? `${session.seats_remaining} seats available` : "Sold out"}</b><a href="#pricing">Select this class</a></div></article>)}</div> : <div className="schedule-calendar-empty"><strong>No public dates are posted yet.</strong><p>New sessions will appear here after they are confirmed. Private and group training remains available by request.</p></div>}
  </div></section>;
}
