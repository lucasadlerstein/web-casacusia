import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { getAliadosRedAuditiva, type CategoriaAuditiva } from "@/lib/content";

const LABELS: Record<CategoriaAuditiva, string> = {
  audifonos: "Audífonos",
  implantes: "Implantes",
  "centro-medico": "Centros médicos"
};

/**
 * Franja compacta con los logos de aliados auditivos (implantes, audífonos, centros médicos).
 * Se reutiliza en programas, podcast, calendario, etc.
 */
export function AliadosAuditivos() {
  const porCategoria = getAliadosRedAuditiva();
  const todos = [
    ...porCategoria.audifonos,
    ...porCategoria.implantes,
    ...porCategoria["centro-medico"]
  ];

  if (todos.length === 0) return null;

  return (
    <section className="border-t border-surface-line bg-surface-tint py-10">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-verde-dark mb-1">
            Red de Empresas que Escuchan
          </p>
          <p className="text-sm text-ink-soft">
            Instituciones del rubro auditivo que nos impulsan a crecer
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {todos.map((a) => (
            <div key={a.slug} className="flex flex-col items-center gap-2">
              {a.web ? (
                <a href={a.web} target="_blank" rel="noopener noreferrer" className="block grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                  <Image
                    src={a.logo}
                    alt={a.nombre}
                    width={120}
                    height={48}
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </a>
              ) : (
                <div className="grayscale opacity-70">
                  <Image
                    src={a.logo}
                    alt={a.nombre}
                    width={120}
                    height={48}
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </div>
              )}
              <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                {LABELS[a.categoriaAuditiva!]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/aliados"
            className="text-sm font-semibold text-verde-dark underline underline-offset-4 decoration-verde/40 hover:decoration-verde"
          >
            Ver todos los aliados
          </Link>
        </div>
      </div>
    </section>
  );
}
