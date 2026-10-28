# -*- coding: utf-8 -*-
"""
Tests for 365-Day Dynamic Daily Devotion & 4-Stream Bible Reading Plan Engine
(Milestone 56: Tĩnh Nguyện & Lịch Đọc Kinh Thánh Hằng Ngày)
"""

import os
import json
import pytest

REPO_ROOT = "E:/kinhthanh"


def test_365_devotions_json_integrity():
    """Kiểm tra tệp dữ liệu 365 ngày daily-devotions-365.json đầy đủ cấu trúc và chuẩn HTTLVN"""
    json_path = os.path.join(REPO_ROOT, "data", "daily-devotions-365.json")
    assert os.path.exists(json_path), "daily-devotions-365.json must exist"

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Đảm bảo đủ 365 ngày từ 1 đến 365
    assert len(data) == 365, f"Expected 365 days, got {len(data)}"
    for day_num in range(1, 366):
        key = str(day_num)
        assert key in data, f"Missing day {key} in devotion database"
        item = data[key]
        assert item["day"] == day_num

        # Verse
        assert "verse" in item
        v = item["verse"]
        assert "book" in v and "ch" in v and "v" in v and "ref" in v and "text" in v
        assert len(v["text"]) > 10

        # Reading plan (4 streams)
        assert "reading_plan" in item
        plan = item["reading_plan"]
        assert len(plan) == 4, f"Day {key} reading plan must have 4 streams"
        assert "Cựu Ước" in plan[0]["title"]
        assert "Khải-huyền" in plan[1]["title"] or "Khải Huyền" in plan[1]["title"]
        assert "Ba Tháng" in plan[2]["title"]
        assert "Ba Năm" in plan[3]["title"]

        for p in plan:
            assert "passages" in p and len(p["passages"]) > 0
            assert "audioBook" in p and "audioCh" in p
            for passage in p["passages"]:
                assert "book" in passage and "ch" in passage and "name" in passage

        # Daily article
        assert "daily_article" in item
        art = item["daily_article"]
        assert "title" in art and len(art["title"]) > 0
        assert "passage_ref" in art and len(art["passage_ref"]) > 0
        assert "content" in art and len(art["content"]) > 10


def test_day_301_october_28_calibration():
    """Kiểm tra ngày 301 (28/10) khớp chính xác 100% với ảnh chụp gốc của người dùng"""
    json_path = os.path.join(REPO_ROOT, "data", "daily-devotions-365.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    day301 = data["301"]
    # Câu gốc Ha-ba-cúc 3:19
    assert day301["verse"]["book"] == "HAB"
    assert day301["verse"]["ch"] == 3
    assert day301["verse"]["v"] == 19
    assert "Ha-ba-cúc 3:19" in day301["verse"]["ref"]
    assert "chân con hươu" in day301["verse"]["text"]

    # 4 Luồng đọc: Giê-rê-mi 20 / 35-36 / Cô-lô-se 4; Mác 14:12-15:47; Lu-ca 21-22; Gióp 22
    assert "Giê-rê-mi 20" in day301["reading_plan"][0]["text"]
    assert "Cô-lô-se 4" in day301["reading_plan"][0]["text"]
    assert "Mác 14:12-15:47" in day301["reading_plan"][1]["text"]
    assert "Lu-ca 21-22" in day301["reading_plan"][2]["text"]
    assert "Gióp 22" in day301["reading_plan"][3]["text"]

    # Bài đọc Sống Với Thánh Kinh
    assert "Áp Bức Người Cùng Khốn" in day301["daily_article"]["title"]
    assert "Châm Ngôn 22" in day301["daily_article"]["passage_ref"]


def test_devotion_calendar_engine_module():
    """Kiểm tra module js/devotion-calendar-engine.js có đầy đủ thuật toán và export"""
    js_path = os.path.join(REPO_ROOT, "js", "devotion-calendar-engine.js")
    assert os.path.exists(js_path)

    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    assert "export class DevotionCalendarEngine" in code
    assert "export const devotionCalendarEngine" in code
    assert "getDayOfYear" in code
    assert "formatDateVi" in code
    assert "formatDateInput" in code
    assert "getDevotionForDate" in code
    assert "prevDay" in code
    assert "nextDay" in code
    assert "today" in code
    assert "setDate" in code
    assert "isToday" in code
    assert "checkDateRollOver" in code


def test_index_html_devotion_nav_contract():
    """Kiểm tra giao diện index.html có thanh điều hướng ngày đầy đủ nút và accessible elements"""
    html_path = os.path.join(REPO_ROOT, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    assert 'id="devotion-date-nav"' in html
    assert 'id="devotion-prev-day-btn"' in html
    assert 'id="devotion-date-display"' in html
    assert 'id="devotion-current-date-text"' in html
    assert 'id="devotion-native-date-input"' in html
    assert 'id="devotion-today-btn"' in html
    assert 'id="devotion-next-day-btn"' in html
    assert 'id="portal-devotion-verse-box"' in html
    assert 'id="portal-devotion-reading-list"' in html
    assert 'id="portal-devotion-daily-article"' in html


def test_components_css_devotion_nav_styles():
    """Kiểm tra css/components.css có quy tắc tạo kiểu cho thanh điều hướng ngày và đáp ứng mobile"""
    css_path = os.path.join(REPO_ROOT, "css", "components.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    assert ".devotion-header-bar" in css
    assert ".devotion-date-nav" in css
    assert ".devotion-date-btn" in css
    assert ".devotion-date-picker-wrap" in css
    assert ".devotion-date-display" in css
    assert ".devotion-native-date-input" in css
    assert ".devotion-today-btn" in css


def test_storage_and_app_devotion_orchestration():
    """Kiểm tra liên kết orchestration giữa storage.js, app.js và devotion-calendar-engine.js"""
    storage_path = os.path.join(REPO_ROOT, "js", "storage.js")
    with open(storage_path, "r", encoding="utf-8") as f:
        storage_code = f.read()

    assert "getDevotionDataForDate" in storage_code
    assert "saveDevotionDataForDate" in storage_code

    app_path = os.path.join(REPO_ROOT, "js", "app.js")
    with open(app_path, "r", encoding="utf-8") as f:
        app_code = f.read()

    assert "devotionCalendarEngine" in app_code
    assert "devotionCalendarEngine.loadDatabase" in app_code
    assert "devotionCalendarEngine.getDevotionForDate" in app_code
    assert "devotionCalendarEngine.prevDay" in app_code
    assert "devotionCalendarEngine.nextDay" in app_code
    assert "devotionCalendarEngine.today" in app_code
    assert "devotionCalendarEngine.setDate" in app_code
    assert "devotion-prev-day-btn" in app_code
    assert "devotion-next-day-btn" in app_code
    assert "devotion-today-btn" in app_code
    assert "visibilitychange" in app_code
    assert "checkDateRollOver" in app_code
    assert "is-not-today" in app_code
    assert "devotion-native-date-input" in app_code
