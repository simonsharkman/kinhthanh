import urllib.request
import re
import html
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'Mozilla/5.0'}
url = 'https://kinhthanh.httlvn.org/so-sanh-ban-dich/gios/24?v=RRB'
req = urllib.request.Request(url, headers=headers)
html_txt = urllib.request.urlopen(req).read().decode('utf-8')

# Regex to find each verse div:
# <div class="verse col-md-2" data-redirect="/Redirect?v=RRB&amp;q=gios_24%3A1">
verse_blocks = re.findall(
    r'<div class="verse[^"]*"\s+data-redirect="[^"]*v=([^&"]+)[^"]*">([\s\S]*?)</div>',
    html_txt
)
print(f"Total verse blocks found: {len(verse_blocks)}")

sample_by_v = {}
for ver_code, block in verse_blocks:
    m_num = re.search(r'<sup>(\d+)</sup>', block)
    if m_num:
        v_num = int(m_num.group(1))
        # Remove h4 and sup
        clean = re.sub(r'<h4[^>]*>.*?</h4>', '', block, flags=re.DOTALL)
        clean = re.sub(r'<sup[^>]*>.*?</sup>', '', clean)
        clean = re.sub(r'<[^>]+>', ' ', clean)
        clean = html.unescape(clean).strip()
        clean = ' '.join(clean.split())
        if v_num not in sample_by_v:
            sample_by_v[v_num] = {}
        sample_by_v[v_num][ver_code] = clean

print(f"Verses parsed: {len(sample_by_v)}")
if 2 in sample_by_v:
    print("Verse 2 versions:", list(sample_by_v[2].keys()))
    for vcode, txt in sample_by_v[2].items():
        print(f"[{vcode}] -> {txt[:80]}...")
