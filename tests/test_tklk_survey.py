import os
import json
import pytest

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'tklk')
INDEX_FILE = os.path.join(DATA_DIR, 'tklk-index.json')
CHAPTERS_DIR = os.path.join(DATA_DIR, 'chapters')
JS_FILE = os.path.join(os.path.dirname(__file__), '..', 'js', 'app.js')
CSS_FILE = os.path.join(os.path.dirname(__file__), '..', 'css', 'components.css')
HTML_FILE = os.path.join(os.path.dirname(__file__), '..', 'index.html')


def test_tklk_index_exists_and_valid():
    """Verify tklk-index.json exists, is valid JSON, and contains 114 chapters."""
    assert os.path.exists(INDEX_FILE), f"Missing {INDEX_FILE}"
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    assert isinstance(data, list), "tklk-index.json should be a list"
    assert len(data) == 114, f"Expected 114 chapters, got {len(data)}"
    
    # Check required fields
    required_keys = {'id', 'title', 'category', 'category_name', 'book_id', 'word_count', 'summary'}
    for idx, item in enumerate(data, start=1):
        assert required_keys.issubset(item.keys()), f"Item {idx} missing required keys"
        assert item['id'] == idx, f"Expected id {idx}, got {item['id']}"
        assert len(item['title']) > 0, f"Empty title for item {idx}"
        assert len(item['category']) > 0, f"Empty category for item {idx}"
        assert item['word_count'] > 0, f"Zero word count for item {idx}"


