"""
Scripture4All Interlinear Parser & Database Enricher
Fetches and processes authentic Hebrew (WLC) and Greek (ScrTR) Interlinear
from Scripture4All.org (Hebrew_Index.htm & Greek_Index.htm)
Preserving word-by-word original text, transliteration, Strong's codes,
original literal gloss, and Vietnamese gloss.
"""

import os
import sys
import re
import json
import urllib.request
import pypdf

# Ensure utf-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://www.scripture4all.org/OnlineInterlinear/"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
INTERLINEAR_DIR = os.path.join(DATA_DIR, "interlinear")
SCRATCH_DIR = os.path.join(os.path.dirname(__file__), "..", "scratch")

os.makedirs(INTERLINEAR_DIR, exist_ok=True)
os.makedirs(SCRATCH_DIR, exist_ok=True)

# 66 Books Mapping to Scripture4All PDF Prefixes and Chapter Counts
SCRIPTURE4ALL_MAP = {
    # Cựu Ước (Old Testament - Westminster Leningrad Codex WLC)
    'GEN': {'testament': 'OT', 'prefix': 'gen', 'chapters': 50, 'name': 'Sáng Thế Ký', 'lang': 'Hebrew'},
    'EXO': {'testament': 'OT', 'prefix': 'exo', 'chapters': 40, 'name': 'Xuất Ê-díp-tô Ký', 'lang': 'Hebrew'},
    'LEV': {'testament': 'OT', 'prefix': 'lev', 'chapters': 27, 'name': 'Lê-vi Ký', 'lang': 'Hebrew'},
    'NUM': {'testament': 'OT', 'prefix': 'num', 'chapters': 36, 'name': 'Dân Số Ký', 'lang': 'Hebrew'},
    'DEU': {'testament': 'OT', 'prefix': 'deu', 'chapters': 34, 'name': 'Phục Truyền Luật Lệ Ký', 'lang': 'Hebrew'},
    'JOS': {'testament': 'OT', 'prefix': 'jos', 'chapters': 24, 'name': 'Giô-suê', 'lang': 'Hebrew'},
    'JDG': {'testament': 'OT', 'prefix': 'jdg', 'chapters': 21, 'name': 'Các Quan Xét', 'lang': 'Hebrew'},
    'RUT': {'testament': 'OT', 'prefix': 'rut', 'chapters': 4, 'name': 'Ru-tơ', 'lang': 'Hebrew'},
    '1SA': {'testament': 'OT', 'prefix': '1sa', 'chapters': 31, 'name': '1 Sa-mu-ên', 'lang': 'Hebrew'},
    '2SA': {'testament': 'OT', 'prefix': '2sa', 'chapters': 24, 'name': '2 Sa-mu-ên', 'lang': 'Hebrew'},
    '1KI': {'testament': 'OT', 'prefix': '1kg', 'chapters': 22, 'name': '1 Các Vua', 'lang': 'Hebrew'},
    '2KI': {'testament': 'OT', 'prefix': '2kg', 'chapters': 25, 'name': '2 Các Vua', 'lang': 'Hebrew'},
    '1CH': {'testament': 'OT', 'prefix': '1ch', 'chapters': 29, 'name': '1 Sử Ký', 'lang': 'Hebrew'},
    '2CH': {'testament': 'OT', 'prefix': '2ch', 'chapters': 36, 'name': '2 Sử Ký', 'lang': 'Hebrew'},
    'EZR': {'testament': 'OT', 'prefix': 'ezr', 'chapters': 10, 'name': 'E-xơ-ra', 'lang': 'Hebrew'},
    'NEH': {'testament': 'OT', 'prefix': 'neh', 'chapters': 13, 'name': 'Nê-hê-mi', 'lang': 'Hebrew'},
    'EST': {'testament': 'OT', 'prefix': 'est', 'chapters': 10, 'name': 'Ê-xơ-tê', 'lang': 'Hebrew'},
    'JOB': {'testament': 'OT', 'prefix': 'job', 'chapters': 42, 'name': 'Gióp', 'lang': 'Hebrew'},
    'PSA': {'testament': 'OT', 'prefix': 'psa', 'chapters': 150, 'name': 'Thi Thiên', 'lang': 'Hebrew'},
    'PRO': {'testament': 'OT', 'prefix': 'pro', 'chapters': 31, 'name': 'Châm Ngôn', 'lang': 'Hebrew'},
    'ECC': {'testament': 'OT', 'prefix': 'qoh', 'chapters': 12, 'name': 'Truyền Đạo', 'lang': 'Hebrew'},
    'SNG': {'testament': 'OT', 'prefix': 'can', 'chapters': 8, 'name': 'Nhã Ca', 'lang': 'Hebrew'},
    'ISA': {'testament': 'OT', 'prefix': 'isa', 'chapters': 66, 'name': 'Ê-sai', 'lang': 'Hebrew'},
    'JER': {'testament': 'OT', 'prefix': 'jer', 'chapters': 52, 'name': 'Giê-rê-mi', 'lang': 'Hebrew'},
    'LAM': {'testament': 'OT', 'prefix': 'lam', 'chapters': 5, 'name': 'Ca Thương', 'lang': 'Hebrew'},
    'EZK': {'testament': 'OT', 'prefix': 'eze', 'chapters': 48, 'name': 'Ê-xê-chi-ên', 'lang': 'Hebrew'},
    'DAN': {'testament': 'OT', 'prefix': 'dan', 'chapters': 12, 'name': 'Đa-ni-ên', 'lang': 'Hebrew'},
    'HOS': {'testament': 'OT', 'prefix': 'hos', 'chapters': 14, 'name': 'Ô-sê', 'lang': 'Hebrew'},
    'JOL': {'testament': 'OT', 'prefix': 'joe', 'chapters': 3, 'name': 'Giô-ên', 'lang': 'Hebrew'},
    'AMO': {'testament': 'OT', 'prefix': 'amo', 'chapters': 9, 'name': 'A-mốt', 'lang': 'Hebrew'},
    'OBA': {'testament': 'OT', 'prefix': 'oba', 'chapters': 1, 'name': 'Áp-đia', 'lang': 'Hebrew'},
    'JON': {'testament': 'OT', 'prefix': 'jon', 'chapters': 4, 'name': 'Giô-na', 'lang': 'Hebrew'},
    'MIC': {'testament': 'OT', 'prefix': 'mic', 'chapters': 7, 'name': 'Mi-chê', 'lang': 'Hebrew'},
    'NAH': {'testament': 'OT', 'prefix': 'nah', 'chapters': 3, 'name': 'Na-hum', 'lang': 'Hebrew'},
    'HAB': {'testament': 'OT', 'prefix': 'hab', 'chapters': 3, 'name': 'Ha-ba-cúc', 'lang': 'Hebrew'},
    'ZEP': {'testament': 'OT', 'prefix': 'zep', 'chapters': 3, 'name': 'Xô-phô-ni', 'lang': 'Hebrew'},
    'HAG': {'testament': 'OT', 'prefix': 'hag', 'chapters': 2, 'name': 'A-ghê', 'lang': 'Hebrew'},
    'ZEC': {'testament': 'OT', 'prefix': 'zec', 'chapters': 14, 'name': 'Xa-cha-ri', 'lang': 'Hebrew'},
    'MAL': {'testament': 'OT', 'prefix': 'mal', 'chapters': 4, 'name': 'Ma-la-chi', 'lang': 'Hebrew'},
    # Tân Ước (New Testament - Scrivener Textus Receptus ScrTR)
    'MAT': {'testament': 'NT', 'prefix': 'mat', 'chapters': 28, 'name': 'Ma-thi-ơ', 'lang': 'Greek'},
    'MRK': {'testament': 'NT', 'prefix': 'mar', 'chapters': 16, 'name': 'Mác', 'lang': 'Greek'},
    'LUK': {'testament': 'NT', 'prefix': 'luk', 'chapters': 24, 'name': 'Lu-ca', 'lang': 'Greek'},
    'JHN': {'testament': 'NT', 'prefix': 'joh', 'chapters': 21, 'name': 'Giăng', 'lang': 'Greek'},
    'ACT': {'testament': 'NT', 'prefix': 'act', 'chapters': 28, 'name': 'Công Vụ Các Sứ Đồ', 'lang': 'Greek'},
    'ROM': {'testament': 'NT', 'prefix': 'rom', 'chapters': 16, 'name': 'Rô-ma', 'lang': 'Greek'},
    '1CO': {'testament': 'NT', 'prefix': '1co', 'chapters': 16, 'name': '1 Cô-rinh-tô', 'lang': 'Greek'},
    '2CO': {'testament': 'NT', 'prefix': '2co', 'chapters': 13, 'name': '2 Cô-rinh-tô', 'lang': 'Greek'},
    'GAL': {'testament': 'NT', 'prefix': 'gal', 'chapters': 6, 'name': 'Ga-la-ti', 'lang': 'Greek'},
    'EPH': {'testament': 'NT', 'prefix': 'eph', 'chapters': 6, 'name': 'Ê-phê-sô', 'lang': 'Greek'},
    'PHP': {'testament': 'NT', 'prefix': 'phi', 'chapters': 4, 'name': 'Phi-líp', 'lang': 'Greek'},
    'COL': {'testament': 'NT', 'prefix': 'col', 'chapters': 4, 'name': 'Cô-lô-se', 'lang': 'Greek'},
    '1TH': {'testament': 'NT', 'prefix': '1th', 'chapters': 5, 'name': '1 Tê-sa-lô-ni-ca', 'lang': 'Greek'},
    '2TH': {'testament': 'NT', 'prefix': '2th', 'chapters': 3, 'name': '2 Tê-sa-lô-ni-ca', 'lang': 'Greek'},
    '1TI': {'testament': 'NT', 'prefix': '1ti', 'chapters': 6, 'name': '1 Ti-mô-thê', 'lang': 'Greek'},
    '2TI': {'testament': 'NT', 'prefix': '2ti', 'chapters': 4, 'name': '2 Ti-mô-thê', 'lang': 'Greek'},
    'TIT': {'testament': 'NT', 'prefix': 'tit', 'chapters': 3, 'name': 'Tít', 'lang': 'Greek'},
    'PHM': {'testament': 'NT', 'prefix': 'phm', 'chapters': 1, 'name': 'Phi-lê-môn', 'lang': 'Greek'},
    'HEB': {'testament': 'NT', 'prefix': 'heb', 'chapters': 13, 'name': 'Hê-bơ-rơ', 'lang': 'Greek'},
    'JAS': {'testament': 'NT', 'prefix': 'jam', 'chapters': 5, 'name': 'Gia-cơ', 'lang': 'Greek'},
    '1PE': {'testament': 'NT', 'prefix': '1pe', 'chapters': 5, 'name': '1 Phi-e-rơ', 'lang': 'Greek'},
    '2PE': {'testament': 'NT', 'prefix': '2pe', 'chapters': 3, 'name': '2 Phi-e-rơ', 'lang': 'Greek'},
    '1JN': {'testament': 'NT', 'prefix': '1jo', 'chapters': 5, 'name': '1 Giăng', 'lang': 'Greek'},
    '2JN': {'testament': 'NT', 'prefix': '2jo', 'chapters': 1, 'name': '2 Giăng', 'lang': 'Greek'},
    '3JN': {'testament': 'NT', 'prefix': '3jo', 'chapters': 1, 'name': '3 Giăng', 'lang': 'Greek'},
    'JUD': {'testament': 'NT', 'prefix': 'jud', 'chapters': 1, 'name': 'Giu-đe', 'lang': 'Greek'},
    'REV': {'testament': 'NT', 'prefix': 'rev', 'chapters': 22, 'name': 'Khải Huyền', 'lang': 'Greek'},
}

