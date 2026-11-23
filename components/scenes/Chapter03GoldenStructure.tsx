"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LayerComparison from "@/components/interactions/LayerComparison";
import LivingContourField from "@/components/experience/LivingContourField";
import { SlidersHorizontal, Eye, Compass, Sparkles } from "lucide-react";

interface Chapter03GoldenStructureProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter03GoldenStructure({
  progress,
  active,
}: Chapter03GoldenStructureProps) {
  // Normalize progress for Chapter 03 (0.42 to 0.75)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.42) / 0.33));

  // Interactive modes
  const [outlineMode, setOutlineMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  // Close modals/callouts on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCallout(null);
        setShowComparison(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!active && (progress < 0.40 || progress > 0.77)) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY (Continuous Evolving Drawing)
  // State 1 (Unbuilt Geometry): localProgress < 0.38
  // State 2 (Built by Hands):   localProgress >= 0.38 && localProgress < 0.70
  // State 3 (Golden Detail):    localProgress >= 0.70
  // Continuous Handoff to CH04: localProgress >= 0.88
  // ---------------------------------------------------------------------------

  const activePhase = localProgress < 0.38 ? 1 : localProgress < 0.70 ? 2 : 3;

  // Visual Drawing Weights (for smooth artwork cross-dissolve)
  const p1Weight = Math.max(0, 1 - Math.min(1, Math.max(0, (localProgress - 0.30) / 0.12)));
  const p2Enter = Math.min(1, Math.max(0, (localProgress - 0.30) / 0.12));
  const p2Exit = Math.min(1, Math.max(0, (localProgress - 0.66) / 0.10));
  const p2Weight = p2Enter * (1 - p2Exit);
  const p3Weight = Math.min(1, Math.max(0, (localProgress - 0.66) / 0.10));

  // Continuous handoff to Chapter 04
  const handoffCH04 = Math.min(1, Math.max(0, (localProgress - 0.88) / 0.12));

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-paper text-ink transition-opacity duration-300"
      style={{
        zIndex: 20,
        visibility: progress >= 0.40 && progress <= 0.77 ? "visible" : "hidden",
        pointerEvents: progress >= 0.42 && progress <= 0.75 ? "auto" : "none",
        opacity:
          Math.min(1, Math.max(0, (progress - 0.40) / 0.02)) *
          Math.min(1, Math.max(0, (0.77 - progress) / 0.02)),
      }}
    >
      {/* Interactive Architectural Drafting Background Field */}
      <LivingContourField
        variant="structure-elevation"
        scrollProgress={localProgress}
        opacity={0.35}
      />

      {/* =========================================================================
          CONTINUOUS EVOLVING DRAWING ENVIRONMENT (Single Unified Stage)
          ========================================================================= */}
      <div className="relative w-full h-full pt-24 md:pt-28 pb-10 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* -----------------------------------------------------------------------
            LEFT COLUMN: Editorial Storytelling & Direct Exploration Controls
            ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 flex flex-col justify-between h-auto lg:h-[500px] z-20">
          <div>
            {/* Clean Section Identifier */}
            <div className="flex items-center gap-2.5 text-terracotta text-[10px] font-mono uppercase tracking-widest pb-3 border-b border-border/70 mb-5 font-semibold">
              <span>CHAPTER 03</span>
              <span className="text-border">·</span>
              <span className="text-ink-muted">
                {activePhase === 1
                  ? "STATE 1 OF 3 · UNBUILT GEOMETRY"
                  : activePhase === 2
                  ? "STATE 2 OF 3 · BUILT BY HANDS"
                  : "STATE 3 OF 3 · GILDED SURFACE"}
              </span>
            </div>

            {/* Phase 1 Narrative: An Idea Takes Shape */}
            {activePhase === 1 && (
              <div className="animate-fade-in">
                <h3 className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-ink font-light leading-tight">
                  An idea takes shape.
                </h3>
                <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                  A vision conceived on an eroded red plateau in southern India: architecture not as a
                  monument of domination, but as an inquiry into human unity, sacred geometry, and quietude.
                </p>
                
                <div className="mt-6 pt-4 border-t border-border/80 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setOutlineMode(!outlineMode)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-paper-light border border-border hover:border-terracotta text-ink font-mono text-[9.5px] uppercase tracking-wider transition-colors archival-shadow-subtle rounded-xs cursor-pointer"
                  >
                    <Eye size={12} className="text-terracotta" />
                    <span>{outlineMode ? "VIEW TONED ELEVATION" : "PEEL TO GRAPHITE OUTLINE"}</span>
                  </button>
                  <span className="text-[10px] font-mono text-ink-muted">36M GEODESIC SPHERE</span>
                </div>
              </div>
            )}

            {/* Phase 2 Narrative: Built by Many Hands */}
            {activePhase === 2 && (
              <div className="animate-fade-in">
                <h3 className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-ink font-light leading-tight">
                  Built by many hands.
                </h3>
                <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                  Before heavy machinery arrived, youth from dozens of nations hand-dug the foundation,
                  hand-sifted laterite sand, and assembled timber armatures. Architecture became an act of
                  collective human making.
                </p>

                <div className="mt-6 pt-4 border-t border-border/80 flex items-center gap-4">
                  <button
                    onClick={() =>
                      setActiveCallout(
                        activeCallout === "workshop"
                          ? null
                          : "Hand-assembled scaffolding and timber formwork constructed on site (1971–1977)."
                      )
                    }
                    className="flex items-center gap-1.5 text-ink hover:text-terracotta font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Compass size={12} className="text-forest" />
                    <span>{activeCallout ? "CLOSE ANNOTATION" : "INSPECT FORMWORK"}</span>
                  </button>
                  <span className="text-border">·</span>
                  <span className="font-mono text-[10px] text-ink-muted uppercase">
                    PEACE AREA WORKSHOP
                  </span>
                </div>
              </div>
            )}

            {/* Phase 3 Narrative: A Thousand Small Decisions */}
            {activePhase === 3 && (
              <div className="animate-fade-in">
                <h3 className="font-serif italic text-2xl md:text-3xl lg:text-4xl text-ink font-light leading-tight">
                  A thousand small decisions.
                </h3>
                <p className="font-sans text-xs md:text-sm text-ink-muted mt-3 leading-relaxed font-light max-w-md">
                  1,415 convex and concave discs sheathe the geodesic frame, deflecting monsoonal wind
                  shear and diffusing the southern Indian sun into interior quietude.
                </p>

                <div className="mt-6 pt-4 border-t border-border/80 flex flex-col gap-2.5">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center justify-between px-3.5 py-2 bg-paper-light border border-border hover:border-gold text-ink font-mono text-[10px] uppercase tracking-wider transition-colors archival-shadow-subtle rounded-xs cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={13} className="text-gold" />
                      <span>{showComparison ? "RETURN TO MACRO DETAIL" : "COMPARE OUTLINE VS GOLD"}</span>
                    </div>
                    <span className="text-gold font-semibold">↔</span>
                  </button>
                  <div className="flex items-center gap-2 font-mono text-[9.5px] text-ink-muted">
                    <Sparkles size={11} className="text-gold" />
                    <span>28-KARAT GOLD LEAF MOSAIC TILES</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contextual Inline Annotation Card (Not an intrusive pop-up) */}
          {activeCallout && (
            <div className="mt-4 p-3.5 bg-paper-light border border-border archival-shadow-subtle text-xs text-ink-muted font-sans font-light animate-fade-in flex items-start justify-between gap-3">
              <p>{activeCallout}</p>
              <button
                onClick={() => setActiveCallout(null)}
                className="text-ink hover:text-terracotta text-sm leading-none font-mono"
              >
                ×
              </button>
            </div>
          )}

          {/* Bottom Architectural Spec Line */}
          <div className="hidden lg:flex items-center justify-between pt-4 border-t border-border/60 font-mono text-[9px] uppercase tracking-widest text-ink-muted">
            <span>AXIS: 11° 59′ N, 79° 49′ E</span>
            <span className="text-terracotta">SPHERICAL RADIUS: 18 METERS</span>
          </div>
        </div>

        {/* -----------------------------------------------------------------------
            RIGHT COLUMN: The Continuous Evolving Architectural Drawing
            (One monumental artwork, evolving in place across scroll states)
            ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 relative w-full aspect-[4/3] md:aspect-[16/11] bg-paper-light border border-border archival-shadow overflow-hidden rounded-xs">
          
          {/* Comparison Slider Mode in Phase 3 */}
          {showComparison && p3Weight > 0.4 ? (
            <div className="absolute inset-0 w-full h-full z-30 animate-fade-in">
              <LayerComparison
                outlineSrc="/illustrated/ch03-structure/matrimandir-outline.webp"
                shadedSrc="/illustrated/ch03-structure/matrimandir-shaded.webp"
                outlineAlt="Graphite line study of Matrimandir elevation"
                shadedAlt="Toned graphite and gold leaf shaded study of Matrimandir"
                className="w-full h-full border-none shadow-none"
              />
            </div>
          ) : null}

          {/* Layer 1: Structural Elevation Study (Outline vs Shaded) */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-400"
            style={{
              opacity: p1Weight,
              pointerEvents: p1Weight > 0.2 ? "auto" : "none",
            }}
          >
            <Image
              src={
                outlineMode
                  ? "/illustrated/ch03-structure/matrimandir-outline.webp"
                  : "/illustrated/ch03-structure/matrimandir-shaded.webp"
              }
              alt="Structural elevation drawing of the Matrimandir"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-contain p-2 md:p-4"
              priority
            />
            <div className="absolute bottom-2.5 right-3 font-mono text-[8px] uppercase tracking-widest text-ink-muted/70 bg-paper-light/80 px-2 py-0.5 border border-border/50">
              {outlineMode ? "GRAPHITE ELEVATION OUTLINE" : "TONED STRUCTURAL STUDY"}
            </div>
          </div>

          {/* Layer 2: Workshop of Hands (Artisans and Timber Armature) */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-400"
            style={{
              opacity: p2Weight,
              pointerEvents: p2Weight > 0.2 ? "auto" : "none",
            }}
          >
            <Image
              src="/illustrated/ch03-structure/ch03-frame-b-making.webp"
              alt="Artisans and architects assembling the Matrimandir structure in Auroville workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-2.5 right-3 font-mono text-[8px] uppercase tracking-widest text-ink-muted/70 bg-paper-light/80 px-2 py-0.5 border border-border/50">
              WORKSHOP & TIMBER FORMWORK
            </div>
          </div>

          {/* Layer 3: Macro Geodesic Discs Detail */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-400"
            style={{
              opacity: p3Weight,
              pointerEvents: p3Weight > 0.2 ? "auto" : "none",
            }}
          >
            <Image
              src="/illustrated/ch03-structure/ch03-frame-c-macro.webp"
              alt="Macro drawing of Matrimandir geodesic discs and gold leaf mosaic tiles"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-2.5 right-3 font-mono text-[8px] uppercase tracking-widest text-gold/90 bg-paper-light/80 px-2 py-0.5 border border-border/50 font-medium">
              1,415 GILDED GEODESIC DISCS
            </div>
          </div>

          {/* Fine Drafting Compass & Axis Overlays */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="#5B5751"
              strokeWidth="0.75"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="82%"
              x2="100%"
              y2="82%"
              stroke="#5B5751"
              strokeWidth="0.75"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          CONTINUOUS HANDOFF TO CH04: Architectural Arc unrolls into Suspension Cord
          ========================================================================= */}
      <div
        className="absolute bottom-0 inset-x-0 w-full h-24 pointer-events-none z-30 transition-opacity duration-500"
        style={{
          opacity: handoffCH04,
        }}
      >
        <svg
          viewBox="0 0 1440 96"
          fill="none"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M -40 20 Q 720 70, 1480 25"
            stroke="#4A453E"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
