"use client";

import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";
import SvgStrokePath from "@/components/interactions/SvgStrokePath";

interface InsidePhotographProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function InsidePhotograph({ progress, active }: InsidePhotographProps) {
  // Normalize progress for Scene 02 (0.22 to 0.45)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.22) / 0.23));

  if (!active && (progress < 0.20 || progress > 0.48)) {
    return null;
  }

  // Phase 1: 0 - 0.35 (Drawing transforms into real photograph)
  // Phase 2: 0.35 - 0.65 (Full photographic immersion with editorial statement)
  // Phase 3: 0.65 - 0.90 (Photo contracts into archival print; supporting detail photo enters)
  // Phase 4: 0.90 - 1.00 (Handoff to Scene 03 archive layout)

  // Sketch-to-photo reveal calculation
  // At localProgress = 0, sketch is 100% visible, photo is 0%
  // Between 0 and 0.35, photo reveals smoothly through the sketch silhouette
  const photoRevealProgress = Math.min(1, Math.max(0, localProgress / 0.32));
  const sketchOpacity = Math.max(0, 1 - photoRevealProgress * 1.5);

  // Statement typography entrance and exit (fades cleanly before contraction starts)
  const textEnter = Math.min(1, Math.max(0, (localProgress - 0.12) / 0.22));
  const textExit = Math.min(1, Math.max(0, (localProgress - 0.48) / 0.15));
  const statementOpacity = textEnter * (1 - textExit);
  const statementTranslateY = (1 - textEnter) * 35 - textExit * 30;

  // Print contraction (Phase 3 & 4: 0.58 to 0.93)
  const contractProgress = Math.min(1, Math.max(0, (localProgress - 0.58) / 0.35));

  // Supporting detail photograph entrance (enters in Phase 4 once hero print is in position)
  const detailEnterProgress = Math.min(1, Math.max(0, (localProgress - 0.82) / 0.15));

  // Responsive dimensions for contracting hero print:
  // Starts at 100vw x 100vh, contracts to ~46vw x ~60vh (desktop) or ~84vw x ~46vh (mobile)
  const heroWidthVw = 100 - contractProgress * 54;
  const heroHeightVh = 100 - contractProgress * 40;
  const heroTranslateX = contractProgress * -18; // shifts decisively left to match Scene 03 Plate 01 position

  const coverImage = AUROVILLE_IMAGES.cover;
  const detailImage = AUROVILLE_IMAGES.detail;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none flex items-center justify-center"
      style={{
        zIndex: 15,
        visibility: progress >= 0.20 && progress <= 0.48 ? "visible" : "hidden",
      }}
    >
      {/* Background paper revealed during contraction */}
      <div
        className="absolute inset-0 bg-paper paper-texture transition-opacity duration-300"
        style={{ opacity: contractProgress }}
      />

      {/* BACKGROUND VECTOR GUIDELINES (Retained as subtle drafting marks) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 0.4 - contractProgress * 0.4),
        }}
      >
        <SvgStrokePath progress={1} className="w-full h-full" />
      </div>

      {/* EDITORIAL FLOATING STATEMENT (Phases 1 & 2) */}
      <div
        className="absolute z-30 left-6 md:left-16 bottom-24 md:bottom-28 max-w-2xl p-6 md:p-8 bg-ink/75 backdrop-blur-md border-l-2 border-gold transition-all duration-100 ease-out pointer-events-none"
        style={{
          opacity: statementOpacity,
          transform: `translateY(${statementTranslateY}px)`,
        }}
      >
        <div className="flex items-center gap-3 mb-2 font-mono text-[10px] uppercase tracking-widest text-gold font-semibold">
          <span>CHAPTER 02 / INTO THE FRAME</span>
          <span className="w-6 h-[1px] bg-gold/50" />
          <span className="text-paper-light/70">DRAWING INTO REALITY</span>
        </div>

        <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-paper-light font-light tracking-tight">
          Not just a place.
        </h2>
        <h3 className="font-display text-2xl sm:text-4xl md:text-5xl text-gold tracking-tight mt-1">
          AN IDEA IN PROGRESS.
        </h3>

