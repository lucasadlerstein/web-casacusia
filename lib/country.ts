/**
 * Helpers de país — client-safe (no usa next/headers).
 * Para leer el país server-side, ver lib/country-server.ts.
 */

export const COUNTRY_COOKIE = "cc-country";

/** Países que conocemos por nombre (para el selector). El sistema acepta cualquier ISO-2. */
export const PAISES_CONOCIDOS = {
  AR: { nombre: "Argentina", bandera: "🇦🇷", donar: "https://cafe.casacusia.org" },
  MX: { nombre: "México", bandera: "🇲🇽", donar: "https://donar.casacusia.org" },
  ES: { nombre: "España", bandera: "🇪🇸", donar: "https://donar.casacusia.org" },
  CL: { nombre: "Chile", bandera: "🇨🇱", donar: "https://donar.casacusia.org" },
  CO: { nombre: "Colombia", bandera: "🇨🇴", donar: "https://donar.casacusia.org" },
  UY: { nombre: "Uruguay", bandera: "🇺🇾", donar: "https://donar.casacusia.org" },
  PE: { nombre: "Perú", bandera: "🇵🇪", donar: "https://donar.casacusia.org" },
  US: { nombre: "Estados Unidos", bandera: "🇺🇸", donar: "https://donar.casacusia.org" },
  BR: { nombre: "Brasil", bandera: "🇧🇷", donar: "https://donar.casacusia.org" },
  VE: { nombre: "Venezuela", bandera: "🇻🇪", donar: "https://donar.casacusia.org" },
  EC: { nombre: "Ecuador", bandera: "🇪🇨", donar: "https://donar.casacusia.org" },
  PY: { nombre: "Paraguay", bandera: "🇵🇾", donar: "https://donar.casacusia.org" }
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
  return "https://donar.casacusia.org";
}
