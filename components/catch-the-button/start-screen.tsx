"use client";

import { useEffect, useState } from "react";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 text-center">
      {/* Title */}
      <div className="flex flex-col gap-3">
        <div
          className="font-pixel text-2xl sm:text-3xl text-primary leading-relaxed text-balance"
          style={{ textShadow: "0 0 20px oklch(0.65 0.3 350), 0 4px 0 oklch(0.45 0.22 350)" }}
        >
          CATCH THE
          <br />
          BUTTON!
        </div>
        <p className="font-sans text-muted-foreground text-sm text-balance leading-relaxed max-w-xs">
          The button will try to escape your cursor. Catch it as many times as you can in <strong className="text-secondary">30 seconds</strong>!
        </p>
      </div>

      {/* Animated hint */}
      <div
        className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-muted/40 border border-border max-w-xs"
      >
        <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground">
          <span className="text-2xl" aria-hidden="true">🖱️</span>
          <span className="leading-relaxed">Move your cursor near the button — it runs!</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-sans text-muted-foreground">
          <span className="text-2xl" aria-hidden="true">👆</span>
          <span className="leading-relaxed">On mobile, touch it before it escapes!</span>
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="font-pixel text-xs bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl
          border-2 border-white/20 transition-all duration-150
          hover:brightness-110 active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{
          boxShadow: `0 6px 0 oklch(0.52 0.16 55), 0 0 24px oklch(0.82 0.2 88 / 0.5)`,
          transform: pulse ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.35s ease, box-shadow 0.35s ease",
        }}
      >
        START GAME
      </button>

      {/* Rank legend */}
      <div className="flex flex-col items-start gap-1 text-left">
        <p className="font-pixel text-[8px] text-muted-foreground tracking-widest uppercase mb-2">
          Ranks
        </p>
        {[
          { r: "S", t: "15+", desc: "Superhuman" },
          { r: "A", t: "10–14", desc: "Impressive" },
          { r: "B", t: "5–9", desc: "Not bad" },
          { r: "C", t: "0–4", desc: "Keep trying" },
        ].map(({ r, t, desc }) => (
          <div key={r} className="flex items-center gap-3">
            <span className="font-pixel text-[10px] text-primary w-3">{r}</span>
            <span className="font-sans text-xs text-muted-foreground">
              {t} — {desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
