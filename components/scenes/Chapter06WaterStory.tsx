"use client";

import { useState, useRef, useCallback, useEffect, useId } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EditorialAction, FeatureToggle } from "@/components/ui/EditorialControls";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Chapter06WaterStoryProps {
  /** 0.0 -> 1.0 as Chapter 06 scrolls vertically into viewport below Chapter 05 */
  enterProgress: number;
  /** 0.0 -> 1.0 across sticky scroll progression */
  progress: number;
}

interface TapRipple {
  id: number;
  x: number;
  y: number;
}

// Frog habitat & constrained short-hop tuning (in native 1440x900 SVG scene units)
const FROG_HOME = { x: 842, y: 422 };
const FROG_COMFORT_RADIUS = 38;
const FROG_MAX_HOP = 72;
const FROG_MIN_HOP = 22;
const FROG_LEAVE_DELAY_MS = 450;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export default function Chapter06WaterStory({
  enterProgress,
  progress,
}: Chapter06WaterStoryProps) {
  const uid = useId().replace(/:/g, "");
  const prefersReducedMotion = useReducedMotion();

  // Tactile Direct Interactions (independent from scroll state; click/drag only)
  const [bundPercent, setBundPercent] = useState(78);
  const [isDraggingBund, setIsDraggingBund] = useState(false);
  const [cutawayExpanded, setCutawayExpanded] = useState(false);
  const [cursorLocal, setCursorLocal] = useState<{ x: number; y: number } | null>(null);
  const [ripples, setRipples] = useState<TapRipple[]>([]);
  const nextRippleId = useRef(1);
  const cutawayBoxRef = useRef<HTMLDivElement>(null);

  // Two-layer Frog GSAP Architecture:
  //   - frogWorldPosRef (outer): ground plane (x, y) ONLY
  //   - frogHopArcRef (inner): vertical arc lift (y) ONLY
  //   - frogSpriteRef (sprite): facing scaleX & subtle squash/stretch ONLY
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneSvgRef = useRef<SVGSVGElement>(null);
  const frogWorldPosRef = useRef<SVGGElement>(null);
  const frogHopArcRef = useRef<SVGGElement>(null);
  const frogShadowEllipseRef = useRef<SVGEllipseElement>(null);
  const frogSpriteRef = useRef<SVGGElement>(null);
  const frogEyeLidRef = useRef<SVGLineElement>(null);

  const progressRef = useRef(0);
  const enterProgressRef = useRef(0);
  const sectionActiveRef = useRef(false);

  const p = clamp01(progress);
  progressRef.current = p;
  enterProgressRef.current = clamp01(enterProgress);

  const isScrollActive = enterProgress > 0.3 && p < 0.88 && !prefersReducedMotion;
  sectionActiveRef.current = isScrollActive;

  // ===========================================================================
  // WATER STORY — SEPARATED WORLD/ARC MULTI-HOP FROG SYSTEM
  //   - Inverse CTM mapping (clientX, clientY) -> local 1440x900 SVG coords
  //   - Outer wrapper controls ground (x, y); inner wrapper controls arc height
  //   - Re-reads latest pointer position between every short hop (<= 72px)
  //   - Settles calmly next to cursor when idle; returns home only on pointer leave
  // ===========================================================================
  useEffect(() => {
    const stageEl = stageRef.current;
    const svgEl = sceneSvgRef.current;
    const worldEl = frogWorldPosRef.current;
    const hopArcEl = frogHopArcRef.current;
    const shadowEllipseEl = frogShadowEllipseRef.current;
    const spriteEl = frogSpriteRef.current;

    if (!stageEl || !svgEl || !worldEl || !hopArcEl || !shadowEllipseEl || !spriteEl) {
      return;
    }

    const toSvgCoords = (clientX: number, clientY: number) => {
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return null;
      const pt = svgEl.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const local = pt.matrixTransform(ctm.inverse());
      return { x: local.x, y: local.y };
    };

    const clampFrogToBounds = (rawX: number, rawY: number): { x: number; y: number } => {
      // Intersect static artwork habitat bounds with currently visible viewport SVG box
      const topLeft = toSvgCoords(28, 78);
      const bottomRight = toSvgCoords(window.innerWidth - 28, window.innerHeight - 28);

      const visMinX = topLeft ? Math.max(380, topLeft.x) : 380;
      const visMaxX = bottomRight ? Math.min(1010, bottomRight.x) : 1010;
      const visMinY = topLeft ? Math.max(240, topLeft.y) : 240;
      const visMaxY = bottomRight ? Math.min(635, bottomRight.y) : 635;

      const minX = Math.min(visMinX, visMaxX - 20);
      const maxX = Math.max(visMinX + 20, visMaxX);
      const minY = Math.min(visMinY, visMaxY - 20);
      const maxY = Math.max(visMinY + 20, visMaxY);

      let cx = Math.max(minX, Math.min(maxX, rawX));
      let cy = Math.max(minY, Math.min(maxY, rawY));

      // Keep clear of top-left editorial heading region & bottom-left cutaway box
      if (cx < 385 && cy < 365) {
        if (385 - cx < 365 - cy) {
          cx = 385;
        } else {
          cy = 365;
        }
      }
      if (cx < 505 && cy > 468) {
        if (505 - cx < cy - 468) {
          cx = 505;
        } else {
          cy = 468;
        }
      }

      return { x: cx, y: cy };
    };

    let currentPos = { ...FROG_HOME };
    let currentFacing = -1; // -1 faces left across basin, +1 faces right
    let latestClient: { x: number; y: number } | null = null;
    let returningHome = false;
    let isHopping = false;
    let isSectionInView = false;
    let activeHopTl: gsap.core.Timeline | null = null;
    let hopPauseTimer: ReturnType<typeof setTimeout> | null = null;
    let leaveReturnTimer: ReturnType<typeof setTimeout> | null = null;

    const clearTimers = () => {
      if (hopPauseTimer) {
        clearTimeout(hopPauseTimer);
        hopPauseTimer = null;
      }
      if (leaveReturnTimer) {
        clearTimeout(leaveReturnTimer);
        leaveReturnTimer = null;
      }
    };

    // Place frog cleanly at resting stone/reed bank home spot
    gsap.set(worldEl, { x: FROG_HOME.x, y: FROG_HOME.y });
    gsap.set(hopArcEl, { y: 0 });
    gsap.set(spriteEl, { scaleX: -1, scaleY: 1, transformOrigin: "50% 88%" });
    gsap.set(shadowEllipseEl, { scale: 1, opacity: 0.22, transformOrigin: "50% 50%" });

    // Reduced-motion mode: allow quiet direct tap relocation without hop loops
    if (prefersReducedMotion) {
      const onTapReduced = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("button, [data-interactive-panel]")) return;
        const svgPt = toSvgCoords(e.clientX, e.clientY);
        if (!svgPt) return;
        const clamped = clampFrogToBounds(svgPt.x, svgPt.y);
        const dx = clamped.x - currentPos.x;
        if (Math.abs(dx) > 5) currentFacing = dx < 0 ? -1 : 1;
        currentPos = clamped;
        gsap.to(worldEl, { x: clamped.x, y: clamped.y, duration: 0.25, ease: "sine.out" });
        gsap.set(spriteEl, { scaleX: currentFacing });
      };
      stageEl.addEventListener("pointerdown", onTapReduced);
      return () => {
        stageEl.removeEventListener("pointerdown", onTapReduced);
      };
    }

    const ctx = gsap.context(() => {
      // Restrained idle breathing & occasional eyelid blink while settled
      const breatheTween = gsap.to(spriteEl, {
        scaleY: 1.032,
        scaleX: () => currentFacing * 1.015,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 88%",
      });

      const blinkTl = gsap.timeline({ repeat: -1, repeatDelay: 3.5 });
      if (frogEyeLidRef.current) {
        blinkTl
          .set(frogEyeLidRef.current, { opacity: 1 })
          .to(frogEyeLidRef.current, { opacity: 1, duration: 0.1 })
          .set(frogEyeLidRef.current, { opacity: 0 });
      }

      const isStoryVisibleNow = () =>
        (isSectionInView || sectionActiveRef.current) &&
        enterProgressRef.current > 0.3 &&
        progressRef.current < 0.88;

      const resetFrogToHome = () => {
        clearTimers();
        if (activeHopTl) {
          activeHopTl.kill();
          activeHopTl = null;
        }
        isHopping = false;
        returningHome = false;
        latestClient = null;
        currentPos = { ...FROG_HOME };
        currentFacing = -1;
        gsap.set(worldEl, { x: FROG_HOME.x, y: FROG_HOME.y });
        gsap.set(hopArcEl, { y: 0 });
        gsap.set(spriteEl, { scaleX: -1, scaleY: 1 });
        gsap.set(shadowEllipseEl, { scale: 1, opacity: 0.22 });
        breatheTween.resume();
      };

      const planNextHop = () => {
        if (isHopping || !isStoryVisibleNow()) return;

        let target: { x: number; y: number } | null = null;
        if (returningHome) {
          target = { ...FROG_HOME };
        } else if (latestClient) {
          const freshSvg = toSvgCoords(latestClient.x, latestClient.y);
          if (freshSvg) {
            target = clampFrogToBounds(freshSvg.x, freshSvg.y);
          }
        }

        if (!target) {
          breatheTween.resume();
          return;
        }

        const dx = target.x - currentPos.x;
        const dy = target.y - currentPos.y;
        const dist = Math.hypot(dx, dy);
        const stopRadius = returningHome ? 24 : FROG_COMFORT_RADIUS;

        if (dist <= stopRadius) {
          if (returningHome) returningHome = false;
          breatheTween.resume();
          return;
        }

        // Clamp every individual hop strictly to [FROG_MIN_HOP..FROG_MAX_HOP] (no single long jump)
        const approachGoal = returningHome
          ? dist
          : Math.max(FROG_MIN_HOP, dist - FROG_COMFORT_RADIUS * 0.45);
        const hopDist = Math.min(FROG_MAX_HOP, approachGoal, dist);
        const ratio = hopDist / dist;

        const nextPos = clampFrogToBounds(
          currentPos.x + dx * ratio,
          currentPos.y + dy * ratio
        );

        const stepDx = nextPos.x - currentPos.x;
        const stepDy = nextPos.y - currentPos.y;
        const stepLen = Math.hypot(stepDx, stepDy);

        if (stepLen < 10) {
          if (returningHome) returningHome = false;
          breatheTween.resume();
          return;
        }

        isHopping = true;
        breatheTween.pause();

        if (Math.abs(stepDx) > 4) {
          currentFacing = stepDx < 0 ? -1 : 1;
        }

        const jumpHeight = 16 + Math.min(11, stepLen * 0.16); // 16-27px natural hop peak
        const jumpDur = 0.36 + Math.min(0.14, stepLen * 0.0018); // 0.36-0.50s crisp timing

        activeHopTl = gsap.timeline({
          onComplete: () => {
            currentPos = nextPos;
            isHopping = false;
            activeHopTl = null;

            hopPauseTimer = setTimeout(() => {
              hopPauseTimer = null;
              planNextHop();
            }, 60);
          },
        });

        // 1. Brief pre-hop crouch
        activeHopTl.to(spriteEl, {
          scaleX: currentFacing * 1.12,
          scaleY: 0.84,
          duration: 0.065,
          ease: "power2.out",
          transformOrigin: "50% 88%",
        });

        // 2a. Ground displacement (STRICTLY outer wrapper -> never overwritten by vertical arc)
        activeHopTl.to(
          worldEl,
          {
            x: nextPos.x,
            y: nextPos.y,
            duration: jumpDur,
            ease: "power1.inOut",
          },
          ">"
        );

        // 2b. Vertical hop arc (STRICTLY inner wrapper -> crisp parabolic rise & fall)
        activeHopTl.to(
          hopArcEl,
          {
            y: -jumpHeight,
            duration: jumpDur * 0.46,
            ease: "power2.out",
          },
          "<"
        );
        activeHopTl.to(
          hopArcEl,
          {
            y: 0,
            duration: jumpDur * 0.54,
            ease: "power2.in",
          },
          `-=${0}`
        );

        // 2c. Ground shadow contracts subtly during airtime
        activeHopTl.to(
          shadowEllipseEl,
          {
            scale: 0.62,
            opacity: 0.1,
            duration: jumpDur * 0.46,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          `<`
        );

        // 2d. Subtle airborne limb extension
        activeHopTl.to(
          spriteEl,
          {
            scaleX: currentFacing * 0.95,
            scaleY: 1.07,
            duration: jumpDur * 0.42,
            ease: "sine.out",
          },
          "<"
        );

        // 3. Soft landing compression -> natural settle
        activeHopTl.to(spriteEl, {
          scaleX: currentFacing * 1.09,
          scaleY: 0.89,
          duration: 0.07,
          ease: "power2.out",
        });
        activeHopTl.to(spriteEl, {
          scaleX: currentFacing,
          scaleY: 1,
          duration: 0.1,
          ease: "sine.out",
        });
      };

      const activateTargetFromClient = (clientX: number, clientY: number) => {
        if (!isStoryVisibleNow()) return;

        // Moving into top navigation header (< 76px) triggers calm return home
        if (clientY < 76) {
          latestClient = null;
          if (!leaveReturnTimer) {
            leaveReturnTimer = setTimeout(() => {
              leaveReturnTimer = null;
              if (!latestClient && isStoryVisibleNow()) {
                returningHome = true;
                planNextHop();
              }
            }, FROG_LEAVE_DELAY_MS);
          }
          return;
        }

        if (leaveReturnTimer) {
          clearTimeout(leaveReturnTimer);
          leaveReturnTimer = null;
        }

        latestClient = { x: clientX, y: clientY };
        returningHome = false;
        planNextHop();
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const targetEl = e.target as HTMLElement | null;
        if (targetEl?.closest("[data-interactive-panel]")) {
          return;
        }
        activateTargetFromClient(e.clientX, e.clientY);
      };

      const onPointerDown = (e: PointerEvent) => {
        const targetEl = e.target as HTMLElement | null;
        if (targetEl?.closest("button, [data-interactive-panel]")) return;
        activateTargetFromClient(e.clientX, e.clientY);
      };

      const onPointerLeave = () => {
        latestClient = null;
        if (leaveReturnTimer) clearTimeout(leaveReturnTimer);
        leaveReturnTimer = setTimeout(() => {
          leaveReturnTimer = null;
          if (!latestClient && isStoryVisibleNow()) {
            returningHome = true;
            planNextHop();
          }
        }, FROG_LEAVE_DELAY_MS);
      };

      stageEl.addEventListener("pointermove", onPointerMove);
      stageEl.addEventListener("pointerdown", onPointerDown);
      stageEl.addEventListener("pointerleave", onPointerLeave);

      const parentTriggerEl = stageEl.parentElement || stageEl;
      const sectionST = ScrollTrigger.create({
        trigger: parentTriggerEl,
        start: "top 60%",
        end: "bottom 25%",
        onToggle: (self) => {
          isSectionInView = self.isActive;
          if (self.isActive && enterProgressRef.current > 0.3 && progressRef.current < 0.88) {
            sectionActiveRef.current = true;
          } else if (!self.isActive) {
            sectionActiveRef.current = false;
            resetFrogToHome();
          }
        },
      });

      if (
        (sectionST.isActive ||
          (enterProgressRef.current > 0.3 && progressRef.current < 0.88)) &&
        progressRef.current < 0.88
      ) {
        isSectionInView = true;
        sectionActiveRef.current = true;
      }

      return () => {
        stageEl.removeEventListener("pointermove", onPointerMove);
        stageEl.removeEventListener("pointerdown", onPointerDown);
        stageEl.removeEventListener("pointerleave", onPointerLeave);
        clearTimers();
        if (activeHopTl) activeHopTl.kill();
        breatheTween.kill();
        blinkTl.kill();
        sectionST.kill();
      };
    }, stageEl);

    return () => {
      sectionActiveRef.current = false;
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // ===========================================================================
  // CHOREOGRAPHY TIMELINE (Continuous Watercourse Reveal -> Atlas Pathway)
  // ===========================================================================
  const channelMorph = clamp01(enterProgress * 0.55 + smooth(0.0, 0.24, p) * 0.45);
  const embankmentsDraw = smooth(0.14, 0.44, p);
  const colorWashFlow = smooth(0.18, 0.52, p);
  const exitToInk = smooth(0.82, 1.0, p);
  const inkLineDraw = smooth(0.82, 0.99, p);

  const headerOpacity =
    smooth(0.15, 0.65, enterProgress) * (1 - smooth(0.80, 0.92, p));
  const basinShiftY = exitToInk * -36;

  // Pointer localized waterline shimmer
  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || e.pointerType === "touch") return;
      const svgEl = sceneSvgRef.current;
      const ctm = svgEl?.getScreenCTM();
      if (svgEl && ctm) {
        const pt = svgEl.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const local = pt.matrixTransform(ctm.inverse());
        setCursorLocal({ x: local.x, y: local.y });
        return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      setCursorLocal({
        x: ((e.clientX - rect.left) / rect.width) * 1440,
        y: ((e.clientY - rect.top) / rect.height) * 900,
      });
    },
    [prefersReducedMotion]
  );

  // Brief watercolor surface tap ripple (auto-clears after 750ms — never lingers permanently)
  const handleCanvasTap = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, [data-interactive-panel]")) return;
    const svgEl = sceneSvgRef.current;
    const ctm = svgEl?.getScreenCTM();
    let x = 0;
    let y = 0;
    if (svgEl && ctm) {
      const pt = svgEl.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const local = pt.matrixTransform(ctm.inverse());
      x = local.x;
      y = local.y;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      x = ((e.clientX - rect.left) / rect.width) * 1440;
      y = ((e.clientY - rect.top) / rect.height) * 900;
    }
    const id = nextRippleId.current++;
    setRipples((prev) => [...prev.slice(-1), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== id));
    }, 750);
  }, []);

  const updateBundFromPointer = useCallback((clientX: number) => {
    if (!cutawayBoxRef.current) return;
    const rect = cutawayBoxRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const pct = Math.round(
      Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    );
    setBundPercent(pct);
  }, []);

  const handleBundPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDraggingBund(true);
      updateBundFromPointer(e.clientX);
    },
    [updateBundFromPointer]
  );

  const handleBundPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingBund) return;
      updateBundFromPointer(e.clientX);
    },
    [isDraggingBund, updateBundFromPointer]
  );

  const handleBundPointerUp = useCallback(() => {
    setIsDraggingBund(false);
  }, []);

  const distToBasin = cursorLocal ? Math.hypot(cursorLocal.x - 740, cursorLocal.y - 525) : 999;
  const nearWater = distToBasin < 245;
  const shiftDx = nearWater && cursorLocal ? (cursorLocal.x - 740) * 0.025 : 0;
  const shiftDy = nearWater && cursorLocal ? (cursorLocal.y - 525) * 0.025 : 0;

  const channelUncoverBottom = Math.round(78 - smooth(0.0, 0.36, enterProgress + p) * 78);

  return (
    <div
      ref={stageRef}
      className="sticky top-0 w-full h-screen overflow-hidden select-none bg-paper text-ink"
      onPointerMove={handleCanvasPointerMove}
      onPointerLeave={() => setCursorLocal(null)}
      onPointerDown={handleCanvasTap}
      aria-label="Chapter 06: The Water Story"
    >
      {/* LAYER 01: SINGLE UNIFIED ILLUSTRATED WATERCOURSE LANDSCAPE */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: `inset(0% 0% ${channelUncoverBottom}% 0%)`,
          transform: `translate3d(0, ${basinShiftY * 0.45}px, 0)`,
          opacity: 1 - exitToInk * 0.44,
        }}
      >
        <Image
          src="/illustrated/ch06-water/ch06-water-master.jpg"
          alt="Conceptual hand-illustrated water channel curving into a stepped terracotta catchment basin"
          fill
          sizes="100vw"
          className="object-cover object-[58%_54%] md:object-center mix-blend-multiply"
          style={{
            filter: `grayscale(${(1 - colorWashFlow).toFixed(3)}) contrast(${(1.08 - colorWashFlow * 0.04).toFixed(3)}) brightness(1.03)`,
          }}
          priority
        />
      </div>

      {/* LAYER 02: CONTINUOUS RIVER STROKE (FROM CH05 ROOT -> CH07 ATLAS PATHWAY) */}
      <svg
        ref={sceneSvgRef}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 w-full h-full z-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`waterToEarth-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F6670" />
            <stop offset="52%" stopColor="#856256" />
            <stop offset="100%" stopColor="#B75E3F" />
          </linearGradient>
        </defs>

        {/* CH05 -> CH06 Shared Morph: inherits exact (662, 0) vertical root entry from CH05 bottom */}
        <path
          d="M 662 0 C 662 34, 575 56, 442 114 C 345 156, 512 204, 468 254 C 412 316, 294 374, 384 446 C 470 515, 672 560, 922 548"
          fill="none"
          stroke="#4F6670"
          strokeWidth={2.0 + colorWashFlow * 0.4}
          strokeOpacity={0.78 * (1 - colorWashFlow * 0.65) * (1 - exitToInk * 0.65)}
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - channelMorph}
        />

        {/* Contour Terrace Bund Structural Graphite Linework */}
        <path
          d="M 412 292 C 304 362, 396 485, 558 538 C 725 592, 922 595, 982 522"
          fill="none"
          stroke="#191917"
          strokeWidth="1.05"
          strokeDasharray="5 5"
          strokeOpacity={0.4 * embankmentsDraw * (1 - exitToInk * 0.65)}
          pathLength={1}
          strokeDashoffset={1 - embankmentsDraw}
        />

        {/* Localized pointer-deflected shoreline water highlights */}
        <g
          transform={`translate(${shiftDx}, ${shiftDy})`}
          style={{ opacity: colorWashFlow * (1 - exitToInk) * (nearWater ? 0.85 : 0.44) }}
        >
          <path
            d="M 622 496 Q 735 468 852 504 M 646 544 Q 748 566 860 532"
            fill="none"
            stroke="#FCFAF6"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        </g>

        {/* Transient pond tap ripple (fades out cleanly; zero lingering static circles) */}
        {ripples.map((r) => (
          <g key={r.id} transform={`translate(${r.x}, ${r.y})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="22"
              ry="8.5"
              fill="none"
              stroke="#6C838E"
              strokeWidth="0.85"
              strokeOpacity="0.34"
            />
          </g>
        ))}

        {/* HAND-ILLUSTRATED GRAPHITE & SAGE-WASH POND FROG
            Outer wrapper = ground plane (x, y) + shadow
            Inner wrapper = pure vertical hop arc (y) + squash/stretch */}
        <g style={{ opacity: smooth(0.14, 0.44, p) * (1 - exitToInk) }}>
          <g ref={frogWorldPosRef} data-testid="water-story-frog">
            <ellipse
              ref={frogShadowEllipseRef}
              cx="0"
              cy="7"
              rx="13"
              ry="4.2"
              fill="#191917"
              opacity="0.22"
            />
            <g ref={frogHopArcRef} data-testid="water-story-frog-hop">
              <g ref={frogSpriteRef}>
                {/* Folded hind thigh & webbed toes */}
                <path
                  d="M -12 4 C -14 -2, -7 -6, -2 -2 C -4 2, -8 5, -13 6 L -16 6"
                  fill="#5A6E56"
                  fillOpacity="0.78"
                  stroke="#191917"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Main torso & warm ochre belly */}
                <path
                  d="M -11 2 C -9 -6, 1 -10, 9 -7 C 13 -5, 16 -2, 16 1 C 14 4, 5 5, -5 5 Z"
                  fill="#768A6E"
                  stroke="#191917"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Pale colored-pencil belly highlight */}
                <path
                  d="M -6 4.2 Q 4 5.5 13 2.2 Q 7 2 -2 2.4 Z"
                  fill="#E3CFA9"
                  fillOpacity="0.88"
                />
                {/* Graphite hatching ridge & olive-back markings */}
                <path
                  d="M -5 -3.5 Q 2 -6 8 -4 M -7 0 Q -2 -1.5 4 -1"
                  fill="none"
                  stroke="#191917"
                  strokeWidth="0.7"
                  strokeOpacity="0.58"
                  strokeLinecap="round"
                />
                {/* Foreleg grounded firmly */}
                <path
                  d="M 4 0 L 7 6 L 10 6.5 M 7 6 L 5 6.8"
                  fill="none"
                  stroke="#191917"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Raised eye brow & crisp ink pupil + blink lid */}
                <circle cx="9.2" cy="-5.8" r="2.2" fill="#FCFAF6" stroke="#191917" strokeWidth="1" />
                <circle cx="9.6" cy="-5.8" r="1.05" fill="#191917" />
                <line
                  ref={frogEyeLidRef}
                  x1="7.2"
                  y1="-5.8"
                  x2="11.2"
                  y2="-5.8"
                  stroke="#191917"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  opacity="0"
                />
              </g>
            </g>
          </g>
        </g>

        {/* CH06 -> CH07 Outgoing Watercourse Line connecting directly into Interactive Atlas at (560, 900) */}
        <path
          d="M 885 574 C 755 660, 560 735, 560 900"
          fill="none"
          stroke={`url(#waterToEarth-${uid})`}
          strokeWidth="1.65"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - inkLineDraw}
          style={{ opacity: smooth(0.8, 0.9, p) * 0.72 }}
        />
      </svg>

      {/* Soft Top-Left Ivory Reading Halo + Bottom Handoff Veil */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] md:w-[34vw] md:h-[42vh]"
        style={{
          background:
            "radial-gradient(ellipse 88% 82% at 14% 18%, rgba(246, 243, 235, 0.96) 24%, rgba(246, 243, 235, 0.74) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36vh]"
        style={{
          opacity: exitToInk,
          background:
            "linear-gradient(to top, #F6F3EB 26%, rgba(246, 243, 235, 0.88) 58%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* EDITORIAL HEADLINE + INTERACTIVE SOIL/WATER CUTAWAY EXPLORER */}
      <div className="relative z-20 w-full h-full px-5 sm:px-8 md:px-14 pt-20 md:pt-24 pb-6 md:pb-8 flex flex-col justify-between pointer-events-none">
        <div
          className="max-w-[240px] md:max-w-[265px]"
          style={{
            opacity: headerOpacity,
            transform: `translate3d(0, ${(1 - smooth(0.15, 0.65, enterProgress)) * 12}px, 0)`,
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-2">
            06 · The Water Story
          </div>
          <h2 className="font-display text-[32px] sm:text-4xl md:text-[46px] lg:text-[50px] tracking-tight uppercase leading-[0.94] text-ink">
            WATER
            <br />
            THAT STAYS
          </h2>
          <p className="mt-2.5 md:mt-3 font-sans text-xs md:text-[13px] text-ink/90 leading-relaxed font-light max-w-[23ch] text-pretty">
            Earthen contour bunds slow monsoon sheets into porous laterite seams.
          </p>
        </div>

        {/* Lower Row: Compact Draggable Soil/Water Cross-Section + Quiet Atlas Lead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div
            data-interactive-panel="true"
            className={`pointer-events-auto border border-ink/55 bg-[#FCFAF6]/95 p-3 transition-all duration-300 ${
              cutawayExpanded ? "w-full max-w-[490px]" : "w-full max-w-[375px]"
            }`}
            style={{
              opacity: smooth(0.36, 0.52, p) * (1 - smooth(0.80, 0.89, p)),
              transform: `translate3d(0, ${(1 - smooth(0.36, 0.52, p)) * 14 + smooth(0.80, 0.89, p) * 10}px, 0)`,
            }}
          >
            <div
              ref={cutawayBoxRef}
              onPointerDown={handleBundPointerDown}
              onPointerMove={handleBundPointerMove}
              onPointerUp={handleBundPointerUp}
              onPointerCancel={handleBundPointerUp}
              role="slider"
              aria-label="Drag to compare bare laterite runoff against contour-bund aquifer recharge"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={bundPercent}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setBundPercent((v) => Math.min(100, v + 10));
                if (e.key === "ArrowLeft") setBundPercent((v) => Math.max(0, v - 10));
              }}
              className={`relative w-full overflow-hidden border border-border/70 cursor-ew-resize touch-none ${
                cutawayExpanded ? "aspect-[16/9]" : "aspect-[16/8.2]"
              }`}
            >
              <Image
                src="/illustrated/ch06-water/ch06-soil-cutaway.jpg"
                alt="Conceptual cross-section showing bare baked ironstone runoff"
                fill
                sizes="(max-width: 768px) 92vw, 490px"
                className="object-cover scale-[1.06] grayscale-[70%] sepia-[22%] contrast-[0.95] brightness-[1.04]"
                priority
              />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - bundPercent}% 0 0)` }}
              >
                <Image
                  src="/illustrated/ch06-water/ch06-soil-cutaway.jpg"
                  alt="Conceptual cross-section showing rainwater sinking behind contour bund"
                  fill
                  sizes="(max-width: 768px) 92vw, 490px"
                  className="object-cover scale-[1.06]"
                  priority
                />
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 w-[1.5px] bg-ink"
                style={{ left: `${bundPercent}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-paper-light/95 border border-ink flex items-center justify-center font-mono text-[8px] text-ink">
                  ↔
                </div>
              </div>
            </div>

            <div className="pt-2.5 flex items-baseline justify-between gap-2">
              <div className="font-sans font-semibold text-xs md:text-sm text-ink">
                {bundPercent >= 50 ? "Contour Bund Recharge" : "Bare Hardpan Runoff"}
              </div>
              <span className="font-serif italic text-xs text-terracotta shrink-0">
                Conceptual Section
              </span>
            </div>

            <p className="mt-1 font-sans text-[11px] text-ink/80 leading-snug font-light">
              {bundPercent >= 50
                ? "Earthen bunds hold monsoon sheets long enough for water to percolate into red laterite."
                : "Without earthen check-bunds, storms strip dry topsoil off baked slopes."}
            </p>

            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
              <FeatureToggle
                ariaLabel="Soil water condition"
                value={bundPercent >= 50 ? "recharge" : "runoff"}
                onChange={(val) => setBundPercent(val === "recharge" ? 85 : 20)}
                options={[
                  { value: "runoff", label: "Runoff", accent: "terracotta" },
                  { value: "recharge", label: "Recharge", accent: "forest" },
                ]}
              />

              <EditorialAction
                onClick={() => setCutawayExpanded((prev) => !prev)}
                className="font-mono text-[9.5px] uppercase tracking-[0.16em]"
              >
                {cutawayExpanded ? "Compact View −" : "Inspect Strata +"}
              </EditorialAction>
            </div>
          </div>

          <div className="ml-auto max-w-[235px] md:max-w-xs text-right pb-2">
            <div
              style={{
                opacity: smooth(0.84, 0.96, p),
                transform: `translate3d(0, ${(1 - smooth(0.84, 0.96, p)) * 10}px, 0)`,
              }}
            >
              <p className="font-serif italic text-xl md:text-2xl text-ink font-light leading-snug">
                Follow the watercourse outward into the living map.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
