import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";

import { Filamento } from "@/components/ui/Filamento";
import { CountryAwareDonateCTA } from "@/components/ui/CountryAwareDonateCTA";

export default async function GraciasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
      <Filamento name="verde" className="top-20 -right-20 w-80 rotate-[15deg]" opacity={12} />
      <Filamento name="rosa" className="bottom-20 -left-20 w-64 rotate-[-20deg]" opacity={10} />
      <Filamento name="punto-lavanda" className="top-1/3 left-1/4 w-6" opacity={45} />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-verde/10 text-verde shadow-sm border border-verde/20">
          <CheckCircle2 size={40} />
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
          Ya enviamos tu consulta.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-ink-soft leading-relaxed">
          Si podés ayudarnos a crecer, te lo agradecemos donando el valor de un café.
        </p>

        <div className="mt-8">
          <CountryAwareDonateCTA />
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-surface-line bg-surface-card px-6 text-sm font-bold text-ink hover:bg-surface-tint transition-all"
          >
            <Home size={16} />
            Volver al inicio
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
