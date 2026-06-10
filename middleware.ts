import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/navigation";

/**
 * Países donde el idioma local es español (oficial o de facto).
 * Visitantes desde estos países ven español por defecto.
 * Visitantes desde cualquier otro país son redirigidos a /en.
 */
const HISPANIC_COUNTRIES: ReadonlySet<string> = new Set([
  "AR", // Argentina
  "BO", // Bolivia
  "CL", // Chile
  "CO", // Colombia
  "CR", // Costa Rica
  "CU", // Cuba
  "DO", // República Dominicana
  "EC", // Ecuador
  "ES", // España
  "GQ", // Guinea Ecuatorial
  "GT", // Guatemala
  "HN", // Honduras
  "MX", // México
  "NI", // Nicaragua
  "PA", // Panamá
  "PE", // Perú
  "PR", // Puerto Rico
  "PY", // Paraguay
  "SV", // El Salvador
  "UY", // Uruguay
  "VE"  // Venezuela
]);

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hasLocalePrefix = /^\/(es|en)(\/|$)/.test(path);
  const userChoseLocale = req.cookies.has("NEXT_LOCALE");

  // Solo redirigimos cuando:
  //   - No hay prefijo de locale en la URL (ej. el visitante llegó a "/" o "/programas")
  //   - El usuario no eligió manualmente un idioma (sin cookie NEXT_LOCALE)
  //   - Vercel detectó el país y NO es hispanohablante
  if (!hasLocalePrefix && !userChoseLocale) {
    const country = req.headers.get("x-vercel-ip-country");
    if (country && !HISPANIC_COUNTRIES.has(country)) {
      const url = req.nextUrl.clone();
      url.pathname = `/en${path === "/" ? "" : path}`;
      return NextResponse.redirect(url);
    }
  }

  // Forzar español por default: next-intl puede redirigir a /en si el
  // navegador tiene Accept-Language: en. Sobreescribimos el header para
  // que siempre caiga en español salvo que el middleware ya haya decidido /en.
  if (!hasLocalePrefix && !userChoseLocale) {
    const headers = new Headers(req.headers);
    headers.set("Accept-Language", "es");
    const rewritten = new NextRequest(req.url, { headers });
    return intlMiddleware(rewritten);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
