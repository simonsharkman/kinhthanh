#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate TKLK Audio Narration with OmniVoice sample_alden profile,
Chunked Synthesis Immunity, and Timeline Date Normalization.
Ensures timeline dates like '(639-608 T.C)' are pronounced:
'năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước Chúa'
and '50 S.C' as:
'năm năm mươi sau Chúa'.
"""

import os
import sys
import re
import json
import time
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
EDGE_TTS_EXE = OMNIVOICE_ROOT / ".venv" / "Scripts" / "edge-tts.exe"

TKLK_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

ALDEN_DSP_FILTER = (
    "highpass=f=70,"
    "equalizer=f=150:width_type=o:w=1.2:g=4.2,"
    "equalizer=f=450:width_type=o:w=1.0:g=-3.0,"
    "equalizer=f=3200:width_type=o:w=1.5:g=2.4,"
    "equalizer=f=8000:width_type=o:w=1.0:g=1.0,"
    "compand=attacks=0.02:decays=0.22:points=-80/-80|-35/-22|-18/-12|0/-7:gain=2.2,"
    "aecho=0.8:0.35:20:0.08,"
    "loudnorm=I=-16:TP=-1.5:LRA=10"
)


def vn_number_to_words(n):
    if not isinstance(n, int):
        try:
            n = int(n)
        except Exception:
            return str(n)
    if n == 0:
        return 'không'
    if n < 0:
        return 'âm ' + vn_number_to_words(-n)

    digits = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']

    def read_three_digits(num, has_higher=False):
        h = num // 100
        rem = num % 100
        t = rem // 10
        u = rem % 10
        parts = []

        if h > 0:
            parts.append(digits[h] + ' trăm')
            if t == 0 and u > 0:
                parts.append('lẻ')
        elif has_higher and rem > 0:
            parts.append('không trăm')
            if t == 0 and u > 0:
                parts.append('lẻ')

        if t > 0:
            if t == 1:
                parts.append('mười')
            else:
                parts.append(digits[t] + ' mươi')

        if u > 0:
            if t > 0 and u == 1 and t != 1:
                parts.append('mốt')
            elif t > 0 and u == 5:
                parts.append('lăm')
            else:
                parts.append(digits[u])

        return ' '.join(parts)

    thousands = ['', 'nghìn', 'triệu', 'tỷ']
    groups = []
    temp = n
    while temp > 0:
        groups.append(temp % 1000)
        temp //= 1000

    parts = []
    for i in range(len(groups) - 1, -1, -1):
        g = groups[i]
        if g > 0:
            has_higher = (i < len(groups) - 1)
            txt = read_three_digits(g, has_higher)
            unit = thousands[i]
            if unit:
                parts.append(txt + ' ' + unit)
            else:
                parts.append(txt)

    return ' '.join(parts).strip()


def normalize_timeline_and_scripture(text: str) -> str:
    if not text:
        return ""

    # Normalize archaic Vietnamese D-stroke (U+00D0 ETH -> U+0110 D-STROKE)
    text = text.replace('\u00d0', '\u0110').replace('\u00f0', '\u0111')
    text = re.sub(r'D[\u0335\u0336]', 'Đ', text)
    text = re.sub(r'd[\u0335\u0336]', 'đ', text)
    text = re.sub(r'[\u0189\u018a]', 'Đ', text)
    text = re.sub(r'[\u0256\u0257]', 'đ', text)

    # Standalone Đ. / đ. abbreviations -> đoạn / điểm
    text = re.sub(r'(^|\s|[(\[{<,;])(?:Đ\.|đ\.)\s*(\d+)', r'\1đoạn \2', text, flags=re.I)
    text = re.sub(r'(^|\s)đ\.\s*(?=[A-ZÀ-Ỹa-zà-ỹ])', r'\1điểm ', text)
    text = re.sub(r'(^|\s)(mục|phần|điểm|câu)\s+[Đđ](?=$|\s|[.,;:!?-])', r'\1\2 đê', text, flags=re.I)
    text = re.sub(r'(^|\s)\([Đđ]\)(?=$|\s|[.,;:!?-])', r'\1(đê)', text)

    def n2w(num):
        try:
            return vn_number_to_words(int(num))
        except Exception:
            return str(num)

    def expand_year_range(s_str, e_str):
        s = int(s_str)
        e = int(e_str)
        if len(e_str) <= 2 and len(s_str) == 4:
            century = s // 100
            e = century * 100 + e
        return n2w(s), n2w(e)

    # 0. Foreign Names & Authors
    foreign_dict = [
        (r'\bHalley(?:\'s)?\s+Bible\s+Handbook\b', 'Thánh Kinh Lược Khảo Ha-li'),
        (r'\bBible\s+Handbook\b', 'Cẩm Nang Thánh Kinh'),
        (r'\bDr\.?\s+Henry\s+H\.?\s+Halley\b', 'Tiến sĩ Hen-ri H. Ha-li'),
        (r'\bDr\.?\s+Henry\b', 'Tiến sĩ Hen-ri'),
        (r'(^|\s)Dr\.(?=\s+[A-ZÀ-Ỹ])', r'\1Tiến sĩ'),
        (r'\bHenry\s+H\.?\s+Halley\b', 'Hen-ri H. Ha-li'),
        (r'\bHenry\s+Halley\b', 'Hen-ri Ha-li'),
        (r'\bHenry\b', 'Hen-ri'),
        (r'\bHalley\b', 'Ha-li'),
        (r'(?:Chúa\s+)?\bJesus\s+Christ\b', 'Chúa Giê-xu Cơ-rít'),
        (r'(?:Chúa\s+)?\bJesus\b', 'Chúa Giê-xu'),
        (r'\bChrist\b', 'Cơ-rít'),
        (r'\bB\.C\.|\bBC\b', 'trước Chúa'),
        (r'\bA\.D\.|\bAD\b', 'sau Chúa'),
    ]
    for pat, rep in foreign_dict:
        text = re.sub(pat, rep, text, flags=re.I)

    # 1. Timeline Date Ranges with T.C: e.g. (639-608 T.C), (606-586 T.C.), 639-608 T.C., 1400-1100 T.C.
    pat_range_tc = re.compile(
        r'\(?(?:khoảng\s+)?(?:năm\s+)?(\d{1,4})\s*[\-–]\s*(\d{1,4})\s*(?:năm\s+)?(?:T\.C\.?|T\.\s*C\.|TC)\.?\)?',
        re.I
    )
    def repl_range_tc(m):
        prefix = 'khoảng ' if 'khoảng' in m.group(0).lower() else ''
        w1, w2 = expand_year_range(m.group(1), m.group(2))
        punct = '.' if (m.group(0).endswith('.') and not m.group(0).startswith('(')) else ''
        return f"{prefix}năm {w1} đến {w2} trước Chúa{punct}"

    text = pat_range_tc.sub(repl_range_tc, text)

    # 2. Timeline Date Ranges with S.C: e.g. (100-167 S.C), (100-167 S.C.), 12-37 S.C.
    pat_range_sc = re.compile(
        r'\(?(?:khoảng\s+)?(?:năm\s+)?(\d{1,4})\s*[\-–]\s*(\d{1,4})\s*(?:năm\s+)?(?:S\.C\.?|S\.\s*C\.|SC)\.?\)?',
        re.I
    )
    def repl_range_sc(m):
        prefix = 'khoảng ' if 'khoảng' in m.group(0).lower() else ''
        w1, w2 = expand_year_range(m.group(1), m.group(2))
        punct = '.' if (m.group(0).endswith('.') and not m.group(0).startswith('(')) else ''
        return f"{prefix}năm {w1} đến {w2} sau Chúa{punct}"

    text = pat_range_sc.sub(repl_range_sc, text)

    # 3. Durations: 1100 năm T.C, 1000 năm T.C
    text = re.sub(r'\(?\b(\d{1,4})\s+năm\s+(?:T\.C\.?|T\.\s*C\.|TC)\.?\)?', lambda m: f"{n2w(m.group(1))} năm trước Chúa", text, flags=re.I)
    text = re.sub(r'\(?\b(\d{1,4})\s+năm\s+(?:S\.C\.?|S\.\s*C\.|SC)\.?\)?', lambda m: f"{n2w(m.group(1))} năm sau Chúa", text, flags=re.I)

    # 4. Single year with T.C: e.g. (886 T.C), (536 T.C.), 600 T.C., khoảng 586 T.C.
    pat_single_tc = re.compile(
        r'\(?(?:khoảng\s+)?(?:năm\s+)?(\d{1,4})\s*(?:T\.C\.?|T\.\s*C\.|TC)\.?\)?',
        re.I
    )
    def repl_single_tc(m):
        prefix = 'khoảng ' if 'khoảng' in m.group(0).lower() else ''
        punct = '.' if (m.group(0).endswith('.') and not m.group(0).startswith('(')) else ''
        return f"{prefix}năm {n2w(m.group(1))} trước Chúa{punct}"

    text = pat_single_tc.sub(repl_single_tc, text)

    # 5. Single year with S.C: e.g. 50 S.C, (50 S.C), (50 S.C.), 1236 S.C, năm 732 S.C.
    pat_single_sc = re.compile(
        r'\(?(?:khoảng\s+)?(?:năm\s+)?(\d{1,4})\s*(?:S\.C\.?|S\.\s*C\.|SC)\.?\)?',
        re.I
    )
    def repl_single_sc(m):
        prefix = 'khoảng ' if 'khoảng' in m.group(0).lower() else ''
        punct = '.' if (m.group(0).endswith('.') and not m.group(0).startswith('(')) else ''
        return f"{prefix}năm {n2w(m.group(1))} sau Chúa{punct}"

    text = pat_single_sc.sub(repl_single_sc, text)

    # 6. Standalone T.C. and S.C. abbreviations
    text = re.sub(r'\b(?:T\.C\.?|T\.\s*C\.)(?=$|\s|[.,;:!?\)])', 'trước Chúa', text)
    text = re.sub(r'\b(?:S\.C\.?|S\.\s*C\.)(?=$|\s|[.,;:!?\)])', 'sau Chúa', text)

    # 7. Century: TK 1, TK I, thế kỷ II, thế kỷ XX
    roman_map = {
        'I': 'thứ nhất', '1': 'thứ nhất',
        'II': 'thứ hai', '2': 'thứ hai',
        'III': 'thứ ba', '3': 'thứ ba',
        'IV': 'thứ tư', '4': 'thứ tư',
        'V': 'thứ năm', '5': 'thứ năm',
        'VI': 'thứ sáu', '6': 'thứ sáu',
        'VII': 'thứ bảy', '7': 'thứ bảy',
        'VIII': 'thứ tám', '8': 'thứ tám',
        'IX': 'thứ chín', '9': 'thứ chín',
        'X': 'thứ mười', '10': 'thứ mười',
        'XI': 'thứ mười một', '11': 'thứ mười một',
        'XII': 'thứ mười hai', '12': 'thứ mười hai',
        'XIII': 'thứ mười ba', '13': 'thứ mười ba',
        'XIV': 'thứ mười bốn', '14': 'thứ mười bốn',
        'XV': 'thứ mười lăm', '15': 'thứ mười lăm',
        'XVI': 'thứ mười sáu', '16': 'thứ mười sáu',
        'XVII': 'thứ mười bảy', '17': 'thứ mười bảy',
        'XVIII': 'thứ mười tám', '18': 'thứ mười tám',
        'XIX': 'thứ mười chín', '19': 'thứ mười chín',
        'XX': 'hai mươi', '20': 'hai mươi',
        'XXI': 'hai mươi mốt', '21': 'hai mươi mốt'
    }
    text = re.sub(
        r'\b(?:TK|thế\s+kỷ)\s*([IVXLCDM]+|\d+)\b',
        lambda m: f"thế kỷ {roman_map.get(m.group(1).upper(), 'thứ ' + m.group(1))}",
        text,
        flags=re.I
    )

    # 7.5. Standard Vietnamese thousands separator numbers: e.g. 50.000, 100.000, 1.200.000
    text = re.sub(
        r'\b(\d{1,3}(?:\.\d{3})+)\b',
        lambda m: vn_number_to_words(int(m.group(1).replace('.', ''))),
        text
    )

    # 8. Scripture coordinates: Mác 3:13 -> Mác đoạn 3 câu 13
    text = re.sub(
        r'(^|\s|[(\[{<,;])(?:(đoạn|chương)\s+)?(\d+):(\d+)\s*[\-–]\s*(\d+)',
        lambda m: f"{m.group(1)}{m.group(2) or 'đoạn'} {m.group(3)} câu {m.group(4)} đến {m.group(5)}",
        text,
        flags=re.I
    )
    text = re.sub(
        r'(^|\s|[(\[{<,;])(?:(đoạn|chương)\s+)?(\d+):(\d+)([a-d])?',
        lambda m: f"{m.group(1)}{m.group(2) or 'đoạn'} {m.group(3)} câu {m.group(4)}{' phần ' + m.group(5) if m.group(5) else ''}",
        text,
        flags=re.I
    )

    # 9. câu X-Y -> câu X đến Y
    text = re.sub(r'(^|\s)(câu\s+\d+)\s*[\-–]\s*(\d+)(?=$|\s|[.,;:!?-])', r'\1\2 đến \3', text, flags=re.I)
    text = re.sub(r'(^|\s)((?:đoạn|chương)\s+\d+)\s*[\-–]\s*(\d+)(?=$|\s|[.,;:!?-])', r'\1\2 đến \3', text, flags=re.I)

    # 10. Clean up double punctuation resulting from normalization
    text = re.sub(r'\.\s*([,;:!?])', r'\1', text)
    text = re.sub(r'\.{2,}', '.', text)

    # 11. Clean up multiple spaces
    return re.sub(r'\s+', ' ', text).strip()


def clean_html_to_text(html_content: str) -> str:
    clean = html.unescape(html_content)
    # Replace block end tags with period so headings/paragraphs are naturally separated
    clean = re.sub(r'</?(?:p|div|h[1-6]|li|br\s*/?)[^>]*>', '. ', clean, flags=re.I)
    clean = re.sub(r'<[^>]+>', ' ', clean)
    clean = clean.replace('\u00d0', '\u0110').replace('\u00f0', '\u0111')
    clean = clean.replace('\u00a0', ' ').replace('&nbsp;', ' ').replace('\u200b', '')
    clean = re.sub(r'Courtesy of.*', '', clean, flags=re.I)
    # Normalize broken hyphen words from OCR/scanning: Nê- hê-mi -> Nê-hê-mi, E- xơ-ra -> E-xơ-ra
    clean = re.sub(r'(\w+)\s*-\s+(\w+)', r'\1-\2', clean)
    clean = re.sub(r'(^|\s)-\s*(\w+)', r'\1\2', clean)
    clean = normalize_timeline_and_scripture(clean)
    # Normalize periods and spaces
    clean = re.sub(r'\s*\.\s*', '. ', clean)
    clean = re.sub(r'\.{2,}', '.', clean)
    clean = re.sub(r'^\s*\.\s*', '', clean)
    return re.sub(r'\s+', ' ', clean).strip()


def split_text_into_chunks(text, max_chars=750):
    sentences = re.split(r'(?<=[.!?\n])\s+', text)
    chunks = []
    current_chunk = []
    current_len = 0
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if current_len + len(s) + 1 > max_chars and current_chunk:
            chunks.append(' '.join(current_chunk))
            current_chunk = [s]
            current_len = len(s)
        else:
            current_chunk.append(s)
            current_len += len(s) + 1
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    return chunks


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

    full_text = f"Thánh Kinh Lược Khảo. Chương {chapter_id}: {title}. {plain_text}"
    full_text = re.sub(r'(\s*\.\s*)+', '. ', full_text)
    full_text = re.sub(r'^\s*\.\s*', '', full_text)
    full_text = re.sub(r'\s+', ' ', full_text).strip()

    chunks = split_text_into_chunks(full_text, max_chars=750)

    scratch_dir = ROOT_DIR / "scratch" / f"ch_{chapter_id}_chunks"
    scratch_dir.mkdir(parents=True, exist_ok=True)

    print(f"[*] Generating Chapter {chapter_id}: '{title}' ({len(plain_text.split())} words, {len(chunks)} chunks)...")

    # Attempt OmniVoice Cinema Engine with sample_alden profile
    has_omnivoice = False
    try:
        sys.path.insert(0, str(OMNIVOICE_ROOT))
        from generate_voice import VOICE_PROFILES, synthesize_edge_speech, inject_breaths_and_master
        import asyncio
        cfg = VOICE_PROFILES.get("sample_alden", VOICE_PROFILES.get("alden"))
        has_omnivoice = True
    except Exception as e:
        print(f"[WARN] OmniVoice import failed ({e}), falling back to standard Edge-TTS")
        cfg = None

    chunk_files = []
    for idx, chunk_text in enumerate(chunks):
        chunk_out = scratch_dir / f"chunk_{idx:03d}.{'wav' if has_omnivoice else 'mp3'}"
        temp_raw = scratch_dir / f"temp_{idx:03d}.mp3"
        chunk_txt = scratch_dir / f"chunk_{idx:03d}.txt"

        if chunk_txt.exists() and chunk_out.exists() and chunk_out.stat().st_size > 10000:
            if chunk_txt.read_text(encoding="utf-8").strip() == chunk_text.strip():
                print(f"  [+] Chunk {idx + 1}/{len(chunks)} cached OK ({chunk_out.stat().st_size / 1024:.1f} KB)")
                chunk_files.append(chunk_out)
                continue

        chunk_txt.write_text(chunk_text, encoding="utf-8")

        success = False
        if has_omnivoice:
            try:
                asyncio.run(synthesize_edge_speech(chunk_text, cfg, str(temp_raw)))
                inject_breaths_and_master(
                    raw_audio_path=str(temp_raw),
                    final_out_path=str(chunk_out),
                    voice_cfg=cfg,
                    has_sigh=False,
                    add_opening_breath=(idx == 0)
                )
                if chunk_out.exists() and chunk_out.stat().st_size > 10000:
                    success = True
                    time.sleep(2.0)
            except Exception as e:
                print(f"[RETRY] OmniVoice chunk {idx + 1} error: {e}")

        if not success:
            for attempt in range(1, 4):
                time.sleep(1.0)
                try:
                    import edge_tts
                    import asyncio
                    comm = edge_tts.Communicate(chunk_text, "vi-VN-NamMinhNeural", rate="-4%", pitch="-1Hz")
                    asyncio.run(comm.save(str(temp_raw)))
                    if temp_raw.exists() and temp_raw.stat().st_size > 1000:
                        cmd_dsp = [
                            "ffmpeg", "-y",
                            "-i", str(temp_raw),
                            "-af", ALDEN_DSP_FILTER,
                            "-b:a", "192k",
                            str(chunk_out)
                        ]
                        subprocess.run(cmd_dsp, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        if chunk_out.exists() and chunk_out.stat().st_size > 10000:
                            success = True
                            break
                except Exception:
                    pass

                print(f"[RETRY] Chunk {idx + 1}/{len(chunks)} attempt {attempt} failed, waiting...")
                time.sleep(2.5 * attempt)

        if success:
            chunk_files.append(chunk_out)
            print(f"  [+] Chunk {idx + 1}/{len(chunks)} OK ({chunk_out.stat().st_size / 1024:.1f} KB)")
        else:
            print(f"[FAIL] Synthesis failed on chunk {idx + 1} of chapter {chapter_id}")
            return False

    # Concat chunks
    concat_list = scratch_dir / "concat.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for cf in chunk_files:
            f.write(f"file '{cf.as_posix()}'\n")

    target_mp3 = TKLK_AUDIO_DIR / f"{chapter_id}.mp3"
    temp_target = target_mp3.with_suffix(".tmp.mp3")

    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_list),
        "-b:a", "192k",
        str(temp_target)
    ]
    subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if temp_target.exists() and temp_target.stat().st_size > 50000:
        temp_target.replace(target_mp3)
        size_mb = target_mp3.stat().st_size / (1024 * 1024)
        print(f"\n[SUCCESS] Chapter {chapter_id} audio ready: {target_mp3.name} ({size_mb:.2f} MB)")
        return True

    print(f"[FAIL] Concat failed for chapter {chapter_id}")
    return False


def main():
    chapters = [39]
    if len(sys.argv) > 1:
        chapters = [int(x) for x in sys.argv[1:]]

    for cid in chapters:
        generate_chapter_audio(cid)


if __name__ == "__main__":
    main()
