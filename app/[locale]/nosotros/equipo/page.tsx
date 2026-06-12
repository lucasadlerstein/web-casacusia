import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { RotatingWord } from "@/components/sections/RotatingWord";
import {
  getEquipo,
  type MiembroEquipo
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

// Rotating verbs are loaded from translations in the page component

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

type PersonaCard = {
  slug: string;
  nombre: string;
  apellido?: string;
  foto: string;
  rol: string;
  equipo?: string;
  linkedin?: string;
  esCore: boolean;
  miembro: MiembroEquipo;
};

type CardLabels = {
  coreBadge: string;
  linkedinDe: string;
};

export default async function EquipoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nosotros.equipo" });
  const equipo = getEquipo();
  const rotatingVerbs = t("rotatingVerbs").split(",");
  const cardLabels: CardLabels = {
    coreBadge: t("coreBadge"),
    linkedinDe: t("linkedinDe", { nombre: "__NAME__" })
  };

  const personas: PersonaCard[] = equipo.map((m): PersonaCard => ({
    slug: m.slug,
    nombre: m.nombre,
    apellido: m.apellido,
    foto: m.foto,
    rol: m.rol,
    equipo: m.equipo,
    linkedin: m.linkedin,
    esCore: m.esCore ?? false,
    miembro: m
  }));

  return (
    <>
      {/* Hero con palabra rotativa */}
      <section className="bg-surface-bg pt-20 pb-10 md:pt-24 md:pb-14">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            {t("heroH1Before")}<br />
            <RotatingWord words={rotatingVerbs} className="text-verde-dark font-extrabold" /> {t("heroH1After")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            {t("heroSub")}
          </p>
        </div>
      </section>

      {/* Grid uniforme equipo + voluntarios */}
      <Section background="default" ariaLabelledBy="grid-title" className="pt-2">
        <h2 id="grid-title" className="sr-only">{t("gridTitle")}</h2>

        {/* Filtro por comisión (solo voluntarios) — mantenemos VolunteerGrid para esa parte */}
        <div className="max-w-6xl mx-auto">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {personas.map((p) => (
              <li key={p.slug}>
                <PersonaCardComp persona={p} labels={cardLabels} />
                {p.miembro && <PersonSchema miembro={p.miembro} />}
              </li>
            ))}
          </ul>
        </div>

      </Section>

      {/* CTA */}
      <Section background="tint" ariaLabelledBy="cta-vol-title" className="pb-20">
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
              {t("ctaVolSecondary")}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function PersonaCardComp({ persona, labels }: { persona: PersonaCard; labels: CardLabels }) {
  const isPlaceholder = !persona.foto || persona.foto.includes("placeholder");
  const nombreCompleto = persona.apellido ? `${persona.nombre} ${persona.apellido}` : persona.nombre;
  const targetLink = persona.linkedin;

  const inner = (
    <article className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-surface-line bg-surface-card hover:shadow-lg transition-shadow group">
      {isPlaceholder ? (
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#1a4a5a] to-ink flex items-center justify-center">
          <span className="font-display font-extrabold text-6xl text-white/30">
            {persona.nombre.charAt(0)}
          </span>
        </div>
      ) : (
        <Image
          src={persona.foto}
          alt={nombreCompleto}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}

      {/* Gradiente difuminado abajo */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-ink/95 via-ink/70 to-transparent pointer-events-none" />

      {/* Texto */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="font-display font-bold text-base md:text-lg leading-tight">
          {nombreCompleto}
        </p>
        <p className="text-xs md:text-sm text-white/80 leading-snug mt-0.5">
          {persona.rol}
        </p>
        {persona.equipo && (
          <span className="mt-1.5 inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            {persona.equipo}
          </span>
        )}
        {persona.linkedin && (
          <span className="absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-white">
            <Linkedin size={12} aria-hidden />
          </span>
        )}
      </div>
    </article>
  );

  if (targetLink) {
    return (
      <a
        href={targetLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.linkedinDe.replace("__NAME__", nombreCompleto)}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-verde-dark rounded-2xl"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

