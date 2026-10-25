# -*- coding: utf-8 -*-
"""
Máy chủ Logos MultiVerse (Cổng 8089) tích hợp cổng truy xuất trực tiếp
Treasury of Scripture Knowledge từ https://biblehub.com/tsk/
cùng bộ chuyển ngữ song hành sang Tiếng Việt (Bản Truyền Thống 1925 - BTT).
"""

import html as html_lib
import http.server
import json
import os
import re
import socketserver
import sys
import urllib.parse
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT_DIR / "data" / "tsk_live_cache"
TSK_DIR = ROOT_DIR / "data" / "tsk"
BIBLES_DIR = ROOT_DIR / "data" / "bibles"
BOOKS_META_FILE = ROOT_DIR / "data" / "books-metadata.json"

USFM_TO_SLUG = {
    "GEN": "genesis", "EXO": "exodus", "LEV": "leviticus", "NUM": "numbers", "DEU": "deuteronomy",
    "JOS": "joshua", "JDG": "judges", "RUT": "ruth", "1SA": "1_samuel", "2SA": "2_samuel",
    "1KI": "1_kings", "2KI": "2_kings", "1CH": "1_chronicles", "2CH": "2_chronicles", "EZR": "ezra",
    "NEH": "nehemiah", "EST": "esther", "JOB": "job", "PSA": "psalms", "PRO": "proverbs",
    "ECC": "ecclesiastes", "SNG": "songs", "ISA": "isaiah", "JER": "jeremiah", "LAM": "lamentations",
    "EZK": "ezekiel", "DAN": "daniel", "HOS": "hosea", "JOL": "joel", "AMO": "amos",
    "OBA": "obadiah", "JON": "jonah", "MIC": "micah", "NAH": "nahum", "HAB": "habakkuk",
    "ZEP": "zephaniah", "HAG": "haggai", "ZEC": "zechariah", "MAL": "malachi",
    "MAT": "matthew", "MRK": "mark", "LUK": "luke", "JHN": "john", "ACT": "acts",
    "ROM": "romans", "1CO": "1_corinthians", "2CO": "2_corinthians", "GAL": "galatians", "EPH": "ephesians",
    "PHP": "philippians", "COL": "colossians", "1TH": "1_thessalonians", "2TH": "2_thessalonians",
    "1TI": "1_timothy", "2TI": "2_timothy", "TIT": "titus", "PHM": "philemon", "HEB": "hebrews",
    "JAS": "james", "1PE": "1_peter", "2PE": "2_peter", "1JN": "1_john", "2JN": "2_john",
    "3JN": "3_john", "JUD": "jude", "REV": "revelation"
}

SLUG_TO_USFM = {v: k for k, v in USFM_TO_SLUG.items()}
SLUG_TO_USFM["psalm"] = "PSA"
SLUG_TO_USFM["song_of_solomon"] = "SNG"


