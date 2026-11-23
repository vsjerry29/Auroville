"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";

interface ArchiveComparisonProps {
  className?: string;
}

export default function ArchiveComparison({ className = "" }: ArchiveComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const historical = AUROVILLE_IMAGES.construction;
  const contemporary = AUROVILLE_IMAGES.cover;

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Header archival label */}
      <div className="flex items-center justify-between pb-2 border-b border-border text-ink-muted text-[10px] uppercase tracking-widest font-mono">
        <span>ACCESSION #MM-1972-2024</span>
        <span>STUDY: STRUCTURAL METAMORPHOSIS</span>
      </div>

      {/* Interactive slider frame */}
      <div
        ref={containerRef}
        role="slider"
        aria-label="Historical vs Contemporary Matrimandir comparison"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) handleMove(e.touches[0].clientX);
        }}
        className="relative w-full aspect-[4/3] overflow-hidden select-none cursor-ew-resize border border-border bg-paper-dark mt-2 archival-shadow-subtle focus:outline-none focus:ring-1 focus:ring-terracotta"
      >
        {/* Contemporary Image (Underneath / Right) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={contemporary.src}
            alt={contemporary.alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-3 right-3 bg-paper-light/95 backdrop-blur-sm px-2.5 py-1 text-[9px] uppercase tracking-widest text-ink font-mono border border-border">
            COMPLETED SPHERE (2024)
          </div>
        </div>

        {/* Historical Image (Clipped / Left) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="relative w-full h-full min-w-full">
            <div
              className="absolute inset-0"
              style={{
                width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%",
                height: "100%",
              }}
            >
              <Image
                src={historical.src}
                alt={historical.alt}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover grayscale contrast-110"
              />
              <div className="absolute bottom-3 left-3 bg-ink/90 text-paper-light px-2.5 py-1 text-[9px] uppercase tracking-widest font-mono">
                CONSTRUCTION ERA (2004)
              </div>
            </div>
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-paper-light shadow-[0_0_8px_rgba(0,0,0,0.3)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-paper-light border border-border shadow-md flex items-center justify-center text-ink text-[10px] font-mono">
            ↔
          </div>
        </div>
      </div>

      {/* Caption & instructions */}
      <div className="flex items-center justify-between pt-2 text-ink-muted text-[11px]">
        <p className="line-clamp-1 italic font-serif">
          Drag slider or use arrow keys to inspect the structural scaffolding.
        </p>
        <span className="font-mono text-[9px] uppercase tracking-wider text-terracotta shrink-0 ml-2">
          {Math.round(sliderPosition)}% SPLIT
        </span>
      </div>
    </div>
  );
}
