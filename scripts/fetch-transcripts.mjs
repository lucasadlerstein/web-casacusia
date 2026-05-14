#!/usr/bin/env node
/**
 * Fetch YouTube auto-generated transcripts for all CASACUSIA podcast episodes.
 * Outputs one JSON per episode in content/transcripciones/.
 *
 * Usage:
 *   node scripts/fetch-transcripts.mjs
 *   node scripts/fetch-transcripts.mjs --force   # re-fetch even if file exists
 *
 * Respects YouTube rate limits with delays between requests.
 * If you get 429 errors, wait 10-15 minutes and try again.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PODCAST_JSON = join(ROOT, "content", "podcast.json");
const OUTPUT_DIR = join(ROOT, "content", "transcripciones");
const DELAY_MS = 4000;
const FORCE = process.argv.includes("--force");

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n/g, " ")
    .trim();
}

function cleanTitle(title) {
  return title.replace(/[\u{1F1E0}-\u{1F1FF}]{2}\s*/gu, "").trim();
}

async function getCaptionUrl(videoId) {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": UA, "Accept-Language": "es-419,es;q=0.9,en;q=0.8" },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const m = html.match(/"captions".*?"captionTracks":\[(.*?)\]/);
  if (!m) return null;

  let tracks;
  try {
    tracks = JSON.parse("[" + m[1] + "]");
  } catch {
    return null;
  }

  for (const lang of ["es", "es-419"]) {
    const t = tracks.find((t) => t.languageCode === lang);
    if (t?.baseUrl) return t.baseUrl;
  }
  return tracks[0]?.baseUrl ?? null;
}

async function fetchTranscript(captionUrl) {
  const res = await fetch(captionUrl, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;

  const xml = await res.text();
  const texts = [...xml.matchAll(/<text[^>]*>([^<]*)<\/text>/gs)]
    .map((m) => decodeEntities(m[1]))
    .filter(Boolean);

  return texts.length > 0 ? texts.join(" ") : null;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const episodes = JSON.parse(readFileSync(PODCAST_JSON, "utf-8"));
  const withYt = episodes.filter((e) => e.youtubeId);

  console.log(`Found ${withYt.length} episodes with YouTube IDs`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log();

  let success = 0, skipped = 0, failed = 0;

  for (let i = 0; i < withYt.length; i++) {
    const ep = withYt[i];
    const slug = ep.slug;
    const outFile = join(OUTPUT_DIR, `${slug}.json`);

    if (!FORCE && existsSync(outFile)) {
      console.log(`[${i + 1}/${withYt.length}] SKIP ${slug}`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${withYt.length}] ${slug} (${ep.youtubeId})`);

    const captionUrl = await getCaptionUrl(ep.youtubeId);
    if (!captionUrl) {
      console.log("  ✗ No captions found");
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    await sleep(1000);

    const transcript = await fetchTranscript(captionUrl);
    if (!transcript) {
      console.log("  ✗ Failed to fetch transcript (429?)");
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    const data = {
      slug,
      numero: ep.numero ?? 0,
      titulo: cleanTitle(ep.titulo ?? ""),
      youtubeId: ep.youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${ep.youtubeId}`,
      categoria: ep.categoria ?? "",
      invitado: ep.invitado ?? null,
      duracion: ep.duracion ?? "",
      transcripcion: transcript,
    };

    writeFileSync(outFile, JSON.stringify(data, null, 2), "utf-8");
    console.log(`  ✓ ${transcript.length.toLocaleString()} chars`);
    success++;

    await sleep(DELAY_MS);
  }

  console.log();
  console.log(`Done! ✓ ${success}  ⊘ ${skipped}  ✗ ${failed}`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
