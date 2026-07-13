import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ExternalLink, Sparkles, Store, HandHeart } from "lucide-react";

import { Section, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import { getTienda, type ProductoTienda } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

/* Tailwind necesita las clases completas en el código, por eso el mapa explícito. */
const softBg: Record<ProductoTienda["color"], string> = {
  verde:    "bg-verde-soft",
  violeta:  "bg-violeta-soft",
  amarillo: "bg-amarillo-soft",
  rosa:     "bg-rosa-soft",
  naranja:  "bg-naranja-soft",
  magenta:  "bg-rosa-soft"
};

const accentText: Record<ProductoTienda["color"], string> = {
  verde:    "text-verde-dark",
  violeta:  "text-violeta-dark",
  amarillo: "text-ink",
  rosa:     "text-rosa-dark",
  naranja:  "text-ink",
  magenta:  "text-rosa-dark"
};

function precioARS(valor: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(valor);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tienda" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/tienda",
    locale: locale as Locale
  });
}

export default async function TiendaPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("tienda");
  const { productos, tiendaCompleta } = getTienda();
  const negua = productos.find((p) => p.destacado);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("hero.titulo"),
    description: t("description"),
    url: `${SITE_URL}/tienda`,
    itemListElement: productos
      .filter((p) => p.link)
      .map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.nombre,
          description: p.descripcion,
          ...(p.imagen ? { image: `${SITE_URL}${p.imagen}` } : {}),
          url: p.link,
          ...(p.precioARS
            ? {
                offers: {
                  "@type": "Offer",
                  price: p.precioARS,
                  priceCurrency: "ARS",
                  url: p.link,
                  seller: { "@type": "NGO", name: "Fundación Casacusia" }
                }
              }
            : {})
        }
      }))
  };

  return (
    <main className="bg-surface-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={t("hero.titulo")}
        subtitle={t("hero.subtitulo")}
        actions={
          <>
            <Button href={tiendaCompleta} target="_blank" rel="noopener noreferrer" size="lg">
              <Store size={20} aria-hidden />
              {t("verTodo.cta")}
              <ExternalLink size={16} aria-hidden />
            </Button>
            <p className="flex items-center gap-2 text-sm text-ink-soft self-center">
              <HandHeart size={18} aria-hidden className="text-verde-dark" />
              {t("hero.nota")}
            </p>
          </>
        }
      />

      {/* Grilla de productos */}
      <Section ariaLabel={t("productos.heading")}>
        <SectionHeading title={t("productos.heading")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => {
            const card = (
              <>
                <div className={cn("relative aspect-square overflow-hidden rounded-t-2xl", softBg[p.color])}>
                  {p.imagen ? (
                    <Image
                      src={p.imagen}
                      alt={p.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Sparkles size={48} aria-hidden className={accentText[p.color]} />
                    </div>
                  )}
                  <span
                    className={cn(
                      "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide bg-surface-bg/95 shadow-sm",
                      accentText[p.color]
                    )}
                  >
                    {p.proximamente ? t("productos.proximamente") : t("productos.aBeneficio")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-ink">{p.nombre}</h3>
                  {p.tagline && <p className={cn("mt-0.5 text-sm font-semibold", accentText[p.color])}>{p.tagline}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.descripcion}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-surface-line pt-4">
                    {p.precioARS ? (
                      <span className="font-display text-xl font-extrabold text-ink">
                        {precioARS(p.precioARS, locale)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-ink-muted">{t("productos.proximamente")}</span>
                    )}
                    {p.link && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark group-hover:underline underline-offset-4">
                        {t("productos.comprar")}
                        <ExternalLink size={14} aria-hidden />
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            const cardClasses =
              "group flex flex-col overflow-hidden rounded-2xl border border-surface-line bg-surface-card transition-shadow";

            return p.link ? (
              <a
                key={p.slug}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.nombre} — ${t("productos.comprar")}`}
                className={cn(
                  cardClasses,
                  "hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-verde/30"
                )}
              >
                {card}
              </a>
            ) : (
              <div key={p.slug} className={cn(cardClasses, "border-dashed")}>
                {card}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Cartas Neguá, destacado */}
      {negua?.link && (
        <Section background="tint" ariaLabel={t("negua.heading")}>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative order-last lg:order-first">
              {negua.imagen && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-violeta-soft shadow-lg">
                  <Image
                    src={negua.imagen}
                    alt={negua.nombre}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-6"
                  />
                </div>
              )}
            </div>
            <div>
              <Eyebrow className="mb-3 text-violeta-dark">{t("negua.eyebrow")}</Eyebrow>
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">
                {t("negua.heading")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t("negua.historia")}</p>
              <p className="mt-3 leading-relaxed text-ink-soft">{t("negua.detalle")}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {([
                  ["🪙", t("negua.palos.oro")],
                  ["🎤", t("negua.palos.basto")],
                  ["🦻", t("negua.palos.espada")],
                  ["🐚", t("negua.palos.copa")]
                ] as const).map(([emoji, palo]) => (
                  <li
                    key={palo}
                    className="inline-flex items-center gap-2 rounded-full bg-surface-card border border-surface-line px-4 py-2 text-sm font-semibold text-ink"
                  >
                    <span aria-hidden>{emoji}</span>
                    {palo}
                  </li>
                ))}
              </ul>

              <blockquote className="mt-6 border-l-4 border-violeta pl-4 font-display text-lg font-bold text-violeta-dark">
                {t("negua.regla")}
              </blockquote>
              <p className="mt-3 text-sm text-ink-muted">{t("negua.paraQuien")}</p>

              <div className="mt-8">
                <Button
                  href={negua.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  className="bg-violeta hover:bg-violeta-dark focus-visible:ring-violeta/30"
                >
                  {t("negua.cta")}
                  <ExternalLink size={16} aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* CTA final: tienda completa en Mercado Libre */}
      <Section background="verde" ariaLabel={t("verTodo.heading")}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            {t("verTodo.heading")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">{t("verTodo.body")}</p>
          <div className="mt-8 flex justify-center">
            <Button
              href={tiendaCompleta}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="bg-white text-verde-dark hover:bg-surface-warm focus-visible:ring-white/40"
            >
              <Store size={20} aria-hidden />
              {t("verTodo.cta")}
              <ExternalLink size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
