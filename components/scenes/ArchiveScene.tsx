"use client";

import { useState } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES, AurovilleImage } from "@/lib/data/images";
import ArchiveComparison from "@/components/interactions/ArchiveComparison";

interface ArchiveSceneProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function ArchiveScene({ progress, active }: ArchiveSceneProps) {
  // Normalize progress for Scene 03 (0.45 to 0.73)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.28));

  // Hover state for interactive exploration
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  if (!active && (progress < 0.42 || progress > 0.76)) {
    return null;
  }

  // Phase 1: 0 - 0.20 (Arrival & first secondary elements)
  // Phase 2: 0.20 - 0.45 (Directional reveals of all documents)
  // Phase 3: 0.45 - 0.65 (Fully interactive archive exploration)
  // Phase 4: 0.65 - 0.85 (Reorganization: rotation to 0, alignment toward contact sheet)
  // Phase 5: 0.85 - 1.00 (Handoff to Scene 04 living grid)

  const revealProgress = Math.min(1, Math.max(0, localProgress / 0.40));

  // Reorganization to contact sheet (Phase 4 & 5: 0.65 to 1.00)
  const reorgProgress = Math.min(1, Math.max(0, (localProgress - 0.65) / 0.35));

  // Rotation returns to 0 as reorgProgress increases
  const rot1 = (1 - reorgProgress) * -1.5;
  const rot2 = (1 - reorgProgress) * 1.8;
  const rot3 = (1 - reorgProgress) * -0.8;

  // Title entrance and exit
  const titleOpacity = revealProgress * (1 - reorgProgress * 0.8);

  const coverImage = AUROVILLE_IMAGES.cover;
  const mapImage = AUROVILLE_IMAGES.map1968;
  const banyanImage = AUROVILLE_IMAGES.community;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{
        zIndex: 20,
        visibility: progress >= 0.42 && progress <= 0.76 ? "visible" : "hidden",
      }}
    >
      {/* Background warm archival paper */}
      <div className="absolute inset-0 bg-paper paper-texture" />

      {/* Editorial Gridlines / Guidelines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-4 border-x border-dashed border-border">
          <div className="col-span-1 border-r border-dashed border-border" />
          <div className="col-span-2 border-r border-dashed border-border" />
          <div className="col-span-3 border-r border-dashed border-border" />
          <div className="col-span-3 border-r border-dashed border-border" />
          <div className="col-span-2 border-r border-dashed border-border" />
          <div className="col-span-1" />
        </div>
      </div>

      {/* Archive Header / Eyebrow */}
      <div
        className="absolute top-20 md:top-24 left-6 md:left-12 right-6 md:right-12 z-30 flex items-end justify-between border-b border-border pb-3 pointer-events-none transition-opacity duration-300"
        style={{ opacity: titleOpacity }}
      >
        <div>
          <div className="flex items-center gap-2 text-ink-muted text-[10px] font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
            <span>CHAPTER 03 / THE AUROVILLE ARCHIVES</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-ink font-light tracking-tight mt-1">
            FRAGMENTS OF TIME
          </h2>
        </div>

        <div className="text-right font-mono text-[10px] md:text-[11px] text-ink-muted uppercase tracking-widest hidden sm:block">
          <div>DOCUMENT IDENTIFIER: ARC-1968-2026</div>
          <div className="text-terracotta">INTERACTIVE ARCHIVAL COMPARISON</div>
        </div>
      </div>

      {/* ARCHIVAL SPREAD CONTAINER */}
      <div className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-12 pt-36 md:pt-40 pb-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full max-h-[720px]">
          {/* Left Column (6 cols): Primary Inherited Matrimandir Print + Banyan Tree Fragment */}
          <div className="lg:col-span-6 flex flex-col gap-6 relative">
            {/* Primary Inherited Photograph from Scene 02 */}
            <div
              onMouseEnter={() => setHoveredCard("cover")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative bg-paper-light border border-border p-3 transition-all duration-300 ${
                hoveredCard === "cover" ? "archival-shadow scale-[1.01] z-20" : "archival-shadow-subtle z-10"
              }`}
              style={{
                transform: `rotate(${rot1}deg)`,
              }}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper-dark">
                <Image
                  src={coverImage.src}
                  alt={coverImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Archival metadata caption */}
              <div className="pt-3 flex items-center justify-between font-mono text-[10px] md:text-[11px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">PLATE 01 · MATRIMANDIR SPHERE</span>
                <span>PEACE AREA · ACC #MM-01</span>
              </div>
            </div>

            {/* Secondary Document: Centenary Banyan Tree */}
            <div
              onMouseEnter={() => setHoveredCard("banyan")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`hidden sm:flex items-center gap-4 bg-paper-light/90 border border-border p-3 transition-all duration-300 ${
                hoveredCard === "banyan" ? "archival-shadow z-20" : "archival-shadow-subtle z-10"
              }`}
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * 30}px) rotate(${rot3}deg)`,
              }}
            >
              <div className="relative w-28 h-20 shrink-0 overflow-hidden bg-paper-dark">
                <Image
                  src={banyanImage.src}
                  alt={banyanImage.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
              <div className="text-[11px] font-mono text-ink-muted">
                <span className="text-ink font-semibold block uppercase">
                  {banyanImage.title} (1968)
                </span>
                <p className="font-serif italic text-xs text-ink/80 mt-0.5 line-clamp-2">
                  Sole botanical marker in 1968 when youth from 124 nations placed soil into the marble urn.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Roger Anger 1968 Galaxy Plan + Interactive Before/After Comparison */}
          <div className="lg:col-span-6 flex flex-col gap-6 relative">
            {/* Top Right: Roger Anger 1968 Galaxy Master Plan */}
            <div
              onMouseEnter={() => setHoveredCard("map")}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative bg-paper-light border border-border p-3 transition-all duration-300 ${
                hoveredCard === "map" ? "archival-shadow scale-[1.01] z-20" : "archival-shadow-subtle z-10"
              }`}
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * -20}px) rotate(${rot2}deg)`,
              }}
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-paper-dark">
                <Image
                  src={mapImage.src}
                  alt={mapImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[10px] md:text-[11px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">ROGER ANGER · GALAXY PLAN (1968)</span>
                <span>ZONING DRAFT #04</span>
              </div>
            </div>

            {/* Bottom Right: Interactive Draggable Then-and-Now Comparison */}
            <div
              className="relative z-30 transition-all duration-300"
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * 40}px)`,
              }}
            >
              <ArchiveComparison />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
