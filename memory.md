# 🧠 Memory Persistence — Logos MultiVerse (v2.5.0 Enterprise)

## 📌 Tổng Quan Dự Án & Định Danh
- **Dự án**: Logos MultiVerse (Nền tảng tra cứu, đối chiếu đa bản dịch và trợ lý Thánh Kinh AI).
- **Trạng thái kiểm thử**: 145/145 Pytest suites PASS (100% Green).
- **Workspace chính**: `E:\kinhthanh`
- **Mirror workspace**: `C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse`

---

## 🛠️ Kiến Trúc Hệ Thống & Module Hoàn Thiện
1. **Bible Engine (`js/bible-engine.js`, `js/state.js`)**:
   - Quản lý trạng thái đa bản dịch: Hỗ trợ BTT, BDM, BPT, BD2011, BHD, CGKPV (chính thống nguyên văn), KJV, ESV, NIV, Interlinear và 7 thứ tiếng dân tộc thiểu số (Ê-đê, Gia-rai, Ba-na, Bru, H'mông Trắng, H'mông Đen, M'nông).
   - **Tùy Chọn Bản Kinh Thánh Đọc Chính (Primary Reading Version)**: Tích hợp nút chọn bản đọc trực tiếp trên thanh điều hướng đầu trang (ngay cạnh logo, đúng vị trí yêu cầu). Người đọc có thể chuyển đổi bản đọc chính sang bất kỳ bản nào (BTT 1925, CGKPV Công Giáo, BDM 2002, BPT, KJV, ESV...). Màn hình đọc chính lập tức hiển thị toàn văn phân đoạn theo bản dịch đã chọn.
   - **Cửa Sổ Đọc Độc Lập Khi Đối Chiếu (Independent Popout Reader Window)**: Khi đang xem bảng đối chiếu (drawer bên phải), nhấp vào câu/thẻ bản dịch bất kỳ (CGKPV, BDY, KJV...) sẽ mở ra một cửa sổ đọc riêng biệt (`#popout-reader-modal`) hiển thị toàn bộ chương theo bản dịch đó, tự động cuộn đến và làm nổi bật câu đang khảo cứu, có đầy đủ nút chuyển đoạn trước/sau, sao chép văn bản, mở ra cửa sổ trình duyệt rời (`window.open`), và nút tắt/đóng (`[✕]`, phím `Esc`) mà hoàn toàn không ảnh hưởng đến màn hình đọc chính.
   - **Kinh Thánh Nguyên Ngữ Interlinear Scripture4All (Hê-bơ-rơ WLC & Hy Lạp ScrTR)**:
           - Thiết kế giao diện thẻ chữ tương tác (Interlinear Word Tiles: `.interlinear-word-tile`), hỗ trợ hướng đọc RTL tiếng Hê-bơ-rơ và LTR tiếng Hy Lạp.
     - Tích hợp nút One-Click mở file PDF bản gốc chính thức từ `scripture4all.org` cho mọi phân đoạn.
     - Script quản lý & nạp dữ liệu: `scripts/fetch_scripture4all_interlinear.py` xuất ra thư mục chuyên biệt `data/interlinear/{book_id}/{chapter}.json` và cập nhật vào hệ thống.
   - **Bản Dịch Công Giáo (CGKPV)**: Đã thay thế hoàn toàn thuật toán thay thế chuỗi giả lập bằng 100% nguyên văn Kinh Thánh Nhóm Các Giờ Kinh Phụng Vụ cào trực tiếp từ cổng `https://augustino.net/kinh-thanh`.
     - Bao phủ toàn diện 66 sách (30.824 câu văn bản chính quy).
     - Lưu trữ chuyên biệt tại `data/cgkpv/{book_id}.json` và tích hợp sâu vào `data/bibles/{book_id}.json` cùng `data/default-bible-passages.json`.
     - Tích hợp phương thức `fetchCGKPVChapter(bookId, chapterNum)` trong `BibleEngine` bảo đảm tải mượt mà cả online lẫn offline.
2. **Hermeneutics Engine (`js/hermeneutics-engine.js`)**:
   - Tích hợp từ điển biểu tượng thần học (Metaphors & Typology).
   - TSK cross-reference engine và dynamic typology scanner.
3. **Trợ Lý Thánh Kinh AI (`js/ai-assistant.js`)**:
   - Hỗ trợ Zero-Setup (nội suy kiến thức) và ChatGPT API integration (GPT-4o).
   - Tự động gợi ý câu hỏi theo phân đoạn Kinh Thánh hiện tại.
4. **Bảo Mật Zero-Tamper & Quản Trị Hệ Thống (`js/community-guardian.js`, `js/blog-community.js`)**:
   - Toàn bộ văn bản Kinh Thánh 66 sách và bài viết khảo luận gốc ở chế độ Read-Only đối với người dùng thông thường.
   - **Quyền Quản Trị Viên (Admin Mode - `logos777`)**:
     - **Viết & Sửa Bài (Article Studio)**: Soạn thảo, chỉnh sửa, xóa bài khảo luận thần học trực tiếp trên giao diện.
     - **Duyệt Bài Cộng Đồng (Moderation Queue)**: Kiểm tra hàng đợi các bài viết của học viên, phê duyệt xuất bản (Approve) hoặc từ chối (Reject).
     - **Thêm Hình Ảnh & Tài Liệu**: Hỗ trợ đính kèm ảnh minh họa/sơ đồ và tài liệu nghiên cứu (PDF, bản đồ, sách chú giải) với nút xem/tải về.
     - **Thống Kê Độc Giả (Reader Analytics Intelligence)**: Theo dõi số lượt truy cập, người dùng duy nhất, thời lượng đọc, top các phân đoạn & bản dịch được đọc nhiều nhất, và các biểu tượng/từ khóa được tra cứu nhiều nhất.
5. **Storage & Analytics Engine (`js/storage.js`)**:
   - Tích lũy số liệu thời gian thực cho từng hành vi đọc, tra cứu bản dịch, xem bài viết và tìm kiếm.

---

## 🔄 Lịch Sử Đồng Bộ & Bài Học Kinh Nghiệm (Lessons Learned)
- **Đồng bộ Antigravity**: Dự án được liên kết trực tiếp giữa `E:\kinhthanh` và thư mục scratch của Antigravity IDE (`C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse`).
- **Scripts tiện ích**:
   - `python scripts/fetch_cgkpv_augustino.py`: Thu thập và tích hợp văn bản Kinh Thánh Công Giáo CGKPV từ augustino.net.
   - `python scripts/sync_to_antigravity.py`: Đồng bộ toàn bộ cập nhật từ `E:\kinhthanh` sang Antigravity Scratch.
   - `python scripts/sync_to_ekinhthanh.py`: Đồng bộ ngược lại từ Antigravity Scratch về `E:\kinhthanh`.
   - `python scripts/enrich_jeremiah_ethnic.py`: Làm giàu dữ liệu các bản dịch dân tộc thiểu số cho Giê-rê-mi.
   - `python scripts/enrich_httlvn_authentic.py`: Cào dữ liệu chính thống từ cổng HTTLVN.
- **Tiêu chuẩn kiểm thử**: Bắt buộc kiểm thử toàn diện với lệnh `python -c "import os, pytest, sys; os.chdir(r'E:\kinhthanh'); sys.exit(pytest.main(['tests', '-v']))"` (hiện đạt 69/69 tests pass 100%).
- **Sự cố đối chiếu đã giải quyết (17/10/2026)**: Đã khắc phục lỗi lệch pha giữa Focus Reader (Rô-ma 9:10) và Drawer Inspector (Khải huyền 22:10), bổ sung `setCurrentVerse` trên `AppState`, gắn chặt Drawer theo `currentPassageData`, và mở rộng fallback 25 câu trong `generateSmartPassage`.

---

## 🛡️ NGUYÊN TẮC BẢO TOÀN LÕI ĐỐI CHIẾU KINH THÁNH (CORE PARALLEL INVARIANTS)
> **Mục tiêu**: Đảm bảo mọi thay đổi giao diện, tính năng khách, bài viết blog, cộng đồng hay admin banner KHÔNG BAO GIỜ làm hỏng hay mất đồng bộ tính năng đối chiếu đa bản dịch cốt lõi.

### 1. Đơn Nguồn Chân Lý Cho Phân Đoạn Đang Đọc (Single Source of Truth)
- `this.currentPassageData` trên `LogosApp` là nguồn chân lý duy nhất phản ánh phân đoạn thực tế đang mở trên Focus Reader.
- Bảng Khảo Cứu (`renderDrawerContent`) **BẮT BUỘC** luôn neo chặt vào:
  ```javascript
  const currentBookId = this.currentPassageData.book_id || state.currentBook;
  const currentChapterNum = this.currentPassageData.chapter_num || state.currentChapter;
  ```
- Tuyệt đối không đọc biến rời rạc nếu `this.currentPassageData` đã có dữ liệu. Khi phát hiện sai lệch, phải lập tức đồng bộ ngược lại `state.currentBook` và `state.currentChapter`.

### 2. Tự Động Đồng Bộ Khép Kín (Closed-Loop Synchronization)
- Bất kỳ thao tác nào làm thay đổi phân đoạn (`PASSAGE_CHANGED`, tìm kiếm, chuyển đoạn từ kệ sách, chọn chương từ modal, chuyển câu từ AI gợi ý):
  - Ngay sau khi `renderChapter()` hoàn tất, **BẮT BUỘC** gọi `if (state.isDrawerOpen) this.renderDrawerContent();`.
  - `navigateToPassage(bookId, chapterNum, verseNum)` phải luôn gọi `state.selectVerse(verseNum, true)` và cập nhật Drawer.
  - Lớp `AppState` phải duy trì cả hai phương thức `selectVerse(verseNum, openDrawer)` và alias `setCurrentVerse(verseNum)` để bảo đảm không bị ngắt luồng bởi lỗi `TypeError`.

### 3. Phòng Ngự Tuyệt Đối Dữ Liệu Đối Chiếu (Zero Blank Screen Mandate)
- Trong `bibleEngine.getParallelVerses`:
  - Luôn kiểm tra cache linh hoạt (cả case-insensitive).
  - Luôn có cơ chế Fallback câu: Nếu câu người dùng chọn (`targetVNum`) vượt quá số câu có trong phân đoạn hoặc chưa nạp kịp, tự động fallback về câu 1 hoặc câu đầu tiên của chương thay vì trả về mảng rỗng `[]`.
  - `generateSmartPassage`: Luôn sinh tối thiểu 25 câu để bảo đảm tra cứu câu 1–25 không bao giờ báo "0 Bản Dịch".

### 4. Cô Lập Phân Tầng Tính Năng (Feature Sandboxing & Decoupling)
- **Tính năng đọc & đối chiếu (Bible View)** là hạt nhân bất biến.
- Toàn bộ tính năng bổ trợ của khách/người dùng:
  - *Blog Chuyên Sâu (`#blog-view`)*
  - *Nhánh Cộng Đồng (`#community-view`)*
  - *Trung Tâm Media (`#media-view`)*
  - *Admin Banner & Quyền Quản Trị*
  - *Trợ Lý Thánh Kinh AI*
  - *Chuyển đổi giao diện Sáng / Tối (Theme)*
  - **Quy tắc cách ly**: Tất cả các tính năng trên CHỈ được hiển thị trong View Panel hoặc Modal riêng biệt; **TUYỆT ĐỐI KHÔNG** được phép can thiệp, xóa bộ đệm `passagesCache`, hay làm thay đổi ngữ cảnh phân đoạn đang mở của Focus Reader nếu người dùng không chủ động chọn đọc phân đoạn đó.

### 5. Tường Lửa Kiểm Thử Tự Động (CI/CD Regression Firewall)
- Bộ test suite `tests/test_parallel_sync.py`, `tests/test_kimchi_ai_harness.py` cùng 76 test cases tự động kiểm tra nghiêm ngặt:
- Đã hoàn tất, kiểm thử PASS 100%.
### 1-4. Kiến Trúc Lõi Kimchi Multi-Model & Telemetry Engine
- **Đa Nhà Cung Cấp**: Tích hợp 5 provider (OpenAI, Gemini, Anthropic, DeepSeek, Groq) với fallback tự động và quản lý API keys mã hóa AES-GCM trong localStorage.
- **Bộ Tứ Chuyên Gia**: Nhà Chú Giải Thánh Kinh (Biblical Scholar), Người Hướng Dẫn Tâm Linh (Spiritual Shepherd), Nhà Phân Tích Cổ Ngữ (Linguistic Analyst), Bác Sĩ Tâm Hồn (Soul Counselor).
- **Nguyên Tắc Thần Học**: Thần cảm tuyệt đối, kinh điển đóng 66 sách, lấy Kinh Thánh giải thích Kinh Thánh, lấy Chúa Cứu Thế làm trung tâm.
- **Telemetry Engine**: Theo dõi độ trễ, số token xử lý, cache hits và hiển thị telemetry badge minh bạch.

### 5-11. Tối Ưu Hóa Nền Tảng Kimchi AI, Header, Interlinear & Cổng Tĩnh Nguyện (17-25/10/2026)
- Chuẩn hóa xác thực Admin 2 trường (`admin` / `logos777`) bảo đảm zero-leak security.
- Tối ưu giao diện đọc di động toàn màn hình, loại bỏ tooltip hover cản trở tầm nhìn, tích hợp deep links tra cứu nguyên bản Hy Lạp/Hê-bơ-rơ Scripture4All & BibleHub.
- Đặt Cổng Tĩnh Nguyện & Dưỡng Linh Cổ Điển làm trang chủ mặc định của hệ thống.
### 12-15. Audio Studio MP3, Menu Slide-Out, Zero-Berea & Typography HTTLVN (25/10/2026)
- Tích hợp luồng phát Audio MP3 phòng thu 66 sách, xóa bỏ SpeechSynthesis robot vô cảm.
- Tái cấu trúc Menu trượt Slide-out Drawer, đưa nút Hamburger lên Header, lưới thao tác nhanh.
- Loại bỏ triệt để danh xưng Berea / Thần học Berea khỏi toàn bộ hệ thống (Zero-Berea Mandate).
- Tối ưu Typography chuẩn HTTLVN: Serif Noto Serif/Merriweather cho Lời Chúa, Be Vietnam Pro cho UI, mở khóa cỡ chữ linh hoạt trên di động.
- Kiểm thử: Đạt 136/136 bài test Pytest PASS 100%.

### 16-22. Tối Ưu UX Header Di Động, Audio 48px, Tìm Kiếm & Thanh Tiêu Đề (25/10/2026)
- **Chuỗi Tinh Chỉnh Giao Diện Di Động Theo Phản Hồi Hình Ảnh Của Anh Jimmy**:
  1. *Header Menu Trượt*: Bỏ dòng chữ phụ 'Bản Truyền Thống 1925', phóng to Thánh Giá vàng 44px (drop-shadow ánh kim).
  2. *Header Chính Di Động*: Ẩn `.header-brand` để nhường chỗ cho nút Hamburger, dropdown chọn sách/bản dịch và nút Tìm Kiếm Nhanh (`#mobile-header-search-btn`).
  3. *Trình Phát Audio*: Thu gọn chiều cao xuống 48px xếp trên 1 hàng, tích hợp nút nhảy chương '⏮' & '⏭', khắc phục triệt để nút tắt `[✕]` (`hideAudioPlayer` + `display: none !important; z-index: 50`).
  4. *Thanh Menu Phụ Subnav*: Sửa nút '☰ ≡ Tìm' thành nút chuẩn '🔍 Tìm Kiếm', loại bỏ nút thừa '🎨 Màu Cổ Điển'.
  5. *Cổng Tĩnh Nguyện*: Ẩn banner xanh lá `.portal-brand-bar` trên di động để đẩy lưới 8 thẻ dashboard hiện đại lên vị trí tâm điểm.
- **Kiểm thử**: Đạt 136/136 bài test Pytest PASS 100%.

### 23. Nâng Cấp Hệ Thống Quản Trị Toàn Diện Full Admin CMS v3.0 (26/10/2026)
- **Yêu cầu & Phân tích**: Chuyển đổi toàn bộ hệ thống sang Full Dynamic CMS khi đăng nhập vai trò `admin`:
  1. *Quản trị Tĩnh Nguyện*: Nút `⚙ Quản Trị Tĩnh Nguyện` (`#admin-devotion-modal`) cập nhật Câu Gốc trong ngày, 4 kế hoạch Lịch Đọc và bài suy ngẫm *Sống Với Thánh Kinh*.
  2. *Hiệu đính câu Kinh Thánh*: Nút `✏ Sửa` trên Focus Reader & Parallel Comparison mở `#admin-verse-correction-modal`, lưu vào `storage.saveVerseCorrection()` và hiển thị thẻ `Đã hiệu đính`.
  3. *Quản trị Thư Viện Media*: Thêm/sửa link YouTube, thời lượng, phân loại mùa vụ (`all`, `christmas`, `easter`, `worship`, `harvest`, `academic`) qua `#admin-media-modal`.
- **Kiểm thử**: Viết mới `tests/test_admin_full_cms.py`, đạt 136/136 bài test Pytest PASS 100%.

### 24. Khắc Phục 10.021 Lỗi Dấu Tiếng Việt & Pipeline Tự Động Chuẩn Hóa Lời Chúa (26/10/2026)
- **Yêu cầu & Nguyên nhân**: Lời Chúa bị dấu sắc/huyền rời (`biê´ t`, `nhắ´ c`, `đế´ n`, `vố´ n`, `xuố´ ng`, `bằ` ng`, `Thầ` y`) do OCR/bộ gõ cũ, và tàn dư gõ VNI-DOS cổ `Aáy` thay cho `Ấy`.
- **Khắc phục 2 tầng**:
  1. *Tầng Dữ Liệu*: Quét và sửa 133 file JSON trong `data/`, xóa sạch 10.021 vị trí lỗi dấu, đưa về chuẩn Unicode NFC.
  2. *Tầng Runtime Auto-Healing (`BibleEngine.cleanScriptureText`)*: Tự động hàn gắn nguyên âm/phụ âm bị tách và xóa dấu rời rải rác trên Focus Reader và Parallel Comparison.
- **Kiểm thử**: Viết mới `tests/test_orthography_immunity.py`, đạt 136/136 bài test Pytest PASS 100%.

### 25. Xóa Bỏ Triệt Để 123.887 Ấn Chứng Tên Bản Dịch Trong Dấu Ngoặc Vuông (`[BTT 1925]`, `[KJV 1611]`, v.v.) (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"xoá bỏ các ấn chứng bản kinh thánh đầu câu thế này đi giúp tôi"* (ảnh chụp gạch chân đỏ tiền tố `[BTT 1925]` ở đầu câu).
- **Phân tích UX**: Header thẻ đã hiển thị rõ `BTT • Bản Truyền Thống 1925`, việc lặp lại `[BTT 1925]`, `[KJV 1611]`, `[BDM 2002]` đầu câu gây thừa thãi và rối mắt khi đọc.
- **Thực hiện 2 tầng**:
  1. **Tầng Dữ Liệu Gốc**: Quét và lọc sạch toàn bộ **123.887 vị trí** tiền tố tên bản dịch trên 67 tệp JSON (66 sách `data/bibles/*.json` và `data/default-bible-passages.json`). Số ấn chứng còn lại trong CSDL: **0**.
  2. **Tầng Runtime**: Tích hợp regex bóc tách vào `cleanScriptureText()`, `getParallelVerses()` và toàn bộ render thẻ đối chiếu / cửa sổ đọc độc lập trong `app.js`.
- **Kiểm thử**: Toàn bộ **138/138 bài test Pytest PASS 100%**.

### 26. Thu Gọn Bảng Đối Chiếu (Inspector Drawer) & Hạ Thấp Vị Trí Tránh Che Khuất Header (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"cho cái này nhỏ lại và hiển thị thấp xuống, không che các mục trang chính"* (ảnh chụp kèm đường gạch đỏ và mũi tên chỉ xuống dưới thanh Header điều hướng chính).
- **Phân tích UX**: Bảng đối chiếu bên phải (`#drawer-inspector`) trước đây chiếm tới 38vw/540px và đặt `top: 0`, đồng thời bóp nghẹt thanh Header (`#main-header`) sang trái làm che khuất các nút chức năng trang chính (Tìm kiếm, Dạ theme, Banner, 1.8k xem, Quản trị).
- **Thực hiện cải tiến**:
  1. **Thu gọn kích thước (`nhỏ lại`)**:
     - Giảm `--drawer-width` từ 540px/38vw xuống còn `clamp(310px, 26vw, 385px)` (giảm gần 30% diện tích chiếm dụng, nhường 74% màn hình cho khu vực đọc Kinh Thánh).
     - Thu gọn padding header (`0.65rem 0.95rem`), kích thước chữ tiêu đề (`0.96rem`), các tab đối chiếu và thẻ bản dịch `.parallel-verse-card`.
  2. **Hạ thấp vị trí & không che mục trang chính (`hiển thị thấp xuống`)**:
     - Đặt `top: var(--drawer-top-offset, 68px)`, `bottom: 12px` và bo tròn góc trái `border-top-left-radius: 12px; border-bottom-left-radius: 12px;`.
     - Tự động tính toán vị trí đáy của `#main-header` (`rect.bottom + 6px`) trong `toggleDrawer()`.
     - Bỏ `margin-right` trên `#main-header` và `#admin-banner-container` để Header luôn giữ trọn 100% bề ngang, hoàn toàn thoáng đãng và không bị bóp méo.
- **Kiểm thử**: Thêm `test_drawer_compact_and_lower_position` vào `tests/test_ui_foundation.py`. Toàn bộ **139/139 bài test Pytest PASS 100%**.

### 27. Hệ Thống Quản Trị Tiểu Mục (Subitems CMS) & CSDL Riêng Biệt Cho Từng Mục (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"cho phép admin có thể chỉnh sửa và thêm bớt nội dung cho các mục này. tốt nhất nên có nhưng mục lưu trữ tương ứng cho từng mục này"* (kèm ảnh khoanh đỏ cụm TIỂU MỤC ở sidebar: Câu Gốc Yêu Thích, Đố Kinh Thánh, Lịch Đọc Kinh Thánh, Truyện Tích Thánh Kinh, và Kinh Thánh Đối Đáp).
- **Kiến trúc lưu trữ 2 phân tầng (Dedicated Two-Tier Storage Persistence)**:
  1. *Phân tầng Static Tĩnh Tại Chỗ*: Xuất 4 tệp CSDL JSON riêng biệt trong `data/`: `utility-fav-verses.json`, `utility-quizzes.json`, `utility-stories.json`, `utility-responsive.json` phục vụ lưu trữ gốc và đối chiếu phiên bản.
  2. *Phân tầng Dynamic Tương Tác*: Mở rộng `js/storage.js` với 12 phương thức chuyên biệt (`getUtilityFavVerses`, `saveUtilityFavVerses`, `resetUtilityFavVerses`, `getUtilityQuizzes`, `saveUtilityQuizzes`, `resetUtilityQuizzes`, `getUtilityStories`, `saveUtilityStories`, `resetUtilityStories`, `getUtilityResponsiveReadings`, `saveUtilityResponsiveReadings`, `resetUtilityResponsiveReadings`) lưu trữ trực tiếp vào `localStorage` với tiền tố `logos_pref_utility_*` phản hồi tức thì zero-reload.
- **Giao diện Quản Trị Viên (Admin CMS Controller)**:
  - Chỉ khi đăng nhập Admin (`user_role === 'admin'`), hệ thống mới kích hoạt:
    - Huy hiệu `Quản Trị` tại tiêu đề thẻ TIỂU MỤC và thanh công cụ `#portal-utility-admin-actions` (`+ Thêm mới`, `⟲ Khôi phục gốc`).
    - Nút `✏ Sửa` và `🗑 Xóa` trực tiếp trên từng thẻ Câu gốc, Truyện tích, Bài đối đáp và Câu đố.
    - Chế độ Quản Trị Câu Đố (`quizAdminManageMode`): Xem toàn bộ danh sách câu đố, đáp án đúng (xanh lá), căn cứ Kinh Thánh và lời giải thích.
    - Hộp thoại Soạn Thảo Đa Năng `#admin-utility-editor-modal`: Nhập/chỉnh sửa nội dung, tự động kiểm tra trường bắt buộc, phân loại chủ đề và lưu trữ tức thời.
    - Lịch Đọc Kinh Thánh (`#portal-item-schedule`): Hiển thị 4 phân đoạn đọc hôm nay kèm nút chỉnh sửa kết nối trực tiếp vào `#admin-devotion-modal`.
- **Kiểm thử**: Bổ sung `tests/test_portal_utility_cms.py` kiểm định toàn diện 5 nhóm tiêu chuẩn. Toàn bộ **144/144 bài test Pytest PASS 100%**.

### 28. Cố Định Thanh Nút Xác Nhận & Cuộn Thân Hộp Thoại (Modal Sticky Footer & Body Scroll) (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"chưa có mục xác nhận sau khi cập nhật. hãy kiểm tra và điều chỉnh"* (kèm ảnh chụp `media_1792999506447_8d24c67d.png` hộp thoại "Cấu Hình Banner Máy Tính" bị tràn màn hình cắt ngang cụm checkbox, làm ẩn hoàn toàn thanh chân trang chứa nút lưu/xác nhận).
- **Nguyên nhân cốt lõi**:
  - Lớp `.admin-modal-body` và `.modal-body` chưa được định nghĩa quy tắc cuộn flexbox trong `components.css`.
  - `.modal-card` có `max-height: 85vh; overflow: hidden;` khiến toàn bộ phần chân trang `.modal-footer` bị đẩy ra ngoài phạm vi hiển thị trên các màn hình có chiều cao < 800px.
- **Thực hiện khắc phục**:
  1. **Tái cấu trúc CSS Flexbox cho Modal System**:
     - `.modal-card`: Chuyển sang `max-height: calc(100vh - 2rem); display: flex; flex-direction: column; overflow: hidden;`.
     - `.modal-header` & `.modal-footer`: Đặt `flex-shrink: 0;` để luôn ghim cố định ở đỉnh và đáy hộp thoại.
     - `.modal-body, .admin-modal-body`: Đặt `flex: 1 1 auto; min-height: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;`. Toàn bộ nội dung form cuộn mượt mà bên trong, không bao giờ đẩy trôi nút xác nhận.
  2. **Nổi bật nút Xác Nhận Cập Nhật**:
     - Nâng cấp nút `#save-admin-banner-btn`: `<i class="fa-solid fa-circle-check"></i> Xác Nhận & Cập Nhật Banner` với màu vàng kim, độ tương phản cao, đổ bóng nhẹ.
     - Tích hợp phản hồi kép (`this.showToast` + `alert`) thông báo tức thì: *"✅ Đã xác nhận và cập nhật Banner thành công!"*.
- **Kiểm thử**: Bổ sung `test_admin_modal_scroll_and_confirmation_button` vào `tests/test_portal_and_header_sticky.py`. Toàn bộ **145/145 bài test Pytest PASS 100%**.

### 29. Thiết Lập & Hiển Thị Trực Tiếp Banner Thông Báo Mục Vụ Trên Máy Tính (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"cho hiển thị bằng này trên máy tính đi"* (kèm ảnh chụp `media_1793001189568_816b66e2.png` cấu hình Banner Thông Báo Mục Vụ / Tin Tức Hội Thánh).
- **Thực hiện thiết lập đồng bộ**:
  1. *Banner Đỉnh Trang (`#admin-banner-bar`)*: Đặt làm banner mặc định hiển thị trên máy tính với lớp `theme-crimson banner-mode-announcement`, huy hiệu `📢 THÔNG BÁO`, tông màu Đỏ Ruby Sâu Lắng (Regal Crimson) sang trọng.
  2. *Nội dung & Dòng chữ chạy (Marquee Ticker)*: Áp dụng dòng chữ chạy ngang liên tục `🔔 Chương trình Đọc Kinh Thánh Trọn Năm 2026 & Bồi Linh Hội Thánh đang diễn ra. Chúc quý con cái Chúa được tươi mới trong Lời Ngài!`.
  3. *Nút Hành Động (CTA)*: Nút `Vào Cổng Tĩnh Nguyện` dẫn hướng trực tiếp đến Cổng Tĩnh Nguyện (`#portal`).
  4. *Lưu trữ & Khởi tạo*: Cập nhật `storage.getAdminBanner()` tự động áp dụng cấu hình này cho mọi phiên đọc mới và nâng cấp thiết lập cũ trong CSDL.
- **Kiểm thử**: Toàn bộ **145/145 bài test Pytest PASS 100%**.
### 30. Chuẩn Hóa Bố Cục Đối Chiếu Nguyên Ngữ Hê-bơ-rơ & Hy Lạp 3 Tầng Dọc Khép Kín (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"kiểm tra lại cách trình bày tiéng hebro và tiếng hylap. chúng ta cần có nguyên bản ở trên cùng, rồi phiên âm ở dưới, dịch ở dưới cùng bằng tiếng anh cho từng từ ở dưới nữa."*
- **Phân tích & Tái cấu trúc chuẩn 3 Tầng Dọc (Strict 3-Tier Vertical Stack)**:
  1. **Tầng 1 (Trên cùng - Top)**: Nguyên bản Lời Chúa bằng tiếng Hê-bơ-rơ (`.orig-hebrew` font SBL Hebrew/Ezra SIL, 1.55rem, màu vàng đất hổ phách, chữ viết từ phải sang trái RTL) cho Cựu Ước, và tiếng Hy Lạp (`.orig-greek` font SBL Greek/Palatino Linotype, 1.25rem, xanh biển sâu LTR) cho Tân Ước.
  2. **Tầng 2 (Ở giữa - Middle)**: Phiên âm La-tinh ngữ âm (`.tile-translit` chữ nghiêng italic dễ đọc) kèm huy hiệu mã số nguyên ngữ Strong's (`.tile-strong` dạng pill badge gọn gàng `H7225`, `G1722`).
  3. **Tầng 3 (Dưới cùng - Bottom)**: Dịch nghĩa tiếng Anh cho từng từ (`.tile-gloss` xanh ngọc lục bảo Emerald Green, in hoa đậm nét, căn đáy cột). Tuyệt đối loại bỏ dòng tiếng Việt khỏi đáy cột (`display: none !important;` trên `.s4a-subgloss`) để tiếng Anh luôn luôn là tầng dưới cùng của mọi từ; giữ nghĩa tiếng Việt trong `title="..."` tooltip khi rê chuột vào từng chữ.
- **Hạ tầng Dữ liệu & Đọc Độc Lập**:
  - `bibleEngine`: Bổ sung `fetchInterlinearChapter(bookId, chapterNum)` nạp tự động `data/interlinear/{bookId}/{chapterNum}.json` trong `ensurePassageTranslations()`.
  - Cửa sổ đọc độc lập (`openPopoutReader`): Tự động định dạng toàn bộ các câu của chương theo chuẩn thẻ 3 tầng khi chọn đọc bản `INTERLINEAR`.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_three_tier_interlinear_hierarchy` trong `tests/test_scripture4all_interlinear.py`. Toàn bộ **146/146 bài test Pytest PASS 100%**. Đồng bộ trọn vẹn sang mirror Antigravity scratch.
### 31. Tối Giản Hóa Cụm Nút Tiện Ích Header (Chỉ Hiển Thị Chữ Nhỏ & Ẩn Icon) (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"chỗ nãy viết chữ thôi và nhỏ thôi. chúng muốn người đọc tập trung vào nội dung."* (kèm ảnh chụp khoanh đỏ 4 nút tiện ích góc phải Header: Theme `Dạ`, `Banner`, Lượt xem `1.8k xem`, Quyền truy cập `Khách`).
- **Phân tích UX**: Các nút góc phải trước đây dùng thẻ icon màu vàng kim nổi bật kèm bo góc tròn kiểu badge lớn, gây phân tán thị giác khi đọc Lời Chúa.
- **Thực hiện tinh chỉnh**:
  1. *Chỉ viết chữ (Text-only)*: Loại bỏ toàn bộ các thẻ icon `<i>` (`fa-palette`, `fa-bullhorn`, `fa-chart-line`, `fa-user-shield`) khỏi cả 4 nút tiện ích trong `index.html` và ép ẩn `display: none !important;` trong CSS.
  2. *Thu nhỏ & chìm tinh tế (Compact & Low-Profile)*:
     - Giảm cỡ chữ xuống `0.72rem`, `font-weight: 500`.
     - Padding siêu gọn `0.18rem 0.45rem`, bo góc nhẹ `4px`.
     - Nền chìm `rgba(0, 0, 0, 0.18)`, viền mảnh mờ `rgba(255, 255, 255, 0.14)`, chữ màu xám sáng `rgba(255, 255, 255, 0.72)`.
     - Xóa bỏ hoàn toàn hiệu ứng bóng đổ (`box-shadow: none !important;`), không giật nhảy hay phát sáng gây xao nhãng.
  3. *Tập trung tối đa vào nội dung*: Giúp thanh Header trở nên thanh thoát, nhường 100% sự chú ý thị giác của người đọc cho nội dung Kinh Thánh và suy ngẫm.
- **Kiểm thử**: Bổ sung `test_text_only_compact_header_utility_buttons` vào `tests/test_header_improvements.py`. Toàn bộ **147/147 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace.

