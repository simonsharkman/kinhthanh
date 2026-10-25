# -*- coding: utf-8 -*-
"""
Unit tests for Kinh Thánh Hiện Đại (KTHD - Bible.com #1638) integration.
Verifies:
1. KTHD metadata and default activeVersions in js/state.js
2. KTHD loader and engine integration in js/bible-engine.js
3. Authentic KTHD data across all 66 books in data/kthd/ and data/bibles/
4. KTHD parser logic in scripts/fetch_kthd_biblecom.py
"""

import json
from pathlib import Path
from scripts.fetch_kthd_biblecom import parse_kthd_html, get_bible_com_url

ROOT_DIR = Path(__file__).resolve().parent.parent


def test_kthd_in_state_js():
    state_js = (ROOT_DIR / "js" / "state.js").read_text(encoding="utf-8")
    assert "id: 'KTHD'" in state_js
    assert "Kinh Thánh Hiện Đại (KTHD)" in state_js
    assert "'BTT', 'KTHD'" in state_js
    assert "kthd_auto_added_v1" in state_js


def test_kthd_in_bible_engine_js():
    engine_js = (ROOT_DIR / "js" / "bible-engine.js").read_text(encoding="utf-8")
    assert "case 'KTHD':" in engine_js
    assert "async fetchKTHDChapter(bookId, chapterNum)" in engine_js
    assert "data/kthd/${bookId}.json" in engine_js


def test_kthd_all_66_books_present():
    books_meta = json.loads((ROOT_DIR / "data" / "books-metadata.json").read_text(encoding="utf-8"))
    assert len(books_meta) == 66

    kthd_dir = ROOT_DIR / "data" / "kthd"
    assert kthd_dir.exists()

    for book in books_meta:
        book_id = book["id"]
        kthd_file = kthd_dir / f"{book_id}.json"
        assert kthd_file.exists(), f"Missing KTHD file for {book_id}"
        data = json.loads(kthd_file.read_text(encoding="utf-8"))
        assert data.get("translation") == "KTHD"
        assert data.get("version_id") == 1638
        assert "1" in data.get("chapters", {}), f"Missing chapter 1 in KTHD {book_id}"
        assert "1" in data["chapters"]["1"], f"Missing verse 1:1 in KTHD {book_id}"


def test_kthd_authentic_verses_in_bibles_and_defaults():
    # Check John 1:1 in data/bibles/JHN.json
    jhn_data = json.loads((ROOT_DIR / "data" / "bibles" / "JHN.json").read_text(encoding="utf-8"))
    jhn_1_1 = jhn_data["chapters"]["1"][0]["translations"].get("KTHD", "")
    assert "Ban đầu có Ngôi Lời, Ngôi Lời ở với Đức Chúa Trời" in jhn_1_1

    # Check Genesis 1:1 in data/bibles/GEN.json
    gen_data = json.loads((ROOT_DIR / "data" / "bibles" / "GEN.json").read_text(encoding="utf-8"))
    gen_1_1 = gen_data["chapters"]["1"][0]["translations"].get("KTHD", "")
    assert "Ban đầu" in gen_1_1 and "Đức Chúa Trời" in gen_1_1

    # Check Nahum 1:1 (NAH mapped from NAM on Bible.com)
    nah_data = json.loads((ROOT_DIR / "data" / "bibles" / "NAH.json").read_text(encoding="utf-8"))
    nah_1_1 = nah_data["chapters"]["1"][0]["translations"].get("KTHD", "")
    assert "Ni-ni-ve" in nah_1_1

    # Check default-bible-passages.json
    defaults = json.loads((ROOT_DIR / "data" / "default-bible-passages.json").read_text(encoding="utf-8"))
    assert "KTHD" in defaults["JHN.1"]["verses"][0]["translations"]
    assert "Ban đầu có Ngôi Lời, Ngôi Lời ở với Đức Chúa Trời" in defaults["JHN.1"]["verses"][0]["translations"]["KTHD"]


def test_kthd_parser_and_url_mapping():
    assert get_bible_com_url("JHN", 1) == "https://www.bible.com/vi/bible/1638/JHN.1.KTHD"
    assert get_bible_com_url("NAH", 1) == "https://www.bible.com/vi/bible/1638/NAM.1.KTHD"

    sample_html = '''
    <div class="ChapterContent_chapter__uvbXo">
      <span class="ChapterContent_verse__57FIw" data-usfm="JHN.1.1">
        <span class="ChapterContent_label__R2PLt">1</span>
        <span class="ChapterContent_content__RrUqA">Từ ban đầu Ngôi Lời đã hiện hữu,</span>
        <span class="ChapterContent_note__YlDW0"><span class="ChapterContent_body__O3qjr">Chú thích</span></span>
        <span class="ChapterContent_content__RrUqA">Ngôi Lời ở cùng Đức Chúa Trời.</span>
      </span>
    </div>
    '''
    parsed = parse_kthd_html(sample_html, "JHN", 1)
    assert parsed == {1: "Từ ban đầu Ngôi Lời đã hiện hữu, Ngôi Lời ở cùng Đức Chúa Trời."}
