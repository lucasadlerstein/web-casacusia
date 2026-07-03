# Evaluación SEO — casacusia.org
**Fecha:** 3 de julio de 2026 · **Fuentes:** Search Console (16 meses + 3 meses + Coverage), auditoría de código (rama `feat/blog-historias`), checks en producción.

---

## Resumen ejecutivo

La web está técnicamente bien construida (Next.js, metadata, JSON-LD, sitemap, llms.txt) pero **hoy no compite por ninguna búsqueda que no sea la marca**. En 16 meses: ~920 clics, de los cuales el ~98% vienen de "casacusia" / "casacusia kids". Cero clics de queries genéricas de hipoacusia/sordera.

Hay **3 bloqueos estructurales** que explican la mala indexación (38 indexadas vs 87 no indexadas) y que se arreglan en días, y **1 brecha estratégica** (contenido) que es el verdadero camino a ser líder online en hipoacusia en español.

---

## 1. Diagnóstico con datos de Search Console

### Performance (16 meses)
| Métrica | Valor |
|---|---|
| Clics totales | ~920 (709 home + 150 kids) |
| Clics de marca | ~98% |
| Clics no-brand | ≈ 0 |
| País dominante | Argentina (778 clics), luego MX, ES, CL |
| Dispositivo | 51% mobile / 47% desktop |

### Demanda no-brand donde YA aparecemos (posición 9–12, sin clics)
Estas queries son la evidencia de que Google ya nos asocia al tema, pero no tenemos páginas dedicadas que puedan rankear top 3:

| Query | Impresiones | Posición | Página que existe hoy |
|---|---|---|---|
| hipoacusica / soy hipoacusica | 244+ | 8–11 | ninguna dedicada |
| acusia / acusia significado / anacusia | 300+ | 9–64 | ninguna |
| sordera súbita por estrés | 32 | 11–13 | episodio de podcast (thin) |
| colesteatoma cirugía / operación / recuperación | 15+ | 11–21 | episodio de podcast (thin) |
| misofonía (celia misofonia, cura misofonia) | ~25 | 9–20 | episodio de podcast (thin) |
| hipoacusico o sordo | 1 | 1 (!) | ninguna dedicada |
| asociación de hipoacúsicos / mutual hipoacúsicos | varias | 12–38 | ninguna |

**Lectura:** los episodios del podcast generan impresiones para condiciones médicas (colesteatoma, sordera súbita, misofonía) pero se quedan en página 2 porque son páginas con solo un embed de YouTube y la descripción. Con transcripciones + artículos dedicados, estas queries son ganables.

### Coverage (indexación)
| Problema | Páginas |
|---|---|
| Página con redirección | 35 |
| 404 no encontrado | 16 |
| Alternativa con canónica adecuada | 11 |
| Duplicada sin canónica indicada | 9 |
| Rastreada, sin indexar | 12 |
| Bloqueada por robots.txt | 3 |
| Excluida por noindex | 1 |
| **Total sin indexar** | **87** (vs 38 indexadas) |

Además, Google sigue indexando restos del WordPress anterior: `/campaigns/*` (¡campañas demo de mascotas y plástico!), `/campaign_category/*`, `/author/admin_*`, `/cmsms_profiles/*`, `/calendar`, y hasta `cpanel.casacusia.org` (responde 200 y recibe clics).

---

## 2. Bloqueos estructurales (críticos)

### 🔴 C1. Conflicto de host: Vercel sirve en `www`, todo el SEO declara sin `www`
Verificado en producción:
- `https://casacusia.org/` → **308 → `https://www.casacusia.org/`** (www es el dominio primario en Vercel)
- Pero el canonical, hreflang, sitemap, robots.txt y JSON-LD declaran **`https://casacusia.org`** (sin www)

Resultado: cada página servida en `www` le dice a Google "la versión real está en no-www", que a su vez redirige a `www`. **Bucle de señales contradictorias.** Esto explica directamente los 35 "página con redirección", los 11 "alternativa con canónica" y los 9 "duplicada sin canónica" — o sea, la mayoría del problema de indexación.

**Fix (1 minuto, sin código):** en Vercel → Settings → Domains, marcar `casacusia.org` (sin www) como dominio primario para que `www` redirija a no-www. Así todo queda coherente con el código. Luego validar en GSC.

