"use client";

import { useState, useRef } from "react";

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
  // Manual drag offset for peeling the page
  const [manualOffset, setManualOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);

  // Progressive reveal: ease-out curve so landscape opens generously early
  // Effective reveal percentage (0% = closed, 100% = fully open)
  const normalizedProgress = Math.min(1, Math.max(0, scrollProgress + manualOffset));
  // Ease-out so the landscape expands generously early without a long empty cream slit
  const curvedProgress = Math.pow(normalizedProgress, 0.82);
  const revealPercent = Math.min(100, Math.max(0, curvedProgress * 100));

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - startXRef.current) / window.innerWidth;
    const newOffset = Math.max(-0.4, Math.min(0.6, -deltaX * 0.9));
    setManualOffset(newOffset);
    if (onManualDrag) onManualDrag(newOffset);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setManualOffset(0);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Realistic angled paper crease
  const topFoldX = revealPercent;
  const bottomFoldX = Math.max(0, revealPercent - 4);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Underlying Panorama Scene revealed through the peeling fold */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-75"
        style={{
          clipPath: `polygon(0% 0%, ${topFoldX}% 0%, ${bottomFoldX}% 100%, 0% 100%)`,
        }}
      >
        {children}
      </div>

      {/* Tactile Paper Crease & Shadow (Authentic book edge, zero generic UI buttons) */}
      {revealPercent > 1 && revealPercent < 99 && (
        <div
          role="slider"
          aria-label="Drag page fold to reveal panorama"
          aria-valuenow={Math.round(revealPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setManualOffset((prev) => Math.min(0.5, prev + 0.1));
            if (e.key === "ArrowLeft") setManualOffset((prev) => Math.max(-0.3, prev - 0.1));
          }}
          className="absolute top-0 bottom-0 z-20 cursor-ew-resize select-none pointer-events-auto"
          style={{
            left: `${revealPercent}%`,
            width: "28px",
            transform: "translateX(-50%)",
          }}
        >
          {/* Subtle paper fold highlight rule & natural drop shadow */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-[#E8E1D5]" />
          <div
            className="absolute inset-y-0 left-1/2 w-12 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(25, 25, 23, 0.14), rgba(25, 25, 23, 0.03) 60%, transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}
