# -*- coding: utf-8 -*-
"""Prune memory.md to stay well within 24,000 characters limit."""

with open("E:/kinhthanh/memory.md", "r", encoding="utf-8") as f:
    text = f.read()

# Update total tests at top
text = text.replace("- **Trạng thái kiểm thử**: 145/145 Pytest suites PASS (100% Green).", "- **Trạng thái kiểm thử**: 159/159 Pytest suites PASS (100% Green).")

# Condense Milestone 33
old_m33 = """### 33. Tái Cấu Trúc Bố Cục Thẻ Nghiệp Vụ Khung Đối Chiếu Lưới 2x2 Triệt Tiêu Chèn Lấn Chữ (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"bị đè lên nhau hết rồi. Mời bạn xử lý"* (kèm ảnh khoanh đỏ 4 tab `So Sánh Bản Dịch`, `Câu Tham Chiếu`, `Ẩn Dụ & Biểu Tượng`, `Bối Cảnh & Thể Loại` đè chữ lên nhau).
- **Nguyên nhân gốc rễ**: CSS trước đây đặt `flex: 1 1 calc(25% - 5px)` và `white-space: nowrap` nhưng độ rộng drawer chỉ 310px-385px. Các nhãn chữ dài 14-18 ký tự tràn ra ngoài biên và đè lên nhau trên cùng 1 hàng.
- **Thực hiện**:
  1. *Chuyển sang Lưới 2x2 Cân Đối*: Áp dụng `flex: 1 1 calc(50% - 6px); min-width: 0; max-width: calc(50% - 3px);` kết hợp `overflow: hidden; text-overflow: ellipsis;` tự động chia 2 hàng x 2 nút chuẩn xác.
  2. *Mở rộng vùng đọc*: Tăng `--drawer-width` lên `clamp(330px, 28vw, 420px)` cho trải nghiệm đối chiếu thoáng đãng.
  3. *Bổ sung Tooltip*: Thêm thuộc tính `title` vào từng nút tab trong `index.html`.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_drawer_tabs_2x2_grid_immunity_against_overlap` vào `tests/test_ui_foundation.py`. Toàn bộ **150/150 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace."""

new_m33 = """### 33. Tái Cấu Trúc Bố Cục Thẻ Nghiệp Vụ Khung Đối Chiếu Lưới 2x2 (26/10/2026)
- Sửa lỗi đè chữ 4 tab drawer bằng lưới 2 hàng x 2 nút (`flex: 1 1 calc(50% - 6px)`), mở rộng `--drawer-width` lên 330px-420px, bổ sung tooltip `title`. Đạt 150/150 tests pass."""

# Condense Milestone 34
old_m34 = """### 34. Khắc Phục Lỗi Gõ Chữ Tiếng Việt Bị Nhảy Con Trỏ / Ngược Ký Tự Trong Thánh Kinh Từ Điển (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"chỗ mục này gõ chữ bị lỗi"* (kèm ảnh chụp mũi tên đỏ chỉ vào ô tìm kiếm Thánh Kinh Từ Điển `#dict-search-input` bị gõ ngược ký tự `------gdjlgdsnahldasnnab`).
- **Nguyên nhân gốc rễ**: Phương thức `renderUtilityDict()` gán sự kiện `input` nhưng lại thực thi xóa và render lại toàn bộ `bodyContainer.innerHTML` sau mỗi phím gõ. Việc hủy và tái tạo thẻ `<input>` trên mỗi ký tự làm mất phiên gõ của bộ gõ tiếng Việt (Unikey/EVKey Telex), nhảy con trỏ về vị trí 0 (đầu dòng) và khiến các ký tự tiếp theo bị đẩy ngược về sau.
- **Thực hiện**:
  1. *Khởi tạo Input Cố định (DOM Persistence)*: Tách biệt cấu trúc ô tìm kiếm và danh sách kết quả `#dict-entries-list`. Ô `<input>` chỉ được tạo một lần duy nhất khi mở từ điển.
  2. *Cập nhật Độc lập (`updateUtilityDictList`)*: Khi gõ phím, chỉ lọc dữ liệu `BIBLE_DICT_DATA` và nạp vào `#dict-entries-list`, tuyệt đối không bao giờ chạm vào DOM của ô nhập liệu. Con trỏ và bộ gõ Telex/VNI hoạt động 100% tự nhiên.
  3. *Tối ưu Tìm Kiếm & UI*: Hỗ trợ tìm kiếm tiếng Việt không dấu (`normalize`), thêm icon kính lúp sang trọng và nút `×` xóa nhanh từ khóa.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_bible_dictionary_search_input_integrity_and_ime_stability` vào `tests/test_portal_utility_cms.py`. Toàn bộ **151/151 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace."""

new_m34 = """### 34. Khắc Phục Lỗi IME Bộ Gõ Tiếng Việt Trong Thánh Kinh Từ Điển (26/10/2026)
- Sửa lỗi nhảy con trỏ / gõ ngược tiếng Việt trong `#dict-search-input` bằng cơ chế DOM Persistence (input tạo 1 lần cố định, chỉ cập nhật `#dict-entries-list`), hỗ trợ tìm kiếm không dấu. Đạt 151/151 tests pass."""

