# -*- coding: utf-8 -*-
"""
Script to streamline TKLK UI into the most compact, clean, minimalist reader layout.
"""
import re

APP_JS = r'E:\kinhthanh\js\app.js'
COMPONENTS_CSS = r'E:\kinhthanh\css\components.css'

# =========================================================================
# 1. Update js/app.js
# =========================================================================
with open(APP_JS, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace openTklkChapter with the streamlined compact version
old_open_tklk_regex = r'  async openTklkChapter\(chapterId, autoPlay = false\) \{[\s\S]*?(?=  renderUtilityStories\(\))'

new_open_tklk = """  async openTklkChapter(chapterId, autoPlay = false) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.currentTklkChapterId = id;
    this.activeSurveyChapterId = id;
    if (autoPlay) this.tklkAudioActive = true;

    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    const titleEl = document.getElementById('portal-utility-title');
    const subEl = document.getElementById('portal-utility-subtitle');
    if (!tabsContainer || !bodyContainer) return;

    // Retrieve meta from index
    let meta = (this.tklkIndex || []).find(x => x.id === id);
    if (!meta) {
      meta = { id, title: `Chương ${id}`, category_name: 'Lược Khảo', word_count: 0 };
    }

    if (titleEl) {
      titleEl.innerHTML = `<i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold);"></i> ${meta.title} <span style="font-size: 0.82rem; font-weight: normal; color: var(--text-muted);">(Chương ${id}/114)</span>`;
    }
    if (subEl) {
      subEl.innerHTML = `Thánh Kinh Lược Khảo • <span style="color: var(--accent-gold); font-weight: 600;">${meta.category_name}</span> • ${(meta.word_count || 0).toLocaleString()} từ • ~${Math.ceil((meta.word_count || 500) / 250)} phút đọc`;
    }

    // Set up Streamlined 1-Row Reader Toolbar in tabsContainer
    tabsContainer.innerHTML = `
      <div class="tklk-reader-toolbar">
        <div style="display: flex; align-items: center; gap: 3px; flex-shrink: 0;">
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-back" title="Mục lục 114 chương">
            <i class="fa-solid fa-list-ul"></i> Mục Lục
          </button>
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-prev" ${id <= 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} title="Chương trước">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button type="button" class="portal-utility-tab-btn tklk-chapter-jump-btn" id="btn-tklk-chapter-jump" title="Bấm để nhảy nhanh đến chương bất kỳ (1 - 114)" style="font-weight: 700; color: var(--accent-gold); background: rgba(212,175,55,0.1); border: 1px dashed rgba(212,175,55,0.45); cursor: pointer;">
            <i class="fa-solid fa-bookmark"></i> Ch. ${id} / 114 ▾
          </button>
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-next" ${id >= 114 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} title="Chương sau">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 3px; margin-left: auto; flex-shrink: 0;">
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-audio" style="color: var(--accent-gold); font-weight: 700; border-color: rgba(212,175,55,0.4);" title="Nghe đọc âm thanh">
            <i class="fa-solid fa-volume-high"></i> <span id="tklk-audio-btn-text">Nghe Đọc</span>
          </button>
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-zoom-out" title="Giảm cỡ chữ" style="padding: 0.22rem 0.4rem; font-size: 0.78rem;">
            A-
          </button>
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-zoom-in" title="Tăng cỡ chữ" style="padding: 0.22rem 0.4rem; font-size: 0.78rem;">
            A+
          </button>
          ${meta.book_id ? `
            <button type="button" class="portal-utility-tab-btn" id="btn-tklk-goto-bible" data-book="${meta.book_id}" style="color: var(--accent-gold); font-weight: 600; border-color: rgba(212,175,55,0.4);" title="Đọc sách này trong Kinh Thánh">
              <i class="fa-solid fa-bible"></i> Bản Văn
            </button>
          ` : ''}
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-copy" title="Sao chép văn bản chương">
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
      </div>
    `;

    // Connect Toolbar buttons
    tabsContainer.querySelector('#btn-tklk-back')?.addEventListener('click', () => {
      this.renderUtilitySurvey(this.tklkActiveFilter || 'all');
    });

    const triggerModalPrev = () => {
      if (id > 1) {
        const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
        this.stopSurveyAudioNarration();
        this.openTklkChapter(id - 1, isAudioActive);
      }
    };
    const triggerModalNext = () => {
      if (id < 114) {
        const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
        this.stopSurveyAudioNarration();
        this.openTklkChapter(id + 1, isAudioActive);
      }
    };

    tabsContainer.querySelector('#btn-tklk-prev')?.addEventListener('click', triggerModalPrev);
    tabsContainer.querySelector('#btn-tklk-next')?.addEventListener('click', triggerModalNext);

    tabsContainer.querySelector('#btn-tklk-chapter-jump')?.addEventListener('click', () => {
      this.openTklkChapterJumpModal(id);
    });

    tabsContainer.querySelector('#btn-tklk-zoom-out')?.addEventListener('click', () => {
      this.tklkFontSize = Math.max(13, (this.tklkFontSize || 16) - 1);
      const contentEl = document.getElementById('tklk-reader-content');
      if (contentEl) contentEl.style.fontSize = this.tklkFontSize + 'px';
      try { localStorage.setItem('tklk_font_size', String(this.tklkFontSize)); } catch(e) {}
    });

    tabsContainer.querySelector('#btn-tklk-zoom-in')?.addEventListener('click', () => {
      this.tklkFontSize = Math.min(26, (this.tklkFontSize || 16) + 1);
      const contentEl = document.getElementById('tklk-reader-content');
      if (contentEl) contentEl.style.fontSize = this.tklkFontSize + 'px';
      try { localStorage.setItem('tklk_font_size', String(this.tklkFontSize)); } catch(e) {}
    });

    tabsContainer.querySelector('#btn-tklk-goto-bible')?.addEventListener('click', () => {
      if (meta.book_id) {
        document.getElementById('portal-utility-modal')?.classList.add('hidden');
        this.navigateToPassage(meta.book_id, 1, 1, { stayInPortal: true });
      }
    });

    // Loading body container
    bodyContainer.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--accent-gold);"></i>
        <p style="margin-top: 0.75rem; color: var(--text-muted); font-size: 0.9rem;">Đang nạp Chương ${id}: ${meta.title}...</p>
      </div>
    `;

    // Fetch chapter content (with memory cache)
    this.tklkChapterCache = this.tklkChapterCache || {};
    let chapterData = this.tklkChapterCache[id];

    if (!chapterData) {
      try {
        const resp = await fetch(`data/tklk/chapters/${id}.json`);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        chapterData = await resp.json();
        this.tklkChapterCache[id] = chapterData;
      } catch (err) {
        console.error(`Lỗi tải chapter ${id}:`, err);
        bodyContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--accent-danger);">
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem;"></i>
            <p style="margin-top: 0.75rem;">Không thể tải nội dung chương này. Vui lòng thử lại.</p>
            <button type="button" class="btn-primary" id="btn-tklk-retry" style="margin-top: 1rem;">
              <i class="fa-solid fa-rotate-right"></i> Thử Lại
            </button>
          </div>
        `;
        bodyContainer.querySelector('#btn-tklk-retry')?.addEventListener('click', () => {
          this.openTklkChapter(id);
        });
        return;
      }
    }

    if (!this.tklkFontSize) {
      try {
        const saved = parseInt(localStorage.getItem('tklk_font_size'), 10);
        if (saved && saved >= 13 && saved <= 26) this.tklkFontSize = saved;
        else this.tklkFontSize = 16;
      } catch(e) {
        this.tklkFontSize = 16;
      }
    }

    // Ultra-Compact Reader View: No repetitive title banners, text starts immediately!
    bodyContainer.innerHTML = `
      <div class="tklk-reader-view animate-fade-in" style="padding: 0.5rem 0.25rem;">
        <!-- Collapsible Slim Audio Bar inside Modal -->
        <div class="tklk-audio-player-bar animate-fade-in" id="tklk-modal-audio-bar" style="display: none; background: var(--bg-card); border: 1px solid var(--accent-gold); border-radius: 6px; padding: 0.4rem 0.75rem; margin-bottom: 0.75rem; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button type="button" class="btn-primary" id="btn-tklk-modal-audio-play" style="width: 32px; height: 32px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer;">
                <i class="fa-solid fa-play"></i>
              </button>
              <button type="button" class="btn-secondary" id="btn-tklk-modal-audio-stop" style="width: 32px; height: 32px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; cursor: pointer;" title="Dừng đọc">
                <i class="fa-solid fa-stop"></i>
              </button>
              <div>
                <div style="font-weight: 700; color: var(--accent-gold); font-size: 0.82rem; display: flex; align-items: center; gap: 0.35rem;">
                  <i class="fa-solid fa-headphones"></i> Sách Nói: <span>${chapterData.title || meta.title}</span>
                </div>
                <div style="font-size: 0.74rem; color: var(--text-muted);" id="tklk-modal-audio-status">
                  Bấm Phát để nghe • Nhấp đoạn bất kỳ để đọc từ đó
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-left: auto; flex-wrap: wrap;">
              <select id="tklk-modal-voice-mode" class="portal-select" style="padding: 0.2rem 0.4rem; font-size: 0.78rem; border-radius: 4px;">
                <option value="alden" selected>🎙️ Giọng ALDEN Studio</option>
                <option value="namminh">🔊 Giọng Nam Trầm</option>
                <option value="hoaimy">🔊 Giọng Nữ</option>
              </select>
              <select id="tklk-modal-audio-speed" class="portal-select" style="padding: 0.2rem 0.35rem; font-size: 0.78rem; border-radius: 4px;">
                <option value="0.8">0.8x</option>
                <option value="1.0" selected>1.0x</option>
                <option value="1.2">1.2x</option>
                <option value="1.5">1.5x</option>
              </select>
              <button type="button" class="btn-secondary" id="btn-tklk-modal-audio-close" style="padding: 0.2rem 0.45rem; font-size: 0.8rem;" title="Đóng thanh nghe">&times;</button>
            </div>
          </div>
        </div>

        <!-- Clean Reader Content directly at the top -->
        <div class="tklk-reader-content" id="tklk-reader-content" style="font-size: ${this.tklkFontSize}px; line-height: 1.85;">
          ${chapterData.content_html}
        </div>

        <!-- Single Quiet Source Credit at Bottom -->
        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <span><i class="fa-solid fa-feather-pointed"></i> Thánh Kinh Lược Khảo • Dr. Henry H. Halley</span>
          <span>Chương ${id}/114 • ${(chapterData.word_count || meta.word_count || 0).toLocaleString()} từ</span>
        </div>

        <!-- Streamlined Footer Navigation -->
        <div class="tklk-reader-footer-nav" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; padding-top: 0.75rem;">
          <button type="button" class="btn-secondary" id="btn-tklk-footer-prev" ${id <= 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            <i class="fa-solid fa-chevron-left"></i> Chương ${id - 1}
          </button>
          <button type="button" class="btn-secondary tklk-chapter-jump-btn" id="btn-tklk-footer-jump" style="color: var(--accent-gold); font-weight: 700; border: 1px dashed rgba(212,175,55,0.45); padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            <i class="fa-solid fa-bookmark"></i> Nhảy Chương ▾
          </button>
          <button type="button" class="btn-primary" id="btn-tklk-footer-back" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            <i class="fa-solid fa-list-ul"></i> Mục Lục
          </button>
          <button type="button" class="btn-secondary" id="btn-tklk-footer-top" title="Cuộn lên đầu trang" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            <i class="fa-solid fa-arrow-up"></i> Đầu trang
          </button>
          <button type="button" class="btn-secondary" id="btn-tklk-footer-next" ${id >= 114 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
            Chương ${id + 1} <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    // Scroll to top of reader
    bodyContainer.scrollTop = 0;

    // Connect footer buttons
    bodyContainer.querySelector('#btn-tklk-footer-prev')?.addEventListener('click', triggerModalPrev);
    bodyContainer.querySelector('#btn-tklk-footer-jump')?.addEventListener('click', () => {
      this.openTklkChapterJumpModal(id);
    });
    bodyContainer.querySelector('#btn-tklk-footer-back')?.addEventListener('click', () => {
      this.renderUtilitySurvey(this.tklkActiveFilter || 'all');
    });
    bodyContainer.querySelector('#btn-tklk-footer-top')?.addEventListener('click', () => {
      bodyContainer.scrollTo({ top: 0, behavior: 'smooth' });
    });
    bodyContainer.querySelector('#btn-tklk-footer-next')?.addEventListener('click', triggerModalNext);

    // Wire Modal Audio Controls
    const modalAudioBar = bodyContainer.querySelector('#tklk-modal-audio-bar');
    const modalPlayBtn = bodyContainer.querySelector('#btn-tklk-modal-audio-play');
    const modalStopBtn = bodyContainer.querySelector('#btn-tklk-modal-audio-stop');
    const modalCloseBtn = bodyContainer.querySelector('#btn-tklk-modal-audio-close');
    const modalSpeedSel = bodyContainer.querySelector('#tklk-modal-audio-speed');
    const modalVoiceModeSel = bodyContainer.querySelector('#tklk-modal-voice-mode');

    modalPlayBtn?.addEventListener('click', () => {
      this.toggleSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play');
    });

    modalStopBtn?.addEventListener('click', () => {
      this.tklkAudioActive = false;
      this.stopSurveyAudioNarration();
    });

    modalCloseBtn?.addEventListener('click', () => {
      this.tklkAudioActive = false;
      this.stopSurveyAudioNarration();
      if (modalAudioBar) modalAudioBar.style.display = 'none';
    });

    if (autoPlay || this.tklkAudioActive) {
      this.tklkAudioActive = true;
      if (modalAudioBar) modalAudioBar.style.display = 'block';
      setTimeout(() => {
        this.startSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play', 0);
      }, 120);
    }

    modalSpeedSel?.addEventListener('change', (e) => {
      const spd = parseFloat(e.target.value) || 1.0;
      this.surveyAudioSpeed = spd;
      if (this.surveyAudioState) {
        this.surveyAudioState.speed = spd;
        if (this.surveyAudioState.isMediaElement && this.surveyAudioState.audioEl) {
          this.surveyAudioState.audioEl.playbackRate = spd;
        }
      }
    });

    modalVoiceModeSel?.addEventListener('change', () => {
      if (this.surveyAudioState && this.surveyAudioState.isPlaying) {
        this.stopSurveyAudioNarration();
        this.startSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play');
      }
    });

    tabsContainer.querySelector('#btn-tklk-audio')?.addEventListener('click', () => {
      if (modalAudioBar) {
        const isHidden = modalAudioBar.style.display === 'none';
        modalAudioBar.style.display = isHidden ? 'block' : 'none';
        if (isHidden) {
          this.tklkAudioActive = true;
          this.toggleSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play');
        } else {
          this.tklkAudioActive = false;
          this.stopSurveyAudioNarration();
        }
      } else {
        this.tklkAudioActive = true;
        this.toggleSurveyAudioNarration('#tklk-reader-content', 'portal-utility-subtitle', 'btn-tklk-audio');
      }
    });

    // Cho phép nhấp vào bất kỳ đoạn nào để bắt đầu nghe đọc từ đoạn đó
    const contentEl = bodyContainer.querySelector('#tklk-reader-content');
    if (contentEl) {
      const pElements = contentEl.querySelectorAll('p, h1, h2, h3, h4, h5, li, blockquote');
      pElements.forEach(pEl => {
        if (pEl.querySelector('p, h1, h2, h3, h4, h5, li, blockquote')) return;
        pEl.style.cursor = 'pointer';
        pEl.setAttribute('title', 'Nhấp để nghe đọc từ đoạn này');
        pEl.addEventListener('click', (e) => {
          if (e.target.tagName === 'A') return;
          this.tklkAudioActive = true;
          if (modalAudioBar) modalAudioBar.style.display = 'block';
          this.playSurveyAudioFromElement(pEl, '#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play');
        });
      });
    }

    // Wire Copy Button
    tabsContainer.querySelector('#btn-tklk-copy')?.addEventListener('click', () => {
      const cEl = document.getElementById('tklk-reader-content');
      const textToCopy = `${meta.title} - Thánh Kinh Lược Khảo\\n\\n` + (cEl ? cEl.innerText : '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
        this.showToast('Đã sao chép nội dung chương vào bộ nhớ tạm!', 'success');
      } else {
        this.showToast('Không thể truy cập bộ nhớ tạm!', 'warning');
      }
    });
  }

"""

if re.search(old_open_tklk_regex, js_content):
    js_content = re.sub(old_open_tklk_regex, new_open_tklk, js_content, count=1)
    print("Successfully replaced openTklkChapter with compact version")
else:
    print("Could not match old_open_tklk_regex")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(js_content)

# =========================================================================
# 2. Update css/components.css
# =========================================================================
with open(COMPONENTS_CSS, 'r', encoding='utf-8') as f:
    css_content = f.read()

# Add compact layout rules to css
compact_css = """

/* TKLK Ultra-Compact Reader Styles */
.tklk-reader-toolbar {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 4px !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  scrollbar-width: none !important;
  width: 100% !important;
  padding: 0.3rem 0.5rem !important;
}

.tklk-reader-toolbar::-webkit-scrollbar {
  display: none !important;
}

.tklk-reader-toolbar .portal-utility-tab-btn {
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  padding: 0.22rem 0.48rem !important;
  font-size: 0.8rem !important;
  border-radius: 4px !important;
}

.tklk-reader-content .Dehoa,
.tklk-reader-content .Dehoa span {
  font-size: 1.35rem !important;
  font-weight: 800 !important;
  color: var(--accent-gold) !important;
  margin: 0.25rem 0 0.5rem 0 !important;
  line-height: 1.3 !important;
}

.tklk-reader-content .TextCenter {
  margin: 0.2rem 0 0.5rem 0 !important;
}

.tklk-reader-content .TextCenter span {
  color: var(--accent-gold) !important;
  font-size: 1rem !important;
}
"""

if "/* TKLK Ultra-Compact Reader Styles */" not in css_content:
    css_content += compact_css
    with open(COMPONENTS_CSS, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Successfully added compact CSS rules to components.css")
else:
    print("Compact CSS already in components.css")

print("Done!")
