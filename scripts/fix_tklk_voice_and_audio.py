#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix TKLK Voice Switching, Voice Persistence, and Audio Stop/Play Controls.
"""

import re
from pathlib import Path

app_js_path = Path(r"E:\kinhthanh\js\app.js")
content = app_js_path.read_text(encoding="utf-8")

# 1. Update speakSurveyParagraph & stopSurveyAudioNarration
pattern_speak = re.compile(
    r"(const spokenText = this\.normalizeBibleAudioText\(currentItem\.text\);\s*"
    r"const utterance = new SpeechSynthesisUtterance\(spokenText\);\s*"
    r"utterance\.lang = 'vi-VN';\s*"
    r"utterance\.rate = this\.surveyAudioState\.speed \|\| 1\.0;\s*)"
    r"(const voices = window\.speechSynthesis\.getVoices\(\);.*?"
    r"window\.speechSynthesis\.speak\(utterance\);\s*\}\s*"
    r"stopSurveyAudioNarration\(\)\s*\{.*?"
    r"this\.updateSurveyAudioBtnState\(false\);\s*\})",
    re.DOTALL
)

replacement_speak = r"""\1
    // Hạ trầm ấm áp cho ALDEN & Nam Minh, trong trẻo cho Hoài My
    if (voiceMode === 'hoaimy') {
      utterance.pitch = 1.05;
    } else {
      utterance.pitch = 0.88;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (voiceMode === 'hoaimy') {
      selectedVoice = voices.find(v => (v.name.includes('HoaiMy') || v.name.includes('Female')) && (v.lang.includes('vi') || v.lang.includes('VI')));
    } else {
      // NamMinh / Male voice prioritized
      selectedVoice = voices.find(v => (v.name.includes('NamMinh') || v.name.includes('Nam') || v.name.toLowerCase().includes('male')) && (v.lang.includes('vi') || v.lang.includes('VI')));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    }
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => {
      if (!this.tklkAudioActive || !this.surveyAudioState || !this.surveyAudioState.isPlaying || this.surveyAudioState.isPaused) {
        return;
      }
      this.surveyAudioState.currentIndex++;
      this.speakSurveyParagraph();
    };

    utterance.onerror = (err) => {
      if (err && (err.error === 'canceled' || err.error === 'interrupted')) {
        return;
      }
      console.warn('Survey audio error:', err);
      if (this.tklkAudioActive && this.surveyAudioState && this.surveyAudioState.isPlaying && !this.surveyAudioState.isPaused) {
        this.surveyAudioState.currentIndex++;
        setTimeout(() => this.speakSurveyParagraph(), 300);
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  stopSurveyAudioNarration() {
    this.tklkAudioActive = false;
    if (this.surveyAudioState) {
      this.surveyAudioState.isPlaying = false;
      this.surveyAudioState.isPaused = false;
      const ppBtn = document.getElementById(this.surveyAudioState.playPauseBtnId);
      if (ppBtn) ppBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      const stEl = document.getElementById(this.surveyAudioState.statusElId);
      if (stEl) stEl.textContent = 'Đã dừng đọc âm thanh';
    }

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
    this.updateSurveyAudioBtnState(false);
  }"""

if pattern_speak.search(content):
    content = pattern_speak.sub(replacement_speak, content, count=1)
    print("[1] Patched speakSurveyParagraph & stopSurveyAudioNarration")
else:
    print("[WARN 1] Could not match speakSurveyParagraph pattern")

# 2. Update status text in speakSurveyParagraph to accurately reflect voice
pattern_st = re.compile(
    r"const voiceLabel = voiceMode === 'hoaimy' \? 'Nữ Hoài My' : 'Nam Minh';",
    re.DOTALL
)
replacement_st = """let voiceLabel = 'Nam Trầm';
      if (voiceMode === 'hoaimy') voiceLabel = 'Nữ Hoài My';
      else if (voiceMode === 'alden') voiceLabel = 'ALDEN Studio (Web Trầm)';"""

if pattern_st.search(content):
    content = pattern_st.sub(replacement_st, content, count=1)
    print("[2] Patched status voiceLabel")
else:
    print("[WARN 2] Could not match status voiceLabel")

# 3. Fix openTklkChapter: voice dropdown & stop button
# Make sure voice selection remembers user choice
pattern_modal_voice_html = re.compile(
    r"""<select id="tklk-modal-voice-mode" class="portal-select".*?>\s*"""
    r"""<option value="alden" selected>.*?Giọng ALDEN Studio</option>\s*"""
    r"""<option value="namminh">.*?Giọng Nam Trầm</option>\s*"""
    r"""<option value="hoaimy">.*?Giọng Nữ</option>\s*"""
    r"""</select>""",
    re.DOTALL
)

replacement_modal_voice_html = """<select id="tklk-modal-voice-mode" class="portal-select" style="padding: 0.2rem 0.4rem; font-size: 0.78rem; border-radius: 4px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                <option value="alden" ${savedVoice === 'alden' ? 'selected' : ''}>🎙️ Giọng ALDEN Studio</option>
                <option value="namminh" ${savedVoice === 'namminh' ? 'selected' : ''}>🔊 Giọng Nam Trầm</option>
                <option value="hoaimy" ${savedVoice === 'hoaimy' ? 'selected' : ''}>🔊 Giọng Nữ</option>
              </select>"""

# Look for where savedVoice should be declared before template
pattern_decl = re.compile(r"""(async openTklkChapter\(id = 1, autoPlay = false\) \{.*?)(\/\/ Ultra-Compact Reader View)""", re.DOTALL)
replacement_decl = r"""\1const savedVoice = this.tklkVoiceMode || localStorage.getItem('tklk_voice_mode') || 'alden';
    this.tklkVoiceMode = savedVoice;

    \2"""

if pattern_decl.search(content):
    content = pattern_decl.sub(replacement_decl, content, count=1)
    print("[3] Added savedVoice declaration in openTklkChapter")
else:
    print("[WARN 3] Could not match openTklkChapter declaration")

if pattern_modal_voice_html.search(content):
    content = pattern_modal_voice_html.sub(replacement_modal_voice_html, content, count=1)
    print("[4] Patched modal voice select HTML")
else:
    print("[WARN 4] Could not match modal voice select HTML")

# 4. Stop button styling in openTklkChapter
pattern_stop_btn = re.compile(
    r"""<button type="button" class="btn-secondary" id="btn-tklk-modal-audio-stop"[^>]*>""",
    re.DOTALL
)
replacement_stop_btn = """<button type="button" id="btn-tklk-modal-audio-stop" style="width: 32px; height: 32px; min-width: 32px; max-width: 32px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; cursor: pointer; background: rgba(255,255,255,0.08); border: 1px solid var(--border-subtle); color: var(--text-primary); flex-shrink: 0;" title="Dừng đọc">"""

if pattern_stop_btn.search(content):
    content = pattern_stop_btn.sub(replacement_stop_btn, content, count=1)
    print("[5] Patched modal audio stop button styling")
else:
    print("[WARN 5] Could not match stop button styling")

# 5. Play button styling flex-shrink: 0
pattern_play_btn = re.compile(
    r"""<button type="button" class="btn-primary" id="btn-tklk-modal-audio-play"[^>]*>""",
    re.DOTALL
)
replacement_play_btn = """<button type="button" class="btn-primary" id="btn-tklk-modal-audio-play" style="width: 32px; height: 32px; min-width: 32px; max-width: 32px; border-radius: 50%; padding: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer; flex-shrink: 0;" title="Phát / Tạm dừng">"""

if pattern_play_btn.search(content):
    content = pattern_play_btn.sub(replacement_play_btn, content, count=1)
    print("[6] Patched modal audio play button styling")
else:
    print("[WARN 6] Could not match play button styling")

# 6. Wire modalVoiceModeSel change event handler
pattern_wire_voice = re.compile(
    r"""(modalVoiceModeSel\?\.addEventListener\('change', \(\) => \{.*?\n\s*\}\);)""",
    re.DOTALL
)
replacement_wire_voice = """modalVoiceModeSel?.addEventListener('change', (e) => {
      const chosenVoice = e.target.value;
      this.tklkVoiceMode = chosenVoice;
      try { localStorage.setItem('tklk_voice_mode', chosenVoice); } catch(err) {}

      if (this.surveyAudioState && this.surveyAudioState.isPlaying) {
        const curIdx = this.surveyAudioState.currentIndex || 0;
        this.stopSurveyAudioNarration();
        this.tklkAudioActive = true;
        setTimeout(() => {
          this.startSurveyAudioNarration('#tklk-reader-content', 'tklk-modal-audio-status', 'btn-tklk-modal-audio-play', curIdx);
        }, 50);
      } else {
        const stEl = document.getElementById('tklk-modal-audio-status');
        if (stEl) {
          const vName = chosenVoice === 'hoaimy' ? 'Giọng Nữ' : (chosenVoice === 'namminh' ? 'Giọng Nam Trầm' : 'Giọng ALDEN Studio');
          stEl.textContent = `Đã chọn ${vName} • Bấm Phát để nghe`;
        }
      }
    });"""

if pattern_wire_voice.search(content):
    content = pattern_wire_voice.sub(replacement_wire_voice, content, count=1)
    print("[7] Patched modalVoiceModeSel change listener")
else:
    print("[WARN 7] Could not match modalVoiceModeSel change listener")

app_js_path.write_text(content, encoding="utf-8")
print("[SUCCESS] app.js updated successfully!")
