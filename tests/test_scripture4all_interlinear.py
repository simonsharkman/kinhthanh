"""
Tests for Scripture4All Interlinear Integration
Verifies Hebrew OT (WLC) and Greek NT (ScrTR) transliteration, Strong's,
original literal glosses, and UI components.
"""

import os
import json
import pytest

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
INTERLINEAR_DIR = os.path.join(DATA_DIR, "interlinear")
PASSAGES_FILE = os.path.join(DATA_DIR, "default-bible-passages.json")

def test_scripture4all_mapping_completeness():
    """Verify all 66 canonical Bible books are mapped to Scripture4All prefixes"""
    from scripts.fetch_scripture4all_interlinear import SCRIPTURE4ALL_MAP
    assert len(SCRIPTURE4ALL_MAP) == 66
    ot_books = [k for k, v in SCRIPTURE4ALL_MAP.items() if v['testament'] == 'OT']
    nt_books = [k for k, v in SCRIPTURE4ALL_MAP.items() if v['testament'] == 'NT']
    assert len(ot_books) == 39
    assert len(nt_books) == 27

def test_scripture4all_url_generation():
    """Verify exact PDF URL generation according to official Scripture4All structure"""
    from scripts.fetch_scripture4all_interlinear import get_scripture4all_url
    # OT Hebrew
    assert get_scripture4all_url('GEN', 1) == "https://www.scripture4all.org/OnlineInterlinear/OTpdf/gen1.pdf"
    assert get_scripture4all_url('PSA', 23) == "https://www.scripture4all.org/OnlineInterlinear/OTpdf/psa23.pdf"
    assert get_scripture4all_url('ISA', 53) == "https://www.scripture4all.org/OnlineInterlinear/OTpdf/isa53.pdf"
    # NT Greek
    assert get_scripture4all_url('JHN', 1) == "https://www.scripture4all.org/OnlineInterlinear/NTpdf/joh1.pdf"
    assert get_scripture4all_url('MAT', 5) == "https://www.scripture4all.org/OnlineInterlinear/NTpdf/mat5.pdf"
    assert get_scripture4all_url('REV', 1) == "https://www.scripture4all.org/OnlineInterlinear/NTpdf/rev1.pdf"

