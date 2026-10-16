# -*- coding: utf-8 -*-
"""
Script tạo lập cơ sở dữ liệu thần học toàn diện cho Logos MultiVerse
Bao gồm: 66 sách Kinh Thánh, từ điển ẩn dụ, hướng dẫn 8 thể loại,
dữ liệu đối chiếu 10 bản dịch và thư viện visual media.
"""

import json
import os

os.makedirs("data", exist_ok=True)

# 1. 66 BOOKS METADATA
books_raw = [
    # Cựu Ước - Luật Pháp (Torah)
    ("GEN", "Sáng thế ký", "Genesis", "OT", "torah", 50, "Môi-se", "Khoảng 1446-1406 TCN", "Khởi đầu của vũ trụ, loài người, sự sa ngã, giao ước Áp-ra-ham và tuyển dân Y-sơ-ra-ên.", "Cận Đông cổ đại, Lưỡng Hà, xứ Ca-na-an và Ai Cập."),
    ("EXO", "Xuất Ê-díp-tô ký", "Exodus", "OT", "torah", 40, "Môi-se", "Khoảng 1446-1406 TCN", "Sự giải phóng khỏi ách nô lệ Ai Cập, Lễ Vượt Qua, luật pháp tại Si-na-i và Đền Tạm.", "Sa mạc Si-na-i và Ai Cập."),
    ("LEV", "Lê-vi ký", "Leviticus", "OT", "torah", 27, "Môi-se", "Khoảng 1445 TCN", "Sự thánh khiết của Đức Chúa Trời, hệ thống của lễ chuộc tội và chức tế lễ.", "Trại quân Y-sơ-ra-ên dưới chân núi Si-na-i."),
    ("NUM", "Dân số ký", "Numbers", "OT", "torah", 36, "Môi-se", "Khoảng 1406 TCN", "Cuộc hành trình 40 năm trong hoang mạc, sự bất trung của tuyển dân và lòng thành tín của Chúa.", "Đồng vắng Pha-ran đến đồng bằng Mô-áp."),
    ("DEU", "Phục truyền luật lệ ký", "Deuteronomy", "OT", "torah", 34, "Môi-se", "Khoảng 1406 TCN", "Lời dặn dò cuối cùng của Môi-se, tái lập giao ước trước khi vào Đất Hứa.", "Đồng bằng Mô-áp, bên bờ sông Giô-đanh."),

    # Cựu Ước - Lịch Sử (History)
    ("JOS", "Giô-suê", "Joshua", "OT", "history", 24, "Giô-suê", "Khoảng 1400-1370 TCN", "Chinh phục xứ Ca-na-an và phân chia sản nghiệp cho 12 chi phái.", "Xứ Ca-na-an."),
    ("JDG", "Các Quan xét", "Judges", "OT", "history", 21, "Sa-mu-ên", "Khoảng 1050-1000 TCN", "Vòng luẩn quẩn: Sa ngã - Bị hà hiếp - Kêu cầu - Chúa dấy Quan xét giải cứu.", "Xứ Y-sơ-ra-ên thời kỳ liên minh chi phái."),
    ("RUT", "Ru-tơ", "Ruth", "OT", "history", 4, "Sa-mu-ên", "Khoảng 1000 TCN", "Lòng trung kiên của người nữ Mô-áp, hình bóng Đấng Chuộc Sản Nghiệp (Bô-ô) hướng đến Đấng Christ.", "Bết-lê-hem xứ Giu-đa."),
    ("1SA", "1 Sa-mu-ên", "1 Samuel", "OT", "history", 31, "Sa-mu-ên / Ga-đơ / Na-than", "Khoảng 930 TCN", "Chuyển giao từ thời Quan xét sang Vương quyền: Hê-li, Sa-mu-ên, Sau-lơ và Đa-vít.", "Vương quốc Y-sơ-ra-ên thống nhất."),
    ("2SA", "2 Sa-mu-ên", "2 Samuel", "OT", "history", 24, "Ga-đơ / Na-than", "Khoảng 930 TCN", "Triều đại vua Đa-vít, Giao ước Đa-vít về vương vị đời đời của Đấng Mê-si-a.", "Giê-ru-sa-lem."),
    ("1KI", "1 Các Vua", "1 Kings", "OT", "history", 22, "Giê-rê-mi", "Khoảng 560-538 TCN", "Thời hoàng kim của Sa-lô-môn, xây Đền Thờ, và vương quốc bị chia đôi (Bắc/Nam).", "Y-sơ-ra-ên và Giu-đa."),
    ("2KI", "2 Các Vua", "2 Kings", "OT", "history", 25, "Giê-rê-mi", "Khoảng 560-538 TCN", "Sự suy vong của hai vương quốc, chức vụ tiên tri Ê-li và Ê-li-sê, kết cục lưu đày.", "Samari bị A-si-ri chiếm, Giê-ru-sa-lem bị Ba-by-lôn tàn phá."),
    ("1CH", "1 Sử ký", "1 Chronicles", "OT", "history", 29, "Ê-xơ-ra", "Khoảng 450-430 TCN", "Gia phả thánh đồ và sự chuẩn bị xây cất Đền Thờ dưới thời vua Đa-vít.", "Thời kỳ hậu lưu đày."),
    ("2CH", "2 Sử ký", "2 Chronicles", "OT", "history", 36, "Ê-xơ-ra", "Khoảng 450-430 TCN", "Lịch sử triều đại Giu-đa tập trung vào sự thờ phượng tại Đền Thờ và các cuộc phục hưng.", "Vương quốc Giu-đa."),
    ("EZR", "Ê-xơ-ra", "Ezra", "OT", "history", 10, "Ê-xơ-ra", "Khoảng 450 TCN", "Tuyển dân hồi hương, tái thiết Đền Thờ thứ hai và phục hưng luật pháp.", "Giê-ru-sa-lem thời Đế chế Ba Tư."),
    ("NEH", "Nê-hê-mi", "Nehemiah", "OT", "history", 13, "Nê-hê-mi", "Khoảng 430 TCN", "Tái thiết tường thành Giê-ru-sa-lem trong 52 ngày và cải cách xã hội tâm linh.", "Giê-ru-sa-lem."),
    ("EST", "Ê-xơ-tê", "Esther", "OT", "history", 10, "Mạc-đô-chê", "Khoảng 460 TCN", "Bàn tay quan phòng vô hình của Chúa bảo vệ dân tộc Do Thái khỏi họa diệt chủng.", "Cung điện Su-sơ, Đế quốc Ba Tư."),

    # Cựu Ước - Thơ Ca & Khôn Ngoan (Poetry)
    ("JOB", "Gióp", "Job", "OT", "poetry", 42, "Không rõ (có thể Môi-se / Ê-li-hu)", "Thời các tổ phụ (~2000 TCN)", "Nỗi đau khổ của người công bình, sự tể trị tối cao và sự khôn ngoan của Đức Chúa Trời.", "Xứ U-xơ."),
    ("PSA", "Thi thiên", "Psalms", "OT", "poetry", 150, "Đa-vít, A-sáp, con cháu Cô-rê, Môi-se, Sa-lô-môn", "1410-430 TCN", "Thánh ca ngợi khen, than khóc, cầu nguyện và tiên tri về Đấng Mê-si-a.", "Đền Thờ và đời sống tâm linh Y-sơ-ra-ên."),
    ("PRO", "Châm ngôn", "Proverbs", "OT", "poetry", 31, "Sa-lô-môn, A-gu-rơ, Lê-mu-ên", "Khoảng 970-700 TCN", "Kính sợ Đức Giê-hô-va là khởi đầu sự khôn ngoan; nguyên tắc sống đạo thực tiễn.", "Triều đình Giê-ru-sa-lem."),
    ("ECC", "Truyền đạo", "Ecclesiastes", "OT", "poetry", 12, "Sa-lô-môn", "Khoảng 935 TCN", "Hư không của mọi sự dưới mặt trời khi thiếu vắng Đức Chúa Trời.", "Giê-ru-sa-lem."),
    ("SNG", "Nhã ca", "Song of Songs", "OT", "poetry", 8, "Sa-lô-môn", "Khoảng 965 TCN", "Tình yêu hôn nhân thánh khiết, hình bóng tình yêu giữa Đấng Christ và Hội Thánh.", "Giê-ru-sa-lem."),

    # Cựu Ước - Tiên Tri (Prophecy)
    ("ISA", "Ê-sai", "Isaiah", "OT", "prophecy", 66, "Ê-sai", "Khoảng 740-680 TCN", "Phúc âm của Cựu Ước: Sự thánh khiết của Chúa, Đấng Chịu Khổ (Ê-sai 53) và Trời Mới Đất Mới.", "Vương quốc Giu-đa trước hiểm họa A-si-ri."),
    ("JER", "Giê-rê-mi", "Jeremiah", "OT", "prophecy", 52, "Giê-rê-mi", "Khoảng 627-580 TCN", "Tiên tri than khóc cảnh báo thành thánh sụp đổ và lời hứa về Giao Ước Mới trong lòng.", "Giu-đa và Ba-by-lôn."),
    ("LAM", "Ca thương", "Lamentations", "OT", "poetry", 5, "Giê-rê-mi", "Khoảng 586 TCN", "Nỗi đau tột cùng khi thành Giê-ru-sa-lem bị tàn phá và lời xưng nhận lòng nhân từ vô biên của Chúa.", "Đống đổ nát Giê-ru-sa-lem."),
    ("EZK", "Ê-xê-chi-ên", "Ezekiel", "OT", "prophecy", 48, "Ê-xê-chi-ên", "Khoảng 593-571 TCN", "Sự vinh hiển của Chúa rời khỏi và trở lại Đền Thờ; thung lũng xương khô sống lại.", "Bên dòng sông Kê-ba, Ba-by-lôn."),
    ("DAN", "Đa-ni-ên", "Daniel", "OT", "prophecy", 12, "Đa-ni-ên", "Khoảng 605-530 TCN", "Sự tể trị của Chúa trên các đế chế nhân loại, thị kiến về Con Người và cánh chung.", "Cung đình Ba-by-lôn và Ba Tư."),
    ("HOS", "Ô-sê", "Hosea", "OT", "prophecy", 14, "Ô-sê", "Khoảng 750-715 TCN", "Tình yêu bền vững kiên trì của Chúa chuộc lại người vợ bất trung.", "Vương quốc phía Bắc Y-sơ-ra-ên."),
    ("JOL", "Giô-ên", "Joel", "OT", "prophecy", 3, "Giô-ên", "Khoảng 835 TCN", "Họa châu chấu, Ngày của Đức Giê-hô-va và lời hứa đổ Thánh Linh trên mọi xác thịt.", "Giu-đa."),
    ("AMO", "A-mốt", "Amos", "OT", "prophecy", 9, "A-mốt", "Khoảng 760 TCN", "Tiếng gầm của sư tử: Đòi hỏi sự công chính xã hội và phán xét sự thờ hình tượng.", "Bê-tên xứ Bắc Y-sơ-ra-ên."),
    ("OBA", "Áp-đia", "Obadiah", "OT", "prophecy", 1, "Áp-đia", "Khoảng 840 TCN", "Sự kiêu ngạo và sụp đổ của Ê-đôm vì ngược đãi người anh em Gia-cốp.", "Ê-đôm."),
    ("JON", "Giô-na", "Jonah", "OT", "prophecy", 4, "Giô-na", "Khoảng 760 TCN", "Lòng thương xót của Chúa vượt ra khỏi biên giới dân tộc đến thành Ni-ni-ve; dấu lạ Giô-na.", "Ni-ni-ve và biển Địa Trung Hải."),
    ("MIC", "Mi-chê", "Micah", "OT", "prophecy", 7, "Mi-chê", "Khoảng 735-700 TCN", "Phán xét kẻ áp bức và lời tiên tri về Đấng Cai Trị sinh ra tại Bết-lê-hem.", "Giu-đa."),
    ("NAH", "Na-hum", "Nahum", "OT", "prophecy", 3, "Na-hum", "Khoảng 663-612 TCN", "Sự phán xét công minh trên thủ đô bạo tàn Ni-ni-ve của Đế chế A-si-ri.", "A-si-ri."),
    ("HAB", "Ha-ba-cúc", "Habakkuk", "OT", "prophecy", 3, "Ha-ba-cúc", "Khoảng 605 TCN", "Đối thoại giữa tiên tri và Chúa: Người công bình sẽ sống bởi đức tin.", "Giu-đa."),
    ("ZEP", "Xô-phô-ni", "Zephaniah", "OT", "prophecy", 3, "Xô-phô-ni", "Khoảng 630 TCN", "Ngày phán xét vĩ đại và niềm vui hoan ca của dân sót thánh khiết.", "Giu-đa."),
    ("HAG", "A-ghê", "Haggai", "OT", "prophecy", 2, "A-ghê", "Khoảng 520 TCN", "Thúc giục dân sự ưu tiên xây lại nhà của Chúa thay vì chỉ lo sửa sang nhà mình.", "Giê-ru-sa-lem hậu lưu đày."),
    ("ZEC", "Xa-cha-ri", "Zechariah", "OT", "prophecy", 14, "Xa-cha-ri", "Khoảng 520-480 TCN", "Thị kiến Đấng Mê-si-a cưỡi lừa con, bị đâm thủng và mở dòng suối tẩy uế tội lỗi.", "Giê-ru-sa-lem."),
    ("MAL", "Ma-la-chi", "Malachi", "OT", "prophecy", 4, "Ma-la-chi", "Khoảng 430 TCN", "Lời cảnh tỉnh sự nguội lạnh tâm linh và lời hứa Mặt Trời Công Chính sẽ mọc lên.", "Giê-ru-sa-lem trước 400 năm im lặng."),

    # Tân Ước - Phúc Âm (Gospels)
    ("MAT", "Ma-thi-ơ", "Matthew", "NT", "gospels", 28, "Ma-thi-ơ", "Khoảng 60-65 SC", "Đức Chúa Giê-xu là Vua Đấng Mê-si-a ứng nghiệm toàn bộ lời tiên tri Cựu Ước.", "Xứ Do Thái thời Đế chế La Mã."),
    ("MRK", "Mác", "Mark", "NT", "gospels", 16, "Giăng Mác", "Khoảng 55-65 SC", "Chúa Giê-xu là Đấng Tôi Tớ Chịu Khổ hành động quyền năng cứu chuộc muôn dân.", "Rô-ma."),
    ("LUK", "Lu-ca", "Luke", "NT", "gospels", 24, "Lu-ca", "Khoảng 60-62 SC", "Chúa Giê-xu là Con Người trọn vẹn, Đấng Cứu Thế đầy lòng thương xót kẻ hư mất.", "Hy Lạp và La Mã."),
    ("JHN", "Giăng", "John", "NT", "gospels", 21, "Sứ đồ Giăng", "Khoảng 85-95 SC", "Ngôi Lời trở nên xác thịt: Đức Chúa Giê-xu là Con Độc Sanh của Đức Chúa Trời, ban sự sống đời đời.", "Ê-phê-sô."),

    # Tân Ước - Lịch Sử Hội Thánh (Acts)
    ("ACT", "Công vụ các Sứ đồ", "Acts", "NT", "acts", 28, "Lu-ca", "Khoảng 62-64 SC", "Lịch sử Hội Thánh ban đầu: Đức Thánh Linh giáng lâm và Phúc Âm lan truyền từ Giê-ru-sa-lem đến Rô-ma.", "Khắp Địa Trung Hải và La Mã."),

    # Tân Ước - Thư Tín (Epistles)
    ("ROM", "Rô-ma", "Romans", "NT", "epistles", 16, "Phao-lô", "Khoảng 57 SC", "Đại cương thần học: Sự xưng công bình bởi đức tin, quyền năng Phúc Âm và sự thánh hóa trong Thánh Linh.", "Cô-rinh-tô gửi Hội Thánh Rô-ma."),
    ("1CO", "1 Cô-rinh-tô", "1 Corinthians", "NT", "epistles", 16, "Phao-lô", "Khoảng 55 SC", "Giải quyết chia rẽ, luân lý hôn nhân, các ân tứ Thánh Linh và sự sống lại vinh hiển.", "Ê-phê-sô gửi Cô-rinh-tô."),
    ("2CO", "2 Cô-rinh-tô", "2 Corinthians", "NT", "epistles", 13, "Phao-lô", "Khoảng 56 SC", "Chức vụ giao ước mới, quyền năng trong sự yếu đuối và chức vụ hòa giải.", "Ma-xê-đoan gửi Cô-rinh-tô."),
    ("GAL", "Ga-la-ti", "Galatians", "NT", "epistles", 6, "Phao-lô", "Khoảng 48-49 SC", "Bản Tuyên ngôn Tự do Cơ Đốc: Xưng công bình chỉ nhờ đức tin, không bởi luật pháp nghi lễ.", "Gửi các Hội Thánh vùng Ga-la-ti."),
    ("EPH", "Ê-phê-sô", "Ephesians", "NT", "epistles", 6, "Phao-lô", "Khoảng 60-62 SC", "Mầu nhiệm Hội Thánh là Thân Thể Đấng Christ và vũ khí khí giới thiêng liêng.", "Phao-lô viết trong tù tại Rô-ma."),
    ("PHP", "Phi-líp", "Philippians", "NT", "epistles", 4, "Phao-lô", "Khoảng 61 SC", "Thư tín của niềm vui: Tâm tình Đấng Christ khiêm nhường và đắc thắng.", "Nhà tù Rô-ma gửi Hội Thánh Phi-líp."),
    ("COL", "Cô-lô-se", "Colossians", "NT", "epistles", 4, "Phao-lô", "Khoảng 60-62 SC", "Sự tối thượng và toàn hảo của Đấng Christ trên mọi uy quyền tạo vật.", "Nhà tù Rô-ma gửi Cô-lô-se."),
    ("1TH", "1 Tê-sa-lô-ni-ca", "1 Thessalonians", "NT", "epistles", 5, "Phao-lô", "Khoảng 51 SC", "Sự tái lâm của Đấng Christ và nếp sống thánh khiết trông cậy ngày Chúa đến.", "Cô-rinh-tô gửi Tê-sa-lô-ni-ca."),
    ("2TH", "2 Tê-sa-lô-ni-ca", "2 Thessalonians", "NT", "epistles", 3, "Phao-lô", "Khoảng 51-52 SC", "Sự xuất hiện của kẻ gian ác và sự can đảm vững vàng trước ngày Chúa trở lại.", "Cô-rinh-tô gửi Tê-sa-lô-ni-ca."),
    ("1TI", "1 Ti-mô-thê", "1 Timothy", "NT", "epistles", 6, "Phao-lô", "Khoảng 63-65 SC", "Trật tự tổ chức Hội Thánh, tiêu chuẩn người lãnh đạo và bảo vệ giáo lý thuần chính.", "Ma-xê-đoan gửi Ti-mô-thê tại Ê-phê-sô."),
    ("2TI", "2 Ti-mô-thê", "2 Timothy", "NT", "epistles", 4, "Phao-lô", "Khoảng 66-67 SC", "Lời di huấn tâm huyết trước lúc tử đạo: Giữ vững đức tin và truyền khẩu Lời Hằng Sống.", "Hầm ngục Mamertine, Rô-ma."),
    ("TIT", "Tít", "Titus", "NT", "epistles", 3, "Phao-lô", "Khoảng 63-65 SC", "Thiết lập lãnh đạo và nếp sống lành mạnh làm vinh hiển đạo Chúa giữa xã hội bại hoại.", "Gửi Tít tại đảo Cơ-rết."),
    ("PHM", "Phi-lê-môn", "Philemon", "NT", "epistles", 1, "Phao-lô", "Khoảng 60-62 SC", "Quyền năng tha thứ và tình anh em trong Đấng Christ giữa chủ và nô lệ Ô-nê-sim.", "Nhà tù Rô-ma."),
    ("HEB", "Hê-bơ-rơ", "Hebrews", "NT", "epistles", 13, "Không rõ (Phao-lô / Ba-na-ba / A-bô-lô)", "Khoảng 65-68 SC", "Đấng Christ cao trọng hơn thiên sứ, Môi-se, và chức tế lễ A-rôn; Giao Ước Mới tối thượng.", "Gửi tín hữu Hê-bơ-rơ chịu bách hại."),
    ("JAS", "Gia-cơ", "James", "NT", "epistles", 5, "Gia-cơ (em Chúa Giê-xu)", "Khoảng 45-48 SC", "Đức tin sống động qua việc làm thực tế, kiềm giữ lưỡi và yêu thương kẻ khốn khó.", "Giê-ru-sa-lem gửi 12 chi phái tản lạc."),
    ("1PE", "1 Phi-e-rơ", "1 Peter", "NT", "epistles", 5, "Sứ đồ Phi-e-rơ", "Khoảng 63-64 SC", "Hy vọng sống giữa cơn thử thách bắt bớ và nếp sống người tha hương thánh khiết.", "Rô-ma gửi tín hữu vùng Tiểu Á."),
    ("2PE", "2 Phi-e-rơ", "2 Peter", "NT", "epistles", 3, "Sứ đồ Phi-e-rơ", "Khoảng 66-67 SC", "Cảnh giác giáo sư giả, tăng trưởng trong ân điển và ngày Chúa quang lâm biến hóa trời đất.", "Rô-ma trước lúc Phi-e-rơ tử vì đạo."),
    ("1JN", "1 Giăng", "1 John", "NT", "epistles", 5, "Sứ đồ Giăng", "Khoảng 85-95 SC", "Thông công với Đức Chúa Trời là Sự Sáng và Tình Yêu; sự bảo đảm ơn cứu rỗi.", "Ê-phê-sô."),
    ("2JN", "2 Giăng", "2 John", "NT", "epistles", 1, "Sứ đồ Giăng", "Khoảng 85-95 SC", "Bước đi trong lẽ thật và tình yêu thương, từ chối đón tiếp kẻ truyền tà giáo.", "Ê-phê-sô."),
    ("3JN", "3 Giăng", "3 John", "NT", "epistles", 1, "Sứ đồ Giăng", "Khoảng 85-95 SC", "Lòng hiếu khách đối với những người đi truyền giáo và cảnh báo thói hống hách.", "Ê-phê-sô gửi Gai-út."),
    ("JUD", "Giu-đe", "Jude", "NT", "epistles", 1, "Giu-đe (em Chúa Giê-xu)", "Khoảng 65-70 SC", "Chiến đấu vì đạo thánh đã truyền một lần đủ cả cho các thánh đồ.", "Xứ Do Thái."),

    # Tân Ước - Khải Huyền (Apocalyptic)
    ("REV", "Khải huyền", "Revelation", "NT", "apocalyptic", 22, "Sứ đồ Giăng", "Khoảng 95 SC", "Sự đắc thắng tối hậu của Chiên Con, phán xét chung thẩm, Trời Mới Đất Mới và Giê-ru-sa-lem Mới.", "Đảo Bát-mô nơi Giăng bị lưu đày.")
]

