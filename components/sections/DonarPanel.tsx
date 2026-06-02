"use client";

import { useState } from "react";

import { useCountry } from "@/components/country/CountryProvider";
import { TestimonioRotativo } from "@/components/sections/TestimonioRotativo";
import {
  MONEDAS,
  MONEDAS_ORDEN,
  DEDUCCION_MAILTO,
  monedaPorPais,
  type Moneda
} from "@/lib/donaciones";
import type { Testimonio } from "@/lib/content";

export function DonarPanel({ testimonios }: { testimonios: Testimonio[] }) {
  const { country } = useCountry();
  // País detectado en silencio: AR→ARS, MX→MXN, resto→USD (sin avisar al visitante).
  const [moneda, setMoneda] = useState<Moneda>(() => monedaPorPais(country));
  const cfg = MONEDAS[moneda];

  return (
    <div className="bg-surface-card rounded-3xl border border-surface-line shadow-md p-7 md:p-9">
      {/* 1. Título */}
      <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink leading-snug">
        ¡Sumate hoy! <span className="text-verde">Tu apoyo lo hace posible.</span>
      </h2>

      {/* 2. Label */}
      <p className="mt-2 text-sm text-ink-soft">
        Elegí tu aporte mensual. Lo das de baja cuando quieras.
      </p>

      {/* 3. Montos — uno al lado del otro, solo el número + moneda */}
      <div className="mt-6 grid grid-cols-3 gap-2.5">
        {cfg.montos.map((m) => (
          <a
            key={m.valor}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-5 transition-colors ${
              m.destacado
                ? "border-verde bg-verde-soft"
                : "border-surface-line bg-surface-bg hover:border-verde hover:bg-verde-soft/50"
            }`}
          >
            {m.destacado && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Más elegido
              </span>
            )}
            <span className="font-display text-2xl md:text-[1.7rem] font-extrabold leading-none text-ink transition-colors group-hover:text-verde-dark">
              {m.valor}
            </span>
            <span className="mt-1.5 text-[11px] font-semibold text-ink-muted">
              {cfg.codigo} / mes
            </span>
          </a>
        ))}
      </div>

      {/* 4. Toggle de moneda — discreto, centrado */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {MONEDAS_ORDEN.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMoneda(key)}
            aria-pressed={moneda === key}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              moneda === key ? "bg-ink/90 text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            {MONEDAS[key].codigo}
          </button>
        ))}
      </div>

      {/* 5. Donar otro monto — como texto */}
      <div className="mt-3 text-center">
        <a
          href={cfg.otroMontoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-verde-dark underline decoration-verde/40 underline-offset-4 transition-colors hover:decoration-verde"
        >
          Donar otro monto
        </a>
      </div>

      {/* 6. Testimonios rotativos */}
      {testimonios.length > 0 && (
        <div className="mt-7">
          <TestimonioRotativo testimonios={testimonios} />
        </div>
      )}

      {/* 7. Donar por única vez */}
      <div className="mt-6 text-center">
        <a
          href={cfg.unicaVezHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-line bg-surface-bg px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-ink/30 hover:bg-surface-tint"
        >
          Quiero donar por única vez
        </a>
      </div>

      {/* 8. Nota de deducción de Ganancias */}
      <p className="mt-5 text-center text-xs leading-relaxed text-ink-muted">
        ¿Donás desde Argentina y querés deducir de Ganancias?{" "}
        <a
          href={DEDUCCION_MAILTO}
          className="font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          Escribinos
        </a>{" "}
        y te ayudamos.
      </p>
    </div>
  );
}
