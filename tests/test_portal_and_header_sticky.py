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


def test_portal_as_primary_site_foundation():
    """Kiểm tra Cổng Tĩnh Nguyện & Dưỡng Linh được thiết lập làm nền chính cho toàn bộ trang web"""
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    with open("E:/kinhthanh/js/state.js", "r", encoding="utf-8") as f:
        state_js = f.read()

    with open("E:/kinhthanh/js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    with open("E:/kinhthanh/css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    with open("E:/kinhthanh/css/components.css", "r", encoding="utf-8") as f:
        components_css = f.read()

    # 1. Default active view is portal in HTML and state.js
    assert '<div id="portal-view" class="view-panel active">' in html
    assert '<div id="focus-reader" class="view-panel hidden">' in html
    assert "this.activeView = 'portal';" in state_js

    # 2. Main header Olive Green gradient theme
    assert "#4b5e28" in layout_css
    assert "#36441c" in layout_css or "#39481b" in layout_css
    assert 'id="site-subnav-bar"' in html

    # 3. Tab switcher and embedded reader panel in portal
    assert 'portal-main-tabs' in html
    assert 'id="portal-tab-devotion-btn"' in html
    assert 'id="portal-tab-reader-btn"' in html
    assert 'id="portal-reader-chapter-container"' in html
    assert 'id="portal-back-to-devotion-btn"' in html

    # 4. CSS styling for tabs and reader inside portal
    assert ".portal-main-tabs" in components_css
    assert ".portal-tab-btn" in components_css
    assert ".portal-tab-panel" in components_css
    assert "#portal-reader-chapter-container" in components_css

    # 5. JS orchestration
    assert "switchPortalTab" in app_js
    assert "portal-passage-tab-label" in app_js
    assert "portal-reader-chapter-container" in app_js


def test_nav_tabs_moved_to_subnav_and_clean_header():
    """Kiểm tra logo V và slogan dài được bỏ, các tab điều hướng được chuyển xuống thanh subnav cố định"""
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Circle V icon removed from header
    assert '<span class="portal-logo-v">V</span>' not in html

    # 2. Brand sub-title removed from brand-title in main-header
    assert 'Kinh Thánh</h1>' in html

    # 3. Navigation links are located in site-subnav-bar
    subnav_start = html.find('id="site-subnav-bar"')
    assert subnav_start != -1
    subnav_section = html[subnav_start:subnav_start + 1400]

    assert 'data-view="portal"' in subnav_section
    assert 'data-view="bible"' in subnav_section
    assert 'data-view="tsk"' in subnav_section
    assert 'data-view="blog"' in subnav_section
    assert 'data-view="community"' in subnav_section
    assert 'data-view="media"' in subnav_section
    assert 'data-view="donate"' in subnav_section
    assert 'id="site-subnav-search"' in subnav_section

    # 4. Dummy crossed-out buttons are removed from subnav
    assert 'id="site-subnav-playlist"' not in html
    assert 'id="site-subnav-newest"' not in html
    assert 'id="site-subnav-recent"' not in html
    assert 'id="site-subnav-popular"' not in html
    assert 'id="site-subnav-thanksgiving"' not in html



def test_portal_all_66_book_select_options_in_html():
    """Kiểm tra toàn bộ 4 dropdown sách trong Cổng Tĩnh Nguyện đều có sẵn 66 sách từ HTML tĩnh"""
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Read book select
    assert 'id="portal-read-book-select"' in html
    assert '<option value="GEN" selected>Sáng-thế Ký (GEN)</option>' in html
    assert '<option value="REV">Khải-huyền (REV)</option>' in html

    # 2. Listen book select
    assert 'id="portal-listen-book-select"' in html

    # 3. Search book range selects
    assert 'id="portal-search-from-book"' in html
    assert 'id="portal-search-to-book"' in html
    assert '<option value="REV" selected>Khải-huyền (REV)</option>' in html


def test_portal_utility_modal_and_audio_player_html_elements():
    """Kiểm tra các thành phần modal tiện ích và thanh audio player cố định trong HTML"""
    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Utility Modal
    assert 'id="portal-utility-modal"' in html
    assert 'id="portal-utility-title"' in html
    assert 'id="portal-utility-subtitle"' in html
    assert 'id="portal-utility-tabs"' in html
    assert 'id="portal-utility-body"' in html

    # Playlist Modal
    assert 'id="portal-playlist-modal"' in html
    assert 'id="portal-playlist-body"' in html
    assert 'id="btn-clear-playlist"' in html

    # Audio Player Bar & Studio Media Stream
    assert 'id="portal-audio-player-bar"' in html
    assert 'id="portal-audio-media-element"' in html
    assert 'id="audio-timeline-wrap"' in html
    assert 'id="audio-seek-slider"' in html
    assert 'id="audio-current-time"' in html
    assert 'id="audio-duration-time"' in html
    assert 'id="audio-player-title"' in html
    assert 'id="audio-player-subtitle"' in html
    assert 'id="audio-btn-play-pause"' in html
    assert 'id="audio-btn-stop"' in html
    assert 'id="audio-btn-next-verse"' in html
    assert 'id="audio-btn-prev-verse"' in html
    assert 'id="audio-speed-select"' in html

    # Toast Container
    assert 'id="app-toast-container"' in html


def test_portal_utility_and_audio_js_orchestration():
    """Kiểm tra mã nguồn JavaScript điều khiển âm thanh và các tiện ích Cổng Tĩnh Nguyện"""
    with open("E:/kinhthanh/js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # Audio controller
    assert "initAudioPlayerControls" in app_js
    assert "playChapterAudio" in app_js
    assert "speakCurrentVerse" in app_js
    assert "stopChapterAudio" in app_js
    assert "pauseChapterAudio" in app_js
    assert "resumeChapterAudio" in app_js
    assert "addToPlaylist" in app_js
    assert "openPlaylistModal" in app_js
    assert "showToast" in app_js

    # Utility modal controller
    assert "openPortalUtilityModal" in app_js
    assert "renderUtilityFavVerses" in app_js
    assert "renderUtilityQuiz" in app_js
    assert "renderUtilityResponsive" in app_js
    assert "renderUtilitySurvey" in app_js
    assert "renderUtilityStories" in app_js
    assert "renderUtilityDict" in app_js

    # Data imports
    assert "FAV_VERSES_DATA" in app_js
    assert "BIBLE_QUIZ_DATA" in app_js
    assert "RESPONSIVE_READINGS_DATA" in app_js
    assert "BIBLE_STORIES_DATA" in app_js
    assert "BIBLE_DICT_DATA" in app_js


def test_portal_data_repository_integrity():
    """Kiểm tra độ toàn vẹn của kho dữ liệu tiện ích portal-data.js"""
    with open("E:/kinhthanh/js/portal-data.js", "r", encoding="utf-8") as f:
        data_js = f.read()

    assert "export const FAV_VERSES_DATA =" in data_js
    assert "export const BIBLE_QUIZ_DATA =" in data_js
    assert "export const RESPONSIVE_READINGS_DATA =" in data_js
    assert "export const BIBLE_STORIES_DATA =" in data_js
    assert "export const BIBLE_DICT_DATA =" in data_js

    # Key scriptures in data
    assert "Giăng 3:16" in data_js
    assert "Phi-líp 4:6-7" in data_js
    assert "Thi-thiên 23:1-3" in data_js
    assert "Ha-ba-cúc 3:19" in data_js
    assert "Nô-ê" in data_js
    assert "Môi-se" in data_js
    assert "Đa-vít" in data_js

    # Studio Audio MP3 Canonical Mapping
    assert "export const BIBLE_BOOK_ORDER_MAP =" in data_js
    assert "export function getChapterAudioUrl(" in data_js
    assert "'GEN': 1" in data_js
    assert "'MAT': 40" in data_js
    assert "'REV': 66" in data_js


def test_admin_modal_scroll_and_confirmation_button():
    """Kiểm tra cấu trúc modal: Header và Footer cố định, Body cuộn mượt mà và nút Xác Nhận Cập Nhật luôn hiển thị."""
    with open("E:/kinhthanh/css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    with open("E:/kinhthanh/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    with open("E:/kinhthanh/js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # 1. CSS Flexbox Layout for Modals
    assert ".admin-modal-body" in css
    assert "overflow-y: auto" in css
    assert "flex-shrink: 0" in css
    assert "max-height: calc(100vh - 2rem)" in css

    # 2. Prominent Confirmation Button in Admin Banner Modal
    assert 'id="save-admin-banner-btn"' in html
    assert "Xác Nhận & Cập Nhật Banner" in html
    assert "fa-circle-check" in html

    # 3. Confirmation Feedback in JS
    assert "Đã xác nhận và cập nhật Banner thành công!" in app_js
