import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { MessageCircle, CalendarDays, Headphones, Users, MapPin, Heart, ArrowRight } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { DonacionCTA } from "@/components/sections/DonacionCTA";
import { EventPhotoStrip } from "@/components/sections/EventPhotoStrip";
import { Link } from "@/lib/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { getBlogPosts } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

import gruposData from "@/content/grupos-whatsapp.json";

const FOTOS_ENCUENTROS = [
  "/fotos-nuevas/eventos/casacusia_gz-100.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-102.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-108.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-113.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-117.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-120.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-127.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-147.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-157.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-166.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-190.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-209.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-216.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-219.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-220.jpg",
  "/fotos-nuevas/eventos/bariloche.jpg",
  "/fotos-nuevas/eventos/caba.jpg",
  "/fotos-nuevas/eventos/caba-2.jpg",
  "/fotos-nuevas/eventos/003a0237.jpg",
  "/fotos-nuevas/eventos/003a0241.jpg",
];

const FOTOS_GALERIA = [
  "/fotos-nuevas/eventos/casacusia_gz-1.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-19.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-110.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-118.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-148.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-168.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-181.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-193.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-212.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-22.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-173.jpg",
  "/fotos-nuevas/eventos/003a0238.jpg",
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Comunidad — CASACUSIA",
    description: "Sumate a la comunidad de personas con hipoacusia más grande de Argentina. Grupos de WhatsApp, encuentros presenciales y virtuales, podcast y más.",
    path: "/comunidad",
    locale: locale as Locale
  });
}

