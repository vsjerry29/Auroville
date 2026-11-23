"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LayerComparison from "@/components/interactions/LayerComparison";
import { Info, X, SlidersHorizontal } from "lucide-react";

interface Chapter03GoldenStructureProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter03GoldenStructure({
  progress,
  active,
}: Chapter03GoldenStructureProps) {
  // Normalize progress for Chapter 03 (0.45 to 0.73)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.45) / 0.28));

  // Active callout specification modal
  const [activeCallout, setActiveCallout] = useState<string | null>(null);
  // Toggle for comparison slider in Frame C
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeCallout) {
        setActiveCallout(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCallout]);

  if (!active && (progress < 0.42 || progress > 0.76)) {
    return null;
  }

  // 3-Part Editorial Horizontal Movement:
  // State A: 0.00 – 0.35 (01/ — An Idea Takes Shape: right-dominant architectural elevation)
  // Shift A->B: 0.35 – 0.50 (Lateral transition: art moves left, making scene enters)
  // State B: 0.50 – 0.70 (02/ — Built by Many Hands: left-dominant workshop scene)
  // Shift B->C: 0.70 – 0.85 (Lateral transition: macro disc study enters on right)
  // State C: 0.85 – 0.94 (03/ — A Thousand Small Decisions: macro geodesic discs)
  // Handoff to CH04: 0.94 – 1.00 (Contour line stretches into suspension cord)

  // Sub-progress for transitions
  const transitionAB = Math.min(1, Math.max(0, (localProgress - 0.33) / 0.20));
  const transitionBC = Math.min(1, Math.max(0, (localProgress - 0.68) / 0.18));
  const handoffCH04 = Math.min(1, Math.max(0, (localProgress - 0.92) / 0.08));

  // State opacities and lateral translations
  // Track 1 (State A): starts at 0, translates left as B enters
  const track1TranslateX = transitionAB * -110;
  const track1Opacity = Math.max(0, 1 - transitionAB * 1.5);

  // Track 2 (State B): enters from right (110vw -> 0vw), then leaves left (0vw -> -110vw)
  const track2TranslateX = (1 - transitionAB) * 100 - transitionBC * 110;
  const track2Opacity = transitionAB > 0.1 ? Math.min(1, transitionAB * 1.5) * (1 - transitionBC * 1.5) : 0;

  // Track 3 (State C): enters from right (100vw -> 0vw)
  const track3TranslateX = (1 - transitionBC) * 100 - handoffCH04 * 25;
  const track3Opacity = Math.min(1, transitionBC * 1.5);

  // Current active sub-state number for eyebrow
  const currentSubState = localProgress < 0.45 ? "01" : localProgress < 0.78 ? "02" : "03";

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

      {/* TOP BAR / CHAPTER INDEX */}
      <div className="absolute top-20 md:top-24 left-6 md:left-12 right-6 md:right-12 z-30 flex items-end justify-between border-b border-border pb-3 pointer-events-none">
        <div className="flex items-baseline gap-4 md:gap-6">
          <span className="font-display text-4xl md:text-5xl text-terracotta leading-none">
            03
          </span>
          <div>
            <div className="flex items-center gap-2 text-ink-muted text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block" />
              <span>THE ARCHITECTURAL STORY · MOVEMENT {currentSubState}/03</span>
            </div>
            <h2 className="font-serif italic text-2xl md:text-3xl text-ink font-light tracking-tight mt-0.5">
              The Golden Structure
            </h2>
          </div>
        </div>

        <div className="text-right font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-widest hidden sm:block">
          <span>EDITORIAL CHOREOGRAPHY · </span>
          <span className="text-terracotta font-semibold">
            {localProgress < 0.45 ? "FORM" : localProgress < 0.78 ? "MAKING" : "SURFACE DETAIL"}
          </span>
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL EDITORIAL TRACK (Driven by Vertical Scroll)
          ========================================================================= */}
      <div className="relative w-full h-full pt-32 md:pt-36 pb-12 overflow-hidden flex items-center">

        {/* -----------------------------------------------------------------------
            STATE A: 01/ — AN IDEA TAKES SHAPE (Right-dominant elevation study)
            ----------------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${track1TranslateX}vw)`,
            opacity: track1Opacity,
            pointerEvents: localProgress < 0.45 ? "auto" : "none",
          }}
        >
          {/* Left Column: Number, Editorial Copy, and 2 Supporting Studies */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-[580px]">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl md:text-5xl text-ink">01/</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-ink font-light leading-tight">
                  An idea takes shape.
                </h3>
              </div>
              <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                A vision conceived on an eroded red plateau in southern India: architecture not as a
                monument of power, but as an inquiry into human unity, geometric proportion, and quietude.
              </p>
            </div>

            {/* Two Asymmetrical Supporting Studies */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
              {/* Supporting Study 1: Radial Planning Study */}
              <div className="bg-paper-light border border-border p-2 archival-shadow-subtle">
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src="/art/architecture/galaxy-plan.webp"
                    alt="Radial concept sketch"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="pt-1.5 font-mono text-[8px] uppercase tracking-wider text-ink-muted">
                  RADIAL SECTORS
                </div>
              </div>

              {/* Supporting Study 2: Terracotta Material Study */}
              <div className="bg-paper-light border border-border p-2 archival-shadow-subtle">
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src="/art/people/potter.webp"
                    alt="Artisan shaping clay"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="pt-1.5 font-mono text-[8px] uppercase tracking-wider text-ink-muted">
                  EARTH MATERIALITY
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dominant Matrimandir Architectural Elevation (~55% width) */}
          <div className="lg:col-span-7 relative bg-paper-light border border-border p-3 md:p-4 archival-shadow">
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper">
              <Image
                src="/illustrated/ch03-structure/matrimandir-shaded.webp"
                alt="Detailed hand-drawn architectural structural elevation of Matrimandir"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
              <span className="text-ink font-medium">STRUCTURAL ELEVATION STUDY</span>
              <span className="text-terracotta">PEACE AREA · 36M GEODESIC SPHERE</span>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            STATE B: 02/ — BUILT BY MANY HANDS (Left-dominant assembly scene)
            ----------------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${track2TranslateX}vw)`,
            opacity: track2Opacity,
            pointerEvents: localProgress >= 0.45 && localProgress < 0.78 ? "auto" : "none",
          }}
        >
          {/* Left Column: Dominant Illustration of Artisans, Builders & Blueprints */}
          <div className="lg:col-span-7 relative bg-paper-light border border-border p-3 md:p-4 archival-shadow order-2 lg:order-1">
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper">
              <Image
                src="/illustrated/ch03-structure/ch03-frame-b-making.webp"
                alt="Artisans and architects drafting blueprints and assembling models in Auroville workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
              <span className="text-ink font-medium">THE ARCHITECTURAL WORKSHOP</span>
              <span className="text-forest">HANDS & PHYSICAL MATERIAL</span>
            </div>
          </div>

          {/* Right Column: Number, Editorial Copy, and Material Fragment Studies */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-[580px] order-1 lg:order-2">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl md:text-5xl text-terracotta">02/</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-ink font-light leading-tight">
                  Built by many hands.
                </h3>
              </div>
              <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                Before heavy machinery arrived, youth from dozens of nations hand-dug the foundation,
                hand-sifted laterite sand, and laid each brick. Architecture here became an act of
                collective human making.
              </p>
            </div>

            {/* Supporting Botanical & Architectural Fragment Studies */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
              <div className="bg-paper-light border border-border p-2 archival-shadow-subtle">
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src="/art/people/architect.webp"
                    alt="Architect drafting blueprint"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="pt-1.5 font-mono text-[8px] uppercase tracking-wider text-ink-muted">
                  BLUEPRINT STUDY
                </div>
              </div>

              <div className="bg-paper-light border border-border p-2 archival-shadow-subtle">
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src="/art/details/leaf-rosette.webp"
                    alt="Botanical specimen"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="pt-1.5 font-mono text-[8px] uppercase tracking-wider text-ink-muted">
                  INDIGENOUS FOLIAGE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            STATE C: 03/ — A THOUSAND SMALL DECISIONS (Macro Geodesic Discs)
            ----------------------------------------------------------------------- */}
        <div
          className="absolute inset-x-0 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${track3TranslateX}vw)`,
            opacity: track3Opacity,
            pointerEvents: localProgress >= 0.78 ? "auto" : "none",
          }}
        >
          {/* Left Column: Number, Editorial Copy, and Comparison Toggle */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full max-h-[580px]">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl md:text-5xl text-gold">03/</span>
                <h3 className="font-serif italic text-2xl md:text-3xl text-ink font-light leading-tight">
                  A thousand small decisions.
                </h3>
              </div>
              <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                1,415 convex and concave discs surfaced with 28-karat gold leaf mosaic tiles sheathe
                the geodesic frame, deflecting monsoonal wind shear and diffusing the southern Indian sun.
              </p>
            </div>

            {/* Interactive Actions & Specifications */}
            <div className="mt-6 pt-4 border-t border-border flex flex-col gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="flex items-center justify-between px-3.5 py-2.5 bg-paper-light border border-border hover:border-terracotta text-ink font-mono text-[10px] uppercase tracking-wider transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-terracotta" />
                  <span>{showComparison ? "CLOSE COMPARISON SLIDER" : "COMPARE OUTLINE VS GOLD DISCS"}</span>
                </div>
                <span className="text-terracotta">↔</span>
              </button>

              <div className="flex items-center gap-3 font-mono text-[10px] text-ink-muted">
                <button
                  onClick={() => setActiveCallout("discs")}
                  className="flex items-center gap-1.5 hover:text-terracotta transition-colors"
                >
                  <Info size={12} className="text-terracotta" />
                  <span>1,415 GILDED DISCS</span>
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
            </div>
          </div>

          {/* Right Column: Dominant Macro Geodesic Discs Illustration OR Comparison Slider */}
          <div className="lg:col-span-7 relative bg-paper-light border border-border p-3 md:p-4 archival-shadow">
            {showComparison ? (
              <LayerComparison
                outlineSrc="/illustrated/ch03-structure/matrimandir-outline.webp"
                shadedSrc="/illustrated/ch03-structure/matrimandir-shaded.webp"
                outlineAlt="Graphite line study of Matrimandir elevation"
                shadedAlt="Toned graphite and gold leaf shaded study of Matrimandir"
                className="rounded-xs"
              />
            ) : (
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-paper">
                <Image
                  src="/illustrated/ch03-structure/ch03-frame-c-macro.webp"
                  alt="Macro architectural drawing of Matrimandir geodesic discs and gold mosaic tiles"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div className="pt-2 flex items-center justify-between font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-wider">
              <span className="text-ink font-medium">GEODESIC SURFACE GEOMETRY</span>
              <span className="text-gold font-semibold">28-KARAT GOLD LEAF MOSAIC</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUOUS HANDOFF LINE TO CH04 (Section C: Architectural Arc -> Suspension Cord) */}
      <div
        className="absolute bottom-6 left-0 right-0 z-30 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: handoffCH04,
        }}
      >
        <svg viewBox="0 0 1000 30" fill="none" className="w-full h-6">
          <path
            d="M 0 15 Q 500 28, 1000 15"
            stroke="#5B5751"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* STRUCTURAL CALLOUT SPECIFICATION MODAL */}
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
                ? "1,415 Gilded Geodesic Discs"
                : "Radial Amphitheater Ramps"}
            </h4>

            <p className="font-sans text-xs text-ink-muted mt-2 leading-relaxed font-light">
              {activeCallout === "discs"
                ? "The outer sphere is clad with 1,415 convex and concave discs surfaced with 28-karat gold leaf mosaic tiles, designed to deflect turbulent monsoonal wind shear while diffusing southern Indian solar irradiance."
                : "Four radial amphitheater ramps anchored by red sandstone walls cradle the sphere within twelve symbolic petal gardens, forming the tranquil center of the planned township."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
