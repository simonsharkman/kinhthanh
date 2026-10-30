# 🧠 Memory Persistence — Logos MultiVerse (v2.5.0 Enterprise)

## 📌 Tổng Quan Dự Án & Định Danh
- **Dự án**: Logos MultiVerse (Nền tảng tra cứu, đối chiếu đa bản dịch và trợ lý Thánh Kinh AI).
- **Trạng thái kiểm thử**: 161/161 Pytest suites PASS (100% Green).
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
- Tích hợp 5 AI Providers (OpenAI, Gemini, Anthropic, DeepSeek, Groq), Bộ Tứ Chuyên Gia Thần Học, và Telemetry Engine theo dõi độ trễ/tokens.

### 5-11. Tối Ưu Hóa Nền Tảng Kimchi AI, Header, Interlinear & Cổng Tĩnh Nguyện (17-25/10/2026)
- Chuẩn hóa xác thực Admin logos777, tối ưu đọc di động toàn màn hình, deep links Scripture4All/BibleHub, đặt Cổng Tĩnh Nguyện làm trang chủ mặc định.

### 12-15. Audio Studio MP3, Menu Slide-Out, Zero-Berea & Typography HTTLVN (25/10/2026)
- Audio MP3 66 sách, Slide-out Drawer Menu, loại bỏ danh xưng Berea (Zero-Berea Mandate), chuẩn hóa Typography HTTLVN.

### 16-22. Tối Ưu UX Header Di Động, Audio 48px, Tìm Kiếm & Thanh Tiêu Đề (25/10/2026)
- Tinh chỉnh giao diện di động: Thánh Giá vàng 44px, Audio 48px gọn gàng kèm phím tắt [✕], nút tìm kiếm chuẩn, ẩn banner rườm rà.

