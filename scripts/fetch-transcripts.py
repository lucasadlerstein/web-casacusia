#!/usr/bin/env python3
"""
Fetch YouTube auto-generated transcripts for all CASACUSIA podcast episodes.
Outputs one JSON per episode in content/transcripciones/.

Usage:
  python3 scripts/fetch-transcripts.py

Respects YouTube rate limits with delays between requests.
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from html import unescape
from pathlib import Path

PODCAST_JSON = Path(__file__).parent.parent / "content" / "podcast.json"
OUTPUT_DIR = Path(__file__).parent.parent / "content" / "transcripciones"
DELAY_BETWEEN_REQUESTS = 4  # seconds between YouTube requests


def get_caption_url(video_id: str) -> str | None:
    """Fetch YouTube page and extract the auto-caption URL for Spanish."""
    url = f"https://www.youtube.com/watch?v={video_id}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept-Language": "es-419,es;q=0.9",
    })
    try:
        html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")
    except Exception as e:
        print(f"  ERROR fetching page: {e}")
        return None

    m = re.search(r'"captions".*?"captionTracks":\[(.*?)\]', html)
    if not m:
        return None

    try:
        tracks = json.loads("[" + m.group(1) + "]")
    except json.JSONDecodeError:
        return None

    # Prefer 'es', then 'es-419', then first available
    for lang in ["es", "es-419"]:
        for t in tracks:
            if t.get("languageCode") == lang:
                return t["baseUrl"]
    return tracks[0]["baseUrl"] if tracks else None


def fetch_transcript(caption_url: str) -> str | None:
    """Download the XML caption file and extract plain text."""
    req = urllib.request.Request(caption_url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    })
    try:
        xml_data = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")
    except Exception as e:
        print(f"  ERROR fetching transcript: {e}")
        return None

    root = ET.fromstring(xml_data)
    segments = []
    for elem in root.findall(".//text"):
        text = elem.text
        if text:
            # Clean up HTML entities and extra whitespace
            text = unescape(text).replace("\n", " ").strip()
            if text:
                segments.append(text)

    return " ".join(segments) if segments else None


def clean_title(title: str) -> str:
    """Remove emoji flags and clean up title."""
    title = re.sub(r"[\U0001F1E0-\U0001F1FF]{2}\s*", "", title)
    return title.strip()


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(PODCAST_JSON, "r", encoding="utf-8") as f:
        episodes = json.load(f)

    episodes_with_yt = [e for e in episodes if e.get("youtubeId")]
    print(f"Found {len(episodes_with_yt)} episodes with YouTube IDs")
    print(f"Output dir: {OUTPUT_DIR}")
    print()

    success = 0
    skipped = 0
    failed = 0

    for i, ep in enumerate(episodes_with_yt):
        slug = ep["slug"]
        yt_id = ep["youtubeId"]
        output_file = OUTPUT_DIR / f"{slug}.json"

        # Skip if already fetched
        if output_file.exists():
            print(f"[{i+1}/{len(episodes_with_yt)}] SKIP {slug} (already exists)")
            skipped += 1
            continue

        print(f"[{i+1}/{len(episodes_with_yt)}] Fetching: {slug} ({yt_id})")

        # Get caption URL
        caption_url = get_caption_url(yt_id)
        if not caption_url:
            print(f"  No captions found, skipping")
            failed += 1
            time.sleep(DELAY_BETWEEN_REQUESTS)
            continue

        time.sleep(1)  # Small delay between page fetch and caption fetch

        # Get transcript
        transcript = fetch_transcript(caption_url)
        if not transcript:
            print(f"  Failed to fetch transcript")
            failed += 1
            time.sleep(DELAY_BETWEEN_REQUESTS)
            continue

        # Build output
        data = {
            "slug": slug,
            "numero": ep.get("numero", 0),
            "titulo": clean_title(ep.get("titulo", "")),
            "youtubeId": yt_id,
            "youtubeUrl": f"https://www.youtube.com/watch?v={yt_id}",
            "categoria": ep.get("categoria", ""),
            "invitado": ep.get("invitado", None),
            "duracion": ep.get("duracion", ""),
            "transcripcion": transcript,
        }

        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        chars = len(transcript)
        print(f"  OK ({chars:,} chars)")
        success += 1

        # Rate limit
        time.sleep(DELAY_BETWEEN_REQUESTS)

    print()
    print(f"Done! Success: {success}, Skipped: {skipped}, Failed: {failed}")


if __name__ == "__main__":
    main()
