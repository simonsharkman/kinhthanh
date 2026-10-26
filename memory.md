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

### 32. Chữa Lành Lỗi "Áp-ra-ham" (`Aùp` ➔ `Áp`), "Kỳ Hạn" (`k"` ➔ `kỳ`) & Kích Hoạt Tìm Kiếm Theo Địa Chỉ Kinh Thánh (26/10/2026)
- **Yêu cầu từ anh Jimmy**:
  1. *"lỗi từ Ap-ra-ham."* (kèm ảnh chụp `Công vụ các Sứ đồ 3:25-26, 13:26` bị hiển thị `Aùp-ra-ham`, và `Ga-la-ti 4:4` hiển thị `k" hạn`).
  2. *"thứ 2 là tìm kiếm theo địa chỉ kinh thánh chưa hoạt động"* (kèm ảnh chụp modal `#httlvn-search-modal` tìm `Công vụ các Sứ đồ 13:26` trả về 0 kết quả).
- **Phân tích Nguyên nhân Gốc rễ**:
  1. *Lỗi `Aùp-ra-ham` & `k" hạn`*: Bộ gõ VNI-DOS/VNI-Windows cổ mã hóa `Á` thành byte `0xF9`, khi convert sang CP1252/Unicode bị biến thành `ù` (`Aùp-ra-ham`, `Aùch`, `Aùo`). Đồng thời ký tự `"` trong OCR cũ bị nhầm với dấu `ỳ` tạo ra `k"` thay vì `kỳ` (`k" hạn`, `K" cuối cùng`).
  2. *Lỗi Tìm Kiếm Địa Chỉ*: `#httlvn-search-modal` chỉ là full-text search từ khóa nên địa chỉ trả về 0 kết quả. Thêm vào đó regex `parseReference` ban đầu bị `\bv\b` bắt nhầm chữ `v` trong `Công vụ`.
- **Thực hiện Triệt để 2 Tầng**:
  1. **Khắc phục CSDL & Runtime**:
     - Quét và chữa lành 123 tệp JSON trong `data/`: thay thế 9.310 vị trí `Aù` ➔ `Á` (7.274 vị trí `Aùp` ➔ `Áp`) và 2.782 vị trí `[kK]\" ` ➔ `kỳ / Kỳ ` (chữa lành `Áp-ra-ham` và `kỳ hạn`).
     - Cập nhật `cleanScriptureText(text)` trong `js/bible-engine.js` để tự động bảo vệ và chuẩn hóa runtime.
  2. **Kích Hoạt Tìm Kiếm Địa Chỉ Kinh Thánh Trực Tiếp (Direct Coordinate Search)**:
     - Nâng cấp `parseReference()` trong `js/bible-engine.js`: dùng lookahead an toàn `(?=\d+)` chuẩn hóa `đoạn`, `chương`, `câu`, `v`, không bao giờ bắt nhầm `Công vụ` hay `Châm ngôn`.
     - Tích hợp phát hiện địa chỉ trực tiếp trong `searchHTTLVN()`: tự động nạp câu chính xác qua `getVersesByRef()` với huy hiệu `ĐỊA CHỈ KINH THÁNH`.
     - Đồng bộ `#omni-search-input` và modal `#httlvn-search-modal`: nhấn Enter dẫn hướng thẳng đến phân đoạn (`navigateToPassage`).
- **Kiểm thử & Đồng bộ**: Bổ sung test cases vào `tests/test_orthography_immunity.py` và `tests/test_httlvn_and_copilot.py`. Toàn bộ **149/149 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace.

