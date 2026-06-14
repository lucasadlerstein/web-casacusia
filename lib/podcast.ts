/**
 * Episodios del podcast "Sordo pero no mudo".
 *
 * Fuente ÚNICA: playlist de YouTube vía YouTube Data API v3.
 *   Requiere las env vars YOUTUBE_API_KEY y YOUTUBE_PLAYLIST_ID.
 * Spotify/Apple quedan solo como links para quien los prefiera (en la UI),
 *   ya no son fuente de datos.
 *
 * Se cachea con ISR (revalidate 1h) igual que el resto de fuentes externas;
 * ante un fallo transitorio de la API, Next sigue sirviendo la última versión
 * generada (stale-while-error).
 */

import categoriasData from "@/content/podcast-categorias.json";

export const YOUTUBE_CHANNEL = "https://www.youtube.com/@Hipoacusico";

export type PodcastCategoria = "historias" | "patologias" | "tecnicos" | "familiares";

export const PODCAST_CATEGORIAS: Record<PodcastCategoria, string> = {
  historias:  "Historias de personas",
  patologias: "Patologías",
  tecnicos:   "Técnicos",
  familiares:  "Para familiares"
};

const catPorNumero = categoriasData.porNumero as Record<string, PodcastCategoria>;
const keywordFallback = categoriasData.keywordFallback as Record<string, string[]>;

function inferCategoria(numero: number | null, titulo: string): PodcastCategoria {
  if (numero != null && catPorNumero[String(numero)]) {
    return catPorNumero[String(numero)]!;
  }
  const lower = titulo.toLowerCase();
  for (const cat of ["tecnicos", "patologias", "familiares"] as const) {
    if (keywordFallback[cat]?.some((kw) => lower.includes(kw.toLowerCase()))) {
      return cat;
    }
  }
  return "historias";
}

const YT_API = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

export interface PodcastEpisode {
  guid: string;
  slug: string;
  numero: number | null;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  /** Proporción de la miniatura. Las de YouTube son 16:9. */
  aspecto: "16:9" | "1:1";
  audioUrl: string | null;
  link: string | null;
  youtubeId: string | null;
  pubDate: string;
  duracion: string | null;
  /** Cantidad de reproducciones en YouTube. */
  views: number | null;
  /** Categoría temática del episodio. */
  categoria: PodcastCategoria;
}

export interface PodcastFeed {
  titulo: string;
  descripcion: string;
  portada: string | null;
  episodios: PodcastEpisode[];
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

/** Extrae el número de episodio del título ("70.", "Ep. 70", "#70", "Episodio 70"). */
function parseNumero(titulo: string): number | null {
  // "Ep. 70" / "Episodio 70" / "#70"
  const conPrefijo = titulo.match(/(?:ep\.?\s*|episodio\s*|#)\s*(\d{1,3})\b/i);
  if (conPrefijo) return parseInt(conPrefijo[1]!, 10);
  // Número pelado al inicio con separador: "70. " / "70 - " / "70) "
  const alInicio = titulo.match(/^\s*(\d{1,3})\s*[.\-)]\s+/);
  return alInicio ? parseInt(alInicio[1]!, 10) : null;
}

/** Saca el branding y el número de episodio redundantes del título de YouTube. */
function limpiarTitulo(raw: string): string {
  return decode(raw)
    .replace(/\s*[|–-]\s*sordo pero no mudo.*$/i, "")
    .replace(/^\s*(?:ep\.?\s*|episodio\s*|#)?\s*\d{1,3}\s*[.\-):]\s+/i, "")
    .replace(/\s*\|\s*$/, "")
    .trim();
}

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

interface VideoMeta { duracion: string | null; views: number | null }

/** Trae duración y views de cada video (videos.list, lotes de 50). */
async function getVideoMeta(ids: string[]): Promise<Map<string, VideoMeta>> {
  const out = new Map<string, VideoMeta>();
  for (let i = 0; i < ids.length; i += 50) {
    const lote = ids.slice(i, i + 50);
    const url = `${YT_API}/videos?part=contentDetails,statistics&id=${lote.join(",")}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) continue;
    const data = (await res.json()) as {
      items?: {
        id: string;
        contentDetails?: { duration?: string };
        statistics?: { viewCount?: string };
      }[];
    };
    for (const it of data.items ?? []) {
      out.set(it.id, {
        duracion: formatYouTubeDuration(it.contentDetails?.duration),
        views: it.statistics?.viewCount ? parseInt(it.statistics.viewCount, 10) : null
      });
    }
  }
  return out;
}

export async function getPodcastFeed(): Promise<PodcastFeed | null> {
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
    const meta = await getVideoMeta(ids);

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
        duracion: meta.get(videoId)?.duracion ?? null,
        views: meta.get(videoId)?.views ?? null,
        categoria: inferCategoria(numero, titulo)
      };
    });

    // Más nuevos primero.
    episodios.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return { titulo: "Sordo pero no mudo", descripcion: "", portada: null, episodios };
  } catch {
    return null;
  }
}

export async function getPodcastEpisode(slug: string): Promise<PodcastEpisode | null> {
  const feed = await getPodcastFeed();
  return feed?.episodios.find((e) => e.slug === slug) ?? null;
}
