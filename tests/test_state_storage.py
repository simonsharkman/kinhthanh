import os
import re

def test_state_and_storage_files_exist():
    assert os.path.exists("js/state.js"), "js/state.js does not exist"
    assert os.path.exists("js/storage.js"), "js/storage.js does not exist"

def test_state_js_contract():
    with open("js/state.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Check state object properties
    assert "class AppState" in content or "const state =" in content or "export const AppState" in content
    assert "currentBook" in content
    assert "currentChapter" in content
    assert "currentVerse" in content
    assert "activeVersions" in content
    assert "currentTheme" in content
    assert "currentUserRole" in content
    assert "adminBannerConfig" in content

    # Check reactive methods
    assert "subscribe" in content
    assert "notify" in content or "publish" in content or "emit" in content
    assert "setBookAndChapter" in content or "setPassage" in content
    assert "toggleVersion" in content
    assert "setTheme" in content
    assert "verifyAdminSecret" in content

def test_storage_js_contract():
    with open("js/storage.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "LogosStorage" in content or "class StorageEngine" in content
    assert "IndexedDB" in content or "indexedDB" in content
    assert "localStorage" in content
    assert "savePreference" in content or "setPreference" in content
    assert "getPreference" in content
    assert "saveAdminBanner" in content
    assert "getAdminBanner" in content
