import type { ReactNode } from "react";
import Image from "next/image";
import type { AlaParContent } from "@/lib/content";

/** Reemplaza {solo} y {par} del título por los dos conceptos, cada uno con su color. */
function renderTitulo(titulo: string, solo: string, par: string): ReactNode[] {
  return titulo.split(/(\{solo\}|\{par\})/).map((parte, i) => {
    if (parte === "{solo}") {
      return (
        <span key={i} className="text-ink-muted line-through decoration-alapar-naranja/60 decoration-[0.08em]">
          {solo}
        </span>
      );
    }
    if (parte === "{par}") {
      return (
        <span key={i} className="whitespace-nowrap bg-gradient-to-r from-alapar-naranja to-alapar-rosa bg-clip-text text-transparent">
          {par}
        </span>
      );
    }
    return parte;
  });
}

export function Contraste({ contraste }: { contraste: AlaParContent["contraste"] }) {
  return (
    <section className="bg-alapar-crema">
      <div className="container py-20 md:py-28">
        <h2 className="mx-auto max-w-3xl text-center font-onest text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-alapar-cereza sm:text-[2.5rem] md:text-[3rem]">
          {renderTitulo(contraste.titulo, contraste.labelSolo, contraste.labelPar)}
        </h2>

        <div className="mx-auto mt-12 max-w-4xl md:mt-16">
          <div className="hidden grid-cols-2 gap-6 px-6 pb-3 text-xs font-bold uppercase tracking-[0.16em] md:grid">
            <span className="text-ink-muted">{contraste.labelSolo}</span>
            <span className="text-alapar-cereza">{contraste.labelPar}</span>
          </div>

          <ol className="divide-y divide-alapar-cereza/10 overflow-hidden rounded-3xl border border-alapar-cereza/10 bg-white/60 shadow-[0_24px_60px_-40px_rgba(145,27,71,0.35)]">
            {contraste.items.map((item, i) => (
              <li key={i} className="grid gap-3 px-6 py-6 md:grid-cols-2 md:gap-6 md:py-7">
                <p className="flex items-start gap-3 text-base text-ink-muted md:text-lg">
                  <span className="mt-[0.55em] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink-muted/50" aria-hidden="true" />
                  <span>
                    <span className="mr-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] md:hidden">{contraste.labelSolo}</span>
                    {item.solo}
                  </span>
                </p>
                <p className="flex items-start gap-3 text-base font-semibold text-alapar-cereza md:text-lg">
                  <span className="mt-[0.5em] flex shrink-0 -space-x-1" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-alapar-naranja" />
                    <span className="h-3 w-3 rounded-full bg-alapar-rosa" />
                  </span>
                  <span>
                    <span className="mr-2 text-[0.7rem] font-bold uppercase tracking-[0.16em] md:hidden">{contraste.labelPar}</span>
                    {item.par}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* La frase fuerte del programa: banda propia, a todo el ancho */}
      <div className="container pb-20 md:pb-28">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-16 text-center shadow-[0_30px_80px_-50px_rgba(145,27,71,0.45)] md:px-12 md:py-24">
          <Image src="/alapar/pares.png" alt="" width={877} height={449} className="mx-auto mb-8 h-auto w-28 md:w-36" />
          <p className="font-onest text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.5rem] md:text-[3.6rem] lg:text-[4.2rem]">
            <span className="block text-ink-soft">{contraste.cierreLinea1}</span>
            <span className="block text-alapar-cereza">{contraste.cierreLinea2}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
