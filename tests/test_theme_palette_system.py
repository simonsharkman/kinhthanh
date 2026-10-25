import os
import subprocess

def test_css_contains_all_six_themes_and_font_scales():
    with open("css/design-tokens.css", "r", encoding="utf-8") as f:
        content = f.read()

    # 6 Themes
    assert '[data-theme="parchment"]' in content
    assert '[data-theme="light"]' in content
    assert '[data-theme="sepia"]' in content
    assert '[data-theme="midnight"]' in content
    assert '[data-theme="sage"]' in content

    # Font Size Scaler Tokens
    assert '[data-font-size="small"]' in content
    assert '[data-font-size="medium"]' in content
    assert '[data-font-size="large"]' in content
    assert '[data-font-size="xlarge"]' in content


def test_html_contains_theme_modal_and_trigger():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Trigger button in header with label
    assert 'id="theme-toggle-btn"' in html
    assert 'id="current-theme-label"' in html

    # Theme Selector Modal
    assert 'id="theme-selector-modal"' in html
    assert 'id="themes-grid"' in html
    assert 'id="font-size-options"' in html
    assert 'theme-live-preview-box' in html

    # Mobile menu trigger
    assert 'id="mobile-menu-theme-btn"' in html
    assert 'id="mobile-theme-status-text"' in html


def test_components_css_theme_palette_styling():
    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".theme-modal-card" in css
    assert ".theme-card" in css
    assert ".theme-card.active" in css
    assert ".theme-swatch-circle" in css
    assert ".font-size-options" in css
    assert ".font-size-btn" in css
    assert ".font-size-btn.active" in css
    assert ".theme-live-preview-box" in css


def test_state_js_theme_and_font_definitions():
    with open("js/state.js", "r", encoding="utf-8") as f:
        state_js = f.read()

    assert "THEMES_LIST" in state_js
    assert "FONT_SIZES" in state_js
    assert "setTheme(themeName)" in state_js
    assert "setFontSize(fontSize)" in state_js
    assert "toggleTheme()" in state_js


def test_node_theme_palette_state_execution():
    result = subprocess.run([
        "node", "-e", """
        global.window = { innerWidth: 1440, scrollTo: () => {}, pageYOffset: 0 };
        global.document = {
          documentElement: { setAttribute: () => {}, scrollTop: 0 },
          getElementById: () => null,
          querySelectorAll: () => [],
          body: { classList: { toggle: () => {} } }
        };
        global.localStorage = {
          _data: {},
          getItem(k) { return this._data[k] || null; },
          setItem(k, v) { this._data[k] = v; },
          removeItem(k) { delete this._data[k]; }
        };

        import('./js/state.js').then(({ state, THEMES_LIST, FONT_SIZES }) => {
          if (THEMES_LIST.length !== 6) process.exit(1);
          if (FONT_SIZES.length !== 4) process.exit(2);

          // Test theme switching
          state.setTheme('midnight');
          if (state.currentTheme !== 'midnight') process.exit(3);

          state.setTheme('sage');
          if (state.currentTheme !== 'sage') process.exit(4);

          state.setTheme('sepia');
          if (state.currentTheme !== 'sepia') process.exit(5);

          // Test font size switching
          state.setFontSize('large');
          if (state.currentFontSize !== 'large') process.exit(6);

          state.setFontSize('xlarge');
          if (state.currentFontSize !== 'xlarge') process.exit(7);

          // Test toggle theme cycling
          state.setTheme('sage');
          state.toggleTheme(); // sage -> dark
          if (state.currentTheme !== 'dark') process.exit(8);

          console.log('THEME_NODE_TEST_PASSED');
        }).catch(err => {
          console.error(err);
          process.exit(9);
        });
        """
    ], capture_output=True, text=True)

    assert result.returncode == 0
    assert "THEME_NODE_TEST_PASSED" in result.stdout