books_json = []
for b in books_raw:
    books_json.append({
        "id": b[0],
        "name_vi": b[1],
        "name_en": b[2],
        "testament": b[3],
        "genre": b[4],
        "chapters_count": b[5],
        "author": b[6],
        "date_written": b[7],
        "theme": b[8],
        "historical_context": b[9]
    })

with open("data/books-metadata.json", "w", encoding="utf-8") as f:
    json.dump(books_json, f, ensure_ascii=False, indent=2)

print(f"Generated {len(books_json)} books in data/books-metadata.json")

# 2. METAPHORS & TYPOLOGY DATABASE
metaphors_list = [
    {
        "id": "lamb_of_god",
        "title_vi": "Chiên Con Của Đức Chúa Trời (The Lamb of God)",
        "icon": "fa-dove",
        "symbol_category": "Động vật & Của Lễ",
        "theological_meaning": "Biểu tượng tối thượng cho Đấng Cứu Thế vô tội, hiến dâng thân mình làm của lễ chuộc tội một lần đủ cả để cứu rỗi nhân loại khỏi án phạt của sự chết.",
        "ot_shadow": "Của lễ chiên đực đầu lòng của A-bên (Sáng 4:4); Chiên đực mắc trong bụi gai thay thế Y-sác trên núi Mô-ri-a (Sáng 22:13); Huyết chiên bôi trên mày cửa Lễ Vượt Qua để thiên sứ hủy diệt vượt qua (Xuất 12:3-13); Chiên con hiến tế ngày Chuộc Tội (Lê-vi 16); Người Tôi Tớ chịu khổ câm như chiên trước kẻ hớt lông (Ê-sai 53:7).",
        "nt_fulfillment": "Giăng Báp-tít chỉ vào Chúa Giê-xu: 'Kìa, Chiên Con của Đức Chúa Trời, là Đấng cất tội lỗi thế gian đi!' (Giăng 1:29); Đấng Christ là Chiên Lễ Vượt Qua của chúng ta đã chịu hiến tế (1 Cô-rinh-tô 5:7); Được cứu chuộc bằng huyết báu Chiên Con không tì vít (1 Phi-e-rơ 1:19); Khải Huyền mô tả Chiên Con như đã bị giết đứng giữa ngôi vinh hiển (Khải huyền 5:6-12).",
        "key_passages": ["Xuất Ê-díp-tô Ký 12:1-13", "Ê-sai 53:7", "Giăng 1:29", "1 Cô-rinh-tô 5:7", "Khải Huyền 5:6", "Khải Huyền 19:9"],
        "hermeneutical_notes": "Không nên chỉ xem là hình ảnh thơ mộng, mà phải hiểu trong toàn bộ hệ thống giao ước huyết của Cựu Ước: không đổ huyết thì không có sự tha tội (Hê-bơ-rơ 9:22)."
    },
    {
        "id": "true_vine",
        "title_vi": "Cây Nho Thật & Nhánh Nho (The True Vine)",
        "icon": "fa-seedling",
        "symbol_category": "Thực vật & Nông nghiệp",
        "theological_meaning": "Biểu tượng cho mối liên hiệp sống động hữu cơ giữa Đấng Christ và môn đồ. Mọi sự sống, sức mạnh và hoa quả thuộc linh đều bắt nguồn từ việc 'cứ ở trong Ngài'.",
        "ot_shadow": "Y-sơ-ra-ên được ví như cây nho Chúa bứng từ Ai Cập đem trồng (Thi thiên 80:8-16), nhưng đã trở thành vườn nho hoang, sinh trái nho độc của sự bất nghĩa (Ê-sai 5:1-7; Giê-rê-mi 2:21).",
        "nt_fulfillment": "Chúa Giê-xu phán: 'Ta là Cây Nho Thật, Cha Ta là người trồng nho... Ai cứ ở trong Ta và Ta trong người ấy thì sinh ra nhiều quả; vì ngoài Ta các ngươi không làm chi được' (Giăng 15:1-8).",
        "key_passages": ["Thi thiên 80:8-16", "Ê-sai 5:1-7", "Giăng 15:1-11", "Rô-ma 11:16-24"],
        "hermeneutical_notes": "Chữ 'Thật' (Alēthinos trong tiếng Hy Lạp) đối lập với Y-sơ-ra-ên là cây nho cũ đã thất bại. Sự cứu rỗi đòi hỏi sự hiệp nhất bản thể chứ không chỉ là gia nhập tôn giáo bề ngoài."
    },
    {
        "id": "bread_of_life",
        "title_vi": "Bánh Sự Sống & Ma-na (Bread of Life)",
        "icon": "fa-wheat-awn",
        "symbol_category": "Thực phẩm & Dưỡng chất",
        "theological_meaning": "Nguồn dinh dưỡng tâm linh nuôi dưỡng linh hồn cho cõi vĩnh hằng, đáp ứng cơn đói khát sâu thẳm nhất của hữu thể con người.",
        "ot_shadow": "Bánh Ma-na từ trời rơi xuống nuôi hàng triệu dân Y-sơ-ra-ên suốt 40 năm trong sa mạc cằn cỗi (Xuất 16); Bánh trần thiết trong Đền Tạm tượng trưng cho sự hiện diện nuôi sống của Đức Chúa Trời (Lê-vi 24:5-9).",
        "nt_fulfillment": "Chúa Giê-xu hóa bánh cho 5000 người ăn rồi tuyên bố: 'Ta là Bánh của Sự Sống; ai đến cùng Ta chẳng hề đói, và ai tin Ta chẳng hề khát' (Giăng 6:35, 48-51). Bánh trong Tiệc Thánh tượng trưng cho thân thể Ngài bị tan vỡ vì chúng ta (Ma-thi-ơ 26:26).",
        "key_passages": ["Xuất Ê-díp-tô Ký 16:1-35", "Giăng 6:31-58", "1 Cô-rinh-tô 11:23-26"],
        "hermeneutical_notes": "Ăn bánh thiêng liêng ở đây mang nghĩa tiếp nhận Đấng Christ bằng đức tin, hoàn toàn khác với việc hiểu theo nghĩa ăn vật chất xác thịt."
    },
    {
        "id": "salt_and_light",
        "title_vi": "Muối Của Đất & Ánh Sáng Của Thế Gian (Salt & Light)",
        "icon": "fa-sun",
        "symbol_category": "Yếu tố Tự nhiên & Đời sống",
        "theological_meaning": "Bản sắc và sứ mạng của người cơ đốc: 'Muối' có chức năng ướp mặn, bảo quản ngăn chặn sự bại hoại đạo đức; 'Ánh sáng' có quyền năng xua tan bóng tối u mê của tội lỗi và bày tỏ chân lý.",
        "ot_shadow": "Giao ước muối đời đời không hề biến đổi (Dân số 18:19; 2 Sử ký 13:5); Sự sáng đầu tiên trong buổi sáng thế (Sáng 1:3); Trụ lửa dẫn đường ban đêm (Xuất 13:21); Lời Chúa là ngọn đèn cho chân và ánh sáng cho đường lối (Thi thiên 119:105).",
        "nt_fulfillment": "Bài giảng trên núi: 'Các ngươi là muối của đất... Các ngươi là ánh sáng của thế gian... Hãy soi sáng trước mặt người ta như vậy, để họ thấy việc lành các ngươi mà ngợi khen Cha trên trời' (Ma-thi-ơ 5:13-16).",
        "key_passages": ["Lê-vi 2:13", "Thi thiên 119:105", "Ê-sai 60:1-3", "Ma-thi-ơ 5:13-16", "Phi-líp 2:15"],
        "hermeneutical_notes": "Muối thời xưa là đá muối vùng Biển Chết; nếu bị lẫn tạp chất sẽ mất vị mặn và chỉ đáng quẳng ra ngoài cho người ta đạp dưới chân."
    },
    {
        "id": "leaven",
        "title_vi": "Men & Lễ Bánh Không Men (Leaven / Yeast)",
        "icon": "fa-biohazard",
        "symbol_category": "Yếu tố Lên men & Biến đổi",
        "theological_meaning": "Hình ảnh ẩn dụ thường chỉ tội lỗi thầm kín, thói đạo đức giả, giáo lý sai lệch có tính lây lan hủy hoại; đôi khi cũng mô tả quyền năng thẩm thấu của Nước Trời.",
        "ot_shadow": "Mệnh lệnh dọn sạch mọi men trong nhà trước Lễ Vượt Qua và ăn Bánh Không Men trong 7 ngày (Xuất 12:15, 13:7); Cấm dùng men trong các của lễ thiêu dâng lên Chúa (Lê-vi 2:11).",
        "nt_fulfillment": "Chúa Giê-xu cảnh báo: 'Hãy coi chừng men của người Pha-ri-si (đạo đức giả) và Sa-đu-sê (hoài nghi thế tục)' (Ma-thi-ơ 16:6; Lu-ca 12:1); Phao-lô nhắc nhở: 'Một chút men làm dậy cả đống bột... Hãy tẩy trừ men cũ để trở nên bột mới không men' (1 Cô-rinh-tô 5:6-8).",
        "key_passages": ["Xuất Ê-díp-tô Ký 12:15-20", "Ma-thi-ơ 16:6-12", "1 Cô-rinh-tô 5:6-8", "Ga-la-ti 5:9"],
        "hermeneutical_notes": "Cần xem xét ngữ cảnh: Trong dụ ngôn Nước Trời (Ma-thi-ơ 13:33), men mô tả sức lan tỏa mầu nhiệm; nhưng trong thư tín Phao-lô, men luôn tượng trưng cho sự thỏa hiệp với tội ác."
    },
    {
        "id": "fire",
        "title_vi": "Lửa Thánh & Lửa Luyện Lọc (Holy Fire)",
        "icon": "fa-fire",
        "symbol_category": "Hiện tượng Thiên nhiên",
        "theological_meaning": "Sự hiện diện thánh khiết kinh sợ của Đức Chúa Trời, sự thanh tẩy thiêu đốt điều ô uế và ngọn lửa phán xét công bình.",
        "ot_shadow": "Bụi gai cháy không tàn gặp Môi-se (Xuất 3:2); Trụ lửa ban đêm che chở dân sự (Xuất 13:21); Lửa từ trời giáng xuống bàn thờ thiêu nuốt của lễ Ê-li trước các tiên tri Ba-anh (1 Các Vua 18:38); Than hồng chạm môi Ê-sai tẩy sạch tội lỗi (Ê-sai 6:6-7).",
        "nt_fulfillment": "Đức Thánh Linh giáng lâm trong ngày Lễ Ngũ Tuần với hình lưỡi như bằng lửa đậu trên mỗi môn đồ (Công vụ 2:3); Đức Chúa Trời chúng ta là đám lửa thiêu đốt (Hê-bơ-rơ 12:29); Đức tin quý hơn vàng thử lửa (1 Phi-e-rơ 1:7).",
        "key_passages": ["Xuất Ê-díp-tô Ký 3:2-5", "1 Các Vua 18:36-39", "Ê-sai 6:6-7", "Công vụ 2:1-4", "Hê-bơ-rơ 12:29"],
        "hermeneutical_notes": "Lửa vừa cứu rỗi vừa phán xét: Người thuộc về Chúa được lửa Thánh Linh thanh luyện trở nên vàng ròng; kẻ chối bỏ bị thiêu hủy."
    },
    {
        "id": "living_water",
        "title_vi": "Nước Sống & Suối Nguồn Linh Hồn (Living Water)",
        "icon": "fa-water",
        "symbol_category": "Nước & Dòng chảy",
        "theological_meaning": "Ân điển cứu chuộc tươi mới và sự ngự trị của Đức Thánh Linh làm thỏa mãn cơn khát linh hồn của nhân loại.",
        "ot_shadow": "Hòn đá bị đập tại Hô-rếp phun trào dòng nước giữa sa mạc khô cháy (Xuất 17:6; Dân số 20:11); Đức Giê-hô-va là Nguồn Nước Sống bị loài người chối bỏ để đục những hồ nứt không chứa nước (Giê-rê-mi 2:13); Dòng sông sự sống tuôn từ Đền Thờ làm ngọt Biển Chết (Ê-xê-chi-ên 47).",
        "nt_fulfillment": "Chúa Giê-xu bên giếng Gia-cốp với người đàn bà Sa-ma-ri: 'Nước Ta cho sẽ thành một mạch nước trong người ấy văng ra cho đến sự sống đời đời' (Giăng 4:14); Lễ Lều Tạm: 'Kẻ nào tin Ta, sông nước sống sẽ chảy từ trong lòng mình, chỉ về Đức Thánh Linh' (Giăng 7:37-39); Sông nước sự sống trong suốt như pha lê chảy từ ngai Đức Chúa Trời và Chiên Con (Khải huyền 22:1).",
        "key_passages": ["Xuất Ê-díp-tô Ký 17:1-6", "Giê-rê-mi 2:13", "Giăng 4:10-14", "Giăng 7:37-39", "Khải Huyền 22:1-2"],
        "hermeneutical_notes": "Phao-lô khẳng định hòn đá theo dân sự trong đồng vắng chính là Đấng Christ (1 Cô-rinh-tô 10:4). Ngài đã chịu đập vỡ trên đồi Gô-gô-tha để dòng nước cứu chuộc tuôn trào."
    },
    {
        "id": "cornerstone",
        "title_vi": "Đá Góc Nhà & Hòn Đá Vấp Chân (The Chief Cornerstone)",
        "icon": "fa-cubes",
        "symbol_category": "Kiến trúc & Nền tảng",
        "theological_meaning": "Nền tảng căn bản và chuẩn mực định hình toàn bộ tòa nhà đức tin của Hội Thánh Đức Chúa Trời.",
        "ot_shadow": "Hòn đá thợ xây nhà loại ra đã trở nên hòn đá góc nhà (Thi thiên 118:22); Hòn đá đặt tại Si-ôn làm nền tảng vững chắc, hòn đá thử nghiệm (Ê-sai 28:16); Hòn đá không bởi tay người đục ra đập tan pho tượng các đế quốc thế gian (Đa-ni-ên 2:34, 44-45).",
        "nt_fulfillment": "Chúa Giê-xu tự nhận Ngài là Hòn Đá Góc Nhà mà các lãnh đạo Do Thái loại bỏ (Ma-thi-ơ 21:42); Phao-lô tuyên bố Hội Thánh được xây trên nền các sứ đồ và tiên tri, chính Chúa Giê-xu là Đá Góc Nhà (Ê-phê-sô 2:20); Với kẻ tin Ngài là quý báu, với kẻ chống cự Ngài là hòn đá vấp chân và vầng đá làm cho vấp ngã (1 Phi-e-rơ 2:4-8).",
        "key_passages": ["Thi thiên 118:22-23", "Ê-sai 28:16", "Ma-thi-ơ 21:42", "Ê-phê-sô 2:19-22", "1 Phi-e-rơ 2:4-8"],
        "hermeneutical_notes": "Đá góc nhà trong kiến trúc cổ quyết định cả góc phương vị và cao độ của toàn bộ công trình; nếu lệch khỏi đá góc, toàn bộ tòa nhà sẽ sụp đổ."
    }
]

