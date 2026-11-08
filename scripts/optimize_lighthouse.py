import re
import os

HTML_PATH = "E:/kinhthanh/index.html"
VERCEL_PATH = "E:/kinhthanh/vercel.json"

# 1. Update index.html
with open(HTML_PATH, "r", encoding="utf-8") as f:
    html = f.read()

# A. Asynchronous non-blocking fonts and fontawesome
old_fonts = '''  <!-- Google Fonts: Noto Serif (HTTLVN Standard), Playfair Display (Royal Vietnamese Headings), Merriweather (Scripture), Outfit (Clean Modern UI) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap" rel="stylesheet">

  <!-- FontAwesome Free Icons CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">'''

new_fonts = '''  <!-- Google Fonts Preconnect & Async Non-Blocking Load -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap"></noscript>

  <!-- FontAwesome Free Icons (Loaded asynchronously to eliminate render-blocking delay) -->
  <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"></noscript>'''

if old_fonts in html:
    html = html.replace(old_fonts, new_fonts)
    print("Fonts and FontAwesome optimized for zero render-blocking!")
else:
    print("WARNING: old_fonts not found exactly in index.html")

# B. Brand gif cross width/height
html = html.replace(
    '<img src="data/cross_holy_gold.gif" alt="Thánh Giá Logos" class="brand-gif-cross">',
    '<img src="data/cross_holy_gold.gif" alt="Thánh Giá Logos" class="brand-gif-cross" width="28" height="28" fetchpriority="high">'
)

# C. ARIA tablist role=tab
old_tab_buttons = '''            <div class="portal-main-tabs" role="tablist">
              <button type="button" class="portal-tab-btn active" id="portal-tab-devotion-btn" data-target="devotion">
                <i class="fa-solid fa-scroll"></i> Tĩnh Nguyện & Dưỡng Linh
              </button>
              <button type="button" class="portal-tab-btn" id="portal-tab-reader-btn" data-target="reader">'''

new_tab_buttons = '''            <div class="portal-main-tabs" role="tablist">
              <button type="button" class="portal-tab-btn active" id="portal-tab-devotion-btn" data-target="devotion" role="tab" aria-selected="true" aria-controls="portal-tab-devotion-panel">
                <i class="fa-solid fa-scroll"></i> Tĩnh Nguyện & Dưỡng Linh
              </button>
              <button type="button" class="portal-tab-btn" id="portal-tab-reader-btn" data-target="reader" role="tab" aria-selected="false" aria-controls="portal-tab-reader-panel">'''

if old_tab_buttons in html:
    html = html.replace(old_tab_buttons, new_tab_buttons)
    print("ARIA tabs children given role=tab and aria-selected!")
else:
    print("WARNING: old_tab_buttons not found")

# D. Portal subitems missing href
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-fav-verses">',
    r'<a href="#portal" class="portal-subitem-link" id="portal-item-fav-verses">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-quiz">',
    r'<a href="#quiz" class="portal-subitem-link" id="portal-item-quiz">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-responsive">',
    r'<a href="#portal" class="portal-subitem-link" id="portal-item-responsive">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-schedule">',
    r'<a href="#portal" class="portal-subitem-link" id="portal-item-schedule">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-survey">',
    r'<a href="#survey" class="portal-subitem-link" id="portal-item-survey">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-item-stories">',
    r'<a href="#portal" class="portal-subitem-link" id="portal-item-stories">',
    html
)
html = re.sub(
    r'<a class="portal-subitem-link" id="portal-devotion-daily-article" data-book="PRO" data-ch="22" data-v="6">',
    r'<a href="#bible/PRO/22" class="portal-subitem-link" id="portal-devotion-daily-article" data-book="PRO" data-ch="22" data-v="6">',
    html
)

# E. devotion-ref-tag and devotion-passage-link and spiritual-ref-pill missing href
def add_href_devotion_ref(match):
    tag = match.group(0)
    book = re.search(r'data-book="([^"]+)"', tag).group(1)
    ch = re.search(r'data-ch="([^"]+)"', tag).group(1)
    return tag.replace('<a ', f'<a href="#bible/{book}/{ch}" ')

html = re.sub(r'<a class="devotion-ref-tag"[^>]+>', add_href_devotion_ref, html)
html = re.sub(r'<a class="devotion-passage-link"[^>]+>', add_href_devotion_ref, html)
html = re.sub(r'<a class="spiritual-ref-pill"[^>]+>', add_href_devotion_ref, html)

# F. Add aria-label to all selects
select_labels = {
    'id="portal-read-book-select"': 'aria-label="Chọn sách đọc Kinh Thánh" id="portal-read-book-select"',
    'id="portal-read-version-select"': 'aria-label="Chọn bản dịch Kinh Thánh" id="portal-read-version-select"',
    'id="portal-listen-book-select"': 'aria-label="Chọn sách nghe audio" id="portal-listen-book-select"',
    'id="portal-search-from-book"': 'aria-label="Chọn sách bắt đầu tra cứu" id="portal-search-from-book"',
    'id="portal-search-to-book"': 'aria-label="Chọn sách kết thúc tra cứu" id="portal-search-to-book"',
    'id="portal-search-version-select"': 'aria-label="Chọn bản dịch tra cứu" id="portal-search-version-select"',
    'id="portal-ref-docs-select"': 'aria-label="Chọn tài liệu tham khảo" id="portal-ref-docs-select"',
    'id="httlvn-filter-version"': 'aria-label="Lọc bản dịch HTTLVN" id="httlvn-filter-version"',
    'id="httlvn-filter-scope"': 'aria-label="Lọc phạm vi HTTLVN" id="httlvn-filter-scope"',
    'id="admin-banner-type-select"': 'aria-label="Loại thông báo banner" id="admin-banner-type-select"',
    'id="admin-banner-theme-select"': 'aria-label="Bộ màu banner" id="admin-banner-theme-select"',
    'id="admin-art-category"': 'aria-label="Chuyên mục bài viết" id="admin-art-category"',
    'id="admin-comm-post-status"': 'aria-label="Trạng thái bài đăng cộng đồng" id="admin-comm-post-status"',
    'id="admin-comm-post-branch"': 'aria-label="Phân nhánh cộng đồng" id="admin-comm-post-branch"',
    'id="admin-media-season-select"': 'aria-label="Mùa video The Bible Project" id="admin-media-season-select"',
    'id="audio-speed-select"': 'aria-label="Tốc độ phát audio" id="audio-speed-select"'
}

for old_id, new_attr in select_labels.items():
    if old_id in html and 'aria-label' not in html[html.find(old_id)-40:html.find(old_id)+40]:
        html = html.replace(old_id, new_attr)

with open(HTML_PATH, "w", encoding="utf-8", newline="\n") as f:
    f.write(html)
print("Updated index.html successfully!")

# 2. Update vercel.json with aggressive caching for static assets
import json
with open(VERCEL_PATH, "r", encoding="utf-8") as f:
    vcfg = json.load(f)

# Insert static caching headers
cache_headers = [
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/js/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/data/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, stale-while-revalidate=604800"
        }
      ]
    }
]

# Avoid duplicates
existing_sources = [h.get("source") for h in vcfg.get("headers", [])]
for ch in cache_headers:
    if ch["source"] not in existing_sources:
        vcfg.setdefault("headers", []).insert(0, ch)

with open(VERCEL_PATH, "w", encoding="utf-8") as f:
    json.dump(vcfg, f, indent=2, ensure_ascii=False)
print("Updated vercel.json cache headers successfully!")
