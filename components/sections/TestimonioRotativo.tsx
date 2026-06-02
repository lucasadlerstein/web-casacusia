"use client";

import { useEffect, useState } from "react";
import type { Testimonio } from "@/lib/content";

const ROTATE_MS = 7000;

/** Fondos de la paleta (baja opacidad). Cambian al rotar para que se note. */
const FONDOS = [
  "bg-verde-soft",
  "bg-rosa-soft",
  "bg-violeta-soft",
  "bg-amarillo-soft",
  "bg-naranja-soft",
  "bg-magenta/10"
];

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
    <div className="relative min-h-[168px]" aria-live="polite">
      {testimonios.map((t, i) => (
        <figure
          key={t.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 flex flex-col justify-center rounded-2xl px-5 py-5 transition-opacity duration-700 ${
            FONDOS[i % FONDOS.length]
          } ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <blockquote className="font-display text-[15px] md:text-base font-semibold leading-snug text-ink">
            &ldquo;{t.fraseDestacada ?? t.texto}&rdquo;
          </blockquote>
          <figcaption className="mt-2.5 text-xs text-ink-soft">
            {t.autor ?? "Mensaje de la comunidad"}
            {(t.contexto ?? t.ubicacion) ? ` · ${t.contexto ?? t.ubicacion}` : ""}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