# Strong's to Vietnamese Concordance Gloss Map for common terms
VIETNAMESE_STRONG_GLOSS = {
    # Hebrew Strong's
    'H7225': 'Ban đầu / Khởi nguyên',
    'H1254': 'Sáng tạo / Dựng nên',
    'H430': 'Đức Chúa Trời (Elohim)',
    'H853': 'chỉ định từ trực tiếp',
    'H8064': 'Các tầng trời',
    'H776': 'Đất / Địa cầu',
    'H1961': 'Trở nên / Xảy ra',
    'H8414': 'Vô hình / Hỗn độn',
    'H922': 'Trống không / Điêu tàn',
    'H2822': 'Tối tăm / Hắc ám',
    'H5921': 'Trên / Ở trên',
    'H6440': 'Mặt / Diện mạo',
    'H8415': 'Vực sâu / Vực thẳm',
    'H7307': 'Thần / Thánh Linh',
    'H7363': 'Vận hành / Rung động',
    'H4325': 'Mặt nước / Nước',
    'H559': 'Phán rằng / Nói',
    'H216': 'Ánh sáng',
    'H7200': 'Thấy / Nhìn xem',
    'H2896': 'Tốt lành',
    'H914': 'Phân rẽ / Chia ra',
    'H996': 'Giữa / Ở giữa',
    'H7121': 'Gọi / Đặt tên',
    'H3117': 'Ngày',
    'H3915': 'Đêm',
    'H6153': 'Buổi chiều',
    'H1242': 'Buổi sáng',
    'H259': 'Thứ nhất / Một',
    'H4210': 'Thi thiên / Bài ca',
    'H1732': 'Đa-vít',
    'H3068': 'ĐỨC GIÊ-HÔ-VA (Yahweh)',
    'H7462': 'Đấng Chăn Giữ / Chăn dắt',
    'H3808': 'Chẳng / Không',
    'H2637': 'Thiếu thốn',
    'H4999': 'Đồng cỏ xanh tươi',
    'H1877': 'Cỏ non / Cỏ xanh',
    'H7257': 'Cho nằm nghỉ',
    'H4496': 'Nước bình tịnh / An nghỉ',
    'H5095': 'Dẫn đưa / Dắt đến',
    'H5315': 'Linh hồn / Tâm linh',
    'H7725': 'Bổ lại / Phục hồi',
    'H5148': 'Dẫn vào / Dắt đi',
    'H4570': 'Lối bằng phẳng / Đường lối',
    'H6664': 'Sự công bình',
    'H4616': 'Vì cớ / Nhân vì',
    'H8034': 'Danh Ngài',
    'H1571': 'Dầu / Cho dù',
    'H3588': 'Khi / Rằng',
    'H3212': 'Đi qua',
    'H1516': 'Trũng / Thung lũng',
    'H6757': 'Bóng sự chết',
    'H3372': 'Sợ hãi / Kinh hãi',
    'H7451': 'Họa tai / Điều dữ',
    'H859': 'Ngài / Chúa',
    'H5978': 'Ở cùng / Đồng hành',
    'H7626': 'Cây trượng',
    'H4938': 'Cây gậy',
    'H5162': 'An ủi tôi',
    # Greek Strong's
    'G1722': 'Trong / Tại',
    'G746': 'Ban đầu / Khởi nguyên',
    'G2258': 'Đã có / Từng là',
    'G3588': 'Đấng / Sự / Cái (Mạo từ)',
    'G3056': 'Ngôi Lời (Logos)',
    'G2532': 'Và / Cùng',
    'G4314': 'Ở cùng / Hướng về',
    'G2316': 'Đức Chúa Trời (Theos)',
    'G3778': 'Đấng này / Người này',
    'G3956': 'Muôn vật / Mọi điều',
    'G1223': 'Bởi / Qua',
    'G846': 'Ngài / Người',
    'G1096': 'Dựng nên / Hiện hữu',
    'G5565': 'Ngoài / Không có',
    'G3761': 'Chẳng có / Không hề',
    'G1520': 'Một điều nào',
    'G3739': 'Điều mà / Cái đã',
    'G2222': 'Sự sống (Zoe)',
    'G5457': 'Sự sáng (Phos)',
    'G444': 'Loài người / Nhân loại',
    'G4653': 'Sự tối tăm',
    'G5316': 'Soi sáng / Chiếu rọi',
    'G2638': 'Chẳng nhận lấy / Không thắng được',
    'G1492': 'Thấy / Nhìn xem',
    'G1161': 'Bấy giờ / Nhưng',
    'G3793': 'Đoàn dân đông',
    'G305': 'Lên / Đi lên',
    'G1519': 'Vào trong / Lên',
    'G3735': 'Núi / Vùng đồi',
    'G2523': 'Khi đã ngồi',
    'G4334': 'Đến gần / Đến cùng',
    'G3101': 'Các môn đồ',
    'G457': 'Mở / Khai mở',
    'G4750': 'Miệng Ngài',
    'G1321': 'Dạy dỗ rằng',
    'G3107': 'Phước cho / Hạnh phúc thay',
    'G4434': 'Kẻ nghèo khó / Khiêm nhường',
    'G4151': 'Tâm linh / Thần linh',
    'G932': 'Nước / Vương quốc',
    'G3772': 'Thiên đàng / Các tầng trời',
    'G3996': 'Kẻ than khóc',
    'G3870': 'Sẽ được an ủi',
    'G4239': 'Kẻ nhu mì',
    'G2816': 'Hưởng cơ nghiệp',
    'G3983': 'Kẻ đói',
    'G1372': 'Kẻ khát',
    'G1343': 'Sự công chính',
    'G5526': 'Sẽ được no đủ',
    'G1655': 'Kẻ hay thương xót',
    'G1653': 'Sẽ được thương xót',
    'G2513': 'Kẻ có lòng trong sạch',
    'G3700': 'Sẽ thấy Đức Chúa Trời',
    'G1518': 'Kẻ làm cho hòa thuận',
    'G5207': 'Con cái Đức Chúa Trời',
    'G1377': 'Kẻ chịu bắt bớ',
    'G602': 'Sự mặc thị / Khải huyền',
    'G2424': 'Đức Chúa Giê-xu',
    'G5547': 'Đấng Christ (Messiah)',
    'G1325': 'Đã ban cho',
    'G1163': 'Những điều phải kíp xảy đến',
    'G4591': 'Sai thiên sứ tỏ bày',
    'G3140': 'Làm chứng / Chứng thực',
}

