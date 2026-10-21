import type { ReactNode } from "react";
import Image from "next/image";
import type { AlaParContent } from "@/lib/content";
import { ContrasteInteractivo } from "./ContrasteInteractivo";

/** Reemplaza {solo} y {par} del título por los dos conceptos, cada uno con su color. */
function renderTitulo(titulo: string, solo: string, par: string): ReactNode[] {
  return titulo.split(/(\{solo\}|\{par\})/).map((parte, i) => {
    if (parte === "{solo}") {
      return (
        <span key={i} className="whitespace-nowrap text-ink-muted line-through decoration-alapar-naranja/60 decoration-[0.08em]">
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

        <div className="mt-12 md:mt-16">
          <ContrasteInteractivo
            items={contraste.items}
            labelSolo={contraste.labelSolo}
            labelPar={contraste.labelPar}
            hintHover={contraste.hintHover}
            hintTouch={contraste.hintTouch}
          />
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
