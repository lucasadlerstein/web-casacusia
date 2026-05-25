# Informe de oportunidades narrativas · Casacusia web 2026

**Versión**: 1.1 — 2026-05-21
**Autor**: Claude + Lucas (revisión)
**Estado**: Diagnóstico + decisiones. Próxima iteración: plan de acción priorizado.

---

## Cómo leer este documento

Este informe se construyó después de una lectura exhaustiva del repo, los contenidos JSON y la documentación estratégica (`docs/00-brief-final.md`, sitemap, data model, seo-map, geo-faq). Después fue revisado con Lucas y refleja decisiones tomadas en esa conversación. Lo que está acá ya es base para ejecutar.

---

## 1. TL;DR

1. **La voz ya existe y es excelente.** Hero, Esencia y Manifiesto están entre 8 y 9/10 en humanidad. El problema no es que falte talento, es que la web no termina de **entregar** lo que su mejor copy promete.
2. **El problema central, en una frase**: *Casacusia ya escribió la historia. La web todavía no la cuenta.* Falta contar el **porqué**, no sólo el qué.
3. **Para empresas**, la propuesta es clara en estructura pero invisible en evidencia. La movida es construir un **programa "Convenio de Apoyo" personalizado de 12 meses** + una **Red de Empresas que Escuchan a Casacusia** (con empresas del rubro auditivo categorizadas por tipo) + sección rotativa de caso destacado en home cada 2 meses.
4. **Para tráfico**, el bloqueo es contenido (blog 0 vs 12 pilares planeados, 1 transcripción vs 72 episodios). Es trabajo de Valen + Manu, y queda como apuesta de 3-6 meses.
5. **Quick wins inmediatos**: encuesta "viviendo / sobreviviendo" en home, manifiesto subido al home, renderizar los 4 testimonios + sumar el de Mechu, prensa, corregir ciudades.

---

## 2. Decisiones tomadas en esta iteración

### Sí vamos por acá

- **Encuesta "¿Estás viviendo o sobreviviendo?"** en home, con respuestas distintas según opción.
- **Subir el manifiesto** "Vivir, no sobrevivir" al home (no sólo en `/nosotros`).
- **Renderizar los 4 testimonios** existentes en home + sumar el de Mechu (Esquel, Chubut).
- **Número + historia + "ver más"** en el bloque de Impacto del home.
- **Quote por voluntario al hover** (Melu pide los quotes al equipo).
- **Foto real por voluntario** (pendiente Melu).
- **Página `/prensa/`** con assets básicos.
- **Red de Empresas que Escuchan a Casacusia**: empresas del rubro auditivo (audífonos, implantes, centros médicos) con logos categorizados visibles.
- **Programa "Convenio de Apoyo" de 12 meses con plan personalizado**: charla de Lucas, acompañamiento en diversidad, aporte económico + servicios + productos. A desarrollar.
- **Sección rotativa en home**: caso destacado de Aliado, cambia cada 2 meses (cuando arranquemos a producirlos).
- **CAMI se queda** como programa, con copy de **"piloto en prueba"**. CAMI ya funciona en `@hipoacusico` personal de Lucas, pronto se trae a la fundación.
- **Eventos**: muestra desde Luma API. Si no hay nada de Luma API, **embed de `lu.ma/hipoacusia`** como fallback.
- **Lenguaje primario**: **"pérdida auditiva"** es más comprensible para todos. "Hipoacusia" queda en uso técnico/SEO pero no como vocabulario principal.
- **Historia "cómo nació Casacusia"** se mantiene en `/nosotros/historia` por SEO y para que la IA tenga contexto, pero **descentrada de Lucas** (parte de la construcción de Casacusia es sacarlo del centro).
- **Tangibilizar la comunidad** (números + caras + voces) es prioridad transversal.

### Por ahora no

- **Doble narrativa por Aliado** (qué hizo la empresa + qué le dio Casacusia). Descartado por ahora. Vamos sólo con logos.
- **Miembros Fundadores activos** con fecha 26/6/2026. No se activa todavía.
- **Blog**: no se puede armar hoy. Es tarea de Valen, posiblemente con Manu.
- **Versión inglés**: después de terminar el español.
- **Transcripciones masivas del podcast**: clave para SEO, pero no es prioridad ahora. Se hace en 3-6 meses.
- **Doble narrativa en aliados existentes**: queda fuera. Sólo logos.

---

## 3. El problema central

