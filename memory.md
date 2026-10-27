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

### 35. Xây Dựng & Tích Hợp Từ Điển Strong's Hy Lạp & Hê-bơ-rơ (26/10/2026)
- Tích hợp CSDL 43 mục từ Strong's (Hê-bơ-rơ & Hy Lạp) vào `data/utility-strong-dict.json`, giao diện 4 tab tra cứu chuyên sâu (`renderUtilityStrong`) hỗ trợ tìm kiếm mã Strong, phiên âm và nút đọc Lời Chúa. Đạt 152/152 tests pass.

### Milestone 36: Thiết Kế Trình Bày Kinh Thánh Kỉnh Kiềng (Zero Box Borders & Unboxed Small Verse Numbers)
- **Vấn đề**: Người dùng phản ánh câu Kinh Thánh bị đóng trong từng thẻ hộp có viền (order: 1px solid) và bóng đổ (ox-shadow), số câu dạng badge đóng khung nút 26x26px to bản khiến giao diện giống bảng danh sách/form nhập liệu, làm phân tâm và mất đi vẻ trang nghiêm, kỉnh kiềng trước Lời Đức Chúa Trời.
- **Giải pháp chuẩn hóa**:
  1. Loại bỏ toàn bộ viền hộp (order: none, order-left: 3px solid transparent), bỏ nền thẻ (ackground: transparent), bỏ bóng đổ (ox-shadow: none), thu hẹp khoảng cách giữa các câu (gap: 0.15rem) để đoạn Kinh Thánh chảy liền mạch, thanh thoát như một trang Kinh Thánh in kinh điển.
  2. Tinh chỉnh số câu (.verse-number): Bỏ khung viền và màu nền hộp badge, hiển thị nhỏ gọn (ont-size: 0.72rem, opacity: 0.82), áp dụng màu chuẩn theme ar(--text-verse-num, var(--accent-gold)), căn thẳng baseline chữ đầu tiên.
  3. Trạng thái câu đang đọc/chọn (.verse-highlight-active, .verse-reading-active): Chỉ hiển thị thanh chỉ dấu vàng/xanh tinh tế bên trái (order-left: 3.5px solid var(--accent-gold)) và quầng sáng nhẹ (
gba(229, 193, 88, 0.1)), tuyệt đối không bao viền toàn bộ câu.
  4. Bổ sung Unit Test 	est_reverent_scripture_verse_styling_zero_borders_and_unboxed_numbers. Bộ test đạt 154/154 pass 100%.

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

- **Milestone 41 (2026-10-27)**: Hermeneutics Typology Precision & Zero False-Positive Isolation:
  - Resolved critical issue in Drawer 'Ẩn Dụ & Biểu Tượng' reported by user on 2 Corinthians 11 where verses were falsely matched to unrelated metaphors:
    1. 2CO 11:14 (Satan disguised as an 'angel of light') was erroneously tagged as 'Muối Của Đất & Ánh Sáng Của Thế Gian'.
    2. 2CO 11:26 was tagged as 'Men & Lễ Bánh Không Men' due to substring matching on English 'countrymen' containing 'men'.
    3. 2CO 11:27 was tagged as 'Nước Sống' due to Paul's physical hunger and thirst ('đói khát') matching 'khát'.
  - Upgraded HermeneuticsEngine.METAPHOR_SIGNATURES: Replaced single-word keywords with authentic multi-word Vietnamese biblical phrases (e.g., 'bánh không men', 'men của người pha-ri-si', 'nước hằng sống', 'chiên con của đức chúa trời').
  - Added negative exclusion rules (e.g., excluding 'sa-tan', 'quỉ sa-tan', 'thiên sứ sáng' from holy light metaphors).
  - Restricted keyword matching to Vietnamese scripture translations, isolating English translations from naive substring collisions.
  - Added comprehensive test in 	est_hermeneutics.py; full suite passing 100% (158/158 passed).

- **Milestone 42 (2026-10-27)**: SPA Deep Link Hash Routing & URL Branch Synchronization:
  - Khắc phục triệt để thắc mắc của người dùng về việc khi bấm vào các Tab chính (Cổng Tĩnh Nguyện, Đọc Kinh Thánh, KT Đối Chiếu, Blog Chuyên Sâu, Nhánh Cộng Đồng, Media & Video, Dâng Hiến) thì thanh địa chỉ URL vẫn giữ nguyên `kinhthanh-sigma.vercel.app/` không hiện nhánh link.
  - Triển khai kiến trúc SPA Hash Routing chuẩn:
    1. Đồng bộ 2 chiều: Khi nhấp tab (`switchView`) hoặc đổi sách/chương (`PASSAGE_CHANGED`), hệ thống tự động cập nhật URL hash tức thì (`#portal`, `#bible/JHN/1`, `#tsk/JHN/1`, `#blog`, `#community`, `#media`, `#donate`) bằng `history.pushState` và `history.replaceState`.
    2. Deep Linking: Người dùng có thể chia sẻ hoặc mở link trực tiếp vào bất kỳ tab hoặc chương nào (ví dụ `#bible/2CO/11`, `#blog`, `#donate`).
    3. Trình duyệt Back / Forward: Bắt sự kiện `popstate` và `hashchange` điều hướng mượt mà không tải lại trang.
    4. Nút Brand Home Logo chuyển về `#portal` (trang chủ Cổng Tĩnh Nguyện).
  - Bổ sung Unit Test `test_spa_hash_routing_and_deep_linking_contract` trong `test_portal_and_header_sticky.py`.
  - Bộ kiểm thử toàn diện đạt 159/159 tests PASS 100%. Đã sync mirror và deploy lên Vercel.

