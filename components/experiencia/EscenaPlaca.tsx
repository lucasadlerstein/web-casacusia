"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ExperienciaContent, ExperienciaEfecto } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { CabezaDibujo } from "./Cabeza";
import { esAguda } from "./Frase";
import { estiloAcento } from "./ui";

type Viaje = ExperienciaContent["viaje"];

const DURACION = 6500;

/** Orden de la placa: de la pérdida que menos deja entender a la frase sin pérdida. */
const ORDEN: ExperienciaEfecto[] = ["lejana", "recortada", "unLado", "atenuada", "clara"];

/**
 * Cómo queda cada letra con cada pérdida. La frase nunca cambia de lugar:
 * lo que cambia es qué letras llegan, y eso se ve pasar letra por letra.
 */
function estiloLetra(efecto: ExperienciaEfecto, aguda: boolean, posicion: number): CSSProperties {
  switch (efecto) {
    case "atenuada":
      return { opacity: 0.28, filter: "blur(1.5px)" };
    case "recortada":
      return aguda ? { opacity: 0.06, filter: "blur(2px)" } : { opacity: 1 };
    case "unLado": {
      const lejos = Math.min(1, Math.max(0, (posicion - 0.38) / 0.3));
      return { opacity: 1 - lejos * 0.95, filter: `blur(${(lejos * 2.5).toFixed(1)}px)` };
    }
    case "lejana":
      return aguda ? { opacity: 0.04, filter: "blur(3px)" } : { opacity: 0.32, filter: "blur(1.2px)" };
    default:
      return { opacity: 1, filter: "blur(0px)" };
  }
}

/** Prueba: una sola placa grande que va pasando por cada pérdida. */
export function EscenaPlaca({ viaje }: { viaje: Viaje }) {
  // De la que menos se entiende a la que más: arranca casi sin frase y termina en la frase entera.
  const escenas = [...viaje.estaciones].sort((a, b) => ORDEN.indexOf(a.efecto) - ORDEN.indexOf(b.efecto));
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setQuieto(m.matches);
  }, []);

  useEffect(() => {
    if (pausa || quieto) return;
    const t = window.setTimeout(() => setIndice((i) => (i + 1) % escenas.length), DURACION);
    return () => window.clearTimeout(t);
  }, [indice, pausa, quieto, escenas.length]);

  const e = escenas[indice]!;
  const frase = viaje.frase;
  // Las letras se animan de a una, pero agrupadas por palabra para que ninguna se corte al final de la línea.
  const enPalabras = (texto: string) =>
    texto.split(" ").reduce<{ texto: string; desde: number }[]>((acc, t) => {
      const anterior = acc[acc.length - 1];
      acc.push({ texto: t, desde: anterior ? anterior.desde + anterior.texto.length + 1 : 0 });
      return acc;
    }, []);

  return (
    <div
      style={estiloAcento(e.acento)}
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      onFocus={() => setPausa(true)}
      onBlur={() => setPausa(false)}
      className="relative overflow-hidden rounded-[2rem] border border-exp-crema/10 bg-exp-panel"
    >
      {/* El color de la escena tiñe la placa, apenas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{ background: "radial-gradient(ellipse 70% 60% at 85% 40%, color-mix(in srgb, var(--acento) 16%, transparent), transparent 70%)" }}
      />

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_15rem] lg:gap-12 lg:p-14">
        <div className="min-w-0">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-exp-crema/60 md:text-xs">
            <span className="text-[color:var(--acento)] transition-colors duration-700">
              {String(indice + 1).padStart(2, "0")} / {String(escenas.length).padStart(2, "0")}
            </span>
            <span className="mx-2 text-exp-crema/30">·</span>
            {e.lugar}
          </p>

          {/* La frase, enorme y quieta: lo que se mueve es cuánto llega de cada letra. */}
          <div aria-hidden="true" className="mt-6 min-h-[2.5em] font-display text-[2.1rem] font-bold leading-[1.15] tracking-[-0.015em] text-exp-crema sm:text-5xl lg:text-[3.6rem]">
            <FraseLetras texto={frase} estilo={(i, aguda) => estiloLetra(e.efecto, aguda, i / frase.length)} enPalabras={enPalabras} />
          </div>
          <p className="sr-only" aria-live="polite">
            {e.titulo}. «{frase}» {e.descripcionAccesible}
          </p>

          <h2 className="mt-8 font-display text-2xl font-extrabold text-exp-crema md:text-3xl">{e.titulo}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-exp-crema/75 md:text-lg">{e.texto}</p>
        </div>

        <div className="mx-auto w-28 sm:w-36 lg:mx-0 lg:w-full lg:self-center" aria-hidden="true">
          <CabezaDibujo efecto={e.efecto} leyenda={e.cabeza ?? ""} siempreBarras />
        </div>
      </div>

      {/* Las escenas como pestañas: la activa se va llenando hasta pasar a la próxima. */}
      <div role="tablist" aria-label="Escenas" className="relative grid grid-cols-5 border-t border-exp-crema/10">
        {escenas.map((x, i) => {
          const activa = i === indice;
          return (
            <button
              key={x.id}
              role="tab"
              type="button"
              aria-selected={activa}
              onClick={() => setIndice(i)}
              style={estiloAcento(x.acento)}
              className={cn(
                "relative min-h-[48px] overflow-hidden px-2 py-3 text-center font-display text-sm sm:text-left sm:min-h-[56px] font-bold leading-tight transition-colors sm:px-4",
                activa ? "text-exp-crema" : "text-exp-crema/45 hover:text-exp-crema/80",
                i > 0 && "border-l border-exp-crema/10"
              )}
            >
              <span className="relative z-10 sm:hidden">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative z-10 max-sm:hidden">
                {x.efecto === "clara" ? "Sin pérdida" : x.titulo.replace("Sordera ", "")}
              </span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-exp-crema/10" />
              {activa && (
                <span
                  key={`${indice}-${pausa}`}
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[3px] bg-[color:var(--acento)]"
                  style={
                    quieto || pausa
                      ? { width: "100%" }
                      : { width: "0%", animation: `exp-llenar ${DURACION}ms linear forwards` }
                  }
                />
              )}
            </button>
          );
        })}
      </div>
      <style>{`@keyframes exp-llenar { to { width: 100%; } }`}</style>
    </div>
  );
}

/** Una frase letra por letra, agrupada por palabra para que ninguna se corte al final de la línea. */
function FraseLetras({
  texto,
  estilo,
  enPalabras,
  className,
  demora = 0
}: {
  texto: string;
  estilo: (i: number, aguda: boolean) => CSSProperties;
  enPalabras: (t: string) => { texto: string; desde: number }[];
  className?: string;
  demora?: number;
}) {
  const palabras = enPalabras(texto);
  return (
    <p className={className}>
      {palabras.map((palabra, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(palabra.texto).map((letra, k) => {
            const i = palabra.desde + k;
            return (
              <span
                key={i}
                className="inline-block transition-[opacity,filter,transform] duration-[900ms] ease-out motion-reduce:transition-none"
                style={{ ...estilo(i, esAguda(texto, i)), transitionDelay: `${demora + i * 30}ms` }}
              >
                {letra}
              </span>
            );
          })}
          {w < palabras.length - 1 && "\u00a0"}
        </span>
      ))}
    </p>
  );
}
