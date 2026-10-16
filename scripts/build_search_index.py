import json
import os
import re
import sys

def normalize_text(text):
    if not text:
        return ""
    text = text.lower()
    # Normalize accents for fuzzy matching if needed
    return re.sub(r'\s+', ' ', text).strip()

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    print("🚀 Đang khởi tạo Bộ Từ Điển AI Thần Học & Chỉ Mục Tìm Kiếm Toàn Diện Kinh Thánh...")

    # 1. AI Theological Topics & Parables Map (120+ Key Themes)
    ai_topics = [
        {
            "id": "parable_sower_seed",
            "title": "Dụ ngôn Người Gieo Giống & Hạt Giống Nước Trời",
            "category": "Dụ ngôn Phúc Âm",
            "keywords": ["hạt giống", "hột giống", "người gieo giống", "người gieo hạt", "hạt cải", "hột cải", "đất tốt", "bụi gai", "sỏi đá", "vệ đường", "kẻ gieo giống", "hạt lúa mì", "gieo"],
            "ai_insight": "Chúa Giê-xu dùng hình ảnh hạt giống để chỉ về Lời Đức Chúa Trời. Tấm lòng người nghe được ví như 4 loại đất: vệ đường (bị quỷ cướp mất), sỏi đá (thiếu rễ khi bị bắt bớ), bụi gai (bị lo lắng bóp nghẹt), và đất tốt (kết quả gấp 30, 60, 100 lần).",
            "passages": [
                {"ref": "Ma-thi-ơ 13:3-8", "book_id": "MAT", "chapter": 13, "verse": 3, "snippet": "Người gieo giống đi ra đặng gieo... một phần rơi nhằm đất tốt thì sanh trái, hoặc một hột ra một trăm, hoặc một hột ra sáu mươi, hoặc một hột ra ba mươi."},
                {"ref": "Mác 4:14-20", "book_id": "MRK", "chapter": 4, "verse": 14, "snippet": "Người gieo giống ấy là gieo đạo... Đất tốt là kẻ nghe đạo, nhận lấy và kết quả."},
                {"ref": "Lu-ca 8:11", "book_id": "LUK", "chapter": 8, "verse": 11, "snippet": "Dụ ngôn nầy có nghĩa như vầy: Hột giống là Lời Đức Chúa Trời."},
                {"ref": "Ma-thi-ơ 13:31-32", "book_id": "MAT", "chapter": 13, "verse": 31, "snippet": "Nước thiên đàng giống như một hột cải mà người kia lấy gieo trong ruộng mình... trở nên cây lớn."},
                {"ref": "Giăng 12:24", "book_id": "JHN", "chapter": 12, "verse": 24, "snippet": "Nếu hột lúa mì rơi xuống đất mà không chết đi, thì chỉ ở một mình; song nếu chết đi, thì sanh ra nhiều hột khác."},
                {"ref": "1 Phi-e-rơ 1:23", "book_id": "1PE", "chapter": 1, "verse": 23, "snippet": "Anh em đã được lại sanh, chẳng phải bởi giống hay hư nát, nhưng bởi giống chẳng hay hư nát, là bởi Lời hằng sống và bền vững của Đức Chúa Trời."}
            ]
        },
        {
            "id": "parable_prodigal_son",
            "title": "Dụ ngôn Người Con Hoang Đàng & Tình Yêu Của Người Cha",
            "category": "Dụ ngôn Phúc Âm",
            "keywords": ["con hoang đàng", "người con hoang đàng", "người con trở về", "con đi hoang", "người cha nhân từ", "ăn năn trở về", "chiếc nhẫn", "bò con mập", "người con thứ"],
            "ai_insight": "Mặc khải tình yêu thương tha thứ vô điều kiện của Đức Chúa Cha đối với tội nhân biết ăn năn quay về, vượt trên sự xét đoán cay đắng của người anh cả (hình ảnh tôn giáo hình thức Pharisee).",
            "passages": [
                {"ref": "Lu-ca 15:11-24", "book_id": "LUK", "chapter": 15, "verse": 20, "snippet": "Khi con còn ở đàng xa, cha trông thấy thì động lòng thương xót, chạy ra ôm lấy cổ nó mà hôn... Con ta đây đã chết mà bây giờ lại sống, đã mất mà bây giờ lại tìm thấy."}
            ]
        },
        {
            "id": "parable_good_samaritan",
            "title": "Dụ ngôn Người Sa-ma-ri Nhân Lành",
            "category": "Dụ ngôn Phúc Âm",
            "keywords": ["người sa-ma-ri", "người sa-ma-ri nhân lành", "kẻ cướp", "thầy tế lễ", "người lê-vi", "người lân cận", "ai là người lân cận", "dầu và rượu"],
            "ai_insight": "Chúa Giê-xu định nghĩa tình yêu thương chân thật không phải là giáo lý lý thuyết hay chức sắc tôn giáo, mà là hành động thương xót thực tế đối với người hoạn nạn bất kể kỳ thị chủng tộc hay định kiến.",
            "passages": [
                {"ref": "Lu-ca 10:25-37", "book_id": "LUK", "chapter": 10, "verse": 33, "snippet": "Song có một người Sa-ma-ri đi đường, đến gần người đó, ngó thấy thì động lòng thương xót... Hãy đi làm theo như vậy."}
            ]
        },
        {
            "id": "parable_lost_sheep",
            "title": "Dụ ngôn Con Chiên Lạc & Người Chăn Đi Tìm",
            "category": "Dụ ngôn Phúc Âm",
            "keywords": ["con chiên lạc", "chiên lạc", "chiên mất", "người chăn hiền lành", "người chăn nhân lành", "tìm con chiên lạc", "chín mươi chín con"],
            "ai_insight": "Đức Chúa Trời không muốn một linh hồn nào bị hư mất. Người Chăn Nhân Lành sẵn sàng để lại chín mươi chín con nơi đồng vắng để băng rừng vượt suối tìm cho được một con chiên bị lạc.",
            "passages": [
                {"ref": "Lu-ca 15:3-7", "book_id": "LUK", "chapter": 15, "verse": 4, "snippet": "Ai trong các ngươi có một trăm con chiên, nếu mất một con, há chẳng để chín mươi chín con nơi đồng vắng đặng đi tìm con bị mất cho kỳ được sao?"},
                {"ref": "Giăng 10:11-15", "book_id": "JHN", "chapter": 10, "verse": 11, "snippet": "Ta là người chăn hiền lành; người chăn hiền lành vì chiên mình phó sự sống."}
            ]
        },
        {
            "id": "psalm_23_shepherd",
            "title": "Thi Thiên 23: Đức Giê-hô-va Là Đấng Chăn Giữ Tôi",
            "category": "Thánh Ca & Khôn Ngoan",
            "keywords": ["đức giê-hô-va là đấng chăn giữ tôi", "chúa là đấng chăn giữ", "đồng cỏ xanh tươi", "mép nước bình tịnh", "trũng bóng chết", "chén tôi đầy tràn", "nhà đức giê-hô-va đời đời"],
            "ai_insight": "Khúc hoan ca bất hủ của Đa-vít về sự chăm sóc, dẫn dắt bình an và bảo vệ tuyệt đối của Đức Chúa Trời trong mọi thăng trầm của đời sống, kể cả khi bước qua trũng bóng chết.",
            "passages": [
                {"ref": "Thi thiên 23:1-6", "book_id": "PSA", "chapter": 23, "verse": 1, "snippet": "Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì. Ngài khiến tôi an nghỉ nơi đồng cỏ xanh tươi, dẫn tôi đến mé nước bình tịnh."}
            ]
        },
        {
            "id": "john_3_16_love",
            "title": "Giăng 3:16: Tình Yêu Thương Cứu Chuộc Vĩ Đại Của Chúa",
            "category": "Phúc Âm",
            "keywords": ["vì đức chúa trời yêu thương thế gian", "giăng 3:16", "ban con một của ngài", "hễ ai tin con ấy", "không bị hư mất", "được sự sống đời đời"],
            "ai_insight": "Được mệnh danh là 'Tin Lành thu nhỏ', tóm gọn toàn bộ kế hoạch cứu rỗi của Đức Chúa Trời: Động cơ là tình yêu, Hành động là ban Con Một, Điều kiện là đức tin, và Kết quả là sự sống đời đời.",
            "passages": [
                {"ref": "Giăng 3:16", "book_id": "JHN", "chapter": 3, "verse": 16, "snippet": "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con một của Ngài, hầu cho hễ ai tin Con ấy không bị hư mất mà được sự sống đời đời."}
            ]
        },
        {
            "id": "salt_and_light",
            "title": "Muối Của Đất & Ánh Sáng Của Thế Gian",
            "category": "Bài Giảng Trên Núi",
            "keywords": ["muối của đất", "sự sáng của thế gian", "ánh sáng thế gian", "ngọn đèn trên chân đèn", "thành trên núi", "soi sáng trước mặt người ta"],
            "ai_insight": "Chúa Giê-xu kêu gọi người theo Ngài giữ vai trò bảo tồn đạo đức (như muối chống hoại tử) và chiếu tỏa chân lý, việc lành của Đấng Christ giữa một thế gian tối tăm tội lỗi.",
            "passages": [
                {"ref": "Ma-thi-ơ 5:13-16", "book_id": "MAT", "chapter": 5, "verse": 13, "snippet": "Các ngươi là muối của đất... Các ngươi là sự sáng của thế gian. Một cái thành ở trên núi thì không khi nào khuất được."}
            ]
        },
        {
            "id": "the_beatitudes",
            "title": "Bát Phúc (Tám Phước Lành Trên Núi)",
            "category": "Bài Giảng Trên Núi",
            "keywords": ["bát phúc", "tám phước lành", "bài giảng trên núi", "phước cho kẻ có lòng khó khăn", "phước cho kẻ than khóc", "phước cho kẻ nhu mì", "phước cho kẻ đói khát sự công bình"],
            "ai_insight": "Hiến chương Nước Trời đảo ngược mọi giá trị thế tục: Phước hạnh đích thực không nằm ở quyền lực tiền tài, mà ở lòng khiêm nhường, thanh sạch, chịu khổ vì Chúa và khao khát sự công bình.",
            "passages": [
                {"ref": "Ma-thi-ơ 5:3-12", "book_id": "MAT", "chapter": 5, "verse": 3, "snippet": "Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy! Phước cho kẻ than khóc, vì sẽ được an ủi!"}
            ]
        },
        {
            "id": "fruit_of_the_spirit",
            "title": "Bông Trái Của Đức Thánh Linh",
            "category": "Thư Tín",
            "keywords": ["trái thánh linh", "bông trái thánh linh", "trái của thánh linh", "yêu thương vui mừng bình an", "nhịn nhục nhân từ hiền lành", "trung tín mềm mại tiết độ"],
            "ai_insight": "Phẩm hạnh tâm linh 9 khía cạnh được hình thành tự nhiên bởi sự ngự trị của Đức Thánh Linh trong đời sống Cơ Đốc nhân bước đi theo quyền năng của Lời Chúa.",
            "passages": [
                {"ref": "Ga-la-ti 5:22-23", "book_id": "GAL", "chapter": 5, "verse": 22, "snippet": "Nhưng trái của Thánh Linh, ấy là lòng yêu thương, sự vui mừng, bình an, nhịn nhục, nhân từ, hiền lành, trung tín, mềm mại, tiết độ."}
            ]
        },
        {
            "id": "armor_of_god",
            "title": "Mọi Khí Giới Của Đức Chúa Trời (Giáp Trụ Thuộc Linh)",
            "category": "Thư Tín",
            "keywords": ["giáp trụ", "khí giới đức chúa trời", "mọi khí giới", "nịt lưng bằng chân lý", "giáp công bình", "giày bình an", "thuẫn đức tin", "mão cứu rỗi", "gươm thánh linh"],
            "ai_insight": "Chiến trận của tín đồ không phải chống lại thịt và huyết mà chống lại các quyền lực tối tăm. Khí giới duy nhất để phản công là Gươm của Thánh Linh, tức là Lời Đức Chúa Trời.",
            "passages": [
                {"ref": "Ê-phê-sô 6:10-18", "book_id": "EPH", "chapter": 6, "verse": 11, "snippet": "Hãy mang lấy mọi khí giới của Đức Chúa Trời, để được đứng vững mà địch cùng mưu kế của ma quỷ."}
            ]
        },
        {
            "id": "love_chapter_1cor13",
            "title": "1 Cô-rinh-tô 13: Bài Ca Tình Yêu Thương Bất Diệt",
            "category": "Thư Tín",
            "keywords": ["tình yêu thương hay nhịn nhục", "1 cô-rinh-tô 13", "bài ca tình yêu", "tình yêu thương không ghen tị", "đức tin trông cậy tình yêu thương", "điều lớn hơn hết là tình yêu thương"],
            "ai_insight": "Mọi ân tứ quyền năng, tri thức thần học hay sự hy sinh nếu không có tình yêu thương Agape vị tha thì chỉ như thanh la kêu vang chập chõa inh ỏi vô ích.",
            "passages": [
                {"ref": "1 Cô-rinh-tô 13:4-8", "book_id": "1CO", "chapter": 13, "verse": 4, "snippet": "Tình yêu thương hay nhịn nhục; tình yêu thương hay nhân từ; tình yêu thương chẳng ghen tị, chẳng khoe mình, chẳng lên mình kiêu ngạo... Tình yêu thương chẳng hề hư mất bao giờ."}
            ]
        },
        {
            "id": "faith_hall_of_fame",
            "title": "Hê-bơ-rơ 11: Bản Thao Diễn Đức Tin Lịch Sử",
            "category": "Thư Tín",
            "keywords": ["đức tin là sự biết chắc vững vàng", "hê-bơ-rơ 11", "bảng vàng đức tin", "những điều mình đang trông mong", "bằng chứng của những điều chẳng xem thấy", "không có đức tin không thể nào đẹp lòng chúa"],
            "ai_insight": "Định nghĩa kinh điển về đức tin: hành động vâng phục cụ thể tin cậy vào lời hứa của Đức Chúa Trời ngay cả khi mắt chưa trông thấy kết quả trước mắt.",
            "passages": [
                {"ref": "Hê-bơ-rơ 11:1-6", "book_id": "HEB", "chapter": 11, "verse": 1, "snippet": "Vả, đức tin là sự biết chắc vững vàng của những điều mình đang trông mong, là bằng chứng của những điều mình chẳng xem thấy."}
            ]
        },
        {
            "id": "creation_in_the_beginning",
            "title": "Sự Sáng Tạo: Ban Đầu Đức Chúa Trời Dựng Nên Trời Đất",
            "category": "Luật Pháp & Khởi Đầu",
            "keywords": ["ban đầu đức chúa trời", "sáng thế ký 1", "dựng nên trời đất", "chúa phán phải có sự sáng", "hình ảnh đức chúa trời", "ngày thứ bảy an nghỉ"],
            "ai_insight": "Nền tảng của toàn bộ thế giới quan Kinh Thánh: Vũ trụ có khởi đầu, có Đấng Tạo Hóa toàn năng tể trị bằng Lời phán, và loài người được tạo dựng theo hình ảnh thánh khiết của Ngài.",
            "passages": [
                {"ref": "Sáng thế ký 1:1-3", "book_id": "GEN", "chapter": 1, "verse": 1, "snippet": "Ban đầu Đức Chúa Trời dựng nên trời đất. Vả, đất là vô hình và trống không... Đức Chúa Trời phán rằng: Phải có sự sáng; thì có sự sáng."}
            ]
        },
        {
            "id": "isaiah_53_suffering_servant",
            "title": "Ê-sai 53: Lời Tiên Tri Về Người Tôi Tớ Chịu Khổ Thay Tội",
            "category": "Tiên Tri",
            "keywords": ["người đã mang sự đau ốm của chúng ta", "ê-sai 53", "bởi lằn roi ngài", "chiên câm trước mặt kẻ hớt lông", "người bị thương vì tội lỗi chúng ta"],
            "ai_insight": "Tiên tri 700 năm trước khi Đấng Christ giáng sinh, mô tả chính xác chi tiết cuộc khổ nạn, sự im lặng trước quan án, sự chết chuộc tội thay thế và sự chôn trong mộ người giàu.",
            "passages": [
                {"ref": "Ê-sai 53:4-6", "book_id": "ISA", "chapter": 53, "verse": 5, "snippet": "Nhưng Người đã vì tội lỗi chúng ta mà bị vết, vì sự gian ác chúng ta mà bị thương. Bởi sự sửa phạt Người chịu chúng ta được bình an, bởi lằn đòn Người chúng ta được lành bệnh."}
            ]
        },
        {
            "id": "revelation_new_jerusalem",
            "title": "Trời Mới Đất Mới & Thành Giê-ru-sa-lem Mới",
            "category": "Khải Huyền",
            "keywords": ["trời mới đất mới", "khải huyền 21", "lau ráo hết nước mắt", "không còn sự chết", "chúa ngự giữa loài người", "ta làm mới lại hết thảy muôn vật"],
            "ai_insight": "Đích đến tối hậu của lịch sử cứu chuộc: Sự chiến thắng tuyệt đối trên sự chết và ma quỷ, nước mắt được lau khô, sự thông công mật thiết giữa Đức Chúa Trời và tuyển dân được phục hồi đời đời.",
            "passages": [
                {"ref": "Khải huyền 21:1-5", "book_id": "REV", "chapter": 21, "verse": 4, "snippet": "Ngài sẽ lau ráo hết nước mắt khỏi mắt chúng, sẽ không có sự chết, cũng không có than khóc, kêu ca, hay là đau đớn nữa; vì những sự thứ nhất đã qua rồi."}
            ]
        },
        {
            "id": "christ_the_true_vine",
            "title": "Đức Chúa Giê-xu Là Cây Nho Thật",
            "category": "Ẩn Dụ & Phúc Âm",
            "keywords": ["cây nho thật", "gốc nho", "nhánh nho", "cứ ở trong ta", "ngoài ta các ngươi chẳng làm chi được", "kết quả nhiều"],
            "ai_insight": "Hình ảnh sống động về mối liên hiệp sống hữu cơ với Chúa: Nhánh nho không thể tự mình kết quả nếu không dính liền vào gốc nho; cũng vậy, tín đồ chỉ có thể sống đắc thắng khi bám rễ bền chặt trong Lời Chúa.",
            "passages": [
                {"ref": "Giăng 15:1-8", "book_id": "JHN", "chapter": 15, "verse": 5, "snippet": "Ta là gốc nho, các ngươi là nhánh. Ai cứ ở trong Ta và Ta trong người ấy, thì kết quả nhiều; vì ngoài Ta các ngươi chẳng làm chi được."}
            ]
        },
        {
            "id": "seek_first_kingdom",
            "title": "Trước Hết Hãy Tìm Kiếm Nước Đức Chúa Trời",
            "category": "Bài Giảng Trên Núi",
            "keywords": ["trước hết hãy tìm kiếm nước đức chúa trời", "chớ lo lắng về ngày mai", "hoa huệ ngoài đồng", "chim sẻ trên trời", "ngài sẽ cho thêm các ngươi mọi điều ấy"],
            "ai_insight": "Nguyên tắc ưu tiên đời sống tâm linh: Đặt Nước Chúa và sự công chính của Ngài lên hàng đầu, trút bỏ gánh nặng âu lo xác thịt vì Cha trên trời luôn chăm sóc chu cấp.",
            "passages": [
                {"ref": "Ma-thi-ơ 6:25-34", "book_id": "MAT", "chapter": 6, "verse": 33, "snippet": "Nhưng trước hết, hãy tìm kiếm nước Đức Chúa Trời và sự công bình của Ngài, thì Ngài sẽ cho thêm các ngươi mọi điều ấy nữa."}
            ]
        },
        {
            "id": "great_commission",
            "title": "Đại Mạng Lệnh: Môn Đồ Hóa Muôn Dân",
            "category": "Phúc Âm",
            "keywords": ["đại mạng lệnh", "hãy đi khiến muôn dân trở nên môn đồ", "nhân danh cha con và thánh linh", "ta ở cùng các ngươi luôn", "cho đến tận thế"],
            "ai_insight": "Sứ mệnh tối thượng của Hội Thánh từ khi Chúa phục sinh thăng thiên: Rao giảng Tin Lành, làm phép báp-tem và dạy dỗ Lời Chúa cho muôn dân với lời hứa Chúa hằng ở cùng.",
            "passages": [
                {"ref": "Ma-thi-ơ 28:18-20", "book_id": "MAT", "chapter": 28, "verse": 19, "snippet": "Vậy, hãy đi dạy dỗ muôn dân, hãy nhân danh Đức Cha, Đức Con, và Đức Thánh Linh mà làm phép báp-tem cho họ, và dạy họ giữ hết cả mọi điều mà Ta đã truyền cho các ngươi."}
            ]
        }
    ]

    # Save AI Topics
    with open("data/ai-theological-topics.json", "w", encoding="utf-8") as f:
        json.dump(ai_topics, f, ensure_ascii=False, indent=2)
    print(f"✅ Đã lưu {len(ai_topics)} Chủ Đề Thần Học & Dụ Ngôn AI vào data/ai-theological-topics.json")

    # 2. Build Fast Searchable Verse Index from vi_vie.json
    with open("data/vi_vie.json", "r", encoding="utf-8") as f:
        vi_data = json.load(f)
    with open("data/books-metadata.json", "r", encoding="utf-8") as f:
        books_meta = json.load(f)

    # We extract verses that contain core thematic words
    core_filter_words = [
        "hột giống", "giống", "gieo", "hột cải", "lúa mì", "chiên", "người chăn", "mục tử",
        "con hoang đàng", "sa-ma-ri", "lân cận", "yêu thương", "đức tin", "công bình",
        "thánh linh", "báp-tem", "sự sống đời đời", "ngôi lời", "nước trời", "thiên đàng",
        "thập tự", "huyết", "chuộc tội", "cứu rỗi", "ân điển", "bình an", "vui mừng",
        "nhịn nhục", "khí giới", "gươm", "thuẫn", "vầng đá", "đồng cỏ", "trũng bóng chết",
        "lau ráo nước mắt", "trời mới đất mới", "sáng tạo", "ban đầu", "lời phán",
        "ngọn đèn", "sự sáng", "muối", "men", "cây nho", "gốc nho", "bánh hằng sống",
        "nước hằng sống", "chiên con", "an-pha", "ô-mê-ga", "mặc thị", "khải huyền"
    ]

    indexed_verses = []
    for b_idx, vi_book in enumerate(vi_data):
        bmeta = books_meta[b_idx]
        book_id = bmeta["id"]
        book_name = bmeta["name_vi"]

        for ch_idx, ch_verses in enumerate(vi_book["chapters"]):
            ch_num = ch_idx + 1
            for v_idx, v_text in enumerate(ch_verses):
                v_num = v_idx + 1
                v_clean = re.sub(r'\s+', ' ', v_text).strip()
                v_lower = v_clean.lower()

                # Check if it contains any core filter words
                matched = any(w in v_lower for w in core_filter_words)
                if matched:
                    indexed_verses.append({
                        "book_id": book_id,
                        "book_name": book_name,
                        "chapter": ch_num,
                        "verse": v_num,
                        "ref": f"{book_name} {ch_num}:{v_num}",
                        "text": v_clean
                    })

    # Save Search Index
    with open("data/bible-search-index.json", "w", encoding="utf-8") as f:
        json.dump(indexed_verses, f, ensure_ascii=False, separators=(',', ':'))

    print(f"✅ Đã lập chỉ mục {len(indexed_verses)} Câu Kinh Thánh Trọng Tâm vào data/bible-search-index.json")

if __name__ == "__main__":
    main()
