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
