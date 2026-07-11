"use client";

import { useState } from "react";

import { useCountry } from "@/components/country/CountryProvider";
import { MONEDAS, MONEDAS_ORDEN, monedaPorPais, type Moneda } from "@/lib/donaciones";

// Un color de marca por posición, para mantener el look de las tarjetas.
const CARD_COLORS = [
  "border-verde/30 bg-verde-soft text-verde-dark hover:border-verde",
  "border-rosa/30 bg-rosa-soft text-rosa-dark hover:border-rosa",
  "border-violeta/30 bg-violeta-soft text-violeta-dark hover:border-violeta"
];

export function GraciasDonarCards() {
  const { country } = useCountry();
  const [moneda, setMoneda] = useState<Moneda>(() => monedaPorPais(country));
  const cfg = MONEDAS[moneda];
  // ARS es suscripción mensual; USD/MXN abren el pago por única vez.
  const periodicidad = cfg.usaPayPal ? "única vez" : "por mes";

  return (
    <div>
      {/* Toggle de moneda */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border border-surface-line bg-surface-bg p-1">
          {MONEDAS_ORDEN.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMoneda(key)}
              aria-pressed={moneda === key}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                moneda === key ? "bg-ink text-white shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              {MONEDAS[key].codigo}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de monto — link directo al pago */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3 text-left">
        {cfg.montos.map((m, idx) => (
          <a
            key={m.valor}
            href={m.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative rounded-2xl border-2 p-5 transition-all hover:shadow-md hover:-translate-y-1 ${
              CARD_COLORS[idx] ?? CARD_COLORS[0]
            } ${m.destacado ? "ring-2 ring-rosa/40" : ""}`}
          >
            {m.destacado && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                Más elegido
              </span>
            )}
            <p className="font-display text-2xl font-extrabold leading-none">${m.valor}</p>
            <p className="mt-1.5 text-xs font-semibold opacity-80">
              {cfg.codigo} · {periodicidad}
            </p>
          </a>
        ))}
      </div>

      {/* Única vez con monto libre (solo ARS; en USD/MXN las tarjetas ya son única vez) */}
      {cfg.otroMontoHref && (
        <div className="mt-4 text-center">
          <a
            href={cfg.unicaVezHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
          >
            Prefiero donar por única vez
          </a>
        </div>
      )}
    </div>
  );
}
