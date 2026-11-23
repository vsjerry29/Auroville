"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { Maximize2, RotateCcw, Sparkles, X, ChevronRight, Compass, Sprout, Info } from "lucide-react";

interface EarthPrint {
  id: string;
  plate: string;
  title: string;
  subtitle: string;
  src: string;
  story: string;
  detailedSpecs: {
    location: string;
    elevation: string;
    soilType: string;
    plantingEra: string;
  };
  defaultTilt: number;
  desktopLeftPercent: number;
  cordHangY: number; // Y offset under cord in px
}

const EARTH_PRINTS: EarthPrint[] = [
  {
    id: "red-earth",
    plate: "PLATE 04-A",
    title: "TERRACOTTA HORIZONS",
    subtitle: "Laterite Ravines & Soil Strata",
    src: "/illustrated/ch04-earth/print-red-earth.webp",
    story:
      "Deep eroded canyons and iron-rich laterite earth. Before a single tree took root, this was a wind-swept, sun-bleached plateau requiring millions of hand-dug water bunds to retain precious monsoon rain.",
    detailedSpecs: {
      location: "Matrimandir Outer Buffer",
      elevation: "52m above sea level",
      soilType: "Cuddalore Sandstone / Ferruginous Laterite",
      plantingEra: "1968 - 1974 Pioneer Phase",
    },
    defaultTilt: -2.2,
    desktopLeftPercent: 16,
    cordHangY: 18,
  },
  {
    id: "seed-hand",
    plate: "PLATE 04-B",
    title: "SEED ANATOMY & SOWING",
    subtitle: "Hands Sowing Pioneer Species",
    src: "/illustrated/ch04-earth/print-seed-hand.webp",
    story:
      "Neem, banyan, and indigenous acacia seeds held in working hands. Over fifty years, more than three million trees were hand-planted to rebuild the local microclimate and retain ambient humidity.",
    detailedSpecs: {
      location: "Aurogreen & Forecomers Nursery",
      elevation: "48m above sea level",
      soilType: "Organic Loam Topsoil Layer",
      plantingEra: "1972 - Present Reforestation",
    },
    defaultTilt: 1.8,
    desktopLeftPercent: 39,
    cordHangY: 34,
  },
  {
    id: "roots-strata",
    plate: "PLATE 04-C",
    title: "TAPROOT ARCHITECTURE",
    subtitle: "Subterranean Aquifer Anchors",
    src: "/illustrated/ch04-earth/print-roots-strata.webp",
    story:
      "Fibrous taproot systems fracturing hard laterite hardpan, capturing monsoon rain underground and anchoring the living forest against turbulent Bay of Bengal cyclonic winds.",
    detailedSpecs: {
      location: "Kottakarai Watershed Ridge",
      elevation: "55m above sea level",
      soilType: "Fractured Ironstone Hardpan",
      plantingEra: "Pioneer Acacia & Dodonaea Deep Rooting",
    },
    defaultTilt: -1.6,
    desktopLeftPercent: 62,
    cordHangY: 28,
  },
  {
    id: "forest-path",
    plate: "PLATE 04-D",
    title: "EVERGREEN CANOPY TRAIL",
    subtitle: "The Living Sanctuary Corridor",
    src: "/illustrated/ch04-earth/print-forest-path.webp",
    story:
      "Shaded red-earth forest corridors walking beneath dense evergreen branches. The ambient temperature drops four full degrees Celsius the moment one steps under the canopy.",
    detailedSpecs: {
      location: "Pitchandikulam Botanical Sanctuary",
      elevation: "45m above sea level",
      soilType: "Rich Deciduous Humus Layer",
      plantingEra: "Mature Tropical Dry Evergreen Forest",
    },
    defaultTilt: 2.3,
    desktopLeftPercent: 85,
    cordHangY: 16,
  },
];

interface PlantedSeed {
  id: number;
  x: number;
  y: number;
}

interface Chapter04RedEarthProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
  onNavigateStart?: () => void;
}

