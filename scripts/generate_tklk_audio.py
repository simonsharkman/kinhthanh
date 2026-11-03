#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate TKLK Audio Narration with OmniVoice sample_alden profile.
Extracts clean text from data/tklk/chapters/{id}.json,
synthesizes voiceover with OmniVoice (sample_alden),
and compresses to MP3 (128kbps) for fast web streaming.
"""

import os
import sys
import re
import json
import html
import subprocess
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
TKLK_CH_DIR = ROOT_DIR / "data" / "tklk" / "chapters"
TKLK_AUDIO_DIR = ROOT_DIR / "data" / "tklk" / "audio"
OMNIVOICE_ROOT = Path(r"E:\Omnivoice")
OMNIVOICE_PYTHON = OMNIVOICE_ROOT / ".venv" / "Scripts" / "python.exe"
OMNIVOICE_GEN = OMNIVOICE_ROOT / "generate_voice.py"

TKLK_AUDIO_DIR.mkdir(parents=True, exist_ok=True)


def clean_html_to_text(html_content: str) -> str:
    clean = html.unescape(html_content)
    clean = re.sub(r'<[^>]+>', ' ', clean)
    clean = clean.replace('\u00a0', ' ').replace('&nbsp;', ' ')
    clean = re.sub(r'Courtesy of.*', '', clean, flags=re.I)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean


def generate_chapter_audio(chapter_id: int):
    json_path = TKLK_CH_DIR / f"{chapter_id}.json"
    if not json_path.exists():
        print(f"[ERROR] Chapter file not found: {json_path}")
        return False

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    title = data.get("title", f"Chương {chapter_id}")
    content_html = data.get("content_html", "")
    plain_text = clean_html_to_text(content_html)

    # Prefix with chapter title for immersive reading
    full_text = f"Thánh Kinh Lược Khảo. Chương {chapter_id}: {title}. {plain_text}"

    temp_txt = ROOT_DIR / "scratch" / f"tklk_ch_{chapter_id}.txt"
    temp_txt.parent.mkdir(parents=True, exist_ok=True)
    with open(temp_txt, "w", encoding="utf-8") as f:
        f.write(full_text)

    temp_wav = TKLK_AUDIO_DIR / f"{chapter_id}.wav"
    target_mp3 = TKLK_AUDIO_DIR / f"{chapter_id}.mp3"

    print(f"[*] Generating Chapter {chapter_id}: '{title}' ({len(plain_text.split())} words)...")

    cmd = [
        str(OMNIVOICE_PYTHON),
        str(OMNIVOICE_GEN),
        "--text", str(temp_txt),
        "--voice", "sample_alden",
        "--out", str(temp_wav)
    ]

    res = subprocess.run(cmd, cwd=str(OMNIVOICE_ROOT))
    if res.returncode != 0 or not temp_wav.exists():
        print(f"[FAIL] Synthesis failed for chapter {chapter_id}")
        return False

    # Convert to MP3
    print(f"[*] Compressing {temp_wav.name} -> {target_mp3.name}...")
    conv_cmd = [
        "ffmpeg", "-y", "-i", str(temp_wav),
        "-b:a", "128k",
        str(target_mp3)
    ]
    subprocess.run(conv_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if temp_wav.exists():
        try:
            temp_wav.unlink()
        except Exception:
            pass

    if target_mp3.exists():
        size_kb = target_mp3.stat().st_size / 1024
        print(f"[SUCCESS] Chapter {chapter_id} audio ready: {target_mp3.name} ({size_kb:.1f} KB)")
        return True
    return False


def main():
    chapters = [1, 2, 3]
    if len(sys.argv) > 1:
        chapters = [int(x) for x in sys.argv[1:]]

    for cid in chapters:
        generate_chapter_audio(cid)


if __name__ == "__main__":
    main()
