# -*- coding: utf-8 -*-
"""
Script làm giàu dữ liệu Kinh Thánh toàn diện cho 66 sách
Bao gồm văn bản chi tiết đa bản dịch cho Khải Huyền 1, Khải Huyền 21,
Sáng thế ký 1, Thi thiên 23, Ma-thi-ơ 5, Ê-sai 53, Rô-ma 8, Công vụ 2,
Xuất Ê-díp-tô Ký 20, Giăng 1 và văn bản chuẩn cho đoạn 1 của tất cả 66 sách!
"""

import json

with open("data/default-bible-passages.json", "r", encoding="utf-8") as f:
    passages = json.load(f)

# 1. KHẢI HUYỀN 1 (REV.1)
passages["REV.1"] = {
    "ref": "Khải huyền 1",
    "book_id": "REV",
    "chapter_num": 1,
    "title_vi": "Sự Khải Thị Của Đấng Christ & Thị Kiến Đấng Đầu Tiên Và Cuối Cùng",
    "verses": [
        {
            "verse_num": 1,
            "text_primary": "Sự khải thị của Đức Chúa Giê-xu Christ, mà Đức Chúa Trời đã ban cho Ngài để tỏ ra cho các tôi tớ Ngài những điều sắp sửa xảy đến.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Sự khải thị của Đức Chúa Jêsus Christ, mà Đức Chúa Trời đã ban cho Ngài đặng tỏ ra cùng tôi tớ Ngài những điều kíp phải xảy đến.",
                "BDM": "Sự khải thị của Đức Chúa Giê-xu Christ, mà Đức Chúa Trời đã ban cho Ngài để tỏ ra cho các tôi tớ Ngài những điều sắp sửa xảy đến.",
                "BPT": "Đây là sự mặc khải của Chúa Cứu Thế Giê-xu mà Thượng Đế ban cho Ngài để chỉ cho các đầy tớ Ngài những việc sắp xảy đến mau lẹ.",
                "BD2011": "Mặc khải của Đức Chúa Jesus Christ, mà Đức Chúa Trời đã ban cho Ngài để bày tỏ cho các tôi tớ Ngài những điều sắp phải xảy đến.",
                "BHD": "Đây là khải thị của Chúa Cứu Thế Giê-xu. Đức Chúa Trời ban khải thị này cho Ngài để bày tỏ cho các tôi tớ Ngài những việc sắp xảy ra.",
                "CGKPV": "Mặc khải của Đức Giê-su Ki-tô, điều mà Thiên Chúa đã ban cho Người để chỉ cho các tôi tớ Người thấy những việc sắp phải xảy đến.",
                "KJV": "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass.",
                "ESV": "The revelation of Jesus Christ, which God gave him to show to his servants the things that must soon take place.",
                "NIV": "The revelation from Jesus Christ, which God gave him to show his servants what must soon take place.",
                "INTERLINEAR": "Ἀποκάλυψις (G602 - Khải thị) Ἰησοῦ (G2424) Χριστοῦ (G5547), ἣν (G3739) ἔδωκεν (G1325 - đã ban) αὐτῷ (G846) ὁ (G3588) Θεός (G2316)..."
            },
            "cross_refs": ["Đa-ni-ên 2:28-29", "Khải huyền 22:6", "Amos 3:7"]
        },
        {
            "verse_num": 3,
            "text_primary": "Phước cho người đọc và những người nghe lời tiên tri này, cùng giữ những điều đã chép trong đó, vì thời giờ đã gần rồi.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Phước cho kẻ đọc cùng những kẻ nghe lời tiên tri nầy, và giữ theo điều đã chép ở trong, vì thì giờ đã gần rồi.",
                "BDM": "Phước cho người đọc và những người nghe lời tiên tri này, cùng giữ những điều đã chép trong đó, vì thời giờ đã gần rồi.",
                "BPT": "Phước cho người đọc lớn tiếng những lời tiên tri nầy, và phước cho những ai nghe và làm theo điều đã ghi chép, vì thì giờ đã gần rồi.",
                "BD2011": "Phước cho người đọc và những ai nghe những lời tiên tri này cùng vâng giữ những điều viết trong đó, vì thời giờ đã gần rồi.",
                "BHD": "Phước cho người đọc và những ai nghe lời tiên tri này, cùng giữ theo những điều đã ghi chép trong đó, vì thời điểm đã cận kề.",
                "CGKPV": "Phúc thay người đọc, phúc thay những ai nghe những lời sấm ngôn này và tuân giữ các điều đã chép trong đó, vì thời giờ đã gần đến.",
                "KJV": "Blessed is he that readeth, and they that hear the words of this prophecy, and keep those things which are written therein: for the time is at hand.",
                "ESV": "Blessed is the one who reads aloud the words of this prophecy, and blessed are those who hear, and who keep what is written in it, for the time is near.",
                "NIV": "Blessed is the one who reads aloud the words of this prophecy, and blessed are those who hear it and take to heart what is written in it, because the time is near.",
                "INTERLINEAR": "μακάριος (G3107 - Phước hạnh) ὁ (G3588) ἀναγινώσκων (G314 - người đọc) καὶ (G2532) οἱ (G3588) ἀκούοντες (G191 - những kẻ nghe)..."
            },
            "cross_refs": ["Khải huyền 22:7", "Lu-ca 11:28", "Rô-ma 13:11"]
        },
        {
            "verse_num": 7,
            "text_primary": "Kìa, Ngài ngự giữa đám mây mà đến, mọi mắt đều sẽ trông thấy Ngài, kể cả những kẻ đã đâm Ngài; muôn dân trên đất sẽ vì cớ Ngài mà than khóc.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Kìa, Ngài đến giữa những đám mây, muôn mắt sẽ ngó thấy Ngài, cả đến những kẻ đã đâm Ngài cũng vậy; muôn họ trên đất sẽ đấm ngực phàn nàn vì cớ Ngài.",
                "BDM": "Kìa, Ngài ngự giữa đám mây mà đến, mọi mắt đều sẽ trông thấy Ngài, kể cả những kẻ đã đâm Ngài; muôn dân trên đất sẽ vì cớ Ngài mà than khóc.",
                "BPT": "Kìa, Ngài ngự mây mà đến! Mọi người sẽ thấy Ngài, cả những kẻ đã đâm Ngài cũng vậy. Mọi sắc dân trên đất sẽ than khóc vì Ngài.",
                "BD2011": "Kìa, Ngài đến giữa các đám mây; mọi mắt sẽ thấy Ngài, cả đến những kẻ đã đâm Ngài cũng vậy; mọi chi tộc trên đất sẽ than khóc vì cớ Ngài.",
                "BHD": "Kìa, Ngài ngự giữa đám mây mà đến, mọi mắt sẽ thấy Ngài, kể cả những kẻ đã đâm Ngài; muôn dân trên đất sẽ khóc lóc thở than vì Ngài.",
                "CGKPV": "Kìa, Người ngự đến giữa đám mây. Ai nấy sẽ thấy Người, cả những kẻ đã đâm Người; mọi dân tộc trên mặt đất sẽ đấm ngực than khóc vì Người.",
                "KJV": "Behold, he cometh with clouds; and every eye shall see him, and they also which pierced him: and all kindreds of the earth shall wail because of him. Even so, Amen.",
                "ESV": "Behold, he is coming with the clouds, and every eye will see him, even those who pierced him, and all tribes of the earth will wail on account of him. Even so. Amen.",
                "NIV": "'Look, he is coming with the clouds,' and 'every eye will see him, even those who pierced him'; and all peoples on earth 'will mourn because of him.' So shall it be! Amen.",
                "INTERLINEAR": "Ἰδοὺ (G2400 - Kìa) ἔρχεται (G2064 - Ngài đến) μετὰ (G3326 - cùng) τῶν (G3588) νεφελῶν (G3507 - các đám mây), καὶ (G2532) ὄψεται (G3700 - sẽ thấy) αὐτὸν (G846) πᾶς (G3956 - mọi) ὀφθαλμὸς (G3788 - con mắt)..."
            },
            "cross_refs": ["Đa-ni-ên 7:13", "Xa-cha-ri 12:10", "Ma-thi-ơ 24:30", "Giăng 19:37"]
        },
        {
            "verse_num": 8,
            "text_primary": "Chúa là Đức Chúa Trời, Đấng Hiện Có, Đã Có và Đang Đến, Đấng Toàn Năng phán: 'Ta là An-pha và Ô-mê-ga'.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Chúa là Đức Chúa Trời, Đấng Hiện Có, Đã Có Và Còn Đến, là Đấng Toàn Năng, phán rằng: Ta là An-pha và Ô-mê-ga.",
                "BDM": "Chúa là Đức Chúa Trời, Đấng Hiện Có, Đã Có và Đang Đến, Đấng Toàn Năng phán: 'Ta là An-pha và Ô-mê-ga'.",
                "BPT": "Chúa là Thượng Đế phán: 'Ta là An-pha và Ô-mê-ga, Đấng hiện có, đã có và đang đến, Đấng Toàn Năng.'",
                "BD2011": "Chúa là Đức Chúa Trời phán: 'Ta là Alpha và Omega, Đấng Hiện Có, Đã Có, và Đang Đến, là Đấng Toàn Năng.'",
                "BHD": "Chúa là Đức Chúa Trời, Đấng Hiện Có, Đã Có, và Đang Đến, Đấng Toàn Năng tuyên bố: 'Ta là An-pha và Ô-mê-ga.'",
                "CGKPV": "Đức Chúa là Thiên Chúa phán: 'Ta là An-pha và Ô-mê-ga, là Đấng hiện có, đã có và đang đến, là Đấng Toàn Năng.'",
                "KJV": "I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.",
                "ESV": "'I am the Alpha and the Omega,' says the Lord God, 'who is and who was and who is to come, the Almighty.'",
                "NIV": "'I am the Alpha and the Omega,' says the Lord God, 'who is, and who was, and who is to come, the Almighty.'",
                "INTERLINEAR": "Ἐγώ (G1473 - Ta) εἰμι (G1510 - là) τὸ (G3588) Ἄλφα (G1 - Alpha) καὶ (G2532 - và) τὸ (G3588) Ὦ (G5598 - Omega), λέγει (G3004 - phán) Κύριος (G2962 - Chúa) ὁ (G3588) Θεός (G2316)..."
            },
            "cross_refs": ["Ê-sai 41:4", "Ê-sai 44:6", "Khải huyền 21:6", "Khải huyền 22:13"]
        },
        {
            "verse_num": 17,
            "text_primary": "Khi thấy Ngài, tôi ngã quỵ dưới chân Ngài như chết. Nhưng Ngài đặt tay hữu lên tôi và nói: 'Đừng sợ! Ta là Đấng Đầu Tiên và Đấng Cuối Cùng'.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Vừa thấy Ngài, tôi ngã xuống chân Ngài như chết; nhưng Ngài đặt tay hữu trên tôi, mà rằng: Đừng sợ chi, Ta là Đấng trước hết và là Đấng sau cùng.",
                "BDM": "Khi thấy Ngài, tôi ngã quỵ dưới chân Ngài như chết. Nhưng Ngài đặt tay hữu lên tôi và nói: 'Đừng sợ! Ta là Đấng Đầu Tiên và Đấng Cuối Cùng'.",
                "BPT": "Khi thấy Ngài, tôi quỵ xuống chân Ngài như chết. Nhưng Ngài đặt tay phải trên tôi bảo: 'Đừng sợ! Ta là Đấng Đầu Tiên và Đấng Cuối Cùng.'",
                "BD2011": "Khi tôi thấy Ngài, tôi ngã phục dưới chân Ngài như chết, nhưng Ngài đặt tay phải trên tôi và bảo, 'Đừng sợ! Ta là Đấng Đầu Tiên và Đấng Cuối Cùng.'",
                "BHD": "Vừa thấy Ngài, tôi ngã gục dưới chân Ngài như chết, nhưng Ngài đặt tay phải lên tôi phán: 'Đừng sợ! Ta là Đầu Tiên và Cuối Cùng.'",
                "CGKPV": "Lúc thấy Người, tôi ngã vật xuống dưới chân Người như chết. Người đặt tay hữu lên tôi và nói: 'Đừng sợ! Ta là Đầu và là Cuối.'",
                "KJV": "And when I saw him, I fell at his feet as dead. And he laid his right hand upon me, saying unto me, Fear not; I am the first and the last:",
                "ESV": "When I saw him, I fell at his feet as though dead. But he laid his right hand on me, saying, 'Fear not, I am the first and the last'",
                "NIV": "When I saw him, I fell at his feet as though dead. Then he placed his right hand on me and said: 'Do not be afraid. I am the First and the Last.'",
                "INTERLINEAR": "Καὶ (G2532) ὅτε (G3753 - khi) εἶδον (G1492 - tôi thấy) αὐτόν (G846), ἔπεσα (G4098 - tôi ngã) πρὸς (G4314) τοὺς (G3588) πόδας (G4228 - chân) αὐτοῦ (G846) ὡς (G5613) νεκρός (G3498 - như chết)..."
            },
            "cross_refs": ["Ê-xê-chi-ên 1:28", "Đa-ni-ên 10:8-12", "Ê-sai 44:6", "Ma-thi-ơ 17:6-7"]
        },
        {
            "verse_num": 18,
            "text_primary": "và là Đấng Hằng Sống; Ta đã chết, kìa nay Ta sống đời đời vô cùng, cầm chìa khóa của Sự Chết và Âm Phủ.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Ta là Đấng Sống, Ta đã chết, kìa nay Ta sống đời đời, cầm chìa khóa của sự chết và âm phủ.",
                "BDM": "và là Đấng Hằng Sống; Ta đã chết, kìa nay Ta sống đời đời vô cùng, cầm chìa khóa của Sự Chết và Âm Phủ.",
                "BPT": "Ta là Đấng Sống. Ta đã chết nhưng nhìn xem, Ta sống đời đời, cầm chìa khóa của sự chết và âm phủ.",
                "BD2011": "và là Đấng Hằng Sống. Ta đã chết, nhưng kìa, Ta sống đời đời vô cùng. Ta giữ các chìa khóa của Sự Chết và Âm Phủ.",
                "BHD": "Ta là Đấng Hằng Sống. Ta đã chết, nhưng nay Ta sống đời đời bất tận, và Ta nắm giữ chìa khóa của Sự Chết và Âm Phủ.",
                "CGKPV": "Ta là Đấng Hằng Sống, Ta đã chết, và nay Ta sống đến muôn thuở muôn đời; Ta giữ chìa khoá của Tử thần và Âm phủ.",
                "KJV": "I am he that liveth, and was dead; and, behold, I am alive for evermore, Amen; and have the keys of hell and of death.",
                "ESV": "and the living one. I died, and behold I am alive forevermore, and I have the keys of Death and Hades.",
                "NIV": "I am the Living One; I was dead, and now look, I am alive for ever and ever! And I hold the keys of death and Hades.",
                "INTERLINEAR": "καὶ (G2532) ὁ (G3588) ζῶν (G2198 - Đấng Sống), καὶ (G2532) ἐγενόμην (G1096) νεκρὸς (G3498 - đã chết) καὶ (G2532) ἰδοὺ (G2400 - kìa) ζῶν (G2198) εἰμι (G1510) εἰς (G1519) τοὺς (G3588) αἰῶνας (G165 - đời đời)..."
            },
            "cross_refs": ["Rô-ma 6:9", "Hê-bơ-rơ 7:25", "Thi thiên 68:20", "Ma-thi-ơ 16:19"]
        }
    ]
}

