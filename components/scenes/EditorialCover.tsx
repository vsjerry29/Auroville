"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import LivingContourField from "@/components/experience/LivingContourField";

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

  if (!active && progress > 0.22) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY (Unified CH01 -> CH02 Single Coordinate Transformation)
  // 0.000 – 0.025: Approved Hero composition visible at S = 0.42 behind AURO / VILLE.
  // 0.025 – 0.115: Typography, artisan, banyan tree & intro shift outward cleanly.
  // 0.045 – 0.205: Matrimandir expands smoothly (S: 0.42 -> 1.00) on the exact 1376x768
  //                coordinate grid, with detailed Chapter 02 graphite & forest artwork
  //                emerging radially through a mask around dome center (48.73% 47.66%).
  // 0.205 – 0.215: Exact 1:1 overlap lock with Chapter 02 starting frame (zero cut/pop).
  // ---------------------------------------------------------------------------

  // Stage 1 -> Stage 2: Typography & peripheral elements translate cleanly off-viewport (no grey fade ghosting)
  const rawTypeShift = Math.min(1, Math.max(0, (progress - 0.02) / 0.075));
  const typeShift = rawTypeShift * rawTypeShift * (3 - 2 * rawTypeShift);

  // Stage 2 -> Stage 4: Smooth continuous scale expansion S: 0.42 -> 1.00
  const rawExpand = Math.min(1, Math.max(0, (progress - 0.04) / 0.165));
  const expandEase = rawExpand * rawExpand * (3 - 2 * rawExpand);
  const artworkScale = 0.42 + expandEase * 0.58;

  // Center compensation so hero study feels horizontally balanced at small scale,
  // easing to exact 0% offset at S = 1.00 to lock 1:1 onto Chapter 02
  const centerShiftX = (1 - expandEase) * 0.9;

  // Stage 3: Radial masked emergence of detailed Chapter 02 ink illustration
  // Stage 3a (0.09 -> 0.15): detail emerges strictly inside dome/pillar/ramp radius (~38%)
  // while scaling up, avoiding any top/bottom canvas boundary cut on desktop or mobile.
  // Stage 3b (0.15 -> 0.205): as canvas approaches full-bleed (scale >= 0.85 -> 1.00),
  // mask opens across forest canopy, tree branch, clouds & grass seamlessly.
  const detailPhase = Math.min(1, Math.max(0, (progress - 0.085) / 0.12));
  const detailEase = Math.pow(detailPhase, 1.85);
  const detailMaskInner = -14 + detailEase * 122; // -14% -> 108%
  const detailMaskFeather = 22;

  // Soft vertical edge feather ONLY while scale < 0.96 so outer clouds/grass never show a horizontal seam
  const needsEdgeFeather = artworkScale < 0.97;

  // Typography translates completely clear of viewport width with crisp ink density (clip instead of grey wash)
  const textTranslateVw = typeShift * 98;
  const textOpacity = rawTypeShift >= 0.98 ? 0 : 1;

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
        visibility: progress <= 0.215 ? "visible" : "hidden",
      }}
    >
      {/* =====================================================================
          21ST MCP LIVING CONTOUR FIELD (Subtle Graphite/Terracotta Drafting)
          Fades smoothly away as the full detailed CH02 landscape emerges.
          ===================================================================== */}
      <LivingContourField
        variant="hero-draft"
        active={active && progress < 0.21}
        scrollProgress={localProgress}
        density={0.55}
        opacity={0.35 * (1 - detailPhase)}
      />

      {/* =====================================================================
          MAIN MONUMENTAL DISPLAY TYPOGRAPHY (AURO / VILLE)
          Deliberate upper-zone portrait placement on mobile/tablet-portrait;
          landscape desktop retains overlapping centered composition.
          ===================================================================== */}
      <div className="relative z-20 w-full max-w-7xl [@media(max-height:520px)]:max-w-lg mx-auto px-5 sm:px-8 md:px-12 pt-[clamp(62px,8.5dvh,88px)] md:pt-14 md:my-auto flex flex-col justify-start md:justify-center [@media(max-height:520px)]:pt-14 [@media(max-height:520px)]:my-0">
        {/* Top Headline: Pure bold Archivo Black AURO */}
        <div
          className="w-full flex items-baseline justify-start"
          style={{
            transform: `translateX(-${textTranslateVw}vw)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[clamp(3.05rem,17.8vw,5.1rem)] md:text-[18vw] [@media(max-height:520px)]:text-[16vh] text-ink leading-[0.82] md:leading-[0.80] tracking-[-0.045em] md:tracking-tighter2 select-none">
            AURO
          </h1>
        </div>

        {/* Bottom Headline: VILLE */}
        <div
          className="w-full flex items-baseline justify-end -mt-1 sm:-mt-2 md:-mt-8"
          style={{
            transform: `translateX(${textTranslateVw}vw)`,
            opacity: textOpacity,
          }}
        >
          <h1 className="font-display text-[clamp(3.05rem,17.8vw,5.1rem)] md:text-[18vw] [@media(max-height:520px)]:text-[16vh] text-ink leading-[0.82] md:leading-[0.80] tracking-[-0.045em] md:tracking-tighter2 select-none text-right">
            VILLE
          </h1>
        </div>
      </div>

      {/* =====================================================================
          ILLUSTRATION LAYER 01 — HAND-DRAWN CENTENARY BANYAN TREE (Right)
          Recomposes gracefully to lower-right portrait frame on mobile
          ===================================================================== */}
      <div
        className="absolute right-[-7vw] sm:right-[-4vw] md:right-[-2vw] bottom-[15.5dvh] sm:bottom-[14dvh] md:bottom-[4vh] w-[54vw] sm:w-[44vw] md:w-[42vw] max-w-[235px] sm:max-w-[300px] md:max-w-[700px] [@media(max-height:520px)]:w-[28vw] [@media(max-height:520px)]:bottom-[6vh] pointer-events-none"
        style={{
          zIndex: 15,
          opacity: Math.max(0, 1 - typeShift * 1.25),
          transform: `translate(${banyanSwayX + typeShift * 140}px, ${banyanSwayY - typeShift * 20}px)`,
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
          Grounded cleanly opposite Banyan tree on mobile diagonal
          ===================================================================== */}
      <div
        className="absolute left-[4vw] md:left-[7vw] bottom-[16.5dvh] sm:bottom-[15dvh] md:bottom-[26vh] w-[25vw] sm:w-[21vw] md:w-[14vw] max-w-[102px] sm:max-w-[140px] md:max-w-[210px] [@media(max-height:520px)]:w-[11vw] [@media(max-height:520px)]:bottom-[16vh]"
        style={{
          zIndex: 15,
          opacity: Math.max(0, 1 - typeShift * 1.25),
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
            className="hidden md:block absolute left-[38%] top-[45%] w-10 h-10 pointer-events-none transition-opacity duration-500 rounded-full"
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
          UNIFIED PERSISTENT MATRIMANDIR CANVAS (Exact 1376:768 Aspect Frame)
          Uses `.matrimandir-stage-canvas` CSS vars for guaranteed 0.0px handoff
          into Chapter 02 across mobile, tablet, landscape, and desktop.
          ===================================================================== */}
      <div
        className="matrimandir-stage-canvas absolute pointer-events-none"
        style={
          {
            zIndex: 12,
            "--expand": expandEase,
          } as React.CSSProperties
        }
      >
        {/* Base Layer: Clean Luminous Architectural Elevation Study (isolated silhouette on transparent alpha) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/matrimandir-sequence/00-hero-study-aligned.png"
            alt="Architectural elevation study drawing of the Matrimandir dome and ramps"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Graphite Hatching Accent Layer on Hover over Dome (Interaction 03) */}
        {detailPhase < 0.5 && (
          <div
            className="absolute pointer-events-none transition-opacity duration-500"
            style={{
              left: "48.73%",
              top: "47.66%",
              width: "48%",
              height: "70%",
              transform: "translate(-50%, -50%)",
              opacity: (isNearDome ? 0.32 : 0.04) * (1 - detailPhase * 2),
            }}
          >
            <svg viewBox="0 0 600 500" className="w-full h-full" fill="none">
              <circle cx="300" cy="250" r="195" stroke="#191917" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.5" />
              <circle cx="300" cy="250" r="225" stroke="#191917" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.35" />
              <line x1="100" y1="250" x2="500" y2="250" stroke="#191917" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
              <line x1="300" y1="50" x2="300" y2="450" stroke="#191917" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            </svg>
          </div>
        )}

        {/* Masked Detail Emergence Layer: Exact Chapter 02 B&W Detailed Illustration */}
        {/* Radiates cleanly outward from dome center so discs, pillars, ramps & landscape match 1:1 */}
        {detailPhase > 0 && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              WebkitMaskImage: needsEdgeFeather
                ? `radial-gradient(circle at 48.73% 47.66%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
                    0,
                    detailMaskInner
                  )}%, rgba(0,0,0,0) ${Math.max(0, detailMaskInner + detailMaskFeather)}%)`
                : "none",
              maskImage: needsEdgeFeather
                ? `radial-gradient(circle at 48.73% 47.66%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
                    0,
                    detailMaskInner
                  )}%, rgba(0,0,0,0) ${Math.max(0, detailMaskInner + detailMaskFeather)}%)`
                : "none",
            }}
          >
            {/* Inner vertical soft-edge envelope while zoomed (< 0.97) prevents top/bottom foliage seam on narrow screens */}
            <div
              className="relative w-full h-full"
              style={{
                WebkitMaskImage: needsEdgeFeather
                  ? "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)"
                  : "none",
                maskImage: needsEdgeFeather
                  ? "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)"
                  : "none",
              }}
            >
              <Image
                src="/matrimandir-sequence/01-sketch-aligned.jpg"
                alt="Detailed architectural graphite illustration of Matrimandir and landscape"
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          BOTTOM EDITORIAL STATEMENT (Clean, restrained, zero telemetry)
          ===================================================================== */}
      <div
        className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pb-[max(18px,3.2dvh)] md:pb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 [@media(max-height:520px)]:pb-3.5"
        style={{
          opacity: Math.max(0, 1 - typeShift * 1.4),
          transform: `translateY(${typeShift * 28}px)`,
        }}
      >
        <div className="max-w-[35ch] md:max-w-md bg-paper/75 md:bg-transparent backdrop-blur-[1px] md:backdrop-blur-none">
          <h2 className="font-serif italic text-[clamp(1.35rem,5vw,1.875rem)] md:text-3xl [@media(max-height:520px)]:text-xl text-ink font-light leading-snug">
            A place still becoming.
          </h2>
          <p className="font-sans text-xs md:text-sm text-ink-muted mt-1 leading-relaxed font-light [@media(max-height:460px)]:hidden">
            Founded in 1968 on an eroded red plateau in southern India. Dedicated to human
            unity, architecture, and ecological regeneration.
          </p>
        </div>
      </div>
    </div>
  );
}
