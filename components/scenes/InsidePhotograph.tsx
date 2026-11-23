"use client";

import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";

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

  const coverImage = AUROVILLE_IMAGES.cover;

  // Phase 1: 0 - 0.20 (Arrival & editorial statement)
  // Phase 2: 0.20 - 0.45 (2D depth shift & text transit)
  // Phase 3: 0.45 - 0.65 (Background paper revealed)
  // Phase 4: 0.65 - 0.90 (Contraction into archival print)
  // Phase 5: 0.90 - 1.00 (Settles into Scene 03 coordinates)

  // Typography entrance and exit
  // Enters in Phase 1 (0 to 0.15), stays visible in Phase 2, fades as print contracts (Phase 3 & 4)
  const textEnterProgress = Math.min(1, Math.max(0, localProgress / 0.18));
  const textExitProgress = Math.min(1, Math.max(0, (localProgress - 0.45) / 0.20));
  const titleOpacity = textEnterProgress * (1 - textExitProgress);
  const titleTranslateY = (1 - textEnterProgress) * 40 - textExitProgress * 30;

  // 2D Photographic Depth Translation (Phase 1 & 2)
  const depthShiftX = Math.sin(localProgress * Math.PI) * 15;
  const depthShiftY = localProgress * 20;

  // Print Contraction Progress (Phase 3 & 4: 0.45 to 0.90)
  const contractProgress = Math.min(1, Math.max(0, (localProgress - 0.45) / 0.45));

  // Visual coordinates for the contracting print:
  // Starts at 100vw x 100vh (contractProgress = 0)
  // Reaches desktop: ~42vw width, ~58vh height, centered slightly left (left: 8vw)
  // Mobile: ~78vw width, ~48vh height
  const printWidthVw = 100 - contractProgress * 58; // 100vw -> 42vw
  const printHeightVh = 100 - contractProgress * 42; // 100vh -> 58vh
  const printTranslateX = contractProgress * -6; // shifts slightly left of center (-6vw)
  const printBorderRadius = contractProgress * 4; // subtle rounded print corners

  // Paper background opacity beneath the contracting print
  const paperOpacity = Math.min(1, Math.max(0, (localProgress - 0.40) / 0.25));

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none flex items-center justify-center"
      style={{
        zIndex: 15,
        visibility: progress >= 0.20 && progress <= 0.48 ? "visible" : "hidden",
      }}
    >
      {/* Underlying Warm Archival Paper that emerges in Phase 3 */}
      <div
        className="absolute inset-0 bg-paper paper-texture transition-opacity duration-300"
        style={{ opacity: paperOpacity }}
      />

      {/* Floating Editorial Statement (Phases 1 - 3) */}
      <div
        className="absolute z-20 left-6 md:left-16 bottom-28 md:bottom-32 max-w-4xl p-6 md:p-8 bg-ink/60 backdrop-blur-md border-l-2 border-gold transition-all duration-100 ease-out pointer-events-none"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold font-semibold">
            CHAPTER 02 / INSIDE THE GEOMETRY
          </span>
          <span className="w-8 h-[1px] bg-gold/50" />
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-paper-light font-light tracking-tight">
          NOT JUST A PLACE.
        </h1>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-gold font-light tracking-tight italic mt-1">
          AN IDEA IN PROGRESS.
        </h2>

        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3 text-paper-light/80 font-mono text-[10px] md:text-[11px] tracking-widest uppercase">
          <span>PEACE AREA · LAT 12.0069° N</span>
          <span className="hidden md:inline">·</span>
          <span>AN INQUIRY IN COLLECTIVE HUMAN EVOLUTION</span>
        </div>
      </div>

      {/* The Central Contracting Photograph / Archival Print */}
      <div
        className="relative z-10 transition-all duration-75 ease-out flex flex-col items-center justify-center"
        style={{
          width: `${printWidthVw}vw`,
          height: `${printHeightVh}vh`,
          maxWidth: contractProgress >= 0.9 ? "620px" : "100vw",
          maxHeight: contractProgress >= 0.9 ? "740px" : "100vh",
          transform: `translateX(${printTranslateX}vw)`,
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden transition-all duration-75"
          style={{
            borderRadius: `${printBorderRadius}px`,
            border: contractProgress > 0.4 ? "1px solid rgba(215, 208, 195, 0.9)" : "none",
            boxShadow:
              contractProgress > 0.4
                ? "0 24px 50px -12px rgba(27,29,25,0.16), 0 4px 16px rgba(27,29,25,0.06)"
                : "none",
          }}
        >
          {/* Internal image with subtle 2D parallax framing */}
          <div
            className="relative w-full h-full min-w-full min-h-full"
            style={{
              transform: `translate(${depthShiftX * (1 - contractProgress)}px, ${
                depthShiftY * (1 - contractProgress)
              }px) scale(${1.05 - contractProgress * 0.05})`,
            }}
          >
            <Image
              src={coverImage.src}
              alt={coverImage.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />

            {/* Archival Print Vignette / subtle paper grain */}
            <div
              className="absolute inset-0 bg-ink/5 pointer-events-none transition-opacity duration-300"
              style={{ opacity: contractProgress }}
            />
          </div>
        </div>

        {/* Archival Print Caption & Accession Badge (appears in Phase 4 & 5) */}
        <div
          className="w-full pt-3 flex items-center justify-between text-ink-muted text-[10px] md:text-[11px] font-mono tracking-widest uppercase transition-opacity duration-300"
          style={{
            opacity: Math.max(0, (contractProgress - 0.6) / 0.4),
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            <span>ACCESSION MM-01 / MASTER VISTA</span>
          </div>
          <span className="text-ink-faint">SCALE 1:500</span>
        </div>
      </div>
    </div>
  );
}