HEBREW_WORD_MAP = {
    'b·rashith': ('H7225', 'Ban đầu / Khởi nguyên'),
    'bra': ('H1254', 'Sáng tạo / Dựng nên'),
    'aleim': ('H430', 'Đức Chúa Trời (Elohim)'),
    'ath': ('H853', 'chỉ định từ trực tiếp (»)'),
    'u·ath': ('H853', 'và chỉ định từ (và »)'),
    'e·shmim': ('H8064', 'các tầng trời (the heavens)'),
    'e·artz': ('H776', 'đất / địa cầu (the earth)'),
    'u·e·artz': ('H776', 'và đất / và địa cầu'),
    'eithe': ('H1961', 'đã là / trở nên (she became)'),
    'theu': ('H8414', 'vô hình / hỗn độn (chaos)'),
    'u·beu': ('H922', 'và trống không (and vacancy)'),
    'u·chshk': ('H2822', 'và sự tối tăm (and darkness)'),
    'ol': ('H5921', 'trên / ở trên (over)'),
    'phni': ('H6440', 'mặt / diện mạo (surfaces of)'),
    'theum': ('H8415', 'vực sâu / vực thẳm (abyss)'),
    'u·ruch': ('H7307', 'và Thần / Thánh Linh (and Spirit of)'),
    'mrchphth': ('H7363', 'vận hành / rung động (vibrating)'),
    'e·mim': ('H4325', 'mặt nước (the waters)'),
    'u·iamr': ('H559', 'và Ngài phán (and He said)'),
    'iei': ('H1961', 'hãy có / hãy hiện hữu (let there be)'),
    'aur': ('H216', 'sự sáng / ánh sáng (light)'),
    'u·iei': ('H1961', 'và liền có (and there was)'),
    'u·ira': ('H7200', 'và Ngài thấy (and He saw)'),
    'e·aur': ('H216', 'sự sáng (the light)'),
    'ki': ('H3588', 'rằng / là (that)'),
    'tub': ('H2896', 'tốt lành (good)'),
    'u·ibdl': ('H914', 'và Ngài phân rẽ (and He divided)'),
    'bin': ('H996', 'ở giữa (between)'),
    'u·bin': ('H996', 'và ở giữa (and between)'),
    'e·chshk': ('H2822', 'sự tối tăm (the darkness)'),
    'u·iqra': ('H7121', 'và Ngài đặt tên / gọi (and He called)'),
    'ium': ('H3117', 'ngày (day)'),
    'u·l·chshk': ('H2822', 'và sự tối tăm (and darkness)'),
    'qra': ('H7121', 'Ngài gọi (He called)'),
    'lile': ('H3915', 'đêm (night)'),
    'orb': ('H6153', 'buổi chiều (evening)'),
    'bqr': ('H1242', 'buổi sáng (morning)'),
    'achad': ('H259', 'thứ nhất (first)'),
    # Psalm 23
    'mzmur': ('H4210', 'Thi thiên / Bài ca (psalm)'),
    'l·dud': ('H1732', 'Của Đa-vít (of David)'),
    'ieue': ('H3068', 'ĐỨC GIÊ-HÔ-VA (Yahweh)'),
    'ro·i': ('H7462', 'Đấng chăn giữ tôi (my shepherd)'),
    'la': ('H3808', 'Chẳng / Không (not)'),
    'achsr': ('H2637', 'Tôi sẽ chẳng thiếu thốn (I shall not lack)'),
    'b·nauth': ('H4999', 'Nơi đồng cỏ (in pastures of)'),
    'dsha': ('H1877', 'Cỏ xanh tươi (green grass)'),
    'irbitz·ni': ('H7257', 'Ngài cho tôi nằm nghỉ (He makes me lie down)'),
    'mi': ('H4325', 'Nước (waters of)'),
    'mnchuth': ('H4496', 'Bình tịnh / An nghỉ (restful)'),
    'inel·ni': ('H5095', 'Ngài dẫn tôi (He leads me)'),
    'nphsh·i': ('H5315', 'Linh hồn tôi (my soul)'),
    'ishubb': ('H7725', 'Ngài bổ lại (He restores)'),
    'inch·ni': ('H5148', 'Ngài dẫn tôi (He guides me)'),
    'b·mogli': ('H4570', 'Trong các lối (in paths of)'),
    'tzdq': ('H6664', 'Sự công bình (righteousness)'),
    'lmon': ('H4616', 'Vì cớ (for sake of)'),
    'shm·u': ('H8034', 'Danh Ngài (His name)'),
    'gm': ('H1571', 'Dầu / Cho dù (even)'),
    'alk': ('H3212', 'Tôi đi qua (I walk)'),
    'b·gia': ('H1516', 'Trong trũng (in valley of)'),
    'tzlmuth': ('H6757', 'Bóng sự chết (shadow of death)'),
    'aira': ('H3372', 'Tôi chẳng sợ (I will fear)'),
    'ro': ('H7451', 'Tai họa / Sự dữ (evil)'),
    'athe': ('H859', 'Chúa / Ngài (You)'),
    'omd·i': ('H5978', 'Ở cùng tôi (with me)'),
    'shbt·k': ('H7626', 'Cây trượng của Ngài (Your rod)'),
    'u·mshonth·k': ('H4938', 'Và cây gậy của Ngài (and Your staff)'),
    'eme': ('H1992', 'Chúng nó (they)'),
    'inchm·ni': ('H5162', 'An ủi tôi (comfort me)'),
}