# Condense Milestone 35
old_m35 = """### 35. Xây Dựng & Tích Hợp Từ Điển Strong's Hy Lạp & Hê-bơ-rơ Vào Hộp Chọn Tài Liệu Tham Khảo (26/10/2026)
- **Yêu cầu từ anh Jimmy**: *"từ điển chưa có"* (kèm ảnh chụp hộp chọn `TÀI LIỆU THAM KHẢO` ➔ mục `5. Từ Điển Strong's Hy Lạp/Hê-bơ-rơ`).
- **Nguyên nhân gốc rễ**: Khi chọn mục 5 trong `#portal-ref-docs-select`, mã trước đây chỉ đổi version sang Interlinear và chuyển view Kinh Thánh, chưa có hộp thoại tra cứu từ điển Strong's chuyên dụng.
- **Thực hiện**:
  1. *Cơ Sở Dữ Liệu Strong's*: Xây dựng 43 mục từ căn bản nguyên ngữ Hê-bơ-rơ Cựu Ước (Mã H: `Bereshit H7225`, `Bara H1254`, `Elohim H430`, `Yahweh H3068`, `Shalom H7965`, `Hesed H2617`...) và Hy Lạp Tân Ước (Mã G: `Logos G3056`, `Theos G2316`, `Agape G26`, `Pneuma G4151`, `Charis G5485`...), lưu vào `data/utility-strong-dict.json` và `STRONG_DICT_DATA` trong `portal-data.js`.
  2. *Hệ Thống Tab 4 Chế Độ*: `Bách Khoa Địa Danh`, `Tất Cả Strong's`, `Strong's Hê-bơ-rơ`, `Strong's Hy Lạp`.
  3. *Giao Diện Tra Cứu Chuyên Sâu (`renderUtilityStrong`)*: Tìm kiếm theo mã Strong, chữ nguyên ngữ hoặc nghĩa tiếng Việt/Anh; hiển thị chữ nguyên bản đúng font (SBL Hebrew/Greek), phiên âm La-tinh, giải nghĩa chi tiết và nút `[Đọc Lời Chúa]` dẫn thẳng đến phân đoạn.
  4. *Kích Hoạt Chọn Nhanh*: Cập nhật `portal-ref-docs-select` khi chọn `strong` lập tức mở thẳng Từ Điển Strong's.
- **Kiểm thử & Đồng bộ**: Bổ sung `test_strongs_greek_hebrew_dictionary_integration` vào `tests/test_portal_utility_cms.py`. Toàn bộ **152/152 bài test Pytest PASS 100%**. Đồng bộ hoàn tất sang Antigravity mirror workspace."""

new_m35 = """### 35. Xây Dựng & Tích Hợp Từ Điển Strong's Hy Lạp & Hê-bơ-rơ (26/10/2026)
- Tích hợp CSDL 43 mục từ Strong's (Hê-bơ-rơ & Hy Lạp) vào `data/utility-strong-dict.json`, giao diện 4 tab tra cứu chuyên sâu (`renderUtilityStrong`) hỗ trợ tìm kiếm mã Strong, phiên âm và nút đọc Lời Chúa. Đạt 152/152 tests pass."""

text = text.replace(old_m33, new_m33)
text = text.replace(old_m34, new_m34)
text = text.replace(old_m35, new_m35)

milestone_42 = """
- **Milestone 42 (2026-10-27)**: SPA Deep Link Hash Routing & URL Branch Synchronization:
  - Khắc phục triệt để thắc mắc của người dùng về việc khi bấm vào các Tab chính (Cổng Tĩnh Nguyện, Đọc Kinh Thánh, KT Đối Chiếu, Blog Chuyên Sâu, Nhánh Cộng Đồng, Media & Video, Dâng Hiến) thì thanh địa chỉ URL vẫn giữ nguyên `kinhthanh-sigma.vercel.app/` không hiện nhánh link.
  - Triển khai kiến trúc SPA Hash Routing chuẩn:
    1. Đồng bộ 2 chiều: Khi nhấp tab (`switchView`) hoặc đổi sách/chương (`PASSAGE_CHANGED`), hệ thống tự động cập nhật URL hash tức thì (`#portal`, `#bible/JHN/1`, `#tsk/JHN/1`, `#blog`, `#community`, `#media`, `#donate`) bằng `history.pushState` và `history.replaceState`.
    2. Deep Linking: Người dùng có thể chia sẻ hoặc mở link trực tiếp vào bất kỳ tab hoặc chương nào (ví dụ `#bible/2CO/11`, `#blog`, `#donate`).
    3. Trình duyệt Back / Forward: Bắt sự kiện `popstate` và `hashchange` điều hướng mượt mà không tải lại trang.
    4. Nút Brand Home Logo chuyển về `#portal` (trang chủ Cổng Tĩnh Nguyện).
  - Bổ sung Unit Test `test_spa_hash_routing_and_deep_linking_contract` trong `test_portal_and_header_sticky.py`.
  - Bộ kiểm thử toàn diện đạt 159/159 tests PASS 100%. Đã sync mirror và deploy lên Vercel.
"""

text = text.rstrip() + "\n" + milestone_42

print(f"Pruned length: {len(text)} characters (Limit: 24,000)")
assert len(text) <= 24000, f"Exceeded 24,000 characters limit: {len(text)}"

with open("E:/kinhthanh/memory.md", "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS: memory.md pruned and updated successfully!")
