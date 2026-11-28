"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { EditorialAction } from "@/components/ui/EditorialControls";

interface HangingPrintSpec {
  id: string;
  title: string;
  note: string;
  src: string;
  alt: string;
  /** Horizontal anchor percentage (center of clip) on 0..100 scale (desktop) */
  xPct: number;
  /** Mobile horizontal track anchor (0..100 inside 240vw track) */
  mobileTrackXPct: number;
  /** Desktop 1:1 square frame dimension (center plate slightly larger) */
  sizeCss: string;
  /** Mobile 1:1 square frame dimension */
  mobileSizeCss: string;
  /** Resting tilt angle around top-center wooden clip pivot */
  restAngle: number;
  /** Subtle hover swing rotation delta around clip pivot */
  hoverRotateDelta: number;
  /** Entrance settling phase inside enterProgress 0..1 */
  settleWindow: [number, number];
}

// Quadratic Bezier wire equation for M -20 p0Y Q 500 p1Y, 1020 p2Y (viewBox 1000x1000)
// Since control X = 500 = midpoint(-20, 1020), x(t) is strictly linear so y(x) matches the SVG stroke!
function getCordYPercent(xPct: number, p0Y = 148, p1Y = 246, p2Y = 156): number {
  const t = Math.min(1, Math.max(0, (xPct * 10 + 20) / 1040));
  const y = (1 - t) * (1 - t) * p0Y + 2 * (1 - t) * t * p1Y + t * t * p2Y;
  return y / 10;
}

