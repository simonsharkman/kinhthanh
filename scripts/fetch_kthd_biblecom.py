#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fetch authentic Kinh Thánh Hiện Đại (KTHD - Version 1638)
from https://www.bible.com/vi/versions/1638-kthd-kinh-thánh-hiện-Đại
(https://www.bible.com/vi/bible/1638/{BOOK_ID}.{CHAPTER}.KTHD)
and update Logos Bible Multiverse (data/kthd/, data/bibles/, data/default-bible-passages.json).
"""

import os
import sys
import json
import re
import html
import time
import gzip
import argparse
import urllib.request
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
KTHD_DIR = os.path.join(DATA_DIR, 'kthd')
BIBLES_DIR = os.path.join(DATA_DIR, 'bibles')
METADATA_FILE = os.path.join(DATA_DIR, 'books-metadata.json')
DEFAULT_PASSAGES_FILE = os.path.join(DATA_DIR, 'default-bible-passages.json')

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
BIBLE_COM_VERSION_ID = 1638
BIBLE_COM_VERSION_CODE = 'KTHD'


def get_bible_com_url(book_id: str, chapter: int) -> str:
    """Generate exact Bible.com URL for KTHD (version 1638) chapter."""
    usfm_id = 'NAM' if book_id == 'NAH' else book_id
    return f"https://www.bible.com/vi/bible/{BIBLE_COM_VERSION_ID}/{usfm_id}.{chapter}.{BIBLE_COM_VERSION_CODE}"


class YouVersionKTHDParser(HTMLParser):
    """Parse Bible.com SSR HTML and extract clean verse text excluding footnotes and verse labels."""

    def __init__(self, book_id: str, chapter: int):
        super().__init__()
        usfm_id = 'NAM' if book_id == 'NAH' else book_id
        self.target_prefix = f"{usfm_id}.{chapter}."
        self.current_usfm = None
        self.verse_depth = 0
        self.in_content = False
        self.content_depth = 0
        self.in_note_or_label = False
        self.note_depth = 0
        self.verses = {}

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        cls = attr_dict.get('class', '') or ''
        usfm = attr_dict.get('data-usfm', '') or ''

        if usfm.startswith(self.target_prefix):
            tail = usfm[len(self.target_prefix):]
            if tail.isdigit():
                self.current_usfm = usfm
                self.verse_depth = 1
                return

        if self.current_usfm:
            self.verse_depth += 1
            if self.in_note_or_label:
                self.note_depth += 1
            elif '_note' in cls or '_label' in cls or cls in ('ft', 'fr', 'f', 'x', 'rq'):
                self.in_note_or_label = True
                self.note_depth = 1
            elif '_content' in cls:
                if not self.in_content:
                    self.in_content = True
                    self.content_depth = 1
                else:
                    self.content_depth += 1

    def handle_endtag(self, tag):
        if self.current_usfm:
            if self.in_note_or_label:
                self.note_depth -= 1
                if self.note_depth <= 0:
                    self.in_note_or_label = False
            elif self.in_content:
                self.content_depth -= 1
                if self.content_depth <= 0:
                    self.in_content = False
                    v_num = int(self.current_usfm.split('.')[-1])
                    self.verses.setdefault(v_num, []).append(' ')

            self.verse_depth -= 1
            if self.verse_depth <= 0:
                self.current_usfm = None

    def handle_data(self, data):
        if self.current_usfm and self.in_content and not self.in_note_or_label:
            v_num = int(self.current_usfm.split('.')[-1])
            self.verses.setdefault(v_num, []).append(data)


def parse_kthd_html(raw_html: str, book_id: str, chapter: int) -> dict:
    """Extract clean {verse_num: text} dictionary from Bible.com HTML."""
    parser = YouVersionKTHDParser(book_id, chapter)
    parser.feed(raw_html)
    verses = {}
    for v_num, chunks in sorted(parser.verses.items()):
        txt = ''.join(chunks)
        txt = html.unescape(txt)
        txt = txt.replace('\u200b', '').replace('\ufeff', '').replace('\xa0', ' ')
        txt = re.sub(r'\s+', ' ', txt).strip()
        # Clean spacing before punctuation
        txt = re.sub(r'\s+([,.;:?!])', r'\1', txt)
        if txt:
            verses[v_num] = txt
    return verses


def fetch_chapter(book_id: str, chapter: int, retries: int = 3) -> dict:
    """Fetch a single chapter of KTHD (1638) from Bible.com."""
    url = get_bible_com_url(book_id, chapter)
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': USER_AGENT,
            'Accept-Encoding': 'gzip'
        }
    )

    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw_bytes = resp.read()
                if resp.info().get('Content-Encoding') == 'gzip':
                    raw_bytes = gzip.decompress(raw_bytes)
                raw_html = raw_bytes.decode('utf-8', errors='replace')
            verses = parse_kthd_html(raw_html, book_id, chapter)
            if verses:
                return verses
            time.sleep(0.3 * attempt)
        except Exception as e:
            if attempt == retries:
                print(f"  [WARN] Failed to fetch KTHD {book_id} Ch {chapter} ({url}): {e}")
            time.sleep(0.5 * attempt)
    return {}


def load_kthd_book(book_id: str) -> dict:
    """Load existing KTHD JSON file for book if it exists."""
    out_file = os.path.join(KTHD_DIR, f"{book_id}.json")
    if os.path.exists(out_file):
        try:
            with open(out_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "book_id": book_id,
        "source": "https://www.bible.com/vi/versions/1638-kthd-kinh-th%C3%A1nh-hi%E1%BB%87n-%C4%90%E1%BA%A1i",
        "version_id": 1638,
        "translation": "KTHD",
        "translation_name": "Kinh Thánh Hiện Đại",
        "chapters": {}
    }


def save_kthd_book(book_id: str, data: dict):
    """Save KTHD book JSON file."""
    os.makedirs(KTHD_DIR, exist_ok=True)
    out_file = os.path.join(KTHD_DIR, f"{book_id}.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_bibles_data(book_id: str, kthd_chapters: dict) -> int:
    """Update data/bibles/{book_id}.json with authentic KTHD verses."""
    bible_file = os.path.join(BIBLES_DIR, f"{book_id}.json")
    if not os.path.exists(bible_file):
        return 0

    with open(bible_file, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)

    updated_count = 0
    if 'chapters' in bible_data:
        for ch_str, verse_list in bible_data['chapters'].items():
            if ch_str in kthd_chapters:
                kthd_v_map = kthd_chapters[ch_str]
                for v in verse_list:
                    v_num = v.get('verse_num')
                    v_text = kthd_v_map.get(str(v_num)) or kthd_v_map.get(v_num)
                    if v_text:
                        if 'translations' not in v:
                            v['translations'] = {}
                        v['translations']['KTHD'] = v_text
                        updated_count += 1

    with open(bible_file, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, ensure_ascii=False, indent=2)

    return updated_count


def update_default_passages(all_kthd_data: dict):
    """Update default-bible-passages.json with authentic KTHD verses."""
    if not os.path.exists(DEFAULT_PASSAGES_FILE):
        return

    with open(DEFAULT_PASSAGES_FILE, 'r', encoding='utf-8') as f:
        passages = json.load(f)

    updated_total = 0
    for key, passage in passages.items():
        book_id = passage.get('book_id')
        ch_num = str(passage.get('chapter_num'))

        kthd_book = all_kthd_data.get(book_id)
        if not kthd_book:
            kthd_book = load_kthd_book(book_id)

        if kthd_book and ch_num in kthd_book.get('chapters', {}):
            kthd_map = kthd_book['chapters'][ch_num]
            for v in passage.get('verses', []):
                v_num = v.get('verse_num')
                v_text = kthd_map.get(str(v_num)) or kthd_map.get(v_num)
                if v_text:
                    if 'translations' not in v:
                        v['translations'] = {}
                    v['translations']['KTHD'] = v_text
                    updated_total += 1

    with open(DEFAULT_PASSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(passages, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated_total} verses in default-bible-passages.json with authentic KTHD")


def crawl_book(book_id: str, total_chapters: int, max_workers: int = 8) -> dict:
    """Crawl all chapters of a book from Bible.com 1638 KTHD."""
    print(f"Crawling KTHD {book_id} - {total_chapters} chapters...")
    book_data = load_kthd_book(book_id)
    chapters = book_data.get('chapters', {})

    chapters_to_fetch = [c for c in range(1, total_chapters + 1) if str(c) not in chapters]

    if not chapters_to_fetch:
        print(f"  All {total_chapters} chapters of {book_id} already cached.")
        update_bibles_data(book_id, chapters)
        return book_data

    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_ch = {
            executor.submit(fetch_chapter, book_id, ch): ch
            for ch in chapters_to_fetch
        }
        for future in as_completed(future_to_ch):
            ch = future_to_ch[future]
            try:
                verses = future.result()
                if verses:
                    chapters[str(ch)] = {str(k): v for k, v in verses.items()}
            except Exception as e:
                print(f"  Error processing {book_id} Ch {ch}: {e}")

    book_data['chapters'] = chapters
    save_kthd_book(book_id, book_data)

    dt = time.time() - t0
    fetched_verses = sum(len(v) for v in chapters.values())
    print(f"  Finished KTHD {book_id}: {len(chapters)}/{total_chapters} chapters, {fetched_verses} verses ({dt:.1f}s)")

    updated_bibles = update_bibles_data(book_id, chapters)
    if updated_bibles:
        print(f"  Injected {updated_bibles} KTHD verses into data/bibles/{book_id}.json")

    return book_data


def main():
    parser = argparse.ArgumentParser(description="Fetch authentic KTHD (1638) translation from bible.com")
    parser.add_argument('--books', type=str, help="Comma-separated book IDs (e.g. JHN,MAT,GEN,PSA,ROM,REV)")
    parser.add_argument('--all', action='store_true', help="Fetch all 66 books")
    parser.add_argument('--defaults', action='store_true', help="Fetch core books & default passages")
    parser.add_argument('--workers', type=int, default=8, help="Worker threads per book (default 8)")
    args = parser.parse_args()

    os.makedirs(KTHD_DIR, exist_ok=True)

    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        books_meta = json.load(f)

    meta_by_id = {b['id']: b for b in books_meta}

    if args.all:
        target_book_ids = [b['id'] for b in books_meta]
    elif args.defaults:
        target_book_ids = ['JHN', 'GEN', 'PSA', 'MAT', 'ROM', 'REV', 'ISA', 'JOS', 'JER', '1CO', 'MRK', 'LUK', 'ACT', 'PRO']
    elif args.books:
        target_book_ids = [b.strip().upper() for b in args.books.split(',') if b.strip()]
    else:
        target_book_ids = ['JHN', 'GEN', 'PSA', 'MAT', 'ROM', 'REV', 'ISA', 'JOS', 'JER', '1CO']

    print(f"=== KTHD (BIBLE.COM 1638) CRAWLER & SYNCHRONIZER ===")
    print(f"Target books ({len(target_book_ids)}): {', '.join(target_book_ids)}")

    all_crawled = {}
    for book_id in target_book_ids:
        meta = meta_by_id.get(book_id)
        if not meta:
            continue
        total_ch = meta.get('chapters_count', 1)
        book_data = crawl_book(book_id, total_ch, max_workers=args.workers)
        all_crawled[book_id] = book_data

    update_default_passages(all_crawled)
    print("=== KTHD CRAWL & UPDATE COMPLETE ===")


if __name__ == '__main__':
    main()
