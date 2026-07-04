"use client";

import { Heart } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

const DONAR_URL = "https://links.casacusia.org/donar";

/**
 * CTA de donación mensual para blog posts, podcast y páginas de contenido.
 * Variantes:
 * - "inline" (default): bloque mid-content, ancho completo
 * - "sidebar": compacto para ContentSidebar
 */
export function DonacionCTA({ variant = "inline" }: { variant?: "inline" | "sidebar" }) {
  function handleClick() {
    trackEvent("donation_cta_click", { variant, location: "content" });
  }

  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-surface-line bg-surface-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={18} className="text-rosa-dark shrink-0" aria-hidden />
          <h3 className="font-display text-sm font-extrabold text-ink">Doná mensualmente</h3>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          Con el valor de un café por mes ayudás a que más personas accedan a información
          gratuita sobre hipoacusia.
        </p>
        <a
          href={DONAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-verde-dark hover:underline underline-offset-2"
        >
          Quiero donar <span aria-hidden>→</span>
        </a>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-2xl bg-gradient-to-br from-rosa/10 via-amarillo/10 to-verde/10 border border-rosa/20 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-rosa/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rosa-dark mb-3">
            <Heart size={13} aria-hidden />
            Tu ayuda importa
          </div>
          <p className="font-display text-lg md:text-xl font-extrabold text-ink leading-snug">
            Ayudanos a seguir acercando información gratuita a más personas
          </p>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            Donar el valor de un café por mes puede cambiarle la vida a otra persona.
            Tu participación es indispensable para que sigamos sosteniendo esto.
          </p>
        </div>
        <a
          href={DONAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rosa text-white px-6 py-3 text-sm font-bold transition-transform hover:scale-105 shadow-md"
        >
          <Heart size={16} aria-hidden />
          Donar mensualmente
        </a>
      </div>
    </div>
  );
}
