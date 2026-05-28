import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, MessageCircle, Headphones, MapPin, Users, Sparkles, Bot, BookOpen, Mic, Check } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { TestimonioBlocks } from "@/components/sections/TestimonioBlocks";
import { GruposWhatsapp } from "@/components/sections/GruposWhatsapp";
import { RotatingImage } from "@/components/ui/RotatingImage";
import { EventFilterClient } from "@/components/sections/EventFilterClient";
import { getUpcomingEvents } from "@/lib/luma";
import { getPodcastFeed } from "@/lib/podcast";
import { getTranslations } from "next-intl/server";
import {
  getProgramas,
  getTestimonios,
  type TestimonioProyecto
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const WHATSAPP_PRINCIPAL = "https://chat.whatsapp.com/IUlYFEaFWiBHaFmzwvqL4D";
const INSTAGRAM_HIPOACUSICO = "https://www.instagram.com/hipoacusico/";

type CTA = { label: string; href: string; external?: boolean };

type ProgramaConfig = {
  hero: string;
  foto: string;
  fotos?: string[];
  fotosIntervalMs?: number;
  bullets: { icon: typeof Calendar; text: string }[];
  ciudades?: string[];
  paises?: string[];
  ctaPrincipal: CTA;
  ctasExtra?: CTA[];
  proyectoTestimonio?: TestimonioProyecto;
  proximamente?: boolean;
  notaFinal?: string;
};

const COUNTRY_INFO: Record<string, { name: string; flag: string }> = {
  AR: { name: "Argentina", flag: "🇦🇷" },
  MX: { name: "México", flag: "🇲🇽" },
  BO: { name: "Bolivia", flag: "🇧🇴" },
  PY: { name: "Paraguay", flag: "🇵🇾" },
  CL: { name: "Chile", flag: "🇨🇱" },
  ES: { name: "España", flag: "🇪🇸" },
  PE: { name: "Perú", flag: "🇵🇪" },
  US: { name: "Estados Unidos", flag: "🇺🇸" },
  NL: { name: "Países Bajos", flag: "🇳🇱" },
  UY: { name: "Uruguay", flag: "🇺🇾" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  PA: { name: "Panamá", flag: "🇵🇦" }
};

export async function generateStaticParams() {
  return getProgramas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const programa = getProgramas().find((p) => p.slug === slug);
  if (!programa) return {};
  return buildMetadata({
    title: `${programa.titulo} · Programas`,
    description: programa.resumen,
    path: `/programas/${programa.slug}`,
    locale: locale as Locale
  });
}

const CONFIGS: Record<string, ProgramaConfig> = {
  "encuentros": {
    hero: "Encuentros facilitados donde contamos nuestra historia y conocemos a otras personas con pérdida auditiva, para entender que no somos los únicos con pérdida auditiva.",
    foto: "/fotos/propuestas/Casacusia_GZ-21.jpg",
    fotos: [
      "/fotos-nuevas/eventos/bariloche.jpg",
      "/fotos-nuevas/eventos/casacusia_gz-102.jpg",
      "/fotos-nuevas/eventos/casacusia_gz-117.jpg",
      "/fotos-nuevas/eventos/img_4262heic.jpg",
      "/fotos-nuevas/eventos/img_4652heic.jpg",
      "/fotos-nuevas/eventos/img_4847heic.jpg",
      "/fotos-nuevas/eventos/img_6390.jpg",
      "/fotos-nuevas/eventos/img_7165heic.jpg",
      "/fotos-nuevas/eventos/img_7290heic.jpg"
    ],
    fotosIntervalMs: 4000,
    bullets: [
      { icon: Users, text: "Gratis y abiertos a quien quiera sumarse." },
      { icon: Sparkles, text: "Facilitamos las conversaciones para que todos puedan participar." },
      { icon: Calendar, text: "Muchas personas vienen solas, que eso no te frene." }
    ],
    ciudades: ["CABA", "Madrid", "CDMX", "Bariloche", "Mendoza", "Córdoba", "La Plata", "Posadas", "Málaga"],
    ctaPrincipal: { label: "Ver próximos encuentros", href: "/calendario?tag=presencial" },
    ctasExtra: [
      { label: "Sumarme al WhatsApp", href: WHATSAPP_PRINCIPAL, external: true }
    ],
    proyectoTestimonio: "encuentros-presenciales"
  },
  "encuentros-virtuales": {
    hero: "Veni a compartir experiencias de la hipoacusia, un mundo que muchos vivimos pero pocos entienden. No es obligatorio hablar, habla quien quiere.",
    foto: "/fotos-nuevas/eventos/captura-de-pantalla-2025-12-26-a-las-123513-p-m.jpg",
    bullets: [
      { icon: Calendar, text: "Una vez al mes, por Google Meet." },
      { icon: Users, text: "Conectate desde donde estés." },
      { icon: MessageCircle, text: "Muchas personas vienen solas, que eso no te frene." }
    ],
    paises: ["AR", "MX", "BO", "PY", "CL", "ES", "PE", "US", "NL", "UY", "CO", "PA"],
    ctaPrincipal: { label: "Ver calendario", href: "/calendario?tag=virtual" },
    ctasExtra: [
      { label: "Encuentros para familias", href: "/calendario?tag=familias" },
      { label: "Sumarme al WhatsApp", href: WHATSAPP_PRINCIPAL, external: true }
    ],
    proyectoTestimonio: "encuentros-virtuales"
  },
  "red-padres-madres": {
    hero: "Espacio virtual gratuito con grupo de WhatsApp para familias de personas con pérdida auditiva. A veces acompañar no es fácil, por eso también nos acompañamos entre nosotros. Alguien ya vivió lo que vos aún no, y alguien va a vivir lo que vos estás viviendo.",
    foto: "/fotos/propuestas/casacusia_kids_alta_186.jpg",
    bullets: [
      { icon: Users, text: "Más de 220 familias en la red, de toda Latinoamérica y España." },
      { icon: MessageCircle, text: "Grupo de WhatsApp activo todos los días: dudas, recursos, anuncios." },
      { icon: Calendar, text: "Encuentros virtuales mensuales solo para familias. Muchas personas vienen solas, que eso no te frene." }
    ],
    ctaPrincipal: { label: "Sumarme al WhatsApp de familias", href: WHATSAPP_PRINCIPAL, external: true },
    ctasExtra: [
      { label: "Próximos encuentros de familias", href: "/calendario?tag=familias" }
    ],
    proyectoTestimonio: "red-familias"
  },
  "podcast": {
    hero: "Conocé historias de personas con hipoacusia y sus familias, además de entrevistas a profesionales de todo tipo. Te recomendamos leer el listado de episodios y elegir el que más te atraviese.",
    foto: "/brand/podcast/spnm-alta.jpg",
    bullets: [
      { icon: Headphones, text: "70+ episodios disponibles." },
      { icon: Mic, text: "Conversaciones con personas con hipoacusia, familias, médicos, audiólogos, psicólogos." },
      { icon: Sparkles, text: "Categorías: historias, salud, tecnología, bienestar, derechos, tips." }
    ],
    ctaPrincipal: { label: "Ver todos los episodios", href: "/podcast" },
    proyectoTestimonio: "podcast"
  },
  "cami": {
    hero: "Tenemos mucha información en el podcast, en YouTube, en Instagram, en el blog y en distintos espacios. Queremos que la recibas cuando la necesites. Por eso hacemos que CAMI te la acerque.",
    foto: "",
    bullets: [
      { icon: Bot, text: "Hoy revisamos cada respuesta que CAMI sugiere antes de enviarla, para que sea la mejor posible. Por eso todavía no es tan rápida." },
      { icon: Sparkles, text: "Intentamos responderte en las primeras 24 horas desde que escribís." },
      { icon: MessageCircle, text: "Cada pregunta que llega nos ayuda a mejorar CAMI." }
    ],
    ctaPrincipal: { label: "Probar en Instagram", href: INSTAGRAM_HIPOACUSICO, external: true },
    ctasExtra: [
      { label: "Sumarme al WhatsApp para enterarme cuando esté en la web", href: WHATSAPP_PRINCIPAL, external: true }
    ]
  },
  "comunidad-whatsapp": {
    hero: "Más de 40 grupos de WhatsApp para elegir según tu etapa, ciudad o situación. El espacio donde la comunidad se encuentra día a día: dudas, anuncios, novedades y compañía.",
    foto: "/fotos/encuentro-patio.jpg",
    bullets: [
      { icon: MessageCircle, text: "Grupos por ciudad, por etapa (recién diagnosticado, con implante, padres, etc.) y por interés." },
      { icon: Users, text: "Todos los grupos son moderados por voluntarios del equipo." },
      { icon: Sparkles, text: "Sumate al grupo principal y te indicamos a cuál más podés sumarte." }
    ],
    ctaPrincipal: { label: "Ver todos los grupos", href: "https://linktr.ee/casacusia", external: true }
  },
  "recursera": {
    hero: "Tenemos mucha información generada en estos años, y queremos que la recibas en el momento adecuado: cuando te lo preguntás, cuando te lo necesitás. Para eso estamos armando la Recursera.",
    foto: "/fotos/taller-adultos.jpg",
    bullets: [
      { icon: BookOpen, text: "Recursos categorizados por etapas de la pérdida auditiva." },
      { icon: Sparkles, text: "Artículos, guías y videos curados por personas que ya pasaron por cada momento." },
      { icon: Users, text: "Pensados para que llegues a la información que necesitás, justo cuando la necesitás." }
    ],
    ctaPrincipal: { label: "Sumarme al WhatsApp para que me avisen", href: WHATSAPP_PRINCIPAL, external: true },
    proximamente: true
  }
};

function CTAButton({ cta, primary }: { cta: CTA; primary: boolean }) {
  const base = primary
    ? "inline-flex items-center justify-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors text-base px-6 py-3 font-bold"
    : "inline-flex items-center justify-center gap-2 rounded-full bg-surface-card border border-surface-line text-ink hover:border-verde-dark transition-colors text-base px-6 py-3 font-semibold";

  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={base}>
        {cta.label}
        <ArrowRight size={16} aria-hidden />
      </a>
    );
  }
  return (
    <Link href={cta.href} className={base}>
      {cta.label}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}

export default async function ProgramaDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const programa = getProgramas().find((p) => p.slug === slug);
  if (!programa) notFound();

  const config = CONFIGS[slug];
  const testimonios = config?.proyectoTestimonio
    ? getTestimonios({ proyecto: config.proyectoTestimonio, destacados: true })
    : [];

  // Últimos episodios para el programa podcast — directo del feed (Spotify)
  const feedPodcast = slug === "podcast" ? await getPodcastFeed() : null;
  const episodios = feedPodcast?.episodios.slice(0, 3) ?? [];

  // Embed de calendario para programas con encuentros (filtrado por tipo)
  const CALENDARIO_TAG: Record<string, "presencial" | "virtual" | "familias"> = {
    "encuentros": "presencial",
    "encuentros-virtuales": "virtual",
    "red-padres-madres": "familias"
  };
  const calendarioTag = CALENDARIO_TAG[slug];
  const events = calendarioTag ? await getUpcomingEvents() : [];
  const tFilters = calendarioTag ? await getTranslations("home.proximoEncuentro") : null;
  const calendarioTranslations = tFilters
    ? {
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
        verEnLuma: tFilters("verEnLuma")
      }
    : null;

  return (
    <main className="bg-surface-bg">
      {/* Hero: título grande + descripción + foto */}
      <section className="pt-14 pb-10 md:pt-16 md:pb-12">
        <div className="container max-w-6xl mx-auto px-4 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          <div>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-ink">
              {programa.titulo}
              {programa.subtitulo && (
                <span className="block mt-2 font-display text-xl md:text-2xl font-semibold text-ink-soft">
                  {programa.subtitulo}
                </span>
              )}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
              {config?.hero ?? programa.resumen}
            </p>

            {config && (
              <div className="mt-8 flex flex-wrap gap-3">
                <CTAButton cta={config.ctaPrincipal} primary />
                {config.ctasExtra?.map((cta) => (
                  <CTAButton key={cta.label} cta={cta} primary={false} />
                ))}
              </div>
            )}
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-surface-line shadow-md">
            {config?.fotos && config.fotos.length > 1 ? (
              <RotatingImage
                images={config.fotos}
                alt={programa.titulo}
                intervalMs={config.fotosIntervalMs ?? 5000}
                className="w-full h-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <Image
                src={config?.foto ?? "/fotos/hero-comunidad.jpg"}
                alt={programa.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {config?.proximamente && (
              <div className="absolute top-4 left-4 inline-flex items-center rounded-full bg-ink/85 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Próximamente
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cómo es / qué incluye */}
      {config && (
        <Section background="default" className="py-10">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
            {config.bullets.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="rounded-2xl bg-surface-card border border-surface-line p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-verde-soft text-verde-dark mb-4">
                    <Icon size={20} aria-hidden />
                  </div>
                  <p className="text-ink-soft leading-relaxed">{b.text}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Ciudades si aplica */}
      {config?.ciudades && config.ciudades.length > 0 && (
        <Section background="tint" className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink mb-5 flex items-center gap-2">
              <MapPin size={20} aria-hidden className="text-verde-dark" />
              Donde nos encontrás
            </h2>
            <ul className="flex flex-wrap gap-2">
              {config.ciudades.map((c) => (
                <li key={c} className="inline-flex items-center rounded-full bg-surface-card border border-surface-line px-4 py-2 text-sm font-semibold text-ink">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Países si aplica (virtual) */}
      {config?.paises && config.paises.length > 0 && (
        <Section background="tint" className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink mb-5">
              Desde dónde se unen
            </h2>
            <ul className="flex flex-wrap gap-2">
              {config.paises.map((p) => {
                const info = COUNTRY_INFO[p];
                return (
                  <li key={p} className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line px-4 py-2 text-sm font-semibold text-ink">
                    <span aria-hidden className="text-base leading-none">{info?.flag ?? "🌐"}</span>
                    {info?.name ?? p}
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>
      )}

      {/* Últimos episodios (solo podcast) */}
      {slug === "podcast" && episodios.length > 0 && (
        <Section background="tint" className="py-14">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink mb-6">
              Episodios destacados
            </h2>
            <ul className="space-y-3">
              {episodios.map((e) => (
                <li key={e.guid}>
                  <a
                    href={e.link ?? e.audioUrl ?? "/podcast"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-surface-card border border-surface-line px-5 py-4 hover:border-verde-dark transition-colors"
                  >
                    {e.numero != null && (
                      <span className="font-display text-2xl font-extrabold text-verde-dark shrink-0">
                        #{e.numero}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink line-clamp-1">{e.titulo}</p>
                      {e.duracion && (
                        <p className="text-sm text-ink-muted">{e.duracion}</p>
                      )}
                    </div>
                    <ArrowRight size={18} className="text-ink-muted group-hover:text-verde-dark transition-colors" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link
                href="/podcast"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
              >
                Ver todos los episodios <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* Listado de grupos de WhatsApp */}
      {slug === "comunidad-whatsapp" && <GruposWhatsapp />}

      {/* Calendario embebido filtrado por tipo de encuentro */}
      {calendarioTag && calendarioTranslations && (
        <Section background="default" className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2 flex items-center gap-2">
              <Calendar size={24} aria-hidden className="text-verde-dark" />
              Próximos encuentros
            </h2>
            <p className="text-ink-soft mb-7">
              Inscribite gratis. Reservás tu lugar en segundos.
            </p>
            <EventFilterClient
              events={events}
              translations={calendarioTranslations}
              layout="vertical"
              variant="light"
              defaultTag={calendarioTag}
            />
          </div>
        </Section>
      )}

      {/* Testimonios filtrados — cápsulas de colores */}
      {testimonios.length > 0 && (
        <TestimonioBlocks testimonios={testimonios} title="Lo que cuenta la comunidad" />
      )}

      {/* Nota final */}
      {config?.notaFinal && (
        <Section background="default" className="py-8">
          <div className="max-w-3xl mx-auto rounded-2xl border border-amarillo/40 bg-amarillo-soft/40 px-5 py-4">
            <p className="text-sm md:text-base text-ink leading-relaxed">{config.notaFinal}</p>
          </div>
        </Section>
      )}

      {/* Volver a todos los programas */}
      <Section background="default" className="py-10">
        <div className="max-w-3xl mx-auto text-center">
          <Link
            href="/programas"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
          >
            Ver todos los programas <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </Section>
    </main>
  );
}
