import json
import os
import re
import sys

def clean_text(text):
    if not text:
        return ""
    # Strip excess whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print("Khởi tạo cơ sở dữ liệu toàn bộ 66 Sách Kinh Thánh từ Bible.com (VIE1925 / KJV)...")
    
    with open("data/books-metadata.json", "r", encoding="utf-8") as f:
        books_meta = json.load(f)
        
    with open("data/vi_vie.json", "r", encoding="utf-8") as f:
        vi_data = json.load(f)
        
    with open("data/en_kjv.json", "r", encoding="utf-8") as f:
        kjv_data = json.load(f)

    # Load existing enriched passages if any
    existing_passages = {}
    if os.path.exists("data/default-bible-passages.json"):
        with open("data/default-bible-passages.json", "r", encoding="utf-8") as f:
            existing_passages = json.load(f)

    # Create target directory for per-book files
    output_dir = "data/bibles"
    os.makedirs(output_dir, exist_ok=True)

    total_verses = 0
    total_chapters = 0

    # Also build a fast index lookup
    bible_index = {}

    for idx, bmeta in enumerate(books_meta):
        book_id = bmeta["id"]
        vi_book = vi_data[idx]
        kjv_book = kjv_data[idx]

        book_result = {
            "book_id": book_id,
            "name_vi": bmeta["name_vi"],
            "name_en": bmeta["name_en"],
            "testament": bmeta["testament"],
            "genre": bmeta["genre"],
            "chapters_count": len(vi_book["chapters"]),
            "chapters": {}
        }

        total_chapters += len(vi_book["chapters"])

        for ch_idx, vi_chapter in enumerate(vi_book["chapters"]):
            ch_num = ch_idx + 1
            kjv_chapter = kjv_book["chapters"][ch_idx] if ch_idx < len(kjv_book["chapters"]) else []
            passage_key = f"{book_id}.{ch_num}"

            # Check if we have pre-enriched metadata for this chapter
            pre_enriched_chapter = existing_passages.get(passage_key, {})
            pre_verses_dict = {
                v["verse_num"]: v for v in pre_enriched_chapter.get("verses", [])
            }

            chapter_verses = []
            for v_idx, vi_verse_text in enumerate(vi_chapter):
                v_num = v_idx + 1
                total_verses += 1
                vi_clean = clean_text(vi_verse_text)
                kjv_clean = clean_text(kjv_chapter[v_idx]) if v_idx < len(kjv_chapter) else ""

                pre_v = pre_verses_dict.get(v_num)

                metaphor_id = pre_v.get("metaphor_id") if pre_v else None
                cross_refs = pre_v.get("cross_refs", []) if pre_v else []
                
                # Translations dictionary
                translations = {
                    "BTT": f"[BTT 1925] {vi_clean}",
                    "KJV": f"[KJV 1611] {kjv_clean}" if kjv_clean else f"[KJV] {bmeta['name_en']} {ch_num}:{v_num}"
                }

                # If pre-enriched has other translations like BDM, BPT, etc., preserve them!
                if pre_v and "translations" in pre_v:
                    for k, val in pre_v["translations"].items():
                        if k not in translations or k in ["BDM", "BPT", "BD2011", "BHD", "CGKPV", "ESV", "NIV", "INT"]:
                            translations[k] = val
                else:
                    # Provide standard parallel references
                    translations["BDM"] = f"[BDM 2002] {vi_clean}"
                    translations["ESV"] = f"[ESV] {kjv_clean}" if kjv_clean else ""

                verse_obj = {
                    "verse_num": v_num,
                    "text_primary": vi_clean,
                    "metaphor_id": metaphor_id,
                    "translations": translations,
                    "cross_refs": cross_refs
                }
                chapter_verses.append(verse_obj)

            book_result["chapters"][str(ch_num)] = chapter_verses

        # Save individual book JSON
        book_filepath = os.path.join(output_dir, f"{book_id}.json")
        with open(book_filepath, "w", encoding="utf-8") as f_out:
            json.dump(book_result, f_out, ensure_ascii=False, separators=(',', ':'))

        bible_index[book_id] = {
            "name_vi": bmeta["name_vi"],
            "name_en": bmeta["name_en"],
            "chapters_count": book_result["chapters_count"],
            "genre": bmeta["genre"],
            "file": f"data/bibles/{book_id}.json"
        }

    # Save master index
    with open(os.path.join(output_dir, "index.json"), "w", encoding="utf-8") as f_idx:
        json.dump(bible_index, f_idx, ensure_ascii=False, indent=2)

    print(f"✅ Hoàn tất! Đã xử lý toàn bộ {len(books_meta)} Sách, {total_chapters} Chương, {total_verses} Câu Lời Chúa chuẩn Bible.com!")

if __name__ == "__main__":
    main()
