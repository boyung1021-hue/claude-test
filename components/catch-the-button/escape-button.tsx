"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface EscapeButtonProps {
  onCatch: () => void;
  isActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ESCAPE_RADIUS = 80;
const BTN_W = 160;
const BTN_H = 56;

const BUTTON_COLORS = [
  { bg: "bg-primary", text: "text-primary-foreground", shadow: "#ec4899" },
  { bg: "bg-secondary", text: "text-secondary-foreground", shadow: "#f59e0b" },
  { bg: "bg-accent", text: "text-accent-foreground", shadow: "#14b8a6" },
];

function getRandomPos(containerW: number, containerH: number) {
  const x = Math.random() * (containerW - BTN_W);
  const y = Math.random() * (containerH - BTN_H);
  return { x: Math.max(0, x), y: Math.max(0, y) };
}

export default function EscapeButton({ onCatch, isActive, containerRef }: EscapeButtonProps) {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [colorIdx, setColorIdx] = useState(0);
  const [isEscaping, setIsEscaping] = useState(false);
  const [wobble, setWobble] = useState(false);
  const posRef = useRef({ x: 100, y: 100 });

  const escape = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    const newPos = getRandomPos(width, height);
    posRef.current = newPos;
    setPos(newPos);
    setColorIdx((prev) => (prev + 1) % BUTTON_COLORS.length);
    setIsEscaping(true);
    setWobble(true);
    setTimeout(() => setIsEscaping(false), 300);
    setTimeout(() => setWobble(false), 400);
  }, [containerRef]);

  // Initialize button position centered in container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    const initialPos = { x: width / 2 - BTN_W / 2, y: height / 2 - BTN_H / 2 };
    posRef.current = initialPos;
    setPos(initialPos);
  }, [containerRef]);

  // Mouse proximity detection
  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const btnCX = posRef.current.x + BTN_W / 2;
      const btnCY = posRef.current.y + BTN_H / 2;
      const dist = Math.hypot(mouseX - btnCX, mouseY - btnCY);
      if (dist < ESCAPE_RADIUS) {
        escape();
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, escape, containerRef]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive) return;
      e.stopPropagation();
      onCatch();
      // Burst then escape
      escape();
    },
    [isActive, onCatch, escape]
  );

  // Touch: escape on touchstart (before tap registers)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isActive) return;
      e.stopPropagation();
      onCatch();
      escape();
    },
    [isActive, onCatch, escape]
  );

  const color = BUTTON_COLORS[colorIdx];

  return (
    <button
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      aria-label="Catch this button!"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: BTN_W,
        height: BTN_H,
        transition: isEscaping
          ? "left 0.18s cubic-bezier(0.34,1.56,0.64,1), top 0.18s cubic-bezier(0.34,1.56,0.64,1)"
          : "left 0.12s ease-out, top 0.12s ease-out",
        boxShadow: `0 6px 0 ${color.shadow}, 0 0 24px ${color.shadow}88`,
        transform: wobble ? "scale(0.88) rotate(-4deg)" : "scale(1) rotate(0deg)",
        zIndex: 10,
      }}
      className={`
        ${color.bg} ${color.text}
        rounded-2xl font-pixel text-xs
        border-2 border-white/20
        select-none cursor-crosshair
        flex items-center justify-center gap-2
        transition-transform duration-200
        hover:brightness-110
        active:translate-y-1
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
      `}
    >
      <span className="text-lg leading-none">👆</span>
      <span className="leading-relaxed">CATCH ME</span>
    </button>
  );
}
