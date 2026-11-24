"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import PaperFold from "@/components/interactions/PaperFold";
import StoryPath from "@/components/interactions/StoryPath";
import LivingContourField from "@/components/experience/LivingContourField";
import { X } from "lucide-react";

interface Chapter02PageOpensProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter02PageOpens({
  progress,
  active,
}: Chapter02PageOpensProps) {
  // Normalize progress for Scene 02 (0.22 to 0.45)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.22) / 0.23));

  // Interactive discoveries (triggered directly on illustrated subjects, zero marker dots)
  const [activeDiscovery, setActiveDiscovery] = useState<"dome" | "botanical" | null>(null);
  const [isHoveringTrail, setIsHoveringTrail] = useState(false);
  const [isHoveringFoliage, setIsHoveringFoliage] = useState(false);
  const [isHoveringDome, setIsHoveringDome] = useState(false);

  // Pointer tracking for multi-layer organic parallax
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
      pointerRef.current = {
        x: nx * 6,
        y: ny * 4,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
    const animate = () => {
      setPointerOffset((prev) => ({
        x: lerp(prev.x, pointerRef.current.x, 0.08),
        y: lerp(prev.y, pointerRef.current.y, 0.08),
      }));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!active && (progress < 0.20 || progress > 0.48)) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY (Strictly matching V5 specification)
  // 0% – 15%: Illustrated page edge opens; landscape appears immediately.
  // 15% – 35%: Full landscape composition established; layered pointer movement active.
  // 35% – 60%: Red-earth path & delicate hatching progress with scroll.
  // 60% – 80%: Botanical & architectural discoveries become accessible.
  // 80% – 100%: Landscape contours guide transition toward Chapter 03 architecture.
  // ---------------------------------------------------------------------------

  const foldOpenProgress = Math.min(1, Math.max(0, localProgress / 0.25));
  const statementEnter = Math.min(1, Math.max(0, (localProgress - 0.12) / 0.20));
  const statementExit = Math.min(1, Math.max(0, (localProgress - 0.75) / 0.20));
  const statementOpacity = statementEnter * (1 - statementExit);

  // Multi-layer parallax offsets (< 6px to maintain architectural grounding)
  const fgParallaxX = pointerOffset.x * 1.0;
  const fgParallaxY = pointerOffset.y * 0.8;
  const midParallaxX = pointerOffset.x * 0.4;
  const midParallaxY = pointerOffset.y * 0.3;

  // Handoff to Scene 03: the red earth path and horizon guide into Chapter 03's baseline
  const handoffProgress = Math.min(1, Math.max(0, (localProgress - 0.82) / 0.18));

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      style={{
        zIndex: 15,
        visibility: progress >= 0.20 && progress <= 0.48 ? "visible" : "hidden",
      }}
    >
      {/* REFINED PAPER FOLD MECHANISM: Narrow paper-edge peel; landscape is visible immediately underneath */}
      <PaperFold scrollProgress={foldOpenProgress} className="w-full h-full pointer-events-auto">
        {/* 21ST MCP LIVING CONTOUR FIELD (Subtle Topographic Drafting Contours) */}
        <LivingContourField
          variant="landscape-topography"
          active={active}
          scrollProgress={localProgress}
          density={0.5}
          opacity={0.25}
        />

        {/* THE HIGH-RESOLUTION ILLUSTRATED PANORAMA STAGE */}
        <div
          className="relative w-full h-full overflow-hidden cursor-default"
          onPointerMove={(e) => {
            const relativeY = e.clientY / window.innerHeight;
            setIsHoveringTrail(relativeY > 0.45 && relativeY < 0.85);
          }}
          onPointerLeave={() => {
            setIsHoveringTrail(false);
            setIsHoveringFoliage(false);
            setIsHoveringDome(false);
          }}
        >
          {/* LAYER 01 & 02: Sky, Distant Horizon, and Middle-Ground Forest Canopy */}
          <div
            className="hidden sm:block absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
            style={{
              transform: `translate(${midParallaxX}px, ${midParallaxY}px) scale(${1.02 - localProgress * 0.02})`,
            }}
          >
            <Image
              src="/illustrated/ch02-page/panorama-master.webp"
              alt="Hand-drawn panorama of Auroville red-earth landscape and Matrimandir"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 50%" }}
              priority
            />
          </div>

          {/* Composed Vertical Panorama for Mobile Viewports */}
          <div className="block sm:hidden absolute inset-0 w-full h-full">
            <Image
              src="/illustrated/ch02-page/panorama-mobile.webp"
              alt="Hand-drawn vertical panorama composed for mobile screens"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
            />
          </div>

          {/* LAYER 03: FOREGROUND BOTANICAL PARALLAX LAYER
              Branches lean 3–6px; responds organically to pointer proximity */}
          <div
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${fgParallaxX + (isHoveringFoliage ? 3 : 0)}px, ${
                fgParallaxY + (isHoveringFoliage ? -2 : 0)
              }px) scale(1.02)`,
              opacity: 0.96,
            }}
          >
            <Image
              src="/illustrated/ch02-page/panorama-botanical-fg.webp"
              alt="Foreground botanical branch and tropical dry evergreen foliage"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 50%" }}
              priority
            />
          </div>

          {/* LAYER 04: WINDING RED-EARTH PATH CONTOUR
              Delicate hand-drawn pencil hatching; zero decorative CAD vector arcs */}
          <div
            className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
              isHoveringTrail ? "opacity-100" : "opacity-75"
            }`}
          >
            <StoryPath
              progress={Math.min(1, Math.max(0, (localProgress - 0.15) / 0.65))}
              variant="terrain-trail"
            />
          </div>

          {/* ===================================================================
              INTERACTIVE SUBJECT DISCOVERY ZONES (Zero permanent marker dots)
              Direct hover on the illustrated subjects themselves
              =================================================================== */}

          {/* Subject 1: The Matrimandir Dome (Interactive Subject Area) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Inspect Matrimandir Geodesic Dome"
            onMouseEnter={() => setIsHoveringDome(true)}
            onMouseLeave={() => setIsHoveringDome(false)}
            onClick={() => setActiveDiscovery(activeDiscovery === "dome" ? null : "dome")}
            className="absolute top-[20%] right-[22%] md:right-[26%] w-[18vw] max-w-[260px] aspect-square rounded-full cursor-pointer z-20 focus:outline-none"
          >
            {/* Subtle editorial annotation emerging beside dome on hover (Zero permanent hotspot dots/rings) */}
            {isHoveringDome && activeDiscovery !== "dome" && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-paper-light/95 border border-border px-2.5 py-1 text-[9px] font-mono tracking-widest text-ink uppercase rounded-xs archival-shadow-subtle pointer-events-none transition-opacity duration-200">
                Matrimandir · Click to inspect
              </div>
            )}
          </div>

          {/* Subject 2: Foreground Botanical Leaves (Interactive Foliage Area) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Inspect Indigenous Forest Foliage"
            onMouseEnter={() => setIsHoveringFoliage(true)}
            onMouseLeave={() => setIsHoveringFoliage(false)}
            onClick={() => setActiveDiscovery(activeDiscovery === "botanical" ? null : "botanical")}
            className="absolute bottom-[10%] left-[2%] w-[22vw] max-w-[280px] h-[35vh] cursor-pointer z-20 focus:outline-none"
          />

          {/* INTEGRATED DISCOVERY ANNOTATIONS (Natural graphite sketches, zero generic cards) */}
          {activeDiscovery === "dome" && (
            <div
              role="dialog"
              aria-modal="true"
              className="absolute z-40 top-24 right-8 md:right-16 max-w-xs bg-paper-light/95 backdrop-blur-md border border-border archival-shadow p-5 animate-fade-in rounded-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/80">
                <span className="font-mono text-[9px] uppercase tracking-widest text-terracotta font-semibold">
                  PEACE AREA · 36M SPHERE
                </span>
                <button
                  onClick={() => setActiveDiscovery(null)}
                  aria-label="Close discovery"
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              <h4 className="font-serif italic text-xl text-ink font-light mt-2.5">
                The Geodesic Sphere
              </h4>
              <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
                Crowned with 1,415 hand-gilded concave discs, cradled within twelve petal gardens.
              </p>
            </div>
          )}

          {activeDiscovery === "botanical" && (
            <div
              role="dialog"
              aria-modal="true"
              className="absolute z-40 bottom-24 left-8 md:left-16 max-w-xs bg-paper-light/95 backdrop-blur-md border border-border archival-shadow p-5 animate-fade-in rounded-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/80">
                <span className="font-mono text-[9px] uppercase tracking-widest text-forest font-semibold">
                  INDIGENOUS FOLIAGE
                </span>
                <button
                  onClick={() => setActiveDiscovery(null)}
                  aria-label="Close discovery"
                  className="p-1 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>

              <h4 className="font-serif italic text-xl text-ink font-light mt-2.5">
                Tropical Dry Evergreen
              </h4>
              <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
                Indigenous acacia, dodonaea, and palmyra canopy restoring moisture and microclimate across the red plateau.
              </p>
            </div>
          )}

          {/* QUIET INTEGRATED EDITORIAL STATEMENT (Pinned in margin, zero blocking boxes) */}
          <div
            className="absolute z-20 left-6 md:left-12 bottom-6 md:bottom-8 max-w-lg pointer-events-none transition-opacity duration-300"
            style={{
              opacity: activeDiscovery ? 0 : statementOpacity,
              transform: `translateY(${(1 - statementEnter) * 12}px)`,
            }}
          >
            <div
              className="px-4 py-2.5 border border-[#DFD9CC] rounded-xs archival-shadow-subtle inline-block"
              style={{ backgroundColor: "rgba(252, 250, 246, 0.96)" }}
            >
              <p className="font-serif italic text-sm md:text-base text-ink font-light leading-snug">
                Red laterite paths cut through three million hand-planted trees, leading to the golden sphere.
              </p>
            </div>
          </div>

          {/* ===================================================================
              HANDOFF TO CHAPTER 03: The red road straightens into architectural lines
              Zero white-out fade; shared linework guides into unbuilt elevation
              =================================================================== */}
          {handoffProgress > 0 && (
            <div
              className="absolute inset-0 bg-paper transition-opacity duration-300 pointer-events-none z-30"
              style={{ opacity: handoffProgress }}
            >
              <svg viewBox="0 0 1000 300" className="w-full h-full" fill="none">
                <path
                  d="M 120 280 C 400 240, 600 200, 900 150"
                  stroke="#5B5751"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity={handoffProgress}
                />
              </svg>
            </div>
          )}
        </div>
      </PaperFold>
    </div>
  );
}
