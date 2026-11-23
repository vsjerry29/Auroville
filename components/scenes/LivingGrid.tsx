"use client";

import { useState } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES, AurovilleImage } from "@/lib/data/images";
import ImageFocus from "@/components/interactions/ImageFocus";
import { Maximize2 } from "lucide-react";

interface LivingGridProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function LivingGrid({ progress, active }: LivingGridProps) {
  // Normalize progress for Scene 04 (0.73 to 1.00)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.73) / 0.27));

  // Focus modal state
  const [focusedImage, setFocusedImage] = useState<AurovilleImage | null>(null);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  if (!active && progress < 0.70) {
    return null;
  }

  // Layout State transitions:
  // State A: 0 - 0.20 (Contact sheet)
  // State B: 0.20 - 0.50 (Editorial spread / explosion)
  // State C: 0.50 - 0.75 (Focused composition with statement title)
  // Phase 4: 0.75 - 1.00 (Hero tile expands toward full viewport for future Scene 05)

  // Stage A to B interpolation (0.20 to 0.50)
  const explosionProgress = Math.min(1, Math.max(0, (localProgress - 0.20) / 0.30));

  // Stage B to C interpolation (0.50 to 0.75)
  const focusProgress = Math.min(1, Math.max(0, (localProgress - 0.50) / 0.25));

  // Stage C to Final Expand interpolation (0.75 to 1.00)
  const finalExpand = Math.min(1, Math.max(0, (localProgress - 0.75) / 0.25));

  // Title in State B & C
  const editorialTitleOpacity = Math.min(
    1,
    Math.max(0, (localProgress - 0.25) / 0.20) * (1 - finalExpand * 1.5)
  );

  const images = [
    { key: "cover", data: AUROVILLE_IMAGES.cover, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-5" },
    { key: "detail", data: AUROVILLE_IMAGES.detail, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-4" },
    { key: "landscape", data: AUROVILLE_IMAGES.landscape, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-3" },
    { key: "architecture", data: AUROVILLE_IMAGES.architecture, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-4" },
    { key: "craft", data: AUROVILLE_IMAGES.craft, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-4" },
    { key: "community", data: AUROVILLE_IMAGES.community, spanDesktop: "col-span-12 sm:col-span-6 lg:col-span-4" },
  ];

  return (
    <>
      <div
        className="absolute inset-0 w-full h-full overflow-hidden select-none"
        style={{
          zIndex: 25,
          visibility: progress >= 0.70 ? "visible" : "hidden",
        }}
      >
        {/* Archival paper background */}
        <div className="absolute inset-0 bg-paper paper-texture" />

        {/* Scene 04 Header */}
        <div
          className="absolute top-20 md:top-24 left-6 md:left-12 right-6 md:right-12 z-30 flex items-end justify-between border-b border-border pb-3 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 1 - finalExpand }}
        >
          <div>
            <div className="flex items-center gap-2 text-ink-muted text-[10px] font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-forest inline-block" />
              <span>CHAPTER 04 / LIVING COMPOSITION</span>
            </div>
            <h2 className="font-serif text-2xl md:text-4xl text-ink font-light tracking-tight mt-1">
              The Living Image Grid
            </h2>
          </div>

          <div className="text-right font-mono text-[10px] md:text-[11px] text-ink-muted uppercase tracking-widest hidden sm:block">
            <span>LAYOUT STATE: </span>
            <span className="text-terracotta font-semibold">
              {localProgress < 0.20
                ? "CONTACT SHEET"
                : localProgress < 0.50
                ? "EDITORIAL SPREAD"
                : localProgress < 0.75
                ? "FOCUSED PERSPECTIVE"
                : "EXPANDING TO SCENE 05"}
            </span>
          </div>
        </div>

        {/* Statement Title in Negative Space (State B & C) */}
        <div
          className="absolute z-20 left-6 md:left-16 bottom-24 md:bottom-28 max-w-xl pointer-events-none transition-all duration-300"
          style={{
            opacity: editorialTitleOpacity,
            transform: `translateY(${(1 - editorialTitleOpacity) * 30}px)`,
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold block mb-1">
            EDITORIAL SPREAD
          </span>
          <h3 className="font-serif text-3xl md:text-5xl text-ink font-light tracking-tight leading-none">
            EVERY FRAME, ANOTHER PERSPECTIVE.
          </h3>
          <p className="font-sans text-xs md:text-sm text-ink-muted mt-2 font-light max-w-md">
            Click any frame to inspect authentic accession records, credits, and historical documentation.
          </p>
        </div>

        {/* LIVING GRID CONTAINER */}
        <div className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-12 pt-36 md:pt-40 pb-20 flex flex-col justify-center overflow-y-auto lg:overflow-visible">
          <div className="grid grid-cols-12 gap-3 md:gap-5 items-stretch transition-all duration-300">
            {images.map((item, idx) => {
              const isDominant = item.key === "cover";
              const isHovered = hoveredTile === item.key;

              // Position calculations based on scroll phase
              // In State B (explosionProgress), tiles shift slightly asymmetrically
              const offsetX = (idx % 2 === 0 ? -1 : 1) * explosionProgress * 12;
              const offsetY = (idx % 3 === 0 ? 8 : -8) * explosionProgress;

              // In Phase 4 (finalExpand), dominant item expands to fill screen while others fade
              const tileOpacity = isDominant ? 1 : Math.max(0, 1 - finalExpand * 2);
              const dominantScale = isDominant ? 1 + finalExpand * 0.45 : 1;
              const dominantZ = isDominant && finalExpand > 0 ? 40 : 10;

              return (
                <div
                  key={item.key}
                  onClick={() => setFocusedImage(item.data)}
                  onMouseEnter={() => setHoveredTile(item.key)}
                  onMouseLeave={() => setHoveredTile(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setFocusedImage(item.data);
                  }}
                  aria-label={`Inspect ${item.data.title}`}
                  className={`group relative bg-paper-light border border-border cursor-pointer transition-all duration-300 p-2 md:p-2.5 ${
                    item.spanDesktop
                  } ${isHovered ? "archival-shadow scale-[1.02] border-ink" : "archival-shadow-subtle"} ${
                    idx >= 4 ? "hidden md:block" : ""
                  }`}
                  style={{
                    opacity: tileOpacity,
                    zIndex: isHovered ? 30 : dominantZ,
                    transform: `translate(${offsetX}px, ${offsetY}px) scale(${isHovered ? 1.02 : dominantScale})`,
                  }}
                >
                  {/* Image container */}
                  <div className="relative w-full aspect-[16/11] overflow-hidden bg-paper-dark">
                    <Image
                      src={item.data.src}
                      alt={item.data.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Inspection Hover Pill */}
                    <div className="absolute top-2 right-2 bg-ink/75 backdrop-blur-sm text-paper-light px-2 py-1 text-[9px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>INSPECT</span>
                      <Maximize2 size={10} />
                    </div>
                  </div>

                  {/* Tile Footer / Microtypography */}
                  <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
                    <span className="text-ink font-medium truncate max-w-[140px]">
                      {item.data.title}
                    </span>
                    <span className="text-terracotta shrink-0">#{item.data.id.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scene 05 Teaser Horizon (at 100% progress) */}
        {finalExpand > 0.8 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 text-center font-mono text-[11px] uppercase tracking-widest text-gold animate-bounce">
            MILESTONE 01 COMPLETED · READY FOR SCENE 05
          </div>
        )}
      </div>

      {/* Focus Modal Overlay */}
      <ImageFocus image={focusedImage} onClose={() => setFocusedImage(null)} />
    </>
  );
}
