import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Instagram, Music2, Youtube, Linkedin, Headphones, ArrowRight, HandHeart, Mic } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Link } from "@/lib/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { getUpcomingEvents } from "@/lib/luma";
import { getPodcastFeed } from "@/lib/podcast";
import { EventFilterClient } from "@/components/sections/EventFilterClient";
import { PhotoStrip } from "@/components/ui/PhotoStrip";
import { CountryAwareDonateCTA } from "@/components/ui/CountryAwareDonateCTA";
import type { Locale } from "@/lib/i18n/config";

const FOTOS_ENCUENTROS = [
  "/fotos-nuevas/eventos/bariloche.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-102.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-117.jpg",
  "/fotos-nuevas/eventos/img_4262heic.jpg",
  "/fotos-nuevas/eventos/img_4652heic.jpg",
  "/fotos-nuevas/eventos/img_4847heic.jpg",
  "/fotos-nuevas/eventos/img_6390.jpg",
  "/fotos-nuevas/eventos/img_7165heic.jpg"
];

const SOCIALES = [
  { icon: Instagram, href: "https://www.instagram.com/hipoacusico/", label: "Instagram", color: "text-rosa-dark" },
  { icon: Music2, href: "https://www.tiktok.com/@hipoacusico", label: "TikTok", color: "text-ink" },
  { icon: Youtube, href: "https://www.youtube.com/@sordoperonomudo", label: "YouTube", color: "text-rosa-dark" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/casacusia", label: "LinkedIn", color: "text-violeta-dark" }
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendario" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/calendario",
    locale: locale as Locale,
  });
}

