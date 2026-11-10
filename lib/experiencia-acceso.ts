import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Acceso con clave a /experiencia-inmersiva mientras se trabaja con el equipo.
 *
 * La clave vive en la variable de entorno EXPERIENCIA_CLAVE (Vercel). Quien la
 * ingresa recibe una cookie con una huella de la clave: si la clave cambia,
 * las cookies viejas dejan de valer.
 *
 * Para abrir la página al público: borrar este archivo, <Acceso /> y los
 * chequeos de `estadoAcceso()`.
 */

export const COOKIE_ACCESO = "exp_acceso";
export const DIAS_ACCESO = 30;

const clave = () => process.env.EXPERIENCIA_CLAVE?.trim() ?? "";

const huella = (valor: string) => createHash("sha256").update(`experiencia-inmersiva:${valor}`).digest("hex");

function iguales(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export type EstadoAcceso = "abierto" | "pide-clave" | "sin-configurar";

export async function estadoAcceso(): Promise<EstadoAcceso> {
  const actual = clave();
  // Sin clave configurada: en local se trabaja libre; desplegada, la página queda cerrada.
  if (!actual) return process.env.NODE_ENV === "production" ? "sin-configurar" : "abierto";
  const cookie = (await cookies()).get(COOKIE_ACCESO)?.value;
  return cookie && iguales(cookie, huella(actual)) ? "abierto" : "pide-clave";
}

/** Devuelve el valor para la cookie si el intento es correcto; si no, null. */
export function validarClave(intento: string): string | null {
  const actual = clave();
  if (!actual) return null;
  // Se comparan huellas (mismo largo) para no filtrar nada por tiempo de respuesta.
  return iguales(huella(intento.trim()), huella(actual)) ? huella(actual) : null;
}
