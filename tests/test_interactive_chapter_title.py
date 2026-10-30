# -*- coding: utf-8 -*-
"""
Test Suite: Interactive Clickable Chapter Title (Milestone 55 & Milestone 59)
Verifies:
1. Clicking book name (TÊN SÁCH, e.g. A-mốt) in reader title triggers 66 books list.
2. Clicking chapter part (ĐOẠN, e.g. Đoạn 3) directly opens chapter selector for that book.
3. Clicking version part (BẢN, e.g. BDY / BTT) opens primary version modal selector.
4. Elimination of duplicate redundant chapter badge in reader and parallel canvas.
5. Chapter title button styling, active chapter highlight, and overlay click dismissal.
"""

import os
import pytest

BIBLE_ENGINE_PATH = r"E:\kinhthanh\js\bible-engine.js"
APP_JS_PATH = r"E:\kinhthanh\js\app.js"
CSS_COMPONENTS_PATH = r"E:\kinhthanh\css\components.css"
CSS_LAYOUT_PATH = r"E:\kinhthanh\css\layout.css"


def test_bible_engine_renders_clickable_title_buttons_triad():
    assert os.path.exists(BIBLE_ENGINE_PATH)
    with open(BIBLE_ENGINE_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # TÊN SÁCH button
    assert "chapter-title-book-btn" in js
    assert "reader-book-picker-btn" in js

    # ĐOẠN button
    assert "chapter-title-chap-btn" in js
    assert "reader-chapter-picker-btn" in js

    # BẢN button (Milestone 59)
    assert "chapter-title-ver-btn" in js
    assert "reader-version-picker-btn" in js

    # Separator
    assert "chapter-title-sep" in js

    # Redundant chapter-badge removed from renderChapterHTML
    assert '<span class="chapter-badge"' not in js


def test_app_js_binds_title_click_listeners_and_version_selector():
    assert os.path.exists(APP_JS_PATH)
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # Book & Chapter bindings
    assert "readerContainer.querySelectorAll('.chapter-title-book-btn')" in js
    assert "readerContainer.querySelectorAll('.chapter-title-chap-btn')" in js
    assert "this.openChaptersSelector(state.currentBook)" in js
    assert "active-ch" in js

    # Version binding (Milestone 59)
    assert "readerContainer.querySelectorAll('.chapter-title-ver-btn')" in js
    assert "this.populatePrimaryVersionSelector()" in js
    assert "primary-version-modal" in js

    # Parallel version binding
    assert "readerContainer.querySelectorAll('.chapter-title-parallel-ver-btn')" in js

    # Overlay backdrop click dismissal
    assert "document.querySelectorAll('.modal-overlay')" in js


def test_css_interactive_title_styles_and_badge_cleanup():
    assert os.path.exists(CSS_COMPONENTS_PATH)
    with open(CSS_COMPONENTS_PATH, "r", encoding="utf-8") as f:
        comp_css = f.read()

    assert ".chapter-title-btn" in comp_css
    assert ".chapter-title-sep" in comp_css
    assert ".chapter-title-ver-btn" in comp_css
    assert ".chapter-btn.active-ch" in comp_css

    assert os.path.exists(CSS_LAYOUT_PATH)
    with open(CSS_LAYOUT_PATH, "r", encoding="utf-8") as f:
        layout_css = f.read()

    assert ".chapter-badge" in layout_css
    assert "display: none !important;" in layout_css
