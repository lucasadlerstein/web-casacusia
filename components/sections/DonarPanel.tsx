"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export function DonarPanel({ testimonios }: { testimonios: Testimonio[] }) {
  const { country } = useCountry();
  const router = useRouter();
  const [moneda, setMoneda] = useState<Moneda>(() => monedaPorPais(country));
  const [selectedIdx, setSelectedIdx] = useState(1); // default: el del medio (destacado)
  const cfg = MONEDAS[moneda];
  const selectedMonto = cfg.montos[selectedIdx] ?? cfg.montos[1];

  const handlePayPalSuccess = useCallback(() => {
    setTimeout(() => router.push("/sumate/donar/gracias?from=paypal"), 900);
  }, [router]);

  return (
    <div className="bg-surface-card rounded-3xl border border-surface-line shadow-md p-7 md:p-9">
      {/* 1. Mensaje emocional primero */}
      <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink leading-snug">
        No debería ser un privilegio <span className="text-amarillo-dark">escuchar</span>.
      </h2>
      <p className="mt-3 text-sm md:text-base text-ink-soft leading-relaxed">
        Tu aporte mensual permite que más personas con pérdida auditiva accedan a comunidad, información y acompañamiento.
      </p>

      {/* 2. Testimonios rotativos */}
      {testimonios.length > 0 && (
        <div className="mt-5">
          <TestimonioRotativo testimonios={testimonios} />
        </div>
      )}

      {/* 3. Separador */}
      <div className="mt-7 mb-6 border-t border-surface-line" />

      {/* 4. Elegí tu aporte */}
      <p className="font-display text-base font-bold text-ink">
        Elegí tu aporte mensual
      </p>
      <p className="mt-1 text-xs text-ink-muted">
        Lo das de baja cuando quieras.
      </p>

      {/* 5. Montos — botones para PayPal, links para ARS */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {cfg.montos.map((m, idx) => {
          const isSelected = cfg.usaPayPal ? idx === selectedIdx : false;
          const baseClass = `group relative flex flex-col items-center justify-center rounded-2xl border-2 px-2 py-5 transition-colors`;
          const activeClass = (m.destacado || isSelected)
            ? "border-verde bg-verde-soft"
            : "border-surface-line bg-surface-bg hover:border-verde hover:bg-verde-soft/50";

          if (cfg.usaPayPal) {
            return (
              <button
                key={m.valor}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`${baseClass} ${isSelected ? "border-verde bg-verde-soft ring-2 ring-verde/30" : activeClass}`}
              >
                {m.destacado && !isSelected && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-verde px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Más elegido
                  </span>
                )}
                <span className="font-display text-2xl md:text-[1.7rem] font-extrabold leading-none text-ink">
                  {m.valor}
                </span>
                <span className="mt-1.5 text-[11px] font-semibold text-ink-muted">
                  {cfg.codigo} / mes
                </span>
              </button>
            );
          }

          return (
            <a
              key={m.valor}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${baseClass} ${activeClass}`}
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
          );
        })}
      </div>

      {/* 6. Botón PayPal (solo USD/MXN) */}
      {cfg.usaPayPal && selectedMonto?.planId && (
        <PayPalSubscribeButton
          planId={selectedMonto.planId}
          onSuccess={handlePayPalSuccess}
        />
      )}

      {/* 7. Toggle de moneda */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {MONEDAS_ORDEN.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => { setMoneda(key); setSelectedIdx(1); }}
            aria-pressed={moneda === key}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              moneda === key ? "bg-ink/90 text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            {MONEDAS[key].codigo}
          </button>
        ))}
      </div>

      {/* 8. Donar otro monto (solo ARS) */}
      {cfg.otroMontoHref && (
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
      )}

      {/* 9. Donar por única vez */}
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

      {/* 10. Nota de deducción de Ganancias */}
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
