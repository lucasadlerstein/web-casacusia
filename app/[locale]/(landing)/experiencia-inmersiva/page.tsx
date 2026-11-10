import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getExperiencia } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { Viaje } from "@/components/experiencia/Viaje";
import { Cierre, Espacios, Formato, Muestra, Sala, TopBar, Voces } from "@/components/experiencia/Secciones";
import { Sumate } from "@/components/experiencia/Sumate";
import { Acceso } from "@/components/experiencia/Acceso";
import { estadoAcceso } from "@/lib/experiencia-acceso";

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
    locale: locale as Locale,
    // Versión de trabajo con clave: no indexar hasta que se abra al público.
    noindex: true
  });
}

export default async function ExperienciaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getExperiencia();

  // Mientras se trabaja con el equipo, la página pide una clave.
  const acceso = await estadoAcceso();
  if (acceso !== "abierto") return <Acceso acceso={c.acceso} configurada={acceso === "pide-clave"} />;

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar nav={c.nav} demo={c.demo} />
      <Viaje hero={c.hero} viaje={c.viaje} />
      <Muestra muestra={c.muestra} />
      <Voces voces={c.voces} />
      <Formato formato={c.formato} />
      <Espacios espacios={c.espacios} />
      <Sala sala={c.sala} />
      <Sumate sumate={c.sumate} url={`${SITE_URL}/experiencia-inmersiva`} />
      <Cierre cierre={c.cierre} />
    </>
  );
}
