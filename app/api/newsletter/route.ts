import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { z } from "zod";

import { assessSubscriber } from "@/lib/antispam";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  perfil: z.string().max(60).optional(),
  consent: z.literal(true),
  /** Milisegundos que tardó en completarse el form. */
  elapsed: z.number().optional(),
  /** Campos trampa: ver los honeypots de components/sections/Newsletter.tsx. */
  website: z.string().optional(),
  organizacion_url: z.string().optional()
});

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

export async function POST(req: Request) {
  // x-forwarded-for puede traer una cadena de IPs: la del cliente es la primera.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  // BotID (Vercel): detección invisible de automatización. Le devolvemos éxito
  // al bot para no darle señal de que lo cazamos.
  const { isBot } = await checkBotId();
  if (isBot) {
    console.warn("[newsletter] descartado por BotID");
    return NextResponse.json({ ok: true });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const { name, email, perfil } = parsed.data;

  const verdict = await assessSubscriber({
    name,
    email,
    elapsedMs: parsed.data.elapsed ?? null,
    honeypots: [parsed.data.website ?? "", parsed.data.organizacion_url ?? ""]
  });

  if (!verdict.ok) {
    console.warn(`[newsletter] rechazado (${verdict.reason}): ${verdict.detail}`);
    // Al bot le simulamos éxito; el email inválido sí se le informa a la
    // persona, que puede corregirlo y reintentar.
    return verdict.reason === "bot"
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "undeliverable_email" }, { status: 400 });
  }

  // Store in Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/newsletter_subscribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            Prefer: "resolution=merge-duplicates"
          },
          body: JSON.stringify({
            name,
            email,
            perfil: perfil ?? null,
            source: "web"
          })
        }
      );
      if (!res.ok) {
        const detail = await res.text();
        console.error("[newsletter] supabase error", res.status, detail);
        return NextResponse.json({ error: "storage_error" }, { status: 500 });
      }
    } catch (err) {
      console.error("[newsletter] supabase fetch failed", err);
      return NextResponse.json({ error: "storage_error" }, { status: 500 });
    }
  } else {
    // Fallback: log when Supabase not configured
    console.info("[newsletter] subscribe (no DB configured)", {
      name,
      email: email.replace(/(.{2}).+(@.+)/, "$1***$2")
    });
  }

  return NextResponse.json({ ok: true });
}
