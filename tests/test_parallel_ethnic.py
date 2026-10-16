import json
import pytest
import os
import re

def test_jeremiah_29_ethnic_translations():
    jer_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'bibles', 'JER.json')
    assert os.path.exists(jer_path), "JER.json must exist"
    
    with open(jer_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    assert "chapters" in data
    assert "29" in data["chapters"]
    
    ch29 = data["chapters"]["29"]
    assert len(ch29) >= 32
    
    v6 = next(v for v in ch29 if v["verse_num"] == 6)
    trans = v6.get("translations", {})
    
    # Check EDE (Ê-đê)
    assert "EDE" in trans or "RRB" in trans
    ede_text = trans.get("EDE") or trans.get("RRB")
    assert "Dôk" in ede_text or "anak" in ede_text
    assert "Ơ phung mnuih" not in ede_text, "Must not contain hardcoded 2 Cor 7:1"
    
    # Check JARAI (Gia-rai)
    assert "JARAI" in trans or "JBSV" in trans
    
    # Check HMONG_W & HMONG_B
    assert "HMONG_W" in trans or "HMOWSV" in trans
    assert "HMONG_B" in trans or "HMOBSV" in trans
    
    # Check MNONG, BRU, DAO
    assert "MNONG" in trans or "BBSV" in trans
    assert "BRU" in trans
    assert "DAO" in trans or "IUMINR" in trans
    
    # Check CGKPV
    assert "CGKPV" in trans
    assert "[BTT 1925]" not in trans["CGKPV"]

def test_state_js_includes_cgkpv():
    state_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'state.js')
    with open(state_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "id: 'CGKPV'" in content
    assert "id: 'EDE'" in content
    assert "id: 'JARAI'" in content

def test_bible_engine_no_hardcoded_ethnic():
    be_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'bible-engine.js')
    with open(be_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    assert "Ơ phung mnuih khăp kơ kâo" not in content, "Must eliminate 2 Cor 7:1 placeholder in EDE"
    assert "ensurePassageTranslations" in content
    assert "diffWords" in content
