"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import PaperFold from "@/components/interactions/PaperFold";
import StoryPath from "@/components/interactions/StoryPath";
import LivingContourField from "@/components/experience/LivingContourField";
import { X, Compass } from "lucide-react";

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

  // Selected landmark hotspot
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isHoveringTrail, setIsHoveringTrail] = useState(false);

  if (!active && (progress < 0.20 || progress > 0.48)) {
    return null;
  }

  // Phase choreography:
  // Phase 1 (0.00 to 0.45): Paper fold opens from right edge, revealing panorama
  // Phase 2 (0.45 to 0.78): Full panorama immersion, path drawing, and quiet statement
  // Phase 3 (0.78 to 1.00): Path contour straightens into Chapter 03 architectural baseline
  const foldOpenProgress = Math.min(1, Math.max(0, localProgress / 0.42));
  const statementEnter = Math.min(1, Math.max(0, (localProgress - 0.20) / 0.25));
  const statementExit = Math.min(1, Math.max(0, (localProgress - 0.75) / 0.20));
  const statementOpacity = statementEnter * (1 - statementExit);

  // Foreground botanical parallax offset (< 4% viewport)
  const fgParallaxX = (localProgress - 0.5) * -24;
  const fgParallaxY = (localProgress - 0.5) * -12;

  // Handoff to Scene 03: the red earth path line straightens into Chapter 03's baseline
  const handoffProgress = Math.min(1, Math.max(0, (localProgress - 0.80) / 0.20));

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-paper"
      style={{
        zIndex: 15,
        visibility: progress >= 0.20 && progress <= 0.48 ? "visible" : "hidden",
      }}
    >
      {/* 21ST MCP LIVING CONTOUR FIELD (Topographic Drafting Contours) */}
      <LivingContourField
        variant="landscape-topography"
        active={active}
        scrollProgress={localProgress}
        density={0.65}
      />

      {/* PAPER FOLD MECHANISM */}
      <PaperFold scrollProgress={foldOpenProgress} className="w-full h-full">
        {/* THE HIGH-RESOLUTION ILLUSTRATED PANORAMA */}
        <div
          className="relative w-full h-full overflow-hidden"
          onPointerMove={(e) => {
            // Check if cursor is over the lower-third / trail region
            const relativeY = e.clientY / window.innerHeight;
            setIsHoveringTrail(relativeY > 0.45 && relativeY < 0.85);
          }}
          onPointerLeave={() => setIsHoveringTrail(false)}
        >
          {/* Master 16:9 Landscape Illustration (Desktop) */}
          <div
            className="hidden sm:block absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `scale(${1.03 - localProgress * 0.03})`,
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

          {/* FOREGROUND BOTANICAL PARALLAX LAYER */}
          <div
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${fgParallaxX}px, ${fgParallaxY}px) scale(1.02)`,
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

          {/* RED EARTH PATH CONTOUR & INTERACTIVE HATCHING RESPONSE */}
          <div
            className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
              isHoveringTrail ? "opacity-100" : "opacity-85"
            }`}
          >
            <StoryPath
              progress={Math.min(1, Math.max(0, (localProgress - 0.20) / 0.60))}
              variant="terrain-trail"
            />
          </div>

          {/* SUBTLE ILLUSTRATED LANDMARK DISCOVERY POINTS (Zero generic button circles) */}
          <div className="absolute inset-0 pointer-events-auto">
            {/* Landmark 01: Matrimandir Dome (Accessible, organic marker) */}
            <button
              onClick={() => setSelectedHotspot("dome")}
              aria-label="Inspect Matrimandir Sphere Landmark"
              className="group absolute top-[28%] right-[29%] md:right-[33%] p-2 rounded-full text-terracotta hover:scale-105 transition-all duration-200 focus:outline-none"
            >
              <div className="w-6 h-6 rounded-full border border-terracotta/80 bg-paper/80 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-150 transition-transform" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 -bottom-6 px-2 py-0.5 bg-paper/95 border border-border text-[9px] font-mono uppercase tracking-widest text-ink whitespace-nowrap shadow-xs">
                The Geodesic Sphere
              </span>
            </button>

            {/* Landmark 02: Red Earth Trail (Accessible, organic marker) */}
            <button
              onClick={() => setSelectedHotspot("trail")}
              aria-label="Inspect Red Laterite Trail"
              className="group absolute bottom-[27%] left-[23%] md:left-[27%] p-2 rounded-full text-forest hover:scale-105 transition-all duration-200 focus:outline-none"
            >
              <div className="w-6 h-6 rounded-full border border-forest/80 bg-paper/80 backdrop-blur-xs flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-forest group-hover:scale-150 transition-transform" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-1/2 -translate-x-1/2 -bottom-6 px-2 py-0.5 bg-paper/95 border border-border text-[9px] font-mono uppercase tracking-widest text-ink whitespace-nowrap shadow-xs">
                The Laterite Trail
              </span>
            </button>
          </div>

          {/* HOTSPOT POPUP INSET (Compact, restrained archival card) */}
          {selectedHotspot && (
            <div
              role="dialog"
              aria-modal="true"
              className="absolute z-40 top-20 right-6 md:right-14 max-w-xs bg-paper-light border border-border archival-shadow p-5 animate-fade-in"
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
                  ? "Crowned with 1,415 hand-gilded concave discs, cradled within twelve petal gardens."
                  : "Hand-planted tropical dry evergreen paths regenerate the once-eroded laterite plateau."}
              </p>
            </div>
          )}

          {/* QUIET INTEGRATED EDITORIAL STATEMENT (Archival label, zero blocking boxes) */}
          <div
            className="absolute z-20 left-8 md:left-14 bottom-8 md:bottom-10 max-w-lg pointer-events-none transition-opacity duration-300"
            style={{
              opacity: statementOpacity,
              transform: `translateY(${(1 - statementEnter) * 15}px)`,
            }}
          >
            <div className="bg-paper-light/92 backdrop-blur-sm px-4 py-2.5 border border-border/70 rounded-xs archival-shadow-subtle inline-block">
              <p className="font-serif italic text-base md:text-lg text-ink font-light leading-snug">
                Red laterite paths cut through three million hand-planted trees, leading to the golden sphere.
              </p>
            </div>
          </div>

          {/* HANDOFF TO CHAPTER 03: Horizon line continues directly into architecture */}
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
