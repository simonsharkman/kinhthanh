# -*- coding: utf-8 -*-
"""
Script to enhance TKLK Modal UX and Audio Narration in E:\kinhthanh\js\app.js
"""
import re

APP_JS = r'E:\kinhthanh\js\app.js'

with open(APP_JS, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update updateSurveyAudioBtnState(isPlaying)
old_update_btn = """  updateSurveyAudioBtnState(isPlaying) {
    const audioBtn = document.getElementById('btn-survey-audio');
    if (!audioBtn) return;
    const txtSpan = document.getElementById('survey-audio-btn-text');
    if (isPlaying) {
      audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="survey-audio-btn-text">Tạm Dừng</span>';
      audioBtn.style.color = 'var(--accent-gold)';
    } else {
      audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span id="survey-audio-btn-text">Nghe Đọc</span>';
      audioBtn.style.color = 'var(--accent-gold)';
    }
  }"""

new_update_btn = """  updateSurveyAudioBtnState(isPlaying) {
    const audioBtn = document.getElementById('btn-survey-audio');
    if (audioBtn) {
      if (isPlaying) {
        audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="survey-audio-btn-text">Tạm Dừng</span>';
        audioBtn.style.color = 'var(--accent-gold)';
      } else {
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span id="survey-audio-btn-text">Nghe Đọc</span>';
        audioBtn.style.color = 'var(--accent-gold)';
      }
    }
    const tklkAudioBtn = document.getElementById('btn-tklk-audio');
    if (tklkAudioBtn) {
      if (isPlaying) {
        tklkAudioBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="tklk-audio-btn-text">Tạm Dừng</span>';
        tklkAudioBtn.style.color = 'var(--accent-gold)';
      } else {
        tklkAudioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span id="tklk-audio-btn-text">Nghe Đọc</span>';
        tklkAudioBtn.style.color = 'var(--accent-gold)';
      }
    }
    const modalPlayBtn = document.getElementById('btn-tklk-modal-audio-play');
    if (modalPlayBtn) {
      modalPlayBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }
    const pagePlayBtn = document.getElementById('btn-survey-audio-play-pause');
    if (pagePlayBtn) {
      pagePlayBtn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    }
  }"""

if old_update_btn in content:
    content = content.replace(old_update_btn, new_update_btn, 1)
    print("1. Successfully updated updateSurveyAudioBtnState")
else:
    print("1. Could not find old_update_btn, searching regex...")

# 2. Update openTklkChapterJumpModal to support switching chapters inside modal
old_jump_click = """      grid.querySelectorAll('.tklk-jump-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chId = parseInt(btn.dataset.chapter, 10);
          if (chId) {
            modal.classList.add('hidden');
            this.stopSurveyAudioNarration();
            this.renderSurveyChapter(chId);
          }
        });
      });"""

new_jump_click = """      grid.querySelectorAll('.tklk-jump-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chId = parseInt(btn.dataset.chapter, 10);
          if (chId) {
            modal.classList.add('hidden');
            this.stopSurveyAudioNarration();
            const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
            if (isModalOpen) {
              this.openTklkChapter(chId);
            } else {
              this.renderSurveyChapter(chId);
            }
          }
        });
      });"""

if old_jump_click in content:
    content = content.replace(old_jump_click, new_jump_click, 1)
    print("2a. Successfully updated jump item click")
else:
    print("2a. Could not find old_jump_click")

old_handle_num_go = """    const handleNumGo = () => {
      const val = parseInt(numInput?.value, 10);
      if (val >= 1 && val <= 114) {
        modal.classList.add('hidden');
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(val);
      } else {
        this.showToast('Vui lòng nhập số chương từ 1 đến 114', 'warning');
      }
    };"""

new_handle_num_go = """    const handleNumGo = () => {
      const val = parseInt(numInput?.value, 10);
      if (val >= 1 && val <= 114) {
        modal.classList.add('hidden');
        this.stopSurveyAudioNarration();
        const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
        if (isModalOpen) {
          this.openTklkChapter(val);
        } else {
          this.renderSurveyChapter(val);
        }
      } else {
        this.showToast('Vui lòng nhập số chương từ 1 đến 114', 'warning');
      }
    };"""

if old_handle_num_go in content:
    content = content.replace(old_handle_num_go, new_handle_num_go, 1)
    print("2b. Successfully updated handleNumGo")
else:
    print("2b. Could not find old_handle_num_go")

# 3. Update startSurveyAudioNarration voiceModeSel and chapterId
old_start_audio_head = """    const chapterId = this.activeSurveyChapterId || this.currentTklkChapterId || 1;
    const voiceModeSel = document.getElementById('survey-audio-voice-mode');
    const voiceMode = voiceModeSel ? voiceModeSel.value : 'alden';"""

new_start_audio_head = """    const chapterId = this.currentTklkChapterId || this.activeSurveyChapterId || 1;
    const voiceModeSel = document.getElementById('tklk-modal-voice-mode') || document.getElementById('survey-audio-voice-mode');
    const voiceMode = voiceModeSel ? voiceModeSel.value : 'alden';"""

if old_start_audio_head in content:
    content = content.replace(old_start_audio_head, new_start_audio_head, 1)
    print("3. Successfully updated startSurveyAudioNarration head")
else:
    print("3. Could not find old_start_audio_head")

# 4. Update playSurveyAudioFromElement to show modalAudioBar if in modal
old_play_from_el = """    // Show audio bar if hidden
    const audioBar = document.getElementById('survey-audio-player-bar');
    if (audioBar) audioBar.style.display = 'block';"""

new_play_from_el = """    // Show audio bar if hidden
    const audioBar = document.getElementById('survey-audio-player-bar');
    if (audioBar && contentSelector === '#survey-chapter-body') audioBar.style.display = 'block';
    const modalBar = document.getElementById('tklk-modal-audio-bar');
    if (modalBar && contentSelector === '#tklk-reader-content') modalBar.style.display = 'block';"""

if old_play_from_el in content:
    content = content.replace(old_play_from_el, new_play_from_el, 1)
    print("4. Successfully updated playSurveyAudioFromElement bar reveal")
else:
    print("4. Could not find old_play_from_el")

# 5. Overhaul openTklkChapter
old_open_tklk_pattern = r'  async openTklkChapter\(chapterId\) \{[\s\S]*?(?=  renderUtilityStories\(\))'

new_open_tklk = """  async openTklkChapter(chapterId) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.currentTklkChapterId = id;
    this.activeSurveyChapterId = id;

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
      titleEl.innerHTML = `<i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold);"></i> ${meta.title} (Chương ${id}/114)`;
    }
    if (subEl) {
      subEl.innerHTML = `<span style="color:var(--text-muted);">Thánh Kinh Lược Khảo</span> • <span style="color:var(--accent-gold); font-weight:600;">${meta.category_name}</span> • ${(meta.word_count || 0).toLocaleString()} từ`;
    }

    // Set up Reader Toolbar in tabsContainer
    tabsContainer.innerHTML = `
      <div class="tklk-reader-toolbar">
        <button type="button" class="portal-utility-tab-btn" id="btn-tklk-back" title="Quay lại mục lục 114 chương">
          <i class="fa-solid fa-arrow-left"></i> Mục Lục
        </button>
        <button type="button" class="portal-utility-tab-btn" id="btn-tklk-prev" ${id <= 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} title="Chương trước">
          <i class="fa-solid fa-chevron-left"></i> Trước
        </button>
        <button type="button" class="portal-utility-tab-btn tklk-chapter-jump-btn" id="btn-tklk-chapter-jump" title="Bấm để nhảy nhanh đến chương bất kỳ (1 - 114)" style="font-weight: 800; color: var(--accent-gold); display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(212,175,55,0.08); padding: 0.22rem 0.6rem; border-radius: 5px; border: 1px dashed rgba(212,175,55,0.45); cursor: pointer;">
          <i class="fa-solid fa-bookmark"></i> Chương ${id} / 114 <i class="fa-solid fa-caret-down" style="font-size: 0.72rem;"></i>
        </button>
        <button type="button" class="portal-utility-tab-btn" id="btn-tklk-next" ${id >= 114 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''} title="Chương sau">
          Sau <i class="fa-solid fa-chevron-right"></i>
        </button>
        <button type="button" class="portal-utility-tab-btn" id="btn-tklk-audio" style="color: var(--accent-gold); font-weight: 700; border-color: rgba(212,175,55,0.4);" title="Nghe đọc toàn văn chương này">
          <i class="fa-solid fa-volume-high"></i> <span id="tklk-audio-btn-text">Nghe Đọc</span>
        </button>
        <div style="display: flex; gap: 2px; margin-left: auto;">
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-zoom-out" title="Giảm cỡ chữ" style="padding: 0.3rem 0.6rem;">
            A-
          </button>
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-zoom-in" title="Tăng cỡ chữ" style="padding: 0.3rem 0.6rem;">
            A+
          </button>
        </div>
        ${meta.book_id ? `
          <button type="button" class="portal-utility-tab-btn" id="btn-tklk-goto-bible" data-book="${meta.book_id}" style="color: var(--accent-gold); font-weight: 700; border-color: rgba(212,175,55,0.4);" title="Đọc sách này trong Kinh Thánh">
            <i class="fa-solid fa-bible"></i> Đọc Bản Văn
          </button>
        ` : ''}
        <button type="button" class="portal-utility-tab-btn" id="btn-tklk-copy" title="Sao chép toàn bộ văn bản chương này">
          <i class="fa-solid fa-copy"></i>
        </button>
      </div>
    `;

    // Connect Toolbar buttons
    tabsContainer.querySelector('#btn-tklk-back')?.addEventListener('click', () => {
      this.renderUtilitySurvey(this.tklkActiveFilter || 'all');
    });

    tabsContainer.querySelector('#btn-tklk-prev')?.addEventListener('click', () => {
      if (id > 1) this.openTklkChapter(id - 1);
    });

    tabsContainer.querySelector('#btn-tklk-next')?.addEventListener('click', () => {
      if (id < 114) this.openTklkChapter(id + 1);
    });

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
      <div style="text-align: center; padding: 3rem;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-gold);"></i>
        <p style="margin-top: 1rem; color: var(--text-muted);">Đang tải nội dung Chương ${id}: ${meta.title}...</p>
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

    bodyContainer.innerHTML = `
      <div class="tklk-reader-view animate-fade-in">
        <div class="tklk-chapter-header">
          <div class="tklk-chapter-meta">
            <span class="badge" style="background: rgba(212,175,55,0.15); color: var(--accent-gold); font-size: 0.75rem; font-weight: 700; padding: 3px 8px;">
              ${chapterData.category_name || meta.category_name}
            </span>
            <span class="tklk-word-badge" style="font-size: 0.78rem; color: var(--text-muted);">
              <i class="fa-solid fa-book"></i> Chương ${id} / 114 &bull; ${(chapterData.word_count || meta.word_count || 0).toLocaleString()} từ &bull; ~${Math.ceil((chapterData.word_count || meta.word_count || 500) / 250)} phút đọc
            </span>
          </div>
          <h1 class="tklk-chapter-title">${chapterData.title || meta.title}</h1>
          <div class="tklk-source-credit">
            <i class="fa-solid fa-feather-pointed"></i> Trích tác phẩm <em>Thánh Kinh Lược Khảo</em> (Halley\\'s Bible Handbook) &bull; Nguyên tác: Dr. Henry H. Halley &bull; Bản dịch Việt ngữ
          </div>
        </div>

        <!-- Collapsible Audio Player Bar inside Modal -->
        <div class="tklk-audio-player-bar animate-fade-in" id="tklk-modal-audio-bar" style="display: none; background: var(--bg-card); border: 1.5px solid var(--accent-gold); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1.25rem; box-shadow: 0 4px 18px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem;">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <button type="button" class="btn-primary" id="btn-tklk-modal-audio-play" style="width: 36px; height: 36px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.95rem; cursor: pointer;">
                <i class="fa-solid fa-play"></i>
              </button>
              <button type="button" class="btn-secondary" id="btn-tklk-modal-audio-stop" style="width: 36px; height: 36px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer;" title="Dừng đọc">
                <i class="fa-solid fa-stop"></i>
              </button>
              <div>
                <div style="font-weight: 800; color: var(--accent-gold); font-size: 0.88rem; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                  <i class="fa-solid fa-headphones"></i> Sách Nói: <span>${chapterData.title || meta.title}</span>
                  <span id="tklk-modal-voice-badge" style="background: rgba(212,175,55,0.15); color: var(--accent-gold); border: 1px solid var(--accent-gold); border-radius: 4px; padding: 0.1rem 0.45rem; font-size: 0.72rem; font-weight: 700;">
                    <i class="fa-solid fa-microphone"></i> Giọng ALDEN Studio
                  </span>
                </div>
                <div style="font-size: 0.76rem; color: var(--text-muted);" id="tklk-modal-audio-status">
                  Bấm Phát để nghe toàn bộ &bull; Hoặc nhấp đoạn bất kỳ để đọc từ đó
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Giọng:</span>
              <select id="tklk-modal-voice-mode" class="portal-select" style="padding: 0.25rem 0.45rem; font-size: 0.8rem; border-radius: 6px;">
                <option value="alden" selected>🎙️ Giọng ALDEN Studio</option>
                <option value="namminh">🔊 Giọng Nam Trầm (Trực Tuyến)</option>
                <option value="hoaimy">🔊 Giọng Nữ (Trực Tuyến)</option>
              </select>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Tốc độ:</span>
              <select id="tklk-modal-audio-speed" class="portal-select" style="padding: 0.25rem 0.45rem; font-size: 0.8rem; border-radius: 6px;">
                <option value="0.8">0.8x</option>
                <option value="1.0" selected>1.0x (Chuẩn)</option>
                <option value="1.2">1.2x</option>
                <option value="1.5">1.5x</option>
              </select>
              <button type="button" class="btn-secondary" id="btn-tklk-modal-audio-close" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;" title="Đóng">&times;</button>
            </div>
          </div>
        </div>

        <div class="tklk-reader-content" id="tklk-reader-content" style="font-size: ${this.tklkFontSize}px;">
          ${chapterData.content_html}
        </div>
        <div class="tklk-reader-footer-nav">
          <button type="button" class="btn-secondary" id="btn-tklk-footer-prev" ${id <= 1 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''}>
            <i class="fa-solid fa-chevron-left"></i> Chương ${id - 1}
          </button>
          <button type="button" class="btn-secondary tklk-chapter-jump-btn" id="btn-tklk-footer-jump" style="color: var(--accent-gold); font-weight: 700; border: 1px dashed rgba(212,175,55,0.45);">
            <i class="fa-solid fa-bookmark"></i> Nhảy Chương ▾
          </button>
          <button type="button" class="btn-primary" id="btn-tklk-footer-back">
            <i class="fa-solid fa-list-ul"></i> Mục Lục 114 Chương
          </button>
          <button type="button" class="btn-secondary" id="btn-tklk-footer-top" title="Cuộn lên đầu trang">
            <i class="fa-solid fa-arrow-up"></i> Đầu trang
          </button>
          <button type="button" class="btn-secondary" id="btn-tklk-footer-next" ${id >= 114 ? 'disabled style="opacity:0.35;cursor:not-allowed;"' : ''}>
            Chương ${id + 1} <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;

    // Scroll to top of reader
    bodyContainer.scrollTop = 0;

    // Connect footer buttons
    bodyContainer.querySelector('#btn-tklk-footer-prev')?.addEventListener('click', () => {
      if (id > 1) this.openTklkChapter(id - 1);
    });

    bodyContainer.querySelector('#btn-tklk-footer-jump')?.addEventListener('click', () => {
      this.openTklkChapterJumpModal(id);
    });

    bodyContainer.querySelector('#btn-tklk-footer-back')?.addEventListener('click', () => {
      this.renderUtilitySurvey(this.tklkActiveFilter || 'all');
    });

    bodyContainer.querySelector('#btn-tklk-footer-top')?.addEventListener('click', () => {
      bodyContainer.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bodyContainer.querySelector('#btn-tklk-footer-next')?.addEventListener('click', () => {
      if (id < 114) this.openTklkChapter(id + 1);
    });

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
      this.stopSurveyAudioNarration();
    });

    modalCloseBtn?.addEventListener('click', () => {
      this.stopSurveyAudioNarration();
      if (modalAudioBar) modalAudioBar.style.display = 'none';
    });

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
          this.toggleSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play');
        } else {
          this.stopSurveyAudioNarration();
        }
      } else {
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

if re.search(old_open_tklk_pattern, content):
    content = re.sub(old_open_tklk_pattern, new_open_tklk, content, count=1)
    print("5. Successfully replaced openTklkChapter")
else:
    print("5. Could not match old_open_tklk_pattern")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved updated app.js!")