> **Casacusia ya escribió la historia. La web todavía no la cuenta.**

La voz está. Lo que falta es **arquitectura narrativa** y, sobre todo, contar el **porqué** detrás de cada cosa, no sólo el qué. Hoy la web explica con bastante claridad qué hace Casacusia (encuentros, podcast, red de familias). Lo que falta es **por qué hace cada cosa**, conectado al insight central: la discapacidad es la soledad.

---

## 4. Cómo contamos el "porqué" — el hilo central

Esta es la pregunta más importante que dejaste abierta. Algunas vías concretas, no excluyentes:

### 4.1 · Cada programa abre con un "porqué"

En `/programas` y en cada landing de programa, sobre el título, un eyebrow narrativo:

- Encuentros presenciales → *"Porque la soledad de la pérdida auditiva se rompe cuando ves que otros también la viven."*
- Encuentros virtuales → *"Porque no hace falta moverse para dejar de estar solo."*
- Red de familias → *"Porque cuando uno se entera del diagnóstico del hijo, lo primero que falta es alguien que ya pasó por eso."*
- Podcast → *"Porque escucharte hablando de tu hipoacusia es entender que la mía no es rara."*
- Charlas → *"Porque la accesibilidad real se entiende cuando alguien que vive con pérdida auditiva la cuenta."*

Esto no cambia código mayor: es agregar un campo `porque` al schema de `content/programas.json` y mostrarlo en la card y en la landing.

### 4.2 · Un bloque "Por qué existe Casacusia" en home

No sólo el manifiesto entero, sino una versión condensada que conecte: la soledad → la respuesta → vos.

Una propuesta de copy (revisable):

> **Por qué existimos**
>
> Porque la pérdida auditiva no es sólo no escuchar. Es preguntar y que te miren raro. Es perderte el chiste y reírte igual. Es elegir entre quedarte callado o pedir que te repitan por tercera vez. Es, lentamente, dejar de estar.
>
> Casacusia existe para que nadie tenga que elegir entre escuchar y estar.

Esto va arriba o debajo de la encuesta de viviendo/sobreviviendo. Es la pieza que cose el insight con la propuesta.

### 4.3 · El porqué firmado por la comunidad, no por Lucas

Como pediste descentralizar a Lucas, el "porqué" se puede firmar como *"El equipo Casacusia"* o, mejor todavía, **rotar** entre voces del equipo y de la comunidad. Hoy lo dice Lucas, mañana lo dice una mamá de la red, pasado un voluntario de Mendoza. Eso refuerza que Casacusia es de muchos.

### 4.4 · Repetir la frase fuerza con disciplina

"La discapacidad no es el silencio, es la soledad" tiene que aparecer:
- En el home (ya está en Esencia).
- En la página de Nosotros (ya está).
- En el footer (no está).
- En el ttiulo del SEO de algunas páginas clave.
- En la firma del newsletter.
- Como cierre del bloque de Impacto (subir desde abstracción a sentido).

Es la frase que se queda. Repetir no es redundancia, es construcción de marca.

---

## 5. Encuesta "Viviendo / Sobreviviendo" — la idea grande de esta iteración

### 5.1 · Aterrizaje en home

Un bloque interactivo, después del Hero o de Esencia. Pregunta única, dos botones grandes:

> **Hoy, con tu pérdida auditiva, ¿sentís que estás...?**
> [ Viviendo ]   [ Sobreviviendo ]

### 5.2 · Qué pasa con cada respuesta

**Si responde "Viviendo":**
> Qué bueno que estés viviendo. Trabajamos para que más personas con pérdida auditiva dejen de sobrevivir. ¿Querés ayudarnos?
> → CTA: "Sumate a la comunidad" / "Compartí tu historia"

**Si responde "Sobreviviendo":**
Tono: validación, no consuelo, no regaño. Reconocer + ofrecer una puerta concreta.

Propuesta de copy (revisable):
> Te escuchamos. No estás solo. La mayoría de nosotros pasó por ahí.
>
> Si querés, hay tres lugares por donde empezar:
> → Conocer a otras personas que están en lo mismo (próximo encuentro virtual, link)
> → Escuchar a Mechu, que sintió lo mismo y hoy lo cuenta (testimonio o episodio del podcast)
> → Hablar con CAMI, nuestra asistente, que te puede orientar (cuando esté lista)

**Necesito tu input** sobre el tono exacto del "sobreviviendo". Acá puse algo razonable pero querés revisarlo vos o Valen.

