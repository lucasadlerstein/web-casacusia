"use client";

import { useEffect, useRef } from "react";
import { acotar, mezclaEntrePaneles, mezclar, posicionEnRecorrido, suave } from "./recorrido";

/**
 * Fondo del recorrido: una espiral de puntos (la cóclea) por la que se "entra"
 * a medida que se baja por la página, y las letras de la frase viviendo en ella.
 *
 * - Cada panel declara con `data-estacion`, `data-acento` y `data-efecto` cómo
 *   se ve el sonido ahí; el fondo mezcla el panel que sale con el que entra.
 * - Cada panel con frase tiene un `<p data-frase>` con una letra por `<span>`.
 *   Cuando ese panel llega al centro, las letras salen de la espiral y van a
 *   ocupar su lugar. Las que esa pérdida auditiva no deja oír, no salen.
 *
 * Es decorativo (aria-hidden): el contenido vive en el DOM de cada panel.
 * Con `prefers-reduced-motion` no hay zoom, deriva ni letras voladoras: la
 * frase queda en el DOM y el fondo solo cambia de color.
 */

type RGB = [number, number, number];

type Aspecto = {
  /** Opacidad general de los puntos. */
  alfa: number;
  /** Proporción de puntos que faltan (0 a 1). */
  huecos: number;
  /** Cuánto se apaga la mitad derecha (0 a 1). */
  lado: number;
  /** Cuánto late el conjunto (0 a 1). */
  latido: number;
};

/** La espiral es fondo: va tenue para no competir con las letras ni con el texto. */
const TENUE = 0.5;

const CLARA: Aspecto = { alfa: 0.62, huecos: 0, lado: 0, latido: 0 };
const CREMA: RGB = [255, 249, 242];

const ASPECTOS: Record<string, Aspecto> = {
  clara: CLARA,
  atenuada: { alfa: 0.2, huecos: 0, lado: 0, latido: 0 },
  recortada: { alfa: 0.6, huecos: 0.58, lado: 0, latido: 0 },
  unLado: { alfa: 0.62, huecos: 0, lado: 1, latido: 0 },
  lejana: { alfa: 0.26, huecos: 0.5, lado: 0, latido: 0 },
  rumia: { alfa: 0.16, huecos: 0.3, lado: 0, latido: 0 },
  latido: { alfa: 0.6, huecos: 0, lado: 0, latido: 1 }
};

const VARIABLES: Record<string, string> = {
  crema: "--exp-crema",
  verde: "--color-verde",
  amatista: "--color-amatista",
  rosa: "--color-rosa",
  amarillo: "--color-amarillo"
};

/** Una letra de la frase: dónde va dentro del párrafo y cómo se comporta. */
type Letra = {
  texto: string;
  aguda: boolean;
  /** Centro de la letra, relativo a la esquina del párrafo. */
  dx: number;
  dy: number;
  /** Posición horizontal dentro del párrafo, de 0 (izquierda) a 1 (derecha). */
  fx: number;
};

type FraseMedida = {
  el: HTMLElement;
  efecto: string;
  letras: Letra[];
  peso: string;
  familia: string;
  tamano: number;
};

