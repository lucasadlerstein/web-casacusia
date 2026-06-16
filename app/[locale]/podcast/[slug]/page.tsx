import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Headphones, Youtube, ArrowLeft, Calendar, Clock } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { AliadosAuditivos } from "@/components/sections/AliadosAuditivos";
import { ContentSidebar } from "@/components/sections/ContentSidebar";
import { Link } from "@/lib/i18n/navigation";
import { getPodcastFeed, getPodcastEpisode } from "@/lib/podcast";
import { getAliados } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import type { PodcastEpisode } from "@/lib/podcast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@Hipoacusico";
const SPOTIFY_SHOW = "https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5";

export async function generateStaticParams() {
  const feed = await getPodcastFeed();
  return (feed?.episodios ?? []).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const ep = await getPodcastEpisode(slug);
  if (!ep) return {};
  return buildMetadata({
    title: `${ep.titulo} · Sordo pero no mudo`,
    description: ep.descripcion.slice(0, 160),
    path: `/podcast/${ep.slug}`,
    locale: locale as Locale
  });
}

function buildEpisodeJsonLd(ep: PodcastEpisode, locale: string) {
  const url = `${SITE_URL}${locale === "es" ? "" : `/${locale}`}/podcast/${ep.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.titulo,
    description: ep.descripcion.slice(0, 300),
    url,
    datePublished: ep.pubDate || undefined,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Sordo pero no mudo",
      url: `${SITE_URL}/podcast`
    }
  };

  if (ep.numero != null) jsonLd.episodeNumber = ep.numero;
  if (ep.imagen) jsonLd.image = ep.imagen;
  if (ep.duracion) jsonLd.timeRequired = ep.duracion;

  if (ep.youtubeId) {
    jsonLd.associatedMedia = {
      "@type": "VideoObject",
      name: ep.titulo,
      description: ep.descripcion.slice(0, 300),
      thumbnailUrl: ep.imagen || undefined,
      uploadDate: ep.pubDate || undefined,
      embedUrl: `https://www.youtube.com/embed/${ep.youtubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${ep.youtubeId}`
    };
  }

  return jsonLd;
}

function formatDate(pubDate: string): string {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function EpisodioPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const ep = await getPodcastEpisode(slug);
  if (!ep) notFound();

  const fecha = formatDate(ep.pubDate);

  const jsonLd = buildEpisodeJsonLd(ep, locale);
  const aliados = getAliados({ destacados: true }).map((a) => ({
    slug: a.slug,
    nombre: a.nombre,
    logo: a.logo
  }));

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-16">
        {/* 2 columnas en desktop: contenido + sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
          {/* Columna principal */}
          <article>
            <Link
              href="/podcast"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-6"
            >
              <ArrowLeft size={16} aria-hidden /> Todos los episodios
            </Link>

            {/* Video de YouTube embebido, o portada si no hay video */}
            {ep.youtubeId ? (
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-surface-line shadow-md mb-7 bg-ink">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ep.youtubeId}`}
                  title={ep.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              ep.imagen && (
                <div className="relative aspect-square w-full max-w-md rounded-3xl overflow-hidden border border-surface-line shadow-md mb-7">
                  <Image
                    src={ep.imagen}
                    alt={ep.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 640px"
                    priority
                  />
                  {ep.numero != null && (
                    <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-ink/85 text-white px-3 py-1 text-xs font-bold backdrop-blur-sm">
                      Episodio #{ep.numero}
                    </span>
                  )}
                </div>
              )
            )}

            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-ink">
              {ep.titulo}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              {fecha && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} aria-hidden /> {fecha}
                </span>
              )}
              {ep.duracion && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} aria-hidden /> {ep.duracion}
                </span>
              )}
            </div>

            {/* Botones de escucha */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={ep.youtubeId ? `https://www.youtube.com/watch?v=${ep.youtubeId}` : YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#143642] text-white hover:bg-ink-soft transition-colors px-6 py-3 text-base font-bold"
              >
                <Youtube size={18} aria-hidden /> Ver en YouTube
              </a>
              <a
                href={SPOTIFY_SHOW}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface-card text-ink hover:bg-surface-tint transition-colors px-6 py-3 text-base font-bold"
              >
                <Headphones size={18} aria-hidden /> Escuchar en Spotify
              </a>
            </div>

            {/* Reproductor de audio nativo */}
            {ep.audioUrl && (
              <div className="mt-6">
                <audio controls preload="none" src={ep.audioUrl} className="w-full">
                  Tu navegador no soporta el reproductor de audio.
                </audio>
              </div>
            )}

            {/* Descripción */}
            {ep.descripcion && (
              <div className="mt-10">
                <h2 className="font-display text-xl font-extrabold text-ink mb-3">Sobre este episodio</h2>
                <p className="text-ink-soft leading-relaxed whitespace-pre-line">{ep.descripcion}</p>
              </div>
            )}
          </article>

          {/* Sidebar — sticky en desktop, stacked debajo en mobile */}
          <div className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-24">
              <ContentSidebar aliados={aliados} />
            </div>
          </div>
        </div>
      </div>

      {/* Red de Empresas que Escuchan — full width debajo */}
      <AliadosAuditivos />
    </main>
  );
}
