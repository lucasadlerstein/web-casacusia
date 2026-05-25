"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, RotateCcw, HandHeart } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";
import { useCountry } from "@/components/country/CountryProvider";
import { urlDonar } from "@/lib/country";

type Respuesta = "viviendo" | "sobreviviendo" | null;
const STORAGE_KEY = "encuesta-viviendo-sobreviviendo";

export function EncuestaViviendo({ hideIfAnswered = false }: { hideIfAnswered?: boolean } = {}) {
  const t = useTranslations("home.encuesta");
  const { country } = useCountry();
  const [respuesta, setRespuesta] = useState<Respuesta>(null);
  const [hydrated, setHydrated] = useState(false);
  const donarUrl = urlDonar(country);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "viviendo" || stored === "sobreviviendo") {
      setRespuesta(stored);
    }
    setHydrated(true);
  }, []);

  // En modo "hideIfAnswered" la sección se oculta cuando la persona ya respondió en este dispositivo.
  // Sirve para mostrar la pregunta en /nosotros, /programas, /sumate sin repetir a quien ya votó.
  if (hideIfAnswered && hydrated && respuesta !== null) return null;

  function elegir(value: "viviendo" | "sobreviviendo") {
    setRespuesta(value);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, value);
  }

  function reset() {
    setRespuesta(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <Section
      background="warm"
      ariaLabelledBy="encuesta-title"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <Filamento name="amarillo" className="-top-10 left-10 w-40 rotate-[18deg]" opacity={15} />
      <Filamento name="morado" className="-bottom-10 right-10 w-44 rotate-[-15deg]" opacity={12} />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-display text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-rosa mb-4">
          {t("eyebrow")}
        </p>

        <h2
          id="encuesta-title"
          className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-ink"
        >
          {t("titulo")}
        </h2>

        <p className="mt-3 text-base md:text-lg text-ink-muted">{t("subtitulo")}</p>

        {!hydrated || respuesta === null ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => elegir("viviendo")}
              disabled={!hydrated}
              className="group relative overflow-hidden rounded-2xl border-2 border-verde bg-verde-soft px-8 py-8 text-left transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-verde/30 disabled:opacity-50"
            >
              <span className="block font-display text-3xl md:text-4xl font-extrabold text-verde-dark">
                {t("viviendo")}
              </span>
              <Heart
                size={32}
                aria-hidden
                className="absolute top-6 right-6 text-verde transition-transform group-hover:scale-110"
              />
            </button>

            <button
              type="button"
              onClick={() => elegir("sobreviviendo")}
              disabled={!hydrated}
              className="group relative overflow-hidden rounded-2xl border-2 border-violeta bg-violeta-soft px-8 py-8 text-left transition-all hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-violeta/30 disabled:opacity-50"
            >
              <span className="block font-display text-3xl md:text-4xl font-extrabold text-violeta-dark">
                {t("sobreviviendo")}
              </span>
            </button>
          </div>
        ) : respuesta === "viviendo" ? (
          <div className="mt-10 rounded-2xl border-2 border-verde bg-surface-card px-8 py-10 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
              {t("respViviendo.titulo")}
            </h3>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">{t("respViviendo.body")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/sumate" variant="primary" size="lg">
                {t("respViviendo.ctaPrimary")}
              </Button>
              <Button href="/contacto" variant="secondary" size="lg">
                {t("respViviendo.ctaSecondary")}
              </Button>
              <a
                href={donarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rosa text-white px-6 py-3 text-sm font-bold transition-all hover:bg-rosa-dark hover:shadow-lg"
              >
                <HandHeart size={16} aria-hidden />
                {t("respViviendo.ctaDonar")}
              </a>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink underline underline-offset-2"
            >
              <RotateCcw size={14} aria-hidden />
              {t("cambiar")}
            </button>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border-2 border-violeta bg-surface-card px-8 py-10 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
              {t("respSobreviviendo.titulo")}
            </h3>
            <p className="mt-4 text-lg text-ink-soft leading-relaxed">{t("respSobreviviendo.body")}</p>
            <ul className="mt-5 space-y-2.5">
              {t.raw("respSobreviviendo.items").map((item: string, i: number) => (
                <li key={i} className="flex gap-3 text-base text-ink-soft leading-relaxed">
                  <span aria-hidden className="text-violeta flex-shrink-0 font-bold">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/calendario" variant="primary" size="lg">
                {t("respSobreviviendo.ctaPrimary")}
              </Button>
              <Button href="/podcast" variant="secondary" size="lg">
                {t("respSobreviviendo.ctaSecondary")}
              </Button>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink underline underline-offset-2"
            >
              <RotateCcw size={14} aria-hidden />
              {t("cambiar")}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
