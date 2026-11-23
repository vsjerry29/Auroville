"use client";

import { useState } from "react";
import Image from "next/image";
import LayerComparison from "@/components/interactions/LayerComparison";
import ArchiveLayerReveal from "@/components/interactions/ArchiveLayerReveal";
import SvgStrokePath from "@/components/interactions/SvgStrokePath";
import { Info, X } from "lucide-react";

interface Chapter03GoldenStructureProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter03GoldenStructure({
  progress,
  active,
}: Chapter03GoldenStructureProps) {
  // Normalize progress for Scene 03 (0.45 to 0.73)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.28));

  // Active callout modal state (Interaction I024)
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  if (!active && (progress < 0.42 || progress > 0.76)) {
    return null;
  }

  // Phase choreography:
  // Phase 1 (0 to 0.35): Entrance of architectural drafting guides & plate
  // Phase 2 (0.35 to 0.70): Tactile comparison exploration (Interaction I023)
  // Phase 3 (0.70 to 1.00): Handoff to Chapter 04 (Interaction I030)
  const revealProgress = Math.min(1, Math.max(0, localProgress / 0.35));
  const handoffProgress = Math.min(1, Math.max(0, (localProgress - 0.70) / 0.30));

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

      {/* BACKGROUND VECTOR COMPASS ARCS (Interaction I021) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 0.35 - handoffProgress * 0.35),
        }}
      >
        <SvgStrokePath progress={localProgress * 1.5} className="w-full h-full" />
      </div>

      {/* BOTANICAL DETAIL ACCENT (Top-Right Margin) */}
      <div
        className="absolute top-16 right-[-2vw] w-48 md:w-64 opacity-25 pointer-events-none transition-all duration-300"
        style={{
          transform: `translateY(${(1 - revealProgress) * -30}px)`,
        }}
      >
        <Image
          src="/art/details/leaf-rosette.webp"
          alt="Botanical specimen detail"
          width={400}
          height={300}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* ARCHITECT ILLUSTRATION (Lower-Left Margin) */}
      <div
        className="hidden xl:block absolute left-4 bottom-14 w-56 opacity-35 pointer-events-none transition-all duration-300"
        style={{
          transform: `translateY(${(1 - revealProgress) * 30}px)`,
        }}
      >
        <Image
          src="/art/people/architect.webp"
          alt="Hand-drawn architect examining structural blueprints"
          width={400}
          height={500}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* SCENE 03 HEADER & CHAPTER NUMBERING */}
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
              <span>THE ARCHITECTURAL STUDY</span>
            </div>
            <h2 className="font-serif italic text-2xl md:text-4xl text-ink font-light tracking-tight mt-0.5">
              The Golden Structure
            </h2>
          </div>
        </div>

        <div className="text-right font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-widest hidden sm:block">
          <div>STRUCTURAL COMPARISON</div>
          <span className="text-terracotta">INTERACTIVE SLIDER ACTIVE</span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN ARCHITECTURAL EXHIBITION SPREAD */}
      <div className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-12 pt-36 md:pt-40 pb-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full max-h-[720px]">
          {/* Left Column (7 cols): Interactive Layer Comparison Slider (Interaction I023) */}
          <div className="lg:col-span-7 flex flex-col gap-3 relative">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-ink-muted">
              <span>PLATE 03 · STRUCTURAL ELEVATION STUDY</span>
              <span className="text-terracotta">DRAG OR USE ARROW KEYS ↔</span>
            </div>

            {/* Tactile Layer Comparison Component */}
            <LayerComparison
              outlineSrc="/illustrated/ch03-structure/matrimandir-outline.webp"
              shadedSrc="/illustrated/ch03-structure/matrimandir-shaded.webp"
              outlineAlt="Graphite line study of Matrimandir elevation"
              shadedAlt="Toned graphite and gold leaf shaded study of Matrimandir"
              className="rounded-xs"
            />

            {/* Caption & Technical Hotspots (Interaction I024) */}
            <div className="pt-1 flex items-center justify-between font-mono text-[10px] text-ink-muted">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveCallout("discs")}
                  className="flex items-center gap-1.5 hover:text-terracotta transition-colors"
                >
                  <Info size={12} className="text-terracotta" />
                  <span>1,415 ACOUSTIC DISCS</span>
                </button>
                <span className="text-border">·</span>
                <button
                  onClick={() => setActiveCallout("ramps")}
                  className="flex items-center gap-1.5 hover:text-forest transition-colors"
                >
                  <Info size={12} className="text-forest" />
                  <span>RADIAL RAMPS</span>
                </button>
              </div>
              <span className="text-ink-faint">GEODESIC 36M SPHERE</span>
            </div>
          </div>

          {/* Right Column (5 cols): Roger Anger Galaxy Masterplan & Tactile Layer Reveal */}
          <div className="lg:col-span-5 flex flex-col gap-4 relative">
            {/* Roger Anger Galaxy Plan Architectural Concept Drawing */}
            <div className="relative bg-paper-light border border-border p-3 archival-shadow-subtle transition-all duration-300">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper-dark">
                <Image
                  src="/art/architecture/galaxy-plan.webp"
                  alt="Roger Anger 1968 Galaxy master plan concept study"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
                <span className="text-ink font-medium">ROGER ANGER · GALAXY PLAN STUDY</span>
                <span className="text-terracotta">CONCEPT 1968</span>
              </div>
            </div>

            {/* Tactile Layered Document Reveal */}
            <div className="relative z-30">
              <ArchiveLayerReveal />
            </div>
          </div>
        </div>
      </div>

      {/* STRUCTURAL CALLOUT MODAL (Interaction I024) */}
      {activeCallout && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveCallout(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-paper border border-border archival-shadow p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-mono text-[9px] uppercase tracking-widest text-terracotta font-semibold">
                ARCHITECTURAL SPECIFICATION
              </span>
              <button
                onClick={() => setActiveCallout(null)}
                aria-label="Close specification"
                className="p-1 text-ink-muted hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>

            <h4 className="font-serif italic text-2xl text-ink font-light mt-3">
              {activeCallout === "discs"
                ? "1,415 Gilded Acoustic Discs"
                : "Radial Amphitheater Ramps"}
            </h4>

            <p className="font-sans text-xs text-ink-muted mt-2 leading-relaxed font-light">
              {activeCallout === "discs"
                ? "The outer sphere is sheathed with 1,415 convex and concave discs surfaced with 28-karat gold leaf mosaic tiles, designed to deflect turbulent monsoonal wind shear while diffusing southern Indian solar irradiance."
                : "Four radial amphitheater ramps anchored by red sandstone walls cradle the sphere within twelve symbolic petal gardens, forming the tranquil center of the planned township."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
