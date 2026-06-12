/**
 * Links de donación en PESOS ARGENTINOS (MercadoPago).
 * FUENTE ÚNICA — no hardcodear estos links en otros archivos, importar de acá.
 * Confirmados por Lucas (2026-05-29). Cada plan de suscripción cobra el monto
 * indicado; los planes "libre" dejan que el donante elija el monto.
 */

const MP_SUB = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=";

export const DONACION_AR = {
  /** Donación por única vez (monto libre, lo elige el donante). */
  unicaVez: "https://link.mercadopago.com.ar/casacusia",
  /** Suscripción mensual con monto elegido por el donante. */
  mensualLibre: `${MP_SUB}2c93808496d9dcdf0196ea4156350735`,
  /** Apoyar el podcast — suscripción mensual, monto libre. */
  podcastMensual: `${MP_SUB}b2aba9ec10684d2f92829f92f63019d6`,
  /** Suscripción mensual de $4.800 ARS. */
  mensual4800: `${MP_SUB}2c93808496e950ee0196ea3b8181008b`,
  /** Suscripción mensual de $12.000 ARS. */
  mensual12000: `${MP_SUB}2c93808496d9dcdf0196ea3c3dfd0733`,
  /** Suscripción mensual de $25.000 ARS. */
  mensual25000: `${MP_SUB}2c93808497f5fac301980fcc676009d6`
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   Panel de donación multi-moneda (/sumate/donar)
   ────────────────────────────────────────────────────────────────────────── */

/** Moneda soportada en el panel de donación. */
export type Moneda = "ars" | "usd" | "mxn";

/** Un monto mensual concreto con su link de checkout. */
export type MontoMensual = {
  /** Solo el número, ya formateado para la moneda (sin símbolo). */
  valor: string;
  /** Link de checkout de la suscripción mensual. */
  href: string;
  /** Marca el monto "Más elegido" (se destaca en el panel). */
  destacado?: boolean;
};

/** Configuración de donación para una moneda. */
export type ConfigMoneda = {
  /** Código ISO que se muestra junto a cada monto (ARS / USD / MXN). */
  codigo: string;
  bandera: string;
  /** Los 3 montos sugeridos (el del medio es el "Más elegido"). */
  montos: MontoMensual[];
  /** Suscripción mensual con monto libre. */
  otroMontoHref: string;
  /** Donación por única vez. */
  unicaVezHref: string;
};

/**
 * PLACEHOLDER — links de USD y MXN pendientes (PayPal por monto).
 * Lucas los pasa en breve; mientras tanto apuntamos al portal internacional
 * existente para no romper el flujo. Reemplazar por los links reales de PayPal
 * (3 montos + otro monto + única vez de cada moneda).
 */
const INTL_PENDIENTE = "/sumate/donar";

export const MONEDAS: Record<Moneda, ConfigMoneda> = {
  ars: {
    codigo: "ARS",
    bandera: "🇦🇷",
    montos: [
      { valor: "4.800", href: DONACION_AR.mensual4800 },
      { valor: "12.000", href: DONACION_AR.mensual12000, destacado: true },
      { valor: "25.000", href: DONACION_AR.mensual25000 }
    ],
    otroMontoHref: DONACION_AR.mensualLibre,
    unicaVezHref: DONACION_AR.unicaVez
  },
  usd: {
    codigo: "USD",
    bandera: "🌎",
    // TODO: reemplazar INTL_PENDIENTE por los links de PayPal en USD.
    montos: [
      { valor: "5", href: INTL_PENDIENTE },
      { valor: "10", href: INTL_PENDIENTE, destacado: true },
      { valor: "25", href: INTL_PENDIENTE }
    ],
    otroMontoHref: INTL_PENDIENTE,
    unicaVezHref: INTL_PENDIENTE
  },
  mxn: {
    codigo: "MXN",
    bandera: "🇲🇽",
    // TODO: reemplazar INTL_PENDIENTE por los links de PayPal en MXN.
    montos: [
      { valor: "100", href: INTL_PENDIENTE },
      { valor: "200", href: INTL_PENDIENTE, destacado: true },
      { valor: "400", href: INTL_PENDIENTE }
    ],
    otroMontoHref: INTL_PENDIENTE,
    unicaVezHref: INTL_PENDIENTE
  }
};

/** Orden de aparición de las monedas en el toggle. */
export const MONEDAS_ORDEN: Moneda[] = ["ars", "usd", "mxn"];

/** Mail para deducción de Ganancias (donantes desde Argentina). */
export const DEDUCCION_MAILTO =
  "mailto:lucas@casacusia.org?subject=Quiero%20donar%20a%20Casacusia";

/** Moneda preseleccionada según país detectado: AR→ARS, MX→MXN, resto→USD. */
export function monedaPorPais(country: string | null | undefined): Moneda {
  if (country === "MX") return "mxn";
  if (country && country !== "AR") return "usd";
  return "ars";
}
