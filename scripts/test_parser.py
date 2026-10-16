import urllib.request
import re

url = 'https://kinhthanh.httlvn.org/doc-kinh-thanh/gie/29?v=RRB'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

# Check HTML pattern for span.verse
# In HTTLVN HTML:
# <span class="verse GIE_29_1"><sup>1</sup>Lời của bức thơ mà đấng tiên tri Giê-rê-mi...</span>
spans = re.findall(r'<span class="verse\s+([^"]*)">(.*?)</span>', html, re.DOTALL)
print("Matches found:", len(spans))
for cls, content in spans[:5]:
    m = re.search(r'_(\d+)$', cls)
    vnum = m.group(1) if m else '?'
    clean = re.sub(r'<sup.*?>.*?</sup>', '', content)
    clean = re.sub(r'<[^>]+>', '', clean).strip()
    print(f"Verse {vnum} parsed: {len(clean)} chars")
