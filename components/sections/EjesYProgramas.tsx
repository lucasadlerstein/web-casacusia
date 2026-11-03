import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Users, MonitorSmartphone, HeartHandshake, Mic, Bot, BookOpen, MessageCircle } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Link } from "@/lib/i18n/navigation";
import { getProgramas } from "@/lib/content";

// Mapeo manual de fotos e íconos para cada programa basado en su slug
const programAssets: Record<string, { photo: string; icon: React.ReactNode; color: string }> = {
  "alapar": {
    photo: "/alapar/momento-abrazo.jpg",
    icon: <HeartHandshake size={24} aria-hidden />,
    color: "from-alapar-cereza/80 to-alapar-cereza-deep/90"
  },
  "encuentros": {
    photo: "/fotos/propuestas/Casacusia_GZ-21.jpg",
    icon: <Users size={24} aria-hidden />,
    color: "from-verde/80 to-verde-dark/90"
  },
  "encuentros-virtuales": {
    photo: "/fotos-nuevas/eventos/captura-de-pantalla-2025-12-26-a-las-123513-p-m.jpg",
    icon: <MonitorSmartphone size={24} aria-hidden />,
    color: "from-violeta/80 to-violeta-dark/90"
  },
  "red-padres-madres": {
    photo: "/fotos/propuestas/casacusia_kids_alta_186.jpg",
    icon: <HeartHandshake size={24} aria-hidden />,
    color: "from-rosa/80 to-rosa-dark/90"
  },
  "comunidad-whatsapp": {
    photo: "/fotos/encuentro-patio.jpg",
    icon: <MessageCircle size={24} aria-hidden />,
    color: "from-verde/80 to-verde-dark/90"
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
  const todos = getProgramas();
  // El programa nuevo va destacado arriba, a lo ancho; el resto en la grilla
  const nuevo = todos.find((p) => p.nuevo);
  const programas = todos.filter((p) => p !== nuevo);

  return (
    <Section background="tint" ariaLabelledBy="ejes-title" className="pt-24 pb-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        {t("eyebrow") && (
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4">
            {t("eyebrow")}
          </p>
        )}
        <h2 id="ejes-title" className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink">
          {t("title")}
        </h2>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed">
          {t("body")}
        </p>
      </div>

      {nuevo && (
        <article className="group relative mb-8 grid overflow-hidden rounded-3xl bg-alapar-cereza shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-alapar-cereza/20 md:grid-cols-[1.15fr_1fr]">
          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="inline-flex w-fit items-center rounded-full bg-alapar-ambar px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
              {t("nuevoPrograma")}
            </p>
            <h3 className="mt-5 font-display text-3xl md:text-4xl font-extrabold leading-tight text-alapar-crema">
              {nuevo.titulo}
              <span className="mt-1 block text-lg md:text-xl font-semibold text-alapar-crema/80">
                {nuevo.subtitulo}
              </span>
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-alapar-crema/90">
              {nuevo.resumen}
            </p>
            <div className="mt-8">
              <Link
                href={nuevo.landing ?? nuevo.cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-alapar-crema px-6 py-3 font-bold text-alapar-cereza transition-colors hover:bg-white after:absolute after:inset-0"
              >
                {nuevo.cta.label}
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="relative order-first min-h-[220px] md:order-none md:min-h-[380px]">
            <Image
              src={programAssets[nuevo.slug]?.photo ?? "/fotos/hero-comunidad.jpg"}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
            />
            <Image
              src="/alapar/logo-crema.png"
              alt=""
              width={1081}
              height={1081}
              className="absolute bottom-4 right-4 h-20 w-20 md:bottom-5 md:right-5 md:h-28 md:w-28 drop-shadow-lg"
            />
          </div>
        </article>
      )}

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
              className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-verde/10 hover:-translate-y-1 transition-all duration-500"
            >
              {/* Imagen Superior */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={assets.photo}
                  alt={titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Icon Overlay */}
                <div className="absolute bottom-4 left-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
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
                      className="inline-flex items-center justify-center gap-2 font-bold text-white bg-ink hover:bg-ink-soft transition-colors w-full py-3 rounded-full"
                    >
                      {ctaLabel}
                      <ArrowRight size={18} />
                    </a>
                  ) : (
                    <Link
                      href={p.cta.href}
                      className="inline-flex items-center justify-center gap-2 font-bold text-white bg-ink hover:bg-ink-soft transition-colors w-full py-3 rounded-full"
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
