"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceStage from "./ExperienceStage";
import Chapter04RedEarth from "@/components/scenes/Chapter04RedEarth";
import Chapter05GrowingForest from "@/components/scenes/Chapter05GrowingForest";
import Chapter06WaterStory from "@/components/scenes/Chapter06WaterStory";
import Chapter10Atlas from "@/components/scenes/Chapter10Atlas";
import ChapterNavigation from "@/components/experience/ChapterNavigation";
import ProgressIndicator from "@/components/experience/ProgressIndicator";
import ExperienceFooter from "@/components/experience/ExperienceFooter";
import FirstMarkPreloader from "@/components/experience/FirstMarkPreloader";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useControlledScroll } from "@/lib/scroll/useControlledScroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function Experience() {
  const [globalProgress, setGlobalProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [ch04EnterProgress, setCh04EnterProgress] = useState(0);
  const [ch04ScrollProgress, setCh04ScrollProgress] = useState(0);
  const [ch05EnterProgress, setCh05EnterProgress] = useState(0);
  const [ch05ScrollProgress, setCh05ScrollProgress] = useState(0);
  const [ch06EnterProgress, setCh06EnterProgress] = useState(0);
  const [ch06ScrollProgress, setCh06ScrollProgress] = useState(0);
  const [ch07EnterProgress, setCh07EnterProgress] = useState(0);
  const [ch07JourneyProgress, setCh07JourneyProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const upperPinRef = useRef<HTMLDivElement>(null);
  const ch04SectionRef = useRef<HTMLElement>(null);
  const ch05SectionRef = useRef<HTMLElement>(null);
  const ch06SectionRef = useRef<HTMLElement>(null);
  const atlasSectionRef = useRef<HTMLElement>(null);

  const upperPinTriggerRef = useRef<ScrollTrigger | null>(null);
  const ch04ScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const ch05ScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const ch06ScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const atlasPinTriggerRef = useRef<ScrollTrigger | null>(null);

  const prefersReducedMotion = useReducedMotion();

  // Keep background <main> strictly inert & hidden from assistive tech while Editorial Index is open
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    if (menuOpen) {
      el.setAttribute("inert", "");
    } else {
      el.removeAttribute("inert");
    }
  }, [menuOpen]);

  // Compute authoritative scroll milestones dynamically from live ScrollTrigger spans
  const getMilestones = useCallback((): number[] => {
    if (typeof window === "undefined") return [0];
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const list: number[] = [0];

    const upper = upperPinTriggerRef.current;
    if (upper && upper.end > upper.start) {
      const span = upper.end - upper.start;
      list.push(
        upper.start + span * (0.215 / 0.73), // CH02 Sketch reveal settled
        upper.start + span * (0.425 / 0.73), // CH02 Sunlit real photograph hold
        upper.start + span * (0.505 / 0.73), // CH03 Story 01: Imagined
        upper.start + span * (0.595 / 0.73), // CH03 Story 02: Made
        upper.start + span * (0.695 / 0.73)  // CH03 Story 03: Realized
      );
    }

    const ch04 = ch04ScrollTriggerRef.current;
    if (ch04 && ch04.end > ch04.start) {
      list.push(ch04.start + (ch04.end - ch04.start) * 0.22); // CH04 Hanging gallery settled
    }

    const ch05 = ch05ScrollTriggerRef.current;
    if (ch05 && ch05.end > ch05.start) {
      const span = ch05.end - ch05.start;
      list.push(
        ch05.start + span * 0.45, // CH05 Monochrome canopy emergence
        ch05.start + span * 0.76  // CH05 Illuminated forest exploration
      );
    }

    const ch06 = ch06ScrollTriggerRef.current;
    if (ch06 && ch06.end > ch06.start) {
      list.push(ch06.start + (ch06.end - ch06.start) * 0.56); // CH06 Water basin & frog active
    }

    const atlas = atlasPinTriggerRef.current;
    if (atlas && atlas.end > atlas.start) {
      const span = atlas.end - atlas.start;
      list.push(
        atlas.start + span * 0.08, // Atlas 01 Matrimandir
        atlas.start + span * 0.37, // Atlas 02 Bharat Nivas
        atlas.start + span * 0.67, // Atlas 03 Solar Kitchen
        atlas.start + span * 0.93  // Atlas 04 Visitors Centre
      );
    }

    list.push(maxScroll); // Illustrated Epilogue Footer
    return list;
  }, []);

  const { navigateToY } = useControlledScroll({
    enabled: true,
    menuOpen,
    prefersReducedMotion,
    getMilestones,
  });

  const handleNavigate = useCallback(
    (targetProgress: number, chapterId?: string) => {
      let targetScroll: number | null = null;
      const upper = upperPinTriggerRef.current;
      const ch04 = ch04ScrollTriggerRef.current;
      const ch05 = ch05ScrollTriggerRef.current;
      const ch06 = ch06ScrollTriggerRef.current;
      const atlas = atlasPinTriggerRef.current;

      if (chapterId === "ch01" || targetProgress <= 0) {
        targetScroll = 0;
      } else if (chapterId === "ch02" && upper) {
        targetScroll = upper.start + (upper.end - upper.start) * (0.215 / 0.73);
      } else if (chapterId === "ch03" && upper) {
        targetScroll = upper.start + (upper.end - upper.start) * (0.505 / 0.73);
      } else if (chapterId === "ch04" && ch04) {
        targetScroll = ch04.start + (ch04.end - ch04.start) * 0.22;
      } else if (chapterId === "ch05" && ch05) {
        targetScroll = ch05.start + (ch05.end - ch05.start) * 0.56;
      } else if (chapterId === "ch06" && ch06) {
        targetScroll = ch06.start + (ch06.end - ch06.start) * 0.54;
      } else if (chapterId === "ch07" && atlas) {
        targetScroll = atlas.start + (atlas.end - atlas.start) * 0.08;
      }

      const totalScrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const resolved =
        targetScroll !== null
          ? targetScroll
          : targetProgress * totalScrollable;
      navigateToY(Math.max(0, Math.min(totalScrollable, resolved)), {
        immediate: prefersReducedMotion,
      });
    },
    [navigateToY, prefersReducedMotion]
  );

  // Authoritative live chapter identification across both mobile & desktop pacing
  const activeChapterId =
    ch07EnterProgress > 0.35
      ? "ch07"
      : ch06EnterProgress > 0.35
      ? "ch06"
      : ch05EnterProgress > 0.35
      ? "ch05"
      : ch04EnterProgress > 0.35
      ? "ch04"
      : stageProgress >= 0.445
      ? "ch03"
      : stageProgress >= 0.195
      ? "ch02"
      : "ch01";

  const handleNavigateAtlasStop = useCallback(
    (stopProgress: number) => {
      const st = atlasPinTriggerRef.current;
      if (!st) return;
      const clamped = Math.min(1, Math.max(0, stopProgress));
      const targetY = st.start + clamped * (st.end - st.start);
      navigateToY(targetY, {
        immediate: prefersReducedMotion,
        duration: 0.62,
      });
    },
    [navigateToY, prefersReducedMotion]
  );

  useEffect(() => {
    if (
      !upperPinRef.current ||
      !ch04SectionRef.current ||
      !ch05SectionRef.current ||
      !ch06SectionRef.current ||
      !atlasSectionRef.current
    )
      return;

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    const scrubValue = prefersReducedMotion ? 0 : 0.32;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const buildResponsiveScrollTriggers = (isMobile: boolean) => {
        const upperEndMultiplier = isMobile ? 3.8 : 5.0;
        const atlasEndMultiplier = isMobile ? 2.9 : 3.8;

        upperPinTriggerRef.current = ScrollTrigger.create({
          trigger: upperPinRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * upperEndMultiplier)}`,
          scrub: scrubValue,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setStageProgress(self.progress * 0.73);
          },
        });

        ScrollTrigger.create({
          trigger: ch04SectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: prefersReducedMotion ? 0 : 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh04EnterProgress(self.progress);
          },
        });

        ch04ScrollTriggerRef.current = ScrollTrigger.create({
          trigger: ch04SectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: scrubValue,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh04ScrollProgress(self.progress);
          },
        });

        ScrollTrigger.create({
          trigger: ch05SectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: prefersReducedMotion ? 0 : 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh05EnterProgress(self.progress);
          },
        });

        ch05ScrollTriggerRef.current = ScrollTrigger.create({
          trigger: ch05SectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: scrubValue,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh05ScrollProgress(self.progress);
          },
        });

        ScrollTrigger.create({
          trigger: ch06SectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: prefersReducedMotion ? 0 : 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh06EnterProgress(self.progress);
          },
        });

        ch06ScrollTriggerRef.current = ScrollTrigger.create({
          trigger: ch06SectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: scrubValue,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh06ScrollProgress(self.progress);
          },
        });

        ScrollTrigger.create({
          trigger: atlasSectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: prefersReducedMotion ? 0 : 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh07EnterProgress(self.progress);
          },
        });

        atlasPinTriggerRef.current = ScrollTrigger.create({
          trigger: atlasSectionRef.current,
          pin: true,
          pinSpacing: true,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * atlasEndMultiplier)}`,
          scrub: scrubValue,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setCh07JourneyProgress(self.progress);
          },
        });

        ScrollTrigger.create({
          start: 0,
          end: "max",
          scrub: 0.08,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setGlobalProgress(self.progress);
          },
        });
      };

      mm.add("(max-width: 767px)", () => buildResponsiveScrollTriggers(true));
      mm.add("(min-width: 768px)", () => buildResponsiveScrollTriggers(false));

      ScrollTrigger.refresh();
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <FirstMarkPreloader />
      <ChapterNavigation
        currentProgress={globalProgress}
        activeChapterId={activeChapterId}
        onNavigate={handleNavigate}
        onMenuOpenChange={setMenuOpen}
      />
      <ProgressIndicator progress={globalProgress} />

      <main
        ref={mainRef}
        aria-hidden={menuOpen}
        className="relative w-full bg-[#FAFAF8] text-ink"
        aria-label="Auroville: The Art of Interaction"
      >
        <div
          id="story-layers"
          className="relative z-20 w-full bg-paper border-b border-border/75 shadow-[0_18px_48px_rgba(25,25,23,0.06)]"
        >
          <div ref={upperPinRef} className="relative w-full h-[100dvh] overflow-hidden">
            <ExperienceStage progress={stageProgress} ch04EnterProgress={ch04EnterProgress} />
          </div>

          <section
            ref={ch04SectionRef}
            id="chapter-04"
            className="relative w-full h-[185dvh] md:h-[220vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
            aria-label="Chapter 04: The Earth Remembers"
          >
            <Chapter04RedEarth
              enterProgress={ch04EnterProgress}
              progress={ch04ScrollProgress}
              onNavigateStart={() => handleNavigate(0.0)}
            />
          </section>

          <section
            ref={ch05SectionRef}
            id="chapter-05"
            className="relative w-full h-[255dvh] md:h-[320vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
            aria-label="Chapter 05: The Growing Forest"
          >
            <Chapter05GrowingForest
              enterProgress={ch05EnterProgress}
              progress={ch05ScrollProgress}
            />
          </section>

          <section
            ref={ch06SectionRef}
            id="chapter-06"
            className="relative w-full h-[240dvh] md:h-[300vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
            aria-label="Chapter 06: The Water Story"
          >
            <Chapter06WaterStory
              enterProgress={ch06EnterProgress}
              progress={ch06ScrollProgress}
            />
          </section>

          <section
            ref={atlasSectionRef}
            id="chapter-07"
            className="relative w-full h-[100dvh] overflow-hidden bg-paper text-ink selection:bg-terracotta selection:text-paper-light border-t border-border/35"
            aria-label="Chapter 07: The Interactive Atlas"
          >
            <Chapter10Atlas
              enterProgress={ch07EnterProgress}
              journeyProgress={ch07JourneyProgress}
              onNavigateStop={handleNavigateAtlasStop}
            />
          </section>
        </div>

        <ExperienceFooter onBackToBeginning={() => handleNavigate(0.0)} />
      </main>
    </>
  );
}
