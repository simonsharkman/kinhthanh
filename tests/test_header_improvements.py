#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit tests for Header UI Improvements requested by user:
1. Animated Golden Cross GIF in brand symbol
2. Compact brand header (no bloated tagline)
3. Expanded Omni-Search bar with coordinate, book and smart suggestions
4. Compact reader analytics button with visitor count badge
5. Compact role authentication button
"""
import os
import json

def test_cross_gif_file_and_markup():
    """Kiểm tra tệp GIF Thánh Giá tồn tại và được nhúng chuẩn trong header"""
    gif_path = os.path.join("data", "cross_holy_gold.gif")
    assert os.path.exists(gif_path), "Tệp data/cross_holy_gold.gif phải tồn tại"
    assert os.path.getsize(gif_path) > 5000, "Tệp GIF phải có dung lượng hợp lệ (>5KB)"

    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert 'src="data/cross_holy_gold.gif"' in html
    assert 'class="brand-gif-cross"' in html
    assert 'class="brand-title"' in html


def test_compact_brand_styling():
    """Kiểm tra brand text được thu gọn và không bị chiếm dụng không gian"""
    with open("css/layout.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".brand-gif-cross" in css
    assert ".brand-text .brand-title" in css or ".brand-title" in css
    assert ".brand-tagline" in css
    assert "display: none" in css


def test_expanded_omni_search_styling():
    """Kiểm tra thanh tìm kiếm được mở rộng và hiển thị nổi bật"""
    with open("css/components.css", "r", encoding="utf-8") as f:
        comp_css = f.read()

    assert ".omni-search-wrapper" in comp_css
    assert "min-width: 240px" in comp_css or "flex: 1 1" in comp_css
    assert "#omni-search-input" in comp_css


def test_compact_analytics_and_role_buttons():
    """Kiểm tra nút Thống Kê hiển thị số lượng người xem và nút Khách nhỏ gọn"""
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    assert 'id="admin-analytics-btn"' in html
    assert 'id="analytics-label"' in html
    assert 'id="role-auth-btn"' in html
    assert 'id="role-label"' in html

    with open("css/components.css", "r", encoding="utf-8") as f:
        comp_css = f.read()

    assert "#admin-analytics-btn" in comp_css
    assert "#role-auth-btn" in comp_css


def test_smart_search_coordinates_and_suggestions():
    """Kiểm tra logic nhận diện địa chỉ Kinh Thánh và gợi ý thông minh trong JS"""
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        be_js = f.read()

    assert "cleanedCoord" in be_js or "coordMatch" in be_js
    assert "Book Name Alone Matching" in be_js or "coordMatched" in be_js

    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    assert "renderDefaultSuggestions" in app_js
    assert "updateHeaderVisitorCount" in app_js
    assert "quick-suggest-chip" in app_js
