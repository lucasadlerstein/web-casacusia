import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

import manifest from "@/content/fotos-manifest.json";

type Photo = {
  path: string;
  year: number;
  month: number;
  label: string;
  source: "path" | "mtime";
};

/** Photos already used in components */
const USED_PHOTOS = new Set([
  "/fotos/propuestas/Casacusia_GZ-21.jpg",
  "/fotos/propuestas/DSC00009.jpg",
  "/fotos/propuestas/DSC00020.jpg",
  "/fotos/propuestas/DSC00021.jpg",
  "/fotos/propuestas/casacusia_kids_alta_169.jpg",
  "/fotos/propuestas/casacusia_kids_alta_186.jpg",
  "/fotos/propuestas/casacusia_kids_alta_245.jpg",
  "/fotos/propuestas/casacusia_kids_alta_252.jpg",
  "/fotos/sumate-donar.jpg",
  "/fotos/sumate-comunidad.jpg",
  "/fotos/taller-adultos.jpg",
  "/fotos/taller-ceramica.jpg",
  "/fotos/hero-comunidad.jpg",
]);

export default async function FotosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allPhotos = (manifest as { photos: Photo[] }).photos;

  // Agrupar por label "Mes Año"
  const groups: Record<string, { photos: Photo[]; year: number; month: number }> = {};
  for (const photo of allPhotos) {
    if (!groups[photo.label]) {
      groups[photo.label] = { photos: [], year: photo.year, month: photo.month };
    }
    groups[photo.label]!.photos.push(photo);
  }

  const sortedGroups = Object.entries(groups).sort((a, b) => {
    const ya = a[1].year * 100 + a[1].month;
    const yb = b[1].year * 100 + b[1].month;
    return yb - ya;
  });

  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-[#143642] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2">Fotos disponibles</h1>
        <p className="text-white/60 mb-2">
          Las fotos con opacidad reducida ya están en uso. Indicá el número para cambiar alguna.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Total: {allPhotos.length} fotos · {sortedGroups.length} períodos · Manifest generado en build.
        </p>

        {sortedGroups.map(([label, group]) => {
          const orderedPhotos = [...group.photos].sort((a, b) => a.path.localeCompare(b.path));
          const fromPath = orderedPhotos.filter((p) => p.source === "path").length;

          return (
            <details key={label} open className="mb-6 group">
              <summary className="cursor-pointer list-none sticky top-0 bg-[#143642] py-3 z-10 flex items-center justify-between gap-3 select-none">
                <h2 className="font-display text-xl font-semibold text-[#FFC001] flex items-center gap-3">
                  <span aria-hidden className="inline-block w-4 transition-transform group-open:rotate-90">▶</span>
                  {label}
                  <span className="text-white/40 text-sm font-normal">({group.photos.length} {group.photos.length === 1 ? "foto" : "fotos"})</span>
                </h2>
                {fromPath > 0 && fromPath < group.photos.length && (
                  <span className="text-[10px] uppercase tracking-wider text-white/40">
                    {fromPath} por path · {group.photos.length - fromPath} por mtime
                  </span>
                )}
              </summary>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-4">
                {orderedPhotos.map((photo) => {
                  globalIndex++;
                  const isUsed = USED_PHOTOS.has(photo.path);
                  const fileName = photo.path.split("/").pop() ?? "";
                  return (
                    <div
                      key={photo.path}
                      className={`group/photo relative rounded-xl overflow-hidden border-2 ${
                        isUsed ? "border-[#00B980] opacity-70" : "border-transparent hover:border-[#FFC001]"
                      }`}
                    >
                      <div className="aspect-[4/3] relative bg-black/20">
                        <Image
                          src={photo.path}
                          alt={fileName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        #{globalIndex}
                      </div>
                      {isUsed && (
                        <div className="absolute top-2 right-2 bg-[#00B980] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          EN USO
                        </div>
                      )}
                      {photo.source === "mtime" && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white/70 text-[9px] font-medium px-1.5 py-0.5 rounded">
                          mtime
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <p className="text-[10px] text-white/90 truncate">{photo.path}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
