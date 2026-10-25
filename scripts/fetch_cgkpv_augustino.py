#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fetch authentic Catholic Translation (Các Giờ Kinh Phụng Vụ - CGKPV)
from https://augustino.net/kinh-thanh and update Logos Bible Multiverse.
"""

import os
import sys
import json
import re
import html
import time
import argparse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CGKPV_DIR = os.path.join(DATA_DIR, 'cgkpv')
BIBLES_DIR = os.path.join(DATA_DIR, 'bibles')
MAPPING_FILE = os.path.join(DATA_DIR, 'cgkpv-augustino-mapping.json')
METADATA_FILE = os.path.join(DATA_DIR, 'books-metadata.json')
DEFAULT_PASSAGES_FILE = os.path.join(DATA_DIR, 'default-bible-passages.json')

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'


def get_augustino_url(slug: str, book_id: str, chapter: int) -> str:
    """Generate exact URL for augustino.net based on book slug and chapter."""
    if book_id == 'PSA':
        if chapter == 1:
            return 'https://augustino.net/sach-thanh-vinh'
        return f'https://augustino.net/thanh-vinh-{chapter}'
    else:
        if chapter == 1:
            return f'https://augustino.net/{slug}'
        return f'https://augustino.net/{slug}-chuong-{chapter}'


def parse_augustino_html(raw_html: str) -> dict:
    """Extract clean verse dictionary {verse_num: text} from augustino.net HTML."""
    decoded = (
        raw_html.replace(r'\u003c', '<')
        .replace(r'\u003e', '>')
        .replace(r'\"', '"')
        .replace(r'\/', '/')
        .replace(r'\u0026', '&')
    )

    parts = re.split(r'<sub[^>]*id="(\d+[a-zA-Z]?)"[^>]*>[^<]*</sub>', decoded)
    if len(parts) < 3:
        return {}

    sub_verses = {}
    for i in range(1, len(parts), 2):
        raw_id = parts[i]
        raw_text = parts[i + 1]

        # Stop at navigation / footer
        for stop_marker in ['<div class="content-nav', '<div class="tools', '<script>', 'self.__next_f.push']:
            if stop_marker in raw_text:
                raw_text = raw_text.split(stop_marker)[0]

        # Strip HTML tags
        clean_text = re.sub(r'<[^>]+>', ' ', raw_text)
        # Unescape HTML entities
        clean_text = html.unescape(clean_text)
        # Strip remaining numeric character references like &#8203;
        clean_text = re.sub(r'&#\d+;', '', clean_text)
        # Remove zero-width & non-printing characters
        clean_text = clean_text.replace('\u200b', '').replace('\ufeff', '').replace('\xa0', ' ')
        clean_text = clean_text.replace('\\n', ' ').replace('\\r', ' ').replace('\\t', ' ')
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        # Clean JSON trailing residue
        for end_art in ['"])', '"]', '])', '"']:
            if clean_text.endswith(end_art):
                clean_text = clean_text[:-len(end_art)].strip()

        if clean_text:
            sub_verses[raw_id] = clean_text

    # Combine lettered parts (e.g. 17a, 17b) into standard verse number
    verses = {}
    for sub_id, text in sub_verses.items():
        v_base = int(re.sub(r'[a-zA-Z]', '', sub_id))
        if v_base not in verses:
            verses[v_base] = text
        else:
            if text not in verses[v_base]:
                verses[v_base] += ' ' + text

    return verses


def fetch_chapter(slug: str, book_id: str, chapter: int, retries: int = 3) -> dict:
    """Fetch single chapter from augustino.net with retry logic."""
    url = get_augustino_url(slug, book_id, chapter)
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})

    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                raw_html = resp.read().decode('utf-8', errors='replace')
            verses = parse_augustino_html(raw_html)
            if verses:
                return verses
            time.sleep(0.3 * attempt)
        except Exception as e:
            if attempt == retries:
                print(f"  [WARN] Failed to fetch {book_id} Ch {chapter} ({url}): {e}")
            time.sleep(0.5 * attempt)
    return {}


def load_cgkpv_book(book_id: str) -> dict:
    """Load existing CGKPV JSON file for book if it exists."""
    out_file = os.path.join(CGKPV_DIR, f"{book_id}.json")
    if os.path.exists(out_file):
        try:
            with open(out_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "book_id": book_id,
        "source": "https://augustino.net/kinh-thanh",
        "translation": "CGKPV",
        "translation_name": "Các Giờ Kinh Phụng Vụ",
        "chapters": {}
    }


def save_cgkpv_book(book_id: str, data: dict):
    """Save CGKPV book JSON file."""
    os.makedirs(CGKPV_DIR, exist_ok=True)
    out_file = os.path.join(CGKPV_DIR, f"{book_id}.json")
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def update_bibles_data(book_id: str, cgkpv_chapters: dict):
    """Update data/bibles/{book_id}.json with authentic CGKPV verses."""
    bible_file = os.path.join(BIBLES_DIR, f"{book_id}.json")
    if not os.path.exists(bible_file):
        return

    with open(bible_file, 'r', encoding='utf-8') as f:
        bible_data = json.load(f)

    updated_count = 0
    if 'chapters' in bible_data:
        for ch_str, verse_list in bible_data['chapters'].items():
            if ch_str in cgkpv_chapters:
                cgkpv_v_map = cgkpv_chapters[ch_str]
                for v in verse_list:
                    v_num = v.get('verse_num')
                    v_text = cgkpv_v_map.get(str(v_num)) or cgkpv_v_map.get(v_num)
                    if v_text:
                        if 'translations' not in v:
                            v['translations'] = {}
                        v['translations']['CGKPV'] = v_text
                        updated_count += 1

    with open(bible_file, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, ensure_ascii=False, indent=2)

    return updated_count


def update_default_passages(all_cgkpv_data: dict):
    """Update default-bible-passages.json with authentic CGKPV verses."""
    if not os.path.exists(DEFAULT_PASSAGES_FILE):
        return

    with open(DEFAULT_PASSAGES_FILE, 'r', encoding='utf-8') as f:
        passages = json.load(f)

    updated_total = 0
    for key, passage in passages.items():
        book_id = passage.get('book_id')
        ch_num = str(passage.get('chapter_num'))

        if book_id in all_cgkpv_data and ch_num in all_cgkpv_data[book_id].get('chapters', {}):
            cg_map = all_cgkpv_data[book_id]['chapters'][ch_num]
            for v in passage.get('verses', []):
                v_num = v.get('verse_num')
                v_text = cg_map.get(str(v_num)) or cg_map.get(v_num)
                if v_text:
                    if 'translations' not in v:
                        v['translations'] = {}
                    v['translations']['CGKPV'] = v_text
                    updated_total += 1

    with open(DEFAULT_PASSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(passages, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated_total} verses in default-bible-passages.json with authentic CGKPV")


def crawl_book(book_id: str, slug: str, total_chapters: int, max_workers: int = 6) -> dict:
    """Crawl all chapters of a book using ThreadPoolExecutor."""
    print(f"Crawling {book_id} ({slug}) - {total_chapters} chapters...")
    book_data = load_cgkpv_book(book_id)
    chapters = book_data.get('chapters', {})

    chapters_to_fetch = [c for c in range(1, total_chapters + 1) if str(c) not in chapters]

    if not chapters_to_fetch:
        print(f"  All {total_chapters} chapters of {book_id} already cached.")
        return book_data

    print(f"  Fetching {len(chapters_to_fetch)} missing chapters with {max_workers} threads...")
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_ch = {
            executor.submit(fetch_chapter, slug, book_id, ch): ch
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
    save_cgkpv_book(book_id, book_data)

    dt = time.time() - t0
    fetched_verses = sum(len(v) for v in chapters.values())
    print(f"  Finished {book_id}: {len(chapters)}/{total_chapters} chapters, {fetched_verses} verses ({dt:.1f}s)")

    # Update bibles/
    updated_bibles = update_bibles_data(book_id, chapters)
    if updated_bibles:
        print(f"  Injected {updated_bibles} CGKPV verses into data/bibles/{book_id}.json")

    return book_data


def main():
    parser = argparse.ArgumentParser(description="Fetch authentic CGKPV translation from augustino.net")
    parser.add_argument('--books', type=str, help="Comma-separated book IDs (e.g. JHN,MAT,GEN,PSA,ROM,REV)")
    parser.add_argument('--all', action='store_true', help="Fetch all 66 books")
    parser.add_argument('--defaults', action='store_true', help="Fetch books corresponding to default passages")
    parser.add_argument('--workers', type=int, default=6, help="Worker threads per book (default 6)")
    args = parser.parse_args()

    os.makedirs(CGKPV_DIR, exist_ok=True)

    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        mapping = json.load(f)

    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        books_meta = json.load(f)

    meta_by_id = {b['id']: b for b in books_meta}

    if args.all:
        target_book_ids = list(mapping.keys())
    elif args.defaults:
        target_book_ids = ['JHN', 'REV', 'GEN', 'PSA', 'MAT', 'ISA', 'ROM', 'JOS', 'JER', '1CO']
    elif args.books:
        target_book_ids = [b.strip().upper() for b in args.books.split(',') if b.strip()]
    else:
        # Default priority: Core Gospel, Wisdom, Torah, Epistles, Prophecy, Apocalypse
        target_book_ids = [
            'JHN', 'MAT', 'MRK', 'LUK', 'ACT',
            'GEN', 'PSA', 'PRO', 'ROM', '1CO',
            'ISA', 'JER', 'REV'
        ]

    print(f"=== CGKPV CRAWLER & SYNCHRONIZER ===")
    print(f"Target books ({len(target_book_ids)}): {', '.join(target_book_ids)}")

    all_crawled = {}
    for book_id in target_book_ids:
        slug = mapping.get(book_id)
        if not slug:
            print(f"[SKIP] Unknown book slug for {book_id}")
            continue

        meta = meta_by_id.get(book_id, {})
        total_ch = meta.get('chapters_count', 1)

        book_data = crawl_book(book_id, slug, total_ch, max_workers=args.workers)
        all_crawled[book_id] = book_data

    # Update default passages
    update_default_passages(all_crawled)
    print("=== CGKPV CRAWL & UPDATE COMPLETE ===")


if __name__ == '__main__':
    main()
