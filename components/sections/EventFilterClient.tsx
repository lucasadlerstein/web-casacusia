"use client";

import { useState, useMemo, useRef } from "react";
import { Calendar, MapPin, ArrowRight, Globe, Users, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import type { LumaEvent, EventTag } from "@/lib/luma";
import { Link } from "@/lib/i18n/navigation";

type FilterKey = "todos" | EventTag;

const filterConfig: { key: FilterKey; icon: typeof Calendar }[] = [
  { key: "todos", icon: Calendar },
  { key: "presencial", icon: MapPin },
  { key: "virtual", icon: Monitor },
  { key: "familias", icon: Users },
  { key: "argentina", icon: MapPin },
  { key: "mundo", icon: Globe },
];

const cardColors = [
  { border: "border-verde/30", badge: "bg-verde text-white" },
  { border: "border-violeta/30", badge: "bg-violeta text-white" },
  { border: "border-rosa/30", badge: "bg-rosa text-white" },
] as const;

/** Country code → flag emoji */
function countryFlag(code: string | null): string {
  if (!code) return "";
  const flags: Record<string, string> = {
    AR: "\u{1F1E6}\u{1F1F7}",
    MX: "\u{1F1F2}\u{1F1FD}",
    ES: "\u{1F1EA}\u{1F1F8}",
    CL: "\u{1F1E8}\u{1F1F1}",
    CO: "\u{1F1E8}\u{1F1F4}",
    US: "\u{1F1FA}\u{1F1F8}",
    BR: "\u{1F1E7}\u{1F1F7}",
    UY: "\u{1F1FA}\u{1F1FE}",
  };
  return flags[code] ?? "";
}

function formatEventDate(startAt: string, timezone: string) {
  const date = new Date(startAt);
  const day = date.toLocaleDateString("es-AR", {
    weekday: "short", day: "numeric", month: "short", timeZone: timezone,
  });
  const time = date.toLocaleTimeString("es-AR", {
    hour: "2-digit", minute: "2-digit", timeZone: timezone,
  });
  return { day: day.charAt(0).toUpperCase() + day.slice(1), time };
}

/** Strip leading country flag emoji (we render our own) and trim. Keep the full title. */
function cleanEventTitle(name: string): string {
  return name.replace(/^[\u{1F1E0}-\u{1F1FF}]{2}\s*/gu, "").trim();
}

interface Props {
  events: LumaEvent[];
  translations: Record<string, string>;
}

export function EventFilterClient({ events, translations }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("todos");
  const scrollRef = useRef<HTMLDivElement>(null);

  const availableFilters = useMemo(() => {
    const tagsInEvents = new Set(events.flatMap((e) => e.tags));
    return filterConfig.filter(
      (f) => f.key === "todos" || tagsInEvents.has(f.key as EventTag)
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "todos") return events;
    return events.filter((e) => e.tags.includes(activeFilter as EventTag));
  }, [events, activeFilter]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const showArrows = filteredEvents.length > 1;

  return (
    <div className="relative">
      {/* Filter pills + scroll controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar encuentros">
          {availableFilters.map(({ key, icon: Icon }) => {
            const isActive = activeFilter === key;
            const count = key === "todos"
              ? events.length
              : events.filter((e) => e.tags.includes(key as EventTag)).length;

            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-verde-dark shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {translations[key]}
                <span className={`ml-1 text-xs ${isActive ? "text-verde-dark/60" : "text-white/40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {showArrows && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              aria-label="Anterior"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-verde-dark transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              aria-label="Siguiente"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-verde-dark transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Event cards — horizontal scroll, no pagination */}
      {filteredEvents.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 mb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {filteredEvents.map((event, i) => (
            <div
              key={event.id}
              className="snap-start flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
            >
              <EventCard event={event} index={i} translations={translations} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/70 text-lg mb-8">{translations.sinFecha}</p>
      )}

      {/* CTA → página interna /calendario */}
      <Link
        href="/calendario"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-verde-dark transition-all hover:bg-white/90 hover:shadow-lg"
      >
        {translations.cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function EventCard({
  event,
  index,
  translations,
}: {
  event: LumaEvent;
  index: number;
  translations: Record<string, string>;
}) {
  const colors = cardColors[index % cardColors.length]!;
  const { day, time } = formatEventDate(event.startAt, event.timezone);
  const isVirtual = event.locationType === "online";
  const title = cleanEventTitle(event.title);
  const location = isVirtual ? "Virtual" : (event.city ?? "Por confirmar");
  const flag = isVirtual ? "" : countryFlag(event.country);

  return (
    <a
      href={event.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col rounded-2xl bg-white/10 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Date badge */}
      <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${colors.badge}`}>
        <Calendar size={13} />
        {day}
      </div>

      {/* Title with flag/icon */}
      <h3 className="mt-3 font-display text-base md:text-lg font-bold text-white leading-snug line-clamp-4">
        {isVirtual && <Monitor size={16} className="inline mr-1.5 -mt-0.5 text-violeta-soft" />}
        {flag && <span className="mr-1.5">{flag}</span>}
        {title || location}
      </h3>

      {/* Free badge */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full bg-verde/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-verde-soft">
          {translations.gratuito}
        </span>
        {event.tags.filter(t => t !== "presencial" && t !== "virtual").map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60"
          >
            {translations[tag]}
          </span>
        ))}
      </div>

      {/* Location & time */}
      <div className="mt-auto pt-4 flex items-center justify-between text-sm text-white/70">
        <span className="inline-flex items-center gap-1.5">
          {isVirtual ? <Monitor size={14} className="text-violeta-soft" /> : <MapPin size={14} />}
          {location}
        </span>
        <span>{time} hs</span>
      </div>

      {/* Hover CTA */}
      <span className="absolute top-5 right-5 text-xs font-semibold text-white/0 transition-all duration-300 group-hover:text-white/70">
        {translations.inscribite} →
      </span>
    </a>
  );
}
