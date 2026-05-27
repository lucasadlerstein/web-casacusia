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

/** Routing de destinatarios según el tipo de consulta.
 *  Todos los mensajes llegan a lucas@casacusia.org con copia a manu@casacusia.org
 *  además del destinatario específico del área. */
const DEFAULT_CC = ["manu@casacusia.org"];
const ROUTING: Record<ContactType, { to: string; cc?: string[] }> = {
  personal:      { to: "lucas@casacusia.org", cc: DEFAULT_CC },
  voluntariado:  { to: "lucas@casacusia.org", cc: [...DEFAULT_CC, "melu@casacusia.org"] },
  programas:     { to: "lucas@casacusia.org", cc: [...DEFAULT_CC, "melu@casacusia.org"] },
  prensa:        { to: "lucas@casacusia.org", cc: [...DEFAULT_CC, "valen@casacusia.org"] },
  comunicacion:  { to: "lucas@casacusia.org", cc: [...DEFAULT_CC, "valen@casacusia.org"] },
  empresa:       { to: "lucas@casacusia.org", cc: [...DEFAULT_CC, "vero@casacusia.org", "judi@casacusia.org", "nico@casacusia.org"] },
  profesional:   { to: "lucas@casacusia.org", cc: DEFAULT_CC },
  otro:          { to: "lucas@casacusia.org", cc: DEFAULT_CC }
};

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

  const route = ROUTING[parsed.data.type];

  // TODO: Envío real con proveedor (Resend/SendGrid/SMTP).
  // Mientras tanto loggeamos el destinatario calculado para verificar el routing.
  console.info("[contact] submission", {
    type: parsed.data.type,
    name: parsed.data.name,
    email: parsed.data.email.replace(/(.{2}).+(@.+)/, "$1***$2"),
    to: route.to,
    cc: route.cc ?? []
  });

  return { ok: true };
}
