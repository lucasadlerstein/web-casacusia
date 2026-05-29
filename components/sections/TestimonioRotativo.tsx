"use client";

import { useEffect, useState } from "react";
import type { Testimonio } from "@/lib/content";

const ROTATE_MS = 7000;

export function TestimonioRotativo({ testimonios }: { testimonios: Testimonio[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonios.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonios.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [testimonios.length]);

  if (testimonios.length === 0) return null;

  return (
    <div className="relative min-h-[120px]" aria-live="polite">
      {testimonios.map((t, i) => (
        <figure
          key={t.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <blockquote className="font-display text-base md:text-lg font-semibold leading-snug text-ink">
            &ldquo;{t.fraseDestacada ?? t.texto}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-sm text-ink-muted">
            {t.autor ?? "Mensaje de la comunidad"}
            {(t.contexto ?? t.ubicacion) ? ` · ${t.contexto ?? t.ubicacion}` : ""}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
