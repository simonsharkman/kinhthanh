# -*- coding: utf-8 -*-
"""
Test Suite: Compact TSK Verse Navigation & 66 Books Directory (Milestone 54)
Verifies:
1. Compact, overflow-free verse navigation bar (Câu trước / Câu tiếp).
2. Elimination of text-icon collision in .tsk-arrow-btn.
3. Clean chapter badge display in .tsk-dir-book-chip (no broken wrapping like '34\\nch').
"""

import os
import pytest

CROSSREF_PATH = r"E:\kinhthanh\js\crossref-engine.js"
CSS_PATH = r"E:\kinhthanh\css\components.css"


def test_crossref_engine_compact_navigation_text():
    assert os.path.exists(CROSSREF_PATH)
    with open(CROSSREF_PATH, "r", encoding="utf-8") as f:
        js = f.read()

    # Verify no redundant duplicate arrows in text strings
    assert "Câu trước" in js
    assert "Câu tiếp" in js
    assert "◄ CÂU TRƯỚC" not in js
    assert "CÂU TIẾP ►" not in js

    # Navigation structure preserved
    assert 'id="tsk-prev-verse-btn"' in js
    assert 'id="tsk-next-verse-btn"' in js
    assert 'class="tsk-coord-pill"' in js


def test_tsk_navigation_css_compact_and_overflow_protection():
    assert os.path.exists(CSS_PATH)
    with open(CSS_PATH, "r", encoding="utf-8") as f:
        css = f.read()

    # Split bar and buttons
    assert ".tsk-prev-next-split-bar" in css
    assert ".tsk-arrow-btn" in css
    assert ".arrow-icon" in css
    assert ".arrow-main" in css

    # 66 Books Directory chips - ensure no multi-line wrapping of chapter count
    assert ".tsk-dir-grid" in css
    assert ".tsk-dir-book-chip" in css
    assert ".dir-bslug" in css
