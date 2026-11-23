"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/* LivingContourField — Adapted from 21st MCP "Luminous Topography" (id: 23412)
   by rmahammad (Motiq). MIT Licensed.
   Restyled for Auroville V5: warm graphite, terracotta, and ochre drafting
   contours on archival ivory paper. Canvas-free, SVG + CSS variables.       */
/* -------------------------------------------------------------------------- */

export type ContourVariant =
  | "hero-draft"
  | "landscape-topography"
  | "structure-elevation"
  | "earth-strata";

export interface LivingContourFieldProps {
  variant?: ContourVariant;
  active?: boolean;
  scrollProgress?: number;
  density?: number;
  opacity?: number;
  reducedMotion?: boolean;
  className?: string;
}

const W = 1440;
const H = 900;
const MARGIN = 80;
const STEP = 50;

/** Small deterministic PRNG (mulberry32). Stable across SSR and client. */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

interface ContourLine {
  d: string;
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
  isDashed?: boolean;
}

/** Smooth Catmull-Rom → cubic-bezier path converter */
function toSmoothPath(pts: Array<[number, number]>): string {
  if (pts.length < 2) return "";
  let d = `M ${round1(pts[0][0])} ${round1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${round1(c1x)} ${round1(c1y)}, ${round1(c2x)} ${round1(c2y)}, ${round1(p2[0])} ${round1(p2[1])}`;
  }
  return d;
}

export default function LivingContourField({
  variant = "hero-draft",
  active = true,
  scrollProgress = 0,
  density = 0.7,
  opacity = 1,
  reducedMotion = false,
  className = "",
}: LivingContourFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [systemReduced, setSystemReduced] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause when offscreen or tab hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isMotionDisabled = reducedMotion || systemReduced;

  // Lightweight pointer tracking: updates CSS variables via requestAnimationFrame
  // Zero React re-renders on mousemove
  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMotionDisabled || !active || !isOnScreen) return;

    let rafId = 0;
    let targetX = W / 2;
    let targetY = H / 2;

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetX = ((e.clientX - rect.left) / rect.width) * W;
      targetY = ((e.clientY - rect.top) / rect.height) * H;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          el.style.setProperty("--cf-cx", `${round1(targetX)}px`);
          el.style.setProperty("--cf-cy", `${round1(targetY)}px`);
          el.style.setProperty("--cf-active", "1");
        });
      }
    };

    const onPointerLeave = () => {
      el.style.setProperty("--cf-active", "0");
    };

    const host = el.parentElement ?? el;
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [active, isOnScreen, isMotionDisabled]);

  // Deterministic contour geometry generation tailored by variant
  const contours = useMemo(() => {
    const rng = makeRng(
      variant === "hero-draft"
        ? 1968
        : variant === "landscape-topography"
        ? 2026
        : variant === "structure-elevation"
        ? 1415
        : 7450
    );

    // Number of contours: between 6 and 10 lines for intentional negative space
    const count = Math.max(5, Math.round(7 + density * 4));
    const span = H + MARGIN * 2;
    const spacing = span / count;
    const result: ContourLine[] = [];

    // Chapter-specific focal zones (attractors that deflect lines organically)
    const focals =
      variant === "hero-draft"
        ? [{ x: W * 0.5, y: H * 0.52, amp: 55, sx: 240, sy: 160 }] // Dome center
        : variant === "landscape-topography"
        ? [{ x: W * 0.45, y: H * 0.65, amp: 70, sx: 320, sy: 200 }] // Red trail valley
        : variant === "structure-elevation"
        ? [{ x: W * 0.62, y: H * 0.48, amp: 60, sx: 260, sy: 180 }] // Geodesic sphere
        : [{ x: W * 0.5, y: H * 0.75, amp: 80, sx: 350, sy: 220 }]; // Subterranean strata

    // Low-frequency harmonics for authentic hand-drawn feel
    const harmonics = Array.from({ length: 3 }, () => ({
      f: 0.0025 + rng() * 0.0035,
      a: 6 + rng() * 8,
      p: rng() * Math.PI * 2,
    }));

    for (let k = 0; k < count; k++) {
      const baseY = -MARGIN + spacing * (k + 0.5) + (rng() - 0.5) * 8;
      const pts: Array<[number, number]> = [];

      for (let x = -MARGIN; x <= W + MARGIN; x += STEP) {
        let displacement = 0;

        for (const f of focals) {
          const dx = x - f.x;
          const ex = Math.exp(-(dx * dx) / (2 * f.sx * f.sx));
          const dy = baseY - f.y;
          const vy = Math.exp(-(dy * dy) / (2 * f.sy * f.sy));
          const dir = dy >= 0 ? 1 : -1;
          displacement += f.amp * ex * (0.5 + 0.5 * vy * dir);
        }

        for (const h of harmonics) {
          displacement += h.a * Math.sin(x * h.f + h.p);
        }

        pts.push([x, baseY - displacement]);
      }

      // Palette: Graphite, terracotta, and ochre accents
      const isTerracotta = k === 2 || k === count - 2;
      const isOchre = k === 4;
      const strokeColor = isTerracotta
        ? "#B75E3F"
        : isOchre
        ? "#C29B72"
        : "#3A3834";

      const opacity = isTerracotta
        ? 0.16
        : isOchre
        ? 0.14
        : round1(clamp(0.08 + (k / count) * 0.08, 0.07, 0.16));

      result.push({
        d: toSmoothPath(pts),
        opacity,
        strokeWidth: isTerracotta ? 1.25 : 0.85,
        strokeColor,
        isDashed: k % 3 === 1,
      });
    }

    return result;
  }, [variant, density]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden transition-opacity duration-700 ${className}`}
      style={{
        opacity: active && isOnScreen ? opacity : 0,
      }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          className="transition-transform duration-300 ease-out"
          style={{
            transform: isMotionDisabled
              ? "none"
              : `translateY(${scrollProgress * -25}px)`,
          }}
        >
          {contours.map((contour, idx) => (
            <path
              key={idx}
              d={contour.d}
              stroke={contour.strokeColor}
              strokeWidth={contour.strokeWidth}
              strokeDasharray={contour.isDashed ? "5 4" : undefined}
              opacity={contour.opacity}
              strokeLinecap="round"
              className="contour-line"
              style={{
                transition: "stroke-width 0.3s ease, opacity 0.3s ease",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