### 5.3 · La encuesta como dato público

El número agregado de respuestas se vuelve **una pieza de comunicación**. Cada cierto tiempo:

> "El 42% de nuestra comunidad nos dice que está sobreviviendo. Trabajamos para que sean cero."

Esto es honesto, mide impacto real (cambiando esa proporción con el tiempo), y le da a la web una métrica viva. También sirve como argumento para empresas: el problema es real y medible.

### 5.4 · Dónde más extender la idea narrativamente

- **En el footer**: una versión mini ("¿Cómo estás hoy?") siempre presente, no invasiva.
- **Al final de cada encuentro virtual**: form de salida pregunta lo mismo. Medís impacto.
- **Al final de cada episodio del podcast**: en la página individual del episodio, después de la descripción, mini-encuesta.
- **En redes (separado, pero alineado)**: storie de Instagram con la misma pregunta, una vez por mes.
- **En el newsletter**: tracking de evolución personal del lector (esto requiere DB, queda para más adelante).
- **En la primera visita vs visitas recurrentes**: la primera vez se pregunta, después se ofrece "actualizar tu respuesta".

Esta idea, bien ejecutada, es **el diferencial conceptual más grande** que vi en esta iteración. Casi ninguna ONG argentina pregunta directamente al visitante cómo está. La mayoría asume que sufre y le tira recursos. Vos le devolvés agencia: vos decís cómo estás, nosotros respondemos.

---

## 6. Brechas narrativas que quedan vivas

Después del feedback de Lucas, estas son las brechas que se mantienen como problema a resolver:

### Brecha 1 · El manifiesto está escondido (vive solo en `/nosotros`)
**Solución**: bloque condensado en home. Frase fuerza en footer y newsletter.

### Brecha 2 · Los testimonios existen y no se renderizan
**Solución**: slot de testimonios en home, post-Esencia o post-Encuentros. Sumar el de Mechu (ver §10).

### Brecha 3 · Los Aliados no tienen estructura comprensible para el visitante
No vamos por "doble narrativa", pero sí por **categorización por tipo** (audífonos / implantes / centros médicos) para que una persona que llega buscando dónde preguntar, encuentre. Ver §9.

### Brecha 4 · Voluntarios sin foto y sin voz
**Pendiente Melu**: pedir foto + un quote personal a cada uno. Mientras tanto, no es urgente, pero cuando se resuelva, el quote al hover de la card cambia toda la calidez de la página.

### Brecha 5 · Impacto = números sin gente
**Solución**: cada número con una mini-historia accesible (modal "ver más" o tooltip). Ver §7.

### Brecha 6 · "Próximamente" rompía la confianza
**Resuelto a nivel decisión**: CAMI se queda con copy de "piloto en prueba" (no es vapor, está funcionando en `@hipoacusico`). Recursera queda pendiente, sin "Próximamente" si se puede evitar — necesitamos definir si la sacamos del grid o dejamos honestamente "Próximamente · Q3 2026".

---

## 7. Oportunidades por objetivo

### A · Más humanos

- **A1.** Subir el manifiesto al home (§4.2).
- **A2.** Renderizar 4 testimonios existentes + el de Mechu (§10).
- **A3.** Encuesta viviendo/sobreviviendo (§5).
- **A4.** Bloque "Por qué existimos" (§4).
- **A5.** Número + historia + "ver más" en Impacto. Cada estadística abre un mini-modal o expande con una historia real. Ej:
  - "3.000 participantes" → al click: "Como Mechu, que viajó virtualmente desde Esquel y por primera vez sintió calma."
  - "42 encuentros" → "Como el de Bariloche, donde se conocieron 8 personas que hoy se siguen viendo."
  - El modelo de datos: agregar al JSON un campo `historiaCorta` o un array de `historiasAsociadas` por stat.
- **A6.** Foto + quote por voluntario al hover (pendiente Melu).
- **A7.** Repetir la frase fuerza con disciplina (§4.4).

### B · Que las empresas entiendan y quieran apoyar

- **B1.** Construir el **programa "Convenio de Apoyo" personalizado** de 12 meses. Ver §8.
- **B2.** Construir la **Red de Empresas que Escuchan a Casacusia** (rubro auditivo). Ver §9.
- **B3.** Página `/aliados/como-funciona` o bloque embebido en `/sumate/proyectos-juntos` que explique en 3-4 puntos qué significa ser Aliado, qué se pone, qué se recibe, duración (12 meses), proceso.
- **B4.** Sección rotativa en home: caso destacado de Aliado, cambia cada 2 meses. Slot fijo, contenido variable. **A definir qué Aliado abre**.
- **B5.** Página `/prensa/` con assets descargables. Trabajo de pocas horas.