def strip_tags(s: str) -> str:
    return html_lib.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def parse_biblehub_tsk_html(raw_html: str, book_id: str, chapter: int, verse: int) -> dict:
    """
    Bóc tách toàn bộ dữ liệu trên trang https://biblehub.com/tsk/{slug}/{chapter}-{verse}.htm:
    1. top_verse_en (#topver)
    2. groups (#leftbox: .hdg và .tskverse)
    3. outline (#centbox: Chapter Outline)
    4. jump_prev & jump_next (#centbox: Jump to Previous / Next)
    5. parallel_en (#combox: Parallel Verses)
    """
    topver_m = re.search(r'<div id="topver">(.*?)</div>', raw_html, flags=re.S | re.I)
    top_verse_en = strip_tags(topver_m.group(1)) if topver_m else ""
    top_verse_en = re.sub(r"^(?:[1-3]?\s*[A-Za-z]+\s+\d+:\d+\s*[-–]?\s*|\d+\s+)", "", top_verse_en).strip()

    # 1. Parse #leftbox (Treasury of Scripture Knowledge)
    groups = []
    left_m = re.search(r'<div id="leftbox">(.*?)</div>\s*</div>\s*<div id="centbox">', raw_html, flags=re.S | re.I)
    if not left_m:
        left_m = re.search(r'<div id="leftbox">(.*?)<div id="centbox">', raw_html, flags=re.S | re.I)
    left_html = left_m.group(1) if left_m else raw_html

    tokens = re.findall(
        r'(<p class="hdg">.*?</p>|<p class="tskverse">.*?</p>)',
        left_html,
        flags=re.S | re.I,
    )
    current_group = None
    for tok in tokens:
        if 'class="hdg"' in tok:
            hdg_text = strip_tags(tok).rstrip(".")
            current_group = {"h_en": hdg_text, "refs": []}
            groups.append(current_group)
        elif 'class="tskverse"' in tok:
            if current_group is None:
                current_group = {"h_en": "Cross References", "refs": []}
                groups.append(current_group)
            a_m = re.search(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>\s*(?:<br\s*/?>)?\s*(.*)</p>', tok, flags=re.S | re.I)
            if a_m:
                href, ref_en, quote_html = a_m.group(1), strip_tags(a_m.group(2)), a_m.group(3)
                quote_en = strip_tags(quote_html)
                href_m = re.search(r"/([a-z0-9_]+)/(\d+)-(\d+)\.htm", href, flags=re.I)
                ref_bid = SLUG_TO_USFM.get(href_m.group(1).lower(), book_id) if href_m else book_id
                ref_ch = int(href_m.group(2)) if href_m else 1
                ref_v = int(href_m.group(3)) if href_m else 1
                current_group["refs"].append({
                    "b": ref_bid,
                    "c": ref_ch,
                    "v": ref_v,
                    "r_en": ref_en,
                    "t_en": quote_en,
                })

    # 2. Parse #centbox (Chapter Outline & Jump Links)
    outline = []
    jump_prev = []
    jump_next = []
    cent_m = re.search(r'<div id="centbox">(.*?)<div id="combox">', raw_html, flags=re.S | re.I)
    if cent_m:
        cent_html = cent_m.group(1)
        for om in re.finditer(
            r'<span class="reftext">\s*(\d+)\.\s*</span>\s*<span class="outlinetext">\s*<a href="([^"]+)">(.*?)</a>\s*</span>',
            cent_html,
            flags=re.S | re.I,
        ):
            v_num = int(om.group(1))
            outline.append({"verse": v_num, "text_en": strip_tags(om.group(3))})

        prev_m = re.search(r'Jump to Previous</div>(.*?)(?:<div class="vheading2">|$)', cent_html, flags=re.S | re.I)
        if prev_m:
            for jm in re.finditer(r'<a href="/([a-z0-9_]+)/(\d+)-(\d+)\.htm">(.*?)</a>', prev_m.group(1), flags=re.I):
                b_slug, ch_s, v_s, kw = jm.group(1), jm.group(2), jm.group(3), strip_tags(jm.group(4))
                jump_prev.append({
                    "b": SLUG_TO_USFM.get(b_slug.lower(), book_id),
                    "c": int(ch_s),
                    "v": int(v_s),
                    "word": kw,
                })

        next_m = re.search(r'Jump to Next</div>(.*?)(?:</div>|$)', cent_html, flags=re.S | re.I)
        if next_m:
            for jm in re.finditer(r'<a href="/([a-z0-9_]+)/(\d+)-(\d+)\.htm">(.*?)</a>', next_m.group(1), flags=re.I):
                b_slug, ch_s, v_s, kw = jm.group(1), jm.group(2), jm.group(3), strip_tags(jm.group(4))
                jump_next.append({
                    "b": SLUG_TO_USFM.get(b_slug.lower(), book_id),
                    "c": int(ch_s),
                    "v": int(v_s),
                    "word": kw,
                })

    # 3. Parse #combox (Parallel Verses on BibleHub)
    parallel_en = []
    com_m = re.search(r'<div id="combox">(.*?)<div class="vheading2">Links</div>', raw_html, flags=re.S | re.I)
    if com_m:
        com_html = com_m.group(1)
        for pm in re.finditer(
            r'<span class="versiontext">\s*<a[^>]*>(.*?)</a>\s*(?:<br\s*/?>)?\s*</span>\s*(?:<br\s*/?>)?\s*(.*?)(?=<span|<p|<div|$)',
            com_html,
            flags=re.S | re.I,
        ):
            v_name = strip_tags(pm.group(1))
            v_text = strip_tags(pm.group(2))
            if v_name and v_text:
                parallel_en.append({"version": v_name, "text": v_text})

    return {
        "book_id": book_id,
        "chapter": chapter,
        "verse": verse,
        "url": f"https://biblehub.com/tsk/{USFM_TO_SLUG.get(book_id, 'john')}/{chapter}-{verse}.htm",
        "top_verse_en": top_verse_en,
        "groups_live": groups,
        "outline": outline,
        "jump_prev": jump_prev,
        "jump_next": jump_next,
        "parallel_en": parallel_en,
    }


class KinhthanhRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        # Xóa header If-Modified-Since / If-None-Match để trình duyệt luôn nhận bản mới nhất 200 OK (không bao giờ bị 304 cache cũ)
        if "If-Modified-Since" in self.headers:
            del self.headers["If-Modified-Since"]
        if "If-None-Match" in self.headers:
            del self.headers["If-None-Match"]
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/biblehub-tsk":
            self.handle_biblehub_tsk(parsed.query)
            return
        super().do_GET()

    def handle_biblehub_tsk(self, query_str: str):
        params = urllib.parse.parse_qs(query_str)
        book_id = (params.get("book", ["JHN"])[0] or "JHN").upper()
        chapter = int(params.get("chapter", ["1"])[0] or 1)
        verse = int(params.get("verse", ["1"])[0] or 1)

        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        cache_file = CACHE_DIR / f"{book_id}_{chapter}_{verse}.json"

        if cache_file.exists():
            payload = cache_file.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)
            return

        slug = USFM_TO_SLUG.get(book_id, "john")
        url = f"https://biblehub.com/tsk/{slug}/{chapter}-{verse}.htm"
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},
            )
            raw_html = urllib.request.urlopen(req, timeout=12).read().decode("utf-8", errors="ignore")
            data = parse_biblehub_tsk_html(raw_html, book_id, chapter, verse)
            payload_str = json.dumps(data, ensure_ascii=False)
            cache_file.write_text(payload_str, encoding="utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload_str.encode("utf-8"))
        except Exception as e:
            err_payload = json.dumps({"error": str(e), "book_id": book_id, "chapter": chapter, "verse": verse})
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(err_payload.encode("utf-8"))


def run_server(port: int = 8089):
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("0.0.0.0", port), KinhthanhRequestHandler) as httpd:
        print(f"Serving Logos MultiVerse + BibleHub TSK Proxy on http://0.0.0.0:{port}")
        httpd.serve_forever()


if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else 8089
    run_server(p)
