import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2, Check, ArrowRight, Headphones } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DonarPanel, type MontoOpcion } from "@/components/sections/DonarPanel";
import { buildMetadata } from "@/lib/seo";
import { getTestimonios } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

const ONCE_AR_LINK = "https://link.mercadopago.com.ar/casacusia";
const PODCAST_MENSUAL_AR_LINK = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=b2aba9ec10684d2f92829f92f63019d6";

// Planes de suscripción mensual (MercadoPago). Cada plan cobra su monto fijo.
// TODO: si se crean planes de $5.000 y $10.000, reemplazar label+href de los dos primeros.
const MONTOS_ARS: MontoOpcion[] = [
  { label: "$4.800", href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496e950ee0196ea3b8181008b" },
  { label: "$12.000", href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496d9dcdf0196ea3c3dfd0733" },
  { label: "$25.000", href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497f5fac301980fcc676009d6" }
];
const OTRO_MONTO_HREF = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496d9dcdf0196ea4156350735";

const FOTO_HERO = "/fotos-nuevas/eventos/casacusia_gz-21.jpg";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate.donar" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/sumate/donar",
    locale: locale as Locale
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

  const testimonios = getTestimonios({ destacados: true });

  return (
    <main className="bg-surface-bg">
      {/* Split: mensaje + foto a la izquierda, panel de donación a la derecha */}
      <section className="grid lg:grid-cols-2">
        {/* Izquierda — foto fija + mensaje */}
        <div className="relative flex items-center min-h-[440px] lg:min-h-[640px] px-6 py-16 md:px-10 lg:px-14">
          <Image
            src={FOTO_HERO}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/70 to-ink/45" />
          <div className="relative z-10 max-w-xl text-white">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
              No debería ser un privilegio escuchar.
            </h1>
            <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed">
              Doná para que más personas con pérdida auditiva puedan mejorar su calidad de vida accediendo a grupos, información y dispositivos.
            </p>
            <p className="mt-6 font-display text-lg md:text-xl font-bold">
              ¡Sumate hoy! Tu apoyo lo hace posible.
            </p>
          </div>
        </div>

        {/* Derecha — panel de donación */}
        <div className="flex items-center bg-surface-bg px-6 py-12 md:px-10 lg:px-14">
          <div className="w-full max-w-lg mx-auto">
            <DonarPanel montos={MONTOS_ARS} otroHref={OTRO_MONTO_HREF} testimonios={testimonios} />
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
