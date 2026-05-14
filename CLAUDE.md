# CLAUDE.md — Web Casacusia

## Quién es Casacusia

Fundación dedicada a personas con hipoacusia y sus familias. Web: casacusia.org. Founder: **Lucas Adlerstein** (lucas@casacusia.org).

Esta web es la cara pública de la fundación. Stack: **Next.js 15 App Router + TypeScript strict + Tailwind + next-intl**, deploy en **Vercel**.

---

## Propósitos estratégicos de la web

La web tiene 5 propósitos comprometidos con empresas que apoyan económicamente a la fundación:

1. **Mostrar logos de Aliados** — empresas del rubro auditivo con Convenio de Apoyo. Sin esta visibilidad, la propuesta pierde valor.
2. **Generar tráfico real** — sin visitas, la presencia de marca para Aliados no vale.
3. **Home de la Recursera** — banco de recursos por etapas de pérdida auditiva. Alimenta a CAMI (asistente virtual).
4. **Home del Blog de historias** — relatos en primera persona. Genera tráfico recurrente.
5. **Inscripción a encuentros** — presenciales y virtuales, mensuales, abiertos.

---

## Cambios que requieren pausa y consulta

Si la tarea toca alguno de estos, **detenerse y preguntar antes de ejecutar**:

- Copy o lenguaje en secciones de Aliados / Empresas / Red
- Estructura de la Recursera o sistema de etapas de pérdida auditiva
- Formularios que pidan datos personales sensibles (médicos, financieros)
- Sistema de inscripción a encuentros
- Modelo de jerarquía/visibilidad de logos de Aliados (todos en igualdad, sin tiers visibles)
- Identidad de marca (colores, tipografía, logo)
- Eliminar o esconder cualquiera de las 5 secciones críticas
- Tono de comunicación de la fundación

---

## Reglas de lenguaje (no negociables)

Palabras y conceptos **prohibidos** en cualquier texto de la web:

- "Recomendar" — usar *"acercar"*, *"compartir"*, *"dar a conocer"*
- "Sponsoreo" / "Sponsorship" — usar *"Convenio de Apoyo"* o *"Plan de Apoyo"*
- "Sponsors" / "Patrocinadores" — usar *"Aliados"*
- Promesas de outcomes específicos a empresas (leads, ventas, ROI)

### Nomenclatura confirmada

| Concepto | Cómo lo decimos |
|---|---|
| Conjunto de empresas que apoyan | Red de Empresas que Escuchan a Casacusia |
| Las empresas que entran | Aliados |
| Las primeras que firmen (antes del 26/6/2026) | Miembros Fundadores |
| El asistente virtual | CAMI |
| El banco de recursos | Recursera |

### Tono general

- Argentino, vos (no usted, no tú)
- Directo, cálido, sin corporativismo
- Sin tecnicismos médicos innecesarios
- Información objetiva sobre tecnologías y marcas, nunca subjetiva

---

## Identidad de marca

**Paleta HEX:**
- Menta `#00B980` · Púrpura `#563AB3` · Amatista `#B462CC`
- Ámbar `#FFC001` · Rosa `#F44475` · Violeta `#C224B9`
- Crema `#FFF9F2` · Gris `#143642` (texto principal)

**Tipografía:** Montserrat (Google Fonts). Bold para títulos, Regular para cuerpo. No usar otras tipografías.

**Sistema de diseño** (orden de autoridad):
1. `docs/03-design-tokens.json` — fuente canónica
2. `styles/tokens.css` — variables CSS `--color-*`, `--radius-*`, `--motion-*`
3. `tailwind.config.ts` — mapea variables a clases utilitarias (`bg-brand-teal`, `text-ink-soft`, etc.)

---

## Branch de trabajo

Trabajamos siempre sobre `dev`. No pushear directo a `master`.

---

## Convenciones técnicas

1. **RSC first**: solo `"use client"` cuando hay estado, eventos o APIs de navegador.
2. **Server Actions** para toda escritura. Nada de API routes para forms.
3. **Contenido en `content/*.json` o MDX**, nunca hardcodeado en componentes.
4. **Tokens de diseño** vía Tailwind + CSS vars. Nada de colores hex sueltos.
5. **Accesibilidad desde el diseño** — esta web es para personas con hipoacusia. Contraste alto, transcripciones, alt-text.
6. **SEO/GEO obligatorio**: cada página usa `buildMetadata` y JSON-LD si aplica.
7. **Sin JS innecesario**: animaciones sutiles, respetar `prefers-reduced-motion`.
8. **Commits en español**, conventional style (`feat:`, `fix:`, `docs:`, `chore:`).
9. **Nuevo texto** va a `messages/*.json`, no hardcodeado.
10. **Nuevo contenido** va a `content/*.json` + schema Zod en `lib/content.ts`.
11. **No agregar deps** sin confirmar con el equipo.
12. **No bypasses** con `any` o `@ts-ignore`.
13. **Probar en mobile** siempre — el 70%+ del tráfico es celular.

### Stack de decisión rápida

- ¿Estado? → Client Component
- ¿Estático o de build? → Server Component + `generateStaticParams`
- ¿Formulario? → Server Action + Zod + honeypot + rate-limit
- ¿Nuevo texto UI? → `messages/*.json`
- ¿Nuevo contenido? → `content/*.json` + Zod schema

---

## Estructura del proyecto

```
app/[locale]/          # Rutas localizadas (es default, en como prefijo)
components/ui/         # Primitivos (Button, Section, Card, Tag, PageHero)
components/layout/     # Header, Footer, LangSwitcher, Logo
components/sections/   # Bloques de página (Hero, AllyGrid, ImpactStats)
content/               # JSON versionado (aliados, equipo, programas, podcast, etc.)
docs/                  # Especificación Fase 1 (NO tocar salvo erratas)
lib/                   # i18n, content loaders, seo helper, utils
messages/              # Traducciones UI (es.json, en.json)
public/                # Estáticos (imágenes, llms.txt)
styles/tokens.css      # Variables CSS de diseño
```

---

## Archivos que NO son código (legacy en el repo)

Estos archivos están trackeados en git pero no forman parte de la web:

- `identidad-grafica-casacusia/` — assets de marca (PNGs, PDFs, .ai). No referenciados en código.
- `Informe_Casacusia.doc`, `Informe_Casacusia_NuevaWeb.doc`, `Textos_Casacusia.docx` — documentos de referencia.

No referenciar estos archivos en código. Eventualmente se limpiarán del historial de git.

---

## Contexto externo

Carpeta de contexto completo en Google Drive de Lucas:
`~/Library/CloudStorage/GoogleDrive-lucasadlerstein@gmail.com/My Drive/Claude/Data : Agentes/Casacusia/`

Contiene: RED_EMPRESAS_MASTER.md, Plan_Operativo_2026.md, CAMI_MASTER.md, propuestas, marca.

---

## Personas del equipo

| Persona | Área |
|---|---|
| **Lucas** | web, CAMI, Recursera, decisión estratégica |
| **Manu** | desarrollo web (co-builder de este repo) |
| **Vero** | Red de Empresas, sección Aliados |
| **Melu** | encuentros y comunidad |
| **Juli** | eventos virtuales, consultorios, podcast |
| **Valen** | redes sociales, newsletter, comunicación |
| **Rama** | Casacusia Kids |
| **Nico** | alianzas comerciales |

---

## Fechas clave (2026)

- **26 de junio** — cierre Miembros Fundadores
- **Fin de junio** — lanzamiento 2da temporada podcast
- **15 de julio** — lanzamiento público de la Red
- **Julio** — kickoff Casacusia Kids 2027
