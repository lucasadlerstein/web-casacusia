import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { ShuffleOrder } from "@/components/ui/ShuffleOrder";
import { getAliadosRedAuditiva, type CategoriaAuditiva } from "@/lib/content";

const CATEGORIAS: { key: CategoriaAuditiva; label: string; color: string }[] = [
  { key: "audifonos", label: "de audífonos",          color: "border-verde-dark/30 bg-verde-soft/30" },
  { key: "implantes", label: "de implantes auditivos", color: "border-violeta/30 bg-violeta-soft/30" }
];

/**
 * Franja compacta con los logos de aliados auditivos (audífonos, implantes).
 * La etiqueta de la categoría va por fuera y arriba del recuadro; los logos, centrados.
 * Muestra "Próximamente" cuando no hay empresas activas en una categoría.
 * El orden de los logos se mezcla en cada carga: ningún Aliado queda fijo primero.
 * Se reutiliza en programas, podcast, calendario, nosotros, etc.
 */
export function AliadosAuditivos() {
  const porCategoria = getAliadosRedAuditiva();

  return (
    <section className="border-t border-surface-line bg-surface-tint py-10">
      <div className="container max-w-5xl mx-auto px-4">
        <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink text-center mb-8 max-w-2xl mx-auto leading-tight">
          Red de Empresas que Escuchan y Acompañan a la Comunidad Casacusia
        </h2>

        <ul className="space-y-6 max-w-3xl mx-auto">
          {CATEGORIAS.map((cat) => {
            const empresas = porCategoria[cat.key];
            const hayEmpresas = empresas.length > 0;

            return (
              <li key={cat.key}>
                <p className="mb-2 text-center font-display font-bold text-ink">{cat.label}</p>

                {hayEmpresas ? (
                  <div className={`rounded-2xl border-2 ${cat.color} px-6 py-6`}>
                    <ShuffleOrder className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                      {empresas.map((a) => {
                        const img = (
                          <Image
                            src={a.logo}
                            alt={a.nombre}
                            width={911}
                            height={315}
                            className="h-12 md:h-14 w-auto object-contain"
                          />
                        );
                        return (
                          <div
                            key={a.slug}
                            className="flex items-center justify-center transition-transform duration-300 motion-safe:hover:scale-105"
                          >
                            {a.web ? (
                              <a href={a.web} target="_blank" rel="noopener noreferrer" className="block">
                                {img}
                              </a>
                            ) : (
                              img
                            )}
                          </div>
                        );
                      })}
                    </ShuffleOrder>
                  </div>
                ) : (
                  <div className={`rounded-2xl border-2 ${cat.color} px-6 py-6 flex items-center justify-center`}>
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
