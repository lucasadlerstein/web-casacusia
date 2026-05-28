import type { Metadata } from "next";
import Image from "next/image";
import { Headphones, Youtube, Instagram, ArrowRight } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { PodcastFeedGrid } from "@/components/sections/PodcastFeedGrid";
import { getPodcastFeed } from "@/lib/podcast";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const SPOTIFY_SHOW = "https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5";
const YOUTUBE_CHANNEL = "https://www.youtube.com/@sordoperonomudo";
const INSTAGRAM = "https://www.instagram.com/hipoacusico/";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "podcast" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/podcast",
    locale: locale as Locale
  });
}

export default async function PodcastPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "podcast" });
  const feed = await getPodcastFeed();

  // Fallback: si el RSS no carga, mostramos el hero + accesos a las plataformas.
  if (!feed) {
    return (
      <>
        <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} tone="brand" />
        <Section background="default">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-ink-soft mb-6">
              Escuchá todos los episodios de “Sordo pero no mudo” en tu plataforma preferida.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={SPOTIFY_SHOW} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white px-6 py-3 text-base font-bold hover:bg-[#0a6b42] transition-colors">
                <Headphones size={18} aria-hidden /> Spotify
              </a>
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line text-ink px-5 py-3 text-base font-semibold hover:border-verde-dark transition-colors">
                <Youtube size={18} aria-hidden className="text-rosa-dark" /> YouTube
              </a>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <main className="bg-surface-bg">
      {/* Portada del podcast */}
      <section className="pt-14 pb-10 md:pt-16">
        <div className="container max-w-5xl mx-auto px-4 grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
          {feed.portada && (
            <div className="relative aspect-square w-48 md:w-full mx-auto rounded-3xl overflow-hidden border border-surface-line shadow-lg">
              <Image
                src={feed.portada}
                alt={feed.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 12rem, 280px"
                priority
              />
            </div>
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-verde-dark mb-3">
              Podcast · {feed.episodios.length} episodios
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-ink">
              {feed.titulo}
            </h1>
            <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed line-clamp-4">
              {feed.descripcion}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={SPOTIFY_SHOW}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors px-6 py-3 text-base font-bold"
              >
                <Headphones size={18} aria-hidden />
                Escuchar en Spotify
                <ArrowRight size={14} aria-hidden />
              </a>
              <a
                href={YOUTUBE_CHANNEL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors px-5 py-3 text-base font-semibold"
              >
                <Youtube size={18} aria-hidden className="text-rosa-dark" />
                YouTube
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors px-5 py-3 text-base font-semibold"
              >
                <Instagram size={18} aria-hidden className="text-rosa-dark" />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grilla de episodios del feed */}
      <Section background="default" className="pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2">
            Todos los episodios
          </h2>
          <p className="text-ink-soft mb-8">
            Elegí el que más te atraviese. Se actualizan automáticamente desde Spotify.
          </p>
          <PodcastFeedGrid episodios={feed.episodios} />
        </div>
      </Section>
    </main>
  );
}
