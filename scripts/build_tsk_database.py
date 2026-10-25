# -*- coding: utf-8 -*-
"""
Xây dựng cơ sở dữ liệu Kinh Thánh Đối Chiếu (Treasury of Scripture Knowledge - TSK)
cho toàn bộ 66 sách Kinh Thánh tại E:\kinhthanh\data\tsk\{BOOK_ID}.json
- Nguồn: https://biblehub.com/tsk/ & CrossReferences-org TSK dataset
- Tạo 2 phiên bản đối chiếu song hành:
  1. TSK_BTT: Kinh Thánh Đối Chiếu Tiếng Việt theo Bản Truyền Thống 1925 (BTT)
  2. TSK: Treasury of Scripture Knowledge (BibleHub TSK Tiếng Anh)
"""

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
TSK_DIR = ROOT_DIR / "data" / "tsk"
BIBLES_DIR = ROOT_DIR / "data" / "bibles"
BOOKS_META_FILE = ROOT_DIR / "data" / "books-metadata.json"
DEFAULT_PASSAGES_FILE = ROOT_DIR / "data" / "default-bible-passages.json"
TSV_FILE = TSK_DIR / "crossreferences_kjv.tsv"

# Mapping từ mã sách trong TSV sang USFM ID chuẩn của dự án và slug trên https://biblehub.com/tsk/
TSV_TO_USFM = {
    "Gen": ("GEN", "genesis"),
    "Exod": ("EXO", "exodus"),
    "Lev": ("LEV", "leviticus"),
    "Num": ("NUM", "numbers"),
    "Deut": ("DEU", "deuteronomy"),
    "Josh": ("JOS", "joshua"),
    "Judg": ("JDG", "judges"),
    "Ruth": ("RUT", "ruth"),
    "1 Sam": ("1SA", "1_samuel"),
    "2 Sam": ("2SA", "2_samuel"),
    "1 Kgs": ("1KI", "1_kings"),
    "2 Kgs": ("2KI", "2_kings"),
    "1 Chr": ("1CH", "1_chronicles"),
    "2 Chr": ("2CH", "2_chronicles"),
    "Ezra": ("EZR", "ezra"),
    "Neh": ("NEH", "nehemiah"),
    "Esth": ("EST", "esther"),
    "Job": ("JOB", "job"),
    "Ps": ("PSA", "psalms"),
    "Prov": ("PRO", "proverbs"),
    "Eccl": ("ECC", "ecclesiastes"),
    "Song": ("SNG", "songs"),
    "Isa": ("ISA", "isaiah"),
    "Jer": ("JER", "jeremiah"),
    "Lam": ("LAM", "lamentations"),
    "Ezek": ("EZK", "ezekiel"),
    "Dan": ("DAN", "daniel"),
    "Hos": ("HOS", "hosea"),
    "Joel": ("JOL", "joel"),
    "Amos": ("AMO", "amos"),
    "Obad": ("OBA", "obadiah"),
    "Jonah": ("JON", "jonah"),
    "Mic": ("MIC", "micah"),
    "Nah": ("NAH", "nahum"),
    "Hab": ("HAB", "habakkuk"),
    "Zeph": ("ZEP", "zephaniah"),
    "Hag": ("HAG", "haggai"),
    "Zech": ("ZEC", "zechariah"),
    "Mal": ("MAL", "malachi"),
    "Matt": ("MAT", "matthew"),
    "Mark": ("MRK", "mark"),
    "Luke": ("LUK", "luke"),
    "John": ("JHN", "john"),
    "Acts": ("ACT", "acts"),
    "Rom": ("ROM", "romans"),
    "1 Cor": ("1CO", "1_corinthians"),
    "2 Cor": ("2CO", "2_corinthians"),
    "Gal": ("GAL", "galatians"),
    "Eph": ("EPH", "ephesians"),
    "Phil": ("PHP", "philippians"),
    "Col": ("COL", "colossians"),
    "1 Thess": ("1TH", "1_thessalonians"),
    "2 Thess": ("2TH", "2_thessalonians"),
    "1 Tim": ("1TI", "1_timothy"),
    "2 Tim": ("2TI", "2_timothy"),
    "Titus": ("TIT", "titus"),
    "Phlm": ("PHM", "philemon"),
    "Heb": ("HEB", "hebrews"),
    "Jas": ("JAS", "james"),
    "1 Pet": ("1PE", "1_peter"),
    "2 Pet": ("2PE", "2_peter"),
    "1 John": ("1JN", "1_john"),
    "2 John": ("2JN", "2_john"),
    "3 John": ("3JN", "3_john"),
    "Jude": ("JUD", "jude"),
    "Rev": ("REV", "revelation"),
}