with open("data/metaphors-database.json", "w", encoding="utf-8") as f:
    json.dump(metaphors_list, f, ensure_ascii=False, indent=2)

print(f"Generated {len(metaphors_list)} metaphors in data/metaphors-database.json")

# 3. GENRE GUIDES (8 BIBLICAL GENRES)
genres_dict = {
    "torah": {
        "name_vi": "Luật Pháp (Torah / Pentateuch)",
        "color": "#d97706",
        "icon": "fa-scale-balanced",
        "books": ["GEN", "EXO", "LEV", "NUM", "DEU"],
        "core_definition": "Năm sách đầu tiên của Kinh Thánh do Môi-se chép, chứa đựng sự sáng tạo, khởi đầu nhân loại, các giao ước nền tảng và luật pháp thánh khiết tại núi Si-na-i.",
        "hermeneutical_principles": [
            "Phân biệt 3 loại luật: Luật đạo đức (10 điều răn - giá trị vĩnh cửu), Luật nghi lễ (của lễ, đền tạm - hình bóng ứng nghiệm trong Đấng Christ), và Luật dân sự (áp dụng riêng cho chế độ thần quyền Y-sơ-ra-ên cổ đại).",
            "Tìm kiếm tâm tánh thánh khiết của Đức Chúa Trời đằng sau mỗi điều luật.",
            "Xem luật pháp là 'thầy giáo dẫn dắt chúng ta đến cùng Đấng Christ' (Ga-la-ti 3:24) để thấy sự bất toàn của con người và nhu cầu cần được xưng công bình bởi đức tin."
        ],
        "common_pitfalls": "Cố gắng áp dụng nghĩa đen nguyên xi các điều luật nghi lễ hoặc chế tài dân sự cổ đại vào Hội Thánh ngày nay; hoặc rơi vào chủ nghĩa luật pháp (Legalism) tìm kiếm sự cứu rỗi qua việc làm xác thịt."
    },
    "history": {
        "name_vi": "Lịch Sử (Historical Books)",
        "color": "#b45309",
        "icon": "fa-shield-halved",
        "books": ["JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI", "1CH", "2CH", "EZR", "NEH", "EST"],
        "core_definition": "Ghi lại những biến cố có thật trong lịch sử tuyển dân Y-sơ-ra-ên từ khi bước vào Đất Hứa đến cuộc lưu đày và hồi hương tái thiết Giê-ru-sa-lem.",
        "hermeneutical_principles": [
            "Phân biệt rõ: Lời kể miêu tả (Descriptive - thuật lại những gì đã diễn ra trong thực tế) KHÔNG ĐỒNG NGHĨA với Lời răn dạy quy định (Prescriptive - mệnh lệnh Chúa bảo chúng ta phải noi theo).",
            "Lịch sử Kinh Thánh là Thần Học trong Lịch Sử (Heilsgeschichte - Lịch sử cứu chuộc): Trọng tâm là sự tể trị thành tín của Chúa chứ không phải sự hoàn hảo của các nhân vật.",
            "Nhận diện quy luật gieo và gặt trong đời sống đạo đức tâm linh."
        ],
        "common_pitfalls": "Lấy mọi hành động của nhân vật (như Đa-vít phạm tội tà dâm giết người, Sam-sôn thù hận, Sa-lô-môn lấy nhiều vợ) làm khuôn mẫu hành xử cho tín hữu ngày nay."
    },
    "poetry": {
        "name_vi": "Thơ Ca & Khôn Ngoan (Poetry & Wisdom Literature)",
        "color": "#0891b2",
        "icon": "fa-music",
        "books": ["JOB", "PSA", "PRO", "ECC", "SNG"],
        "core_definition": "Văn chương nghệ thuật diễn tả cảm xúc tâm linh chân thực trước nghịch cảnh, thánh ca ngợi khen và nguyên tắc khôn ngoan xử thế hằng ngày.",
        "hermeneutical_principles": [
            "Nắm vững nghệ thuật Song hành Hê-bơ-rơ (Hebrew Parallelism): Song hành đồng nghĩa (câu sau lặp ý câu trước), Song hành đối lập (câu sau tương phản câu trước), và Song hành tổng hợp (câu sau phát triển ý câu trước).",
            "Giải thích các hình ảnh ẩn dụ cảm xúc thay vì gán ghép nghĩa đen khoa học cứng nhắc.",
            "Châm ngôn là các nguyên tắc định hướng khôn ngoan chung cho cuộc sống, không phải là lời hứa pháp lý đảm bảo 100% trong mọi trường hợp cá biệt bất chấp nghịch cảnh."
        ],
        "common_pitfalls": "Diễn giải các câu thơ ca than khóc (Imprecatory Psalms) hoặc lời thở dài bế tắc của Gióp như là các tín điều thần học chính quy có tính giáo điều tuyệt đối."
    },
    "prophecy": {
        "name_vi": "Tiên Tri (Prophets - Major & Minor)",
        "color": "#7c3aed",
        "icon": "fa-eye",
        "books": ["ISA", "JER", "LAM", "EZK", "DAN", "HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAH", "HAB", "ZEP", "HAG", "ZEC", "MAL"],
        "core_definition": "Tiếng nói của người phát ngôn thay cho Chúa, kêu gọi tuyển dân ăn năn quay về với giao ước, cảnh báo phán xét và dự báo về Đấng Mê-si-a cùng Nước Trời.",
        "hermeneutical_principles": [
            "Hiểu bối cảnh lịch sử nguyên thủy của người nghe đương thời (Forth-telling) trước khi tìm kiếm sự ứng nghiệm tương lai xa (Fore-telling).",
            "Hiệu ứng Tầm nhìn Núi non (Mountain Peaks of Prophecy): Tiên tri nhìn thấy 2 đỉnh núi (sự giáng sinh thứ nhất và sự tái lâm của Chúa) nằm cạnh nhau nhưng không thấy thung lũng thời đại Hội Thánh nằm ở giữa.",
            "Theo dõi sự ứng nghiệm trọn vẹn trong Đấng Christ và Hội Thánh."
        ],
        "common_pitfalls": "Đọc sách tiên tri như sách bói toán dự đoán tin tức thời sự hiện đại hoặc bỏ qua bối cảnh khủng hoảng đạo đức của Y-sơ-ra-ên và Giu-đa thời bấy giờ."
    },
    "gospels": {
        "name_vi": "Phúc Âm / Tin Lành (The Four Gospels)",
        "color": "#ea7a8f",
        "icon": "fa-heart",
        "books": ["MAT", "MRK", "LUK", "JHN"],
        "core_definition": "Bốn bức chân dung thần học sống động về cuộc đời, lời dạy, chức vụ mầu nhiệm, sự chết chuộc tội và sự sống lại vinh hiển của Đức Chúa Giê-xu Christ.",
        "hermeneutical_principles": [
            "Nhận diện 4 góc nhìn đặc thù: Ma-thi-ơ (Đấng Vua Do Thái), Mác (Đấng Tôi Tớ Chịu Khổ), Lu-ca (Con Người Trọn Vẹn Cứu Vớt Kẻ Khốn Cùng), Giăng (Con Đức Chúa Trời Hằng Sống).",
            "Phân tích Dụ ngôn (Parables): Nắm bắt trọng tâm thông điệp chính về Nước Đức Chúa Trời, tránh suy diễn ẩn dụ hóa thái quá từng chi tiết phụ.",
            "Đặt lời giảng dạy của Chúa Giê-xu trong bối cảnh văn hóa Do Thái giáo thế kỷ thứ nhất."
        ],
        "common_pitfalls": "Đồng nhất hóa gượng ép 4 sách làm mất đi sắc thái độc đáo của từng trước giả (Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn); hoặc hiểu thông điệp Nước Trời chỉ là một cuộc cách mạng chính trị - xã hội trần tục."
    },
    "acts": {
        "name_vi": "Lịch Sử Hội Thánh (Church History / Acts)",
        "color": "#059669",
        "icon": "fa-fire",
        "books": ["ACT"],
        "core_definition": "Hành trình truyền bá Tin Lành đầy quyền năng của Đức Thánh Linh qua các sứ đồ từ Giê-ru-sa-lem, xứ Giu-đê, xứ Sa-ma-ri cho đến tận cùng trái đất.",
        "hermeneutical_principles": [
            "Nhận định thời kỳ quá độ (Transitional Period) từ chế độ Cựu Ước sang Giao Ước Mới và sự hình thành cơ cấu Hội Thánh ban đầu.",
            "Cẩn trọng phân định những biến cố lịch sử đặc thù của thời kỳ nền tảng sứ đồ với những nguyên tắc trường tồn cho mọi thời đại.",
            "Theo dõi mối liên hệ hữu cơ giữa công tác quyền năng của Đức Thánh Linh và Lời Hằng Sống của Đức Chúa Trời."
        ],
        "common_pitfalls": "Bắt buộc mọi tín hữu hôm nay phải trải qua đúng từng trải nghiệm hiện tượng bên ngoài như bốc thăm chọn sứ đồ hay việc bán hết nhà cửa chia tiền trong những tuần đầu tại Giê-ru-sa-lem."
    },
    "epistles": {
        "name_vi": "Thư Tín (Pauline & General Epistles)",
        "color": "#2563eb",
        "icon": "fa-envelope-open-text",
        "books": ["ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS", "1PE", "2PE", "1JN", "2JN", "3JN", "JUD"],
        "core_definition": "Các lá thư mục vụ được soi dẫn thánh gửi cho các Hội Thánh và cá nhân để giải thích sâu sắc về thần học ân điển và nếp sống môn đồ hóa giữa thế gian.",
        "hermeneutical_principles": [
            "Tìm hiểu hoàn cảnh bức thư (Occasional Nature): Vấn đề nan đề cụ thể nào mà bức thư nhắm đến giải quyết? (chia rẽ, tà giáo, hôn nhân, bắt bớ).",
            "Theo dõi lập luận văn lý (Logical Flow): Phân tích liên từ (bởi vì, cho nên, thế thì), phân biệt phần Thần Học Căn Bản (Indicatives) và phần Mệnh Lệnh Thực Hành (Imperatives).",
            "Chuyển dịch các nguyên tắc đời đời sang bối cảnh văn hóa hiện đại."
        ],
        "common_pitfalls": "Cắt xén một câu ra khỏi chuỗi lập luận logic của đoạn văn (Proof-texting) để phục vụ cho quan điểm cá nhân thiên lệch."
    },
    "apocalyptic": {
        "name_vi": "Khải Huyền & Khải Thị Cánh Chung (Apocalyptic Literature)",
        "color": "#f59e0b",
        "icon": "fa-cloud-bolt",
        "books": ["REV"],
        "core_definition": "Thể loại văn chương khải thị đặc biệt dùng ngôn ngữ biểu tượng vũ trụ, thị kiến kỳ vĩ để hé mở thực tại thiên thượng và chiến thắng tối hậu của Đấng Christ trên mọi thế lực ma quỷ.",
        "hermeneutical_principles": [
            "Kinh Thánh giải nghĩa Kinh Thánh: Hơn 70% hình ảnh trong Khải Huyền bắt nguồn trực tiếp từ Cựu Ước (Đa-ni-ên, Ê-xê-chi-ên, Xa-cha-ri, Xuất hành).",
            "Mục đích chính của Khải Huyền là an ủi, khích lệ sự trung kiên của thánh đồ đang chịu bắt bớ chứ không phải gây hoang mang, sợ hãi.",
            "Đọc toàn diện bức tranh lớn: Chiên Con đắc thắng, kẻ ác bị trừng phạt, nước mắt được lau khô, sự chết bị tiêu diệt và Chúa ngự giữa dân Ngài đời đời."
        ],
        "common_pitfalls": "Cố gắng giải mã theo nghĩa đen hình học (ví dụ: máy bay trực thăng là cào cào) hoặc dùng thời sự thế giới hiện đại áp đặt vào các biểu tượng thần học cổ đại."
    }
}

