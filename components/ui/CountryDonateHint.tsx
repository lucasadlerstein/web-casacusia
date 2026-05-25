"use client";

import { useCountry } from "@/components/country/CountryProvider";
import { nombrePais, banderaPais } from "@/lib/country";

/**
 * Aviso visible para visitantes que NO son de Argentina:
 * los planes mensuales que mostramos abajo son en ARS (MercadoPago),
 * así que les ofrecemos el link a donar.casacusia.org en USD.
 */
export function CountryDonateHint() {
  const { country } = useCountry();
  if (!country || country === "AR") return null;

  return (
    <div className="mb-8 rounded-2xl border border-amarillo/40 bg-amarillo-soft/40 px-5 py-4 flex flex-wrap items-center gap-3">
      <span aria-hidden className="text-2xl">{banderaPais(country)}</span>
      <div className="flex-1 min-w-0 text-sm md:text-base text-ink">
        Te detectamos en <strong>{nombrePais(country)}</strong>. Los planes que mostramos abajo están en pesos argentinos.{" "}
        <a
          href="https://donar.casacusia.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 font-bold text-verde-dark hover:text-[#0a6b42]"
        >
          Donar en USD →
        </a>
      </div>
    </div>
  );
}
