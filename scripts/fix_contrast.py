with open('E:/kinhthanh/css/components.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace header-green and btn-green
css = css.replace('.header-green {\n  background: #558b2f;\n}', '.header-green {\n  background: #2e6914;\n}')
css = css.replace('.btn-green {\n  background: #558b2f;\n  color: #fff;\n  border-color: #558b2f;\n}', '.btn-green {\n  background: #2e6914;\n  color: #fff;\n  border-color: #2e6914;\n}')
css = css.replace('.btn-green:hover {\n  background: #689f38;\n}', '.btn-green:hover {\n  background: #3c7d1e;\n}')

# Replace header-orange and btn-orange
css = css.replace('.header-orange {\n  background: #f57c00;\n}', '.header-orange {\n  background: #b34a00;\n}')
css = css.replace('.btn-orange {\n  background: #f57c00;\n  color: #fff;\n  border-color: #f57c00;\n}', '.btn-orange {\n  background: #b34a00;\n  color: #fff;\n  border-color: #b34a00;\n}')
css = css.replace('.btn-orange:hover {\n  background: #fb8c00;\n}', '.btn-orange:hover {\n  background: #c95500;\n}')

# Replace header-terracotta
css = css.replace('.header-terracotta {\n  background: #c05621;\n}', '.header-terracotta {\n  background: #963806;\n}')

# Replace devotion-block-title
css = css.replace('color: #c05621;\n  margin-bottom: 0.45rem;', 'color: #963806;\n  margin-bottom: 0.45rem;')

# Replace devotion-date-display
old_devotion_date = '''.devotion-date-display {
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;'''
new_devotion_date = '''.devotion-date-display {
  background: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  color: #7c2d12;'''

if old_devotion_date in css:
    css = css.replace(old_devotion_date, new_devotion_date)
    print('Updated devotion-date-display')
else:
    print('Notice: old_devotion_date exact string not matched')

with open('E:/kinhthanh/css/components.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Updated color contrasts in components.css')