const HANGING_PRINTS: HangingPrintSpec[] = [
  {
    id: "earth",
    title: "Terracotta Horizons",
    note: "Red laterite topsoil, organic root zone, rounded gravel bed, and fractured ironstone bedrock.",
    src: "/illustrated/ch04-earth/print-red-earth-sq.webp",
    alt: "Terracotta Horizons: square botanical strata illustration showing red laterite soil layers",
    xPct: 18.5,
    mobileTrackXPct: 22.0,
    sizeCss: "clamp(228px, min(22.4vw, 35.5vh), 330px)",
    mobileSizeCss: "clamp(206px, 55vw, 248px)",
    restAngle: -1.6,
    hoverRotateDelta: 1.4,
    settleWindow: [0.24, 0.82],
  },
  {
    id: "seed",
    title: "Seed Anatomy & Sowing",
    note: "Indigenous neem and banyan seeds studied from cupped hand through cotyledon and radicle.",
    src: "/illustrated/ch04-earth/print-seed-hand-sq.webp",
    alt: "Seed Anatomy & Sowing: square botanical plate with neem and banyan seed structures",
    xPct: 50.0,
    mobileTrackXPct: 50.0,
    sizeCss: "clamp(260px, min(26.5vw, 41.5vh), 390px)",
    mobileSizeCss: "clamp(228px, 61vw, 272px)",
    restAngle: 1.1,
    hoverRotateDelta: -1.3,
    settleWindow: [0.36, 0.94],
  },
  {
    id: "roots",
    title: "Taproot Architecture",
    note: "Primary taproot and fine lateral filaments threading deep beneath grass turf into stone.",
    src: "/illustrated/ch04-earth/print-roots-strata-sq.webp",
    alt: "Taproot Architecture: square soil cross-section of branching root systems",
    xPct: 81.5,
    mobileTrackXPct: 78.0,
    sizeCss: "clamp(228px, min(22.4vw, 35.5vh), 330px)",
    mobileSizeCss: "clamp(206px, 55vw, 248px)",
    restAngle: -1.4,
    hoverRotateDelta: 1.3,
    settleWindow: [0.3, 0.88],
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedPrint, setSelectedPrint] = useState<HangingPrintSpec | null>(null);
  const [mobileFocusIdx, setMobileFocusIdx] = useState<number | null>(null);

  // Continuous wire completes early so square prints arrive smoothly onto an unbroken cord
  const cordDraw = smooth(0.02, 0.25, enterProgress);
  const headerFade = smooth(0.1, 0.52, enterProgress);
  const footerFade = smooth(0.62, 0.98, enterProgress);
  const panProgress = clamp01(progress);

  // Clear mobile manual index override once user scrolls materially
  useEffect(() => {
    setMobileFocusIdx(null);
  }, [progress]);

  // Dismiss deliberate lightbox on Escape
  useEffect(() => {
    if (!selectedPrint) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPrint(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPrint]);

  // Mobile horizontal pan glides cleanly along ONE continuous 230vw curved wire inside overflow-hidden
  // Print anchors inside 230vw track: 22% (50.6vw), 50% (115vw), 78% (179.4vw)
  // Translating 0vw -> -128.8vw centers Print 1 -> Print 2 -> Print 3 seamlessly edge-to-edge
  const effectiveMobileT =
    mobileFocusIdx !== null ? mobileFocusIdx / 2 : panProgress;
  const mobileTrackTranslateVw = -(effectiveMobileT * 128.8);

  return (
    <div
      id="chapter-04-gallery"
      className="sticky top-0 w-full h-[100dvh] overflow-hidden select-none bg-paper text-ink border-t border-border/35"
    >
      {/* Minimal Top Chapter Cue (clear beneath fixed navbar) */}
      <div
        className="relative z-30 max-w-7xl mx-auto px-5 sm:px-8 md:px-14 pt-[62px] md:pt-24 flex items-center justify-between pointer-events-none [@media(max-height:520px)]:pt-14"
        style={{ opacity: headerFade }}
      >
        <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
          04 · The Earth Remembers
        </div>
      </div>

      {/* =====================================================================
          DESKTOP & TABLET SQUARE HANGING GALLERY
          One continuous curved wire + three genuine 1:1 square botanical plates.
          Every clip saddle rests directly on the Bezier curve (top = cordY%).
          ===================================================================== */}
      <div
        data-testid="ch04-desktop-stage"
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
      >
        <svg
          data-testid="ch04-desktop-wire-svg"
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            data-testid="ch04-desktop-wire-path"
            d="M -20 148 Q 500 246, 1020 156"
            stroke="#3E3933"
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{
              strokeDasharray: 1200,
              strokeDashoffset: (1 - cordDraw) * 1200,
            }}
          />
        </svg>

        {HANGING_PRINTS.map((print) => {
          const cordY = getCordYPercent(print.xPct, 148, 246, 156);
          const settle = smooth(print.settleWindow[0], print.settleWindow[1], enterProgress);
          const plateDropOffset = (1 - settle) * 18;
          const isHovered = hoveredId === print.id;
          const restAngle = print.restAngle * (0.4 + 0.6 * settle);
          const curAngle = restAngle + (isHovered ? print.hoverRotateDelta : 0);

          return (
            <div
              key={print.id}
              data-testid={`ch04-hanging-${print.id}`}
              className="absolute z-20 pointer-events-auto"
              style={{
                left: `${print.xPct}%`,
                top: `${cordY}%`,
                width: print.sizeCss,
                transformOrigin: "50% 0px",
                transform: `translate(-50%, 0px) rotate(${curAngle}deg)`,
                transition:
                  "transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease",
                opacity: smooth(
                  print.settleWindow[0] - 0.14,
                  print.settleWindow[0] + 0.3,
                  enterProgress
                ),
              }}
            >
              {/* Wooden clip whose pinch saddle (y=14/28 = 50%) sits strictly at top: 0px (the wire line) */}
              <div
                data-testid={`ch04-clip-${print.id}`}
                className="pointer-events-none absolute -top-[14px] left-1/2 -translate-x-1/2 z-30"
              >
                <WoodenPeg />
              </div>

              {/* Interactive Square Framed Print (marginTop 5px places print top border inside clip jaws) */}
              <button
                type="button"
                onMouseEnter={() => setHoveredId(print.id)}
                onMouseLeave={() => setHoveredId((cur) => (cur === print.id ? null : cur))}
                onFocus={() => setHoveredId(print.id)}
                onBlur={() => setHoveredId((cur) => (cur === print.id ? null : cur))}
                onClick={() => setSelectedPrint(print)}
                aria-label={`Inspect ${print.title}`}
                className="block w-full text-left bg-transparent border-0 p-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-4"
                style={{
                  transform: `translateY(${plateDropOffset - (isHovered ? 3 : 0)}px)`,
                  transition: "transform 480ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Genuine 1:1 square outer frame with consistent thin ivory mat & subtle physical paper shadow */}
                <div
                  data-testid={`ch04-print-frame-${print.id}`}
                  className={`relative w-full aspect-square p-2 lg:p-2.5 bg-[#FAF7F0] border rounded-[1px] transition-all duration-500 ease-out ${
                    isHovered
                      ? "border-[#BFB5A3] shadow-[0_22px_44px_-12px_rgba(25,25,23,0.18),0_6px_14px_-2px_rgba(25,25,23,0.06)] brightness-[1.01]"
                      : "border-[#DDD4C5] shadow-[0_14px_30px_-10px_rgba(25,25,23,0.13),0_3px_8px_-2px_rgba(25,25,23,0.04)]"
                  }`}
                >
                  <div className="relative w-full h-full overflow-hidden bg-[#F4EFE4]">
                    <Image
                      src={print.src}
                      alt={print.alt}
                      fill
                      sizes="(max-width: 1280px) 28vw, 390px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Quiet editorial title cleanly below square frame */}
                <p
                  className={`mt-2.5 px-0.5 font-serif italic text-[13.5px] lg:text-[15px] leading-snug font-light transition-colors duration-300 ${
                    isHovered ? "text-terracotta" : "text-ink"
                  }`}
                >
                  {print.title}
                </p>
              </button>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          MOBILE READABLE GALLERY ALONG ONE CONTINUOUS CURVED WIRE (<768px)
          Readable 206–272px square frames gliding horizontally with vertical scroll
          and plate tabs so zero compression and zero horizontal overflow.
          ===================================================================== */}
      <div
        data-testid="ch04-mobile-stage"
        className="md:hidden relative w-full h-[calc(100dvh-96px)] overflow-hidden z-20"
      >
        <div
          className="relative h-full will-change-transform transition-transform duration-300 ease-out"
          style={{
            width: "230vw",
            transform: `translate3d(${mobileTrackTranslateVw}vw, 0, 0)`,
          }}
        >
          <svg
            data-testid="ch04-mobile-wire-svg"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              data-testid="ch04-mobile-wire-path"
              d="M -20 112 Q 500 185, 1020 116"
              stroke="#3E3933"
              strokeWidth="1.9"
              strokeLinecap="round"
              style={{
                strokeDasharray: 1200,
                strokeDashoffset: (1 - cordDraw) * 1200,
              }}
            />
          </svg>

          {HANGING_PRINTS.map((print, idx) => {
            const cordY = getCordYPercent(print.mobileTrackXPct, 112, 185, 116);
            const settle = smooth(print.settleWindow[0], print.settleWindow[1], enterProgress);
            const plateDropOffset = (1 - settle) * 14;
            const curAngle = print.restAngle * 0.75 * (0.4 + 0.6 * settle);

            return (
              <div
                key={`mob-${print.id}`}
                data-testid={`ch04-mobile-hanging-${print.id}`}
                className="absolute z-20 pointer-events-auto"
                style={{
                  left: `${print.mobileTrackXPct}%`,
                  top: `${cordY}%`,
                  width: print.mobileSizeCss,
                  transformOrigin: "50% 0px",
                  transform: `translate(-50%, 0px) rotate(${curAngle}deg)`,
                  opacity: smooth(
                    print.settleWindow[0] - 0.14,
                    print.settleWindow[0] + 0.3,
                    enterProgress
                  ),
                }}
              >
                <div
                  data-testid={`ch04-mobile-clip-${print.id}`}
                  className="pointer-events-none absolute -top-[14px] left-1/2 -translate-x-1/2 z-30"
                >
                  <WoodenPeg />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileFocusIdx(idx);
                    setSelectedPrint(print);
                  }}
                  aria-label={`Inspect ${print.title}`}
                  className="block w-full text-left bg-transparent border-0 p-0 cursor-pointer"
                  style={{ transform: `translateY(${plateDropOffset}px)` }}
                >
                  <div
                    data-testid={`ch04-mobile-frame-${print.id}`}
                    className="relative w-full aspect-square p-2 bg-[#FAF7F0] border border-[#DDD4C5] rounded-[1px] shadow-[0_12px_28px_-10px_rgba(25,25,23,0.14)]"
                  >
                    <div className="relative w-full h-full overflow-hidden bg-[#F4EFE4]">
                      <Image
                        src={print.src}
                        alt={print.alt}
                        fill
                        sizes="275px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <p className="mt-2 px-0.5 font-serif italic text-[14px] text-ink font-light leading-snug">
                    {print.title}
                  </p>
                </button>
              </div>
            );
          })}
        </div>

        {/* Quiet bottom statement & plate selector on mobile */}
        <div
          className="absolute bottom-4 inset-x-5 z-30 flex items-end justify-between gap-4"
          style={{ opacity: footerFade }}
        >
          <div className="max-w-[230px]">
            <p className="font-serif italic text-lg text-ink font-light leading-snug">
              Earth, seed, and taproot.
            </p>
            <p className="font-sans text-[11px] text-ink-muted mt-0.5 font-light leading-snug">
              Three quiet steps turned laterite dust back into living forest.
            </p>
          </div>

          <div className="flex items-center gap-1.5 pb-1" role="group" aria-label="Gallery plates">
            {HANGING_PRINTS.map((p, idx) => {
              const activePlate = Math.round(effectiveMobileT * 2) === idx;
              return (
                <button
                  key={`tab-${p.id}`}
                  type="button"
                  onClick={() => setMobileFocusIdx(idx)}
                  aria-label={`View ${p.title}`}
                  className={`px-2 py-1 font-mono text-[10px] tracking-widest border-0 transition-colors cursor-pointer ${
                    activePlate
                      ? "bg-ink text-paper-light"
                      : "bg-paper-dark/60 text-ink-muted"
                  }`}
                >
                  0{idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          DESKTOP QUIET EDITORIAL FOOTER STATEMENT
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

      {/* =====================================================================
          DELIBERATE VISITOR INSPECTION MODAL (Opens ONLY on explicit click)
          ===================================================================== */}
      {selectedPrint && (
        <div
          data-testid="ch04-inspect-modal"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPrint.title}
          onClick={() => setSelectedPrint(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-paper/92 backdrop-blur-sm p-5 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] bg-[#FAF7F0] border border-[#D9D0BF] p-3 sm:p-4 shadow-[0_28px_60px_-14px_rgba(25,25,23,0.22)]"
          >
            <button
              type="button"
              onClick={() => setSelectedPrint(null)}
              aria-label="Close inspection view"
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-paper-light/90 border border-border text-ink hover:text-terracotta transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
            <div className="relative w-full aspect-square overflow-hidden bg-[#F4EFE4]">
              <Image
                src={selectedPrint.src}
                alt={selectedPrint.alt}
                fill
                sizes="480px"
                className="object-cover"
              />
            </div>
            <div className="pt-3 px-1">
              <p className="font-serif italic text-lg text-ink font-light">
                {selectedPrint.title}
              </p>
              <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed">
                {selectedPrint.note}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Wooden Clothespin centered so its metal spring saddle sits strictly at y = 14px (50% = wire Y) */
function WoodenPeg() {
  return (
    <svg className="w-[18px] h-[28px] drop-shadow-sm" viewBox="0 0 18 28" fill="none" aria-hidden="true">
      <rect
        x="4.5"
        y="0.5"
        width="9"
        height="25"
        rx="1.2"
        fill="#C69D70"
        stroke="#84603B"
        strokeWidth="0.9"
      />
      <line x1="7.5" y1="2.5" x2="7.5" y2="23" stroke="#AA8256" strokeWidth="0.65" />
      <rect
        x="3"
        y="12.2"
        width="12"
        height="3.6"
        rx="0.9"
        fill="#56524C"
        stroke="#36332F"
        strokeWidth="0.65"
      />
      <line x1="4.8" y1="14" x2="13.2" y2="14" stroke="#2D2A26" strokeWidth="0.8" />
    </svg>
  );
}