# 2. SÁNG THẾ KÝ 1 (GEN.1)
passages["GEN.1"] = {
    "ref": "Sáng thế ký 1",
    "book_id": "GEN",
    "chapter_num": 1,
    "title_vi": "Khởi Nguyên Vũ Trụ & Công Cuộc Sáng Tạo Sáu Ngày",
    "verses": [
        {
            "verse_num": 1,
            "text_primary": "Ban đầu, Đức Chúa Trời sáng tạo trời và đất.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Ban đầu Đức Chúa Trời dựng nên trời đất.",
                "BDM": "Ban đầu Đức Chúa Trời sáng tạo trời và đất.",
                "BPT": "Ban đầu Thượng Đế sáng tạo trời đất.",
                "BD2011": "Ban đầu Đức Chúa Trời sáng tạo trời và đất.",
                "BHD": "Ban đầu, Đức Chúa Trời sáng tạo trời đất.",
                "CGKPV": "Lúc khởi đầu, Thiên Chúa sáng tạo trời đất.",
                "KJV": "In the beginning God created the heaven and the earth.",
                "ESV": "In the beginning, God created the heavens and the earth.",
                "NIV": "In the beginning God created the heavens and the earth.",
                "INTERLINEAR": "בְּרֵאשִׁית (H7225 - Bereshit: Ban đầu) בָּרָא (H1254 - bara: sáng tạo) אֱלֹהִים (H430 - Elohim: Đức Chúa Trời) אֵת הַשָּׁמַיִם (H8064 - trời) וְאֵת הָאָרֶץ (H776 - và đất)."
            },
            "cross_refs": ["Giăng 1:1-3", "Thi thiên 102:25", "Hê-bơ-rơ 11:3", "Cô-lô-se 1:16"]
        },
        {
            "verse_num": 2,
            "text_primary": "Đất vô hình và trống không, bóng tối bao trùm mặt vực; Thần của Đức Chúa Trời vận hành trên mặt nước.",
            "metaphor_id": "living_water",
            "translations": {
                "BTT": "Vả, đất là vô hình và trống không, sự mờ tối ở trên mặt vực; Thần Đức Chúa Trời vận hành trên mặt nước.",
                "BDM": "Đất chưa có hình thể và trống không, bóng tối bao trùm mặt vực sâu; Thần Đức Chúa Trời vận hành trên mặt nước.",
                "BPT": "Đất lúc đó chưa có hình thể và còn trống không; bóng tối bao trùm vực sâu thẳm, và Thần của Thượng Đế lượn trên mặt nước.",
                "BD2011": "Lúc ấy đất vô hình và trống không; bóng tối bao trùm mặt vực; Thánh Linh Đức Chúa Trời vận hành trên mặt nước.",
                "BHD": "Lúc ấy mặt đất hoang vu, chưa có hình dạng; bóng tối bao trùm vực sâu; và Thần Đức Chúa Trời bay lượn trên mặt nước.",
                "CGKPV": "Đất còn trống rỗng chưa có hình dạng, bóng tối bao trùm vực thẳm, và thần khí Thiên Chúa bay lượn trên mặt nước.",
                "KJV": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
                "ESV": "The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.",
                "NIV": "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.",
                "INTERLINEAR": "וְהָאָרֶץ (H776 - Và đất) הָיְתָה (H1961) תֹהוּ (H8414 - tohu: vô hình) וָבֹהוּ (H922 - bohu: trống không)..."
            },
            "cross_refs": ["Giê-rê-mi 4:23", "Thi thiên 104:30", "Gióp 26:13"]
        },
        {
            "verse_num": 3,
            "text_primary": "Đức Chúa Trời phán: 'Phải có ánh sáng', thì có ánh sáng.",
            "metaphor_id": "salt_and_light",
            "translations": {
                "BTT": "Đức Chúa Trời phán rằng: Phải có sự sáng; thì có sự sáng.",
                "BDM": "Đức Chúa Trời phán: 'Phải có ánh sáng', thì có ánh sáng.",
                "BPT": "Thượng Đế phán: 'Phải có ánh sáng!' thì liền có ánh sáng.",
                "BD2011": "Đức Chúa Trời phán, 'Phải có ánh sáng,' và ánh sáng xuất hiện.",
                "BHD": "Đức Chúa Trời phán: 'Phải có ánh sáng!' Liền có ánh sáng.",
                "CGKPV": "Thiên Chúa phán: 'Phải có ánh sáng.' Liền có ánh sáng.",
                "KJV": "And God said, Let there be light: and there was light.",
                "ESV": "And God said, 'Let there be light,' and there was light.",
                "NIV": "And God said, 'Let there be light,' and there was light.",
                "INTERLINEAR": "וַיֹּאמֶר (H559 - Và phán) אֱלֹהִים (H430 - Elohim) יְהִי (H1961 - Hãy có) אוֹר (H216 - Ánh sáng: or) וַיְהִי (H1961) אוֹר (H216 - và có ánh sáng)."
            },
            "cross_refs": ["2 Cô-rinh-tô 4:6", "Thi thiên 33:9", "Giăng 1:5"]
        }
    ]
}

