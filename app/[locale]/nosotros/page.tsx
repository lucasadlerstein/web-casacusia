import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Heart, Target, Lightbulb, Users, ShieldCheck, Sparkles, MessageSquare, HandHeart, BookOpen, Globe, ArrowRight } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/navigation";
import { CuatroCaminos } from "@/components/sections/CuatroCaminos";
import { getVoluntarios } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const VOLUNTARIO_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSco0HoMcPR7RUJbbJsTpTf9b7iwsu0e60slEeJqhcZHEJErrg/viewform";

/** Pick N random unique elements (stable per build). */
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]!);
  }
  return out;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nosotros" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/nosotros",
    locale: locale as Locale
  });
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nosotros" });
  const voluntariosRandom = pickRandom(getVoluntarios(), 4);

  return (
    <>
      {/* 1. Intro: pregunta como título + párrafo abajo */}
      <section className="bg-surface-bg pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-ink">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            {t("hero.body")}
          </p>
        </div>
      </section>

      {/* 2. ¿Qué es la hipoacusia? (Stats Cards) */}
      <Section background="default" ariaLabelledBy="que-es-title" className="pt-10">
        <SectionHeading
          title={<span id="que-es-title">{t("stats.title")}</span>}
          body={t("stats.body")}
          className="mx-auto text-center"
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { key: "world", bg: "bg-rosa/10", text: "text-rosa-dark" },
            { key: "argentina", bg: "bg-verde/10", text: "text-verde-dark" },
            { key: "oms", bg: "bg-violeta/10", text: "text-violeta-dark" }
          ].map((it) => (
            <li key={it.key} className={`rounded-3xl p-8 transition-transform hover:-translate-y-1 ${it.bg}`}>
              <p className={`font-display text-3xl md:text-4xl font-extrabold leading-tight ${it.text}`}>
                {t(`stats.items.${it.key}.n`)}
              </p>
              <p className="mt-3 text-ink-soft text-base">
                {t(`stats.items.${it.key}.l`)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 2.5 Manifiesto — "Vivir, no sobrevivir" */}
      <Section background="default" ariaLabelledBy="manifiesto-title" className="pt-24 pb-24">
        <div className="max-w-3xl mx-auto">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4 text-center">
            {t("manifiesto.eyebrow")}
          </p>
          <h2 id="manifiesto-title" className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink text-center mb-10">
            {t("manifiesto.title")}
          </h2>

          {/* Manifiesto en cascada vertical */}
          <ol className="relative border-l-2 border-amarillo/60 pl-8 space-y-10">
            <li className="relative">
              <span className="absolute -left-[42px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-amarillo text-ink text-xs font-bold shadow-md">1</span>
              <p className="font-display text-xl md:text-2xl font-bold text-ink leading-snug">
                {t("manifiesto.lead")}
              </p>
            </li>
            <li className="relative">
              <span className="absolute -left-[42px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rosa text-white text-xs font-bold shadow-md">2</span>
              <p className="text-lg md:text-xl text-ink-soft leading-relaxed">
                {t("manifiesto.p1")}
              </p>
            </li>
            <li className="relative">
              <span className="absolute -left-[42px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-violeta text-white text-xs font-bold shadow-md">3</span>
              <p className="text-lg md:text-xl text-ink-soft leading-relaxed">
                {t("manifiesto.p2")}
              </p>
            </li>
            <li className="relative">
              <span className="absolute -left-[42px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-verde text-white text-xs font-bold shadow-md">4</span>
              <p className="text-lg md:text-xl text-ink-soft leading-relaxed">
                {t("manifiesto.p3")}
              </p>
            </li>
          </ol>

          <p className="mt-12 font-display text-2xl md:text-3xl font-extrabold tracking-tight text-ink leading-snug text-center">
            {t("manifiesto.kicker")}
          </p>
        </div>
      </Section>

      {/* 3. La Brecha (Editorial Layout) */}
      <Section background="tint" ariaLabelledBy="brecha-title" className="overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-surface-line order-last lg:order-first">
            <Image
              src="/fotos/propuestas/Casacusia_GZ-21.jpg"
              alt={t("brecha.title")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow={t("brecha.eyebrow")}
              title={<span id="brecha-title">{t("brecha.title")}</span>}
            />
            <div className="space-y-6 text-lg text-ink-soft leading-relaxed">
              <p>{t("brecha.p1")}</p>
              <p>{t("brecha.p2")}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Misión y Visión */}
      <Section background="default" ariaLabelledBy="mv-title" className="pt-12 pb-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="font-display text-2xl md:text-3xl text-ink-soft leading-snug">
            {t("horizonte.lead1")}
          </p>
          <p className="mt-3 font-display text-3xl md:text-4xl font-extrabold text-ink leading-tight">
            {t("horizonte.leadHighlight")}
          </p>
          <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
            {t("horizonte.lead2")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Misión */}
          <div className="relative overflow-hidden rounded-3xl p-10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-verde to-verde-dark" />
            <div className="relative z-10 text-white">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-sm border border-white/30">
                <Target size={24} aria-hidden />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-white/80 mb-4">{t("horizonte.mision.label")}</h3>
              <p className="font-display text-xl md:text-2xl leading-tight font-bold drop-shadow-sm">
                {t("horizonte.mision.title")}
              </p>
              <p className="mt-4 text-base text-white/90 leading-relaxed">
                {t("horizonte.mision.body")}
              </p>
            </div>
          </div>
          {/* Visión */}
          <div className="relative overflow-hidden rounded-3xl p-10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-violeta to-violeta-dark" />
            <div className="relative z-10 text-white">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-sm border border-white/30">
                <Lightbulb size={24} aria-hidden />
              </div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-white/80 mb-4">{t("horizonte.vision.label")}</h3>
              <p className="font-display text-xl md:text-2xl leading-tight font-bold drop-shadow-sm">
                {t("horizonte.vision.title")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 4.5 Ejes de trabajo */}
      <Section background="default" ariaLabelledBy="ejes-title">
        <SectionHeading
          eyebrow={t("ejes.eyebrow")}
          title={<span id="ejes-title">{t("ejes.title")}</span>}
          body={t("ejes.body")}
          className="mx-auto text-center"
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { key: "comunidad",    icon: <HandHeart size={24} aria-hidden />, accent: "bg-rosa/10 text-rosa-dark",       border: "border-rosa/20" },
            { key: "herramientas", icon: <BookOpen size={24} aria-hidden />,  accent: "bg-verde/10 text-verde-dark",     border: "border-verde/20" },
            { key: "sociedad",     icon: <Globe size={24} aria-hidden />,     accent: "bg-violeta/10 text-violeta-dark", border: "border-violeta/20" }
          ].map((e, i) => (
            <li
              key={e.key}
              className={`relative rounded-3xl bg-white p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border ${e.border}`}
            >
              <span className="absolute top-6 right-6 font-display text-5xl font-extrabold text-ink/5 leading-none">
                0{i + 1}
              </span>
              <div className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl ${e.accent}`}>
                {e.icon}
              </div>
              <h3 className="relative mt-5 font-display text-xl md:text-2xl font-bold text-ink leading-tight">
                {t(`ejes.items.${e.key}.title`)}
              </h3>
              <p className="relative mt-3 text-ink-soft leading-relaxed">
                {t(`ejes.items.${e.key}.desc`)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Valores (Grilla centrada con íconos) */}
      <Section background="tint" ariaLabelledBy="valores-title">
        <SectionHeading
          title={<span id="valores-title">{t("valores.title")}</span>}
          body={t("valores.body")}
          className="mx-auto text-center"
        />
        <ul className="mt-12 flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {[
            { key: "apoyo", icon: <Heart size={20} />, color: "text-rosa" },
            { key: "empatia", icon: <MessageSquare size={20} />, color: "text-violeta" },
            { key: "simpleza", icon: <Sparkles size={20} />, color: "text-verde" },
            { key: "respeto", icon: <Users size={20} />, color: "text-amarillo" },
            { key: "pureza", icon: <Sparkles size={20} />, color: "text-ink" },
            { key: "innovacion", icon: <Lightbulb size={20} />, color: "text-verde" }
          ].map((v) => (
            <li
              key={v.key}
              className="group flex flex-col items-center text-center w-[260px] rounded-3xl p-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`mb-4 w-12 h-12 rounded-full bg-surface-warm flex items-center justify-center ${v.color}`}>
                {v.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-ink">{t(`valores.items.${v.key}.name`)}</h3>
              <p className="mt-2 text-ink-soft">{t(`valores.items.${v.key}.desc`)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5.5 Voluntarios random */}
      {voluntariosRandom.length > 0 && (
        <Section background="default" ariaLabelledBy="vols-title" className="pb-8">
          <SectionHeading
            eyebrow={t("voluntariosBloque.eyebrow")}
            title={<span id="vols-title">{t("voluntariosBloque.title")}</span>}
            body={t("voluntariosBloque.subtitle")}
            className="mx-auto text-center"
          />
          <ul className="mt-10 grid gap-5 grid-cols-2 sm:grid-cols-4 max-w-4xl mx-auto">
            {voluntariosRandom.map((v) => (
              <li key={v.slug} className="text-center">
                <div className="relative aspect-square mx-auto w-24 sm:w-28 rounded-full overflow-hidden bg-surface-card border border-surface-line">
                  <Image
                    src={v.foto}
                    alt={v.nombre}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-display text-base font-bold text-ink">{v.nombre}</p>
                {v.ciudad && <p className="text-xs text-ink-muted">{v.ciudad}</p>}
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link
              href="/nosotros/equipo"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
            >
              {t("voluntariosBloque.verMas")}
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Section>
      )}

      {/* 6. CTA Inmersivo */}
      <Section background="dark" ariaLabelledBy="cta-title" className="relative py-24 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/fotos/propuestas/casacusia_kids_alta_252.jpg"
            alt={t("cta.title")}
            fill
            sizes="100vw"
            className="object-cover"
            quality={85}
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-ink/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <h2 id="cta-title" className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            {t("cta.title")}
          </h2>
          <p className="mt-6 text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-md">
            {t("cta.body")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="/sumate/donar" className="bg-white text-ink hover:bg-white/90 shadow-lg text-base md:text-lg px-6 py-3">
              Donar
            </Button>
            <a
              href={VOLUNTARIO_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors text-base md:text-lg px-6 py-3 font-semibold"
            >
              Ser voluntario
            </a>
            <Button href="/sumate/donar?cause=conectar" className="bg-rosa text-white hover:bg-rosa-dark text-base md:text-lg px-6 py-3">
              Apadrinar a una familia
            </Button>
          </div>
        </div>
      </Section>

      {/* 7. Las 4 formas (completas) */}
      <CuatroCaminos />
    </>
  );
}
