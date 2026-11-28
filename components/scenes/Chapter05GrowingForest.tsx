"use client";

import { useState, useCallback, useId } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EditorialAction, IconAction } from "@/components/ui/EditorialControls";
import { X } from "lucide-react";

interface Chapter05GrowingForestProps {
  /** 0.0 -> 1.0 as Chapter 05 enters vertically beneath Chapter 04 */
  enterProgress: number;
  /** 0.0 -> 1.0 across sticky scroll progression */
  progress: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

interface BotanicalSpecimen {
  id: "root" | "leaf" | "soil";
  label: string;
  tag: string;
  title: string;
  note: string;
  src: string;
  alt: string;
  fit: "contain" | "cover";
  anchorClass: string;
}

const SPECIMENS: BotanicalSpecimen[] = [
  {
    id: "leaf",
    label: "Neem Windbreak",
    tag: "01 · Pioneer Canopy",
    title: "Azadirachta indica",
    note: "Drought-tolerant neem belts break hot dry winds, cooling red laterite crust so sensitive evergreen shoots survive.",
    src: "/art/details/neem-branch.webp",
    alt: "Fine graphite drawing of a serrated neem leaf branch",
    fit: "contain",
    anchorClass: "top-[42%] left-[5%] md:top-[38%] md:left-[26%]",
  },
  {
    id: "root",
    label: "Aerial Strands",
    tag: "02 · Prop Roots",
    title: "Ficus benghalensis",
    note: "Slender prop roots drop from overhead limbs and thicken into secondary pillars that slow rainwash into deep seams.",
    src: "/art/details/aerial-roots.webp",
    alt: "Fine ink drawing of descending banyan aerial roots",
    fit: "contain",
    anchorClass: "top-[53%] right-[5%] md:right-auto md:top-[55%] md:left-[49%]",
  },
  {
    id: "soil",
    label: "Ironstone Cutaway",
    tag: "03 · Root Horizon",
    title: "Laterite Stratum",
    note: "Fallen leaf litter binds compacted red ironstone, creating shaded moisture pockets around primary taproots.",
    src: "/illustrated/ch04-earth/print-roots-strata.webp",
    alt: "Geological botanical cross-section showing roots inside layered red soil",
    fit: "cover",
    anchorClass: "top-[64%] left-[12%] md:top-auto md:left-auto md:bottom-[15%] md:right-[33%]",
  },
];

export default function Chapter05GrowingForest({
  enterProgress,
  progress,
}: Chapter05GrowingForestProps) {
  const uid = useId().replace(/:/g, "");
  const prefersReducedMotion = useReducedMotion();

  // Strictly manual interaction state (nothing auto-opens during scroll!)
  const [selectedId, setSelectedId] = useState<BotanicalSpecimen["id"] | null>(null);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cursorNorm, setCursorNorm] = useState<{ x: number; y: number; px: number; py: number } | null>(
    null
  );

  const p = clamp01(progress);

  // ===========================================================================
  // CHOREOGRAPHY TIMELINE (Coherent single-illustration progression, zero ghosting)
  //   0.00 -> 0.16 : CH04 root strand threads straight down into rising banyan trunk contours
  //   0.12 -> 0.42 : Prepared SVG trunk/bough contours draw; unified tree uncovers base -> crown
  //   0.38 -> 0.72 : Monochrome graphite settles into shaded dry-evergreen & terracotta washes
  //   0.72 -> 0.84 : Full illuminated forest steady state for hover/callout exploration
  //   0.84 -> 1.00 : Hanging aerial roots gather cleanly into ONE watercourse line at x = 662 (46%)
  // ===========================================================================
  const rootHandoff = clamp01(enterProgress * 0.65 + smooth(0.0, 0.16, p) * 0.35);
  const trunkStrokeDraw = smooth(0.05, 0.42, p);
  const treeUncover = smooth(0.0, 0.42, enterProgress * 0.35 + p * 0.85);
  const colorWashProgress = smooth(0.36, 0.72, p);
  const lightShift = smooth(0.45, 0.85, p);

  const exitToWater = smooth(0.84, 1.0, p);
  const exitRootConverge = smooth(0.80, 0.99, p);
  const sceneShiftY = exitToWater * -36;
  const headerFade = smooth(0.15, 0.7, enterProgress) * (1 - smooth(0.81, 0.92, p));
  const markersOpacity = smooth(0.55, 0.74, p) * (1 - smooth(0.79, 0.88, p));