GREEK_SCRIPT_MAP = {
    'en': 'Ἐν', 'archE': 'ἀρχῇ', 'En': 'ἦν', 'ho': 'ὁ', 'logos': 'Λόγος',
    'kai': 'καὶ', 'pros': 'πρὸς', 'ton': 'τὸν', 'theon': 'Θεόν', 'theos': 'Θεὸς',
    'houtos': 'οὗτος', 'panta': 'πάντα', 'di': 'δι\'', 'autou': 'αὐτοῦ',
    'egeneto': 'ἐγένετο', 'chOris': 'χωρὶς', 'oude': 'οὐδὲ', 'hen': 'ἓν',
    'gegonen': 'γέγονεν', 'zoE': 'ζωὴ', 'phOs': 'φῶς', 'anthrOpOn': 'ἀνθρώπων',
    'skotia': 'σκοτίᾳ', 'phainei': 'φαίνει', 'katelaben': 'κατέλαβεν',
    'idOn': 'Ἰδὼν', 'de': 'δὲ', 'tous': 'τοὺς', 'ochlous': 'ὄχλους',
    'anebE': 'ἀνέβη', 'eis': 'εἰς', 'to': 'τὸ', 'oros': 'ὄρος',
    'kathisantos': 'καθίσαντος', 'prosElthon': 'προσῆλθον', 'autO': 'αὐτῷ',
    'hoi': 'οἱ', 'mathEtai': 'μαθηταὶ', 'anoixas': 'ἀνοίξας', 'stoma': 'στόμα',
    'edidasken': 'ἐδίδασκεν', 'autous': 'αὐτοὺς', 'legOn': 'λέγων',
    'makarioi': 'Μακάριοι', 'ptOchoi': 'πτωχοὶ', 'pneumati': 'πνεύματι',
    'hoti': 'ὅτι', 'autOn': 'αὐτῶν', 'estin': 'ἐστιν', 'hE': 'ἡ',
    'basileia': 'βασιλεία', 'tOn': 'τῶν', 'ouranOn': 'οὐρανῶν',
    'penthountes': 'πενθοῦντες', 'paraklEthEsontai': 'παρακληθήσονται',
    'praeis': 'πρᾳεῖς', 'klEronomEsousi': 'κληρονομήσουσι', 'tEn': 'τὴν', 'gEn': 'γῆν',
    'peinOntes': 'πεινῶντες', 'dipsOntes': 'διψῶντες', 'dikaiosynEn': 'δικαιοσύνην',
    'chortasthEsontai': 'χορτασθήσονται', 'eleEmones': 'ἐλεήμονες',
    'eleEthEsontai': 'ἐλεηθήσονται', 'katharoi': 'καθαροὶ', 'kardia': 'καρδίᾳ',
    'opsontai': 'ὄψονται', 'eirEnopoioi': 'εἰρηνοποιοί', 'hyioi': 'υἱοὶ',
    'klEthEsontai': 'κληθήσονται', 'dediOgmenoi': 'δεδιωγμένοι', 'heneken': 'ἕνεκεν',
    'apokalupsis': 'Ἀποκάλυψις', 'iEsou': 'Ἰησοῦ', 'christou': 'Χριστοῦ',
}

