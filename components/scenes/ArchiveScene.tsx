"use client";

import { useState } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";
import ArchiveLayerReveal from "@/components/interactions/ArchiveLayerReveal";

interface ArchiveSceneProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function ArchiveScene({ progress, active }: ArchiveSceneProps) {
  // Normalize progress for Scene 03 (0.45 to 0.73)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.28));

  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);

  if (!active && (progress < 0.42 || progress > 0.76)) {
    return null;
  }

  // Phase 1 (0 to 0.30): Staggered directional entry of archival items
  // Phase 2 (0.30 to 0.70): Interactive tactile exploration
  // Phase 3 (0.70 to 1.00): Rotations return to 0, layout realigns toward Scene 04 contact sheet
  const revealProgress = Math.min(1, Math.max(0, localProgress / 0.35));
  const realignProgress = Math.min(1, Math.max(0, (localProgress - 0.70) / 0.30));

  // Angular offsets zero out during realignment
  const rot1 = (1 - realignProgress) * -1.8;
  const rot2 = (1 - realignProgress) * 2.2;

  const coverImage = AUROVILLE_IMAGES.cover;
  const galaxyImage = AUROVILLE_IMAGES.galaxyArt;
  const banyanImage = AUROVILLE_IMAGES.community;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{
        zIndex: 20,
        visibility: progress >= 0.42 && progress <= 0.76 ? "visible" : "hidden",
      }}
    >
      {/* Background warm archival parchment */}
      <div className="absolute inset-0 bg-paper paper-texture" />

      {/* BOTANICAL DETAIL ILLUSTRATION (Top-Right Margin Accent) */}
      <div
        className="absolute top-16 right-[-2vw] w-48 md:w-64 opacity-25 pointer-events-none transition-all duration-300"
        style={{
          transform: `translateY(${(1 - revealProgress) * -30}px) rotate(${realignProgress * 10}deg)`,
        }}
      >
        <Image
          src="/art/details/leaf-rosette.webp"
          alt="Botanical banyan leaf specimen"
          width={400}
          height={300}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* ARCHITECT ILLUSTRATION (Lower-Left Margin Accent) */}
      <div
        className="hidden xl:block absolute left-4 bottom-16 w-56 opacity-35 pointer-events-none transition-all duration-300"
        style={{
          transform: `translateY(${(1 - revealProgress) * 30}px)`,
        }}
      >
        <Image
          src="/art/people/architect.webp"
          alt="Hand-drawn architect examining blueprints"
          width={400}
          height={500}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* SCENE 03 HEADER & GIANT CHAPTER NUMBERING */}
      <div
        className="absolute top-20 md:top-24 left-6 md:left-12 right-6 md:right-12 z-30 flex items-end justify-between border-b border-border pb-3 pointer-events-none transition-opacity duration-300"
        style={{ opacity: revealProgress }}
      >
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="font-display text-4xl md:text-6xl text-terracotta leading-none">
            03
          </span>
          <div>
            <div className="flex items-center gap-2 text-ink-muted text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
              <span>THE LIVING ARCHIVE</span>
            </div>
            <h2 className="font-serif italic text-2xl md:text-4xl text-ink font-light tracking-tight mt-0.5">
              Fragments of Time
            </h2>
          </div>
        </div>

        <div className="text-right font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-widest hidden sm:block">
          <div>DOCUMENTARY MONOGRAPH</div>
          <span className="text-terracotta">INTERACTIVE REVEAL ACTIVE</span>
        </div>
      </div>

      {/* ASYMMETRICAL ARCHIVAL EXHIBITION SPREAD */}
      <div className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-12 pt-36 md:pt-40 pb-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full max-h-[720px]">
          {/* Left Column (6 cols): Plate 01 Matrimandir Print + Centenary Banyan Record */}
          <div className="lg:col-span-6 flex flex-col gap-5 relative">
            {/* Plate 01: Inherited Matrimandir Photograph */}
            <div
              onMouseEnter={() => setHoveredDoc("plate01")}
              onMouseLeave={() => setHoveredDoc(null)}
              className={`relative bg-paper-light border border-border p-3 transition-all duration-300 ${
                hoveredDoc === "plate01" ? "archival-shadow scale-[1.01] z-20" : "archival-shadow-subtle z-10"
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
                  style={{ objectPosition: "center 80%" }}
                  priority
                />
              </div>

              {/* Verified Editorial Metadata */}
              <div className="pt-2.5 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">PLATE 01 · MATRIMANDIR ELEVATION</span>
                <span>PEACE AREA · CIRCA 2018</span>
              </div>
            </div>

            {/* Document 02: Centenary Banyan Botanical Specimen */}
            <div
              onMouseEnter={() => setHoveredDoc("banyan")}
              onMouseLeave={() => setHoveredDoc(null)}
              className={`hidden sm:flex items-center gap-4 bg-paper-light/95 border border-border p-3 transition-all duration-300 ${
                hoveredDoc === "banyan" ? "archival-shadow z-20" : "archival-shadow-subtle z-10"
              }`}
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * 30}px)`,
              }}
            >
              <div className="relative w-28 h-20 shrink-0 overflow-hidden bg-paper-dark border border-border">
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
                  THE CENTENARY BANYAN (1968)
                </span>
                <p className="font-serif italic text-xs text-ink/80 mt-0.5 line-clamp-2">
                  Sole geographical tree marker in 1968 when youth from 124 nations placed soil into the inauguration marble urn.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Roger Anger Galaxy Plan Concept + Tactile Layer Reveal */}
          <div className="lg:col-span-6 flex flex-col gap-5 relative">
            {/* Roger Anger Galaxy Plan Architectural Concept Drawing */}
            <div
              onMouseEnter={() => setHoveredDoc("galaxy")}
              onMouseLeave={() => setHoveredDoc(null)}
              className={`relative bg-paper-light border border-border p-3 transition-all duration-300 ${
                hoveredDoc === "galaxy" ? "archival-shadow scale-[1.01] z-20" : "archival-shadow-subtle z-10"
              }`}
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * -25}px) rotate(${rot2}deg)`,
              }}
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-paper-dark">
                <Image
                  src={galaxyImage.src}
                  alt={galaxyImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">ROGER ANGER · GALAXY PLAN STUDY</span>
                <span className="text-terracotta">ORIGINAL CONCEPT 1968</span>
              </div>
            </div>

            {/* Tactile Layered Document Reveal Component */}
            <div
              className="relative z-30 transition-all duration-300"
              style={{
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * 40}px)`,
              }}
            >
              <ArchiveLayerReveal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
