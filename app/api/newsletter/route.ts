import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  perfil: z.string().max(60).optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional()
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
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
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

  // Honeypot
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, perfil } = parsed.data;

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