USFM_TO_BIBLEHUB_SLUG = {v[0]: v[1] for v in TSV_TO_USFM.values()}

# Từ điển thuật ngữ thần học & từ khóa Kinh Thánh phổ biến (KJV Anchor -> Bản Truyền Thống 1925)
ANCHOR_LEXICON = [
    (r"\bthe beginning\b|\bbeginning\b", ["Ban đầu", "buổi ban đầu", "khởi đầu", "từ ban đầu"]),
    (r"\bthe word was\b", ["Ngôi Lời là", "Lời là"]),
    (r"\bthe word\b|\bword\b", ["Ngôi Lời", "Lời", "đạo", "lời phán"]),
    (r"\bwith\b", ["ở cùng", "cùng", "với"]),
    (r"\blord god\b", ["Giê-hô-va Đức Chúa Trời", "Chúa là Đức Chúa Trời"]),
    (r"\bthe lord\b|\blord\b", ["Đức Giê-hô-va", "Chúa", "Đức Chúa"]),
    (r"\bgod\b", ["Đức Chúa Trời", "Chúa"]),
    (r"\bholy spirit\b|\bholy ghost\b|\bspirit\b", ["Đức Thánh Linh", "Thánh Linh", "Thần", "linh"]),
    (r"\bjesus christ\b|\bchrist\b", ["Đức Chúa Jêsus Christ", "Đấng Christ", "Christ"]),
    (r"\bjesus\b", ["Đức Chúa Jêsus", "Jêsus"]),
    (r"\blight\b", ["sự sáng", "ánh sáng", "sáng"]),
    (r"\bdarkness\b", ["sự tối tăm", "tối tăm", "tối"]),
    (r"\blife\b", ["sự sống", "mạng sống", "đời sống"]),
    (r"\bdeath\b|\bdie\b|\bdied\b", ["sự chết", "chết"]),
    (r"\bflesh\b", ["xác thịt", "thịt"]),
    (r"\bgrace\b", ["ân điển", "ơn"]),
    (r"\btruth\b|\btrue\b", ["lẽ thật", "chân thật", "thật"]),
    (r"\blamb\b", ["Chiên Con", "chiên con"]),
    (r"\bsin\b|\bsins\b", ["tội lỗi", "tội"]),
    (r"\bblood\b", ["huyết", "máu"]),
    (r"\bfaith\b|\bbelieve\b|\bbelieved\b", ["đức tin", "tin"]),
    (r"\blove\b|\bloved\b", ["yêu thương", "tình yêu thương", "yêu"]),
    (r"\bpeace\b", ["bình an", "hòa bình"]),
    (r"\bglory\b", ["vinh hiển", "sự vinh hiển"]),
    (r"\bheaven\b|\bheavens\b", ["trời", "các từng trời", "thiên đàng"]),
    (r"\bearth\b", ["đất", "thế gian"]),
    (r"\bworld\b", ["thế gian", "đời"]),
    (r"\bson\b", ["Con", "con trai"]),
    (r"\bfather\b", ["Cha", "cha"]),
    (r"\bkingdom\b", ["nước", "vương quốc"]),
    (r"\bcovenant\b", ["giao ước"]),
    (r"\blaw\b", ["luật pháp"]),
    (r"\bprophet\b|\bprophets\b", ["tiên tri", "đấng tiên tri"]),
    (r"\bangel\b|\bangels\b", ["thiên sứ"]),
    (r"\bshepherd\b", ["Đấng chăn giữ", "người chăn", "chăn"]),
    (r"\bsave\b|\bsalvation\b", ["cứu", "sự cứu rỗi", "cứu rỗi"]),
    (r"\brighteous\b|\brighteousness\b", ["công bình", "sự công bình"]),
    (r"\bholy\b|\bholiness\b", ["thánh", "thánh khiết"]),
    (r"\bpray\b|\bprayer\b", ["cầu nguyện", "lời cầu nguyện"]),
    (r"\bheart\b", ["lòng", "tấm lòng"]),
    (r"\bsoul\b", ["linh hồn", "tâm hồn"]),
    (r"\beternal\b|\beverlasting\b|\bfor ever\b", ["đời đời", "hằng sống"]),
    (r"\bcreated\b|\bcreate\b", ["dựng nên", "sáng tạo", "làm nên"]),
    (r"\bwithout\b", ["vô hình và trống không", "trống không", "không có"]),
    (r"\bwater\b|\bwaters\b", ["nước", "mặt nước"]),
    (r"\bday\b", ["ngày", "ban ngày"]),
    (r"\bnight\b", ["đêm", "ban đêm"]),
    (r"\bbread\b", ["bánh"]),
    (r"\bcross\b", ["thập tự giá", "cây thập tự"]),
    (r"\bresurrection\b|\brisen\b", ["sự sống lại", "sống lại"]),
]


