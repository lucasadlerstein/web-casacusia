import { site } from "@/lib/site";
import { getEquipo } from "@/lib/content";

export function OrganizationSchema() {
  const equipo = getEquipo();

  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.legalName,
    alternateName: site.name,
    description:
      "Fundación argentina que acompaña a personas con hipoacusia y sus familias para que ninguna transite la pérdida auditiva en soledad.",
    url: site.url,
    logo: `${site.url}/brand/logos/logo-vertical.png`,
    foundingDate: site.foundingDate,
    email: site.email,
    areaServed: { "@type": "Country", name: "Argentina" },
    founder: {
      "@type": "Person",
      name: "Lucas Adlerstein",
      sameAs: [site.social.linkedin]
    },
    member: equipo.map((m) => ({
      "@type": "Person",
      name: `${m.nombre} ${m.apellido}`.trim(),
      jobTitle: m.rol,
      ...(m.linkedin ? { sameAs: [m.linkedin] } : {})
    })),
    sameAs: [
      site.social.instagram,
      site.social.linkedin,
      site.social.youtube,
      site.social.facebook,
      site.social.tiktok
    ],
    award: [
      "Aprobación ARCA para deducción de Impuesto a las Ganancias",
      "Declarada de interés social en Misiones",
      "Declarada de interés social en Posadas",
      "Declarada de interés social en Mendoza"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