with open("data/genre-guides.json", "w", encoding="utf-8") as f:
    json.dump(genres_dict, f, ensure_ascii=False, indent=2)

print(f"Generated 8 genres in data/genre-guides.json")

# 4. DEFAULT PARALLEL PASSAGES (10 TRANSLATIONS + INTERLINEAR)
passages_data = {
    "JHN.1": {
        "ref": "Giăng 1",
        "book_id": "JHN",
        "chapter_num": 1,
        "title_vi": "Ngôi Lời Trở Nên Xác Thịt & Lời Chứng Về Chiên Con",
        "verses": [
            {
                "verse_num": 1,
                "text_primary": "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
                "metaphor_id": None,
                "translations": {
                    "BTT": "Ban đầu có Đạo, Đạo ở cùng Đức Chúa Trời, và Đạo là Đức Chúa Trời.",
                    "BDM": "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
                    "BPT": "Trước khi vũ trụ được dựng nên, Ngôi Lời đã có sẵn rồi. Ngôi Lời ở cùng Thượng Đế và Ngôi Lời chính là Thượng Đế.",
                    "BD2011": "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
                    "BHD": "Từ ban đầu đã có Ngôi Lời. Ngôi Lời hằng ở với Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
                    "CGKPV": "Lúc khởi đầu đã có Ngôi Lời. Ngôi Lời vẫn hướng về Thiên Chúa, và Ngôi Lời là Thiên Chúa.",
                    "KJV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
                    "ESV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
                    "NIV": "In the beginning was the Word, and the Word was with God, and the Word was God.",
                    "INTERLINEAR": "Ἐν (G1722 - Trong) ἀρχῇ (G746 - ban đầu) ἦν (G2258 - đã có) ὁ (G3588) Λόγος (G3056 - Ngôi Lời), καὶ (G2532 - và) ὁ (G3588) Λόγος (G3056 - Ngôi Lời) ἦν (G2258 - ở) πρὸς (G4314 - cùng) τὸν (G3588) Θεόν (G2316 - Đức Chúa Trời), καὶ (G2532 - và) Θεὸς (G2316 - Đức Chúa Trời) ἦν (G2258 - là) ὁ (G3588) Λόγος (G3056 - Ngôi Lời)."
                },
                "cross_refs": ["Sáng thế ký 1:1", "1 Giăng 1:1-2", "Khải huyền 19:13", "Châm ngôn 8:22-30", "Cô-lô-se 1:15-17"]
            },
            {
                "verse_num": 2,
                "text_primary": "Ngay từ ban đầu, Ngài đã ở cùng Đức Chúa Trời.",
                "metaphor_id": None,
                "translations": {
                    "BTT": "Ban đầu Ngài ở cùng Đức Chúa Trời.",
                    "BDM": "Ngay từ ban đầu, Ngài đã ở cùng Đức Chúa Trời.",
                    "BPT": "Ngài đã ở cùng Thượng Đế từ lúc ban đầu.",
                    "BD2011": "Ban đầu Ngài ở cùng Đức Chúa Trời.",
                    "BHD": "Ngài hằng ở với Đức Chúa Trời từ thuở ban đầu.",
                    "CGKPV": "Lúc khởi đầu, Người vẫn hướng về Thiên Chúa.",
                    "KJV": "The same was in the beginning with God.",
                    "ESV": "He was in the beginning with God.",
                    "NIV": "He was with God in the beginning.",
                    "INTERLINEAR": "οὗτος (G3778 - Đấng này) ἦν (G2258 - đã ở) ἐν (G1722 - trong) ἀρχῇ (G746 - ban đầu) πρὸς (G4314 - cùng) τὸν (G3588) Θεόν (G2316 - Đức Chúa Trời)."
                },
                "cross_refs": ["Giăng 17:5", "Giăng 17:24", "Châm ngôn 8:30"]
            },
            {
                "verse_num": 3,
                "text_primary": "Muôn vật đều do Ngài tạo dựng, không một vật nào đã được tạo dựng mà không qua Ngài.",
                "metaphor_id": None,
                "translations": {
                    "BTT": "Muôn vật bởi Ngài làm nên, chẳng vật chi đã làm nên mà không bởi Ngài.",
                    "BDM": "Muôn vật đều do Ngài tạo dựng, không một vật nào đã được tạo dựng mà không qua Ngài.",
                    "BPT": "Vạn vật đều do Ngài tạo dựng. Không vật gì được tạo dựng mà không nhờ Ngài.",
                    "BD2011": "Muôn vật đều do Ngài tạo nên; chẳng vật nào đã được tạo nên mà không nhờ Ngài.",
                    "BHD": "Vũ trụ vạn vật đều do Ngài tạo dựng, không một vật gì hiện hữu mà không qua Ngài.",
                    "CGKPV": "Vạn vật nhờ Người mà có, và không có Người, thì chẳng có gì đã được tạo thành.",
                    "KJV": "All things were made by him; and without him was not any thing made that was made.",
                    "ESV": "All things were made through him, and without him was not any thing made that was made.",
                    "NIV": "Through him all things were made; without him nothing was made that has been made.",
                    "INTERLINEAR": "πάντα (G3956 - Muôn vật) δι’ (G1223 - bởi) αὐτοῦ (G846 - Ngài) ἐγένετο (G1096 - được tạo nên), καὶ (G2532 - và) χωρὶς (G5565 - không có) αὐτοῦ (G846 - Ngài) ἐγένετο (G1096 - đã làm nên) οὐδὲ (G3761 - chẳng có) ἕν (G1520 - một điều gì) ὃ (G3739) γέγονεν (G1096 - đã được dựng)."
                },
                "cross_refs": ["Cô-lô-se 1:16", "Hê-bơ-rơ 1:2", "Thi thiên 33:6", "1 Cô-rinh-tô 8:6"]
            },
            {
                "verse_num": 4,
                "text_primary": "Trong Ngài có sự sống, và sự sống là ánh sáng cho loài người.",
                "metaphor_id": "salt_and_light",
                "translations": {
                    "BTT": "Trong Ngài có sự sống, sự sống là sự sáng của loài người.",
                    "BDM": "Trong Ngài có sự sống, và sự sống là ánh sáng cho loài người.",
                    "BPT": "Sự sống ở trong Ngài và sự sống nầy đem ánh sáng đến cho nhân loại.",
                    "BD2011": "Trong Ngài có sự sống, và sự sống là ánh sáng của loài người.",
                    "BHD": "Trong Ngài có sự sống, và sự sống ấy là ánh sáng cho nhân loại.",
                    "CGKPV": "Ở nơi Người là sự sống, và sự sống là ánh sáng cho nhân loại.",
                    "KJV": "In him was life; and the life was the light of men.",
                    "ESV": "In him was life, and the life was the light of men.",
                    "NIV": "In him was life, and that life was the light of all mankind.",
                    "INTERLINEAR": "ἐν (G1722 - Trong) αὐτῷ (G846 - Ngài) ζωὴ (G2222 - sự sống) ἦν (G2258 - có), καὶ (G2532 - và) ἡ (G3588) ζωὴ (G2222 - sự sống) ἦν (G2258 - là) τὸ (G3588) φῶς (G5457 - ánh sáng) τῶν (G3588) ἀνθρώπων (G444 - của loài người)."
                },
                "cross_refs": ["Giăng 5:26", "Giăng 8:12", "Giăng 11:25", "1 Giăng 5:11"]
            },
            {
                "verse_num": 14,
                "text_primary": "Ngôi Lời đã trở nên xác thịt, sống giữa chúng ta, tràn đầy ân điển và chân lý. Chúng ta đã chiêm ngưỡng vinh quang Ngài, vinh quang của Con Một đến từ nơi Cha.",
                "metaphor_id": None,
                "translations": {
                    "BTT": "Ngôi Lời đã trở nên xác thịt, ở giữa chúng ta, đầy ơn và lẽ thật; chúng ta đã ngắm xem sự vinh hiển của Ngài, thật như vinh hiển của Con một sanh bởi Cha.",
                    "BDM": "Ngôi Lời đã trở nên xác thịt, sống giữa chúng ta, tràn đầy ân điển và chân lý. Chúng ta đã chiêm ngưỡng vinh quang Ngài, vinh quang của Con Một đến từ nơi Cha.",
                    "BPT": "Ngôi Lời đã trở nên một con người và sống giữa chúng tôi. Chúng tôi thấy sự vinh hiển Ngài, là vinh hiển của Con Một đến từ Cha, đầy ân phúc và chân lý.",
                    "BD2011": "Ngôi Lời đã trở nên xác thịt và cư ngụ giữa chúng ta. Chúng ta đã chiêm ngưỡng vinh hiển của Ngài, vinh hiển của Con Một đến từ Đức Chúa Cha, đầy dẫy ân sủng và chân lý.",
                    "BHD": "Ngôi Lời đã làm người, cư ngụ giữa chúng ta, đầy dẫy ơn phúc và chân lý. Chúng tôi đã thấy hào quang rực rỡ của Ngài, vinh quang của Con Độc Nhất của Đức Chúa Trời.",
                    "CGKPV": "Ngôi Lời đã trở nên người phàm và cư ngụ giữa chúng ta. Chúng tôi đã được ngắm nhìn vinh quang của Người, vinh quang mà Chúa Cha ban cho Người, là Con Một đầy tràn ân sủng và sự thật.",
                    "KJV": "And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.",
                    "ESV": "And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.",
                    "NIV": "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
                    "INTERLINEAR": "Καὶ (G2532 - Và) ὁ (G3588) Λόγος (G3056 - Ngôi Lời) σὰρξ (G4561 - xác thịt) ἐγένετο (G1096 - trở nên) καὶ (G2532 - và) ἐσκήνωσεν (G4637 - cắm trại / cư ngụ) ἐν (G1722 - giữa) ἡμῖν (G2254 - chúng ta), καὶ (G2532) ἐθεασάμεθα (G2300 - chiêm ngưỡng) τὴν (G3588) δόξαν (G1391 - vinh quang) αὐτοῦ (G846)..."
                },
                "cross_refs": ["Phi-líp 2:6-8", "1 Ti-mô-thê 3:16", "Hê-bơ-rơ 2:14", "Ê-sai 40:5", "Xuất Ê-díp-tô Ký 25:8"]
            },
            {
                "verse_num": 29,
                "text_primary": "Hôm sau, Giăng thấy Đức Chúa Giê-xu đến với mình thì nói: 'Kìa, Chiên Con của Đức Chúa Trời, Đấng cất đi tội lỗi của thế gian!'",
                "metaphor_id": "lamb_of_god",
                "translations": {
                    "BTT": "Qua ngày sau, Giăng thấy Đức Chúa Jêsus đến cùng mình, thì nói rằng: Kìa, Chiên con của Đức Chúa Trời, là Đấng cất tội lỗi thế gian đi!",
                    "BDM": "Hôm sau, Giăng thấy Đức Chúa Giê-xu đến với mình thì nói: 'Kìa, Chiên Con của Đức Chúa Trời, Đấng cất đi tội lỗi của thế gian!'",
                    "BPT": "Hôm sau, Giăng thấy Chúa Giê-xu đang đi về phía mình liền nói: 'Kìa, Chiên Con của Thượng Đế, Đấng cất bỏ tội lỗi trần gian!'",
                    "BD2011": "Ngày hôm sau Giăng thấy Đức Chúa Jesus đến với mình thì nói, 'Kìa, Chiên Con của Đức Chúa Trời, Đấng cất tội lỗi của thế gian đi!'",
                    "BHD": "Hôm sau, Giăng thấy Đức Chúa Giê-xu đến với mình, liền nói: 'Kìa, Chiên Con của Đức Chúa Trời, Đấng xóa bỏ tội lỗi trần gian!'",
                    "CGKPV": "Hôm sau, ông Gio-an thấy Đức Giê-su tiến về phía mình, liền nói: 'Đây là Chiên Thiên Chúa, đây Đấng xoá bỏ tội trần gian.'",
                    "KJV": "The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.",
                    "ESV": "The next day he saw Jesus coming toward him, and said, 'Behold, the Lamb of God, who takes away the sin of the world!'",
                    "NIV": "The next day John saw Jesus coming toward him and said, 'Look, the Lamb of God, who takes away the sin of the world!'",
                    "INTERLINEAR": "Τῇ (G3588) ἐπαύριον (G1887 - Hôm sau) βλέπει (G991 - thấy) τὸν (G3588) Ἰησοῦν (G2424 - Đức Chúa Giê-xu)... ἴδε (G2396 - Kìa) ὁ (G3588) ἀμνὸς (G286 - Chiên Con) τοῦ (G3588) Θεοῦ (G2316 - của Đức Chúa Trời) ὁ (G3588) αἴρων (G142 - Đấng cất đi) τὴν (G3588) ἁμαρτίαν (G266 - tội lỗi) τοῦ (G3588) κόσμου (G2889 - của thế gian)."
                },
                "cross_refs": ["Xuất Ê-díp-tô Ký 12:3", "Ê-sai 53:7", "1 Phi-e-rơ 1:19", "Khải huyền 5:6", "Hê-bơ-rơ 9:28"]
            }
        ]
    }
}

