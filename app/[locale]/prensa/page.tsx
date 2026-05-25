import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Download, Quote } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { getImpacto } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prensa" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/prensa",
    locale: locale as Locale
  });
}

export default async function PrensaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "prensa" });
  const impacto = getImpacto();

  const datos = [
    { valor: `+${impacto.participantesTotales.toLocaleString("es-AR")}`, label: t("datos.participantes") },
    { valor: `${impacto.encuentrosRealizados}`, label: t("datos.encuentros") },
    { valor: `${impacto.padresEnRed}`, label: t("datos.familias") },
    { valor: `${impacto.episodiosPodcast}`, label: t("datos.episodios") },
    ...(impacto.paisesAlcanzados ? [{ valor: `${impacto.paisesAlcanzados}`, label: t("datos.paises") }] : []),
    { valor: `${impacto.voluntariosActivos}`, label: t("datos.voluntarios") }
  ];

  const frases = t.raw("frases.items") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <Section background="tint" className="py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5 rounded-xl border border-amarillo/40 bg-amarillo-soft/40 px-4 py-3">
          <span className="inline-flex items-center rounded-full bg-amarillo-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink shrink-0">
            Borrador
          </span>
          <p className="text-sm text-ink-soft">
            Pendiente de revisión por Comunicación (Valen). El copy de esta página puede ajustarse antes de difusión.
          </p>
        </div>
      </Section>

      <Section background="default" ariaLabelledBy="quienes-title">
        <div className="max-w-3xl">
          <h2 id="quienes-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink">
            {t("quienes.title")}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{t("quienes.p1")}</p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t("quienes.p2")}</p>

          <dl className="mt-10 grid gap-4 md:grid-cols-2 max-w-2xl">
            <div className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{t("quienes.fundacion")}</dt>
              <dd className="mt-1 font-medium">{site.foundingDate} — {site.legalName}</dd>
            </div>
            <div className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{t("quienes.fundador")}</dt>
              <dd className="mt-1 font-medium">Lucas Adlerstein</dd>
            </div>
            <div className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{t("quienes.web")}</dt>
              <dd className="mt-1">
                <a href={site.url} className="underline underline-offset-4">{site.url.replace("https://", "")}</a>
              </dd>
            </div>
            <div className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <dt className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{t("quienes.contacto")}</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="underline underline-offset-4">{site.email}</a>
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section background="tint" ariaLabelledBy="datos-title">
        <h2 id="datos-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink">
          {t("datos.title")}
        </h2>
        <p className="mt-3 text-ink-muted">
          {t("datos.actualizado", { fecha: impacto.ultimaActualizacion })}
        </p>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {datos.map((d) => (
            <div key={d.label} className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <dt className="font-display text-4xl font-extrabold text-brand-teal-dark">{d.valor}</dt>
              <dd className="mt-2 text-sm text-ink-soft">{d.label}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section background="default" ariaLabelledBy="frases-title">
        <h2 id="frases-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink">
          {t("frases.title")}
        </h2>
        <p className="mt-3 text-ink-muted max-w-2xl">{t("frases.subtitulo")}</p>
        <ul className="mt-10 grid gap-6 md:grid-cols-2 max-w-5xl">
          {frases.map((frase, i) => (
            <li key={i} className="relative rounded-2xl bg-surface-card border border-surface-line p-8">
              <Quote size={22} aria-hidden className="absolute top-5 right-5 text-verde opacity-40" />
              <blockquote className="font-display text-xl leading-snug text-ink font-semibold pr-8">
                &quot;{frase}&quot;
              </blockquote>
            </li>
          ))}
        </ul>
      </Section>

      <Section background="tint" ariaLabelledBy="recursos-title">
        <h2 id="recursos-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink">
          {t("recursos.title")}
        </h2>
        <p className="mt-3 text-ink-muted max-w-2xl">{t("recursos.subtitulo")}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 max-w-3xl">
          <li className="rounded-2xl bg-surface-card border border-surface-line p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{t("recursos.logos")}</p>
              <p className="text-sm text-ink-muted mt-1">{t("recursos.proximamente")}</p>
            </div>
            <Download size={20} aria-hidden className="text-ink-muted shrink-0" />
          </li>
          <li className="rounded-2xl bg-surface-card border border-surface-line p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{t("recursos.fotos")}</p>
              <p className="text-sm text-ink-muted mt-1">{t("recursos.proximamente")}</p>
            </div>
            <Download size={20} aria-hidden className="text-ink-muted shrink-0" />
          </li>
          <li className="rounded-2xl bg-surface-card border border-surface-line p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{t("recursos.factSheet")}</p>
              <p className="text-sm text-ink-muted mt-1">{t("recursos.proximamente")}</p>
            </div>
            <Download size={20} aria-hidden className="text-ink-muted shrink-0" />
          </li>
          <li className="rounded-2xl bg-surface-card border border-surface-line p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">{t("recursos.equipo")}</p>
              <p className="text-sm text-ink-muted mt-1">{t("recursos.proximamente")}</p>
            </div>
            <Download size={20} aria-hidden className="text-ink-muted shrink-0" />
          </li>
        </ul>
        <p className="mt-6 text-sm text-ink-muted max-w-2xl">{t("recursos.mientras")}</p>
      </Section>

      <Section background="default" ariaLabelledBy="contacto-title" className="pb-24">
        <div className="rounded-3xl bg-ink text-white p-10 md:p-14 max-w-3xl">
          <Mail size={28} aria-hidden className="text-brand-teal" />
          <h2 id="contacto-title" className="mt-5 font-display text-3xl md:text-4xl font-extrabold leading-tight">
            {t("contacto.title")}
          </h2>
          <p className="mt-4 text-lg text-white/80 leading-relaxed">{t("contacto.body")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${site.email}?subject=Consulta de prensa`} variant="primary" size="lg">
              {t("contacto.cta")}
            </Button>
            <Button href="/contacto" variant="secondary" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-ink">
              {t("contacto.form")}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
