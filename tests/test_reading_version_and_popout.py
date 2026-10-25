import os
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_state_primary_version_contract():
    state_file = os.path.join(BASE_DIR, 'js', 'state.js')
    assert os.path.exists(state_file)

    with open(state_file, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "this.primaryVersion" in content
    assert "setPrimaryVersion" in content
    assert "PRIMARY_VERSION_CHANGED" in content


def test_html_reading_version_and_popout_elements():
    html_file = os.path.join(BASE_DIR, 'index.html')
    assert os.path.exists(html_file)

    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Header primary version selector pill
    assert 'id="primary-version-trigger"' in html
    assert 'id="primary-version-label"' in html
    assert 'primary-version-pill' in html

    # Primary version picker modal
    assert 'id="primary-version-modal"' in html
    assert 'id="primary-version-list"' in html

    # Popout independent reader window modal
    assert 'id="popout-reader-modal"' in html
    assert 'id="popout-reader-title"' in html
    assert 'id="popout-reader-body"' in html
    assert 'id="popout-version-badge"' in html
    assert 'id="popout-prev-chapter-btn"' in html
    assert 'id="popout-next-chapter-btn"' in html
    assert 'id="popout-copy-btn"' in html
    assert 'id="popout-open-tab-btn"' in html


def test_bible_engine_primary_version_support():
    be_file = os.path.join(BASE_DIR, 'js', 'bible-engine.js')
    assert os.path.exists(be_file)

    with open(be_file, 'r', encoding='utf-8') as f:
        be_code = f.read()

    # renderChapterHTML must accept primaryVersion
    assert "renderChapterHTML(passageData, activeVersions" in be_code
    assert "primaryVersion = 'BTT'" in be_code
    assert "active-reading-version-tag" in be_code


def test_app_js_primary_version_and_popout_contract():
    app_file = os.path.join(BASE_DIR, 'js', 'app.js')
    assert os.path.exists(app_file)

    with open(app_file, 'r', encoding='utf-8') as f:
        app_code = f.read()

    # Handler and helper methods
    assert "updatePrimaryVersionLabel" in app_code
    assert "populatePrimaryVersionSelector" in app_code
    assert "openPopoutReader" in app_code
    assert "rebindReaderVerseEvents" in app_code
    assert "PRIMARY_VERSION_CHANGED" in app_code

    # Drawer parallel card click integration
    assert "clickable-popout-card" in app_code
    assert "card-popout-btn" in app_code
    # Guarantee no intrusive browser tooltip covers scripture text
    assert 'title="Nhấp để mở toàn bộ phân đoạn' not in app_code


def test_css_styles_for_popout_and_primary_version():
    comp_file = os.path.join(BASE_DIR, 'css', 'components.css')
    assert os.path.exists(comp_file)

    with open(comp_file, 'r', encoding='utf-8') as f:
        css = f.read()

    assert ".primary-version-pill" in css
    assert ".primary-version-modal-card" in css
    assert ".primary-version-item" in css
    assert ".clickable-popout-card" in css
    assert ".card-popout-btn" in css
    assert ".popout-reader-card" in css
    assert ".popout-reader-body" in css
    assert ".verse-focus-target" in css
