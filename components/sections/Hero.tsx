import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden"
      aria-label="CASACUSIA: bienvenida"
    >
      {/* Background photo — foto grupal = lo opuesto a la soledad */}
      <Image
        src="/fotos/propuestas/casacusia_kids_alta_246.jpg"
        alt="Comunidad Casacusia reunida"
        fill
        className="object-cover"
        priority
        quality={85}
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/70 to-ink/40" />

      <div className="container relative z-10 py-20 md:py-28">
        <div className="max-w-2xl">
          {/* H1 */}
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-[4rem] lg:text-[4.5rem]">
            {t("title")}
            <span className="mt-2 block text-verde">{t("titleLine2")}</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/85 md:text-xl max-w-lg">
            {t("subtitle")}
          </p>

          {/* CTAs — solo 2 */}
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
    </section>
  );
}
