# 🧠 Memory Persistence — Logos MultiVerse (v2.5.0 Enterprise)

## 📌 Tổng Quan Dự Án & Định Danh
- **Dự án**: Logos MultiVerse (Nền tảng tra cứu, đối chiếu đa bản dịch và trợ lý AI thần học Berea).
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
3. **Trợ Lý AI Thần Học Berea (`js/ai-assistant.js`)**:
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
  - *Trợ Lý AI Thần Học Berea*
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
> **Mục tiêu**: Nâng cấp Berea AI Copilot theo mô hình **Kimchi (`getkimchi/kimchi`)**, mở rộng xử lý ngữ cảnh sâu rộng qua Multi-Provider và Deep Semantic RAG trên toàn bộ 66 sách Kinh Thánh.

### 1. Phân Tuyến 5 Nhà Cung Cấp Đa Mô Hình (Multi-Provider Support)
1. **Berea Autonomous Core (Offline RAG)**: Chạy hoàn toàn cục bộ, không cần API Key, không phụ thuộc internet, xử lý tức thì cả 66 sách Kinh Thánh qua bộ dữ liệu chuẩn.
2. **Google Gemini AI**: Tích hợp `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro` — Context Window 1M+ tokens cực kỳ tối ưu cho nghiên cứu toàn bộ sách và chương Kinh Thánh.
3. **OpenAI ChatGPT**: Tích hợp `gpt-4o-mini` và `gpt-4o` cho khả năng lý luận thần học sắc bén.
4. **DeepSeek AI**: Tích hợp `deepseek-chat` (V3) và `deepseek-reasoner` (R1) giải kinh chuyên sâu.
5. **Ollama Local AI**: Kết nối máy chủ LLM nội bộ tại `http://localhost:11434` (Llama 3, Qwen 2.5, Mistral...).

### 2. Bộ Tứ Vai Trò Chuyên Gia Kimchi (Specialized Agentic Roles)
- `⚡ Berea Copilot`: Trợ lý toàn diện kiêm quản trị hệ thống, tự động nhận diện và thực thi lệnh kép (VD: *"Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch"*).
- `🎓 Giải Kinh Thần Học (Exegete)`: Chuyên sâu Mạch Văn Cứu Chuộc, Thần học Giao ước và Typology Đấng Christ.
- `📜 Nguyên Ngữ & Strong's (Linguist)`: Bóc tách từ vựng Koine Greek / Biblical Hebrew, ngữ pháp và mã Strong's.
- `🏛️ Bối Cảnh Lịch Sử (Historian)`: Khảo cứu Cận Đông Cổ Đại, niên đại trước thuật, phong tục và khảo cổ.

### 3. Nguyên Tắc Thần Học & Đức Tin Bất Biến (Faith Invariants)
- **Quy tắc 1**: Người viết sách Kinh Thánh (Môi-se, Giô-suê, Đa-vít, Phao-lô, Giăng...) **BẮT BUỘC** gọi là **"Trước giả"**.
- **Quy tắc 2**: Duy nhất Đức Chúa Trời là **"Tác Giả Tối Thượng"** soi dẫn toàn bộ Thánh Kinh.
- **Quy tắc 3**: Giải nghĩa theo nguyên tắc **"Kinh Thánh tự giải nghĩa Kinh Thánh"** (*Scriptura Sacra sui ipsius interpres*), không dùng ngụy biện hoặc văn mẫu sơ sài.

