"use server";

import { cookies, headers } from "next/headers";
import { checkBotId } from "botid/server";
import { z } from "zod";

import { assessSubscriber } from "@/lib/antispam";
import { COOKIE_ACCESO, DIAS_ACCESO, estadoAcceso, validarClave } from "@/lib/experiencia-acceso";

/**
 * Landing /experiencia-inmersiva.
 *
 * - `entrar`: valida la clave de acceso mientras la página es solo para el equipo.
 * - `anotarse`: guarda a quien se anota en Supabase (tabla `experiencia_interesados`)
 *   y avisa por mail al buzón del equipo.
 */

function limitador(limite: number, ventanaMs = 60_000) {
  const cubos = new Map<string, { count: number; ts: number }>();
  return (ip: string): boolean => {
    const ahora = Date.now();
    const previo = cubos.get(ip);
    if (!previo || ahora - previo.ts > ventanaMs) {
      cubos.set(ip, { count: 1, ts: ahora });
      return true;
    }
    if (previo.count >= limite) return false;
    previo.count += 1;
    return true;
  };
}

async function ipDeLaVisita(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/* ── Acceso con clave ─────────────────────────────────────────── */

export type AccesoState = { error?: "clave" | "rate_limit" };

const intentosDeClave = limitador(8);

export async function entrar(_prev: AccesoState, formData: FormData): Promise<AccesoState> {
  if (!intentosDeClave(await ipDeLaVisita())) return { error: "rate_limit" };

  const intento = formData.get("clave");
  const valor = typeof intento === "string" ? validarClave(intento) : null;
  if (!valor) return { error: "clave" };

  (await cookies()).set(COOKIE_ACCESO, valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DIAS_ACCESO * 24 * 60 * 60
  });
  // Al cambiar la cookie, Next vuelve a renderizar la página, ya abierta.
  return {};
}

/* ── Formulario ───────────────────────────────────────────────── */

const opcional = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

const schema = z.object({
  modo: z.enum(["llevar", "avisar", "presentar"]),
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  ciudad: z.string().trim().min(1).max(120),
  tipoEspacio: opcional(80),
  organizacion: opcional(160),
  emailDestino: z.string().trim().email().max(200).optional().or(z.literal("")),
  vinculo: opcional(120),
  motivo: opcional(2000),
  locale: z.string().max(5).optional(),
  /** Milisegundos que tardó en completarse el form. Vacío = desconocido (no cuenta como bot). */
  elapsed: z.preprocess((v) => (v === "" || v == null ? undefined : Number(v)), z.number().optional()),
  /** Campo trampa, invisible para personas. */
  website: z.string().optional()
});

type Datos = z.infer<typeof schema>;

export type AnotarseState = {
  ok?: boolean;
  modo?: Datos["modo"];
  /** Para armar el mensaje que la persona envía desde su correo (modo "presentar"). */
  nombre?: string;
  emailDestino?: string;
  error?: "validation_failed" | "undeliverable_email" | "rate_limit" | "storage_error";
};

const envios = limitador(5);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Casacusia Web <somos@casacusia.org>";
const NOTIFY_TO = "somos@casacusia.org";

const MODO_LABEL: Record<Datos["modo"], string> = {
  llevar: "Quiere llevarla a su espacio",
  avisar: "Pide aviso de función en su ciudad",
  presentar: "Quiere presentarla en su trabajo"
};

async function guardar(data: Datos): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.info("[experiencia] anotación (sin DB configurada)", {
      modo: data.modo,
      email: data.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
      ciudad: data.ciudad
    });
    return true;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/experiencia_interesados`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        modo: data.modo,
        nombre: data.nombre,
        email: data.email.toLowerCase(),
        ciudad: data.ciudad,
        tipo_espacio: data.tipoEspacio || null,
        organizacion: data.organizacion || null,
        email_destino: data.emailDestino ? data.emailDestino.toLowerCase() : null,
        vinculo: data.vinculo || null,
        motivo: data.motivo || null,
        locale: data.locale ?? null
      })
    });
    if (!res.ok) {
      console.error("[experiencia] supabase error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[experiencia] supabase fetch failed", err);
    return false;
  }
}

/** Aviso al equipo. Si falla no bloquea: el dato ya quedó guardado. */
async function avisarEquipo(data: Datos): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[experiencia] RESEND_API_KEY no configurada — aviso NO enviado");
    return;
  }
  const dato = (valor: string | undefined) => valor || "(no lo dejó)";
  const text = [
    `${MODO_LABEL[data.modo]} — Experiencia inmersiva «¿Cómo oye quien no oye?»`,
    "",
    `Nombre: ${data.nombre}`,
    `Email: ${data.email}`,
    `Ciudad: ${data.ciudad}`,
    ...(data.modo === "llevar" ? [`Tipo de espacio: ${dato(data.tipoEspacio)}`] : []),
    ...(data.modo !== "avisar" ? [`Organización: ${dato(data.organizacion)}`] : []),
    ...(data.modo === "presentar" ? [`Email del área a la que quiere que llegue: ${dato(data.emailDestino)}`] : []),
    `Vínculo con la hipoacusia: ${dato(data.vinculo)}`,
    ...(data.modo !== "avisar" ? ["", "Por qué quiere llevarla:", dato(data.motivo)] : []),
    "",
    "Todas las anotaciones están en Supabase, tabla experiencia_interesados."
  ].join("\n");
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_TO],
        reply_to: data.email,
        subject: `[Experiencia inmersiva] ${MODO_LABEL[data.modo]}: ${data.nombre} (${data.ciudad})`,
        text
      })
    });
    if (!res.ok) console.error("[experiencia] Resend", res.status, await res.text());
  } catch (err) {
    console.error("[experiencia] error de red al avisar", err);
  }
}

export async function anotarse(_prev: AnotarseState, formData: FormData): Promise<AnotarseState> {
  if (!envios(await ipDeLaVisita())) return { error: "rate_limit" };
  // Mientras la página tenga clave, el formulario también.
  if ((await estadoAcceso()) !== "abierto") return { error: "validation_failed" };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  const exito = (d: Pick<Datos, "modo" | "nombre" | "emailDestino">): AnotarseState => ({
    ok: true,
    modo: d.modo,
    nombre: d.nombre,
    emailDestino: d.emailDestino || undefined
  });

  // A los bots les simulamos éxito para no darles señal.
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("[experiencia] descartado por BotID");
    return { ok: true, modo: parsed.success ? parsed.data.modo : "avisar" };
  }

  if (!parsed.success) return { error: "validation_failed" };
  const data = parsed.data;

  const verdict = await assessSubscriber({
    name: data.nombre,
    email: data.email,
    elapsedMs: data.elapsed ?? null,
    honeypots: [data.website ?? ""]
  });
  if (!verdict.ok) {
    console.warn(`[experiencia] rechazado (${verdict.reason}): ${verdict.detail}`);
    return verdict.reason === "bot" ? { ok: true, modo: data.modo } : { error: "undeliverable_email" };
  }

  if (!(await guardar(data))) return { error: "storage_error" };
  await avisarEquipo(data);
  return exito(data);
}
