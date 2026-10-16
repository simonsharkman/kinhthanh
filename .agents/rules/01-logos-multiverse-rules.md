---
trigger: always_on
description: "Quy chuẩn kiến trúc, kiểm thử và thiết kế giao diện cho dự án Logos MultiVerse trên Antigravity IDE"
---

# 🏛️ Logos MultiVerse Rules & Guidelines (Antigravity Enterprise)

## 1. Nguyên Tắc Bảo Toàn & Toàn Vẹn Dữ Liệu
- **Zero-Tamper Bible Security**: Văn bản Lời Chúa (Kinh Thánh 66 sách) và các bài viết khảo luận gốc của chủ trang được bảo vệ ở chế độ `Chỉ Đọc (Read-Only)`. Người dùng khách không thể sửa đổi hoặc phá hoại nội dung Kinh Thánh.
- **Tính Chính Xác Thần Học**: Các bản dịch tiếng Việt, tiếng Anh và tiếng dân tộc thiểu số phải lấy nguồn chính thống (HTTLVN `kinhthanh.httlvn.org`, KJV, ESV, Strong's Concordance). Tuyệt đối không tự suy diễn văn bản nguyên bản.

## 2. Tiêu Chuẩn Thiết Kế Giao Diện (Aesthetics & UX)
- **Bảng Màu Thiêng Liêng (Holy & Sacred Design Tokens)**:
  - Tông màu chủ đạo: Nền tối Deep Velvet/Midnight Slate (`#0B0F19`, `#111827`).
  - Điểm nhấn: Vàng Hoàng Gia / Holy Amber (`#D4AF37`, `#F59E0B`), Trắng Ngà Ngũ Tuần (`#F3F4F6`).
  - Thể loại văn chương (8 Genres): Màu sắc nhận diện riêng biệt cho từng thể loại (Torah, Lịch sử, Thi ca, Tiên tri, Phúc âm, Công vụ, Thư tín, Khải huyền).
- **Trải Nghiệm Đa Bản Dịch (Split-View Parallel Alignment)**:
  - Cho phép người dùng linh hoạt chọn hiển thị các cột bản dịch song song mà không làm tràn ngang hoặc vỡ layout.
  - Phông chữ HTTLVN cho các thứ tiếng dân tộc thiểu số phải được nhúng chuẩn xác (`Charis SIL`, `Gentium Plus`).

## 3. Quy Chuẩn Kỹ Thuật & Tự Động Hóa (Quality Assurance)
- **100% Pytest Green**: Mọi thay đổi về code, script ETL hoặc giao diện cần đảm bảo tất cả test cases trong thư mục `tests/` vượt qua kiểm thử:
  ```powershell
  python -m pytest tests/ -v
  ```
- **Zero Placeholder Policy**: Không sử dụng TODOs chưa hoàn tất hoặc dữ liệu giả tạm bợ.
- **Đồng Bộ Antigravity**: Mọi thay đổi tại `E:\kinhthanh` phải được đồng bộ sang `C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse` thông qua `scripts/sync_to_antigravity.py`.
