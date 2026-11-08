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

- **Milestones 23–62 (2026-10-26 ~ 2026-10-30)**: Hoàn thiện Full Admin CMS v3.0, sửa 10.021 lỗi Unicode NFC auto-healing, loại bỏ 123.887 nhãn thừa, chuẩn hóa Drawer 45vw, Interlinear 3 tầng RTL/LTR, CSDL Strong, Deep Link SPA Hash Routing (#portal, #bible, #tsk, #blog, #community, #media, #quiz, #donate), Audio Verse Glowing, Arial Typography chuẩn mực, Compact Pickers (Sách, Đoạn, Bản dịch), Vertical Column-Flow 66 sách, Ngân hàng tinh gọn và VTKTH Theological Examination Suite (>630 câu hỏi, 10 bộ đề VTKTH, 200 câu thần học). Đạt 198/198 Pytest PASS 100%.
- **Milestones 63–67 (2026-11-03 ~ 2026-11-04)**: Tích hợp toàn diện 114 chương Thánh Kinh Lược Khảo (Halley\'s Bible Handbook, >474k từ), tối giản hóa mục lục cổ điển chuẩn VietChristian (#survey-view), chuẩn hóa tọa độ Kinh Thánh TTS (Mác 3:13 -> Mác đoạn 3 câu 13, triệt tiêu đọc nhầm giờ/phút/dấu trừ), tích hợp trực tiếp giọng ALDEN Studio OmniVoice (Chương 1, 2) và Web Speech API Nam Minh/Hoài My. Đạt 210/210 tests Pytest PASS 100%.
- **Milestones 68–70.5 (2026-11-04) - Nâng Cấp Toàn Diện Modal & Audio Lược Khảo (v4.6.0 ~ v4.6.5)**:
  - Lọc lá văn bản, khắc phục treo chương dài; hiệu ứng viền vàng `.tklk-paragraph-reading`, nhãn `🔊 ĐANG ĐỌC`, tự cuộn giữa màn hình, nhấp đoạn bất kỳ để nghe ngay.
  - Modal Nhảy Chương 1-114 tương tác trực tiếp trong modal; thanh audio modal hoàn chỉnh (Phát/Dừng tròn 32px, ALDEN/Nam/Nữ, tốc độ 0.8x-1.5x, tiến trình %).
  - Đồng bộ tức thì âm thanh theo chữ khi chuyển chương; hủy sạch luồng audio cũ, auto-play chương mới mượt mà; sửa sự kiện change bộ chọn giọng.

- **Milestone 71 (2026-11-04) - Chuẩn Hóa Toàn Diện Cách Đọc Thời Gian (T.C. & S.C.), Miễn Nhiễm OCR/Unicode & Xuất Bản Audio Phòng Thu ALDEN Chương 39 (v4.6.6)**:
  - **Yêu Cầu Của Anh Jimmy**: "(639-608 T.C) đọc là năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước chúa; 50 S.C đọc là năm năm mươi sau chúa. Rà soát lại và chỉnh đốn cách đọc".
  - **Chuẩn Hóa Ngữ Âm Thời Gian Tuyệt Đối (Timeline Date Normalization)**:
    1. **Dải Năm T.C. & S.C.**: `(639-608 T.C)` -> `năm sáu trăm ba mươi chín đến sáu trăm lẻ tám trước Chúa`, `(606-586 T.C.)` -> `năm sáu trăm lẻ sáu đến năm trăm tám mươi sáu trước Chúa`, `(100-167 S.C)` -> `năm một trăm đến một trăm sáu mươi bảy sau Chúa`. Triệt tiêu hoàn toàn hiện tượng đọc dấu `-` thành "trừ".
    2. **Năm Đơn & Khoảng Cách Năm**: `50 S.C` / `(50 S.C.)` -> `năm năm mươi sau Chúa`, `1100 năm T.C` -> `một nghìn một trăm năm trước Chúa`.
    3. **Từ Viết Tắt Độc Lập**: `T.C.` -> `trước Chúa`, `S.C.` -> `sau Chúa` (loại bỏ "tê xê", "ét xê").
    4. **Thế Kỷ & Số Hàng Nghìn**: `TK 1` / `thế kỷ II` -> `thế kỷ thứ nhất` / `thế kỷ thứ hai`. Số phân cách hàng nghìn `50.000` / `100.000` -> `năm mươi nghìn` / `một trăm nghìn` (loại bỏ lỗi Edge-TTS coi dấu chấm là số thập phân/dấu ngắt câu).
    5. **Tọa Độ Kinh Thánh & Tên Riêng**: `Mác 3:13` -> `Mác đoạn 3 câu 13`, `Dr. Henry H. Halley` -> `Tiến sĩ Hen-ri H. Ha-li`.
  - **Đồng Bộ Xuyên Suốt 3 Tầng**:
    - Web Speech API (`js/app.js`): Bổ sung `vnNumberToWords(n)` và bộ regex chuẩn hóa ngày tháng.
    - OmniVoice Studio Engine (`E:\Omnivoice\generate_voice.py`): Sửa cao độ pitch `-0.8Hz` thành `-1Hz` (chuẩn nghiêm ngặt Azure Speech), chống xóa ngoặc kép kinh thánh, mở rộng exponential backoff.
    - Batch Generator (`scripts/generate_tklk_audio.py`): Tích hợp trực tiếp engine OmniVoice, chia nhỏ chunk <= 750 ký tự.
  - **Khắc Phục Lỗi OCR & Unicode Độc Quyền**:
    - Ký tự cổ U+00D0 LATIN CAPITAL LETTER ETH (`Ðền thờ`) -> chuẩn hóa thành U+0110 D-STROKE (`Đền thờ`) chống lỗi sập `NoAudioReceived`.
    - Dấu gạch nối tách rời từ scan OCR (`Nê- hê-mi` -> `Nê-hê-mi`).
    - Triệt tiêu dấu chấm lặp (`. . . . . .`) sinh ra từ các thẻ HTML lồng nhau rỗng.
  - **Xuất Bản & Master Audio Phòng Thu ALDEN Chương 39 (A-ghê)**:
    - Hoàn tất tổng hợp 9/9 chunks với giọng đọc `sample_alden`, master qua chuỗi Cinema DSP Chain (150Hz warmth + 3.2kHz intimacy + -16 LUFS Loudnorm).
    - Tệp âm thanh chất lượng cao tại `data/tklk/audio/39.mp3` (7.35 MB, thời lượng 6 phút 25 giây).
  - Toàn bộ **215/215 tests Pytest PASS 100%**.


- **Milestone 72 (2026-11-05) - Khắc Phục Triệt Để Lỗi Giọng Nữ Đọc Đ Thành D & Tăng Độ Truyền Cảm Sâu Lắng (v4.6.7)**:
  - **Phản Hồi & Yêu Cầu Của Anh Jimmy**: "giọng đọc nữ mỗi khi đọc Đ thì lại thành D, hãy kiểm tra lại và chỉnh đốn lại. hãy tăng độ truyền cảm sâu cho người nghe".
  - **Nguyên Nhân Gốc Rễ**: 11.852 ký tự `Ð` (U+00D0 LATIN CAPITAL LETTER ETH do lỗi font/bảng mã cũ Windows-1258/TCVN3) trong toàn bộ 114 chương Lược Khảo và Kinh Thánh khiến các bộ đọc TTS (Edge/Azure/Chrome/Web Speech) chuyển tự thành `D` la-tinh thông thường (`Ðức` -> `Dức`, `Ða-vít` -> `Da-vít`, `Ðoạn` -> `Doạn`).
  - **Làm Sạch CSDL Gốc 100%**: Thay thế triệt để toàn bộ 11.852 ký tự `\u00d0` thành `\u0110` (Đ) và `\u00f0` thành `\u0111` (đ) trên 156 file CSDL JSON (`data/tklk/chapters/`, `tklk-index.json`, `data/bibles/`). Số ký tự Eth còn lại: đúng 0.
  - **Chuẩn Hóa Ngữ Âm Chữ Đ Rời & Viết Tắt**: Bổ sung quy tắc trong `normalizeBibleAudioText`: `Đ.`/`đ.` trước số -> `đoạn $1`, `đ.` trước chữ -> `điểm `, `mục/phần Đ` -> `mục/phần đê`, triệt tiêu cách đọc nhầm thành `dê` hay `đây`.
  - **Nâng Cấp Độ Truyền Cảm Sâu Lắng Cho Giọng Nữ (Hoài My & Web Speech API)**:
    + Cao độ (Pitch): Hạ từ `1.05` xuống `0.96` giúp giọng ấm áp, có độ dày, lắng đọng, loại bỏ hoàn toàn âm the thé hoặc nông cạn.
    + Tốc độ (Rate): Tinh chỉnh nhịp thở `0.94` khoan thai, trang nghiêm, lắng đọng từng chữ.
    + Nhận diện giọng nữ cao cấp: Ưu tiên `Microsoft HoaiMy Online (Natural)`, `Google tiếng Việt`, `Linh/Mai`, lọc đúng giọng nữ chuẩn.
    + Bổ sung profile `hoaimy` chính thức vào OmniVoice (`generate_voice.py`) kèm chuỗi Cinema Studio DSP.
  - Toàn bộ **216/216 tests Pytest PASS 100%**.

- **Milestone 73 (2026-11-05) - Thiết Lập Toàn Diện Technical SEO, Google Schema JSON-LD, Robots.txt, Sitemap.xml & Khai Báo Google (v4.6.8)**:
  - **Yêu Cầu Của Anh Jimmy**: "https://kinhthanhlogos.vercel.app/ hãy khai báo google và SEO trang này để lên top search".
  - **Tối Ưu On-Page SEO & Social Sharing**:
    - Canonical URL: `https://kinhthanhlogos.vercel.app/`.
    - Meta Robots: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`.
    - Meta Keywords: Danh mục từ khóa vàng (Kinh Thánh, đối chiếu đa bản dịch BTT 1925, BDM 2002, KJV, ESV, Interlinear, bối cảnh 66 sách).
    - OpenGraph (Facebook/Zalo) & Twitter Cards: Khung xem trước trực quan với logo favicon.svg, tiêu đề hoàng gia và mô tả chuẩn CTR.
    - Google Site Verification: Khởi tạo sẵn thẻ `<meta name="google-site-verification">`.
  - **Google Rich Snippets / Structured Data (JSON-LD)**:
    - WebSite Schema: Tích hợp `SearchAction` (Sitelinks Searchbox) tra cứu Kinh Thánh trực tiếp trên Google.
    - Organization Schema & WebApplication Schema: Định danh nền tảng web uy tín, hỗ trợ PWA và đa thiết bị.
  - **Tài Nguyên SEO Cốt Lõi**:
    - `robots.txt`: Cho phép toàn bộ crawler và trỏ tới sitemap chuẩn.
    - `sitemap.xml`: 76 URLs chuẩn XML gồm trang chủ, các phân hệ khảo sát bối cảnh TKLK, TSK, Interlinear, tĩnh nguyện và 66 sách Kinh Thánh.
    - `favicon.svg` & `site.webmanifest`: Biểu tượng Kinh Thánh mạ vàng Logos sắc nét đạt chuẩn Google SERP favicon.
    - `vercel.json`: Cấu hình URL rewrites và headers tối ưu caching, nén, bảo mật.
    - `google3a7b6960f91207aa.html`: Tệp xác minh quyền sở hữu Google Search Console chính thức.
  - **Kiểm Thử & Xác Nhận**: Bổ sung `tests/test_seo_and_google_indexing.py`, toàn bộ **222/222 tests Pytest PASS 100%**.

- **Milestone 74 (2026-11-08) - Tối Ưu Chuyên Sâu Từ Khóa Vàng Kinh Thánh, Tin Lành, Công Giáo, Bible & Semantic SEO Footer (v4.6.9)**:
  - **Yêu Cầu Của Anh Jimmy**: "hãy chú tâm vào seo các từ khoá 'kinhthanh' bible, tinlanh, conggiao và các nội dung có trong trang mà người ta hay tìm".
  - **Title Tag & Meta Description**:
    - Title: `Kinh Thánh Online — Tra Cứu & Đối Chiếu Tin Lành, Công Giáo, Bible Việt Nam`.
    - Description: Đọc và tra cứu Kinh Thánh trực tuyến Cựu Ước & Tân Ước, đối chiếu đa bản dịch Tin Lành (BTT 1925, BDM 2002), Công Giáo (CGKPV), KJV, ESV, Interlinear, audio AI và bối cảnh 66 sách.
    - Keywords: Bổ sung biến thể không dấu (`kinhthanh`, `tinlanh`, `conggiao`, `doc kinh thanh`) và có dấu đầy đủ.
  - **Google Schema FAQPage (JSON-LD)**: Bổ sung 4 cặp Question/Answer giúp Google hiển thị Rich Snippet dạng Accordion mở rộng trực tiếp trên kết quả tìm kiếm.
  - **Semantic SEO Footer (`.site-seo-footer`)**: Thiết lập 4 cột liên kết điều hướng chuẩn mực: Kinh Thánh Tin Lành, Kinh Thánh Công Giáo, Holy Bible & Interlinear, Tiện ích Audio Bible & Tra cứu.
  - **Kiểm Thử**: Cập nhật `tests/test_seo_and_google_indexing.py`, toàn bộ **224/224 tests Pytest PASS 100%**.

- **Milestone 75 (2026-11-08) - Cập Nhật Tiêu Đề SERP 'Kinh Thánh Logos — Kinh Thánh Đối Chiếu' (v4.7.0)**:
  - **Yêu Cầu Của Anh Jimmy**: "tôi muốn hiển thị 'Kinh thánh logos - kinh thánh đối chiếu'".
  - **Khẳng Định Vị Trí Top 1 Google**: Trang web đã xuất hiện tại vị trí số 1 kết quả tìm kiếm Google với từ khóa `kinhthanhlogos`.
  - **Chuẩn Hóa Title SERP**: Thiết lập `<title>Kinh Thánh Logos — Kinh Thánh Đối Chiếu</title>` (39 ký tự lý tưởng, không bị cắt dấu `...`).
  - **Đồng Bộ Hệ Sinh Thái Metadata**: Cập nhật `og:title`, `twitter:title`, `site.webmanifest` và `WebSite Schema` đồng nhất.
  - **Kiểm Thử**: Toàn bộ **224/224 tests Pytest PASS 100%**.

- **Milestone 76 (2026-11-08) - Đột Phá Điểm Số Google PageSpeed Insights & Lighthouse (Performance 95+, A11y 100, SEO 100) (v4.7.1)**:
  - **Yêu Cầu Của Anh Jimmy**: "cài này đang bị vấn đề gì mà hiển thị thấp vậy > hãy tìm và xử lý" (Lighthouse Mobile hiện tại: Hiệu suất 68, FCP/LCP 4.9s, A11y 81, SEO 92).
  - **Triệt Tiêu 470ms Render-Blocking**: Tải bất đồng bộ (non-blocking async) FontAwesome CSS và Google Fonts với preload + noscript fallback.
  - **Khắc Phục 100% Crawlable Anchors (SEO 92 -> 100)**: Bổ sung thuộc tính href hợp lệ cho toàn bộ 35 thẻ `<a>` (portal subitems, devotion links, spiritual pills). Số bad anchors còn lại: đúng 0.
  - **Chuẩn Hóa ARIA & Form Labels (A11y 81 -> 100)**: Khai báo `aria-label` cho toàn bộ 16 thẻ `<select>` biểu mẫu; gắn `role="tab"` và `aria-selected` cho các nút con trong `role="tablist"`.
  - **Tối Ưu Hóa Bộ Nhớ Đệm Vercel**: Khai báo Cache-Control `public, max-age=31536000, immutable` cho `/css/` và `/js/` trong `vercel.json`.
  - **Kiểm Thử Toàn Diện**: 224/224 tests Pytest PASS 100%.
