# -*- coding: utf-8 -*-
"""
Script to synchronize TKLK Audio Narration with Chapter Navigation (Next, Prev, Jump)
Ensures audio strictly follows text across all chapters.
"""

APP_JS = r'E:\kinhthanh\js\app.js'

with open(APP_JS, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update stopSurveyAudioNarration to safely stop all audio & SpeechSynthesis
old_stop = """  stopSurveyAudioNarration() {
    if (this.surveyAudioState && this.surveyAudioState.isMediaElement && this.surveyAudioState.audioEl) {
      this.surveyAudioState.audioEl.pause();
      this.surveyAudioState.audioEl.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.tklk-paragraph-reading').forEach(el => el.classList.remove('tklk-paragraph-reading'));

    if (this.surveyAudioState) {
      const ppBtn = document.getElementById(this.surveyAudioState.playPauseBtnId);
      if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      const stEl = document.getElementById(this.surveyAudioState.statusElId);
      if (stEl) stEl.textContent = 'Đã dừng đọc âm thanh';
      this.surveyAudioState.isPlaying = false;
      this.surveyAudioState.isPaused = false;
    }
    this.updateSurveyAudioBtnState(false);
  }"""

new_stop = """  stopSurveyAudioNarration() {
    const mediaEl = document.getElementById('survey-audio-media-element');
    if (mediaEl) {
      try {
        mediaEl.pause();
        mediaEl.currentTime = 0;
      } catch(e) {}
    }
    if (this.surveyAudioState && this.surveyAudioState.isMediaElement && this.surveyAudioState.audioEl) {
      try {
        this.surveyAudioState.audioEl.pause();
        this.surveyAudioState.audioEl.currentTime = 0;
      } catch(e) {}
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch(e) {}
    }
    document.querySelectorAll('.tklk-paragraph-reading').forEach(el => el.classList.remove('tklk-paragraph-reading'));

    if (this.surveyAudioState) {
      const ppBtn = document.getElementById(this.surveyAudioState.playPauseBtnId);
      if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      const stEl = document.getElementById(this.surveyAudioState.statusElId);
      if (stEl) stEl.textContent = 'Đã dừng đọc âm thanh';
      this.surveyAudioState.isPlaying = false;
      this.surveyAudioState.isPaused = false;
    }
    this.updateSurveyAudioBtnState(false);
  }"""

if old_stop in code:
    code = code.replace(old_stop, new_stop, 1)
    print("1. Successfully updated stopSurveyAudioNarration")
else:
    print("1. Could not find old_stop")

# 2. Update startSurveyAudioNarration to set this.tklkAudioActive = true and sync audioEl with paragraphs
old_start_narr = """  async startSurveyAudioNarration(contentSelector, statusElId, playPauseBtnId, startIndex = 0) {
    this.stopSurveyAudioNarration();

    const chapterId = this.currentTklkChapterId || this.activeSurveyChapterId || 1;
    const voiceModeSel = document.getElementById('tklk-modal-voice-mode') || document.getElementById('survey-audio-voice-mode');
    const voiceMode = voiceModeSel ? voiceModeSel.value : 'alden';
    const audioSrc = `data/tklk/audio/${chapterId}.mp3`;

    // 1. Nếu chọn Giọng ALDEN và bắt đầu từ đầu (startIndex === 0), kiểm tra file MP3 phòng thu
    if (voiceMode === 'alden' && startIndex === 0) {
      let hasStudioAudio = false;
      try {
        const check = await fetch(audioSrc, { method: 'HEAD' });
        const cType = check.headers.get('content-type') || '';
        const cLen = parseInt(check.headers.get('content-length') || '0', 10);
        // Xác nhận là tệp âm thanh thực sự (tránh SPA fallback trả về index.html 200)
        if (check.ok && (cType.includes('audio') || cType.includes('mpeg') || cLen > 10000)) {
          hasStudioAudio = true;
        }
      } catch (e) {
        hasStudioAudio = false;
      }

      if (hasStudioAudio) {
        let audioEl = document.getElementById('survey-audio-media-element');
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.id = 'survey-audio-media-element';
          document.body.appendChild(audioEl);
        }

        audioEl.src = audioSrc;
        audioEl.playbackRate = this.surveyAudioSpeed || 1.0;

        const ppBtn = document.getElementById(playPauseBtnId);
        if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        this.updateSurveyAudioBtnState(true);

        const stEl = document.getElementById(statusElId);
        if (stEl) {
          stEl.innerHTML = `<span style="color:var(--accent-gold); font-weight:700;"><i class="fa-solid fa-microphone"></i> Giọng ALDEN Studio (OmniVoice)</span> &bull; Đang phát Chương ${chapterId} phòng thu chính hãng`;
        }

        this.surveyAudioState = {
          isPlaying: true,
          isPaused: false,
          isMediaElement: true,
          audioEl,
          statusElId,
          playPauseBtnId
        };

        audioEl.onended = () => {
          this.stopSurveyAudioNarration();
          this.showToast('Đã phát xong toàn bộ chương Lược Khảo!', 'success');
        };

        audioEl.onerror = () => {
          console.warn('Audio element error, falling back to Web Speech API');
          this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
        };

        audioEl.play().catch(e => {
          console.warn('Auto-play blocked or error:', e);
          this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
        });
        return;
      }
    }

    // 2. Mở chương nào cũng đọc được ngay lập tức qua Web Speech API (ưu tiên giọng nam trầm)
    this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
  }"""

new_start_narr = """  async startSurveyAudioNarration(contentSelector, statusElId, playPauseBtnId, startIndex = 0) {
    this.stopSurveyAudioNarration();
    this.tklkAudioActive = true;

    const chapterId = this.currentTklkChapterId || this.activeSurveyChapterId || 1;
    const voiceModeSel = document.getElementById('tklk-modal-voice-mode') || document.getElementById('survey-audio-voice-mode');
    const voiceMode = voiceModeSel ? voiceModeSel.value : 'alden';
    const audioSrc = `data/tklk/audio/${chapterId}.mp3`;

    // 1. Nếu chọn Giọng ALDEN và bắt đầu từ đầu (startIndex === 0), kiểm tra file MP3 phòng thu
    if (voiceMode === 'alden' && startIndex === 0) {
      let hasStudioAudio = false;
      try {
        const check = await fetch(audioSrc, { method: 'HEAD' });
        const cType = check.headers.get('content-type') || '';
        const cLen = parseInt(check.headers.get('content-length') || '0', 10);
        // Xác nhận là tệp âm thanh thực sự (tránh SPA fallback trả về index.html 200)
        if (check.ok && (cType.includes('audio') || cType.includes('mpeg') || cLen > 10000)) {
          hasStudioAudio = true;
        }
      } catch (e) {
        hasStudioAudio = false;
      }

      if (hasStudioAudio) {
        let audioEl = document.getElementById('survey-audio-media-element');
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.id = 'survey-audio-media-element';
          document.body.appendChild(audioEl);
        }

        audioEl.src = audioSrc;
        audioEl.playbackRate = this.surveyAudioSpeed || 1.0;

        const ppBtn = document.getElementById(playPauseBtnId);
        if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        this.updateSurveyAudioBtnState(true);

        const stEl = document.getElementById(statusElId);
        if (stEl) {
          stEl.innerHTML = `<span style="color:var(--accent-gold); font-weight:700;"><i class="fa-solid fa-microphone"></i> Giọng ALDEN Studio (OmniVoice)</span> &bull; Đang phát Chương ${chapterId} phòng thu chính hãng`;
        }

        this.surveyAudioState = {
          isPlaying: true,
          isPaused: false,
          isMediaElement: true,
          audioEl,
          statusElId,
          playPauseBtnId,
          chapterId
        };

        // Đồng bộ viền sáng đoạn văn theo tiến trình phát của tệp MP3 phòng thu
        audioEl.ontimeupdate = () => {
          if (!audioEl.duration || !this.surveyAudioState || !this.surveyAudioState.isPlaying) return;
          const ratio = audioEl.currentTime / audioEl.duration;
          const contentEl = document.querySelector(contentSelector);
          if (!contentEl) return;
          const rawElements = Array.from(contentEl.querySelectorAll('p, h1, h2, h3, h4, h5, li, blockquote'));
          const leafElements = rawElements.filter(el => !el.querySelector('p, h1, h2, h3, h4, h5, li, blockquote') && (el.innerText || '').trim().length > 5);
          if (leafElements.length === 0) return;
          const targetIdx = Math.min(leafElements.length - 1, Math.floor(ratio * leafElements.length));
          const currentReading = contentEl.querySelector('.tklk-paragraph-reading');
          if (currentReading !== leafElements[targetIdx]) {
            contentEl.querySelectorAll('.tklk-paragraph-reading').forEach(el => el.classList.remove('tklk-paragraph-reading'));
            leafElements[targetIdx].classList.add('tklk-paragraph-reading');
            leafElements[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (stEl) {
              const pct = Math.round(ratio * 100);
              stEl.innerHTML = `<span style="color:var(--accent-gold); font-weight:700;"><i class="fa-solid fa-microphone"></i> Giọng ALDEN Studio (OmniVoice)</span> &bull; Đang phát đoạn ${targetIdx + 1}/${leafElements.length} (${pct}%) &bull; Chương ${chapterId}`;
            }
          }
        };

        audioEl.onended = () => {
          if (chapterId < 114) {
            const nextId = chapterId + 1;
            const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
            if (isModalOpen) {
              this.openTklkChapter(nextId, true);
            } else {
              this.renderSurveyChapter(nextId, true);
            }
            return;
          }
          this.tklkAudioActive = false;
          this.stopSurveyAudioNarration();
          this.showToast('Đã phát xong toàn bộ chương Lược Khảo!', 'success');
        };

        audioEl.onerror = () => {
          console.warn('Audio element error, falling back to Web Speech API');
          this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
        };

        audioEl.play().catch(e => {
          console.warn('Auto-play blocked or error:', e);
          this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
        });
        return;
      }
    }

    // 2. Mở chương nào cũng đọc được ngay lập tức qua Web Speech API (ưu tiên giọng nam trầm)
    this.startSurveyWebSpeech(contentSelector, statusElId, playPauseBtnId, voiceMode, startIndex);
  }"""

if old_start_narr in code:
    code = code.replace(old_start_narr, new_start_narr, 1)
    print("2. Successfully updated startSurveyAudioNarration with auto-advance and MP3 text-sync")
else:
    print("2. Could not find old_start_narr")

# 3. Update speakSurveyParagraph when reaching end of chapter to auto-advance
old_speak_end = """    if (currentIndex >= paragraphs.length) {
      this.stopSurveyAudioNarration();
      this.showToast('Đã đọc xong toàn bộ chương Lược Khảo!', 'success');
      return;
    }"""

new_speak_end = """    if (currentIndex >= paragraphs.length) {
      const curChId = this.currentTklkChapterId || this.activeSurveyChapterId || 1;
      if (curChId < 114) {
        const nextId = curChId + 1;
        this.showToast(`Đã đọc xong! Đang chuyển tiếp sang Chương ${nextId}...`, 'info');
        const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
        if (isModalOpen) {
          this.openTklkChapter(nextId, true);
        } else {
          this.renderSurveyChapter(nextId, true);
        }
        return;
      }
      this.tklkAudioActive = false;
      this.stopSurveyAudioNarration();
      this.showToast('Đã đọc xong toàn bộ chương Lược Khảo!', 'success');
      return;
    }"""

if old_speak_end in code:
    code = code.replace(old_speak_end, new_speak_end, 1)
    print("3. Successfully updated speakSurveyParagraph end condition")
else:
    print("3. Could not find old_speak_end")

# 4. Update openTklkChapterJumpModal to pass autoPlay state
old_jump_modal_code = """      grid.querySelectorAll('.tklk-jump-item-btn').forEach(btn => {
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
      });
    };

    renderGrid('', activeCat);

    // Xử lý nút Đi Đến & phím Enter trên ô nhập số
    const handleNumGo = () => {
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

new_jump_modal_code = """      grid.querySelectorAll('.tklk-jump-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const chId = parseInt(btn.dataset.chapter, 10);
          if (chId) {
            modal.classList.add('hidden');
            const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
            this.stopSurveyAudioNarration();
            const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
            if (isModalOpen) {
              this.openTklkChapter(chId, isAudioActive);
            } else {
              this.renderSurveyChapter(chId, isAudioActive);
            }
          }
        });
      });
    };

    renderGrid('', activeCat);

    // Xử lý nút Đi Đến & phím Enter trên ô nhập số
    const handleNumGo = () => {
      const val = parseInt(numInput?.value, 10);
      if (val >= 1 && val <= 114) {
        modal.classList.add('hidden');
        const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
        this.stopSurveyAudioNarration();
        const isModalOpen = !document.getElementById('portal-utility-modal')?.classList.contains('hidden');
        if (isModalOpen) {
          this.openTklkChapter(val, isAudioActive);
        } else {
          this.renderSurveyChapter(val, isAudioActive);
        }
      } else {
        this.showToast('Vui lòng nhập số chương từ 1 đến 114', 'warning');
      }
    };"""

if old_jump_modal_code in code:
    code = code.replace(old_jump_modal_code, new_jump_modal_code, 1)
    print("4. Successfully updated openTklkChapterJumpModal with isAudioActive")
else:
    print("4. Could not find old_jump_modal_code")

# 5. Update renderSurveyChapter(chapterId, autoPlay = false)
old_render_survey_ch = """  async renderSurveyChapter(chapterId) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.activeSurveyChapterId = id;"""

new_render_survey_ch = """  async renderSurveyChapter(chapterId, autoPlay = false) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.activeSurveyChapterId = id;
    this.currentTklkChapterId = id;
    if (autoPlay) this.tklkAudioActive = true;"""

if old_render_survey_ch in code:
    code = code.replace(old_render_survey_ch, new_render_survey_ch, 1)
    print("5a. Successfully updated renderSurveyChapter signature")
else:
    print("5a. Could not find old_render_survey_ch")

# Update renderSurveyChapter nav buttons
old_survey_nav_buttons = """    container.querySelector('#btn-survey-prev')?.addEventListener('click', () => {
      if (id > 1) {
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id - 1);
      }
    });
    container.querySelector('#btn-survey-footer-prev')?.addEventListener('click', () => {
      if (id > 1) {
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id - 1);
      }
    });

    container.querySelector('#btn-survey-next')?.addEventListener('click', () => {
      if (id < 114) {
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id + 1);
      }
    });
    container.querySelector('#btn-survey-footer-next')?.addEventListener('click', () => {
      if (id < 114) {
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id + 1);
      }
    });"""

new_survey_nav_buttons = """    const triggerSurveyPrev = () => {
      if (id > 1) {
        const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id - 1, isAudioActive);
      }
    };
    const triggerSurveyNext = () => {
      if (id < 114) {
        const isAudioActive = Boolean(this.tklkAudioActive || (this.surveyAudioState && this.surveyAudioState.isPlaying));
        this.stopSurveyAudioNarration();
        this.renderSurveyChapter(id + 1, isAudioActive);
      }
    };

    container.querySelector('#btn-survey-prev')?.addEventListener('click', triggerSurveyPrev);
    container.querySelector('#btn-survey-footer-prev')?.addEventListener('click', triggerSurveyPrev);
    container.querySelector('#btn-survey-next')?.addEventListener('click', triggerSurveyNext);
    container.querySelector('#btn-survey-footer-next')?.addEventListener('click', triggerSurveyNext);"""

if old_survey_nav_buttons in code:
    code = code.replace(old_survey_nav_buttons, new_survey_nav_buttons, 1)
    print("5b. Successfully updated renderSurveyChapter nav buttons with isAudioActive")
else:
    print("5b. Could not find old_survey_nav_buttons")

# Update renderSurveyChapter autoplay trigger
old_survey_autoplay = """    audioCloseBtn?.addEventListener('click', () => {
      this.stopSurveyAudioNarration();
      if (audioBar) audioBar.style.display = 'none';
    });"""

new_survey_autoplay = """    audioCloseBtn?.addEventListener('click', () => {
      this.tklkAudioActive = false;
      this.stopSurveyAudioNarration();
      if (audioBar) audioBar.style.display = 'none';
    });

    audioStopBtn?.addEventListener('click', () => {
      this.tklkAudioActive = false;
      this.stopSurveyAudioNarration();
    });

    if (autoPlay || this.tklkAudioActive) {
      this.tklkAudioActive = true;
      if (audioBar) audioBar.style.display = 'block';
      setTimeout(() => {
        this.startSurveyAudioNarration('#survey-chapter-body', 'survey-audio-status-text', 'btn-survey-audio-play-pause', 0);
      }, 120);
    }"""

if old_survey_autoplay in code:
    code = code.replace(old_survey_autoplay, new_survey_autoplay, 1)
    print("5c. Successfully updated renderSurveyChapter autoplay execution")
else:
    print("5c. Could not find old_survey_autoplay")

# 6. Update openTklkChapter(chapterId, autoPlay = false)
old_open_tklk_sig = """  async openTklkChapter(chapterId) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.currentTklkChapterId = id;
    this.activeSurveyChapterId = id;"""

new_open_tklk_sig = """  async openTklkChapter(chapterId, autoPlay = false) {
    const id = parseInt(chapterId, 10);
    if (isNaN(id) || id < 1 || id > 114) return;

    this.currentTklkChapterId = id;
    this.activeSurveyChapterId = id;
    if (autoPlay) this.tklkAudioActive = true;"""

if old_open_tklk_sig in code:
    code = code.replace(old_open_tklk_sig, new_open_tklk_sig, 1)
    print("6a. Successfully updated openTklkChapter signature")
else:
    print("6a. Could not find old_open_tklk_sig")

# Update openTklkChapter toolbar prev/next
old_modal_toolbar_nav = """    tabsContainer.querySelector('#btn-tklk-prev')?.addEventListener('click', () => {
      if (id > 1) this.openTklkChapter(id - 1);
    });

    tabsContainer.querySelector('#btn-tklk-next')?.addEventListener('click', () => {
      if (id < 114) this.openTklkChapter(id + 1);
    });"""

new_modal_toolbar_nav = """    const triggerModalPrev = () => {
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
    tabsContainer.querySelector('#btn-tklk-next')?.addEventListener('click', triggerModalNext);"""

if old_modal_toolbar_nav in code:
    code = code.replace(old_modal_toolbar_nav, new_modal_toolbar_nav, 1)
    print("6b. Successfully updated openTklkChapter toolbar nav buttons")
else:
    print("6b. Could not find old_modal_toolbar_nav")

# Update openTklkChapter footer prev/next
old_modal_footer_nav = """    // Connect footer buttons
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
    });"""

new_modal_footer_nav = """    // Connect footer buttons
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

    bodyContainer.querySelector('#btn-tklk-footer-next')?.addEventListener('click', triggerModalNext);"""

if old_modal_footer_nav in code:
    code = code.replace(old_modal_footer_nav, new_modal_footer_nav, 1)
    print("6c. Successfully updated openTklkChapter footer nav buttons")
else:
    print("6c. Could not find old_modal_footer_nav")

# Update openTklkChapter audio controls stop and close
old_modal_audio_ctrls = """    modalStopBtn?.addEventListener('click', () => {
      this.stopSurveyAudioNarration();
    });

    modalCloseBtn?.addEventListener('click', () => {
      this.stopSurveyAudioNarration();
      if (modalAudioBar) modalAudioBar.style.display = 'none';
    });"""

new_modal_audio_ctrls = """    modalStopBtn?.addEventListener('click', () => {
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
    }"""

if old_modal_audio_ctrls in code:
    code = code.replace(old_modal_audio_ctrls, new_modal_audio_ctrls, 1)
    print("6d. Successfully updated openTklkChapter modal audio controls & autoplay execution")
else:
    print("6d. Could not find old_modal_audio_ctrls")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved updated app.js with audio-follow-chapter synchronization!")
