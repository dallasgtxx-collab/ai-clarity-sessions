"use client";

import { useState } from "react";

const paths = [
  {
    id: "begin",
    label: "I’m brand new",
    title: "Beginner Session",
    price: "$49",
    reason: "Build comfort, understand the basics, and use AI correctly for the first time.",
    accent: "from-cyan-300 to-blue-500",
  },
  {
    id: "apply",
    label: "I want real results",
    title: "Practical Workshop",
    price: "$99",
    reason: "Practice useful workflows for life, work, school, content, and business.",
    accent: "from-violet-400 to-fuchsia-400",
  },
  {
    id: "master",
    label: "I want the full system",
    title: "AI Clarity Bootcamp",
    price: "$199",
    reason: "Spend a full day building deeper skills, projects, strategy, and a personal action plan.",
    accent: "from-lime-300 to-emerald-400",
  },
] as const;

export function SessionRecommender() {
  const [selectedId, setSelectedId] = useState<(typeof paths)[number]["id"]>("apply");
  const selected = paths.find((path) => path.id === selectedId) ?? paths[1];

  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="future-panel overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
            <p className="section-kicker">Adaptive guidance</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Your path should fit your ambition.
            </h2>
            <p className="mt-5 leading-7 text-white/60">
              Choose what sounds most like you. The experience recommends the
              clearest starting point instantly.
            </p>
            <div className="mt-7 grid gap-3" role="group" aria-label="Choose your learning goal">
              {paths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  aria-pressed={path.id === selectedId}
                  onClick={() => setSelectedId(path.id)}
                  className="path-choice"
                >
                  <span>{path.label}</span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[28rem] items-center p-7 sm:p-10">
            <div className={`absolute inset-0 bg-gradient-to-br ${selected.accent} opacity-[0.12] transition-colors`} />
            <div className="relative w-full">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
                Your recommended experience
              </p>
              <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
                <h3 className="max-w-lg text-4xl font-black tracking-tight sm:text-6xl">
                  {selected.title}
                </h3>
                <p className="text-5xl font-black">{selected.price}</p>
              </div>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                {selected.reason}
              </p>
              <a href="#pricing" className="magnetic-cta mt-8 inline-flex rounded-2xl px-7 py-4 font-black text-slate-950">
                See this experience →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
