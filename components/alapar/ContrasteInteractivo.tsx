"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Estallido } from "./Deco";

type Item = { etiqueta: string; solo: string; par: string };

type Props = {
  items: Item[];
  labelSolo: string;
  labelPar: string;
  hintHover: string;
  hintTouch: string;
};

const AUTO_MS = 5000;

/**
 * Escena interactiva "en soledad / A la Par".
 * - Desktop: al pasar el mouse por la escena aparece la segunda figura y cambia el texto.
 * - Touch: tocar la escena alterna los dos estados.
 * - Los botones "En soledad / A la Par" y las etiquetas de situación son accesibles por teclado.
 * - Sin hover, las situaciones avanzan solas cada 5 s (no con prefers-reduced-motion).
 */
export function ContrasteInteractivo({ items, labelSolo, labelPar, hintHover, hintTouch }: Props) {
  const [index, setIndex] = useState(0);
  const [juntos, setJuntos] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [reduced, setReduced] = useState(false);
  const pausado = useRef(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced || items.length <= 1) return;
    const id = setInterval(() => {
      if (pausado.current || juntos) return;
      setIndex((i) => (i + 1) % items.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length, juntos, reduced]);

  const item = items[index] ?? items[0];
  const elegir = useCallback((i: number) => {
    setIndex(i);
    pausado.current = true;
  }, []);

  if (!item) return null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Escena */}
      <div
        role="group"
        aria-label={`${juntos ? labelPar : labelSolo}: ${juntos ? item.par : item.solo}`}
        onMouseEnter={canHover ? () => setJuntos(true) : undefined}
        onMouseLeave={canHover ? () => setJuntos(false) : undefined}
        onClick={!canHover ? () => setJuntos((j) => !j) : undefined}
        className={cn(
          "relative isolate overflow-hidden rounded-[2.5rem] border transition-[border-color,box-shadow] duration-500",
          juntos
            ? "border-alapar-ambar/60 shadow-[0_40px_90px_-50px_rgba(234,89,33,0.55)]"
            : "border-surface-line shadow-[0_30px_70px_-50px_rgba(20,54,66,0.35)]",
          !canHover && "cursor-pointer"
        )}
      >
        {/* Fondos: gris apagado → cálido */}
        <div className="absolute inset-0 bg-surface-tint" aria-hidden="true" />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-alapar-crema via-alapar-ambar-soft to-alapar-rosa-soft transition-opacity duration-700 ease-out",
            juntos ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "alapar-dots absolute inset-0 transition-opacity duration-700",
            juntos ? "opacity-100" : "opacity-40"
          )}
          aria-hidden="true"
        />

        <div className="relative grid min-h-[26rem] items-center gap-6 px-6 py-8 md:min-h-[30rem] md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:px-12 md:py-12">
          {/* Texto */}
          <div className="order-2 md:order-1">
            {/* Switch de estado */}
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white/70 p-1 text-xs font-bold uppercase tracking-[0.14em] backdrop-blur"
              role="group"
              aria-label="Estado de la escena"
            >
              <button
                type="button"
                aria-pressed={!juntos}
                onClick={(e) => { e.stopPropagation(); setJuntos(false); }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-colors",
                  !juntos ? "bg-ink-soft text-white" : "text-ink-muted hover:text-ink"
                )}
              >
                {labelSolo}
              </button>
              <button
                type="button"
                aria-pressed={juntos}
                onClick={(e) => { e.stopPropagation(); setJuntos(true); }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 transition-colors",
                  juntos ? "bg-alapar-cereza text-alapar-crema" : "text-ink-muted hover:text-ink"
                )}
              >
                {labelPar}
              </button>
            </div>

            {/* Las dos frases superpuestas; solo una visible */}
            <div className="relative mt-6 min-h-[9.5rem] sm:min-h-[10rem] md:min-h-[13rem]">
              <p
                key={`solo-${index}`}
                aria-hidden={juntos}
                className={cn(
                  "absolute inset-0 font-onest text-[1.7rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-ink-muted transition-all duration-500 ease-out sm:text-[2.1rem] md:text-[2.5rem]",
                  juntos ? "-translate-y-2 opacity-0" : "translate-y-0 opacity-100"
                )}
              >
                {item.solo}
              </p>
              <p
                key={`par-${index}`}
                aria-hidden={!juntos}
                className={cn(
                  "absolute inset-0 font-onest text-[1.7rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-alapar-cereza transition-all duration-500 ease-out sm:text-[2.1rem] md:text-[2.5rem]",
                  juntos ? "translate-y-0 opacity-100 delay-100" : "translate-y-2 opacity-0"
                )}
              >
                {item.par}
              </p>
            </div>

            <p className={cn("mt-2 text-sm text-ink-muted transition-opacity duration-300", juntos ? "opacity-0" : "opacity-100")}>
              {canHover ? hintHover : hintTouch}
            </p>
          </div>

          {/* Figuras */}
          <div className="relative isolate order-1 mx-auto aspect-[877/449] w-full max-w-xs md:order-2 md:max-w-md">
            <Estallido
              className={cn(
                "absolute left-1/2 top-1/2 -z-10 w-[70%] -translate-x-1/2 -translate-y-1/2 text-alapar-ambar transition-all duration-700 ease-out",
                juntos ? "scale-100 rotate-12 opacity-90" : "scale-50 rotate-0 opacity-0"
              )}
            />
            <Image
              src="/alapar/figura-naranja.png"
              alt=""
              width={440}
              height={449}
              className={cn(
                "absolute left-0 top-0 h-full w-[50.2%] object-contain transition-all duration-700 ease-out",
                juntos ? "translate-x-0 opacity-100 grayscale-0" : "translate-x-[48%] opacity-70 grayscale"
              )}
            />
            <Image
              src="/alapar/figura-rosa.png"
              alt=""
              width={441}
              height={449}
              className={cn(
                "absolute right-0 top-0 h-full w-[50.2%] object-contain transition-all duration-700 ease-out",
                juntos ? "translate-x-0 scale-100 opacity-100" : "translate-x-[35%] scale-90 opacity-0"
              )}
            />
          </div>
        </div>
      </div>

      {/* Situaciones */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible" role="tablist" aria-label="Situaciones">
        {items.map((it, i) => (
          <button
            key={it.etiqueta}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => elegir(i)}
            onMouseEnter={canHover ? () => elegir(i) : undefined}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              i === index
                ? "border-alapar-cereza bg-alapar-cereza text-alapar-crema"
                : "border-alapar-cereza/20 bg-white text-ink-soft hover:border-alapar-cereza/60 hover:text-alapar-cereza"
            )}
          >
            {it.etiqueta}
          </button>
        ))}
      </div>

      {/* Versión completa para lectores de pantalla */}
      <ul className="sr-only">
        {items.map((it) => (
          <li key={it.solo}>
            {labelSolo}: {it.solo} {labelPar}: {it.par}
          </li>
        ))}
      </ul>
    </div>
  );
}
