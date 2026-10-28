import os
import json
import pytest

BASE_DIR = r'E:\kinhthanh'

EXPECTED_EPISTLES = [
    "ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL",
    "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB",
    "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"
]

def test_epistles_deep_context_data_integrity():
    data_path = os.path.join(BASE_DIR, 'data', 'epistles-deep-context.json')
    assert os.path.exists(data_path), "data/epistles-deep-context.json must exist"

    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    assert len(data) == 21, f"Must have exactly 21 New Testament Epistles, found {len(data)}"

    for ep_id in EXPECTED_EPISTLES:
        assert ep_id in data, f"Epistle {ep_id} missing from data"
        item = data[ep_id]

        # Verify all essential hermeneutical fields requested by user
        assert item.get('author_human'), f"{ep_id} missing author_human"
        assert item.get('author_context'), f"{ep_id} missing author_context"
        assert item.get('recipient'), f"{ep_id} missing recipient"
        assert item.get('location'), f"{ep_id} missing location"
        assert item.get('political_context'), f"{ep_id} missing political_context"
        assert item.get('church_situation'), f"{ep_id} missing church_situation"
        assert item.get('why_written'), f"{ep_id} missing why_written"
        assert isinstance(item.get('core_problems'), list) and len(item['core_problems']) > 0, f"{ep_id} missing core_problems"
        assert item.get('solution_and_message'), f"{ep_id} missing solution_and_message"

def test_galatians_specific_theology_and_hermeneutics():
    data_path = os.path.join(BASE_DIR, 'data', 'epistles-deep-context.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    gal = data["GAL"]
    assert "Phao-lô" in gal["author_human"]
    assert "Nam Ga-la-ti" in gal["recipient"]
    assert "Claudius" in gal["political_context"]
    assert any("Judaizers" in p or "Do Thái giáo hóa" in p for p in gal["core_problems"])
    assert "XƯNG CÔNG BÌNH" in gal["solution_and_message"] or "xưng công bình" in gal["solution_and_message"]

def test_hermeneutics_engine_renders_epistle_dossier():
    js_path = os.path.join(BASE_DIR, 'js', 'hermeneutics-engine.js')
    with open(js_path, 'r', encoding='utf-8') as f:
        code = f.read()

    assert "loadEpistles" in code
    assert "getEpistleContext" in code
    assert "epistle-context-dossier" in code
    assert "Thư ai viết (Trước giả)?" in code
    assert "Viết cho ai?" in code
    assert "Hội Thánh ở đâu?" in code
    assert "Bối Cảnh Chính Trị - Xã Hội Thời Bấy Giờ" in code
    assert "Tình Hình Đời Sống & Đức Tin Hội Thánh" in code
    assert "Tại Sao Viết Thư & Nan Đề Cốt Lõi Là Gì?" in code
    assert "Sứ Điệp Giải Pháp Thần Học & Mục Vụ Của Sứ Đồ" in code
