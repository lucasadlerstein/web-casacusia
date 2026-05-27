"use client";

import { useCountry } from "@/components/country/CountryProvider";
import { HandHeart, ArrowRight } from "lucide-react";

const LINK_AR = "https://link.mercadopago.com.ar/casacusia";
const LINK_INTL = "https://donar.casacusia.org";

/**
 * Bloque "Hacé clic acá si sos de Argentina o acá si sos de otro lugar del mundo".
 * Si detectamos país, destaca el botón correspondiente.
 */
export function CountryAwareDonateCTA() {
  const { country } = useCountry();
  const esAR = country === "AR";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a
        href={LINK_AR}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-all ${
          esAR
            ? "bg-verde-dark text-white shadow-lg hover:bg-[#0a6b42]"
            : "border border-surface-line bg-surface-card text-ink hover:border-verde-dark"
        }`}
      >
        <HandHeart size={16} aria-hidden />
        Donar desde Argentina
        <ArrowRight size={14} aria-hidden />
      </a>
      <a
        href={LINK_INTL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-bold transition-all ${
          !esAR
            ? "bg-verde-dark text-white shadow-lg hover:bg-[#0a6b42]"
            : "border border-surface-line bg-surface-card text-ink hover:border-verde-dark"
        }`}
      >
        <HandHeart size={16} aria-hidden />
        Donar desde otro país
        <ArrowRight size={14} aria-hidden />
      </a>
    </div>
  );
}