export default async function ComunidadPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const historias = getBlogPosts({ etiqueta: "historias", limit: 3 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Comunidad CASACUSIA",
    description: "Comunidad de personas con hipoacusia y sus familias.",
    url: `${SITE_URL}/comunidad`,
    isPartOf: { "@type": "WebSite", name: "CASACUSIA", url: SITE_URL }
  };

  const formas = [
    {
      icon: MessageCircle,
      titulo: "Grupos de WhatsApp",
      descripcion: `${gruposData.totalPersonas.toLocaleString("es-AR")}+ personas en ${gruposData.grupos.length} grupos por ciudad y provincia. Encontrá gente cerca tuyo que entiende lo que vivís.`,
      cta: "Sumarme a un grupo",
      href: gruposData.linkComunidad,
      external: true,
      color: "text-verde-dark"
    },
    {
      icon: CalendarDays,
      titulo: "Encuentros presenciales",
      descripcion: "Nos juntamos una vez al mes en distintas ciudades. Compartimos experiencias, nos conocemos y nos acompañamos. Gratuitos y abiertos.",
      cta: "Ver próximos encuentros",
      href: "/calendario",
      external: false,
      color: "text-ambar"
    },
    {
      icon: Users,
      titulo: "Encuentros virtuales",
      descripcion: "Si no podés venir en persona, nos encontramos por Zoom. Mismo espíritu, desde cualquier lugar del mundo.",
      cta: "Ver calendario",
      href: "/calendario",
      external: false,
      color: "text-purpura"
    },
    {
      icon: Headphones,
      titulo: "Podcast: Sordo pero no mudo",
      descripcion: "Conversaciones reales con personas que transitan la hipoacusia. Para escuchar cuando quieras y sentir que no estás solo/a.",
      cta: "Escuchar episodios",
      href: "/podcast",
      external: false,
      color: "text-rosa-dark"
    }
  ];

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title="Nadie transita la hipoacusia en soledad"
        subtitle="Somos una comunidad de personas con pérdida auditiva y sus familias. Nos encontramos, compartimos y nos acompañamos. Sumate."
      />

      {/* Franja de fotos de encuentros */}
      <div className="container max-w-6xl mx-auto px-4 -mt-10 mb-8 relative z-10">
        <EventPhotoStrip photos={FOTOS_ENCUENTROS} />
      </div>

      {/* Formas de conectar */}
      <Section>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink text-center mb-4">
          Encontrá tu espacio
        </h2>
        <p className="text-center text-ink-soft text-lg max-w-2xl mx-auto mb-12">
          Hay muchas formas de ser parte. Elegí la que más te sirva — o sumate a todas.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {formas.map((f) => {
            const Icon = f.icon;
            const content = (
              <Card className="h-full hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 shrink-0 ${f.color}`}>
                    <Icon size={28} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-ink leading-snug">
                      {f.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                      {f.descripcion}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark group-hover:underline underline-offset-2">
                      {f.cta} <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Card>
            );

            if (f.external) {
              return (
                <a key={f.titulo} href={f.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              );
            }
            return (
              <Link key={f.titulo} href={f.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Galería de fotos de encuentros */}
      <Section>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink text-center mb-3">
          Así nos encontramos
        </h2>
        <p className="text-center text-ink-soft text-lg max-w-2xl mx-auto mb-10">
          Fotos reales de nuestros encuentros en distintas ciudades del país.
        </p>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {FOTOS_GALERIA.map((foto, i) => (
            <div key={foto} className="break-inside-avoid overflow-hidden rounded-xl border border-surface-line">
              <Image
                src={foto}
                alt="Encuentro de la comunidad Casacusia"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={i < 4 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/fotos"
            className="inline-flex items-center gap-2 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
          >
            Ver todas las fotos <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </Section>

      {/* Grupos de WhatsApp por ciudad */}
      <Section background="warm">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-3">
            <MapPin size={28} className="inline -mt-1 mr-2 text-verde-dark" aria-hidden />
            Grupos por ciudad
          </h2>
          <p className="text-ink-soft text-lg max-w-2xl mx-auto">
            {gruposData.totalPersonas.toLocaleString("es-AR")}+ personas ya son parte. Encontrá el grupo de tu zona.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {gruposData.grupos.map((g) => (
            <span
              key={g.nombre}
              className="rounded-full bg-surface-card border border-surface-line px-4 py-2 text-sm font-medium text-ink"
            >
              {g.nombre}
            </span>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={gruposData.linkComunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white px-8 py-3.5 text-base font-bold transition-transform hover:scale-105 shadow-md"
          >
            <MessageCircle size={20} aria-hidden />
            Elegí tu grupo y sumate
          </a>
        </div>
      </Section>

      {/* Historias */}
      {historias.length > 0 && (
        <Section>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink text-center mb-3">
            Historias de la comunidad
          </h2>
          <p className="text-center text-ink-soft text-lg max-w-2xl mx-auto mb-10">
            Personas reales que comparten lo que vivieron. Porque leer que otro pasó por lo mismo cambia todo.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {historias.map((post) => (
              <Link key={post.slug} href={`/recursos/blog/${post.slug}`} className="group">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <h3 className="font-display text-lg font-extrabold text-ink leading-snug group-hover:text-verde-dark transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-3">
                    {post.resumen}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-verde-dark group-hover:underline">
                    Leer historia <ArrowRight size={12} aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/recursos/blog/etiqueta/historias"
              className="inline-flex items-center gap-2 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
            >
              Ver todas las historias <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </Section>
      )}

      {/* CTA donación */}
      <Section>
        <DonacionCTA />
      </Section>

      {/* CTA final */}
      <Section background="verde">
        <div className="text-center text-white max-w-2xl mx-auto py-6">
          <Heart size={36} className="mx-auto mb-4 opacity-80" aria-hidden />
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
            Tu participación importa
          </h2>
          <p className="text-lg text-white/85 leading-relaxed mb-8">
            No importa en qué etapa estés. No importa si usás audífonos, implante o nada todavía.
            Lo que importa es que no estés solo/a. Acá hay gente que entiende.
          </p>
          <a
            href={gruposData.linkComunidad}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white text-verde-dark px-8 py-3.5 text-base font-bold transition-transform hover:scale-105 shadow-md"
          >
            <MessageCircle size={20} aria-hidden />
            Sumarme a la comunidad
          </a>
        </div>
      </Section>
    </main>
  );
}
