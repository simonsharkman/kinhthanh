import os

def test_hermeneutics_files_exist():
    assert os.path.exists("js/hermeneutics-engine.js"), "js/hermeneutics-engine.js missing"
    assert os.path.exists("js/crossref-engine.js"), "js/crossref-engine.js missing"

def test_hermeneutics_engine_contract():
    with open("js/hermeneutics-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class HermeneuticsEngine" in content or "export const HermeneuticsEngine" in content
    assert "loadMetaphors" in content
    assert "getMetaphorById" in content
    assert "renderMetaphorCard" in content
    assert "getGenreGuide" in content
    assert "renderGenreGuideHTML" in content

def test_crossref_engine_contract():
    with open("js/crossref-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class CrossRefEngine" in content or "export const CrossRefEngine" in content
    assert "getCrossReferences" in content
    assert "renderCrossReferenceHTML" in content
    assert "fetchVersePreview" in content or "quickPeek" in content

def test_dynamic_typology_detection():
    with open("js/hermeneutics-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "detectPassageMetaphors" in content
    assert "renderTypologyTabHTML" in content
    assert "METAPHOR_SIGNATURES" in content
    assert "lamb_of_god" in content
    assert "true_vine" in content
    assert "bread_of_life" in content
    assert "salt_and_light" in content
    assert "living_water" in content

def test_hermeneutics_accurate_mapping_and_no_2co11_false_positives():
    """Kiem tra do chinh xac: Nghiêm cam khop sai 2 Co-rinh-to 11:14 (angel of light), 11:26 (countrymen), 11:27 (doi khat)"""
    import subprocess
    cmd = [
        "node", "-e",
        "import('file:///E:/kinhthanh/js/hermeneutics-engine.js').then(m => {"
        "  const engine = new m.HermeneuticsEngine();"
        "  engine.metaphors = ["
        "    { id: 'lamb_of_god', title_vi: 'Chien Con', icon: 'fa-dove' },"
        "    { id: 'salt_and_light', title_vi: 'Muoi & Anh Sang', icon: 'fa-sun' },"
        "    { id: 'leaven', title_vi: 'Men', icon: 'fa-biohazard' },"
        "    { id: 'living_water', title_vi: 'Nuoc Song', icon: 'fa-water' }"
        "  ];"
        "  const verses_2co11 = ["
        "    { verse_num: 14, text_primary: 'Nao co la gi, chinh qui Sa-tan mao lam thien su sang lang.', translations: { KJV: 'And no marvel; for Satan himself is transformed into an angel of light.', KTHD: 'Chang co gi la, chinh Sa-tan cung gia lam thien su sang choi,' } },"
        "    { verse_num: 26, text_primary: 'Lai nhieu lan toi di duong nguy tren song ben...', translations: { KJV: 'In journeyings often, in perils of waters, in perils of robbers, in perils by mine own countrymen...' } },"
        "    { verse_num: 27, text_primary: 'chiu kho chiu nhoc, lam luc thuc dem, chiu doi khat...', translations: { KJV: 'In weariness and painfulness, in watchings often, in hunger and thirst...' } }"
        "  ];"
        "  const res = engine.detectPassageMetaphors({"
        "    book: { id: '2CO', name_vi: '2 Co-rinh-to' },"
        "    chapterNum: 11,"
        "    verses: verses_2co11,"
        "    selectedVerseNum: 14"
        "  });"
        "  if (res.detected.length !== 0) process.exit(1);"
        "  if (!res.isFallback) process.exit(2);"
        "  const verses_jhn1 = ["
        "    { verse_num: 29, text_primary: 'Kia, Chien Con cua Duc Chua Troi, la Dang cat toi loi the gian di!' }"
        "  ];"
        "  const res_jhn = engine.detectPassageMetaphors({"
        "    book: { id: 'JHN', name_vi: 'Giang' },"
        "    chapterNum: 1,"
        "    verses: verses_jhn1,"
        "    selectedVerseNum: 29"
        "  });"
        "  if (res_jhn.detected.length === 0 || res_jhn.activeMetaphor?.id !== 'lamb_of_god') process.exit(3);"
        "  console.log('PASS_TYPOLOGY');"
        "}).catch(() => process.exit(4));"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    assert res.returncode == 0, f"Error: {res.stderr}"
    assert "PASS_TYPOLOGY" in res.stdout