### 🔴 C2. URLs legacy de WordPress sin redirects ni 410
No hay redirects en `next.config.mjs:25-33` para `/campaigns/*`, `/campaign_category/*`, `/author/*`, `/cmsms_profiles/*`, `/calendar`. Hoy devuelven 404 "blando" tras la cadena de redirects de host. Google las sigue rastreando (16 × 404 en coverage) y gastan crawl budget.

**Fix:** redirects 301 a destinos lógicos (`/calendar` → `/calendario`, `/author/*` → `/nosotros`, podcast slugs viejos → slugs nuevos) y para contenido demo de WP (`/campaigns/*`, `/campaign_category/*`, `/cmsms_profiles/*`) responder **410 Gone**. Además: `cpanel.casacusia.org` no debería resolver públicamente (quitar DNS o bloquear).

### 🔴 C3. `/nosotros/legal` está en el sitemap pero la página no existe
`app/sitemap.ts:14` → 404 verificado en producción. Un sitemap con 404 degrada la confianza de Google en todo el sitemap.

---

## 3. Hallazgos de código (auditoría completa)

| # | Hallazgo | Prioridad | Ubicación |
|---|---|---|---|
| 1 | `/nosotros/legal` en sitemap sin página | Crítico | `app/sitemap.ts:14` |
| 2 | `logo.png` inexistente en schema BlogPosting (Google rechaza el schema) | Crítico | `app/[locale]/recursos/blog/[slug]/page.tsx:67` |
| 3 | Sin redirects/410 para URLs legacy de WordPress | Crítico | `next.config.mjs:25-33` |
| 4 | `content/blog.json` vacío → `/recursos/blog` sería thin content al deployar | Alto | `content/blog.json` |
| 5 | `/sumate/donar/gracias` sin `noindex` | Alto | `app/[locale]/sumate/donar/gracias/page.tsx:17-29` |
| 6 | Sin `Event` schema en `/calendario` (encuentros = propósito crítico #5) | Alto | `app/[locale]/calendario/page.tsx` |
| 7 | Sin `PodcastSeries` schema en `/podcast` | Alto | `app/[locale]/podcast/page.tsx` |
| 8 | `/podcast/rutas` y `/podcast/rutas/[slug]` fuera del sitemap | Alto | `app/sitemap.ts` |
| 9 | `/aliados` usa `next/link` nativo con `/${locale}/` hardcodeado → genera `/es/contacto` (URL inválida) | Alto | `app/[locale]/aliados/page.tsx:4,67,103` |
| 10 | Episodios de podcast sin OG image (thumbnail disponible, no usado) | Medio | `app/[locale]/podcast/[slug]/page.tsx:34` |
| 11 | Sin `BreadcrumbList` en ninguna página | Medio | global |
| 12 | `isPartOf.url` del BlogPosting apunta a `/blog` en vez de `/recursos/blog` | Medio | `app/[locale]/recursos/blog/[slug]/page.tsx:74` |
| 13 | FAQ con título hardcodeado fuera de i18n | Medio | `app/[locale]/recursos/faq/page.tsx:17-23` |
| 14 | Eventos de Luma renderizados en cliente → contenido poco crawleable en `/calendario` | Medio | `app/[locale]/calendario/page.tsx` |
| 15 | `areaServed` del schema NGO solo Argentina (comunidad en 12+ países) | Bajo | `components/schema/OrganizationSchema.tsx:18` |
| 16 | `llms.txt` desactualizado (no menciona blog, rutas de escucha, calendario) | Bajo | `public/llms.txt` |
| 17 | Aviso "Borrador" visible e indexable en `/prensa` | Bajo | `app/[locale]/prensa/page.tsx:53-61` |
| 18 | `lastModified: now` en todo el sitemap (todas las páginas "cambian" en cada deploy) | Bajo | `app/sitemap.ts:43-51` |
| 19 | Alt texts genéricos ("Casacusia") en galerías — clave siendo web de accesibilidad | Bajo | `app/[locale]/aliados/page.tsx:121` |
| 20 | Riesgo duplicado es/en si `/en/*` no tiene traducción real completa | Medio | `messages/en.json` |

Lo que **está bien** (para no tocar): `buildMetadata` con canonical + hreflang coherentes, sitemap dinámico con alternates, robots.ts, schema NGO/FAQPage/BlogPosting/PodcastEpisode+VideoObject, next/image con AVIF/WebP, fonts con `display: swap`, GA4 `afterInteractive`, llms.txt (existe, hay que actualizarlo).

---

## 4. Brecha estratégica: contenido

Para ser **líder online en hipoacusia y sordera en español** el problema no es técnico, es de inventario: hoy hay ~30 páginas indexables y casi ninguna responde una búsqueda informacional. Los líderes de nicho en salud (Mayo Clinic, Healthline, y en español, Cochlear/MED-EL con sus blogs) ganan con **autoridad temática**: cientos de páginas organizadas en clusters que se enlazan entre sí.

Ventajas competitivas que Casacusia ya tiene y nadie más:
1. **65+ episodios de podcast** = materia prima para 65+ artículos con transcripción (nadie en español tiene esto sobre hipoacusia en primera persona).
2. **Historias en primera persona** (blog nuevo) = la "E" de Experience en E-E-A-T que las marcas de audífonos no pueden replicar.
3. **Neutralidad**: no vendemos audífonos → contenido comparativo/objetivo sobre tecnologías que las marcas no pueden escribir sin sesgo.
4. **Recursera** = arquitectura hub-and-spoke natural por etapas de pérdida auditiva.
5. **Red de Aliados** = fuentes de backlinks legítimos (cada convenio debería incluir un link desde la web del aliado).

### Clusters de contenido propuestos (por demanda ya observada + volumen)
1. **Glosario/condiciones**: qué es hipoacusia, acusia, anacusia, hipoacusia súbita, colesteatoma, misofonía, tinnitus, presbiacusia, hipoacusia unilateral. (Las queries ya nos muestran impresiones acá.)
2. **Vivir con hipoacusia**: hipoacúsico o sordo (¡ya posicionamos #1 con 1 impresión!), trabajo, escuela, maternidad/paternidad, trámites y certificado de discapacidad en Argentina.
3. **Tecnología (objetiva)**: audífonos vs implante coclear, cómo elegir, cobertura de obras sociales/prepagas en Argentina, mantenimiento.
4. **Familias/Kids**: hijo con hipoacusia recién diagnosticado, escolaridad, lengua de señas vs oralismo (con cuidado de tono).
5. **Historias** (blog) + **episodios con transcripción** que alimentan todos los clusters.

### GEO (aparecer en ChatGPT, Gemini, Perplexity, AI Overviews)
- Actualizar `llms.txt` y considerar `llms-full.txt`.
- Transcripciones = texto citable por LLMs (los embeds de YouTube no lo son).
- Datos citables propios: "según Casacusia, X% de..." — publicar cifras de impacto/encuestas de la comunidad en páginas estables.
- FAQPage schema en cada artículo de condición (ya hay patrón en `/recursos/faq`).
- Mantener la guía de citación del llms.txt y monitorear menciones en AI (probar mensualmente queries en ChatGPT/Perplexity).

---

## 5. Autoridad y links (off-page)

- **Aliados**: sumar al Convenio de Apoyo un link dofollow desde el sitio del aliado hacia casacusia.org (beneficio mutuo, no es "sponsoreo" de links, es mención institucional). 29 aliados = 29 dominios del rubro auditivo.
- **Prensa**: la página `/prensa` debe salir de "borrador"; cada aparición en medios es un backlink potencial.
- **Directorio de ONGs**: registrarse en directorios argentinos/latam (CIS, HelpArgentina, Idealist, GuideStar equivalents).
- **Invitados del podcast**: cada profesional invitado (fonoaudiólogas, otorrinos) tiene web/institución → pedir link al episodio.
- **Wikipedia/Wikidata**: entidad Casacusia en Wikidata refuerza el Knowledge Graph y las respuestas de IA.

---

## 6. Métricas objetivo (para revisar mensualmente en GSC)

| Métrica | Hoy | 3 meses | 6 meses | 12 meses |
|---|---|---|---|---|
| Páginas indexadas | 38 | 60+ | 120+ | 250+ |
| Clics no-brand / mes | ~0 | 100 | 500 | 2.000+ |
| Queries en top 10 (no-brand) | ~2 | 15 | 50 | 150 |
| Dominios que nos enlazan | ? (auditar) | +10 | +25 | +50 |
