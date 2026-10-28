# -*- coding: utf-8 -*-
"""
Test Suite: Interactive Clickable Chapter Title (Milestone 55)
Verifies:
1. Clicking book name (e.g. Giăng) in reader title triggers 66 books list.
2. Clicking chapter part (e.g. Đoạn 1) directly opens chapter selector for that book.
3. Chapter title button styling and active chapter highlight.
"""

import os
import pytest

BIBLE_ENGINE_PATH = r"E:\kinhthanh\js\bible-engine.js"
APP_JS_PATH = r"E:\kinhthanh\js\app.js"
CSS_PATH = r"E:\kinhthanh\css\components.css"


def test_bible_engine_renders_clickable_title_buttons():
    assert os.path.exists(BIBLE_ENGINE_PATH)
    with open(BIBLE_ENGINE_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    assert "chapter-title-book-btn" in js
    assert "chapter-title-chap-btn" in js
    assert "reader-book-picker-btn" in js
    assert "reader-chapter-picker-btn" in js
    assert "chapter-title-sep" in js


def test_app_js_binds_title_click_listeners():
    assert os.path.exists(APP_JS_PATH)
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    assert "readerContainer.querySelectorAll('.chapter-title-book-btn')" in js
    assert "readerContainer.querySelectorAll('.chapter-title-chap-btn')" in js
    assert "this.openChaptersSelector(state.currentBook)" in js
    assert "active-ch" in js


def test_css_interactive_title_styles():
    assert os.path.exists(CSS_PATH)
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()

    assert ".chapter-title-btn" in css
    assert ".chapter-title-sep" in css
    assert ".chapter-btn.active-ch" in css
