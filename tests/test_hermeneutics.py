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
