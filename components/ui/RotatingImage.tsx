"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Crossfade entre N imágenes. Cambia automáticamente cada `intervalMs`.
 * Respeta prefers-reduced-motion (se queda en la primera).
 */
export function RotatingImage({
  images,
  alt,
  intervalMs = 6000,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false
}: {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          fill
          className={`object-cover transition-opacity duration-[1500ms] ${i === index ? "opacity-100" : "opacity-0"}`}
          sizes={sizes}
          priority={priority && i === 0}
        />
      ))}
    </div>
  );
}
