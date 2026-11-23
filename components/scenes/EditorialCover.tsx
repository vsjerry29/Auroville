"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import LivingContourField from "@/components/experience/LivingContourField";
import StoryPath from "@/components/interactions/StoryPath";

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
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.current = {
        x: nx * 10,
        y: ny * 6,
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
  // Phase 1 (0 to 0.30): Still monumental hero, subtle contour breathing
  // Phase 2 (0.30 to 0.70): Typography glides outward, central building enlarges smoothly
  // Phase 3 (0.70 to 1.00): Horizon line unrolls directly toward Chapter 02 opening fold
  const splitProgress = Math.min(1, Math.max(0, (localProgress - 0.25) / 0.50));
  const expandProgress = Math.min(1, Math.max(0, (localProgress - 0.35) / 0.65));

  const textTranslateX = splitProgress * 160;
  const textOpacity = Math.max(0, 1 - splitProgress * 1.5);
  const illustrationOpacity = Math.max(0, 1 - splitProgress * 1.3);

  if (!active && progress > 0.25) {
    return null;
  }

  // Calculate dynamic size of central architectural study so it NEVER looks tiny or lost
  const domeScale = 1 + expandProgress * 0.45;

  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden pointer-events-none select-none bg-paper"
      style={{
        zIndex: 10,
        visibility: progress <= 0.25 ? "visible" : "hidden",
      }}
    >
      {/* =====================================================================
          21ST MCP LIVING CONTOUR FIELD (Subtle Graphite/Terracotta Terrain Drafting)
          Zero dot-grids, zero concentric target telemetry circles
          ===================================================================== */}
      <LivingContourField
        variant="hero-draft"
        active={active}
        scrollProgress={localProgress}
        density={0.7}
      />

      {/* =====================================================================
          MAIN MONUMENTAL COMPOSITION (AUROVILLE)
          ===================================================================== */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto flex flex-col justify-center pt-16">
        {/* Top Headline: AURO */}
        <div
          className="w-full flex items-baseline justify-start transition-transform duration-100 ease-out"
          style={{
            transform: `translateX(-${textTranslateX}px)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[26vw] md:text-[18vw] text-ink leading-[0.80] tracking-tighter2 select-none">
            AURO
          </h1>
        </div>

        {/* Bottom Headline: VILLE */}
        <div
          className="w-full flex items-baseline justify-end transition-transform duration-100 ease-out -mt-4 md:-mt-8"
          style={{
            transform: `translateX(${textTranslateX}px)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[26vw] md:text-[18vw] text-ink leading-[0.80] tracking-tighter2 select-none text-right">
            VILLE
          </h1>
        </div>
      </div>

      {/* =====================================================================
          ILLUSTRATION LAYER 01 — HAND-DRAWN BANYAN TREE (Positioned Right)
          ===================================================================== */}
      <div
        className="hidden md:block absolute right-[-4vw] md:right-[-2vw] bottom-[2vh] md:bottom-[4vh] w-[55vw] md:w-[42vw] max-w-[700px] z-15 pointer-events-none transition-all duration-100 ease-out"
        style={{
          opacity: illustrationOpacity,
          transform: !isTouch
            ? `translate(${pointerOffset.x * 0.7 + splitProgress * 100}px, ${
                pointerOffset.y * 0.5 - splitProgress * 30
              }px)`
            : `translateX(${splitProgress * 100}px)`,
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
      </div>

      {/* =====================================================================
          ILLUSTRATION LAYER 02 — HAND-DRAWN ARTISAN / POTTER (Positioned Left)
          ===================================================================== */}
      <div
        className="hidden md:block absolute left-[5vw] md:left-[7vw] bottom-[24vh] md:bottom-[26vh] w-[28vw] md:w-[14vw] max-w-[210px] z-15 transition-all duration-100 ease-out"
        style={{
          opacity: illustrationOpacity,
          transform: !isTouch
            ? `translate(${pointerOffset.x * -0.5 - splitProgress * 120}px, ${
                pointerOffset.y * -0.3 + splitProgress * 25
              }px)`
            : `translateX(-${splitProgress * 120}px)`,
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
      </div>

      {/* =====================================================================
          CENTRAL ARCHITECTURAL STUDY DRAWING
          Scales monumentally as letters glide away so it NEVER sits in a dead zone
          ===================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 transition-transform duration-75 flex items-center justify-center pointer-events-none"
        style={{
          width: `clamp(340px, 44vw, 680px)`,
          height: `clamp(320px, 42vh, 620px)`,
          transform: `translate(-50%, -50%) scale(${domeScale})`,
          opacity: Math.max(0, 1 - expandProgress * 0.4),
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/art/architecture/matrimandir-study.webp"
            alt="Original architectural elevation study of the Matrimandir dome"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2 md:p-4"
            priority
          />
        </div>
      </div>

      {/* =====================================================================
          CONTINUOUS STORY CONTOUR LINE (Connects directly into Chapter 02 Fold)
          ===================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 right-0 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: Math.max(0, localProgress * 1.8),
        }}
      >
        <StoryPath progress={Math.min(1, localProgress * 1.6)} variant="hero-to-fold" />
      </div>

      {/* =====================================================================
          BOTTOM EDITORIAL STATEMENT (Clean, restrained, zero telemetry)
          ===================================================================== */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 md:pb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 transition-transform duration-300"
        style={{
          opacity: textOpacity,
          transform: `translateY(${splitProgress * 20}px)`,
        }}
      >
        <div className="max-w-md">
          <h2 className="font-serif italic text-2xl md:text-3xl text-ink font-light leading-snug">
            A place still becoming.
          </h2>
          <p className="font-sans text-xs md:text-sm text-ink-muted mt-1 leading-relaxed font-light">
            Founded in 1968 on an eroded red plateau in southern India. Dedicated to human
            unity, architecture, and ecological regeneration.
          </p>
        </div>
      </div>
    </div>
  );
}
