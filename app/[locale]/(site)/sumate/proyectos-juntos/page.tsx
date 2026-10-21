import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mic, GraduationCap, Megaphone, Handshake, FlaskConical, Gem, Check, ArrowRight } from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate.proyectosJuntos" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/sumate/proyectos-juntos",
    locale: locale as Locale
  });
}

export default async function ProyectosJuntosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sumate.proyectosJuntos" });

  const tipos = [
    { icon: <Mic size={22} aria-hidden />, title: t("tipos.charlas.title"), desc: t("tipos.charlas.desc") },
    { icon: <GraduationCap size={22} aria-hidden />, title: t("tipos.workshops.title"), desc: t("tipos.workshops.desc") },
    { icon: <Megaphone size={22} aria-hidden />, title: t("tipos.campanas.title"), desc: t("tipos.campanas.desc") },
    { icon: <Handshake size={22} aria-hidden />, title: t("tipos.convenios.title"), desc: t("tipos.convenios.desc") },
    { icon: <FlaskConical size={22} aria-hidden />, title: t("tipos.investigacion.title"), desc: t("tipos.investigacion.desc") },
    { icon: <Gem size={22} aria-hidden />, title: t("tipos.rse.title"), desc: t("tipos.rse.desc") }
  ];

  return (
    <>
      <PageHero eyebrow={t("title").split(" · ")[0]} title={t("heading")} subtitle={t("subtitle")} />

      <Section background="default" ariaLabelledBy="tipos-title">
        <SectionHeading title={<span id="tipos-title">{t("tiposHeading")}</span>} />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tipos.map((tp) => (
            <li key={tp.title} className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal-dark">
                {tp.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{tp.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{tp.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section background="tint" ariaLabelledBy="convenio-title">
        <div className="max-w-5xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <p className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-rosa">
              {t("convenio.eyebrow")}
            </p>
            <span className="inline-flex items-center rounded-full bg-amarillo-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              {t("convenio.borrador")}
            </span>
          </div>
          <h2 id="convenio-title" className="font-display text-3xl md:text-4xl font-extrabold text-ink leading-tight">
            {t("convenio.title")}
          </h2>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed max-w-3xl">
            {t("convenio.lead")}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-surface-card border-2 border-verde/40 p-8">
              <h3 className="font-display text-xl font-bold text-ink mb-5">
                {t("convenio.pones.title")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("convenio.pones.items") as string[]).map((item, i) => (
                  <li key={i} className="flex gap-3 text-ink-soft">
                    <Check size={18} aria-hidden className="text-verde-dark shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-surface-card border-2 border-violeta/40 p-8">
              <h3 className="font-display text-xl font-bold text-ink mb-5">
                {t("convenio.recibis.title")}
              </h3>
              <ul className="space-y-3">
                {(t.raw("convenio.recibis.items") as string[]).map((item, i) => (
                  <li key={i} className="flex gap-3 text-ink-soft">
                    <Check size={18} aria-hidden className="text-violeta-dark shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <Button href="/contacto?t=empresa" size="lg">
              {t("convenio.cta")} <ArrowRight size={18} className="ml-1" />
            </Button>
          </div>
        </div>
      </Section>

      <Section background="default" ariaLabelledBy="porque-title">
        <SectionHeading
          eyebrow={t("porqueHeading")}
          title={<span id="porque-title">{t("porqueSub")}</span>}
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {(t.raw("porqueItems") as { title: string, desc: string }[]).map((item) => (
            <li key={item.title} className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <p className="font-display text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-ink-soft">{item.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section background="default" ariaLabelledBy="contacto-cta">
        <div className="rounded-2xl bg-brand-teal text-white p-10 md:p-14 max-w-4xl">
          <h2 id="contacto-cta" className="font-display text-3xl md:text-4xl font-bold">
            {t("ctaHeading")}
          </h2>
          <p className="mt-3 text-white/90 max-w-2xl">
            {t("ctaSub")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/contacto?t=empresa" variant="secondary" className="bg-white text-ink border-transparent hover:bg-white/90">
              {t("ctaForm")}
            </Button>
            <Button href="/aliados" variant="ghost" className="text-white hover:bg-white/10">
              {t("ctaAliados")}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
