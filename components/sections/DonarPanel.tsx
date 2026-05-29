"use client";

import { useState } from "react";
import { ArrowRight, Globe } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { TestimonioRotativo } from "@/components/sections/TestimonioRotativo";
import type { Testimonio } from "@/lib/content";

export type MontoOpcion = { label: string; href: string; nota?: string };

export function DonarPanel({
  montos,
  otroHref,
  testimonios
}: {
  montos: MontoOpcion[];
  otroHref: string;
  testimonios: Testimonio[];
}) {
  const [moneda, setMoneda] = useState<"ars" | "intl">("ars");

  return (
    <div className="bg-surface-card rounded-3xl border border-surface-line shadow-sm p-7 md:p-9">
      <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink leading-snug">
        Sumate mensualmente para que menos personas transiten su hipoacusia en soledad
      </h2>

      {/* Switch de moneda */}
      <div className="mt-6 inline-flex rounded-full border border-surface-line bg-surface-bg p-1">
        <button
          type="button"
          onClick={() => setMoneda("ars")}
          aria-pressed={moneda === "ars"}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
            moneda === "ars" ? "bg-verde-dark text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          🇦🇷 Pesos (ARS)
        </button>
        <button
          type="button"
          onClick={() => setMoneda("intl")}
          aria-pressed={moneda === "intl"}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
            moneda === "intl" ? "bg-verde-dark text-white" : "text-ink-soft hover:text-ink"
          }`}
        >
          <Globe size={14} aria-hidden /> USD / MXN
        </button>
      </div>

      {moneda === "ars" ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {montos.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-surface-line bg-surface-bg px-4 py-5 hover:border-verde-dark hover:bg-verde-soft/40 transition-colors group"
              >
                <span className="font-display text-2xl font-extrabold text-ink group-hover:text-verde-dark transition-colors">
                  {m.label}
                </span>
                <span className="text-xs text-ink-muted">/ mes</span>
              </a>
            ))}
            <a
              href={otroHref}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-verde-dark/40 bg-surface-bg px-4 py-4 text-sm font-bold text-verde-dark hover:bg-verde-soft/40 transition-colors"
            >
              Otro monto
              <ArrowRight size={14} aria-hidden />
            </a>
          </div>
          <p className="mt-3 text-center text-xs text-ink-muted">
            Es una suscripción mensual. La das de baja cuando quieras.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-surface-line bg-surface-bg p-6 text-center">
          <p className="text-ink-soft text-sm leading-relaxed">
            Estamos habilitando las donaciones en <strong>USD</strong> y <strong>MXN</strong>.
            Escribinos y te avisamos apenas estén listas.
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-2.5 text-sm font-bold hover:bg-ink-soft transition-colors"
          >
            Quiero donar desde el exterior
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      )}

      {/* Testimonios rotativos */}
      {testimonios.length > 0 && (
        <div className="mt-8 pt-6 border-t border-surface-line">
          <TestimonioRotativo testimonios={testimonios} />
        </div>
      )}
    </div>
  );
}
