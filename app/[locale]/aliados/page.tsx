import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { getAliados, type Aliado } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const SPONSORS_MES_A_MES = ["marval", "helen-diller-foundation"];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aliados" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/aliados",
    locale: locale as Locale
  });
}

export default async function AliadosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allAliados = getAliados();
  const sponsors = allAliados.filter((a) => SPONSORS_MES_A_MES.includes(a.slug));
  const resto = allAliados.filter((a) => !SPONSORS_MES_A_MES.includes(a.slug));

  return (
    <main className="bg-surface-bg">
      {/* Bloque 1: Nos acompañan mes a mes */}
      {sponsors.length > 0 && (
        <section className="pt-16 pb-12 md:pt-20">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-ink text-center">
              Nos acompañan mes a mes.
            </h1>
            <p className="mt-4 text-ink-soft text-center max-w-2xl mx-auto">
              Empresas y fundaciones que sostienen nuestro trabajo con un aporte regular. Gracias a ellas podemos planear, escalar y llegar más lejos.
            </p>

            <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {sponsors.map((a) => (
                <li key={a.slug}>
                  <SponsorCard aliado={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bloque 2: Todos los demás */}
      <Section background="tint" ariaLabelledBy="todos-title" className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 id="todos-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink">
            Todos los aliados
          </h2>
          <p className="mt-2 text-ink-soft max-w-2xl">
            Empresas, fundaciones e instituciones que aportan productos, servicios, espacios o tiempo para que Casacusia exista.
          </p>

          <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {resto.map((a) => (
              <li key={a.slug}>
                <LogoCard aliado={a} />
              </li>
            ))}
          </ul>

          <p className="mt-12 text-center text-sm text-ink-muted max-w-xl mx-auto">
            ¿Tu empresa quiere ser parte?{" "}
            <Link href={`/${locale}/sumate/proyectos-juntos`} className="font-bold text-verde-dark underline underline-offset-4 hover:text-[#0a6b42]">
              Conocé cómo →
            </Link>
          </p>
        </div>
      </Section>
    </main>
  );
}

function SponsorCard({ aliado }: { aliado: Aliado }) {
  const card = (
    <div className="group relative flex items-center justify-center aspect-[5/3] rounded-3xl bg-white border border-surface-line p-6 shadow-sm hover:shadow-lg hover:border-verde-dark/30 transition-all duration-300">
      <div className="relative w-full h-full">
        <Image
          src={aliado.logo}
          alt={aliado.nombre}
          fill
          className="object-contain p-6"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <span className="sr-only">{aliado.nombre}</span>
      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider font-bold text-ink-muted bg-surface-bg/80 px-2 py-0.5 rounded-full">
        Mes a mes
      </span>
    </div>
  );

  return aliado.web ? (
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" aria-label={`${aliado.nombre} — sitio web`} className="block">
      {card}
    </a>
  ) : card;
}

function LogoCard({ aliado }: { aliado: Aliado }) {
  const card = (
    <div className="group relative flex items-center justify-center aspect-[3/2] rounded-2xl bg-white border border-surface-line p-4 shadow-sm hover:shadow-md hover:border-verde-dark/20 transition-all duration-300">
      <Image
        src={aliado.logo}
        alt={aliado.nombre}
        fill
        className="object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <span className="sr-only">{aliado.nombre}</span>
    </div>
  );

  return aliado.web ? (
    <a href={aliado.web} target="_blank" rel="noopener noreferrer" aria-label={`${aliado.nombre} — sitio web`} className="block">
      {card}
    </a>
  ) : card;
}