def test_tklk_category_distribution():
    """Verify category counts cover OT, NT, Church History, Canon, etc."""
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    categories = {}
    for item in data:
        cat = item['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    assert categories.get('ot') == 38, f"Expected 38 OT chapters, got {categories.get('ot')}"
    assert categories.get('nt') == 27, f"Expected 27 NT chapters, got {categories.get('nt')}"
    assert categories.get('church_history') == 21, f"Expected 21 Church History chapters, got {categories.get('church_history')}"
    assert categories.get('christian_life') == 14, f"Expected 14 Christian Life chapters, got {categories.get('christian_life')}"
    assert categories.get('intertestament') == 6, f"Expected 6 Intertestamental chapters, got {categories.get('intertestament')}"
    assert categories.get('canon') == 5, f"Expected 5 Canon chapters, got {categories.get('canon')}"
    assert categories.get('intro') == 3, f"Expected 3 Intro chapters, got {categories.get('intro')}"


def test_tklk_substantive_word_count():
    """Verify Halley's Bible Handbook text is authentic and substantial (> 400,000 words)."""
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_words = sum(item['word_count'] for item in data)
    assert total_words > 400_000, f"Expected > 400,000 words, got {total_words}"


def test_tklk_all_114_chapters_exist():
    """Verify all individual chapter JSON files 1 to 114 exist in data/tklk/chapters/."""
    assert os.path.exists(CHAPTERS_DIR), f"Missing {CHAPTERS_DIR}"
    
    for ch_id in range(1, 115):
        ch_file = os.path.join(CHAPTERS_DIR, f"{ch_id}.json")
        assert os.path.exists(ch_file), f"Missing chapter file: {ch_file}"
        
        with open(ch_file, 'r', encoding='utf-8') as f:
            ch_data = json.load(f)
        
        assert ch_data['id'] == ch_id
        assert 'content_html' in ch_data
        assert len(ch_data['content_html']) > 100, f"Chapter {ch_id} has insufficient content"
        # Ensure no residual unparsed FrontPage/Word tags
        assert '<script' not in ch_data['content_html'].lower(), f"Script tag leak in chapter {ch_id}"
        assert '<style' not in ch_data['content_html'].lower(), f"Style tag leak in chapter {ch_id}"


def test_tklk_book_id_mappings():
    """Verify standard Bible books have valid 3-letter codes."""
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    mapped_books = [item for item in data if item['book_id']]
    # Genesis, Matthew, Revelation should be mapped
    book_ids = {item['book_id'] for item in mapped_books}
    assert 'GEN' in book_ids, "GEN should be in mapped book_ids"
    assert 'MAT' in book_ids, "MAT should be in mapped book_ids"
    assert 'REV' in book_ids, "REV should be in mapped book_ids"
    assert len(book_ids) >= 60, f"Expected at least 60 mapped Bible books, got {len(book_ids)}"


def test_tklk_js_methods_implemented():
    """Verify renderSurveyView, renderSurveyChapter, renderUtilitySurvey, openTklkChapter exist in js/app.js."""
    assert os.path.exists(JS_FILE)
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js_code = f.read()
    
    assert 'renderSurveyView' in js_code, "renderSurveyView missing in app.js"
    assert 'renderSurveyChapter' in js_code, "renderSurveyChapter missing in app.js"
    assert 'renderUtilitySurvey' in js_code, "renderUtilitySurvey missing in app.js"
    assert 'updateTklkDirectoryList' in js_code, "updateTklkDirectoryList missing in app.js"
    assert 'openTklkChapter' in js_code, "openTklkChapter missing in app.js"
    assert 'tklk-index.json' in js_code, "tklk-index.json reference missing in app.js"
    assert 'data/tklk/chapters/' in js_code, "tklk chapters path missing in app.js"
    assert 'btn-open-drawer-tklk' in js_code, "Drawer context integration missing in app.js"


def test_tklk_html_navigation_and_view():
    """Verify nav-btn-survey, #survey-view, and mobile drawer link exist in index.html."""
    assert os.path.exists(HTML_FILE)
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    
    assert 'data-view="survey"' in html, "Missing data-view='survey' in subnav"
    assert 'nav-btn-survey' in html, "Missing nav-btn-survey class in subnav"
    assert 'id="survey-view"' in html, "Missing #survey-view in index.html"
    assert 'id="survey-page-container"' in html, "Missing #survey-page-container in index.html"
    assert 'data-nav="survey"' in html, "Missing data-nav='survey' in mobile drawer"


def test_tklk_css_styles_defined():
    """Verify .tklk-* and .survey-* classes are defined in css/components.css."""
    assert os.path.exists(CSS_FILE)
    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        css_code = f.read()
    
    expected_classes = [
        '.survey-page-container',
        '.survey-hero-card',
        '.survey-category-nav',
        '.survey-cat-pill',
        '.tklk-search-bar',
        '.tklk-search-input',
        '.tklk-grid',
        '.tklk-card',
        '.tklk-reader-toolbar',
        '.tklk-reader-content'
    ]
    for cls in expected_classes:
        assert cls in css_code, f"CSS class {cls} missing in components.css"
def test_tklk_audio_narration_integrated():
    with open(JS_FILE, "r", encoding="utf-8") as f:
        js = f.read()
    assert "toggleSurveyAudioNarration" in js, "Missing toggleSurveyAudioNarration in app.js"
    assert "startSurveyAudioNarration" in js, "Missing startSurveyAudioNarration in app.js"
    assert "stopSurveyAudioNarration" in js, "Missing stopSurveyAudioNarration in app.js"
    assert "btn-survey-audio" in js, "Missing btn-survey-audio in app.js"

    with open(CSS_FILE, "r", encoding="utf-8") as f:
        css = f.read()
    assert ".tklk-paragraph-reading" in css, "Missing .tklk-paragraph-reading in components.css"


def test_tklk_simple_classic_toc_matching_vietchristian():
    """Verify classic simple numbered list TOC matching VietChristian aesthetic."""
    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        css = f.read()
    assert '.tklk-simple-toc-wrapper' in css, 'Missing .tklk-simple-toc-wrapper in components.css'
    assert '.tklk-simple-list' in css, 'Missing .tklk-simple-list in components.css'
    assert '.tklk-simple-item' in css, 'Missing .tklk-simple-item in components.css'
    assert '.tklk-simple-link' in css, 'Missing .tklk-simple-link in components.css'
    assert '.tklk-simple-title' in css, 'Missing .tklk-simple-title in components.css'

    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()
    assert 'tklk-simple-toc-wrapper' in js, 'Missing tklk-simple-toc-wrapper in app.js'
    assert 'survey-simple-list' in js, 'Missing survey-simple-list in app.js'
    assert 'tklk-simple-title' in js, 'Missing tklk-simple-title in app.js'
