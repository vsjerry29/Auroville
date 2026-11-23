"use client";

import { useState } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES, AurovilleImage } from "@/lib/data/images";
import ImageFocus from "@/components/interactions/ImageFocus";
import { Maximize2, ArrowUp } from "lucide-react";

interface LivingGridProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
  onNavigateStart?: () => void;
}

export default function LivingGrid({ progress, active, onNavigateStart }: LivingGridProps) {
  // Normalize progress for Scene 04 (0.73 to 1.00)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.73) / 0.27));

  // Focus modal state
  const [focusedImage, setFocusedImage] = useState<AurovilleImage | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  if (!active && progress < 0.70) {
    return null;
  }

  // Scroll phase calculations:
  // State A: 0 - 0.25 (Opening editorial layout: dominant hero + 2 supporting)
  // State B: 0.25 - 0.65 (Shifting composition: second photo expands, typography repositions)
  // State C: 0.65 - 1.00 (Visual conclusion: central hero expands into closing composition)

  const shiftProgress = Math.min(1, Math.max(0, (localProgress - 0.20) / 0.45));
  const closingProgress = Math.min(1, Math.max(0, (localProgress - 0.65) / 0.35));

  // Editorial headline opacity (State B negative space)
  const statementOpacity = Math.min(1, Math.max(0, (localProgress - 0.22) / 0.20)) * (1 - closingProgress * 1.2);

  // Closing finale opacity (State C)
  const finaleOpacity = Math.min(1, Math.max(0, (localProgress - 0.75) / 0.25));

  const photoHero = AUROVILLE_IMAGES.cover;
  const photoCraft = AUROVILLE_IMAGES.craft;
  const photoTownHall = AUROVILLE_IMAGES.architecture;
  const photoLandscape = AUROVILLE_IMAGES.landscape;
  const photoForest = AUROVILLE_IMAGES.forest;

  return (
    <>
      <div
        className="absolute inset-0 w-full h-full overflow-hidden select-none flex flex-col justify-between"
        style={{
          zIndex: 25,
          visibility: progress >= 0.70 ? "visible" : "hidden",
        }}
      >
        {/* Archival paper background */}
        <div className="absolute inset-0 bg-paper paper-texture" />

        {/* BOTANICAL DETAIL ACCENT (Neem branch illustration) */}
        <div
          className="absolute bottom-16 right-[-2vw] w-48 md:w-64 opacity-25 pointer-events-none transition-all duration-300"
          style={{
            transform: `translateY(${(1 - shiftProgress) * 40}px)`,
          }}
        >
          <Image
            src="/art/details/neem-branch.webp"
            alt="Botanical neem leaf detail"
            width={400}
            height={300}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* SCENE 04 HEADER & CHAPTER NUMBERING */}
        <div
          className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-24 flex items-end justify-between border-b border-border pb-3 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 1 - closingProgress * 0.9 }}
        >
          <div className="flex items-baseline gap-4 md:gap-6">
            <span className="font-display text-4xl md:text-6xl text-forest leading-none">
              04
            </span>
            <div>
              <div className="flex items-center gap-2 text-ink-muted text-[10px] font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
                <span>PHOTOGRAPHIC STORYTELLING</span>
              </div>
              <h2 className="font-serif italic text-2xl md:text-4xl text-ink font-light tracking-tight mt-0.5">
                Perspectives
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-widest hidden sm:block">
            <span>EDITORIAL SPREAD · </span>
            <span className="text-forest font-semibold">
              {localProgress < 0.25
                ? "EXPOSURE I"
                : localProgress < 0.65
                ? "EXPOSURE II"
                : "FINALE"}
            </span>
          </div>
        </div>

        {/* DYNAMIC EDITORIAL PHOTO SPREAD (Transforms across States A, B, C) */}
        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 my-auto flex items-center justify-center">
          <div className="w-full grid grid-cols-12 gap-4 md:gap-6 items-center">
            {/* Tile 01: Dominant Architectural Hero (Matrimandir / Peace Area) */}
            <div
              onClick={() => setFocusedImage(photoHero)}
              onMouseEnter={() => setHoveredTile("hero")}
              onMouseLeave={() => setHoveredTile(null)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setFocusedImage(photoHero);
              }}
              aria-label={`Inspect ${photoHero.title}`}
              className={`group relative bg-paper-light border border-border cursor-pointer transition-all duration-500 p-2 md:p-3 ${
                shiftProgress > 0.5 ? "col-span-12 lg:col-span-6" : "col-span-12 lg:col-span-7"
              } ${hoveredTile === "hero" ? "archival-shadow scale-[1.01] border-ink" : "archival-shadow-subtle"}`}
              style={{
                transform: `translateX(-${shiftProgress * 20}px) scale(${
                  closingProgress > 0.3 ? 1 + closingProgress * 0.12 : 1
                })`,
                zIndex: closingProgress > 0.5 ? 40 : 10,
              }}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper-dark">
                <Image
                  src={photoHero.src}
                  alt={photoHero.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center 80%" }}
                />
                <div className="absolute top-2.5 right-2.5 bg-ink/75 backdrop-blur-sm text-paper-light px-2.5 py-1 text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                  <span>INSPECT</span>
                  <Maximize2 size={10} />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">{photoHero.title}</span>
                <span className="text-terracotta">PEACE AREA</span>
              </div>
            </div>

            {/* Right Column: Dynamic Supporting Photographs (Craft, Town Hall, Landscape) */}
            <div
              className={`col-span-12 lg:col-span-5 flex flex-col gap-4 md:gap-5 transition-all duration-500`}
              style={{
                transform: `translateX(${shiftProgress * 25}px)`,
                opacity: Math.max(0, 1 - closingProgress * 2),
              }}
            >
              {/* Supporting Photo A: Craft & Artisanal Work */}
              <div
                onClick={() => setFocusedImage(photoCraft)}
                onMouseEnter={() => setHoveredTile("craft")}
                onMouseLeave={() => setHoveredTile(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setFocusedImage(photoCraft);
                }}
                aria-label={`Inspect ${photoCraft.title}`}
                className={`group relative bg-paper-light border border-border cursor-pointer transition-all duration-300 p-2 md:p-2.5 ${
                  hoveredTile === "craft" ? "archival-shadow scale-[1.02] border-ink" : "archival-shadow-subtle"
                }`}
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-paper-dark">
                  <Image
                    src={photoCraft.src}
                    alt={photoCraft.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-ink/75 backdrop-blur-sm text-paper-light px-2 py-0.5 text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>INSPECT</span>
                    <Maximize2 size={10} />
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-ink-muted uppercase tracking-wider">
                  <span className="text-ink font-medium">{photoCraft.title}</span>
                  <span className="text-terracotta">ASPIRATION CRAFTS</span>
                </div>
              </div>

              {/* Supporting Photo B: Modern Town Hall / Climate Architecture */}
              <div
                onClick={() => setFocusedImage(photoTownHall)}
                onMouseEnter={() => setHoveredTile("townhall")}
                onMouseLeave={() => setHoveredTile(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setFocusedImage(photoTownHall);
                }}
                aria-label={`Inspect ${photoTownHall.title}`}
                className={`group relative bg-paper-light border border-border cursor-pointer transition-all duration-300 p-2 md:p-2.5 hidden sm:block ${
                  hoveredTile === "townhall" ? "archival-shadow scale-[1.02] border-ink" : "archival-shadow-subtle"
                }`}
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-paper-dark">
                  <Image
                    src={photoTownHall.src}
                    alt={photoTownHall.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-ink/75 backdrop-blur-sm text-paper-light px-2 py-0.5 text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>INSPECT</span>
                    <Maximize2 size={10} />
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-ink-muted uppercase tracking-wider">
                  <span className="text-ink font-medium">{photoTownHall.title}</span>
                  <span className="text-forest">ROGER ANGER</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDITORIAL STATEMENT IN NEGATIVE SPACE (State B) */}
        {/* Purposeful layering without colliding with imagery */}
        <div
          className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20 transition-all duration-300"
          style={{
            opacity: statementOpacity,
            transform: `translateY(${(1 - statementOpacity) * 20}px)`,
          }}
        >
          <div className="max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold block mb-1">
              THE ART OF PERSPECTIVES
            </span>
            <h3 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ink font-light leading-tight">
              Every frame, another perspective.
            </h3>
            <p className="font-sans text-xs md:text-sm text-ink-muted mt-1.5 font-light leading-relaxed">
              Between the red soil paths and the golden dome lies an ongoing dialogue of human
              collaboration, sustainable craftsmanship, and visionary town planning.
            </p>
          </div>
        </div>

        {/* FINALE & INTENTIONAL CLOSING COMPOSITION (State C / 100% progress) */}
        {closingProgress > 0.4 && (
          <div
            className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-paper via-paper/95 to-transparent pt-12 pb-16 px-6 md:px-12 flex flex-col items-center justify-center text-center transition-all duration-500 pointer-events-auto"
            style={{
              opacity: finaleOpacity,
              transform: `translateY(${(1 - finaleOpacity) * 30}px)`,
            }}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
              AUROVILLE · AN EXPERIMENT IN HUMAN UNITY
            </span>
            <h3 className="font-serif italic text-3xl md:text-5xl text-ink font-light mt-1 max-w-2xl">
              A place still becoming.
            </h3>
            <p className="font-sans text-xs md:text-sm text-ink-muted max-w-md mt-2 font-light">
              You have completed the opening four-chapter digital editorial monograph.
            </p>

            <button
              onClick={onNavigateStart}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-ink text-paper-light hover:bg-terracotta font-mono text-[11px] uppercase tracking-widest transition-colors rounded-sm shadow-md"
            >
              <span>Return to Beginning</span>
              <ArrowUp size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Focus Modal Inspection Dialog */}
      <ImageFocus image={focusedImage} onClose={() => setFocusedImage(null)} />
    </>
  );
}
