import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Coffee, Beef, CupSoda, HeartHandshake, Users, Handshake, Gift, ArrowRight, Check } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { DonateOnceButton } from "@/components/ui/DonateOnceButton";
import { EncuestaViviendo } from "@/components/sections/EncuestaViviendo";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/sumate",
    locale: locale as Locale
  });
}

const accesos = [
  { id: "donar",       label: "Donar",                icon: HeartHandshake, tono: "bg-verde-soft text-verde-dark border-verde/30 hover:border-verde-dark" },
  { id: "voluntario",  label: "Ser voluntario",       icon: Users,          tono: "bg-violeta-soft text-violeta-dark border-violeta/30 hover:border-violeta-dark" },
  { id: "proyectos",   label: "Proyectos juntos",     icon: Handshake,      tono: "bg-rosa-soft text-rosa-dark border-rosa/30 hover:border-rosa-dark" },
  { id: "servicios",   label: "Donar servicios",      icon: Gift,           tono: "bg-amarillo-soft text-ink border-amarillo/30 hover:border-amarillo" }
];

export default async function SumatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-surface-bg">
      {/* Heading directo, sin eyebrows */}
      <section className="pt-16 pb-10 md:pt-20">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-ink">
            Cómo podés colaborar
          </h1>
          <p className="mt-5 text-lg text-ink-soft leading-relaxed">
            No importa si sos profesional, si querés donar tu tiempo o si podés aportar económicamente. Cada acción cuenta.
          </p>
        </div>

        {/* 4 botones de acceso rápido */}
        <div className="container max-w-4xl mx-auto px-4 mt-10">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {accesos.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.id}>
                  <a
                    href={`#${a.id}`}
                    className={`flex flex-col items-center justify-center text-center gap-2 rounded-2xl border-2 px-4 py-5 font-semibold text-sm transition-colors ${a.tono}`}
                  >
                    <Icon size={22} aria-hidden />
                    {a.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Sección Donar */}
      <Section id="donar" background="default" ariaLabelledBy="donar-title" className="py-14">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-verde-soft text-verde-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
              <HeartHandshake size={14} aria-hidden /> Donar
            </div>
            <h2 id="donar-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
              Apadriná familias con un aporte mensual.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Tu aporte sostiene encuentros, podcast y la red de familias. Hace que más personas con hipoacusia dejen de transitarla en soledad.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li className="flex items-center gap-2">
                <Coffee size={16} className="text-verde-dark" aria-hidden /> Café · $4.800/mes
              </li>
              <li className="flex items-center gap-2">
                <CupSoda size={16} className="text-verde-dark" aria-hidden /> Café + Tostón · $12.000/mes
              </li>
              <li className="flex items-center gap-2">
                <Beef size={16} className="text-verde-dark" aria-hidden /> Tira de Asado · $25.000/mes
              </li>
            </ul>
            <p className="mt-3 text-xs text-ink-muted">Dalo de baja cuando quieras.</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/sumate/donar" size="lg">
                Ver planes
              </Button>
              <DonateOnceButton variant="ghost" />
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-surface-line shadow-md">
            <Image
              src="/fotos/sumate-donar.jpg"
              alt="Apadriná familias"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      {/* Sección Voluntario */}
      <Section id="voluntario" background="tint" ariaLabelledBy="vol-title" className="py-14">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-surface-line shadow-md order-2 lg:order-1">
            <Image
              src="/fotos/grupo-voluntarios.jpg"
              alt="Voluntarios Casacusia"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-violeta-soft text-violeta-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Users size={14} aria-hidden /> Voluntariado
            </div>
            <h2 id="vol-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
              Poné tu tiempo y tus ganas al servicio de la comunidad.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Buscamos personas para sumar a las áreas de encuentros, podcast, red de familias, comunicación, contenido, fundraising, tecnología y diseño.
            </p>
            <ul className="mt-5 space-y-1.5 text-sm text-ink-soft">
              {["Completás el form", "Si hay match con un área activa, te contactamos", "Si no, quedás en la red para cuando abramos esa área"].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <Check size={16} className="text-violeta-dark mt-0.5 shrink-0" aria-hidden />
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={VOLUNTARIO_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-violeta-dark text-white hover:opacity-90 transition-opacity text-base px-6 py-3 font-bold"
              >
                Completar el formulario
                <ArrowRight size={16} aria-hidden />
              </a>
              <Link
                href="/nosotros/equipo"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-violeta-dark underline underline-offset-4"
              >
                Ver al equipo y voluntarios
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Sección Proyectos juntos (empresas) */}
      <Section id="proyectos" background="default" ariaLabelledBy="proy-title" className="py-14">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rosa-soft text-rosa-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Handshake size={14} aria-hidden /> Proyectos juntos
            </div>
            <h2 id="proy-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
              Para empresas, ONGs e instituciones.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Charlas, workshops, convenios, investigación y campañas conjuntas. Alianzas con propósito y trabajo serio. Aprobación ARCA para deducción de Ganancias.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-1.5 text-sm text-ink-soft">
              {["Charlas", "Workshops", "Campañas", "Convenios", "Investigación", "RSE con sentido"].map((it) => (
                <li key={it} className="flex gap-1.5 items-center">
                  <Check size={14} className="text-rosa-dark shrink-0" aria-hidden />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href="/sumate/proyectos-juntos" size="lg">
                Conocer alianzas
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-surface-line shadow-md">
            <Image
              src="/fotos/sumate-proyectos.jpg"
              alt="Proyectos juntos"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      {/* Pregunta directa (solo si no respondió) */}
      <EncuestaViviendo hideIfAnswered />

      {/* Sección Donar servicios */}
      <Section id="servicios" background="tint" ariaLabelledBy="serv-title" className="py-14">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-surface-line shadow-md order-2 lg:order-1">
            <Image
              src="/fotos/taller-ceramica.jpg"
              alt="Donar servicios"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amarillo-soft text-ink px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-4">
              <Gift size={14} aria-hidden /> Donar servicios
            </div>
            <h2 id="serv-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
              Aportá con lo que ya sabés hacer.
            </h2>
            <p className="mt-4 text-ink-soft leading-relaxed">
              Horas profesionales, productos, infraestructura o pro-bono. Hay muchas formas de sumar.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-1.5 text-sm text-ink-soft">
              {["Tecnología", "Legal", "Contable", "Audiovisual", "Diseño", "Editorial", "Espacios", "Catering / logística"].map((it) => (
                <li key={it} className="flex gap-1.5 items-center">
                  <Check size={14} className="text-amarillo shrink-0" aria-hidden />
                  {it}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href="/sumate/donar-servicios" size="lg">
                Ofrecer servicios
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
