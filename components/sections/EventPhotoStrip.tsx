import { RotatingImage } from "@/components/ui/RotatingImage";

/**
 * Franja de fotos de encuentros que van cambiando.
 * Mobile: 2 fotos · Desktop: 4 fotos. Cada slot cicla su grupo cada 4s.
 */
export function EventPhotoStrip({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  // Repartimos el pool en 4 grupos para que cada slot muestre fotos distintas.
  const slots: string[][] = [[], [], [], []];
  photos.forEach((p, i) => slots[i % 4]!.push(p));

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3" aria-hidden>
      {slots.map((grupo, i) => (
        <div
          key={i}
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-surface-line bg-surface-tint ${
            i >= 2 ? "hidden md:block" : ""
          }`}
        >
          <RotatingImage
            images={grupo.length > 0 ? grupo : photos}
            alt=""
            intervalMs={4000}
            className="w-full h-full"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
