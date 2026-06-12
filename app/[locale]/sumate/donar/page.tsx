import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2, Check, ArrowRight, Headphones } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DonarPanel } from "@/components/sections/DonarPanel";
import { HeroFotoRotativa } from "@/components/sections/HeroFotoRotativa";
import { buildMetadata } from "@/lib/seo";
import { getTestimoniosByIds } from "@/lib/content";
import { DONACION_AR } from "@/lib/donaciones";
import type { Locale } from "@/lib/i18n/config";

const ONCE_AR_LINK = DONACION_AR.unicaVez;
const PODCAST_MENSUAL_AR_LINK = DONACION_AR.podcastMensual;

// Fotos horizontales que rotan detrás del título (la derecha queda fija).
const HERO_FOTOS = [
  "/fotos-nuevas/eventos/casacusia_gz-21.jpg",
  "/fotos-nuevas/eventos/img_4846heic.jpg",
  "/fotos-nuevas/eventos/img_7165heic.jpg"
];

// Los 6 testimonios elegidos para el panel, en orden.
const TESTIMONIOS_DONAR = [
  "t-laura-mendoza",
  "t-pame-implante-cajon",
  "t-madrid-mama-implante",
  "t-papa-emi-activacion",
  "t-marilina-cafe",
  "t-poderoso-29-anos"
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate.donar" });
  return buildMetadata({
    title: "Sumate a Casacusia · Doná un café al mes",
    description: "Juntos, podemos hacer que menos personas se sientan solas. Más de 100 personas donan un café al mes a Casacusia. Queremos ser 150. ¿Te sumás?",
    path: "/sumate/donar",
    locale: locale as Locale,
    image: "/images/og/donar.jpg"
  });
}

const fotosImpacto = [
  "/fotos-nuevas/eventos/img_4846heic.jpg",
  "/fotos-nuevas/eventos/img_7165heic.jpg",
  "/fotos-nuevas/kids/casacusia_kids_alta_137.jpg",
  "/fotos-nuevas/kids/casacusia_kids_alta_157.jpg",
  "/fotos/propuestas/casacusia_kids_alta_246.jpg",
  "/fotos/propuestas/casacusia_kids_alta_67.jpg"
];

export default async function DonarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const testimonios = getTestimoniosByIds(TESTIMONIOS_DONAR);

  return (
    <main className="bg-surface-bg">
      {/* Split: foto rotativa + título a la izquierda, panel de donación a la derecha */}
      <section className="grid lg:grid-cols-2">
        {/* Izquierda — foto rotativa con el título encima */}
        <div className="flex flex-col">
          <HeroFotoRotativa fotos={HERO_FOTOS} className="min-h-[320px] flex-1 lg:min-h-[680px]">
            <div className="max-w-xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]">
              <p className="font-display text-xl font-extrabold leading-[1.2] tracking-tight text-white md:text-3xl lg:text-4xl">
                Cada aporte sostiene encuentros, podcast y comunidad para miles de personas.
              </p>
              <a
                href="#donar-panel"
                className="mt-4 inline-block rounded-full bg-amarillo px-6 py-2.5 text-sm font-bold text-ink shadow-lg transition-transform hover:scale-105 lg:hidden"
              >
                Dona hoy
              </a>
            </div>
          </HeroFotoRotativa>
        </div>

        {/* Derecha — panel de donación (fijo) */}
        <div id="donar-panel" className="flex items-center bg-surface-bg px-6 py-12 md:px-10 lg:px-14">
          <div className="w-full max-w-lg mx-auto">
            <DonarPanel testimonios={testimonios} />
          </div>
        </div>
      </section>

      {/* Franja Podcast */}
      <Section background="default" className="py-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-verde-dark text-white p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-wider font-bold mb-4">
                <Headphones size={14} aria-hidden /> Podcast
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight">
                Doná al podcast y ayudanos a seguir contando historias.
              </h2>
              <p className="mt-3 text-white/85 text-sm md:text-base">
                Video super recomendado para que veas la importancia del podcast.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={PODCAST_MENSUAL_AR_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-ink hover:bg-white/90 transition-colors text-sm px-5 py-2.5 font-bold"
                >
                  Donar mensual al podcast
                  <ArrowRight size={14} aria-hidden />
                </a>
                <a
                  href={ONCE_AR_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors text-sm px-5 py-2.5 font-bold"
                >
                  Donar por única vez
                </a>
              </div>
              <p className="mt-3 text-white/60 text-xs">
                Donaciones desde Argentina. Pronto sumamos opciones en USD y MXN.
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/DRWTCe0kEZo"
                title="Importancia del podcast Sordo pero no mudo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Galería de Impacto */}
      <Section background="tint" ariaLabelledBy="impact-title" className="py-16">
        <h2 id="impact-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2">
          Tu aporte se traduce en esto
        </h2>
        <p className="text-ink-soft mb-8 max-w-2xl">
          Encuentros, talleres, podcast y una red de contención que no para de crecer.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[260px]">
          {fotosImpacto.map((foto, index) => (
            <div
              key={foto}
              className={`relative rounded-2xl overflow-hidden group ${
                index === 1 || index === 4 ? "md:col-span-2" : ""
              }`}
            >
              <Image
                src={foto}
                alt="Impacto Casacusia"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Empresa */}
      <Section background="default" className="pt-10 pb-20">
        <div className="max-w-5xl mx-auto rounded-2xl bg-surface-tint p-8 md:p-12 border border-surface-line">
          <div className="grid gap-8 md:grid-cols-[1fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs uppercase tracking-wider text-ink font-semibold shadow-sm mb-4">
                <Building2 size={14} aria-hidden /> Empresa
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-ink">
                Sumá tu empresa
              </h2>
              <p className="mt-3 text-ink/90 text-base">
                Creamos alianzas con organizaciones que comparten nuestros valores.
              </p>
              <div className="mt-5">
                <Button href="/sumate/proyectos-juntos" variant="secondary" className="bg-white hover:bg-white/80 border-surface-line shadow-sm">
                  Conocer alianzas corporativas
                </Button>
              </div>
            </div>
            <ul className="rounded-xl bg-white p-6 space-y-3 text-sm text-ink border border-surface-line shadow-sm">
              {[
                "Posibilidad de asignar el aporte a un programa específico.",
                "Comunicación conjunta opcional.",
                "Reporte anual de impacto.",
                "Charla de Lucas a tu equipo (una vez al año)."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={16} className="text-verde-dark mt-0.5 shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </main>
  );
}
