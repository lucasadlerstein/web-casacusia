import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section
      className="group/hero relative min-h-[85vh] flex items-center overflow-hidden"
      aria-label="CASACUSIA: bienvenida"
    >
      {/* Background photo */}
      <Image
        src="/fotos/propuestas/Casacusia_GZ-21.jpg"
        alt="Comunidad Casacusia reunida"
        fill
        className="object-cover transition-transform duration-1000 group-hover/hero:scale-105"
        priority
        quality={85}
      />

      {/* Overlay: oscuro por defecto, se aclara en hover para revelar la foto */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/50 transition-opacity duration-700 group-hover/hero:opacity-40" />

      {/* Contenido: visible por defecto, se desvanece en hover */}
      <div className="container relative z-10 py-20 md:py-28 transition-opacity duration-700 group-hover/hero:opacity-0">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-[4rem] lg:text-[4.5rem]">
            {t("title")}
            <span className="mt-2 block text-verde">{t("titleLine2")}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/85 md:text-xl max-w-lg">
            {t("subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/sumate" size="lg">
              {t("ctaPrimary")} <ArrowRight size={18} aria-hidden />
            </Button>
            <Button href="/programas" size="lg" variant="secondary" className="border-white/30 text-white hover:bg-white/10">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
      </div>

      {/* Hint en la esquina para invitar a hacer hover */}
      <div className="absolute bottom-6 right-6 z-10 text-white/40 text-xs font-medium tracking-wider uppercase transition-opacity duration-700 group-hover/hero:opacity-0 hidden md:block">
        hover para ver la foto →
      </div>
    </section>
  );
}
