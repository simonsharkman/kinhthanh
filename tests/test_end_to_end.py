import os

def test_app_js_exists():
    assert os.path.exists("js/app.js"), "js/app.js is missing"

def test_app_js_orchestrator_contract():
    with open("js/app.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Verify imports
    assert "bibleEngine" in content
    assert "hermeneuticsEngine" in content
    assert "mediaEngine" in content
    assert "aiAssistant" in content
    assert "blogSystem" in content
    assert "bereaGuardian" in content
    assert "state" in content

    # Verify key interaction handlers
    assert "initApp" in content or "DOMContentLoaded" in content
    assert "renderCurrentView" in content or "renderChapter" in content
    assert "renderDrawerContent" in content
    assert "handleSearch" in content or "omni-search" in content
    assert "openAdminBannerModal" in content or "admin-banner" in content
    assert "toggleTheme" in content or "theme-toggle" in content

def test_html_all_modals_connected():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # All 4 modals must exist in index.html
    assert "id=\"book-picker-modal\"" in html
    assert "id=\"version-selector-modal\"" in html
    assert "id=\"admin-banner-modal\"" in html
    assert "id=\"admin-auth-modal\"" in html

    # Script module must be app.js
    assert "src=\"js/app.js\"" in html

def test_genre_bookshelf_integration():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert "id=\"genre-bookshelf\"" in html
    assert "class=\"genre-bookshelf hidden\"" in html

    with open("js/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    assert "renderGenreBookshelf" in js
    assert "selectShelfBook" in js
    assert "openPassageFromShelf" in js
    assert "shelf-chapters-tray" in js
    assert "shelf-book-card" in js

    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".genre-bookshelf" in css
    assert ".shelf-book-card" in css
    assert ".shelf-chapters-tray" in css
    assert ".tray-chapter-btn" in css

def test_testament_tabs_in_book_picker():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert "data-testament=\"OT\"" in html
    assert "data-testament=\"NT\"" in html

    with open("js/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    assert "populateBookPicker(testament" in js
    assert "b.testament === testament" in js
    assert "testament-tab" in js


