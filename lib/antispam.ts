import { resolveMx } from "node:dns/promises";

/**
 * Heurísticas anti-spam para formularios públicos.
 *
 * Ninguna señal bloquea por sí sola: sumamos puntaje y, a partir de
 * SPAM_THRESHOLD, el mensaje se entrega marcado para que se pueda filtrar
 * en la casilla sin perder nada por un falso positivo.
 */

export type SpamAssessment = {
  score: number;
  /** Motivos legibles, en orden de detección. Van al cuerpo del mail. */
  reasons: string[];
  isSpam: boolean;
};

/** A partir de este puntaje el mensaje se entrega con [SPAM?] en el asunto. */
export const SPAM_THRESHOLD = 5;

/** Tiempo mínimo verosímil para completar el form, en milisegundos. */
const MIN_FILL_MS = 4000;

/**
 * Términos típicos del spam que recibimos: ofertas de SEO/backlinks, cripto,
 * préstamos y servicios de desarrollo. Se buscan como palabra suelta sobre el
 * texto normalizado (sin acentos, en minúsculas).
 */
const SPAM_TERMS = [
  "seo",
  "backlink",
  "backlinks",
  "guest post",
  "guest posting",
  "link building",
  "domain authority",
  "ranking",
  "rankings",
  "first page of google",
  "primera pagina de google",
  "web design services",
  "diseno web economico",
  "crypto",
  "cryptocurrency",
  "bitcoin",
  "forex",
  "trading signals",
  "casino",
  "betting",
  "viagra",
  "cialis",
  "payday loan",
  "loan offer",
  "investment opportunity",
  "make money online",
  "work from home",
  "increase your traffic",
  "aumentar el trafico",
  "lead generation services",
  "cold email",
  "whatsapp marketing",
  "telegram channel",
  "nft",
  "airdrop"
];

const URL_RE = /(https?:\/\/|www\.)\S+/gi;
const HAS_URL_RE = /(https?:\/\/|www\.)\S+/i;
const HTML_RE = /<\s*(a|script|iframe|img)\b/i;
const BBCODE_RE = /\[(url|link|img)[=\]]/i;
/** Alfabetos que no usamos: cirílico, griego, CJK, árabe, hebreo, devanagari. */
const NON_LATIN_RE =
  /[Ѐ-ӿͰ-Ͽ一-鿿぀-ヿ가-힯؀-ۿ֐-׿ऀ-ॿ]/g;

/** Minúsculas y sin acentos, para comparar términos sin falsos negativos. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Cache de dominios ya consultados, para no pegarle a DNS en cada submit. */
const mxCache = new Map<string, boolean>();

/**
 * Verifica que el dominio del email tenga registros MX, es decir, que pueda
 * recibir correo. Ante cualquier error o demora damos el dominio por válido:
 * nunca penalizamos a una persona real por un problema de red nuestro.
 */
async function domainAcceptsMail(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return true;

  const cached = mxCache.get(domain);
  if (cached !== undefined) return cached;

  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("mx_timeout")), 2500))
    ]);
    const ok = records.length > 0;
    mxCache.set(domain, ok);
    return ok;
  } catch (err) {
    // ENOTFOUND / ENODATA son señal real de dominio inexistente; el resto no.
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      mxCache.set(domain, false);
      return false;
    }
    return true;
  }
}

export type SubscriberInput = {
  name: string;
  email: string;
  /** Milisegundos entre que se montó el form y el envío. */
  elapsedMs: number | null;
  /** Campos trampa: cualquier contenido los delata. */
  honeypots: string[];
};

export type SubscriberVerdict =
  /** Bot: se descarta en silencio, sin avisarle a quien envió. */
  | { ok: false; reason: "bot"; detail: string }
  /** Dominio que no recibe correo: se le avisa a la persona para que corrija. */
  | { ok: false; reason: "undeliverable_email"; detail: string }
  | { ok: true };

