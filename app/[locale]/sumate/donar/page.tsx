import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Building2, Check, ArrowRight, Headphones } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DonateOnceButton } from "@/components/ui/DonateOnceButton";
import { CountryDonateHint } from "@/components/ui/CountryDonateHint";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const ONCE_AR_LINK = "https://link.mercadopago.com.ar/casacusia";
const PODCAST_MENSUAL_AR_LINK = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=b2aba9ec10684d2f92829f92f63019d6";

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

type Plan = {
  titulo: string;
  desc: string;
  foto: string;
  monto: string;
  href: string;
};

const planes: Plan[] = [
  {
    titulo: "Acompañá a una persona",
    desc: "Tu aporte sostiene la comunidad de WhatsApp, el podcast y los recursos que llegan a una persona con pérdida auditiva, todos los meses.",
    foto: "/fotos-nuevas/kids/casacusia_kids_220.jpg",
    monto: "$4.800",
    href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496e950ee0196ea3b8181008b"
  },
  {
    titulo: "Acompañá a una familia",
    desc: "Sostiene la Red de Familias, los encuentros virtuales mensuales y el acompañamiento uno a uno a familias recién diagnosticadas.",
    foto: "/fotos-nuevas/eventos/img_7722heic.jpg",
    monto: "$12.000",
    href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496d9dcdf0196ea3c3dfd0733"
  },
  {
    titulo: "Acompañá a un grupo",
    desc: "Sostiene los encuentros presenciales en una ciudad: salón, materiales, logística y catering.",
    foto: "/fotos-nuevas/eventos/img_4846heic.jpg",
    monto: "$25.000",
    href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497f5fac301980fcc676009d6"
  }
];

const fotosImpacto = [
  "/fotos/propuestas/casacusia_kids_alta_252.jpg",
  "/fotos/propuestas/Casacusia_GZ-21.jpg",
  "/fotos/propuestas/DSC00009.jpg",
  "/fotos/propuestas/casacusia_kids_alta_186.jpg",
  "/fotos/propuestas/DSC00020.jpg",
  "/fotos/propuestas/DSC00021.jpg"
];

export default async function DonarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-surface-bg">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-ink">
            Si entendés nuestra misión, ayudanos a que menos personas se sientan solas.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            Doná y apadriná a personas, familias o grupos enteros. Tu aporte transforma cómo se vive la hipoacusia: con paz, con esperanza, y nunca en soledad.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ONCE_AR_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-verde-dark text-white hover:bg-[#0a6b42] transition-colors text-base px-7 py-3 font-bold shadow-lg"
            >
              Donar por única vez
              <ArrowRight size={16} aria-hidden />
            </a>
            <Button href="#planes" variant="ghost" size="lg">
              Ver planes mensuales
            </Button>
          </div>
        </div>
      </section>

      {/* Planes mensuales — Persona / Familia / Grupo */}
      <Section background="default" id="planes" ariaLabelledBy="planes-title" className="pt-6">
        <div className="max-w-6xl mx-auto">
          <CountryDonateHint />

          <h2 id="planes-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2">
            Apadriná mes a mes
          </h2>
          <p className="text-ink-soft mb-10 max-w-2xl">
            Elegí a quién querés acompañar. Los aportes recurrentes son lo que nos permite planear, escalar y sostener cada programa.
          </p>

          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {planes.map((plan) => (
              <div
                key={plan.titulo}
                className="relative flex flex-col rounded-3xl overflow-hidden border border-surface-line bg-surface-card hover:shadow-lg hover:border-verde-dark/50 transition-all"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={plan.foto}
                    alt={plan.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <h3 className="font-display text-2xl font-extrabold text-ink leading-tight">
                    {plan.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft flex-1">{plan.desc}</p>

                  <div className="mt-5 mb-5 flex items-baseline gap-1">
                    <span className="font-display text-4xl md:text-5xl font-extrabold text-verde-dark">{plan.monto}</span>
                    <span className="text-sm font-medium text-ink-muted">/ mes</span>
                  </div>

                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full rounded-full bg-verde-dark text-white px-5 py-3 text-sm font-bold hover:bg-[#0a6b42] transition-colors"
                  >
                    {plan.titulo}
                  </a>
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    Dalo de baja cuando quieras.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-ink-muted mb-3">¿Querés un monto distinto o donar por única vez?</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <DonateOnceButton variant="ghost" />
              <a
                href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496d9dcdf0196ea4156350735"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface-card text-ink hover:border-verde-dark px-6 py-2.5 text-sm font-bold transition-colors"
              >
                Suscripción personalizada
              </a>
            </div>
          </div>
        </div>
      </Section>

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
