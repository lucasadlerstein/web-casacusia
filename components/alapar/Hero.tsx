import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";
import { Estallido, Arcos } from "./Deco";

export function Hero({ hero }: { hero: AlaParContent["hero"] }) {
  return (
    <section id="inicio" className="alapar-dots relative overflow-hidden bg-alapar-crema">
      <Estallido className="alapar-rise absolute -left-14 -top-10 z-0 w-36 text-alapar-ambar/80 md:-top-6 md:w-52" />
      <Arcos className="alapar-rise absolute -right-6 bottom-24 z-0 w-32 text-alapar-azul/80 [animation-delay:200ms] md:w-48" />

      <div className="container grid items-center gap-10 pb-16 pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:pb-24 md:pt-20">
        <div className="relative z-10">
          <p className="alapar-rise inline-flex items-center gap-2 rounded-full bg-alapar-cereza/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-alapar-cereza">
            <span className="h-2 w-2 rounded-full bg-alapar-naranja" aria-hidden="true" />
            {hero.etiqueta}
          </p>
          <h1 className="alapar-rise mt-6 font-onest text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-alapar-cereza [animation-delay:80ms] sm:text-5xl md:text-[3.9rem] lg:text-[4.4rem]">
            {hero.titulo}
          </h1>
          <p className="alapar-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft [animation-delay:160ms] md:text-xl">
            {hero.bajada}
          </p>
          <div className="alapar-rise mt-8 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <AlaParButton href="#sumate" variant="cereza" size="lg">
              {hero.ctaAcompanado}
            </AlaParButton>
            <AlaParButton href="#sumate" variant="outline" size="lg">
              {hero.ctaPar}
            </AlaParButton>
          </div>
        </div>

        <div className="alapar-rise relative mx-auto w-full max-w-md [animation-delay:120ms] md:max-w-none">
          <div className="absolute inset-x-6 bottom-2 top-10 rounded-[3rem] bg-alapar-ambar/25 blur-2xl" aria-hidden="true" />
          <Image
            src="/alapar/pares.png"
            alt={hero.ilustracionAlt}
            width={877}
            height={449}
            priority
            sizes="(min-width: 768px) 45vw, 90vw"
            className="relative h-auto w-full drop-shadow-[0_18px_30px_rgba(145,27,71,0.18)]"
          />
        </div>
      </div>
    </section>
  );
}
