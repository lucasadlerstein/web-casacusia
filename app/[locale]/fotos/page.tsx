import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { readdirSync, statSync } from "fs";
import { join } from "path";

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
  "/fotos/taller-adultos.jpg",
  "/fotos/taller-ceramica.jpg",
  "/fotos/hero-comunidad.jpg",
]);

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

type Photo = {
  path: string;
  year: number;
  month: number;
  label: string;
  source: "path" | "mtime";
};

function formatMonthYear(year: number, month: number): string {
  return `${MESES[month - 1]} ${year}`;
}

function extractDate(filePath: string, mtime: Date): { year: number; month: number; label: string; source: "path" | "mtime" } {
  // Buscar patrón YYYY-MM o YYYY/MM o YYYY_MM en el path
  const match = filePath.match(/(20\d{2})[-_/](\d{1,2})(?:[-_/]|\.|$)/);
  if (match) {
    const year = parseInt(match[1]!, 10);
    const month = parseInt(match[2]!, 10);
    if (month >= 1 && month <= 12) {
      return { year, month, label: formatMonthYear(year, month), source: "path" };
    }
  }
  // Fallback a mtime del archivo
  const year = mtime.getFullYear();
  const month = mtime.getMonth() + 1;
  return { year, month, label: formatMonthYear(year, month), source: "mtime" };
}

function getPhotosFromDir(dir: string): Photo[] {
  const publicDir = join(process.cwd(), "public");
  const fullDir = join(publicDir, dir);
  const photos: Photo[] = [];

  try {
    const entries = readdirSync(fullDir);
    for (const entry of entries) {
      const fullPath = join(fullDir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        photos.push(...getPhotosFromDir(join(dir, entry)));
      } else {
        const ext = entry.substring(entry.lastIndexOf(".")).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          const relativePath = "/" + join(dir, entry);
          const mtime = stat.mtime;
          const { year, month, label, source } = extractDate(relativePath, mtime);
          photos.push({ path: relativePath, year, month, label, source });
        }
      }
    }
  } catch {
    // directory doesn't exist
  }

  return photos;
}

export default async function FotosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const folders = [
    "fotos",
    "fotos-nuevas/fotos",
    "fotos-nuevas/casacusia-kids-2026-3-001",
    "fotos-nuevas/eventos",
    "fotos-nuevas/kids"
  ];
  const allPhotos = folders.flatMap((f) => getPhotosFromDir(f));

  // Agrupar por label "Mes Año"
  const groups: Record<string, { photos: Photo[]; year: number; month: number }> = {};
  for (const photo of allPhotos) {
    if (!groups[photo.label]) {
      groups[photo.label] = { photos: [], year: photo.year, month: photo.month };
    }
    groups[photo.label]!.photos.push(photo);
  }

  // Ordenar grupos por año-mes descendente (más reciente primero)
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
          Total: {allPhotos.length} fotos · {sortedGroups.length} períodos · Agrupadas por fecha (del path o del archivo).
        </p>

        {sortedGroups.map(([label, group]) => {
          // Dentro de cada grupo, ordenar las fotos: las que tienen fecha por path primero, luego por path alfabético
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
