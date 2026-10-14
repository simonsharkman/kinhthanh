# Bản Thiết Kế Kiến Trúc Hệ Thống: Logos MultiVerse (Studio Edition)
**Nền Tảng Đối Chiếu Kinh Thánh Đa Bản Dịch, Giải Nghĩa Ẩn Dụ & Trung Tâm Tri Thức Thần Học**

- **Ngày ban hành**: 14/10/2026
- **Trạng thái**: Approved for Implementation Plan
- **Tiêu chuẩn chất lượng**: Google Antigravity 2.1 Enterprise / Zero Placeholder Policy

---

## 1. TỔNG QUAN & MỤC TIÊU DỰ ÁN

Logos MultiVerse là một nền tảng Web Application hiện đại, tốc độ cao, hỗ trợ người học, nhà nghiên cứu và tín hữu học Kinh Thánh chuyên sâu với các mục tiêu cốt lõi:
1. **Đối chiếu chính xác & tức thì**: So sánh song song các bản dịch Kinh Thánh tiếng Việt phổ biến (Bản Truyền Thống 1925, Bản Dịch Mới 2002, Bản Phổ Thông, Bản Dịch 2011, Bản Hiện Đại, Bản Công Giáo CGKPV) và các bản dịch quốc tế kinh điển (KJV, ESV, NIV) kèm đối chiếu nguyên ngữ Hy Lạp / Hê-bơ-rơ (Strong's Concordance).
2. **Nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh" (*Scriptura Sacra sui ipsius interpres*)**: Tự động liên kết hình bóng (Shadows) trong Cựu Ước với thực tại ứng nghiệm (Fulfillment) trong Đấng Christ ở Tân Ước thông qua hệ thống Cross-References (TSK).
3. **Giải nghĩa hình ảnh ẩn dụ & Biểu tượng (Biblical Typology & Metaphors)**: Bóc tách hơn 100 biểu tượng xuyên suốt (Chiên con, Cây nho, Bánh sự sống, Men, Muối, Lửa, Sừng, Mão triều thiên, Áo trắng, Đá góc nhà...) theo đúng ngữ cảnh.
4. **Bối cảnh lịch sử, văn hóa & 8 thể loại văn chương**: Cung cấp kiến thức về địa lý Cận Đông cổ đại, phong tục Do Thái và hướng dẫn quy tắc giải kinh tương ứng cho 8 thể loại (Luật pháp, Lịch sử, Thơ ca/Khôn ngoan, Tiên tri, Phúc âm, Công vụ, Thư tín, Khải huyền).
5. **Kho hình ảnh trực quan & Video The Bible Project**: Tích hợp bản đồ vệ tinh, tranh nghệ thuật kinh điển, hiện vật khảo cổ và trình chiếu video hoạt hình giải thích cấu trúc từng sách.
6. **Trợ lý AI / ChatGPT Thần Học**: Hỗ trợ tra cứu tức thì với chế độ Zero-Setup và tùy chọn kết nối ChatGPT API.
7. **Blog cá nhân, Nhánh Cộng đồng & Berea Guardian Agent**: Không gian viết bài nghiên cứu, diễn đàn thảo luận cho học viên với **chính sách bảo vệ nội dung bất biến (Zero-Tamper Policy)** và Agent AI Berea giám sát trật tự, nhắc nhở đạo đức và ngăn chặn lạm dụng.

---

## 2. KIẾN TRÚC HỆ THỐNG & CẤU TRÚC THƯ MỤC

Hệ thống được thiết kế theo mô hình **Modular Client-Side Engine (Single Page Application)** chạy mượt mà ngay trên mọi trình duyệt mà không cần cài đặt backend phức tạp, đồng thời hỗ trợ lưu trữ ngoại tuyến (Offline-First) thông qua IndexedDB.

```
logos-bible-multiverse/
├── index.html                           # Giao diện chính Semantic HTML5, A11y, OpenGraph SEO
├── css/
│   ├── design-tokens.css                # Biến HSL: Royal Obsidian Dark, Antique Gold, Parchment Ivory
│   ├── layout.css                       # Layout Focus Reader, Header, Drawer Inspector, Sidebar
│   ├── components.css                   # Verse cards, badges, tabs, chat widgets, modal players
│   └── animations.css                   # Keyframes 60fps, micro-interactions, smooth slide-overs
├── js/
│   ├── app.js                           # Master Orchestrator: Khởi động và kết nối các phân hệ
│   ├── state.js                         # Quản lý State tập trung (Sách, Chương, Câu, Bản dịch, Role)
│   ├── bible-engine.js                  # Xử lý nạp văn bản, đối chiếu song song đa bản dịch
│   ├── hermeneutics-engine.js           # Bóc tách ẩn dụ, bối cảnh lịch sử và 8 thể loại văn chương
│   ├── crossref-engine.js               # Chuỗi liên kết Kinh Thánh giải thích Kinh Thánh (TSK)
│   ├── media-engine.js                  # Quản lý thư viện hình ảnh khảo cổ, bản đồ & video The Bible Project
│   ├── ai-assistant.js                  # Trợ lý AI Thần Học (Offline Smart Engine + OpenAI ChatGPT connector)
│   ├── blog-community.js                # Quản lý Blog tác giả, bài viết nhánh cộng đồng và phòng Chat
│   ├── berea-guardian.js                # AI Moderator Agent: Kiểm duyệt ngôn từ, nhắc nhở Cô-lô-se 4:6
│   └── storage.js                       # Quản lý IndexedDB (LogosDB) & LocalStorage (Offline cache)
├── data/
│   ├── books-metadata.json              # 66 sách: Tác giả, Niên đại, Thể loại, Chủ đề, Bản đồ
│   ├── metaphors-database.json          # Từ điển hơn 100 hình ảnh ẩn dụ & biểu tượng thần học
│   ├── genre-guides.json                # Quy chuẩn giải kinh cho 8 thể loại văn chương
│   ├── default-bible-passages.json      # Văn bản hoàn chỉnh đa bản dịch cho các phân đoạn nền tảng
│   ├── visual-media-library.json        # Thư viện ảnh khảo cổ, bản đồ thánh và danh sách video Bible Project
│   └── default-articles.json            # Bài viết mẫu Blog chuyên sâu và các bài viết nhánh cộng đồng
└── docs/
    └── superpowers/specs/
        └── 2026-10-14-logos-bible-study-design.md
```

---

## 3. ĐẶC TẢ CHI TIẾT CÁC PHÂN HỆ

### Phân Hệ 1: Bộ Máy Đối Chiếu Song Song Đa Bản Dịch (Parallel Bible Engine)
- **Hỗ trợ bản dịch**:
  - `BTT`: Bản Truyền Thống 1925 (Văn phong trang trọng cổ điển).
  - `BDM`: Bản Dịch Mới 2002 (Hiện đại, trong sáng, sát nghĩa nguyên ngữ).
  - `BPT`: Bản Phổ Thông (Dễ hiểu, diễn ý mạch lạc).
  - `BD2011`: Bản Dịch 2011 (Dịch giả Đặng Ngọc Báu).
  - `BHD`: Bản Hiện Đại.
  - `CGKPV`: Bản dịch Nhóm Giờ Kinh Phụng Vụ Công Giáo.
  - `KJV`: King James Version 1611.
  - `ESV`: English Standard Version (Độ chính xác học thuật cao).
  - `NIV`: New International Version.
  - `INTERLINEAR`: Bản dịch từng từ Hy Lạp (Tân Ước) / Hê-bơ-rơ (Cựu Ước) kèm phiên âm và mã số Strong's Concordance.
- **Tính năng nổi bật**:
  - Cho phép người dùng bật/tắt hiển thị cùng lúc 2 đến 5 cột bản dịch để so sánh từng cụm từ.
  - Highlighting khác biệt từ ngữ khi đối chiếu 2 bản dịch bất kỳ.

### Phân Hệ 2: Giải Nghĩa Ẩn Dụ & "Kinh Thánh Giải Nghĩa Kinh Thánh" (Hermeneutics & Typology)
- **Hơn 100 biểu tượng & hình ảnh ẩn dụ**:
  - *Chiên Con*: Từ của lễ A-bên (Sáng 4), chiên Lễ Vượt Qua (Xuất 12), chiên đền tội (Lê-vi 16), người tôi tớ chịu khổ (Ê-sai 53) đến Chiên Con đắc thắng (Giăng 1:29; Khải huyền 5).
  - *Cây Nho & Nhánh Nho*: Y-sơ-ra-ên là vườn nho thoái hóa (Ê-sai 5) ➔ Chúa Giê-xu là Cây Nho Thật (Giăng 15).
  - *Men*: Biểu tượng tội lỗi thầm kín, giáo lý giả (Pha-ri-si, Sa-đu-sê), lễ Bánh Không Men.
  - *Muối & Ánh Sáng*: Chức năng ướp mặn bảo quản, đẩy lùi hư hoại và chiếu rọi chân lý.
  - *Lửa, Dầu, Gió, Sừng, Mão Triều Thiên, Bánh Sự Sống, Nước Sống, Áo Trắng...*
- **Cross-Reference Graph (Kinh Thánh giải thích Kinh Thánh)**:
  - Khi xem một câu, hệ thống hiển thị danh sách các câu đối chiếu song hành được tuyển chọn từ *Treasury of Scripture Knowledge (TSK)*.
  - Bấm vào câu đối chiếu để xem nội dung tức thì (Quick Peek Tooltip) không cần rời khỏi trang đang đọc.

### Phân Hệ 3: Bối Cảnh Lịch Sử & 8 Thể Loại Văn Chương
- **8 Thể loại văn chương**:
  1. *Luật pháp (Torah / Law)*
  2. *Lịch sử (Historical)*
  3. *Thơ ca & Khôn ngoan (Poetry & Wisdom)*
  4. *Tiên tri (Prophets)*
  5. *Tin Lành / Phúc âm (Gospels)*
  6. *Lịch sử Hội Thánh (Church History / Acts)*
  7. *Thư tín (Epistles)*
  8. *Khải huyền (Apocalyptic)*
- **Nguyên tắc giải thích bối cảnh**:
  - Tác giả, người nhận ban đầu, niên đại, vị trí địa lý.
  - Phong tục văn hóa Do Thái và bối cảnh Đế chế La Mã - Hy Lạp.
  - Cảnh báo các lỗi giải kinh phổ biến (e.g., áp dụng nghĩa đen cứng nhắc cho thi ca hoặc biểu tượng khải huyền).

### Phân Hệ 4: Visual Media Library & Cổng Kiến Thức Ngoại Vi
- **Thư viện hình ảnh**: Bản đồ địa lý Kinh Thánh độ phân giải cao, ảnh chụp khảo cổ cổ vật Cận Đông, tranh minh họa Kinh Thánh thời Phục Hưng.
- **Trình nhúng Video The Bible Project**: Tích hợp danh sách video phân tích sách và video thần học chủ đề có phụ đề tiếng Việt / thuyết minh.
- **Deep-Links Cổng Tri Thức**:
  - `BibleHub`: Tra cứu Strong's Lexicon và bình giải Matthew Henry.
  - `StepBible`: Đối chiếu ngữ pháp nguyên bản Tyndale House Cambridge.
  - `OpenBible`: Vệ tinh Google Maps các địa danh Kinh Thánh.

### Phân Hệ 5: Trợ Lý AI Thần Học (Theological AI Copilot)
- **Chế độ Zero-Setup**: Bộ tri thức thần học tích hợp sẵn trả lời tức thì các câu hỏi căn bản về bối cảnh, tác giả, ý nghĩa câu và ứng dụng thực tiễn.
- **Chế độ ChatGPT Kết Nối Ngoài**: Hộp thoại cấu hình OpenAI API Key (lưu bảo mật trong LocalStorage trình duyệt người dùng), cho phép tương tác chuyên sâu không giới hạn với GPT-4o.
- **One-Click Smart Prompts**:
  - "Giải thích bối cảnh lịch sử và người nhận ban đầu của chương này?"
  - "Những hình ảnh ẩn dụ nào xuất hiện trong phân đoạn này và ý nghĩa Cựu Ước là gì?"
  - "Làm thế nào để áp dụng câu Kinh Thánh này vào đời sống thực tế hôm nay?"

### Phân Hệ 6: Blog Cá Nhân, Nhánh Cộng Đồng & Berea Guardian Agent
- **Khu vực Blog của Chủ Trang (Author's Master Journal)**:
  - Chỉ Admin mới có quyền tạo mới, chỉnh sửa, ghim bài hoặc xóa bài viết.
  - Trình soạn thảo Markdown/HTML hỗ trợ chèn thẻ câu Kinh Thánh tương tác, hình ảnh và video.
- **Các Nhánh Nhỏ Cộng Đồng (Community Circles)**:
  - Học viên/Độc giả gửi bài viết suy ngẫm vào các nhánh (Suy ngẫm đời sống, Nghiên cứu nguyên ngữ, Giải mã ẩn dụ).
  - **Chính sách Bất Biến (Zero-Tamper Protection)**: Khách và học viên chỉ được gửi bài vào nhánh cộng đồng, **hoàn toàn KHÔNG THỂ sửa đổi hay ghi đè** bất kỳ văn bản Kinh Thánh, chú giải chính thức hoặc bài viết của tác giả.
- **Phòng Chat Thảo Luận Trực Quan (Live Study Fellowship Chat)**:
  - Cho phép học viên thảo luận, trích dẫn nhanh câu Kinh Thánh qua cú pháp `#Sach Chuong:Cau`.
- **Berea Guardian Agent (Hộ Vệ Trật Tự & Đạo Đức)**:
  - Quét tự động nội dung bài viết và tin nhắn chat theo thời gian thực.
  - Chặn đứng spam, ngôn từ xúc phạm, chia rẽ hoặc xuyên tạc.
  - Hiển thị thông báo nhắc nhở nhã nhặn trích dẫn Lời Chúa (*Cô-lô-se 4:6; Châm ngôn 15:1*), giữ gìn môi trường học tập thuần khiết, tôn trọng và gây dựng lẫn nhau.

---

## 4. THIẾT KẾ GIAO DIỆN & HỆ THỐNG MÀU SẮC (UI/UX)

- **Phong cách**: *Royal Theological Dark / Parchment Ivory*.
- **Bảng màu chủ đạo**:
  - Nền Dark: `--bg-primary: #0d1117` (Obsidian), `--bg-surface: #161b22`, `--bg-card: #21262d`.
  - Nền Parchment: `--bg-parchment: #fdf6e2`, `--bg-parchment-card: #f4ecd8`.
  - Điểm xuyết: `--accent-gold: #d4af37` (Antique Royal Gold), `--accent-gold-glow: rgba(212, 175, 55, 0.25)`.
  - Màu phân loại thể loại:
    - Luật pháp: Hổ phách (`#d97706`)
    - Lịch sử: Đỏ đồng (`#b45309`)
    - Thơ ca: Xanh ngọc lam (`#0891b2`)
    - Tiên tri: Tím hoàng gia (`#7c3aed`)
    - Phúc âm: Đỏ ruby (`#e11d48`)
    - Công vụ: Xanh ngọc lục bảo (`#059669`)
    - Thư tín: Xanh dương cobalt (`#2563eb`)
    - Khải huyền: Vàng kim rực rỡ (`#f59e0b`)
- **Typography**:
  - Tiêu đề & Logo: Google Fonts `Cinzel` / `Playfair Display`
  - Đọc Kinh Thánh: Google Fonts `Merriweather` (độ tương phản cao, line-height 1.85, êm mắt)
  - Nhãn điều khiển & UI: Google Fonts `Outfit` / `Inter`

---

## 5. KẾ HOẠCH KIỂM THỬ & BẢO ĐẢM CHẤT LƯỢNG

1. **Kiểm tra chức năng đối chiếu song song**: Đảm bảo câu được căn chỉnh chính xác theo hàng trên cả 10 bản dịch.
2. **Kiểm tra bộ máy giải nghĩa ẩn dụ**: Xác minh tính chính xác của các mối liên kết Cựu Ước - Tân Ước.
3. **Kiểm tra bảo vệ phân quyền (Immutability Gate)**: Thử nghiệm tài khoản khách (Guest) không thể can thiệp vào dữ liệu văn bản thánh và bài viết tác giả.
4. **Kiểm tra Berea Guardian Agent**: Kiểm thử khả năng phát hiện từ ngữ xấu, spam và hiển thị lời nhắc nhở nhã nhặn.
5. **Kiểm tra hiệu năng & tương thích**: Đảm bảo trang web tải dưới 1 giây, animation 60fps mượt mà trên cả Desktop, Tablet và Mobile.
