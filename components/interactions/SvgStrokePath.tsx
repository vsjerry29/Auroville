"use client";

interface SvgStrokePathProps {
  progress?: number;
  className?: string;
}

export default function SvgStrokePath({ progress = 0, className = "" }: SvgStrokePathProps) {
  // Clamped progress between 0 and 1
  const p = Math.min(1, Math.max(0, progress));
  const offset = 100 - p * 100;

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Concentric drafting compass arcs */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="var(--ink)"
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeDasharray="4 6"
      />
      <circle
        cx="200"
        cy="200"
        r="140"
        stroke="var(--ink)"
        strokeWidth="1"
        strokeOpacity="0.35"
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={offset}
      />
      <circle
        cx="200"
        cy="200"
        r="90"
        stroke="var(--terracotta)"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={offset * 1.2}
      />

      {/* Radial axes */}
      <line
        x1="20"
        y1="200"
        x2="380"
        y2="200"
        stroke="var(--ink)"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />
      <line
        x1="200"
        y1="20"
        x2="200"
        y2="380"
        stroke="var(--ink)"
        strokeWidth="0.8"
        strokeOpacity="0.3"
      />

      {/* Diagonal drafting ticks */}
      <line
        x1="72"
        y1="72"
        x2="328"
        y2="328"
        stroke="var(--ink)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        strokeDasharray="2 4"
      />
      <line
        x1="72"
        y1="328"
        x2="328"
        y2="72"
        stroke="var(--ink)"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        strokeDasharray="2 4"
      />

      {/* Central marker ticks */}
      <circle cx="200" cy="200" r="3" fill="var(--terracotta)" />
      <circle cx="200" cy="60" r="2" fill="var(--ink)" opacity="0.5" />
      <circle cx="200" cy="340" r="2" fill="var(--ink)" opacity="0.5" />
      <circle cx="60" cy="200" r="2" fill="var(--ink)" opacity="0.5" />
      <circle cx="340" cy="200" r="2" fill="var(--ink)" opacity="0.5" />
    </svg>
  );
}
