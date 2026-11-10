"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExperienciaContent } from "@/lib/content";
import { cn } from "@/lib/utils/cn";
import { mezclaEntrePaneles, mezclar, posicionEnRecorrido } from "./recorrido";

/**
 * El sonido del recorrido: la misma frase, en bucle, filtrada en vivo según la
 * estación que está en pantalla. Usa los mismos `data-efecto` que el fondo, así
 * lo que se ve y lo que se oye cambian juntos.
 *
 * Siempre arranca apagado: solo suena si la persona lo activa.
 * Es una aproximación con filtros del navegador (Web Audio), no la simulación
 * de la experiencia en sala.
 */

type Mezcla = {
  /** Volumen (0 a 1). */
  volumen: number;
  /** Hasta qué frecuencia se oye, en Hz: lo de arriba se pierde. */
  corte: number;
  /** De -1 (solo oído izquierdo) a 1 (solo derecho). */
  paneo: number;
  /** Cuánto sube y baja el volumen solo (0 = estable). */
  vaiven?: number;
};

const CLARA: Mezcla = { volumen: 0.9, corte: 16000, paneo: 0 };

const MEZCLAS: Record<string, Mezcla> = {
  clara: CLARA,
  // Conductiva: llega todo, pero bajito, tapado y con vaivén.
  atenuada: { volumen: 0.17, corte: 2200, paneo: 0, vaiven: 0.11 },
  // Neurosensorial: el volumen está, se pierden los agudos (las consonantes).
  recortada: { volumen: 0.85, corte: 850, paneo: 0 },
  // Unilateral: un solo oído. El derecho es el que se apaga, igual que en el fondo.
  unLado: { volumen: 0.9, corte: 16000, paneo: -1 },
  // Bilateral: bajito y sin agudos.
  lejana: { volumen: 0.28, corte: 700, paneo: 0 },
  rumia: { volumen: 0.05, corte: 500, paneo: 0 },
  latido: { volumen: 0, corte: 500, paneo: 0 }
};

/** Segundos de silencio entre una repetición de la frase y la siguiente. */
const PAUSA = 1.6;

type Audio = {
  ctx: AudioContext;
  filtros: [BiquadFilterNode, BiquadFilterNode];
  ganancia: GainNode;
  paneo: StereoPannerNode;
  /** Profundidad del vaivén de volumen. */
  vaiven: GainNode;
  maestro: GainNode;
};

type Estado = "apagado" | "cargando" | "sonando" | "error";

