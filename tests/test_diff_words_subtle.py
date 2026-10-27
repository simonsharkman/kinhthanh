import os

def test_word_diff_subtle_styling():
    comp_path = os.path.join(r'E:\kinhthanh', 'css', 'components.css')
    assert os.path.exists(comp_path)
    with open(comp_path, 'r', encoding='utf-8') as f:
        content = f.read()

    assert ".word-diff-highlight" in content
    assert "background: transparent !important;" in content
    assert "border-bottom: 1.5px dotted" in content
    assert "cursor: help;" in content

def test_word_diff_tooltip_and_legend():
    be_path = os.path.join(r'E:\kinhthanh', 'js', 'bible-engine.js')
    assert os.path.exists(be_path)
    with open(be_path, 'r', encoding='utf-8') as f:
        be_content = f.read()

    assert 'title="Từ ngữ diễn đạt khác biệt so với bản đối chiếu"' in be_content

    app_path = os.path.join(r'E:\kinhthanh', 'js', 'app.js')
    assert os.path.exists(app_path)
    with open(app_path, 'r', encoding='utf-8') as f:
        app_content = f.read()

    assert "parallel-diff-legend" in app_content
    assert "primaryVer = (typeof state !== 'undefined' && state.primaryVersion)" in app_content
