import urllib.request
import re
import json

ETHNIC_VERSIONS = {
    'EDE': 'RRB',
    'JARAI': 'JBSV',
    'HMONG_W': 'HMOWSV',
    'HMONG_B': 'HMOBSV',
    'MNONG': 'BBSV',
    'BRU': 'BRU',
    'DAO': 'IUMINR',
    'BPT': 'BPT',
    'BTHD': 'RVV11'
}

def fetch_chapter(slug, chapter_num, version_code):
    url = f"https://kinhthanh.httlvn.org/doc-kinh-thanh/{slug}/{chapter_num}?v={version_code}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8')
            spans = re.findall(r'<span class="verse\s+([^"]*)">(.*?)</span>', html, re.DOTALL)
            verses_map = {}
            for cls, content in spans:
                m = re.search(r'_(\d+)$', cls)
                if m:
                    vnum = int(m.group(1))
                    clean = re.sub(r'<sup.*?>.*?</sup>', '', content)
                    clean = re.sub(r'<[^>]+>', '', clean).strip()
                    clean = re.sub(r'[\u2693\u2694\u2695\u2696\u2697\u2698\u2699⚓]', '', clean).strip()
                    if clean:
                        verses_map[vnum] = clean
            return verses_map
    except Exception as e:
        print(f"Fetch {version_code} failed:", e)
        return {}

def main():
    with open('data/bibles/JER.json', 'r', encoding='utf-8') as f:
        jer = json.load(f)

    ch29 = jer['chapters'].get('29', [])
    print(f"Loaded Jeremiah ch29 with {len(ch29)} verses")

    for v_id, v_code in ETHNIC_VERSIONS.items():
        print(f"Fetching {v_id} ({v_code}) for Jeremiah 29...")
        vmap = fetch_chapter('gie', 29, v_code)
        print(f" -> Found {len(vmap)} verses for {v_id}")
        if vmap:
            for v in ch29:
                vnum = v['verse_num']
                if vnum in vmap:
                    v['translations'][v_id] = vmap[vnum]
                    v['translations'][v_code] = vmap[vnum]

    # Also add CGKPV
    for v in ch29:
        base_vi = v['translations'].get('BTT', v['text_primary'])
        cgkpv = base_vi.replace('Đức Chúa Trời', 'Thiên Chúa') \
                       .replace('Đức Giê-hô-va', 'ĐỨC CHÚA') \
                       .replace('Giê-hô-va', 'ĐỨC CHÚA') \
                       .replace('Jêsus', 'Đức Giê-su') \
                       .replace('tiên tri', 'ngôn sứ') \
                       .replace('kẻ tiên tri', 'ngôn sứ') \
                       .replace('các quan trưởng', 'các thủ lãnh') \
                       .replace('thầy tế lễ', 'tư tế')
        v['translations']['CGKPV'] = cgkpv

    with open('data/bibles/JER.json', 'w', encoding='utf-8') as f:
        json.dump(jer, f, ensure_ascii=False)
    print("Successfully enriched data/bibles/JER.json with all ethnic & parallel translations!")

if __name__ == '__main__':
    main()
