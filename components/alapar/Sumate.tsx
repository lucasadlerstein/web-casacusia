import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";
import { AcompanamientoButton } from "./AcompanamientoModal";
import { WebinarAviso } from "./WebinarAviso";
import { Arcos } from "./Deco";

export function Sumate({ sumate, webinar }: { sumate: AlaParContent["sumate"]; webinar: AlaParContent["webinar"] }) {
  return (
    <section id="sumate" className="relative scroll-mt-20 overflow-hidden bg-white">
      <Arcos className="absolute -bottom-6 -left-10 z-0 w-48 text-alapar-ambar md:w-72" />
      <div className="container relative py-20 md:py-28">
        <h2 className="font-onest text-3xl font-extrabold tracking-[-0.02em] text-alapar-cereza sm:text-[2.5rem] md:text-[3rem]">
          {sumate.titulo}
        </h2>

        <div className="mt-8 grid grid-cols-[1.2fr_1fr] gap-3 md:mt-12 md:gap-4">
          {sumate.fotos.map((f) => (
            <div key={f.src} className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem]">
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 768px) 50vw, 60vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border-2 border-alapar-cereza/15 bg-alapar-crema p-8 md:p-10">
            <h3 className="font-onest text-2xl font-extrabold text-ink">{sumate.acompanado.titulo}</h3>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{sumate.acompanado.texto}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <AcompanamientoButton variant="cereza" size="lg">{sumate.acompanado.ctaContacto}</AcompanamientoButton>
              <AlaParButton href={sumate.hrefEncuentros} variant="outline" size="lg">{sumate.acompanado.ctaEncuentros}</AlaParButton>
            </div>
          </article>

          <article className="rounded-[2rem] bg-alapar-cereza p-8 text-alapar-crema md:p-10">
            <h3 className="font-onest text-2xl font-extrabold text-alapar-crema">{sumate.par.titulo}</h3>
            <p className="mt-4 text-lg leading-relaxed text-alapar-crema/85">{sumate.par.texto}</p>
            <div className="mt-7">
              <AlaParButton href={sumate.hrefFormPar} variant="ambar" size="lg">{sumate.par.ctaContacto}</AlaParButton>
            </div>
            <WebinarAviso webinar={webinar} className="mt-7 border-alapar-ambar/60" />
          </article>
        </div>
      </div>
    </section>
  );
}
