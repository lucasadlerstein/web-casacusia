"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * La cabeza que acompaña el recorrido: queda fija mientras las estaciones
 * pasan, y sus orejas cuentan la estación. Se mueve al lado contrario del
 * texto en pantallas grandes; en celular es chica y va arriba a la derecha.
 */

type Estado = { efecto: string; leyenda: string };

/** Cuánto se ve cada oreja (izquierda, derecha) y cómo, por efecto. */
const OREJAS: Record<string, { izq: number; der: number; tapon: number; ondas: number }> = {
  clara: { izq: 1, der: 1, tapon: 0, ondas: 1 },
  atenuada: { izq: 0.5, der: 0.5, tapon: 1, ondas: 0.5 },
  recortada: { izq: 0.6, der: 0.6, tapon: 0, ondas: 0.6 },
  unLado: { izq: 1, der: 0, tapon: 0, ondas: 1 },
  lejana: { izq: 0.22, der: 0.22, tapon: 0, ondas: 0.3 },
  rumia: { izq: 0.6, der: 0.6, tapon: 0, ondas: 0 },
  latido: { izq: 1, der: 1, tapon: 0, ondas: 1 }
};

export function Cabeza() {
  const [estado, setEstado] = useState<Estado>({ efecto: "clara", leyenda: "" });

  useEffect(() => {
    const paneles = Array.from(document.querySelectorAll<HTMLElement>("[data-viaje] [data-estacion]"));
    if (paneles.length === 0) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          setEstado({ efecto: el.dataset.efecto ?? "clara", leyenda: el.dataset.cabeza ?? "" });
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    paneles.forEach((p) => obs.observe(p));
    return () => obs.disconnect();
  }, []);

  const o = OREJAS[estado.efecto] ?? OREJAS.clara!;
  const transicion = "transition-[opacity,transform] duration-700 ease-out";

  return (
    <div
      className="absolute right-4 top-28 w-20 md:top-24 md:w-28 lg:right-[9%] lg:top-1/2 lg:w-[min(20vw,260px)] lg:-translate-y-1/2"
      data-efecto={estado.efecto}
    >
      <svg viewBox="0 0 200 220" className="h-auto w-full" fill="none" stroke="rgb(var(--exp-crema-rgb) / 0.8)" strokeWidth={2.5}>
        {/* Las ondas que llegan, de los dos lados. */}
        <g style={{ opacity: o.ondas }} className={transicion}>
          <g className="motion-safe:animate-exp-onda" style={{ transformOrigin: "0px 110px" }}>
            <path d="M14 92a30 30 0 0 1 0 36" />
            <path d="M4 82a46 46 0 0 1 0 56" strokeOpacity={0.5} />
          </g>
        </g>
        {/* La cabeza: contorno simple, de frente. */}
        <path d="M100 18c-38 0-62 30-62 70 0 44 24 84 62 84s62-40 62-84c0-40-24-70-62-70z" />
        <path d="M78 176c0 16-4 26-12 34M122 176c0 16 4 26 12 34" strokeOpacity={0.5} />
        {/* Ojos cerrados: en la sala está oscuro, se escucha. */}
        <path d="M74 96q10 6 20 0M106 96q10 6 20 0" strokeOpacity={0.7} />
        {/* Oreja izquierda */}
        <g style={{ opacity: o.izq }} className={transicion}>
          <path d="M40 92c-10-2-18 6-18 18s8 22 18 20" fill="rgb(var(--exp-crema-rgb) / 0.25)" />
          <path d="M28 104c3-4 8-4 10 0s0 10-4 12" strokeOpacity={0.6} />
          <circle cx="30" cy="110" r="5" fill="rgb(var(--exp-noche-rgb))" style={{ opacity: o.tapon }} className={transicion} />
        </g>
        {/* Oreja derecha */}
        <g style={{ opacity: o.der }} className={transicion}>
          <path d="M160 92c10-2 18 6 18 18s-8 22-18 20" fill="rgb(var(--exp-crema-rgb) / 0.25)" />
          <path d="M172 104c-3-4-8-4-10 0s0 10 4 12" strokeOpacity={0.6} />
          <circle cx="170" cy="110" r="5" fill="rgb(var(--exp-noche-rgb))" style={{ opacity: o.tapon }} className={transicion} />
        </g>
        {/* Pensamientos, solo en «por dentro». */}
        <g style={{ opacity: estado.efecto === "rumia" ? 1 : 0 }} className={transicion} strokeOpacity={0.7}>
          <circle cx="150" cy="30" r="4" /><circle cx="166" cy="16" r="7" /><circle cx="186" cy="0" r="10" />
        </g>
      </svg>
      {/* Lo que llega a cada oído, sin números: la pérdida auditiva no se mide así de simple. */}
      <div className="mt-2 hidden lg:block">
        <div className="flex items-center justify-between gap-3">
          <Barra nivel={o.izq} recortada={estado.efecto === "recortada"} />
          <Barra nivel={o.der} recortada={estado.efecto === "recortada"} />
        </div>
        <p
          className={cn(
            "mt-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-exp-crema/60 transition-opacity duration-500",
            estado.leyenda ? "opacity-100" : "opacity-0"
          )}
        >
          {estado.leyenda || "\u00a0"}
        </p>
      </div>
    </div>
  );
}

/** Una barra por oído: cuánto del sonido llega. Con pérdida de agudos, la barra queda punteada. */
function Barra({ nivel, recortada }: { nivel: number; recortada: boolean }) {
  return (
    <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-exp-crema/15">
      <span
        className={cn("absolute inset-y-0 left-0 rounded-full bg-exp-crema/80 transition-[width] duration-700 ease-out", recortada && "bg-[repeating-linear-gradient(90deg,rgb(var(--exp-crema-rgb)/0.8)_0_6px,transparent_6px_10px)]")}
        style={{ width: `${Math.round(nivel * 100)}%` }}
      />
    </span>
  );
}
