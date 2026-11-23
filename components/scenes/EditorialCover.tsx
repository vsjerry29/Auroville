"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";

interface EditorialCoverProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function EditorialCover({ progress, active }: EditorialCoverProps) {
  // Normalize progress for Scene 01 (0.00 to 0.22)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.0) / 0.22));

  // Pointer interaction state (subtle displacement)
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const targetOffset = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touchscreen
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse coords from -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // 6px to 14px displacement range
      targetOffset.current = {
        x: nx * 10,
        y: ny * 8,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth spring/lerp loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    const animate = () => {
      setPointerOffset((prev) => ({
        x: lerp(prev.x, targetOffset.current.x, 0.1),
        y: lerp(prev.y, targetOffset.current.y, 0.1),
      }));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Scroll phase calculations
  // Phase 1: 0 - 0.12 (Establish)
  // Phase 2: 0.12 - 0.35 (Begin expansion)
  // Phase 3: 0.35 - 0.60 (Typography gives way)
  // Phase 4: 0.60 - 0.88 (Full screen rectangle)
  // Phase 5: 0.88 - 1.00 (Handoff to Scene 02)

  // Typography outward displacement
  const textSplit = Math.max(0, (localProgress - 0.12) / 0.48); // 0 to 1 between 0.12 and 0.60
  const clampedTextSplit = Math.min(1, textSplit);
  const textTranslateX = clampedTextSplit * 120; // % translation
  const textOpacity = Math.max(0, 1 - clampedTextSplit * 1.3);

  // Portal Expansion calculations
  // Starts at initial centered card dimensions, expands to 100vw and 100vh
  const expansionProgress = Math.max(0, (localProgress - 0.12) / 0.76); // 0 to 1 between 0.12 and 0.88
  const clampedExpansion = Math.min(1, Math.max(0, expansionProgress));

  // Opacity of scene elements as localProgress reaches 1.0
  const sceneOpacity = localProgress > 0.95 ? Math.max(0, 1 - (localProgress - 0.95) / 0.05) : 1;

  if (!active && progress > 0.28) {
    return null;
  }

  const coverImage = AUROVILLE_IMAGES.cover;

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none"
      style={{
        zIndex: 10,
        visibility: progress <= 0.25 ? "visible" : "hidden",
      }}
    >
      {/* Background warm paper */}
      <div className="absolute inset-0 bg-paper paper-texture transition-opacity duration-300" />

      {/* Editorial top statement */}
      <div
        className="absolute top-20 md:top-24 right-6 md:right-12 z-20 text-right transition-transform duration-300"
        style={{
          opacity: textOpacity,
          transform: `translateY(-${clampedTextSplit * 30}px)`,
        }}
      >
        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest2 text-ink-muted block">
          AN INTERACTIVE EDITORIAL EXPERIENCE
        </span>
        <span className="font-serif italic text-xs md:text-sm text-ink-muted block mt-0.5">
          Conceived as an inquiry into human unity
        </span>
      </div>

      {/* Monumental Typography Container */}
      <div className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-24 md:py-28 z-10">
        {/* Top Wordmark Part: AURO */}
        <div
          className="w-full flex items-baseline justify-between select-none"
          style={{
            transform: `translate(-${clampedTextSplit * 140}px, -${clampedTextSplit * 40}px)`,
            opacity: textOpacity,
          }}
        >
          <span className="font-serif text-[22vw] md:text-[14vw] font-light text-ink tracking-tight leading-none inline-block">
            AURO
          </span>
          <span className="hidden lg:block font-mono text-[11px] uppercase tracking-widest text-ink-muted self-end pb-3">
            ARCHITECTURAL MONOGRAPH / EXP 001
          </span>
        </div>

        {/* Bottom Wordmark Part: VILLE + Philosophy & Scroll cue */}
        <div
          className="w-full flex flex-col md:flex-row items-start md:items-end justify-between select-none gap-6 md:gap-0"
          style={{
            transform: `translate(${clampedTextSplit * 140}px, ${clampedTextSplit * 40}px)`,
            opacity: textOpacity,
          }}
        >
          {/* Statement & cue */}
          <div className="max-w-xs order-2 md:order-1">
            <span className="font-mono text-[10px] text-terracotta uppercase tracking-widest block mb-1">
              PHILOSOPHICAL PREMISE
            </span>
            <p className="font-serif italic text-base md:text-lg text-ink/90 leading-snug">
              A place imagined differently. Where visual design responds to human inquiry.
            </p>
            <div className="mt-3 flex items-center gap-2 text-ink-muted font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              <span>SCROLL TO ENTER</span>
            </div>
          </div>

          {/* VILLE wordmark */}
          <span className="font-serif text-[22vw] md:text-[14vw] font-light text-ink tracking-tight leading-none inline-block text-right self-end order-1 md:order-2">
            VILLE
          </span>
        </div>
      </div>

      {/* CENTRAL EXPANDING PHOTOGRAPHIC PORTAL */}
      <div
        className="absolute z-20 overflow-hidden transition-all duration-75 flex items-center justify-center"
        style={{
          width: `clamp(${260 + clampedExpansion * 130}px, ${50 + clampedExpansion * 50}vw, 100vw)`,
          height: `clamp(${260 + clampedExpansion * 180}px, ${38 + clampedExpansion * 62}vh, 100vh)`,
          maxWidth: clampedExpansion >= 0.99 ? "100vw" : "1440px",
          maxHeight: clampedExpansion >= 0.99 ? "100vh" : "900px",
          borderRadius: `${Math.max(0, (1 - clampedExpansion) * 6)}px`,
          boxShadow:
            clampedExpansion < 0.8
              ? "0 24px 60px -15px rgba(27,29,25,0.22), 0 4px 16px rgba(27,29,25,0.08)"
              : "none",
          border: clampedExpansion < 0.9 ? "1px solid rgba(215, 208, 195, 0.8)" : "none",
        }}
      >
        {/* The Matrimandir Image */}
        <div
          className="relative w-full h-full min-w-full min-h-full transition-transform duration-100 ease-out"
          style={{
            transform: !isTouch && clampedExpansion < 0.8
              ? `translate(${pointerOffset.x}px, ${pointerOffset.y}px) scale(${1.03 - clampedExpansion * 0.03})`
              : "none",
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

          {/* Initial Portal Caption (fades out as expansion begins) */}
          <div
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-paper-light text-[10px] font-mono tracking-widest bg-ink/50 backdrop-blur-sm px-3 py-1.5 transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 1 - clampedExpansion * 3),
            }}
          >
            <span>MATRIMANDIR / LAT: 12.0069° N</span>
            <span className="text-gold">PORTAL ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