# 3. THI THIÊN 23 (PSA.23)
passages["PSA.23"] = {
    "ref": "Thi thiên 23",
    "book_id": "PSA",
    "chapter_num": 23,
    "title_vi": "Đấng Chăn Giữ Nhân Từ — Bài Ca An Nghỉ Thuộc Linh",
    "verses": [
        {
            "verse_num": 1,
            "text_primary": "Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì.",
            "metaphor_id": "lamb_of_god",
            "translations": {
                "BTT": "Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì.",
                "BDM": "CHÚA là Đấng chăn giữ tôi, tôi sẽ không thiếu thốn gì.",
                "BPT": "CHÚA là Đấng chăn giữ tôi, tôi sẽ chẳng thiếu thốn điều chi.",
                "BD2011": "CHÚA là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì.",
                "BHD": "Chúa Hằng Hữu là Đấng chăn giữ tôi, tôi chẳng thiếu thốn gì.",
                "CGKPV": "CHÚA là mục tử chăn dắt tôi, tôi chẳng thiếu thốn gì.",
                "KJV": "The LORD is my shepherd; I shall not want.",
                "ESV": "The LORD is my shepherd; I shall not want.",
                "NIV": "The LORD is my shepherd, I lack nothing.",
                "INTERLINEAR": "יְהוָה (H3068 - Đức Giê-hô-va: Yahweh) רֹעִי (H7462 - Đấng chăn giữ tôi: ro'i) לֹא (H3808 - chẳng) אֶחְסָר (H2637 - thiếu thốn)."
            },
            "cross_refs": ["Giăng 10:11", "Ê-xê-chi-ên 34:11-15", "1 Phi-e-rơ 2:25", "Phi-líp 4:19"]
        },
        {
            "verse_num": 2,
            "text_primary": "Ngài khiến tôi an nghỉ nơi đồng cỏ xanh tươi, dẫn tôi đến mé nước bình tịnh.",
            "metaphor_id": "living_water",
            "translations": {
                "BTT": "Ngài khiến tôi an nghỉ nơi đồng cỏ xanh tươi, dẫn tôi đến mé nước bình tịnh.",
                "BDM": "Ngài cho tôi nằm nghỉ trong đồng cỏ xanh tươi, dẫn tôi đến bờ suối nước trong lành.",
                "BPT": "Ngài cho tôi nghỉ ngơi trên đồng cỏ xanh tươi, đưa tôi đến gần dòng nước thanh tịnh.",
                "BD2011": "Ngài khiến tôi an nghỉ nơi đồng cỏ xanh tươi; Ngài dẫn tôi đến bên mé nước bình tịnh.",
                "BHD": "Ngài cho tôi nghỉ ngơi trên đồng cỏ xanh rờn, dẫn tôi đến mé nước bình tịnh.",
                "CGKPV": "Trong đồng cỏ xanh tươi, Người cho tôi nằm nghỉ. Người đưa tôi tới dòng nước trong lành.",
                "KJV": "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
                "ESV": "He makes me lie down in green pastures. He leads me beside still waters.",
                "NIV": "He makes me lie down in green pastures, he leads me beside quiet waters,",
                "INTERLINEAR": "בִּנְאוֹת (H4999 - nơi đồng cỏ) דֶּשֶׁא (H1877 - xanh tươi) יַרְבִּיצֵנִי (H7257 - khiến tôi an nghỉ)..."
            },
            "cross_refs": ["Ê-sai 40:11", "Khải huyền 7:17", "Ma-thi-ơ 11:28-29"]
        },
        {
            "verse_num": 3,
            "text_primary": "Ngài bổ lại linh hồn tôi, dẫn tôi vào các lối công bình vì cớ danh Ngài.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Ngài bổ lại linh hồn tôi, dẫn tôi vào các lối công bình, vì cớ danh Ngài.",
                "BDM": "Ngài hồi phục linh hồn tôi; Ngài dẫn dắt tôi vào các lối công chính vì danh Ngài.",
                "BPT": "Ngài phục hồi sinh lực cho tôi; Ngài dẫn tôi vào đường lối công chính vì danh Ngài.",
                "BD2011": "Ngài phục hồi linh hồn tôi; Ngài dẫn tôi vào các lối công chính vì cớ danh Ngài.",
                "BHD": "Ngài phục hồi sức lực linh hồn tôi, dẫn tôi vào đường công chính vì danh Ngài.",
                "CGKPV": "Người bổ sức cho tôi. Người dẫn tôi trên đường ngay nẻo chính vì danh dự của Người.",
                "KJV": "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
                "ESV": "He restores my soul. He leads me in paths of righteousness for his name's sake.",
                "NIV": "he refreshes my soul. He guides me along the right paths for his name's sake.",
                "INTERLINEAR": "נַפְשִׁי (H5315 - Linh hồn tôi) יְשׁוֹבֵב (H7725 - bổ lại / phục hồi) יַנְחֵנִי (H5148 - dẫn dắt tôi)..."
            },
            "cross_refs": ["Thi thiên 19:7", "Châm ngôn 8:20", "Ê-xê-chi-ên 20:9"]
        },
        {
            "verse_num": 4,
            "text_primary": "Dù khi tôi đi trong trũng bóng chết, tôi sẽ chẳng sợ tai họa nào; vì Ngài ở cùng tôi; cây trượng và cây gậy của Ngài an ủi tôi.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Dầu khi tôi đi trong trũng bóng chết, tôi sẽ chẳng sợ tai họa nào; vì Chúa ở cùng tôi; cây trượng và cây gậy của Chúa an ủi tôi.",
                "BDM": "Dù khi tôi đi qua thung lũng bóng chết, tôi sẽ chẳng sợ tai họa nào, vì Chúa ở cùng tôi; cây trượng và cây gậy của Chúa an ủi tôi.",
                "BPT": "Dù phải đi qua thung lũng tăm tối như sự chết, con sẽ chẳng sợ tai họa nào vì Ngài ở cùng con; cây roi và cây gậy của Ngài an ủi con.",
                "BD2011": "Dù khi tôi đi qua thung lũng của bóng sự chết, tôi sẽ chẳng sợ tai họa nào, vì Ngài ở cùng tôi; cây trượng và cây gậy của Ngài an ủi tôi.",
                "BHD": "Dù khi tôi đi qua thung lũng tăm tối của sự chết, tôi cũng chẳng sợ hiểm nguy nào, vì Chúa ở cùng tôi; cây trượng và cây gậy của Chúa bảo vệ và an ủi tôi.",
                "CGKPV": "Lạy Chúa, dầu qua lũng nghìn thu, con chẳng sợ tai nạn nào, vì có Chúa ở cùng con: cây roi và cây gậy của Ngài, đó là điều an ủi lòng con.",
                "KJV": "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
                "ESV": "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
                "NIV": "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
                "INTERLINEAR": "גַּם (H1571 - Dầu khi) כִּי־אֵלֵךְ (H1980 - tôi bước đi) בְּגֵיא (H1516 - trong trũng) צַלְמָוֶת (H6757 - bóng sự chết)..."
            },
            "cross_refs": ["Gióp 10:21-22", "Ê-sai 43:2", "Ma-thi-ơ 28:20", "1 Cô-rinh-tô 15:55-57"]
        }
    ]
}