export default function Chapter04RedEarth({
  progress,
  active,
  onNavigateStart,
}: Chapter04RedEarthProps) {
  // Normalize progress for Scene 04 (range: 0.73 - 1.00)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.73) / 0.27));

  // Focus modal state
  const [activePrint, setActivePrint] = useState<EarthPrint | null>(null);
  const [hoveredPrintId, setHoveredPrintId] = useState<string | null>(null);

  // Direct Interaction: Plant a Seed in Landscape Phase
  const [plantedSeeds, setPlantedSeeds] = useState<PlantedSeed[]>([]);
  const landscapeRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePrint) {
        setActivePrint(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePrint]);

  if (!active && progress < 0.72) {
    return null;
  }

  // -------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY PHASES
  // -------------------------------------------------------------------------
  // 1. Entrance & Settling (0.00 - 0.15): Cord draws, heading fades in, prints hang
  const entranceProgress = Math.min(1, Math.max(0, localProgress / 0.15));
  const cordDashOffset = Math.max(0, (1 - entranceProgress) * 1200);
  const cordOpacity = Math.min(1, localProgress / 0.10);

  // 2. Exhibition Stasis (0.15 - 0.45): All 4 prints suspended & interactive
  // 3. Planar Transformation (0.45 - 0.70): Red earth print glides forward, others fade
  const transformProgress = Math.min(1, Math.max(0, (localProgress - 0.45) / 0.25));

  // 4. Landscape Full Bleed (0.70 - 1.00): Fills viewport, seed interaction unlocked
  const landscapeProgress = Math.min(1, Math.max(0, (localProgress - 0.70) / 0.30));

  // Non-red-earth prints fade out as Print A expands
  const otherPrintsOpacity = Math.max(0, 1 - transformProgress * 2.5);

  const handleLandscapeClick = (e: MouseEvent<HTMLDivElement>) => {
    if (landscapeProgress < 0.25) return;
    if (!landscapeRef.current) return;
    const rect = landscapeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlantedSeeds((prev) => [...prev.slice(-12), { id: Date.now(), x, y }]);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-paper paper-texture transition-opacity duration-200"
      style={{
        zIndex: 25,
        visibility: progress >= 0.72 ? "visible" : "hidden",
        pointerEvents: progress >= 0.73 ? "auto" : "none",
        opacity: Math.min(1, Math.max(0, (progress - 0.72) / 0.02)),
      }}
    >
      {/* =====================================================================
          FAINT CIRCULAR RADIAL DIAGRAM (Tree rings, soil strata, galaxy axis)
          ===================================================================== */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] max-w-[850px] aspect-square pointer-events-none transition-transform duration-700 ease-out"
        style={{
          opacity: 0.12 * (1 - landscapeProgress * 0.9),
          transform: `translate(-50%, -50%) rotate(${localProgress * 12}deg) scale(${1 + localProgress * 0.08})`,
        }}
      >
        <Image
          src="/illustrated/ch04-earth/radial-earth-diagram.svg"
          alt="Radial growth rings and soil strata diagram"
          fill
          className="object-contain"
        />
      </div>

      {/* =====================================================================
          SCENE HEADER & ARCHIVAL NUMBERING
          ===================================================================== */}
      <div
        className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-22 flex items-end justify-between border-b border-border/80 pb-4 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 1 - transformProgress * 1.8) * Math.min(1, localProgress / 0.15),
          transform: `translateY(${(1 - entranceProgress) * -12}px)`,
        }}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold">
              ACT I · SCENE 04 / 04
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
            <span className="font-mono text-[10px] text-ink-muted uppercase tracking-widest">
              SUSPENDED PRINT EXHIBITION
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-ink font-bold tracking-tight uppercase mt-1">
            THE EARTH REMEMBERS.
          </h2>
        </div>

        <div className="text-right font-mono text-[9px] md:text-[10px] text-ink-muted uppercase tracking-widest hidden sm:block">
          <div>FOUR PLATES HUNG ON LINEN CORD</div>
          <div className="text-terracotta font-medium mt-0.5">
            {landscapeProgress > 0.5 ? "TERRAIN EXPANSION ACTIVE" : "HOVER OR TAP TO INSPECT"}
          </div>
        </div>
      </div>

      {/* =====================================================================
          SUSPENSION CORD (Spans across viewport with gentle organic sag)
          ===================================================================== */}
      <div
        className="absolute inset-x-0 top-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500"
        style={{
          opacity: cordOpacity * (1 - landscapeProgress),
        }}
      >
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          {/* Main sagging linen cord */}
          <path
            d="M -40 270 Q 720 330, 1480 275"
            stroke="#4A453E"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{
              strokeDasharray: 1600,
              strokeDashoffset: cordDashOffset,
            }}
          />
          {/* Twisted twine secondary strand */}
          <path
            d="M -40 271 Q 720 331, 1480 276"
            stroke="#968875"
            strokeWidth="0.9"
            strokeDasharray="4 3"
            opacity="0.65"
          />
        </svg>
      </div>

      {/* =====================================================================
          DESKTOP PRINT EXHIBITION (4 Hanging Prints)
          ===================================================================== */}
      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none">
        {EARTH_PRINTS.map((print, index) => {
          const isRedEarth = print.id === "red-earth";
          const isHovered = hoveredPrintId === print.id;

          // Position calculation under the sagging cord
          // The cord is near y = 270px on left/right and sags to y = 310px in the middle
          const cordY = 270 + Math.sin((print.desktopLeftPercent / 100) * Math.PI) * 45;

          // Phase calculations for Print A vs other prints
          if (!isRedEarth) {
            // Other prints drift outward and fade during transformation
            const driftX = (index - 1.5) * 60 * transformProgress;
            const currentOpacity = otherPrintsOpacity * Math.min(1, entranceProgress * 1.5);

            if (currentOpacity <= 0.01) return null;

            return (
              <div
                key={print.id}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${print.plate}: ${print.title}`}
                className="absolute transition-all duration-300 ease-out pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
                style={{
                  left: `${print.desktopLeftPercent}%`,
                  top: `${cordY}px`,
                  transform: `translate(-50%, ${isHovered ? "-8px" : "0px"}) translateX(${driftX}px) rotate(${
                    isHovered ? 0 : print.defaultTilt
                  }deg)`,
                  opacity: currentOpacity,
                  width: "270px",
                }}
                onMouseEnter={() => setHoveredPrintId(print.id)}
                onMouseLeave={() => setHoveredPrintId(null)}
                onClick={() => setActivePrint(print)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActivePrint(print);
                  }
                }}
              >
                {/* Wooden Clip */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                  <WoodenClip />
                </div>

                {/* Print Paper Card */}
                <div
                  className={`bg-paper-light border border-border p-3 archival-shadow transition-shadow duration-300 ${
                    isHovered ? "shadow-2xl border-terracotta/70" : ""
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                    <Image
                      src={print.src}
                      alt={print.title}
                      fill
                      sizes="280px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="pt-2.5 pb-0.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-wider text-terracotta font-semibold">
                      <span>{print.plate}</span>
                      <span className="text-ink-muted">· 50 YRS</span>
                    </div>
                    <div className="font-serif italic text-base text-ink font-light mt-0.5 leading-snug truncate">
                      {print.title}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60 font-mono text-[7.5px] uppercase tracking-widest text-ink-muted">
                      <span>TAP TO INSPECT</span>
                      <Maximize2 size={10} className="text-terracotta" />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // -------------------------------------------------------------------
          // PRINT 01: RED EARTH (GLIDES FORWARD & SCALES TOWARD CENTER)
          // -------------------------------------------------------------------
          const redEarthOpacity = Math.max(0, (1 - landscapeProgress * 1.5)) * Math.min(1, entranceProgress * 1.5);
          if (redEarthOpacity <= 0.01) return null;

          const targetCenterY = 440; // Screen center Y in px
          const currentLeft = print.desktopLeftPercent + (50 - print.desktopLeftPercent) * transformProgress;
          const currentTop = cordY + (targetCenterY - cordY) * transformProgress;
          const currentScale = 1 + transformProgress * 1.8;
          const currentTilt = isHovered && transformProgress === 0 ? 0 : print.defaultTilt * (1 - transformProgress);

          return (
            <div
              key={print.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${print.plate}: ${print.title}`}
              className="absolute transition-all duration-150 ease-out pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
              style={{
                left: `${currentLeft}%`,
                top: `${currentTop}px`,
                transform: `translate(-50%, ${isHovered && transformProgress === 0 ? "-8px" : "-50%"}) rotate(${currentTilt}deg) scale(${currentScale})`,
                opacity: redEarthOpacity,
                width: "270px",
                zIndex: transformProgress > 0 ? 35 : 20,
              }}
              onMouseEnter={() => setHoveredPrintId(print.id)}
              onMouseLeave={() => setHoveredPrintId(null)}
              onClick={() => setActivePrint(print)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActivePrint(print);
                }
              }}
            >
              {/* Wooden Clip (fades out as it leaves the cord) */}
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300"
                style={{ opacity: 1 - transformProgress * 2.5 }}
              >
                <WoodenClip />
              </div>

              {/* Physical Print Card */}
              <div
                className={`bg-paper-light border transition-all duration-300 ${
                  transformProgress > 0.2
                    ? "p-0 border-transparent shadow-none"
                    : "border-border p-3 archival-shadow"
                } ${isHovered && transformProgress === 0 ? "shadow-2xl border-terracotta/70" : ""}`}
              >
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src={print.src}
                    alt={print.title}
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                </div>

                {transformProgress < 0.2 && (
                  <div className="pt-2.5 pb-0.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-wider text-terracotta font-semibold">
                      <span>{print.plate}</span>
                      <span className="text-ink-muted">· 50 YRS</span>
                    </div>
                    <div className="font-serif italic text-base text-ink font-light mt-0.5 leading-snug truncate">
                      {print.title}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60 font-mono text-[7.5px] uppercase tracking-widest text-ink-muted">
                      <span>TAP TO INSPECT</span>
                      <Maximize2 size={10} className="text-terracotta" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          MASTER LANDSCAPE FULL BLEED (Expanded terrain when localProgress > 0.80)
          ===================================================================== */}
      {landscapeProgress > 0.02 && (
        <div
          ref={landscapeRef}
          onClick={handleLandscapeClick}
          className="absolute inset-0 w-full h-full z-40 transition-opacity duration-500 overflow-hidden"
          style={{
            opacity: landscapeProgress,
            pointerEvents: landscapeProgress > 0.3 ? "auto" : "none",
            cursor: "crosshair",
          }}
        >
          {/* Master Red Earth Landscape Illustration */}
          <Image
            src="/illustrated/ch04-earth/print-red-earth.webp"
            alt="The Living Red Earth Landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Seed Sprout Layer: Drawn roots and green shoots when clicked */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            {plantedSeeds.map((seed) => (
              <g key={seed.id} className="animate-fade-in">
                {/* Fine root branching downward into laterite */}
                <path
                  d={`M ${seed.x}% ${seed.y}% Q ${seed.x - 2}% ${seed.y + 4}%, ${seed.x - 1}% ${seed.y + 8}% T ${seed.x + 2}% ${seed.y + 14}%`}
                  stroke="#5A422D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d={`M ${seed.x}% ${seed.y}% Q ${seed.x + 3}% ${seed.y + 5}%, ${seed.x + 4}% ${seed.y + 11}%`}
                  stroke="#8C6847"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Pioneer Green Sprout emerging upward */}
                <circle cx={`${seed.x}%`} cy={`${seed.y}%`} r="4" fill="#B75E3F" />
                <path
                  d={`M ${seed.x}% ${seed.y}% C ${seed.x - 1.5}% ${seed.y - 2}%, ${seed.x - 3}% ${seed.y - 4}%, ${seed.x - 2}% ${seed.y - 7}%`}
                  stroke="#4A6B53"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx={`${seed.x - 2}%`} cy={`${seed.y - 7}%`} r="2.5" fill="#5F8D6B" />
              </g>
            ))}
          </svg>

          {/* Drawn Root System Leading to Chapter 05 (Bottom Horizontal Corridor) */}
          <div
            className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-20 flex items-end justify-between px-8 pb-6 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent transition-opacity duration-500"
            style={{ opacity: landscapeProgress }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-terracotta text-paper-light flex items-center justify-center animate-pulse">
                <Sprout size={18} />
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-paper-light/80 font-semibold">
                  TAP TERRAIN TO SOW SEEDS · {plantedSeeds.length} PLANTED
                </div>
                <div className="font-serif italic text-xl text-paper-light font-light">
                  The Red Earth Landscape Awakens
                </div>
              </div>
            </div>

            {/* Return to Beginning & Proceed Action */}
            <div className="pointer-events-auto flex items-center gap-4">
              {onNavigateStart && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateStart();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-paper-light/95 backdrop-blur-md border border-border hover:border-ink font-mono text-[10px] uppercase tracking-wider text-ink transition-colors archival-shadow rounded-sm"
                >
                  <RotateCcw size={12} className="text-terracotta" />
                  <span>RETURN TO COVER</span>
                </button>
              )}

              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-ink/80 backdrop-blur-md text-paper-light font-mono text-[10px] uppercase tracking-widest border border-paper/20">
                <span>SCROLL UP TO RE-EXAMINE PRINTS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MOBILE RESPONSIVE GALLERY (Horizontal swipe list for touch screens)
          ===================================================================== */}
      <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end pb-12 px-6 pointer-events-auto">
        <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2 flex items-center justify-between">
          <span>FOUR SUSPENDED PLATES</span>
          <span className="text-terracotta">SWIPE TO EXPLORE →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
          {EARTH_PRINTS.map((print) => (
            <div
              key={print.id}
              onClick={() => setActivePrint(print)}
              className="min-w-[240px] max-w-[260px] snap-center bg-paper-light border border-border p-3 archival-shadow shrink-0 cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden mb-2">
                <Image
                  src={print.src}
                  alt={print.title}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <div className="font-mono text-[8.5px] text-terracotta uppercase font-semibold">
                {print.plate}
              </div>
              <div className="font-serif italic text-base text-ink font-light leading-snug truncate">
                {print.title}
              </div>
              <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between font-mono text-[7.5px] text-ink-muted uppercase">
                <span>TAP TO INSPECT</span>
                <Maximize2 size={10} className="text-terracotta" />
              </div>
            </div>
          ))}
        </div>

        {onNavigateStart && (
          <button
            onClick={onNavigateStart}
            className="mt-4 w-full py-2.5 bg-paper-light border border-border text-ink font-mono text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <RotateCcw size={12} className="text-terracotta" />
            <span>RETURN TO BEGINNING</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          ACCESSIBLE PRINT INSPECTION MODAL (Detail View)
          ===================================================================== */}
      {activePrint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePrint.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-ink/80 backdrop-blur-md animate-fade-in pointer-events-auto"
          onClick={() => setActivePrint(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-paper-light border border-border archival-shadow flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePrint(null)}
              aria-label="Close print inspection"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-paper/90 border border-border text-ink hover:text-terracotta hover:border-terracotta transition-colors flex items-center justify-center"
            >
              <X size={16} />
            </button>

            {/* Illustration Viewport */}
            <div className="relative w-full md:w-3/5 h-64 md:h-auto min-h-[300px] md:min-h-[460px] bg-paper-dark">
              <Image
                src={activePrint.src}
                alt={activePrint.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Archival Information Panel */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-paper-light">
              <div>
                <div className="flex items-center gap-2 text-terracotta text-[10px] uppercase tracking-widest font-mono pb-2.5 border-b border-border font-semibold">
                  <span>{activePrint.plate}</span>
                  <span className="text-border">·</span>
                  <span className="text-ink-muted">ARCHIVAL EXHIBIT</span>
                </div>

                <h3 className="font-serif italic text-2xl md:text-3xl text-ink font-light mt-3 tracking-tight">
                  {activePrint.title}
                </h3>
                <div className="text-ink-muted font-mono text-[10px] uppercase tracking-wider mt-0.5">
                  {activePrint.subtitle}
                </div>

                <p className="mt-4 font-sans text-xs md:text-sm text-ink/90 leading-relaxed font-light">
                  {activePrint.story}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border space-y-2 text-[10px] font-mono text-ink-muted">
                <div className="flex justify-between">
                  <span>SPECIFIC LOCATION:</span>
                  <span className="text-ink">{activePrint.detailedSpecs.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>ELEVATION:</span>
                  <span className="text-ink">{activePrint.detailedSpecs.elevation}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOIL PROFILE:</span>
                  <span className="text-ink">{activePrint.detailedSpecs.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span>PLANTING ERA:</span>
                  <span className="text-ink">{activePrint.detailedSpecs.plantingEra}</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setActivePrint(null)}
                    className="w-full py-2.5 text-[10px] font-mono uppercase tracking-widest text-ink hover:text-paper-light bg-paper hover:bg-ink border border-border transition-colors text-center"
                  >
                    Close Inspection [ESC]
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Bespoke Wooden Clip SVG Graphic
function WoodenClip() {
  return (
    <svg className="w-5 h-7 drop-shadow-sm" viewBox="0 0 20 28" fill="none">
      {/* Wooden clip body */}
      <rect
        x="5"
        y="0"
        width="10"
        height="22"
        rx="1.5"
        fill="#C49A6C"
        stroke="#8A6540"
        strokeWidth="1"
      />
      {/* Wood grain line */}
      <line x1="8" y1="3" x2="8" y2="19" stroke="#A87F53" strokeWidth="0.75" />
      {/* Metal wire spring coil */}
      <rect
        x="3"
        y="10"
        width="14"
        height="4"
        rx="1"
        fill="#66625C"
        stroke="#3B3834"
        strokeWidth="0.75"
      />
      {/* Bottom pinch slit */}
      <line x1="5" y1="22" x2="15" y2="22" stroke="#5A3E25" strokeWidth="1.5" />
    </svg>
  );
}
