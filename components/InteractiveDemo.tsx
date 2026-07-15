"use client";

import { useState } from "react";

const examples = [
  {
    id: "business",
    label: "Grow a business",
    prompt: "Help me turn my service into a clear offer people understand.",
    result:
      "Start with one promise: who you help, the problem you solve, and the result they receive. Then create a simple three-step package with a clear price and next action.",
  },
  {
    id: "creator",
    label: "Create content",
    prompt: "Give me a week of content ideas without sounding repetitive.",
    result:
      "Build the week around five angles: teach, demonstrate, tell a story, answer a question, and invite action. One main idea can become a video, caption, carousel, and live topic.",
  },
  {
    id: "everyday",
    label: "Save time",
    prompt: "Organize my busy week into something I can actually follow.",
    result:
      "List your fixed commitments first, choose three weekly priorities, then assign one focused block to each. Leave breathing room so the plan survives real life.",
  },
] as const;

export function InteractiveDemo() {
  const [selectedId, setSelectedId] = useState<(typeof examples)[number]["id"]>(
    "business",
  );
  const selected = examples.find((example) => example.id === selectedId) ?? examples[0];

  return (
    <section id="demo" className="relative overflow-hidden border-y border-white/10 bg-slate-900/70">
      <div className="demo-glow" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="reveal-section">
          <p className="section-kicker">Try the feeling</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            See how fast confusion can become clarity.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/65">
            Pick a real-life goal. This mini demonstration shows the kind of
            practical thinking you will learn to get from AI—without technical
            language.
          </p>
          <div className="mt-7 flex flex-wrap gap-3" role="group" aria-label="Choose an AI example">
            {examples.map((example) => (
              <button
                key={example.id}
                type="button"
                aria-pressed={selectedId === example.id}
                onClick={() => setSelectedId(example.id)}
                className="demo-choice"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-console reveal-section" aria-live="polite">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
            <span className="h-3 w-3 rounded-full bg-pink-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-lime-300" />
            <span className="ml-2 text-xs font-black uppercase tracking-[0.18em] text-white/40">
              AI clarity preview
            </span>
          </div>
          <div className="space-y-5 p-5 sm:p-7">
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-gradient-to-r from-cyan-300 to-lime-300 p-4 font-bold leading-7 text-slate-950">
              {selected.prompt}
            </div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-violet-300/20 bg-violet-400/10 p-5 leading-7 text-white/80">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-violet-200">
                Clear next step
              </span>
              {selected.result}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
