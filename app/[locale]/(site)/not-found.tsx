"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Filamento } from "@/components/ui/Filamento";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden">
      {/* Visual background accents */}
      <Filamento name="verde" className="top-1/4 -left-20 w-64 rotate-[-20deg]" opacity={15} />
      <Filamento name="morado" className="bottom-1/4 -right-20 w-72 rotate-[15deg]" opacity={12} />
      <Filamento name="punto-naranja" className="top-20 right-1/4 w-8" opacity={40} />

      <div className="relative z-10">
        <p className="font-display text-verde font-black text-8xl md:text-[10rem] leading-none tracking-tighter opacity-20">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-soft max-w-md mx-auto leading-relaxed">
          {t("body")}
        </p>

        <div className="mt-10">
          <Link
            href="/"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-verde-dark px-8 text-sm font-bold text-white hover:bg-verde transition-all hover:shadow-lg hover:shadow-verde/20 active:scale-95"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
