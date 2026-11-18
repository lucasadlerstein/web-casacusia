import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getExperiencia } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { Viaje } from "@/components/experiencia/Viaje";
import { Cierre, Espacios, Facilita, Formato, Muestra, Preguntas, Sala, TopBar, Voces } from "@/components/experiencia/Secciones";
import { Sumate } from "@/components/experiencia/Sumate";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { meta } = getExperiencia();
  return buildMetadata({
    title: meta.title,
    description: meta.description,
    path: "/experiencia-inmersiva",
    locale: locale as Locale
  });
}

export default async function ExperienciaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getExperiencia();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: c.meta.title,
    description: c.meta.description,
    url: `${SITE_URL}/experiencia-inmersiva`,
    inLanguage: "es-AR",
    isPartOf: { "@type": "WebSite", name: "CASACUSIA", url: SITE_URL },
    about: {
      "@type": "Event",
      name: c.hero.titulo,
      description: c.meta.description,
      duration: "PT17M",
      organizer: { "@type": "NGO", name: "Fundación Casacusia", url: SITE_URL }
    }
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.preguntas.items.map((it) => ({
      "@type": "Question",
      name: it.pregunta,
      acceptedAnswer: { "@type": "Answer", text: it.respuesta }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <TopBar nav={c.nav} />
      <Viaje hero={c.hero} viaje={c.viaje} />
      <Muestra muestra={c.muestra} />
      <Voces voces={c.voces} />
      <Formato formato={c.formato} />
      <Espacios espacios={c.espacios} />
      <Sala sala={c.sala} />
      <Facilita facilita={c.facilita} />
      <Sumate sumate={c.sumate} url={`${SITE_URL}/experiencia-inmersiva`} />
      <Preguntas preguntas={c.preguntas} />
      <Cierre cierre={c.cierre} />
    </>
  );
}