with open("data/default-bible-passages.json", "w", encoding="utf-8") as f:
    json.dump(passages_data, f, ensure_ascii=False, indent=2)

print(f"Generated default passages in data/default-bible-passages.json")

# 5. VISUAL MEDIA & VIDEO THE BIBLE PROJECT
media_data = {
    "maps": [
        {
            "id": "ancient_near_east",
            "title_vi": "Bản Đồ Cận Đông Cổ Đại & Xuất Ai Cập",
            "description": "Bản đồ vệ tinh hành trình tuyển dân Y-sơ-ra-ên rời khỏi Ai Cập, qua Biển Đỏ đến núi Si-na-i và Đất Hứa Ca-na-an.",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
            "period": "Thời kỳ Môi-se (~1446 TCN)",
            "related_books": ["GEN", "EXO", "NUM", "DEU", "JOS"]
        },
        {
            "id": "paul_missionary_journeys",
            "title_vi": "3 Chuyến Hành Trình Truyền Giáo Của Sứ Đồ Phao-lô",
            "description": "Bản đồ đế chế La Mã thế kỷ thứ nhất mô tả mạng lưới thành phố: An-ti-ốt, Phi-líp, Tê-sa-lô-ni-ca, Cô-rinh-tô, Ê-phê-sô và Rô-ma.",
            "image_url": "https://images.unsplash.com/photo-1524654458049-e36be0721fa2?auto=format&fit=crop&w=1200&q=80",
            "period": "Thế kỷ thứ nhất (~46-67 SC)",
            "related_books": ["ACT", "ROM", "1CO", "2CO", "GAL", "EPH", "PHP", "COL"]
        },
        {
            "id": "jerusalem_temple_mount",
            "title_vi": "Mô Hình Đền Thờ Giê-ru-sa-lem Thời Chúa Giê-xu",
            "description": "Tái hiện Đền Thờ Hê-rốt vĩ đại với Sân Dân Ngoại, Nơi Thánh, Nơi Rất Thánh và Bức Màn Đền Thờ bị xé đôi khi Chúa chịu đóng đinh.",
            "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
            "period": "Thời Chúa Giê-xu (~30 SC)",
            "related_books": ["MAT", "MRK", "LUK", "JHN", "ACT", "HEB"]
        }
    ],
    "archaeology": [
        {
            "id": "dead_sea_scrolls",
            "title_vi": "Cuộn Da Biển Chết (Dead Sea Scrolls - Qumran)",
            "description": "Phát hiện khảo cổ học vĩ đại nhất thế kỷ 20 tại hang động Qumran xác nhận tính chính xác phi thường của các bản chép tay Kinh Thánh Cựu Ước hơn 2000 năm tuổi.",
            "image_url": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80",
            "artifacts_site": "Qumran, Biển Chết",
            "dating": "Thế kỷ 3 TCN - Thế kỷ 1 SC"
        },
        {
            "id": "pilate_stone",
            "title_vi": "Phiến Đá Bôn-xơ Phi-lát (The Pilate Stone)",
            "description": "Bia đá La Mã tìm thấy tại thành Cê-xa-rê khắc tên 'Pontius Pilatus, Quan Tổng trấn xứ Giu-đê', chứng thực lịch sử nhân vật xét xử Chúa Giê-xu.",
            "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
            "artifacts_site": "Cê-xa-rê Maritima",
            "dating": "Khoảng năm 26-36 SC"
        }
    ],
    "bible_project_videos": [
        {
            "id": "bp_john",
            "book_id": "JHN",
            "title_vi": "Dự Án Kinh Thánh: Khảo Sát Phúc Âm Giăng (Phần 1 & 2)",
            "description": "Video hoạt hình phân tích cấu trúc Phúc Âm Giăng: Ngôi Lời nhập thể, 7 Dấu lạ quyền năng, và sự bày tỏ Chiên Con của Đức Chúa Trời.",
            "youtube_id": "G-2e9mMf7E8",
            "duration": "8:57",
            "language": "Tiếng Việt / Phụ đề chuẩn"
        },
        {
            "id": "bp_genesis",
            "book_id": "GEN",
            "title_vi": "Dự Án Kinh Thánh: Khảo Sát Sáng Thế Ký",
            "description": "Phân tích nguồn gốc sáng tạo, sự sa ngã, giao ước Áp-ra-ham và kế hoạch cứu chuộc nhân loại qua dòng dõi người nữ.",
            "youtube_id": "KOUV7mW49co",
            "duration": "8:15",
            "language": "Tiếng Việt / Phụ đề chuẩn"
        },
        {
            "id": "bp_covenant",
            "theme_id": "covenants",
            "title_vi": "Chủ Đề Thần Học: Các Giao Ước Trong Kinh Thánh (Covenants)",
            "description": "Tìm hiểu sợi chỉ đỏ xuyên suốt từ Giao ước Nô-ê, Áp-ra-ham, Si-na-i, Đa-vít cho đến Giao Ước Mới trong huyết Chúa Giê-xu.",
            "youtube_id": "7_CGP-12AE0",
            "duration": "5:32",
            "language": "Tiếng Việt / Phụ đề chuẩn"
        },
        {
            "id": "bp_messiah",
            "theme_id": "messiah",
            "title_vi": "Chủ Đề Thần Học: Đấng Mê-si-a (The Messiah)",
            "description": "Tại sao dân Y-sơ-ra-ên lại trông chờ một vị Vua được xức dầu? Lời tiên tri trong Cựu Ước đã được Chúa Giê-xu ứng nghiệm cách bất ngờ thế nào?",
            "youtube_id": "3dEh25pduQ8",
            "duration": "5:47",
            "language": "Tiếng Việt / Phụ đề chuẩn"
        }
    ]
}

