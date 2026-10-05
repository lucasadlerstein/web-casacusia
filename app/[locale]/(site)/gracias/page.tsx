import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

import { Filamento } from "@/components/ui/Filamento";
import { GraciasDonarCards } from "@/components/sections/GraciasDonarCards";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Gracias por tu consulta",
    description: "Tu mensaje fue enviado. Te contactaremos pronto.",
    path: "/gracias",
    locale: locale as Locale,
    noindex: true
  });
}

const DONAR_URL = "/sumate/donar";

export default async function GraciasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center overflow-hidden py-16">
      <Filamento name="verde" className="top-20 -right-20 w-80 rotate-[15deg]" opacity={12} />
      <Filamento name="rosa" className="bottom-20 -left-20 w-64 rotate-[-20deg]" opacity={10} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-verde/10 text-verde shadow-sm border border-verde/20">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
          Ya enviamos tu consulta.
        </h1>

        <p className="mt-4 text-lg text-ink-soft leading-relaxed">
          Si podés ayudarnos a crecer, tu aporte mensual sostiene todo lo que hacemos.
        </p>

        {/* Donación — link directo al pago, con toggle ARS / USD / MXN */}
        <div className="mt-10">
          <GraciasDonarCards />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={DONAR_URL}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-verde-dark text-white px-8 text-sm font-bold hover:bg-verde transition-colors"
          >
            Ver todas las formas de donar
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-surface-line bg-surface-card px-6 text-sm font-bold text-ink hover:bg-surface-tint transition-all"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
