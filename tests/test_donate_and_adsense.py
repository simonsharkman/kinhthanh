import os


def test_donate_navigation_and_view_in_html():
    """Kiểm tra mục 'Dâng hiến xây dựng Website' và khung Google AdSense trong index.html"""
    with open("index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Nút điều hướng Dâng hiến xây dựng Website trên Header & Mobile
    assert 'data-view="donate"' in html
    assert 'Dâng hiến xây dựng Website' in html
    assert 'id="donate-view"' in html
    assert 'id="donate-container"' in html
    assert 'id="btn-mobile-donate"' in html
    assert 'data-nav="donate"' in html

    # 2. Tích hợp Google AdSense trong <head> và thân trang
    assert 'name="google-adsense-account"' in html
    assert 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' in html
    assert 'class="adsbygoogle"' in html
    assert os.path.exists("ads.txt")


def test_donate_bank_details_and_feedback_in_app_js():
    """Kiểm tra thông tin VCB 9368045059 - Y Simon Ktul - LH 0368045059, lời tâm tình và form góp ý"""
    with open("js/app.js", "r", encoding="utf-8") as f:
        app_js = f.read()

    # Thông tin ngân hàng & người nhận chính xác 100%
    assert "9368045059" in app_js
    assert "VCB" in app_js
    assert "Y Simon Ktul" in app_js
    assert "0368045059" in app_js

    # Phương thức render và xử lý sự kiện mục Dâng hiến & Google AdSense
    assert "renderDonateView" in app_js
    assert "bindDonateViewEvents" in app_js
    assert "initGoogleAdSense" in app_js
    assert "website-feedback-form" in app_js


def test_storage_feedback_and_adsense_methods():
    """Kiểm tra lưu trữ góp ý và cấu hình Google AdSense trong storage.js"""
    with open("js/storage.js", "r", encoding="utf-8") as f:
        storage_js = f.read()

    assert "getWebsiteFeedbacks" in storage_js
    assert "saveWebsiteFeedback" in storage_js
    assert "deleteWebsiteFeedback" in storage_js
    assert "getAdSenseConfig" in storage_js
    assert "saveAdSenseConfig" in storage_js


def test_donate_compact_layout_styling():
    """Kiểm tra thẻ thông tin dâng hiến tinh gọn, phẳng, chống tràn giao diện"""
    with open("css/components.css", "r", encoding="utf-8") as f:
        css = f.read()

    assert ".bank-details-box" in css
    assert ".bank-row.highlight-account-row" in css
    assert ".donate-vietqr-img" in css
    assert "max-width: 165px" in css
    assert ".contact-quick-actions" in css

