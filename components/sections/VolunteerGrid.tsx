"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import type { Voluntario, Comision } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

type Props = {
  voluntarios: Voluntario[];
  comisiones: { comision: Comision; count: number }[];
};

export function VolunteerGrid({ voluntarios, comisiones }: Props) {
  const t = useTranslations("sumate.voluntariado");
  const [active, setActive] = useState<Comision | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? voluntarios : voluntarios.filter((v) => v.comision === active)),
    [voluntarios, active]
  );

  return (
    <div>
      <div
        role="group"
        aria-label={t("filterLabel")}
        className="flex gap-2 overflow-x-auto snap-x pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0"
        style={{ scrollbarWidth: "none" }}
      >
        <FilterChip active={active === "all"} onClick={() => setActive("all")}>
          {t("filterAll")} · {voluntarios.length}
        </FilterChip>
        {comisiones.map((c) => (
          <FilterChip key={c.comision} active={active === c.comision} onClick={() => setActive(c.comision)}>
            {t(`commission.${c.comision}`)} · {c.count}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-soft">{t("noResults")}</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {filtered.map((v) => {
            const nombreCompleto = v.apellido ? `${v.nombre} ${v.apellido}` : v.nombre;
            return (
              <li key={v.slug}>
                <article className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-surface-line bg-surface-card">
                  <Image
                    src={v.foto}
                    alt={nombreCompleto}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-display font-bold text-base md:text-lg leading-tight">
                      {nombreCompleto}
                    </p>
                    {/* Rol oculto por ahora — el dato sigue en content/voluntarios.json */}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 shrink-0 snap-start whitespace-nowrap px-5 rounded-full text-sm font-bold transition-all duration-300 border shadow-sm",
        active
          ? "bg-ink text-white border-ink scale-105"
          : "bg-surface-card text-ink-soft border-surface-line hover:border-brand-teal hover:text-brand-teal hover:bg-brand-teal/5"
      )}
    >
      {children}
    </button>
  );
}
