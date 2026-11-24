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
  const [manualOffset, setManualOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);

  // Progressive reveal: opens rapidly in the 0-15% phase so landscape is immediately visible
  // Fast ease-out curve (power 0.65) so landscape exposes > 70% in first few scrolls
  const normalizedProgress = Math.min(1, Math.max(0, scrollProgress * 1.8 + manualOffset));
  const curvedProgress = Math.pow(normalizedProgress, 0.65);
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

  // Narrow paper fold geometry: angled fold line that sweeps left-to-right
  const topFoldX = revealPercent;
  const bottomFoldX = Math.max(0, revealPercent - 3);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 1. THE REVEALED PANORAMA SCENE (Clipped to the folding edge, revealing CH01 underneath on the right) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath:
            revealPercent >= 99.5
              ? "none"
              : `polygon(0% 0%, ${topFoldX}% 0%, ${bottomFoldX}% 100%, 0% 100%)`,
        }}
      >
        {children}
      </div>

      {/* 2. TACTILE PAPER CREASE EDGE & DROP SHADOW (Physical book fold) */}
      {revealPercent > 0.5 && revealPercent < 99.5 && (
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
          className="absolute top-0 bottom-0 z-30 cursor-ew-resize select-none pointer-events-auto"
          style={{
            left: `${revealPercent}%`,
            width: "32px",
            transform: "translateX(-50%)",
          }}
        >
          {/* Tactile paper fold highlight rule */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-[#E8E1D5] shadow-xs" />
          {/* Soft drop shadow trailing to the right over underlying architectural drawing */}
          <div
            className="absolute inset-y-0 left-1/2 w-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(25, 25, 23, 0.22), rgba(25, 25, 23, 0.05) 50%, transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
}
