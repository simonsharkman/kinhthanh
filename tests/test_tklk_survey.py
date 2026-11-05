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

def test_tklk_chapter_jump_and_reading_highlight():
    """Verify chapter jump modal, jump buttons, leaf paragraph selection, and click-to-read."""
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        html = f.read()
    assert 'id="tklk-chapter-jump-modal"' in html, "Missing #tklk-chapter-jump-modal in index.html"
    assert 'id="tklk-quick-num-input"' in html, "Missing #tklk-quick-num-input in index.html"
    assert 'id="btn-tklk-quick-num-go"' in html, "Missing #btn-tklk-quick-num-go in index.html"
    assert 'id="tklk-jump-search-input"' in html, "Missing #tklk-jump-search-input in index.html"
    assert 'id="tklk-jump-grid-container"' in html, "Missing #tklk-jump-grid-container in index.html"

    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()
    assert 'btn-survey-chapter-jump' in js, "Missing #btn-survey-chapter-jump in app.js"
    assert 'btn-survey-footer-jump' in js, "Missing #btn-survey-footer-jump in app.js"
    assert 'openTklkChapterJumpModal' in js, "Missing openTklkChapterJumpModal in app.js"
    assert 'playSurveyAudioFromElement' in js, "Missing playSurveyAudioFromElement in app.js"
    # Verify leaf element selection does not include raw div
    assert "contentEl.querySelectorAll('p, h1, h2, h3, h4, h5, li, blockquote')" in js, "Must query leaf elements only"

    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        css = f.read()
    assert '.tklk-jump-item-btn' in css, "Missing .tklk-jump-item-btn in components.css"
    assert '.tklk-jump-item-active' in css, "Missing .tklk-jump-item-active in components.css"
    assert '.tklk-paragraph-reading' in css, "Missing .tklk-paragraph-reading in components.css"


def test_tklk_modal_chapter_jump_and_audio_integration():
    """Verify that the Modal view (#portal-utility-modal / openTklkChapter) has complete jump & audio controls."""
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()

    assert 'btn-tklk-chapter-jump' in js, "Missing #btn-tklk-chapter-jump in modal reader toolbar"
    assert 'btn-tklk-footer-jump' in js, "Missing #btn-tklk-footer-jump in modal footer nav"
    assert 'tklk-modal-audio-bar' in js, "Missing #tklk-modal-audio-bar in modal reader view"
    assert 'btn-tklk-modal-audio-play' in js, "Missing #btn-tklk-modal-audio-play in modal audio bar"
    assert 'tklk-modal-voice-mode' in js, "Missing #tklk-modal-voice-mode in modal audio bar"
    assert 'this.currentTklkChapterId = id;' in js, "Must record currentTklkChapterId in openTklkChapter"
    assert 'this.activeSurveyChapterId = id;' in js, "Must record activeSurveyChapterId in openTklkChapter"

    # Verify jump modal routes to openTklkChapter if portal modal is open
    assert "document.getElementById('portal-utility-modal')?.classList.contains('hidden')" in js, "Must detect if portal utility modal is open when jumping chapters"