def map_anchor_to_btt(anchor_en: str, vi_text: str, group_idx: int, total_groups: int) -> str:
    """
    Ánh xạ cụm từ khóa TSK tiếng Anh (anchor_en) sang mệnh đề/cụm từ tương ứng
    trong câu Kinh Thánh Bản Truyền Thống 1925 (vi_text).
    """
    if not vi_text:
        return anchor_en

    clean_vi = re.sub(r"^\[.*?\]\s*", "", vi_text).strip()
    clean_anchor = (anchor_en or "").strip()
    anchor_lower = clean_anchor.lower().strip(".,:;?!\"'()")

    # Tách câu BTT 1925 thành các mệnh đề tự nhiên theo dấu câu
    clauses = [c.strip() for c in re.split(r"[;:.?!]|,\s+", clean_vi) if c.strip()]
    if not clauses:
        clauses = [clean_vi]

    # 1. Tìm từ khóa tương ứng trong từ điển thần học có xuất hiện thực tế trong câu BTT
    for pattern, vi_candidates in ANCHOR_LEXICON:
        if re.search(pattern, anchor_lower):
            for cand in vi_candidates:
                m = re.search(re.escape(cand), clean_vi, flags=re.IGNORECASE)
                if m:
                    matched_str = m.group(0)
                    # Tìm mệnh đề chứa từ khóa này để ngữ cảnh rõ ràng hơn nếu từ khóa quá ngắn
                    for cl in clauses:
                        if re.search(re.escape(cand), cl, flags=re.IGNORECASE):
                            if len(cand.split()) <= 2 and len(cl) <= 42:
                                return cl
                            return matched_str
                    return matched_str

    # 2. Nếu chưa khớp từ điển, lấy mệnh đề tương ứng theo vị trí tỷ lệ (group_idx / total_groups)
    if clauses:
        target_clause_idx = min(len(clauses) - 1, int((group_idx / max(1, total_groups)) * len(clauses)))
        chosen_clause = clauses[target_clause_idx]
        words = chosen_clause.split()
        if len(words) > 7:
            return " ".join(words[:7]) + "…"
        return chosen_clause

    return clean_anchor


def parse_verse_spec(v_spec: str):
    """
    Trích xuất số câu bắt đầu và kết thúc từ chuỗi verse spec như '1', '22-31', '2,8,11', '1-2'.
    """
    nums = [int(x) for x in re.findall(r"\d+", v_spec)]
    if not nums:
        return 1, 1
    if "-" in v_spec and len(nums) >= 2:
        return nums[0], nums[1]
    return nums[0], nums[0]


