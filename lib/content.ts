import { z } from "zod";

import aliadosData from "@/content/aliados.json";
import equipoData from "@/content/equipo.json";
import voluntariosData from "@/content/voluntarios.json";
import programasData from "@/content/programas.json";
import eventosData from "@/content/eventos.json";
import testimoniosData from "@/content/testimonios.json";
import impactoData from "@/content/impacto.json";
import faqsData from "@/content/faq.json";
import reconocimientosData from "@/content/reconocimientos.json";
import gruposWhatsappData from "@/content/grupos-whatsapp.json";

export const comisiones = [
  "comunicacion",
  "encuentros",
  "podcast",
  "red-padres",
  "contenido",
  "fundraising",
  "tecnologia",
  "diseno",
  "otro"
] as const;
export type Comision = (typeof comisiones)[number];

export const categoriasAuditivas = [
  "audifonos",
  "implantes",
  "centro-medico"
] as const;
export type CategoriaAuditiva = (typeof categoriasAuditivas)[number];

const AliadoSchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  logo: z.string(),
  web: z.string().url().optional(),
  sector: z.string(),
  tipoAlianza: z.array(z.enum(["financiera", "producto", "servicio", "institucional", "comunicacional"])),
  categoriaAuditiva: z.enum(categoriasAuditivas).optional(),
  proyectoApoyado: z.array(z.string()),
  impacto: z.string(),
  destacado: z.boolean(),
  orden: z.number(),
  desde: z.string(),
  activo: z.boolean()
});
export type Aliado = z.infer<typeof AliadoSchema>;

const MiembroSchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  rol: z.string(),
  esFundador: z.boolean(),
  foto: z.string(),
  bioCorta: z.string(),
  quotePersonal: z.string().optional(),
  linkedin: z.string().url().optional(),
  orden: z.number()
});
export type MiembroEquipo = z.infer<typeof MiembroSchema>;

const VoluntarioSchema = z.object({
  slug: z.string(),
  nombre: z.string(),
  foto: z.string(),
  comision: z.enum(comisiones),
  rolEnComision: z.string().optional(),
  ciudad: z.string().optional()
});
export type Voluntario = z.infer<typeof VoluntarioSchema>;

const ProgramaSchema = z.object({
  slug: z.string(),
  titulo: z.string(),
  subtitulo: z.string(),
  resumen: z.string(),
  categorias: z.array(z.enum(["comunidad", "herramientas", "sociedad"])),
  cta: z.object({ label: z.string(), href: z.string() }),
  destacado: z.boolean(),
  orden: z.number()
});
export type Programa = z.infer<typeof ProgramaSchema>;

const EventoSchema = z.object({
  slug: z.string(),
  titulo: z.string(),
  tipo: z.enum(["presencial", "virtual"]),
  programa: z.string(),
  ciudad: z.string().optional(),
  direccion: z.string().optional(),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  linkInscripcion: z.string().optional(),
  estado: z.enum(["proximo", "realizado", "cancelado"])
});
export type Evento = z.infer<typeof EventoSchema>;

export const testimonioAudiencias = [
  "persona-con-perdida-auditiva",
  "familia",
  "profesional",
  "aliado-curioso"
] as const;
export type TestimonioAudiencia = (typeof testimonioAudiencias)[number];

export const testimonioImpactos = [
  "identificacion",
  "informacion",
  "aceptacion",
  "accion",
  "orgullo",
  "pertenencia"
] as const;
export type TestimonioImpacto = (typeof testimonioImpactos)[number];

export const testimonioProyectos = [
  "podcast",
  "encuentros-presenciales",
  "encuentros-virtuales",
  "red-familias",
  "contenido-redes",
  "charlas"
] as const;
export type TestimonioProyecto = (typeof testimonioProyectos)[number];

const TestimonioSchema = z.object({
  id: z.string(),
  texto: z.string(),
  autor: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  contexto: z.string().optional(),
  fraseDestacada: z.string().optional(),
  origen: z.string().optional(),
  audiencia: z.array(z.enum(testimonioAudiencias)).optional(),
  tipoImpacto: z.array(z.enum(testimonioImpactos)).optional(),
  proyectosAsociados: z.array(z.enum(testimonioProyectos)).optional(),
  etapa: z.string().nullable().optional(),
  destacado: z.boolean()
});
export type Testimonio = z.infer<typeof TestimonioSchema>;

const ImpactoSchema = z.object({
  participantesTotales: z.number(),
  encuentrosRealizados: z.number(),
  ciudadesAlcanzadas: z.number(),
  padresEnRed: z.number(),
  episodiosPodcast: z.number(),
  paisesAlcanzados: z.number().optional(),
  voluntariosActivos: z.number(),
  horasDonadasAnuales: z.number(),
  impresionesUltimoMes: z.number().optional(),
  comparacionPoblacional: z.string().optional(),
  ultimaActualizacion: z.string()
});
export type Impacto = z.infer<typeof ImpactoSchema>;

