import urllib.request
import re
import html
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# HTTLVN Version codes & our app keys
VERSION_MAP = {
    'VI1934': ['BTT', 'VI1934'],
    'RVV11': ['BTHD', 'RVV11', 'BTHĐ'],
    'NVB': ['BDM', 'NVB'],
    'BD2011': ['BD2011'],
    'BPT': ['BPT'],
    'BDY': ['BDY'],
    'RRB': ['EDE', 'RRB'],
    'JBSV': ['JARAI', 'JBSV'],
    'BRU': ['BRU'],
    'HMOWSV': ['HMONG_W', 'HMOWSV'],
    'HMOBSV': ['HMONG_B', 'HMOBSV'],
    'BBSV': ['MNONG', 'BBSV'],
    'NKJV': ['NKJV'],
    'NIV': ['NIV'],
    'RCUV': ['RCUV'],
    'RCUVSS': ['RCUVSS']
}

def fetch_httlvn_so_sanh(slug, chapter, version_code):
    """Fetch HTTLVN so-sanh-ban-dich page which returns 6 versions per query."""
    url = f"https://kinhthanh.httlvn.org/so-sanh-ban-dich/{slug}/{chapter}?v={version_code}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            page = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {slug} {chapter} v={version_code}: {e}")
        return {}

    # Extract all verse blocks: <div class="verse..." data-redirect="...v={CODE}&amp;q=...">...</div>
    blocks = re.findall(
        r'<div class="verse[^"]*"\s+data-redirect="[^"]*v=([^&"]+)[^"]*">([\s\S]*?)</div>',
        page
    )
    result = {} # { v_num: { ver_code: text } }
    for vcode, content in blocks:
        m_num = re.search(r'<sup>(\d+)</sup>', content)
        if not m_num:
            continue
        v_num = int(m_num.group(1))
        # Remove headers, sup, and clean HTML
        clean = re.sub(r'<h4[^>]*>.*?</h4>', '', content, flags=re.DOTALL)
        clean = re.sub(r'<sup[^>]*>.*?</sup>', '', clean)
        clean = re.sub(r'<[^>]+>', ' ', clean)
        clean = html.unescape(clean).strip()
        clean = ' '.join(clean.split())
        if clean:
            if v_num not in result:
                result[v_num] = {}
            result[v_num][vcode] = clean
    return result

def enrich_book_chapter(book_id, slug, chapter_num):
    book_file = f"data/bibles/{book_id}.json"
    if not os.path.exists(book_file):
        print(f"Book file not found: {book_file}")
        return

    with open(book_file, 'r', encoding='utf-8') as f:
        book_data = json.load(f)

    ch_str = str(chapter_num)
    verses = book_data.get('chapters', {}).get(ch_str, [])
    if not verses:
        print(f"Chapter {chapter_num} not found in {book_file}")
        return

    print(f"\n==========================================")
    print(f"Enriching {book_id} ({slug}) Chapter {chapter_num} with Authentic HTTLVN Text...")
    print(f"==========================================")

    # We make calls with different primary version codes to gather ALL versions:
    # 1. RRB (gives RRB + VI1934, RVV11, BD2011, NVB, BPT)
    # 2. JBSV (gives JBSV)
    # 3. BDY (gives BDY)
    # 4. BRU (gives BRU)
    # 5. BBSV (gives BBSV)
    # 6. HMOWSV (gives HMOWSV)
    # 7. NKJV (gives NKJV)
    # 8. NIV (gives NIV)
    primary_codes = ['RRB', 'JBSV', 'BDY', 'BRU', 'BBSV', 'HMOWSV', 'NKJV', 'NIV']
    aggregated = {} # { v_num: { code: text } }

    for p_code in primary_codes:
        print(f"Fetching HTTLVN batch with primary '{p_code}'...", end='', flush=True)
        res = fetch_httlvn_so_sanh(slug, chapter_num, p_code)
        print(f" got {len(res)} verses with {sum(len(v) for v in res.values())} translations")
        for vnum, trans_map in res.items():
            if vnum not in aggregated:
                aggregated[vnum] = {}
            aggregated[vnum].update(trans_map)
        time.sleep(0.3)

    # Now merge into book_data verses
    updated_count = 0
    for v in verses:
        v_num = v.get('verse_num')
        if not v_num or v_num not in aggregated:
            continue
        if 'translations' not in v:
            v['translations'] = {}

        for code, text in aggregated[v_num].items():
            v['translations'][code] = text
            # Add all known aliases from VERSION_MAP
            if code in VERSION_MAP:
                for alias in VERSION_MAP[code]:
                    v['translations'][alias] = text
        updated_count += 1

    # Also save a dedicated per-chapter file in data/httlvn/{slug}_{chapter_num}.json for direct fast access
    os.makedirs('data/httlvn', exist_ok=True)
    httlvn_chapter_file = f"data/httlvn/{book_id.lower()}_{chapter_num}.json"
    with open(httlvn_chapter_file, 'w', encoding='utf-8') as f:
        json.dump({
            'book_id': book_id,
            'slug': slug,
            'chapter': chapter_num,
            'verses': aggregated
        }, f, ensure_ascii=False, indent=2)

    # Save the main book file
    with open(book_file, 'w', encoding='utf-8') as f:
        json.dump(book_data, f, ensure_ascii=False, indent=2)

    print(f"SUCCESS: Updated {updated_count} verses for {book_id} {chapter_num}! Saved to {book_file} and {httlvn_chapter_file}")

if __name__ == '__main__':
    # Key chapters requested by user or active in testing
    targets = [
        ('JOS', 'gios', 24), # Giô-suê 24 (The user's exact current screenshot!)
        ('ISA', 'es', 1),    # Ê-sai 1 (From screenshot!)
        ('ISA', 'es', 53),   # Ê-sai 53
        ('GEN', 'sa', 47),   # Sáng thế 47 (From previous screenshot!)
        ('GEN', 'sa', 1),    # Sáng thế 1
        ('JHN', 'gi', 1),    # Giăng 1
        ('PSA', 'thi', 23),  # Thi thiên 23
        ('JON', 'gion', 1),  # Giô-na 1 (From user query "giona la ai?")
        ('JON', 'gion', 2),  # Giô-na 2
        ('JON', 'gion', 3),  # Giô-na 3
        ('JON', 'gion', 4),  # Giô-na 4
    ]

    for b_id, s_slug, ch_num in targets:
        try:
            enrich_book_chapter(b_id, s_slug, ch_num)
        except Exception as e:
            print(f"Failed enriching {b_id} {ch_num}: {e}")
