"use client";

interface StoryPathProps {
  progress: number; // 0.0 to 1.0
  className?: string;
  variant?: "hero-to-fold" | "terrain-trail" | "radial-blueprint";
}

export default function StoryPath({
  progress,
  className = "",
  variant = "hero-to-fold",
}: StoryPathProps) {
  // Clamp progress between 0 and 1
  const p = Math.min(1, Math.max(0, progress));

  if (variant === "hero-to-fold") {
    // A clean architectural pencil stroke traveling from center-portal to right page edge
    const strokeDashoffset = (1 - p) * 1000;

    return (
      <svg
        viewBox="0 0 1000 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-auto pointer-events-none select-none ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M 0 100 Q 250 80, 500 110 T 1000 100"
          stroke="#5B5751"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-75"
        />
        {/* Tiny graphite pencil marker at current tip */}
        {p > 0.02 && p < 0.98 && (
          <circle
            cx={p * 1000}
            cy={100 + Math.sin(p * Math.PI * 2) * 10}
            r="2.5"
            fill="#B75E3F"
            className="animate-pulse"
          />
        )}
      </svg>
    );
  }

  if (variant === "terrain-trail") {
    // Traces the curving red-earth path from lower-left to Matrimandir sphere
    const strokeDashoffset = (1 - p) * 1200;

    return (
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full pointer-events-none select-none ${className}`}
        preserveAspectRatio="none"
      >
        <path
          d="M 120 580 C 220 520, 240 440, 200 360 C 160 280, 280 240, 420 220 C 560 200, 680 240, 720 210"
          stroke="#B75E3F"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1200"
          strokeDashoffset={strokeDashoffset}
          style={{ opacity: 0.85 }}
        />
      </svg>
    );
  }

  return null;
}