- **Milestone 43 (2026-10-27)**: Real-time Audio Verse Glowing Illumination & Interactive Seeking:
  - Tiếp nhận yêu cầu nghiên cứu và triển khai từ anh Jimmy: *"chúng ta có thể làm cho phần đọc này, khi đọc tới câu nào thì câu đó được đánh dấu sáng lên không ?"* (kèm ảnh chụp mũi tên đỏ chỉ vào khối NGHE Sáng-thế Ký 1).
  - Triển khai kiến trúc đồng bộ âm thanh theo câu thời gian thực:
    1. Thuật toán `buildVerseTimingMap(verses, duration)`: Tự động phân bổ mốc thời gian (start, end, duration) cho từng câu trong phân đoạn dựa trên số lượng từ và mật độ dấu câu (chấm, phẩy, chấm phẩy) kết hợp trừ bù thời gian mở đầu đọc tiêu đề (~3.2s) và khoảng lặng cuối file.
    2. Đồng bộ `timeupdate`: Liên tục theo dõi `audioEl.currentTime` để tìm câu đang phát qua `findVerseAtTime(timingMap, currentTime)`, gọi `highlightReadingVerse(activeVerseNum)` và cập nhật subtitle thanh phát Audio.
    3. Hiệu ứng phát sáng kỉnh kiềng (Radiant Sacred Glow): Câu đang đọc được bao phủ dải màu chuyển sắc ánh vàng hoàng gia `linear-gradient(90deg, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.08) 75%, transparent 100%)`, viền chỉ dấu nổi bật `border-left: 4.5px solid var(--accent-gold)`, hiệu ứng phát quang `box-shadow: 0 0 16px rgba(212, 175, 55, 0.25)`, và số câu chuyển thành huy hiệu vàng rực rỡ.
    4. Tương tác chuyển câu trực tiếp (Interactive Verse-Seek): Khi đang nghe audio, người dùng nhấp vào bất kỳ câu nào trong khung đọc thì audio sẽ tự động nhảy đến đúng mốc thời gian câu đó (`jumpAudioToVerse`).
    5. Nút Câu Tiếp Theo / Câu Trước Đó (`nextVerseAudio` / `prevVerseAudio`) hỗ trợ chuyển câu từng bước mượt mà.
  - Bổ sung Unit Test `test_audio_verse_glow_highlight_contract` trong `test_portal_and_header_sticky.py`. Toàn bộ **160/160 bài test Pytest PASS 100%**.
  - Đã sync mirror workspace và tự động deploy lên Vercel.

- **Milestone 44 (2026-10-27)**: Verse-Level Deep Linking & Multi-Version URL Routing (HTTLVN Standard Alignment):
  - Tiếp nhận phản hồi từ anh Jimmy: *"bấm tới câu 6 mà vẫn không thấy. bạn xem lại. như trang này bấm câu nào là link sẽ nhảy câu đó, kinh thánh bản nào cũng hiện lên. https://kinhthanh.httlvn.org/doc-kinh-thanh/gie/21?v=BD2011#6"* (kèm ảnh chụp khoanh đỏ câu 6 Nê-hê-mi 1 trên giao diện).
  - Triển khai giải pháp đồng bộ thanh link theo từng câu và bản dịch:
    1. Đồng bộ nhấp câu (`VERSE_SELECTED`): Bấm vào bất kỳ câu nào (ví dụ câu 6), thanh địa chỉ lập tức cập nhật nhánh câu đó: `#bible/NEH/1/6` (hoặc `#bible/NEH/1/6?v=BD2011`).
    2. Đồng bộ bản dịch (`PRIMARY_VERSION_CHANGED`): Khi đổi bản dịch (BTT, BD2011, CGKPV, KJV, v.v.), URL tự động gắn query `?v=...` tương ứng.
    3. Bộ giải mã tương thích HTTLVN (`parseHash` & `resolveBookId`): Tự động nhận diện slug HTTLVN (ví dụ: `gie` -> `JER`, `ne` -> `NEH`, `sa` -> `GEN`) và định dạng `#câu` ở cuối URL (`/doc-kinh-thanh/gie/21?v=BD2011#6`).
    4. Trực quan hóa đầy đủ: Mở link trực tiếp sẽ nạp đúng bản dịch, mở đúng phân đoạn, cuộn và đánh dấu sáng câu được chọn, đồng thời kích hoạt bảng Đối Chiếu Song Song.
  - Bổ sung Unit Test `test_verse_click_url_branch_and_version_contract` trong `test_portal_and_header_sticky.py`. Toàn bộ **161/161 bài test Pytest PASS 100%**.
  - Đã sync mirror và deploy lên Vercel.
