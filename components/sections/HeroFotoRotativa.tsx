"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";

const ROTATE_MS = 6000;

/**
 * Foto de fondo rotativa con crossfade. El contenido (`children`) se renderiza
 * encima, anclado a la zona baja de la imagen. El degradado va de claro arriba
 * a oscuro abajo (sin caja) para que el texto se lea sobre cualquier foto.
 */
export function HeroFotoRotativa({
  fotos,
  children,
  className = ""
}: {
  fotos: string[];
  children: ReactNode;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (fotos.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % fotos.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [fotos.length]);

  return (
    <div className={`relative flex items-start overflow-hidden ${className}`}>
      {fotos.map((foto, i) => (
        <Image
          key={foto}
          src={foto}
          alt=""
          fill
          priority={i === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-1000 ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Capa que oscurece toda la foto para dar contraste general */}
      <div className="absolute inset-0 bg-ink/35" />
      {/* Scrim oscuro detrás del texto: casi negro arriba, difuminado hacia abajo */}
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-ink via-ink/85 to-transparent" />
      <div className="relative z-10 w-full px-6 pt-16 pb-10 md:px-10 lg:px-14 lg:pt-20">
        {children}
      </div>
    </div>
  );
}
