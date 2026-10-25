import os
import re

def test_mobile_markup_in_index_html():
    """Kiểm tra cấu trúc HTML cho giao diện điện thoại (Bottom Sheet, Mobile Nav, Mobile Menu)"""
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Thanh kéo Bottom Sheet
    assert 'id="bottom-sheet-drag-handle"' in html
    assert 'class="bottom-sheet-drag-handle"' in html

    # 2. Thanh điều hướng dưới đáy (Mobile Bottom Navigation)
    assert 'id="mobile-bottom-nav"' in html
    assert 'class="mobile-bottom-nav"' in html
    assert 'id="btn-mobile-read"' in html
    assert 'id="btn-mobile-parallel"' in html
    assert 'id="btn-mobile-books"' in html
    assert 'id="btn-mobile-search"' in html
    assert 'id="btn-mobile-menu"' in html

    # 3. Menu khám phá di động (Mobile Menu Modal & Slide-out Drawer)
    assert 'id="mobile-menu-modal"' in html
    assert 'mobile-menu-grid' in html
    assert 'data-nav="bible"' in html
    assert 'data-nav="blog"' in html
    assert 'data-nav="community"' in html
    assert 'data-nav="media"' in html
    assert 'id="mobile-menu-books-shortcut-btn"' in html
    assert 'data-nav="versions"' in html

    # 4. Mobile Drawer Toggle trên Header & Dashboard Actions Card (Screen 1 & 2 Mẫu Mới)
    assert 'id="mobile-drawer-toggle"' in html
    assert 'class="portal-mobile-dashboard"' in html
    assert 'mobile-dash-card card-green' in html
    assert 'mobile-dash-card card-blue' in html
    assert 'mobile-dash-card card-gold' in html
    assert 'mobile-drawer-sheet' in html
    assert 'mobile-drawer-row' in html


def test_mobile_responsive_css_architecture():
    """Kiểm tra quy chuẩn CSS cho Mobile Bottom Sheet & Split View 50/50"""
    with open("css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    # Desktop Lock (min-width: 992px)
    assert "@media (min-width: 992px)" in layout_css
    assert "body.drawer-open" in layout_css
    assert "margin-right: var(--drawer-width)" in layout_css
    assert ".bottom-sheet-drag-handle" in layout_css
    assert "#mobile-bottom-nav" in layout_css

    # Mobile Viewport (max-width: 991px)
    assert "@media (max-width: 991px)" in layout_css
    assert "#drawer-inspector" in layout_css
    assert "border-top-left-radius" in layout_css
    assert "height: 56vh" in layout_css
    assert "#drawer-inspector.expanded" in layout_css
    assert "height: 82vh" in layout_css
    assert ".bottom-sheet-drag-handle" in layout_css
    assert "80px" in layout_css or "85px" in layout_css


def test_mobile_components_styling():
    """Kiểm tra styling của thanh điều hướng đáy và thẻ menu khám phá di động"""
    with open("css/components.css", "r", encoding="utf-8") as f:
        comp_css = f.read()

    assert ".mobile-bottom-nav" in comp_css
    assert ".mobile-nav-item" in comp_css
    assert ".mobile-menu-card" in comp_css
    assert ".mobile-menu-grid" in comp_css
    assert ".mobile-menu-btn" in comp_css
    assert ".mobile-menu-row" in comp_css


def test_mobile_javascript_wiring():
    """Kiểm tra mã nguồn JavaScript khởi tạo các sự kiện và cử chỉ vuốt/chạm trên điện thoại"""
    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # Khởi tạo phương thức Mobile Responsive UX
    assert "initMobileResponsiveUX" in app_js
    assert "this.initMobileResponsiveUX()" in app_js

    # Xử lý các nút điều hướng đáy
    assert "btn-mobile-read" in app_js
    assert "btn-mobile-parallel" in app_js
    assert "btn-mobile-books" in app_js
    assert "btn-mobile-search" in app_js
    assert "btn-mobile-menu" in app_js

    # Tính toán cuộn câu không bị Bottom Sheet che khuất
    assert "window.innerWidth <= 991" in app_js
    assert "window.scrollTo" in app_js

    # Cử chỉ vuốt/chạm thanh kéo (touch drag / swipe)
    assert "bottom-sheet-drag-handle" in app_js
    assert "touchstart" in app_js
    assert "touchend" in app_js
    assert "expanded" in app_js

    # Nút chuyển đổi chế độ đối chiếu đa bản dịch trực tiếp
    assert "mobile-header-compare-btn" in app_js
    assert "updateReadingModeUI" in app_js
    assert "READING_MODE_CHANGED" in app_js


def test_direct_parallel_comparison_mode():
    """Kiểm tra chế độ đọc đối chiếu đa bản dịch trực tiếp theo từng câu"""
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    assert 'id="mobile-header-compare-btn"' in html

    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        be_js = f.read()
    assert "renderChapterParallelHTML" in be_js
    assert "verse-compare-card" in be_js
    assert "compare-translations-stack" in be_js

    with open("js/state.js", "r", encoding="utf-8") as f:
        state_js = f.read()
    assert "readingMode" in state_js
    assert "setReadingMode" in state_js
    assert "toggleReadingMode" in state_js

    with open("css/components.css", "r", encoding="utf-8") as f:
        comp_css = f.read()
    assert ".verse-compare-card" in comp_css
    assert ".compare-trans-row" in comp_css
    assert ".compare-trans-pill" in comp_css


def test_mobile_full_screen_reading_and_header_compare_bar():
    """Kiểm tra màn hình di động ẩn hoàn toàn thanh đáy 5 nút, dành 100% diện tích đọc và giữ nút Đối Chiếu trên header"""
    with open("css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    # Thanh điều hướng đáy và banner bị ẩn trên mobile
    assert "#mobile-bottom-nav" in layout_css
    assert ".mobile-bottom-nav" in layout_css
    assert "display: none !important" in layout_css

    # Nút đối chiếu và theme button xuất hiện trên mobile header
    assert "#mobile-header-compare-btn" in layout_css
    assert "#theme-toggle-btn" in layout_css
    assert "display: inline-flex !important" in layout_css

    with open("css/components.css", "r", encoding="utf-8") as f:
        comp_css = f.read()
    assert ".mobile-bottom-nav {\n    display: none !important;\n  }" in comp_css or "display: none !important" in comp_css


def test_mobile_equal_50_50_split_and_no_redundant_clutter():
    """Kiểm tra trên điện thoại khi đối chiếu chia đều 50/50 trên-dưới và ẩn toàn bộ mục thừa"""
    with open("css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    # Chia đều màn hình 50/50 giữa #app-body (trên) và #drawer-inspector (dưới)
    assert "calc((100vh - 46px) / 2)" in layout_css
    assert "calc((100dvh - 46px) / 2)" in layout_css
    assert "body.drawer-open #app-body" in layout_css

    # Ẩn toàn bộ các mục thừa khi đối chiếu trên điện thoại
    assert ".parallel-intro-banner" in layout_css
    assert ".parallel-card-footer-hint" in layout_css
    assert ".card-popout-btn" in layout_css
    assert "#drawer-verse-genre" in layout_css
    assert "body.drawer-open .chapter-header" in layout_css

    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    assert "parallel-intro-banner" in app_js
    assert "state.activeDrawerTab = 'parallel'" in app_js


