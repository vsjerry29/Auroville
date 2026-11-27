"use client";

import Image from "next/image";
import LivingContourField from "@/components/experience/LivingContourField";
import { EditorialAction } from "@/components/ui/EditorialControls";

interface HangingPrintSpec {
  id: string;
  title: string;
  src: string;
  alt: string;
  /** Horizontal anchor percentage (center of clip) on 0..100 scale */
  xPct: number;
  /** Varied print sizes for a light, organic gallery rhythm (matching Nón Lá hierarchy) */
  widthCss: string;
  /** Resting tilt angle around top-center wooden clip */
  restAngle: number;
  /** Staggered vertical entrance travel offset (px) */
  enterOffsetY: number;
  /** Entrance settling phase inside enterProgress 0..1 */
  settleWindow: [number, number];
}

// Quadratic Bezier wire equation for M -20 135 Q 500 265, 1020 145 (viewBox 1000x1000)
// Since control X = 500 = midpoint(-20, 1020), x(t) is strictly linear so y(x) matches pixel-for-pixel!
function getCordYPercent(xPct: number, p0Y = 135, p1Y = 265, p2Y = 145): number {
  const t = Math.min(1, Math.max(0, (xPct * 10 + 20) / 1040));
  const y = (1 - t) * (1 - t) * p0Y + 2 * (1 - t) * t * p1Y + t * t * p2Y;
  return y / 10;
}

