# Investigación de keywords y oportunidades — Google Ad Grants
**Fecha:** 4 de julio de 2026 · **Complementa:** `03-google-ad-grants.md` (reglas, estructura, rutina)
**Fuentes:** Search Console (16 meses de queries reales), investigación web de demanda (julio 2026), guías Ad Grants 2026.

---

## Cómo leer este documento

Cada "universo de demanda" tiene: qué busca la gente (queries reales o verificadas), la landing que tenemos hoy, qué falta construir, y prioridad. Al final: la estructura de campañas lista para cargar, con las keywords exactas.

**Principio rector (validado contra guías Ad Grants 2026):** las campañas que mejor convierten en ONGs no son las de "doná", son las de **servicios, eventos y voluntariado** — la gente que busca ayuda para sí misma o un familiar. La donación llega después, por remarketing natural (newsletter, comunidad) y por posicionamiento de marca. Igual armamos campaña de donaciones (pedido explícito), pero con expectativas correctas y keywords de intención real.

---

## Universo 1 — Comunidad, grupos de apoyo y asociaciones 🟢 la mejor oportunidad

**Evidencia GSC:** "asociación de hipoacúsicos" / "mutual hipoacúsicos" ya nos muestran en posición 12–38 sin tener página dedicada. La competencia orgánica (MAH, ASAM, FUNDASOR, CAS) no pauta en Ads y sus webs son antiguas.

**Qué busca la gente:**

| Keyword (frase/exacta) | Intención | Landing |
|---|---|---|
| grupo de apoyo hipoacusia | encontrar pares | `/sumate` o landing nueva |
| grupo de apoyo para personas sordas | ídem | ídem |
| grupos de whatsapp para hipoacusicos / sordos | comunidad directa | landing nueva "Comunidad" |
| asociación de hipoacúsicos argentina | institución que ayude | `/nosotros` |
| fundación para personas con hipoacusia | ídem | `/` |
| mutual de hipoacúsicos | ídem (capturamos demanda de MAH) | `/nosotros` |
| ong sordera argentina | ídem | `/` |
| donde conocer personas con hipoacusia | comunidad | landing nueva |
| soy hipoacusico y me siento solo | emocional, altísimo fit | landing nueva / blog |

**Gap a construir:** una landing `/comunidad` (o similar) que junte: grupos de WhatsApp + encuentros presenciales + virtuales + newsletter, con CTA único "Sumate a la comunidad". Hoy eso está repartido entre footer, `/sumate` y `/calendario`. Es LA landing de conversión del grant: cada alta de WhatsApp/newsletter es una conversión medible en GA4.

**Prioridad: máxima.** CTR esperado alto (protege el 5% de cuenta), fit de misión perfecto, conversión medible.

---

## Universo 2 — Encuentros presenciales (Buenos Aires) y virtuales 🟢

**Qué busca la gente:**

| Keyword | Landing |
|---|---|
| encuentros para personas con hipoacusia | `/calendario` |
| encuentros para sordos buenos aires | `/calendario` |
| actividades para personas sordas buenos aires | `/calendario` |
| eventos comunidad sorda argentina | `/calendario` |
| charlas sobre hipoacusia | `/calendario` |
| talleres para hipoacusicos | `/calendario` |
| encuentros virtuales hipoacusia | `/calendario` |
| consultorios / charlas con fonoaudiologa online gratis | `/calendario` (si aplica al programa de Juli) |

**Geo:** los ad groups presenciales SOLO con targeting AMBA/CABA + GBA (evita clics inútiles del interior y de otros países → protege CTR y presupuesto). Los virtuales: Argentina + LATAM.

**Conversión:** clic de inscripción a Luma (evento saliente ya trackeable vía `lib/tracking.ts`). Es la conversión más limpia que tenemos.

**Prioridad: máxima.** Es el propósito crítico #5 de la web y la conversión más directa.

---

## Universo 3 — Podcast e historias 🟢

**Evidencia:** el podcast ya rankea por marca ("sordo pero no mudo") en todas las plataformas. En búsqueda genérica ("podcast hipoacusia español", "podcast sordera") casi no hay competencia en español — el nuestro es el único podcast dedicado con web propia.

| Keyword | Landing |
|---|---|
| podcast hipoacusia | `/podcast` |
| podcast sordera español | `/podcast` |
| podcast personas sordas | `/podcast` |
| historias de personas sordas | `/podcast` o ruta de escucha |
| historias de personas con implante coclear | ruta/episodios |
| como es vivir con hipoacusia | ruta "primera persona" / blog |
| testimonios hipoacusia adultos | blog (historias) |
| sordo pero no mudo | `/podcast` (marca, CTR ~altísimo) |

**Doble beneficio:** tráfico + señales de engagement (tiempo en página, scroll) sobre las URLs que queremos posicionar orgánicamente. Con el blog nuevo (56 notas), cada nota satélite es una landing potencial para long-tail.

