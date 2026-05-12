import Image from "next/image";
import { useTranslations } from "next-intl";
import { Clock, Headphones, ArrowUpRight, Play } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";
import { Link } from "@/lib/i18n/navigation";
import { getEpisodios } from "@/lib/content";

const categoryStyles: Record<string, { gradient: string; accent: string; label: string }> = {
  bienestar: { gradient: "from-verde/80 to-verde-dark/90", accent: "bg-verde", label: "text-verde-dark" },
  salud:     { gradient: "from-violeta/80 to-violeta-dark/90", accent: "bg-violeta", label: "text-violeta-dark" },
  historias: { gradient: "from-rosa/80 to-rosa-dark/90", accent: "bg-rosa", label: "text-rosa-dark" },
  derechos:  { gradient: "from-amarillo/80 to-amarillo-dark/90", accent: "bg-amarillo", label: "text-amarillo-dark" },
  default:   { gradient: "from-ink/70 to-ink/90", accent: "bg-verde", label: "text-verde-dark" },
};

function getYoutubeThumbnail(youtubeId: string) {
  return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
}

export function PodcastDestacado() {
  const t = useTranslations("home.podcast");
  const episodios = getEpisodios({ limit: 6 });

  return (
    <Section background="warm" ariaLabelledBy="podcast-title" className="relative overflow-hidden">
      <Filamento name="rosa" className="top-[-40px] right-[-60px] w-48 rotate-[20deg]" opacity={12} />
      <Filamento name="morado" className="bottom-[-40px] left-[-40px] w-40 rotate-[-15deg]" opacity={10} />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">

        {/* Episodes */}
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={<span id="podcast-title">{t("title")}</span>}
            body={t("body")}
          />

          <ul className="grid gap-4 md:gap-5 sm:grid-cols-2">
            {episodios.map((ep) => {
              const style = categoryStyles[ep.categoria] ?? categoryStyles.default!;
              const thumbnail = ep.youtubeId ? getYoutubeThumbnail(ep.youtubeId) : null;

              return (
                <li key={ep.slug}>
                  <Link
                    href={`/podcast/${ep.slug}`}
                    className="group flex h-full flex-col rounded-2xl bg-surface-card border border-surface-line overflow-hidden hover:shadow-card-hover transition-all hover:border-verde"
                  >
                    {/* Thumbnail */}
                    {thumbnail && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={thumbnail}
                          alt={`Episodio ${ep.numero}: ${ep.titulo}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Play size={20} className="text-ink ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        {/* Episode number badge */}
                        <div className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${style.accent}`}>
                          Ep. {ep.numero}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      {!thumbnail && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`h-2 w-2 rounded-full ${style.accent}`} aria-hidden />
                          <p className={`text-[11px] font-bold uppercase tracking-wider ${style.label}`}>
                            Ep. {ep.numero}
                          </p>
                        </div>
                      )}
                      <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-verde-dark transition-colors">
                        {ep.titulo}
                      </h3>
                      {ep.invitado && (
                        <p className="mt-1 text-xs text-ink-muted">con {ep.invitado.nombre}</p>
                      )}
                      <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[11px] text-ink-muted">
                        <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden />{ep.duracion}</span>
                        <span className="inline-flex items-center gap-1"><Headphones size={12} aria-hidden />transcripción</span>
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8">
            <Button href="/podcast" variant="secondary">
              {t("cta")} <ArrowUpRight size={16} aria-hidden />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block sticky top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/brand/podcast/spnm-alta.jpg"
              alt="Sordo pero no mudo — Podcast de CASACUSIA"
              width={340}
              height={340}
              className="w-full object-cover"
            />
          </div>
          <div className="mt-5 rounded-2xl bg-surface-card border border-surface-line p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Escuchalo en
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5" target="_blank" rel="noopener noreferrer" className="rounded-full border border-surface-line px-3 py-1 text-xs font-medium text-ink-soft hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] transition-colors">
                Spotify
              </a>
              <a href="https://podcasts.apple.com/us/podcast/sordo-pero-no-mudo-hablando-desde-mi-hipoacusia/id1695485167" target="_blank" rel="noopener noreferrer" className="rounded-full border border-surface-line px-3 py-1 text-xs font-medium text-ink-soft hover:bg-[#872ec4] hover:text-white hover:border-[#872ec4] transition-colors">
                Apple Podcasts
              </a>
              <a href="https://www.youtube.com/@hipoacusico" target="_blank" rel="noopener noreferrer" className="rounded-full border border-surface-line px-3 py-1 text-xs font-medium text-ink-soft hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