export function ViajeSonido({ sonido }: { sonido: ExperienciaContent["viaje"]["sonido"] }) {
  const botonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<Audio | null>(null);
  const [estado, setEstado] = useState<Estado>("apagado");
  const [enVista, setEnVista] = useState(true);
  // En celular, una vez que se empieza a bajar, el botón queda solo con el ícono
  // para no tapar el texto.
  const [compacto, setCompacto] = useState(false);

  useEffect(() => {
    const alScrollear = () => setCompacto(window.scrollY > 120);
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  // El botón solo aparece mientras el recorrido está en pantalla.
  useEffect(() => {
    const seccion = botonRef.current?.closest<HTMLElement>("[data-viaje]");
    if (!seccion) return;
    const observador = new IntersectionObserver(([entrada]) => setEnVista(entrada?.isIntersecting ?? true));
    observador.observe(seccion);
    return () => observador.disconnect();
  }, []);

  // Mientras suena, el scroll decide cómo se oye.
  useEffect(() => {
    const audio = audioRef.current;
    const seccion = botonRef.current?.closest<HTMLElement>("[data-viaje]");
    if (estado !== "sonando" || !audio || !seccion) return;

    const paneles = Array.from(seccion.querySelectorAll<HTMLElement>("[data-estacion]"));
    const mezclas = paneles.map((p) => MEZCLAS[p.dataset.efecto ?? "clara"] ?? CLARA);
    let cuadro = 0;

    function aplicar() {
      cuadro = 0;
      if (!audio) return;
      const { indice, avance } = posicionEnRecorrido(paneles);
      const a = mezclas[indice] ?? CLARA;
      const b = mezclas[Math.min(indice + 1, mezclas.length - 1)] ?? CLARA;
      const t = mezclaEntrePaneles(avance);
      const ahora = audio.ctx.currentTime;
      // Las frecuencias se mezclan en escala logarítmica, que es como las oímos.
      const corte = a.corte * Math.pow(b.corte / a.corte, t);
      for (const filtro of audio.filtros) filtro.frequency.setTargetAtTime(corte, ahora, 0.08);
      audio.ganancia.gain.setTargetAtTime(mezclar(a.volumen, b.volumen, t), ahora, 0.08);
      audio.paneo.pan.setTargetAtTime(mezclar(a.paneo, b.paneo, t), ahora, 0.08);
      audio.vaiven.gain.setTargetAtTime(mezclar(a.vaiven ?? 0, b.vaiven ?? 0, t), ahora, 0.08);
    }
    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(aplicar);
    };
    const alOcultar = () => {
      if (document.hidden) void audio.ctx.suspend();
      else void audio.ctx.resume();
    };

    aplicar();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    document.addEventListener("visibilitychange", alOcultar);
    return () => {
      if (cuadro) cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      document.removeEventListener("visibilitychange", alOcultar);
    };
  }, [estado]);

  useEffect(
    () => () => {
      void audioRef.current?.ctx.close();
      audioRef.current = null;
    },
    []
  );

  const encender = useCallback(async () => {
    let audio = audioRef.current;
    if (!audio) {
      const ctx = new AudioContext();
      // Dentro del gesto de la persona, para que el navegador lo permita.
      void ctx.resume();
      setEstado("cargando");
      try {
        const respuesta = await fetch(sonido.archivo);
        if (!respuesta.ok) throw new Error(String(respuesta.status));
        const voz = await ctx.decodeAudioData(await respuesta.arrayBuffer());
        // La frase más un silencio, para que el bucle respire.
        const bucle = ctx.createBuffer(1, voz.length + Math.round(voz.sampleRate * PAUSA), voz.sampleRate);
        bucle.copyToChannel(voz.getChannelData(0), 0);

        const fuente = ctx.createBufferSource();
        fuente.buffer = bucle;
        fuente.loop = true;
        // Dos pasabajos en serie: una caída más marcada de los agudos.
        const filtros: Audio["filtros"] = [ctx.createBiquadFilter(), ctx.createBiquadFilter()];
        for (const filtro of filtros) {
          filtro.type = "lowpass";
          filtro.Q.value = 0.7;
          filtro.frequency.value = CLARA.corte;
        }
        const ganancia = ctx.createGain();
        ganancia.gain.value = 0;
        // Un oscilador muy lento que sube y baja el volumen (mismo ritmo que las letras).
        const onda = ctx.createOscillator();
        onda.frequency.value = 1.1 / (2 * Math.PI);
        const vaiven = ctx.createGain();
        vaiven.gain.value = 0;
        onda.connect(vaiven).connect(ganancia.gain);
        onda.start();
        const paneo = ctx.createStereoPanner();
        const maestro = ctx.createGain();
        maestro.gain.value = 0;
        fuente.connect(filtros[0]).connect(filtros[1]).connect(ganancia).connect(paneo).connect(maestro).connect(ctx.destination);
        fuente.start();
        audio = { ctx, filtros, ganancia, paneo, vaiven, maestro };
        audioRef.current = audio;
      } catch {
        void ctx.close();
        setEstado("error");
        return;
      }
    }
    await audio.ctx.resume();
    audio.maestro.gain.setTargetAtTime(1, audio.ctx.currentTime, 0.1);
    setEstado("sonando");
  }, [sonido.archivo]);

  const apagar = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.maestro.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.05);
      window.setTimeout(() => {
        if (audioRef.current === audio && audio.maestro.gain.value < 0.05) void audio.ctx.suspend();
      }, 400);
    }
    setEstado("apagado");
  }, []);

  const sonando = estado === "sonando";
  const etiqueta = sonando ? sonido.apagar : estado === "cargando" ? sonido.cargando : sonido.activar;

  return (
    <div className={cn("fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2", !enVista && "hidden")}>
      <p role="status" aria-live="polite" className={cn("max-w-[16rem] rounded-xl bg-exp-noche/90 px-3 py-2 text-sm text-amarillo", estado !== "error" && "sr-only")}>
        {estado === "error" ? sonido.error : ""}
      </p>
      <button
        ref={botonRef}
        type="button"
        aria-pressed={sonando}
        disabled={estado === "cargando"}
        onClick={() => (sonando ? apagar() : void encender())}
        className={cn(
          "inline-flex min-h-[48px] items-center gap-3 rounded-full px-5 text-left font-display text-sm font-bold shadow-lg shadow-exp-noche/60",
          "transition-[background-color,color,border-color] duration-200 ease-out disabled:opacity-70",
          "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-amarillo",
          compacto && "max-sm:w-12 max-sm:justify-center max-sm:px-0",
          sonando
            ? "border border-exp-crema/40 bg-exp-noche/85 text-exp-crema backdrop-blur hover:border-exp-crema"
            : "bg-amarillo text-exp-noche hover:bg-exp-crema"
        )}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor" />
          {sonando ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
        </svg>
        <span className={cn("flex flex-col leading-tight", compacto && "max-sm:sr-only")}>
          <span>{etiqueta}</span>
          {!sonando && (
            <span className="font-mono text-[0.62rem] font-normal uppercase tracking-[0.14em] opacity-80">{sonido.aviso}</span>
          )}
        </span>
      </button>
    </div>
  );
}
