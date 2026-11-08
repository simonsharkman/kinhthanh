with open('E:/kinhthanh/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

repls = {
    'admin-art-summary': 'Tóm tắt bài nghiên cứu',
    'admin-art-content': 'Nội dung chi tiết bài nghiên cứu',
    'admin-devotion-art-content': 'Nội dung bài tĩnh nguyện dưỡng linh',
    'admin-corr-text': 'Nội dung câu Kinh Thánh đính chính',
    'admin-media-desc-input': 'Tóm tắt nội dung video tư liệu'
}
for elem_id, label in repls.items():
    target = f'id="{elem_id}"'
    html = html.replace(target, f'{target} aria-label="{label}"')

with open('E:/kinhthanh/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated 5 textareas')