### 4. Xử Lý Ngữ Cảnh Sâu Rộng & Kimchi Telemetry Engine (Massive Long-Context Synthesis)
- **`buildKimchiContextPackage(question, context, isDeep)`**: Tự động tổng hợp toàn văn chương Kinh Thánh qua ma trận đa bản dịch (BTT 1925, KJV, ESV, CGKPV, EDE, JARAI, BDY, BTHD, BDM), mạng lưới đối chiếu TSK chéo, quy tắc thông giải học (Hermeneutics genre rules), chủ đề giáo lý đồng bộ, và dòng bộ nhớ hội thoại lăn (Sliding-window Conversation Memory Stream).
- **`formatKimchiTelemetryBar(metrics, modelName)`**: Minh bạch hóa tài nguyên xử lý trên từng bong bóng hội thoại: Model name, số câu Kinh Thánh nạp, số bản dịch đối chiếu, số liên kết TSK, ước lượng Tokens và độ trễ phản hồi (latency ms).
- **Chế độ Deep Research Mode**: Nút toggle `#floating-deep-research-btn` và `#ai-deep-research-toggle-btn` cho phép kích hoạt phân tích sâu nguyên ngữ Strong's, niên đại giao ước và biến thể bản văn.
- **Tường lửa kiểm thử tự động**: 79/79 test cases Pytest pass 100% trên cả 2 kho lưu trữ (`scratch` và `E:\kinhthanh`).

### 5. Khắc Phục Lỗi Hiển Thị & Khả Năng Tiếp Cận Trợ Lý Kimchi AI (17/10/2026)
- **Sự cố phát hiện**: Người dùng phản hồi *"tôi không thấy nó hoạt động"* khi truy cập `http://localhost:8089`.
- **Nguyên nhân cốt lõi**:
  1. Trình duyệt cache tĩnh `js/app.js` và `css/components.css` (HTTP 304).
  2. Cửa sổ AI nổi (`#floating-ai-widget`) mặc định có class `hidden`, người dùng chỉ thấy một nút nhỏ ở góc dưới màn hình.
  3. Thanh điều hướng đầu trang (`main-header`) và thanh tab (`nav-links`) trước đó chưa có nút bấm trực quan để kích hoạt Berea AI.
- **Biện pháp xử lý triệt để**:
  1. **Thêm Nút Kích Hoạt Nổi Bật Trên Header**:
     - Thêm nút `#header-ai-trigger-btn` dạng pill mạ vàng ánh kim (`.header-ai-pill`) ngay cạnh nút chọn bản dịch.
     - Thêm nút tab `#top-nav-ai-btn` (`.ai-nav-btn`) trên thanh điều hướng chính (`.nav-links`).
  2. **Tự Động Mở Sẵn Trợ Lý Khi Tải Trang (Auto-Open On Load)**:
     - Thêm phương thức `openFloatingAI()` và `toggleFloatingAI()`.
     - Tự động gọi `openFloatingAI()` sau 600ms khi trang tải xong với lời chào giới thiệu chi tiết, huy hiệu mô hình (`Berea Offline`), 4 nút vai trò chuyên gia và thanh thẻ gợi ý câu hỏi.
  3. **Xóa Sổ Caching (Cache-Busting)**:
     - Gắn query param `?v=2.8.0-kimchi` vào `<script type="module" src="js/app.js?v=2.8.0-kimchi"></script>` và `<link rel="stylesheet" href="css/components.css?v=2.8.0-kimchi">`.
  4. **An Toàn Hermeneutics Engine**:
     - Sử dụng `hermeneuticsEngine.getGenreGuide(genreKey)` an toàn với fallback.
  5. **Bảo toàn 100% Test Pass**: 80/80 pytest pass trên cả Antigravity Scratch và `E:\kinhthanh`.

### 6. Nâng Cấp Đăng Nhập Quản Trị Viên Chuẩn 2 Trường & Quyền Chỉnh Sửa Toàn Bộ Bài Viết (17/10/2026)
- **Vấn đề phản hồi**:
  1. Hộp thoại xác thực quản trị cũ chỉ có 1 ô nhập mã và khi nhập sai xuất hiện alert: *"Mã bí mật không chính xác. Mẹo: Mã mặc định là logos777"* làm lộ thông tin bảo mật.
  2. Quản trị viên cần được phép chỉnh sửa toàn bộ các bài viết (cả bài Khảo luận Thần học lẫn bài Chia sẻ Cộng đồng).
