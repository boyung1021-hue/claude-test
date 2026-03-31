"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import EscapeButton from "./escape-button";
import GameHUD from "./game-hud";
import ResultScreen from "./result-screen";
import StartScreen from "./start-screen";

type GameState = "idle" | "playing" | "over";

const TOTAL_TIME = 30;

// Floating score +1 particle
interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function CatchTheButtonGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const particleIdRef = useRef(0);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setParticles([]);
    setGameState("playing");
  }, []);

  const endGame = useCallback(() => {
    setGameState("over");
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Countdown tick
  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Defer state change to avoid setState-during-render
          setTimeout(() => setGameState("over"), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleCatch = useCallback(() => {
    setScore((s) => s + 1);

    // Spawn floating +1 particle near button area
    const container = containerRef.current;
    if (container) {
      const { width, height } = container.getBoundingClientRect();
      const id = ++particleIdRef.current;
      const x = Math.random() * (width - 60) + 20;
      const y = Math.random() * (height * 0.6) + height * 0.2;
      setParticles((prev) => [...prev.slice(-5), { id, x, y }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 900);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 overflow-hidden select-none"
      aria-label="Catch the Button game arena"
    >
      {/* Animated dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.32 0.06 264) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Corner glow accents */}
      <div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.3 350 / 0.15), transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.22 180 / 0.15), transparent 70%)" }}
        aria-hidden="true"
      />

      {/* HUD — always visible during play */}
      {gameState === "playing" && (
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <GameHUD score={score} timeLeft={timeLeft} totalTime={TOTAL_TIME} />
        </div>
      )}

      {/* Game arena */}
      {gameState === "playing" && (
        <EscapeButton
          onCatch={handleCatch}
          isActive={gameState === "playing"}
          containerRef={containerRef}
        />
      )}

      {/* Floating +1 particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none font-pixel text-secondary z-30"
          style={{
            left: p.x,
            top: p.y,
            fontSize: "1.1rem",
            textShadow: "0 0 10px oklch(0.82 0.2 88)",
            animation: "floatUp 0.9s ease-out forwards",
          }}
          aria-hidden="true"
        >
          +1
        </div>
      ))}

      {/* Overlay screens */}
      {(gameState === "idle" || gameState === "over") && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative z-10 w-full max-w-sm mx-auto">
            {gameState === "idle" && <StartScreen onStart={startGame} />}
            {gameState === "over" && (
              <ResultScreen score={score} onPlayAgain={startGame} />
            )}
          </div>
        </div>
      )}

      {/* Float-up keyframes */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateY(-48px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-80px) scale(0.8); }
        }
      `}</style>
    </div>
  );
}
