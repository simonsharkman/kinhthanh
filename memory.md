# 🧠 Memory Persistence — Logos MultiVerse (v2.5.0 Enterprise)

## 📌 Tổng Quan Dự Án & Định Danh
- **Dự án**: Logos MultiVerse (Nền tảng tra cứu, đối chiếu đa bản dịch và trợ lý Thánh Kinh AI).
- **Trạng thái kiểm thử**: 102/102 Pytest suites PASS (100% Green).
- **Workspace chính**: `E:\kinhthanh`
- **Mirror workspace**: `C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse`

---

## 🛠️ Kiến Trúc Hệ Thống & Module Hoàn Thiện
1. **Bible Engine (`js/bible-engine.js`, `js/state.js`)**:
   - Quản lý trạng thái đa bản dịch: Hỗ trợ BTT, BDM, BPT, BD2011, BHD, CGKPV (chính thống nguyên văn), KJV, ESV, NIV, Interlinear và 7 thứ tiếng dân tộc thiểu số (Ê-đê, Gia-rai, Ba-na, Bru, H'mông Trắng, H'mông Đen, M'nông).
   - **Tùy Chọn Bản Kinh Thánh Đọc Chính (Primary Reading Version)**: Tích hợp nút chọn bản đọc trực tiếp trên thanh điều hướng đầu trang (ngay cạnh logo, đúng vị trí yêu cầu). Người đọc có thể chuyển đổi bản đọc chính sang bất kỳ bản nào (BTT 1925, CGKPV Công Giáo, BDM 2002, BPT, KJV, ESV...). Màn hình đọc chính lập tức hiển thị toàn văn phân đoạn theo bản dịch đã chọn.
   - **Cửa Sổ Đọc Độc Lập Khi Đối Chiếu (Independent Popout Reader Window)**: Khi đang xem bảng đối chiếu (drawer bên phải), nhấp vào câu/thẻ bản dịch bất kỳ (CGKPV, BDY, KJV...) sẽ mở ra một cửa sổ đọc riêng biệt (`#popout-reader-modal`) hiển thị toàn bộ chương theo bản dịch đó, tự động cuộn đến và làm nổi bật câu đang khảo cứu, có đầy đủ nút chuyển đoạn trước/sau, sao chép văn bản, mở ra cửa sổ trình duyệt rời (`window.open`), và nút tắt/đóng (`[✕]`, phím `Esc`) mà hoàn toàn không ảnh hưởng đến màn hình đọc chính.
   - **Kinh Thánh Nguyên Ngữ Interlinear Scripture4All (Hê-bơ-rơ WLC & Hy Lạp ScrTR)**:
     - Tích hợp chuẩn xác dữ liệu nguyên bản từ cổng học thuật [Scripture4All Hebrew Index](https://www.scripture4all.org/OnlineInterlinear/Hebrew_Index.htm) và [Greek Index](https://www.scripture4all.org/OnlineInterlinear/Greek_Index.htm).
     - Giữ nguyên vẹn phiên âm từng chữ (word-by-word transliteration: `b·rashith`, `bra`, `aleim` / `en`, `archE`, `logos`), mã tra cứu Strong's (`H7225`, `G1722`), nghĩa đen bản gốc (`in·beginning`, `he-created`, `Elohim` / `IN`, `beginning`, `Word`) và nghĩa tiếng Việt tương đương.
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
  - Sự tồn tại của `setCurrentVerse` và `selectVerse`.
  - Hợp đồng đồng bộ dữ liệu giữa Reader và Drawer.
  - Khả năng nạp và trả về đủ 3+ bản dịch đối chiếu (`BDY`, `CGKPV`, `BD2011`...) cho mọi phân đoạn (kể cả Rô-ma 9:10 hay Khải huyền 22:10).
  - Chạy `python -m pytest` trước mọi lần triển khai/bàn giao để bảo đảm 100% test pass.

---

## 🧠 KIẾN TRÚC KIMCHI MULTI-MODEL AI HARNESS (v2.8.0 ENTERPRISE)
> **Mục tiêu**: Nâng cấp Logos AI Copilot theo mô hình **Kimchi (`getkimchi/kimchi`)**, mở rộng xử lý ngữ cảnh sâu rộng qua Multi-Provider và Deep Semantic RAG trên toàn bộ 66 sách Kinh Thánh.

### 1-4. Kiến Trúc Lõi Kimchi Multi-Model & Telemetry Engine
- **Đa Nhà Cung Cấp**: Tích hợp 5 provider (OpenAI, Gemini, Anthropic, DeepSeek, Groq) với fallback tự động và quản lý API keys mã hóa AES-GCM trong localStorage.
- **Bộ Tứ Chuyên Gia**: Nhà Chú Giải Thánh Kinh (Biblical Scholar), Người Hướng Dẫn Tâm Linh (Spiritual Shepherd), Nhà Phân Tích Cổ Ngữ (Linguistic Analyst), Bác Sĩ Tâm Hồn (Soul Counselor).
- **Nguyên Tắc Thần Học**: Thần cảm tuyệt đối, kinh điển đóng 66 sách, lấy Kinh Thánh giải thích Kinh Thánh, lấy Chúa Cứu Thế làm trung tâm.
- **Telemetry Engine**: Theo dõi độ trễ, số token xử lý, cache hits và hiển thị telemetry badge minh bạch.

### 5-11. Tối Ưu Hóa Nền Tảng Kimchi AI, Header, Interlinear & Cổng Tĩnh Nguyện (17-25/10/2026)
- Chuẩn hóa xác thực Admin 2 trường (`admin` / `logos777`) bảo đảm zero-leak security.
- Tối ưu giao diện đọc di động toàn màn hình, loại bỏ tooltip hover cản trở tầm nhìn, tích hợp deep links tra cứu nguyên bản Hy Lạp/Hê-bơ-rơ Scripture4All & BibleHub.
- Đặt Cổng Tĩnh Nguyện & Dưỡng Linh Cổ Điển làm trang chủ mặc định của hệ thống.
### 12. Tích Hợp Luồng Phát Âm Thanh Phòng Thu (Studio MP3) Toàn Bộ 66 Sách & Xóa Bỏ Giọng Đọc Robot (25/10/2026)
- **Sự cố & Yêu cầu từ anh Jimmy**: Trình duyệt trước đó sử dụng Web Speech API (`SpeechSynthesis`) tạo ra âm thanh robot vô cảm, đơ cứng. Anh phản ánh: *"cái âm thanh này là bạn làm à ? nếu đã làm cho đọc thì phải là âm thanh chất lượng"*.
- **Giải pháp dứt khoát**:
  1. Loại bỏ giọng robot Web Speech API; tuân thủ nghiêm ngặt **Zero Robotic Voice Mandate**.
  2. Khai thác luồng phát âm thanh phòng thu MP3 chất lượng cao cho toàn bộ 66 Sách Kinh Thánh qua CDN chính thức chuẩn Bản Truyền Thống.
  3. Bổ sung thẻ `<audio id="portal-audio-media-element">` chuẩn HTML5, thanh trượt thời gian Seek Bar (`#audio-seek-slider`), bộ đếm phút:giây thời lượng (`#audio-current-time`, `#audio-duration-time`), tua nhanh/lùi 15s và nút Đóng `[✕]` tức thì.
  4. Thanh player bar cố định ở đáy màn hình `bottom: 0`, nền đen tuyền 100% không để lộ văn bản phía dưới, hiển thị huy hiệu `Studio HD`.
  5. Bảo đảm 128/128 unit test Pytest pass 100%.

### 13. Tái Cấu Trúc Giao Diện Di Động: Menu Trượt Slide-out Drawer, Hamburger Lên Header & Lưới Thao Tác Nhanh (25/10/2026)
- **Yêu cầu & Hình ảnh tham chiếu**:
  1. Hình 1: Di chuyển nút Hamburger `☰` từ hàng subnav thứ 2 lên góc trên cùng bên trái của Header; xóa bỏ nút `📢 Banner` trên thanh header điện thoại; xóa thanh subnav 2 tầng gây chật chội.
  2. Hình 2: Triển khai theo mẫu ứng dụng di động gồm 3 màn hình:
     - Màn hình 1 (Dashboard Action Cards): Lưới thẻ bo tròn lớn, màu sắc sinh động 2 cột trên Cổng Tĩnh Nguyện.
     - Màn hình 2 (Slide-out Off-canvas Drawer): Menu trượt mượt mà từ bên trái ra khi bấm `☰`.
     - Màn hình 3 (Clean Reader): Giao diện đọc tinh gọn, không bị che khuất hay rối mắt.
- **Giải pháp kỹ thuật đã triển khai**:
  - Thêm nút `#mobile-drawer-toggle` vào mép trái `#main-header`, ẩn trên desktop, hiện trên mobile.
  - Ẩn `#header-admin-banner-btn` và `#site-subnav-bar` trên mobile (`max-width: 991px`).
  - Nâng cấp `#mobile-menu-modal` thành `.mobile-drawer-sheet` (slide từ trái `translateX(-100%)` sang `0`, header Thánh Giá vàng, greeting độc giả, các mục phân nhóm rõ ràng).
  - Thêm `.portal-mobile-dashboard` với 8 thẻ thao tác 2 cột bo tròn 14px (Đọc, Đối Chiếu, Câu Gốc, Đố Kinh Thánh, Đối Đáp, Lược Khảo, Truyện Tích, Từ Điển).
  - Bảo đảm 128/128 bài test Pytest PASS 100%.

### 14. Loại Bỏ Triệt Để Danh Xưng "Berea" & "Thần Học Berea" Khỏi Toàn Trang Web (25/10/2026)
- **Mệnh lệnh từ anh Jimmy**: Loại bỏ tất cả những cái gì có tên "Thần học Berea", "Berea" trong trang web.
- **Lý do thần học & thực tế**: Tránh hoàn toàn sự liên hệ hoặc nhầm lẫn với phong trào Berea gây tranh cãi; đưa toàn bộ hệ thống về quy chuẩn thần học Tin Lành truyền thống chính thống (Hội Thánh Tin Lành Việt Nam - HTTLVN).
- **Hành động đã hoàn thành**:
  1. `index.html`: Xóa bỏ "Berea", "Thần học Berea", thay bằng "Cộng đồng thông công học Lời Chúa" và "Dữ liệu chuẩn Hội Thánh Tin Lành Việt Nam (HTTLVN)".
  2. `js/blog-community.js`: Chuyển "CỘNG ĐỒNG BEREA" thành "CỘNG ĐỒNG THÔNG CÔNG", "Agent Berea" thành "Hệ Thống Kiểm Duyệt Nội Dung".
  3. `js/ai-assistant.js`: Chuyển "Trợ Lý Thần Học Berea AI", "Berea Copilot", "Berea Autonomous Core" thành "Trợ Lý Thánh Kinh AI", "Logos Copilot", "Logos Autonomous Core".
  4. `js/berea-guardian.js`: Xóa mọi thông báo kiểm duyệt hiển thị chữ "Agent Berea", thay bằng "Hệ Thống Kiểm Duyệt Đạo Đức Thánh Kinh".
  5. `js/storage.js`: Đổi tác giả mặc định thành "Độc giả Thánh Kinh".
  6. Bảo đảm 128/128 bài test Pytest PASS 100%.

### 15. Tối Ưu Hóa Typography & Font Chữ Đọc Kinh Thánh Chuẩn HTTLVN (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"hãy kiểm tra lại font chữ hiển thị đã đẹp và dễ dang cho người đọc chưa?"*
- **Rà soát & Phát hiện**:
  1. Font stack cũ chứa `Playfair Display` lẫn vào thân văn bản câu Kinh Thánh khiến nét thanh đậm tương phản gắt gây mỏi mắt khi đọc lâu.
  2. Thiếu font sans-serif tối ưu dấu tiếng Việt (`Be Vietnam Pro`) cho các nút bấm và nhãn UI.
  3. Lỗi khoá font trên di động: media query `<= 640px` và `body.drawer-open` bị gán cứng `font-size: 0.98rem !important; line-height: 1.6 !important;`, vô hiệu hóa tùy chọn phóng to chữ của người đọc.
- **Giải pháp hoàn thiện**:
  1. Tách bạch font stack: `--font-bible` và `--font-scripture` thuần Serif trang nghiêm (`Noto Serif`, `Merriweather`, `Charter`, Georgia); giữ `Playfair Display` riêng cho tiêu đề chương và nhãn thương hiệu (`--font-brand`, `--font-heading`).
  2. Bổ sung `Be Vietnam Pro` (weights 400-700) vào Google Fonts CDN và `--font-ui`, cho chữ giao diện sắc nét, tròn trịa, không lỗi dấu.
  3. Tối ưu độ thoáng: line-height chuẩn `1.8 - 1.95`, letter-spacing `0.012em`, bổ sung `optimizeLegibility`, `-webkit-font-smoothing: antialiased;` chống nhòe răng cưa trên mọi màn hình.
  4. Mở khóa toàn diện cỡ chữ di động: dùng `var(--bible-font-size, 1.15rem) !important;` giúp độc giả tự do phóng to chữ (17px - 25px) trên điện thoại mà không bị bó hẹp.
  5. Đạt 128/128 bài test Pytest PASS 100%.

### 16. Tinh Chỉnh Header Menu Trượt Di Động Theo Phản Hồi Hình Ảnh (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"bỏ chỗ tôi gạch. cho hình thập tự to hơn chút"* (kèm ảnh `media_1792941935551_10a84408.png`).
- **Thực hiện**:
  1. Xóa dòng chữ phụ bị gạch đỏ: `<span>Bản Truyền Thống 1925</span>` trong `.drawer-brand-text`.
  2. Phóng to hình ảnh Thánh Giá vàng `.drawer-cross-gif` từ 28px lên 44px kèm hiệu ứng tỏa sáng ánh kim (`drop-shadow`). Phóng to `.brand-gif-cross` trên thanh header điện thoại lên 30px.
  3. Nâng cỡ chữ tiêu đề `<h3>Logos Thánh Kinh</h3>` lên 1.22rem cân đối hoàn hảo với biểu tượng Thánh Giá.
  4. Đạt 128/128 bài test Pytest PASS 100%.

### 17. Ẩn Biểu Tượng Thánh Giá Trên Thanh Header Di Động (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"trên giao diện điện thoại bỏ cái này đi"* (kèm ảnh `media_1792942144709_1c66f784.png` khoanh đỏ biểu tượng Thánh Giá trên header).
- **Phân tích UX**: Trên màn hình điện thoại hẹp, cụm logo `.header-brand` chứa biểu tượng Thánh Giá nằm kẹp giữa nút Hamburger `☰` và nút chọn bản dịch `BDM (Tiếng Việt) ⌵`, gây chật chội và đè lấn không gian của các nút điều hướng đọc. Biểu tượng Thánh Giá lớn đã hiện diện trang nghiêm ngay bên trong Menu Trượt `☰`.
- **Thực hiện**: Đặt `.header-brand { display: none !important; }` trên mobile (`max-width: 991px`).
- **Hiệu quả**: Giải phóng toàn bộ diện tích hàng đầu: nút Hamburger `☰` nằm gọn bên mép trái, dãy nút chọn Bản dịch, chọn Sách/Chương, chế độ Đọc và Màu sắc trải rộng thông thoáng, không còn bị chèn ép.
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.

### 18. Tinh Gọn Thanh Audio Di Động (48px) & Tích Hợp Nút Nhảy Chương (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"giao diện chạy âm thanh nhỏ thôi. cho phép nhảy chương thay vì trượt"* (kèm ảnh `media_1792942228659_be44d9a8.png`).
- **Phân tích UX**: Thanh phát audio trước đó xếp chồng 3 hàng cao > 130px, chiếm gần 1/4 màn hình điện thoại; độc giả phải kéo thanh trượt (seek slider) hoặc cuộn trang để tìm nút chuyển chương.
- **Thực hiện hoàn thiện**:
  1. Thu gọn chiều cao cố định xuống chỉ **48px** trên di động, xếp trọn vẹn trong **1 hàng duy nhất**: Tên đoạn đọc (trái) - Cụm nút phát (giữa) - Tốc độ & Đóng (phải).
  2. Tích hợp nút **Đoạn Trước (`⏮`)** và **Đoạn Tiếp (`⏭`)** ngay trên thanh phát: bấm là lập tức chuyển chương và phát audio đoạn mới, không cần kéo trượt.
  3. Tự động chuyển và phát đoạn tiếp theo khi nghe hết chương hiện tại (`ended` event).
  4. Thanh tiến trình thu gọn thành đường chỉ 2.5px siêu mảnh trên đỉnh mép thanh phát, không tốn diện tích hiển thị.
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.

### 19. Khắc Phục Lỗi Hiển Thị Nút "☰ ≡ Tìm" Trên Thanh Menu Phụ Subnav (25/10/2026)
- **Thắc mắc từ anh Jimmy**: *"cái này là gì ?"* (kèm ảnh chụp cận cảnh nút `☰ ≡ Tim` nền xanh ô-liu `media_1792943357982_8c8cf6ef.png`).
- **Nguyên nhân**: Trong tệp `index.html` dòng 126, nút mở bộ máy tìm kiếm toàn diện (`#site-subnav-search`) trước đó bị lỗi gõ nhầm thẻ `<i class="fa-solid fa-bars"></i> ≡ Tìm`. Do đó trình duyệt vừa hiển thị icon 3 gạch `fa-bars` (`☰`), vừa hiển thị ký tự 3 gạch `≡` và chữ `Tìm`.
- **Khắc phục**: Thay thế hoàn toàn bằng nút chuẩn: `<i class="fa-solid fa-magnifying-glass"></i> Tìm Kiếm`, mở trực tiếp hộp thoại tra cứu chuẩn Hội Thánh Tin Lành Việt Nam (HTTLVN Search Hub).
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.

### 20. Loại Bỏ Nút "Màu Cổ Điển" Thừa Thãi Trên Thanh Subnav (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"tôi thấy cái này bị thừa"* (kèm ảnh `media_1792943481825_b7596a98.png` chỉ mũi tên đỏ vào nút `🎨 Màu Cổ Điển` ở mép phải thanh subnav).
- **Phân tích UX**: Trên thanh Header chính đã có sẵn nút đổi giao diện (`#header-theme-toggle-btn`) mở đầy đủ 6 bộ màu (bao gồm cả Cổ Điển Tin Lành). Việc đặt thêm một nút riêng `Màu Cổ Điển` trên thanh subnav gây dư thừa và phân mảnh điều khiển.
- **Thực hiện**: Xóa bỏ hoàn toàn nút `#site-subnav-classic-theme` khỏi `index.html` và `js/app.js`.
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.

### 21. Tích Hợp Nút Tìm Kiếm Header Di Động & Khắc Phục Nút Tắt Trình Phát Audio (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"trên giao diện điện thoại. chỗ trống đó để tìm kiếm. Nút tắt trình chạy chưa hoạt động"* (kèm ảnh `media_1792944585082_512bd390.png`).
- **Thực hiện hoàn thiện**:
  1. Lắp nút **Tìm Kiếm Nhanh** (`#mobile-header-search-btn`) vào chính xác khoảng trống bên cạnh nút `☰`: thiết kế dạng pill bo tròn ánh vàng (`🔍 Tìm kiếm...`), bấm vào lập tức mở Bộ máy tra cứu toàn văn HTTLVN Search Hub.
  2. Khắc phục triệt để lỗi nút đóng âm thanh (`#audio-btn-close` `[✕]`):
     - Bổ sung quy tắc CSS bắt buộc `.portal-audio-player-bar.hidden { display: none !important; opacity: 0 !important; }` trên toàn hệ thống.
     - Hàm `hideAudioPlayer()` nay áp dụng trực tiếp `style.setProperty('display', 'none', 'important')` và dừng hoàn toàn luồng phát MP3.
     - Nâng `z-index: 50` và hỗ trợ cả sự kiện `click` lẫn `touchend` cho nút `✕`, chống chặn cảm ứng trên màn hình cảm ứng di động.
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.


### 22. Ẩn Thanh Tiêu Đề Cổng Dưỡng Linh Cũ Trên Điện Thoại (25/10/2026)
- **Yêu cầu từ anh Jimmy**: *"tôi thấy không cần hiển thị cái này trên điện thoại"* (kèm ảnh `media_1792945549838_6eba13db.png` gạch chéo đỏ thanh banner xanh lá `.portal-brand-bar`).
- **Phân tích UX**: Thanh banner cũ chứa tiêu đề "Chuyên Mục Tĩnh Nguyện & Dưỡng Linh" và 3 nút tròn chiếm gần nửa màn hình đầu trên điện thoại, đồng thời trùng lặp chức năng với lưới 8 thẻ thao tác nhanh (`.portal-mobile-dashboard`) ngay bên dưới.
- **Thực hiện**: Đặt `.portal-brand-bar { display: none !important; }` trên toàn bộ thiết bị di động/máy tính bảng (`max-width: 991px`).
- **Hiệu quả**: Đưa lưới 8 thẻ thao tác hiện đại 2 cột (Đọc Lời Chúa, Đối Chiếu, Câu Gốc, Đố Kinh Thánh, v.v.) lên vị trí nổi bật ngay dưới thanh Header, giao diện cực kỳ hiện đại, trực quan và tối ưu diện tích đọc.
- **Kiểm thử**: Đạt 128/128 bài test Pytest PASS 100%.

### 23. Nâng Cấp Hệ Thống Quản Trị Toàn Diện Full Admin CMS v3.0 (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"tôi muốn chỉnh sửa tất cả. kể cả kinh thánh khi tôi phát hiện bị lỗi. tôi cũng muốn cập nhật media theo từng mùa nữa"* (sau khi đăng nhập Quản Trị thành công nhưng thấy màn hình Cổng Tĩnh Nguyện chưa có nút chỉnh sửa trực tiếp).
- **Phân tích & Thiết kế**: Chuyển hóa toàn bộ hệ thống từ hiển thị tĩnh sang **Full Dynamic CMS** dưới quyền Quản Trị Viên:
  1. **Quản Trị Cổng Tĩnh Nguyện (`portal-view`)**:
     - Nút vàng **`⚙ Quản Trị Tĩnh Nguyện`** (`#admin-devotion-edit-btn`) chỉ hiện khi vai trò là `admin`.
     - Mở Modal **`#admin-devotion-modal`**: Cho phép Admin cập nhật Câu Gốc trong ngày (sách, đoạn, câu, nội dung lời Chúa), sửa 4 kế hoạch Lịch Đọc Kinh Thánh hàng ngày, và soạn bài suy ngẫm *Sống Với Thánh Kinh*.
     - Hỗ trợ nút khôi phục mẫu chuẩn mực bất kỳ lúc nào (`#btn-devotion-reset-default`).
  2. **Hiệu Đính Lời Chúa Khi Phát Hiện Lỗi (`bible-engine.js`)**:
     - Khi là Quản Trị Viên, trên mỗi câu Kinh Thánh ở Focus Reader và Parallel Comparison xuất hiện nút bút chì **`✏ Sửa`** (`.btn-admin-edit-verse`).
     - Mở Modal **`#admin-verse-correction-modal`**: Hiển thị chính xác tọa độ câu và bản dịch, ô soạn thảo sửa câu chữ và ô ghi chú lý do hiệu đính.
     - Dữ liệu hiệu đính lưu vào `storage.saveVerseCorrection()` và ghi đè hiển thị tức thì, kèm nhãn nhận diện `<span class="verse-corrected-tag">Đã hiệu đính</span>`.
     - Cho phép khôi phục nguyên văn gốc 1-chạm (`#reset-admin-verse-corr-btn`).
  3. **Quản Trị Thư Viện Media & Video Theo Từng Mùa (`media-engine.js`)**:
     - Tích hợp thanh lọc mùa vụ 6 phân loại (`all`, `christmas`, `easter`, `worship`, `harvest`, `academic`).
     - Khi là Quản Trị Viên: Xuất hiện nút **`+ Cập Nhật / Thêm Media Mùa Mới`** trên đầu trang và các nút **`Sửa`**, **`Xóa`** trên từng thẻ Video/Media.
     - Mở Modal **`#admin-media-modal`**: Hỗ trợ thêm/sửa link YouTube, thời lượng, tiêu đề, mô tả và chọn mùa lễ tương ứng.
- **Kiểm thử & Chất lượng**:
  - Viết bộ test mới `tests/test_admin_full_cms.py` bao phủ toàn diện 5 nhóm chức năng.
  - Toàn bộ **133/133 bài test Pytest PASS 100%**.
  - Cam kết bảo mật: Tuyệt đối không rò rỉ mã mặc định trong `js/app.js`.
