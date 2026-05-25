import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Coffee, Beef, CupSoda, Building2, Check } from "lucide-react";
import Image from "next/image";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DonateOnceButton } from "@/components/ui/DonateOnceButton";
import { CountryDonateHint } from "@/components/ui/CountryDonateHint";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

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

const planes = [
  {
    icon: Coffee,
    titulo: "Café",
    monto: "$4.800",
    frecuencia: "/ mes",
    desc: "Ideal para empezar a colaborar con un aporte mensual simbólico.",
    cta: "Aportar $4.800/mes",
    href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496e950ee0196ea3b8181008b"
  },
  {
    icon: CupSoda,
    titulo: "Café + Tostón",
    monto: "$12.000",
    frecuencia: "/ mes",
    desc: "Sostiene los encuentros mensuales y los talleres.",
    cta: "Aportar $12.000/mes",
    href: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808496d9dcdf0196ea3c3dfd0733"
  },
  {
    icon: Beef,
    titulo: "Tira de Asado",
    monto: "$25.000",
    frecuencia: "/ mes",
    desc: "Un compromiso que apadrina familias enteras.",
    cta: "Aportar $25.000/mes",
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
      {/* Hero: narrativa directa, sin chips ni eyebrows redundantes */}
      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-ink">
            Si entendés nuestra misión, ayudanos a que menos personas se sientan solas.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            Doná y apadriná familias. Sos importante para que esto siga sucediendo. Tu aporte transforma cómo se vive la hipoacusia: con paz, con esperanza, y nunca en soledad.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <DonateOnceButton />
            <Button href="#planes" variant="ghost" size="lg">
              Ver planes mensuales
            </Button>
          </div>
        </div>
      </section>

      {/* Planes mensuales */}
      <Section background="default" id="planes" ariaLabelledBy="planes-title" className="pt-6">
        <div className="max-w-5xl mx-auto">
          <CountryDonateHint />

          <h2 id="planes-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-2">
            Apadriná mes a mes
          </h2>
          <p className="text-ink-soft mb-10 max-w-2xl">
            Los aportes recurrentes son lo que nos permite planear, escalar y sostener cada encuentro y cada programa.
          </p>

          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {planes.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.titulo}
                  className="relative flex flex-col rounded-3xl p-8 border border-surface-line bg-surface-card hover:shadow-lg hover:border-brand-teal/50 transition-all"
                >
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-tint text-brand-teal mb-5">
                    <Icon size={28} aria-hidden />
                  </div>

                  <h3 className="font-display text-2xl font-bold">{plan.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft flex-1">{plan.desc}</p>

                  <div className="mt-5 mb-5 flex items-baseline gap-1">
                    <span className="font-display text-4xl md:text-5xl font-extrabold text-ink">{plan.monto}</span>
                    <span className="text-sm font-medium text-ink-muted">{plan.frecuencia}</span>
                  </div>

                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full rounded-full bg-verde-dark text-white px-5 py-3 text-sm font-bold hover:bg-[#0a6b42] transition-colors"
                  >
                    {plan.cta}
                  </a>
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    Dalo de baja cuando quieras.
                  </p>
                </div>
              );
            })}
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
                Creamos alianzas con organizaciones que comparten nuestros valores. Aprobación ARCA para deducción del Impuesto a las Ganancias.
              </p>
              <div className="mt-5">
                <Button href="/sumate/proyectos-juntos" variant="secondary" className="bg-white hover:bg-white/80 border-surface-line shadow-sm">
                  Conocer alianzas corporativas
                </Button>
              </div>
            </div>
            <ul className="rounded-xl bg-white p-6 space-y-3 text-sm text-ink border border-surface-line shadow-sm">
              {[
                "Deducción fiscal vía ARCA.",
                "Posibilidad de asignar el aporte a un programa específico.",
                "Comunicación conjunta opcional.",
                "Reporte anual de impacto."
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
