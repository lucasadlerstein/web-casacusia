"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils/cn";
import type { PasoRelato } from "@/lib/content";

export type PasoSoni = PasoRelato & {
  titulo: string;
  texto: string;
  alt: string;
};

type Props = {
  pasos: PasoSoni[];
  label: string;
  hint: string;
  cta: string;
  ctaHref: string;
  saltar: string;
  saltarHref: string;
};

/**
 * Relato de Soni guiado por el scroll: el escenario queda fijo mientras
 * la página avanza, y cada tramo cambia la foto (o acerca la cámara al
 * implante) y el texto. Con `prefers-reduced-motion` se muestran los pasos
 * apilados, sin fijar nada ni animar.
 */
export function SoniScroll({ pasos, label, hint, cta, ctaHref, saltar, saltarHref }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [paso, setPaso] = useState(0);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducido(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducido) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const recorrido = rect.height - window.innerHeight;
      if (recorrido <= 0) return;
      const progreso = Math.min(1, Math.max(0, -rect.top / recorrido));
      setPaso(Math.min(pasos.length - 1, Math.floor(progreso * pasos.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pasos.length, reducido]);

  const primero = pasos[0];
  const activo = pasos[paso] ?? primero;
  if (!primero || !activo) return null;
  const ultimo = paso === pasos.length - 1;
  const fotos = Array.from(new Set(pasos.map((p) => p.imagen)));

  if (reducido) {
    return (
      <section aria-label={label} className="bg-surface-warm py-16 md:py-24">
        <div className="container space-y-12">
          <Eyebrow className="text-verde-dark">{label}</Eyebrow>
          {pasos.map((p, i) => (
            <div key={i} className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-card shadow-md">
                <Image src={p.imagen} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink md:text-3xl">{p.titulo}</h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-soft">{p.texto}</p>
              </div>
            </div>
          ))}
          <Button href={ctaHref} target="_blank" rel="noopener noreferrer" size="lg">
            {cta}
            <ExternalLink size={16} aria-hidden />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={label} className="bg-surface-warm">
      {/* Para lectores de pantalla: el relato completo, sin depender del scroll. */}
      <ol className="sr-only">
        {pasos.map((p, i) => (
          <li key={i}>
            {p.titulo} {p.texto}
          </li>
        ))}
      </ol>

      <div ref={ref} style={{ height: `${pasos.length * 100}svh` }}>
        <div
          aria-hidden
          /* top/alto descuentan el header sticky (h-16 / md:h-[4.5rem]) */
          className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col md:top-[4.5rem] md:h-[calc(100svh-4.5rem)]"
        >
          <div className="container flex flex-1 flex-col gap-5 py-4 md:grid md:grid-cols-2 md:items-center md:gap-12 md:py-8">
            {/* Escenario */}
            <div className="relative aspect-[4/5] max-h-[52svh] w-full self-center overflow-hidden rounded-3xl bg-surface-card shadow-lg md:max-h-[calc(100svh-9rem)] md:aspect-[4/5]">
              {fotos.map((src) => {
                const esActiva = src === activo.imagen;
                const foco = esActiva ? activo.foco : undefined;
                return (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    fill
                    priority={src === primero.imagen}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={cn(
                      "object-cover transition-[opacity,transform] duration-700 ease-out will-change-transform",
                      esActiva ? "opacity-100" : "opacity-0"
                    )}
                    /* Escala alrededor del foco y lo trae al centro del cuadro */
                    style={{
                      transformOrigin: foco ? `${foco.x}% ${foco.y}%` : "50% 50%",
                      transform: foco
                        ? `translate(${50 - foco.x}%, ${50 - foco.y}%) scale(${foco.escala})`
                        : "translate(0, 0) scale(1)"
                    }}
                  />
                );
              })}

              {/* Aro que señala el implante cuando la cámara se acerca */}
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-verde transition-opacity duration-500 md:h-36 md:w-36",
                  activo.foco ? "opacity-90" : "opacity-0"
                )}
              />

              {/* Indicador de avance */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-surface-bg/90 px-3 py-2 shadow-sm">
                {pasos.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === paso ? "w-6 bg-verde-dark" : "w-1.5 bg-ink-muted/40"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Texto del paso activo: todos en la misma celda para que el alto no salte */}
            <div className="grid flex-1 content-center md:flex-none">
              {pasos.map((p, i) => (
                <div
                  key={i}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out",
                    i === paso ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-3"
                  )}
                >
                  {i === 0 && <Eyebrow className="mb-2 text-verde-dark md:mb-3">{label}</Eyebrow>}
                  <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
                    {p.titulo}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft md:mt-4 md:text-lg">{p.texto}</p>
                  {i === pasos.length - 1 && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-7">
                      <Button href={ctaHref} target="_blank" rel="noopener noreferrer" size="lg">
                        {cta}
                        <ExternalLink size={16} aria-hidden />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pie: pista para deslizar y atajo a la tienda */}
          <div className="container flex items-center justify-between pb-3 text-sm md:pb-5">
            <p
              className={cn(
                "inline-flex items-center gap-1.5 font-semibold text-ink-soft transition-opacity duration-300",
                ultimo ? "opacity-0" : "opacity-100"
              )}
            >
              <ChevronDown size={18} aria-hidden className="motion-safe:animate-bounce" />
              {hint}
            </p>
            <a href={saltarHref} className="font-bold text-verde-dark underline-offset-4 hover:underline">
              {saltar}
            </a>
          </div>
        </div>
      </div>

      {/* Atajo accesible por teclado (el de arriba está en una zona aria-hidden) */}
      <a href={saltarHref} className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-full focus:bg-surface-card focus:px-4 focus:py-2">
        {saltar}
      </a>
    </section>
  );
}
