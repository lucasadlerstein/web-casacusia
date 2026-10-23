import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";

export function Sostener({ sostener, apoyo }: { sostener: AlaParContent["sostener"]; apoyo: AlaParContent["apoyo"] }) {
  return (
    <section className="bg-alapar-azul-soft">
      <div className="container grid gap-10 pt-20 md:grid-cols-[1fr_1fr] md:gap-16 md:pt-28">
        <div>
          <h2 className="font-onest text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-alapar-azul sm:text-[2.5rem] md:text-[2.75rem]">
            {sostener.titulo}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{sostener.texto}</p>
        </div>
        <div className="grid gap-5">
          {sostener.opciones.map((op) => (
            <article key={op.titulo} className="rounded-3xl bg-white p-7 md:p-8">
              <h3 className="font-onest text-xl font-extrabold text-ink">{op.titulo}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">{op.texto}</p>
              <div className="mt-5">
                <AlaParButton href={op.href} variant="outline">{op.cta}</AlaParButton>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Quien financia el piloto */}
      <div className="container pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-alapar-azul/15 bg-white px-6 py-8 text-center md:flex-row md:text-left md:px-10">
          <Image src={apoyo.logo} alt={apoyo.logoAlt} width={784} height={800} className="h-28 w-auto shrink-0 md:h-32" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-alapar-azul">{apoyo.etiqueta}</p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">{apoyo.texto}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
