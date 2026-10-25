import os
import subprocess

def test_sticky_compact_chapter_bar_structure():
    with open("E:/kinhthanh/css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    # Desktop sticky compact chapter bar
    assert "position: sticky" in layout_css
    assert ".chapter-header" in layout_css
    assert ".chapter-step-btn" in layout_css
    assert ".chapter-center-info" in layout_css

    # Mobile sticky compact chapter bar
    assert "@media (max-width: 991px)" in layout_css
    assert "body.drawer-open .chapter-header" in layout_css


def test_mobile_header_no_clipping_and_no_wrap():
    with open("E:/kinhthanh/css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    # Verify flex-wrap nowrap on mobile header
    mobile_part = layout_css[layout_css.find("@media (max-width: 991px)"):]
    assert "flex-wrap: nowrap !important;" in mobile_part
    assert "overflow-x: auto !important;" in mobile_part or "overflow: hidden" in mobile_part


def test_admin_banner_three_modes_and_controls():
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    with open("E:/kinhthanh/js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # Modal controls
    assert 'id="admin-banner-type-select"' in html
    assert 'id="admin-banner-marquee-checkbox"' in html
    assert 'id="header-admin-banner-btn"' in html
    assert 'id="banner-badge"' in html
    assert 'id="banner-media-container"' in html
    assert 'id="banner-text-wrap"' in html

    # JS orchestration
    assert "banner-mode-ad" in app_js
    assert "banner-mode-announcement" in app_js
    assert "banner-mode-verse" in app_js
    assert "is-marquee" in app_js
    assert "openAdminBannerModal" in app_js
    assert "saveAdminBannerFromModal" in app_js


def test_classic_httlvn_portal_and_devotion_view():
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    with open("E:/kinhthanh/css/components.css", "r", encoding="utf-8") as f:
        components_css = f.read()

    with open("E:/kinhthanh/js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # HTML Elements
    assert 'id="portal-view"' in html
    assert 'data-view="portal"' in html
    assert 'portal-brand-bar' in html
    assert 'portal-grid-layout' in html
    assert 'portal-sidebar' in html
    assert 'TIỂU MỤC' in html
    assert 'id="portal-read-book-select"' in html
    assert 'id="portal-read-submit-btn"' in html
    assert 'id="portal-listen-btn"' in html
    assert 'id="portal-search-submit-btn"' in html
    assert 'TĨNH NGUYỆN' in html
    assert 'DƯỠNG LINH' in html
    assert 'portal-spiritual-table' in html

    # Specific scripture references from user screenshot
    assert 'Ha-ba-cúc 3:19' in html
    assert 'Giê-rê-mi 20' in html
    assert 'Mác 14:12-15:47' in html
    assert 'Lu-ca 21-22' in html
    assert 'Gióp 22' in html
    assert 'Cảm thấy buồn rầu' in html
    assert 'Giô-suê 1:1-9' in html
    assert 'Rô-ma 8' in html
    assert 'Thi-thiên 23' in html

    # CSS styles
    assert "#portal-view" in components_css
    assert ".portal-container" in components_css
    assert ".portal-brand-bar" in components_css
    assert ".portal-card" in components_css
    assert ".spiritual-guide-table" in components_css

    # JS wiring
    assert "initPortalView" in app_js
    assert "renderPortalView" in app_js