export default async function CalendarioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("calendario");
  const tFilters = await getTranslations("home.proximoEncuentro");
  const events = await getUpcomingEvents();
  const feedPodcast = await getPodcastFeed();
  const episodioDestacado = feedPodcast?.episodios[0] ?? null;

  const translations = {
    title: tFilters("title"),
    body: tFilters("body"),
    cta: tFilters("cta"),
    sinFecha: tFilters("sinFecha"),
    todos: tFilters("filtros.todos"),
    presencial: tFilters("filtros.presencial"),
    virtual: tFilters("filtros.virtual"),
    familias: tFilters("filtros.familias"),
    argentina: tFilters("filtros.argentina"),
    mundo: tFilters("filtros.mundo"),
    inscribite: tFilters("inscribite"),
    gratuito: tFilters("gratuito"),
    verEnLuma: tFilters("verEnLuma"),
  };

  return (
    <main className="bg-surface-bg">
      <div className="container max-w-4xl mx-auto px-4 pt-16 pb-12 md:pt-20">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
          {t("heading")}
        </h1>
        <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-2xl">
          {t("intro")}
        </p>

        {/* Línea de fotos de encuentros */}
        <div className="mt-10">
          <PhotoStrip photos={FOTOS_ENCUENTROS} alt="Encuentro Casacusia" />
        </div>

        <div className="mt-10">
          <EventFilterClient
            events={events}
            translations={translations}
            layout="vertical"
            variant="light"
          />
        </div>

        {/* Embed Luma como respaldo si no llegamos a cargar eventos */}
        {events.length === 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ink mb-3">
              Calendario en vivo
            </h2>
            <p className="text-ink-soft mb-5">
              Estos son los eventos directamente desde Luma. Inscribite desde ahí.
            </p>
            <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-sm">
              <iframe
                src="https://luma.com/embed/calendar/cal-hipoacusia/events"
                title="Calendario Casacusia en Luma"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ border: 0 }}
                aria-label="Calendario de encuentros en Luma"
              />
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              ¿No ves el calendario?{" "}
              <a
                href="https://luma.com/hipoacusia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-ink"
              >
                Abrilo directo en luma.com/hipoacusia →
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Franja Marval + Helen Diller con CTAs */}
      <Section background="tint" className="py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-ink-muted mb-5">
            Nos impulsan a crecer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto items-stretch mb-9">
            <div className="flex items-center justify-center rounded-2xl bg-white border border-surface-line p-6">
              <div className="relative h-12 md:h-14 w-full">
                <Image src="/aliados/marval-logo-black.png" alt="Marval" fill className="object-contain" sizes="200px" />
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-white border border-surface-line p-6">
              <div className="relative h-12 md:h-14 w-full">
                <Image src="/aliados/helen-diller-foundation-e1753726299521-r9fogwlh344g0zwia7ts7m8u2xvvrr78ynyqk191c0.png" alt="Helen Diller Foundation" fill className="object-contain" sizes="200px" />
              </div>
            </div>
            <Link
              href="/contacto?t=empresa"
              className="group flex flex-col items-center justify-center text-center gap-2 rounded-2xl border-2 border-dashed border-verde-dark/40 bg-verde-soft/40 px-5 py-6 hover:border-verde-dark hover:bg-verde-soft transition-colors"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-verde-dark text-white">
                <HandHeart size={18} aria-hidden />
              </span>
              <span className="font-display font-extrabold text-verde-dark leading-tight text-sm">
                Quiero impulsar también
              </span>
            </Link>
          </div>
          <p className="text-center text-ink-soft text-base md:text-lg leading-relaxed mb-7 max-w-2xl mx-auto">
            Estos encuentros son gratuitos gracias a quienes apoyan a la Fundación. Podés sumarte vos también.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto?t=empresa"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white hover:bg-ink-soft transition-colors px-6 py-3 text-base font-bold"
            >
              <HandHeart size={16} aria-hidden />
              Quiero colaborar
              <ArrowRight size={14} aria-hidden />
            </Link>
            <Link
              href="/sumate/donar"
              className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors px-6 py-3 text-base font-bold"
            >
              <HandHeart size={16} aria-hidden />
              Quiero donar
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <div className="mt-5 flex justify-center">
            <CountryAwareDonateCTA />
          </div>
        </div>
      </Section>

      {/* Franja redes sociales + podcast destacado */}
      <Section background="default" className="py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-ink-muted mb-4">
            Seguinos en redes
          </p>
          <h2 className="text-center font-display text-2xl md:text-3xl font-extrabold text-ink mb-8">
            Nos seguís y nos sostenés
          </h2>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
            {/* Último episodio del podcast */}
            {episodioDestacado && (
              <a
                href={episodioDestacado.link ?? episodioDestacado.audioUrl ?? "/podcast"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-3xl bg-violeta-soft border-2 border-violeta/30 p-6 md:p-7 hover:border-violeta-dark transition-colors"
              >
                <div className="relative shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-violeta text-white flex items-center justify-center">
                  {episodioDestacado.imagen ? (
                    <Image src={episodioDestacado.imagen} alt={episodioDestacado.titulo} fill className="object-cover" sizes="80px" />
                  ) : (
                    <Headphones size={28} aria-hidden />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-violeta-dark mb-1">
                    Sordo pero no mudo · Último episodio
                  </p>
                  <p className="font-display text-lg md:text-xl font-bold text-ink leading-snug line-clamp-2">
                    {episodioDestacado.numero != null ? `#${episodioDestacado.numero} · ` : ""}{episodioDestacado.titulo}
                  </p>
                  {episodioDestacado.duracion && (
                    <p className="mt-1 text-sm text-ink-muted">{episodioDestacado.duracion}</p>
                  )}
                </div>
                <ArrowRight size={20} className="shrink-0 text-violeta-dark group-hover:translate-x-1 transition-transform" aria-hidden />
              </a>
            )}

            {/* Botones redes */}
            <div className="grid grid-cols-2 gap-3">
              {SOCIALES.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-surface-card border border-surface-line px-4 py-3 text-sm font-bold text-ink hover:border-verde-dark hover:shadow-sm transition-all"
                >
                  <Icon size={18} className={color} aria-hidden />
                  {label}
                </a>
              ))}
              <a
                href="https://open.spotify.com/show/6zYhA2pOjN0pxW2XcC8eM5"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-ink text-white px-4 py-3 text-sm font-bold hover:bg-ink-soft transition-colors"
              >
                <Mic size={18} aria-hidden />
                Escuchar el podcast
                <ArrowRight size={14} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