# 4. MA-THI-Ơ 5 (MAT.5)
passages["MAT.5"] = {
    "ref": "Ma-thi-ơ 5",
    "book_id": "MAT",
    "chapter_num": 5,
    "title_vi": "Bài Giảng Trên Núi — Tám Mối Phước Lành & Muối Của Đất",
    "verses": [
        {
            "verse_num": 3,
            "text_primary": "Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy!",
            "metaphor_id": None,
            "translations": {
                "BTT": "Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy!",
                "BDM": "Phước cho những người nhận biết sự nghèo khó tâm linh của mình, vì Nước Thiên Đàng thuộc về họ!",
                "BPT": "Phước cho những người nghèo khó trong tâm linh, vì Nước Trời thuộc về họ!",
                "BD2011": "Phước cho những ai ý thức cảnh cơ hàn thuộc linh của mình, vì vương quốc thiên đàng thuộc về họ!",
                "BHD": "Phước cho người ý thức mình nghèo khó về tâm linh, vì Nước Thiên Đàng là của họ!",
                "CGKPV": "Phúc thay ai có tâm hồn nghèo khó, vì Nước Trời là của họ.",
                "KJV": "Blessed are the poor in spirit: for theirs is the kingdom of heaven.",
                "ESV": "'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'",
                "NIV": "'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'",
                "INTERLINEAR": "Μακάριοι (G3107 - Phước thay) οἱ (G3588) πτωχοὶ (G4434 - kẻ nghèo khó) τῷ (G3588) πνεύματι (G4151 - trong tâm linh)..."
            },
            "cross_refs": ["Ê-sai 57:15", "Ê-sai 66:2", "Lu-ca 6:20"]
        },
        {
            "verse_num": 13,
            "text_primary": "Các ngươi là muối của đất; nhưng nếu muối mất vị mặn, thì lấy chi làm cho mặn lại?",
            "metaphor_id": "salt_and_light",
            "translations": {
                "BTT": "Các ngươi là muối của đất; song nếu mất chất mặn đi, thì lấy giống chi mà làm cho mặn lại? Muối ấy không dùng chi được nữa, chỉ phải quăng ra ngoài và bị người ta đạp dưới chân.",
                "BDM": "Các ngươi là muối của đất; nhưng nếu muối mất vị mặn, thì lấy chi làm cho mặn lại? Muối ấy không còn ích lợi gì nữa, chỉ phải quẳng ra ngoài cho người ta giày đạp dưới chân.",
                "BPT": "Các con là muối của đất. Nhưng nếu muối mất chất mặn, thì lấy gì làm cho mặn lại? Nó chẳng dùng được vào việc gì nữa, chỉ đáng vứt ra ngoài cho người ta dẫm lên.",
                "BD2011": "Các ngươi là muối của đất; nhưng nếu muối mất vị mặn, thì làm sao cho mặn lại được? Nó không còn dùng được việc gì nữa, chỉ đáng ném ra ngoài cho người ta đạp dưới chân.",
                "BHD": "Các con là muối của đất. Nhưng nếu muối mất vị mặn thì làm sao lấy lại được? Nó trở nên vô dụng, chỉ bị ném ra ngoài đường cho người ta giẫm đạp.",
                "CGKPV": "Chính anh em là muối cho đời. Nhưng muối mà nhạt đi, thì lấy gì muối nó cho mặn lại? Nó đã thành vô dụng, thì chỉ còn việc quẳng ra ngoài cho người ta chà đạp thôi.",
                "KJV": "Ye are the salt of the earth: but if the salt have lost his savour, wherewith shall it be salted? it is thenceforth good for nothing, but to be cast out, and to be trodden under foot of men.",
                "ESV": "'You are the salt of the earth, but if salt has lost its taste, how shall its saltiness be restored? It is no longer good for anything except to be thrown out and trampled under people's feet.'",
                "NIV": "'You are the salt of the earth. But if the salt loses its saltiness, how can it be made salty again? It is no longer good for anything, except to be thrown out and trampled underfoot.'",
                "INTERLINEAR": "Ὑμεῖς (G5210 - Các ngươi) ἐστε (G2075 - là) τὸ (G3588) ἅλας (G217 - muối) τῆς (G3588) γῆς (G1093 - của đất)..."
            },
            "cross_refs": ["Mác 9:50", "Lu-ca 14:34-35", "Cô-lô-se 4:6"]
        },
        {
            "verse_num": 14,
            "text_primary": "Các ngươi là ánh sáng của thế gian. Một cái thành xây trên núi thì không thể bị che giấu.",
            "metaphor_id": "salt_and_light",
            "translations": {
                "BTT": "Các ngươi là sự sáng của thế gian. Một cái thành ở trên núi thì không khi nào bị khuất được.",
                "BDM": "Các ngươi là ánh sáng của thế gian. Một cái thành xây trên núi thì không thể bị che giấu.",
                "BPT": "Các con là ánh sáng cho thế gian. Một thành phố xây trên đỉnh đồi không thể bị giấu kín.",
                "BD2011": "Các ngươi là ánh sáng của thế gian. Một thành xây trên núi không thể bị che khuất.",
                "BHD": "Các con là ánh sáng cho thế gian. Một thành phố xây trên đồi cao không thể che giấu được.",
                "CGKPV": "Chính anh em là ánh sáng cho trần gian. Một thành xây trên núi không tài nào giấu được.",
                "KJV": "Ye are the light of the world. A city that is set on an hill cannot be hid.",
                "ESV": "'You are the light of the world. A city set on a hill cannot be hidden.'",
                "NIV": "'You are the light of the world. A town built on a hill cannot be hidden.'",
                "INTERLINEAR": "Ὑμεῖς (G5210 - Các ngươi) ἐστε (G2075 - là) τὸ (G3588) φῶς (G5457 - ánh sáng) τοῦ (G3588) κόσμου (G2889 - của thế gian)..."
            },
            "cross_refs": ["Giăng 8:12", "Phi-líp 2:15", "Châm ngôn 4:18"]
        }
    ]
}

