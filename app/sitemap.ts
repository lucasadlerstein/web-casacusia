import type { MetadataRoute } from "next";

import { getAliados, getProgramas, getBlogPosts, getRutasDeEscucha } from "@/lib/content";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { getPodcastFeed } from "@/lib/podcast";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

const staticRoutes: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/nosotros", priority: 0.9, changefreq: "monthly" },
  { path: "/nosotros/equipo", priority: 0.8, changefreq: "monthly" },
  { path: "/nosotros/historia", priority: 0.5, changefreq: "yearly" },
  { path: "/programas", priority: 0.9, changefreq: "monthly" },
  { path: "/podcast", priority: 0.9, changefreq: "weekly" },
  { path: "/podcast/rutas", priority: 0.8, changefreq: "monthly" },
  { path: "/aliados", priority: 0.8, changefreq: "monthly" },
  { path: "/sumate", priority: 0.9, changefreq: "monthly" },
  { path: "/sumate/donar", priority: 0.9, changefreq: "monthly" },
  { path: "/sumate/voluntariado", priority: 0.7, changefreq: "monthly" },
  { path: "/sumate/donar-servicios", priority: 0.7, changefreq: "monthly" },
  { path: "/recursos/faq", priority: 0.8, changefreq: "monthly" },
  { path: "/contacto", priority: 0.7, changefreq: "yearly" },
  { path: "/calendario", priority: 0.9, changefreq: "weekly" },
  { path: "/impacto", priority: 0.7, changefreq: "monthly" },
  { path: "/recursos/blog", priority: 0.9, changefreq: "weekly" },
  { path: "/prensa", priority: 0.6, changefreq: "monthly" },
  { path: "/accesibilidad", priority: 0.4, changefreq: "yearly" },
  { path: "/sumate/proyectos-juntos", priority: 0.7, changefreq: "monthly" }
];

function urlFor(path: string, locale: string) {
  if (locale === defaultLocale) return `${BASE}${path}`;
  return `${BASE}/${locale}${path === "/" ? "" : path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Programas individuales
  for (const p of getProgramas()) {
    entries.push({
      url: urlFor(`/programas/${p.slug}`, defaultLocale),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, urlFor(`/programas/${p.slug}`, l)]))
      }
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

  // Rutas de escucha
  for (const r of getRutasDeEscucha()) {
    entries.push({
      url: urlFor(`/podcast/rutas/${r.slug}`, defaultLocale),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, urlFor(`/podcast/rutas/${r.slug}`, l)]))
      }
    });
  }

  // Blog posts
  for (const post of getBlogPosts()) {
    entries.push({
      url: urlFor(`/recursos/blog/${post.slug}`, defaultLocale),
      lastModified: new Date(post.fecha),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, urlFor(`/recursos/blog/${post.slug}`, l)]))
      }
    });
  }

  // Episodios de podcast — cada uno tiene su propia página indexable.
  const feed = await getPodcastFeed();
  if (feed) {
    for (const ep of feed.episodios) {
      entries.push({
        url: urlFor(`/podcast/${ep.slug}`, defaultLocale),
        lastModified: ep.pubDate ? new Date(ep.pubDate) : now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, urlFor(`/podcast/${ep.slug}`, l)]))
        }
      });
    }
  }

  return entries;
}