- **Giải pháp triển khai**:
  1. **Chuẩn Hóa Đăng Nhập Quản Trị Viên (Username + Password)**:
     - Giao diện gồm 2 trường chuẩn: **Tên đăng nhập** (`#admin-username-input`) và **Mật khẩu** (`#admin-password-input`) kèm nút bấm hiện/ẩn mắt mật khẩu.
     - **Triệt tiêu toàn bộ gợi ý lộ mật khẩu**: Loại bỏ hoàn toàn thông báo alert gợi ý mật khẩu mặc định. Thay bằng khung lỗi inline (`#admin-auth-error-msg`) bảo mật, tinh tế: *"Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!"*.
     - Phương thức `state.verifyAdminCredentials(username, password)` với tài khoản quản trị viên mặc định `admin` / `logos777` (có thể tùy biến qua storage) và giữ `verifyAdminSecret` để bảo toàn tương thích ngược.
  2. **Toàn Quyền Chỉnh Sửa TOÀN BỘ Bài Viết (Full Article CRUD)**:
     - **Bài viết Khảo Luận Thần Học (Master Blogs)**: Nút **[Sửa Bài]** (`.btn-edit-article`) và **[Xóa]** (`.btn-delete-article`) kích hoạt modal Article Studio với đầy đủ nội dung, hình ảnh bìa và tài liệu đính kèm.
     - **Bài viết Cộng Đồng (Community Posts)**: Bổ sung phương thức `getCommunityPost(postId)` và `updateCommunityPost(postId, updatedData)` trong `BlogSystem`. Thêm nút **[Sửa Bài]** (`.btn-edit-community-post`) trên từng thẻ bài viết và trong Hàng Đợi Duyệt Bài.
     - **Modal Chỉnh Sửa Bài Viết Cộng Đồng** (`#admin-community-post-modal`): Cho phép Quản trị viên hiệu chỉnh Tiêu đề, Tác giả, Trạng thái (Đã duyệt / Chờ duyệt / Từ chối), Nhánh thảo luận và Toàn văn nội dung bài chia sẻ, lưu bền vững vào `storage.js`.
  3. **Kiểm thử tự động**: 80/80 pytest pass 100% trên cả 2 kho lưu trữ (`scratch` và `E:\kinhthanh`).

### 7. Loại Bỏ Tooltip Che Khuất Văn Bản Kinh Thánh Khi Rê Chuột (17/10/2026)
- **Vấn đề phản hồi**: Khi người dùng rê chuột qua thẻ đối chiếu bản dịch (`.parallel-verse-card`), trình duyệt hiện popup tooltip native to màu trắng che khuất dòng chữ Lời Chúa đang đọc.
- **Nguyên nhân**: Thẻ `.parallel-verse-card` chứa thuộc tính `title="Nhấp để mở toàn bộ phân đoạn..."`, trong khi trên thẻ đã có sẵn nút *"Mở cửa sổ đọc"* và dòng chú thích dưới chân thẻ.
- **Giải pháp**: Xóa bỏ thuộc tính `title` trên `.parallel-verse-card` và `.card-popout-btn`, thay bằng `aria-label="Mở cửa sổ đọc"`. Người đọc có thể thoải mái rê chuột, bôi đen, sao chép văn bản mà không bị bất kỳ tooltip nào che khuất.
- **Kiểm thử**: Đã bổ sung assertion trong `test_reading_version_and_popout.py` đảm bảo không tái phát. 80/80 tests pass 100%.

