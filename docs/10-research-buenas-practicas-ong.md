# Research · Buenas prácticas de webs de ONG

**Fecha**: 2026-05-25
**Para**: decidir orden de secciones del home y formato de testimonios.
**Fuente**: heurísticas y patrones extraídos de Charity:Water, Watsi, Pencils of Promise, Doctors Without Borders, Acumen, Khan Academy, Wikimedia, GiveDirectly y benchmarks de UX en non-profits.

---

## 1. Qué debe ver una persona en una web de ONG, en qué orden

Las webs de ONG exitosas siguen un arco emocional + racional en 6 actos. No es el único patrón, pero es el más probado.

### Acto 1 · Hook emocional (above the fold)
**Qué tiene**: una imagen humana (no abstracta), un titular en primera persona o en segunda persona (te habla a vos, no de la organización), y UN insight diferenciador.

**Qué NO tiene**: el logo gigante de la organización, frases corporativas tipo "Somos una ONG dedicada a...", carruseles que rotan solos.

**Para Casacusia hoy**: ✅ esto ya está bien. "No estás solo. 1 de cada 20 personas tiene pérdida auditiva." Es directo, emocional, factual.

### Acto 2 · El problema (con cara humana)
**Qué tiene**: una persona concreta o una situación concreta. Tipo "Lila perdió la audición a los 12. Hoy ayuda a otros a no sentirse solos." No abstracción tipo "Millones de personas en el mundo...".

**Para Casacusia hoy**: ⚠ parcialmente. La sección Esencia ("La discapacidad no es el silencio, es la soledad") es buena pero abstracta. Falta una historia concreta debajo.

### Acto 3 · La respuesta (qué hacemos)
**Qué tiene**: 3-5 piezas concretas, NO bullet de "misión / visión / valores", sino programas con verbo de acción ("Conectamos familias", "Producimos podcast", "Organizamos encuentros").

**Para Casacusia hoy**: ✅ "Nuestros programas" funciona bien, especialmente con el nuevo copy más directo.

### Acto 4 · Prueba social (testimonios + métricas)
**Qué tiene**: testimonios reales (con foto y nombre, no anónimos), 4-6 stats clave grandes y comparables, logos de partners/medios donde nos cubrieron.

**Para Casacusia hoy**: ⚠ los testimonios pueden mejorarse (ver §2). Las métricas están pero podrían ser más visuales.

### Acto 5 · Llamado a la acción (cómo te sumás)
**Qué tiene**: el CTA principal claro y único (donar es el más común, aunque puede haber 2-3 alternativos). NO 6 opciones de cómo colaborar.

**Para Casacusia hoy**: ⚠ los 4 caminos pueden confundir al visitante nuevo. La encuesta "viviendo/sobreviviendo" es un buen hook intermedio.

### Acto 6 · Transparencia + permanencia
**Qué tiene**: pie de confianza (ARCA, declaraciones, certificaciones), link a memoria anual, equipo visible.

**Para Casacusia hoy**: ⚠ está pero disperso. El badge ARCA y los reconocimientos podrían aparecer en el footer como pie de confianza.

---

## 2. Buenas prácticas para testimonios en webs de ONG

### Lo que funciona
1. **Foto del autor**. Subir el avatar real, no iniciales en círculos de colores. Si no hay foto, usar nombre + ubicación + contexto (3 piezas de identidad).
2. **Cita corta**. Máximo 2 líneas. El cerebro no procesa testimonios largos. Si la cita es larga, mostrar solo la frase pivote en grande + opción "leer completo".
3. **Atribución completa**. Nombre + edad/ubicación/contexto. Ej: *"María, 34 años, Buenos Aires. Mamá de Lila."*
4. **Diseño tipo card o quote pull**. Comillas grandes ornamentales, fondo claro, tipografía serif o display para la cita.
5. **Vinculado al programa**. Cada testimonio asociado al programa que lo activó (ej. *"Encontrado en un encuentro virtual"*).
6. **Movimiento sutil**. Carrusel manual con dots o flechas. NO autoplay rápido. Si autoplay, mínimo 10-12 segundos por slide y con fade suave.

### Lo que NO funciona
- Avatares con iniciales en círculos de colores random.
- Testimonios largos sin frase destacada.
- Citas anónimas tipo "Una persona de la comunidad".
- Carruseles que cambian cada 4 segundos (no da tiempo a leer).
- Diseño tipo "comentarios de Facebook" o "tweets".

### Patrón recomendado para Casacusia

