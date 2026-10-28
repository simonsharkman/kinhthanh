import os
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_version_selector_modal_html_structure():
    """Kiểm tra modal Chọn Bản Dịch Đối Chiếu đã loại bỏ phần mô tả rườm rà và làm gọn thanh công cụ"""
    html_path = os.path.join(BASE_DIR, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Trích xuất đoạn mã của version-selector-modal
    vsm_start = html.find('id="version-selector-modal"')
    vsm_end = html.find('id="httlvn-search-modal"', vsm_start)
    vsm_snippet = html[vsm_start:vsm_end]

    # 2. Đã gạch bỏ hoàn toàn đoạn văn bản mô tả thừa thãi (dấu X màu đỏ của anh Jimmy)
    assert '<p class="modal-desc">' not in vsm_snippet
    assert "Hỗ trợ toàn bộ bản dịch tiếng Việt" not in vsm_snippet

    # 3. Nút đóng nhỏ gọn ở header trên cùng bên phải
    assert 'class="modal-close-btn vsm-close-btn"' in vsm_snippet
    assert 'data-modal="version-selector-modal"' in vsm_snippet

    # 4. Thanh 3 Tab rút gọn chữ không bị ngắt nhiều dòng
    assert "Tiếng Việt (8)" in vsm_snippet
    assert "Sắc Tộc (7)" in vsm_snippet
    assert "Quốc Tế (7)" in vsm_snippet

    # 5. Thanh nút thao tác nhanh (4 nút nhỏ gọn trên 1 hàng ngang)
    assert "Bản Việt" in vsm_snippet
    assert "Sắc Tộc" in vsm_snippet
    assert "Tất Cả" in vsm_snippet
    assert "Bỏ Chọn" in vsm_snippet

def test_version_selector_items_clean_single_row():
    """Kiểm tra danh sách từng bản dịch đã loại bỏ các câu mô tả dài bên dưới (đường gạch đỏ của anh Jimmy)"""
    app_path = os.path.join(BASE_DIR, 'js', 'app.js')
    with open(app_path, 'r', encoding='utf-8') as f:
        app_js = f.read()

    # Trong hàm populateVersionSelector không còn render div class="version-option-note"
    pop_start = app_js.find('populateVersionSelector(')
    pop_end = app_js.find('updateSelectedVersionsSummary()', pop_start)
    pop_snippet = app_js[pop_start:pop_end]

    assert 'class="version-option-note"' not in pop_snippet
    assert 'class="version-badge-code"' in pop_snippet
    assert 'class="version-option-name"' in pop_snippet

def test_version_selector_modal_css():
    """Kiểm tra các class CSS tinh gọn cho version selector modal"""
    css_path = os.path.join(BASE_DIR, 'css', 'components.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert ".vsm-card" in css
    assert ".vsm-header" in css
    assert ".vsm-close-btn" in css
    assert ".version-quick-actions" in css
    assert ".version-option-card" in css
