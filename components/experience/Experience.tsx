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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

  const handleNavigate = useCallback(
    (targetProgress: number) => {
      const totalScrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const targetScroll = Math.max(
        0,
        Math.min(totalScrollable, targetProgress * totalScrollable)
      );
      window.scrollTo({
        top: targetScroll,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion]
  );

  const handleNavigateAtlasStop = useCallback(
    (stopProgress: number) => {
      const st = atlasPinTriggerRef.current;
      if (!st) return;
      const clamped = Math.min(1, Math.max(0, stopProgress));
      const targetY = st.start + clamped * (st.end - st.start);
      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion]
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

    const scrubValue = prefersReducedMotion ? 0 : 0.45;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: upperPinRef.current,
        pin: true,
        pinSpacing: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 5.0)}`,
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
        scrub: prefersReducedMotion ? 0 : 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setCh04EnterProgress(self.progress);
        },
      });

      ScrollTrigger.create({
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
        scrub: prefersReducedMotion ? 0 : 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setCh05EnterProgress(self.progress);
        },
      });

      ScrollTrigger.create({
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
        scrub: prefersReducedMotion ? 0 : 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setCh06EnterProgress(self.progress);
        },
      });

      ScrollTrigger.create({
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
        scrub: prefersReducedMotion ? 0 : 0.25,
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
        end: () => `+=${Math.round(window.innerHeight * 3.8)}`,
        scrub: scrubValue,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setCh07JourneyProgress(self.progress);
        },
      });

      ScrollTrigger.create({
        start: 0,
        end: "max",
        scrub: 0.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setGlobalProgress(self.progress);
        },
      });

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
        onNavigate={handleNavigate}
        onMenuOpenChange={setMenuOpen}
      />
      <ProgressIndicator progress={globalProgress} />

      <main
        ref={mainRef}
        aria-hidden={menuOpen}
        className="relative w-full bg-paper text-ink"
        aria-label="Auroville: The Art of Interaction"
      >
        <div ref={upperPinRef} className="relative w-full h-screen overflow-hidden">
          <ExperienceStage progress={stageProgress} ch04EnterProgress={ch04EnterProgress} />
        </div>

        <section
          ref={ch04SectionRef}
          id="chapter-04"
          className="relative w-full h-[220vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
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
          className="relative w-full h-[320vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
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
          className="relative w-full h-[300vh] bg-paper text-ink selection:bg-terracotta selection:text-paper-light"
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
          className="relative w-full h-screen overflow-hidden bg-paper text-ink selection:bg-terracotta selection:text-paper-light border-t border-border/35"
          aria-label="Chapter 07: The Interactive Atlas"
        >
          <Chapter10Atlas
            enterProgress={ch07EnterProgress}
            journeyProgress={ch07JourneyProgress}
            onNavigateStop={handleNavigateAtlasStop}
          />
        </section>

        <ExperienceFooter onBackToBeginning={() => handleNavigate(0.0)} />
      </main>
    </>
  );
}