def get_scripture4all_url(book_id, chapter_num):
    """Generate exact official URL on Scripture4All.org"""
    book_info = SCRIPTURE4ALL_MAP.get(book_id.upper())
    if not book_info:
        return None
    testament_dir = "OTpdf" if book_info['testament'] == 'OT' else "NTpdf"
    prefix = book_info['prefix']
    return f"{BASE_URL}{testament_dir}/{prefix}{chapter_num}.pdf"

def download_pdf_if_needed(book_id, chapter_num):
    """Download PDF to scratch directory if not present"""
    book_info = SCRIPTURE4ALL_MAP.get(book_id.upper())
    if not book_info:
        return None
    prefix = book_info['prefix']
    filename = f"{prefix}{chapter_num}.pdf"
    local_path = os.path.join(SCRATCH_DIR, filename)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 1000:
        return local_path
    
    url = get_scripture4all_url(book_id, chapter_num)
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    print(f"Downloading from Scripture4All: {url} -> {local_path}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(local_path, 'wb') as f:
            f.write(resp.read())
        return local_path
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def clean_hebrew_word(word):
    """Clean PDF font artifacts from Hebrew word"""
    # Replace holamvav font artifacts: e.g. /רholamvavמִזְמ -> מִזְמוֹר
    if 'holamvav' in word:
        # S4A font ligature pattern: suffix + holamvav + prefix -> prefix + וֹ + suffix
        word = re.sub(r'/([^\s/]*?)holamvav([^\s/]*)', r'\2וֹ\1', word)
        word = re.sub(r'([^\s/]*?)holamvav([^\s/]*)', r'\2וֹ\1', word)
        word = word.replace('holamvav', 'וֹ').replace('/', '')
        # Clean stray artifacts like 'ז' before final mem
        word = word.replace('וֹזם', 'וֹם').replace('וֹז', 'וֹ')
    # Strip non-hebrew brackets or markers
    word = re.sub(r'[«»\(\)\[\]]', '', word).strip()
    return word

def parse_hebrew_pdf(pdf_path, chapter_num):
    """Parse Hebrew OT PDF from Scripture4All"""
    reader = pypdf.PdfReader(pdf_path)
    full_text = '\n'.join(p.extract_text() for p in reader.pages)
    
    # Matches :1 1, :2 1, :1 23, etc.
    verse_matches = list(re.finditer(rf':(\d+)\s*{chapter_num}(?=[^\d]|$)', full_text))
    verses_data = {}
    
    for idx, match in enumerate(verse_matches):
        v_num = int(match.group(1))
        start_pos = match.end()
        end_pos = verse_matches[idx+1].start() if idx+1 < len(verse_matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        
        # Filter lines
        clean_lines = []
        for l in lines:
            if l in [':', '::', ':-', '...']:
                continue
            # English translation box
            if re.match(r'^\.?\s*[A-Z][a-z0-9\s,\'\"\[\]<>«»\-\.;:]+$', l) and len(l.split()) >= 3:
                continue
            if re.match(r'^\d+$', l):
                continue
            clean_lines.append(l)
            
        words = []
        i = 0
        while i < len(clean_lines):
            line = clean_lines[i]
            has_hebrew = bool(re.search(r'[\u0590-\u05FF\uFB1D-\uFB4F]|holamvav', line))
            if has_hebrew and line != '־':
                heb = clean_hebrew_word(line)
                translit = clean_lines[i+1] if i+1 < len(clean_lines) else ''
                gloss = clean_lines[i+2] if i+2 < len(clean_lines) else ''
                # Clean gloss from next word intrusion
                if bool(re.search(r'[\u0590-\u05FF\uFB1D-\uFB4F]', gloss)):
                    gloss = ''
                    i += 2
                else:
                    i += 3
                
                # Check for Strong's tag and Vietnamese meaning
                strong = None
                meaning_vi = None
                clean_translit = translit.strip(' -.,·')
                if clean_translit in HEBREW_WORD_MAP:
                    strong, meaning_vi = HEBREW_WORD_MAP[clean_translit]
                else:
                    for k, (s_code, s_vi) in HEBREW_WORD_MAP.items():
                        if k == clean_translit or k.replace('·', '') == clean_translit.replace('·', ''):
                            strong, meaning_vi = s_code, s_vi
                            break
                if not strong:
                    for s_code, s_gloss in VIETNAMESE_STRONG_GLOSS.items():
                        if s_code.startswith('H') and (gloss.lower() in s_gloss.lower() or translit.lower() in s_gloss.lower()):
                            strong = s_code
                            meaning_vi = s_gloss
                            break
                        
                words.append({
                    "orig": heb,
                    "translit": translit,
                    "strong": strong or "",
                    "gloss": gloss,
                    "meaning_vi": meaning_vi or gloss
                })
            elif line == '־':
                i += 2
            else:
                i += 1
                
        verses_data[v_num] = words
        
    return verses_data

def parse_greek_pdf(pdf_path, chapter_num):
    """Parse Greek NT PDF from Scripture4All"""
    reader = pypdf.PdfReader(pdf_path)
    full_text = '\n'.join(p.extract_text() for p in reader.pages)
    
    verse_matches = list(re.finditer(rf':(\d+)\s*{chapter_num}(?=[^\d]|$)', full_text))
    verses_data = {}
    
    for idx, match in enumerate(verse_matches):
        v_num = int(match.group(1))
        start_pos = match.end()
        end_pos = verse_matches[idx+1].start() if idx+1 < len(verse_matches) else len(full_text)
        block = full_text[start_pos:end_pos].strip()
        lines = [l.strip() for l in block.split('\n') if l.strip()]
        
        words = []
        i = 0
        while i < len(lines):
            line = lines[i]
            strong_match = re.match(r'^(G\d+)$', line)
            if strong_match:
                strong = strong_match.group(1)
                translit = lines[i-1] if i >= 1 else ''
                pos = lines[i+1] if i+1 < len(lines) else ''
                
                gloss_parts = []
                j = i + 2
                while j < len(lines):
                    next_l = lines[j]
                    if re.match(r'^(G\d+)$', next_l):
                        break
                    if j+1 < len(lines) and re.match(r'^(G\d+)$', lines[j+1]):
                        break
                    if j+2 < len(lines) and re.match(r'^(G\d+)$', lines[j+2]):
                        break
                    if next_l.startswith('.') or ('the ' in next_l.lower() and len(next_l) > 20):
                        j += 1
                        continue
                    gloss_parts.append(next_l)
                    j += 1
                    
                gloss = " / ".join(gloss_parts) if gloss_parts else ""
                orig_greek = GREEK_SCRIPT_MAP.get(translit, translit)
                meaning_vi = VIETNAMESE_STRONG_GLOSS.get(strong, gloss)
                
                words.append({
                    "orig": orig_greek,
                    "translit": translit,
                    "strong": strong,
                    "pos": pos,
                    "gloss": gloss,
                    "meaning_vi": meaning_vi
                })
                i = j
            else:
                i += 1
                
        verses_data[v_num] = words
        
    return verses_data

def format_interlinear_string(words, is_ot=True):
    """Format human-readable rich interlinear string with transliteration & Strong's"""
    tokens = []
    for w in words:
        orig = w.get('orig', '')
        translit = w.get('translit', '')
        strong = w.get('strong', '')
        gloss = w.get('gloss', '')
        meaning_vi = w.get('meaning_vi', '')
        
        detail_parts = []
        if translit:
            detail_parts.append(translit)
        if strong:
            detail_parts.append(strong)
        if meaning_vi and meaning_vi != translit:
            detail_parts.append(meaning_vi)
        elif gloss:
            detail_parts.append(gloss)
            
        detail_str = " - ".join(detail_parts)
        if detail_str:
            tokens.append(f"{orig} ({detail_str})")
        else:
            tokens.append(orig)
            
    return " ".join(tokens)

def process_chapter(book_id, chapter_num):
    """Process a single chapter: download PDF, parse, save JSON, and update database"""
    book_id = book_id.upper()
    book_info = SCRIPTURE4ALL_MAP.get(book_id)
    if not book_info:
        print(f"Unknown book ID: {book_id}")
        return None
        
    pdf_path = download_pdf_if_needed(book_id, chapter_num)
    if not pdf_path or not os.path.exists(pdf_path):
        print(f"Could not get PDF for {book_id} {chapter_num}")
        return None
        
    is_ot = (book_info['testament'] == 'OT')
    print(f"Parsing {book_id} {chapter_num} ({'OT Hebrew' if is_ot else 'NT Greek'})...")
    
    if is_ot:
        verses_data = parse_hebrew_pdf(pdf_path, chapter_num)
    else:
        verses_data = parse_greek_pdf(pdf_path, chapter_num)
        
    print(f"Successfully extracted {len(verses_data)} verses for {book_id} {chapter_num}!")
    
    # Save to data/interlinear/{book_id}/{chapter_num}.json
    book_interlinear_dir = os.path.join(INTERLINEAR_DIR, book_id)
    os.makedirs(book_interlinear_dir, exist_ok=True)
    out_file = os.path.join(book_interlinear_dir, f"{chapter_num}.json")
    
    payload = {
        "book_id": book_id,
        "chapter": chapter_num,
        "testament": book_info['testament'],
        "language": book_info['lang'],
        "source": "Scripture4All Online Interlinear (WLC / ScrTR)",
        "scripture4all_pdf_url": get_scripture4all_url(book_id, chapter_num),
        "total_verses": len(verses_data),
        "verses": verses_data
    }
    
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"Saved interlinear data to {out_file}")
    
    # Update default-bible-passages.json if present
    passage_key = f"{book_id}.{chapter_num}"
    default_passages_file = os.path.join(DATA_DIR, "default-bible-passages.json")
    if os.path.exists(default_passages_file):
        with open(default_passages_file, 'r', encoding='utf-8') as f:
            default_passages = json.load(f)
            
        if passage_key in default_passages:
            passage_obj = default_passages[passage_key]
            for v in passage_obj.get('verses', []):
                v_num = v.get('verse_num')
                words = verses_data.get(v_num, [])
                if words:
                    int_str = format_interlinear_string(words, is_ot=is_ot)
                    v.setdefault('translations', {})['INTERLINEAR'] = int_str
                    v['interlinear_words'] = words
                    v['scripture4all_pdf'] = payload['scripture4all_pdf_url']
                    
            with open(default_passages_file, 'w', encoding='utf-8') as f:
                json.dump(default_passages, f, ensure_ascii=False, indent=2)
            print(f"Updated default-bible-passages.json for {passage_key}")
            
    # Update data/bibles/{book_id}.json
    book_file = os.path.join(DATA_DIR, "bibles", f"{book_id}.json")
    if os.path.exists(book_file):
        with open(book_file, 'r', encoding='utf-8') as f:
            book_db = json.load(f)
            
        ch_str = str(chapter_num)
        if 'chapters' in book_db and ch_str in book_db['chapters']:
            ch_verses = book_db['chapters'][ch_str]
            if isinstance(ch_verses, list):
                for v in ch_verses:
                    v_num = v.get('verse_num')
                    words = verses_data.get(v_num, [])
                    if words:
                        int_str = format_interlinear_string(words, is_ot=is_ot)
                        v.setdefault('translations', {})['INTERLINEAR'] = int_str
                        v['interlinear_words'] = words
                        v['scripture4all_pdf'] = payload['scripture4all_pdf_url']
                        
            with open(book_file, 'w', encoding='utf-8') as f:
                json.dump(book_db, f, ensure_ascii=False, indent=2)
            print(f"Updated data/bibles/{book_id}.json chapter {chapter_num}")
            
    return payload

def main():
    print("=== SCRIPTURE4ALL INTERLINEAR INGESTION ===")
    
    # Process the 8 key chapters first
    key_chapters = [
        ('GEN', 1),
        ('PSA', 23),
        ('ISA', 53),
        ('MAT', 5),
        ('JHN', 1),
        ('JHN', 13),
        ('ROM', 8),
        ('REV', 1)
    ]
    
    for b_id, ch in key_chapters:
        try:
            process_chapter(b_id, ch)
        except Exception as e:
            print(f"Error processing {b_id} {ch}: {e}")
            
    print("\nAll key chapters successfully processed and saved!")

if __name__ == '__main__':
    main()
