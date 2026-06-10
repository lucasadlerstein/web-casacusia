import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PersonSchema } from "@/components/schema/PersonSchema";
import { VolunteerGrid } from "@/components/sections/VolunteerGrid";
import { RotatingWord } from "@/components/sections/RotatingWord";
import {
  getEquipo,
  getVoluntarios,
  getComisionesConConteo,
  type MiembroEquipo,
  type Voluntario
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

const ROTATING_VERBS = ["sostienen", "construyen", "guionan", "piensan", "sienten", "potencian", "respiran"];

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
  area: string;
  linkedin?: string;
  esCore: boolean;
  miembro?: MiembroEquipo;
};

export default async function EquipoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nosotros.equipo" });
  const equipo = getEquipo();
  const voluntarios = getVoluntarios();
  const comisiones = getComisionesConConteo();

  // Mezclamos equipo core + voluntarios en un solo listado uniforme.
  const personas: PersonaCard[] = [
    ...equipo.map((m): PersonaCard => ({
      slug: m.slug,
      nombre: m.nombre,
      apellido: m.apellido,
      foto: m.foto,
      area: m.rol,
      linkedin: m.linkedin,
      esCore: true,
      miembro: m
    })),
    ...voluntarios.map((v: Voluntario): PersonaCard => ({
      slug: v.slug,
      nombre: v.nombre,
      foto: v.foto,
      area: v.rolEnComision ?? comisionLabel(v.comision),
      esCore: false
    }))
  ];

  return (
    <>
      {/* Hero con palabra rotativa */}
      <section className="bg-surface-bg pt-20 pb-10 md:pt-24 md:pb-14">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Las personas que<br />
            <RotatingWord words={ROTATING_VERBS} className="text-verde-dark font-extrabold" /> Casacusia.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            Liderar y ser parte de una ONG a veces no es fácil, pero el amor y la convicción son muy fuertes.
          </p>
        </div>
      </section>

      {/* Grid uniforme equipo + voluntarios */}
      <Section background="default" ariaLabelledBy="grid-title" className="pt-2">
        <h2 id="grid-title" className="sr-only">Equipo y voluntarios</h2>

        {/* Filtro por comisión (solo voluntarios) — mantenemos VolunteerGrid para esa parte */}
        <div className="max-w-6xl mx-auto">
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {personas.map((p) => (
              <li key={p.slug}>
                <PersonaCardComp persona={p} />
                {p.miembro && <PersonSchema miembro={p.miembro} />}
              </li>
            ))}
          </ul>
        </div>

        {/* Filtros por área se mantienen para voluntarios */}
        {voluntarios.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <p className="font-display text-base font-bold text-ink-soft mb-4">
              Filtrar voluntarios por área
            </p>
            <VolunteerGrid voluntarios={voluntarios} comisiones={comisiones} />
          </div>
        )}
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
              Ver las 4 formas de colaborar
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function PersonaCardComp({ persona }: { persona: PersonaCard }) {
  const isPlaceholder = !persona.foto || persona.foto.includes("placeholder");
  const nombreCompleto = persona.apellido ? `${persona.nombre} ${persona.apellido}` : persona.nombre;
  const targetLink = persona.linkedin;

  const inner = (
    <article className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-surface-line bg-surface-card hover:shadow-lg transition-shadow group">
      {isPlaceholder ? (
        <div className="absolute inset-0 bg-gradient-to-br from-verde-soft via-violeta-soft to-rosa-soft flex items-center justify-center">
          <span className="font-display font-extrabold text-6xl text-white/80">
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
          {persona.area}
        </p>
        {persona.esCore && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            Equipo
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
        aria-label={`LinkedIn de ${nombreCompleto}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-verde-dark rounded-2xl"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function comisionLabel(c: string): string {
  const map: Record<string, string> = {
    comunicacion: "Comunicación",
    encuentros: "Encuentros",
    podcast: "Podcast",
    "red-padres": "Red de familias",
    contenido: "Contenido",
    fundraising: "Fundraising",
    tecnologia: "Tecnología",
    diseno: "Diseño",
    otro: "Voluntariado"
  };
  return map[c] ?? "Voluntariado";
}
