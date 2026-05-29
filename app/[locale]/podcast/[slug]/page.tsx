import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Headphones, Youtube, ArrowLeft, Calendar, Clock } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Link } from "@/lib/i18n/navigation";
import { getPodcastFeed, getPodcastEpisode } from "@/lib/podcast";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const YOUTUBE_CHANNEL = "https://www.youtube.com/@Hipoacusico";

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

  return (
    <main className="bg-surface-bg">
      <section className="pt-12 pb-8 md:pt-16">
        <div className="container max-w-3xl mx-auto px-4">
          <Link
            href="/podcast"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4 mb-6"
          >
            <ArrowLeft size={16} aria-hidden /> Todos los episodios
          </Link>

          {/* Portada horizontal */}
          {ep.imagen && (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-surface-line shadow-md mb-7">
              <Image
                src={ep.imagen}
                alt={ep.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              {ep.numero != null && (
                <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-ink/85 text-white px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  Episodio #{ep.numero}
                </span>
              )}
            </div>
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
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#143642] text-white hover:bg-ink-soft transition-colors px-6 py-3 text-base font-bold"
            >
              <Youtube size={18} aria-hidden /> Ver en YouTube
            </a>
            {ep.link && (
              <a
                href={ep.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors px-6 py-3 text-base font-bold"
              >
                <Headphones size={18} aria-hidden /> Escuchar en Spotify
              </a>
            )}
          </div>

          {/* Reproductor de audio nativo */}
          {ep.audioUrl && (
            <div className="mt-6">
              <audio controls preload="none" src={ep.audioUrl} className="w-full">
                Tu navegador no soporta el reproductor de audio.
              </audio>
            </div>
          )}
        </div>
      </section>

      {/* Descripción */}
      {ep.descripcion && (
        <Section background="default" className="pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-xl font-extrabold text-ink mb-3">Sobre este episodio</h2>
            <p className="text-ink-soft leading-relaxed whitespace-pre-line">{ep.descripcion}</p>
          </div>
        </Section>
      )}
    </main>
  );
}
