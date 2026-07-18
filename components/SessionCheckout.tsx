"use client";

import { useId, useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";
import type { ClassSession } from "@/lib/database.types";
import type { BookableProductKey } from "@/lib/products";
import { trackEvent } from "@/lib/analytics";

export function SessionCheckout({ product, sessions, checkoutEnabled }: { product: BookableProductKey; sessions: ClassSession[]; checkoutEnabled: boolean }) {
  const id = useId();
  const [selectedId, setSelectedId] = useState("");
  const selected = sessions.find((session) => session.id === selectedId);

  return <div className="session-checkout">
    <label htmlFor={id}>Choose an available class</label>
    {sessions.length ? <>
      <select id={id} value={selectedId} onFocus={() => trackEvent("view_class_schedule", { product_key: product })} onChange={(event) => { setSelectedId(event.target.value); trackEvent("select_class_session", { product_key: product }); }}>
        <option value="">Select a date and time</option>
        {sessions.map((session) => <option key={session.id} value={session.id} disabled={session.seats_remaining < 1}>
          {session.session_date} · {session.start_time.slice(0,5)} · {session.seats_remaining > 0 ? `${session.seats_remaining} seats left` : "Sold out"}
        </option>)}
      </select>
      {selected ? <div className="selected-session" aria-live="polite">
        <strong>{selected.title}</strong><span>{selected.session_date} · {selected.start_time.slice(0,5)}–{selected.end_time.slice(0,5)} · {selected.timezone}</span>
        <span>{selected.location_type === "online" ? "Live online class" : selected.location_name || "Dallas-area venue"}</span>
        <b className={selected.seats_remaining <= 3 ? "low-seats" : ""}>{selected.seats_remaining <= 3 ? `Only ${selected.seats_remaining} seats remain` : `${selected.seats_remaining} seats available`}</b>
      </div> : null}
      <CheckoutButton product={product} sessionId={selectedId || undefined} label="Reserve this class" disabled={!checkoutEnabled || !selectedId} disabledMessage={!checkoutEnabled ? "Secure registration is opening soon." : "Choose a class date to continue."} />
    </> : <div className="schedule-empty"><strong>New dates coming soon</strong><p>Published class dates will appear here. Contact us about private or group training.</p></div>}
  </div>;
}
