import type { AlaParContent } from "@/lib/content";
import { Anillos, Chevrons } from "./Deco";

export function Dato({ dato }: { dato: AlaParContent["dato"] }) {
  const { testimonio } = dato;
  return (
    <section className="relative overflow-hidden bg-alapar-cereza-deep text-alapar-crema">
      <Chevrons className="absolute -left-4 bottom-10 z-0 w-40 text-alapar-naranja/60 md:w-56" />
      <Anillos className="absolute -right-20 top-1/2 z-0 w-72 -translate-y-1/2 text-alapar-rosa/25 md:w-[28rem]" />

      <div className="container relative grid items-center gap-12 py-20 md:grid-cols-[1fr_1fr] md:gap-16 md:py-28">
        <div>
          <p className="font-onest text-[6.5rem] font-extrabold leading-[0.85] tracking-[-0.05em] text-alapar-ambar sm:text-[8rem] md:text-[10rem]">
            {dato.numero}
          </p>
          <p className="mt-4 max-w-md font-onest text-2xl font-extrabold leading-tight tracking-[-0.02em] sm:text-3xl">
            {dato.texto}
          </p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-alapar-crema/80">
            {dato.detalle}
          </p>
        </div>

        <figure className="relative z-10 rounded-[2rem] bg-alapar-crema p-8 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] md:p-10">
          <span className="absolute -top-6 left-8 font-onest text-[6rem] leading-none text-alapar-rosa" aria-hidden="true">
            “
          </span>
          <blockquote className="relative pt-4 text-lg leading-relaxed md:text-xl">
            {testimonio.cita}
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3 border-t border-alapar-cereza/10 pt-5">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="h-8 w-8 rounded-full bg-alapar-naranja" />
              <span className="h-8 w-8 rounded-full bg-alapar-rosa" />
            </span>
            <span>
              <span className="block font-onest font-extrabold text-alapar-cereza">{testimonio.autor}</span>
              <span className="block text-sm text-ink-muted">{testimonio.rol}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
