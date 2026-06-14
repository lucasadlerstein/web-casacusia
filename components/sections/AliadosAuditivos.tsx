import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { getAliadosRedAuditiva, type CategoriaAuditiva } from "@/lib/content";

const CATEGORIAS: { key: CategoriaAuditiva; label: string; color: string }[] = [
  { key: "audifonos",     label: "Audífonos",       color: "border-verde-dark/30 bg-verde-soft/30" },
  { key: "implantes",     label: "Implantes",       color: "border-violeta/30 bg-violeta-soft/30" },
  { key: "centro-medico", label: "Centros médicos", color: "border-rosa/30 bg-rosa-soft/30" }
];

/**
 * Franja compacta con los logos de aliados auditivos (implantes, audífonos, centros médicos).
 * Muestra "Próximamente" cuando no hay empresas activas en una categoría.
 * Se reutiliza en programas, podcast, calendario, nosotros, etc.
 */
export function AliadosAuditivos() {
  const porCategoria = getAliadosRedAuditiva();

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

        <ul className="space-y-3 max-w-3xl mx-auto">
          {CATEGORIAS.map((cat) => {
            const empresas = porCategoria[cat.key];
            const hayEmpresas = empresas.length > 0;

            return (
              <li
                key={cat.key}
                className={`rounded-2xl border-2 ${cat.color} px-5 py-4`}
              >
                {hayEmpresas ? (
                  <div className="flex flex-col gap-3">
                    <span className="font-display font-bold text-ink">{cat.label}</span>
                    <div className="flex flex-wrap items-center gap-6">
                      {empresas.map((a) => (
                        <div key={a.slug} className="flex flex-col items-center gap-1">
                          {a.web ? (
                            <a href={a.web} target="_blank" rel="noopener noreferrer" className="block grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                              <Image src={a.logo} alt={a.nombre} width={100} height={40} className="h-8 md:h-10 w-auto object-contain" />
                            </a>
                          ) : (
                            <Image src={a.logo} alt={a.nombre} width={100} height={40} className="h-8 md:h-10 w-auto object-contain opacity-70" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-ink">{cat.label}</span>
                    <span className="text-xs uppercase tracking-wider font-bold text-ink-muted">
                      Próximamente
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center text-sm text-ink-soft">
          ¿Tu empresa quiere ser parte?{" "}
          <Link href="/contacto?t=empresa" className="font-bold text-verde-dark underline underline-offset-4 hover:text-[#0a6b42]">
            Escribinos →
          </Link>
        </p>
      </div>
    </section>
  );
}
