import Image from "next/image";
import { Clock, ArrowUpRight, Play } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Filamento } from "@/components/ui/Filamento";
import { Link } from "@/lib/i18n/navigation";
import type { PodcastEpisode } from "@/lib/podcast";

const EPISODES_SHOWN = 4;

const YOUTUBE_CHANNEL = "https://www.youtube.com/@hipoacusico";
const SPOTIFY_SHOW = "https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5";
const APPLE = "https://podcasts.apple.com/us/podcast/sordo-pero-no-mudo-hablando-desde-mi-hipoacusia/id1695485167";

interface Props {
  episodios: PodcastEpisode[];
}

export function PodcastDestacado({ episodios }: Props) {
  const ultimos = episodios.slice(0, EPISODES_SHOWN);

  return (
    <Section background="warm" ariaLabelledBy="podcast-title" className="relative overflow-hidden">
      <Filamento name="rosa" className="top-[-40px] right-[-60px] w-48 rotate-[20deg]" opacity={12} />
      <Filamento name="morado" className="bottom-[-40px] left-[-40px] w-40 rotate-[-15deg]" opacity={10} />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <div>
          {/* Header */}
          <div className="mb-8">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4">
              Sordo pero no mudo
            </p>
            <h2 id="podcast-title" className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink">
              Nuestro podcast
            </h2>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed max-w-xl">
              Conversaciones, identificación y aprendizaje sobre hipoacusia. Más de {episodios.length} episodios, siempre con nuevas historias.
            </p>
          </div>

          {/* Episode grid */}
          {ultimos.length > 0 && (
            <ul className="grid gap-4 md:gap-5 sm:grid-cols-2">
              {ultimos.map((ep) => (
                <li key={ep.guid}>
                  <a
                    href={ep.link ?? ep.audioUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    {ep.imagen && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={ep.imagen}
                          alt={ep.titulo}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="h-12 w-12 rounded-full bg-verde-dark flex items-center justify-center shadow-lg">
                            <Play size={20} className="text-white ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                        {ep.numero != null && (
                          <div className="absolute top-3 left-3 rounded-full bg-ink/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Ep. {ep.numero}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-verde-dark transition-colors line-clamp-2">
                        {ep.titulo}
                      </h3>
                      {ep.duracion && (
                        <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-[11px] text-ink-muted">
                          <span className="inline-flex items-center gap-1"><Clock size={12} />{ep.duracion}</span>
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8">
            <Link
              href="/podcast"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#143642] bg-transparent px-6 py-3 text-sm font-bold text-ink transition-all hover:bg-[#143642] hover:text-white"
            >
              Ver todos los episodios <ArrowUpRight size={16} />
            </Link>
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
          <div className="mt-5 rounded-2xl bg-white shadow-sm p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Escuchalo en
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-semibold text-ink hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-colors">
                YouTube
              </a>
              <a href={SPOTIFY_SHOW} target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-[#1DB954] hover:text-white hover:border-[#1DB954] transition-colors">
                Spotify
              </a>
              <a href={APPLE} target="_blank" rel="noopener noreferrer" className="rounded-full bg-surface-tint px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-[#872ec4] hover:text-white hover:border-[#872ec4] transition-colors">
                Apple Podcasts
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
