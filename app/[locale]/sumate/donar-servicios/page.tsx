import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Code2, Scale, Calculator, Video, PenTool, BookOpenText, Home, Sparkles, ArrowRight } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { Link } from "@/lib/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sumate.donarServicios" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/sumate/donar-servicios",
    locale: locale as Locale
  });
}

export default async function DonarServiciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const necesidades = [
    { icon: <Code2 size={20} aria-hidden />, title: "Tecnología", desc: "Desarrollo web, automatización y herramientas digitales." },
    { icon: <Scale size={20} aria-hidden />, title: "Legal", desc: "Asesoramiento para fundaciones y convenios institucionales." },
    { icon: <Calculator size={20} aria-hidden />, title: "Contable", desc: "Auditoría, balances y gestión administrativa." },
    { icon: <Video size={20} aria-hidden />, title: "Audiovisual", desc: "Edición de video, fotografía y streaming de encuentros." },
    { icon: <PenTool size={20} aria-hidden />, title: "Diseño", desc: "Identidad visual, materiales educativos y UX." },
    { icon: <BookOpenText size={20} aria-hidden />, title: "Editorial", desc: "Redacción, corrección y traducción de contenidos." },
    { icon: <Home size={20} aria-hidden />, title: "Espacios", desc: "Préstamo de salones para encuentros y talleres." }
  ];

  return (
    <main className="bg-surface-bg">
      <section className="pt-16 pb-8 md:pt-20">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Tu talento al servicio de la comunidad
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed">
            Si sos profesional o tenés una empresa, podés donar tus servicios para potenciar el alcance de la Fundación.
          </p>
        </div>
      </section>

      <Section background="default" ariaLabelledBy="nec-title" className="pt-4">
        <h2 id="nec-title" className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-6">
          Áreas donde podés aportar
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl">
          {necesidades.map((n) => (
            <li key={n.title} className="rounded-2xl bg-surface-card border border-surface-line p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal-dark">
                {n.icon}
              </span>
              <p className="mt-4 font-display font-semibold">{n.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{n.desc}</p>
            </li>
          ))}
          {/* Y muchos más */}
          <li className="rounded-2xl bg-verde-soft border-2 border-verde-dark/40 p-6 flex flex-col">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-verde-dark text-white">
              <Sparkles size={20} aria-hidden />
            </span>
            <p className="mt-4 font-display font-extrabold text-verde-dark">Y muchos más</p>
            <p className="mt-1 text-sm text-ink-soft flex-1">
              ¿Tenés otra cosa para aportar? Contanos qué imaginás.
            </p>
            <Link
              href="#form-servicios"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-verde-dark hover:underline underline-offset-4"
            >
              Escribinos <ArrowRight size={14} aria-hidden />
            </Link>
          </li>
        </ul>
      </Section>

      {/* Formulario embebido */}
      <Section background="tint" id="form-servicios" className="py-14">
        <div className="max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink mb-3">
            Contanos qué querés donar
          </h2>
          <p className="text-ink-soft mb-8">
            Te leemos con atención y nos ponemos en contacto para definir juntos el alcance y la modalidad.
          </p>
          <div className="rounded-3xl bg-surface-card border border-surface-line p-6 md:p-8">
            <ContactForm initialType="profesional" />
          </div>
        </div>
      </Section>
    </main>
  );
}
