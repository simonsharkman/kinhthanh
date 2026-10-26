# -*- coding: utf-8 -*-
"""
Tests for Subitems (Tiểu Mục) Admin CMS & Dedicated Storage Persistence
Validates:
1. Dedicated static storage files in data/
2. Storage methods in js/storage.js
3. Modal structure & admin toolbar in index.html
4. Styling in css/components.css
5. App controller methods in js/app.js (open, edit, save, delete, reset)
"""
import os
import json
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def test_utility_static_json_storage_files():
    """Verify all 4 dedicated JSON files exist in data/ with valid schema."""
    files_to_check = {
        "utility-fav-verses.json": ["id", "text", "ref", "theme", "book", "ch"],
        "utility-quizzes.json": ["id", "question", "options", "correct", "ref"],
        "utility-stories.json": ["id", "title", "ref", "summary", "takeaway"],
        "utility-responsive.json": ["id", "title", "passage", "lines"]
    }
    
    for filename, required_keys in files_to_check.items():
        filepath = os.path.join(BASE_DIR, "data", filename)
        assert os.path.exists(filepath), f"File {filename} must exist in data/"
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert isinstance(data, list), f"{filename} content must be a JSON array"
        assert len(data) > 0, f"{filename} array must not be empty"
        first_item = data[0]
        for key in required_keys:
            assert key in first_item, f"Key '{key}' must be present in items of {filename}"

def test_storage_js_utility_persistence_methods():
    """Verify storage.js defines all getters, setters, and resetters for utilities."""
    storage_path = os.path.join(BASE_DIR, "js", "storage.js")
    with open(storage_path, "r", encoding="utf-8") as f:
        code = f.read()

    expected_methods = [
        "getUtilityFavVerses", "saveUtilityFavVerses", "resetUtilityFavVerses",
        "getUtilityQuizzes", "saveUtilityQuizzes", "resetUtilityQuizzes",
        "getUtilityStories", "saveUtilityStories", "resetUtilityStories",
        "getUtilityResponsiveReadings", "saveUtilityResponsiveReadings", "resetUtilityResponsiveReadings"
    ]
    for method in expected_methods:
        assert method in code, f"Method '{method}' must be defined in js/storage.js"

    # Verify keys
    assert "logos_pref_utility_fav_verses" in code
    assert "logos_pref_utility_quizzes" in code
    assert "logos_pref_utility_stories" in code
    assert "logos_pref_utility_responsive" in code

def test_index_html_utility_admin_elements():
    """Verify index.html contains admin editor modal, indicator, and toolbar."""
    html_path = os.path.join(BASE_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    assert 'id="portal-subitems-admin-indicator"' in html
    assert 'id="portal-utility-admin-actions"' in html
    assert 'id="btn-utility-admin-add"' in html
    assert 'id="btn-utility-admin-reset"' in html
    assert 'id="admin-utility-editor-modal"' in html
    assert 'id="admin-utility-editor-title"' in html
    assert 'id="admin-utility-editor-body"' in html
    assert 'id="btn-admin-save-utility-item"' in html

def test_components_css_utility_admin_styling():
    """Verify components.css contains rules for utility admin buttons and badges."""
    css_path = os.path.join(BASE_DIR, "css", "components.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    assert ".portal-utility-admin-actions" in css
    assert ".utility-admin-badge" in css
    assert ".utility-admin-item-actions" in css
    assert ".btn-utility-admin-edit" in css
    assert ".btn-utility-admin-delete" in css
    assert ".quiz-admin-card" in css
    assert ".quiz-admin-option.is-correct" in css

def test_app_js_utility_cms_controller():
    """Verify app.js wires and implements utility controller methods."""
    app_path = os.path.join(BASE_DIR, "js", "app.js")
    with open(app_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Controller methods
    assert "openPortalUtilityModal(" in code
    assert "renderUtilityFavVerses(" in code
    assert "renderUtilityQuiz(" in code
    assert "renderUtilityStories(" in code
    assert "renderUtilityResponsive(" in code
    assert "renderUtilitySchedule(" in code
    assert "openUtilityEditorModal(" in code
    assert "saveUtilityEditorForm(" in code
    assert "deleteUtilityItem(" in code
    assert "resetCurrentUtilityData(" in code

    # Storage integration calls
    assert "storage.getUtilityFavVerses" in code
    assert "storage.saveUtilityFavVerses" in code
    assert "storage.getUtilityQuizzes" in code
    assert "storage.saveUtilityQuizzes" in code
    assert "storage.getUtilityStories" in code
    assert "storage.saveUtilityStories" in code
    assert "storage.getUtilityResponsiveReadings" in code
    assert "storage.saveUtilityResponsiveReadings" in code

    # Role check and button bindings
    assert "portal-subitems-admin-indicator" in code
    assert "btn-utility-admin-add" in code
    assert "btn-utility-admin-reset" in code
    assert "btn-admin-save-utility-item" in code

def test_bible_dictionary_search_input_integrity_and_ime_stability():
    """Verify Bible Dictionary search bar preserves DOM element on input, preventing IME cursor jump / reversed text."""
    app_path = os.path.join(BASE_DIR, "js", "app.js")
    with open(app_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "renderUtilityDict(" in code
    assert "updateUtilityDictList(" in code
    assert "dict-search-input" in code
    assert "dict-search-clear" in code
    # Ensure input event calls updateUtilityDictList instead of recursively re-rendering the whole container
    assert "this.updateUtilityDictList(val, entriesList)" in code

    css_path = os.path.join(BASE_DIR, "css", "components.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    assert ".dict-search-bar" in css
    assert ".dict-search-icon" in css
    assert ".dict-clear-btn" in css

