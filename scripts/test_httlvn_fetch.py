import urllib.request
import re

url = 'https://kinhthanh.httlvn.org/doc-kinh-thanh/gie/29?v=RRB'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8')
        print(f"Downloaded {len(html)} bytes")
        # Find verses
        # HTTLVN format: <span class="verse GIE_29_6"><sup>6</sup> ...</span>
        verses = re.findall(r'<span class="verse[^"]*">(.*?)</span>', html, re.DOTALL)
        print(f"Found {len(verses)} verses")
        if len(verses) >= 6:
            v6 = re.sub(r'<[^>]+>', '', verses[5]).strip()
            with open("scripts/v6_sample.txt", "w", encoding="utf-8") as out:
                out.write(v6)
            print("Successfully written to scripts/v6_sample.txt")
except Exception as e:
    print("Error:", e)
