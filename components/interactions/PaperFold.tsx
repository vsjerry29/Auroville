"use client";

import { useState, useRef, useCallback } from "react";

interface PaperFoldProps {
  scrollProgress: number; // 0.0 to 1.0 (local progress)
  children: React.ReactNode;
  className?: string;
  onManualDrag?: (offsetPercent: number) => void;
}

export default function PaperFold({
  scrollProgress,
  children,
  className = "",
  onManualDrag,
}: PaperFoldProps) {
  // Manual drag offset for the pull-tab (Interaction I015)
  const [manualOffset, setManualOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);

  // Effective reveal percentage (0% = closed fold, 100% = fully opened panorama)
  // Combines scrollProgress with any interactive drag
  const effectiveProgress = Math.min(
    1,
    Math.max(0, scrollProgress + manualOffset)
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - startXRef.current) / window.innerWidth;
    // Dragging left peels the page open further
    const newOffset = Math.max(-0.4, Math.min(0.6, -deltaX * 0.8));
    setManualOffset(newOffset);
    if (onManualDrag) onManualDrag(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    // Smoothly settle back to 0 so scroll remains authoritative
    setManualOffset(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Polygon mask calculating the peeling page fold from right to left
  // At progress = 0: fold is at 100% (right edge)
  // At progress = 1: fold is at 0% (fully open)
  const foldX = Math.max(0, 100 - effectiveProgress * 100);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Underlying Panorama Scene revealed through the opening fold */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-75"
        style={{
          clipPath: `polygon(0% 0%, ${100 - foldX * 0.1}% 0%, 100% 100%, 0% 100%)`,
        }}
      >
        {children}
      </div>

      {/* Folding Page Crease / Shadow / Tab (Interactions I011 & I015) */}
      {effectiveProgress < 0.95 && (
        <div
          role="slider"
          aria-label="Drag page fold to reveal panorama"
          aria-valuenow={Math.round(effectiveProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setManualOffset((prev) => Math.min(0.5, prev + 0.1));
            if (e.key === "ArrowRight") setManualOffset((prev) => Math.max(-0.3, prev - 0.1));
          }}
          className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center select-none"
          style={{
            left: `${foldX}%`,
            width: "36px",
            transform: "translateX(-50%)",
          }}
        >
          {/* Subtle paper fold highlight & shadow */}
          <div className="absolute inset-y-0 w-[1px] bg-ink/20 shadow-[0_0_15px_rgba(25,25,23,0.15)]" />

          {/* Tactile Pull-Tab affordance (Interaction I015) */}
          <div className="relative px-2 py-3 bg-paper border border-border shadow-md rounded-xs flex flex-col items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-terracotta">
            <span>◀</span>
            <span className="hidden sm:inline [writing-mode:vertical-rl] rotate-180">
              PEEL PAGE
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
