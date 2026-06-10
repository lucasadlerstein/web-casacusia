"use client";

import { useEffect } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <p className="font-display text-verde font-black text-7xl md:text-9xl leading-none tracking-tighter opacity-20">
        Oops
      </p>
      <h1 className="mt-4 font-display text-2xl md:text-4xl font-extrabold tracking-tight text-ink">
        Algo salió mal.
      </h1>
      <p className="mt-4 text-lg text-ink-soft max-w-md mx-auto leading-relaxed">
        Estamos trabajando para solucionarlo. Podés intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-verde-dark px-6 text-sm font-bold text-white hover:bg-verde transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-6 text-sm font-bold text-ink hover:border-ink/30 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
