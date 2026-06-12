/**
 * Helpers de país — client-safe (no usa next/headers).
 * Para leer el país server-side, ver lib/country-server.ts.
 */

export const COUNTRY_COOKIE = "cc-country";

/** Países que conocemos por nombre (para el selector). El sistema acepta cualquier ISO-2. */
export const PAISES_CONOCIDOS = {
  AR: { nombre: "Argentina", bandera: "🇦🇷", donar: "/sumate/donar" },
  MX: { nombre: "México", bandera: "🇲🇽", donar: "/sumate/donar" },
  ES: { nombre: "España", bandera: "🇪🇸", donar: "/sumate/donar" },
  CL: { nombre: "Chile", bandera: "🇨🇱", donar: "/sumate/donar" },
  CO: { nombre: "Colombia", bandera: "🇨🇴", donar: "/sumate/donar" },
  UY: { nombre: "Uruguay", bandera: "🇺🇾", donar: "/sumate/donar" },
  PE: { nombre: "Perú", bandera: "🇵🇪", donar: "/sumate/donar" },
  US: { nombre: "Estados Unidos", bandera: "🇺🇸", donar: "/sumate/donar" },
  BR: { nombre: "Brasil", bandera: "🇧🇷", donar: "/sumate/donar" },
  VE: { nombre: "Venezuela", bandera: "🇻🇪", donar: "/sumate/donar" },
  EC: { nombre: "Ecuador", bandera: "🇪🇨", donar: "/sumate/donar" },
  PY: { nombre: "Paraguay", bandera: "🇵🇾", donar: "/sumate/donar" }
} as const;

export type CountryCode = keyof typeof PAISES_CONOCIDOS | string;

/** Nombre del país en español. Para códigos no conocidos devuelve el código tal cual. */
export function nombrePais(code: CountryCode | null | undefined): string {
  if (!code) return "Internacional";
  const known = PAISES_CONOCIDOS[code as keyof typeof PAISES_CONOCIDOS];
  return known?.nombre ?? code;
}

/** Bandera emoji. Para no conocidos genera la bandera del código ISO-2 si es válido. */
export function banderaPais(code: CountryCode | null | undefined): string {
  if (!code) return "🌎";
  const known = PAISES_CONOCIDOS[code as keyof typeof PAISES_CONOCIDOS];
  if (known) return known.bandera;
  if (/^[A-Z]{2}$/.test(code)) {
    const A = 0x1f1e6;
    return String.fromCodePoint(A + (code.charCodeAt(0) - 65), A + (code.charCodeAt(1) - 65));
  }
  return "🌎";
}

/** URL de donaciones según el país. */
export function urlDonar(code: CountryCode | null | undefined): string {
  if (code === "AR") return PAISES_CONOCIDOS.AR.donar;
  return "/sumate/donar";
}
