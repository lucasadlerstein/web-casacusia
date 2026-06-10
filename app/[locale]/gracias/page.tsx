import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { CheckCircle2, Home, ArrowRight, Heart, Coffee } from "lucide-react";

import { Filamento } from "@/components/ui/Filamento";

const DONAR_URL = "https://links.casacusia.org/donar";

const planes = [
  {
    nombre: "Café Flat White",
    precio: "$4.800/mes",
    desc: "Nos invitás un café al mes. Ayuda a sostener la infraestructura básica.",
    icon: Coffee,
    color: "border-verde/30 bg-verde-soft text-verde-dark"
  },
  {
    nombre: "Café + Tostón",
    precio: "$12.000/mes",
    desc: "Un aporte con gran impacto. Ayudás directamente a sostener el podcast.",
    icon: Heart,
    color: "border-rosa/30 bg-rosa-soft text-rosa-dark",
    destacado: true
  },
  {
    nombre: "Tira de Asado",
    precio: "$25.000/mes",
    desc: "Aporte clave para la logística de los grandes encuentros presenciales.",
    icon: Heart,
    color: "border-violeta/30 bg-violeta-soft text-violeta-dark"
  }
];

export default async function GraciasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center overflow-hidden py-16">
      <Filamento name="verde" className="top-20 -right-20 w-80 rotate-[15deg]" opacity={12} />
      <Filamento name="rosa" className="bottom-20 -left-20 w-64 rotate-[-20deg]" opacity={10} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-verde/10 text-verde shadow-sm border border-verde/20">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
          Ya enviamos tu consulta.
        </h1>

        <p className="mt-4 text-lg text-ink-soft leading-relaxed">
          Si podés ayudarnos a crecer, tu aporte mensual sostiene todo lo que hacemos.
        </p>

        {/* Planes de donación */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3 text-left">
          {planes.map((plan) => {
            const Icon = plan.icon;
            return (
              <a
                key={plan.nombre}
                href={DONAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl border-2 p-5 transition-all hover:shadow-md hover:-translate-y-1 ${plan.color} ${
                  plan.destacado ? "ring-2 ring-rosa/40" : ""
                }`}
              >
                <Icon size={20} aria-hidden className="mb-2" />
                <p className="font-display text-sm font-bold">{plan.nombre}</p>
                <p className="font-display text-xl font-extrabold mt-1">{plan.precio}</p>
                <p className="text-xs mt-2 opacity-80">{plan.desc}</p>
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={DONAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-verde-dark text-white px-8 text-sm font-bold hover:bg-verde transition-colors"
          >
            Quiero donar mensual
            <ArrowRight size={16} aria-hidden />
          </a>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-surface-line bg-surface-card px-6 text-sm font-bold text-ink hover:bg-surface-tint transition-all"
          >
            <Home size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
