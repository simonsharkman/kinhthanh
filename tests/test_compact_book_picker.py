# -*- coding: utf-8 -*-
"""
Test Suite: Compact Book Picker Modal & Instant Search (Milestone 53)
Verifies:
1. Compact text-focused book items (no bulky boxes).
2. Book name and chapter count display on a single line.
3. Instant search bar to quickly find any book across OT & NT.
4. Clean header with compact top-right close button.
"""

import os
import pytest

INDEX_PATH = r"E:\kinhthanh\index.html"
APP_JS_PATH = r"E:\kinhthanh\js\app.js"
COMPONENTS_CSS_PATH = r"E:\kinhthanh\css\components.css"


def test_book_picker_modal_html_structure():
    assert os.path.exists(INDEX_PATH)
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    # Modal container and compact card
    assert 'id="book-picker-modal"' in html
    assert 'bpm-card' in html
    assert 'bpm-header' in html
    assert 'bpm-title' in html
    assert 'bpm-close-btn' in html

    # Instant Search Bar
    assert 'id="book-picker-search-bar"' in html
    assert 'id="book-picker-search-input"' in html
    assert 'id="book-picker-search-clear"' in html

    # Testament Tabs and Grids
    assert 'id="book-picker-tabs"' in html
    assert 'id="books-grid"' in html
    assert 'id="chapters-grid"' in html


def test_book_picker_js_search_and_render():
    assert os.path.exists(APP_JS_PATH)
    with open(APP_JS_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # populateBookPicker with search support
    assert 'populateBookPicker(testament = \'OT\', searchQuery = \'\')' in js
    assert 'book-search-empty' in js
    assert 'book-item-name' in js
    assert 'book-item-chaps' in js
    assert 'book-item-tag' in js

    # Search event bindings
    assert 'book-picker-search-input' in js
    assert 'book-picker-search-clear' in js


def test_book_picker_compact_css():
    assert os.path.exists(COMPONENTS_CSS_PATH)
    with open(COMPONENTS_CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()

    # Card & Header
    assert '.bpm-card' in css
    assert '.bpm-header' in css
    assert '.bpm-close-btn' in css

    # Search Bar
    assert '.book-picker-search-bar' in css
    assert '.book-search-input' in css
    assert '.book-search-clear' in css

    # Compact Book Item (No bulky box)
    assert '.book-card-item' in css
    assert 'background: transparent;' in css
    assert '.book-item-name' in css
    assert '.book-item-chaps' in css

    # Chapters Grid Header
    assert '.chapters-header' in css
    assert '.chapters-back-btn' in css
