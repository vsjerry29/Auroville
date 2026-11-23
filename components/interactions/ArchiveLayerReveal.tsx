"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { AUROVILLE_IMAGES } from "@/lib/data/images";

interface ArchiveLayerRevealProps {
  className?: string;
}

export default function ArchiveLayerReveal({ className = "" }: ArchiveLayerRevealProps) {
  const [dragOffset, setDragOffset] = useState(0); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const initialOffset = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const topDocument = AUROVILLE_IMAGES.cover;
  const underDocument = AUROVILLE_IMAGES.construction;

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    initialOffset.current = dragOffset;
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const delta = clientX - startX.current;
      const percentageDelta = (delta / width) * 100;
      const newOffset = Math.max(0, Math.min(85, initialOffset.current + percentageDelta));
      setDragOffset(newOffset);
    },
    [isDragging]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isDragging, handleMove]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setDragOffset((prev) => Math.min(85, prev + 10));
    } else if (e.key === "ArrowLeft") {
      setDragOffset((prev) => Math.max(0, prev - 10));
    }
  };

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Header editorial label */}
      <div className="flex items-center justify-between pb-2 border-b border-border text-ink-muted text-[10px] uppercase tracking-widest font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta inline-block" />
          <span>TACTILE STUDY · LAYERED ARCHIVE</span>
        </span>
        <span className="text-terracotta">DRAG PRINT ASIDE</span>
      </div>

      {/* Layered Document Container */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Layered archival documents"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full aspect-[16/10] bg-paper-dark border border-border mt-2 overflow-hidden select-none focus:outline-none focus:ring-1 focus:ring-terracotta"
      >
        {/* UNDERLYING DOCUMENT: 2004 Construction Record */}
        <div className="absolute inset-0 w-full h-full p-3 bg-paper-alt">
          <div className="relative w-full h-full overflow-hidden border border-border">
            <Image
              src={underDocument.src}
              alt={underDocument.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale contrast-110"
            />
            <div className="absolute bottom-2 left-2 bg-ink/90 text-paper-light px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest">
              DOC B: 2004 STRUCTURAL RIBS & FRAMING
            </div>
          </div>
        </div>

        {/* TOP LAYER: Dragging Contemporary Print */}
        <div
          onMouseDown={(e) => handlePointerDown(e.clientX)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handlePointerDown(e.touches[0].clientX);
          }}
          className="absolute inset-0 w-full h-full p-3 bg-paper-light border-r border-border archival-shadow cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out"
          style={{
            transform: `translateX(${dragOffset}%)`,
          }}
        >
          <div className="relative w-full h-full overflow-hidden border border-border">
            <Image
              src={topDocument.src}
              alt={topDocument.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-paper-light/95 backdrop-blur-sm text-ink px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest border border-border">
              DOC A: FINISHED SPHERE VISTA
            </div>
          </div>

          {/* Tactile drag tab */}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-6 h-12 rounded-r-md bg-paper border-y border-r border-border shadow-sm flex items-center justify-center text-ink text-[10px] font-mono">
            ↔
          </div>
        </div>
      </div>

      {/* Explanatory annotation */}
      <div className="flex items-center justify-between pt-2 text-ink-muted text-[11px]">
        <p className="line-clamp-1 italic font-serif">
          Drag upper photograph or use arrow keys to inspect the 2004 concrete framing document.
        </p>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint shrink-0 ml-2">
          {Math.round(dragOffset)}% DISPLACED
        </span>
      </div>
    </div>
  );
}