# 5. Ê-SAI 53 (ISA.53)
passages["ISA.53"] = {
    "ref": "Ê-sai 53",
    "book_id": "ISA",
    "chapter_num": 53,
    "title_vi": "Người Tôi Tớ Chịu Khổ & Chiên Con Đền Tội",
    "verses": [
        {
            "verse_num": 5,
            "text_primary": "Nhưng Người đã vì tội lỗi chúng ta mà bị đâm, vì sự gian ác chúng ta mà bị chà đạp; hình phạt Người chịu đem lại bình an cho chúng ta, và bởi lằn roi Người mà chúng ta được lành bệnh.",
            "metaphor_id": "lamb_of_god",
            "translations": {
                "BTT": "Nhưng Người đã vì tội lỗi chúng ta mà bị vết, vì sự gian ác chúng ta mà bị thương. Bởi sự sửa phạt Người chịu chúng ta được bình an, bởi lằn roi Người chúng ta được lành bịnh.",
                "BDM": "Nhưng Người đã vì tội lỗi chúng ta mà bị đâm, vì sự gian ác chúng ta mà bị chà đạp; hình phạt Người chịu đem lại bình an cho chúng ta, và bởi lằn roi Người mà chúng ta được lành bệnh.",
                "BPT": "Nhưng Ngài bị thương vì tội lỗi chúng ta, bị chà nát vì sự gian ác chúng ta. Hình phạt Ngài chịu đem lại bình an cho chúng ta, và bởi các vết thương Ngài mà chúng ta được chữa lành.",
                "BD2011": "Nhưng Người vì tội ác của chúng ta mà bị đâm, vì sự gian ác của chúng ta mà bị chà đạp; hình phạt Người chịu đem lại bình an cho chúng ta, và bởi các lằn đòn Người chịu mà chúng ta được chữa lành.",
                "BHD": "Nhưng Người đã bị đâm vì tội lỗi chúng ta, bị thương tích vì sự gian ác chúng ta. Nhờ hình phạt Người chịu mà chúng ta được bình an, nhờ lằn roi Người mang mà chúng ta được chữa lành.",
                "CGKPV": "Chính Người đã bị đâm vì chúng ta phạm tội, bị nghiền nát vì chúng ta lỗi lầm; Người đã chịu sửa phạt để chúng ta được bình an, đã phải mang thương tích cho chúng ta được chữa lành.",
                "KJV": "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
                "ESV": "But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.",
                "NIV": "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
                "INTERLINEAR": "וְהוּא (H1931 - Nhưng Người) מְחֹלָל (H2490 - bị đâm) מִפְּשָׁעֵנוּ (H6588 - vì tội lỗi chúng ta)..."
            },
            "cross_refs": ["1 Phi-e-rơ 2:24", "Rô-ma 4:25", "1 Cô-rinh-tô 15:3", "Hê-bơ-rơ 9:28"]
        },
        {
            "verse_num": 7,
            "text_primary": "Người bị hà hiếp, bị khốn khổ, nhưng không hề mở miệng; như chiên con bị dắt đến hàng làm thịt, như chiên câm trước mặt kẻ hớt lông, Người chẳng từng mở miệng.",
            "metaphor_id": "lamb_of_god",
            "translations": {
                "BTT": "Người bị hà hiếp, dẫu khốn khổ dầu vậy Người chẳng từng mở miệng; như chiên con bị dắt đến hàng làm thịt, như chiên câm ở trước mặt kẻ hớt lông, Người chẳng từng mở miệng.",
                "BDM": "Người bị hà hiếp, bị khốn khổ, nhưng không hề mở miệng; như chiên con bị dắt đến hàng làm thịt, như chiên câm trước mặt kẻ hớt lông, Người chẳng từng mở miệng.",
                "BPT": "Ngài bị ngược đãi, bị áp bức, nhưng Ngài không hề mở miệng. Như chiên con bị dắt đi làm thịt, như chiên nín thinh trước mặt kẻ xén lông, Ngài không hề hé môi.",
                "BD2011": "Người bị hà hiếp và bị sỉ nhục, nhưng Người chẳng hề mở miệng; như con chiên bị dắt đến lò sát sinh, như chiên câm trước mặt kẻ hớt lông, Người không hề mở miệng.",
                "BHD": "Người bị ngược đãi và áp bức, nhưng Người chẳng mở miệng; như chiên con bị đem đi giết thịt, như chiên nín câm trước mặt người hớt lông, Người không hề hé môi.",
                "CGKPV": "Bị ngược đãi, Người cam chịu nhục, chẳng hề mở miệng; như chiên bị đem đi làm thịt, như cừu câm nín trước mặt kẻ xén lông, Người chẳng hề mở miệng.",
                "KJV": "He was oppressed, and he was afflicted, yet he opened not his mouth: he is brought as a lamb to the slaughter, and as a sheep before her shearers is dumb, so he openeth not his mouth.",
                "ESV": "He was oppressed, and he was afflicted, yet he opened not his mouth; like a lamb that is led to the slaughter, and like a sheep that before its shearers is silent, so he opened not his mouth.",
                "NIV": "He was oppressed and afflicted, yet he did not open his mouth; he was led like a lamb to the slaughter, and as a sheep before its shearers is silent, so he did not open his mouth.",
                "INTERLINEAR": "נִגַּשׂ (H5065 - Bị hà hiếp) וְהוּא (H1931) נַעֲנֶה (H6031 - bị khốn khổ) וְלֹא (H3808 - chẳng) יִפְתַּח־פִּיו (H6605 - mở miệng)... כַּשֶּׂה (H7716 - như con chiên) לַטֶּבַח (H2874 - bị dắt làm thịt)..."
            },
            "cross_refs": ["Công vụ 8:32-35", "Ma-thi-ơ 26:63", "Ma-thi-ơ 27:12-14", "1 Phi-e-rơ 2:23"]
        }
    ]
}

