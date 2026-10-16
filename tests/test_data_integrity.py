import json
import os

def test_data_files_exist():
    data_files = [
        "data/books-metadata.json",
        "data/metaphors-database.json",
        "data/genre-guides.json",
        "data/default-bible-passages.json",
        "data/visual-media-library.json",
        "data/default-articles.json"
    ]
    for df in data_files:
        assert os.path.exists(df), f"Data file {df} missing"

def test_books_metadata_integrity():
    with open("data/books-metadata.json", "r", encoding="utf-8") as f:
        books = json.load(f)
    
    assert len(books) == 66, f"Expected 66 books, found {len(books)}"
    # Check Gen and John
    gen = next(b for b in books if b["id"] == "GEN")
    assert gen["name_vi"] == "Sáng thế ký"
    assert gen["genre"] == "torah"
    assert "author" in gen and "historical_context" in gen

    john = next(b for b in books if b["id"] == "JHN")
    assert john["name_vi"] == "Giăng"
    assert john["genre"] == "gospels"
    assert john["chapters_count"] == 21

def test_metaphors_database():
    with open("data/metaphors-database.json", "r", encoding="utf-8") as f:
        metaphors = json.load(f)
    
    # Must have key metaphors
    keys = [m["id"] for m in metaphors]
    assert "lamb_of_god" in keys  # Chiên con
    assert "true_vine" in keys     # Cây nho
    assert "salt_and_light" in keys# Muối và ánh sáng
    assert "leaven" in keys        # Men
    assert "fire" in keys          # Lửa

    lamb = next(m for m in metaphors if m["id"] == "lamb_of_god")
    assert "ot_shadow" in lamb
    assert "nt_fulfillment" in lamb
    assert "theological_meaning" in lamb

def test_default_passages_parallel_translations():
    with open("data/default-bible-passages.json", "r", encoding="utf-8") as f:
        passages = json.load(f)
    
    # Ensure John 1:1 is present with parallel translations
    assert "JHN.1" in passages
    ch1 = passages["JHN.1"]
    v1 = ch1["verses"][0]
    assert v1["verse_num"] == 1
    assert "translations" in v1
    trans = v1["translations"]
    # Check standard translations
    assert "BTT" in trans
    assert "BDM" in trans
    assert "KJV" in trans
    assert "ESV" in trans
    assert "INTERLINEAR" in trans
    assert "G3056" in trans["INTERLINEAR"]  # Logos Strong's number!

def test_full_bible_database_integrity():
    assert os.path.exists("data/bibles/index.json"), "Bible index missing"
    with open("data/bibles/index.json", "r", encoding="utf-8") as f:
        idx = json.load(f)
    assert len(idx) == 66, f"Expected 66 books in index, found {len(idx)}"

    # Check Revelation has authentic text from Bible.com (VIE1925 / BTT)
    assert os.path.exists("data/bibles/REV.json")
    with open("data/bibles/REV.json", "r", encoding="utf-8") as f:
        rev = json.load(f)
    assert rev["chapters_count"] == 22
    assert "1" in rev["chapters"]
    rev_1_1 = rev["chapters"]["1"][0]
    assert "Sự mặc thị" in rev_1_1["text_primary"]
    assert "Jêsus Christ" in rev_1_1["text_primary"]

    # Check Genesis has authentic text
    assert os.path.exists("data/bibles/GEN.json")
    with open("data/bibles/GEN.json", "r", encoding="utf-8") as f:
        gen = json.load(f)
    assert gen["chapters_count"] == 50
    assert "1" in gen["chapters"]
    gen_1_1 = gen["chapters"]["1"][0]
    assert "Ban đầu Đức Chúa Trời dựng nên trời đất" in gen_1_1["text_primary"]

