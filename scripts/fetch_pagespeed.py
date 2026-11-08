import urllib.request
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://kinhthanhlogos.vercel.app/&strategy=mobile'
print('Fetching PageSpeed Insights report for Mobile...')

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        lhr = data.get('lighthouseResult', {})
        cats = lhr.get('categories', {})
        print('Categories scores:')
        for cat_id, cat_info in cats.items():
            score = cat_info.get('score')
            score_val = int(score * 100) if score is not None else 'N/A'
            print(f"  {cat_id} ({cat_info.get('title')}): {score_val}")
        
        with open('E:/kinhthanh/lighthouse_report.json', 'w', encoding='utf-8') as f:
            json.dump(lhr, f, ensure_ascii=False, indent=2)
        print('Saved report to E:/kinhthanh/lighthouse_report.json')
except Exception as e:
    print('Error:', e)