const HANGING_PRINTS: HangingPrintSpec[] = [
  {
    id: "earth",
    title: "Terracotta Horizons",
    src: "/illustrated/ch04-earth/print-red-earth.webp",
    alt: "Terracotta Horizons: illustrated red laterite soil profile and geological strata",
    xPct: 19.5,
    widthCss: "clamp(124px, min(13.2vw, 20.5vh), 186px)",
    restAngle: -3.2,
    enterOffsetY: 46,
    settleWindow: [0.3, 0.88],
  },
  {
    id: "seed",
    title: "Seed Anatomy & Sowing",
    src: "/illustrated/ch04-earth/print-seed-hand.webp",
    alt: "Seed Anatomy & Sowing: indigenous neem and banyan seeds cupped in hand",
    xPct: 49.0,
    widthCss: "clamp(158px, min(17.5vw, 27.5vh), 252px)",
    restAngle: 2.4,
    enterOffsetY: 68,
    settleWindow: [0.42, 0.96],
  },
  {
    id: "roots",
    title: "Taproot Architecture",
    src: "/illustrated/ch04-earth/print-roots-strata.webp",
    alt: "Taproot Architecture: deep root networks anchoring into ironstone layers",
    xPct: 79.5,
    widthCss: "clamp(134px, min(14.8vw, 23vh), 210px)",
    restAngle: -2.1,
    enterOffsetY: 34,
    settleWindow: [0.36, 0.92],
  },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface Chapter04RedEarthProps {
  /** 0.0 -> 1.0 as Chapter 04 physically enters from below the viewport */
  enterProgress: number;
  /** 0.0 -> 1.0 as visitor scrolls further through Chapter 04 after settling */
  progress: number;
  onNavigateStart?: () => void;
}

export default function Chapter04RedEarth({
  enterProgress,
  progress,
  onNavigateStart,
}: Chapter04RedEarthProps) {
  // Continuous wire completes early so prints arrive smoothly onto an unbroken cord
  const cordDraw = smooth(0.02, 0.24, enterProgress);
  const backdropFade = smooth(0.18, 0.92, enterProgress);
  const footerFade = smooth(0.68, 1.0, enterProgress);
  const postBridge = clamp01(progress);

  return (
    <div className="sticky top-0 w-full h-screen overflow-hidden select-none bg-paper text-ink border-t border-border/35">
      {/* Subtle soil contour field */}
      <LivingContourField
        variant="earth-strata"
        active={enterProgress > 0.05}
        scrollProgress={progress}
        opacity={0.22 * backdropFade}
      />

      {/* =====================================================================
          PROMINENT YET FAINT RADIAL GEOMETRIC MOTIF (Echoing Nón Lá circular study)
          Positioned subtly behind the right-middle gallery prints.
          ===================================================================== */}
      <div
        className="pointer-events-none absolute top-[48%] left-[56%] -translate-x-1/2 -translate-y-1/2 w-[58vmin] max-w-[540px] aspect-square"
        style={{
          opacity: 0.58 * backdropFade,
          transform: `translate(-50%, -50%) scale(${0.94 + backdropFade * 0.06}) rotate(${postBridge * 6}deg)`,
        }}
      >
        <Image
          src="/illustrated/ch04-earth/radial-earth-diagram.svg"
          alt=""
          fill
          sizes="540px"
          className="object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Minimal Top Chapter Cue (valid pt-20 below fixed navbar) */}
      <div
        className="relative z-20 max-w-7xl mx-auto px-6 md:px-14 pt-20 md:pt-24 flex items-center justify-between pointer-events-none"
        style={{ opacity: smooth(0.1, 0.55, enterProgress) }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
          04 · The Earth Remembers
        </div>
      </div>

      {/* =====================================================================
          DESKTOP & TABLET LIGHT HANGING GALLERY
          Sweeping curved cord from (0%, 13.5%) dipping to (~50%, 20.5%) to (100%, 14.5%)
          Every clip sits directly on the wire; prints vary clearly in scale & drop.
          ===================================================================== */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Main continuous curved linen wire */}
          <path
            d="M -20 135 Q 500 265, 1020 145"
            stroke="#4A453E"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 1200,
              strokeDashoffset: (1 - cordDraw) * 1200,
            }}
          />

          {/* Subtle post-settlement terracotta root line */}
          <path
            d="M 220 735 C 345 758, 435 710, 520 695 C 625 680, 720 735, 810 705"
            stroke="#B75E3F"
            strokeWidth="1.15"
            strokeDasharray="5 6"
            opacity={0.42 * postBridge}
          />
        </svg>

        {HANGING_PRINTS.map((print) => {
          const cordY = getCordYPercent(print.xPct);
          const settle = smooth(print.settleWindow[0], print.settleWindow[1], enterProgress);
          const curY = (1 - settle) * print.enterOffsetY;
          const curAngle = print.restAngle + (1 - settle) * (print.restAngle > 0 ? 1.5 : -1.5);

          return (
            <div
              key={print.id}
              className="absolute z-20 pointer-events-auto group"
              style={{
                left: `${print.xPct}%`,
                top: `${cordY}%`,
                width: print.widthCss,
                transformOrigin: "50% 0%",
                transform: `translate(-50%, ${curY}px) rotate(${curAngle}deg)`,
                opacity: smooth(print.settleWindow[0] - 0.16, print.settleWindow[0] + 0.34, enterProgress),
              }}
            >
              {/* Wooden Peg centered right onto the curve point */}
              <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <WoodenPeg />
              </div>

              {/* Light Archival Paper Print (zero heavy card borders or subtitle metadata) */}
              <div className="bg-paper-light/95 border border-border/55 pt-1.5 px-1.5 pb-2 archival-shadow-subtle rounded-[1px] transition-transform duration-300 ease-out group-hover:scale-[1.015]">
                <div className="relative w-full aspect-[570/861] overflow-hidden bg-paper-dark/30">
                  <Image
                    src={print.src}
                    alt={print.alt}
                    fill
                    sizes="(max-width: 1024px) 22vw, 260px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Single clean italic print title */}
                <div className="pt-1.5 px-0.5 font-serif italic text-[13px] lg:text-sm text-ink font-light leading-tight truncate">
                  {print.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          MOBILE RESPONSIVE CURVED HANGING COMPOSITION (390px+)
          ===================================================================== */}
      <div className="md:hidden relative w-full h-[calc(100vh-130px)] px-4 pt-4 flex flex-col justify-between z-20">
        {/* Upper Tier Wire + Varied Left & Right Prints */}
        <div className="relative w-full h-[46%]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M -20 120 Q 500 215, 1020 135"
              stroke="#4A453E"
              strokeWidth="2.2"
              style={{ strokeDasharray: 1200, strokeDashoffset: (1 - cordDraw) * 1200 }}
            />
          </svg>

          {/* Mobile Print 1: Earth (smaller lighter plate) */}
          <div
            className="absolute z-20"
            style={{
              left: "25%",
              top: `${getCordYPercent(25, 120, 215, 135)}%`,
              width: "116px",
              transformOrigin: "50% 0%",
              transform: "translate(-50%, 0) rotate(-3deg)",
            }}
          >
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-30">
              <WoodenPeg />
            </div>
            <div className="bg-paper-light/95 border border-border/55 p-1.5 archival-shadow-subtle">
              <div className="relative w-full aspect-[570/861]">
                <Image
                  src="/illustrated/ch04-earth/print-red-earth.webp"
                  alt="Terracotta Horizons"
                  fill
                  sizes="120px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="pt-1 font-serif italic text-[11px] text-ink truncate">
                Terracotta Horizons
              </div>
            </div>
          </div>

          {/* Mobile Print 2: Seed Anatomy (featured larger center-right plate) */}
          <div
            className="absolute z-20"
            style={{
              left: "72%",
              top: `${getCordYPercent(72, 120, 215, 135)}%`,
              width: "140px",
              transformOrigin: "50% 0%",
              transform: "translate(-50%, 0) rotate(2.4deg)",
            }}
          >
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-30">
              <WoodenPeg />
            </div>
            <div className="bg-paper-light/95 border border-border/55 p-1.5 archival-shadow-subtle">
              <div className="relative w-full aspect-[570/861]">
                <Image
                  src="/illustrated/ch04-earth/print-seed-hand.webp"
                  alt="Seed Anatomy & Sowing"
                  fill
                  sizes="150px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="pt-1 font-serif italic text-[11px] text-ink truncate">
                Seed Anatomy &amp; Sowing
              </div>
            </div>
          </div>
        </div>

        {/* Lower Tier Wire + Taproot Architecture + Compact Caption */}
        <div className="relative w-full h-[46%]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M -20 90 Q 500 170, 1020 110"
              stroke="#4A453E"
              strokeWidth="2.2"
              style={{ strokeDasharray: 1200, strokeDashoffset: (1 - cordDraw) * 1200 }}
            />
          </svg>

          <div
            className="absolute z-20"
            style={{
              left: "28%",
              top: `${getCordYPercent(28, 90, 170, 110)}%`,
              width: "130px",
              transformOrigin: "50% 0%",
              transform: "translate(-50%, 0) rotate(-2deg)",
            }}
          >
            <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 z-30">
              <WoodenPeg />
            </div>
            <div className="bg-paper-light/95 border border-border/55 p-1.5 archival-shadow-subtle">
              <div className="relative w-full aspect-[570/861]">
                <Image
                  src="/illustrated/ch04-earth/print-roots-strata.webp"
                  alt="Taproot Architecture"
                  fill
                  sizes="135px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="pt-1 font-serif italic text-[11px] text-ink truncate">
                Taproot Architecture
              </div>
            </div>
          </div>

          <div className="absolute right-2 top-[24%] w-[44%]">
            <p className="font-serif italic text-base text-ink font-light leading-snug mb-1.5">
              Earth, seed, and taproot.
            </p>
            <p className="font-sans text-[11px] text-ink-muted leading-snug font-light">
              Three quiet steps turned laterite dust back into living forest.
            </p>
            {onNavigateStart && (
              <div className="mt-2">
                <EditorialAction
                  onClick={onNavigateStart}
                  arrow="back"
                  className="font-mono text-[9.5px] uppercase tracking-[0.16em]"
                >
                  Return to Cover
                </EditorialAction>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================================
          DESKTOP QUIET EDITORIAL FOOTER (Trimmed & Balanced Beneath Varied Prints)
          ===================================================================== */}
      <div
        className="hidden md:flex absolute bottom-7 inset-x-0 z-30 max-w-7xl mx-auto px-6 md:px-14 items-end justify-between gap-6 pointer-events-none"
        style={{ opacity: footerFade }}
      >
        <div className="max-w-md">
          <h3 className="font-serif italic text-2xl lg:text-3xl text-ink font-light leading-snug">
            Earth, seed, and taproot.
          </h3>
          <p className="font-sans text-xs text-ink-muted mt-1 font-light leading-relaxed text-pretty">
            Three quiet steps turned laterite dust back into living forest.
          </p>
        </div>

        {onNavigateStart && (
          <div className="pointer-events-auto shrink-0">
            <EditorialAction
              onClick={onNavigateStart}
              arrow="back"
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
            >
              Return to Cover
            </EditorialAction>
          </div>
        )}
      </div>
    </div>
  );
}

/** Crisp Wooden Clothespin centered squarely onto the cord vertex (50%, 0px) */
function WoodenPeg() {
  return (
    <svg className="w-4 h-6 drop-shadow-sm" viewBox="0 0 16 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="0"
        width="8"
        height="20"
        rx="1"
        fill="#C49A6C"
        stroke="#8A6540"
        strokeWidth="0.8"
      />
      <line x1="6.5" y1="2" x2="6.5" y2="18" stroke="#A87F53" strokeWidth="0.6" />
      <rect
        x="2.5"
        y="10"
        width="11"
        height="3.2"
        rx="0.8"
        fill="#5E5A54"
        stroke="#3B3834"
        strokeWidth="0.6"
      />
      <line x1="4" y1="14" x2="12" y2="14" stroke="#5A3E25" strokeWidth="1" />
    </svg>
  );
}
