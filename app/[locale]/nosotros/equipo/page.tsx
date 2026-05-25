import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { VolunteerGrid } from "@/components/sections/VolunteerGrid";
import { getEquipo, getVoluntarios, getComisionesConConteo } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nosotros.equipo" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/nosotros/equipo",
    locale: locale as Locale
  });
}

export default async function EquipoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nosotros.equipo" });
  const equipo = getEquipo();
  const voluntarios = getVoluntarios();
  const comisiones = getComisionesConConteo();

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-bg pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <p className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-rosa mb-5">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-ink">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-ink-soft leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Core team */}
      <Section background="default" ariaLabelledBy="core-title" className="pt-4">
        <div className="max-w-3xl mb-10">
          <h2 id="core-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink">
            {t("coreHeading")}
          </h2>
          <p className="mt-2 text-ink-soft">{t("coreSub")}</p>
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {equipo.map((m) => {
            const isPlaceholder = !m.foto || m.foto.includes("placeholder");
            return (
              <li
                key={m.slug}
                className="rounded-[2rem] bg-surface-card border border-surface-line p-8 flex flex-col hover:shadow-xl hover:shadow-brand-teal/5 transition-all duration-300"
              >
                <div className="relative h-24 w-24 mb-5">
                  {isPlaceholder ? (
                    <div className="h-full w-full rounded-full bg-brand-teal-soft flex items-center justify-center text-brand-teal-dark font-display font-bold text-3xl border-2 border-surface-line">
                      {m.nombre.charAt(0)}
                    </div>
                  ) : (
                    <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-surface-line">
                      <Image
                        src={m.foto}
                        alt={`${m.nombre} ${m.apellido}`.trim()}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {m.nombre} {m.apellido}
                </h3>
                <p className="text-brand-teal-dark text-sm font-semibold mt-0.5">
                  {m.rol}
                </p>
                <p className="mt-3 text-ink-soft leading-relaxed flex-1 text-sm">
                  {m.bioCorta}
                </p>
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-brand-teal-dark"
                    aria-label={`LinkedIn de ${m.nombre}`}
                  >
                    <Linkedin size={16} aria-hidden /> {t("linkedin")}
                  </a>
                )}
                <PersonSchema miembro={m} />
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Voluntarios — unificado */}
      {voluntarios.length > 0 && (
        <Section background="tint" ariaLabelledBy="vols-title">
          <div className="max-w-3xl mb-10">
            <h2 id="vols-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink">
              {t("voluntariosHeading")}
            </h2>
            <p className="mt-2 text-ink-soft">
              {t("voluntariosSub", { count: voluntarios.length })}
            </p>
          </div>
          <VolunteerGrid voluntarios={voluntarios} comisiones={comisiones} />
        </Section>
      )}

      {/* CTA voluntariado */}
      <Section background="default" ariaLabelledBy="cta-vol-title" className="pb-20">
        <div className="rounded-3xl bg-verde-dark text-white p-10 md:p-14 max-w-4xl mx-auto text-center">
          <h2 id="cta-vol-title" className="font-display text-2xl md:text-3xl font-extrabold leading-tight">
            {t("ctaVolHeading")}
          </h2>
          <p className="mt-3 text-white/85 max-w-2xl mx-auto">{t("ctaVolSub")}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={VOLUNTARIO_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white text-ink hover:bg-white/90 transition-colors text-base px-7 py-3 font-bold"
            >
              {t("ctaVolLabel")}
            </a>
            <Button
              href="/sumate"
              variant="secondary"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              Ver las 4 formas
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
