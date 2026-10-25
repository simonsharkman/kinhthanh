import re

INDEX_PATH = "E:/kinhthanh/index.html"
OPTIONS_PATH = "E:/kinhthanh/data/book_options.html"

with open(INDEX_PATH, "r", encoding="utf-8") as f:
    html = f.read()

with open(OPTIONS_PATH, "r", encoding="utf-8") as f:
    options_raw = f.read().strip()

# Create default GEN selected options
options_gen = []
for line in options_raw.splitlines():
    line = line.strip()
    if not line: continue
    if 'value="GEN"' in line:
        options_gen.append(line.replace('value="GEN"', 'value="GEN" selected'))
    else:
        options_gen.append(line)
options_gen_html = "\n                    ".join(options_gen)

# Create default REV selected options
options_rev = []
for line in options_raw.splitlines():
    line = line.strip()
    if not line: continue
    if 'value="REV"' in line:
        options_rev.append(line.replace('value="REV"', 'value="REV" selected'))
    else:
        options_rev.append(line)
options_rev_html = "\n                    ".join(options_rev)

# 1. Replace #portal-read-book-select content
pattern_read = r'(<select class="portal-select" id="portal-read-book-select">).*?(</select>)'
repl_read = f'\\1\n                    {options_gen_html}\n                  \\2'
html = re.sub(pattern_read, repl_read, html, flags=re.DOTALL)

# 2. Replace #portal-listen-book-select content
pattern_listen = r'(<select class="portal-select" id="portal-listen-book-select">).*?(</select>)'
repl_listen = f'\\1\n                    {options_gen_html}\n                  \\2'
html = re.sub(pattern_listen, repl_listen, html, flags=re.DOTALL)

# 3. Replace #portal-search-from-book content
pattern_sfrom = r'(<select class="portal-select" id="portal-search-from-book">).*?(</select>)'
repl_sfrom = f'\\1\n                    {options_gen_html}\n                  \\2'
html = re.sub(pattern_sfrom, repl_sfrom, html, flags=re.DOTALL)

# 4. Replace #portal-search-to-book content
pattern_sto = r'(<select class="portal-select" id="portal-search-to-book">).*?(</select>)'
repl_sto = f'\\1\n                    {options_rev_html}\n                  \\2'
html = re.sub(pattern_sto, repl_sto, html, flags=re.DOTALL)

# 5. Insert portal-utility-modal, portal-playlist-modal, portal-audio-player-bar, app-toast-container before mobile-menu-modal or </body>
modal_injection = """
  <!-- 12. Modal Tiện Ích Cổng Tĩnh Nguyện (Câu Gốc Yêu Thích, Đố Kinh Thánh, Đối Đáp, Lược Khảo, Truyện Tích, Từ Điển) -->
  <div id="portal-utility-modal" class="modal-overlay hidden" aria-label="Tiện ích cổng Tĩnh Nguyện & Dưỡng Linh">
    <div class="modal-card modal-large portal-utility-card animate-scale-up">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <h2 class="modal-title" id="portal-utility-title"><i class="fa-solid fa-scroll"></i> Tiện Ích Thánh Kinh</h2>
          <span class="modal-subtitle" id="portal-utility-subtitle">Tra cứu và rèn luyện tâm linh</span>
        </div>
        <button class="modal-close-btn" data-modal="portal-utility-modal" title="Đóng [Esc]">&times;</button>
      </div>
      <div class="portal-utility-tabs" id="portal-utility-tabs">
        <!-- Render tabs if category has sub-filters -->
      </div>
      <div class="modal-body portal-utility-body" id="portal-utility-body">
        <!-- Dynamic rich content -->
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-shield-halved"></i> Dữ liệu chuẩn Hội Thánh Tin Lành Việt Nam & Thần học Berea</span>
        <button type="button" class="btn-secondary modal-close-btn" data-modal="portal-utility-modal">Đóng</button>
      </div>
    </div>
  </div>

  <!-- 13. Modal Danh Sách Nghe (Audio Playlist) -->
  <div id="portal-playlist-modal" class="modal-overlay hidden" aria-label="Danh Sách Nghe Thánh Kinh Audio">
    <div class="modal-card animate-scale-up" style="max-width: 580px;">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <h2 class="modal-title"><i class="fa-solid fa-headphones"></i> Danh Sách Nghe Lời Chúa (Playlist)</h2>
          <span class="modal-subtitle">Các phân đoạn đã lưu để nghe liên tục</span>
        </div>
        <button class="modal-close-btn" data-modal="portal-playlist-modal">&times;</button>
      </div>
      <div class="modal-body" id="portal-playlist-body" style="max-height: 60vh; overflow-y: auto;">
        <!-- Dynamic playlist items -->
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
        <button type="button" class="btn-text-danger" id="btn-clear-playlist" style="font-size: 0.82rem; color: var(--accent-red); background: transparent; border: none; cursor: pointer;">
          <i class="fa-solid fa-trash-can"></i> Xóa tất cả
        </button>
        <button type="button" class="btn-secondary modal-close-btn" data-modal="portal-playlist-modal">Đóng</button>
      </div>
    </div>
  </div>

  <!-- Thanh Phát Âm Thanh Thánh Kinh Cố Định (Docked Audio Player Bar) -->
  <div id="portal-audio-player-bar" class="portal-audio-player-bar hidden">
    <div class="audio-player-inner">
      <div class="audio-info">
        <i class="fa-solid fa-volume-high audio-pulse-icon"></i>
        <div class="audio-meta">
          <span class="audio-title" id="audio-player-title">Sáng-thế Ký 1</span>
          <span class="audio-subtitle" id="audio-player-subtitle">Đang đọc câu 1 / 31 (Giọng Tiếng Việt chuẩn)</span>
        </div>
      </div>
      <div class="audio-controls">
        <button type="button" class="audio-ctrl-btn" id="audio-btn-prev-verse" title="Câu trước"><i class="fa-solid fa-backward-step"></i></button>
        <button type="button" class="audio-ctrl-btn audio-btn-play" id="audio-btn-play-pause" title="Tạm dừng / Tiếp tục"><i class="fa-solid fa-pause"></i></button>
        <button type="button" class="audio-ctrl-btn" id="audio-btn-next-verse" title="Câu kế tiếp"><i class="fa-solid fa-forward-step"></i></button>
        <button type="button" class="audio-ctrl-btn audio-btn-stop" id="audio-btn-stop" title="Dừng đọc"><i class="fa-solid fa-stop"></i></button>
      </div>
      <div class="audio-settings">
        <select id="audio-speed-select" class="audio-speed-select" title="Tốc độ đọc">
          <option value="0.8">0.8x</option>
          <option value="1.0" selected>1.0x</option>
          <option value="1.25">1.25x</option>
        </select>
        <button type="button" class="audio-close-btn" id="audio-btn-close" title="Đóng thanh phát"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div id="app-toast-container" class="app-toast-container" aria-live="polite"></div>
"""

if 'id="portal-utility-modal"' not in html:
    target_pos = html.find('<!-- Scripts: ES6 Modules Architecture -->')
    if target_pos != -1:
        html = html[:target_pos] + modal_injection + "\n  " + html[target_pos:]
    else:
        html = html.replace('</body>', modal_injection + '\n</body>')

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("Successfully updated index.html with static 66-book options and utility/audio modals!")
