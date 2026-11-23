"use client";

interface ProgressIndicatorProps {
  progress: number; // 0.0 to 1.0
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-border/30 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-terracotta/80 transition-all duration-75 ease-out"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
