import os

def test_bible_engine_file_exists():
    assert os.path.exists("js/bible-engine.js"), "js/bible-engine.js is missing"
    assert os.path.exists("css/components.css"), "css/components.css is missing"

def test_bible_engine_contract():
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class BibleEngine" in content or "export const BibleEngine" in content
    assert "loadBooks" in content
    assert "loadPassage" in content
    assert "renderChapterHTML" in content
    assert "getParallelVerses" in content
    assert "searchScripture" in content
    assert "diffWords" in content or "highlightDifferences" in content

def test_components_css_styles():
    with open("css/components.css", "r", encoding="utf-8") as f:
        content = f.read()

    assert ".parallel-grid" in content or ".parallel-verse-card" in content
    assert ".verse-row" in content or ".verse-item" in content
    assert ".diff-highlight" in content or ".word-diff" in content
    assert ".search-dropdown" in content
    assert ".modal-card" in content
