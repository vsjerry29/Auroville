"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const SESSION_KEY = "auroville_first_line_seen";

const CRITICAL_HERO_ASSETS = [
  "/matrimandir-sequence/00-hero-study-aligned.png",
  "/art/botanical/banyan-tree.webp",
  "/art/people/potter.webp",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().catch(() => undefined).finally(resolve);
      } else {
        resolve();
      }
    };
    img.onerror = () => resolve();
    img.src = src;
    if (img.complete) resolve();
  });
}

/**
 * "The First Line" — Warm-Ivory Graphite Opening Sequence
 *   - Opens synchronously on #F6F3EB warm paper canvas matching the Hero seamlessly
 *   - Draws ONE delicate graphite architectural arc matching Hero's Matrimandir study
 *   - Glimpses the architectural study underneath via soft feathered mask once ready
 *   - Lifts smoothly to reveal the underlying real AURO / VILLE Hero with zero layout shift
 *   - No dark box, no duplicate typography, no percentages, no spinners
 */
export default function FirstMarkPreloader() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"active" | "done">("active");

  const overlayRef = useRef<HTMLDivElement>(null);
  const arcPathRef = useRef<SVGPathElement>(null);
  const baselinePathRef = useRef<SVGPathElement>(null);
  const glimpseImgRef = useRef<SVGImageElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    // Immediate entrance on reduced motion or intra-session returning navigation
    if (prefersReducedMotion || alreadySeen) {
      setPhase("done");
      return;
    }

    let cancelled = false;
    const overlayEl = overlayRef.current;
    const arcEl = arcPathRef.current;
    const baseEl = baselinePathRef.current;
    const glimpseEl = glimpseImgRef.current;

    if (!overlayEl || !arcEl || !glimpseEl) {
      setPhase("done");
      return;
    }

    // Gate on real font readiness + critical hero illustrations (capped at 3.2s fallback)
    const readinessPromise = new Promise<void>((resolve) => {
      const safetyTimer = window.setTimeout(resolve, 3200);
      const fontsReady = document.fonts
        ? document.fonts.ready.catch(() => undefined)
        : Promise.resolve();
      const assetsReady = Promise.all(CRITICAL_HERO_ASSETS.map(preloadImage));
      Promise.all([fontsReady, assetsReady]).then(() => {
        window.clearTimeout(safetyTimer);
        resolve();
      });
    });

    const ctx = gsap.context(() => {
      const arcLen = arcEl.getTotalLength() || 360;
      const baseLen = baseEl?.getTotalLength?.() || 340;

      gsap.set(arcEl, {
        strokeDasharray: arcLen + 4,
        strokeDashoffset: arcLen + 4,
        opacity: 0.85,
      });
      if (baseEl) {
        gsap.set(baseEl, {
          strokeDasharray: baseLen + 4,
          strokeDashoffset: baseLen + 4,
          opacity: 0.52,
        });
      }
      gsap.set(glimpseEl, { opacity: 0, scale: 0.985, transformOrigin: "50% 50%" });
      gsap.set(overlayEl, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });

      // Stage 1: Single delicate graphite stroke awakens on warm ivory paper (~0.68s)
      const strokeTl = gsap.timeline();
      strokeTl.to(arcEl, {
        strokeDashoffset: 0,
        duration: 0.56,
        ease: "power2.inOut",
      });
      if (baseEl) {
        strokeTl.to(
          baseEl,
          {
            strokeDashoffset: 0,
            duration: 0.36,
            ease: "power1.out",
          },
          0.26
        );
      }

      // Soft veiled architectural dome glimpse inside warm paper (zero text, no letter slicing)
      strokeTl.to(
        glimpseEl,
        {
          opacity: 0.34,
          scale: 1,
          duration: 0.44,
          ease: "power2.out",
        },
        0.32
      );

      // Once BOTH stroke sequence AND real fonts/hero images finish:
      // Smoothly lift editorial veil upward to reveal real AURO / VILLE Hero with 0px shift
      Promise.all([
        new Promise<void>((res) => strokeTl.eventCallback("onComplete", () => res())),
        readinessPromise,
      ]).then(() => {
        if (cancelled) return;
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // Ignore storage restrictions
        }

        const revealTl = gsap.timeline({
          onComplete: () => {
            if (!cancelled) setPhase("done");
          },
        });

        revealTl.to(
          [arcEl, baseEl, glimpseEl].filter(Boolean),
          {
            opacity: 0,
            duration: 0.28,
            ease: "sine.out",
          },
          0
        );

        revealTl.to(
          overlayEl,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.66,
            ease: "power3.inOut",
          },
          0.06
        );

        revealTl.to(
          overlayEl,
          {
            opacity: 0,
            duration: 0.22,
            ease: "sine.out",
          },
          0.52
        );
      });
    }, overlayRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      id="first-line-preloader"
      data-testid="first-line-preloader"
      role="status"
      aria-live="polite"
      aria-label="Opening Auroville editorial publication"
      className="fixed inset-0 z-50 bg-paper pointer-events-auto overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="first-line-vignette-grad">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="56%" stopColor="white" stopOpacity="0.82" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          <mask id="first-line-soft-vignette">
            <rect x="0" y="0" width="1440" height="900" fill="black" />
            <circle cx="704" cy="434" r="275" fill="url(#first-line-vignette-grad)" />
          </mask>
        </defs>

        {/* Faint graphite whisper of hero study before real typography opens */}
        <image
          ref={glimpseImgRef}
          href="/matrimandir-sequence/00-hero-study-aligned.png"
          x="396"
          y="214"
          width="616"
          height="440"
          preserveAspectRatio="xMidYMid meet"
          mask="url(#first-line-soft-vignette)"
          opacity="0"
        />

        {/* Single delicate graphite stroke echoing the Matrimandir dome contour */}
        <path
          ref={arcPathRef}
          d="M 594 472 C 622 396, 662 356, 704 354 C 746 352, 788 394, 814 472"
          fill="none"
          stroke="#191917"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          ref={baselinePathRef}
          d="M 548 476 Q 704 472 864 476"
          fill="none"
          stroke="#191917"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeOpacity="0.52"
        />
      </svg>
    </div>
  );
}
