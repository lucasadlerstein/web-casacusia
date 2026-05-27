"use client";

import { MouseEvent, useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

const IDLE_TIMEOUT = 800;

export function Hero() {
  const t = useTranslations("home.hero");
  const [isMoving, setIsMoving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setIsMoving(true);
    clearTimer();
    timerRef.current = setTimeout(() => setIsMoving(false), IDLE_TIMEOUT);
  }, [clearTimer]);

  const handleMouseLeave = useCallback(() => {
    clearTimer();
    setIsMoving(false);
  }, [clearTimer]);

  const handleTextMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      clearTimer();
      setIsMoving(false);
    },
    [clearTimer]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-ink"
      aria-label="CASACUSIA: bienvenida"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background photo */}
      <Image
        src="/fotos/propuestas/Casacusia_GZ-21.jpg"
        alt="Comunidad Casacusia reunida"
        fill
        className={`object-cover transition-all duration-700 ${
          isMoving ? "opacity-100 scale-105" : "opacity-15"
        }`}
        priority
        quality={85}
      />

      <div
        onMouseMove={handleTextMouseMove}
        onMouseEnter={handleTextMouseMove}
        className={`relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-28 text-center transition-all duration-500 ${
          isMoving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <p className="mb-6 font-display italic text-base md:text-lg text-amarillo/90 max-w-xl mx-auto">
          {t("topline")}
        </p>
        <h1 className="font-display font-extrabold leading-[1.1] tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-3 font-display font-extrabold leading-[1.1] tracking-tight text-amarillo text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {t("titleLine2")}
        </p>
        <p className="mt-1 font-display font-extrabold leading-[1.1] tracking-tight text-amarillo text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          {t("titleLine3")}
        </p>

        <p className="mt-6 text-base leading-relaxed text-surface-warm md:text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/nosotros#que-es-title" size="lg">
            {t("ctaPrimary")} <ArrowRight size={18} aria-hidden />
          </Button>
          <Button href="/calendario" size="lg" variant="secondary" className="bg-transparent border-white text-white hover:bg-white hover:text-[#143642]">
            {t("ctaSecondary")}
          </Button>
        </div>
      </div>
    </section>
  );
}
