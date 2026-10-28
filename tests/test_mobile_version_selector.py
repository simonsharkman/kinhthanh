import os
import re
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_mobile_header_layout_prevents_primary_version_clipping():
    """Bảo đảm trên giao diện điện thoại, nút đổi bản dịch không bị che khuất hoặc đè lên"""
    layout_path = os.path.join(BASE_DIR, 'css', 'layout.css')
    with open(layout_path, 'r', encoding='utf-8') as f:
        css = f.read()

    # 1. header-controls không được có justify-content: flex-end khi cuộn ngang trên mobile
    # vì flex-end sẽ đẩy nút đầu tiên (#primary-version-trigger) ra ngoài rìa trái và bị che mất!
    assert "justify-content: flex-start !important; /* CRITICAL: Must be flex-start so primary version is NEVER clipped on left! */" in css or "justify-content: flex-start !important" in css
    
    # 2. #primary-version-trigger trên mobile phải có flex-shrink: 0 và hiển thị rõ ràng
    assert "#primary-version-trigger" in css
    assert "flex-shrink: 0 !important" in css

    # 3. Nút tìm kiếm trên màn hình nhỏ ẩn chữ 'Tìm kiếm...' để tiết kiệm diện tích cho nút bản dịch
    assert ".mobile-header-search-btn .mobile-search-text" in css
    assert "display: none !important" in css

def test_primary_version_label_concise_contract():
    """Bảo đảm nhãn bản dịch trên header tinh gọn (BTT 1925, EDE, KTHD...) không bị tràn chữ dài"""
    app_path = os.path.join(BASE_DIR, 'js', 'app.js')
    with open(app_path, 'r', encoding='utf-8') as f:
        app_js = f.read()

    assert "updatePrimaryVersionLabel" in app_js
    assert "mobile-drawer-primary-version-label" in app_js
    assert "mobile-menu-primary-version-btn" in app_js
    assert "mobile-drawer-primary-version-row" in app_js

def test_mobile_drawer_has_direct_primary_version_controls():
    """Bảo đảm trong menu trượt di động (Hamburger) có sẵn nút và hàng đổi bản dịch đọc chính"""
    html_path = os.path.join(BASE_DIR, 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    assert 'id="primary-version-trigger"' in html
    assert 'id="primary-version-label"' in html
    assert 'id="mobile-menu-primary-version-btn"' in html
    assert 'id="mobile-drawer-primary-version-row"' in html
    assert 'id="mobile-drawer-primary-version-label"' in html
