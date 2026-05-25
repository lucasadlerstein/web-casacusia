import "server-only";
import { cookies, headers } from "next/headers";
import { COUNTRY_COOKIE, type CountryCode } from "./country";

/**
 * Lee el país detectado, server-side.
 *
 * Orden de prioridad:
 *   1. Cookie `cc-country` (override manual del usuario)
 *   2. Header `x-vercel-ip-country` (GeoIP automático de Vercel, gratis)
 *   3. null (significa "desconocido")
 */
export async function getCountry(): Promise<CountryCode | null> {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COUNTRY_COOKIE)?.value;
  if (fromCookie && /^[A-Z]{2}$/.test(fromCookie)) return fromCookie;

  const h = await headers();
  const fromVercel = h.get("x-vercel-ip-country");
  if (fromVercel && /^[A-Z]{2}$/.test(fromVercel)) return fromVercel;

  return null;
}

/** True si el visitante tiene cookie de override manual. */
export async function hasCountryOverride(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(COUNTRY_COOKIE)?.value);
}
