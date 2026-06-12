"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { useCountry } from "@/components/country/CountryProvider";
import { TestimonioRotativo } from "@/components/sections/TestimonioRotativo";
import { PayPalSubscribeButton } from "@/components/sections/PayPalSubscribeButton";
import {
  MONEDAS,
  MONEDAS_ORDEN,
  DEDUCCION_MAILTO,
  monedaPorPais,
  type Moneda
} from "@/lib/donaciones";
import type { Testimonio } from "@/lib/content";

const DONANTES_ACTUAL = 97;
const DONANTES_META = 150;
const PROGRESS_PCT = Math.round((DONANTES_ACTUAL / DONANTES_META) * 100);

export function DonarPanel({ testimonios }: { testimonios: Testimonio[] }) {
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
    <div className="bg-surface-card rounded-3xl border border-surface-line shadow-md p-7 md:p-9">
      {/* 1. Título */}
      <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink leading-snug">
        ¡Sumate hoy! <span className="text-verde">Tu apoyo lo hace posible.</span>
      </h2>

      {/* 2. Contador con barra de progreso */}
      <div className="mt-5 rounded-2xl bg-gradient-to-r from-verde-dark via-verde to-violeta p-5 text-white">
        <div className="text-center">
          <p className="font-display text-4xl md:text-5xl font-extrabold leading-none">
            {DONANTES_ACTUAL} <span className="text-lg md:text-xl font-semibold text-white/70">/ {DONANTES_META}</span>
          </p>
          <p className="mt-1 text-sm text-white/80">personas donan un café al mes</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000"
            style={{ width: `${PROGRESS_PCT}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-white/70">
          Queremos llegar a <strong className="text-white">{DONANTES_META}</strong>. ¿Te sumás?
        </p>
      </div>

      {/* 3. Label */}
      <p className="mt-6 text-sm text-ink-soft">
        Elegí tu aporte mensual. Lo das de baja cuando quieras.
      </p>

      {/* 4. Montos */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {cfg.montos.map((m, idx) => {
          const isSelected = cfg.usaPayPal ? idx === selectedIdx : false;
          const isHighlighted = cfg.usaPayPal ? isSelected : m.destacado;
          const baseClass = "group relative flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-5 transition-all";

          const content = (
            <>
              {m.destacado && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Más elegido
                </span>
              )}
              <span className={`font-display text-2xl md:text-[1.7rem] font-extrabold leading-none ${isHighlighted ? "text-verde-dark" : "text-ink"}`}>
                ${m.valor}
              </span>
              <span className="mt-1.5 text-[11px] font-semibold text-ink-muted">
                {cfg.codigo} / mes
              </span>
            </>
          );

          if (cfg.usaPayPal) {
            return (
              <button
                key={m.valor}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`${baseClass} ${isSelected ? "border-verde bg-verde-soft shadow-sm" : "border-surface-line bg-surface-bg hover:border-verde/50"}`}
              >
                {content}
              </button>
            );
          }

          return (
            <a
              key={m.valor}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClass} ${isHighlighted ? "border-verde bg-verde-soft" : "border-surface-line bg-surface-bg hover:border-verde/50"}`}
            >
              {content}
            </a>
          );
        })}
      </div>

      {/* 5. Botón PayPal Subscribe (solo USD/MXN) */}
      {cfg.usaPayPal && selectedMonto?.planId && (
        <PayPalSubscribeButton
          planId={selectedMonto.planId}
          onSuccess={handlePayPalSuccess}
        />
      )}

      {/* 6. Toggle de moneda — pill style */}
      <div className="mt-5 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-surface-line bg-surface-bg p-1">
          {MONEDAS_ORDEN.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => { setMoneda(key); setSelectedIdx(1); }}
              aria-pressed={moneda === key}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                moneda === key
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {MONEDAS[key].codigo}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Donar otro monto (solo ARS) */}
      {cfg.otroMontoHref && (
        <div className="mt-4 text-center">
          <a
            href={cfg.otroMontoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-verde-dark underline decoration-verde/40 underline-offset-4 transition-colors hover:decoration-verde"
          >
            Donar otro monto <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* 8. Testimonio rotativo */}
      {testimonios.length > 0 && (
        <div className="mt-6">
          <TestimonioRotativo testimonios={testimonios} />
        </div>
      )}

      {/* 9. Donar por única vez */}
      <div className="mt-6 text-center">
        <a
          href={cfg.unicaVezHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink transition-colors"
        >
          Quiero donar por única vez (elegís el monto)
        </a>
      </div>

      {/* 10. Nota de deducción */}
      <div className="mt-5 rounded-xl border border-amarillo/30 bg-amarillo-soft/30 px-4 py-3 text-center">
        <p className="text-xs leading-relaxed text-ink">
          <strong>Tu donación es deducible de Ganancias.</strong>{" "}
          Casacusia tiene la aprobación de ARCA (ex-AFIP).{" "}
          <a
            href={DEDUCCION_MAILTO}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-verde-dark underline underline-offset-2 hover:text-[#0a6b42]"
          >
            Escribinos para deducir
          </a>
        </p>
      </div>
    </div>
  );
}
