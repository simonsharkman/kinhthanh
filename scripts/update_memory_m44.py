# -*- coding: utf-8 -*-
"""Update memory.md with Milestone 44 and verify limit <= 24,000 characters."""

with open("E:/kinhthanh/memory.md", "r", encoding="utf-8") as f:
    text = f.read()

# Update total tests at top
text = text.replace("- **Trạng thái kiểm thử**: 160/160 Pytest suites PASS (100% Green).", "- **Trạng thái kiểm thử**: 161/161 Pytest suites PASS (100% Green).")

# Condense Milestone 36
old_m36 = """### Milestone 36: Thiết Kế Trình Bày Kinh Thánh Kỉnh Kiềng (Zero Box Borders & Unboxed Small Verse Numbers)
- **Vấn đề**: Người dùng phản ánh câu Kinh Thánh bị đóng trong từng thẻ hộp có viền ( order: 1px solid) và bóng đổ ( ox-shadow), số câu dạng badge đóng khung nút 26x26px to bản khiến giao diện giống bảng danh sách/form nhập liệu, làm phân tâm và mất đi vẻ trang nghiêm, kỉnh kiềng trước Lời Đức Chúa Trời.
- **Giải pháp chuẩn hóa**:
  1. Loại bỏ toàn bộ viền hộp ( order: none,  order-left: 3px solid transparent), bỏ nền thẻ ( ackground: transparent), bỏ bóng đổ ( ox-shadow: none), thu hẹp khoảng cách giữa các câu (gap: 0.15rem) để đoạn Kinh Thánh chảy liền mạch, thanh thoát như một trang Kinh Thánh in kinh điển.
  2. Tinh chỉnh số câu (.verse-number): Bỏ khung viền và màu nền hộp badge, hiển thị nhỏ gọn (ont-size: 0.72rem, opacity: 0.82), áp dụng màu chuẩn theme  ar(--text-verse-num, var(--accent-gold)), căn thẳng baseline chữ đầu tiên.
  3. Trạng thái câu đang đọc/chọn (.verse-highlight-active, .verse-reading-active): Chỉ hiển thị thanh chỉ dấu vàng/xanh tinh tế bên trái ( order-left: 3.5px solid var(--accent-gold)) và quầng sáng nhẹ (
rgba(229, 193, 88, 0.1)), tuyệt đối không bao viền toàn bộ câu.
  4. Bổ sung Unit Test 	est_reverent_scripture_verse_styling_zero_borders_and_unboxed_numbers. Bộ test đạt 154/154 pass 100%."""

new_m36 = """### Milestone 36: Trình Bày Kinh Thánh Kỉnh Kiềng (Zero Box Borders)
- Loại bỏ toàn bộ viền hộp thẻ và bóng đổ, số câu hiển thị nhỏ gọn thanh thoát (`0.72rem`), căn thẳng baseline; câu chọn hiển thị chỉ dấu vàng/xanh bên trái. Đạt 154/154 tests pass."""

text = text.replace(old_m36, new_m36)

