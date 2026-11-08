import sys

with open('E:/kinhthanh/js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace devotion-ref-tag
target1 = '<a class="devotion-ref-tag" data-book="${v.book || \'HAB\'}" data-ch="${v.ch || 3}" data-v="${v.v || 1}" title="Nhấp để mở đọc và đối chiếu">${v.ref || \'\'}</a>'
replace1 = '<a class="devotion-ref-tag" href="#bible/${v.book || \'HAB\'}/${v.ch || 3}" data-book="${v.book || \'HAB\'}" data-ch="${v.ch || 3}" data-v="${v.v || 1}" title="Nhấp để mở đọc và đối chiếu">${v.ref || \'\'}</a>'

if target1 in content:
    content = content.replace(target1, replace1)
    print('Replaced target1 successfully')
else:
    print('WARNING: target1 not found')

target2 = '<a class="devotion-passage-link" data-book="${p.book}" data-ch="${p.ch}" ${p.v ? `data-v="${p.v}"` : \'\'} title="Đọc ${p.name}">${p.name}</a>'
replace2 = '<a class="devotion-passage-link" href="#bible/${p.book}/${p.ch}" data-book="${p.book}" data-ch="${p.ch}" ${p.v ? `data-v="${p.v}"` : \'\'} title="Đọc ${p.name}">${p.name}</a>'

if target2 in content:
    content = content.replace(target2, replace2)
    print('Replaced target2 successfully')
else:
    print('WARNING: target2 not found')

with open('E:/kinhthanh/js/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done updating app.js')
