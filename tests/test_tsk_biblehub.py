# -*- coding: utf-8 -*-
"""
Unit tests for Dedicated "KT Đối Chiếu" Tab (https://biblehub.com/tsk/)
with 2 Selectable Editions:
1. Vietnamese (Theo Bản Truyền Thống 1925 - BTT)
2. English (Original BibleHub Treasury of Scripture Knowledge)
"""

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "scripts"))

import serve_kinhthanh  # noqa: E402


def test_tsk_is_separate_tab_not_translation_in_state_js():
    state_js = (ROOT_DIR / "js" / "state.js").read_text(encoding="utf-8")
    assert "id: 'TSK_BTT'" not in state_js
    assert "id: 'TSK'" not in state_js
    assert "this.tskLanguage = storage.getPreference('tsk_language', 'vi')" in state_js
    assert "setTSKLanguage(lang)" in state_js
    assert "TSK_LANGUAGE_CHANGED" in state_js


def test_dedicated_tsk_tab_in_html_and_app_js():
    html = (ROOT_DIR / "index.html").read_text(encoding="utf-8")
    assert 'data-view="tsk"' in html
    assert 'id="tsk-view"' in html
    assert 'id="btn-mobile-tsk"' in html
    assert 'id="mobile-header-tsk-btn"' not in html
    assert 'data-nav="tsk"' in html

    app_js = (ROOT_DIR / "js" / "app.js").read_text(encoding="utf-8")
    assert "async renderTSKView()" in app_js
    assert "bindTSKViewEvents(" in app_js
    assert "state.setTSKLanguage(" in app_js


def test_crossref_engine_two_editions_vi_and_en():
    crossref_js = (ROOT_DIR / "js" / "crossref-engine.js").read_text(encoding="utf-8")
    assert "renderTSKHubHTML(" in crossref_js
    assert "Vietnamese (Bản Truyền Thống)" in crossref_js
    assert "English (BibleHub TSK)" in crossref_js
    assert "fetchLiveBibleHubData(" in crossref_js
    assert "renderOutlineAndJumpsHTML(" in crossref_js
    assert "renderParallelBoxHTML(" in crossref_js


def test_tsk_all_66_books_database_complete_100_percent():
    books_meta = json.loads((ROOT_DIR / "data" / "books-metadata.json").read_text(encoding="utf-8"))
    assert len(books_meta) == 66

    tsk_dir = ROOT_DIR / "data" / "tsk"
    assert tsk_dir.exists()

    for book in books_meta:
        bid = book["id"]
        f = tsk_dir / f"{bid}.json"
        assert f.exists(), f"Missing TSK file for {bid}"
        data = json.loads(f.read_text(encoding="utf-8"))
        assert data["book_id"] == bid
        assert "https://biblehub.com/tsk/" in data["source"]
        assert "1" in data["chapters"], f"Missing chapter 1 in TSK {bid}"


def test_tsk_john_1_1_complete_untruncated_refs():
    jhn_tsk = json.loads((ROOT_DIR / "data" / "tsk" / "JHN.json").read_text(encoding="utf-8"))
    groups = jhn_tsk["chapters"]["1"]["1"]
    assert len(groups) == 4
    assert groups[0]["h_en"] == "the beginning"
    assert groups[0]["h_vi"] == "Ban đầu"
    # Verify all 12 cross-references in group 0 have full Vietnamese & English text (no 5-item truncation)
    assert len(groups[0]["refs"]) >= 12
    for ref_item in groups[0]["refs"]:
        assert ref_item.get("t_vi"), f"Missing t_vi in {ref_item}"
        assert ref_item.get("t_en"), f"Missing t_en in {ref_item}"


def test_biblehub_live_html_parser():
    sample_html = """
    <div id="topver"><div class="chap"><a>John 1:1</a> - In the beginning was the Word</div></div>
    <div id="leftbox"><div class="padleft">
      <div class="vheading">Treasury of Scripture</div>
      <p class="hdg">the beginning.</p>
      <p class="tskverse"><a href="/genesis/1-1.htm">Genesis 1:1</a><br />In the beginning God created the heaven and the earth.</p>
    </div></div>
    <div id="centbox"><div class="padcent">
      <span class="reftext">1. </span><span class="outlinetext"><a href="/john/1-1.htm">The divinity of Christ.</a></span>
      <div class="vheading2">Jump to Next</div>
      <a href="/john/1-14.htm">Word</a> &bull; <a href="/john/1-2.htm">beginning</a></div>
    </div></div>
    <div id="combox"><div class="padright">
      <span class="versiontext"><a href="/nasb/john/1.htm">NASB</a><br></span>In the beginning was the Word.<p>
      <div class="vheading2">Links</div>
    </div></div>
    """
    parsed = serve_kinhthanh.parse_biblehub_tsk_html(sample_html, "JHN", 1, 1)
    assert parsed["top_verse_en"] == "In the beginning was the Word"
    assert len(parsed["groups_live"]) == 1
    assert parsed["groups_live"][0]["h_en"] == "the beginning"
    assert parsed["groups_live"][0]["refs"][0]["b"] == "GEN"
    assert len(parsed["outline"]) == 1
    assert parsed["outline"][0]["verse"] == 1
    assert len(parsed["jump_next"]) == 2
    assert len(parsed["parallel_en"]) == 1
    assert parsed["parallel_en"][0]["version"] == "NASB"
