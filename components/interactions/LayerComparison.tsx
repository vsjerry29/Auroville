"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface LayerComparisonProps {
  outlineSrc: string;
  shadedSrc: string;
  outlineAlt?: string;
  shadedAlt?: string;
  className?: string;
}

export default function LayerComparison({
  outlineSrc,
  shadedSrc,
  outlineAlt = "Graphite outline elevation study",
  shadedAlt = "Toned graphite and gold leaf shaded study",
  className = "",
}: LayerComparisonProps) {
  // Slider position from 0 to 100%
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if capture was already released
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive architectural drawing comparison: outline versus shaded"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full aspect-[16/9] overflow-hidden select-none cursor-ew-resize border border-border archival-shadow ${className}`}
    >
      {/* Layer B (Underneath): Toned & Gold Shaded Study */}
      <div className="absolute inset-0 w-full h-full bg-paper">
        <Image
          src={shadedSrc}
          alt={shadedAlt}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-contain"
          priority
        />
        <div className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-ink-muted bg-paper-light/90 px-2 py-0.5 border border-border">
          STATE B · TONED GRAPHITE & GOLD DISCS
        </div>
      </div>

      {/* Layer A (Top Clipped): Pure Graphite Linework Outline */}
      <div
        className="absolute inset-0 w-full h-full bg-paper overflow-hidden"
        style={{
          clipPath: `polygon(0% 0%, ${sliderPos}% 0%, ${sliderPos}% 100%, 0% 100%)`,
        }}
      >
        <Image
          src={outlineSrc}
          alt={outlineAlt}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-contain"
          priority
        />
        <div className="absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-widest text-ink-muted bg-paper-light/90 px-2 py-0.5 border border-border">
          STATE A · PURE STRUCTURAL CONTOURS
        </div>
      </div>

      {/* Tactile Divider Line & Drag Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-terracotta pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-paper border-2 border-terracotta shadow-md flex items-center justify-center font-mono text-[10px] text-terracotta font-bold">
          ↔
        </div>
      </div>

      {/* Accessibility instruction */}
      <div className="sr-only">
        Use Left and Right arrow keys to compare structural outline and finished gold wash drawings. Current reveal: {Math.round(sliderPos)}%.
      </div>
    </div>
  );
}
