import { useTranslations } from "next-intl";
import { getImpacto } from "@/lib/content";

type Stat = { value: string; label: string; color: string };

const statColors = [
  "text-verde",
  "text-rosa",
  "text-amarillo",
  "text-violeta",
  "text-verde",
];

export function ImpactStats() {
  const t = useTranslations("home.impacto");
  const impacto = getImpacto();

  const stats: Stat[] = [
    { value: `${impacto.participantesTotales}+`, label: t("items.participantes"), color: statColors[0]! },
    { value: `${impacto.encuentrosRealizados}+`, label: t("items.encuentros"), color: statColors[1]! },
    { value: `${impacto.padresEnRed}+`, label: t("items.familias"), color: statColors[2]! },
    { value: `${impacto.episodiosPodcast}+`, label: t("items.episodios"), color: statColors[3]! },
    { value: `${impacto.paisesAlcanzados ?? 61}`, label: t("items.paises"), color: statColors[4]! },
  ];

  return (
    <section
      className="relative overflow-hidden bg-ink py-20 md:py-28"
      aria-labelledby="impact-title"
    >
      <div className="container relative">
        <div className="mb-12 md:mb-16 text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-rosa">
            {t("eyebrow")}
          </p>
          <h2
            id="impact-title"
            className="mt-4 font-display text-4xl font-bold tracking-tight text-white md:text-5xl"
          >
            {t("title")}
          </h2>
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <dd className={`font-display text-5xl font-extrabold leading-none tracking-tight md:text-7xl ${s.color}`}>
                {s.value}
              </dd>
              <dt className="text-sm font-semibold text-white/80 leading-snug max-w-[140px]">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>

      </div>
    </section>
  );
}
