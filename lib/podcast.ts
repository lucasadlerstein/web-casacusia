/**
 * Episodios del podcast "Sordo pero no mudo".
 *
 * Fuente PRINCIPAL: playlist de YouTube vía YouTube Data API v3.
 *   Se activa cuando existen las env vars YOUTUBE_API_KEY y YOUTUBE_PLAYLIST_ID.
 * Fallback: feed RSS de Anchor/Spotify (la fuente histórica), por si la API
 *   falla o todavía no están cargadas las env vars.
 *
 * Todo se cachea con ISR (revalidate 1h) igual que el resto de fuentes externas.
 */

import youtubeMap from "@/content/podcast-youtube.json";

export const PODCAST_RSS_URL = "https://anchor.fm/s/e21dd318/podcast/rss";
export const YOUTUBE_CHANNEL = "https://www.youtube.com/@Hipoacusico";

const YT_API = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

const ytMap = youtubeMap as Record<string, string>;

export interface PodcastEpisode {
  guid: string;
  slug: string;
  numero: number | null;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  /** Proporción de la miniatura: "16:9" (YouTube) o "1:1" (portada del RSS). */
  aspecto: "16:9" | "1:1";
  audioUrl: string | null;
  link: string | null;
  youtubeId: string | null;
  pubDate: string;
  duracion: string | null;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "episodio";
}

export interface PodcastFeed {
  titulo: string;
  descripcion: string;
  portada: string | null;
  episodios: PodcastEpisode[];
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extrae el número de episodio del título ("Ep. 70", "#70", "Episodio 70"). */
function parseNumero(titulo: string): number | null {
  const m = titulo.match(/(?:ep\.?\s*|episodio\s*|#)\s*(\d{1,3})\b/i);
  return m ? parseInt(m[1]!, 10) : null;
}

/** Saca el branding redundante del título de YouTube. */
function limpiarTitulo(raw: string): string {
  return decode(raw)
    .replace(/\s*[|–-]\s*sordo pero no mudo.*$/i, "")
    .replace(/\s*\|\s*$/, "")
    .trim();
}

/* ──────────────────────────────────────────────────────────────────────────
   Fuente YouTube (principal)
   ────────────────────────────────────────────────────────────────────────── */

/** "PT1H2M3S" → "1:02:03" / "PT37M46S" → "37:46". */
function formatYouTubeDuration(iso: string | undefined): string | null {
  if (!iso) return null;
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return null;
  const h = parseInt(m[1] ?? "0", 10);
  const min = parseInt(m[2] ?? "0", 10);
  const s = parseInt(m[3] ?? "0", 10);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

/** Mejor miniatura 16:9 disponible. */
function bestThumb(thumbs: Record<string, { url: string }> | undefined): string | null {
  if (!thumbs) return null;
  return (
    thumbs.maxres?.url ??
    thumbs.standard?.url ??
    thumbs.high?.url ??
    thumbs.medium?.url ??
    thumbs.default?.url ??
    null
  );
}

interface YTPlaylistItem {
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: Record<string, { url: string }>;
  };
  contentDetails?: { videoId?: string; videoPublishedAt?: string };
}

/** Trae la duración de cada video (videos.list, lotes de 50). */
async function getDuraciones(ids: string[]): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>();
  for (let i = 0; i < ids.length; i += 50) {
    const lote = ids.slice(i, i + 50);
    const url = `${YT_API}/videos?part=contentDetails&id=${lote.join(",")}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) continue;
    const data = (await res.json()) as { items?: { id: string; contentDetails?: { duration?: string } }[] };
    for (const it of data.items ?? []) {
      out.set(it.id, formatYouTubeDuration(it.contentDetails?.duration));
    }
  }
  return out;
}

async function getYouTubeFeed(): Promise<PodcastFeed | null> {
  if (!YOUTUBE_API_KEY || !YOUTUBE_PLAYLIST_ID) return null;
  try {
    const items: YTPlaylistItem[] = [];
    let pageToken = "";
    do {
      const url =
        `${YT_API}/playlistItems?part=snippet,contentDetails&maxResults=50` +
        `&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}` +
        (pageToken ? `&pageToken=${pageToken}` : "");
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      const data = (await res.json()) as { items?: YTPlaylistItem[]; nextPageToken?: string };
      items.push(...(data.items ?? []));
      pageToken = data.nextPageToken ?? "";
    } while (pageToken);

    // Descartar videos privados/borrados.
    const visibles = items.filter((it) => {
      const t = it.snippet?.title;
      return Boolean(it.contentDetails?.videoId) && t && t !== "Private video" && t !== "Deleted video";
    });
    if (visibles.length === 0) return null;

    const ids = visibles.map((it) => it.contentDetails!.videoId!);
    const duraciones = await getDuraciones(ids);

    const seen = new Map<string, number>();
    const episodios: PodcastEpisode[] = visibles.map((it) => {
      const sn = it.snippet!;
      const videoId = it.contentDetails!.videoId!;
      const titulo = limpiarTitulo(sn.title ?? "Episodio");
      const numero = parseNumero(sn.title ?? "");

      // Slug estable y único (si dos títulos colisionan, sufijo con el videoId).
      const base = numero != null ? `${numero}-${slugify(titulo)}` : slugify(titulo);
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const slug = n > 1 ? `${base}-${videoId.slice(0, 4).toLowerCase()}` : base;

      return {
        guid: videoId,
        slug,
        numero,
        titulo,
        descripcion: decode(sn.description ?? ""),
        imagen: bestThumb(sn.thumbnails),
        aspecto: "16:9",
        audioUrl: null,
        link: `https://www.youtube.com/watch?v=${videoId}`,
        youtubeId: videoId,
        pubDate: sn.publishedAt ?? it.contentDetails?.videoPublishedAt ?? "",
        duracion: duraciones.get(videoId) ?? null
      };
    });

    // Más nuevos primero (consistente con el orden histórico del RSS).
    episodios.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return { titulo: "Sordo pero no mudo", descripcion: "", portada: null, episodios };
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Fuente RSS Anchor/Spotify (fallback)
   ────────────────────────────────────────────────────────────────────────── */

function getTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = block.match(re);
  return m ? m[1]! : null;
}

function getAttr(block: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, "i");
  const m = block.match(re);
  return m ? m[1]! : null;
}

/** Formatea itunes:duration (segundos o HH:MM:SS) a "MM:SS" / "HH:MM:SS". */
function formatDuration(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (v.includes(":")) return v;
  const total = parseInt(v, 10);
  if (!Number.isFinite(total)) return null;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function parseFeed(xml: string): PodcastFeed {
  const firstItem = xml.indexOf("<item>");
  const channelXml = firstItem === -1 ? xml : xml.slice(0, firstItem);

  const portada =
    getAttr(channelXml, "itunes:image", "href") ??
    getTag(channelXml, "url") ??
    null;

  const titulo = decode(getTag(channelXml, "title") ?? "Sordo pero no mudo");
  const descripcion = decode(getTag(channelXml, "description") ?? "");

  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  const episodios: PodcastEpisode[] = itemBlocks.map((block, i) => {
    const rawTitle = decode(getTag(block, "title") ?? `Episodio ${i + 1}`);
    const numMatch = rawTitle.match(/^\s*(\d+)\s*[.\-)]\s*(.+)$/);
    const itunesEp = getTag(block, "itunes:episode");
    const numero = numMatch
      ? parseInt(numMatch[1]!, 10)
      : itunesEp
        ? parseInt(itunesEp, 10)
        : null;
    const titulo = numMatch ? numMatch[2]!.trim() : rawTitle;
    const baseSlug = slugify(titulo);
    const slug = numero != null ? `${numero}-${baseSlug}` : baseSlug;

    const youtubeId = numero != null ? (ytMap[String(numero)] ?? null) : null;

    return {
      guid: decode(getTag(block, "guid") ?? `${i}`),
      slug,
      numero,
      titulo,
      descripcion: decode(getTag(block, "description") ?? getTag(block, "itunes:summary") ?? ""),
      imagen: getAttr(block, "itunes:image", "href") ?? portada,
      aspecto: "1:1",
      audioUrl: getAttr(block, "enclosure", "url"),
      link: getTag(block, "link"),
      youtubeId,
      pubDate: getTag(block, "pubDate")?.trim() ?? "",
      duracion: formatDuration(getTag(block, "itunes:duration"))
    };
  });

  return { titulo, descripcion, portada, episodios };
}

async function getRssFeed(): Promise<PodcastFeed | null> {
  try {
    const res = await fetch(PODCAST_RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const xml = await res.text();
    const feed = parseFeed(xml);
    return feed.episodios.length > 0 ? feed : null;
  } catch {
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   API pública
   ────────────────────────────────────────────────────────────────────────── */

export async function getPodcastFeed(): Promise<PodcastFeed | null> {
  return (await getYouTubeFeed()) ?? (await getRssFeed());
}

export async function getPodcastEpisode(slug: string): Promise<PodcastEpisode | null> {
  const feed = await getPodcastFeed();
  return feed?.episodios.find((e) => e.slug === slug) ?? null;
}
