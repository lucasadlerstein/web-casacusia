import Image from "next/image";
import type { ExperienciaContent, ExperienciaPapel } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { BotonSumate } from "./BotonSumate";
import { DejarVoz } from "./DejarVoz";
import { VerMas } from "./VerMas";
import { Icono } from "./Iconos";
import { LuzPared } from "./LuzPared";
import { Prender } from "./Prender";
import { Bloque, Rotulo, botonClases, t, tonoEstilo } from "./ui";

type C = ExperienciaContent;

const linkNav =
  "whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-exp-crema/75 transition-colors duration-200 hover:bg-exp-crema/10 hover:text-exp-crema " +
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo";

export function TopBar({ nav }: { nav: C["nav"] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-exp-crema/10 bg-exp-noche/80 text-exp-crema backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-3">
        <a href="#inicio" aria-label={nav.logoAlt} className="flex items-center gap-2.5 rounded-lg">
          <Image src="/brand/logos/isotipo-color.png" alt="" width={464} height={433} className="h-7 w-auto" priority />
          <Image src="/brand/logos/letras-blanco.png" alt="" width={884} height={106} className="h-3 w-auto sm:h-3.5" priority />
        </a>
        <nav aria-label={nav.seccionesLabel} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkNav}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <BotonSumate className="min-h-[40px] whitespace-nowrap px-3.5 text-[0.8rem] sm:px-4 sm:text-sm">{nav.cta}</BotonSumate>
      </div>
      {/* En celular las secciones van en una segunda fila que se desliza. */}
      <nav aria-label={nav.seccionesLabel} className="border-t border-exp-crema/10 md:hidden">
        <ul className="container flex gap-1 overflow-x-auto py-1.5 text-[0.8rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.links.map((l) => (
            <li key={l.href} className="shrink-0">
              <a href={l.href} className={linkNav}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Muestra({ muestra }: { muestra: C["muestra"] }) {
  return (
    <Bloque id="muestra" tono="panel" rotulo={muestra.etiqueta} titulo={muestra.titulo} intro={muestra.texto} className="max-md:hidden">
      <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="button" disabled className={botonClases("borde", "cursor-not-allowed opacity-50 hover:translate-y-0")}>
          <span aria-hidden="true">▶</span>
          {muestra.boton}
        </button>
        <Rotulo>{muestra.nota}</Rotulo>
      </div>
    </Bloque>
  );
}

/** Papel de cada post-it y una inclinación distinta para que parezcan pegados a mano. */
const PAPEL: Record<ExperienciaPapel, string> = {
  amarillo: "bg-exp-papel-amarillo",
  rosa: "bg-exp-papel-rosa",
  verde: "bg-exp-papel-verde",
  amatista: "bg-exp-papel-amatista"
};
const INCLINACION = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-[0.5deg]"] as const;

/** La cinta que sostiene cada post-it. */
function Cinta() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-0 h-6 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] bg-white/55 shadow-sm"
    />
  );
}

export function Voces({ voces }: { voces: C["voces"] }) {
  return (
    <Bloque id="voces" tono="luz" titulo={voces.titulo} resaltar={voces.tituloResaltado} intro={voces.intro}>
      <Prender />
      <LuzPared prender={voces.luz.prender} apagar={voces.luz.apagar} />
      <ul id="voces-pared" className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
        {voces.citas.map((c, i) => (
          <li
            key={c.cita}
            className={cn(
              "relative rounded-sm p-6 pt-8 shadow-[0_14px_30px_-14px_rgb(20_54_66/0.45)] transition-[transform,box-shadow,filter] duration-300 ease-out",
              // La luz lo enfoca: se levanta, brilla y la sombra se alarga. Se lee igual sin mouse.
              "motion-safe:hover:z-10 motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.04] hover:shadow-[0_0_0_10px_rgb(255_192_1/0.22),0_34px_50px_-22px_rgb(20_54_66/0.6)] hover:brightness-105",
              PAPEL[c.papel],
              INCLINACION[i % INCLINACION.length],
              // En celular se ven cinco; el resto se despliega con «Ver más voces».
              i >= 5 && "max-md:hidden max-md:[.voces-abiertas_&]:block"
            )}
          >
            <Cinta />
            <blockquote className="font-bubbles text-[1.2rem] leading-snug text-ink">{c.cita}</blockquote>
            <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">{c.quien}</p>
          </li>
        ))}
        <li className={cn("relative", INCLINACION[voces.citas.length % INCLINACION.length])}>
          <DejarVoz dejar={voces.dejar} />
        </li>
      </ul>
      {voces.citas.length > 5 && <VerMas objetivo="voces-pared" clase="voces-abiertas" etiqueta={voces.verMas} />}
    </Bloque>
  );
}

