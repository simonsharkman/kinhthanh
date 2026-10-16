import os
import re

def test_ui_foundation_files_exist():
    required_files = [
        "index.html",
        "css/design-tokens.css",
        "css/layout.css",
        "css/animations.css"
    ]
    for rel_path in required_files:
        assert os.path.exists(rel_path), f"File {rel_path} does not exist"

def test_design_tokens_css_contains_themes_and_colors():
    with open("css/design-tokens.css", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check HSL color variables
    assert "--bg-primary" in content
    assert "--accent-gold" in content
    assert "--theme-parchment" in content or "data-theme=\"parchment\"" in content
    # Check 8 genre colors
    assert "--genre-torah" in content
    assert "--genre-poetry" in content
    assert "--genre-prophecy" in content
    assert "--genre-gospels" in content
    assert "--genre-epistles" in content
    assert "--genre-apocalyptic" in content

def test_index_html_semantic_structure():
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    assert "<!DOCTYPE html>" in content
    assert "Logos MultiVerse" in content
    # Check key regions
    assert "id=\"admin-banner-container\"" in content
    assert "id=\"main-header\"" in content
    assert "id=\"focus-reader\"" in content
    assert "id=\"drawer-inspector\"" in content
    assert "id=\"genre-filter-bar\"" in content
    assert "id=\"version-selector-modal\"" in content

def test_drawer_side_by_side_split_view():
    with open("css/layout.css", "r", encoding="utf-8") as f:
        layout_css = f.read()

    assert "body.drawer-open" in layout_css
    assert "margin-right: var(--drawer-width)" in layout_css
    assert "body.drawer-open #focus-reader" in layout_css or "#app-body.drawer-open #focus-reader" in layout_css

    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    assert "toggleDrawer" in app_js
    assert "drawer-open" in app_js
    assert "scrollIntoView" in app_js
