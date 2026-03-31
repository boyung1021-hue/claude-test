"use client";

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

interface RankData {
  rank: string;
  label: string;
  color: string;
  glow: string;
  bg: string;
  stars: number;
}

function getRank(score: number): RankData {
  if (score >= 15)
    return {
      rank: "S",
      label: "Superhuman reflexes!",
      color: "text-secondary",
      glow: "oklch(0.82 0.2 88)",
      bg: "bg-secondary/10 border-secondary/40",
      stars: 5,
    };
  if (score >= 10)
    return {
      rank: "A",
      label: "Impressive!",
      color: "text-accent",
      glow: "oklch(0.68 0.22 180)",
      bg: "bg-accent/10 border-accent/40",
      stars: 4,
    };
  if (score >= 5)
    return {
      rank: "B",
      label: "Not bad!",
      color: "text-primary",
      glow: "oklch(0.65 0.3 350)",
      bg: "bg-primary/10 border-primary/40",
      stars: 3,
    };
  return {
    rank: "C",
    label: "Keep practicing!",
    color: "text-muted-foreground",
    glow: "oklch(0.65 0.04 264)",
    bg: "bg-muted/40 border-border",
    stars: 1,
  };
}

export default function ResultScreen({ score, onPlayAgain }: ResultScreenProps) {
  const rankData = getRank(score);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 text-center">
      {/* Time's up */}
      <div>
        <p className="font-pixel text-[10px] text-muted-foreground tracking-widest uppercase mb-3">
          Time&apos;s Up!
        </p>
        <h2
          className="font-pixel text-xl sm:text-2xl text-foreground text-balance"
          style={{ textShadow: "0 0 20px oklch(0.65 0.3 350 / 0.6)" }}
        >
          GAME OVER
        </h2>
      </div>

      {/* Score display */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-pixel text-[9px] text-muted-foreground tracking-widest uppercase">
          Final Score
        </span>
        <div
          className="font-pixel text-6xl sm:text-7xl text-secondary leading-none"
          style={{ textShadow: `0 0 30px ${rankData.glow}, 0 6px 0 oklch(0.5 0.18 88)` }}
        >
          {score}
        </div>
        <span className="font-sans text-sm text-muted-foreground">
          {score === 1 ? "catch" : "catches"}
        </span>
      </div>

      {/* Rank card */}
      <div
        className={`flex flex-col items-center gap-2 px-8 py-5 rounded-2xl border-2 ${rankData.bg} w-full max-w-xs`}
      >
        <div
          className={`font-pixel text-5xl sm:text-6xl ${rankData.color} leading-none`}
          style={{ textShadow: `0 0 28px ${rankData.glow}` }}
        >
          {rankData.rank}
        </div>
        <div className="font-pixel text-[9px] tracking-wider text-muted-foreground uppercase">
          Rank
        </div>
        <p className={`font-sans text-base font-semibold ${rankData.color}`}>
          {rankData.label}
        </p>
        {/* Stars */}
        <div className="flex gap-1 mt-1" aria-label={`${rankData.stars} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="text-lg"
              style={{ opacity: i < rankData.stars ? 1 : 0.2 }}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Play again */}
      <button
        onClick={onPlayAgain}
        className="font-pixel text-xs bg-primary text-primary-foreground px-8 py-4 rounded-2xl
          border-2 border-white/20 transition-all duration-150
          hover:brightness-110 active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ boxShadow: `0 6px 0 oklch(0.45 0.22 350), 0 0 24px oklch(0.65 0.3 350 / 0.5)` }}
      >
        PLAY AGAIN
      </button>

      {/* Rank legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-left">
        {[
          { r: "S", t: "15+ catches" },
          { r: "A", t: "10–14 catches" },
          { r: "B", t: "5–9 catches" },
          { r: "C", t: "0–4 catches" },
        ].map(({ r, t }) => (
          <div key={r} className="flex items-center gap-2">
            <span
              className={`font-pixel text-[10px] ${
                r === rankData.rank ? rankData.color : "text-muted-foreground/50"
              }`}
            >
              {r}
            </span>
            <span className="font-sans text-xs text-muted-foreground">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
