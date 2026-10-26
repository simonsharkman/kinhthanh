import os
import re

def test_storage_full_cms_contract():
    with open("js/storage.js", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Devotion Storage
    assert "getDevotionData" in content
    assert "saveDevotionData" in content
    assert "portal_devotion_data" in content

    # 2. Verse Corrections (Hiệu đính Lời Chúa khi phát hiện lỗi)
    assert "getVerseCorrections" in content
    assert "getVerseCorrection" in content
    assert "saveVerseCorrection" in content
    assert "deleteVerseCorrection" in content
    assert "verse_corrections" in content

    # 3. Seasonal Media Storage
    assert "getVisualMediaLibrary" in content
    assert "saveVisualMediaLibrary" in content
    assert "visual_media_library" in content

def test_media_engine_seasonal_and_admin_contract():
    with open("js/media-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "MEDIA_SEASONS" in content
    assert "christmas" in content
    assert "easter" in content
    assert "worship" in content
    assert "harvest" in content
    assert "academic" in content
    assert "setSeason" in content
    assert "createMediaVideo" in content
    assert "updateMediaVideo" in content
    assert "deleteMediaVideo" in content
    assert "getMediaVideo" in content
    assert "btn-edit-media" in content
    assert "btn-delete-media" in content
    assert "admin-create-media-btn" in content

def test_bible_engine_verse_correction_contract():
    with open("js/bible-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "getVerseCorrection" in content
    assert "btn-admin-edit-verse" in content
    assert "verse-corrected-tag" in content

def test_html_full_cms_modals_and_controls():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Devotion Management
    assert "id=\"admin-devotion-edit-btn\"" in html
    assert "id=\"admin-devotion-modal\"" in html
    assert "id=\"admin-devotion-verse-ref\"" in html
    assert "id=\"admin-devotion-verse-text\"" in html
    assert "id=\"save-admin-devotion-btn\"" in html
    assert "id=\"btn-devotion-reset-default\"" in html

    # 2. Verse Correction Studio
    assert "id=\"admin-verse-correction-modal\"" in html
    assert "id=\"admin-corr-text\"" in html
    assert "id=\"admin-corr-note\"" in html
    assert "id=\"save-admin-verse-corr-btn\"" in html
    assert "id=\"reset-admin-verse-corr-btn\"" in html

    # 3. Seasonal Media Studio
    assert "id=\"admin-media-modal\"" in html
    assert "id=\"admin-media-season-select\"" in html
    assert "id=\"admin-media-title-input\"" in html
    assert "id=\"admin-media-youtube-input\"" in html
    assert "id=\"save-admin-media-btn\"" in html

def test_app_js_full_cms_orchestration():
    with open("js/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    # Devotion orchestration
    assert "renderPortalDevotion" in js
    assert "openAdminDevotionModal" in js
    assert "saveAdminDevotionFromModal" in js

    # Verse correction orchestration
    assert "openAdminVerseCorrectionModal" in js
    assert "saveAdminVerseCorrectionFromModal" in js
    assert "resetAdminVerseCorrectionFromModal" in js
    assert "btn-admin-edit-verse" in js

    # Seasonal media orchestration
    assert "openAdminMediaModal" in js
    assert "saveAdminMediaFromModal" in js
    assert "media-season-pill" in js

    # Zero-leak security guarantee
    assert "logos777" not in js
