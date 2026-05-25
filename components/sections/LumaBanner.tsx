"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LumaBanner() {
  const t = useTranslations("home.proximoEncuentro.banner");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem("luma-banner-dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("luma-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:max-w-sm animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="relative overflow-hidden rounded-2xl bg-ink text-white shadow-2xl border border-white/10 p-6">
        {/* Background accent */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-teal/20 blur-2xl" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-brand-teal text-xs font-bold uppercase tracking-widest mb-3">
            <Calendar size={14} />
            {t("eyebrow")}
          </div>
          
          <h3 className="font-display text-xl font-bold leading-tight mb-2">
            {t("title")}
          </h3>
          
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            {t("body")}
          </p>

          <div className="flex items-center gap-3">
            <Button 
              href="https://luma.com/hipoacusia" 
              className="bg-brand-teal text-ink hover:bg-brand-teal-light w-full py-2.5 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cta")} <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
