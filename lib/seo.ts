import type { Metadata } from "next";
import type { Locale } from "./i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";
const SITE_NAME = "CASACUSIA";
const DEFAULT_OG_IMAGE = "/og-default.png";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  image?: string;
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  locale = "es",
  image = DEFAULT_OG_IMAGE,
  noindex = false
}: BuildMetadataOptions): Metadata {
  // El canonical tiene que ser auto-referencial por idioma: si la página en
  // inglés declara como canónica a la española, Google la excluye del índice
  // ("Página alternativa con etiqueta canónica adecuada") y el /en nunca se
  // indexa, contradiciendo al hreflang del sitemap.
  const cleanPath = normalizePath(stripLocalePrefix(path));
  const suffix = cleanPath === "/" ? "" : cleanPath;
  const esUrl = `${SITE_URL}${suffix}`;
  const enUrl = `${SITE_URL}/en${suffix}`;
  const canonical = locale === "en" ? enUrl : esUrl;
  const finalImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: esUrl,
        en: enUrl,
        "x-default": esUrl
      }
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "en" ? "en_US" : "es_AR",
      images: [{ url: finalImage, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [finalImage]
    }
  };
}

function normalizePath(path: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function stripLocalePrefix(path: string): string {
  return path.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
}
