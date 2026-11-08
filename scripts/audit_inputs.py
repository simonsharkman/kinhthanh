import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('E:/kinhthanh/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print('=== Checking all <input> elements ===')
inputs = re.findall(r'<input\b[^>]*>', html)
for tag in inputs:
    if 'type="hidden"' in tag:
        continue
    has_aria = 'aria-label=' in tag or 'aria-labelledby=' in tag
    if not has_aria:
        print('MISSING ARIA-LABEL:', tag)

print('\n=== Checking all <button> elements ===')
buttons = re.findall(r'<button\b[^>]*>', html)
for tag in buttons:
    has_text_or_aria = 'aria-label=' in tag
    # Check if empty button
    # print sample
