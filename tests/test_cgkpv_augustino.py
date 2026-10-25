import json
import os
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
CGKPV_DIR = os.path.join(DATA_DIR, 'cgkpv')
BIBLES_DIR = os.path.join(DATA_DIR, 'bibles')


def test_cgkpv_mapping_file_integrity():
    mapping_file = os.path.join(DATA_DIR, 'cgkpv-augustino-mapping.json')
    assert os.path.exists(mapping_file), "cgkpv-augustino-mapping.json must exist"

    with open(mapping_file, 'r', encoding='utf-8') as f:
        mapping = json.load(f)

    assert len(mapping) == 66, f"Expected 66 books mapped, found {len(mapping)}"
    assert mapping.get('JHN') == 'tin-mung-theo-thanh-gio-an'
    assert mapping.get('MAT') == 'tin-mung-theo-thanh-mat-theu'
    assert mapping.get('PSA') == 'sach-thanh-vinh'
    assert mapping.get('GEN') == 'sach-sang-the'
    assert mapping.get('REV') == 'sach-khai-huyen'


def test_cgkpv_authentic_gospel_texts():
    jhn_file = os.path.join(CGKPV_DIR, 'JHN.json')
    assert os.path.exists(jhn_file), "data/cgkpv/JHN.json must exist"

    with open(jhn_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    chapters = data.get('chapters', {})
    assert len(chapters) == 21, "John must have 21 chapters in CGKPV"

    # John 1:1
    v1_1 = chapters.get('1', {}).get('1', '')
    assert "Ngôi Lời vẫn hướng về Thiên Chúa" in v1_1
    assert "Ngôi Lời là Thiên Chúa" in v1_1

    # John 2:1 (Protestant: "Cách ba ngày sau, có đám cưới..."; Catholic: "Ngày thứ ba, có tiệc cưới tại Ca-na...")
    v2_1 = chapters.get('2', {}).get('1', '')
    assert "Ngày thứ ba, có tiệc cưới tại Ca-na" in v2_1
    assert "thân mẫu Đức Giê-su" in v2_1
    assert "Cách ba ngày sau" not in v2_1

    # John 3:16
    v3_16 = chapters.get('3', {}).get('16', '')
    assert "Thiên Chúa yêu thế gian đến nỗi đã ban Con Một" in v3_16
    assert "khỏi phải chết, nhưng được sống muôn đời" in v3_16


def test_cgkpv_authentic_psalms_and_torah():
    # Psalm 23
    psa_file = os.path.join(CGKPV_DIR, 'PSA.json')
    assert os.path.exists(psa_file), "data/cgkpv/PSA.json must exist"

    with open(psa_file, 'r', encoding='utf-8') as f:
        psa_data = json.load(f)

    ch23 = psa_data.get('chapters', {}).get('23', {})
    v23_1 = ch23.get('1', '')
    assert "mục tử chăn dắt tôi" in v23_1 or "chẳng thiếu thốn gì" in v23_1

    # Genesis 1:1
    gen_file = os.path.join(CGKPV_DIR, 'GEN.json')
    assert os.path.exists(gen_file), "data/cgkpv/GEN.json must exist"

    with open(gen_file, 'r', encoding='utf-8') as f:
        gen_data = json.load(f)

    v1_1 = gen_data.get('chapters', {}).get('1', {}).get('1', '')
    assert "Thiên Chúa sáng tạo trời đất" in v1_1


def test_default_passages_have_authentic_cgkpv():
    dp_file = os.path.join(DATA_DIR, 'default-bible-passages.json')
    assert os.path.exists(dp_file), "default-bible-passages.json must exist"

    with open(dp_file, 'r', encoding='utf-8') as f:
        passages = json.load(f)

    for p_key, passage in passages.items():
        verses = passage.get('verses', [])
        assert len(verses) > 0, f"Passage {p_key} has no verses"
        for v in verses:
            trans = v.get('translations', {})
            assert 'CGKPV' in trans, f"Verse {v.get('verse_num')} in {p_key} missing CGKPV translation"
            cg_text = trans['CGKPV']
            assert cg_text and len(cg_text) > 5
            # Zero-placeholder verification
            assert "[BTT 1925]" not in cg_text
            assert "Lời Thiên Chúa là ngọn đèn soi bước" not in cg_text or p_key == "PSA.119"


def test_bible_engine_cgkpv_integration():
    be_file = os.path.join(BASE_DIR, 'js', 'bible-engine.js')
    assert os.path.exists(be_file), "js/bible-engine.js must exist"

    with open(be_file, 'r', encoding='utf-8') as f:
        be_code = f.read()

    # Must contain fetchCGKPVChapter method
    assert "fetchCGKPVChapter" in be_code
    # Must load from data/cgkpv/
    assert "data/cgkpv/" in be_code
    # Must NOT have old pseudo replacement regex for CGKPV
    assert "replace(/Đức Chúa Trời/g, 'Thiên Chúa')" not in be_code
