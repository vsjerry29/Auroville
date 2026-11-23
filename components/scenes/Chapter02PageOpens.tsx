"use client";

import { useState } from "react";
import Image from "next/image";
import PaperFold from "@/components/interactions/PaperFold";
import StoryPath from "@/components/interactions/StoryPath";
import { Info, X } from "lucide-react";

interface Chapter02PageOpensProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter02PageOpens({
  progress,
  active,
}: Chapter02PageOpensProps) {
  // Normalize progress for Scene 02 (0.22 to 0.45)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.22) / 0.23));

  // Selected landmark hotspot (Interaction I018)
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  if (!active && (progress < 0.20 || progress > 0.48)) {
    return null;
  }

  // Phase choreography:
  // Phase 1 (0.00 to 0.40): Paper fold opens from right edge, revealing panorama (I011 & I012)
  // Phase 2 (0.40 to 0.75): Full panorama immersion, path drawing, and editorial statement (I013 & I017)
  // Phase 3 (0.75 to 1.00): Path contour contracts and curves into Chapter 03 circular baseline (I020)

  const foldOpenProgress = Math.min(1, Math.max(0, localProgress / 0.45));
  const statementEnter = Math.min(1, Math.max(0, (localProgress - 0.25) / 0.25));
  const statementExit = Math.min(1, Math.max(0, (localProgress - 0.70) / 0.20));
  const statementOpacity = statementEnter * (1 - statementExit);

  // Foreground botanical parallax offset (Interaction I013: < 4% viewport)
  const fgParallaxX = (localProgress - 0.5) * -30; // max ~30px displacement
  const fgParallaxY = (localProgress - 0.5) * -15;

  // Handoff to Scene 03 (I020)
  const handoffProgress = Math.min(1, Math.max(0, (localProgress - 0.75) / 0.25));

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{
        zIndex: 15,
        visibility: progress >= 0.20 && progress <= 0.48 ? "visible" : "hidden",
      }}
    >
      {/* BACKGROUND WARM PAPER */}
      <div className="absolute inset-0 bg-paper paper-texture" />

      {/* PAPER FOLD MECHANISM (Interactions I011 & I015) */}
      <PaperFold scrollProgress={foldOpenProgress} className="w-full h-full">
        {/* THE HIGH-RESOLUTION ILLUSTRATED PANORAMA (Interaction I012) */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Master 16:9 Landscape Illustration (Desktop) */}
          <div
            className="hidden sm:block absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${1.04 - localProgress * 0.04})`,
            }}
          >
            <Image
              src="/illustrated/ch02-page/panorama-master.webp"
              alt="High-resolution original hand-drawn panorama of Auroville red-earth landscape and Matrimandir"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 50%" }}
              priority
            />
          </div>

          {/* Composed Vertical Panorama (Mobile Portrait) */}
          <div className="block sm:hidden absolute inset-0 w-full h-full">
            <Image
              src="/illustrated/ch02-page/panorama-mobile.webp"
              alt="Hand-drawn vertical panorama composed for mobile screens"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
            />
          </div>

          {/* FOREGROUND BOTANICAL PARALLAX LAYER (Interaction I013) */}
          <div
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${fgParallaxX}px, ${fgParallaxY}px) scale(1.03)`,
              opacity: 0.95,
            }}
          >
            <Image
              src="/illustrated/ch02-page/panorama-botanical-fg.webp"
              alt="Foreground botanical branch and tropical dry evergreen foliage"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 50%" }}
              priority
            />
          </div>

          {/* RED EARTH PATH CONTOUR (Interaction I017 & I020) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <StoryPath
              progress={Math.min(1, Math.max(0, (localProgress - 0.25) / 0.55))}
              variant="terrain-trail"
            />
          </div>

          {/* INTERACTIVE LANDMARK HOTSPOTS (Interaction I018) */}
          <div className="absolute inset-0 pointer-events-auto">
            {/* Hotspot 01: Matrimandir Dome */}
            <button
              onClick={() => setSelectedHotspot("dome")}
              aria-label="Inspect Matrimandir Sphere Landmark"
              className="absolute top-[28%] right-[28%] md:right-[32%] w-9 h-9 rounded-full bg-paper/85 border border-terracotta text-terracotta flex items-center justify-center font-mono text-[10px] shadow-md hover:scale-110 transition-transform duration-200"
            >
              <Info size={14} />
            </button>

            {/* Hotspot 02: Red Earth Trail */}
            <button
              onClick={() => setSelectedHotspot("trail")}
              aria-label="Inspect Red Laterite Trail"
              className="absolute bottom-[26%] left-[22%] md:left-[26%] w-8 h-8 rounded-full bg-paper/85 border border-forest text-forest flex items-center justify-center font-mono text-[10px] shadow-md hover:scale-110 transition-transform duration-200"
            >
              <Info size={12} />
            </button>
          </div>

          {/* HOTSPOT POPUP INSET (Interaction I018) */}
          {selectedHotspot && (
            <div
              role="dialog"
              aria-modal="true"
              className="absolute z-40 top-24 right-6 md:right-16 max-w-sm bg-paper border border-border archival-shadow p-5 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-mono text-[9px] uppercase tracking-widest text-terracotta font-semibold">
                  {selectedHotspot === "dome"
                    ? "LANDMARK · PEACE AREA"
                    : "ENVIRONMENT · GREEN BELT"}
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  aria-label="Close landmark study"
                  className="p-1 text-ink-muted hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>

              <h4 className="font-serif italic text-xl text-ink font-light mt-2">
                {selectedHotspot === "dome"
                  ? "The Geodesic Sphere"
                  : "The Red Laterite Trail"}
              </h4>
              <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
                {selectedHotspot === "dome"
                  ? "Crowned with 1,415 hand-gilded concave discs, set within twelve radial gardens and the amphitheater."
                  : "Hand-planted tropical dry evergreen paths regenerate the once-eroded laterite plateau of southern India."}
              </p>
            </div>
          )}

          {/* EDITORIAL STATEMENT (Refined, Non-Intrusive Proportions) */}
          <div
            className="absolute z-30 left-6 md:left-14 bottom-14 md:bottom-20 max-w-lg p-5 md:p-6 bg-paper/75 backdrop-blur-sm border-l-2 border-terracotta archival-shadow-subtle transition-all duration-100 ease-out pointer-events-none"
            style={{
              opacity: statementOpacity,
              transform: `translateY(${(1 - statementEnter) * 20}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-1.5 font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-terracotta font-semibold">
              <span>CHAPTER 02 / THE PAGE OPENS</span>
              <span className="w-5 h-[1px] bg-terracotta/50" />
              <span className="text-ink-muted">DRAWING INTO REALITY</span>
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink font-light tracking-tight leading-tight">
              From a single mark,
            </h2>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-terracotta tracking-tight mt-0.5">
              AN ILLUSTRATED WORLD.
            </h3>

            <p className="mt-2.5 font-sans text-xs text-ink-muted leading-relaxed font-light">
              Red laterite earth paths cut through millions of indigenous trees hand-planted to
              regenerate the plateau, culminating in the golden sphere of central Auroville.
            </p>
          </div>

          {/* ARCHIVAL CORNER STAMP & CAPTION */}
          <div className="absolute top-20 left-6 md:left-12 z-20 pointer-events-none font-mono text-[9px] uppercase tracking-widest text-ink-muted hidden sm:block">
            <span>PLATE 02 · PANORAMA OF THE RED EARTH</span>
          </div>

          {/* HANDOFF OVERLAY TO CHAPTER 03 (Interaction I020) */}
          {handoffProgress > 0 && (
            <div
              className="absolute inset-0 bg-paper transition-opacity duration-300 pointer-events-none"
              style={{ opacity: handoffProgress }}
            />
          )}
        </div>
      </PaperFold>
    </div>
  );
}
