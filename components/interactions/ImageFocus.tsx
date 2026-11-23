"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AurovilleImage } from "@/lib/data/images";
import { X } from "lucide-react";

interface ImageFocusProps {
  image: AurovilleImage | null;
  onClose: () => void;
}

export default function ImageFocus({ image, onClose }: ImageFocusProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (image) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-ink/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[90vh] bg-paper-light border border-border archival-shadow flex flex-col md:flex-row overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close focus view"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-paper/90 border border-border text-ink hover:text-terracotta hover:border-terracotta transition-colors flex items-center justify-center"
        >
          <X size={18} />
        </button>

        {/* Image viewport */}
        <div className="relative w-full md:w-3/5 h-64 md:h-auto min-h-[300px] md:min-h-[500px] bg-paper-dark">
          <Image
            src={image.src}
            alt={image.caption}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Archival metadata panel */}
        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-paper-light">
          <div>
            <div className="flex items-center gap-2 text-ink-muted text-[10px] uppercase tracking-widest font-mono pb-3 border-b border-border">
              <span className="w-2 h-2 rounded-full bg-terracotta inline-block" />
              <span>COLLECTION ARCHIVE / {image.category.toUpperCase()}</span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-ink font-light mt-4 tracking-tight">
              {image.title}
            </h2>

            <div className="mt-2 text-ink-muted font-mono text-[11px] tracking-wide">
              {image.location} {image.year ? `· ${image.year}` : ""}
            </div>

            <p className="mt-6 font-sans text-sm md:text-base text-ink/90 leading-relaxed font-light">
              {image.caption}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-border space-y-2 text-[11px] font-mono text-ink-muted">
            <div className="flex justify-between">
              <span>ACCESSION ID:</span>
              <span className="text-ink uppercase">{image.id}</span>
            </div>
            <div className="flex justify-between">
              <span>PHOTOGRAPHIC CREDIT:</span>
              <span className="text-ink">{image.credit}</span>
            </div>
            <div className="flex justify-between">
              <span>RIGHTS / PERMISSIONS:</span>
              <span className="text-ink">{image.license}</span>
            </div>
            <div className="flex justify-between">
              <span>INTRINSIC RATIO:</span>
              <span className="text-ink">{image.aspectRatio}</span>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={onClose}
                className="w-full py-2.5 text-[11px] font-mono uppercase tracking-widest text-ink hover:text-paper-light bg-paper hover:bg-ink border border-border transition-colors"
              >
                Return to Living Grid [ESC]
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
