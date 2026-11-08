import os
import json
import xml.etree.ElementTree as ET
import pytest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def test_robots_txt_exists_and_valid():
    robots_path = os.path.join(ROOT_DIR, "robots.txt")
    assert os.path.exists(robots_path), "robots.txt must exist at project root"

    with open(robots_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "User-agent: *" in content, "robots.txt must allow all user agents"
    assert "Allow: /" in content, "robots.txt must allow indexing of root"
    assert "Sitemap: https://kinhthanhlogos.vercel.app/sitemap.xml" in content, (
        "robots.txt must point to valid sitemap URL"
    )


def test_sitemap_xml_exists_and_valid():
    sitemap_path = os.path.join(ROOT_DIR, "sitemap.xml")
    assert os.path.exists(sitemap_path), "sitemap.xml must exist at project root"

    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Verify it is valid XML
    root = ET.fromstring(content)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    urls = root.findall("sm:url", ns)
    assert len(urls) >= 1, "sitemap.xml must contain at least 1 URL element"

    locs = [url.find("sm:loc", ns).text.strip() for url in urls if url.find("sm:loc", ns) is not None]
    assert "https://kinhthanhlogos.vercel.app/" in locs, "Root homepage must be in sitemap"

    # Verify priority and changefreq exist on root
    root_url_el = next(u for u in urls if u.find("sm:loc", ns).text.strip() == "https://kinhthanhlogos.vercel.app/")
    assert root_url_el.find("sm:priority", ns) is not None
    assert root_url_el.find("sm:priority", ns).text.strip() == "1.0"
    assert root_url_el.find("sm:changefreq", ns) is not None


def test_index_html_seo_meta_tags():
    html_path = os.path.join(ROOT_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Canonical URL
    assert '<link rel="canonical" href="https://kinhthanhlogos.vercel.app/">' in content, (
        "index.html must contain canonical link"
    )

    # Robots meta
    assert 'name="robots"' in content, "index.html must contain meta robots"
    assert "index, follow" in content, "meta robots must allow index and follow"

    # Meta keywords
    assert 'name="keywords"' in content, "index.html must contain meta keywords"

    # Open Graph meta tags
    assert 'property="og:title"' in content, "Must have og:title"
    assert 'property="og:description"' in content, "Must have og:description"
    assert 'property="og:url" content="https://kinhthanhlogos.vercel.app/"' in content, "Must have og:url"
    assert 'property="og:type"' in content, "Must have og:type"
    assert 'property="og:site_name"' in content, "Must have og:site_name"
    assert 'property="og:image"' in content, "Must have og:image"

    # Twitter Card meta tags
    assert 'name="twitter:card"' in content, "Must have twitter:card"
    assert 'name="twitter:title"' in content, "Must have twitter:title"
    assert 'name="twitter:description"' in content, "Must have twitter:description"

    # Google Site Verification placeholder / meta
    assert 'name="google-site-verification"' in content, (
        "index.html must contain google-site-verification meta tag for Google Search Console"
    )


def test_index_html_json_ld_schema_markup():
    html_path = os.path.join(ROOT_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert '<script type="application/ld+json">' in content, "Must contain JSON-LD script tag"

    # Extract JSON-LD script blocks
    import re
    blocks = re.findall(r'<script\s+type="application/ld\+json">([\s\S]*?)</script>', content)
    assert len(blocks) >= 1, "Must find at least one JSON-LD script block"

    parsed_schemas = []
    for b in blocks:
        try:
            parsed = json.loads(b)
            if isinstance(parsed, list):
                parsed_schemas.extend(parsed)
            elif isinstance(parsed, dict) and "@graph" in parsed:
                parsed_schemas.extend(parsed["@graph"])
            else:
                parsed_schemas.append(parsed)
        except Exception as e:
            pytest.fail(f"Invalid JSON in JSON-LD script: {e}")

    types = [s.get("@type") for s in parsed_schemas if isinstance(s, dict)]
    assert "WebSite" in types, "Schema must include WebSite"
    assert "Organization" in types, "Schema must include Organization"
    assert "WebApplication" in types, "Schema must include WebApplication"

    website_schema = next(s for s in parsed_schemas if s.get("@type") == "WebSite")
    assert "potentialAction" in website_schema, "WebSite schema must include SearchAction"
    assert website_schema["potentialAction"].get("@type") == "SearchAction"


def test_favicon_and_webmanifest_assets():
    favicon_path = os.path.join(ROOT_DIR, "favicon.svg")
    assert os.path.exists(favicon_path), "favicon.svg must exist"
    with open(favicon_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
    assert "<svg" in svg_content and "</svg>" in svg_content

    manifest_path = os.path.join(ROOT_DIR, "site.webmanifest")
    assert os.path.exists(manifest_path), "site.webmanifest must exist"
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    assert "name" in manifest
    assert "short_name" in manifest
    assert "icons" in manifest

    # Check index.html links
    html_path = os.path.join(ROOT_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()
    assert 'rel="icon"' in content, "index.html must link favicon"
    assert 'rel="manifest"' in content, "index.html must link web manifest"


def test_vercel_json_routing_and_headers():
    vercel_path = os.path.join(ROOT_DIR, "vercel.json")
    assert os.path.exists(vercel_path), "vercel.json must exist"
    with open(vercel_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    assert "rewrites" in cfg or "headers" in cfg or "cleanUrls" in cfg


def test_google_search_console_html_verification_file():
    gsc_file = os.path.join(ROOT_DIR, "google3a7b6960f91207aa.html")
    assert os.path.exists(gsc_file), "Google Search Console verification file must exist"
    with open(gsc_file, "r", encoding="utf-8") as f:
        content = f.read().strip()
    assert content == "google-site-verification: google3a7b6960f91207aa.html"


def test_targeted_keywords_seo_optimization():
    html_path = os.path.join(ROOT_DIR, "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Exact SERP title requested by user
    assert "<title>Kinh Thánh Logos — Kinh Thánh Đối Chiếu</title>" in content, (
        "Title must be exact requested 'Kinh Thánh Logos — Kinh Thánh Đối Chiếu'"
    )

    lower = content.lower()

    # Required target keywords in index.html
    for kw in ["kinh thánh", "tin lành", "công giáo", "bible"]:
        assert kw in lower, f"index.html must contain keyword '{kw}'"

    # Meta keywords must cover both accented & unaccented popular search queries
    for term in ["kinhthanh", "tinlanh", "conggiao", "bible"]:
        assert term in lower, f"index.html meta keywords must contain '{term}'"

    # Must contain FAQPage schema in JSON-LD
    assert '"@type": "faqpage"' in lower or '"@type": "FAQPage"' in content, (
        "index.html must contain FAQPage schema for rich Google Search snippet accordions"
    )

    # Must contain semantic SEO footer for Googlebot crawling
    assert '<footer' in content and '</footer>' in content, (
        "index.html must contain a semantic <footer> for SEO indexing"
    )