**Prioridad: alta.** Lanzable ya, sin construir nada.

---

## Universo 4 — Patologías y condiciones 🟡 el que escala el gasto

Acá está el volumen. GSC ya nos muestra impresiones sin tener páginas dedicadas — ahora las tenemos (blog de historias, 56 notas). La demanda verificada:

### 4a. Acúfenos / tinnitus (el mayor volumen del nicho)
10–20% de la población los padece (CONICET); en Argentina hay más de un millón de personas con patología auditiva sin diagnosticar. GAES, Fleni y MAH tienen contenido — pero nosotros tenemos el episodio 53 (terapia sonora) + cluster de notas.

| Keyword | Landing |
|---|---|
| acufenos tratamiento | nota del cluster ep53 |
| terapia sonora para acufenos | nota ep53 |
| tinnitus como convivir | nota ep53 |
| zumbido en el oido no me deja dormir | nota ep53 |
| acufenos por estres | nota ep53 |

### 4b. Sordera súbita (urgencia médica = búsqueda desesperada, cero competencia de ONGs)
Es una urgencia ORL con ventana de 72hs — la gente googlea en pánico. GSC: "sordera súbita por estrés" 32 impresiones pos 11–13. Tenemos cluster del ep10/44.

| Keyword | Landing |
|---|---|
| sordera subita | nota principal |
| perdi la audicion de un oido de repente | nota |
| sordera subita por estres | nota (query GSC real) |
| sordera subita se recupera | nota |
| sordera subita tratamiento corticoides | nota (con disclaimer médico, ya incluido) |

⚠️ Cuidado con políticas de Google sobre contenido médico: los anuncios deben informar/acompañar, nunca prometer curas. Nuestro copy ya cumple (disclaimer médico en todas las notas clínicas).

### 4c. Otosclerosis / estapedectomía (ep15/53), colesteatoma (GSC real), misofonía (GSC real)

| Keyword | Landing |
|---|---|
| otosclerosis operacion | cluster ep15 |
| estapedectomia recuperacion | cluster ep15 |
| colesteatoma operacion recuperacion | episodio + nota futura |
| misofonia que es / tratamiento | episodio + nota futura |
| hipoacusia unilateral | nota |

### 4d. Términos de identidad/glosario (GSC muestra demanda YA)
"hipoacusica / soy hipoacusica" (244+ impr), "acusia / anacusia" (300+ impr), "hipoacusico o sordo" (¡posición 1!). Requieren los artículos pilares del roadmap Fase 2 — cuando existan, se pautan.

**Prioridad: alta (4a, 4b ya lanzables con el blog), media (4c parcial, 4d requiere pilares).**

---

## Universo 5 — Familias: hijos con hipoacusia 🟢

Búsqueda emocional de padres recién diagnosticados. Tenemos clusters reales (ep19 niños con audífonos, ep45/49 implante coclear en niños, ep64) + Casacusia Kids.

| Keyword | Landing |
|---|---|
| mi hijo tiene hipoacusia que hago | nota principal ep19/45 |
| mi bebe no paso la otoemision | nota (screening neonatal) |
| audifonos para niños como se adaptan | cluster ep19 |
| implante coclear en niños experiencias | cluster ep45/49 |
| apoyo para padres de niños sordos | `/programas` (Kids / Red de Padres) |
| grupo de padres hipoacusia | landing comunidad |

**Prioridad: alta.** Fit perfecto con Kids (kickoff julio 2026) y conversión a comunidad/encuentros.

---

## Universo 6 — Trámites y derechos en Argentina 🟡 gap de contenido con demanda enorme

La investigación muestra demanda fuerte y desatendida por ONGs: cobertura de implante coclear/audífonos por obra social (Ley 25.415, PMO, cobertura 100%), CUD (certificado de discapacidad). Hoy responden estudios de abogados de amparos y sitios del Estado. Una guía neutral de Casacusia sería única.

| Keyword | Landing |
|---|---|
| obra social cubre implante coclear | artículo pilar (crear) |
| cobertura audifonos obra social argentina | artículo pilar (crear) |
| certificado discapacidad hipoacusia como tramitar | artículo pilar (crear) |
| cud hipoacusia requisitos | artículo pilar (crear) |
| ley 25415 hipoacusia | artículo pilar (crear) |

⚠️ Excluir keywords comerciales ("audifonos precio", "comprar audifonos") — intención de compra que no atendemos, CPC caro contra marcas, y roza el conflicto con Aliados. Van como **negativas**.

**Prioridad: media** (requiere crear 2–3 artículos pilares, pero es de lo más buscado del nicho y refuerza neutralidad).

---

## Universo 7 — Donaciones 💚 (pedido explícito: que aparezcan donantes desde Ads)

**La verdad incómoda primero:** las keywords de donación genéricas rinden mal en Ad Grants (CTR bajo, competencia de plataformas grandes, poca conversión fría). La estrategia correcta es doble:

