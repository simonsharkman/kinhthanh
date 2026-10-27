# -*- coding: utf-8 -*-
"""Update memory.md with Milestone 43 and verify limit <= 24,000 characters."""

with open("E:/kinhthanh/memory.md", "r", encoding="utf-8") as f:
    text = f.read()

# Update total tests at top
text = text.replace("- **Trạng thái kiểm thử**: 159/159 Pytest suites PASS (100% Green).", "- **Trạng thái kiểm thử**: 160/160 Pytest suites PASS (100% Green).")

milestone_43 = """
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
"""

text = text.rstrip() + "\n" + milestone_43

print(f"Final length: {len(text)} characters (Limit: 24,000)")
assert len(text) <= 24000, f"Exceeded limit: {len(text)}"

with open("E:/kinhthanh/memory.md", "w", encoding="utf-8") as f:
    f.write(text)

print("SUCCESS: memory.md updated with Milestone 43!")
