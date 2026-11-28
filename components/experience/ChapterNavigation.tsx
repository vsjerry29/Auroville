"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { CHAPTERS, Chapter } from "@/lib/data/chapters";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EditorialAction } from "@/components/ui/EditorialControls";

interface ChapterNavigationProps {
  currentProgress: number;
  activeChapterId?: string;
  onNavigate: (targetProgress: number, chapterId?: string) => void;
  onMenuOpenChange?: (isOpen: boolean) => void;
}

export default function ChapterNavigation({
  currentProgress,
  activeChapterId,
  onNavigate,
  onMenuOpenChange,
}: ChapterNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewChapterId, setPreviewChapterId] = useState<string>("ch01");
  const prefersReducedMotion = useReducedMotion();

  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const indexRootRef = useRef<HTMLDivElement>(null);
  const listRowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wasOpenRef = useRef(false);

  // Synchronized active chapter derived accurately from live chapter stage (or progress fallback)
  const activeChapter =
    (activeChapterId && CHAPTERS.find((ch) => ch.id === activeChapterId)) ||
    CHAPTERS.find(
      (ch) => currentProgress >= ch.range[0] && currentProgress < ch.range[1]
    ) ||
    CHAPTERS[CHAPTERS.length - 1];

  const activePreviewChapter =
    CHAPTERS.find((c) => c.id === previewChapterId) || activeChapter;

  const openMenu = useCallback(() => {
    setPreviewChapterId(activeChapter.id);
    setIsOpen(true);
    onMenuOpenChange?.(true);
  }, [activeChapter.id, onMenuOpenChange]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    onMenuOpenChange?.(false);
  }, [onMenuOpenChange]);

  const handleSelect = useCallback(
    (ch: Chapter) => {
      onNavigate(ch.targetProgress, ch.id);
      closeMenu();
    },
    [onNavigate, closeMenu]
  );

  // Lock body scroll cleanly while open + notify parent for `inert` + restore focus on close
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const focusTimer = requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });

      return () => {
        cancelAnimationFrame(focusTimer);
        document.body.style.overflow = prevOverflow;
      };
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerBtnRef.current?.focus();
    }
  }, [isOpen]);

  // GSAP coordinated paper/ink curtain opening & typographic row entrance
  useEffect(() => {
    if (!isOpen || !indexRootRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(indexRootRef.current, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
      listRowRefs.current.forEach((row) => {
        if (row) gsap.set(row, { opacity: 1, y: 0 });
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        indexRootRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.48,
          ease: "power3.out",
        }
      );

      const validRows = listRowRefs.current.filter(Boolean);
      if (validRows.length > 0) {
        gsap.fromTo(
          validRows,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.04,
            delay: 0.14,
            ease: "power2.out",
          }
        );
      }
    }, indexRootRef);

    return () => ctx.revert();
  }, [isOpen, prefersReducedMotion]);

  // Full keyboard accessibility: Escape to close, Tab focus trap, ArrowUp/ArrowDown navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }

      const container = indexRootRef.current;
      if (!container) return;

      if (e.key === "Tab") {
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const rows = listRowRefs.current.filter((r): r is HTMLButtonElement => Boolean(r));
        const idx = rows.indexOf(document.activeElement as HTMLButtonElement);
        if (idx !== -1 || rows.length > 0) {
          e.preventDefault();
          const nextIdx =
            e.key === "ArrowDown"
              ? (idx + 1) % rows.length
              : (idx - 1 + rows.length) % rows.length;
          rows[nextIdx]?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <>
      {/* =====================================================================
          MINIMAL EDITORIAL HEADER RAIL (Zero Rectangular Boxes or Dots)
          Soft top ivory feather scrim preserves dark ink readability smoothly
          ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div
          className="absolute inset-x-0 top-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(246, 243, 235, 0.94) 0%, rgba(246, 243, 235, 0.56) 62%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-14 py-3 md:py-4 flex items-center justify-between gap-4">
          {/* Left Brand Typography (Clean borderless action -> scrolls cleanly to top) */}
          <div className="pointer-events-auto flex items-baseline gap-3">
            <EditorialAction
              onClick={() => onNavigate(0.0)}
              ariaLabel="AUROVILLE — return to opening page"
              underlineColor="ink"
              className="min-h-[44px]"
            >
              <span className="font-display text-xs md:text-[13px] tracking-[0.14em] uppercase text-ink">
                AUROVILLE
              </span>
            </EditorialAction>
            <span
              className="hidden sm:inline-block w-3 h-[1px] bg-ink/30 self-center"
              aria-hidden="true"
            />
            <span className="font-serif italic text-xs md:text-[13px] text-ink-muted hidden sm:inline">
              A Place Still Becoming
            </span>
          </div>

          {/* Right Live Chapter Label + Minimal Animated Two-Line Menu Trigger */}
          <div className="pointer-events-auto">
            <button
              ref={triggerBtnRef}
              type="button"
              onClick={() => (isOpen ? closeMenu() : openMenu())}
              aria-expanded={isOpen}
              aria-controls="editorial-index"
              aria-label={`Open Editorial Index. Current chapter ${activeChapter.number}: ${activeChapter.title}`}
              className="group inline-flex items-center gap-3 min-h-[44px] px-1 text-ink hover:text-terracotta transition-colors duration-200 cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-4"
            >
              <span className="font-mono text-[10px] tracking-[0.16em] text-terracotta font-semibold">
                {activeChapter.number}
              </span>
              <span className="hidden md:inline-block font-serif text-sm tracking-wide text-ink group-hover:text-terracotta transition-colors">
                {activeChapter.title}
              </span>
              <span className="hidden sm:inline-block w-[1px] h-3 bg-ink/25" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted group-hover:text-terracotta transition-colors">
                {isOpen ? "Close" : "Menu"}
              </span>

              {/* Minimal Animated Two-Line Hairline Toggle */}
              <span
                className="relative w-4 h-3 flex flex-col justify-center gap-[5px]"
                aria-hidden="true"
              >
                <span
                  className={`block h-[1.25px] w-full bg-current transition-transform duration-300 ease-out ${
                    isOpen ? "translate-y-[3px] rotate-45" : "group-hover:translate-x-0.5"
                  }`}
                />
                <span
                  className={`block h-[1.25px] w-full bg-current transition-transform duration-300 ease-out ${
                    isOpen ? "-translate-y-[3px] -rotate-45" : "group-hover:-translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          THE EDITORIAL INDEX — Full-Viewport Paper & Ink Exhibition Menu
          ===================================================================== */}
      {isOpen && (
        <div
          ref={indexRootRef}
          id="editorial-index"
          data-testid="editorial-index"
          role="dialog"
          aria-modal="true"
          aria-label="The Editorial Index"
          className="fixed inset-0 z-50 bg-paper text-ink overflow-y-auto flex flex-col justify-between"
        >
          {/* Mirror Top Rail inside Menu */}
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 py-4 flex items-center justify-between border-b border-border/70 shrink-0">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-xs md:text-[13px] tracking-[0.14em] uppercase text-ink">
                AUROVILLE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta">
                The Editorial Index
              </span>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close Editorial Index"
              className="group inline-flex items-center gap-2.5 min-h-[44px] px-1 text-ink hover:text-terracotta transition-colors cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Close
              </span>
              <span className="relative w-4 h-4 flex items-center justify-center" aria-hidden="true">
                <span className="block w-4 h-[1.25px] bg-current rotate-45 absolute" />
                <span className="block w-4 h-[1.25px] bg-current -rotate-45 absolute" />
              </span>
            </button>
          </div>

          {/* Center Exhibition Layout: Typographic Chapter List + Curated Artwork Excerpt */}
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 py-6 md:py-10 my-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <nav aria-label="Chapters" className="md:col-span-7 flex flex-col">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted pb-3 border-b border-border/60 mb-1">
                Seven Chapters · Digital Publication
              </div>

              <ul className="divide-y divide-border/55">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = activeChapter.id === ch.id;
                  const isFocusedOrHovered = previewChapterId === ch.id;

                  return (
                    <li key={ch.id}>
                      <button
                        ref={(el) => {
                          listRowRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() => handleSelect(ch)}
                        onMouseEnter={() => setPreviewChapterId(ch.id)}
                        onFocus={() => setPreviewChapterId(ch.id)}
                        aria-current={isActive ? "true" : undefined}
                        className="group w-full min-h-[54px] py-3.5 md:py-4 text-left flex items-center justify-between gap-4 cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2"
                      >
                        <div className="flex items-baseline gap-4 md:gap-7 min-w-0">
                          <span
                            className={`font-mono text-xs tracking-widest transition-colors duration-200 ${
                              isActive
                                ? "text-terracotta font-semibold"
                                : "text-ink-muted group-hover:text-terracotta"
                            }`}
                          >
                            {ch.number}
                          </span>

                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 min-w-0">
                            <span
                              className={`font-serif text-2xl sm:text-3xl lg:text-[36px] leading-tight transition-colors duration-200 truncate ${
                                isActive
                                  ? "text-ink italic font-normal"
                                  : "text-ink/85 group-hover:text-ink font-light"
                              }`}
                            >
                              {ch.title}
                            </span>

                            <span className="font-sans text-[11px] sm:text-xs text-ink-muted font-light truncate">
                              {ch.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            aria-hidden="true"
                            className={`h-[1.5px] transition-all duration-300 ${
                              isActive
                                ? "w-7 bg-terracotta"
                                : isFocusedOrHovered
                                ? "w-5 bg-ink"
                                : "w-0 bg-ink-muted group-hover:w-5"
                            }`}
                          />
                          <ArrowUpRight
                            size={16}
                            className={`transition-all duration-300 ${
                              isActive
                                ? "text-terracotta translate-x-0"
                                : "text-ink-faint group-hover:text-terracotta group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Right Curated Artwork Preview Plate (Desktop; Reuses Existing Assets) */}
            <div className="hidden md:flex md:col-span-5 flex-col gap-4 pl-2 lg:pl-6">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-border bg-paper-light">
                <Image
                  key={activePreviewChapter.id}
                  src={activePreviewChapter.previewSrc}
                  alt={activePreviewChapter.previewAlt}
                  fill
                  sizes="40vw"
                  className="object-cover transition-opacity duration-300"
                />
              </div>

              <div className="flex items-baseline justify-between gap-4 border-t border-border/60 pt-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta">
                  Chapter {activePreviewChapter.number} · {activePreviewChapter.act}
                </span>
                <span className="font-serif italic text-sm text-ink">
                  {activePreviewChapter.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Minimal Bottom Guidance Line */}
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 py-4 border-t border-border/70 flex items-center justify-between text-ink-muted font-mono text-[10px] uppercase tracking-[0.18em] shrink-0">
            <span>Select chapter to navigate</span>
            <span className="hidden md:inline">Esc to return</span>
            <span className="md:hidden">Tap Close to return</span>
          </div>
        </div>
      )}
    </>
  );
}
