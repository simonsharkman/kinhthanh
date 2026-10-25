import json

with open('E:/kinhthanh/data/books-metadata.json', 'r', encoding='utf-8') as f:
    books = json.load(f)

lines = []
for b in books:
    name = b.get('httlvn_name') or b.get('name_vi')
    lines.append(f'<option value="{b["id"]}">{name} ({b["id"]})</option>')

with open('E:/kinhthanh/data/book_options.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Generated {len(lines)} options successfully.")
