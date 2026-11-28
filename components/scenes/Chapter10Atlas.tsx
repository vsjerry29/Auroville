"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  ATLAS_LOCATIONS,
  WOODLAND_ACCENTS,
  AtlasLocation,
} from "@/lib/data/atlasLocations";
import { IndexOption } from "@/components/ui/EditorialControls";

interface Chapter10AtlasProps {
  /** 0.0 -> 1.0 as Chapter 10 enters viewport vertically from Chapter 04 */
  enterProgress: number;
  /** Authoritative 0.0 -> 1.0 pinned journey timeline across the 4 destinations */
  journeyProgress: number;
  /** Moves document smoothly to requested stop progress so click & scroll share one source of truth */
  onNavigateStop: (stopProgress: number) => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function qBezier(p0: number, c: number, p1: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * c + t * t * p1;
}

export default function Chapter10Atlas({
  enterProgress,
  journeyProgress,
  onNavigateStop,
}: Chapter10AtlasProps) {
  const [hoveredId, setHoveredId] = useState<AtlasLocation["id"] | null>(null);
  const [pointerSvg, setPointerSvg] = useState<{ x: number; y: number } | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const t = clamp01(journeyProgress);

  // ===========================================================================
  // 1. AUTHORITATIVE SCROLL-DERIVED CAMERA & TRANSITION TIMELINE
  //    Desktop: wide contextual framing; Mobile: closer landmark-centered zoom
  // ===========================================================================
  const camera = useMemo(() => {
    const pick = (loc: AtlasLocation) =>
      isMobileViewport ? loc.mobileCamera : loc.camera;
    const c0 = pick(ATLAS_LOCATIONS[0]);
    const c1 = pick(ATLAS_LOCATIONS[1]);
    const c2 = pick(ATLAS_LOCATIONS[2]);
    const c3 = pick(ATLAS_LOCATIONS[3]);

    if (t <= 0.16) {
      return c0;
    } else if (t <= 0.30) {
      const u = smooth(0.16, 0.30, t);
      return {
        tx: lerp(c0.tx, c1.tx, u),
        ty: lerp(c0.ty, c1.ty, u),
        scale: lerp(c0.scale, c1.scale, u),
      };
    } else if (t <= 0.44) {
      return c1;
    } else if (t <= 0.60) {
      const u = smooth(0.44, 0.60, t);
      return {
        tx: qBezier(c1.tx, isMobileViewport ? 4 : 6.5, c2.tx, u),
        ty: qBezier(c1.ty, isMobileViewport ? -12 : -6.5, c2.ty, u),
        scale: qBezier(c1.scale, isMobileViewport ? 1.24 : 1.07, c2.scale, u),
      };
    } else if (t <= 0.74) {
      return c2;
    } else if (t <= 0.87) {
      const u = smooth(0.74, 0.87, t);
      return {
        tx: qBezier(c2.tx, isMobileViewport ? 5 : 5.0, c3.tx, u),
        ty: qBezier(c2.ty, isMobileViewport ? -26 : -16.0, c3.ty, u),
        scale: qBezier(c2.scale, isMobileViewport ? 1.28 : 1.10, c3.scale, u),
      };
    }
    return c3;
  }, [t, isMobileViewport]);

  // ===========================================================================
  // 2. SYNCHRONIZED INFORMATION PANEL MASK & COORDINATED TEXT SWAP
  //    Transition segments match camera travel cleanly; fully reversible on up-scroll.
  // ===========================================================================
  const panelState = useMemo(() => {
    if (t < 0.30) {
      const wipe = smooth(0.17, 0.29, t);
      return {
        baseIdx: 0,
        nextIdx: 1,
        wipe,
        activeIdx: wipe >= 0.5 ? 1 : 0,
      };
    } else if (t < 0.60) {
      const wipe = smooth(0.45, 0.59, t);
      return {
        baseIdx: 1,
        nextIdx: 2,
        wipe,
        activeIdx: wipe >= 0.5 ? 2 : 1,
      };
    }
    const wipe = smooth(0.75, 0.86, t);
    return {
      baseIdx: 2,
      nextIdx: 3,
      wipe,
      activeIdx: wipe >= 0.5 ? 3 : 2,
    };
  }, [t]);

  // ===========================================================================
  // 3. INDEPENDENT ROUTE & CONNECTOR PROGRESSES PER DESTINATION
  // ===========================================================================
  const routeProgresses = useMemo(() => {
    const r0 = 1 - smooth(0.16, 0.24, t);
    const r1 = smooth(0.20, 0.30, t) * (1 - smooth(0.44, 0.53, t));
    const r2 = smooth(0.49, 0.60, t) * (1 - smooth(0.74, 0.82, t));
    const r3 = smooth(0.77, 0.87, t);
    return [r0, r1, r2, r3];
  }, [t]);

  const activeLocation = ATLAS_LOCATIONS[panelState.activeIdx];
  const baseLocation = ATLAS_LOCATIONS[panelState.baseIdx];
  const nextLocation = ATLAS_LOCATIONS[panelState.nextIdx];

  // Entrance choreography progress before pinned tour begins
  const introFade = smooth(0.15, 0.72, enterProgress);
  const mapSettle = smooth(0.08, 0.82, enterProgress);
  const routeIntroDraw = smooth(0.25, 0.88, enterProgress);

  const handleSvgMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * 1200;
    const y = ((e.clientY - rect.top) / rect.height) * 896;
    setPointerSvg({ x, y });
  }, []);

  const handleSvgMouseLeave = useCallback(() => {
    setPointerSvg(null);
    setHoveredId(null);
  }, []);

  // Keyboard navigation moves scroll cleanly to adjacent stop
  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = ATLAS_LOCATIONS[(idx + 1) % ATLAS_LOCATIONS.length];
        onNavigateStop(next.stopProgress);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev =
          ATLAS_LOCATIONS[(idx - 1 + ATLAS_LOCATIONS.length) % ATLAS_LOCATIONS.length];
        onNavigateStop(prev.stopProgress);
      }
    },
    [onNavigateStop]
  );

  return (
    <div
      className="relative w-full h-full bg-paper text-ink px-4 sm:px-6 md:px-10 lg:px-14 pt-[64px] md:pt-24 pb-4 md:pb-8 [@media(max-height:520px)]:pt-14 [@media(max-height:520px)]:pb-2 flex flex-col md:flex-row items-stretch justify-between gap-2 md:gap-4 select-none"
      aria-label="Chapter 07: The Interactive Atlas — Explore Auroville"
    >
      {/* =====================================================================
          CH06 -> CH07 CONTINUOUS PATHWAY HANDOFF
          Receives Water Story's outgoing watercourse line at top seam (x=560)
          and traces it seamlessly into the Auroville red-earth pathway system.
          ===================================================================== */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
        aria-hidden="true"
      >
        <path
          d="M 560 0 C 560 95, 598 168, 635 246 C 668 314, 622 385, 588 438"
          fill="none"
          stroke="#B75E3F"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeOpacity={0.68 * (1 - smooth(0.08, 0.36, t))}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - routeIntroDraw}
        />
      </svg>
      {/* =====================================================================
          MOBILE TOP HEADER & TOUCH INDEX (< 768px)
          ===================================================================== */}
      <div className="md:hidden flex items-center justify-between gap-2 z-30 shrink-0 pb-1">
        <div className="min-w-0">
          <h2 className="font-display text-[22px] sm:text-3xl tracking-tight uppercase leading-[0.94] text-ink">
            EXPLORE AUROVILLE
          </h2>
          <p className="mt-0.5 font-sans text-[11px] text-ink/75 font-light">
            Scroll or tap stops 01–04
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0" role="tablist" aria-label="Atlas Stops">
          {ATLAS_LOCATIONS.map((loc, idx) => (
            <IndexOption
              key={loc.id}
              role="tab"
              orientation="horizontal"
              number={loc.number}
              active={idx === panelState.activeIdx}
              ariaLabel={`${loc.number} ${loc.name}`}
              onClick={() => onNavigateStop(loc.stopProgress)}
            />
          ))}
        </div>
      </div>

      {/* =====================================================================
          DESKTOP LEFT COLUMN: Headline (Top Left) + Masked Editorial Card (Bottom Left)
          ===================================================================== */}
      <div className="hidden md:flex relative z-30 w-[27%] lg:w-[24.5%] flex-col justify-between shrink-0 bg-gradient-to-r from-paper via-paper/95 to-transparent pr-3">
        {/* Top Left Heading + Concise Two-Line Intro */}
        <div
          style={{
            opacity: introFade,
            transform: `translate3d(0, ${(1 - introFade) * 14}px, 0)`,
          }}
        >
          <h2 className="font-display text-4xl md:text-[40px] lg:text-[50px] [@media(max-height:520px)]:text-2xl tracking-tight uppercase leading-[0.94] text-ink">
            EXPLORE
            <br />
            AUROVILLE
          </h2>
          <p className="mt-3 [@media(max-height:520px)]:hidden font-sans text-xs lg:text-[13px] text-ink/85 leading-relaxed font-light max-w-[34ch] text-pretty">
            Scroll through four landmarks anchored across red earth paths and shaded groves.
          </p>
        </div>

        {/* Left-Bottom Fixed-Dimension Editorial Print Panel (Scroll-Driven Mask Reveal) */}
        <div
          className="w-full border border-border bg-paper-light p-3 lg:p-3.5 [@media(max-height:520px)]:p-2"
          style={{
            opacity: smooth(0.35, 0.9, enterProgress),
            transform: `translate3d(0, ${(1 - smooth(0.35, 0.9, enterProgress)) * 16}px, 0)`,
          }}
        >
          {/* Fixed 16:9 Architectural Folio Frame with Scrubbed Mask Transition */}
          <div className="relative w-full aspect-[16/9] [@media(max-height:520px)]:aspect-[16/7] overflow-hidden bg-paper-alt border border-border/60">
            <Image
              key={`base-${baseLocation.id}`}
              src={baseLocation.illustrationSrc}
              alt={baseLocation.illustrationAlt}
              fill
              sizes="(max-width: 1024px) 26vw, 340px"
              className="object-cover"
              priority
            />
            {panelState.wipe > 0.002 && (
              <div
                key={`next-${nextLocation.id}`}
                className="absolute inset-0 w-full h-full will-change-transform"
                style={{
                  clipPath: `inset(0% ${(1 - panelState.wipe) * 100}% 0% 0%)`,
                  transform: `scale(${1 + (1 - panelState.wipe) * 0.045})`,
                  transformOrigin: "left center",
                }}
              >
                <Image
                  src={nextLocation.illustrationSrc}
                  alt={nextLocation.illustrationAlt}
                  fill
                  sizes="(max-width: 1024px) 26vw, 340px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* Synchronized Location Name & Factual Description */}
          <div className="pt-3 [@media(max-height:520px)]:pt-1.5 pb-0.5 min-h-[96px] [@media(max-height:520px)]:min-h-0">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-sans font-semibold text-sm lg:text-[15px] text-ink tracking-tight">
                {activeLocation.number} · {activeLocation.name}
              </h3>
              <span className="font-serif italic text-xs text-terracotta shrink-0">
                {activeLocation.zone}
              </span>
            </div>
            <p className="mt-1.5 [@media(max-height:520px)]:mt-1 font-sans text-xs [@media(max-height:520px)]:text-[11px] [@media(max-height:520px)]:line-clamp-2 text-ink/80 leading-relaxed [@media(max-height:520px)]:leading-snug font-light text-pretty">
              {activeLocation.description}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          CENTER STAGE: Layered High-Resolution Illustrated Map + Interactive SVG Overlays
          Expanded horizontal/vertical footprint on mobile for clear landmark inspection
          ===================================================================== */}
      <div className="relative flex-1 -mx-4 sm:mx-0 overflow-hidden flex items-center justify-center min-h-[38dvh] md:min-h-0">
        {/* Soft Ivory Edge Feathering over map borders so transitions remain seamless */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background: isMobileViewport
              ? "radial-gradient(circle at center, transparent 68%, rgba(246, 243, 235, 0.78) 95%, #F6F3EB 100%)"
              : "radial-gradient(circle at center, transparent 58%, rgba(246, 243, 235, 0.85) 95%, #F6F3EB 100%)",
          }}
          aria-hidden="true"
        />

        {/* Animated Map Camera Transform Group (Layer 01..05 move in 1:1 lockstep) */}
        <div
          className="relative w-full max-w-[920px] aspect-[1200/896] will-change-transform origin-center"
          style={{
            opacity: mapSettle,
            transform: `translate3d(${camera.tx}%, ${camera.ty}%, 0) scale(${camera.scale})`,
            transition: "opacity 220ms ease",
          }}
        >
          {/* LAYER 01 & 02 (Raster Base): High-Resolution Illustrated Topographic Plate */}
          <Image
            src="/illustrated/ch10-atlas/auroville-atlas-base.jpg"
            alt="Hand-illustrated watercolor and graphite architectural map of Auroville"
            fill
            sizes="(max-width: 768px) 96vw, 62vw"
            className="object-contain mix-blend-multiply contrast-[1.03]"
            priority
          />

          {/* LAYERS 02b, 03, 04, 05 (Aligned SVG Overlay in exact 1200x896 native space) */}
          <svg
            viewBox="0 0 1200 896"
            className="absolute inset-0 w-full h-full overflow-visible"
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={handleSvgMouseLeave}
            role="img"
            aria-label="Interactive landmark routes and site pins across Auroville"
          >
            {/* LAYER 02b: Subtle Secondary Botanical Leaf Strokes on Proximity / Destination */}
            <g fill="none" strokeLinecap="round">
              {WOODLAND_ACCENTS.map((grove, i) => {
                const dist = pointerSvg
                  ? Math.hypot(pointerSvg.x - grove.x, pointerSvg.y - grove.y)
                  : 999;
                const isNearPointer = dist < 130;
                const activePin = activeLocation.pin;
                const isNearActive =
                  Math.hypot(activePin.x - grove.x, activePin.y - grove.y) < 190;
                const op = isNearPointer ? 0.78 : isNearActive ? 0.5 : 0.14;
                return (
                  <path
                    key={i}
                    d={grove.d}
                    transform={`translate(${grove.x}, ${grove.y})`}
                    stroke={isNearPointer || isNearActive ? "#2F4232" : "#191917"}
                    strokeWidth={isNearPointer ? 1.35 : 0.95}
                    style={{ opacity: op, transition: "opacity 280ms ease, stroke-width 280ms ease" }}
                  />
                );
              })}
            </g>

            {/* LAYER 04: SCROLL-SYNCHRONIZED INTERACTIVE ROUTE OVERLAYS */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none">
              {ATLAS_LOCATIONS.map((loc, idx) => {
                const segProg = routeProgresses[idx] * routeIntroDraw;
                const isHov = hoveredId === loc.id;
                const drawVal = Math.max(segProg, isHov ? 0.85 : 0);
                return (
                  <g key={`route-${loc.id}`}>
                    {/* Warm terracotta earth ink stroke tracing verified route */}
                    <path
                      d={loc.routePath}
                      stroke="#B75E3F"
                      strokeWidth={isHov ? 3.4 : 3.0}
                      strokeOpacity={drawVal > 0.02 ? 0.78 : 0}
                      pathLength={1}
                      strokeDasharray="1"
                      strokeDashoffset={1 - drawVal}
                      style={{ transition: "stroke-opacity 240ms ease" }}
                    />
                    {/* Fine graphite accent hairline inside route */}
                    <path
                      d={loc.routePath}
                      stroke="#191917"
                      strokeWidth={1.0}
                      strokeOpacity={drawVal > 0.05 ? 0.55 : 0}
                      pathLength={1}
                      strokeDasharray="6 5"
                      strokeDashoffset={1 - drawVal}
                      style={{ transition: "stroke-opacity 240ms ease" }}
                    />
                  </g>
                );
              })}
            </g>

            {/* Contextual Geographic District Micro-Labels Placed Clear of Ink Strokes */}
            <g className="pointer-events-none font-sans text-[13px] md:text-[11px] uppercase tracking-[0.2em] fill-ink/65">
              <text x="696" y="152" textAnchor="middle">
                Crown Road
              </text>
              <text x="696" y="274" textAnchor="middle" className="text-[12px] md:text-[10px]">
                Peace Area
              </text>
              <text x="412" y="380" textAnchor="middle" className="text-[11.5px] md:text-[9.5px]">
                International Zone
              </text>
            </g>

            {/* Clean North Arrow Marker */}
            <g transform="translate(1078, 766)" className="pointer-events-none opacity-65">
              <line x1="0" y1="0" x2="0" y2="-32" stroke="#191917" strokeWidth="1.2" />
              <path d="M -4 -22 L 0 -34 L 4 -22 Z" fill="#B75E3F" stroke="#191917" strokeWidth="0.7" />
              <text
                x="0"
                y="-40"
                textAnchor="middle"
                className="font-sans text-[11px] font-semibold fill-ink tracking-widest"
              >
                N
              </text>
            </g>

            {/* LAYER 03 & LAYER 05: INTERACTIVE ARCHITECTURAL DETAILS, PINS & LEADER LABELS */}
            {ATLAS_LOCATIONS.map((loc, idx) => {
              const isSelected = idx === panelState.activeIdx;
              const isHovered = hoveredId === loc.id;
              const isEmphasized = isSelected || isHovered;
              const leaderProgress = Math.max(routeProgresses[idx], isHovered ? 0.9 : 0) * routeIntroDraw;

              return (
                <g key={loc.id}>
                  {/* Retracting / Drawing Leader Line from Site Pinpoint to Editorial Callout Box */}
                  <path
                    d={loc.leaderPath}
                    fill="none"
                    stroke="#191917"
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                    strokeOpacity={isHovered ? 0.45 : 0.18}
                    className="pointer-events-none"
                  />
                  <path
                    d={loc.leaderPath}
                    fill="none"
                    stroke="#B75E3F"
                    strokeWidth="1.7"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={1 - leaderProgress}
                    className="pointer-events-none"
                  />

                  {/* SITE ARCHITECTURE + PINPOINT TARGET (Clickable & Keyboard Accessible) */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${loc.name} on map`}
                    aria-pressed={isSelected}
                    onClick={() => onNavigateStop(loc.stopProgress)}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onNavigateStop(loc.stopProgress);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={loc.pin.x} cy={loc.pin.y} r={38} fill="transparent" />

                    {/* Layer 03: Landmark-Specific Architectural Secondary Detail Lines on Active/Hover */}
                    {loc.id === "matrimandir" && (
                      <g
                        transform={`translate(${loc.pin.x}, ${loc.pin.y})`}
                        style={{
                          opacity: isEmphasized ? 0.92 : 0.22,
                          transition: "opacity 260ms ease",
                        }}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r="36"
                          fill="none"
                          stroke="#B75E3F"
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                        />
                        <circle cx="0" cy="0" r="24" fill="none" stroke="#191917" strokeWidth="0.85" />
                      </g>
                    )}

                    {loc.id === "bharat-nivas" && (
                      <g
                        style={{
                          opacity: isEmphasized ? 0.95 : 0.24,
                          transition: "opacity 260ms ease",
                        }}
                      >
                        <circle
                          cx={loc.pin.x}
                          cy={loc.pin.y}
                          r="32"
                          fill="none"
                          stroke="#B75E3F"
                          strokeWidth="1.15"
                          strokeDasharray="3 3"
                        />
                        {/* Secondary pavilion architectural axial frame */}
                        <line x1="258" y1="397" x2="365" y2="397" stroke="#191917" strokeWidth="0.9" />
                      </g>
                    )}

                    {loc.id === "solar-kitchen" && (
                      <g
                        transform={`translate(${loc.pin.x}, ${loc.pin.y})`}
                        style={{
                          opacity: isEmphasized ? 0.95 : 0.22,
                          transition: "opacity 260ms ease",
                        }}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r="32"
                          fill="none"
                          stroke="#B75E3F"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                        <circle cx="0" cy="0" r="20" fill="none" stroke="#191917" strokeWidth="0.85" />
                      </g>
                    )}

                    {loc.id === "visitors-centre" && (
                      <g
                        transform={`translate(${loc.pin.x}, ${loc.pin.y})`}
                        style={{
                          opacity: isEmphasized ? 0.95 : 0.24,
                          transition: "opacity 260ms ease",
                        }}
                      >
                        <rect
                          x="-24"
                          y="-24"
                          width="48"
                          height="48"
                          transform="rotate(-40)"
                          fill="none"
                          stroke="#B75E3F"
                          strokeWidth="1.2"
                          strokeDasharray="3 3"
                        />
                      </g>
                    )}

                    {/* Clean Restraint Pinpoint Ring + Dot (Zero pulsing/bouncing dots) */}
                    <circle
                      cx={loc.pin.x}
                      cy={loc.pin.y}
                      r={isSelected ? (isMobileViewport ? 10 : 7.5) : isMobileViewport ? 7.5 : 5.5}
                      fill="#FCFAF6"
                      stroke={isSelected ? "#B75E3F" : "#191917"}
                      strokeWidth={isSelected ? 2.4 : 1.5}
                      style={{ transition: "all 240ms ease" }}
                    />
                    <circle
                      cx={loc.pin.x}
                      cy={loc.pin.y}
                      r={isSelected ? (isMobileViewport ? 4.4 : 3.2) : isMobileViewport ? 3 : 2.1}
                      fill={isSelected ? "#B75E3F" : "#191917"}
                    />
                  </g>

                  {/* INTERACTIVE CARTOGRAPHIC LOCATION LABEL (Unboxed Typographic Callout) */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={`${loc.name} label`}
                    aria-pressed={isSelected}
                    transform={`translate(${loc.labelPos.x}, ${loc.labelPos.y})`}
                    onClick={() => onNavigateStop(loc.stopProgress)}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onNavigateStop(loc.stopProgress);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    {/* Generous transparent interactive hit box */}
                    <rect
                      x={loc.labelPos.align === "right" ? -168 : -4}
                      y={-22}
                      width={172}
                      height={42}
                      fill="transparent"
                    />
                    <text
                      x={loc.labelPos.align === "right" ? -6 : 6}
                      y={-3}
                      textAnchor={loc.labelPos.align === "right" ? "end" : "start"}
                      paintOrder="stroke"
                      stroke="#F6F3EB"
                      strokeWidth="7"
                      strokeLinejoin="round"
                      className={`font-sans text-[21px] md:text-[14.5px] tracking-wide pointer-events-none transition-colors ${
                        isSelected
                          ? "fill-terracotta font-semibold"
                          : isHovered
                          ? "fill-ink font-medium"
                          : "fill-ink/90 font-normal"
                      }`}
                    >
                      {loc.name}
                    </text>
                    <line
                      x1={loc.labelPos.align === "right" ? (isMobileViewport ? -165 : -130) : 0}
                      y1={4}
                      x2={loc.labelPos.align === "right" ? 0 : isMobileViewport ? 165 : 130}
                      y2={4}
                      stroke={isSelected ? "#B75E3F" : isHovered ? "#191917" : "#9C988D"}
                      strokeWidth={isSelected ? 1.8 : 0.9}
                      strokeOpacity={isSelected ? 0.92 : isHovered ? 0.72 : 0.48}
                    />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* =====================================================================
          DESKTOP RIGHT INDEX: Minimal Clickable 01..04 Navigation
          ===================================================================== */}
      <div
        className="hidden md:flex relative z-30 w-20 lg:w-28 flex-col justify-between items-end shrink-0"
        style={{ opacity: smooth(0.35, 0.9, enterProgress) }}
      >
        <div className="h-4" aria-hidden="true" />

        <nav aria-label="Atlas destinations" className="flex flex-col items-end gap-3">
          {ATLAS_LOCATIONS.map((loc, idx) => (
            <IndexOption
              key={loc.id}
              number={loc.number}
              active={idx === panelState.activeIdx}
              ariaLabel={`${loc.number} ${loc.name}`}
              onClick={() => onNavigateStop(loc.stopProgress)}
              onMouseEnter={() => setHoveredId(loc.id)}
              onMouseLeave={() => setHoveredId(null)}
              onKeyDown={(e) => handleKeyNav(e, idx)}
            />
          ))}
        </nav>

        <div className="font-sans text-[10.5px] text-ink-muted text-right leading-snug max-w-[18ch]">
          Illustrated interpretation based on verified geography
        </div>
      </div>

      {/* =====================================================================
          MOBILE BOTTOM DETAIL PANEL (< 768px — Always Readable Within Pinned Frame)
          ===================================================================== */}
      <div className="md:hidden z-30 border border-border bg-paper-light p-2.5 flex items-center gap-3 shrink-0">
        <div className="relative w-24 sm:w-32 aspect-[4/3] shrink-0 overflow-hidden bg-paper-alt border border-border/60">
          <Image
            key={`mob-base-${baseLocation.id}`}
            src={baseLocation.illustrationSrc}
            alt={baseLocation.illustrationAlt}
            fill
            sizes="150px"
            className="object-cover"
            priority
          />
          {panelState.wipe > 0.002 && (
            <div
              key={`mob-next-${nextLocation.id}`}
              className="absolute inset-0 w-full h-full"
              style={{
                clipPath: `inset(0% ${(1 - panelState.wipe) * 100}% 0% 0%)`,
              }}
            >
              <Image
                src={nextLocation.illustrationSrc}
                alt={nextLocation.illustrationAlt}
                fill
                sizes="150px"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans font-semibold text-xs sm:text-sm text-ink truncate">
              {activeLocation.number} · {activeLocation.name}
            </h3>
            <span className="font-serif italic text-[11px] text-terracotta shrink-0">
              {activeLocation.zone}
            </span>
          </div>
          <p className="mt-1 font-sans text-[11px] text-ink/80 leading-snug font-light">
            {activeLocation.description}
          </p>
        </div>
      </div>
    </div>
  );
}