def test_hebrew_ot_interlinear_data():
    """Verify authentic Hebrew word-by-word transliteration and gloss in Genesis 1"""
    gen1_file = os.path.join(INTERLINEAR_DIR, "GEN", "1.json")
    assert os.path.exists(gen1_file), "GEN 1 interlinear JSON file must exist"
    
    with open(gen1_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    assert data['testament'] == 'OT'
    assert data['language'] == 'Hebrew'
    assert data['total_verses'] == 31
    
    v1_words = data['verses']['1']
    assert len(v1_words) == 7
    # First word: בְּרֵאשִׁית
    w1 = v1_words[0]
    assert 'b·rashith' in w1['translit']
    assert 'beginning' in w1['gloss']
    assert 'H7225' in w1['strong']
    
    # Third word: אֱלֹהִים (Elohim)
    w3 = v1_words[2]
    assert 'aleim' in w3['translit']
    assert 'Elohim' in w3['gloss']
    assert 'H430' in w3['strong']

def test_greek_nt_interlinear_data():
    """Verify authentic Greek word-by-word transliteration, Strong's, and gloss in John 1"""
    jhn1_file = os.path.join(INTERLINEAR_DIR, "JHN", "1.json")
    assert os.path.exists(jhn1_file), "JHN 1 interlinear JSON file must exist"
    
    with open(jhn1_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    assert data['testament'] == 'NT'
    assert data['language'] == 'Greek'
    assert data['total_verses'] == 51
    
    v1_words = data['verses']['1']
    assert len(v1_words) >= 15
    # First word: en (G1722: IN)
    w1 = v1_words[0]
    assert w1['translit'] == 'en'
    assert w1['strong'] == 'G1722'
    assert w1['gloss'] == 'IN'
    
    # Word 5: logos (G3056: saying / word)
    w5 = v1_words[4]
    assert w5['translit'] == 'logos'
    assert w5['strong'] == 'G3056'
    assert 'word' in w5['gloss'].lower()

def test_default_passages_interlinear_enrichment():
    """Verify default-bible-passages.json is enriched with authentic interlinear string and tokens"""
    assert os.path.exists(PASSAGES_FILE)
    with open(PASSAGES_FILE, 'r', encoding='utf-8') as f:
        passages = json.load(f)
        
    # Check GEN.1
    gen1 = passages.get('GEN.1')
    assert gen1 is not None
    v1 = gen1['verses'][0]
    assert 'INTERLINEAR' in v1['translations']
    assert 'b·rashith' in v1['translations']['INTERLINEAR']
    assert 'H7225' in v1['translations']['INTERLINEAR']
    assert 'interlinear_words' in v1
    assert len(v1['interlinear_words']) == 7
    
    # Check JHN.1
    jhn1 = passages.get('JHN.1')
    assert jhn1 is not None
    jv1 = jhn1['verses'][0]
    assert 'INTERLINEAR' in jv1['translations']
    assert 'G1722' in jv1['translations']['INTERLINEAR']
    assert 'G3056' in jv1['translations']['INTERLINEAR']
    assert 'interlinear_words' in jv1
    assert len(jv1['interlinear_words']) >= 15

def test_frontend_interlinear_components():
    """Verify frontend code contains word tile renderer, PDF links, and CSS classes"""
    app_js = os.path.join(os.path.dirname(__file__), "..", "js", "app.js")
    engine_js = os.path.join(os.path.dirname(__file__), "..", "js", "bible-engine.js")
    css_file = os.path.join(os.path.dirname(__file__), "..", "css", "components.css")
    
    with open(app_js, 'r', encoding='utf-8') as f:
        app_content = f.read()
    with open(engine_js, 'r', encoding='utf-8') as f:
        engine_content = f.read()
    with open(css_file, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    # Bible Engine has URL helper
    assert 'getScripture4AllPdfUrl' in engine_content
    # App has word tile renderer
    assert 'renderInterlinearWordTiles' in app_content
    assert 'btn-s4a-link' in app_content
    # CSS has required classes
    assert '.interlinear-word-tile' in css_content
    assert '.tile-orig' in css_content
    assert '.tile-translit' in css_content
    assert '.tile-strong' in css_content
    assert '.tile-gloss' in css_content
    assert '.rtl-direction' in css_content

def test_three_tier_interlinear_hierarchy():
    """Verify exact 3-tier vertical stack:
    1. Top: Original text (Hebrew/Greek)
    2. Middle: Transliteration + Strong's code
    3. Bottom: English word translation (without Vietnamese subgloss displacing bottom)
    """
    app_js = os.path.join(os.path.dirname(__file__), "..", "js", "app.js")
    engine_js = os.path.join(os.path.dirname(__file__), "..", "js", "bible-engine.js")
    css_file = os.path.join(os.path.dirname(__file__), "..", "css", "components.css")
    
    with open(app_js, 'r', encoding='utf-8') as f:
        app_content = f.read()
    with open(engine_js, 'r', encoding='utf-8') as f:
        engine_content = f.read()
    with open(css_file, 'r', encoding='utf-8') as f:
        css_content = f.read()

    # 1. Bible Engine has fetchInterlinearChapter and ensures INTERLINEAR
    assert 'fetchInterlinearChapter(bookId, chapterNum)' in engine_content
    assert 'data/interlinear/${bookId.toUpperCase()}/${chapterNum}.json' in engine_content
    assert 'transObj.id === \'INTERLINEAR\'' in engine_content

    # 2. App renders 3-tier stack: orig -> translit -> gloss at bottom
    assert 'cleanEnglishGloss' in app_content
    assert 'tile-translit-row' in app_content
    assert 'tile-gloss' in app_content
    # Popout reader handles INTERLINEAR with tiles
    assert 'popout-interlinear-item' in app_content

    # 3. CSS guarantees 3 tiers and suppresses subgloss from displacing bottom
    assert '.tile-translit-row' in css_content
    assert '.s4a-subgloss' in css_content
    assert 'display: none !important;' in css_content
    assert '.rtl-stream' in css_content
    assert '.ltr-stream' in css_content

