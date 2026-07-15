"use client";

import { useEffect, useRef } from "react";

export function ExperienceLayer() {
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const progress = progressRef.current;
    let frame = 0;

    function updatePointer(event: PointerEvent) {
      if (!glow || event.pointerType === "touch") return;
      glow.style.setProperty("--pointer-x", `${event.clientX}px`);
      glow.style.setProperty("--pointer-y", `${event.clientY}px`);
    }

    function updateProgress() {
      if (!progress) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = available > 0 ? window.scrollY / available : 0;
        progress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      });
    }

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <div ref={glowRef} className="pointer-glow" aria-hidden="true" />
    </>
  );
}
