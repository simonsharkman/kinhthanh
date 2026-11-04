# -*- coding: utf-8 -*-
import re

MEMORY_PATH = r'E:\kinhthanh\memory.md'

with open(MEMORY_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

# Condense from Milestones 23–35 to Milestone 62
pattern = r'- \*\*Milestones 23–35[\s\S]*?Toàn bộ \*\*198/198 bài test Pytest PASS 100%\*\*\. Đồng bộ mirror workspace & Vercel\.'
replacement = '- **Milestones 23–62 (2026-10-26 ~ 2026-10-30)**: Hoàn thiện Full Admin CMS v3.0, sửa 10.021 lỗi Unicode NFC auto-healing, loại bỏ 123.887 nhãn thừa, chuẩn hóa Drawer 45vw, Interlinear 3 tầng RTL/LTR, CSDL Strong, Deep Link SPA Hash Routing (#portal, #bible, #tsk, #blog, #community, #media, #quiz, #donate), Audio Verse Glowing, Arial Typography chuẩn mực, Compact Pickers (Sách, Đoạn, Bản dịch), Vertical Column-Flow 66 sách, Ngân hàng tinh gọn và VTKTH Theological Examination Suite (>630 câu hỏi, 10 bộ đề VTKTH, 200 câu thần học). Đạt 198/198 Pytest PASS 100%.'

if re.search(pattern, text):
    text = re.sub(pattern, replacement, text)
    print("Successfully condensed Milestones 23-62 via regex")
else:
    print("Regex did not match, checking why...")

# Append Milestone 69
milestone_69 = """
- **Milestone 69 (2026-11-04) - Hoàn Thiện Trọn Vẹn Trải Nghiệm Modal & Giao Diện Đọc Thánh Kinh Lược Khảo (v4.6.2)**:
  - Khắc phục triệt để các phản hồi của anh Jimmy trên ảnh chụp thực tế giao diện Modal (`#portal-utility-modal` / `openTklkChapter`):
    1. **Nút Nhảy Nhanh Đến Chương (1-114) Tương Tác**: Thay thế `<span>` tĩnh trên toolbar bằng nút bấm trực tiếp `🔖 Chương X / 114 ▾` (`#btn-tklk-chapter-jump`) và nút chân trang (`#btn-tklk-footer-jump`).
    2. **Hỗ Trợ Chuyển Đổi Chương Mượt Mà Trong Cả Modal Lẫn Toàn Màn Hình**: Khi modal đang mở, Modal Nhảy Chương (`#tklk-chapter-jump-modal`, z-index 2500) tự động chuyển chương trực tiếp ngay trong modal (`openTklkChapter`) mà không cần đóng hay tải lại trang.
    3. **Thanh Phát Sách Nói Hoàn Chỉnh Trong Modal**: Tích hợp thanh phát audio chuyên nghiệp `#tklk-modal-audio-bar` (Nút Phát/Tạm dừng, Dừng hẳn, Chọn giọng ALDEN/Nam Trầm/Nữ, Tốc độ 0.8x-1.5x, Trạng thái % tiến trình).
    4. **Hiệu Ứng Đánh Giá Đọc Tới Đâu & Nhấp Đoạn Bất Kỳ Để Nghe**: Bổ sung hiệu ứng viền vàng 5px `.tklk-paragraph-reading` kèm nhãn `🔊 ĐANG ĐỌC`, tự động cuộn giữa màn hình; mọi đoạn văn bản trong modal đều hỗ trợ nhấp chuột để bắt đầu nghe ngay từ đoạn đó.
    5. **Mở Chương Nào Nghe Được Chương Đó (1..114)**: Tự động phát âm thanh phòng thu ALDEN khi có tệp MP3, và tự động fallback sang Web Speech API giọng nam trầm mượt mà cho mọi chương còn lại mà không bao giờ bị đơ treo.
    6. **Sửa Lỗi Ký Tự Subtitle**: Khắc phục lỗi hiển thị chuỗi ký tự thô `&bull;` thành dấu chấm tròn tinh tế `•`.
  - Toàn bộ **212/212 tests Pytest PASS 100%** (12/12 tests `test_tklk_survey.py`). Đồng bộ mirror workspace & Vercel live.
"""

if "Milestone 69" not in text:
    text += milestone_69

with open(MEMORY_PATH, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Memory length: {len(text)} chars (Limit: <= 24,000)")
