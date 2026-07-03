# Plan Google Ad Grants — USD 10.000/mes
**Estado:** grant activado, sin usar. **Objetivo:** gastar el máximo posible con tráfico útil sin arriesgar la suspensión del grant.

---

## 1. Reglas del grant que definen todo (compliance)

Incumplir esto suspende la cuenta — revisar mensualmente:

1. **CTR ≥ 5%** a nivel cuenta (2 meses consecutivos < 5% = suspensión). Por eso: solo keywords específicas y con intención.
2. **Quality Score ≥ 3** en todas las keywords (pausar automáticamente las de QS 1–2). Configurar regla automática en Ads.
3. **Prohibidas keywords de 1 sola palabra** (salvo marca propia y excepciones) y keywords genéricas ("videos", "noticias").
4. **Estructura mínima**: ≥2 ad groups por campaña, ≥2 anuncios (RSA) por ad group, ≥2 sitelinks activos.
5. **Geo targeting** obligatorio y relevante (no "todo el mundo" sin razón).
6. **Conversiones**: puja "Maximizar conversiones" es la única forma de superar el tope de USD 2 por clic → **el conversion tracking es prerequisito, no opcional**.
7. Responder la encuesta anual de Google for Nonprofits.
8. Un login activo por mes (entrar a la cuenta al menos 1 vez/mes).

**Expectativa realista:** casi ninguna ONG gasta los 10k completos (topes de CPC + nicho). Meta razonable: USD 1.500–4.000/mes con tráfico genuinamente útil, escalando con más landing pages.

---

## 2. Prerequisito: conversiones en GA4 → importar a Google Ads

Sin conversiones no hay Smart Bidding y quedamos capados a USD 2/clic. Definir en GA4 (Measurement ID `G-X6NFWHR328`) y marcar como conversiones:

| Conversión | Evento | Estado |
|---|---|---|
| Inscripción a encuentro | click a Luma desde `/calendario` (evento saliente vía `lib/tracking.ts`) | crear |
| Donación completada | pageview `/sumate/donar/gracias` o evento de éxito MP/PayPal | crear |
| Suscripción newsletter | submit del form Sender (blog + footer) | crear |
| Contacto enviado | pageview `/gracias` | crear |
| Alta voluntariado | submit `/sumate/voluntariado` | crear |
| Engagement contenido | scroll 75% + 2 min en artículos/episodios (conversión secundaria) | crear |

Vincular GA4 ↔ Google Ads e importar estas conversiones. `NEXT_PUBLIC_GOOGLE_ADS_ID` ya está soportado en el layout — cargar el ID real en Vercel env.

---

## 3. Estructura de cuenta propuesta

> Idioma: español. Geo: Argentina como núcleo + capa LATAM (MX, CL, UY, PE, BO, CO) + España en campañas de contenido. Todas las campañas: Search only, sin Display (no permitido en grant).

### Campaña 1 — Marca y comunidad (lanzar YA — no requiere páginas nuevas)
- **Ad group 1.1 Marca**: "casacusia", "fundacion casacusia", "casacusia kids" → `/`
- **Ad group 1.2 Comunidad/ONG**: "fundacion hipoacusia argentina", "asociacion de hipoacusicos", "ong para sordos", "grupo de apoyo hipoacusia", "mutual hipoacusicos" → `/` o `/nosotros`
- CTR altísimo asegurado → protege el promedio de cuenta.

### Campaña 2 — Encuentros e inscripciones (lanzar YA)
- **Ad group 2.1 Encuentros**: "encuentros para personas con hipoacusia", "charlas sobre hipoacusia", "eventos comunidad sorda argentina" → `/calendario`
- **Ad group 2.2 Familias**: "apoyo para padres de niños con hipoacusia", "mi hijo tiene hipoacusia" → `/programas` (Kids/Red de Padres)
- Conversión objetivo: click de inscripción Luma.

### Campaña 3 — Podcast e historias (lanzar YA)
- **Ad group 3.1 Podcast**: "podcast hipoacusia", "podcast sordera español", "historias de personas sordas" → `/podcast`
- **Ad group 3.2 Temas de episodios**: "sordera subita por estres", "operacion colesteatoma recuperacion", "misofonia que es", "vivir con hipoacusia" → episodios/rutas de escucha
- Doble beneficio: tráfico + señales de engagement para las páginas que queremos posicionar orgánicamente.

### Campaña 4 — Información hipoacusia (requiere artículos pilares de Fase 1/2 del roadmap)
- **Ad group 4.1 Qué es**: "que es la hipoacusia", "tipos de hipoacusia", "hipoacusia significado" → artículo pilar
- **Ad group 4.2 Identidad**: "hipoacusico o sordo", "soy hipoacusico" → artículo pilar
- **Ad group 4.3 Trámites AR**: "certificado discapacidad hipoacusia", "cobertura audifonos obra social" → artículo pilar
- **Esta campaña es la que escala el gasto hacia los 10k** — cada artículo nuevo habilita un ad group nuevo.

### Campaña 5 — Sumate (donaciones y voluntariado, prioridad baja)
- "como ayudar fundacion", "voluntariado ong buenos aires", "donar a fundacion argentina" → `/sumate`, `/sumate/donar`
- Cuidado con CTR: keywords de donación suelen rendir mal; mantener acotada.

### Requisitos por campaña
- 2+ RSAs por ad group (15 titulares/4 descripciones, pinnear el nombre de la fundación en 1 titular).
- Sitelinks: Calendario, Podcast, Sumate, Nosotros. Extensiones de imagen y de llamada si aplica.
- Concordancia: frase y exacta. **Nada de amplia** al inicio (mata el CTR).
- Negativas globales: empleo, cursos pagos, audífonos precio/comprar (intención comercial que no atendemos y las marcas pujan caro), lengua de señas cursos (si no ofrecemos).

### ⚠️ Lenguaje en anuncios
Aplican las reglas de CLAUDE.md: nunca "recomendar", ni promesas de outcomes; tono argentino, cálido. Los anuncios de Campaña 5 no deben mencionar Aliados/empresas sin pasar por Vero.

---

## 4. Rutina mensual de operación (30 min, asignable)

1. Login a la cuenta (requisito).
2. Chequear CTR de cuenta ≥5%; pausar ad groups que lo arrastren.
3. Pausar keywords QS ≤2 (o dejar la regla automática).
4. Revisar términos de búsqueda → agregar negativas.
5. Mover presupuesto a las campañas con conversiones.
6. Registrar en una hoja: gasto, clics, conversiones por tipo.

## 5. Secuencia de implementación

1. **Semana 1**: conversiones GA4 + vínculo Ads + import. Campañas 1–3 activas con presupuesto USD 329/día repartido (el grant se configura así: 10.000/mes ≈ 329/día).
2. **Semana 2–3**: primeras optimizaciones (negativas, CTR).
3. **Con cada artículo pilar publicado** (roadmap Fase 1/2): nuevo ad group en Campaña 4.
4. **Mes 2+**: rutina mensual + escalar hacia mayor gasto útil.