### 8. Tối Ưu Giao Diện Di Động: Toàn Màn Hình Đọc & Thanh Đối Chiếu Siêu Gọn (18/10/2026)
- **Yêu cầu của anh Jimmy**: Trên giao diện điện thoại, chỉ để thanh bản đối chiếu để tăng tối đa diện tích hiển thị đọc Kinh Thánh; loại bỏ thanh điều hướng đáy 5 nút rườm rà.
- **Giải pháp triển khai**:
  1. **Ẩn hoàn toàn thanh đáy 5 nút (`#mobile-bottom-nav`)**: Đặt `display: none !important;` trên cả `layout.css` và `components.css` cho `@media (max-width: 991px)`.
  2. **Giải phóng không gian đọc**: Giảm padding đáy của `#focus-reader` từ 80px xuống 1.5rem, loại bỏ hoàn toàn khoảng trống chết ở cuối màn hình điện thoại.
  3. **Thanh/Nút "Đối Chiếu" Tinh Gọn Trên Header (`#mobile-header-compare-btn`)**:
     - Ghim nổi bật trên Mobile Header cạnh nút chọn Sách/Chương và Bản dịch chính.
     - Khi chưa kích hoạt: Nút mang nhãn "Đối Chiếu", bấm vào sẽ chuyển thẳng sang chế độ đọc so sánh song song đa bản dịch trực tiếp theo từng câu.
     - Khi đang kích hoạt: Nút mang nhãn "Đọc Thường" (active sky/gold), bấm vào sẽ quay lại đọc văn bản đơn bản thuần khiết.
  4. **Nút Đổi Màu Sắc 6 Theme (`#theme-toggle-btn`)**: Giữ dạng nút tròn 32x32px nhỏ gọn trên Mobile Header.
  5. **Bảo tồn 100% Desktop**: Giao diện máy tính 2 cột song song không bị ảnh hưởng.
### 9. Nâng Cấp Giao Diện Header Toàn Diện Theo Phản Hồi Hình Ảnh (19/10/2026)
- **Yêu cầu của anh Jimmy**:
  1. Cho cây thập tự thành ảnh GIF động phát sáng.
  2. Thu gọn khối logo và tên thương hiệu (bỏ bớt chữ dài dòng) để tiết kiệm không gian.
  3. Mở rộng thanh tìm kiếm nổi bật, cho phép tìm kiếm địa chỉ Kinh Thánh, câu Kinh Thánh kèm gợi ý thông minh.
  4. Thu nhỏ nút Thống Kê và hiển thị trực tiếp số lượng người xem.
  5. Thu nhỏ nút Khách / Quản trị viên.
- **Giải pháp triển khai**:
  1. **Thánh Giá GIF Hoàng Gia Động (`data/cross_holy_gold.gif`)**:
     - Tạo script Python Pillow `scripts/generate_cross_gif.py` render 20 khung hình 64x64px, ánh sáng vàng kim chuyển động mượt mà với luồng sáng quét chéo và ngôi sao lấp lánh ở tâm chữ thập.
     - Sử dụng nền trong suốt chuẩn GIF (transparency key) hoạt động hài hòa trên cả 6 bảng màu (Dark, Parchment, Sepia, Light, Midnight, Sage).
  2. **Thu gọn Logo & Brand Name**:
     - Rút gọn tiêu đề trên 1 dòng duy nhất: `LOGOS MULTIVERSE`.
     - Ẩn khẩu hiệu dài dòng `.brand-tagline`, giải phóng hơn 180px chiều ngang.
  3. **Mở Rộng Thanh Tìm Kiếm & Gợi Ý Thông Minh (Omni-Search)**:
     - Mở rộng thanh input (`min-width: 240px`, `max-width: 380px`, `flex: 1 1 280px`).
     - Tự động hiển thị thẻ Gợi Ý Địa Chỉ & Phân Đoạn Phổ Biến (Giăng 3:16, Thi Thiên 23, Rô-ma 8:28, Sáng Thế Ký 1:1, v.v.) ngay khi nhấp chuột vào ô tìm kiếm.
     - Nâng cấp thuật toán `searchScripture` trong `bible-engine.js`: Nhận diện linh hoạt mọi biến thể tọa độ ("Giăng 3:16", "Giăng đoạn 3 câu 16", "Giăng 3 16", "JHN 3 16") và tên sách đơn lẻ ("Giăng", "Rô-ma", "Khải Huyền").
     - Hỗ trợ nhấn `Enter` để nhảy ngay đến phân đoạn/câu tìm kiếm hoặc mở tra cứu toàn văn HTTLVN.
  4. **Nút Thống Kê Thu Nhỏ & Hiển Thị Lượt Đọc**:
     - Thu gọn kích thước nút `#admin-analytics-btn` và hiển thị trực tiếp số lượt truy cập (`1.8k xem`) từ `storage.getAnalytics()`.
     - Mở bảng Dashboard chi tiết khi nhấp vào.
  5. **Nút Khách Thu Nhỏ**:
     - Tinh chỉnh padding và font-size của `#role-auth-btn` gọn gàng, vừa vặn.
  6. **Kiểm thử tự động**: Xây dựng `test_header_improvements.py`, đạt 96/96 pytest pass 100% trên cả 2 workspace.