```
┌──────────────────────────────────────────────┐
│ ❝                                            │
│                                              │
│   Cita pivote, máximo 2 líneas,             │
│   tipografía display, peso semibold.        │
│                                              │
│   ┌──┐                                       │
│   │📷│  Mechu                                 │
│   └──┘  Esquel, Chubut · Mamá de Tomi        │
│                                              │
│                                              │
│           [•••○○]  ← dots manuales           │
└──────────────────────────────────────────────┘
```

**Ajustes concretos al componente Testimonial actual**:
- Sumar peso visual a la comilla decorativa (más grande, más opacidad)
- Usar foto real si está disponible (hoy son círculos con inicial)
- Cita en tipografía display, no sans
- Aumentar el tiempo de rotación a 10s (hoy son 8s)
- Sumar ubicación / contexto en una segunda línea bajo el nombre, siempre (no condicional)
- Sumar tag chico del programa asociado (ej. *"Encontrada en un encuentro virtual"*) si está

### Referencias visuales que vale la pena mirar
- **Charity:Water testimonials**: foto grande, cita corta, nombre + país.
- **Watsi patient stories**: foto + edad + condición + outcome.
- **GiveDirectly**: cita en sans bold, foto en blanco y negro, monto recibido como dato.
- **Pencils of Promise**: video corto + transcripción + testimonio escrito.

---

## 3. El problema de la repetición conceptual en Casacusia

Hoy "vivir/sobrevivir" aparece en:
- Manifiesto del home (título)
- Esencia (kicker)
- Encuesta interactiva (pregunta)
- Historia de Lucas (kicker final)

**Riesgo**: el visitante lo lee 4 veces en una sola sesión. Pierde fuerza.

**Recomendación**:
- **El insight central** ("la discapacidad no es el silencio, es la soledad") aparece UNA vez fuerte en home (Esencia) y se reusa solo en Historia y Manifiesto.
- **"Vivir vs sobrevivir"** queda como territorio del Manifiesto solamente. La encuesta puede vivir en home + 1 página más, pero la frase exacta no se repite tantas veces.
- **La pregunta de la encuesta** (con localStorage por dispositivo) puede aparecer en home, /nosotros, /programas — pero solo si la persona no respondió. Si ya respondió, se oculta y mostramos directamente el contenido "para vos".

---

## 4. El orden ideal del home de Casacusia (propuesta)

Aplicando todo lo anterior, el orden recomendado:

1. **Hero**: "No estás solo. 1 de cada 20 personas tiene pérdida auditiva." (sin cambios)
2. **Esencia**: "La discapacidad no es el silencio. Es la soledad." + párrafo bodyExtra + CTAs (sin cambios)
3. **Encuesta interactiva**: la pregunta "¿Vivís o sobrevivís?" — pero si ya respondió, se reemplaza por un saludo personalizado tipo "Qué bueno que estés acá. Mirá lo que estamos haciendo →"
4. **Testimonios** (rediseñados según §2): 1-2 citas grandes con foto real
5. **Próximo encuentro**: con CTA al calendario
6. **Programas**: grid con copy nuevo (ya actualizado)
7. **Impacto**: stats grandes con micro-historia
8. **Manifiesto** (acortado, solo el kicker y un CTA al manifiesto completo en /nosotros)
9. **Podcast destacado**: 1 episodio actual + link a todos
10. **Aliados**: bloque "Nos acompañan mes a mes" + grid completo (ya implementado)
11. **Cuatro caminos** o un CTA único de "Quiero ser parte"
12. **Newsletter**: opcional, al final

**Diferencias con el home actual**:
- La encuesta se mueve antes de testimonios (es el hook de involucramiento)
- El manifiesto se acorta a 1 frase + link (no se duplica)
- Testimonios pasan de 5to a 4to lugar (más prominentes)
- Aliados van más abajo (después de impacto, no antes)

---

## 5. Resumen accionable

| Cambio | Esfuerzo | Impacto |
|---|---|---|
| Rediseñar componente Testimonial con foto + atribución 2 líneas + comilla grande | medio | alto |
| Mover encuesta antes de testimonios | bajo | medio |
| Acortar manifiesto en home (solo kicker + link) | bajo | alto (evita repetición) |
| Sumar pie de confianza al footer (ARCA, reconocimientos) | bajo | medio |
| Reordenar secciones según §4 | bajo | medio |

**Próxima decisión Lucas**: aprobar el orden de §4 + el patrón de testimonio de §2. Una vez aprobados, los implemento.
