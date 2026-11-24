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

  // Pointer interaction state
  const [pointer, setPointer] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [isNearPotter, setIsNearPotter] = useState(false);
  const [isNearDome, setIsNearDome] = useState(false);
  const [isNearBanyan, setIsNearBanyan] = useState(false);

  // Smooth pointer physics
  const pointerPos = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const targetPos = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w) * 2 - 1; // -1 to 1
      const ny = (e.clientY / h) * 2 - 1; // -1 to 1

      targetPos.current = {
        x: e.clientX,
        y: e.clientY,
        normX: nx,
        normY: ny,
      };

      // Detect proximity to key illustrated subjects
      // Potter is in bottom-left zone (x < 35% w, y > 50% h)
      setIsNearPotter(e.clientX < w * 0.35 && e.clientY > h * 0.45);
      // Dome is centered (30% < x < 70%, 25% < y < 75%)
      setIsNearDome(e.clientX > w * 0.32 && e.clientX < w * 0.68 && e.clientY > h * 0.25 && e.clientY < h * 0.75);
      // Banyan is right zone (x > 60% w, y < 85% h)
      setIsNearBanyan(e.clientX > w * 0.60 && e.clientY < h * 0.85);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    const animate = () => {
      pointerPos.current = {
        x: lerp(pointerPos.current.x, targetPos.current.x, 0.08),
        y: lerp(pointerPos.current.y, targetPos.current.y, 0.08),
        normX: lerp(pointerPos.current.normX, targetPos.current.normX, 0.08),
        normY: lerp(pointerPos.current.normY, targetPos.current.normY, 0.08),
      };
      setPointer({ ...pointerPos.current });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!active && progress > 0.32) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY (Strictly based on V5 brief)
  // 0% – 15%: Completed hero visible. Small pointer interactions active.
  // 15% – 40%: Typography begins shifting & revealing more architectural drawing.
  // 40% – 70%: Matrimandir illustration becomes dominant composition.
  // 70% – 90%: Drawn story line guides attention toward next scene.
  // 90% – 100%: Architectural artwork becomes visual starting point of Chapter 02.
  // ---------------------------------------------------------------------------

  const typeShift = Math.min(1, Math.max(0, (localProgress - 0.12) / 0.45));
  const domeFocus = Math.min(1, Math.max(0, (localProgress - 0.25) / 0.55));
  const pathDraw = Math.min(1, Math.max(0, (localProgress - 0.55) / 0.40));

  // Typography translates outward with intentional geometric clipping
  const textTranslateX = typeShift * 420;
  // Typography retains crisp black ink density instead of fading to pale grey
  const textOpacity = typeShift > 0.8 ? Math.max(0, 1 - (typeShift - 0.8) / 0.2) : 1;

  // The central Matrimandir architectural drawing expands to command the viewport
  const domeScale = 1 + domeFocus * 0.35;

  // Banyan subtle organic displacement (2–4px) based on pointer proximity
  const banyanSwayX = isNearBanyan ? pointer.normX * 4 : 0;
  const banyanSwayY = isNearBanyan ? pointer.normY * 3 : 0;

  // Potter subtle parallax
  const potterParallaxX = pointer.normX * -4 - typeShift * 140;
  const potterParallaxY = pointer.normY * -2;

  return (
    <div
      className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden pointer-events-none select-none bg-paper"
      style={{
        zIndex: 10,
        visibility: progress <= 0.32 ? "visible" : "hidden",
      }}
    >
      {/* =====================================================================
          21ST MCP LIVING CONTOUR FIELD (Subtle Graphite/Terracotta Drafting)
          Restrained, faint lines concentrated in negative space areas
          ===================================================================== */}
      <LivingContourField
        variant="hero-draft"
        active={active}
        scrollProgress={localProgress}
        density={0.55}
        opacity={0.35 * (1 - domeFocus * 0.4)}
      />

      {/* =====================================================================
          MAIN MONUMENTAL DISPLAY TYPOGRAPHY (AURO / VILLE)
          Massive Archivo Black typography layered with architectural drawing
          ===================================================================== */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto flex flex-col justify-center pt-14">
        {/* Top Headline: AURO */}
        <div
          className="w-full flex items-baseline justify-start transition-transform duration-75 ease-out"
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
          className="w-full flex items-baseline justify-end transition-transform duration-75 ease-out -mt-4 md:-mt-8"
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
          ILLUSTRATION LAYER 01 — HAND-DRAWN CENTENARY BANYAN TREE (Right)
          Features organic leaf sway (2–4px displacement) on pointer proximity
          ===================================================================== */}
      <div
        className="hidden md:block absolute right-[-4vw] md:right-[-2vw] bottom-[2vh] md:bottom-[4vh] w-[55vw] md:w-[42vw] max-w-[700px] z-15 pointer-events-none transition-all duration-300 ease-out"
        style={{
          opacity: Math.max(0, 1 - typeShift * 1.2),
          transform: `translate(${banyanSwayX + typeShift * 120}px, ${banyanSwayY - typeShift * 20}px)`,
        }}
      >
        <Image
          src="/art/botanical/banyan-tree.webp"
          alt="Archival ink illustration of the centenary banyan tree"
          width={1376}
          height={768}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* =====================================================================
          ILLUSTRATION LAYER 02 — HAND-DRAWN ARTISAN / POTTER (Left)
          With subtle throwing swirl detail on pointer proximity
          ===================================================================== */}
      <div
        className="hidden md:block absolute left-[5vw] md:left-[7vw] bottom-[24vh] md:bottom-[26vh] w-[28vw] md:w-[14vw] max-w-[210px] z-15 transition-all duration-300 ease-out"
        style={{
          opacity: Math.max(0, 1 - typeShift * 1.2),
          transform: `translate(${potterParallaxX}px, ${potterParallaxY}px)`,
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/art/people/potter.webp"
            alt="Hand-drawn illustration of an artisan shaping terracotta clay"
            width={700}
            height={768}
            className="w-full h-auto object-contain"
            priority
          />
          {/* Subtle concentric throwing texture appearing on clay vessel on proximity */}
          <div
            className="absolute left-[38%] top-[45%] w-10 h-10 pointer-events-none transition-opacity duration-500 rounded-full"
            style={{
              opacity: isNearPotter ? 0.45 : 0,
            }}
          >
            <svg viewBox="0 0 40 40" className="w-full h-full stroke-terracotta fill-none">
              <ellipse cx="20" cy="20" rx="14" ry="7" strokeWidth="0.8" strokeDasharray="3 2" />
              <ellipse cx="20" cy="20" rx="9" ry="4.5" strokeWidth="0.75" />
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CENTRAL ARCHITECTURAL STUDY DRAWING (MATRIMANDIR ELEVATION)
          Positioned in geometric center; scales monumentally on scroll so it NEVER
          sits in a dead zone or empty vacuum hold.
          ===================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 transition-transform duration-100 flex items-center justify-center pointer-events-none"
        style={{
          width: `clamp(340px, 44vw, 680px)`,
          height: `clamp(320px, 42vh, 620px)`,
          transform: `translate(-50%, -50%) scale(${domeScale})`,
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

          {/* Graphite Hatching Reveal Layer (Interaction 03) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isNearDome ? 0.35 : 0.05,
            }}
          >
            <svg viewBox="0 0 600 500" className="w-full h-full" fill="none">
              {/* Fine construction drafting arcs */}
              <circle
                cx="300"
                cy="250"
                r="160"
                stroke="#191917"
                strokeWidth="0.75"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <circle
                cx="300"
                cy="250"
                r="190"
                stroke="#191917"
                strokeWidth="0.5"
                strokeDasharray="2 4"
                opacity="0.35"
              />
              {/* Radial drafting rays */}
              <line x1="140" y1="250" x2="460" y2="250" stroke="#191917" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <line x1="300" y1="90" x2="300" y2="410" stroke="#191917" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CONTINUOUS STORY CONTOUR LINE (Connects directly into Chapter 02)
          Pencil line originates from architecture and unrolls smoothly to the right
          ===================================================================== */}
      <div
        className="absolute top-1/2 left-1/2 right-0 -translate-y-1/2 z-20 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: pathDraw,
        }}
      >
        <StoryPath progress={pathDraw} variant="hero-to-fold" />
      </div>

      {/* =====================================================================
          BOTTOM EDITORIAL STATEMENT (Clean, restrained, zero telemetry)
          ===================================================================== */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 md:pb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 transition-transform duration-300"
        style={{
          opacity: textOpacity,
          transform: `translateY(${typeShift * 20}px)`,
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