### 10. Phục Hồi Chuẩn Xác Giao Diện Máy Tính, Trình Bày Interlinear Scripture4All & Chia Đôi Màn Hình Di Động (19/10/2026)
- **Yêu cầu của anh Jimmy**:
  1. Giao diện máy tính: Giữ lại giao diện đã duyệt, không để thanh chọn bản dịch đẩy hỏng đối chiếu.
  2. Giao diện điện thoại: Chia đôi màn hình trên là bản gốc/bản đọc chính, dưới là bản đối chiếu; ẩn các mục tab để tăng diện tích hiển thị; đặt nút chọn bản dịch ở chỗ khác.
  3. Giữ kiểu trình bày Scripture4All: Chữ gốc, Phiên âm, Mã Strong's, Ngữ pháp, Nghĩa đen tiếng Anh in hoa màu Cyan/Teal (`#0891b2`), Nghĩa tiếng Việt màu Xanh lá (`#16a34a`), không dùng ô khối đóng khung.
- **Giải pháp triển khai**:
  1. **Khôi Phục Giao Diện Máy Tính Đã Duyệt**:
     - Ẩn hoàn toàn `#drawer-version-bar` inline khỏi tầm nhìn (`display: none !important;`), khôi phục giao diện bảng khảo cứu thoáng đãng, không bị đẩy thụt xuống dưới.
  2. **Giao Diện Di Động Chia Đôi Màn Hình (Top/Bottom Split View)**:
     - Nửa trên (`#app-body`): Hiển thị bản đọc chính trọn vẹn chương để người dùng cuộn và chạm vào câu muốn xem.
     - Nửa dưới (`#drawer-inspector`): Cố định ở dưới đáy chiếm 56vh (có thể vuốt kéo lên 82vh) hiển thị trực tiếp danh sách đối chiếu đa bản dịch cho câu đang chọn.
     - Ẩn toàn bộ 4 tab (`.drawer-tabs { display: none !important; }`) trên điện thoại để dành toàn bộ chiều cao cho văn bản đối chiếu.
     - Nút "Chọn Bản Dịch" được đưa lên góc trên Drawer Header (`#drawer-manage-versions-btn`) và tích hợp trực tiếp vào thanh tiêu đề thẻ đối chiếu (`#parallel-add-versions-btn`).
  3. **Chuẩn Hóa Scripture4All Interlinear (6 Tầng Màu Sắc)**:
     - Tầng 1: Chữ gốc Hy Lạp / Hê-bơ-rơ (WLC niqqud / ScrTR hoa).
     - Tầng 2: Phiên âm (`.s4a-translit`).
     - Tầng 3: Mã Strong's (`.s4a-strong`).
     - Tầng 4: Ngữ pháp (`.s4a-pos`).
     - Tầng 5: **Nghĩa đen Tiếng Anh In Hoa Màu Cyan/Teal (`#0891b2`)** (Dark mode: `#38bdf8`) đúng như mũi tên đỏ.
     - Tầng 6: **Nghĩa Tiếng Việt Màu Xanh Lá (`#16a34a`)** (Dark mode: `#4ade80`).
  4. **Kiểm Thử & Xuất Bản**:
     - 102/102 Pytest suites pass 100%.
     - Đã đồng bộ sang Antigravity Scratch và đóng gói `E:\KINHTHANH WEB.zip`.


