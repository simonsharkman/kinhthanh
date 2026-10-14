# Logos MultiVerse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng nền tảng Web Application học Kinh Thánh Logos MultiVerse hỗ trợ đối chiếu song song 10 bản dịch, giải nghĩa hình ảnh ẩn dụ & biểu tượng, nguyên tắc Kinh Thánh giải thích Kinh Thánh (TSK), bối cảnh lịch sử & 8 thể loại văn chương, thư viện media trực quan & video The Bible Project, trợ lý AI ChatGPT, Banner tùy chỉnh cho quản trị viên, Blog cá nhân & Nhánh cộng đồng kèm Berea Guardian Agent bảo vệ nội dung bất biến.

**Architecture:** Client-side Modular Web Application (HTML5, Vanilla CSS3 Design Tokens, ES6 Modules) tích hợp sẵn cơ sở tri thức thần học hoàn chỉnh (66 sách, 100+ ẩn dụ, 8 thể loại), lưu trữ đệm IndexedDB/LocalStorage và bộ máy kiểm soát trật tự nội dung thời gian thực.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (HSL Design System, Glassmorphism, Micro-animations), JavaScript ES6 Modules, IndexedDB (LogosDB), Google Fonts (Cinzel, Merriweather, Outfit), FontAwesome / Feather SVG Icons.

**Spec:** `docs/superpowers/specs/2026-10-14-logos-bible-study-design.md`

## Global Constraints

- **Theme Palette**: Royal Theological Dark (`#0d1117`, `#161b22`, Gold `#d4af37`) và Parchment Ivory (`#fdf6e2`, `#2d3748`).
- **Typography**: Merriweather cho văn bản Kinh Thánh, Cinzel cho thương hiệu, Outfit cho điều khiển UI.
- **Zero-Tamper Guardrail**: Toàn bộ dữ liệu Kinh Thánh, bài viết tác giả và cài đặt Admin được bảo vệ bất biến trước người dùng Guest.
- **Zero Placeholder Policy**: Mọi tệp dữ liệu phải chứa dữ liệu thần học thực tế, sâu sắc, trích dẫn chuẩn xác, không dùng văn mẫu giả lập.
- **Portability**: Hoạt động mượt mà bằng cách mở trực tiếp `index.html` hoặc chạy qua bất kỳ static web server nào.

## Review Focus

1. **Sai lệch thứ tự đối chiếu câu giữa các bản dịch**: Các bản dịch khác nhau phải căn chỉnh khớp chính xác theo từng số câu (verse-aligned).
2. **Cố tình can thiệp chỉnh sửa văn bản của khách (Guest Tamper Attempt)**: Người dùng ở vai trò Guest không thể chỉnh sửa, ghi đè văn bản Kinh Thánh hoặc bài viết tác giả.
3. **Quản trị viên cấu hình Banner tùy chỉnh**: Banner chỉ cập nhật và lưu trữ khi người dùng kích hoạt quyền Admin đúng mật khẩu.
4. **Berea Guardian Agent nhận diện ngôn từ nhạy cảm / xúc phạm**: Kiểm duyệt thời gian thực, nhắc nhở nhã nhặn trích dẫn Cô-lô-se 4:6 mà không làm sập ứng dụng.
5. **Khả năng hoạt động khi mất mạng (Offline-readiness)**: Tra cứu toàn bộ kho dữ liệu ẩn dụ, bối cảnh sách và các chương mẫu cốt lõi ngay cả khi không có kết nối internet.

---

### Task 1: Cấu Trúc Khung Ứng Dụng & Hệ Thống Thiết Kế (Foundation & Design Tokens)

**Files:**
- Create: `index.html`
- Create: `css/design-tokens.css`
- Create: `css/layout.css`
- Create: `css/animations.css`
- Test: `tests/test_ui_foundation.py`

**Interfaces:**
- Produces: CSS Variables (`--bg-primary`, `--accent-gold`, `--font-bible`, v.v.), cấu trúc DOM Semantic (`#app-header`, `#admin-banner-container`, `#main-reader`, `#drawer-inspector`).