with open("data/visual-media-library.json", "w", encoding="utf-8") as f:
    json.dump(media_data, f, ensure_ascii=False, indent=2)

print(f"Generated visual media in data/visual-media-library.json")

# 6. DEFAULT ARTICLES & COMMUNITY POSTS
articles_data = {
    "master_blogs": [
        {
            "id": "art_logos_incarnation",
            "title_vi": "Ngôi Lời Nhập Thể: Mầu Nhiệm 'Logos' Giữa Triết Học Hy Lạp Và Chân Lý Do Thái",
            "author": "Chủ Trang Nghiên Cứu",
            "date": "14/10/2026",
            "category": "Thần Học Phúc Âm",
            "summary": "Tại sao Sứ đồ Giăng lại dùng từ 'Logos' để mở đầu Phúc Âm? Khám phá cách Lời Hằng Sống vượt lên trên quan niệm trừu tượng của triết gia Hê-ra-clit để trở thành Đấng Cứu Thế bằng xương bằng thịt sống giữa nhân loại.",
            "content": "Trong bối cảnh văn hóa thế kỷ thứ nhất, khi người Hy Lạp nghe từ 'Logos', họ nghĩ đến quy luật lý trí tối cao điều khiển vũ trụ. Nhưng khi người Do Thái nghe 'Lời' (Dabar Yahweh), họ nhớ đến Lời Chúa phán sinh ra muôn loài trong Sáng thế ký 1 và phán qua các tiên tri.\n\nSứ đồ Giăng đã kết hợp hai dòng chảy tư tưởng đó bằng một tuyên ngôn làm rung chuyển thế giới: 'Ngôi Lời đã trở nên xác thịt, ở giữa chúng ta' (Giăng 1:14). Từ 'ở giữa' trong nguyên văn Hy Lạp (eskēnōsen) nghĩa đen là 'cắm trại' hay 'dựng Đền Tạm'. Như vinh quang Shekinah của Chúa từng ngự trong Đền Tạm giữa hoang mạc, nay chính Chúa Giê-xu là Đền Tạm sống động của Đức Chúa Trời giữa con người!",
            "tags": ["Ngôi Lời", "Giăng 1", "Nhập Thể", "Thần Học"]
        },
        {
            "id": "art_typology_lamb",
            "title_vi": "Hành Trình Chiên Con: Sợi Chỉ Đỏ Cứu Chuộc Từ Bết-lê-hem Đến Khải Huyền",
            "author": "Chủ Trang Nghiên Cứu",
            "date": "10/10/2026",
            "category": "Hình Bóng & Ẩn Dụ",
            "summary": "Khảo sát nguyên tắc Kinh Thánh giải nghĩa Kinh Thánh: Làm thế nào từ một con chiên đực trong Lễ Vượt Qua tại Ai Cập lại dẫn thẳng đến Chiên Con Đắc Thắng trên Ngai Vinh Hiển trong Khải Huyền?",
            "content": "Khái niệm 'Kinh Thánh tự giải nghĩa Kinh Thánh' (Scriptura Sacra sui ipsius interpres) được minh chứng rõ ràng nhất qua hình ảnh Chiên Con. Cựu Ước đặt câu hỏi lớn: 'Chiên con đâu có đặng làm của lễ thiêu?' (Sáng 22:7). Tân Ước cất lên câu trả lời vang dội: 'Kìa, Chiên Con của Đức Chúa Trời!' (Giăng 1:29).\n\nKhông có huyết Chiên Lễ Vượt Qua bôi trên cửa, người Do Thái không thể thoát khỏi sứ giả hủy diệt. Tương tự, nếu không nhờ huyết Chiên Con vô tội hiến tế trên thập tự giá, không ai có thể đứng vững trước sự phán xét công bình của Thiên Chúa.",
            "tags": ["Chiên Con", "Ẩn Dụ", "Lễ Vượt Qua", "Cứu Chuộc"]
        }
    ],
    "community_branches": [
        {
            "id": "branch_devotion",
            "title_vi": "Nhánh 1: Suy Ngẫm & Ứng Dụng Đời Sống",
            "description": "Nơi học viên chia sẻ những bài học thực tế, lời chứng và sự biến đổi đời sống khi áp dụng Lời Chúa mỗi ngày.",
            "posts_count": 12
        },
        {
            "id": "branch_original_languages",
            "title_vi": "Nhánh 2: Nghiên Cứu Nguyên Ngữ & Thể Loại Văn Chương",
            "description": "Thảo luận về ngữ pháp Hê-bơ-rơ, Hy Lạp, mã số Strong's, cấu trúc thi ca song hành và bối cảnh Cận Đông cổ đại.",
            "posts_count": 8
        },
        {
            "id": "branch_typology_symbols",
            "title_vi": "Nhánh 3: Giải Mã Hình Ảnh Ẩn Dụ & Tiên Tri",
            "description": "Cùng nhau đối chiếu các câu Kinh Thánh để làm sáng tỏ ý nghĩa của các biểu tượng trong Cựu Ước và Khải Huyền.",
            "posts_count": 15
        }
    ],
    "community_posts": [
        {
            "id": "post_01",
            "branch_id": "branch_devotion",
            "author": "Học Viên Tín Thác",
            "date": "13/10/2026",
            "title": "Cảm nhận về việc 'Cứ ở trong Cây Nho' giữa áp lực cuộc sống",
            "content": "Đọc Giăng 15 sáng nay tôi nhận ra mình thường cố gắng 'tự ép mình sinh quả' bằng nỗ lực xác thịt thay vì chỉ đơn giản là gắn chặt vào Cây Nho Thật qua việc tương giao cầu nguyện và suy ngẫm Lời Ngài.",
            "replies_count": 3
        }
    ]
}

with open("data/default-articles.json", "w", encoding="utf-8") as f:
    json.dump(articles_data, f, ensure_ascii=False, indent=2)

print(f"Generated default articles in data/default-articles.json")
