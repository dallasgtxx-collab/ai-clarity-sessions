import "server-only";
import type { ClassSession, PrivateClassSession, Registration } from "@/lib/database.types";
import { isBookableProductKey, type BookableProductKey } from "@/lib/products";
import { getSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase-server";

export async function getUpcomingClassSessions(productKey?: BookableProductKey): Promise<ClassSession[]> {
  if (!isSupabaseConfigured()) return [];
  let query = getSupabaseServiceClient()
    .from("public_class_sessions")
    .select("*")
    .order("session_date", { ascending: true })
    .order("start_time", { ascending: true });
  if (productKey) query = query.eq("product_key", productKey);
  const { data, error } = await query;
  if (error) {
    console.error("Unable to load published class sessions:", error.message);
    return [];
  }
  return (data ?? []) as ClassSession[];
}

export async function getEligibleClassSession(id: string, productKey: string): Promise<ClassSession | null> {
  if (!isSupabaseConfigured() || !isBookableProductKey(productKey)) return null;
  const { data, error } = await getSupabaseServiceClient()
    .from("public_class_sessions")
    .select("*")
    .eq("id", id)
    .eq("product_key", productKey)
    .maybeSingle();
  if (error || !data) return null;
  const session = data as ClassSession;
  return session.status === "published" && session.seats_remaining > 0 ? session : null;
}

export async function getPrivateClassSession(id: string): Promise<PrivateClassSession | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseServiceClient().from("class_sessions").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return { ...data, seats_remaining: Math.max(data.capacity - data.seats_reserved, 0) } as PrivateClassSession;
}

export async function getRegistrationByCheckoutId(checkoutId: string): Promise<Registration | null> {
  if (!isSupabaseConfigured()) return null;
  const { data } = await getSupabaseServiceClient().from("registrations").select("*").eq("stripe_checkout_session_id", checkoutId).maybeSingle();
  return (data as Registration | null) ?? null;
}

export function formatSessionDate(session: Pick<ClassSession, "session_date" | "timezone">) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: session.timezone }).format(new Date(`${session.session_date}T12:00:00Z`));
}

export function formatSessionTime(session: Pick<ClassSession, "session_date" | "start_time" | "end_time" | "timezone">) {
  const format = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${suffix}`;
  };
  return `${format(session.start_time)}–${format(session.end_time)}`;
}

export function getSessionStart(session: Pick<ClassSession, "session_date" | "start_time" | "timezone">) {
  const [year, month, day] = session.session_date.split("-").map(Number);
  const [hour, minute, second = 0] = session.start_time.split(":").map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute, second);
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: session.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(guess));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const represented = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day), Number(values.hour), Number(values.minute), Number(values.second));
  return new Date(guess - (represented - guess));
}
