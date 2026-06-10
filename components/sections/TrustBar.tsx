"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, ChevronLeft, ChevronRight, Landmark, Award, FileCheck, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const badgeIcons: LucideIcon[] = [FileCheck, Landmark, Landmark, Landmark, Star, Award];

export function TrustBar() {
  const t = useTranslations("home.trust");
  const badges = (t.raw("badges") as string[]);
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % badges.length);
  const prev = () => setCurrent((prev) => (prev - 1 + badges.length) % badges.length);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badges.length]);

  return (
    <section
      aria-label="Reconocimientos y Avales"
      className="relative z-20 -mt-10 mx-auto max-w-4xl px-4"
    >
      <div className="relative rounded-3xl bg-surface-card border-2 border-surface-line shadow-2xl p-8 md:p-12 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-verde/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-violeta/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-teal-dark font-black mb-3">
              <ShieldCheck size={14} strokeWidth={3} aria-hidden />
              {t("institucional")}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              {t("tagline")}
            </h2>
          </div>

          {/* Carousel */}
          <div className="relative flex items-center justify-center">
            {/* Controls */}
            <button 
              onClick={prev}
              className="absolute left-0 z-20 p-2 rounded-full bg-surface-bg border border-surface-line text-ink-soft hover:text-brand-teal hover:border-brand-teal transition-all shadow-sm -ml-2 md:-ml-6"
              aria-label={t("prev")}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={next}
              className="absolute right-0 z-20 p-2 rounded-full bg-surface-bg border border-surface-line text-ink-soft hover:text-brand-teal hover:border-brand-teal transition-all shadow-sm -mr-2 md:-mr-6"
              aria-label={t("next")}
            >
              <ChevronRight size={20} />
            </button>

            {/* Slides */}
            <div className="w-full overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {badges.map((badge, i) => {
                  const Icon = badgeIcons[i % badgeIcons.length] as React.ElementType;
                  return (
                    <div key={i} className="w-full flex-shrink-0 flex flex-col items-center px-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-tint border border-surface-line text-brand-teal mb-6 shadow-sm">
                        <Icon size={40} strokeWidth={1.5} />
                      </div>
                      <p className="text-xl md:text-2xl font-display font-bold text-ink text-center max-w-md leading-tight">
                        {badge}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {badges.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full",
                  current === i ? "w-8 bg-brand-teal" : "w-2 bg-surface-line hover:bg-ink-muted"
                )}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
