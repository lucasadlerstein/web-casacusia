"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Filamento } from "@/components/ui/Filamento";
import type { Testimonio } from "@/lib/content";

const avatarCycle = [
  { bg: "bg-verde-soft",    text: "text-verde-dark" },
  { bg: "bg-violeta-soft",  text: "text-violeta-dark" },
  { bg: "bg-rosa-soft",     text: "text-rosa-dark" },
  { bg: "bg-amarillo-soft", text: "text-ink-soft" }
];

const ROTATE_MS = 8000; // 8 segundos por testimonio

export function Testimonial({ testimonios }: { testimonios: Testimonio[] }) {
  const t = useTranslations("home.testimonios");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (testimonios.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonios.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [testimonios.length, paused]);

  if (testimonios.length === 0) return null;

  return (
    <Section background="warm" ariaLabelledBy="testimonial-title" className="relative overflow-hidden">
      <Filamento name="rosa"    className="-top-10 -right-10 w-44 rotate-[15deg]"  opacity={10} />
      <Filamento name="verde"   className="-bottom-10 -left-10 w-44 rotate-[-20deg]" opacity={10} />
      <Filamento name="punto-magenta" className="top-16 left-[40%] w-6" opacity={35} />

      <SectionHeading
        eyebrow={t("eyebrow")}
        title={<span id="testimonial-title">{t("title")}</span>}
      />

      <div
        className="relative mt-12 max-w-3xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Comillas decorativas */}
        <span
          aria-hidden
          className="absolute -top-8 -left-2 font-bubbles text-[7rem] leading-none text-verde opacity-25 select-none pointer-events-none"
        >
          &quot;
        </span>

        {/* Stack de testimonios — todos absolutos, sólo el activo es opaco */}
        <div className="relative min-h-[260px] md:min-h-[220px]" aria-live="polite" aria-atomic="true">
          {testimonios.map((testimonio, i) => {
            const av = avatarCycle[i % avatarCycle.length] ?? avatarCycle[0]!;
            const active = i === index;
            return (
              <figure
                key={testimonio.id}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  active ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <blockquote className="font-display text-xl md:text-2xl font-semibold leading-snug text-ink">
                  {testimonio.fraseDestacada ?? testimonio.texto}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${av.bg} ${av.text}`}
                  >
                    {testimonio.autor?.[0] ?? "♥"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink truncate">
                      {testimonio.autor ?? "Mensaje de la comunidad"}
                    </p>
                    {(testimonio.contexto ?? testimonio.ubicacion) && (
                      <p className="text-sm text-ink-muted truncate">
                        {testimonio.contexto ?? testimonio.ubicacion}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {testimonios.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2" role="tablist" aria-label="Testimonios">
            {testimonios.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Testimonio ${i + 1} de ${testimonios.length}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    active ? "w-8 bg-verde-dark" : "w-2 bg-ink-muted/30 hover:bg-ink-muted/60"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}
