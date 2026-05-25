import Image from "next/image";
import type { ReactNode } from "react";

import { Eyebrow } from "./Section";
import { cn } from "@/lib/utils/cn";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  tone?: "default" | "brand";
  backgroundImage?: string;
  className?: string;
};

export function PageHero({ 
  eyebrow, 
  title, 
  subtitle, 
  actions, 
  tone = "default", 
  backgroundImage,
  className 
}: Props) {
  const isBrand = tone === "brand";
  // Imágenes de fondo desactivadas temporalmente a pedido hasta seleccionarlas
  const hasBg = false; // !!backgroundImage;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 md:py-32 flex items-center min-h-[40vh]",
        !hasBg && (isBrand ? "bg-verde text-white" : "bg-surface-tint"),
        !hasBg && "border-b border-surface-line",
        className
      )}
    >
      {/* Background Image & Overlays */}
      {hasBg && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage!}
              alt=""
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>
          <div className="absolute inset-0 z-10 bg-ink/60 mix-blend-multiply" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-ink/40 via-transparent to-ink/20" />
        </>
      )}

      <div className={cn("container relative z-20 max-w-5xl", hasBg && "text-white")}>
        {/* Eyebrow desactivado por decisión de diseño: vamos directo al título sin titulares pequeños. */}
        {/* La prop se mantiene por compatibilidad pero no se renderiza. */}
        {false && eyebrow ? (
          <Eyebrow className={cn("mb-6", (isBrand || hasBg) ? "text-white/80" : "text-verde-dark")}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h1 className={cn(
          "font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-sm",
          hasBg && "drop-shadow-lg"
        )}>
          {title}
        </h1>
        {subtitle ? (
          <p className={cn(
            "mt-6 text-lg md:text-xl leading-relaxed max-w-3xl font-medium",
            (isBrand || hasBg) ? "text-white/90" : "text-ink-soft",
            hasBg && "drop-shadow-md"
          )}>
            {subtitle}
          </p>
        ) : null}
        {actions ? <div className="mt-10 flex flex-wrap gap-4">{actions}</div> : null}
      </div>
    </section>
  );
}
