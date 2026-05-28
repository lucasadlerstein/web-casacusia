"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoStrip({ photos, alt }: { photos: string[]; alt: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? null : (i + 1) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, photos.length]);

  const visibleCount = Math.min(photos.length, 8);

  return (
    <>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {photos.slice(0, visibleCount).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIdx(i)}
            className={`relative aspect-square overflow-hidden rounded-xl ring-1 ring-surface-line transition-all hover:ring-verde-dark hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-verde-dark ${
              i >= 4 ? "hidden md:block" : ""
            } ${i >= 6 ? "lg:block" : ""}`}
            aria-label={`Ver foto ${i + 1} de ${visibleCount}`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
            />
          </button>
        ))}
      </div>

      {openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-lg hover:scale-105 transition-transform"
            onClick={(e) => { e.stopPropagation(); setOpenIdx(null); }}
          >
            <X size={20} aria-hidden />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                className="absolute left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:scale-105 transition-transform"
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => i === null ? null : (i - 1 + photos.length) % photos.length); }}
              >
                <ChevronLeft size={20} aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                className="absolute right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg hover:scale-105 transition-transform"
                onClick={(e) => { e.stopPropagation(); setOpenIdx((i) => i === null ? null : (i + 1) % photos.length); }}
              >
                <ChevronRight size={20} aria-hidden />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[openIdx]!}
              alt={`${alt} ampliada`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
