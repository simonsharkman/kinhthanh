import os

def test_passage_preview_modal_structure():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Verify preview modal
    assert 'id="passage-preview-modal"' in html
    assert 'id="preview-passage-title"' in html
    assert 'id="preview-passage-body"' in html
    assert 'id="preview-close-btn"' in html
    assert 'id="preview-goto-chapter-btn"' in html

    # Verify drawer inline version selector bar
    assert 'id="drawer-version-bar"' in html
    assert 'id="drawer-version-chips"' in html
    assert 'id="drawer-manage-versions-btn"' in html

def test_passage_preview_code_contract():
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        be_js = f.read()
    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    assert "parseReference" in be_js
    assert "getVersesByRef" in be_js

    assert "openPassagePreviewDialog" in app_js
    assert "renderDrawerVersionChips" in app_js
    
    # Ensure no alert is used for crossref pills
    assert "alert(`Khám phá phân đoạn:" not in app_js
    assert "alert(`[${ref}]" not in app_js

def test_components_css_preview_styles():
    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".passage-preview-card" in css
    assert ".passage-preview-body" in css
    assert ".preview-verse-row" in css
    assert ".drawer-version-bar" in css
    assert ".drawer-vchip" in css
