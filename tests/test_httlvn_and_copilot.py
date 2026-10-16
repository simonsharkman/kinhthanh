import json
import os
import pytest

def test_jos_24_2_authentic_translations():
    jos_path = 'data/bibles/JOS.json'
    assert os.path.exists(jos_path)
    with open(jos_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    ch24 = data['chapters']['24']
    v2 = [v for v in ch24 if v['verse_num'] == 2][0]
    t = v2['translations']

    # 1. EDE (Klei Aê Diê Blŭ 2015)
    assert 'EDE' in t
    assert 'Y-Yôsuê' in t['EDE'] or 'Aê Diê' in t['EDE'] or 'ƀuôn sang' in t['EDE']

    # 2. JARAI (Hră Ơi Adai Pơhiăp 2016)
    assert 'JARAI' in t
    assert 'Yôsua' in t['JARAI'] or 'Ơi Adai' in t['JARAI'] or 'pơhiăp' in t['JARAI']

    # 3. BDY (Bản Diễn Ý)
    assert 'BDY' in t
    assert 'Giô-suê' in t['BDY'] and ('Tha-rê' in t['BDY'] or 'Thượng Đế' in t['BDY'])

    # 4. BTHD / RVV11 (Bản Truyền Thống Hiệu Đính 2010)
    assert 'BTHD' in t
    assert 'Giô-suê' in t['BTHD'] and 'Y-sơ-ra-ên' in t['BTHD']

    # 5. BDM / NVB (Bản Dịch Mới)
    assert 'BDM' in t
    assert 'Giô-suê' in t['BDM'] and 'tổ tiên' in t['BDM']

    # 6. English KJV & ESV
    assert 'KJV' in t
    assert 'Joshua' in t['KJV']

def test_jonah_authentic_translations():
    jon_path = 'data/bibles/JON.json'
    assert os.path.exists(jon_path)
    with open(jon_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    ch1 = data['chapters']['1']
    assert len(ch1) >= 16
    v1 = ch1[0]
    t = v1['translations']
    assert 'EDE' in t
    assert 'JARAI' in t
    assert 'BDY' in t
    assert 'BTHD' in t

def test_drawer_tabs_no_horizontal_scroll():
    layout_path = 'css/layout.css'
    with open(layout_path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert '.drawer-tabs' in content
    assert 'flex-wrap: wrap' in content
    assert 'overflow-x: hidden' in content

def test_httlvn_fonts_integrated():
    tokens_path = 'css/design-tokens.css'
    with open(tokens_path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'Glyphicons Halflings' in content
    assert 'glyphicons-halflings-regular.woff2' in content
    assert 'Noto Serif' in content

def test_ai_assistant_biblical_characters():
    ai_path = 'js/ai-assistant.js'
    with open(ai_path, 'r', encoding='utf-8') as f:
        content = f.read()
    assert 'jonah' in content
    assert 'moses' in content
    assert 'abraham' in content
    assert 'david' in content
    assert 'joshua' in content
    assert 'parseAndExecuteCopilotCommand' in content
    assert 'copilot-action-btn' in content
