"use client";

interface HUDProps {
  score: number;
  timeLeft: number;
  totalTime: number;
}

export default function GameHUD({ score, timeLeft, totalTime }: HUDProps) {
  const pct = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="flex flex-col gap-3 w-full px-4 pt-4 pb-2 select-none">
      {/* Score & Timer row */}
      <div className="flex items-center justify-between gap-4">
        {/* Score */}
        <div className="flex flex-col items-start">
          <span className="text-muted-foreground font-pixel text-[8px] tracking-widest uppercase mb-1">
            Score
          </span>
          <div
            className="font-pixel text-2xl text-secondary leading-none"
            style={{ textShadow: "0 0 12px oklch(0.82 0.2 88)" }}
          >
            {String(score).padStart(2, "0")}
          </div>
        </div>

        {/* Title */}
        <div className="hidden sm:block font-pixel text-[9px] text-primary tracking-widest text-center"
          style={{ textShadow: "0 0 10px oklch(0.65 0.3 350)" }}
        >
          CATCH THE<br />BUTTON!
        </div>

        {/* Timer */}
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground font-pixel text-[8px] tracking-widest uppercase mb-1">
            Time
          </span>
          <div
            className={`font-pixel text-2xl leading-none ${
              isCritical ? "text-destructive animate-pulse" : isLow ? "text-chart-5" : "text-accent"
            }`}
            style={{
              textShadow: isCritical
                ? "0 0 14px oklch(0.62 0.26 25)"
                : isLow
                ? "0 0 10px oklch(0.769 0.188 70)"
                : "0 0 10px oklch(0.68 0.22 180)",
            }}
          >
            {String(timeLeft).padStart(2, "0")}s
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isCritical ? "bg-destructive" : isLow ? "bg-chart-5" : "bg-accent"
          }`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={timeLeft}
          aria-valuemin={0}
          aria-valuemax={totalTime}
          aria-label={`${timeLeft} seconds remaining`}
        />
      </div>
    </div>
  );
}
