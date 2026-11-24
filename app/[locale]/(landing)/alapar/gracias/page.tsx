import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight, MapPin, Video } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { getAlaPar } from "@/lib/content";
import { getUpcomingEvents, type LumaEvent } from "@/lib/luma";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { AlaParButton } from "@/components/alapar/AlaParButton";

const MAX_ENCUENTROS = 3;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { bienvenida } = getAlaPar();
  return buildMetadata({
    title: bienvenida.meta.title,
    description: bienvenida.meta.description,
    path: "/alapar/gracias",
    locale: locale as Locale,
    image: "/alapar/logo-cereza.png",
    // Página de paso después del formulario: no tiene sentido que aparezca en buscadores.
    noindex: true
  });
}

function fecha(e: LumaEvent, locale: string): string {
  const tz = e.timezone || "America/Argentina/Buenos_Aires";
  const lang = locale === "en" ? "en-US" : "es-AR";
  const dia = new Intl.DateTimeFormat(lang, { weekday: "long", day: "numeric", month: "long", timeZone: tz }).format(
    new Date(e.startAt)
  );
  const hora = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(
    new Date(e.startAt)
  );
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} · ${hora} h`;
}

export default async function AlaParGraciasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { bienvenida: b } = getAlaPar();
  const encuentros = (await getUpcomingEvents()).slice(0, MAX_ENCUENTROS);

  return (
    <div className="relative overflow-hidden">
      <section className="bg-alapar-cereza text-alapar-crema">
        <div className="container pb-16 pt-8 md:pb-24 md:pt-10">
          <Link
            href="/alapar"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-alapar-crema/80 underline-offset-4 hover:text-alapar-crema hover:underline"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {b.volver}
          </Link>

          <div className="mx-auto mt-10 max-w-3xl md:mt-14">
            <Image src="/alapar/logo-crema.png" alt="A la Par" width={1081} height={1081} priority className="h-24 w-24 md:h-28 md:w-28" />
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-alapar-ambar px-4 py-1.5 text-sm font-bold text-alapar-cereza-deep">
              {b.etiqueta}
            </p>
            <h1 className="mt-5 font-onest text-alapar-crema text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] md:text-6xl">
              {b.titulo}
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-alapar-crema/90 md:text-xl">
              {b.parrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-onest text-2xl font-extrabold text-alapar-cereza md:text-3xl">{b.encuentrosTitulo}</h2>

          {encuentros.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {encuentros.map((e) => {
                const presencial = e.locationType === "offline";
                const Icono = presencial ? MapPin : Video;
                return (
                  <li key={e.id}>
                    <a
                      href={e.lumaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-3 rounded-3xl border border-alapar-cereza/15 bg-white p-5 transition-[border-color,box-shadow] hover:border-alapar-cereza/40 hover:shadow-[0_18px_40px_-24px_rgba(110,19,53,0.45)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div>
                        <p className="text-sm font-semibold text-alapar-cereza">{fecha(e, locale)}</p>
                        <p className="mt-1 font-onest text-lg font-extrabold leading-snug text-ink">{e.title}</p>
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-ink-soft">
                          <Icono size={15} aria-hidden="true" />
                          {presencial ? `${b.presencial}${e.city ? ` · ${e.city}` : ""}` : b.virtual}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 font-onest font-extrabold text-alapar-cereza">
                        {b.inscribirme}
                        <ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-base leading-relaxed text-ink-soft">{b.sinEncuentros}</p>
          )}

          <div className="mt-8">
            <AlaParButton href={b.hrefCalendario} variant="cereza" size="lg">
              {b.ctaCalendario}
            </AlaParButton>
          </div>
        </div>
      </section>
    </div>
  );
}
