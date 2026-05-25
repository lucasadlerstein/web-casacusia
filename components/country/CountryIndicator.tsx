"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useCountry } from "./CountryProvider";
import { PAISES_CONOCIDOS, banderaPais, nombrePais } from "@/lib/country";

const PAISES_ORDENADOS = Object.entries(PAISES_CONOCIDOS).map(([code, info]) => ({
  code,
  ...info
}));

export function CountryIndicator({ compact = false }: { compact?: boolean } = {}) {
  const { country, setCountry, isOverride } = useCountry();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onClick);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  const flag = banderaPais(country);
  const name = nombrePais(country);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`País detectado: ${name}. Hacé click para cambiar.`}
        className={`inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-surface-card text-ink hover:border-verde/50 transition-colors ${
          compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
        }`}
      >
        <span aria-hidden className="text-base leading-none">{flag}</span>
        {!compact && <span className="font-medium">{name}</span>}
        {isOverride && !compact && (
          <span className="text-[9px] uppercase tracking-wider text-ink-muted ml-0.5">manual</span>
        )}
        <ChevronDown size={compact ? 12 : 14} aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar país"
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-surface-line bg-surface-card shadow-xl z-50 overflow-hidden"
        >
          <div className="p-3 border-b border-surface-line">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Estás viendo desde</p>
            <p className="mt-0.5 font-semibold text-ink flex items-center gap-2">
              <span aria-hidden>{flag}</span>
              {name}
              {isOverride && (
                <span className="text-[10px] uppercase tracking-wider text-rosa font-bold ml-auto">override</span>
              )}
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Esto afecta qué eventos te mostramos primero y a qué link de donación te llevamos.
            </p>
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {PAISES_ORDENADOS.map((p) => {
              const isCurrent = country === p.code;
              return (
                <li key={p.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setCountry(p.code);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={isCurrent}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-bg transition-colors ${
                      isCurrent ? "bg-verde-soft/30 font-semibold" : ""
                    }`}
                  >
                    <span aria-hidden className="text-base leading-none">{p.bandera}</span>
                    <span className="flex-1">{p.nombre}</span>
                    {isCurrent && <Check size={14} className="text-verde-dark" aria-hidden />}
                  </button>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => {
                  setCountry(null);
                  setOpen(false);
                }}
                role="option"
                aria-selected={country === null}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-surface-bg transition-colors border-t border-surface-line ${
                  country === null ? "bg-verde-soft/30 font-semibold" : ""
                }`}
              >
                <Globe size={16} className="text-ink-muted" aria-hidden />
                <span className="flex-1">Resto del mundo</span>
                {country === null && <Check size={14} className="text-verde-dark" aria-hidden />}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
