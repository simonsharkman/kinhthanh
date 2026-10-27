import os

def test_arial_typography_prioritized_in_tokens():
    tokens_path = os.path.join(r'E:\kinhthanh', 'css', 'design-tokens.css')
    assert os.path.exists(tokens_path), "design-tokens.css must exist"
    with open(tokens_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Arial must be the primary prioritized font in key typography variables
    assert "--font-brand: Arial" in content
    assert "--font-heading: Arial" in content
    assert "--font-bible: Arial" in content
    assert "--font-scripture: Arial" in content
    assert "--font-ui: Arial" in content

def test_arial_typography_enforced_in_layout():
    layout_path = os.path.join(r'E:\kinhthanh', 'css', 'layout.css')
    assert os.path.exists(layout_path), "layout.css must exist"
    with open(layout_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "GLOBAL ARIAL TYPOGRAPHY OVERRIDE" in content
    assert "font-family: Arial, Helvetica" in content

def test_portal_view_uses_arial():
    comp_path = os.path.join(r'E:\kinhthanh', 'css', 'components.css')
    assert os.path.exists(comp_path), "components.css must exist"
    with open(comp_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert "font-family: Arial, Helvetica, 'Noto Serif', sans-serif;" in content
