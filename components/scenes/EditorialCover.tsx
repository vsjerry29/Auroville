"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import SvgStrokePath from "@/components/interactions/SvgStrokePath";

interface EditorialCoverProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function EditorialCover({ progress, active }: EditorialCoverProps) {
  // Normalize progress for Scene 01 (0.00 to 0.22)
  const localProgress = Math.min(1, Math.max(0, progress / 0.22));

  // Pointer interaction state (gentle illustration parallax)
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const targetOffset = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.current = {
        x: nx * 12,
        y: ny * 8,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    const animate = () => {
      setPointerOffset((prev) => ({
        x: lerp(prev.x, targetOffset.current.x, 0.08),
        y: lerp(prev.y, targetOffset.current.y, 0.08),
      }));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Scroll phase choreography:
  // Phase 1 (0 to 0.25): Stable artwork, pointer discovery, stroke drawing
  // Phase 2 (0.25 to 0.65): Typography splits outward, tree and figures slide aside
  // Phase 3 (0.65 to 1.00): Architectural drawing expands to fill viewport, matching Scene 02 opening

  const splitProgress = Math.min(1, Math.max(0, (localProgress - 0.20) / 0.55));
  const expandProgress = Math.min(1, Math.max(0, (localProgress - 0.35) / 0.65));

  const textTranslateX = splitProgress * 180;
  const textOpacity = Math.max(0, 1 - splitProgress * 1.4);
  const illustrationOpacity = Math.max(0, 1 - splitProgress * 1.2);

  if (!active && progress > 0.25) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden pointer-events-none select-none"
      style={{
        zIndex: 10,
        visibility: progress <= 0.25 ? "visible" : "hidden",
      }}
    >
      {/* Background warm paper */}
      <div className="absolute inset-0 bg-paper paper-texture" />

      {/* BACKGROUND VECTOR COMPASS ARCS (Animated on scroll) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 0.6 - expandProgress * 0.6),
          transform: `translate(-50%, -50%) scale(${1 + expandProgress * 0.4})`,
        }}
      >
        <SvgStrokePath progress={localProgress * 1.5} className="w-full h-full" />
      </div>

      {/* TOP BAR / EDITORIAL EYEBROW */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-24 flex items-center justify-between transition-transform duration-300"
        style={{
          opacity: textOpacity,
          transform: `translateY(-${splitProgress * 25}px)`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            01 / MONOGRAPH
          </span>
          <span className="w-4 h-[1px] bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted hidden sm:inline">
            AN EXPERIMENT IN HUMAN UNITY
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted block">
            EDITION · ARCHIVAL DIGITAL PUBLICATION
          </span>
        </div>
      </div>

      {/* MAIN MONUMENTAL COMPOSITION (AUROVILLE) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto flex flex-col justify-center">
        {/* Top Headline: AURO */}
        <div
          className="w-full flex items-baseline justify-between transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(-${textTranslateX}px)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[26vw] md:text-[18vw] text-ink leading-[0.82] tracking-tighter2 select-none">
            AURO
          </h1>
          <span className="hidden lg:block font-serif italic text-2xl md:text-3xl text-ink-muted self-end pb-4 max-w-xs text-right">
            Where architecture becomes an inner inquiry
          </span>
        </div>

        {/* Bottom Headline: VILLE */}
        <div
          className="w-full flex items-baseline justify-end transition-transform duration-100 ease-out -mt-4 md:-mt-8"
          style={{
            transform: `translateX(${textTranslateX}px)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[26vw] md:text-[18vw] text-ink leading-[0.82] tracking-tighter2 select-none text-right">
            VILLE
          </h1>
        </div>
      </div>

      {/* ILLUSTRATION LAYER 01 — HAND-DRAWN BANYAN TREE (Positioned Right) */}
      <div
        className="hidden md:block absolute right-[-6vw] md:right-[-3vw] bottom-[2vh] md:bottom-[4vh] w-[60vw] md:w-[44vw] max-w-[720px] z-15 pointer-events-none opacity-35 md:opacity-100 transition-all duration-100 ease-out"
        style={{
          opacity: illustrationOpacity,
          transform: !isTouch
            ? `translate(${pointerOffset.x * 0.8 + splitProgress * 120}px, ${
                pointerOffset.y * 0.6 - splitProgress * 40
              }px)`
            : `translateX(${splitProgress * 120}px)`,
        }}
      >
        <Image
          src="/art/botanical/banyan-tree.webp"
          alt="Original archival ink illustration of the centenary banyan tree"
          width={1376}
          height={768}
          className="w-full h-auto object-contain"
          priority
        />
        <div className="absolute bottom-2 right-6 font-mono text-[9px] uppercase tracking-widest text-ink-muted hidden md:block">
          BOTANICAL ANCHOR · FICUS BENGHALENSIS
        </div>
      </div>

      {/* ILLUSTRATION LAYER 02 — HAND-DRAWN ARTISAN / POTTER (Positioned Left, Elevated Above Bottom Statement) */}
      <div
        className="hidden md:block absolute left-[4vw] md:left-[6vw] bottom-[28vh] md:bottom-[30vh] w-[32vw] md:w-[15vw] max-w-[220px] z-15 transition-all duration-100 ease-out"
        style={{
          opacity: illustrationOpacity,
          transform: !isTouch
            ? `translate(${pointerOffset.x * -0.6 - splitProgress * 140}px, ${
                pointerOffset.y * -0.4 + splitProgress * 30
              }px)`
            : `translateX(-${splitProgress * 140}px)`,
        }}
      >
        <Image
          src="/art/people/potter.webp"
          alt="Hand-drawn illustration of an artisan shaping terracotta clay"
          width={700}
          height={768}
          className="w-full h-auto object-contain"
          priority
        />
        <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-muted hidden md:block">
          MAKING & MATERIALITY · TERRACOTTA
        </div>
      </div>

      {/* CENTRAL ARCHITECTURAL STUDY DRAWING (Morphs into Scene 02 Entrance) */}
      {/* 
        Blends organically into warm paper at stillness (transparent background, zero harsh shadows).
        On scroll (expandProgress 0 -> 1), expands to 100vw x 100vh with seamless handoff to Scene 02!
      */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 overflow-hidden transition-all duration-75 flex items-center justify-center pointer-events-auto"
        style={{
          width: `clamp(${260 + expandProgress * 140}px, ${32 + expandProgress * 68}vw, 100vw)`,
          height: `clamp(${280 + expandProgress * 160}px, ${40 + expandProgress * 60}vh, 100vh)`,
          borderRadius: `${Math.max(0, (1 - expandProgress) * 4)}px`,
        }}
      >
        <div className="relative w-full h-full bg-transparent flex items-center justify-center">
          <Image
            src="/art/architecture/matrimandir-study.webp"
            alt="Original architectural study of the Matrimandir dome"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 md:p-6"
            priority
          />

          {/* Architectural Drafting Label inside Portal */}
          <div
            className="absolute bottom-2 md:bottom-3 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-ink-muted border-t border-ink/15 pt-1.5 transition-opacity duration-200"
            style={{
              opacity: Math.max(0, 1 - expandProgress * 2.5),
            }}
          >
            <span>STUDY: STRUCTURAL ELEVATION</span>
            <span className="text-terracotta">EXPLORE [SCROLL]</span>
          </div>
        </div>
      </div>

      {/* BOTTOM EDITORIAL STATEMENT & SCROLL INVITATION */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-14 md:pb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 transition-transform duration-300"
        style={{
          opacity: textOpacity,
          transform: `translateY(${splitProgress * 30}px)`,
        }}
      >
        <div className="max-w-md">
          <h2 className="font-serif italic text-3xl md:text-4xl text-ink font-light leading-tight">
            A place still becoming.
          </h2>
          <p className="font-sans text-xs md:text-sm text-ink-muted mt-1.5 leading-relaxed font-light">
            Founded in 1968 on a barren red plateau in southern India. An experimental township
            dedicated to human unity, architecture, and ecological regeneration.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          <span>SCROLL TO ENTER PHOTOGRAPHY</span>
        </div>
      </div>
    </div>
  );
}