### C · Que la comunidad use la web, permanezca y vuelva

- **C1.** Recursera mínima: 5 etapas (sospecha, diagnóstico, dispositivos, familia, vida cotidiana) con 3-5 recursos enlazados por cada una (FAQ, episodios, encuentros relacionados).
- **C2.** Calendario Luma API + fallback embed `lu.ma/hipoacusia`. Validar que la integración esté trayendo eventos hoy.
- **C3.** Newsletter mensual con calendario editorial: 1 historia + 1 episodio + 1-2 encuentros. Trabajo de Valen.
- **C4.** Share buttons en cada episodio, testimonio, página relevante. Compartir tiene que ser un click.
- **C5.** Sección "Lo último" en home (3 cards rotativas: último episodio, próximo encuentro, último contenido).

### D · Tráfico (SEO/GEO) — apuesta de mediano plazo

- **D1.** Historia "cómo nació Casacusia" reescrita con narrativa con valle/crecimiento, pero descentrada de Lucas. Sirve para SEO (las IAs preguntan "cuándo se fundó Casacusia") sin convertirlo en una biografía de fundador.
- **D2.** Blog: 12 pilares de 1500+ palabras (apuesta Valen + Manu, 3-6 meses).
- **D3.** Transcripciones del podcast (apuesta 3-6 meses, no urgente pero clave).
- **D4.** `llms.txt` en root apuntando a páginas pilar (verificar que esté).
- **D5.** Schema FAQPage en `/recursos/faq/` (validar).

---

## 8. El programa "Convenio de Apoyo personalizado" (a desarrollar)

**Modelo propuesto**, sujeto a tu revisión con Vero, Nico:

- **Duración**: 12 meses. Renovable.
- **Personalización**: cada Aliado tiene un "plan" propio según su rubro, escala y momento. No hay un paquete único.
- **Lo que la empresa pone** (modular):
  - Aporte económico mensual o único.
  - Productos para encuentros o campañas.
  - Servicios pro-bono (legal, contable, infra, diseño, audiovisual).
  - Espacios físicos para encuentros.
  - Horas profesionales del equipo en proyectos puntuales.
- **Lo que la empresa recibe** (modular):
  - Logo en `/aliados/` y en el grid del home.
  - Ficha individual `/aliados/[marca]/` con datos básicos (no narrativa doble por ahora).
  - Mención en redes en momentos clave (lanzamientos, encuentros que su aporte hizo posibles).
  - **Charla de Lucas a su equipo** (1 vez en los 12 meses).
  - **Acompañamiento en generar espacios de diversidad** dentro de la empresa (workshops, asesoría).
  - Deducción fiscal vía ARCA.
  - Reporte anual del impacto del aporte.
  - Posibilidad de campaña conjunta opt-in.

**Página a construir**: `/sumate/proyectos-juntos/` puede expandirse a tener este modelo descripto, o crear `/sumate/convenio-de-apoyo/` como página dedicada. Mi sugerencia: dentro de proyectos-juntos, una sección clara con el modelo, con CTA al formulario.

**Lo que necesito de vos**: una primera lista de qué se ofrece (1-2 horas con Vero/Nico) y nosotros lo bajamos a copy. O un draft que ustedes escriban y nosotros lo pulimos. Avisame qué preferís.

---

## 9. Red de Empresas que Escuchan a Casacusia (rubro auditivo)

**Idea**: hay personas que llegan a la web con preguntas concretas:
- "Dónde compro un audífono."
- "Dónde me opero de un implante coclear."
- "Qué centro médico hace audiometrías cerca de mí."

Esas personas hoy no encuentran respuesta en la web. La Red de Empresas que Escuchan resuelve esto Y al mismo tiempo da visibilidad a empresas del rubro que apoyan a Casacusia.

**Estructura propuesta**:

- Página `/red-empresas/` (o sección dentro de `/aliados/`) con tres bloques de logos:
  - **Audífonos**
  - **Implantes**
  - **Centros médicos**
