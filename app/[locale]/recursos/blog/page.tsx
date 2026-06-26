import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { getBlogPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import { BlogListClient } from "./BlogListClient";
import { NewsletterForm } from "@/components/sections/NewsletterForm";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/recursos/blog",
    locale: locale as Locale
  });
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getBlogPosts();

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: t("metaTitle"),
            description: t("metaDescription"),
            url: `https://casacusia.org/recursos/blog`,
            publisher: {
              "@type": "Organization",
              name: "CASACUSIA",
              url: "https://casacusia.org"
            }
          })
        }}
      />

      <PageHero
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
      />

      <Section>
        <BlogListClient
          posts={posts}
          labels={{
            buscar: t("buscar"),
            todas: t("todas"),
            leerMas: t("leerMas"),
            sinResultados: t("sinResultados"),
            sinResultadosDesc: t("sinResultadosDesc"),
            por: t("por"),
            etiquetas: {
              historias: t("etiqueta.historias"),
              familias: t("etiqueta.familias"),
              tecnologia: t("etiqueta.tecnologia"),
              comunidad: t("etiqueta.comunidad"),
              informacion: t("etiqueta.informacion"),
              podcast: t("etiqueta.podcast")
            }
          }}
        />
      </Section>

      <Section background="warm">
        <div className="max-w-md mx-auto">
          <NewsletterForm
            labels={{
              titulo: t("newsletter.titulo"),
              subtitulo: t("newsletter.subtitulo"),
              nombre: t("newsletter.nombre"),
              email: t("newsletter.email"),
              boton: t("newsletter.boton"),
              exito: t("newsletter.exito")
            }}
          />
        </div>
      </Section>
    </main>
  );
}
