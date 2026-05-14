import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Users, MonitorSmartphone, HeartHandshake, Mic, Bot, BookOpen } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Link } from "@/lib/i18n/navigation";
import { getProgramas } from "@/lib/content";

// Mapeo manual de fotos e íconos para cada programa basado en su slug
const programAssets: Record<string, { photo: string; icon: React.ReactNode; color: string }> = {
  "encuentros": {
    photo: "/fotos/propuestas/Casacusia_GZ-21.jpg",
    icon: <Users size={24} aria-hidden />,
    color: "from-verde/80 to-verde-dark/90"
  },
  "encuentros-virtuales": {
    photo: "/fotos/propuestas/DSC00009.jpg",
    icon: <MonitorSmartphone size={24} aria-hidden />,
    color: "from-violeta/80 to-violeta-dark/90"
  },
  "red-padres-madres": {
    photo: "/fotos/propuestas/casacusia_kids_alta_186.jpg",
    icon: <HeartHandshake size={24} aria-hidden />,
    color: "from-rosa/80 to-rosa-dark/90"
  },
  "podcast": {
    photo: "/brand/podcast/spnm-alta.jpg",
    icon: <Mic size={24} aria-hidden />,
    color: "from-amarillo/80 to-[#B8860B]/90" // dark golden
  },
  "cami": {
    photo: "/fotos/propuestas/DSC00009.jpg",
    icon: <Bot size={24} aria-hidden />,
    color: "from-brand-teal/80 to-brand-teal-dark/90"
  },
  "recursera": {
    photo: "/fotos/taller-adultos.jpg",
    icon: <BookOpen size={24} aria-hidden />,
    color: "from-rosa/80 to-rosa-dark/90"
  }
};

export function EjesYProgramas() {
  const t = useTranslations("home.iniciativas");
  const tItems = useTranslations("programas.items");
  const programas = getProgramas();

  return (
    <Section background="tint" ariaLabelledBy="ejes-title" className="pt-24 pb-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-verde mb-4">
          {t("eyebrow")}
        </p>
        <h2 id="ejes-title" className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
          {t("title")}
        </h2>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">
          {t("body")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {programas.map((p) => {
          const assets = programAssets[p.slug] || {
            photo: "/fotos/hero-comunidad.jpg",
            icon: <Users size={24} aria-hidden />,
            color: "bg-ink"
          };
          // Use translations for program text if available, fall back to JSON data
          const titulo = tItems.has(`${p.slug}.titulo`) ? tItems(`${p.slug}.titulo`) : p.titulo;
          const resumen = tItems.has(`${p.slug}.resumen`) ? tItems(`${p.slug}.resumen`) : p.resumen;
          const ctaLabel = tItems.has(`${p.slug}.cta`) ? tItems(`${p.slug}.cta`) : p.cta.label;
          
          return (
            <div 
              key={p.slug}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-surface-line hover:border-verde hover:shadow-2xl hover:shadow-verde/10 transition-all duration-500"
            >
              {/* Imagen Superior */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={assets.photo}
                  alt={titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Icon Overlay */}
                <div className="absolute bottom-4 left-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
                  {assets.icon}
                </div>
              </div>

              {/* Contenido siempre visible */}
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-2xl font-bold text-ink leading-tight">
                  {titulo}
                </h3>
                <p className="mt-4 text-ink-soft leading-relaxed flex-1">
                  {resumen}
                </p>
                
                <div className="mt-8">
                  {p.cta.href.startsWith("http") ? (
                    <a
                      href={p.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-bold text-white bg-ink hover:bg-ink-soft transition-colors w-full py-3 rounded-xl"
                    >
                      {ctaLabel}
                      <ArrowRight size={18} />
                    </a>
                  ) : (
                    <Link
                      href={p.cta.href}
                      className="inline-flex items-center justify-center gap-2 font-bold text-white bg-ink hover:bg-ink-soft transition-colors w-full py-3 rounded-xl"
                    >
                      {ctaLabel}
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