- Cada logo lleva a una ficha simple (no doble narrativa, sólo info útil): qué hacen, dónde están, link al sitio.
- Filtros por ciudad / país si la lista crece.
- Disclaimer claro: Casacusia no vende ni recomienda médicamente, sólo da a conocer empresas del rubro que son parte de la Red.

**Implicación técnica**: agregar un campo `categoriaAuditiva: "audifonos" | "implantes" | "centro-medico" | null` al schema de aliados, y filtrar el grid por ese campo para esta página específica.

**Cuidado con el lenguaje**: en el CLAUDE.md la palabra "recomendar" está prohibida. Acá hablamos de **"acercar"** o **"dar a conocer"**, no de recomendar.

---

## 10. Testimonios — el de Mechu (Esquel, Chubut)

Lo dejo guardado acá literal para que cuando lo sumemos a `content/testimonios.json`, esté disponible:

> *Muchas gracias por todo lo que haces Lucas... Me diagnosticaron hace dos años con hipoacusia neurosensorial bilateral por otoesclerosis. Yo no lo podía creer, ser hipoacúsica era darme la cabeza contra la pared. El día que me pusieron los audífonos sentí que toda mi vida había escuchado abajo del agua y que al fin salía del agua para escuchar limpio, claro, fácil.*
>
> *Sin embargo con el paso del tiempo y con la aceptación de mí hipoacusia comencé a sentirme abrumada, con dolor de cabeza, con miedo a preguntar e inseguridades... Y mucha mucha vergüenza por no entender y quedarme pensando que tendrá que ver lo que me dijo con lo que estábamos hablando... Ahí en ese proceso te encontré en instagram... Tus tips, tu empatía, los videos que explicas todo que amooo, las entrevistas... Todo todo eso era lo que necesitaba.*
>
> *Sigo en el camino de encontrarme en esta nueva versión de mí... Si me preguntas que me llevo de esta, mí primer reunión virtual de Casacusia que no pude prender cámara y audio x la vergüenza... Me llevo seguridad y calma... Algo que hace mucho pero mucho perdí... Gracias! La próxima soy la primera contando y sacándome las dudas...*
>
> **— Mechu, Esquel, Chubut**

**Frase para destacar en home / redes**: *"Me llevo seguridad y calma. Algo que hace mucho pero mucho perdí."*

Este testimonio es de altísima calidad porque:
- Tiene **trayectoria temporal** (diagnóstico → audífonos → aislamiento → encontró Casacusia → primer encuentro).
- Tiene **vulnerabilidad concreta** (no prendió cámara por vergüenza).
- Tiene **outcome humano** (seguridad y calma, no "aprendí mucho").
- Es **representativo de muchos casos** (Argentina profunda, mujer, post-diagnóstico).

---

## 11. Corrección de datos a verificar

| Dato | Web hoy | Lucas dice | Pregunta |
|---|---|---|---|
| Episodios podcast | "70+" en home | 72 en JSON | Cambiar a "70+ episodios" → "72 episodios" o "+70" |
| Ciudades alcanzadas | 60 en `content/impacto.json` | 9 | **¿Cuál es la cifra correcta?** ¿O 60 era algo distinto, ej. ciudades donde hay comunidad pero no encuentros físicos? |
| Voluntarios activos | 35 en JSON | (no comentado) | Confirmar |
| Participantes | 3.000 en JSON | (no comentado) | Confirmar |

---

## 12. Quick wins (0-2 semanas, ordenados por impacto/esfuerzo)

1. **Renderizar testimonios en home** (incluye el de Mechu). 3h.
2. **Subir manifiesto al home** como bloque destacado. 3h.
3. **Encuesta "viviendo / sobreviviendo"** en home. 1 día (requiere persistencia mínima de datos).
4. **Corregir ciudades** (cuando me confirmes la cifra). 5 min.
5. **CAMI con copy "piloto en prueba"** + link a `@hipoacusico` mientras no está integrada. 1h.
6. **Confirmar Luma API trayendo eventos** + implementar fallback embed `lu.ma/hipoacusia` cuando no hay datos. 2-3h.
7. **Cambiar "hipoacusia" por "pérdida auditiva"** en hero y nav principal, manteniendo "hipoacusia" en contextos técnicos y SEO. 2h.
8. **Página `/prensa/`** con assets básicos. 4h.
9. **Bloque "Por qué existimos"** en home (§4.2). 2h.
10. **Sacar Recursera del grid principal** (o agregarle fecha visible). 30min.

---

## 13. Medium plays (1-3 meses)