const FAQSchema = z.object({
  id: z.string(),
  pregunta: z.string(),
  respuesta: z.string(),
  categoria: z.string(),
  orden: z.number(),
  destacada: z.boolean()
});
export type FAQ = z.infer<typeof FAQSchema>;

const ReconocimientoSchema = z.object({
  titulo: z.string(),
  organismo: z.string(),
  fecha: z.string(),
  descripcion: z.string()
});
export type Reconocimiento = z.infer<typeof ReconocimientoSchema>;

export function getAliados(opts: {
  destacados?: boolean;
  categoriaAuditiva?: CategoriaAuditiva;
} = {}): Aliado[] {
  let all = z.array(AliadoSchema).parse(aliadosData).filter((a) => a.activo);
  if (opts.destacados) all = all.filter((a) => a.destacado);
  if (opts.categoriaAuditiva) all = all.filter((a) => a.categoriaAuditiva === opts.categoriaAuditiva);
  return all.sort((a, b) => a.orden - b.orden);
}

export function getAliadosRedAuditiva(): Record<CategoriaAuditiva, Aliado[]> {
  const all = getAliados();
  return {
    audifonos: all.filter((a) => a.categoriaAuditiva === "audifonos"),
    implantes: all.filter((a) => a.categoriaAuditiva === "implantes"),
    "centro-medico": all.filter((a) => a.categoriaAuditiva === "centro-medico")
  };
}

export function getAliadoBySlug(slug: string): Aliado | null {
  return getAliados().find((a) => a.slug === slug) ?? null;
}

export function getEquipo(): MiembroEquipo[] {
  return z.array(MiembroSchema).parse(equipoData).sort((a, b) => a.orden - b.orden);
}

export function getVoluntarios(opts: { comision?: Comision } = {}): Voluntario[] {
  const all = z.array(VoluntarioSchema).parse(voluntariosData);
  return opts.comision ? all.filter((v) => v.comision === opts.comision) : all;
}

export function getComisionesConConteo(): { comision: Comision; count: number }[] {
  const all = getVoluntarios();
  const counts = new Map<Comision, number>();
  for (const c of comisiones) counts.set(c, 0);
  for (const v of all) counts.set(v.comision, (counts.get(v.comision) ?? 0) + 1);
  return [...counts.entries()]
    .map(([comision, count]) => ({ comision, count }))
    .filter((c) => c.count > 0);
}

export function getProgramas(): Programa[] {
  return z.array(ProgramaSchema).parse(programasData).sort((a, b) => a.orden - b.orden);
}

export function getProximosEventos(opts: { limit?: number } = {}): Evento[] {
  const all = z
    .array(EventoSchema)
    .parse(eventosData)
    .filter((e) => e.estado === "proximo")
    .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  return opts.limit ? all.slice(0, opts.limit) : all;
}


export function getTestimonios(opts: {
  destacados?: boolean;
  proyecto?: TestimonioProyecto;
  audiencia?: TestimonioAudiencia;
  limit?: number;
} = {}): Testimonio[] {
  let all = z.array(TestimonioSchema).parse(testimoniosData);
  if (opts.destacados) all = all.filter((t) => t.destacado);
  if (opts.proyecto) all = all.filter((t) => t.proyectosAsociados?.includes(opts.proyecto!));
  if (opts.audiencia) all = all.filter((t) => t.audiencia?.includes(opts.audiencia!));
  return opts.limit ? all.slice(0, opts.limit) : all;
}

/** Devuelve testimonios por id, en el orden pedido (ignora ids inexistentes). */
export function getTestimoniosByIds(ids: string[]): Testimonio[] {
  const byId = new Map(z.array(TestimonioSchema).parse(testimoniosData).map((t) => [t.id, t]));
  return ids.map((id) => byId.get(id)).filter((t): t is Testimonio => Boolean(t));
}

export function getImpacto(): Impacto {
  return ImpactoSchema.parse(impactoData);
}

export function getFAQs(opts: { categoria?: string } = {}): FAQ[] {
  const all = z.array(FAQSchema).parse(faqsData).sort((a, b) => a.orden - b.orden);
  return opts.categoria ? all.filter((f) => f.categoria === opts.categoria) : all;
}

export function getReconocimientos(): Reconocimiento[] {
  return z.array(ReconocimientoSchema).parse(reconocimientosData);
}

const GruposWhatsappSchema = z.object({
  linkComunidad: z.string(),
  totalPersonas: z.number(),
  grupos: z.array(z.object({ nombre: z.string(), categoria: z.literal("argentina") })),
  gruposInternacionales: z.array(z.object({ nombre: z.string(), bandera: z.string() })),
  gruposTematicos: z.array(z.object({ nombre: z.string() }))
});
export type GruposWhatsapp = z.infer<typeof GruposWhatsappSchema>;

export function getGruposWhatsapp(): GruposWhatsapp {
  return GruposWhatsappSchema.parse(gruposWhatsappData);
}
