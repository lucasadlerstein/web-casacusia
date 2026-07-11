"use server";

import { headers } from "next/headers";
import { z } from "zod";

const contactSchema = z.object({
  type: z.enum(["personal", "voluntariado", "prensa", "comunicacion", "empresa", "profesional", "programas", "otro"]),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10).max(4000),
  howFound: z.string().max(200).optional().or(z.literal("")),
  consent: z.literal("on"),
  // Honeypot: must be empty
  website: z.string().max(0).optional().or(z.literal(""))
});

type ContactType = z.infer<typeof contactSchema>["type"];

/** Etiquetas legibles por tipo, para el asunto y cuerpo del mail. */
const TYPE_LABELS: Record<ContactType, string> = {
  personal: "Consulta personal",
  voluntariado: "Voluntariado",
  prensa: "Prensa",
  comunicacion: "Comunicación",
  empresa: "Empresa / Red de Aliados",
  profesional: "Profesional de la salud",
  programas: "Programas",
  otro: "Otro"
};

/** Destinatarios del form de contacto: todos los mensajes llegan al buzón
 *  compartido del equipo, con copia a Lucas. */
const CONTACT_TO = "somos@casacusia.org";
const CONTACT_CC = ["lucas@casacusia.org"];

const rateBuckets = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const LIMIT = 3;

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

export type ContactState = {
  ok?: boolean;
  error?: "rate_limit" | "validation_failed" | "send_failed";
  fieldErrors?: Record<string, string>;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Dirección remitente: debe estar sobre un dominio verificado en Resend. */
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "Casacusia Web <somos@casacusia.org>";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type ContactPayload = z.infer<typeof contactSchema>;

function buildEmail(data: ContactPayload) {
  const label = TYPE_LABELS[data.type];
  const rows: [string, string | undefined][] = [
    ["Tipo", label],
    ["Nombre", data.name],
    ["Email", data.email],
    ["Teléfono", data.phone || undefined],
    ["Ubicación", data.location || undefined],
    ["Cómo nos encontró", data.howFound || undefined]
  ];
  const text = [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    "Mensaje:",
    data.message
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#143642;max-width:600px">
      <h2 style="color:#563AB3;margin:0 0 16px">Nuevo mensaje desde la web · ${esc(label)}</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 8px;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:4px 8px">${esc(v as string)}</td></tr>`
          )
          .join("")}
      </table>
      <div style="padding:12px 16px;background:#FFF9F2;border-radius:8px;white-space:pre-wrap">${esc(data.message)}</div>
    </div>`;

  return { subject: `[Casacusia web] ${label} — ${data.name}`, text, html };
}

/** Envía el mail vía la API REST de Resend, con un reintento ante fallo transitorio. */
async function sendContactEmail(data: ContactPayload, route: { to: string; cc?: string[] }): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY no configurada — mail NO enviado");
    return false;
  }

  const { subject, text, html } = buildEmail(data);
  const body = JSON.stringify({
    from: FROM_EMAIL,
    to: [route.to],
    cc: route.cc,
    reply_to: data.email,
    subject,
    text,
    html
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body
      });
      if (res.ok) return true;
      // 4xx no se reintenta (config/validación); 5xx sí.
      const detail = await res.text();
      console.error(`[contact] Resend ${res.status} (intento ${attempt}):`, detail);
      if (res.status < 500) return false;
    } catch (err) {
      console.error(`[contact] error de red al enviar (intento ${attempt}):`, err);
    }
  }
  return false;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? "unknown";
  if (!checkRate(ip)) return { error: "rate_limit" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = issue.message;
    }
    return { error: "validation_failed", fieldErrors };
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true };
  }

  const sent = await sendContactEmail(parsed.data, { to: CONTACT_TO, cc: CONTACT_CC });
  if (!sent) {
    // No fingimos éxito: el usuario ve el error y puede reintentar.
    return { error: "send_failed" };
  }

  return { ok: true };
}
