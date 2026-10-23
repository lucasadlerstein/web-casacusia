import type { AlaParContent } from "@/lib/content";
import { AlaParButton } from "./AlaParButton";

export function Sostener({ sostener }: { sostener: AlaParContent["sostener"] }) {
  return (
    <section className="bg-alapar-azul-soft">
      <div className="container grid gap-10 py-20 md:grid-cols-[1fr_1fr] md:gap-16 md:py-28">
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

    </section>
  );
}
