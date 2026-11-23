"use client";

import { useState, useEffect } from "react";
import { CHAPTERS, Chapter } from "@/lib/data/chapters";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface ChapterNavigationProps {
  currentProgress: number;
  onNavigate: (targetProgress: number) => void;
}

export default function ChapterNavigation({
  currentProgress,
  onNavigate,
}: ChapterNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Synchronized active chapter calculation
  const activeChapter =
    CHAPTERS.find(
      (ch) => currentProgress >= ch.range[0] && currentProgress < ch.range[1]
    ) || CHAPTERS[CHAPTERS.length - 1];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (ch: Chapter) => {
    onNavigate(ch.targetProgress);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Header / Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex items-center justify-between pointer-events-none">
        {/* Top-left: Project wordmark / identifier */}
        <div className="pointer-events-auto flex items-center gap-3">
          <span className="font-display text-sm tracking-wider text-ink uppercase">
            AUROVILLE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta inline-block" />
          <span className="font-serif italic text-xs text-ink-muted hidden sm:inline-block">
            A Place Still Becoming
          </span>
        </div>

        {/* Top-right: Current Chapter Trigger */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Open Chapter Directory"
            className="group flex items-center gap-3 px-3.5 py-1.5 bg-paper-light/95 backdrop-blur-md border border-border hover:border-ink transition-colors rounded-sm text-ink shadow-sm"
          >
            <span className="font-mono text-[10px] text-terracotta tracking-wider font-semibold">
              CHAPTER {activeChapter.number}
            </span>
            <span className="w-[1px] h-3 bg-border" />
            <span className="font-serif text-sm tracking-wide hidden md:inline">
              {activeChapter.title}
            </span>
            <span className="p-0.5 rounded text-ink group-hover:rotate-90 transition-transform duration-300">
              {isOpen ? <X size={14} /> : <Menu size={14} />}
            </span>
          </button>
        </div>
      </header>

      {/* Chapter Directory Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chapter Index"
          className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-ink/75 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-paper border border-border archival-shadow p-8 md:p-12"
          >
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <span className="font-mono text-[10px] text-terracotta uppercase tracking-widest font-semibold">
                  DIRECTORY / FOUR CHAPTERS
                </span>
                <h2 className="font-serif italic text-2xl md:text-3xl text-ink font-light mt-1">
                  A Place Still Becoming
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chapter index"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink hover:text-terracotta transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="divide-y divide-border mt-4">
              {CHAPTERS.map((ch) => {
                const isActive = activeChapter.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelect(ch)}
                    className={`w-full py-4 text-left flex items-start justify-between group transition-colors ${
                      isActive ? "bg-paper-light/70 px-4 -mx-4" : "hover:bg-paper-light/40"
                    }`}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-base text-terracotta">
                        {ch.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-serif text-xl md:text-2xl text-ink group-hover:text-terracotta transition-colors font-light">
                            {ch.title}
                          </h3>
                          {isActive && (
                            <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-ink text-paper-light tracking-widest">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs md:text-sm text-ink-muted mt-0.5 font-light">
                          {ch.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-ink-muted group-hover:text-terracotta group-hover:translate-x-1 transition-all pt-1">
                      <ArrowUpRight size={18} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-ink-faint text-[10px] font-mono tracking-widest uppercase">
              <span>EXPLORE BY CHAPTER</span>
              <span>ESC TO CLOSE</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