function hexARgb(hex: string): RGB {
  const limpio = hex.trim().replace("#", "");
  const n = parseInt(limpio.length === 3 ? limpio.replace(/./g, "$&$&") : limpio, 16);
  if (Number.isNaN(n)) return CREMA;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Ruido determinístico por punto: los huecos viajan con el punto, no parpadean. */
const azar = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Cuánto llega cada letra a su lugar (0 = se queda en la espiral) y cómo se ve al llegar. */
function llegada(efecto: string, letra: Letra): { llega: number; alfa: number; escala: number } {
  switch (efecto) {
    case "atenuada":
      return { llega: 1, alfa: 0.3, escala: 0.9 };
    case "recortada":
      return { llega: letra.aguda ? 0 : 1, alfa: 1, escala: 1 };
    case "unLado":
      return { llega: 1 - suave(acotar((letra.fx - 0.38) / 0.24)), alfa: 1, escala: 1 };
    case "lejana":
      return { llega: letra.aguda ? 0 : 1, alfa: 0.42, escala: 0.94 };
    default:
      return { llega: 1, alfa: 1, escala: 1 };
  }
}

export function ViajeFondo() {
  const lienzoRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const seccion = lienzo?.closest<HTMLElement>("[data-viaje]");
    const ctx = lienzo?.getContext("2d");
    if (!lienzo || !seccion || !ctx) return;

    const paneles = Array.from(seccion.querySelectorAll<HTMLElement>("[data-estacion]"));
    // Los bloques de texto: las letras sueltas se apagan al pasar por detrás.
    const lecturas = Array.from(seccion.querySelectorAll<HTMLElement>("[data-lectura]"));
    if (paneles.length === 0) return;

    const estilos = getComputedStyle(document.documentElement);
    const colores = paneles.map((p) =>
      hexARgb(estilos.getPropertyValue(VARIABLES[p.dataset.acento ?? "crema"] ?? "--exp-crema"))
    );
    const aspectos = paneles.map((p) => ASPECTOS[p.dataset.efecto ?? "clara"] ?? CLARA);

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ancho = 0;
    let alto = 0;
    let dpr = 1;
    let cuadro = 0;
    let visible = true;
    let frases: FraseMedida[] = [];
    const inicio = performance.now();

    function medir() {
      if (!lienzo || !seccion) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = lienzo.clientWidth;
      alto = lienzo.clientHeight;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);

      // Dónde cae cada letra dentro de su párrafo: se mide una vez y después
      // alcanza con leer la posición del párrafo en cada cuadro.
      frases = Array.from(seccion.querySelectorAll<HTMLElement>("[data-frase]")).map((el) => {
        const caja = el.getBoundingClientRect();
        const estilo = getComputedStyle(el);
        const letras: Letra[] = [];
        el.querySelectorAll<HTMLElement>("[data-letra]").forEach((span) => {
          const texto = span.textContent ?? "";
          const r = span.getBoundingClientRect();
          if (!texto.trim() || r.width === 0) return;
          const dx = r.left + r.width / 2 - caja.left;
          letras.push({
            texto,
            aguda: span.dataset.aguda !== undefined,
            dx,
            dy: r.top + r.height / 2 - caja.top,
            fx: caja.width > 0 ? dx / caja.width : 0
          });
        });
        return {
          el,
          efecto: el.dataset.efecto ?? "clara",
          letras,
          peso: estilo.fontWeight,
          familia: estilo.fontFamily,
          tamano: parseFloat(estilo.fontSize) || 28
        };
      });
      seccion.dataset.letras = !quieto.matches && frases.length > 0 ? "on" : "off";
    }

    function dibujar(ahora: number) {
      if (!ctx || !seccion || !lienzo) return;
      const { indice, avance } = posicionEnRecorrido(paneles);
      const sig = Math.min(indice + 1, paneles.length - 1);
      const t = mezclaEntrePaneles(avance);

      const a = aspectos[indice] ?? CLARA;
      const b = aspectos[sig] ?? CLARA;
      const desde = colores[indice] ?? CREMA;
      const hacia = colores[sig] ?? CREMA;
      const alfa = mezclar(a.alfa, b.alfa, t);
      const huecos = mezclar(a.huecos, b.huecos, t);
      const lado = mezclar(a.lado, b.lado, t);
      const latido = mezclar(a.latido, b.latido, t);
      const color: RGB = [
        Math.round(mezclar(desde[0], hacia[0], t)),
        Math.round(mezclar(desde[1], hacia[1], t)),
        Math.round(mezclar(desde[2], hacia[2], t))
      ];

      const segundos = (ahora - inicio) / 1000;
      const rect = seccion.getBoundingClientRect();
      const recorrido = Math.max(1, rect.height - window.innerHeight);
      const progreso = acotar(-rect.top / recorrido);
      // Cuánto "entramos": el scroll manda, y una deriva lenta lo mantiene vivo.
      const viaje = quieto.matches ? 0 : progreso * 30 + segundos * 0.05;

      // Dos golpes seguidos y una pausa, como un corazón.
      const fase = (segundos * 1.1) % 1;
      const pulso = quieto.matches ? 0 : Math.exp(-fase * 9) + 0.6 * Math.exp(-Math.abs(fase - 0.22) * 14);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, ancho, alto);

      const cx = ancho / 2;
      const cy = alto / 2;
      const radioMax = Math.hypot(ancho, alto) / 2;
      const radioMin = radioMax * 0.035;
      const apertura = 0.19;
      const tramo = Math.log((radioMax * 1.1) / radioMin) / apertura;
      const paso = 0.075;
      const cantidad = Math.ceil(tramo / paso);
      const brazos = 3;
      const escala = 1 + latido * pulso * 0.05;
      const giro = -viaje * 0.12;
      /** Cuánto apaga la pérdida de un lado a lo que está en x. */
      const sombra = (x: number) => 1 - lado * 0.94 * suave(acotar((x - cx + 60) / 120));

      for (let brazo = 0; brazo < brazos; brazo++) {
        for (let i = 0; i < cantidad; i++) {
          const id = brazo * 1000 + i;
          if (azar(id) < huecos) continue;

          let theta = (i * paso + viaje) % tramo;
          if (theta < 0) theta += tramo;
          const profundidad = theta / tramo; // 0 en el centro, 1 en el borde
          const radio = radioMin * Math.exp(apertura * theta) * escala;
          const angulo = theta + giro + (brazo * Math.PI * 2) / brazos;
          const x = cx + Math.cos(angulo) * radio;
          const y = cy + Math.sin(angulo) * radio;
          if (x < -8 || x > ancho + 8 || y < -8 || y > alto + 8) continue;

          // Aparece desde el centro y se apaga antes del borde; el centro queda limpio para leer.
          let opacidad = TENUE * alfa * Math.pow(profundidad, 0.8) * Math.min(1, (1 - profundidad) * 6);
          opacidad *= 0.55 + 0.45 * azar(id + 7);
          opacidad *= sombra(x);
          opacidad *= 1 + latido * pulso * 0.5;
          if (opacidad < 0.012) continue;

          const tamano = 0.7 + profundidad * 2.3;
          ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${Math.min(1, opacidad).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, tamano, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Las letras ──────────────────────────────────────────────
      if (quieto.matches || frases.length === 0) return;

      const lienzoCaja = lienzo.getBoundingClientRect();
      const bloques = lecturas
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.bottom > 0 && r.top < window.innerHeight);
      /** 1 si el punto está libre, cerca de 0 si cae sobre un bloque de texto (con borde suave). */
      const despejado = (x: number, y: number) => {
        let tapado = 0;
        for (const r of bloques) {
          const px = x + lienzoCaja.left;
          const py = y + lienzoCaja.top;
          const adentro = Math.min(px - r.left, r.right - px, py - r.top, r.bottom - py);
          tapado = Math.max(tapado, suave(acotar((adentro + 24) / 48)));
        }
        return 1 - 0.9 * tapado;
      };
      // La frase que manda es la que está más cerca del centro de la pantalla.
      let activa = frases[0];
      let cajaActiva = activa?.el.getBoundingClientRect();
      let cercania = 0;
      for (const f of frases) {
        const caja = f.el.getBoundingClientRect();
        const distancia = Math.abs(caja.top + caja.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const k = 1 - suave(acotar((distancia - 0.1) / 0.34));
        if (k > cercania) {
          cercania = k;
          activa = f;
          cajaActiva = caja;
        }
      }
      if (!activa || !cajaActiva) return;
      const frase = activa;
      const caja = cajaActiva;

      const total = frase.letras.length;
      const agudas = frase.letras.filter((l) => l.aguda).length;
      const graves = total - agudas;
      let nAguda = 0;
      let nGrave = 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      frase.letras.forEach((letra, j) => {
        // Casa en la espiral: como en la cóclea, los agudos afuera (la base)
        // y los graves más adentro (el ápice).
        const fraccion = letra.aguda
          ? 0.74 + 0.14 * (agudas > 1 ? nAguda++ / (agudas - 1) : 0)
          : 0.46 + 0.24 * (graves > 1 ? nGrave++ / (graves - 1) : 0);
        const theta = fraccion * tramo;
        const radio = radioMin * Math.exp(apertura * theta) * escala;
        const angulo = theta + giro + j * 0.9;
        const casaX = cx + Math.cos(angulo) * radio;
        const casaY = cy + Math.sin(angulo) * radio;

        const destino = llegada(frase.efecto, letra);
        // Salen de a una, en orden de lectura.
        const orden = total > 1 ? j / (total - 1) : 0;
        const k = suave(acotar(cercania * 1.6 - orden * 0.6)) * destino.llega;

        const sitioX = caja.left - lienzoCaja.left + letra.dx;
        const sitioY = caja.top - lienzoCaja.top + letra.dy;
        // Un arco leve en el camino, para que no viajen en línea recta.
        const arco = Math.sin(k * Math.PI) * 26 * (j % 2 === 0 ? 1 : -1);
        const x = mezclar(casaX, sitioX, k) + arco;
        const y = mezclar(casaY, sitioY, k);

        // En la espiral: chica, del color de la estación, tan tenue como el sonido ahí.
        // La que no logra salir titila: está, pero no llega.
        const noSale = cercania * (1 - destino.llega);
        const titila = 0.75 + 0.25 * Math.sin(segundos * 2.4 + j * 1.7);
        const alfaCasa = Math.min(0.9, mezclar((alfa / 0.62) * 0.34 * sombra(casaX), 0.85 * titila, noSale));
        // Mientras está en la espiral no le gana al texto; al salir hacia la frase, sí se ve.
        // La que no logra salir se apaga menos: tiene que notarse que quedó adentro.
        const libre = despejado(casaX, casaY);
        const opacidad = mezclar(alfaCasa * mezclar(libre, Math.max(libre, 0.5), noSale), destino.alfa, k);
        if (opacidad < 0.015) return;

        const tamano = mezclar(frase.tamano * mezclar(0.46, 0.7, noSale), frase.tamano * destino.escala, k);
        ctx.font = `${frase.peso} ${tamano.toFixed(1)}px ${frase.familia}`;
        ctx.fillStyle = `rgba(${Math.round(mezclar(color[0], CREMA[0], k))},${Math.round(
          mezclar(color[1], CREMA[1], k)
        )},${Math.round(mezclar(color[2], CREMA[2], k))},${opacidad.toFixed(3)})`;
        ctx.fillText(letra.texto, x, y);
      });
    }

    function bucle(ahora: number) {
      dibujar(ahora);
      cuadro = visible && !quieto.matches ? requestAnimationFrame(bucle) : 0;
    }
    function arrancar() {
      if (!cuadro) cuadro = requestAnimationFrame(bucle);
    }
    function remedir() {
      medir();
      arrancar();
    }

    remedir();
    // Las posiciones de las letras dependen de la tipografía ya cargada.
    void document.fonts?.ready.then(remedir);

    // Con movimiento reducido no hay bucle: se redibuja solo cuando cambia el scroll.
    const alScrollear = () => {
      if (quieto.matches) arrancar();
    };
    const observador = new IntersectionObserver(([entrada]) => {
      visible = entrada?.isIntersecting ?? true;
      if (visible) arrancar();
    });
    observador.observe(seccion);
    window.addEventListener("resize", remedir);
    window.addEventListener("scroll", alScrollear, { passive: true });
    quieto.addEventListener("change", remedir);

    return () => {
      if (cuadro) cancelAnimationFrame(cuadro);
      observador.disconnect();
      window.removeEventListener("resize", remedir);
      window.removeEventListener("scroll", alScrollear);
      quieto.removeEventListener("change", remedir);
      delete seccion.dataset.letras;
    };
  }, []);

  return <canvas ref={lienzoRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
