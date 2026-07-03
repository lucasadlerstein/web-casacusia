# Roadmap SEO — casacusia.org
**Objetivo:** liderar las búsquedas (y respuestas de IA) sobre hipoacusia y sordera en español.
**Regla:** no avanzar de fase sin cerrar los ítems críticos de la anterior.

---

## Fase 0 — Destrabar indexación (esta semana, ~1 día de trabajo)

| # | Acción | Dónde | Dueño sugerido |
|---|---|---|---|
| 0.1 | **Dominio primario en Vercel → `casacusia.org` (sin www)** para alinear con canonicals/sitemap | Vercel dashboard | Lucas |
| 0.2 | Quitar `/nosotros/legal` del sitemap (o crear la página) | `app/sitemap.ts:14` | Manu |
| 0.3 | Redirects 301: `/calendar`→`/calendario`, `/author/*`→`/nosotros`, slugs viejos de podcast→nuevos | `next.config.mjs` | Manu |
| 0.4 | 410 Gone para `/campaigns/*`, `/campaign_category/*`, `/cmsms_profiles/*` (demo WP) | middleware o route handler | Manu |
| 0.5 | Sacar `cpanel.casacusia.org` de DNS público (o bloquear indexación) | DNS/hosting | Lucas |
| 0.6 | `noindex` en `/sumate/donar/gracias` | `app/[locale]/sumate/donar/gracias/page.tsx` | Manu |
| 0.7 | Fix logo del schema BlogPosting (`/logo.png` no existe) + `isPartOf.url` | `recursos/blog/[slug]/page.tsx:67,74` | Manu |
| 0.8 | Fix links `/${locale}/` hardcodeados en `/aliados` | `aliados/page.tsx:4,67,103` | Manu |
| 0.9 | Agregar `/podcast/rutas` y `/podcast/rutas/[slug]` al sitemap | `app/sitemap.ts` | Manu |
| 0.10 | En GSC: validar correcciones de Coverage + solicitar reindexación de páginas clave | Search Console | Lucas |

**Resultado esperado:** en 2–4 semanas, coverage limpio y las 38 indexadas suben hacia 60+.

## Fase 1 — Base de contenido y schema (julio 2026)

| # | Acción | Detalle |
|---|---|---|
| 1.1 | **Publicar el blog con ≥5 historias** antes de mergear `feat/blog-historias` (no deployar `/recursos/blog` vacío) |
| 1.2 | **Pipeline podcast → artículos**: ya existen transcripciones de muchos episodios en el brain. Por cada episodio: (a) artículo editorial derivado (qué se aprendió, citas textuales, contexto médico objetivo) publicado en el blog o como sección del episodio, (b) transcripción completa colapsable en la página del episodio, (c) links cruzados episodio ↔ artículo. Empezar por los 5 con impresiones en GSC: sordera súbita por estrés, colesteatoma, misofonía, Caro Ramos (docente), Victoria Gamboa. Ritmo sugerido: 2-3 episodios/semana hasta cubrir el catálogo |
| 1.3 | `Event` schema en `/calendario` + render server-side de eventos de Luma (propósito crítico: inscripciones) |
| 1.4 | `PodcastSeries` schema en `/podcast`, OG image por episodio, `BreadcrumbList` global |
| 1.5 | Actualizar `llms.txt` (blog, rutas de escucha, calendario) y crear `llms-full.txt` |
| 1.6 | Sacar `/prensa` de borrador |
| 1.7 | Landing pages para Ad Grants (ver doc 03): al menos `/hipoacusia` o primer artículo pilar |
| 1.8 | Auditar traducciones `/en/*` — si no hay traducción real completa, evaluar limitar `en` a páginas core |

## Fase 2 — Autoridad temática (agosto–septiembre 2026)

| # | Acción | Detalle |
|---|---|---|
| 2.1 | **Cluster "Condiciones"** (8–10 artículos pilares, 1.500+ palabras, FAQPage schema): qué es la hipoacusia, tipos y grados, hipoacusia súbita, colesteatoma, misofonía, tinnitus, anacusia/acusia, presbiacusia, hipoacusia unilateral |
| 2.2 | **Cluster "Vivir con hipoacusia"**: hipoacúsico o sordo, certificado de discapacidad en Argentina (CUD), derechos y cobertura de audífonos/implantes por ley, trabajo, escuela |
| 2.3 | Ritmo editorial: 1 historia de blog/semana (Valen) + 2 artículos pilares/mes |
| 2.4 | **Recursera v1 como hub SEO**: una página por etapa de pérdida auditiva enlazando artículos, episodios e historias (⚠️ estructura de Recursera requiere consulta previa según CLAUDE.md) |
| 2.5 | Completar pipeline podcast → artículos para el resto del catálogo (65+ episodios, transcripciones ya en el brain) |
| 2.6 | Links de Aliados: incorporar mención+link en el onboarding de convenios (coordinar con Vero — ⚠️ copy de Aliados requiere consulta) |
| 2.7 | Perfiles: Wikidata, directorios de ONGs, invitados del podcast enlazando episodios |

## Fase 3 — Escala y liderazgo (octubre 2026 →)

| # | Acción |
|---|---|
| 3.1 | Contenido programático cuidado: cobertura por país (hipoacusia en México/España/Chile: normativa, comunidades) aprovechando que MX/ES ya traen tráfico |
| 3.2 | Cluster tecnología objetiva (audífonos vs implante, guías de decisión) — coordinado con la Red para mantener neutralidad |
| 3.3 | Herramientas linkeables: test auditivo orientativo, glosario interactivo, mapa de recursos por provincia — imanes de backlinks |
| 3.4 | Newsletter ↔ SEO: cada artículo nuevo a la lista de Sender; el tráfico recurrente mejora señales de engagement |
| 3.5 | Medición GEO: chequeo mensual de citas en ChatGPT/Perplexity/AI Overviews para 20 queries objetivo |
| 3.6 | 2da temporada del podcast (fin de junio ya lanzada): publicar cada episodio con transcripción desde el día 1 |

---

## Cadencia de revisión
- **Semanal**: Coverage en GSC durante Fase 0 (validaciones).
- **Mensual**: clics no-brand, queries top 10, páginas indexadas, conversiones de Ads (doc 03).
- **Trimestral**: revisar este roadmap contra las métricas objetivo del doc 01 (§6).
