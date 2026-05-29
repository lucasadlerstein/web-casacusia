"use client";

import { HandHeart, ArrowRight } from "lucide-react";
import { useCountry } from "@/components/country/CountryProvider";
import { urlDonar } from "@/lib/country";
import { DONACION_AR } from "@/lib/donaciones";

/**
 * Botón "Donar por única vez" que rutea al checkout correcto según país:
 * - Argentina → MercadoPago (link cafe.casacusia.org)
 * - Resto del mundo → donar.casacusia.org
 *
 * Si `mensual` es true, ofrece el botón ÚNICO genérico — para AR usa el link
 * de MercadoPago de un pago único, no del plan.
 */
export function DonateOnceButton({
  variant = "primary",
  label
}: {
  variant?: "primary" | "ghost";
  label?: string;
}) {
  const { country } = useCountry();
  const href = country === "AR"
    ? DONACION_AR.unicaVez
    : urlDonar(country);

  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all";
  const styles = variant === "primary"
    ? "bg-verde-dark text-white hover:bg-[#0a6b42] shadow-lg px-7 py-3 text-base"
    : "border border-surface-line bg-surface-card text-ink hover:border-verde-dark px-6 py-2.5 text-sm";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles}`}
    >
      <HandHeart size={18} aria-hidden />
      {label ?? "Donar por única vez"}
      <ArrowRight size={16} aria-hidden />
    </a>
  );
}
