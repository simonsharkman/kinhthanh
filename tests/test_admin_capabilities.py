import os
import re

def test_storage_admin_and_analytics_contract():
    with open("js/storage.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Master Blogs & Community Posts
    assert "saveMasterBlogs" in content
    assert "getMasterBlogs" in content
    assert "saveCommunityPosts" in content
    assert "getCommunityPosts" in content

    # Reader Analytics & Metrics Intelligence
    assert "getAnalytics" in content
    assert "saveAnalytics" in content
    assert "recordPassageVisit" in content
    assert "recordTranslationUsed" in content
    assert "recordArticleVisit" in content
    assert "recordSearchQuery" in content
    assert "total_visits" in content
    assert "unique_visitors" in content
    assert "top_passages" in content
    assert "top_translations" in content

def test_blog_community_admin_crud_and_moderation():
    with open("js/blog-community.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Master Blog CRUD
    assert "createMasterBlog" in content
    assert "updateMasterBlog" in content
    assert "deleteMasterBlog" in content
    assert "getMasterBlog" in content
    assert "cover_image" in content
    assert "documents" in content

    # Community Moderation & Editing (Full CRUD for Admin)
    assert "approveCommunityPost" in content
    assert "rejectCommunityPost" in content
    assert "deleteCommunityPost" in content
    assert "updateCommunityPost" in content
    assert "getCommunityPost" in content
    assert "status" in content
    assert "pending" in content
    assert "approved" in content
    assert "rejected" in content

def test_html_admin_elements_and_modals():
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Admin Analytics button in header
    assert "id=\"admin-analytics-btn\"" in html

    # Admin 2-field Login Modal (Username + Password)
    assert "id=\"admin-auth-modal\"" in html
    assert "id=\"admin-username-input\"" in html
    assert "id=\"admin-password-input\"" in html
    assert "id=\"admin-auth-error-msg\"" in html
    assert "id=\"submit-admin-auth-btn\"" in html

    # Admin Article Studio Modal (Master Blogs)
    assert "id=\"admin-article-modal\"" in html
    assert "id=\"admin-art-title\"" in html
    assert "id=\"admin-art-content\"" in html
    assert "id=\"admin-art-image\"" in html
    assert "id=\"admin-art-doc-name\"" in html
    assert "id=\"save-admin-article-btn\"" in html

    # Admin Community Post Studio Modal (Community Posts Editing)
    assert "id=\"admin-community-post-modal\"" in html
    assert "id=\"admin-comm-post-title\"" in html
    assert "id=\"admin-comm-post-author\"" in html
    assert "id=\"admin-comm-post-status\"" in html
    assert "id=\"admin-comm-post-content\"" in html
    assert "id=\"save-admin-community-post-btn\"" in html

    # Admin Reader Analytics Intelligence Modal
    assert "id=\"admin-analytics-modal\"" in html
    assert "id=\"analytics-metric-visits\"" in html
    assert "id=\"analytics-metric-users\"" in html
    assert "id=\"analytics-top-passages-list\"" in html
    assert "id=\"analytics-top-translations-list\"" in html
    assert "id=\"refresh-analytics-btn\"" in html

def test_app_js_admin_orchestration():
    with open("js/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    assert "openAdminArticleModal" in js
    assert "saveAdminArticleFromModal" in js
    assert "openAdminCommunityPostModal" in js
    assert "saveAdminCommunityPostFromModal" in js
    assert "openAdminAnalyticsModal" in js
    assert "renderAnalyticsDashboard" in js
    assert "admin-analytics-btn" in js
    assert "save-admin-article-btn" in js
    assert "save-admin-community-post-btn" in js
    assert "btn-mod-approve" in js
    assert "btn-mod-reject" in js
    assert "btn-edit-article" in js
    assert "btn-delete-article" in js
    assert "btn-edit-community-post" in js

    # Zero-leak security guarantee: No spoiler tips in app.js alerts
    assert "Mẹo: Mã mặc định" not in js
    assert "logos777" not in js

def test_admin_authentication_contract():
    with open("js/state.js", "r", encoding="utf-8") as f:
        state_js = f.read()

    assert "verifyAdminCredentials" in state_js
    assert "verifyAdminSecret" in state_js
    assert "logoutAdmin" in state_js

