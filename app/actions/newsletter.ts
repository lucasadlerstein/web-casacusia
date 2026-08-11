"use server";

import { checkBotId } from "botid/server";
import { z } from "zod";

import { assessSubscriber } from "@/lib/antispam";

const SENDER_API = "https://api.sender.net/v2";
const SENDER_TOKEN = process.env.SENDER_API_TOKEN;
const SENDER_GROUP = process.env.SENDER_GROUP_ID;

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  email: z.string().email("Ingresá un email válido")
});

export type Result = { ok: true } | { ok: false; error: string };

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v : "");

export async function suscribirNewsletter(_prev: Result | null, formData: FormData): Promise<Result> {
  // BotID (Vercel): detección invisible de automatización. Le simulamos éxito
  // al bot para no darle señal de que lo cazamos.
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("[newsletter] descartado por BotID");
    return { ok: true };
  }

  const parsed = schema.safeParse({
    nombre: formData.get("nombre"),
    email: formData.get("email")
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  if (!SENDER_TOKEN || !SENDER_GROUP) {
    console.error("Missing SENDER_API_TOKEN or SENDER_GROUP_ID env vars");
    return { ok: false, error: "Error de configuración. Intentá más tarde." };
  }

  const { nombre, email } = parsed.data;

  const elapsed = Number(str(formData.get("elapsed")));
  const verdict = await assessSubscriber({
    name: nombre,
    email,
    elapsedMs: Number.isFinite(elapsed) && elapsed > 0 ? elapsed : null,
    honeypots: [str(formData.get("website")), str(formData.get("organizacion_url"))]
  });

  if (!verdict.ok) {
    console.warn(`[newsletter] rechazado (${verdict.reason}): ${verdict.detail}`);
    if (verdict.reason === "bot") return { ok: true };
    return { ok: false, error: "No pudimos verificar ese email. Revisá que esté bien escrito." };
  }

  try {
    // 1. Crear o actualizar suscriptor
    const subRes = await fetch(`${SENDER_API}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email,
        firstname: nombre,
        groups: [SENDER_GROUP]
      })
    });

    if (!subRes.ok) {
      const body = await subRes.text();
      console.error("Sender API error:", subRes.status, body);
      return { ok: false, error: "No pudimos suscribirte. Intentá de nuevo en un rato." };
    }

    return { ok: true };
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    return { ok: false, error: "Error de conexión. Intentá de nuevo." };
  }
}
