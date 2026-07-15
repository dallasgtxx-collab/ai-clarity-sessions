import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseTrackMood = "Hustle" | "Late Night" | "Focus";

export type SupabaseTrackRow = {
  id: string;
  title: string;
  mood: SupabaseTrackMood;
  src: string;
  plays: number;
  skips: number;
  completes: number;
  replays: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl?.includes("your_supabase_url_here") &&
  !supabaseAnonKey?.includes("your_supabase_anon_key_here");

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!isConfigured) return null;

  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export const defaultSeedTracks: SupabaseTrackRow[] = [
  {
    id: "1",
    title: "Da’LLas G’ Hustle",
    mood: "Hustle",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 0,
    skips: 0,
    completes: 0,
    replays: 0,
  },
  {
    id: "2",
    title: "Da’LLas G’ After Hours",
    mood: "Late Night",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 0,
    skips: 0,
    completes: 0,
    replays: 0,
  },
  {
    id: "3",
    title: "Da’LLas G’ Focus Loop",
    mood: "Focus",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 0,
    skips: 0,
    completes: 0,
    replays: 0,
  },
];

export async function loadTracksFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("plays", { ascending: false });

  if (error) throw error;
  return (data ?? []) as SupabaseTrackRow[];
}

export async function seedTracksInSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { error } = await supabase
    .from("tracks")
    .upsert(defaultSeedTracks, { onConflict: "id" });

  if (error) throw error;
  return true;
}

export async function patchTrackInSupabase(
  id: string,
  updates: Partial<SupabaseTrackRow>
) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { error } = await supabase.from("tracks").update(updates).eq("id", id);

  if (error) throw error;
  return true;
}
