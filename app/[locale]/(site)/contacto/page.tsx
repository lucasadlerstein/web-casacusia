import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle, Mail, Instagram, Linkedin } from "lucide-react";

import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/sections/ContactForm";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

const FOTOS_CONTACTO = [
  "/fotos-nuevas/eventos/casacusia_gz-102.jpg",
  "/fotos-nuevas/eventos/casacusia_gz-117.jpg",
  "/fotos-nuevas/eventos/img_6390.jpg",
  "/fotos-nuevas/eventos/003a0237.jpg"
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacto" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/contacto",
    locale: locale as Locale
  });
}

export default async function ContactoPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale } = await params;
  const { t: typeParam } = await searchParams;
  setRequestLocale(locale);
  const allowedTypes = ["personal", "voluntariado", "prensa", "comunicacion", "empresa", "profesional", "programas", "otro"] as const;
  const initialType = (allowedTypes as readonly string[]).includes(typeParam ?? "") ? (typeParam as string) : "personal";

  return (
    <main className="bg-surface-bg">
      <section className="pt-16 pb-8 md:pt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-ink">
            Escribinos
          </h1>
        </div>
      </section>

      <Section background="default" className="pt-2 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] max-w-6xl mx-auto">
          <aside className="space-y-4">
            <ul className="space-y-4">
              <li>
                <a
                  href={site.whatsappCommunity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <MessageCircle size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">Comunidad de WhatsApp</p>
                    <p className="text-sm text-ink-soft">Sumate a la conversación de todos los días.</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Instagram size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">Instagram</p>
                    <p className="text-sm text-ink-soft">@casacusia.ong</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Linkedin size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">LinkedIn</p>
                    <p className="text-sm text-ink-soft">Fundación Casacusia</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-start gap-3 rounded-2xl bg-surface-card border border-surface-line p-5 hover:border-brand-teal transition-colors"
                >
                  <Mail size={20} aria-hidden className="text-brand-teal mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-ink-soft">{site.email}</p>
                  </div>
                </a>
              </li>
            </ul>
          </aside>

          <section aria-labelledby="form-title">
            <h2 id="form-title" className="font-display text-2xl md:text-3xl font-semibold mb-6">
              Contanos brevemente y te respondemos
            </h2>
            <ContactForm initialType={initialType} />
          </section>
        </div>
      </Section>

      {/* Galería de fotos */}
      <Section background="tint" className="py-12">
        <div className="max-w-6xl mx-auto">
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {FOTOS_CONTACTO.map((src) => (
              <li key={src} className="relative aspect-square rounded-2xl overflow-hidden border border-surface-line">
                <Image
                  src={src}
                  alt="Casacusia"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
