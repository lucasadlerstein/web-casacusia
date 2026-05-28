/**
 * Cliente del feed RSS del podcast "Sordo pero no mudo".
 * Fuente directa de Spotify/Anchor — siempre actualizada.
 * Se cachea con ISR (revalidate 1h) igual que el resto de fuentes externas.
 */

export const PODCAST_RSS_URL = "https://anchor.fm/s/e21dd318/podcast/rss";

export interface PodcastEpisode {
  guid: string;
  numero: number | null;
  titulo: string;
  descripcion: string;
  imagen: string | null;
  audioUrl: string | null;
  link: string | null;
  pubDate: string;
  duracion: string | null;
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

    return {
      guid: decode(getTag(block, "guid") ?? `${i}`),
      numero,
      titulo,
      descripcion: decode(getTag(block, "description") ?? getTag(block, "itunes:summary") ?? ""),
      imagen: getAttr(block, "itunes:image", "href") ?? portada,
      audioUrl: getAttr(block, "enclosure", "url"),
      link: getTag(block, "link"),
      pubDate: getTag(block, "pubDate")?.trim() ?? "",
      duracion: formatDuration(getTag(block, "itunes:duration"))
    };
  });

  return { titulo, descripcion, portada, episodios };
}

export async function getPodcastFeed(): Promise<PodcastFeed | null> {
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
