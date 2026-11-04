import re
from pathlib import Path

app_js_path = Path(r"E:\kinhthanh\js\app.js")
text = app_js_path.read_text(encoding="utf-8")

# 1. Update renderSurveyChapter savedVoice
old_top = """    if (!this.tklkFontSize) {
      try {
        const saved = parseInt(localStorage.getItem('tklk_font_size'), 10);
        if (saved && saved >= 13 && saved <= 26) this.tklkFontSize = saved;
        else this.tklkFontSize = 17;
      } catch(e) {
        this.tklkFontSize = 17;
      }
    }

    container.innerHTML = `"""

new_top = """    if (!this.tklkFontSize) {
      try {
        const saved = parseInt(localStorage.getItem('tklk_font_size'), 10);
        if (saved && saved >= 13 && saved <= 26) this.tklkFontSize = saved;
        else this.tklkFontSize = 17;
      } catch(e) {
        this.tklkFontSize = 17;
      }
    }

    const savedVoice = this.tklkVoiceMode || localStorage.getItem('tklk_voice_mode') || 'alden';
    this.tklkVoiceMode = savedVoice;

    container.innerHTML = `"""

# 2. Update renderSurveyChapter select HTML
old_select = """              <select id="survey-audio-voice-mode" class="portal-select" style="padding: 0.3rem 0.55rem; font-size: 0.82rem; border-radius: 6px;">
                <option value="alden" selected>🎙️ Giọng ALDEN Studio</option>
                <option value="namminh">🔊 Giọng Nam Trầm (Trực Tuyến)</option>
                <option value="hoaimy">🔊 Giọng Nữ (Trực Tuyến)</option>
              </select>"""

new_select = """              <select id="survey-audio-voice-mode" class="portal-select" style="padding: 0.3rem 0.55rem; font-size: 0.82rem; border-radius: 6px; background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-subtle);">
                <option value="alden" ${savedVoice === 'alden' ? 'selected' : ''}>🎙️ Giọng ALDEN Studio</option>
                <option value="namminh" ${savedVoice === 'namminh' ? 'selected' : ''}>🔊 Giọng Nam Trầm (Trực Tuyến)</option>
                <option value="hoaimy" ${savedVoice === 'hoaimy' ? 'selected' : ''}>🔊 Giọng Nữ (Trực Tuyến)</option>
              </select>"""

# 3. Update renderSurveyChapter change listener
old_listener = """    const audioVoiceModeSel = container.querySelector('#survey-audio-voice-mode');
    audioVoiceModeSel?.addEventListener('change', () => {
      if (this.surveyAudioState && this.surveyAudioState.isPlaying) {
        this.stopSurveyAudioNarration();
        this.startSurveyAudioNarration('#survey-chapter-body', 'survey-audio-status-text', 'btn-survey-audio-play-pause');
      }
    });"""

new_listener = """    const audioVoiceModeSel = container.querySelector('#survey-audio-voice-mode');
    audioVoiceModeSel?.addEventListener('change', (e) => {
      const chosenVoice = e.target.value;
      this.tklkVoiceMode = chosenVoice;
      try { localStorage.setItem('tklk_voice_mode', chosenVoice); } catch(err) {}

      if (this.surveyAudioState && this.surveyAudioState.isPlaying) {
        const curIdx = this.surveyAudioState.currentIndex || 0;
        this.stopSurveyAudioNarration();
        this.tklkAudioActive = true;
        setTimeout(() => {
          this.startSurveyAudioNarration('#survey-chapter-body', 'survey-audio-status-text', 'btn-survey-audio-play-pause', curIdx);
        }, 50);
      }
    });"""

if old_top in text:
    text = text.replace(old_top, new_top, 1)
    print('[1] Patched renderSurveyChapter savedVoice')
else:
    print('[FAIL 1]')

if old_select in text:
    text = text.replace(old_select, new_select, 1)
    print('[2] Patched renderSurveyChapter select')
else:
    print('[FAIL 2]')

if old_listener in text:
    text = text.replace(old_listener, new_listener, 1)
    print('[3] Patched renderSurveyChapter change listener')
else:
    print('[FAIL 3]')

app_js_path.write_text(text, encoding="utf-8")
print('Done!')
