#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
from pathlib import Path

app_js = Path(r"E:\kinhthanh\js\app.js")
text = app_js.read_text(encoding="utf-8")

# 1. Update startSurveyAudioNarration: remove `&& startIndex === 0`
old_check = "if (voiceMode === 'alden' && startIndex === 0) {"
new_check = "if (voiceMode === 'alden') {"

if old_check in text:
    text = text.replace(old_check, new_check, 1)
    print("[1] Patched voiceMode === 'alden'")
else:
    print("[FAIL 1] Could not find voiceMode alden check")

# 2. Add MP3 seeking logic in startSurveyAudioNarration
old_state = """        this.surveyAudioState = {
          isPlaying: true,
          isPaused: false,
          isMediaElement: true,
          audioEl,
          statusElId,
          playPauseBtnId,
          chapterId
        };"""

new_state = """        this.surveyAudioState = {
          isPlaying: true,
          isPaused: false,
          isMediaElement: true,
          audioEl,
          statusElId,
          playPauseBtnId,
          chapterId,
          startIndex
        };

        // Nếu người dùng nhấp chọn đoạn văn bất kỳ, tua thẳng đến vị trí tương ứng trong MP3
        if (startIndex > 0) {
          const seekToParagraph = () => {
            const contentEl = document.querySelector(contentSelector);
            if (!contentEl) return;
            const rawElements = Array.from(contentEl.querySelectorAll('p, h1, h2, h3, h4, h5, li, blockquote'));
            const leafElements = rawElements.filter(el => !el.querySelector('p, h1, h2, h3, h4, h5, li, blockquote') && (el.innerText || '').trim().length > 5);
            if (leafElements.length > 0 && audioEl.duration) {
              const targetTime = (startIndex / leafElements.length) * audioEl.duration;
              try { audioEl.currentTime = targetTime; } catch(e) {}
            }
          };
          if (audioEl.readyState >= 1) {
            seekToParagraph();
          } else {
            audioEl.addEventListener('loadedmetadata', seekToParagraph, { once: true });
          }
        }"""

if old_state in text:
    text = text.replace(old_state, new_state, 1)
    print("[2] Patched MP3 seek on start")
else:
    print("[FAIL 2] Could not find old_state")

# 3. Patch playSurveyAudioFromElement to seek MP3 without switching to Web Speech
old_elem = """    if (this.surveyAudioState && this.surveyAudioState.isPlaying && !this.surveyAudioState.isMediaElement) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.surveyAudioState.currentIndex = foundIdx;
      this.surveyAudioState.isPaused = false;
      const ppBtn = document.getElementById(playPauseBtnId);
      if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      this.updateSurveyAudioBtnState(true);
      this.speakSurveyParagraph();
    } else {
      this.startSurveyAudioNarration(contentSelector, statusElId, playPauseBtnId, foundIdx);
    }"""

new_elem = """    if (this.surveyAudioState && this.surveyAudioState.isPlaying) {
      if (this.surveyAudioState.isMediaElement && this.surveyAudioState.audioEl) {
        // Nhảy vị trí trực tiếp trong MP3 phòng thu
        const rawElements = Array.from(contentEl.querySelectorAll('p, h1, h2, h3, h4, h5, li, blockquote'));
        const leafElements = rawElements.filter(el => !el.querySelector('p, h1, h2, h3, h4, h5, li, blockquote') && (el.innerText || '').trim().length > 5);
        if (leafElements.length > 0 && this.surveyAudioState.audioEl.duration) {
          const targetTime = (foundIdx / leafElements.length) * this.surveyAudioState.audioEl.duration;
          try {
            this.surveyAudioState.audioEl.currentTime = targetTime;
            this.surveyAudioState.audioEl.play().catch(e => console.warn(e));
          } catch(e) {}
        }
        return;
      }
      if (!this.surveyAudioState.isMediaElement && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        this.surveyAudioState.currentIndex = foundIdx;
        this.surveyAudioState.isPaused = false;
        const ppBtn = document.getElementById(playPauseBtnId);
        if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        this.updateSurveyAudioBtnState(true);
        this.speakSurveyParagraph();
        return;
      }
    }
    this.startSurveyAudioNarration(contentSelector, statusElId, playPauseBtnId, foundIdx);"""

if old_elem in text:
    text = text.replace(old_elem, new_elem, 1)
    print("[3] Patched playSurveyAudioFromElement")
else:
    print("[FAIL 3] Could not find old_elem")

app_js.write_text(text, encoding="utf-8")
print("[SUCCESS] All MP3 seek and audio sync updates applied!")