- [ ] **Step 1: Viết test kiểm tra cấu trúc Semantic HTML và Design Tokens**
Tạo file `tests/test_ui_foundation.py` kiểm tra `index.html` và `css/design-tokens.css` có đầy đủ các thẻ cốt lõi, CSS variables cho 2 chế độ Dark/Parchment và các phân vùng điều hướng.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_ui_foundation.py -v` (Kết quả mong đợi: FAIL vì file chưa tồn tại).

- [ ] **Step 3: Triển khai index.html và các file CSS nền tảng**
Viết `css/design-tokens.css` chứa hệ thống biến HSL hoàn chỉnh (Obsidian Dark, Parchment Ivory, Antique Gold glow, 8 màu thể loại văn chương).
Viết `css/layout.css` bố cục Header, Admin Banner, Focus Reader Canvas và Drawer Inspector.
Viết `css/animations.css` hiệu ứng mượt 60fps (fade-in, slide-over drawer, gold pulse).
Viết `index.html` kết nối toàn bộ layout, nhúng Google Fonts (Cinzel, Merriweather, Outfit) và các SVG icons.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_ui_foundation.py -v` (Kết quả mong đợi: PASS).

- [ ] **Step 5: Commit**
`git add index.html css/ tests/test_ui_foundation.py && git commit -m "feat: setup semantic HTML foundation, CSS design tokens and layout"`

---

### Task 2: Cơ Sở Dữ Liệu Tri Thức Thần Học & Bối Cảnh (Core Theological Data Bundles)

**Files:**
- Create: `data/books-metadata.json`
- Create: `data/metaphors-database.json`
- Create: `data/genre-guides.json`
- Create: `data/default-bible-passages.json`
- Create: `data/visual-media-library.json`
- Create: `data/default-articles.json`
- Test: `tests/test_data_integrity.py`

**Interfaces:**
- Produces: JSON schemas chuẩn cho 66 sách Kinh Thánh, từ điển ẩn dụ (>100 mục), 8 thể loại văn chương, văn bản đối chiếu mẫu (Sáng thế ký 1, Thi thiên 23, Giăng 1, Khải huyền 21...), thư viện media trực quan và bài viết ban đầu.