### 11. Cổng Tĩnh Nguyện & Dưỡng Linh Cổ Điển Làm Nền Chính & Vận Hành Toàn Bộ Tính Năng (25/10/2026)
- **Yêu cầu & Ngữ cảnh**:
  1. Người dùng yêu cầu lấy giao diện Cổng Tĩnh Nguyện & Dưỡng Linh làm nền chính cho toàn trang web.
  2. Bỏ các mục gạch chéo trên thanh menu, chuyển sang thanh subnav cố định màu xanh ô-liu.
  3. Kiểm tra và kích hoạt toàn bộ các chức năng chưa hoạt động trong Box ĐỌC, NGHE, TÌM và TIỂU MỤC.
- **Giải pháp & Thành quả kỹ thuật**:
  1. **Nhúng Sẵn 66 Sách Tĩnh Cho Toàn Bộ Dropdown**:
     - Cả 4 thẻ `<select>` (`#portal-read-book-select`, `#portal-listen-book-select`, `#portal-search-from-book`, `#portal-search-to-book`) được nhúng trực tiếp 66 `<option>` từ Sáng-thế Ký đến Khải-huyền ngay trong HTML tĩnh, loại bỏ hoàn toàn hiện tượng dropdown trắng.
  2. **Modal Tiện Ích Cổng Tĩnh Nguyện (`#portal-utility-modal`)**:
     - **Câu Gốc Yêu Thích**: Tuyển tập 36 câu Kinh Thánh nền tảng (Bình An, Cứu Rỗi, Sức Mạnh, Thành Tín) kèm nút Đọc đoạn, Nghe âm thanh và Sao chép.
     - **Đố Kinh Thánh**: 10 câu trắc nghiệm tương tác chấm điểm tức thì, giải nghĩa chi tiết và địa chỉ Kinh Thánh dẫn chứng.
     - **Kinh Thánh Đối Đáp**: 8 bài đọc phụng vụ chuẩn HTTLVN (Chủ sự / Hội chúng).
     - **Thánh Kinh Lược Khảo**: Khảo quát toàn diện 66 sách (tác giả, niên đại, chủ đề, số chương).
     - **Truyện Tích Thánh Kinh**: 8 thiên truyện đức tin lớn (Sáng Tạo, Nô-ê, Áp-ra-ham, Giô-sép, Biển Đỏ, Đa-vít, Đa-ni-ên, Giáng Sinh).
     - **Thánh Kinh Từ Điển**: Tra cứu nhanh 40+ nhân vật, địa danh và thuật ngữ thần học.
  3. **Thanh Phát Âm Thanh Docked & Danh Sách Nghe (Playlist)**:
     - Xây dựng `#portal-audio-player-bar` cố định dưới đáy màn hình, sử dụng Web Speech API tiếng Việt (`vi-VN`) đọc từng câu mượt mà, tự động highlight câu đang đọc (`.verse-reading-active`) và cuộn màn hình.
     - Nút `+Playlist` lưu phân đoạn vào `localStorage` và Modal `#portal-playlist-modal` quản lý phát lại.
  4. **Hệ Thống Toast Thông Báo (`#app-toast-container`)**:
     - Thay thế các hộp thoại alert gián đoạn bằng toast thông báo êm dịu, hiện đại.
  5. **Kiểm thử tự động**:
     - Bộ test tăng lên 128/128 tests Pytest đạt 100% PASS (2.74s).
     - Đồng bộ toàn diện sang Antigravity Scratch.