/** Desfase vertical de cada post-it del formato, para que el hilo suba y baje. */
const DESFASE = ["lg:mt-0", "lg:mt-14", "lg:mt-4", "lg:mt-16"] as const;

export function Formato({ formato }: { formato: C["formato"] }) {
  return (
    <Bloque id="formato" titulo={formato.titulo} intro={formato.intro}>
      <div className="relative mt-14">
        {/* El hilo que une los cuatro post-its: a lo ancho en pantallas grandes… */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 hidden h-28 w-full text-amarillo lg:block"
        >
          <path
            d="M12.5 10 C 25 10, 25 60, 37.5 60 S 50 24, 62.5 24 S 75 68, 87.5 68"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* …y vertical, a la izquierda, en celular. */}
        <span aria-hidden="true" className="absolute bottom-10 left-5 top-6 border-l-2 border-dashed border-amarillo lg:hidden" />
        <ol className="relative grid gap-9 lg:grid-cols-4 lg:gap-6">
          {formato.pasos.map((p, i) => (
            <li key={p.titulo} className={cn("relative pl-14 lg:pl-0", DESFASE[i % DESFASE.length])}>
              <span
                aria-hidden="true"
                className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-amarillo font-display text-sm font-extrabold text-exp-noche lg:left-1/2 lg:top-0 lg:-translate-x-1/2 lg:-translate-y-[calc(100%+0.5rem)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className={cn(
                  "relative rounded-sm p-6 pt-8 text-ink shadow-[0_18px_34px_-16px_rgb(0_0_0/0.7)] transition-transform duration-300 ease-out motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.02]",
                  PAPEL[p.papel],
                  INCLINACION[(i + 1) % INCLINACION.length]
                )}
              >
                <Cinta />
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">{p.tiempo}</p>
                <h3 className="mt-2 font-bubbles text-[1.75rem] font-bold leading-tight text-ink">{p.titulo}</h3>
                <p className="mt-2 font-bubbles text-[1.1rem] leading-snug text-ink">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className={cn("mt-14 max-w-3xl border-l-2 border-verde pl-5 text-lg leading-relaxed", t.suave)}>
        {formato.paraQuien}
      </p>
    </Bloque>
  );
}

export function Espacios({ espacios }: { espacios: C["espacios"] }) {
  return (
    <Bloque id="espacios" tono="luz" titulo={espacios.titulo} intro={espacios.intro}>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {espacios.items.map((it) => (
          <li key={it.titulo} className={cn("rounded-2xl border p-6 md:p-7", t.linea, t.sup)}>
            <Icono nombre={it.icono} className="mb-4 h-9 w-9 text-verde-dark" />
            <h3 className={cn("font-display text-xl font-extrabold", t.tinta)}>{it.titulo}</h3>
            <p className={cn("mt-2 leading-relaxed", t.suave)}>{it.texto}</p>
          </li>
        ))}
      </ul>

      <h3 className={cn("mt-14 font-mono text-xs uppercase tracking-[0.2em]", t.tenue)}>{espacios.fechasTitulo}</h3>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {espacios.fechas.map((f) => (
          <li key={f.mes} className="flex items-baseline gap-2 border-t border-amarillo/60 pt-3 sm:block sm:pt-4">
            <p className={cn("font-display text-xl font-extrabold sm:text-3xl", t.tinta)}>{f.mes}</p>
            <p className={cn("sm:mt-1", t.suave)}>{f.motivo}</p>
          </li>
        ))}
      </ul>

      <p className={cn("mt-12 max-w-3xl text-lg leading-relaxed", t.suave)}>{espacios.beneficio}</p>
    </Bloque>
  );
}

export function Sala({ sala }: { sala: C["sala"] }) {
  return (
    <Bloque id="sala" tono="panel" titulo={sala.titulo} intro={sala.intro}>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <ul className="flex flex-col">
          {sala.requisitos.map((r) => (
            <li key={r.titulo} className={cn("flex gap-3 border-t py-3 first:border-t-0 first:pt-0 sm:gap-4 sm:py-5", t.linea)}>
              <Icono nombre={r.icono} className="mt-0.5 h-6 w-6 shrink-0 text-verde sm:h-7 sm:w-7" />
              <p className={cn("leading-relaxed max-sm:text-[0.95rem]", t.suave)}>
                <strong className={cn("font-bold", t.tinta)}>{r.titulo}.</strong> {r.texto}
              </p>
            </li>
          ))}
        </ul>
        <aside className={cn("self-start rounded-2xl border border-amarillo/40 p-6 md:p-8", t.sup)}>
          <h3 className="font-display text-xl font-extrabold text-amarillo">{sala.sinSonidoTitulo}</h3>
          <p className={cn("mt-3 leading-relaxed", t.suave)}>{sala.sinSonidoTexto}</p>
          <BotonSumate variante="borde" className="mt-6">{sala.sinSonidoCta}</BotonSumate>
        </aside>
      </div>
    </Bloque>
  );
}

export function Facilita({ facilita }: { facilita: C["facilita"] }) {
  return (
    <section
      id="facilita"
      style={tonoEstilo("luz")}
      className={cn("scroll-mt-28 py-20 md:scroll-mt-20 md:py-28", t.fondo, t.tinta)}
    >
      <div className="container grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className={cn("relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl rotate-[-1.5deg] shadow-[0_24px_40px_-20px_rgb(20_54_66/0.5)]", INCLINACION[0])}>
          <Image
            src={facilita.foto}
            alt={facilita.fotoAlt}
            width={928}
            height={1066}
            sizes="(min-width: 768px) 24rem, 90vw"
            className="h-auto w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-7 w-28 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] bg-amarillo/90 shadow-sm"
          />
        </div>
        <div>
          <Rotulo>{facilita.etiqueta}</Rotulo>
          <h2 className={cn("mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-4xl md:text-5xl", t.tinta)}>
            {facilita.nombre}
          </h2>
          <p className="mt-3 font-display text-lg font-bold text-verde-dark">{facilita.rol}</p>
          {facilita.parrafos.map((p) => (
            <p key={p} className={cn("mt-5 text-lg leading-relaxed", t.suave)}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cierre({ cierre }: { cierre: C["cierre"] }) {
  return (
    <section className="border-t border-exp-crema/10 pb-10 pt-24 md:pt-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-exp-crema sm:text-5xl md:text-6xl">
            {cierre.frase}
          </p>
          <BotonSumate className="mt-10">{cierre.cta}</BotonSumate>
        </div>
        <footer className="mt-24 flex flex-col items-center gap-3 border-t border-exp-crema/10 pt-8 text-center text-sm text-exp-crema/65 md:flex-row md:justify-between md:text-left">
          <p>{cierre.creditos}</p>
          <p>
            {cierre.programaDe}{" "}
            <Link href={cierre.hrefCasacusia} className="font-bold text-exp-crema underline-offset-4 hover:underline">
              {cierre.casacusia}
            </Link>
          </p>
        </footer>
      </div>
    </section>
  );
}
