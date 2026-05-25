#!/usr/bin/env node
/**
 * Genera content/fotos-manifest.json con el listado de fotos disponibles en /public.
 * Se corre como prebuild y predev para mantenerlo sincronizado.
 *
 * Esto reemplaza el readdirSync que hacía la página /fotos en runtime y que
 * obligaba a Next.js a empaquetar todo /public/fotos en la Vercel Function
 * (1.35GB > 300MB).
 */

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_DIR = join(ROOT, "public");
const OUT_FILE = join(ROOT, "content", "fotos-manifest.json");

const FOLDERS = [
  "fotos",
  "fotos-nuevas/fotos",
  "fotos-nuevas/casacusia-kids-2026-3-001",
  "fotos-nuevas/eventos",
  "fotos-nuevas/kids"
];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function formatMonthYear(year, month) {
  return `${MESES[month - 1]} ${year}`;
}

function extractDate(filePath, mtime) {
  const match = filePath.match(/(20\d{2})[-_/](\d{1,2})(?:[-_/]|\.|$)/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    if (month >= 1 && month <= 12) {
      return { year, month, label: formatMonthYear(year, month), source: "path" };
    }
  }
  const d = new Date(mtime);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  return { year, month, label: formatMonthYear(year, month), source: "mtime" };
}

function walk(dir) {
  const photos = [];
  let entries;
  try {
    entries = readdirSync(join(PUBLIC_DIR, dir));
  } catch {
    return photos;
  }

  for (const entry of entries) {
    const full = join(PUBLIC_DIR, dir, entry);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      photos.push(...walk(join(dir, entry)));
    } else {
      const ext = entry.substring(entry.lastIndexOf(".")).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        const path = "/" + join(dir, entry);
        const { year, month, label, source } = extractDate(path, stat.mtime.getTime());
        photos.push({ path, year, month, label, source });
      }
    }
  }
  return photos;
}

const all = FOLDERS.flatMap(walk);
all.sort((a, b) => {
  const ya = a.year * 100 + a.month;
  const yb = b.year * 100 + b.month;
  if (yb !== ya) return yb - ya;
  return a.path.localeCompare(b.path);
});

writeFileSync(OUT_FILE, JSON.stringify({ generated: new Date().toISOString(), photos: all }, null, 2));
console.log(`[fotos-manifest] ${all.length} fotos → ${OUT_FILE}`);
