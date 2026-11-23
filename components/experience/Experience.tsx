"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceStage from "./ExperienceStage";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experience() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Navigation handler to jump to a specific chapter progress
  const handleNavigate = useCallback((targetProgress: number) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = Math.max(0, targetProgress * totalHeight);
    window.scrollTo({
      top: targetScroll,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset scroll position to top on initial mount/reload
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    // Create Master ScrollTrigger on the 550vh scroll track
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: prefersReducedMotion ? 0 : 0.5,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    scrollTriggerRef.current = st;

    // Handle viewport resize gracefully
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (st) st.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "550vh" }}
      aria-label="Auroville: The Art of Interaction Master Scroll Track"
    >
      {/* Fixed Viewport Stage */}
      <ExperienceStage progress={progress} onNavigate={handleNavigate} />
    </div>
  );
}
