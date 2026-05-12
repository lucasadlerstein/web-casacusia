import { getTranslations } from "next-intl/server";
import { Calendar, MapPin, Video, ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";
import { getUpcomingEvents, type LumaEvent } from "@/lib/luma";

const LUMA_CALENDAR_URL = "https://lu.ma/hipoacusia";

const cardColors = [
  { border: "border-verde/30", badge: "bg-verde text-white", dot: "bg-verde" },
  { border: "border-violeta/30", badge: "bg-violeta text-white", dot: "bg-violeta" },
  { border: "border-rosa/30", badge: "bg-rosa text-white", dot: "bg-rosa" },
] as const;

function formatEventDate(startAt: string, timezone: string) {
  const date = new Date(startAt);
  const day = date.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short", timeZone: timezone });
  const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: timezone });
  return { day: day.charAt(0).toUpperCase() + day.slice(1), time };
}

function cleanEventTitle(name: string): string {
  // Remove emoji flags and "Encuentro Para Personas Con Pérdida Auditiva" redundancy
  return name
    .replace(/[\u{1F1E0}-\u{1F1FF}]{2}\s*/gu, "") // remove flag emojis
    .replace(/\s*-\s*Encuentro\s+(Para|para)\s+Personas\s+Con\s+P.rdida\s+Auditiva/i, "")
    .replace(/\s*-\s*Encuentro\s+para\s+personas\s+con\s+p.rdida\s+auditiva/i, "")
    .replace(/\s*-\s*Encuentro\s+para\s+familias\s+de\s+la\s+hipoacusia/i, " · Familias")
    .trim();
}

function EventCard({ event, index }: { event: LumaEvent; index: number }) {
  const colors = cardColors[index % cardColors.length]!;
  const { day, time } = formatEventDate(event.startAt, event.timezone);
  const isVirtual = event.locationType === "online";
  const title = cleanEventTitle(event.title);
  const location = isVirtual ? "Virtual" : (event.city ?? "Por confirmar");

  return (
    <a
      href={event.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col rounded-2xl border bg-white/10 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl ${colors.border}`}
    >
      {/* Date badge */}
      <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${colors.badge}`}>
        <Calendar size={13} />
        {day}
      </div>

      {/* Title */}
      <h3 className="mt-3 font-display text-lg font-bold text-white leading-tight md:text-xl">
        {title || location}
      </h3>

      {/* Location & time */}
      <div className="mt-auto pt-4 flex items-center gap-4 text-sm text-white/70">
        <span className="inline-flex items-center gap-1.5">
          {isVirtual ? <Video size={14} /> : <MapPin size={14} />}
          {location}
        </span>
        <span>{time} hs</span>
      </div>

      {/* Hover arrow */}
      <ArrowRight
        size={18}
        className="absolute top-5 right-5 text-white/30 transition-all duration-300 group-hover:text-white group-hover:translate-x-1"
      />
    </a>
  );
}

export async function ProximoEncuentro() {
  const t = await getTranslations("home.proximoEncuentro");
  const events = await getUpcomingEvents(3);

  return (
    <Section background="default" ariaLabelledBy="proximo-title">
      <div className="relative overflow-hidden rounded-3xl bg-verde-dark p-8 md:p-12">
        {/* Filamentos decorativos */}
        <Filamento name="amarillo" className="-top-10 -right-10 w-48 rotate-[-20deg]" opacity={18} />
        <Filamento name="morado" className="-bottom-10 -left-10 w-36 rotate-[15deg]" opacity={15} />

        {/* Header */}
        <div className="relative mb-8 max-w-xl">
          <p className="text-verde-soft/80 text-xs font-bold uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 id="proximo-title" className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl mb-4">
            {t("title")}
          </h2>
          <p className="text-white/85 text-lg leading-relaxed">
            {t("body")}
          </p>
        </div>

        {/* Event cards */}
        {events.length > 0 ? (
          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <p className="relative text-white/70 text-lg mb-8">{t("sinFecha")}</p>
        )}

        {/* CTA */}
        <div className="relative">
          <Button
            href={LUMA_CALENDAR_URL}
            variant="secondary"
            size="lg"
            className="bg-white text-verde-dark border-transparent hover:bg-white/90"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("cta")}
          </Button>
        </div>
      </div>
    </Section>
  );
}
