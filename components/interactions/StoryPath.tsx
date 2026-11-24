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
          stroke="#4A453E"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-75"
        />
      </svg>
    );
  }

  if (variant === "terrain-trail") {
    // Delicate, hand-drawn pencil hatching that organically follows the red-earth path
    // Zero thick CAD vector arcs; merges naturally into the illustrated terrain
    const strokeDashoffset = (1 - p) * 1400;

    return (
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full pointer-events-none select-none ${className}`}
        preserveAspectRatio="none"
      >
        {/* Fine graphite center guide line */}
        <path
          d="M 120 580 C 220 520, 240 440, 200 360 C 160 280, 280 240, 420 220 C 560 200, 680 240, 720 210"
          stroke="#5A422D"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray="4 3"
          strokeDashoffset={strokeDashoffset}
          opacity="0.55"
        />
        {/* Soft terracotta pencil tone hugging the path */}
        <path
          d="M 120 580 C 220 520, 240 440, 200 360 C 160 280, 280 240, 420 220 C 560 200, 680 240, 720 210"
          stroke="#B75E3F"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="1400"
          strokeDashoffset={strokeDashoffset}
          opacity="0.4"
        />
      </svg>
    );
  }

  return null;
}
