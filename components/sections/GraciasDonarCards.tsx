"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useCountry } from "@/components/country/CountryProvider";
import { PayPalSubscribeButton } from "@/components/sections/PayPalSubscribeButton";
import { MONEDAS, MONEDAS_ORDEN, monedaPorPais, type Moneda } from "@/lib/donaciones";

// Un color de marca por posición, para mantener el look limpio de las tarjetas.
const CARD_COLORS = [
  "border-verde/30 bg-verde-soft text-verde-dark",
  "border-rosa/30 bg-rosa-soft text-rosa-dark",
  "border-violeta/30 bg-violeta-soft text-violeta-dark"
];

export function GraciasDonarCards() {
  const { country } = useCountry();
  const router = useRouter();
  const [moneda, setMoneda] = useState<Moneda>(() => monedaPorPais(country));
  const [selectedIdx, setSelectedIdx] = useState(1);
  const cfg = MONEDAS[moneda];
  const selectedMonto = cfg.montos[selectedIdx] ?? cfg.montos[1];

  const handlePayPalSuccess = useCallback(() => {
    setTimeout(() => router.push("/sumate/donar/gracias?from=paypal"), 900);
  }, [router]);

  return (
    <div>
      {/* Tarjetas de monto */}
      <div className="grid gap-4 sm:grid-cols-3 text-left">
        {cfg.montos.map((m, idx) => {
          const color = CARD_COLORS[idx] ?? CARD_COLORS[0];
          const cardBase = `relative rounded-2xl border-2 p-5 transition-all ${color}`;

          const content = (
            <>
              {m.destacado && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Más elegido
                </span>
              )}
              <p className="font-display text-2xl font-extrabold leading-none">${m.valor}</p>
              <p className="mt-1.5 text-xs font-semibold opacity-80">{cfg.codigo} / mes</p>
            </>
          );

          // USD/MXN: la tarjeta selecciona el plan y abajo aparece el botón de PayPal.
          if (cfg.usaPayPal) {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={m.valor}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                aria-pressed={isSelected}
                className={`${cardBase} text-left ${
                  isSelected ? "ring-2 ring-ink/50 shadow-md" : "opacity-60 hover:opacity-100"
                }`}
              >
                {content}
              </button>
            );
          }

          // ARS: link directo al checkout mensual de MercadoPago.
          return (
            <a
              key={m.valor}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${cardBase} hover:shadow-md hover:-translate-y-1 ${
                m.destacado ? "ring-2 ring-rosa/40" : ""
              }`}
            >
              {content}
            </a>
          );
        })}
      </div>

      {/* Botón PayPal Subscribe — solo USD/MXN, para el monto seleccionado */}
      {cfg.usaPayPal && selectedMonto?.planId && (
        <PayPalSubscribeButton planId={selectedMonto.planId} onSuccess={handlePayPalSuccess} />
      )}

      {/* Toggle de moneda */}
      <div className="mt-5 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-surface-line bg-surface-bg p-1">
          {MONEDAS_ORDEN.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMoneda(key);
                setSelectedIdx(1);
              }}
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

      {/* Secundario: otro monto (ARS) o única vez (USD/MXN) */}
      <div className="mt-4 text-center">
        <a
          href={cfg.otroMontoHref ?? cfg.unicaVezHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-verde-dark underline decoration-verde/40 underline-offset-4 transition-colors hover:decoration-verde"
        >
          {cfg.otroMontoHref ? "Donar otro monto" : "Prefiero donar por única vez"}
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
