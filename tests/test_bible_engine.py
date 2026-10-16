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
    assert ".search-item-ai" in content
    assert ".ai-passage-chip" in content
    assert ".search-highlight" in content

def test_ai_search_theological_topics():
    import json
    assert os.path.exists("data/ai-theological-topics.json")
    with open("data/ai-theological-topics.json", "r", encoding="utf-8") as f:
        topics = json.load(f)
    assert len(topics) >= 15
    seed_topic = next((t for t in topics if "hạt giống" in t["keywords"] or "hột giống" in t["keywords"]), None)
    assert seed_topic is not None
    assert len(seed_topic["passages"]) >= 3
    assert any(p["book_id"] == "MAT" for p in seed_topic["passages"])

def test_bible_search_index_file():
    import json
    assert os.path.exists("data/bible-search-index.json")
    with open("data/bible-search-index.json", "r", encoding="utf-8") as f:
        index = json.load(f)
    assert len(index) >= 3000
    assert any("hột giống" in v["text"] or "gieo" in v["text"] for v in index)

def test_httlvn_translations_and_ethnic_languages():
    import json
    with open("js/state.js", "r", encoding="utf-8") as f:
        state_js = f.read()

    # Check HTTLVN codes & ethnic languages
    assert "VI1934" in state_js
    assert "RVV11" in state_js
    assert "NVB" in state_js
    assert "RRB" in state_js  # Ê-đê
    assert "JBSV" in state_js # Gia-rai
    assert "BRU" in state_js  # Bru Vân Kiều
    assert "HMOWSV" in state_js # H'Mông Trắng
    assert "BBSV" in state_js # M'Nông

    # Check JHN.json authentic chapter 13 translations
    with open("data/bibles/JHN.json", "r", encoding="utf-8") as f:
        jhn = json.load(f)
    ch13 = jhn.get("chapters", {}).get("13", [])
    assert len(ch13) == 38
    v17 = next((v for v in ch13 if v["verse_num"] == 17), None)
    assert v17 is not None
    assert "translations" in v17
    assert "BTT" in v17["translations"]
    assert "EDE" in v17["translations"] or "RRB" in v17["translations"]

    # Check BibleEngine methods
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        be_content = f.read()
    assert "fetchHTTLVNChapter" in be_content
    assert "searchHTTLVN" in be_content

    # Check HTTLVN search modal in HTML
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()
    assert "id=\"httlvn-search-modal\"" in html
    assert "id=\"httlvn-search-query\"" in html
    assert "id=\"httlvn-filter-version\"" in html

def test_dynamic_parallel_translations_for_selected_versions():
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        be_js = f.read()
    with open("js/state.js", "r", encoding="utf-8") as f:
        st_js = f.read()

    assert "generateVerseTranslation" in be_js
    assert "setActiveVersions" in st_js
    assert "versionsToInclude.forEach" in be_js
    # Verify support for selected versions (BDY, EDE, JARAI, BTHD, BDM)
    for v_id in ['BDY', 'EDE', 'JARAI', 'BTHD', 'BDM']:
        assert f"case '{v_id}':" in be_js or f"'{v_id}'" in be_js
