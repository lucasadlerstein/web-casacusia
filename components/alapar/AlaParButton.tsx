import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type AlaParVariant = "cereza" | "ambar" | "outline" | "outlineLight";
export type AlaParSize = "md" | "lg";
type Variant = AlaParVariant;
type Size = AlaParSize;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-onest font-extrabold tracking-tight " +
  "transition-[transform,background-color,color,box-shadow] duration-200 ease-out " +
  "hover:-translate-y-0.5 active:translate-y-0 " +
  "focus-visible:outline-none focus-visible:ring-4";

const variants: Record<Variant, string> = {
  cereza:       "bg-alapar-cereza text-alapar-crema hover:bg-alapar-cereza-deep shadow-[0_10px_24px_-10px_rgba(145,27,71,0.55)] focus-visible:ring-alapar-rosa/40",
  ambar:        "bg-alapar-ambar text-alapar-cereza-deep hover:bg-[#ffd04d] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] focus-visible:ring-alapar-ambar/50",
  outline:      "border-2 border-alapar-cereza text-alapar-cereza hover:bg-alapar-cereza hover:text-alapar-crema focus-visible:ring-alapar-rosa/40",
  outlineLight: "border-2 border-alapar-crema/70 text-alapar-crema hover:bg-alapar-crema hover:text-alapar-cereza focus-visible:ring-alapar-crema/40"
};

const sizes: Record<Size, string> = {
  md: "h-11 min-h-[44px] px-5 text-[0.95rem]",
  lg: "h-14 min-h-[52px] px-7 text-base md:text-lg"
};

/** Clases del botón, para usarlas en un <button> nativo (ej. abrir el modal). */
export function alaParButtonClasses(variant: Variant = "cereza", size: Size = "md", className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function AlaParButton({
  href,
  variant = "cereza",
  size = "md",
  className,
  children
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const isAnchor = href.startsWith("#");
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  if (isAnchor || isExternal) {
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
