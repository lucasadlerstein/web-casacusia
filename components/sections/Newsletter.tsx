"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Filamento } from "@/components/ui/Filamento";

const PERFILES = [
  "tengo-hipoacusia",
  "familiar",
  "trabajo-hipoacusia",
  "interesado",
  "inclusion-diversidad",
  "otro"
] as const;

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  perfil:  z.enum(PERFILES, { errorMap: () => ({ message: "Elegí una opción" }) }),
  consent: z.literal(true, { errorMap: () => ({ message: "Requerido" }) }),
  website: z.string().max(0).optional()
});
type FormValues = z.infer<typeof schema>;

export function Newsletter() {
  const t = useTranslations("home.newsletter");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    try {
      schema.parse(data);
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      reset();
    } catch {
      setStatus("err");
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-verde-dark py-20 md:py-28"
      aria-labelledby="nl-title"
    >
      {/* Filamentos — más visibles porque el fondo es del brand */}
      <Filamento name="amarillo" className="-top-16 -right-16 w-64 rotate-[-30deg]" opacity={22} />
      <Filamento name="rosa"     className="-bottom-12 -left-10 w-48 rotate-[20deg]" opacity={18} />
      <Filamento name="punto-naranja" className="top-12 right-[25%] w-8" opacity={45} />
      <Filamento name="punto-lavanda" className="bottom-16 left-[30%] w-6" opacity={40} />

      <div className="container relative max-w-2xl">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Send size={22} className="text-white" aria-hidden />
        </span>

        <h2
          id="nl-title"
          className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="mt-3 text-white/80">{t("subtitle")}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 sm:grid-cols-2" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/90">{t("name")}</span>
            <input
              type="text"
              autoComplete="name"
              {...register("name", { required: true, minLength: 2 })}
              aria-invalid={!!errors.name}
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder-white/40 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/25"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/90">{t("email")}</span>
            <input
              type="email"
              autoComplete="email"
              {...register("email", { required: true })}
              aria-invalid={!!errors.email}
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-white placeholder-white/40 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/25"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-white/90">{t("perfil")}</span>
            <select
              {...register("perfil", { required: true })}
              aria-invalid={!!errors.perfil}
              defaultValue=""
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-white focus:border-white focus:outline-none focus:ring-4 focus:ring-white/25 appearance-none [&>option]:bg-verde-dark [&>option]:text-white"
            >
              <option value="" disabled>{t("perfilPlaceholder")}</option>
              {PERFILES.map((p) => (
                <option key={p} value={p}>{t(`perfiles.${p}`)}</option>
              ))}
            </select>
          </label>

          {/* Honeypot */}
          <label className="hidden" aria-hidden>
            <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>

          <label className="sm:col-span-2 flex items-start gap-2.5 text-sm text-white/80">
            <input type="checkbox" required {...register("consent")} className="mt-0.5 accent-white" />
            <span>{t("consent")}</span>
          </label>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="bg-white text-verde-dark font-bold hover:bg-white/90"
            >
              {t("submit")}
            </Button>
            {status === "ok" && (
              <p role="status" className="text-sm font-medium text-white">{t("success")}</p>
            )}
            {status === "err" && (
              <p role="alert" className="text-sm text-white/80">{t("error")}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