/**
 * Versión para formularios de suscripción, donde solo hay nombre y email.
 *
 * Es un veredicto binario y no un puntaje: sin cuerpo de mensaje que analizar,
 * las señales disponibles son concluyentes por sí solas. Un tiempo de llenado
 * ausente NO cuenta como bot: acá el costo de un falso positivo es que alguien
 * quede afuera de la lista sin enterarse.
 */
export async function assessSubscriber(input: SubscriberInput): Promise<SubscriberVerdict> {
  if (input.honeypots.some((v) => v.trim().length > 0)) {
    return { ok: false, reason: "bot", detail: "campo trampa completado" };
  }

  if (input.elapsedMs !== null && input.elapsedMs < MIN_FILL_MS) {
    return {
      ok: false,
      reason: "bot",
      detail: `completó el form en ${(input.elapsedMs / 1000).toFixed(1)}s`
    };
  }

  if (HAS_URL_RE.test(input.name)) {
    return { ok: false, reason: "bot", detail: "el nombre contiene una URL" };
  }

  const normalizedName = normalize(input.name);
  const hits = SPAM_TERMS.filter((term) => normalizedName.includes(term));
  if (hits.length > 0) {
    return { ok: false, reason: "bot", detail: `términos de spam en el nombre: ${hits.join(", ")}` };
  }

  if (!(await domainAcceptsMail(input.email))) {
    return {
      ok: false,
      reason: "undeliverable_email",
      detail: "el dominio del email no tiene registros MX"
    };
  }

  return { ok: true };
}

export type SpamInput = {
  name: string;
  email: string;
  message: string;
  /** Milisegundos entre que se montó el form y el envío. */
  elapsedMs: number | null;
  /** Campos trampa: cualquier contenido los delata. */
  honeypots: string[];
};

export async function assessSpam(input: SpamInput): Promise<SpamAssessment> {
  const reasons: string[] = [];
  let score = 0;

  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  if (input.honeypots.some((v) => v.trim().length > 0)) {
    add(10, "Completó un campo trampa (invisible para personas)");
  }

  if (input.elapsedMs === null) {
    add(4, "No informó tiempo de llenado (envío fabricado o sin JS)");
  } else if (input.elapsedMs < MIN_FILL_MS) {
    add(4, `Completó el form en ${(input.elapsedMs / 1000).toFixed(1)}s`);
  }

  const message = input.message;
  const links = message.match(URL_RE) ?? [];
  if (links.length >= 3) add(5, `${links.length} links en el mensaje`);
  else if (links.length === 2) add(3, "2 links en el mensaje");
  else if (links.length === 1) add(1, "1 link en el mensaje");

  if (HTML_RE.test(message) || BBCODE_RE.test(message)) {
    add(4, "El mensaje incluye HTML o BBCode");
  }

  const nonLatin = message.match(NON_LATIN_RE) ?? [];
  if (message.length > 0 && nonLatin.length / message.length > 0.15) {
    add(5, "El mensaje está mayormente en un alfabeto no latino");
  }

  const haystack = normalize(`${input.name} ${message}`);
  const hits = SPAM_TERMS.filter((term) => haystack.includes(term));
  if (hits.length > 0) {
    add(Math.min(hits.length * 2, 6), `Términos de spam: ${hits.slice(0, 5).join(", ")}`);
  }

  if (HAS_URL_RE.test(input.name)) add(5, "El nombre contiene una URL");

  const letters = message.replace(/[^a-zA-ZÁÉÍÓÚÑáéíóúñ]/g, "");
  if (letters.length > 40 && letters === letters.toUpperCase()) {
    add(2, "El mensaje está todo en mayúsculas");
  }

  if (!(await domainAcceptsMail(input.email))) {
    add(5, "El dominio del email no recibe correo (sin registros MX)");
  }

  return { score, reasons, isSpam: score >= SPAM_THRESHOLD };
}
