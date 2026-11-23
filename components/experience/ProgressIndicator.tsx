"use client";

interface ProgressIndicatorProps {
  progress: number; // 0.0 to 1.0
}

export default function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const percentage = Math.round(progress * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-12 py-4 flex items-center justify-between pointer-events-none select-none">
      {/* Bottom-left: Editorial cue */}
      <div className="text-[10px] md:text-[11px] font-mono tracking-widest text-ink-muted uppercase flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
        <span>REVERSIBLE CHOREOGRAPHY</span>
      </div>

      {/* Center / Bottom: Thin Progress hairline */}
      <div className="hidden sm:flex items-center gap-4 w-1/3 max-w-xs">
        <span className="font-mono text-[9px] text-ink-faint">0%</span>
        <div className="relative flex-1 h-[2px] bg-border overflow-hidden rounded-full">
          <div
            className="absolute top-0 bottom-0 left-0 bg-ink transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="font-mono text-[9px] text-ink-faint">100%</span>
      </div>

      {/* Bottom-right: Scroll to explore & Numerical indicator */}
      <div className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-widest text-ink uppercase">
        <span className="text-ink-muted hidden md:inline">SCROLL TO DISCOVER</span>
        <span className="w-[1px] h-3 bg-border hidden md:inline" />
        <span className="text-terracotta font-medium">{percentage}%</span>
      </div>
    </div>
  );
}
