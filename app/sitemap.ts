import type { MetadataRoute } from "next";

import { getEpisodios, getAliados } from "@/lib/content";
import { locales, defaultLocale } from "@/lib/i18n/config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

const staticRoutes: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/nosotros", priority: 0.9, changefreq: "monthly" },
  { path: "/nosotros/equipo", priority: 0.8, changefreq: "monthly" },
  { path: "/nosotros/historia", priority: 0.5, changefreq: "yearly" },
  { path: "/nosotros/legal", priority: 0.4, changefreq: "yearly" },
  { path: "/programas", priority: 0.9, changefreq: "monthly" },
  { path: "/podcast", priority: 0.9, changefreq: "weekly" },
  { path: "/aliados", priority: 0.8, changefreq: "monthly" },
  { path: "/sumate", priority: 0.9, changefreq: "monthly" },
  { path: "/sumate/donar", priority: 0.9, changefreq: "monthly" },
  { path: "/sumate/voluntariado", priority: 0.7, changefreq: "monthly" },
  { path: "/sumate/proyectos-juntos", priority: 0.8, changefreq: "monthly" },
  { path: "/sumate/donar-servicios", priority: 0.7, changefreq: "monthly" },
  { path: "/impacto", priority: 0.7, changefreq: "monthly" },
  { path: "/recursos/faq", priority: 0.8, changefreq: "monthly" },
  { path: "/contacto", priority: 0.7, changefreq: "yearly" },
  { path: "/calendario", priority: 0.9, changefreq: "weekly" }
];

function urlFor(path: string, locale: string) {
  if (locale === defaultLocale) return `${BASE}${path}`;
  return `${BASE}/${locale}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    entries.push({
      url: urlFor(route.path, defaultLocale),
      lastModified: now,
      changeFrequency: route.changefreq,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, urlFor(route.path, l)]))
      }
    });
  }

  for (const ep of getEpisodios()) {
    entries.push({
      url: urlFor(`/podcast/${ep.slug}`, defaultLocale),
      lastModified: new Date(ep.fechaPublicacion),
      changeFrequency: "yearly",
      priority: 0.7
    });
  }

  for (const a of getAliados()) {
    entries.push({
      url: urlFor(`/aliados/${a.slug}`, defaultLocale),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5
    });
  }

  return entries;
}
