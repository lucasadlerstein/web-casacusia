import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";
import { RotatingImage } from "@/components/ui/RotatingImage";
import { DonateChoiceButton } from "@/components/ui/DonateChoiceButton";

const FOTOS_ROTACION = [
  "/fotos/sumate-comunidad.jpg",
  "/fotos-nuevas/eventos/003a0237.jpg",
  "/fotos-nuevas/eventos/img_7165heic.jpg",
  "/fotos/propuestas/casacusia_kids_alta_67.jpg"
];

export function Esencia() {
  const t = useTranslations("home.esencia");

  return (
    <section
      className="relative overflow-hidden bg-ink py-24 md:py-32"
      aria-labelledby="esencia-title"
    >
      {/* Filamentos sutiles de fondo */}
      <Filamento name="verde"   className="-top-20 -right-16 w-80 rotate-[-25deg]" opacity={15} />
      <Filamento name="morado"  className="-bottom-20 -left-16 w-64 rotate-[20deg]" opacity={15} />

      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Columna Izquierda: Texto */}
          <div className="max-w-xl z-10">
            <h2
              id="esencia-title"
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white"
            >
              <span className="block">
                <span className="text-verde">{t("titleLine1Pre")}</span>{" "}
                <s className="text-white/40 decoration-rosa decoration-[6px] md:decoration-[8px]">
                  {t("titleLine1Tachado")}
                </s>
              </span>
              <span className="block mt-2 text-amarillo">{t("titleLine2")}</span>
            </h2>

            <p className="mt-8 text-lg leading-relaxed text-white/85 md:text-xl font-medium">
              {t("body")}
            </p>
            <p className="mt-5 text-lg leading-relaxed text-white/85 md:text-xl font-medium">
              {t("bodyExtra")}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href="/sumate"
                size="lg"
                className="bg-white text-ink hover:bg-white/90"
              >
                {t("cta")}
              </Button>
              <DonateChoiceButton
                label={t("ctaDonar")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rosa text-white hover:bg-rosa-dark transition-colors text-base px-6 py-3 font-bold shadow-md"
              />
            </div>
          </div>

          {/* Columna Derecha: Rotación de imágenes */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mt-10 lg:mt-0">
            {/* Elemento decorativo de fondo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/20 to-verde/20 rounded-3xl transform translate-x-4 translate-y-4 -rotate-3" />

            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <RotatingImage
                images={FOTOS_ROTACION}
                alt="Comunidad Casacusia"
                intervalMs={6000}
                className="w-full h-full"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-ink/20 mix-blend-multiply pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