def test_tklk_audio_chapter_change_synchronization():
    """Verify that clicking Next/Prev or jumping chapters switches and synchronizes audio to the exact new chapter."""
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()

    # Modal view synchronization
    assert 'openTklkChapter(chapterId, autoPlay = false)' in js, "openTklkChapter must accept autoPlay parameter"
    assert 'triggerModalPrev' in js, "Must define triggerModalPrev in openTklkChapter"
    assert 'triggerModalNext' in js, "Must define triggerModalNext in openTklkChapter"
    assert 'this.openTklkChapter(id - 1, isAudioActive)' in js, "Modal prev button must propagate isAudioActive"
    assert 'this.openTklkChapter(id + 1, isAudioActive)' in js, "Modal next button must propagate isAudioActive"

    # Full page view synchronization
    assert 'renderSurveyChapter(chapterId, autoPlay = false)' in js, "renderSurveyChapter must accept autoPlay parameter"
    assert 'triggerSurveyPrev' in js, "Must define triggerSurveyPrev in renderSurveyChapter"
    assert 'triggerSurveyNext' in js, "Must define triggerSurveyNext in renderSurveyChapter"
    assert 'this.renderSurveyChapter(id - 1, isAudioActive)' in js, "Survey prev button must propagate isAudioActive"
    assert 'this.renderSurveyChapter(id + 1, isAudioActive)' in js, "Survey next button must propagate isAudioActive"

    # Audio element time update synchronization
    assert 'audioEl.ontimeupdate' in js, "Must synchronize audioEl with leaf paragraph highlight"
    assert 'audioEl.onended' in js, "Must handle audioEl onended cleanly"

    # Jump modal synchronization
    assert 'this.openTklkChapter(chId, isAudioActive)' in js, "Jump modal grid must propagate isAudioActive to openTklkChapter"
    assert 'this.openTklkChapter(val, isAudioActive)' in js, "Jump modal num input must propagate isAudioActive to openTklkChapter"


def test_tklk_voice_switching_and_stop_control():
    """Verify voice mode selection change listener, voice persistence, stop controls, and chapter 39 audio."""
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()

    # Modal voice change wiring
    assert "modalVoiceModeSel?.addEventListener('change'" in js, "modalVoiceModeSel must have a change event listener"
    assert "this.tklkVoiceMode = chosenVoice" in js, "Must update this.tklkVoiceMode upon selection"
    assert "localStorage.setItem('tklk_voice_mode'" in js, "Must persist chosen voice to localStorage"

    # Stop button safety
    assert "this.tklkAudioActive = false;" in js, "stopSurveyAudioNarration must set tklkAudioActive to false"
    assert "err.error === 'canceled' || err.error === 'interrupted'" in js, "utterance.onerror must ignore canceled/interrupted speech"

    # Audio seeking in MP3 mode
    assert "seekToParagraph" in js, "Must provide seeking support for MP3 audio"

    # Chapter 39 audio file
    ch39_audio = os.path.join(DATA_DIR, 'audio', '39.mp3')
    assert os.path.exists(ch39_audio), f"Chapter 39 audio file must exist at {ch39_audio}"
    assert os.path.getsize(ch39_audio) > 100_000, "Chapter 39 audio file must be valid (>100KB)"

    # CSS styling for stop button
    with open(CSS_FILE, 'r', encoding='utf-8') as f:
        css = f.read()
    assert "#btn-tklk-modal-audio-stop" in css, "Must style #btn-tklk-modal-audio-stop in components.css"



def test_tklk_timeline_date_pronunciation_normalization():
    """Verify historical timeline date pronunciation rules:
    (639-608 T.C) -> năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước Chúa
    50 S.C -> năm năm mươi sau Chúa
    """
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()

    # JS implementations
    assert "vnNumberToWords(n)" in js, "Must define vnNumberToWords in js/app.js"
    assert "trước Chúa" in js, "Must convert T.C to trước Chúa in js/app.js"
    assert "sau Chúa" in js, "Must convert S.C to sau Chúa in js/app.js"

    # Python audio generator implementation
    import sys
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    from scripts.generate_tklk_audio import normalize_timeline_and_scripture, vn_number_to_words

    # User test cases
    assert normalize_timeline_and_scripture("(639-608 T.C)") == "năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước Chúa"
    assert normalize_timeline_and_scripture("(606-586 T.C.)") == "năm sáu trăm lẻ sáu đến năm trăm tám mươi sáu trước Chúa"
    assert normalize_timeline_and_scripture("50 S.C") == "năm năm mươi sau Chúa"
    assert normalize_timeline_and_scripture("(50 S.C.)") == "năm năm mươi sau Chúa"
    assert normalize_timeline_and_scripture("(100-167 S.C)") == "năm một trăm đến một trăm sáu mươi bảy sau Chúa"
    assert normalize_timeline_and_scripture("(886 T.C)") == "năm tám trăm tám mươi sáu trước Chúa"
    assert normalize_timeline_and_scripture("(536 T.C.)") == "năm năm trăm ba mươi sáu trước Chúa"
    assert normalize_timeline_and_scripture("khoảng 1400-1100 T.C") == "khoảng năm một nghìn bốn trăm đến một nghìn một trăm trước Chúa"
    assert normalize_timeline_and_scripture("1100 năm T.C") == "một nghìn một trăm năm trước Chúa"
    assert normalize_timeline_and_scripture("Mác 3:13") == "Mác đoạn 3 câu 13"
    assert normalize_timeline_and_scripture("TK 1") == "thế kỷ thứ nhất"
    assert normalize_timeline_and_scripture("thế kỷ II") == "thế kỷ thứ hai"

    # OmniVoice generator normalization
    import sys
    sys.path.insert(0, r"E:\Omnivoice")
    from generate_voice import normalize_text_for_speech

    assert normalize_text_for_speech("(639-608 T.C)") == "năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước Chúa"
    assert normalize_text_for_speech("(606-586 T.C.)") == "năm sáu trăm lẻ sáu đến năm trăm tám mươi sáu trước Chúa"
    assert normalize_text_for_speech("50 S.C") == "năm năm mươi sau Chúa"
    assert normalize_text_for_speech("(50 S.C.)") == "năm năm mươi sau Chúa"


