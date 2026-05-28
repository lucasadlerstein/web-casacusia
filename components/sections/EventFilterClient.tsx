"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, ArrowRight, Globe, Users, Monitor, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { LumaEvent, EventTag } from "@/lib/luma";
import { Link } from "@/lib/i18n/navigation";
import { useCountry } from "@/components/country/CountryProvider";
import { nombrePais } from "@/lib/country";

type FilterKey = "todos" | EventTag;

const VALID_TAGS: ReadonlySet<FilterKey> = new Set([
  "todos", "presencial", "virtual", "familias", "argentina", "mundo"
]);

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
  layout?: "horizontal" | "vertical";
  variant?: "dark" | "light";
  defaultTag?: FilterKey;
}

export function EventFilterClient({ events, translations, layout = "horizontal", variant = "dark", defaultTag = "todos" }: Props) {
  const isLight = variant === "light";
  const isVertical = layout === "vertical";
  const searchParams = useSearchParams();
  const initialTag = (() => {
    const t = searchParams.get("tag") as FilterKey | null;
    if (t && VALID_TAGS.has(t)) return t;
    return defaultTag;
  })();
  const [activeFilter, setActiveFilter] = useState<FilterKey>(initialTag);
  const [showOtherCountries, setShowOtherCountries] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { country } = useCountry();

  // Reaccionar a cambios de query params (ej. cuando se navega a /calendario?tag=virtual desde otro lugar)
  useEffect(() => {
    const t = searchParams.get("tag") as FilterKey | null;
    if (t && VALID_TAGS.has(t) && t !== activeFilter) {
      setActiveFilter(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /** Eventos relevantes para el visitante: virtuales + del mismo país. */
  const eventsRelevantes = useMemo(() => {
    if (!country) return events; // sin país → mostramos todos
    return events.filter((e) => e.locationType === "online" || e.country === country);
  }, [events, country]);

  /** Eventos de otros países (no virtuales). */
  const eventsOtrosPaises = useMemo(() => {
    if (!country) return [];
    return events.filter((e) => e.locationType !== "online" && e.country && e.country !== country);
  }, [events, country]);

  /** Base sobre la que se aplican los filtros de tag. */
  const baseEvents = showOtherCountries ? events : eventsRelevantes;

  const availableFilters = useMemo(() => {
    const tagsInEvents = new Set(baseEvents.flatMap((e) => e.tags));
    return filterConfig.filter(
      (f) => f.key === "todos" || tagsInEvents.has(f.key as EventTag)
    );
  }, [baseEvents]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "todos") return baseEvents;
    return baseEvents.filter((e) => e.tags.includes(activeFilter as EventTag));
  }, [baseEvents, activeFilter]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const showArrows = filteredEvents.length > 1 && !isVertical;
  const hayOtrosPaises = eventsOtrosPaises.length > 0;

  return (
    <div className="relative">
      {/* Aviso de filtro por país */}
      {country && hayOtrosPaises && (
        <div className={`mb-5 rounded-2xl border px-4 py-3 flex flex-wrap items-center gap-3 ${
          isLight ? "border-surface-line bg-surface-card" : "border-white/15 bg-white/5 backdrop-blur-sm"
        }`}>
          <p className={`text-sm flex-1 min-w-0 ${isLight ? "text-ink" : "text-white/85"}`}>
            Te mostramos eventos en <strong>{nombrePais(country)}</strong> y los virtuales.{" "}
            <span className={isLight ? "text-ink-muted" : "text-white/60"}>
              Hay {eventsOtrosPaises.length} {eventsOtrosPaises.length === 1 ? "evento" : "eventos"} presenciales en otros países.
            </span>
          </p>
          <button
            type="button"
            onClick={() => setShowOtherCountries((v) => !v)}
            aria-pressed={showOtherCountries}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              showOtherCountries
                ? isLight ? "bg-ink text-white" : "bg-white text-verde-dark"
                : isLight ? "bg-surface-bg text-ink hover:bg-surface-tint" : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Eye size={13} aria-hidden />
            {showOtherCountries ? "Ocultar otros países" : "Ver todos los países"}
          </button>
        </div>
      )}

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
                    ? isLight ? "bg-ink text-white shadow-md" : "bg-white text-verde-dark shadow-lg"
                    : isLight ? "bg-surface-card border border-surface-line text-ink hover:bg-surface-tint" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {translations[key]}
                <span className={`ml-1 text-xs ${
                  isActive
                    ? isLight ? "text-white/60" : "text-verde-dark/60"
                    : isLight ? "text-ink-muted" : "text-white/40"
                }`}>
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

      {/* Event cards — vertical list o horizontal scroll según layout */}
      {filteredEvents.length > 0 ? (
        isVertical ? (
          <ul className="space-y-3 mb-8">
            {filteredEvents.map((event, i) => (
              <li key={event.id}>
                <EventRow event={event} index={i} translations={translations} variant={variant} />
              </li>
            ))}
          </ul>
        ) : (
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
        )
      ) : (
        <div className={`mb-8 rounded-2xl border p-6 md:p-8 ${
          isLight ? "border-surface-line bg-surface-card" : "border-white/15 bg-white/5 backdrop-blur-sm"
        }`}>
          <p className={`text-base md:text-lg leading-relaxed ${isLight ? "text-ink" : "text-white/85"}`}>
            {translations.sinFecha}
          </p>
          <a
            href="https://luma.com/hipoacusia"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:shadow-lg ${
              isLight ? "bg-verde-dark text-white hover:bg-[#0a6b42]" : "bg-white text-verde-dark hover:bg-white/90"
            }`}
          >
            {translations.verEnLuma ?? "Ver calendario en Luma"}
            <ArrowRight size={16} />
          </a>
        </div>
      )}

      {/* CTA → página interna /calendario (sólo en modo horizontal/teaser) */}
      {!isVertical && (
        <Link
          href="/calendario"
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all hover:shadow-lg ${
            isLight ? "bg-verde-dark text-white hover:bg-[#0a6b42]" : "bg-white text-verde-dark hover:bg-white/90"
          }`}
        >
          {translations.cta}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

/** Tarjeta fila para layout vertical (estilo Luma) */
function EventRow({
  event,
  index,
  translations,
  variant
}: {
  event: LumaEvent;
  index: number;
  translations: Record<string, string>;
  variant: "dark" | "light";
}) {
  const colors = cardColors[index % cardColors.length]!;
  const { day, time } = formatEventDate(event.startAt, event.timezone);
  const isVirtual = event.locationType === "online";
  const title = cleanEventTitle(event.title);
  const location = isVirtual ? "Virtual" : (event.city ?? "Por confirmar");
  const flag = isVirtual ? "" : countryFlag(event.country);
  const isLight = variant === "light";

  return (
    <a
      href={event.lumaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border px-5 py-4 transition-all ${
        isLight
          ? "border-surface-line bg-surface-card hover:border-verde-dark hover:shadow-md"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      {/* Fecha grande izquierda */}
      <div className={`shrink-0 flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0 ${
        isLight ? "text-ink" : "text-white"
      }`}>
        <span className={`font-display text-xl sm:text-2xl font-extrabold uppercase tracking-wide ${colors.badge.replace("bg-", "text-").replace(" text-white", "")}`}>
          {day}
        </span>
        <span className={`text-sm sm:mt-1 ${isLight ? "text-ink-muted" : "text-white/60"}`}>
          {time} hs
        </span>
      </div>

      {/* Contenido central */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-display text-lg md:text-xl font-bold leading-snug ${isLight ? "text-ink" : "text-white"}`}>
          {isVirtual && <Monitor size={16} className="inline mr-1.5 -mt-0.5 text-violeta" aria-hidden />}
          {flag && <span className="mr-1.5" aria-hidden>{flag}</span>}
          {title || location}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
          <span className={`inline-flex items-center gap-1 ${isLight ? "text-ink-muted" : "text-white/70"}`}>
            {isVirtual ? <Monitor size={13} aria-hidden /> : <MapPin size={13} aria-hidden />}
            {location}
          </span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isLight ? "bg-verde-soft text-verde-dark" : "bg-verde/20 text-verde-soft"
          }`}>
            {translations.gratuito}
          </span>
          {event.tags.filter((tt) => tt !== "presencial" && tt !== "virtual").map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? "bg-surface-bg text-ink-muted border border-surface-line" : "bg-white/10 text-white/60"
              }`}
            >
              {translations[tag]}
            </span>
          ))}
        </div>
      </div>

      {/* CTA derecha */}
      <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
        isLight
          ? "bg-verde-dark text-white group-hover:bg-[#0a6b42]"
          : "bg-white text-ink group-hover:bg-white/90"
      }`}>
        {translations.inscribite}
        <ArrowRight size={14} aria-hidden />
      </span>
    </a>
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
