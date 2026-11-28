"use client";

import { useEffect, useRef } from "react";
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

const WORDMARK_LETTERS = "AUROVILLE".split("");

/**
 * Minimal Editorial Closing Footer — "The Last Reveal"
 *   - Clean #FAFAF8 archival white surface with zero background artwork or decorative fluff
 *   - Uncovered natively underneath the lifting #story-layers curtain (movingparts / stealthis pattern)
 *   - Synchronized GSAP ScrollTrigger wordmark mask rise across 9 real HTML characters on desktop,
 *     simplified single-block rise on mobile touch devices, and static resting layout on reduced motion.
 */
export default function ExperienceFooter({
  onBackToBeginning,
}: ExperienceFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkMaskRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLDivElement>(null);
  const backActionRef = useRef<HTMLDivElement>(null);
  const creditRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const storyLayersEl = document.getElementById("story-layers");
    const letters = letterRefs.current.filter(
      (el): el is HTMLSpanElement => Boolean(el)
    );
    const metaNodes = [
      taglineRef.current,
      backActionRef.current,
      creditRef.current,
    ].filter((el): el is HTMLDivElement => Boolean(el));
    const dividerEl = dividerRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const applyStaticRest = () => {
        gsap.set(letters, { yPercent: 0, opacity: 1 });
        if (wordmarkMaskRef.current) {
          gsap.set(wordmarkMaskRef.current, { yPercent: 0, opacity: 1 });
        }
        if (dividerEl) gsap.set(dividerEl, { scaleX: 1, opacity: 1 });
        gsap.set(metaNodes, { y: 0, opacity: 1 });
      };

      if (prefersReducedMotion || !storyLayersEl) {
        applyStaticRest();
        return;
      }

      // Desktop staggered architectural mask wave across the uncover travel
      mm.add("(min-width: 768px)", () => {
        if (wordmarkMaskRef.current) {
          gsap.set(wordmarkMaskRef.current, { yPercent: 0, opacity: 1 });
        }
        if (metaNodes.length > 0) {
          gsap.set(metaNodes, { y: 14, opacity: 0 });
        }
        if (dividerEl) {
          gsap.set(dividerEl, { scaleX: 0, transformOrigin: "left center", opacity: 0.4 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: storyLayersEl,
            start: "bottom bottom",
            end: () => `+=${Math.max(240, footerEl.offsetHeight)}`,
            scrub: 0.28,
            refreshPriority: -2,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          letters,
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 0.52,
            stagger: { each: 0.022, from: "start" },
            ease: "power3.out",
          },
          0.18
        );

        if (dividerEl) {
          tl.fromTo(
            dividerEl,
            { scaleX: 0, opacity: 0.4 },
            { scaleX: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
            0.42
          );
        }

        tl.fromTo(
          metaNodes,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.48
        );
      });

      // Mobile simpler single-block typographic reveal
      mm.add("(max-width: 767px)", () => {
        gsap.set(letters, { yPercent: 0, opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: storyLayersEl,
            start: "bottom bottom",
            end: () => `+=${Math.max(200, footerEl.offsetHeight)}`,
            scrub: 0.22,
            refreshPriority: -2,
            invalidateOnRefresh: true,
          },
        });

        if (metaNodes.length > 0) {
          gsap.set(metaNodes, { y: 10, opacity: 0 });
        }

        if (wordmarkMaskRef.current) {
          tl.fromTo(
            wordmarkMaskRef.current,
            { yPercent: 92 },
            { yPercent: 0, duration: 0.6, ease: "power2.out" },
            0.14
          );
        }

        tl.fromTo(
          metaNodes,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.36, ease: "power2.out" },
          0.42
        );
      });
    }, footerRef);

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <footer
      ref={footerRef}
      id="atlas-epilogue"
      data-testid="minimal-editorial-footer"
      aria-label="Auroville Editorial Colophon"
      className={`${
        prefersReducedMotion ? "relative" : "sticky bottom-0"
      } z-10 w-full min-h-[60svh] md:min-h-[100dvh] bg-[#FAFAF8] text-ink flex flex-col justify-between overflow-hidden`}
    >
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 pt-8 sm:pt-10 md:pt-28 pb-7 md:pb-10 flex-1 flex flex-col justify-between gap-8 [@media(max-height:520px)]:pt-16 [@media(max-height:520px)]:pb-5 [@media(max-height:520px)]:gap-4">
        {/* Top Row: Tagline (top-left) + Back to beginning (top-right on desktop; cleanly grouped on mobile) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-6">
          <div ref={taglineRef}>
            <p className="font-serif italic text-xl sm:text-2xl md:text-[26px] text-ink font-light leading-snug">
              A place still becoming.
            </p>
          </div>

          <div ref={backActionRef} className="hidden md:block shrink-0">
            <EditorialAction
              onClick={onBackToBeginning}
              ariaLabel="Back to beginning"
              arrow="up"
              className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              Back to beginning
            </EditorialAction>
          </div>
        </div>

        {/* Center Main Focal Point: Oversized Solid Black Real HTML AUROVILLE Wordmark */}
        <div className="my-auto py-2 md:py-4 overflow-hidden">
          <div ref={wordmarkMaskRef} className="will-change-transform">
            <h2
              aria-label="Auroville"
              className="font-display text-[clamp(2.65rem,13.6vw,13.2rem)] [@media(max-height:520px)]:text-[18vh] leading-[0.86] tracking-[-0.04em] uppercase text-ink select-none whitespace-nowrap"
            >
              <span aria-hidden="true" className="inline-flex">
                {WORDMARK_LETTERS.map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    ref={(el) => {
                      letterRefs.current[idx] = el;
                    }}
                    className="inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h2>
          </div>
        </div>

        {/* Bottom Hairline Separator + Action Row (Desktop: bottom-right credit; Mobile: Back + Credit) */}
        <div className="relative pt-4 md:pt-5 flex flex-wrap items-center justify-between md:justify-end gap-4">
          <div
            ref={dividerRef}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[1px] bg-border/75"
          />
          <div className="md:hidden">
            <EditorialAction
              onClick={onBackToBeginning}
              ariaLabel="Back to beginning"
              arrow="up"
              className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold"
            >
              Back to beginning
            </EditorialAction>
          </div>

          <div ref={creditRef}>
            <EditorialAction
              href="https://suriya-portfolio29.vercel.app/projects"
              target="_blank"
              rel="noopener noreferrer"
              arrow="up-right"
              className="font-sans text-xs sm:text-sm font-medium"
            >
              Made by Suriya
            </EditorialAction>
          </div>
        </div>
      </div>
    </footer>
  );
}