### 33. Tái Cấu Trúc Bố Cục Thẻ Nghiệp Vụ Khung Đối Chiếu Lưới 2x2 Triệt Tiêu Chèn Lấn Chữ (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"bị đè lên nhau hết rồi. Mời bạn xử lý"* (kèm ảnh khoanh đỏ 4 tab `So Sánh Bản Dịch`, `Câu Tham Chiếu`, `Ẩn Dụ & Biểu Tượng`, `Bối Cảnh & Thể Loại` đè chữ lên nhau).
- **Nguyên nhân gốc rễ**: CSS trước đây đặt `flex: 1 1 calc(25% - 5px)` và `white-space: nowrap` nhưng độ rộng drawer chỉ 310px-385px. Các nhãn chữ dài 14-18 ký tự tràn ra ngoài biên và đè lên nhau trên cùng 1 hàng.
- **Thực hiện**:
  1. *Chuyển sang Lưới 2x2 Cân Đối*: Áp dụng `flex: 1 1 calc(50% - 6px); min-width: 0; max-width: calc(50% - 3px);` kết hợp `overflow: hidden; text-overflow: ellipsis;` tự động chia 2 hàng x 2 nút chuẩn xác.
  2. *Mở rộng vùng đọc*: Tăng `--drawer-width` lên `clamp(330px, 28vw, 420px)` cho trải nghiệm đối chiếu thoáng đãng.
  3. *Bổ sung Tooltip*: Thêm thuộc tính `title` vào từng nút tab trong `index.html`.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_drawer_tabs_2x2_grid_immunity_against_overlap` vào `tests/test_ui_foundation.py`. Toàn bộ **150/150 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace.

### 34. Khắc Phục Lỗi Gõ Chữ Tiếng Việt Bị Nhảy Con Trỏ / Ngược Ký Tự Trong Thánh Kinh Từ Điển (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"chỗ mục này gõ chữ bị lỗi"* (kèm ảnh chụp mũi tên đỏ chỉ vào ô tìm kiếm Thánh Kinh Từ Điển `#dict-search-input` bị gõ ngược ký tự `------gdjlgdsnahldasnnab`).
- **Nguyên nhân gốc rễ**: Phương thức `renderUtilityDict()` gán sự kiện `input` nhưng lại thực thi xóa và render lại toàn bộ `bodyContainer.innerHTML` sau mỗi phím gõ. Việc hủy và tái tạo thẻ `<input>` trên mỗi ký tự làm mất phiên gõ của bộ gõ tiếng Việt (Unikey/EVKey Telex), nhảy con trỏ về vị trí 0 (đầu dòng) và khiến các ký tự tiếp theo bị đẩy ngược về sau.
- **Thực hiện**:
  1. *Khởi tạo Input Cố định (DOM Persistence)*: Tách biệt cấu trúc ô tìm kiếm và danh sách kết quả `#dict-entries-list`. Ô `<input>` chỉ được tạo một lần duy nhất khi mở từ điển.
  2. *Cập nhật Độc lập (`updateUtilityDictList`)*: Khi gõ phím, chỉ lọc dữ liệu `BIBLE_DICT_DATA` và nạp vào `#dict-entries-list`, tuyệt đối không bao giờ chạm vào DOM của ô nhập liệu. Con trỏ và bộ gõ Telex/VNI hoạt động 100% tự nhiên.
  3. *Tối ưu Tìm Kiếm & UI*: Hỗ trợ tìm kiếm tiếng Việt không dấu (`normalize`), thêm icon kính lúp sang trọng và nút `×` xóa nhanh từ khóa.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_bible_dictionary_search_input_integrity_and_ime_stability` vào `tests/test_portal_utility_cms.py`. Toàn bộ **151/151 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace.

### 35. Xây Dựng & Tích Hợp Từ Điển Strong's Hy Lạp & Hê-bơ-rơ Vào Hộp Chọn Tài Liệu Tham Khảo (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"từ điển chưa có"* (kèm ảnh chụp hộp chọn `TÀI LIỆU THAM KHẢO` ➔ mục `5. Từ Điển Strong's Hy Lạp/Hê-bơ-rơ`).
- **Nguyên nhân gốc rễ**: Khi chọn mục 5 trong `#portal-ref-docs-select`, mã trước đây chỉ đổi version sang Interlinear và chuyển view Kinh Thánh, chưa có hộp thoại tra cứu từ điển Strong's chuyên dụng.
- **Thực hiện**:
  1. *Cơ Sở Dữ Liệu Strong's*: Xây dựng 43 mục từ căn bản nguyên ngữ Hê-bơ-rơ Cựu Ước (Mã H: `Bereshit H7225`, `Bara H1254`, `Elohim H430`, `Yahweh H3068`, `Shalom H7965`, `Hesed H2617`...) và Hy Lạp Tân Ước (Mã G: `Logos G3056`, `Theos G2316`, `Agape G26`, `Pneuma G4151`, `Charis G5485`...), lưu vào `data/utility-strong-dict.json` và `STRONG_DICT_DATA` trong `portal-data.js`.
  2. *Hệ Thống Tab 4 Chế Độ*: `Bách Khoa Địa Danh`, `Tất Cả Strong's`, `Strong's Hê-bơ-rơ`, `Strong's Hy Lạp`.
  3. *Giao Diện Tra Cứu Chuyên Sâu (`renderUtilityStrong`)*: Tìm kiếm theo mã Strong, chữ nguyên ngữ hoặc nghĩa tiếng Việt/Anh; hiển thị chữ nguyên bản đúng font (SBL Hebrew/Greek), phiên âm La-tinh, giải nghĩa chi tiết và nút `[Đọc Lời Chúa]` dẫn thẳng đến phân đoạn.
  4. *Kích Hoạt Chọn Nhanh*: Cập nhật `portal-ref-docs-select` khi chọn `strong` lập tức mở thẳng Từ Điển Strong's.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_strongs_greek_hebrew_dictionary_integration` vào `tests/test_portal_utility_cms.py`. Toàn bộ **152/152 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace.

### Milestone 36: Thiết Kế Trình Bày Kinh Thánh Kỉnh Kiềng (Zero Box Borders & Unboxed Small Verse Numbers)
- **Vấn đề**: Người dùng phản ánh câu Kinh Thánh bị đóng trong từng thẻ hộp có viền (order: 1px solid) và bóng đổ (ox-shadow), số câu dạng badge đóng khung nút 26x26px to bản khiến giao diện giống bảng danh sách/form nhập liệu, làm phân tâm và mất đi vẻ trang nghiêm, kỉnh kiềng trước Lời Đức Chúa Trời.
- **Giải pháp chuẩn hóa**:
  1. Loại bỏ toàn bộ viền hộp (order: none, order-left: 3px solid transparent), bỏ nền thẻ (ackground: transparent), bỏ bóng đổ (ox-shadow: none), thu hẹp khoảng cách giữa các câu (gap: 0.15rem) để đoạn Kinh Thánh chảy liền mạch, thanh thoát như một trang Kinh Thánh in kinh điển.
  2. Tinh chỉnh số câu (.verse-number): Bỏ khung viền và màu nền hộp badge, hiển thị nhỏ gọn (ont-size: 0.72rem, opacity: 0.82), áp dụng màu chuẩn theme ar(--text-verse-num, var(--accent-gold)), căn thẳng baseline chữ đầu tiên.
  3. Trạng thái câu đang đọc/chọn (.verse-highlight-active, .verse-reading-active): Chỉ hiển thị thanh chỉ dấu vàng/xanh tinh tế bên trái (order-left: 3.5px solid var(--accent-gold)) và quầng sáng nhẹ (
gba(229, 193, 88, 0.1)), tuyệt đối không bao viền toàn bộ câu.
  4. Bổ sung Unit Test 	est_reverent_scripture_verse_styling_zero_borders_and_unboxed_numbers. Bộ test đạt 154/154 pass 100%.
