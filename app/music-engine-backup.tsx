"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultSeedTracks,
  loadTracksFromSupabase,
  patchTrackInSupabase,
  seedTracksInSupabase,
  type SupabaseTrackRow,
} from "@/lib/supabase";

type Track = SupabaseTrackRow;
type Mode = "Hustle" | "Late Night" | "Focus";

function calcHeat(t: Track) {
  return t.completes * 3 + t.replays * 4 + t.plays - t.skips * 2;
}

const fallbackTracks: Track[] = defaultSeedTracks;

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [mode, setMode] = useState<Mode>("Hustle");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>(fallbackTracks);
  const [status, setStatus] = useState("Loading adaptive engine...");
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  // ---------- BOOTSTRAP ----------
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const remoteTracks = await loadTracksFromSupabase();

        if (remoteTracks?.length) {
          setTracks(remoteTracks);
          setStatus("Live Supabase data connected.");
          setIsSupabaseReady(true);
          return;
        }

        await seedTracksInSupabase();

        const seeded = await loadTracksFromSupabase();

        if (seeded?.length) {
          setTracks(seeded);
          setStatus("Seeded tracks into Supabase.");
          setIsSupabaseReady(true);
          return;
        }

        setTracks(fallbackTracks);
        setStatus("Using local demo tracks.");
      } catch (err) {
        console.error(err);
        setTracks(fallbackTracks);
        setStatus("Supabase not configured; using local data.");
      }
    };

    void bootstrap();
  }, []);

  // ---------- PLAYLIST ----------
  const playlist = useMemo(() => {
    return [...tracks]
      .filter((t) => t.mood === mode)
      .sort((a, b) => calcHeat(b) - calcHeat(a));
  }, [tracks, mode]);

  const currentTrack = tracks.find((t) => t.id === currentId);

  // ---------- UPDATE TRACK ----------
  const updateTrack = useCallback(
    async (id: string, update: Partial<Track>) => {
      setTracks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...update } : t))
      );

      if (isSupabaseReady) {
        try {
          await patchTrackInSupabase(id, update);
        } catch (err) {
          console.error(err);
        }
      }
    },
    [isSupabaseReady]
  );

  // ---------- PLAY TRACK ----------
  const playTrack = useCallback(
    async (track: Track) => {
      if (!audioRef.current) return;

      const isSame = currentId === track.id;

      if (isSame) {
        audioRef.current.pause();
        await updateTrack(track.id, { replays: track.replays + 1 });
        setCurrentId(null);
        return;
      }

      audioRef.current.src = track.src;
      await audioRef.current.play();

      await updateTrack(track.id, { plays: track.plays + 1 });
      setCurrentId(track.id);
    },
    [currentId, updateTrack]
  );

  // ---------- NEXT TRACK ----------
  const nextTrack = useCallback(() => {
    if (!currentTrack) return;

    const idx = playlist.findIndex((t) => t.id === currentTrack.id);
    const next = playlist[idx + 1];

    if (next) void playTrack(next);
  }, [currentTrack, playlist, playTrack]);

  // ---------- AUDIO END ----------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (!currentTrack) return;

      void updateTrack(currentTrack.id, {
        completes: currentTrack.completes + 1,
      });

      nextTrack();
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [currentTrack, updateTrack, nextTrack]);

  // ---------- UI ----------
  return (
    <main style={styles.main}>
      <div style={styles.modes}>
        {(["Hustle", "Late Night", "Focus"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              ...styles.modeBtn,
              background: mode === m ? "#ff004f" : "#222",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={styles.header}>
        <h1>ADAPTIVE ENGINE</h1>
        <p>Tracks adapt based on listener behavior</p>
        <p style={styles.status}>{status}</p>
      </div>

      <div style={styles.grid}>
        {playlist.map((t) => (
          <div key={t.id} style={styles.card}>
            <h3>{t.title}</h3>
            <p style={{ opacity: 0.6 }}>{t.mood}</p>
            <p style={{ fontSize: 12 }}>Heat: {calcHeat(t)}</p>

            <button
              onClick={() => void playTrack(t)}
              style={{
                ...styles.btn,
                background: currentId === t.id ? "#ff004f" : "#333",
              }}
            >
              {currentId === t.id ? "Playing" : "Play"}
            </button>

            <div style={styles.stats}>
              <span>Plays: {t.plays}</span>
              <span>Replays: {t.replays}</span>
              <span>Completes: {t.completes}</span>
              <span>Skips: {t.skips}</span>
            </div>

            <button
              style={styles.skipBtn}
              onClick={() => {
                void updateTrack(t.id, { skips: t.skips + 1 });
                nextTrack();
              }}
            >
              Skip →
            </button>
          </div>
        ))}
      </div>

      <audio ref={audioRef} />
    </main>
  );
}

// ---------- STYLES ----------
const styles: Record<string, React.CSSProperties> = {
  main: {
    background: "#0a0a0a",
    color: "white",
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  modes: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  modeBtn: {
    padding: "10px 15px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 15,
  },
  card: {
    background: "#141414",
    padding: 15,
    border: "1px solid #222",
  },
  btn: {
    width: "100%",
    padding: 10,
    border: "none",
    color: "white",
    cursor: "pointer",
    marginTop: 10,
  },
  skipBtn: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    background: "#111",
    border: "1px solid #333",
    color: "white",
    cursor: "pointer",
  },
  stats: {
    marginTop: 10,
    fontSize: 11,
    opacity: 0.7,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    opacity: 0.8,
  },
};