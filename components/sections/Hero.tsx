"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

const IDLE_TIMEOUT = 800;

export function Hero() {
  const t = useTranslations("home.hero");
  const [isMoving, setIsMoving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = useCallback(() => {
    setIsMoving(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsMoving(false), IDLE_TIMEOUT);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsMoving(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      aria-label="CASACUSIA: bienvenida"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background photo */}
      <Image
        src="/fotos/propuestas/Casacusia_GZ-21.jpg"
        alt="Comunidad Casacusia reunida"
        fill
        className={`object-cover transition-all duration-700 ${isMoving ? "scale-105" : "scale-100"}`}
        priority
        quality={85}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isMoving ? "bg-black/5" : "bg-black/30"}`} />

      {/* Contenido centrado con fondo */}
      <div
        className={`relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-28 text-center transition-all duration-500 ${
          isMoving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="rounded-[2rem] bg-[#143642]/90 backdrop-blur-sm px-8 py-10 md:px-14 md:py-14 shadow-2xl">
          <h1 className="font-display font-extrabold leading-[1.1] tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-3 font-display font-extrabold leading-[1.1] tracking-tight text-[#00B980] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            {t("titleLine2")}
          </p>

          <p className="mt-6 text-base leading-relaxed text-[#FFF9F2]/85 md:text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/sumate" size="lg">
              {t("ctaPrimary")} <ArrowRight size={18} aria-hidden />
            </Button>
            <Button href="/programas" size="lg" variant="secondary" className="border-white/40 text-white hover:bg-white/15">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
