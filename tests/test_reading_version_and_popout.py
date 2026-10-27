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

def test_portal_read_and_search_version_selects_comprehensive_all_22_translations():
    """Verify portal-read-version-select and portal-search-version-select include all 22 translations from ALL_TRANSLATIONS."""
    html_file = os.path.join(BASE_DIR, 'index.html')
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    expected_version_ids = [
        'BTT', 'KTHD', 'BTHD', 'BDM', 'BD2011', 'BPT', 'BDY', 'CGKPV',
        'EDE', 'JARAI', 'BRU', 'HMONG_W', 'HMONG_B', 'MNONG', 'DAO',
        'NKJV', 'NIV', 'KJV', 'ESV', 'RCUV', 'RCUVSS', 'INTERLINEAR'
    ]

    # Extract portal-read-version-select markup
    assert 'id="portal-read-version-select"' in html
    read_sel_start = html.find('id="portal-read-version-select"')
    read_sel_end = html.find('</select>', read_sel_start)
    read_sel_html = html[read_sel_start:read_sel_end]

    for vid in expected_version_ids:
        assert f'value="{vid}"' in read_sel_html, f"Version {vid} missing from portal-read-version-select"

    # Verify search version select
    assert 'id="portal-search-version-select"' in html
    search_sel_start = html.find('id="portal-search-version-select"')
    search_sel_end = html.find('</select>', search_sel_start)
    search_sel_html = html[search_sel_start:search_sel_end]

    for vid in expected_version_ids:
        assert f'value="{vid}"' in search_sel_html, f"Version {vid} missing from portal-search-version-select"

def test_reverent_scripture_verse_styling_zero_borders_and_unboxed_numbers():
    """Verify that scripture verses are styled with reverence: no boxed card borders, transparent background, and unboxed small verse numbers."""
    layout_file = os.path.join(BASE_DIR, 'css', 'layout.css')
    with open(layout_file, 'r', encoding='utf-8') as f:
        layout_css = f.read()

    # Ensure .verse-item has no enclosing card borders or drop shadows
    assert '.verse-item {' in layout_css
    v_item_idx = layout_css.find('.verse-item {')
    v_item_end = layout_css.find('}', v_item_idx)
    v_item_block = layout_css[v_item_idx:v_item_end]

    assert 'background: transparent;' in v_item_block
    assert 'border: none;' in v_item_block
    assert 'box-shadow: none;' in v_item_block

    # Ensure .verse-number is unboxed, without badge border or badge background
    assert '.verse-number {' in layout_css
    v_num_idx = layout_css.find('.verse-number {')
    v_num_end = layout_css.find('}', v_num_idx)
    v_num_block = layout_css[v_num_idx:v_num_end]

    assert 'background: transparent;' in v_num_block
    assert 'border: none;' in v_num_block
    assert 'min-width: 2.2rem;' in v_num_block
    assert '0.85rem' in v_num_block

    # Ensure airy reverent columnar text flow
    assert 'gap: 1.15rem;' in layout_css


