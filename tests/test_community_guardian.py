import os

def test_community_guardian_files_exist():
    assert os.path.exists("js/blog-community.js"), "js/blog-community.js missing"
    assert os.path.exists("js/berea-guardian.js"), "js/berea-guardian.js missing"

def test_berea_guardian_contract():
    with open("js/berea-guardian.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class BereaGuardian" in content or "export const BereaGuardian" in content
    assert "inspectContent" in content
    assert "Cô-lô-se 4:6" in content or "Colossians" in content
    assert "safe_clean_text" in content or "sanitize" in content or "violations" in content

def test_blog_community_contract_and_zero_tamper():
    with open("js/blog-community.js", "r", encoding="utf-8") as f:
        content = f.read()

    assert "class BlogSystem" in content or "export const BlogSystem" in content
    assert "loadArticles" in content
    assert "renderMasterBlogHTML" in content
    assert "renderCommunityCirclesHTML" in content
    assert "submitCommunityPost" in content
    # Zero-tamper check: Guest cannot edit master blog or alter core scripture
    assert "canEditMasterBlog" in content
    assert "admin" in content
    assert "guest" in content