### 7a. Campaña directa de donación (acotada, medible)

| Keyword | Nota |
|---|---|
| donar a fundacion argentina | genérica pero con intención real |
| donar a ong argentina | ídem |
| como ayudar a personas sordas | fit perfecto, poca competencia |
| ayudar a niños con hipoacusia | emocional, fit Kids |
| donaciones deducibles de ganancias argentina | intención sofisticada: donantes de mayor ticket |
| fundaciones para donar deducir impuesto ganancias | ídem |
| colaborar con fundacion discapacidad | ídem |

**Insight de la investigación:** en Argentina las donaciones a fundaciones son deducibles de Ganancias hasta el 5% de la ganancia neta (verificable por CUIT en el registro de AFIP/ARCA de entidades exentas). Esto define un ad group propio con el ángulo fiscal — atrae donantes de mayor ticket (contadores, empresas, monotributistas de escala) en época de vencimientos (abril–junio) y cierre de año fiscal. **Acción previa:** confirmar que el CUIT 30-71888922-3 figura en el registro de ARCA como entidad autorizada a recibir donaciones deducibles, y decirlo explícitamente en `/sumate/donar` (hoy no está).

**Landing:** `/sumate/donar` ya está bien armada (MP + PayPal). Mejoras que multiplican conversión de tráfico frío de Ads:
1. Bloque "deducible de Ganancias" con CUIT verificable.
2. Transparencia: qué hace la fundación con los fondos (encuentros, Kids, podcast) — el donante frío no nos conoce.
3. Conversión GA4 en `/sumate/donar/gracias` **imprescindible antes de pautar** (sin conversiones, tope USD 2/clic y la campaña no aprende).

### 7b. Donantes por camino indirecto (la que realmente trae donantes)
La mayoría de los donantes de ONGs chicas llegan por: conocieron la causa → se sumaron a la comunidad → donaron. Por eso los Universos 1–5 SON la estrategia de donaciones: cada suscripto a newsletter/WhatsApp es un donante futuro. En los anuncios RSA de todas las campañas, incluir 1 titular/descripción con mención a "Fundación sin fines de lucro" + sitelink "Doná" hacia `/sumate/donar` — donación visible en todo el grant sin depender del CTR de keywords de donación.

**Prioridad: alta (7b es gratis, 7a lanzable ya con presupuesto acotado ~USD 10–20/día inicial).**

---

## Estructura de campañas final (actualiza la del doc 03)

| # | Campaña | Ad groups | Geo | Estado landing | Lanzamiento |
|---|---|---|---|---|---|
| 1 | Marca y comunidad | Marca · Asociaciones/ONG · Grupos de apoyo/WhatsApp | AR + LATAM | ✅ (mejor con `/comunidad`) | **Semana 1** |
| 2 | Encuentros | Presenciales BA · Virtuales · Familias/Kids | AMBA / AR+LATAM | ✅ `/calendario`, `/programas` | **Semana 1** |
| 3 | Podcast e historias | Podcast · Historias primera persona · Marca podcast | AR + LATAM + ES | ✅ | **Semana 1** |
| 4 | Patologías | Acúfenos · Sordera súbita · Otosclerosis · Niños/audífonos · Implante coclear | AR + LATAM | ✅ blog (56 notas) | **Semana 1–2** |
| 5 | Donaciones | Donar fundación · Deducción Ganancias · Ayudar personas sordas | AR | ✅ `/sumate/donar` (mejorar bloque fiscal) | Semana 2, tras conversiones GA4 |
| 6 | Trámites y derechos | Cobertura OS · CUD | AR | ❌ crear 2–3 pilares | Cuando existan |

**Negativas globales:** audifonos precio/comprar/oferta, curso lengua de señas, empleo/trabajo para sordos (si no ofrecemos bolsa), aparatos auditivos baratos, medicina/carrera fonoaudiología, + marcas comerciales de dispositivos.

**Orden de implementación:**
1. **Bloqueante:** conversiones GA4 (tabla en doc 03 §2) + vincular GA4↔Ads + importar. Sin esto, no pautar donaciones.
2. Campañas 1–3 (protegen CTR de cuenta) → medir 2 semanas.
3. Campaña 4 con las notas del blog como landings.
4. Campaña 5 con la mejora fiscal en `/sumate/donar`.
5. Crear landing `/comunidad` y pilares de trámites → habilitan el resto.

**Qué construir en la web (resumen de gaps):**
- [ ] Landing `/comunidad` (WhatsApp + encuentros + newsletter, CTA único) — conversión central del grant
- [ ] Bloque "donación deducible de Ganancias" en `/sumate/donar` (verificar registro ARCA primero)
- [ ] 2–3 artículos pilares de trámites AR (cobertura OS, CUD)
- [ ] Conversiones GA4 → import a Ads (prerequisito de todo)
