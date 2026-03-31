import CatchTheButtonGame from "@/components/catch-the-button/game";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-border"
        style={{
          height: "min(600px, 90dvh)",
          boxShadow:
            "0 0 60px oklch(0.65 0.3 350 / 0.25), 0 0 120px oklch(0.68 0.22 180 / 0.15), 0 2px 0 oklch(0.32 0.06 264) inset",
          background: "oklch(0.16 0.04 264)",
        }}
      >
        <CatchTheButtonGame />
      </div>

      {/* Footer */}
      <p className="mt-4 font-sans text-xs text-muted-foreground/60">
        Move your cursor close to the button — it will run away!
      </p>
    </main>
  );
}