        <p className="mt-4 font-sans text-xs md:text-sm text-paper-light/90 leading-relaxed font-light">
          The golden geodesic sphere crowned with 1,415 hand-gilded concave discs, set within
          radial amphitheater gardens in central Auroville.
        </p>
      </div>

      {/* THE PRIMARY TRANSFORMING ELEMENT: SKETCH -> PHOTOGRAPH */}
      <div
        className="relative z-10 transition-all duration-75 ease-out flex flex-col items-center justify-center"
        style={{
          width: contractProgress === 0 ? "100vw" : `${heroWidthVw}vw`,
          height: contractProgress === 0 ? "100vh" : `${heroHeightVh}vh`,
          maxWidth: contractProgress >= 0.9 ? "660px" : "100vw",
          maxHeight: contractProgress >= 0.9 ? "740px" : "100vh",
          transform: contractProgress === 0 ? "none" : `translateX(${heroTranslateX}vw)`,
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden transition-all duration-75"
          style={{
            borderRadius: contractProgress === 0 ? "0px" : `${contractProgress * 4}px`,
            border: contractProgress > 0.4 ? "1px solid rgba(223, 217, 204, 0.9)" : "none",
            boxShadow:
              contractProgress > 0.4
                ? "0 24px 50px -12px rgba(25,25,23,0.16), 0 4px 16px rgba(25,25,23,0.06)"
                : "none",
          }}
        >
          {/* Layer A: Real Authentic Architectural Photograph */}
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-300"
            style={{ opacity: photoRevealProgress }}
          >
            <Image
              src={coverImage.src}
              alt={coverImage.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 82%" }}
              priority
            />
          </div>

          {/* Layer B: Architectural Line-Art Sketch (Fades out as photo reveals) */}
          <div
            className="absolute inset-0 w-full h-full bg-paper-light flex items-center justify-center transition-opacity duration-300"
            style={{
              opacity: sketchOpacity,
            }}
          >
            <Image
              src="/art/architecture/matrimandir-study.webp"
              alt="Architectural elevation line drawing"
              fill
              sizes="100vw"
              className="object-contain p-4 md:p-8"
              priority
            />
          </div>

          {/* Architectural Drawing Grid Overlay (subtle linework that stays as graphic detail) */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 0.35 - contractProgress * 0.35),
            }}
          >
            <div className="w-full h-full border border-paper-light/30 grid grid-cols-6 grid-rows-6">
              <div className="border-r border-paper-light/20" />
              <div className="border-r border-paper-light/20" />
              <div className="border-r border-paper-light/20" />
              <div className="border-r border-paper-light/20" />
              <div className="border-r border-paper-light/20" />
            </div>
          </div>
        </div>

        {/* Archival Print Caption (Emerges in Phase 3 & 4) */}
        <div
          className="absolute -bottom-8 left-0 right-0 flex items-center justify-between text-ink-muted text-[10px] md:text-[11px] font-mono tracking-widest uppercase transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: Math.max(0, (contractProgress - 0.5) / 0.5),
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            <span>PLATE 01 / MATRIMANDIR SPHERE</span>
          </div>
          <span className="text-ink-faint">ELEVATION VISTA</span>
        </div>
      </div>

      {/* SUPPORTING PHOTOGRAPH: GOLD ACOUSTIC DISCS DETAIL (Enters in Phase 3 to balance composition) */}
      <div
        className="hidden md:flex flex-col absolute right-[6vw] top-1/2 -translate-y-1/2 w-[26vw] max-w-[360px] z-10 transition-all duration-300"
        style={{
          opacity: detailEnterProgress,
          transform: `translateY(calc(-50% + ${(1 - detailEnterProgress) * 40}px))`,
        }}
      >
        <div className="relative w-full aspect-[4/3] bg-paper-light border border-border archival-shadow-subtle overflow-hidden">
          <Image
            src={detailImage.src}
            alt={detailImage.alt}
            fill
            sizes="30vw"
            className="object-cover"
          />
        </div>
        <div className="pt-2 flex items-center justify-between font-mono text-[9px] text-ink-muted uppercase tracking-widest">
          <span>SURFACE METAMORPHOSIS</span>
          <span className="text-gold">1,415 GOLD DISCS</span>
        </div>
      </div>
    </div>
  );
}
