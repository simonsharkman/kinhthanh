import os

def test_media_engine_file_exists():
    assert os.path.exists("js/media-engine.js"), "js/media-engine.js missing"

def test_media_engine_contract():
    with open("js/media-engine.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class MediaEngine" in content or "export const MediaEngine" in content
    assert "loadMedia" in content
    assert "renderMediaHubHTML" in content
    assert "getDeepLinks" in content
    assert "biblehub.com" in content
    assert "stepbible.org" in content
    assert "openVideoModal" in content or "createVideoEmbed" in content
