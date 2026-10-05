import type { AlaParContent } from "@/lib/content";
import { Anillos } from "./Deco";

export function Momento({ momento }: { momento: AlaParContent["momento"] }) {
  return (
    <section className="relative overflow-hidden bg-alapar-cereza text-alapar-crema">
      <Anillos className="absolute -right-20 -top-20 z-0 w-56 text-alapar-rosa/35 md:w-80" />
      <div className="container relative py-20 md:py-28">
        <div className="max-w-3xl">
          <h2 className="font-onest text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-4xl md:text-[3.25rem]">
            {momento.titulo}
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-alapar-crema/85 md:text-[1.35rem] md:leading-[1.6]">
            {momento.parrafos.map((p, i) => (
              <p key={i} className={i === momento.parrafos.length - 1 ? "font-semibold text-alapar-crema" : undefined}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
