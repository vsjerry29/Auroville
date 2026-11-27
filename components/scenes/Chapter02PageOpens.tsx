"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import LivingContourField from "@/components/experience/LivingContourField";
import { IconAction, InlineLabel } from "@/components/ui/EditorialControls";
import { X } from "lucide-react";

interface Chapter02PageOpensProps {
  progress: number; // Global scroll progress 0.0 - 1.0
  active: boolean;
}

export default function Chapter02PageOpens({
  progress,
  active,
}: Chapter02PageOpensProps) {
  // Normalize progress for Scene 02 (0.20 to 0.48, total range 0.28)
  const localProgress = Math.min(1, Math.max(0, (progress - 0.20) / 0.26));

  // Interactive discoveries (triggered directly on illustrated subjects, zero marker dots)
  const [activeDiscovery, setActiveDiscovery] = useState<"dome" | "lotus" | "canopy" | null>(null);
  const [isHoveringDome, setIsHoveringDome] = useState(false);
  const [isHoveringLotus, setIsHoveringLotus] = useState(false);
  const [isHoveringCanopy, setIsHoveringCanopy] = useState(false);

  // Pointer tracking for multi-layer organic parallax
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1; // -1 to 1
      pointerRef.current = {
        x: nx * 5,
        y: ny * 3,
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

  if (!active && (progress < 0.17 || progress > 0.49)) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // SCROLL CHOREOGRAPHY (Strictly preserving approved CH02 sketch -> color -> photo sequence)
  //
  // Stage 4 handoff (0.205): Chapter 01 has scaled to S = 1.00 and revealed 100% of
  // 01-sketch-aligned.jpg. Chapter 02 takes over cleanly with zero crossfade/cut!
  // Phase A (0.00 – 0.20 local): Expanded black-and-white detailed architectural illustration
  // Phase B (0.16 – 0.36 local): Watercolor wash smoothly glazes into colored illustration
  // Phase C (0.36 – 0.74 local): Radial photograph reveal from dome center (50% 52.1%)
  // Phase D (0.74 – 0.90 local): Full photographic hold in stable, beautifully framed composition
  // ---------------------------------------------------------------------------

  // Clean zero-crossfade handoff once Chapter 01 finishes expanding into exact CH02 start frame (0.205)
  const isHandoffReady = progress >= 0.205;
  const sceneOpacity = isHandoffReady ? 1 : 0;

  // Gentle ramp-in after 0.205 so auxiliary UI/parallax never pop at handoff boundary
  const ch02PostHandoffRamp = Math.min(1, Math.max(0, (progress - 0.205) / 0.03));

  // Phase B: Watercolor wash opacity over pencil sketch
  const colorWashOpacity = Math.min(1, Math.max(0, (localProgress - 0.16) / 0.20));

  // Phase C: Photo mask radius calculation (radial expansion from dome center 50% 52.1%)
  const transformPhase = Math.min(1, Math.max(0, (localProgress - 0.36) / 0.38));
  
  // Curved ease for natural expanding sunlight wave
  const curvedT = Math.pow(transformPhase, 1.25);
  const maskRadius = transformPhase > 0 ? curvedT * 140 : 0;
  const maskFeather = 16;

  // Linework overlay opacity: prominent during Phase C transformation, dissolving cleanly into reality
  const lineworkOpacity = transformPhase > 0.02 && transformPhase < 0.82
    ? Math.sin(transformPhase * Math.PI) * 0.32
    : 0;

  // Statement caption enter & exit (ramps gently after 0.205 handoff)
  const isPhotographicHold = localProgress >= 0.74;
  const statementEnter = Math.min(1, Math.max(0, (progress - 0.205) / 0.012));
  const statementExit = Math.min(1, Math.max(0, (localProgress - 0.90) / 0.10));
  const statementOpacity = statementEnter * (1 - statementExit);

  // Handoff to Scene 03
  const handoffProgress = Math.min(1, Math.max(0, (localProgress - 0.88) / 0.12));

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none bg-paper ${
        isHandoffReady ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        zIndex: 15,
        opacity: sceneOpacity,
        visibility: isHandoffReady && progress <= 0.49 ? "visible" : "hidden",
      }}
    >
      {/* 21ST MCP LIVING CONTOUR FIELD (Subtle Topographic Drafting in Early Phases) */}
      {transformPhase < 0.8 && (
        <LivingContourField
          variant="landscape-topography"
          active={active && isHandoffReady}
          scrollProgress={localProgress}
          density={0.45}
          opacity={0.25 * ch02PostHandoffRamp * (1 - transformPhase)}
        />
      )}

      {/* =====================================================================
          MASTER ALIGNED COMPOSITION WRAPPER
          All three layers share the exact same container, position, and pointer physics
          ensuring 100% pixel-perfect congruence across viewports with zero ghosting.
          Pointer parallax ramps cleanly from 0 after handoff so scale=1 frame matches 1:1.
          ===================================================================== */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate(${pointerOffset.x * 0.25 * ch02PostHandoffRamp}px, ${
            pointerOffset.y * 0.2 * ch02PostHandoffRamp
          }px)`,
        }}
      >
        {/* LAYER 01: ARCHITECTURAL PENCIL SKETCH (Warm ivory drafting paper + graphite linework) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/matrimandir-sequence/01-sketch-aligned.jpg"
            alt="Master architectural pencil sketch and drafting study of the Matrimandir in Auroville"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* LAYER 02: COLORED WATERCOLOR ILLUSTRATION (Washes into place over sketch) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ opacity: colorWashOpacity }}
        >
          <Image
            src="/matrimandir-sequence/02-color-aligned.jpg"
            alt="Master architectural hand-drawn watercolor illustration of the Matrimandir in Auroville"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* LAYER 03: REAL PHOTOGRAPH (Sunlit reality revealed via radial expansion from dome center) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: transformPhase > 0 ? 1 : 0,
            WebkitMaskImage:
              transformPhase >= 1
                ? "none"
                : transformPhase > 0
                ? `radial-gradient(circle at 50% 52.1%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${maskRadius}%, rgba(0,0,0,0) ${
                    maskRadius + maskFeather
                  }%)`
                : "none",
            maskImage:
              transformPhase >= 1
                ? "none"
                : transformPhase > 0
                ? `radial-gradient(circle at 50% 52.1%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${maskRadius}%, rgba(0,0,0,0) ${
                    maskRadius + maskFeather
                  }%)`
                : "none",
          }}
        >
          <Image
            src="/matrimandir-sequence/03-photo-aligned.jpg"
            alt="The real Matrimandir in sunlit architectural photography, Auroville"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* LAYER 04: ARCHITECTURAL LINEWORK OVERLAY (Tactile ink lines during transformation) */}
        {lineworkOpacity > 0.01 && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              opacity: lineworkOpacity,
              mixBlendMode: "multiply",
            }}
          >
            <Image
              src="/matrimandir-sequence/01-sketch-aligned.jpg"
              alt="Architectural linework overlay"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
          </div>
        )}
      </div>

      {/* =====================================================================
          LAYER 04: STORY LINE / GUIDING BASELINE FROM CHAPTER 01
          Unrolls from the lower margin toward the central marble lotus petals.
          ===================================================================== */}
      {transformPhase < 0.6 && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
          <svg viewBox="0 0 1000 600" className="w-full h-full" fill="none">
            <path
              d="M 500 600 C 500 560, 505 520, 505 480"
              stroke="#5A422D"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              opacity={Math.min(0.6, (1 - localProgress) * 0.8) * ch02PostHandoffRamp}
            />
          </svg>
        </div>
      )}

      {/* =====================================================================
          INTERACTIVE SUBJECT DISCOVERY ZONES (Natural Artwork Hit Targets)
          Zero permanent hotspot dots or target rings.
          ===================================================================== */}

      {/* 1. Matrimandir Golden Dome Target */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Inspect Matrimandir Geodesic Dome"
        onMouseEnter={() => setIsHoveringDome(true)}
        onMouseLeave={() => setIsHoveringDome(false)}
        onClick={() => setActiveDiscovery(activeDiscovery === "dome" ? null : "dome")}
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[38vw] max-w-[520px] aspect-square rounded-full cursor-pointer z-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
      >
        {isHoveringDome && activeDiscovery !== "dome" && (
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 whitespace-nowrap bg-paper/85 backdrop-blur-[2px] px-2.5 py-0.5 pointer-events-none transition-opacity duration-200">
            <InlineLabel accent="gold">The Geodesic Sphere · 1,415 Gilded Discs</InlineLabel>
          </div>
        )}
      </div>

      {/* 2. Marble Lotus Amphitheater Target */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Inspect White Marble Lotus Plaza"
        onMouseEnter={() => setIsHoveringLotus(true)}
        onMouseLeave={() => setIsHoveringLotus(false)}
        onClick={() => setActiveDiscovery(activeDiscovery === "lotus" ? null : "lotus")}
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[28vw] max-w-[380px] h-[12vh] cursor-pointer z-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
      >
        {isHoveringLotus && activeDiscovery !== "lotus" && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-paper/85 backdrop-blur-[2px] px-2.5 py-0.5 pointer-events-none transition-opacity duration-200">
            <InlineLabel accent="terracotta">Lotus Amphitheater · Marble Floor</InlineLabel>
          </div>
        )}
      </div>

      {/* 3. Framing Tree Canopy Target */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Inspect Framing Forest Canopy"
        onMouseEnter={() => setIsHoveringCanopy(true)}
        onMouseLeave={() => setIsHoveringCanopy(false)}
        onClick={() => setActiveDiscovery(activeDiscovery === "canopy" ? null : "canopy")}
        className="absolute top-0 left-0 w-[28vw] max-w-[360px] h-[28vh] cursor-pointer z-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta"
      >
        {isHoveringCanopy && activeDiscovery !== "canopy" && (
          <div className="absolute bottom-2 left-12 whitespace-nowrap bg-paper/85 backdrop-blur-[2px] px-2.5 py-0.5 pointer-events-none transition-opacity duration-200">
            <InlineLabel accent="forest">Indigenous Canopy · Ficus &amp; Neem</InlineLabel>
          </div>
        )}
      </div>

      {/* =====================================================================
          INTEGRATED DISCOVERY DIALOGS (Restrained Archival Marginalia Notes)
          ===================================================================== */}
      {activeDiscovery === "dome" && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute z-40 top-20 right-8 md:right-16 max-w-xs bg-paper-light/95 backdrop-blur-md border border-border p-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <InlineLabel accent="gold">Peace Area · 36m Sphere</InlineLabel>
            <IconAction onClick={() => setActiveDiscovery(null)} ariaLabel="Close discovery">
              <X size={14} />
            </IconAction>
          </div>
          <h4 className="font-serif italic text-xl text-ink font-light mt-2.5">
            The Geodesic Sphere
          </h4>
          <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
            Clad in 1,415 hand-gilded concave discs, supported by four giant concrete pillars over the inner chamber.
          </p>
        </div>
      )}

      {activeDiscovery === "lotus" && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute z-40 bottom-24 right-8 md:right-16 max-w-xs bg-paper-light/95 backdrop-blur-md border border-border p-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <InlineLabel accent="terracotta">Amphitheater Plaza</InlineLabel>
            <IconAction onClick={() => setActiveDiscovery(null)} ariaLabel="Close discovery">
              <X size={14} />
            </IconAction>
          </div>
          <h4 className="font-serif italic text-xl text-ink font-light mt-2.5">
            White Marble Lotus
          </h4>
          <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
            Conceived as a gathering space of quietude, red sandstone ramps radiate from the central marble lotus flower.
          </p>
        </div>
      )}

      {activeDiscovery === "canopy" && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute z-40 top-24 left-8 md:left-16 max-w-xs bg-paper-light/95 backdrop-blur-md border border-border p-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <InlineLabel accent="forest">Ecological Regeneration</InlineLabel>
            <IconAction onClick={() => setActiveDiscovery(null)} ariaLabel="Close discovery">
              <X size={14} />
            </IconAction>
          </div>
          <h4 className="font-serif italic text-xl text-ink font-light mt-2.5">
            The Green Belt
          </h4>
          <p className="font-sans text-xs text-ink-muted mt-1 leading-relaxed font-light">
            More than three million trees planted by hand since 1968, transforming bare red earth into a thriving tropical dry evergreen sanctuary.
          </p>
        </div>
      )}

      {/* =====================================================================
          QUIET EDITORIAL STATEMENT (Unboxed Paper Underlay, Zero Card Chrome)
          ===================================================================== */}
      <div
        className="absolute z-30 left-6 md:left-12 bottom-6 md:bottom-8 max-w-lg pointer-events-none transition-all duration-500"
        style={{
          opacity: activeDiscovery ? 0 : statementOpacity,
          transform: `translateY(${(1 - statementEnter) * 10}px)`,
        }}
      >
        <div className="border-l border-terracotta/55 pl-3.5 py-1 bg-paper/92 backdrop-blur-[2px] inline-block">
          {isPhotographicHold ? (
            <div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-gold-dark font-semibold mb-0.5">
                MATRIMANDIR · 1971–2008 · PEACE AREA
              </div>
              <p className="font-serif italic text-sm md:text-base text-ink font-light leading-snug">
                The golden sphere in sunlit reality—the architectural soul and silent center of Auroville.
              </p>
            </div>
          ) : localProgress < 0.28 ? (
            <div>
              <div className="font-mono text-[8px] uppercase tracking-widest text-ink-muted font-semibold mb-0.5">
                MATRIMANDIR · ELEVATION STUDY · 36M SPHERE
              </div>
              <p className="font-serif italic text-sm md:text-base text-ink font-light leading-snug">
                Hand-drafted architectural study of the golden sphere rising above the red sandstone amphitheater.
              </p>
            </div>
          ) : (
            <p className="font-serif italic text-sm md:text-base text-ink font-light leading-snug">
              Red sandstone ramps converge upon the golden sphere, rising above the twelve-petal amphitheater.
            </p>
          )}
        </div>
      </div>

      {/* =====================================================================
          HANDOFF TO CHAPTER 03: Architectural guide lines emerge for transition
          ===================================================================== */}
      {handoffProgress > 0 && (
        <div
          className="absolute inset-0 bg-paper transition-opacity duration-300 pointer-events-none z-35"
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
  );
}
