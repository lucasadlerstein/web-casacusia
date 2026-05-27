"use client";

import { useEffect, useRef, useState } from "react";
import { HandHeart, Megaphone, Users, X } from "lucide-react";
import { useCountry } from "@/components/country/CountryProvider";
import { urlDonar } from "@/lib/country";

/**
 * Botón "Quiero donar" que abre un dialog con dos causas:
 *   - Concientizar
 *   - Que menos personas se sientan solas
 *
 * Cada opción lleva a la página de donación con un query param `cause=X`
 * para trackear más adelante.
 */
export function DonateChoiceButton({
  className,
  label
}: {
  className?: string;
  label?: string;
}) {
  const { country } = useCountry();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const baseUrl = urlDonar(country);
  const sep = baseUrl.includes("?") ? "&" : "?";
  const linkConcientizar = `${baseUrl}${sep}cause=concientizar`;
  const linkConectar = `${baseUrl}${sep}cause=conectar`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-full bg-rosa text-white hover:bg-rosa-dark transition-colors text-base px-6 py-3 font-bold shadow-md"
        }
      >
        <HandHeart size={18} aria-hidden />
        {label ?? "Quiero donar para que menos personas se sientan solas"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-choice-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div ref={dialogRef} className="relative w-full max-w-lg rounded-3xl bg-surface-bg p-7 md:p-9 shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-surface-tint hover:text-ink"
            >
              <X size={18} aria-hidden />
            </button>

            <h3 id="donate-choice-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight pr-8">
              ¿Para qué querés donar?
            </h3>
            <p className="mt-2 text-ink-soft">
              Tu aporte puede ir a uno de estos dos focos. Elegí el que más resuene con vos.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={linkConectar}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border-2 border-verde-dark/30 bg-surface-card p-5 hover:border-verde-dark transition-colors"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-verde-soft text-verde-dark">
                  <Users size={20} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    Para que menos personas se sientan solas
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Sostener encuentros, red de familias y la comunidad de WhatsApp.
                  </p>
                </div>
              </a>

              <a
                href={linkConcientizar}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border-2 border-rosa/30 bg-surface-card p-5 hover:border-rosa-dark transition-colors"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rosa-soft text-rosa-dark">
                  <Megaphone size={20} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    Para concientizar sobre la hipoacusia
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Producir podcast, contenido, charlas y campañas que lleguen a más personas.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
