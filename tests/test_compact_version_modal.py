import os
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_compact_primary_version_modal_layout():
    """Kiểm tra Modal chọn bản dịch đọc chính được tối ưu thu nhỏ phần đầu và chuyển nút đóng lên trên góc phải"""
    html_path = os.path.join(BASE_DIR, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Nút đóng nhỏ gọn nằm ở header trên cùng bên phải
    assert 'class="modal-close-btn pvm-close-btn"' in html
    assert 'data-modal="primary-version-modal"' in html

    # 2. Tiêu đề tinh gọn và huy hiệu nằm trên cùng 1 hàng
    assert 'class="modal-header pvm-header"' in html
    assert 'class="pvm-header-left"' in html
    assert 'class="pvm-badge"' in html
    assert 'id="primary-version-modal-title"' in html

    # 3. Đã loại bỏ nút đóng to chiếm diện tích ở chân modal (modal-footer) trong primary-version-modal
    pvm_start = html.find('id="primary-version-modal"')
    pvm_end = html.find('</div>\n  </div>\n\n  <!-- Modal 8', pvm_start)
    pvm_snippet = html[pvm_start:pvm_end]
    assert '<div class="modal-footer"' not in pvm_snippet

def test_compact_primary_version_modal_css():
    """Kiểm tra các luật CSS cho header tinh giản và nút đóng nhỏ gọn"""
    css_path = os.path.join(BASE_DIR, 'css', 'components.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert ".pvm-header" in css
    assert ".pvm-title" in css
    assert ".pvm-badge" in css
    assert ".pvm-close-btn" in css
    assert "max-height: calc(88vh - 50px)" in css
