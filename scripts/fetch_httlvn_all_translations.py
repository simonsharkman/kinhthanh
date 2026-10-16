import urllib.request
import re
import json
import html
import time
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

VERSIONS = [
    ('VI1934', 'BTT'),
    ('RVV11', 'BTHD'),
    ('NVB', 'BDM'),
    ('BD2011', 'BD2011'),
    ('BPT', 'BPT'),
    ('BDY', 'BDY'),
    ('RRB', 'EDE'),
    ('JBSV', 'JARAI'),
    ('BRU', 'BRU'),
    ('HMOWSV', 'HMONG_W'),
    ('HMOBSV', 'HMONG_B'),
    ('BBSV', 'MNONG'),
    ('NKJV', 'NKJV'),
    ('NIV', 'NIV')
]

def fetch_chapter(slug, chapter, version_code):
    url = f"https://kinhthanh.httlvn.org/doc-kinh-thanh/{slug}/{chapter}?v={version_code}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            page = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Failed {slug} {chapter} v={version_code}: {e}")
        return {}

    verses = {}
    spans = re.findall(r'<span\s+class=["\']verse\s+([^"\']+)["\']>(.*?)</span>', page, re.DOTALL | re.IGNORECASE)
    for cls, content in spans:
        m_num = re.search(r'_(\d+)$', cls.strip())
        if not m_num:
            m_num = re.search(r'<sup>(\d+)</sup>', content)
        if m_num:
            v_num = int(m_num.group(1))
            txt = re.sub(r'<sup[^>]*>.*?</sup>', '', content)
            txt = re.sub(r'<[^>]+>', '', txt)
            txt = html.unescape(txt).strip()
            txt = re.sub(r'[\u2693\u2694\u2695\u2696\u2697\u2698\u2699⚓]', '', txt)
            txt = re.sub(r'^\s+', '', txt).strip()
            if txt:
                verses[v_num] = txt

    if not verses:
        parts = re.split(r'<sup>(\d+)</sup>', page)
        for i in range(1, len(parts)-1, 2):
            try:
                v_num = int(parts[i])
                raw_txt = parts[i+1]
                end_idx = raw_txt.find('</p>')
                if end_idx != -1:
                    raw_txt = raw_txt[:end_idx]
                end_idx2 = raw_txt.find('</span>')
                if end_idx2 != -1:
                    raw_txt = raw_txt[:end_idx2]
                txt = re.sub(r'<[^>]+>', '', raw_txt)
                txt = html.unescape(txt).strip()
                txt = re.sub(r'[\u2693\u2694\u2695\u2696\u2697\u2698\u2699⚓]', '', txt)
                txt = re.sub(r'^\s+', '', txt).strip()
                if txt:
                    verses[v_num] = txt
            except:
                pass
    return verses

def enrich_chapter(book_path, chapter_num, slug):
    if not os.path.exists(book_path):
        print(f"File not found: {book_path}")
        return

    with open(book_path, 'r', encoding='utf-8') as f:
        book_data = json.load(f)

    ch_key = str(chapter_num)
    verses_list = book_data.get('chapters', {}).get(ch_key, [])
    if not verses_list:
        print(f"No verses found for chapter {chapter_num} in {book_path}")
        return

    print(f"\n--- Fetching translations for {book_path} chapter {chapter_num} ({slug}) ---")
    all_version_verses = {}
    for code, key in VERSIONS:
        print(f"Fetching {code} ({key})...", end='', flush=True)
        v_dict = fetch_chapter(slug, chapter_num, code)
        all_version_verses[key] = v_dict
        print(f" got {len(v_dict)} verses")
        time.sleep(0.3)

    # Now merge into verses_list
    for v in verses_list:
        v_num = v.get('verse_num')
        if not v_num:
            continue
        if 'translations' not in v:
            v['translations'] = {}

        for code, key in VERSIONS:
            text = all_version_verses.get(key, {}).get(v_num)
            if text:
                v['translations'][key] = text
                # Also set standard aliases
                if key == 'BTT':
                    v['translations']['VI1934'] = text
                elif key == 'BTHD':
                    v['translations']['RVV11'] = text
                    v['translations']['BTHĐ'] = text
                elif key == 'BDM':
                    v['translations']['NVB'] = text
                elif key == 'EDE':
                    v['translations']['RRB'] = text
                elif key == 'JARAI':
                    v['translations']['JBSV'] = text
                elif key == 'HMONG_W':
                    v['translations']['HMOWSV'] = text
                elif key == 'HMONG_B':
                    v['translations']['HMOBSV'] = text
                elif key == 'MNONG':
                    v['translations']['BBSV'] = text

    # Save enriched book data
    with open(book_path, 'w', encoding='utf-8') as f:
        json.dump(book_data, f, ensure_ascii=False, indent=2)
    print(f"Successfully enriched {book_path} chapter {chapter_num} with {len(VERSIONS)} authentic translations!")

if __name__ == '__main__':
    # Enrich John 13 and John 1
    enrich_chapter('data/bibles/JHN.json', 13, 'gi')
    enrich_chapter('data/bibles/JHN.json', 1, 'gi')
    enrich_chapter('data/bibles/PSA.json', 23, 'thi')
    enrich_chapter('data/bibles/GEN.json', 1, 'sa')
    enrich_chapter('data/bibles/MAT.json', 5, 'mat')
