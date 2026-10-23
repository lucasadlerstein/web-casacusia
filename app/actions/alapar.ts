"use server";

import { headers } from "next/headers";
import { checkBotId } from "botid/server";
import { z } from "zod";

import { assessSubscriber } from "@/lib/antispam";

/**
 * Lista de espera de A la Par: quien pide acompañamiento antes de que haya
 * Pares formados deja su email y se lo guarda en Supabase (tabla
 * `alapar_espera`). Además avisa por mail al buzón del equipo.
 */

const schema = z.object({
  email: z.string().trim().email(),
  nombre: z.string().trim().max(120).optional().or(z.literal("")),
  paraQuien: z.enum(["vos", "familiar"]),
  locale: z.string().max(5).optional(),
  /** Milisegundos que tardó en completarse el form. Vacío = desconocido (no cuenta como bot). */
  elapsed: z.preprocess((v) => (v === "" || v == null ? undefined : Number(v)), z.number().optional()),
  /** Campo trampa, invisible para personas. */
  website: z.string().optional()
});

export type EsperaState = {
  ok?: boolean;
  error?: "validation_failed" | "undeliverable_email" | "rate_limit" | "storage_error";
};

const rateBuckets = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const prev = rateBuckets.get(ip);
  if (!prev || now - prev.ts > WINDOW_MS) {
    rateBuckets.set(ip, { count: 1, ts: now });
    return true;
  }
  if (prev.count >= LIMIT) return false;
  prev.count += 1;
  return true;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Casacusia Web <somos@casacusia.org>";
const NOTIFY_TO = "somos@casacusia.org";
const NOTIFY_CC = ["lucas@casacusia.org"];

const PARA_QUIEN_LABEL = { vos: "para la persona que escribe", familiar: "para alguien de su familia" } as const;

async function guardar(data: z.infer<typeof schema>): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.info("[alapar] espera (sin DB configurada)", {
      email: data.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
      paraQuien: data.paraQuien
    });
    return true;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/alapar_espera?on_conflict=email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        // Si la misma persona se anota dos veces, se actualiza la fila en vez de fallar.
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        email: data.email.toLowerCase(),
        nombre: data.nombre || null,
        para_quien: data.paraQuien,
        locale: data.locale ?? null,
        source: "web-alapar",
        updated_at: new Date().toISOString()
      })
    });
    if (!res.ok) {
      console.error("[alapar] supabase error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[alapar] supabase fetch failed", err);
    return false;
  }
}

/** Aviso al equipo. Si falla no bloquea: el dato ya quedó guardado. */
async function avisarEquipo(data: z.infer<typeof schema>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[alapar] RESEND_API_KEY no configurada — aviso NO enviado");
    return;
  }
  const quien = data.nombre ? `${data.nombre} <${data.email}>` : data.email;
  const text = [
    "Alguien pidió acompañamiento en A la Par y quedó en la lista de espera.",
    "",
    `Email: ${data.email}`,
    `Nombre: ${data.nombre || "(no lo dejó)"}`,
    `Acompañamiento: ${PARA_QUIEN_LABEL[data.paraQuien]}`,
    "",
    "La lista completa está en Supabase, tabla alapar_espera."
  ].join("\n");
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_TO],
        cc: NOTIFY_CC,
        reply_to: data.email,
        subject: `[A la Par] Pide acompañamiento: ${quien}`,
        text
      })
    });
    if (!res.ok) console.error("[alapar] Resend", res.status, await res.text());
  } catch (err) {
    console.error("[alapar] error de red al avisar", err);
  }
}

export async function sumarseAEspera(_prev: EsperaState, formData: FormData): Promise<EsperaState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRate(ip)) return { error: "rate_limit" };

  // A los bots les simulamos éxito para no darles señal.
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("[alapar] descartado por BotID");
    return { ok: true };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: "validation_failed" };
  const data = parsed.data;

  const verdict = await assessSubscriber({
    name: data.nombre || "",
    email: data.email,
    elapsedMs: data.elapsed ?? null,
    honeypots: [data.website ?? ""]
  });
  if (!verdict.ok) {
    console.warn(`[alapar] rechazado (${verdict.reason}): ${verdict.detail}`);
    return verdict.reason === "bot" ? { ok: true } : { error: "undeliverable_email" };
  }

  if (!(await guardar(data))) return { error: "storage_error" };
  await avisarEquipo(data);
  return { ok: true };
}