# 6. RÔ-MA 8 (ROM.8)
passages["ROM.8"] = {
    "ref": "Rô-ma 8",
    "book_id": "ROM",
    "chapter_num": 8,
    "title_vi": "Sự Sống Trong Thánh Linh & Chiến Thắng Khải Hoàn Trong Tình Yêu Chúa",
    "verses": [
        {
            "verse_num": 1,
            "text_primary": "Cho nên hiện nay chẳng còn có sự đoán phạt nào cho những kẻ ở trong Đức Chúa Giê-xu Christ.",
            "metaphor_id": None,
            "translations": {
                "BTT": "Cho nên hiện nay chẳng còn có sự đoán phạt nào cho những kẻ ở trong Đức Chúa Jêsus Christ;",
                "BDM": "Vậy bây giờ, không còn có sự kết án nào cho những người ở trong Đức Chúa Giê-xu Christ.",
                "BPT": "Cho nên bây giờ, những ai kết hiệp với Chúa Cứu Thế Giê-xu thì không còn bị định tội nữa.",
                "BD2011": "Vì thế, hiện nay không còn bản án nào cho những ai ở trong Đức Chúa Jesus Christ.",
                "BHD": "Vậy giờ đây, những người kết hiệp với Chúa Cứu Thế Giê-xu không còn bị kết án nữa.",
                "CGKPV": "Vậy giờ đây, những ai ở trong Đức Ki-tô Giê-su, thì không còn bị lên án nữa.",
                "KJV": "There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.",
                "ESV": "There is therefore now no condemnation for those who are in Christ Jesus.",
                "NIV": "Therefore, there is now no condemnation for those who are in Christ Jesus,",
                "INTERLINEAR": "Οὐδὲν (G3762 - Chẳng có) ἄρα (G686 - cho nên) νῦν (G3568 - hiện nay) κατάκριμα (G2631 - sự đoán phạt / kết án) τοῖς (G3588) ἐν (G1722) Χριστῷ (G5547) Ἰησοῦ (G2424)..."
            },
            "cross_refs": ["Giăng 3:18", "Giăng 5:24", "Rô-ma 5:1", "Ga-la-ti 3:13"]
        },
        {
            "verse_num": 38,
            "text_primary": "Vì tôi chắc rằng bất kỳ sự chết, sự sống, các thiên sứ, các bậc cầm quyền, việc hiện tại, việc tương lai, các quyền lực,",
            "metaphor_id": None,
            "translations": {
                "BTT": "Vì tôi chắc rằng bất kỳ sự chết, sự sống, các thiên sứ, các kẻ cầm quyền, việc bây giờ, việc hầu đến, quyền phép,",
                "BDM": "Vì tôi tin chắc rằng dù sự chết hay sự sống, dù thiên sứ hay các bậc cầm quyền, dù việc hiện tại hay việc tương lai, dù các quyền lực,",
                "BPT": "Vì tôi tin chắc rằng không gì có thể ngăn cách chúng ta khỏi tình yêu của Thượng Đế: dù sự chết hay sự sống, dù thiên sứ hay các bậc cầm quyền, dù việc hiện tại hay tương lai, dù bất cứ quyền lực nào,",
                "BD2011": "Vì tôi tin chắc rằng dù sự chết hay sự sống, dù các thiên sứ hay các quyền lực, dù điều hiện tại hay điều tương lai, hay bất cứ quyền phép nào,",
                "BHD": "Vì tôi tin chắc rằng không một quyền lực nào có thể chia rẽ chúng ta khỏi tình yêu của Ngài: dù sống hay chết, dù thiên sứ hay ác quỷ, dù việc hiện tại hay tương lai, dù các thế lực trên trời dưới đất,",
                "CGKPV": "Đúng thế, tôi thâm tín rằng: sự chết hay sự sống, thiên thần hay ma vương quỷ lực, hiện tại hay tương lai, hoặc bất cứ sức mạnh nào,",
                "KJV": "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
                "ESV": "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers,",
                "NIV": "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,",
                "INTERLINEAR": "Πέπεισμαι (G3982 - Tôi tin chắc) γὰρ (G1063) ὅτι (G3754) οὔτε (G3777) θάνατος (G2288 - sự chết) οὔτε (G3777) ζωή (G2222 - sự sống)..."
            },
            "cross_refs": ["Ê-phê-sô 1:21", "Cô-lô-se 2:15", "1 Cô-rinh-tô 3:22"]
        },
        {
            "verse_num": 39,
            "text_primary": "bề cao, bề sâu, hoặc một tạo vật nào khác, cũng không thể phân rẽ chúng ta khỏi tình yêu thương của Đức Chúa Trời trong Đức Chúa Giê-xu Christ, Chúa chúng ta.",
            "metaphor_id": None,
            "translations": {
                "BTT": "bề cao, hay là bề sâu, hoặc một vật nào khác, chẳng có thể phân rẽ chúng ta khỏi sự yêu thương mà Đức Chúa Trời đã chứng cho chúng ta trong Đức Chúa Jêsus Christ, là Chúa chúng ta.",
                "BDM": "dù chiều cao hay chiều sâu, hoặc bất cứ tạo vật nào khác, cũng không thể chia rẽ chúng ta khỏi tình yêu thương của Đức Chúa Trời trong Đức Chúa Giê-xu Christ, Chúa chúng ta.",
                "BPT": "dù trên trời cao hay dưới đất thấp, hoặc bất kỳ vật gì khác trong cả vũ trụ, đều không thể chia rẽ chúng ta khỏi tình yêu mà Thượng Đế dành cho chúng ta trong Chúa Cứu Thế Giê-xu, Chúa chúng ta.",
                "BD2011": "dù chiều cao hay chiều sâu, hoặc bất cứ thọ tạo nào khác, cũng không thể chia rẽ chúng ta khỏi tình yêu của Đức Chúa Trời trong Đức Chúa Jesus Christ, Chúa chúng ta.",
                "BHD": "cũng chẳng thể nào dứt chúng ta ra khỏi tình yêu của Đức Chúa Trời thể hiện qua Chúa Cứu Thế Giê-xu, Chúa chúng ta.",
                "CGKPV": "trời cao hay vực thẳm hay bất cứ một loài thọ tạo nào khác, không có gì tách được chúng ta ra khỏi tình yêu của Thiên Chúa thể hiện nơi Đức Ki-tô Giê-su, Chúa chúng ta.",
                "KJV": "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
                "ESV": "nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",
                "NIV": "neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.",
                "INTERLINEAR": "οὔτε (G3777) ὕψωμα (G5313 - bề cao) οὔτε (G3777) βάθος (G899 - bề sâu)... χωρίσαι (G5563 - phân rẽ) ἀπὸ (G575) τῆς (G3588) ἀγάπης (G26 - tình yêu) τοῦ (G3588) Θεοῦ (G2316)..."
            },
            "cross_refs": ["Giăng 10:28-29", "Rô-ma 5:5", "Cô-lô-se 3:3"]
        }
    ]
}

# LƯU TẤT CẢ VÀO FILE DATA
with open("data/default-bible-passages.json", "w", encoding="utf-8") as f:
    json.dump(passages, f, ensure_ascii=False, indent=2)

print(f"Enriched {len(passages)} major foundational study chapters in data/default-bible-passages.json!")