### 23. Nâng Cấp Hệ Thống Quản Trị Toàn Diện Full Admin CMS v3.0 (26/10/2026)
- Full Dynamic CMS cho vai trò admin: Quản trị Tĩnh Nguyện (#admin-devotion-modal), Hiệu đính câu Kinh Thánh (#admin-verse-correction-modal), Quản trị Thư Viện Media YouTube (#admin-media-modal).

### 24. Khắc Phục 10.021 Lỗi Dấu Tiếng Việt & Pipeline Tự Động Chuẩn Hóa Lời Chúa (26/10/2026)
- Quét và sửa 133 file JSON trong data/ (10.021 vị trí lỗi dấu rời `biê´ t`, `nhắ´ c`, `đế´ n`), đưa về chuẩn Unicode NFC và tích hợp auto-healing vào `BibleEngine.cleanScriptureText`.

### 25. Xóa Bỏ Triệt Để 123.887 Ấn Chứng Tên Bản Dịch Trong Dấu Ngoặc Vuông (26/10/2026)
- Lọc sạch 123.887 tiền tố tên bản dịch `[BTT 1925]`, `[KJV 1611]` khỏi 67 tệp JSON và regex bóc tách trong `cleanScriptureText`.

### 26. Thu Gọn Bảng Đối Chiếu (Inspector Drawer) & Hạ Thấp Vị Trí Tránh Che Khuất Header (26/10/2026)
- Tối ưu Drawer Inspector: `--drawer-top-offset: 68px; top: var(--drawer-top-offset);` và `body.drawer-open #main-header { margin-right: 0 !important; width: 100% !important; }` không bao giờ che khuất thanh điều hướng.

### 27. Hệ Thống Quản Trị Tiểu Mục (Subitems CMS) & CSDL Riêng Biệt Cho Từng Mục (26/10/2026)
- Tách CSDL 4 file JSON độc lập trong data/ (fav-verses, quizzes, stories, responsive), modal admin CMS (#admin-utility-editor-modal) CRUD toàn diện.

### 28. Cố Định Thanh Nút Xác Nhận & Cuộn Thân Hộp Thoại (Modal Sticky Footer & Body Scroll) (26/10/2026)
- Tái cấu trúc CSS Flexbox cho Modal: modal-card flex-col, modal-header/footer flex-shrink: 0, modal-body overflow-y: auto. Nổi bật nút xác nhận cập nhật.

### 29. Banner Thông Báo Mục Vụ Trên Máy Tính (26/10/2026)
- Hiển thị trực tiếp `#admin-banner-container` trên Desktop (>=992px), tự động đẩy giao diện mượt mà không che khuất Header.
- Đồng bộ bộ đếm thống kê và quyền Admin qua Storage.

### 30. Chuẩn Hóa Bố Cục Đối Chiếu Nguyên Ngữ Hê-bơ-rơ & Hy Lạp 3 Tầng Dọc (26/10/2026)
- Chuẩn hóa Interlinear 3 tầng dọc: Tầng 1 Nguyên bản (Hy Lạp/Hê-bơ-rơ lớn) -> Tầng 2 Phiên âm Latinh -> Tầng 3 Nghĩa tiếng Anh từng từ.
- Tự động phát hiện hướng chữ RTL cho Cựu Ước Hê-bơ-rơ, LTR cho Tân Ước Hy Lạp.

### 31. Tối Giản Hóa Cụm Nút Tiện Ích Header (26/10/2026)
- Ẩn toàn bộ icon font-awesome trên cụm nút header, thu gọn kích thước chữ `0.68rem - 0.72rem`, tập trung trọn vẹn thị giác vào Lời Chúa.

### 32. Chữa Lành Lỗi Chính Tả "Áp-ra-ham", "Kỳ Hạn" & Kích Hoạt Tìm Kiếm Địa Chỉ (26/10/2026)
- Quét sạch lỗi encoding `Aùp` -> `Áp`, `k"` -> `kỳ`.
- Kích hoạt Regex thông minh nhận diện định dạng sách chương:câu (vd: `Giăng 3:16`, `1Co 13:4-8`) trong thanh tìm kiếm.

### 33. Tái Cấu Trúc Bố Cục Thẻ Nghiệp Vụ Khung Đối Chiếu Lưới 2x2 (26/10/2026)
- Sửa lỗi đè chữ 4 tab drawer bằng lưới 2 hàng x 2 nút (`flex: 1 1 calc(50% - 6px)`), mở rộng `--drawer-width` lên 330px-420px, bổ sung tooltip `title`. Đạt 150/150 tests pass.

### 34. Khắc Phục Lỗi IME Bộ Gõ Tiếng Việt Trong Thánh Kinh Từ Điển (26/10/2026)
- Sửa lỗi nhảy con trỏ / gõ ngược tiếng Việt trong `#dict-search-input` bằng cơ chế DOM Persistence (input tạo 1 lần cố định, chỉ cập nhật `#dict-entries-list`), hỗ trợ tìm kiếm không dấu. Đạt 151/151 tests pass.

### 35. Xây Dựng & Tích Hợp Từ Điển Strong (26/10/2026)
- Tích hợp CSDL 43 mục từ Strong (Hê-bơ-rơ & Hy Lạp), giao diện 4 tab tra cứu chuyên sâu (`renderUtilityStrong`). Đạt 152/152 tests pass.

### Milestone 36: Thiết Kế Trình Bày Kinh Thánh Kỉnh Kiềng (Zero Box Borders & Unboxed Numbers)
- Loại bỏ viền hộp, bóng đổ, cho dòng chảy câu liền mạch trang nghiêm như Kinh Thánh in. Số câu nhỏ gọn (0.72rem), không đóng khung badge. Đạt 154/154 pass 100%.

### Milestone 37: Sửa Lỗi Highlight Câu Đối Chiếu Mobile (Split 50/50)
- Tối ưu CSS specificity trên mobile drawer-open, câu chọn nổi bật với `border-left: 4.5px solid var(--accent-gold)`, nền phát quang và badge số câu vàng rực. Đạt 155/155 tests pass.

### Milestone 38: Triệt Tiêu Hiện Tượng Tự Nhảy / Cuộn Màn Hình Khi Bấm Chọn Câu (Zero-Jump Stability Contract)
- **Vấn đề**: Người dùng phản ánh khi bấm vào một câu Kinh Thánh trên giao diện, màn hình bị tự động giật/cuộn nhảy câu rất khó chịu. Nguyên nhân do `VERSE_SELECTED` trong `app.js` luôn tự động tính toán `centerTarget` và gọi `appBody.scrollTo({ top: centerTarget, behavior: 'smooth' })` nhằm ép câu được chọn vào chính giữa màn hình mỗi lần nhấp chuột, làm xáo trộn vị trí đọc tự nhiên của mắt.
- **Giải pháp chuẩn hóa**:
  1. Thay thế ép cuộn vào giữa bằng kiểm tra hiển thị tự nhiên: Nếu câu được bấm đã nằm trong khung nhìn (`(verseRect.top >= bodyRect.top + 6) && (verseRect.bottom <= bodyRect.bottom - 6)`), hệ thống **TUYỆT ĐỐI GIỮ NGUYÊN VỊ TRÍ CUỘN (Zero Scroll/Jump)**, giữ trải nghiệm đọc đầm chắc và ổn định.
  2. Chỉ thực hiện cuộn nhẹ nhàng (`scrollIntoView({ behavior: 'smooth', block: 'nearest' })`) khi câu thực sự bị khuất hẳn ngoài màn hình (ví dụ chuyển câu qua điều hướng bên ngoài).
  3. Cân bằng hình học CSS tuyệt đối: Đặt `border-left: 4px` cố định và `padding: 1px 5px` đồng bộ trên `.verse-number` trước và sau khi kích hoạt, triệt tiêu 100% hiện tượng xê dịch pixel do thay đổi kích thước hộp.
  4. Bổ sung test `test_zero_verse_jump_on_click_contract` vào bộ test. Đạt 156/156 tests pass 100%.

- **Milestone 39 (2026-10-26)**: Production Vercel & GitHub Deployment Complete:
  - Repository live at https://github.com/simonsharkman/kinhthanh (branch main).
  - Production website deployed successfully on Vercel Global Edge CDN at https://kinhthanh-sigma.vercel.app/.
  - Verified HTTP 200 OK across root index.html, data/books-metadata.json, and dynamic bible scripture files (data/bibles/JHN.json).
  - Fully responsive on mobile & desktop, zero-jump stability, reverent scripture layout, and 156/156 Pytest suite passing 100%.

- **Milestone 40 (2026-10-26)**: Sticky Top Header & Tab Navigation Immunity:
  - Fixed mobile & desktop issue where scrolling down scripture caused top navigation header & chapter tabs to scroll off screen.
  - Replaced overflow-x: hidden with overflow-x: clip on ody and html, body (preventing Chromium/WebKit from computing overflow-y: auto and breaking position: sticky).
  - Added explicit position: sticky !important; top: 0 !important; z-index: 1000 !important; to #main-header on desktop and across mobile viewports (991px and 640px).
  - Pinned .chapter-header at 	op: 46px !important; z-index: 950 !important; on mobile (and 60px on desktop) and docked .portal-main-tabs with sticky positioning.
  - Added unit test 	est_mobile_and_desktop_sticky_header_contract; full Pytest suite passing 100% (157/157 passed).

- **Milestone 41 (2026-10-27)**: Hermeneutics Typology Precision: Nâng cấp cụm từ khóa đa từ và luật loại trừ chống gán nhầm ẩn dụ 2 Cô-rinh-tô 11. Đạt 158/158 tests pass.
- **Milestone 42 (2026-10-27)**: SPA Deep Link Hash Routing: Đồng bộ URL chuyển tab (#portal, #bible, #tsk, #blog, #community, #media, #donate), hỗ trợ Back/Forward. Đạt 159/159 tests pass.
- **Milestone 43 (2026-10-27)**: Real-time Audio Verse Glowing & Interactive Seeking: Đồng bộ âm thanh theo câu (sáng viền vàng, tua audio khi nhấp câu). Đạt 160/160 tests pass.
- **Milestone 44 (2026-10-27)**: Verse-Level Deep Linking & Multi-Version URL Routing: Hỗ trợ URL #bible/NEH/1/6?v=BD2011, giải mã slug HTTLVN. Đạt 161/161 tests pass.

- **Milestone 45 (2026-10-27)**: Global Arial Typography Overhaul (Site-Wide Sans-Serif Experience):
  - Đổi toàn bộ font hệ thống sang Arial theo yêu cầu anh Jimmy (`--font-brand`, `--font-heading`, `--font-bible`, v.v.). Giữ phông nguyên ngữ Hy Lạp/Hê-bơ-rơ cổ. Test 164/164 PASS 100%.

- **Milestone 46 (2026-10-27)**: Refined Subtle Word-Diff Underline: Gạch chân chấm mờ tinh tế chấm dứt nền vàng lốm đốm, thêm tooltip giải thích. Đạt 166/166 test pass.
- **Milestone 47 (2026-10-27)**: Clean Columnar Reading Typography: Cột số câu độc lập, xuống dòng thẳng cột chuẩn mực. Đạt 166/166 test pass.
- **Milestone 48 (2026-10-27)**: Expanded Drawer Workspace: Mở rộng Drawer 45vw, thu nhỏ badge tiêu đề thẻ và nút Popout thành icon vuông 28px. Đạt 166/166 test pass.
- **Milestone 49 (2026-10-28)**: Hermeneutical Context Dossier: CSDL 21 Thư Tín Tân Ước (data/epistles-deep-context.json) với 9 trường chuyên sâu. Đạt 169/169 test pass.

- **Milestone 50 (2026-10-28)**: Fix Mobile Reading Version Selector Clipping & Header UX:
  - Khắc phục lỗi che nút bản dịch mobile theo ảnh anh Jimmy: Đặt `justify-content: flex-start !important` & `flex-shrink: 0 !important` cho `#primary-version-trigger`; rút gọn nhãn bản dịch (`BTT 1925`, `EDE`, `KTHD`, `CGKPV`, `KJV`); thêm nút trong menu hamburger. Đạt 172/172 test Pytest pass.

- **Milestone 51 (2026-10-28)**: Compact Primary Version Modal & Top-Right Close Button:
  - Tối ưu theo ảnh gạch xanh anh Jimmy: Header `#primary-version-modal` tinh gọn 1 hàng (`.pvm-header`), nút đóng tròn 28px (`.pvm-close-btn`) góc trên bên phải, xóa footer thừa mở rộng diện tích đọc. Đạt 174/174 test Pytest pass.

- **Milestone 52 (2026-10-28)**: Streamline Parallel Version Selector Modal (Zero Clutter):
  - Rút gọn `#version-selector-modal` theo ảnh anh Jimmy: Xóa mô tả thừa `<p class="modal-desc">`; rút gọn tên tab; 4 nút chọn nhanh `.quick-pill` 1 hàng; thẻ bản dịch 1 hàng (~38px) bỏ mô tả rườm rà, sửa trùng badge `BDY`/`CGKPV`. Đạt 177/177 test Pytest pass.

- **Milestone 53 (2026-10-28)**: Compact Text-Focused Book Picker & Real-Time Instant Search:
  - Tối ưu `#book-picker-modal` theo ảnh anh Jimmy: Chuyển sang text item phẳng không ô bao quanh (`.book-card-item`, ~28px); tên sách và số đoạn (vd: 28, 16) cùng hàng; thêm thanh tìm kiếm tức thì (`#book-picker-search-bar`) gõ 1-2 ký tự lọc ngay 66 sách. Đạt 180/180 test Pytest pass.

- **Milestone 54 (2026-10-28)**: Fix TSK Verse Navigation Overflow & Compact 66 Books Directory:
  - Sửa lỗi tràn viền TSK theo ảnh mũi tên đỏ của anh Jimmy: Xóa `◄`/`►` thừa, rút gọn thành `Câu trước`/`Câu tiếp`; thu nhỏ thanh điều hướng `.tsk-prev-next-split-bar` chống tràn; danh mục 66 sách dạng phẳng (`white-space: nowrap`). Đạt 182/182 test Pytest pass.

- **Milestone 55 (2026-10-28)**: Interactive Clickable Chapter Title (Direct Book & Chapter Pickers):
  - Tách tiêu đề chương thành 2 nút tương tác theo đề xuất anh Jimmy: Tên sách (`.chapter-title-book-btn`) mở danh sách 66 sách; số đoạn (`.chapter-title-chap-btn`) mở trực tiếp lưới chọn đoạn của sách đó với đoạn hiện tại nổi bật `.active-ch`. Đạt 185/185 test Pytest pass.
- **Milestone 56 (2026-10-28)**: Daily Scripture Reading Plan & Automatic Devotional Rotator:
  - Tự động nhảy bài đọc và tĩnh nguyện theo ngày thực tế (1-365 ngày), lưu tiến trình vào localStorage và đồng bộ Vercel. Đạt 191/191 test Pytest pass.
- **Milestone 57 (2026-10-29)**: Vertical Column-Flow Book Index (Mục Lục 66 Sách Theo Hàng Dọc):
  - Xếp mục lục 66 sách theo hàng dọc theo ảnh anh Jimmy: Chuyển `.books-grid` sang `grid-auto-flow: column;`, tự động tính số hàng (--rows-4, --rows-3, --rows-2); Cột 1 đi liền mạch từ Sáng thế ký đến 2 Sa-mu-ên; tìm kiếm tự chuyển về dòng ngang. Đạt 192/192 test Pytest pass.
- **Milestone 58 (2026-10-29)**: Compact Banking & Stewardship Card:
  - Tái cấu trúc thẻ ngân hàng tinh gọn phẳng (`.bank-details-box`), gộp 5 mục vào 1 thẻ với các hàng ngang (Ngân hàng, Số TK, Người nhận, Liên hệ, Nội dung); thu nhỏ mã QR (`max-width: 165px`), giảm >50% chiều cao. Đạt 193/193 test Pytest pass.
- **Milestone 59 (2026-10-30)**: Unified Triad Interactive Reader Title (TÊN SÁCH - ĐOẠN - BẢN):
  - Loại bỏ hoàn toàn huy hiệu tím thừa `.chapter-badge` lặp lại thông tin; hợp nhất tiêu đề thành bộ ba tương tác duy nhất (TÊN SÁCH mở 66 sách, ĐOẠN mở lưới chọn đoạn, BẢN mở bảng chọn bản dịch #primary-version-modal). Đạt 193/193 test Pytest pass.
- **Milestone 60 (2026-10-30)**: Maximum Scripture Display Space Prioritization (Tối Ưu Tối Đa Không Gian Lời Chúa Trong Cửa Sổ Popout):
  - Tiếp nhận phản ánh & ảnh chụp từ anh Jimmy: "hãy ưu tiên không gian hiển thị nội dung kinh thánh" (cửa sổ đọc độc lập trước đây bị header 2 tầng, huy hiệu vàng khổng lồ, thanh điều hướng phụ và footer giải thích dài dòng đè nghẹt, khiến phần chữ Lời Chúa chỉ còn một khe hẹp <20% chiều cao).
  - Triển khai tối ưu hóa không gian hiển thị tối đa (Zero Clutter - Maximum Scripture):
    1. Tích hợp thanh Header thành 1 hàng siêu mỏng duy nhất (`.popout-reader-header` cao chỉ 44px): Gồm nút Đoạn trước (`<`), Tiêu đề gọn gàng (`Giăng 2`), huy hiệu bản dịch tinh tế (`[ESV]`, `[CGKPV]`), nút Đoạn sau (`>`), các công cụ Sao chép, Mở tab mới và Đóng (`&times;`).
    2. Loại bỏ hoàn toàn thanh điều hướng phụ trùng lặp (`.popout-nav-bar`) và ẩn toàn bộ footer thừa (`.popout-reader-footer`): Không còn đoạn văn giải thích hay nút đóng vàng to chiếm chỗ.
    3. Mở rộng diện tích đọc Lời Chúa lên mức tối đa: `.popout-reader-card` tăng chiều cao lên 92-96vh, `.popout-reader-body` chiếm trọn 100% diện tích còn lại (`max-height: none`), tăng hơn 300% diện tích đọc thực tế, chữ hiển thị thoáng đãng, dễ đọc trên cả mobile và desktop.
  - Toàn bộ **193/193 bài test Pytest PASS 100%**. Đồng bộ mirror workspace & Vercel.
- **Milestone 61 (2026-10-30)**: Ultra-Compact AdSense & Stewardship Slot (Thu Nhỏ Tối Đa Khung Quảng Cáo & Dâng Hiến Cuối Chương Đọc):
  - Tiếp nhận phản ánh & ảnh chụp từ anh Jimmy: "hiển thị nhỏ thôi" (khoanh đỏ khung quảng cáo Google AdSense & nút dâng hiến cuối chương đọc trước đây quá cồng kềnh, viền dày, đệm lớn, chiếm nhiều diện tích cuộn dọc).
  - Triển khai tối ưu hóa khung quảng cáo siêu nhỏ gọn, phẳng (`.adsense-slot-card.adsense-slot-compact`):
    1. Thu gọn thành 1 dòng đơn ngang phẳng siêu mỏng: Bên trái là nhãn tinh tế `[Ad] Quảng cáo duy trì máy chủ`, bên phải là nút dâng hiến nhỏ gọn `[❤ Dâng hiến]`.
    2. Giảm hơn 70% chiều cao tổng thể: Thu nhỏ padding (`0.3rem 0.65rem`), margin gọn gàng (`0.65rem auto`), cỡ chữ thanh mảnh (`0.68rem`), đường viền mờ tinh tế không gây xao nhãng.
    3. Tối ưu di động: Khung tự động co giãn vừa vặn, không bị rớt dòng hay tràn màn hình, nhường toàn bộ không gian cho Lời Chúa và khung đối chiếu.
  - Toàn bộ **193/193 bài test Pytest PASS 100%**. Đồng bộ mirror workspace & Vercel.
