# 🏛️ Logos MultiVerse — Google Antigravity 2.1 Workspace Guidelines

## 1. System & Architecture Overview (Antigravity 2.1 Enterprise)
- **Hệ thống**: Google Antigravity 2.1 / Antigravity IDE (Gemini 3.8 Flash / Pro)
- **Dự án**: **Logos MultiVerse — Nền Tảng Học & Đối Chiếu Kinh Thánh Đa Chiều** (Studio Edition v2.5.0 Enterprise)
- **Vị trí Workspace chính**: `E:\kinhthanh`
- **Vị trí Workspace Mirror**: `C:\Users\Admin\.gemini\antigravity-ide\scratch\logos-bible-multiverse`
- **Công nghệ nền tảng**:
  - **Frontend Core**: Vanilla HTML5, CSS3 Tokens (Holy Gold, Dark Glassmorphism, Responsive Split-Drawer), Modular ES6 JavaScript (`state.js`, `storage.js`, `bible-engine.js`, `hermeneutics-engine.js`, `media-engine.js`, `ai-assistant.js`, `community-guardian.js`, `app.js`).
  - **Backend / ETL & Test Suite**: Python 3.11+, Pytest 9+, REST/HTTP Parser tích hợp dữ liệu chính thống HTTLVN (`kinhthanh.httlvn.org`), Strong's Concordance, TSK Cross-References.

---

## 2. Core Functional Modules
1. **Bible Engine (`js/bible-engine.js`)**:
   - Đối chiếu song song đa bản dịch (BTT, BDM, BPT, BD2011, BHD, CGKPV, KJV, ESV, NIV, Interlinear Hy Lạp/Hê-bơ-rơ).
   - Hỗ trợ các thứ tiếng dân tộc thiểu số Tây Nguyên & Miền Núi: **Ê-đê (RRB), Gia-rai (JBSV), Ba-na (BDY), Bru-Vân Kiều (BRU), H'mông Trắng (HMOWSV), H'mông Đen (HMOBSV), M'nông (BBSV)**.
   - Word Diff Highlighter (phát hiện và làm nổi bật từ ngữ dịch khác biệt).
2. **Hermeneutics Engine (`js/hermeneutics-engine.js`)**:
   - Giải mã hình ảnh ẩn dụ & biểu tượng (Biblical Typology & Metaphors).
   - Nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh" (*Scriptura Sacra sui ipsius interpres*), TSK Cross-References.
3. **Theological AI Copilot Logos (`js/ai-assistant.js`)**:
   - Chế độ Zero-Setup nội suy dữ liệu thần học chính thống.
   - Chế độ ChatGPT (BYO OpenAI API Key).
4. **Community Guardian & Zero-Tamper Security (`js/community-guardian.js`)**:
   - Bảo vệ Read-Only tuyệt đối cho Lời Chúa và khảo luận của Quản trị viên.
   - Mã Quản trị viên mặc định: `logos777`.

---

## 3. Workflow & Code Standards
- **Chu trình bắt buộc**: **Explore ➔ Plan ➔ Execute ➔ Verify**.
- **Tiêu chuẩn kiểm thử (Zero Tolerance for Regressions)**:
  - Mọi thay đổi mã nguồn phải chạy qua bộ Pytest toàn diện:
    ```powershell
    python -m pytest tests/ -v
    ```
  - Đảm bảo **100% tests pass** (hiện tại đạt 49/49 passed) trước khi kết thúc phiên.
- **Chính sách không dùng code tạm bợ (Zero Placeholder Policy)**:
  - Tất cả tính năng, bản dịch, giao diện đều phải có mã thực thi hoàn chỉnh và dữ liệu thật.
- **Giao thức đồng bộ hai chiều**:
  - Đồng bộ E:\kinhthanh ➔ Antigravity Scratch: `python scripts/sync_to_antigravity.py`
  - Đồng bộ Antigravity Scratch ➔ E:\kinhthanh: `python scripts/sync_to_ekinhthanh.py`

---

## 4. Giao Thức Bộ Nhớ (Self-Evolving Memory Persistence v2.5.0)
- Tập tin theo dõi tri thức: `memory.md` (giới hạn <= 24,000 ký tự).
- Tự động ghi nhận bài học kinh nghiệm, kiến trúc dữ liệu và thói quen làm việc của anh Jimmy.