def main():
    TSK_DIR.mkdir(parents=True, exist_ok=True)
    books_meta = json.loads(BOOKS_META_FILE.read_text(encoding="utf-8"))
    book_meta_map = {b["id"]: b for b in books_meta}

    # Nạp toàn bộ 66 sách từ data/bibles/{BOOK_ID}.json vào bộ nhớ để tra cứu cực nhanh
    print("Đang nạp 66 sách Kinh Thánh (BTT 1925 & Tiếng Anh) vào bộ nhớ...")
    bible_store = {}
    for b in books_meta:
        bid = b["id"]
        bfile = BIBLES_DIR / f"{bid}.json"
        if bfile.exists():
            bdata = json.loads(bfile.read_text(encoding="utf-8"))
            ch_map = {}
            for ch_str, v_list in bdata.get("chapters", {}).items():
                v_map = {}
                for v_obj in v_list:
                    vnum = v_obj.get("verse_num")
                    trans = v_obj.get("translations", {})
                    t_vi = trans.get("BTT") or trans.get("VI1934") or v_obj.get("text_primary") or ""
                    t_Vi_clean = re.sub(r"^\[.*?\]\s*", "", t_vi).strip()
                    t_en = trans.get("KJV") or trans.get("ESV") or trans.get("NKJV") or ""
                    t_en_clean = re.sub(r"^\[.*?\]\s*", "", t_en).strip()
                    v_map[int(vnum)] = (t_Vi_clean, t_en_clean)
                ch_map[int(ch_str)] = v_map
            bible_store[bid] = ch_map

    def lookup_verse_texts(bid: str, ch: int, v_spec: str):
        v_start, v_end = parse_verse_spec(v_spec)
        ch_data = bible_store.get(bid, {}).get(ch, {})
        if not ch_data:
            return "", ""
        tv, te = ch_data.get(v_start, ("", ""))
        suffix = " …" if (v_end > v_start or "," in v_spec) else ""
        return (tv + suffix if tv else ""), (te + suffix if te else "")

    # Đọc crossreferences_kjv.tsv và gom nhóm theo (book_id, chapter, verse)
    print("Đang phân tích dữ liệu TSK từ crossreferences_kjv.tsv...")
    raw_groups_by_book = {b["id"]: {} for b in books_meta}
    lines = TSV_FILE.read_text(encoding="utf-8").splitlines()[1:]

    for line in lines:
        parts = line.split("\t")
        if len(parts) < 5:
            continue
        tsv_book, ch_s, v_s, anchor_en, refs_str = parts[0], parts[1], parts[2], parts[3], parts[4]
        if tsv_book not in TSV_TO_USFM:
            continue
        book_id, _ = TSV_TO_USFM[tsv_book]
        ch_Map = raw_groups_by_book[book_id].setdefault(ch_s, {})
        v_list = ch_Map.setdefault(v_s, [])
        v_list.append((anchor_en, [r.strip() for r in refs_str.split("|") if r.strip()]))

    # Xây dựng 66 file data/tsk/{BOOK_ID}.json
    print("Đang xuất 66 tệp dữ liệu TSK (Tiếng Việt BTT 1925 & Tiếng Anh BibleHub)...")
    total_verses_with_tsk = 0
    for b in books_meta:
        bid = b["id"]
        slug = USFM_TO_BIBLEHUB_SLUG.get(bid, bid.lower())
        book_chapters_out = {}

        for ch_s, verses_dict in raw_groups_by_book[bid].items():
            ch_int = int(ch_s)
            ch_out = {}
            for v_s, groups in verses_dict.items():
                v_int = int(v_s)
                total_verses_with_tsk += 1
                vi_verse_text, _ = bible_store.get(bid, {}).get(ch_int, {}).get(v_int, ("", ""))
                groups_out = []
                total_g = len(groups)

                for g_idx, (anchor_en, ref_tokens) in enumerate(groups):
                    anchor_vi = map_anchor_to_btt(anchor_en, vi_verse_text, g_idx, total_g)
                    refs_out = []
                    for r_idx, r_tok in enumerate(ref_tokens):
                        m = re.match(r"^([1-3]?\s*[A-Za-z]+)\s+(\d+):(.*)$", r_tok)
                        if not m:
                            continue
                        ref_b_tsv, ref_ch_s, ref_v_spec = m.group(1).strip(), m.group(2), m.group(3).strip()
                        if ref_b_tsv not in TSV_TO_USFM:
                            continue
                        ref_bid, _ = TSV_TO_USFM[ref_b_tsv]
                        ref_b_meta = book_meta_map[ref_bid]
                        ref_ch_int = int(ref_ch_s)
                        ref_v_start, _ = parse_verse_spec(ref_v_spec)

                        r_vi = f"{ref_b_meta['name_vi']} {ref_ch_s}:{ref_v_spec}"
                        r_en = f"{ref_b_meta['name_en']} {ref_ch_s}:{ref_v_spec}"

                        item = {
                            "b": ref_bid,
                            "c": ref_ch_int,
                            "v": ref_v_start,
                            "r_vi": r_vi,
                            "r_en": r_en,
                        }
                        # Pre-populate full BTT 1925 & English verse text for ALL references in every group
                        t_vi, t_en = lookup_verse_texts(ref_bid, ref_ch_int, ref_v_spec)
                        if t_vi:
                            item["t_vi"] = t_vi
                        if t_en:
                            item["t_en"] = t_en
                        refs_out.append(item)

                    if refs_out:
                        groups_out.append({
                            "h_en": anchor_en,
                            "h_vi": anchor_vi,
                            "refs": refs_out,
                        })

                if groups_out:
                    ch_out[v_s] = groups_out

            if ch_out:
                book_chapters_out[ch_s] = ch_out

        out_payload = {
            "book_id": bid,
            "name_vi": b["name_vi"],
            "name_en": b["name_en"],
            "biblehub_slug": slug,
            "source": f"https://biblehub.com/tsk/{slug}/",
            "chapters": book_chapters_out,
        }
        out_file = TSK_DIR / f"{bid}.json"
        out_file.write_text(json.dumps(out_payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print(f"HOÀN TẤT: Đã tạo 66 tệp TSK tại {TSK_DIR} cho {total_verses_with_tsk} câu Kinh Thánh!")


if __name__ == "__main__":
    main()
