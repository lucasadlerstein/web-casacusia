import Image from "next/image";
import { RotatingImage } from "@/components/ui/RotatingImage";
import type { AlaParContent } from "@/lib/content";
import { Anillos } from "./Deco";

export function Momento({ momento, apoyo }: { momento: AlaParContent["momento"]; apoyo: AlaParContent["apoyo"] }) {
  return (
    <section className="relative overflow-hidden bg-alapar-cereza text-alapar-crema">
      <Anillos className="absolute -left-24 -bottom-24 z-0 w-64 text-alapar-rosa/30 md:w-96" />
      <div className="container relative grid items-center gap-10 py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:py-28">
        <div>
          <h2 className="font-onest text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-alapar-crema sm:text-[2.5rem] md:text-[3.25rem]">
            {momento.titulo}
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-alapar-crema/85 md:text-[1.35rem] md:leading-[1.6]">
            {momento.parrafos.map((p, i) => (
              <p key={i} className={i === momento.parrafos.length - 1 ? "font-semibold text-alapar-crema" : undefined}>
                {p}
              </p>
            ))}
          </div>
          {/* Quien financia el piloto */}
          <Image src={apoyo.logo} alt={apoyo.logoAlt} width={784} height={800} className="mt-10 h-28 w-auto md:mt-12 md:h-32" />
        </div>

        <figure className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] bg-alapar-rosa/70" aria-hidden="true" />
          {/* Crossfade lento entre fotos de encuentros; con prefers-reduced-motion queda la primera */}
          <RotatingImage
            images={momento.fotos.map((f) => f.src)}
            alt={momento.fotos[0]?.alt ?? ""}
            intervalMs={4500}
            sizes="(min-width: 768px) 38vw, 90vw"
            className="aspect-[3/4] overflow-hidden rounded-[2rem]"
          />
        </figure>
      </div>
    </section>
  );
}