11. **Programa "Convenio de Apoyo" personalizado**: documentar modelo + página explicativa.
12. **Red de Empresas que Escuchan**: agregar `categoriaAuditiva` al schema, crear página categorizada, identificar y sumar logos.
13. **Sección rotativa de caso destacado** en home (slot listo, primer caso elegido y producido).
14. **Reescribir `/nosotros/historia/`** con narrativa más rica pero descentrada de Lucas. Trabajo de copy, sin código.
15. **Fotos + quotes de voluntarios** (depende de Melu).
16. **Número + historia + "ver más"** en bloque de Impacto. Trabajo de copy + componente.
17. **Recursera mínima** (5 etapas, recursos enlazados).
18. **Newsletter mensual sostenido** (trabajo de Valen).

---

## 14. Apuesta estratégica (3-6 meses, con Valen + Manu)

19. **Blog**: 12 pilares de SEO. Esto es lo que mueve la aguja del tráfico orgánico y le da valor real al logo de cada Aliado.
20. **Transcripciones del podcast**: 72 URLs indexables nuevas.
21. **Versión EN** completa.
22. **CAMI integrada** a casacusia.org (no sólo en `@hipoacusico`).
23. **Métricas Core Web Vitals + Lighthouse A11y** (validar contra meta: LCP <2.5s, INP <200ms, A11y ≥95).

---

## 15. Preguntas abiertas para Lucas

Para terminar de aterrizar el plan necesito que me respondas (sin urgencia, cuando puedas):

1. **Ciudades**: el JSON dice 60, vos decís 9. ¿La cifra correcta es 9 (ciudades donde Casacusia hizo encuentros físicos), o son 60 (ciudades donde llegamos via comunidad/online), o es otra cosa? Esto afecta el copy de home y de Impacto.

2. **Lenguaje primario**: ¿reemplazamos "hipoacusia" por "pérdida auditiva" en el hero, navegación y meta tags principales? "Hipoacusia" queda en contextos técnicos y SEO (es la palabra que la gente busca). ¿Coincide tu intuición?

3. **Red de Empresas que Escuchan — categorías exactas**: ¿son sólo audífonos, implantes y centros médicos? ¿O agregamos otras (terapia auditiva, audioprotesistas, equipamiento técnico, accesorios)?

4. **Encuesta "sobreviviendo" — tono**: te dejé una propuesta de copy en §5.2. ¿Querés que lo escriba yo, lo arma Valen, o lo trabajamos vos y yo en otra iteración?

5. **Programa Convenio de Apoyo — quién lo escribe**: ¿lo armás vos con Vero y Nico y nosotros lo traducimos a página? ¿O preferís que te propongamos un draft?

6. **CAMI piloto en prueba — qué hace el card hoy**: ¿lleva a `@hipoacusico` con un copy tipo "podés ver a CAMI funcionando en Instagram mientras la traemos a la web"? ¿O a un form de "avisame cuando esté"?

7. **Sección rotativa caso destacado — primer Aliado**: cuando arranquemos a producirlo (no urgente), ¿hay alguno en mente que haya tenido un impacto especialmente claro o reciente?

8. **Recursera**: ¿la dejamos en el grid con "Próximamente Q3 2026" honesto, o la sacamos hasta que esté lista?

---

## 16. Una observación final

Casacusia tiene algo muy poco común en ONGs: **un insight propio** ("la discapacidad es la soledad"), una **voz instalada**, un **fundador con vivencia personal** y una **comunidad real**. La mayoría de las ONGs sociales argentinas no tienen ni uno de esos cuatro.

Lo que falta no es estratégico ni de voz: es de **ejecución narrativa**. Acomodar la web para que cada visitante, en menos de 30 segundos en el home, entienda:

1. **Qué pasa** (la pérdida auditiva no es lo que pensás, no es no escuchar, es soledad).
2. **Quién está acá** (una comunidad real, con caras, voces, números honestos).
3. **Cómo se entra** (cuatro caminos equivalentes, o simplemente ver qué pasa).
4. **Por qué importa** (porque a alguien le pasa, y porque vos podés ser parte).

Si los próximos meses se trabaja contra eso, sin desviarse, la web pasa de ser una vitrina a ser **un lugar al que la gente vuelve**. Y cuando vuelven, el valor del logo de cada Aliado crece, las inscripciones a encuentros crecen, el podcast crece, la red crece.

Todo se conecta. La narrativa es el motor.
