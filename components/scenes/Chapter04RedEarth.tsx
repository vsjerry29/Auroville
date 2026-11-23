"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Image from "next/image";
import LivingContourField from "@/components/experience/LivingContourField";
import { Maximize2, RotateCcw, X, Sprout, Compass } from "lucide-react";

interface EarthPlate {
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
  cordHangY: number;
}

const EARTH_PLATES: EarthPlate[] = [
  {
    id: "red-earth",
    plate: "PLATE A",
    title: "Terracotta Horizons",
    subtitle: "Laterite Ravines & Soil Strata",
    src: "/illustrated/ch04-earth/print-red-earth.webp",
    story:
      "Deep eroded canyons and iron-rich laterite earth. Before a single tree took root, this was a wind-swept, sun-bleached plateau requiring millions of hand-dug water bunds to retain precious monsoon rain.",
    detailedSpecs: {
      location: "Matrimandir Outer Buffer",
      elevation: "52m above sea level",
      soilType: "Cuddalore Sandstone / Ferruginous Laterite",
      plantingEra: "1968–1974 Pioneer Phase",
    },
    defaultTilt: -1.8,
    desktopLeftPercent: 22,
    cordHangY: 20,
  },
  {
    id: "seed-hand",
    plate: "PLATE B",
    title: "Seed Anatomy & Sowing",
    subtitle: "Hands Sowing Indigenous Species",
    src: "/illustrated/ch04-earth/print-seed-hand.webp",
    story:
      "Neem, banyan, and indigenous acacia seeds held in working hands. Over fifty years, more than three million trees were planted by hand to rebuild the microclimate and restore ambient humidity.",
    detailedSpecs: {
      location: "Aurogreen & Forecomers Nursery",
      elevation: "48m above sea level",
      soilType: "Organic Loam Topsoil Layer",
      plantingEra: "1972–Present Reforestation",
    },
    defaultTilt: 1.5,
    desktopLeftPercent: 50,
    cordHangY: 34,
  },
  {
    id: "roots-strata",
    plate: "PLATE C",
    title: "Taproot Architecture",
    subtitle: "Subterranean Aquifer Anchors",
    src: "/illustrated/ch04-earth/print-roots-strata.webp",
    story:
      "Fibrous taproot systems fracturing hard laterite hardpan, capturing monsoon rain underground and anchoring the living forest against turbulent Bay of Bengal cyclonic winds.",
    detailedSpecs: {
      location: "Kottakarai Watershed Ridge",
      elevation: "55m above sea level",
      soilType: "Fractured Ironstone Hardpan",
      plantingEra: "Pioneer Acacia & Dodonaea Rooting",
    },
    defaultTilt: -1.4,
    desktopLeftPercent: 78,
    cordHangY: 22,
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
  // Normalize progress for Scene 04 (range: 0.72 - 1.00)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.72) / 0.28));

  // Focus modal state
  const [activePlate, setActivePlate] = useState<EarthPlate | null>(null);
  const [hoveredPlateId, setHoveredPlateId] = useState<string | null>(null);

  // Direct Interaction: Plant Seeds in Landscape Phase
  const [plantedSeeds, setPlantedSeeds] = useState<PlantedSeed[]>([]);
  const landscapeRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activePlate) {
        setActivePlate(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePlate]);

  if (!active && progress < 0.70) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY PHASES
  // 1. Entrance & Cord Draw (0.00 - 0.18): Linen cord draws, plates settle
  // 2. Suspended Exhibition (0.18 - 0.42): 3 plates hanging with organic sway
  // 3. Planar Transformation (0.42 - 0.68): Plate A expands forward, B & C drift away
  // 4. Living Red Earth Canvas (0.68 - 1.00): Full bleed landscape, interactive seed sowing
  // ---------------------------------------------------------------------------

  const entranceProgress = Math.min(1, Math.max(0, localProgress / 0.18));
  const cordDashOffset = Math.max(0, (1 - entranceProgress) * 1600);
  const cordOpacity = Math.min(1, localProgress / 0.12);

  const transformProgress = Math.min(1, Math.max(0, (localProgress - 0.40) / 0.26));
  const landscapeProgress = Math.min(1, Math.max(0, (localProgress - 0.64) / 0.36));

  // Secondary plates fade as Plate A expands
  const secondaryPlatesOpacity = Math.max(0, 1 - transformProgress * 2.2);

  const handleLandscapeClick = (e: MouseEvent<HTMLDivElement>) => {
    if (landscapeProgress < 0.2) return;
    if (!landscapeRef.current) return;
    const rect = landscapeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlantedSeeds((prev) => [...prev.slice(-15), { id: Date.now(), x, y }]);
  };

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-paper text-ink transition-opacity duration-300"
      style={{
        zIndex: 25,
        visibility: progress >= 0.72 ? "visible" : "hidden",
        pointerEvents: progress >= 0.73 ? "auto" : "none",
        opacity: Math.min(1, Math.max(0, (progress - 0.72) / 0.02)),
      }}
    >
      {/* Living Soil Strata & Geological Field */}
      <LivingContourField
        variant="earth-strata"
        scrollProgress={localProgress}
        opacity={0.4}
      />

      {/* =======================================================================
          SCENE HEADER & ARCHIVAL INDEX (Clean, non-colliding typography)
          ======================================================================= */}
      <div
        className="absolute top-20 md:top-24 left-6 md:left-12 z-10 pointer-events-none transition-all duration-300"
        style={{
          opacity: Math.max(0, 1 - transformProgress * 2.0) * Math.min(1, localProgress / 0.12),
        }}
      >
        <div className="flex items-center gap-2.5 text-terracotta text-[10px] font-mono uppercase tracking-widest font-semibold">
          <span>CHAPTER 04</span>
          <span className="text-border">·</span>
          <span className="text-ink-muted">THREE SUSPENDED ARCHIVAL PLATES</span>
        </div>
      </div>

      {/* =======================================================================
          SUSPENSION CORD (Spans across viewport with organic sag)
          ======================================================================= */}
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
          {/* Fine twisted twine secondary strand */}
          <path
            d="M -40 271 Q 720 331, 1480 276"
            stroke="#968875"
            strokeWidth="0.8"
            strokeDasharray="4 3"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* =======================================================================
          DESKTOP PRINT EXHIBITION (3 Suspended Archival Plates)
          ======================================================================= */}
      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none">
        {EARTH_PLATES.map((plate, index) => {
          const isRedEarth = plate.id === "red-earth";
          const isHovered = hoveredPlateId === plate.id;

          // Position under sagging linen cord
          const cordY = 270 + Math.sin((plate.desktopLeftPercent / 100) * Math.PI) * 45;

          // Secondary plates (Plates B and C)
          if (!isRedEarth) {
            const driftX = (index - 1) * 70 * transformProgress;
            const currentOpacity = secondaryPlatesOpacity * Math.min(1, entranceProgress * 1.5);
            if (currentOpacity <= 0.01) return null;

            return (
              <div
                key={plate.id}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${plate.title}`}
                className="absolute transition-all duration-300 ease-out pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
                style={{
                  left: `${plate.desktopLeftPercent}%`,
                  top: `${cordY}px`,
                  transform: `translate(-50%, ${isHovered ? "-8px" : "0px"}) translateX(${driftX}px) rotate(${
                    isHovered ? 0 : plate.defaultTilt
                  }deg)`,
                  opacity: currentOpacity,
                  width: "290px",
                }}
                onMouseEnter={() => setHoveredPlateId(plate.id)}
                onMouseLeave={() => setHoveredPlateId(null)}
                onClick={() => setActivePlate(plate)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActivePlate(plate);
                  }
                }}
              >
                {/* Wooden Peg */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30">
                  <WoodenPeg />
                </div>

                {/* Archival Paper Card */}
                <div
                  className={`bg-paper-light border border-border p-3 archival-shadow transition-all duration-300 rounded-xs ${
                    isHovered ? "shadow-2xl border-terracotta/70 -translate-y-1" : ""
                  }`}
                >
                  <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                    <Image
                      src={plate.src}
                      alt={plate.title}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-500 hover:scale-103"
                    />
                  </div>

                  <div className="pt-2.5 pb-0.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-wider text-terracotta font-semibold">
                      <span>{plate.plate}</span>
                      <span className="text-ink-muted">ARCHIVAL STUDY</span>
                    </div>
                    <div className="font-serif italic text-base text-ink font-light mt-0.5 leading-snug truncate">
                      {plate.title}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60 font-mono text-[7.5px] uppercase tracking-widest text-ink-muted">
                      <span>INSPECT PLATE</span>
                      <Maximize2 size={10} className="text-terracotta" />
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // -------------------------------------------------------------------
          // PLATE A (RED EARTH): Expands and seamlessly becomes the soil canvas
          // -------------------------------------------------------------------
          const redEarthOpacity =
            Math.max(0, 1 - landscapeProgress * 1.5) * Math.min(1, entranceProgress * 1.5);
          if (redEarthOpacity <= 0.01) return null;

          const targetCenterY = 440;
          const currentLeft = plate.desktopLeftPercent + (50 - plate.desktopLeftPercent) * transformProgress;
          const currentTop = cordY + (targetCenterY - cordY) * transformProgress;
          const currentScale = 1 + transformProgress * 1.8;
          const currentTilt =
            isHovered && transformProgress === 0 ? 0 : plate.defaultTilt * (1 - transformProgress);

          return (
            <div
              key={plate.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${plate.title}`}
              className="absolute transition-all duration-150 ease-out pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta"
              style={{
                left: `${currentLeft}%`,
                top: `${currentTop}px`,
                transform: `translate(-50%, ${isHovered && transformProgress === 0 ? "-8px" : "-50%"}) rotate(${currentTilt}deg) scale(${currentScale})`,
                opacity: redEarthOpacity,
                width: "290px",
                zIndex: transformProgress > 0 ? 35 : 20,
              }}
              onMouseEnter={() => setHoveredPlateId(plate.id)}
              onMouseLeave={() => setHoveredPlateId(null)}
              onClick={() => setActivePlate(plate)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActivePlate(plate);
                }
              }}
            >
              {/* Wooden Peg (fades out as plate detaches from cord) */}
              <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300"
                style={{ opacity: 1 - transformProgress * 2.5 }}
              >
                <WoodenPeg />
              </div>

              {/* Physical Print Card */}
              <div
                className={`bg-paper-light border transition-all duration-300 rounded-xs ${
                  transformProgress > 0.2
                    ? "p-0 border-transparent shadow-none"
                    : "border-border p-3 archival-shadow"
                } ${isHovered && transformProgress === 0 ? "shadow-2xl border-terracotta/70 -translate-y-1" : ""}`}
              >
                <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden">
                  <Image
                    src={plate.src}
                    alt={plate.title}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                </div>

                {transformProgress < 0.2 && (
                  <div className="pt-2.5 pb-0.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[8.5px] uppercase tracking-wider text-terracotta font-semibold">
                      <span>{plate.plate}</span>
                      <span className="text-ink-muted">ARCHIVAL STUDY</span>
                    </div>
                    <div className="font-serif italic text-base text-ink font-light mt-0.5 leading-snug truncate">
                      {plate.title}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60 font-mono text-[7.5px] uppercase tracking-widest text-ink-muted">
                      <span>INSPECT PLATE</span>
                      <Maximize2 size={10} className="text-terracotta" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =======================================================================
          MASTER RED EARTH LIVING CANVAS (Expands seamlessly when localProgress > 0.65)
          ======================================================================= */}
      {landscapeProgress > 0.02 && (
        <div
          ref={landscapeRef}
          onClick={handleLandscapeClick}
          className="absolute inset-0 w-full h-full z-40 transition-opacity duration-500 overflow-hidden"
          style={{
            opacity: landscapeProgress,
            pointerEvents: landscapeProgress > 0.25 ? "auto" : "none",
            cursor: "crosshair",
          }}
        >
          {/* Full High-Resolution Red Earth Landscape Artwork */}
          <Image
            src="/illustrated/ch04-earth/print-red-earth.webp"
            alt="The living red earth landscape of Auroville"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Sown Seeds & Branching Taproots Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
            {plantedSeeds.map((seed) => (
              <g key={seed.id} className="animate-fade-in">
                {/* Primary Taproot Fracturing Ironstone Hardpan */}
                <path
                  d={`M ${seed.x}% ${seed.y}% Q ${seed.x - 1.5}% ${seed.y + 4}%, ${seed.x - 0.5}% ${seed.y + 8}% T ${seed.x + 1.5}% ${seed.y + 14}%`}
                  stroke="#4E3524"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Secondary Lateral Root */}
                <path
                  d={`M ${seed.x}% ${seed.y}% Q ${seed.x + 2.5}% ${seed.y + 5}%, ${seed.x + 3.5}% ${seed.y + 10}%`}
                  stroke="#7A5233"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Sown Seed Cotyledon */}
                <circle cx={`${seed.x}%`} cy={`${seed.y}%`} r="3.5" fill="#B75E3F" />
                {/* Emerging Green Shoot */}
                <path
                  d={`M ${seed.x}% ${seed.y}% C ${seed.x - 1}% ${seed.y - 2}%, ${seed.x - 2.5}% ${seed.y - 4}%, ${seed.x - 1.5}% ${seed.y - 7}%`}
                  stroke="#3E5C46"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx={`${seed.x - 1.5}%`} cy={`${seed.y - 7}%`} r="2.2" fill="#527D5E" />
              </g>
            ))}
          </svg>

          {/* Bottom Root Corridor & Navigation Bar */}
          <div
            className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-20 flex items-end justify-between px-6 md:px-12 pb-5 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent transition-opacity duration-500"
            style={{ opacity: landscapeProgress }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-terracotta text-paper-light flex items-center justify-center">
                <Sprout size={16} />
              </div>
              <div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-paper-light/90 font-semibold">
                  TAP RED EARTH TO SOW · {plantedSeeds.length} PLANTED
                </div>
                <div className="font-serif italic text-lg md:text-xl text-paper-light font-light">
                  The Living Sanctuary Awakens
                </div>
              </div>
            </div>

            {/* Return to Beginning Control */}
            <div className="pointer-events-auto flex items-center gap-3">
              {onNavigateStart && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateStart();
                  }}
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-paper-light/95 backdrop-blur-md border border-border hover:border-ink font-mono text-[9.5px] uppercase tracking-wider text-ink transition-colors archival-shadow rounded-xs"
                >
                  <RotateCcw size={11} className="text-terracotta" />
                  <span>RETURN TO COVER</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MOBILE RESPONSIVE GALLERY (Clean horizontal swipe list)
          ======================================================================= */}
      <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end pb-12 px-6 pointer-events-auto">
        <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-2 flex items-center justify-between">
          <span>ARCHIVAL PLATES</span>
          <span className="text-terracotta">SWIPE TO EXPLORE →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory">
          {EARTH_PLATES.map((plate) => (
            <div
              key={plate.id}
              onClick={() => setActivePlate(plate)}
              className="min-w-[240px] max-w-[260px] snap-center bg-paper-light border border-border p-3 archival-shadow shrink-0 cursor-pointer rounded-xs"
            >
              <div className="relative w-full aspect-[4/3] bg-paper-dark overflow-hidden mb-2">
                <Image
                  src={plate.src}
                  alt={plate.title}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <div className="font-mono text-[8.5px] text-terracotta uppercase font-semibold">
                {plate.plate}
              </div>
              <div className="font-serif italic text-base text-ink font-light leading-snug truncate">
                {plate.title}
              </div>
              <div className="mt-2 pt-1.5 border-t border-border/60 flex items-center justify-between font-mono text-[7.5px] text-ink-muted uppercase">
                <span>INSPECT PLATE</span>
                <Maximize2 size={10} className="text-terracotta" />
              </div>
            </div>
          ))}
        </div>

        {onNavigateStart && (
          <button
            onClick={onNavigateStart}
            className="mt-3 w-full py-2 bg-paper-light border border-border text-ink font-mono text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs"
          >
            <RotateCcw size={11} className="text-terracotta" />
            <span>RETURN TO COVER</span>
          </button>
        )}
      </div>

      {/* =======================================================================
          ACCESSIBLE PLATE INSPECTION MODAL (High-Resolution View)
          ======================================================================= */}
      {activePlate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePlate.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-ink/80 backdrop-blur-md animate-fade-in pointer-events-auto"
          onClick={() => setActivePlate(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] bg-paper-light border border-border archival-shadow flex flex-col md:flex-row overflow-hidden rounded-xs"
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePlate(null)}
              aria-label="Close plate inspection"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-paper/90 border border-border text-ink hover:text-terracotta transition-colors flex items-center justify-center"
            >
              <X size={15} />
            </button>

            {/* Illustration Viewport */}
            <div className="relative w-full md:w-3/5 h-64 md:h-auto min-h-[280px] md:min-h-[440px] bg-paper-dark">
              <Image
                src={activePlate.src}
                alt={activePlate.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Archival Information Panel */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-paper-light">
              <div>
                <div className="flex items-center gap-2 text-terracotta text-[10px] uppercase tracking-widest font-mono pb-2 border-b border-border font-semibold">
                  <span>{activePlate.plate}</span>
                  <span className="text-border">·</span>
                  <span className="text-ink-muted">ARCHIVAL EXHIBIT</span>
                </div>

                <h3 className="font-serif italic text-2xl md:text-3xl text-ink font-light mt-3 tracking-tight">
                  {activePlate.title}
                </h3>
                <div className="text-ink-muted font-mono text-[9.5px] uppercase tracking-wider mt-0.5">
                  {activePlate.subtitle}
                </div>

                <p className="mt-3.5 font-sans text-xs text-ink/90 leading-relaxed font-light">
                  {activePlate.story}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border space-y-1.5 text-[9.5px] font-mono text-ink-muted">
                <div className="flex justify-between">
                  <span>LOCATION:</span>
                  <span className="text-ink">{activePlate.detailedSpecs.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>ELEVATION:</span>
                  <span className="text-ink">{activePlate.detailedSpecs.elevation}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOIL PROFILE:</span>
                  <span className="text-ink">{activePlate.detailedSpecs.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span>PLANTING ERA:</span>
                  <span className="text-ink">{activePlate.detailedSpecs.plantingEra}</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setActivePlate(null)}
                    className="w-full py-2 text-[9.5px] font-mono uppercase tracking-widest text-ink hover:text-paper-light bg-paper hover:bg-ink border border-border transition-colors text-center rounded-xs"
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

// Bespoke Hand-Crafted Wooden Peg Graphic
function WoodenPeg() {
  return (
    <svg className="w-4 h-6 drop-shadow-sm" viewBox="0 0 16 24" fill="none">
      <rect
        x="4"
        y="0"
        width="8"
        height="18"
        rx="1"
        fill="#C49A6C"
        stroke="#8A6540"
        strokeWidth="0.8"
      />
      <line x1="6.5" y1="2" x2="6.5" y2="16" stroke="#A87F53" strokeWidth="0.6" />
      <rect
        x="2.5"
        y="8"
        width="11"
        height="3"
        rx="0.8"
        fill="#5E5A54"
        stroke="#3B3834"
        strokeWidth="0.6"
      />
      <line x1="4" y1="18" x2="12" y2="18" stroke="#5A3E25" strokeWidth="1.2" />
    </svg>
  );
}