- [ ] **Step 1: Viết test kiểm tra tính toàn vẹn dữ liệu JSON**
Tạo file `tests/test_data_integrity.py` xác minh 66 sách có đầy đủ thông tin (tác giả, thể loại, niên đại), từ điển ẩn dụ có các biểu tượng trọng tâm (Chiên con, Cây nho, Men, Muối, Lửa...), và các phân đoạn mẫu có đủ 10 bản dịch.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_data_integrity.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Soạn thảo dữ liệu chất lượng cao không dùng placeholder**
Tạo `data/books-metadata.json` (66 sách, bối cảnh Cận Đông/La Mã, phân loại thể loại).
Tạo `data/metaphors-database.json` (Biểu tượng: Ý nghĩa, gốc Cựu Ước, ứng nghiệm Đấng Christ, phân đoạn xuất hiện).
Tạo `data/genre-guides.json` (8 thể loại: Định nghĩa, phong cách nghệ thuật, nguyên tắc giải kinh, lỗi thường gặp).
Tạo `data/default-bible-passages.json` (Văn bản câu từng câu song song: BTT, BDM, BPT, BD2011, BHD, CGKPV, KJV, ESV, NIV, Interlinear kèm mã Strong's).
Tạo `data/visual-media-library.json` (Bản đồ thánh, ảnh khảo cổ, danh sách video The Bible Project tiếng Việt & Anh).
Tạo `data/default-articles.json` (Bài viết blog mẫu và các nhánh cộng đồng).

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_data_integrity.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add data/ tests/test_data_integrity.py && git commit -m "feat: curate complete theological datasets, metaphors and parallel scriptures"`

---

### Task 3: Quản Lý Trạng Thái & Lưu Trữ Đệm Ngoại Tuyến (State & Storage Engine)

**Files:**
- Create: `js/state.js`
- Create: `js/storage.js`
- Test: `tests/test_state_storage.py`

**Interfaces:**
- Consumes: JSON schemas từ `data/`.
- Produces: `AppState` (sách/chương/câu chọn, danh sách bản dịch kích hoạt, theme, role Admin/Guest, banner config), `LogosStorage` (IndexedDB wrap với Fallback LocalStorage).

- [ ] **Step 1: Viết test kiểm tra logic State & Storage**
Tạo file `tests/test_state_storage.py` kiểm tra các phương thức của `state.js` (chuyển chương, đổi bản dịch, chuyển theme, xác thực role) và logic lưu trữ dữ liệu.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_state_storage.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai js/state.js và js/storage.js**
Viết `js/state.js`: Triển khai Event-driven Reactive State với Subscriber pattern, lưu trữ bộ chọn bản dịch mặc định `['BTT', 'BDM', 'KJV', 'ESV']`, quản lý vai trò Admin/Guest.
Viết `js/storage.js`: Triển khai `LogosDB` trên nền IndexedDB cho dữ liệu lớn và `LocalStorage` cho preferences, bookmarks và admin banner settings.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_state_storage.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/state.js js/storage.js tests/test_state_storage.py && git commit -m "feat: implement reactive state manager and indexeddb offline storage"`

---

### Task 4: Bộ Máy Đối Chiếu Song Song & Điều Hướng Kinh Thánh (Parallel Bible Engine)

**Files:**
- Create: `js/bible-engine.js`
- Modify: `css/components.css`
- Test: `tests/test_bible_engine.py`

**Interfaces:**
- Consumes: `data/default-bible-passages.json`, `AppState`.
- Produces: `BibleEngine.renderChapter()`, `BibleEngine.getParallelVerses(book, chapter, verse)`, `BibleEngine.searchPassage(query)`.

- [ ] **Step 1: Viết test kiểm tra đối chiếu song song và căn chỉnh câu**
Tạo `tests/test_bible_engine.py` kiểm tra khả năng bóc tách câu, hiển thị các bản dịch theo hàng/cột, highlight từ ngữ khác biệt và tìm kiếm câu.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_bible_engine.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai js/bible-engine.js và CSS Components**
Xây dựng `BibleEngine`: Render văn bản chính trang nhã, gắn kèm icon `✦` cho từ khóa ẩn dụ, cho phép nhấp vào câu để kích hoạt Drawer Inspector.
Tích hợp thanh chọn đa bản dịch linh hoạt (checkboxes cho 10 bản dịch).
Bộ so sánh từ ngữ (Diff Highlighter) làm nổi bật từ dịch khác nhau giữa các bản dịch được chọn.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_bible_engine.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/bible-engine.js css/components.css tests/test_bible_engine.py && git commit -m "feat: implement multi-translation parallel engine and verse alignment"`

---

### Task 5: Bộ Máy Giải Nghĩa Ẩn Dụ & "Kinh Thánh Giải Nghĩa Kinh Thánh" (Hermeneutics & Cross-Reference Engine)

**Files:**
- Create: `js/hermeneutics-engine.js`
- Create: `js/crossref-engine.js`
- Test: `tests/test_hermeneutics.py`

**Interfaces:**
- Consumes: `data/metaphors-database.json`, `data/genre-guides.json`.
- Produces: `HermeneuticsEngine.getMetaphorDetails(id)`, `HermeneuticsEngine.getGenreGuide(genreId)`, `CrossRefEngine.getCrossReferences(verseRef)`.

- [ ] **Step 1: Viết test kiểm tra tra cứu ẩn dụ & liên kết TSK**
Tạo `tests/test_hermeneutics.py` kiểm tra kết quả tra cứu biểu tượng "Chiên con", "Cây nho", bối cảnh thể loại Thơ ca/Khải huyền và liên kết câu đối chiếu.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_hermeneutics.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai hermeneutics-engine.js và crossref-engine.js**
Render thẻ giải nghĩa chi tiết: Ý nghĩa thần học, nguồn gốc Cựu Ước, sự ứng nghiệm trong Chúa Giê-xu, bài học ứng dụng.
Render bảng quy chuẩn thể loại văn chương với các lưu ý giải kinh tránh giải nghĩa sai.
Xây dựng hệ thống câu đối chiếu chéo (Cross-References) có Quick Peek Tooltip khi rê chuột hoặc bấm xem nhanh.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_hermeneutics.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/hermeneutics-engine.js js/crossref-engine.js tests/test_hermeneutics.py && git commit -m "feat: implement hermeneutics, typology and scripture-interprets-scripture engines"`

---

### Task 6: Kho Media Trực Quan & Cổng Tri Thức Ngoại Vi (Visual Media & Knowledge Portals)

**Files:**
- Create: `js/media-engine.js`
- Modify: `index.html`
- Test: `tests/test_media_engine.py`

**Interfaces:**
- Consumes: `data/visual-media-library.json`.
- Produces: `MediaEngine.renderGallery(book, chapter)`, `MediaEngine.openVideoModal(videoId)`, `MediaEngine.getDeepLinks(verseRef)`.

- [ ] **Step 1: Viết test kiểm tra Media Engine và Video modal**
Tạo `tests/test_media_engine.py` kiểm tra ánh xạ hình ảnh, danh sách video The Bible Project và các liên kết ngoài tới BibleHub, StepBible, OpenBible.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_media_engine.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai js/media-engine.js**
Hiển thị bộ sưu tập ảnh bản đồ vệ tinh & hiện vật khảo cổ theo từng sách/chương.
Bộ phát video nhúng The Bible Project mượt mà, hỗ trợ phóng to toàn màn hình.
Thanh công cụ một chạm chuyển tiếp đến BibleHub (Strong's Greek/Hebrew) và StepBible.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_media_engine.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/media-engine.js tests/test_media_engine.py && git commit -m "feat: add visual media gallery, the bible project video embeds and external portals"`

---

### Task 7: Trợ Lý AI Thần Học & ChatGPT Assistant (Theological AI Copilot)

**Files:**
- Create: `js/ai-assistant.js`
- Modify: `css/components.css`
- Test: `tests/test_ai_assistant.py`

**Interfaces:**
- Consumes: Context câu/chương đang xem từ `AppState`.
- Produces: `AIAssistant.query(question, context)`, `AIAssistant.setApiKey(key)`, `AIAssistant.getSuggestedPrompts(verseRef)`.

- [ ] **Step 1: Viết test kiểm tra AI Assistant (Zero-Setup & Context Prompts)**
Tạo `tests/test_ai_assistant.py` xác minh bộ câu hỏi gợi ý nhanh theo chương, logic trả lời nội bộ và bộ xử lý API key an toàn.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_ai_assistant.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai js/ai-assistant.js**
Chế độ Zero-Setup: Tích hợp thư viện giải đáp thần học thông minh có sẵn cho hàng trăm câu hỏi kinh điển.
Chế độ OpenAI API: Kết nối trực tiếp GPT-4o nếu người dùng nhập API key, kèm hệ thống Prompt Thần Học chuẩn mực (tôn trọng chân lý Kinh Thánh, khách quan lịch sử).
Gợi ý 3 câu hỏi nhanh bám sát ngay câu đang chọn.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_ai_assistant.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/ai-assistant.js tests/test_ai_assistant.py && git commit -m "feat: implement theological AI study copilot and chatgpt integration"`

---

### Task 8: Banner Quản Trị, Blog Cá Nhân, Nhánh Cộng Đồng & Berea Guardian Agent (Community & Guardian System)

**Files:**
- Create: `js/blog-community.js`
- Create: `js/berea-guardian.js`
- Modify: `css/components.css`
- Test: `tests/test_community_guardian.py`

**Interfaces:**
- Consumes: `AppState.currentUserRole`, `data/default-articles.json`.
- Produces: `BlogSystem.renderArticles()`, `BlogSystem.submitCommunityPost(data)`, `AdminBanner.updateConfig(config)`, `BereaGuardian.inspectContent(text)`.

- [ ] **Step 1: Viết test kiểm tra bảo vệ bất biến (Zero-Tamper) và Berea Guardian Agent**
Tạo `tests/test_community_guardian.py` kiểm tra:
1. Guest không thể sửa/xóa bài viết chính thức hoặc đổi banner.
2. Admin xác thực mật khẩu có toàn quyền chỉnh sửa và bật/tắt banner.
3. Berea Guardian phát hiện từ khóa thô lỗ/xúc phạm và trả về thông điệp nhắc nhở Cô-lô-se 4:6.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_community_guardian.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Triển khai Admin Banner, Blog, Community Circles và Berea Guardian**
Phân hệ Banner Quản trị: Giao diện Modal Admin cho phép nhập tiêu đề, câu gốc tuần, link hành động, chọn màu (Gold/Crimson/Navy) và công tắc Bật/Tắt hiển thị.
Phân hệ Blog & Nhánh cộng đồng: Danh sách bài viết chuyên sâu của Tác giả (Read-Only với khách) và khu vực gửi bài viết suy ngẫm cho từng nhánh cộng đồng.
Phân hệ Chat học tập: Khung chat thời gian thực với tính năng trích dẫn `#Giang 3:16`.
Berea Guardian Agent: Lớp kiểm duyệt nội dung tự động, chặn hành vi lạm dụng, hiển thị thông báo nhã nhặn trích Lời Chúa gây dựng đức tin.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_community_guardian.py -v` (Kết quả: PASS).

- [ ] **Step 5: Commit**
`git add js/blog-community.js js/berea-guardian.js tests/test_community_guardian.py && git commit -m "feat: implement admin banner, blog, community branches and berea guardian agent"`

---

### Task 9: Tích Hợp Toàn Diện, Drawer Inspector & Tinh Chỉnh Thẩm Mỹ Hoàng Gia (Integration & Polish)

**Files:**
- Create: `js/app.js`
- Modify: `index.html`
- Modify: `css/layout.css`
- Modify: `css/components.css`
- Test: `tests/test_end_to_end.py`

**Interfaces:**
- Consumes: Tất cả các module (`BibleEngine`, `HermeneuticsEngine`, `MediaEngine`, `AIAssistant`, `BlogSystem`, `BereaGuardian`).
- Produces: Ứng dụng hoàn chỉnh, chạy 60fps mượt mà, đầy đủ 4 tab trong Drawer Inspector (Đối chiếu, Ẩn dụ, Kinh Thánh giải nghĩa Kinh Thánh, Bối cảnh & Thể loại), công tắc Dark/Parchment và Omni-Search.

- [ ] **Step 1: Viết test kiểm tra tích hợp toàn diện End-to-End**
Tạo `tests/test_end_to_end.py` mô phỏng đầy đủ luồng người dùng: Mở app, đọc chương, nhấp câu mở Drawer, đổi bản dịch, chuyển tab Ẩn dụ, xem video/bản đồ, gửi bình luận qua Berea Agent, và chuyển đổi Theme.

- [ ] **Step 2: Chạy test để xác nhận FAIL**
Chạy: `pytest tests/test_end_to_end.py -v` (Kết quả: FAIL).

- [ ] **Step 3: Viết js/app.js và hoàn thiện kết nối tất cả các phân hệ**
Khởi tạo Master Orchestrator, kết nối các sự kiện Click, Search, Drawer slide-in/out, Tabs navigation, Bookmark, Font scaling và Theme switching.

- [ ] **Step 4: Chạy test để xác nhận PASS**
Chạy: `pytest tests/test_end_to_end.py -v` (Kết quả: PASS 100%).

- [ ] **Step 5: Commit**
`git add js/app.js index.html css/ tests/test_end_to_end.py && git commit -m "feat: complete master app orchestration, drawer inspector and royal visual polish"`

---

### Task 10: Xác Minh Thực Tế Qua Trình Duyệt & Đóng Gói Triển Khai (Browser Verification & Delivery)

**Files:**
- Verify: Toàn bộ ứng dụng trong trình duyệt qua công cụ Browser Subagent / HTTP Local Server.
- Create: `README.md`
- Test: Chạy toàn bộ pytest suite bảo đảm 100% test pass.

- [ ] **Step 1: Chạy toàn bộ Pytest Suite**
Chạy `pytest tests/ -v` để bảo đảm 100% kiểm thử kỹ thuật vượt qua xuất sắc.

- [ ] **Step 2: Khởi động Local Server và kiểm tra trực quan trong Trình Duyệt**
Kiểm tra hiệu ứng giao diện, tương tác mở Drawer Inspector, đổi giao diện Dark/Parchment, kiểm tra Berea Agent, và tính năng Admin Banner.

- [ ] **Step 3: Soạn thảo tài liệu hướng dẫn sử dụng chuyên nghiệp (README.md)**
Hướng dẫn mở ứng dụng, cách đổi bản dịch, cách kích hoạt quyền Admin cấu hình Banner, cách kết nối ChatGPT API key và cách học Kinh Thánh theo thể loại.

- [ ] **Step 4: Commit và hoàn tất**
`git add README.md && git commit -m "docs: add comprehensive user manual and finalize release"`
