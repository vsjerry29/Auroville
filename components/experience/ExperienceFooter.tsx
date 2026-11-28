"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EditorialAction } from "@/components/ui/EditorialControls";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExperienceFooterProps {
  onBackToBeginning: () => void;
}

export default function ExperienceFooter({
  onBackToBeginning,
}: ExperienceFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const handoffRouteRef = useRef<SVGPathElement>(null);
  const handoffGroupRef = useRef<SVGSVGElement>(null);
  const distantLayerRef = useRef<HTMLDivElement>(null);
  const terrainLayerRef = useRef<HTMLDivElement>(null);
  const banyanLayerRef = useRef<HTMLDivElement>(null);
  const rightFoliageLayerRef = useRef<HTMLDivElement>(null);
  const wordmarkRevealRef = useRef<HTMLDivElement>(null);
  const supportingRowRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const [leafShift, setLeafShift] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion || e.pointerType === "touch") return;
      const el = footerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setLeafShift({ x: nx, y: ny });
    },
    [prefersReducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setLeafShift({ x: 0, y: 0 });
  }, []);

  // ===========================================================================
  // 5-STAGE SCROLL-LED LAYERED ILLUSTRATED FOOTER (GSAP ScrollTrigger)
  //   00–20% Handoff:    Atlas route extends cleanly onto base warm ivory canvas
  //   20–40% Distance:   Layer B (distant treeline horizon) emerges with subtle lift
  //   40–60% Earth:      Layer C (terracotta soil & winding path) rises via mask
  //   60–80% Foreground: Layer D (left banyan roots/canopy & right foliage) settle
  //   80–100% Wordmark:  Plain bold AUROVILLE HTML wordmark + controls unveil cleanly
  // ===========================================================================
  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const applyFinalStatic = () => {
        if (handoffGroupRef.current) gsap.set(handoffGroupRef.current, { opacity: 0 });
        if (distantLayerRef.current) {
          gsap.set(distantLayerRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 0.9,
          });
        }
        if (terrainLayerRef.current) {
          gsap.set(terrainLayerRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
          });
        }
        if (banyanLayerRef.current) {
          gsap.set(banyanLayerRef.current, { x: 0, y: 0, opacity: 1 });
        }
        if (rightFoliageLayerRef.current) {
          gsap.set(rightFoliageLayerRef.current, { x: 0, y: 0, opacity: 1 });
        }
        if (wordmarkRevealRef.current) {
          gsap.set(wordmarkRevealRef.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
          });
        }
        if (supportingRowRef.current) {
          gsap.set(supportingRowRef.current, { y: 0, opacity: 1 });
        }
      };

      if (prefersReducedMotion) {
        applyFinalStatic();
        return;
      }

      const buildScrollSequence = (isMobile: boolean) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerEl,
            start: isMobile ? "top 92%" : "top 95%",
            end: isMobile ? "bottom bottom" : "bottom 99%",
            scrub: 0.25,
            refreshPriority: -1,
            invalidateOnRefresh: true,
          },
        });

        // Stage 01 (0–20%): Incoming Atlas route trace appears smoothly along horizon axis
        if (handoffRouteRef.current) {
          const len = handoffRouteRef.current.getTotalLength() || 520;
          tl.fromTo(
            handoffRouteRef.current,
            { strokeDasharray: len + 4, strokeDashoffset: len + 4, opacity: 0.72 },
            { strokeDashoffset: 0, duration: 0.2, ease: "none" },
            0
          );
        }

        // Stage 02 (20–40%): Layer B Distant forest & horizon emerge calmly behind foreground
        if (distantLayerRef.current) {
          tl.fromTo(
            distantLayerRef.current,
            {
              clipPath: "inset(22% 0% 0% 0%)",
              y: isMobile ? 12 : 24,
              opacity: 0,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 0.92,
              duration: 0.24,
              ease: "power1.out",
            },
            0.18
          );
        }

        // Stage 03 (40–60%): Layer C Middle terracotta soil & red-earth path rise from below
        if (terrainLayerRef.current) {
          tl.fromTo(
            terrainLayerRef.current,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              y: isMobile ? 16 : 36,
              opacity: 0.15,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              opacity: 1,
              duration: 0.24,
              ease: "power2.out",
            },
            0.38
          );
        }

        // Blend out initial SVG handoff stroke once terrain road takes over cleanly
        if (handoffGroupRef.current) {
          tl.fromTo(
            handoffGroupRef.current,
            { opacity: 1 },
            { opacity: 0, duration: 0.14, ease: "sine.out" },
            0.48
          );
        }

        // Stage 04 (60–80%): Layer D Foreground banyan trunk/roots & right foliage settle at distinct depth speeds
        if (banyanLayerRef.current) {
          tl.fromTo(
            banyanLayerRef.current,
            {
              x: isMobile ? -8 : -22,
              y: isMobile ? 18 : 48,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.25,
              ease: "power2.out",
            },
            0.58
          );
        }

        if (rightFoliageLayerRef.current) {
          tl.fromTo(
            rightFoliageLayerRef.current,
            {
              x: isMobile ? 8 : 18,
              y: isMobile ? 12 : 34,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.24,
              ease: "power2.out",
            },
            0.62
          );
        }

        // Stage 05 (80–100%): Layer E Pure HTML AUROVILLE wordmark unveils cleanly in sky clearing + controls settle
        if (wordmarkRevealRef.current) {
          tl.fromTo(
            wordmarkRevealRef.current,
            {
              clipPath: "inset(100% 0% 0% 0%)",
              y: isMobile ? 16 : 26,
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              y: 0,
              duration: 0.24,
              ease: "power3.out",
            },
            0.76
          );
        }

        if (supportingRowRef.current) {
          tl.fromTo(
            supportingRowRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
            0.82
          );
        }
      };

      mm.add("(max-width: 767px)", () => buildScrollSequence(true));
      mm.add("(min-width: 768px)", () => buildScrollSequence(false));
    }, footerRef);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={footerRef}
      id="atlas-epilogue"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Auroville Illustrated Closing Footer"
      className="relative w-full min-h-[100svh] md:min-h-[100dvh] md:h-[100dvh] md:max-h-[980px] overflow-hidden bg-paper text-ink border-t border-border/55 flex flex-col justify-between"
    >
      {/* =====================================================================
          STAGE 01: ATLAS PATHWAY HANDOFF STROKE (connects Atlas directly to Footer Road)
          ===================================================================== */}
      <svg
        ref={handoffGroupRef}
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
        aria-hidden="true"
      >
        <path
          ref={handoffRouteRef}
          d="M 720 0 C 724 145, 768 310, 818 595"
          fill="none"
          stroke="#B75E3F"
          strokeWidth="1.6"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
      </svg>

      {/* =====================================================================
          INDEPENDENT DEPTH LANDSCAPE LAYERS (A -> B -> C -> D)
          On portrait mobile (< 768px), recomposed into the lower 58dvh canvas
          so Banyan Tree, Terracotta Road, Distant Valley & Right Foliage remain
          complete & un-cropped while upper negative-space sky holds typography.
          ===================================================================== */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56dvh] min-h-[380px] md:inset-0 md:h-full overflow-hidden [@media(max-height:520px)]:inset-0 [@media(max-height:520px)]:h-full">
        {/* LAYER B (Distance): Low-contrast distant horizon & wooded valley */}
        <div
          ref={distantLayerRef}
          data-footer-layer="distant"
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ zIndex: 12 }}
        >
          <div className="relative w-full h-full translate-y-[6%] md:translate-y-[8%]">
            <Image
              src="/illustrated/footer/footer-distant.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[52%_bottom] md:object-bottom"
              priority
            />
          </div>
        </div>

        {/* LAYER C (Earth): Terracotta red-earth bank, laterite rocks, & winding road */}
        <div
          ref={terrainLayerRef}
          data-footer-layer="terrain"
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ zIndex: 14 }}
        >
          <Image
            src="/illustrated/footer/footer-terrain.webp"
            alt="Terracotta path winding through the Auroville landscape"
            fill
            sizes="100vw"
            className="object-cover object-[52%_bottom] md:object-bottom"
            priority
          />
        </div>

        {/* LAYER D1 (Foreground Left): Ancient fluted banyan trunk, aerial roots, canopy limb */}
        <div
          ref={banyanLayerRef}
          data-footer-layer="banyan"
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ zIndex: 16 }}
        >
          {/* Isolated inner parallax wrapper so cursor movement never overrides GSAP scroll Y */}
          <div
            className="relative w-full h-full transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${leafShift.x * -3.5}px, ${leafShift.y * -2.5}px, 0)`,
            }}
          >
            <Image
              src="/illustrated/footer/footer-banyan.webp"
              alt="Hand-drawn foreground banyan tree with spreading roots and arching canopy"
              fill
              sizes="100vw"
              className="object-cover object-[18%_bottom] md:object-left-bottom"
              priority
            />
          </div>
        </div>

        {/* LAYER D2 (Foreground Right): Overhanging botanical framing & corner rock */}
        <div
          ref={rightFoliageLayerRef}
          data-footer-layer="right-foliage"
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ zIndex: 17 }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${leafShift.x * 4}px, ${leafShift.y * 3}px, 0)`,
            }}
          >
            <Image
              src="/illustrated/footer/footer-right-foliage.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[88%_bottom] md:object-right-bottom"
              priority
            />
          </div>
        </div>

        {/* Soft Top Feather Blending Landscape Into Warm Sky Sky Clearing On Mobile */}
        <div
          className="md:hidden pointer-events-none absolute inset-x-0 top-0 h-20 z-[18]"
          style={{
            background: "linear-gradient(to bottom, #F6F3EB 0%, rgba(246, 243, 235, 0.45) 55%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* =====================================================================
          LAYER E: PURE HTML TYPOGRAPHY & ACCESSIBLE CONTROLS ABOVE ARTWORK
          Anchored safely in the generous open ivory sky clearing
          ===================================================================== */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 pt-[76px] md:pt-16 pb-8 md:pb-10 [@media(max-height:520px)]:pt-14 flex flex-col justify-start md:justify-between">
        {/* Top/Center Serene Negative-Space Clearing for Signature Wordmark */}
        <div className="md:my-auto pt-2 sm:pt-8 md:pt-16 md:pl-[14%] lg:pl-[16%] flex flex-col items-start">
          <div className="overflow-hidden max-w-full">
            <div ref={wordmarkRevealRef} className="will-change-transform">
              <h2 className="font-display text-[clamp(2.65rem,14.8vw,4.5rem)] sm:text-[11.2vw] md:text-[9.6vw] lg:text-[118px] xl:text-[134px] tracking-tighter2 uppercase leading-[0.84] text-ink select-none whitespace-nowrap">
                AUROVILLE
              </h2>
            </div>
          </div>

          <div
            ref={supportingRowRef}
            className="mt-3 sm:mt-4 md:mt-5 w-full md:pr-20 lg:pr-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
          >
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-ink font-light leading-tight sm:whitespace-nowrap">
              A place still becoming.
            </p>

            <div className="flex flex-wrap items-center gap-5 sm:gap-8">
              <EditorialAction
                onClick={onBackToBeginning}
                ariaLabel="Back to beginning"
                arrow="up"
                className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold bg-paper/80 backdrop-blur-[1px]"
              >
                Back to beginning
              </EditorialAction>

              <EditorialAction
                href="https://suriya-portfolio29.vercel.app/projects"
                target="_blank"
                rel="noopener noreferrer"
                arrow="up-right"
                className="font-sans text-xs sm:text-sm font-medium bg-paper/80 backdrop-blur-[1px]"
              >
                Made by Suriya
              </EditorialAction>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