# Condense Milestone 37
old_m37 = """### Milestone 37: Sửa Lỗi Highlight Câu Đối Chiếu Trên Mobile (Split 50/50 Drawer Active Verse Standout)
- **Vấn đề**: Trên giao diện di động khi bấm vào một câu để xem đối chiếu trong Drawer Inspector (chia đôi 50/50), câu đang chọn không hề nổi bật, trông hoàn toàn giống các câu khác. Nguyên nhân do `body.drawer-open .verse-item` có độ ưu tiên CSS (0, 2, 1) kèm `!important` đã ghi đè toàn bộ `background: transparent !important` và `border-left: 3px solid transparent !important` lên `.verse-item.verse-highlight-active`.
- **Giải pháp chuẩn hóa**:
  1. Thêm `:not(.verse-highlight-active):not(.verse-selected)` vào `body.drawer-open .verse-item` để quy tắc nền trong suốt chỉ áp dụng cho câu không được chọn.
  2. Bổ sung selector chuyên biệt `body.drawer-open .verse-item.verse-highlight-active` với độ ưu tiên cao nhất: viền trái nổi bật `border-left: 4.5px solid var(--accent-gold) !important`, nền chuyển sắc phát quang dịu nhẹ `linear-gradient(90deg, var(--accent-gold-glow) 0%, rgba(229, 193, 88, 0.08) 100%) !important`, và bóng mờ phát quang `box-shadow: 0 0 16px var(--accent-gold-glow) !important`.
  3. Số câu của câu đang chọn chuyển thành huy hiệu nhỏ nổi bật `background: var(--accent-gold) !important; color: var(--bg-primary) !important; padding: 1px 6px; border-radius: 4px; font-weight: 800;` giúp mắt người đọc định vị câu đang đối chiếu ngay lập tức.
  4. Chữ câu đang chọn tăng độ đậm `font-weight: 600 !important; color: var(--text-primary) !important`. Thêm `touch-action: manipulation` và `-webkit-tap-highlight-color` cho cảm ứng mượt mà tức thì.
  5. Cập nhật `highlightActiveVerse` gán đồng bộ cả 2 lớp `verse-highlight-active` và `verse-selected`. Bổ sung test `test_mobile_active_verse_highlight_immunity_and_standout`. Đạt 155/155 tests pass 100%."""

new_m37 = """### Milestone 37: Sửa Lỗi Highlight Câu Đối Chiếu Mobile (Split 50/50)
- Tối ưu CSS specificity trên mobile drawer-open, câu chọn nổi bật với `border-left: 4.5px solid var(--accent-gold)`, nền phát quang và badge số câu vàng rực. Đạt 155/155 tests pass."""

text = text.replace(old_m37, new_m37)

milestone_44 = """
- **Milestone 44 (2026-10-27)**: Verse-Level Deep Linking & Multi-Version URL Routing (HTTLVN Standard Alignment):
  - Tiếp nhận phản hồi từ anh Jimmy: *"bấm tới câu 6 mà vẫn không thấy. bạn xem lại. như trang này bấm câu nào là link sẽ nhảy câu đó, kinh thánh bản nào cũng hiện lên. https://kinhthanh.httlvn.org/doc-kinh-thanh/gie/21?v=BD2011#6"* (kèm ảnh chụp khoanh đỏ câu 6 Nê-hê-mi 1 trên giao diện).
  - Triển khai giải pháp đồng bộ thanh link theo từng câu và bản dịch:
    1. Đồng bộ nhấp câu (`VERSE_SELECTED`): Bấm vào bất kỳ câu nào (ví dụ câu 6), thanh địa chỉ lập tức cập nhật nhánh câu đó: `#bible/NEH/1/6` (hoặc `#bible/NEH/1/6?v=BD2011`).
    2. Đồng bộ bản dịch (`PRIMARY_VERSION_CHANGED`): Khi đổi bản dịch (BTT, BD2011, CGKPV, KJV, v.v.), URL tự động gắn query `?v=...` tương ứng.
    3. Bộ giải mã tương thích HTTLVN (`parseHash` & `resolveBookId`): Tự động nhận diện slug HTTLVN (ví dụ: `gie` -> `JER`, `ne` -> `NEH`, `sa` -> `GEN`) và định dạng `#câu` ở cuối URL (`/doc-kinh-thanh/gie/21?v=BD2011#6`).
    4. Trực quan hóa đầy đủ: Mở link trực tiếp sẽ nạp đúng bản dịch, mở đúng phân đoạn, cuộn và đánh dấu sáng câu được chọn, đồng thời kích hoạt bảng Đối Chiếu Song Song.
  - Bổ sung Unit Test `test_verse_click_url_branch_and_version_contract` trong `test_portal_and_header_sticky.py`. Toàn bộ **161/161 bài test Pytest PASS 100%**.
  - Đã sync mirror và deploy lên Vercel.
"""

text = text.rstrip() + "\n" + milestone_44

print(f"Final length: {len(text)} characters (Limit: 24,000)")
assert len(text) <= 24000, f"Exceeded limit: {len(text)}"

with open("E:/kinhthanh/memory.md", "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS: memory.md updated with Milestone 44!")