def test_female_voice_d_normalization_and_deep_expression():
    """Verify complete eradication of U+00D0 Eth characters (Đ pronounced as D),
    abbreviation expansions for Đ. / đ., and warm intimate pitch tuning (0.96) for female voice.
    """
    with open(JS_FILE, 'r', encoding='utf-8') as f:
        js = f.read()

    # JS normalization rules
    assert r"\u00d0" in js, "Must clean \\u00d0 in app.js"
    assert r"D[\u0335\u0336]" in js, "Must normalize combining stroke D in app.js"
    assert r"đoạn $2" in js, "Must expand Đ. / đ. abbreviations in app.js"
    assert "utterance.pitch = 0.96;" in js, "Female voice Hoài My must use warm, deep expressive pitch 0.96"

    # Verify zero corrupt Eth characters in all TKLK chapters
    ch_dir = os.path.join(DATA_DIR, 'chapters')
    for fname in os.listdir(ch_dir):
        if fname.endswith('.json'):
            fpath = os.path.join(ch_dir, fname)
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
            assert '\u00d0' not in content, f"Found corrupt U+00D0 in {fname}"
            assert '\u00f0' not in content, f"Found corrupt U+00F0 in {fname}"

    # Python audio generator tests
    from scripts.generate_tklk_audio import normalize_timeline_and_scripture
    assert normalize_timeline_and_scripture("\u00d0\u1ee9c Ch\u00faa Tr\u1edd\u0069") == "Đức Chúa Trời"
    assert normalize_timeline_and_scripture("\u00d0a-v\u00edt") == "Đa-vít"
    assert normalize_timeline_and_scripture("\u00d0o\u1ea1n 1") == "Đoạn 1"
    assert normalize_timeline_and_scripture("đ. 2") == "đoạn 2"
    assert normalize_timeline_and_scripture("mục Đ") == "mục đê"

    # OmniVoice generator tests
    import sys
    sys.path.insert(0, r"E:\Omnivoice")
    from generate_voice import normalize_text_for_speech, VOICE_PROFILES

    assert normalize_text_for_speech("\u00d0\u1ee9c Ch\u00faa Tr\u1edd\u0069") == "Đức Chúa Trời"
    assert normalize_text_for_speech("\u00d0a-v\u00edt") == "Đa-vít"
    assert normalize_text_for_speech("đ. 1") == "đoạn 1"
    assert "hoaimy" in VOICE_PROFILES, "OmniVoice must include official 'hoaimy' profile"
    assert VOICE_PROFILES["hoaimy"]["edge_voice"] == "vi-VN-HoaiMyNeural"
    assert VOICE_PROFILES["hoaimy"]["pitch"] == "-1Hz"

