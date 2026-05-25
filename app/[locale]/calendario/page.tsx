import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { buildMetadata } from "@/lib/seo";
import { getUpcomingEvents } from "@/lib/luma";
import { EventFilterClient } from "@/components/sections/EventFilterClient";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calendario" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/calendario",
    locale: locale as Locale,
  });
}

export default async function CalendarioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("calendario");
  const tFilters = await getTranslations("home.proximoEncuentro");
  const events = await getUpcomingEvents();

  const translations = {
    title: tFilters("title"),
    body: tFilters("body"),
    cta: tFilters("cta"),
    sinFecha: tFilters("sinFecha"),
    todos: tFilters("filtros.todos"),
    presencial: tFilters("filtros.presencial"),
    virtual: tFilters("filtros.virtual"),
    familias: tFilters("filtros.familias"),
    argentina: tFilters("filtros.argentina"),
    mundo: tFilters("filtros.mundo"),
    inscribite: tFilters("inscribite"),
    gratuito: tFilters("gratuito"),
    verEnLuma: tFilters("verEnLuma"),
  };

  return (
    <main className="bg-surface-bg">
      <div className="container max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-20 md:pb-24">
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
          {t("heading")}
        </h1>
        <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-2xl">
          {t("intro")}
        </p>

        <div className="mt-10">
          <EventFilterClient
            events={events}
            translations={translations}
            layout="vertical"
            variant="light"
          />
        </div>

        {/* Embed Luma como respaldo si no llegamos a cargar eventos */}
        {events.length === 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-ink mb-3">
              Calendario en vivo
            </h2>
            <p className="text-ink-soft mb-5">
              Estos son los eventos directamente desde Luma. Inscribite desde ahí.
            </p>
            <div className="overflow-hidden rounded-2xl border border-surface-line bg-white shadow-sm">
              <iframe
                src="https://luma.com/embed/calendar/cal-hipoacusia/events"
                title="Calendario Casacusia en Luma"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ border: 0 }}
                aria-label="Calendario de encuentros en Luma"
              />
            </div>
            <p className="mt-3 text-sm text-ink-muted">
              ¿No ves el calendario?{" "}
              <a
                href="https://luma.com/hipoacusia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-ink"
              >
                Abrilo directo en luma.com/hipoacusia →
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
