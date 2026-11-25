import type { ExperienciaContent } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { BotonSumate } from "./BotonSumate";
import { Bloque, Rotulo, botonClases, t } from "./ui";

type E = ExperienciaContent["empresas"];

/** Portada de la página para empresas: la propuesta en una pantalla y los datos que la justifican. */
export function EmpresasHero({ hero }: { hero: E["hero"] }) {
  const corte = hero.titulo.indexOf(hero.resaltado);
  return (
    <section id="inicio" className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-40">
      {/* Ondas que llegan desde la izquierda: la sala a oscuras, apenas sugerida. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 rounded-full border border-exp-crema/[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-exp-crema/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-amarillo/20" />
      <div className="container relative">
        <Rotulo>{hero.etiqueta}</Rotulo>
        <h1 className="mt-6 max-w-4xl font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-exp-crema sm:text-6xl md:text-7xl">
          {corte >= 0 ? (
            <>
              {hero.titulo.slice(0, corte)}
              <span className="text-amarillo">{hero.resaltado}</span>
              {hero.titulo.slice(corte + hero.resaltado.length)}
            </>
          ) : (
            hero.titulo
          )}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-exp-crema/80 md:text-xl">{hero.bajada}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <BotonSumate>{hero.cta}</BotonSumate>
          <a href="#escenas" className={botonClases("borde")}>
            {hero.ctaSecundario}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <dl className="mt-14 grid max-w-4xl gap-6 border-t border-exp-crema/10 pt-8 sm:grid-cols-3">
          {hero.datos.map((d) => (
            <div key={d.valor}>
              <dt className="font-display text-3xl font-extrabold tabular-nums text-exp-crema md:text-4xl">{d.valor}</dt>
              <dd className="mt-1 text-exp-crema/70">{d.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Un bloque de la propuesta: tarjetas, lista con número o pasos unidos por una línea. */
export function EmpresasBloque({ bloque }: { bloque: E["bloques"][number] }) {
  return (
    <Bloque id={bloque.id} tono={bloque.tono} rotulo={bloque.rotulo} titulo={bloque.titulo} intro={bloque.intro}>
      {bloque.estilo === "tarjetas" && (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {bloque.items.map((it) => (
            <li key={it.titulo} className={cn("rounded-2xl border p-6 md:p-7", t.linea, t.sup)}>
              <h3 className={cn("font-display text-xl font-extrabold", t.tinta)}>{it.titulo}</h3>
              <p className={cn("mt-2 leading-relaxed", t.suave)}>{it.texto}</p>
            </li>
          ))}
        </ul>
      )}

      {bloque.estilo === "lista" && (
        <ol className="mt-10 max-w-4xl">
          {bloque.items.map((it, i) => (
            <li key={it.titulo} className={cn("grid gap-2 border-t py-6 sm:grid-cols-[4rem_1fr_1.4fr] sm:gap-6", t.linea)}>
              <span className="font-mono text-sm text-amarillo">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={cn("font-display text-xl font-extrabold", t.tinta)}>{it.titulo}</h3>
              <p className={cn("leading-relaxed", t.suave)}>{it.texto}</p>
            </li>
          ))}
        </ol>
      )}

      {bloque.estilo === "pasos" && (
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          <span aria-hidden="true" className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] border-t-2 border-dashed border-amarillo md:block" />
          <span aria-hidden="true" className="absolute bottom-4 left-5 top-5 border-l-2 border-dashed border-amarillo md:hidden" />
          {bloque.items.map((it, i) => (
            <li key={it.titulo} className="relative pl-16 md:pl-0">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-amarillo font-display text-sm font-extrabold text-exp-noche md:relative">
                {i + 1}
              </span>
              <h3 className={cn("font-display text-xl font-extrabold md:mt-5", t.tinta)}>{it.titulo}</h3>
              <p className={cn("mt-2 leading-relaxed", t.suave)}>{it.texto}</p>
            </li>
          ))}
        </ol>
      )}
    </Bloque>
  );
}

/** Aviso de agenda y enlace a la página de la experiencia, para quien no viene por su empresa. */
export function EmpresasNota({ nota, link }: { nota: E["nota"]; link: E["linkPrincipal"] }) {
  return (
    <section className="py-14">
      <div className="container grid gap-6 md:grid-cols-[1fr_1fr] md:gap-10">
        <div className="rounded-2xl border border-amarillo/40 bg-exp-panel p-6 md:p-8">
          <h2 className="font-display text-xl font-extrabold text-amarillo">{nota.titulo}</h2>
          <p className="mt-2 leading-relaxed text-exp-crema/85">{nota.texto}</p>
        </div>
        <p className="self-center leading-relaxed text-exp-crema/70">
          <Link href={link.href} className="underline decoration-amarillo decoration-2 underline-offset-4 hover:text-exp-crema">
            {link.texto}
          </Link>
        </p>
      </div>
    </section>
  );
}
