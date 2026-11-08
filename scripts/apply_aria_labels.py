import re

with open('E:/kinhthanh/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

labels = {
    'omni-search-input': 'Tìm kiếm địa chỉ Kinh Thánh hoặc từ khóa',
    'portal-read-coord-input': 'Tọa độ câu Kinh Thánh (VD: 12:1-12:3)',
    'portal-listen-from-ch': 'Chương bắt đầu nghe (Từ chương)',
    'portal-listen-to-ch': 'Chương kết thúc nghe (Đến chương)',
    'portal-search-query-input': 'Từ khóa tìm kiếm Kinh Thánh',
    'book-picker-search-input': 'Tìm kiếm nhanh tên sách Kinh Thánh',
    'httlvn-search-query': 'Nhập từ khóa hoặc câu Kinh Thánh để tra cứu',
    'admin-banner-badge-input': 'Huy hiệu thông báo banner',
    'admin-banner-btn-text-input': 'Nội dung nút bấm banner',
    'admin-banner-url-input': 'Đường dẫn liên kết banner',
    'admin-banner-img-input': 'Đường dẫn hình ảnh banner',
    'admin-banner-marquee-checkbox': 'Bật hiệu ứng chữ chạy marquee banner',
    'admin-banner-adsense-checkbox': 'Bật chế độ quảng cáo AdSense',
    'admin-banner-visible-checkbox': 'Hiển thị thanh banner thông báo',
    'admin-username-input': 'Tên đăng nhập quản trị viên',
    'admin-password-input': 'Mật khẩu quản trị viên',
    'admin-art-title': 'Tiêu đề bài viết nghiên cứu',
    'admin-art-author': 'Tác giả bài viết',
    'admin-art-tags': 'Thẻ phân loại chuyên đề bài viết',
    'admin-art-image': 'Đường dẫn ảnh bìa bài viết',
    'admin-art-doc-name': 'Tên tệp tài liệu đính kèm',
    'admin-art-doc-meta': 'Thông tin dung lượng tài liệu',
    'admin-art-doc-url': 'Đường dẫn tệp tài liệu PDF',
    'admin-comm-post-title': 'Tiêu đề bài viết cộng đồng',
    'admin-comm-post-author': 'Tác giả bài viết cộng đồng',
    'admin-devotion-verse-ref': 'Địa chỉ câu gốc dưỡng linh',
    'admin-devotion-verse-book': 'Mã sách câu gốc dưỡng linh',
    'admin-devotion-verse-ch': 'Chương câu gốc dưỡng linh',
    'admin-devotion-verse-v': 'Câu số câu gốc dưỡng linh',
    'admin-devotion-plan1-text': 'Lịch đọc phân đoạn 1',
    'admin-devotion-plan2-text': 'Lịch đọc phân đoạn 2',
    'admin-devotion-plan3-text': 'Lịch đọc phân đoạn 3',
    'admin-devotion-plan4-text': 'Lịch đọc phân đoạn 4',
    'admin-devotion-art-title': 'Tiêu đề bài đọc Sống Với Thánh Kinh',
    'admin-devotion-art-ref': 'Câu gốc bài đọc Sống Với Thánh Kinh',
    'admin-corr-note': 'Ghi chú đính chính văn bản',
    'admin-media-book-input': 'Mã sách bài giảng video',
    'admin-media-title-input': 'Tiêu đề video tư liệu',
    'admin-media-youtube-input': 'Mã định danh YouTube hoặc đường dẫn video',
    'admin-media-duration-input': 'Thời lượng video bài giảng',
    'tklk-quick-num-input': 'Nhập số chương Thánh Kinh Lược Khảo từ 1 đến 114',
    'tklk-jump-search-input': 'Tìm kiếm theo tên sách hoặc chuyên đề Lược Khảo',
    'audio-seek-slider': 'Thanh trượt tua thời gian audio',
    'admin-banner-text-input': 'Nội dung thông báo banner',
    'admin-art-desc': 'Tóm tắt nội dung bài viết nghiên cứu',
    'admin-art-body': 'Nội dung chi tiết bài viết nghiên cứu',
    'admin-comm-post-content': 'Nội dung thảo luận cộng đồng',
    'admin-devotion-verse-text': 'Văn bản trích dẫn câu gốc',
    'admin-devotion-art-body': 'Nội dung bài tĩnh nguyện Sống Với Thánh Kinh',
    'admin-corr-original': 'Đoạn văn bản gốc cần sửa',
    'admin-corr-corrected': 'Đoạn văn bản sau khi đính chính',
}

count = 0
for elem_id, label in labels.items():
    # Regex to find tag with id=elem_id that doesn't already have aria-label
    pattern = rf'(<(?:input|textarea)\b[^>]*?\bid=[\'"]{elem_id}[\'"][^>]*?)>'
    m = re.search(pattern, html)
    if m:
        tag = m.group(1)
        if 'aria-label=' not in tag:
            new_tag = f'{tag} aria-label="{label}">'
            html = html.replace(m.group(0), new_tag, 1)
            count += 1
            print(f'Added aria-label to {elem_id}')
        else:
            print(f'Already has aria-label: {elem_id}')
    else:
        # Check if id appears elsewhere in tag
        alt_pattern = rf'(<(?:input|textarea)\b(?![^>]*\baria-label=)[^>]*?\bid="{elem_id}"[^>]*?)>'
        m2 = re.search(alt_pattern, html)
        if m2:
            new_tag = f'{m2.group(1)} aria-label="{label}">'
            html = html.replace(m2.group(0), new_tag, 1)
            count += 1
            print(f'Added aria-label (alt) to {elem_id}')
        else:
            print(f'Element with id={elem_id} not found as <input>/<textarea>')

print(f'\nTotal updated tags: {count}')

with open('E:/kinhthanh/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
