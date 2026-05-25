import { getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";
import { Filamento } from "@/components/ui/Filamento";
import { getUpcomingEvents } from "@/lib/luma";
import { EventFilterClient } from "./EventFilterClient";

export async function ProximoEncuentro() {
  const t = await getTranslations("home.proximoEncuentro");
  const events = await getUpcomingEvents();

  const translations = {
    title: t("title"),
    body: t("body"),
    cta: t("cta"),
    sinFecha: t("sinFecha"),
    todos: t("filtros.todos"),
    presencial: t("filtros.presencial"),
    virtual: t("filtros.virtual"),
    familias: t("filtros.familias"),
    argentina: t("filtros.argentina"),
    mundo: t("filtros.mundo"),
    inscribite: t("inscribite"),
    gratuito: t("gratuito"),
    verEnLuma: t("verEnLuma"),
  };

  return (
    <Section background="default" ariaLabelledBy="proximo-title">
      <div className="relative overflow-hidden rounded-3xl bg-verde-dark p-8 md:p-12">
        <Filamento name="amarillo" className="-top-10 -right-10 w-48 rotate-[-20deg]" opacity={18} />
        <Filamento name="morado" className="-bottom-10 -left-10 w-36 rotate-[15deg]" opacity={15} />

        <div className="relative mb-8 max-w-xl">
          <h2 id="proximo-title" className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl mb-4">
            {translations.title}
          </h2>
          <p className="text-white/85 text-lg leading-relaxed">
            {translations.body}
          </p>
        </div>

        <EventFilterClient events={events} translations={translations} />
      </div>
    </Section>
  );
}
