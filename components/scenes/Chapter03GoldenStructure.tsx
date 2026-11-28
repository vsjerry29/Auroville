"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import LivingContourField from "@/components/experience/LivingContourField";

interface Chapter03GoldenStructureProps {
  progress: number; // Stage progress 0.00 - 0.73
  active: boolean;
  exitProgress?: number; // 0.0 -> 1.0 as Chapter 04 scrolls vertically into view
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export default function Chapter03GoldenStructure({
  progress,
  active,
  exitProgress = 0,
}: Chapter03GoldenStructureProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [maxTravel, setMaxTravel] = useState(0);

  // Measure real track width & viewport width responsively
  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (!viewportRef.current || !trackRef.current) return;
      const vw = viewportRef.current.clientWidth;
      const tw = trackRef.current.scrollWidth;
      setMaxTravel(Math.max(0, tw - vw));
    };

    updateMeasurements();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && trackRef.current && viewportRef.current) {
      ro = new ResizeObserver(updateMeasurements);
      ro.observe(viewportRef.current);
      ro.observe(trackRef.current);
    }
    window.addEventListener("resize", updateMeasurements);
    return () => {
      window.removeEventListener("resize", updateMeasurements);
      ro?.disconnect();
    };
  }, [active, progress >= 0.43]);

  // Normalized Chapter 03 progress (0.45 -> 0.73)
  const ch03Local = clamp01((progress - 0.45) / 0.28);

  // ---------------------------------------------------------------------------
  // THREE-DWELL PIECEWISE GLIDE TIMELINE (Derived directly from master progress)
  // Enables each story's dedicated image-opening choreography to unfold IN VIEW:
  //   0.00 -> 0.24 : Hold at Story 01 (x = 0) while 01/ composition opens & settles
  //   0.24 -> 0.40 : Smoothly glide to Story 02 center (0.00 -> 0.49)
  //   0.40 -> 0.58 : Slow editorial dwell at Story 02 (0.49 -> 0.51) while golden discs open
  //   0.58 -> 0.76 : Smoothly glide to Story 03 center (0.51 -> 1.00)
  //   0.76 -> 1.00 : Track completely stopped (1.00) while Realized opens & rests
  // ---------------------------------------------------------------------------
  const glide01To02 = smooth(0.24, 0.40, ch03Local) * 0.49;
  const dwell02 = smooth(0.40, 0.58, ch03Local) * 0.02;
  const glide02To03 = smooth(0.58, 0.76, ch03Local) * 0.49;
  const mainGlide = clamp01(glide01To02 + dwell02 + glide02To03);

  // Deterministic GSAP transform strictly synced to measured track length
  useEffect(() => {
    if (!trackRef.current || maxTravel <= 0) return;
    gsap.set(trackRef.current, {
      x: -mainGlide * maxTravel,
      force3D: true,
    });
  }, [mainGlide, maxTravel]);

  if (!active && progress < 0.43) {
    return null;
  }

  // Clean entrance fade from Chapter 02; NO artificial opacity fade-out on Chapter 04 handoff
  // so Chapter 03 remains crisp until it scrolls upward off the viewport cleanly.
  const sceneOpacity = clamp01((progress - 0.442) / 0.016);

  // ---------------------------------------------------------------------------
  // STORY 01 / IMAGINED — Dedicated Entrance Sequence (ch03Local 0.00 -> 0.22)
  // ---------------------------------------------------------------------------
  const sup01Graphite = smooth(0.0, 0.1, ch03Local);
  const sup01Galaxy = smooth(0.03, 0.13, ch03Local);
  const open01 = smooth(0.04, 0.19, ch03Local);
  const clip01L = (1 - open01) * 68; // Expanding horizontal + vertical aperture
  const clip01V = (1 - open01) * 10;
  const pan01X = (1 - open01) * -3.5; // Synchronized crop movement inside natural aspect
  const scale01 = 1.18 - open01 * 0.1;

  // ---------------------------------------------------------------------------
  // STORY 02 / MADE — Staged Support & Dominant Slit-to-Spread Reveal (0.27 -> 0.56)
  // ---------------------------------------------------------------------------
  const open02Work = smooth(0.28, 0.42, ch03Local); // Workshop artisans enter first
  const open02Draft = smooth(0.36, 0.49, ch03Local); // Drafting figure staggers onto upper-right corner
  const open02Dom = smooth(0.35, 0.55, ch03Local); // Golden geodesic discs unfold leftward in view
  const clip02L = (1 - open02Dom) * 74; // Narrow vertical right-ribbon -> full editorial frame
  const clip02V = (1 - open02Dom) * 6;
  const pan02X = (1 - open02Dom) * 4.5;
  const scale02 = 1.24 - open02Dom * 0.12; // >= 1.12 settled scale cleanly crops top/bottom raw scan rims

  // ---------------------------------------------------------------------------
  // STORY 03 / REALIZED — Architectural Study Introduces Evergreen Panorama (0.61 -> 0.90)
  // ---------------------------------------------------------------------------
  const open03Courtyard = smooth(0.61, 0.74, ch03Local); // Completed sanctuary & lotus first
  const open03Study = smooth(0.66, 0.78, ch03Local); // Smaller overlapping study card staggers second
  const open03Dom = smooth(0.72, 0.89, ch03Local); // Dominant evergreen panorama expands last & holds
  const clip03L = (1 - open03Dom) * 76;
  const clip03V = (1 - open03Dom) * 6;
  const pan03X = (1 - open03Dom) * 4.5;
  const scale03 = 1.15 - open03Dom * 0.12;

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-paper text-ink"
      style={{
        zIndex: 20,
        visibility: progress >= 0.44 && exitProgress < 0.99 ? "visible" : "hidden",
        pointerEvents: progress >= 0.45 && exitProgress < 0.15 ? "auto" : "none",
        opacity: sceneOpacity,
      }}
      aria-label="Chapter 03: The Golden Structure — Horizontal Storytelling"
    >
      {/* Subtle architectural elevation contour field */}
      <LivingContourField
        variant="structure-elevation"
        active={active}
        scrollProgress={ch03Local}
        opacity={0.22}
      />

      {/* =====================================================================
          CONTINUOUS HORIZONTAL TRACK (3 evenly balanced 100vw editorial spreads)
          ===================================================================== */}
      <div
        ref={trackRef}
        className="relative h-full flex flex-nowrap items-stretch will-change-transform"
        style={{ width: "max-content" }}
      >
        {/* Single Quiet Architectural Horizon Thread tying the 3 spreads */}
        <svg
          className="pointer-events-none absolute inset-y-0 left-0 w-full h-full opacity-20"
          viewBox="0 0 3600 900"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M 80 790 L 1160 790 C 1480 790, 1740 770, 2120 770 C 2540 770, 2860 790, 3520 790"
            stroke="#6B5A48"
            strokeWidth="1"
            strokeDasharray="5 6"
          />
        </svg>

        {/* ===================================================================
            STORY 01 / IMAGINED
            Dominant geodesic elevation visually anchors the spread (~58% width)
            while smaller study & spiral plan cluster cohesively beside it.
            =================================================================== */}
        <section
          aria-label="Story 01: Imagined"
          className="relative shrink-0 w-[100vw] h-full px-5 sm:px-8 md:px-14 pt-[clamp(66px,9dvh,86px)] md:pt-24 pb-[clamp(16px,2.5dvh,28px)] md:pb-10 [@media(max-height:520px)]:pt-14 [@media(max-height:520px)]:pb-3 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-8"
        >
          {/* Left Unified Cluster: 01/ Copy + Supporting Studies Nestled Toward Center */}
          <div className="relative w-full md:w-[39%] h-auto md:h-[74dvh] [@media(max-height:520px)]:h-auto flex flex-col justify-between z-10 shrink-0">
            <div className="flex items-start gap-3.5 md:gap-4 max-w-sm">
              <span className="font-sans font-light text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink leading-none select-none shrink-0">
                01<span className="text-terracotta/85 font-extralight">/</span>
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-1">
                  Imagined
                </div>
                <p className="font-sans text-[12.5px] md:text-[13px] text-ink/85 leading-snug md:leading-relaxed font-light text-pretty max-w-[33ch]">
                  Before stone or metal, the sanctuary existed purely as geometry—arcs compassed over red dust to house quietude.
                </p>
              </div>
            </div>

            {/* Desktop Clustered Supporting Studies (Compact, Subordinate, Connected) */}
            <div className="hidden md:block [@media(max-height:520px)]:hidden relative w-full flex-1 mt-4">
              {/* Support A (upper-right overlapping edge near dominant elevation) */}
              <div
                className="absolute top-[4%] right-[0%] w-[14.5vw] max-w-[205px] aspect-[1376/768] overflow-hidden bg-paper-light/90 border border-border/50 archival-shadow-subtle z-20"
                style={{
                  transform: `translate3d(${(1 - sup01Graphite) * 26}px, ${(1 - sup01Graphite) * 14}px, 0)`,
                  clipPath: `inset(${(1 - sup01Graphite) * 20}% 0% 0% ${(1 - sup01Graphite) * 32}%)`,
                }}
              >
                <Image
                  src="/illustrated/ch03-structure/matrimandir-outline.webp"
                  alt="Structural graphite elevation lines"
                  fill
                  sizes="210px"
                  className="object-cover scale-[1.06]"
                  priority
                />
              </div>

              {/* Support B (anchored bottom-left directly below narrative) */}
              <div
                className="absolute bottom-[2%] left-[0%] w-[18.5vw] max-w-[265px] aspect-[1376/768] overflow-hidden bg-paper-light/85 border border-border/45 archival-shadow-subtle"
                style={{
                  transform: `translate3d(${(1 - sup01Galaxy) * -22}px, ${(1 - sup01Galaxy) * 16}px, 0)`,
                  clipPath: `inset(0% ${(1 - sup01Galaxy) * 36}% ${(1 - sup01Galaxy) * 16}% 0%)`,
                }}
              >
                <Image
                  src="/art/architecture/galaxy-plan.webp"
                  alt="Early radial Galaxy masterplan geometry"
                  fill
                  sizes="270px"
                  className="object-cover scale-[1.05]"
                  style={{ opacity: 0.88 }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Dominant Visual Focal Anchor: Massive Matrimandir Geodesic Sphere */}
          <div className="relative w-full md:w-[58%] aspect-[16/10] max-h-[36dvh] md:aspect-auto md:h-[75dvh] md:max-h-none [@media(max-height:520px)]:aspect-auto [@media(max-height:520px)]:h-[calc(100dvh-76px)] flex items-center justify-end">
            <div
              className="relative w-full h-full max-h-[680px] overflow-hidden bg-[#F1ECE1] border border-border/45 archival-shadow-subtle"
              style={{
                clipPath: `inset(${clip01V}% 0% ${clip01V}% ${clip01L}%)`,
              }}
            >
              <Image
                src="/illustrated/ch03-structure/matrimandir-shaded.webp"
                alt="Architectural elevation study of the Matrimandir geodesic sphere"
                fill
                sizes="(max-width: 768px) 92vw, 58vw"
                className="object-cover contrast-[1.06] brightness-[0.97]"
                style={{
                  transform: `scale(${scale01}) translate3d(${pan01X}%, 0, 0)`,
                  transformOrigin: "center center",
                }}
                priority
              />
            </div>
          </div>

          {/* Mobile Staggered Portrait Supporting Pair (Animated Reveal In View) */}
          <div className="flex md:hidden items-end gap-3 w-full max-h-[19dvh] shrink-0">
            <div
              className="relative w-[46%] aspect-[16/10] overflow-hidden bg-paper-light border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - sup01Graphite) * 14}px, 0)`,
                clipPath: `inset(${(1 - sup01Graphite) * 28}% 0% 0% ${(1 - sup01Graphite) * 24}%)`,
              }}
            >
              <Image
                src="/illustrated/ch03-structure/matrimandir-outline.webp"
                alt="Structural lines"
                fill
                sizes="45vw"
                className="object-cover"
              />
            </div>
            <div
              className="relative w-[54%] aspect-[16/10] overflow-hidden bg-paper-light border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - sup01Galaxy) * 14}px, 0)`,
                clipPath: `inset(0% ${(1 - sup01Galaxy) * 32}% 0% 0%)`,
              }}
            >
              <Image
                src="/art/architecture/galaxy-plan.webp"
                alt="Galaxy radial concept"
                fill
                sizes="52vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===================================================================
            STORY 02 / MADE
            Nón Lá Layout Flow: Left cohesive cluster (02/ + staggered studio
            supports) sits tightly adjacent to a tall dominant right-hand macro
            aperture whose golden discs expand progressively while held in view.
            =================================================================== */}
        <section
          aria-label="Story 02: Made"
          className="relative shrink-0 w-[100vw] h-full px-5 sm:px-8 md:px-14 pt-[clamp(66px,9dvh,86px)] md:pt-24 pb-[clamp(16px,2.5dvh,28px)] md:pb-10 [@media(max-height:520px)]:pt-14 [@media(max-height:520px)]:pb-3 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-8"
        >
          {/* Left Unified Cluster: 02/ Editorial Copy + Two Staggered Workshop Supports */}
          <div className="relative w-full md:w-[41%] h-auto md:h-[74dvh] [@media(max-height:520px)]:h-auto flex flex-col justify-between z-10 shrink-0">
            <div className="flex items-start gap-3.5 md:gap-4 max-w-sm">
              <span className="font-sans font-light text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink leading-none select-none shrink-0">
                02<span className="text-terracotta/85 font-extralight">/</span>
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-1">
                  Made
                </div>
                <p className="font-sans text-[12.5px] md:text-[13px] text-ink/85 leading-snug md:leading-relaxed font-light text-pretty max-w-[33ch]">
                  In open-air workshops, hands bent timber formwork and steel ribs before 1,415 hand-gilded discs sheathed the sphere.
                </p>
              </div>
            </div>

            {/* Desktop Staggered Supporting Pair — Never Detached From Text */}
            <div className="hidden md:block [@media(max-height:520px)]:hidden relative w-full flex-1 mt-4">
              {/* Support A (first beat: workshop artisans table) */}
              <div
                className="relative mt-[8vh] w-[25vw] max-w-[355px] aspect-[1200/896] overflow-hidden border border-border/50 archival-shadow-subtle"
                style={{
                  transform: `translate3d(0, ${(1 - open02Work) * 26}px, 0)`,
                  clipPath: `inset(${(1 - open02Work) * 28}% 0% 0% ${(1 - open02Work) * 18}%)`,
                }}
              >
                <Image
                  src="/illustrated/ch03-structure/ch03-frame-b-making.webp"
                  alt="Artisans building timber formwork and scale dome models"
                  fill
                  sizes="360px"
                  className="object-cover"
                  style={{
                    transform: `scale(${1.12 - open02Work * 0.08})`,
                    transformOrigin: "center center",
                  }}
                  priority
                />
              </div>

              {/* Support B (second delayed stagger beat: drafter perched at upper-right shoulder) */}
              <div
                className="absolute top-[1vh] right-[0%] w-[13vw] max-w-[188px] aspect-[716/768] overflow-hidden bg-paper-light border border-border/55 p-1 archival-shadow z-20"
                style={{
                  transform: `translate3d(${(1 - open02Draft) * 24}px, ${(1 - open02Draft) * -14}px, 0)`,
                  clipPath: `inset(0% 0% ${(1 - open02Draft) * 42}% 0%)`,
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/art/people/architect.webp"
                    alt="Drafting architectural plans by hand"
                    fill
                    sizes="190px"
                    className="object-contain"
                    style={{ transform: `scale(${1.08 - open02Draft * 0.06})` }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dominant Right Artwork: Vertical Architectural Aperture Expanding Into Golden Discs */}
          <div className="relative w-full md:w-[56%] aspect-[16/10] max-h-[36dvh] md:aspect-auto md:h-[75dvh] md:max-h-none [@media(max-height:520px)]:aspect-auto [@media(max-height:520px)]:h-[calc(100dvh-76px)] flex items-center justify-end">
            <div
              className="relative w-full h-full max-h-[680px] overflow-hidden archival-shadow-subtle"
              style={{
                clipPath: `inset(${clip02V}% 0% ${clip02V}% ${clip02L}%)`,
              }}
            >
              <Image
                src="/illustrated/ch03-structure/ch03-frame-c-macro.webp"
                alt="Detailed golden geodesic discs and space-frame truss"
                fill
                sizes="(max-width: 768px) 92vw, 56vw"
                className="object-cover"
                style={{
                  transform: `scale(${scale02}) translate3d(${pan02X}%, 0, 0)`,
                  transformOrigin: "center center",
                }}
                priority
              />
            </div>
          </div>

          {/* Mobile Staggered Workshop Pair (Animated Reveal In View) */}
          <div className="flex md:hidden items-end gap-3 w-full max-h-[19dvh] shrink-0">
            <div
              className="relative w-[36%] aspect-[716/768] max-h-[18dvh] overflow-hidden bg-paper-light border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - open02Draft) * 14}px, 0)`,
                clipPath: `inset(0% 0% ${(1 - open02Draft) * 38}% 0%)`,
              }}
            >
              <Image
                src="/art/people/architect.webp"
                alt="Drafting plans"
                fill
                sizes="34vw"
                className="object-contain p-1"
              />
            </div>
            <div
              className="relative w-[64%] aspect-[1200/896] max-h-[18dvh] overflow-hidden border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - open02Work) * 14}px, 0)`,
                clipPath: `inset(${(1 - open02Work) * 26}% 0% 0% ${(1 - open02Work) * 18}%)`,
              }}
            >
              <Image
                src="/illustrated/ch03-structure/ch03-frame-b-making.webp"
                alt="Workshop formwork assembly"
                fill
                sizes="60vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===================================================================
            STORY 03 / REALIZED
            Sanctuary study & courtyard introduce the subject first, then the
            dominant forest panorama expands across the right to establish a clear,
            rock-solid ending (track stopped at 1.00 before vertical handoff).
            =================================================================== */}
        <section
          aria-label="Story 03: Realized"
          className="relative shrink-0 w-[100vw] h-full px-5 sm:px-8 md:px-14 pt-[clamp(66px,9dvh,86px)] md:pt-24 pb-[clamp(16px,2.5dvh,28px)] md:pb-10 [@media(max-height:520px)]:pt-14 [@media(max-height:520px)]:pb-3 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-8"
        >
          {/* Left Column: 03/ Copy + Introducing Courtyard & Geometric Study Pair */}
          <div className="relative w-full md:w-[41%] h-auto md:h-[74dvh] [@media(max-height:520px)]:h-auto flex flex-col justify-between z-10 shrink-0">
            <div className="flex items-start gap-3.5 md:gap-4 max-w-sm">
              <span className="font-sans font-light text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink leading-none select-none shrink-0">
                03<span className="text-terracotta/85 font-extralight">/</span>
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-1">
                  Realized
                </div>
                <p className="font-sans text-[12.5px] md:text-[13px] text-ink/85 leading-snug md:leading-relaxed font-light text-pretty max-w-[33ch]">
                  Completed after thirty-seven years, the sphere now stands amidst twelve gardens and the young forest below.
                </p>
              </div>
            </div>

            <div className="hidden md:block [@media(max-height:520px)]:hidden relative w-full flex-1 mt-4">
              {/* First Introduction Beat: Completed courtyard & red sandstone ramps */}
              <div
                className="relative mt-[8vh] w-[25vw] max-w-[360px] aspect-[1376/768] overflow-hidden border border-border/50 archival-shadow-subtle"
                style={{
                  transform: `translate3d(0, ${(1 - open03Courtyard) * 24}px, 0)`,
                  clipPath: `inset(0% ${(1 - open03Courtyard) * 34}% ${(1 - open03Courtyard) * 14}% 0%)`,
                }}
              >
                <Image
                  src="/illustrated/ch02-page/matrimandir-illustrated.jpg"
                  alt="Completed Matrimandir with red sandstone ramps and marble lotus"
                  fill
                  sizes="360px"
                  className="object-cover"
                  style={{ transform: `scale(${1.1 - open03Courtyard * 0.08})` }}
                  priority
                />
              </div>

              {/* Second Intro Beat: Overlapping small architectural study */}
              <div
                className="absolute top-[1.5vh] right-[0%] w-[13.5vw] max-w-[192px] aspect-[1376/768] bg-paper-light border border-border/55 p-1 archival-shadow z-20"
                style={{
                  transform: `translate3d(${(1 - open03Study) * 22}px, ${(1 - open03Study) * -12}px, 0)`,
                  clipPath: `inset(${(1 - open03Study) * 36}% 0% 0% 0%)`,
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src="/art/architecture/matrimandir-study.webp"
                    alt="Original geometric elevation study alongside realized architecture"
                    fill
                    sizes="195px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dominant Final Visual Payoff: Evergreen Forest Panorama Unfolds to Complete Stop */}
          <div className="relative w-full md:w-[56%] aspect-[16/10] max-h-[36dvh] md:aspect-auto md:h-[75dvh] md:max-h-none [@media(max-height:520px)]:aspect-auto [@media(max-height:520px)]:h-[calc(100dvh-76px)] flex items-center justify-end">
            <div
              className="relative w-full h-full max-h-[680px] overflow-hidden archival-shadow-subtle"
              style={{
                clipPath: `inset(${clip03V}% 0% ${clip03V}% ${clip03L}%)`,
              }}
            >
              <Image
                src="/illustrated/ch02-page/panorama-master.webp"
                alt="Completed Matrimandir rising above regenerated evergreen forest and red earth trail"
                fill
                sizes="(max-width: 768px) 92vw, 56vw"
                className="object-cover"
                style={{
                  transform: `scale(${scale03}) translate3d(${pan03X}%, 0, 0)`,
                  transformOrigin: "center center",
                }}
                priority
              />
            </div>
          </div>

          {/* Mobile Compact Staggered Lower Pairing */}
          <div className="flex md:hidden items-end gap-3 w-full max-h-[19dvh] shrink-0">
            <div
              className="relative w-[58%] aspect-[16/10] overflow-hidden border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - open03Courtyard) * 14}px, 0)`,
                clipPath: `inset(0% ${(1 - open03Courtyard) * 32}% 0% 0%)`,
              }}
            >
              <Image
                src="/illustrated/ch02-page/matrimandir-illustrated.jpg"
                alt="Completed Matrimandir"
                fill
                sizes="55vw"
                className="object-cover"
              />
            </div>
            <div
              className="relative w-[42%] aspect-[16/10] overflow-hidden bg-paper-light border border-border/45"
              style={{
                transform: `translate3d(0, ${(1 - open03Study) * 14}px, 0)`,
                clipPath: `inset(${(1 - open03Study) * 34}% 0% 0% 0%)`,
              }}
            >
              <Image
                src="/art/architecture/matrimandir-study.webp"
                alt="Concept elevation"
                fill
                sizes="40vw"
                className="object-contain p-1"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
