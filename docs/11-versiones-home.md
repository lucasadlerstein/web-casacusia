# Propuestas de versiones del Home

**Fecha**: 2026-05-25
**Para**: decidir cuál(es) implementar para A/B testing.
**Estado**: análisis previo. No implementadas todavía.

---

## Idea base

Lucas propuso que el home tenga **2-3 versiones aleatorias** que se muestren por dispositivo, y medir permanencia. Esto se hace fácil:
- Una `<HomeVariant>` que server-side elige un valor estable por cookie/sesión.
- La elección se persiste por dispositivo (cookie 30d) para no confundir al mismo visitante con versiones distintas.
- Tracking básico: registrar en analytics qué versión vio cada visitante.

Antes de implementar, hay que decidir **qué versiones probar**. Acá van 3 propuestas con foco distinto.

---

## Versión A · "No estás solo" (la actual)

**Foco**: identificación con el visitante a través del dato.
**Hero**:
- Eyebrow: *Comunidad de personas con pérdida auditiva*
- H1 enorme: **No estás solo.**
- Subtítulo grande: *1 de cada 20 personas tiene pérdida auditiva.*
- CTAs: "Sumate a la comunidad" / "Próximos encuentros" / "Doná"
- Foto: comunidad real que aparece al hover

**Funciona porque**: combina promesa emocional ("no estás solo") con dato relatable ("1 de cada 20"). Es lo que ya está y tiene buen feedback en testimonios.

**Riesgo**: muy "above the fold". Si la persona no scrollea, no entiende qué hace Casacusia exactamente.

---

## Versión B · "La pregunta directa"

**Foco**: hablar a la persona desde el primer segundo.
**Hero**:
- Sin eyebrow.
- H1 grande pero más conversacional: **¿Pensaste alguna vez que eras la única persona con hipoacusia?**
- Body: *Casacusia nace para mostrarte que somos muchos. Acá hay una comunidad que te entiende.*
- Dos botones grandes: "**Sí, me pasó**" / "**Acompaño a alguien**"
- Cada respuesta lleva a un home diferenciado (o a un anchor distinto):
  - "Sí, me pasó" → scroll a sección "Para vos" con testimonios de personas, podcast, encuentros
  - "Acompaño a alguien" → scroll a sección "Para familias" con red, recursos, charlas
- Foto: una persona sola que se difumina y aparece una multitud

**Funciona porque**: en lugar de declarar algo sobre Casacusia, te incluye desde el primer click. Activa identificación + segmenta sin pedir un email.

**Riesgo**: más experimental. Si la persona viene apurada, puede sentirse que le obliga a "elegir camino" antes de entender qué pasa.

---

## Versión C · "El testimonio como hero"

**Foco**: bajar de abstracción y entrar por una historia humana real.
**Hero**:
- Sin eyebrow ni stats.
- Cita pivote grande, en primera persona: ***"Por fin alguien me decía que superó la etapa de la tristeza y que hoy es feliz de nuevo."***
- Atribución debajo: *Marilina G., 34 años · Argentina · Marilina llegó a Casacusia tras perder la audición de un oído.*
- Foto de Marilina (o testimonio rotativo de la comunidad).
- Debajo del testimonio, una línea pequeña: *Casacusia es una fundación para personas con pérdida auditiva y sus familias. [Conocé más →]*
- Un solo CTA principal: "Sumate"

**Funciona porque**: cuenta el outcome humano antes de la propuesta. La persona que entra ve a alguien real diciendo "esto me cambió". Es el patrón de Watsi y Charity:Water aplicado.

**Riesgo**: si la persona viene googleando "¿qué es la hipoacusia?", no encuentra la definición arriba. Mitigable con buen meta description.

---

## Comparación rápida

| | Versión A | Versión B | Versión C |
|---|---|---|---|
| Hook | Dato + promesa | Pregunta interactiva | Testimonio humano |
| Tiempo a comprensión | Medio | Bajo | Alto (requiere scroll) |
| SEO directo | Alto (palabras clave en h1) | Medio | Bajo |
| Diferencia con webs comunes | Baja | Alta | Media |
| Activación emocional | Alta | Muy alta | Muy alta |

---

## Recomendación para A/B

**Probaría A vs B**. Son ambas válidas, pero radicalmente distintas en aproximación.

- A es la "segura": dato + promesa.
- B es la "experimental": pregunta + segmentación temprana.

La C es atractiva pero más arriesgada para tráfico nuevo. Reservar para iteración posterior si A o B no convencen.

**Cómo implementarlo**:
- Componente `<HomeHero>` recibe `variant: "A" | "B"` como prop.
- Server component decide en build o en request usando cookie `casacusia-variant`.
- Cookie se setea la primera vez con valor random (50/50).
- Analytics: agregamos `data-variant` en el body o un evento custom para registrar.

**Esfuerzo estimado**: 4-6 horas para Versión A y B funcionando con tracking.

---

## Próxima decisión Lucas

1. ¿Aprobás probar A vs B? ¿O preferís otra combinación?
2. ¿Tenemos analytics ya (Plausible, GA4, etc.) o lo armamos ahora?
3. ¿Versión C la guardamos para una segunda ronda?
