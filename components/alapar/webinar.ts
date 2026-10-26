import type { AlaParContent } from "@/lib/content";

type Webinar = AlaParContent["webinar"];

/** Fecha ISO → formato compacto de Google Calendar (20261119T220000Z). */
function gcalDate(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link a Google Calendar con el evento de la charla ya cargado. */
export function calendarUrl(w: Webinar): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: w.calendarTitulo,
    dates: `${gcalDate(w.inicio)}/${gcalDate(w.fin)}`,
    details: w.calendarDetalle,
    location: w.meet,
    ctz: "America/Argentina/Buenos_Aires"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