  const selectedSpecimen =
    SPECIMENS.find((item) => item.id === selectedId) ?? null;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      setCursorNorm({
        x: (px / rect.width - 0.5) * 2,
        y: (py / rect.height - 0.5) * 2,
        px,
        py,
      });
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setCursorNorm(null);
  }, []);

  // Continuous bottom-to-top organic paper sweep (zero detached circle/oval islands)
  const revealTopPct = Math.round(92 - treeUncover * 92);
  const swayX = cursorNorm ? cursorNorm.x * -3.5 : 0;
  const swayY = cursorNorm ? cursorNorm.y * -2.2 : 0;
  const lensActive =
    cursorNorm && colorWashProgress > 0.2 && exitToWater < 0.3 && !selectedSpecimen;

  return (
    <div
      className="sticky top-0 w-full h-[100dvh] overflow-hidden select-none bg-paper text-ink"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Chapter 05: The Growing Forest"
    >
      {/* =====================================================================
          LAYER 01: SINGLE UNIFIED MASTER FOREST ILLUSTRATION
          Matches SVG 1440x900 slice (`object-center`) cleanly across viewports.
          ===================================================================== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(${revealTopPct}% 0% 0% 0%)`,
          transform: `translate3d(${swayX * 0.45}px, ${sceneShiftY * 0.45 + swayY * 0.45}px, 0)`,
          opacity: 1 - exitToWater * 0.52,
        }}
      >
        <Image
          src="/illustrated/ch05-forest/ch05-forest-master.jpg"
          alt="Auroville dry-evergreen forest canopy and braided banyan aerial roots rising from eroded red plateau"
          fill
          sizes="100vw"
          className="object-cover object-center mix-blend-multiply"
          style={{
            filter: `grayscale(${(1 - colorWashProgress).toFixed(3)}) contrast(${(1.09 - colorWashProgress * 0.06).toFixed(3)}) saturate(${(0.95 + colorWashProgress * 0.14).toFixed(3)})`,
          }}
          priority
        />

        {/* Controlled shifting sunlight tone across upper foliage */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 46% 42% at ${76 - lightShift * 14}% ${32 + lightShift * 12}%, rgba(195, 155, 87, ${0.13 * colorWashProgress}), transparent 72%)`,
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Localized cursor-responsive high-contrast graphite detail inspection lens (subtle, zero neon glow) */}
      {lensActive && cursorNorm && (
        <div
          className="hidden md:block pointer-events-none absolute inset-0 z-[5]"
          style={{
            clipPath: `circle(64px at ${cursorNorm.px}px ${cursorNorm.py}px)`,
          }}
          aria-hidden="true"
        >
          <Image
            src="/illustrated/ch05-forest/ch05-forest-master.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center mix-blend-multiply grayscale contrast-[1.32] brightness-[1.03]"
            style={{
              transform: `translate3d(${swayX * 0.45}px, ${sceneShiftY * 0.45 + swayY * 0.45}px, 0) scale(1.015)`,
            }}
          />
          <div
            className="absolute border border-ink/40 rounded-full"
            style={{
              width: 128,
              height: 128,
              left: cursorNorm.px - 64,
              top: cursorNorm.py - 64,
            }}
          />
        </div>
      )}

      {/* Soft Top-Left Ivory Reading Veil + Bottom Exit Ivory Veil */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[44dvh] md:w-[40vw] md:h-[42vh]"
        style={{
          background:
            "radial-gradient(ellipse 92% 85% at 14% 18%, rgba(246, 243, 235, 0.96) 24%, rgba(246, 243, 235, 0.78) 54%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[44vh]"
        style={{
          opacity: exitToWater,
          background:
            "linear-gradient(to top, #F6F3EB 28%, rgba(246, 243, 235, 0.88) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================================
          LAYER 02: PREPARED SVG TRUNK & BOUGH CONTOURS + ROOT -> WATER BRIDGE
          Paths trace actual braided trunk, main umbrella boughs & prop roots
          ===================================================================== */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`rootWaterGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#191917" />
            <stop offset="60%" stopColor="#3B4543" />
            <stop offset="100%" stopColor="#4F6670" />
          </linearGradient>
        </defs>

        {/* CH04 -> CH05 Shared Entry Filament: enters vertically near right column and anchors trunk earth ridge */}
        <path
          d="M 1010 0 C 1010 145, 998 360, 990 645"
          fill="none"
          stroke="#B75E3F"
          strokeWidth="1.5"
          strokeOpacity={0.68 * (1 - colorWashProgress * 0.85)}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - rootHandoff}
        />

        {/* Prepared Trunk & Primary Canopy Bough Ink Contours (draw from base root bed upward -> fade cleanly as raster artwork fills) */}
        <g
          fill="none"
          stroke="#191917"
          strokeLinecap="round"
          style={{
            opacity: smooth(0.05, 0.2, p) * (1 - smooth(0.45, 0.72, p)) * 0.76,
          }}
        >
          {/* Main trunk spine sweeping continuously upward out of red earth root crown */}
          <path
            d="M 852 780 C 930 700, 1004 615, 1020 515 C 1032 420, 1008 330, 955 235"
            strokeWidth="2.1"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - trunkStrokeDraw}
          />
          {/* Left umbrella bough drawn strictly from trunk fork outward */}
          <path
            d="M 1010 475 C 905 400, 765 348, 560 368"
            strokeWidth="1.75"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - smooth(0.16, 0.46, p)}
          />
          {/* Right upper crown bough drawn from trunk fork outward */}
          <path
            d="M 1032 440 C 1125 365, 1245 305, 1345 275"
            strokeWidth="1.6"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - smooth(0.16, 0.46, p)}
          />
          {/* Cursor-sensitive hanging aerial root filaments only after upper boughs reach them */}
          <g transform={`translate(${swayX * 0.6}, 0)`}>
            <path
              d="M 745 375 C 742 475, 742 585, 742 662"
              strokeWidth="1.15"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - smooth(0.30, 0.56, p)}
            />
            <path
              d="M 804 388 C 802 490, 800 585, 802 690"
              strokeWidth="1.25"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - smooth(0.30, 0.56, p)}
            />
          </g>
        </g>

        {/* CH05 -> CH06 Converging Prop-Root Water Exit:
            Three aerial strands braid seamlessly into ONE central vertical thread at x = 662 (46% width) */}
        <g style={{ opacity: smooth(0.76, 0.88, p) }}>
          <path
            d="M 632 392 C 635 560, 650 740, 662 900"
            fill="none"
            stroke="#191917"
            strokeWidth="1.05"
            strokeOpacity={0.48}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - exitRootConverge}
          />
          <path
            d="M 692 420 C 688 575, 672 745, 662 900"
            fill="none"
            stroke="#191917"
            strokeWidth="1.05"
            strokeOpacity={0.48}
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - exitRootConverge}
          />
          <path
            d="M 662 365 C 660 540, 662 740, 662 900"
            fill="none"
            stroke={`url(#rootWaterGrad-${uid})`}
            strokeWidth={1.35 + exitRootConverge * 0.65}
            strokeOpacity={0.78}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={1 - exitRootConverge}
          />
        </g>
      </svg>

      {/* =====================================================================
          QUIET CONTEXTUAL BOTANICAL CALLOUT PINS (CLOSED BY DEFAULT)
          Replaces the previous intrusive auto-opening panel!
          ===================================================================== */}
      <div
        className={`absolute inset-0 z-20 pointer-events-none ${
          selectedSpecimen ? "max-md:hidden" : ""
        }`}
        style={{ opacity: markersOpacity }}
      >
        {SPECIMENS.map((spec) => {
          const isOpen = selectedId === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() =>
                setSelectedId((prev) => (prev === spec.id ? null : spec.id))
              }
              aria-expanded={isOpen}
              className={`group pointer-events-auto absolute ${spec.anchorClass} bg-paper/80 backdrop-blur-[1px] px-2 py-1 min-h-[36px] flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 ${
                isOpen ? "text-terracotta font-semibold" : "text-ink hover:text-terracotta"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-[1.5px] transition-all duration-300 ${
                  isOpen ? "w-4 bg-terracotta" : "w-2 bg-ink/50 group-hover:w-4 group-hover:bg-terracotta"
                }`}
              />
              <span>{spec.label}</span>
              <span aria-hidden="true" className="text-ink-muted">
                {isOpen ? "−" : "+"}
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          EDITORIAL HEADLINE + OPTIONAL IN-SITU DISCOVERY DETAIL CARD (CLICK-ONLY)
          ===================================================================== */}
      <div className="relative z-30 w-full h-full px-5 sm:px-8 md:px-14 pt-[66px] md:pt-24 pb-6 md:pb-10 [@media(max-height:520px)]:pt-14 flex flex-col justify-between pointer-events-none">
        {/* Top-Left Minimal Chapter Identity & Headline */}
        <div
          className="max-w-[290px] md:max-w-[350px]"
          style={{
            opacity: headerFade,
            transform: `translate3d(0, ${(1 - smooth(0.15, 0.7, enterProgress)) * 12}px, 0)`,
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-2">
            05 · The Growing Forest
          </div>
          <h2 className="font-display text-[32px] sm:text-4xl md:text-[46px] lg:text-[52px] tracking-tight uppercase leading-[0.94] text-ink">
            FROM IRONSTONE,
            <br />
            FOREST
          </h2>
          <p className="mt-2.5 md:mt-3 font-sans text-xs md:text-[13px] text-ink/90 leading-relaxed font-light max-w-[29ch] text-pretty">
            Pioneer seeds and aerial banyan roots cooled bare plateau dust into shaded dry-evergreen forest.
          </p>
        </div>

        {/* Bottom Area: Click-Activated Specimen Detail Fold-Out (only when selected!) + Closing Line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {selectedSpecimen && exitToWater < 0.45 ? (
            <div
              className="pointer-events-auto w-full max-w-[345px] border border-ink p-3.5 archival-shadow"
              style={{ backgroundColor: "#FCFAF6" }}
            >
              <div className="flex items-start justify-between gap-2 pb-2 mb-2.5 border-b border-border/60">
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-forest font-semibold">
                    {selectedSpecimen.tag}
                  </div>
                  <h3 className="font-serif italic text-lg text-ink leading-tight mt-0.5">
                    {selectedSpecimen.title}
                  </h3>
                </div>
                <IconAction
                  onClick={() => setSelectedId(null)}
                  ariaLabel="Close botanical study"
                >
                  <X size={14} />
                </IconAction>
              </div>

              <div className="flex items-start gap-3">
                <div className="relative w-24 h-20 shrink-0 overflow-hidden bg-paper border border-border/60">
                  <Image
                    src={selectedSpecimen.src}
                    alt={selectedSpecimen.alt}
                    fill
                    sizes="100px"
                    className={
                      selectedSpecimen.fit === "cover"
                        ? "object-cover mix-blend-multiply"
                        : "object-contain p-1 mix-blend-multiply"
                    }
                  />
                </div>
                <p className="font-sans text-[11px] text-ink/85 leading-snug font-light">
                  {selectedSpecimen.note}
                </p>
              </div>

              {/* Optional Root Cutaway Flap Discovery */}
              <div className="mt-2.5 pt-2 border-t border-border/50">
                <EditorialAction
                  onClick={() => setFlapOpen((prev) => !prev)}
                  className="font-mono text-[9.5px] uppercase tracking-[0.16em]"
                >
                  {flapOpen ? "Fold Moisture Flap −" : "Lift Moisture Funnel Flap +"}
                </EditorialAction>
              </div>

              {flapOpen && (
                <div className="mt-2 pt-2 border-t border-border/40 bg-paper/75 p-2 flex items-center gap-2.5">
                  <div className="relative w-12 h-12 shrink-0 overflow-hidden border border-border/50 bg-paper-light">
                    <Image
                      src="/art/details/leaf-rosette.webp"
                      alt="Canopy leaf rosette moisture funnel"
                      fill
                      sizes="50px"
                      className="object-contain p-0.5 mix-blend-multiply"
                    />
                  </div>
                  <p className="font-sans text-[11px] text-ink/80 leading-snug font-light">
                    Leaf rosettes funnel monsoon rain along furrowed bark toward subsurface root hairs.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div />
          )}

          {/* Outgoing Root-to-Water Prose (cleanly clear right of x = 662 handoff filament) */}
          <div
            className="ml-auto max-w-[245px] md:max-w-xs text-right pb-2"
            style={{
              opacity: smooth(0.84, 0.96, p),
              transform: `translate3d(0, ${(1 - smooth(0.84, 0.96, p)) * 10}px, 0)`,
            }}
          >
            <p className="font-serif italic text-xl md:text-2xl text-ink font-light leading-snug">
              Aerial roots gather monsoon mist down into a channel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
