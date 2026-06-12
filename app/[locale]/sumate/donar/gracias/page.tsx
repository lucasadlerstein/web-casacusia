import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, Share2 } from "lucide-react";

import { Link } from "@/lib/i18n/navigation";
import { Section } from "@/components/ui/Section";
import { TestimonioRotativo } from "@/components/sections/TestimonioRotativo";
import { getTestimonios } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const WHATSAPP_MSG = encodeURIComponent(
  "Acabo de donar a Casacusia, una fundación que acompaña a personas con pérdida auditiva. Te la comparto por si te copa sumarte también: https://casacusia.org/sumate/donar"
);
const WHATSAPP_SHARE = `https://api.whatsapp.com/send?text=${WHATSAPP_MSG}`;

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: "Gracias por sumarte",
    description: "Tu aporte sostiene encuentros, podcast y comunidad para miles de personas con hipoacusia.",
    path: "/sumate/donar/gracias",
    locale: locale as Locale
  });
}

export default async function DonarGraciasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const testimonios = getTestimonios({ destacados: true }).slice(0, 12);

  return (
    <main className="bg-surface-bg">
      {/* Hero */}
      <section className="pt-20 pb-10 md:pt-28 md:pb-14">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-verde/10 text-verde shadow-sm border border-verde/20">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Gracias por <span className="text-verde">sumarte</span>.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-ink-soft leading-relaxed">
            Ahora mirá esto.
          </p>
        </div>
      </section>

      {/* Video emocional */}
      <Section background="default" className="pt-0 pb-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display text-lg md:text-xl font-bold text-ink mb-6">
            Si querés emocionarte un poco:
          </p>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl">
            <iframe
              src="https://www.youtube.com/embed/DRWTCe0kEZo"
              title="Importancia del podcast Sordo pero no mudo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </Section>

      {/* CTA de compartir */}
      <Section background="tint" className="py-14">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-verde-soft text-verde-dark mb-5">
            <Share2 size={24} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink leading-tight">
            ¿Se lo mandás a <span className="text-verde-dark">5 personas</span>?
          </h2>
          <p className="mt-4 text-base md:text-lg text-ink-soft leading-relaxed max-w-lg mx-auto">
            Casacusia crece de boca en boca. Tu mensaje vale más que cualquier campaña que podamos hacer.
          </p>
          <div className="mt-8">
            <a
              href={WHATSAPP_SHARE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-verde-dark text-white px-8 py-3.5 text-base font-bold hover:bg-[#0a6b42] transition-colors shadow-lg shadow-verde/20"
            >
              Mandar por WhatsApp
            </a>
          </div>
        </div>
      </Section>

      {/* Testimonios */}
      <Section background="default" className="py-14">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink text-center mb-8">
            Esto es lo que cambia:
          </h2>
          {testimonios.length > 0 && (
            <TestimonioRotativo testimonios={testimonios} />
          )}
        </div>
      </Section>

      {/* Seguinos */}
      <Section background="tint" className="py-14">
        <div className="max-w-md mx-auto text-center">
          <p className="font-display text-lg font-bold text-ink mb-5">— Seguinos —</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.instagram.com/casacusia.ong/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink hover:border-verde-dark transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@Hipoacusico"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink hover:border-verde-dark transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://www.linkedin.com/company/casacusia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-surface-line bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink hover:border-verde-dark transition-colors"
            >
              LinkedIn
            </a>
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
