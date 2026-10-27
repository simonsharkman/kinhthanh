# -*- coding: utf-8 -*-
"""
Script apply_audio_verse_highlight.py
Nghiên cứu & triển khai tính năng Đánh Dấu Sáng Lên Câu Kinh Thánh Khi Đọc / Nghe Audio:
1. Đồng bộ thời gian thực giữa MP3 Audio Studio HD (WordProAudio) và từng câu Kinh Thánh.
2. Tự động tính toán bản đồ thời gian (Timing Map) dựa trên số lượng từ và dấu câu của từng câu.
3. Khi phát âm thanh, câu đang đọc lập tức được đánh dấu sáng bừng lên (luminous gold aura, glowing border, highlighted number badge).
4. Cuộn mượt mà giữ câu đang đọc trong tầm mắt tự nhiên.
5. Cho phép người dùng nhấp vào bất kỳ câu nào để nhảy âm thanh đến đúng câu đó (Verse-level Audio Seeking).
6. Nút Câu Tiếp Theo / Câu Trước Đó chuyển câu mượt mà.
"""

import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# --- 1. Cập nhật css/components.css ---
COMPONENTS_CSS_PATH = "E:/kinhthanh/css/components.css"
with open(COMPONENTS_CSS_PATH, "r", encoding="utf-8") as f:
    comp_css = f.read()

old_comp_rule = """/* Reading Verse Active Highlight */
.verse-reading-active {
  background: rgba(212, 175, 55, 0.14) !important;
  border: none !important;
  border-left: 3.5px solid var(--accent-gold) !important;
  padding-left: 0.65rem !important;
  border-radius: 6px !important;
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.15) !important;
  transition: all 0.25s ease;
}"""

new_comp_rule = """/* Reading Verse Active Highlight (Đánh dấu sáng lên câu Kinh Thánh khi nghe Audio) */
.verse-item.verse-reading-active,
.verse-reading-active {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.08) 75%, transparent 100%) !important;
  border: none !important;
  border-left: 4.5px solid var(--accent-gold, #d4af37) !important;
  padding-left: 0.75rem !important;
  border-radius: 6px !important;
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.25), inset 0 0 10px rgba(212, 175, 55, 0.05) !important;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.verse-item.verse-reading-active .verse-number {
  background: var(--accent-gold, #d4af37) !important;
  color: var(--bg-primary, #0b130e) !important;
  padding: 1px 6px !important;
  border-radius: 4px !important;
  border: none !important;
  opacity: 1 !important;
  font-weight: 800 !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.45) !important;
}

.verse-item.verse-reading-active .verse-text {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.25);
}"""

comp_css_norm = comp_css.replace("\r\n", "\n")
if old_comp_rule in comp_css_norm:
    comp_css_norm = comp_css_norm.replace(old_comp_rule, new_comp_rule)
    with open(COMPONENTS_CSS_PATH, "w", encoding="utf-8") as f:
        f.write(comp_css_norm)
    print("[OK] components.css updated with radiant verse glow styling")

# --- 2. Cập nhật css/layout.css ---
LAYOUT_CSS_PATH = "E:/kinhthanh/css/layout.css"
with open(LAYOUT_CSS_PATH, "r", encoding="utf-8") as f:
    layout_css = f.read()

old_layout_rule1 = """.verse-item.verse-reading-active {
  background: rgba(16, 185, 129, 0.12) !important;
  border: none !important;
  border-left: 3.5px solid var(--accent-gold, #10b981) !important;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.08) !important;
  transform: none !important;
}"""

new_layout_rule1 = """.verse-item.verse-reading-active {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0.08) 75%, transparent 100%) !important;
  border: none !important;
  border-left: 4.5px solid var(--accent-gold, #d4af37) !important;
  box-shadow: 0 0 16px rgba(212, 175, 55, 0.25), inset 0 0 10px rgba(212, 175, 55, 0.05) !important;
  transform: none !important;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}"""

old_layout_rule2 = """.verse-item.verse-reading-active .verse-number {
  background: transparent !important;
  border: none !important;
  color: var(--accent-gold-light, #34d399) !important;
  opacity: 1 !important;
  font-weight: 800;
}"""

new_layout_rule2 = """.verse-item.verse-reading-active .verse-number {
  background: var(--accent-gold, #d4af37) !important;
  color: var(--bg-primary, #0b130e) !important;
  padding: 1px 6px !important;
  border-radius: 4px !important;
  border: none !important;
  opacity: 1 !important;
  font-weight: 800 !important;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.45) !important;
}"""

layout_css_norm = layout_css.replace("\r\n", "\n")
if old_layout_rule1 in layout_css_norm:
    layout_css_norm = layout_css_norm.replace(old_layout_rule1, new_layout_rule1)
if old_layout_rule2 in layout_css_norm:
    layout_css_norm = layout_css_norm.replace(old_layout_rule2, new_layout_rule2)

with open(LAYOUT_CSS_PATH, "w", encoding="utf-8") as f:
    f.write(layout_css_norm)
print("[OK] layout.css updated with radiant verse glow and badge styling")

# --- 3. Cập nhật js/app.js ---
APP_PATH = "E:/kinhthanh/js/app.js"
with open(APP_PATH, "r", encoding="utf-8") as f:
    app_js = f.read()

app_norm = app_js.replace("\r\n", "\n")

# A. Constructor audioState
old_cons_audio = """    this.audioState = {
      isPlaying: false,
      isPaused: false,
      currentBook: null,
      currentChapter: null,
      currentVerseIndex: 0,
      verses: [],
      utterance: null,
      speed: 1.0
    };"""

new_cons_audio = """    this.audioState = {
      isPlaying: false,
      isPaused: false,
      currentBook: null,
      currentChapter: null,
      currentVerseIndex: 0,
      currentVerseNum: 1,
      verses: [],
      timingMap: [],
      utterance: null,
      speed: 1.0,
      isSeeking: false
    };"""

if old_cons_audio in app_norm:
    app_norm = app_norm.replace(old_cons_audio, new_cons_audio)
    print("[OK] Constructor audioState updated")

# B. rebindReaderVerseEvents: jumpAudioToVerse on verse click when audio is playing
old_rebind = """    // Gắn sự kiện click cho từng câu trong chế độ đọc thường
    readerContainer.querySelectorAll('.verse-item').forEach(el => {
      el.addEventListener('click', () => {
        const verseNum = el.dataset.verse;
        state.selectVerse(verseNum, true);
      });
    });"""

new_rebind = """    // Gắn sự kiện click cho từng câu trong chế độ đọc thường
    readerContainer.querySelectorAll('.verse-item').forEach(el => {
      el.addEventListener('click', () => {
        const verseNum = el.dataset.verse;
        state.selectVerse(verseNum, true);

        // Nếu audio đang phát, đồng bộ nhảy câu phát tương ứng (Interactive Verse-Seek)
        if (this.audioState.isPlaying) {
          this.jumpAudioToVerse(verseNum);
        }
      });
    });"""

if old_rebind in app_norm:
    app_norm = app_norm.replace(old_rebind, new_rebind)
    print("[OK] rebindReaderVerseEvents updated with jumpAudioToVerse")

# C. Add Timing Map Methods & jumpAudioToVerse before playChapterAudio
timing_methods = """  // Xây dựng bản đồ thời gian từng câu (Verse Timing Map) cho MP3 Audio Studio HD
  buildVerseTimingMap(verses, duration) {
    if (!verses || verses.length === 0 || !duration || duration <= 0) return [];

    // Thời gian đọc tiêu đề sách/chương ở đầu file MP3 (~3.2s) và khoảng lặng cuối file (~2.0s)
    const introDuration = Math.min(3.2, duration * 0.08);
    const outroDuration = Math.min(2.0, duration * 0.04);
    const speechDuration = Math.max(1, duration - introDuration - outroDuration);

    const weights = verses.map(v => {
      const text = v.text || v.text_primary || (v.translations && v.translations.BTT) || '';
      const cleanText = text.replace(/\\[\\d+\\]|<[^>]+>/g, '').trim();
      const words = cleanText ? cleanText.split(/\\s+/).length : 5;
      const periods = (cleanText.match(/[.!?]/g) || []).length;
      const commas = (cleanText.match(/[,;:]/g) || []).length;
      return (words * 1.0) + (commas * 0.45) + (periods * 0.9) + 1.2;
    });

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const scale = speechDuration / totalWeight;

    let curr = introDuration;
    return verses.map((v, i) => {
      const dur = weights[i] * scale;
      const startTime = curr;
      const endTime = curr + dur;
      curr = endTime;
      return {
        verseNum: parseInt(v.verse_num, 10),
        startTime: Math.round(startTime * 100) / 100,
        endTime: Math.round(endTime * 100) / 100,
        duration: Math.round(dur * 100) / 100
      };
    });
  }

  // Tìm câu Kinh Thánh tương ứng với mốc thời gian phát audio (currentTime)
  findVerseAtTime(timingMap, currentTime) {
    if (!timingMap || timingMap.length === 0) return null;
    if (currentTime < timingMap[0].startTime) return timingMap[0].verseNum;
    for (let i = 0; i < timingMap.length; i++) {
      if (currentTime >= timingMap[i].startTime && currentTime < timingMap[i].endTime) {
        return timingMap[i].verseNum;
      }
    }
    return timingMap[timingMap.length - 1].verseNum;
  }

  // Nhảy trực tiếp âm thanh đến câu Kinh Thánh được chỉ định
  jumpAudioToVerse(verseNum) {
    const vNum = parseInt(verseNum, 10);
    if (!vNum) return;

    const audioEl = document.getElementById('portal-audio-media-element');
    if (audioEl && audioEl.src && this.audioState.timingMap?.length > 0) {
      const match = this.audioState.timingMap.find(item => item.verseNum === vNum);
      if (match) {
        audioEl.currentTime = match.startTime;
        this.highlightReadingVerse(vNum);
        return;
      }
    }

    if (this.audioState.verses?.length > 0) {
      const idx = this.audioState.verses.findIndex(v => parseInt(v.verse_num, 10) === vNum);
      if (idx !== -1) {
        this.audioState.currentVerseIndex = idx;
        if (!audioEl?.src) {
          this.speakCurrentVerse();
        } else {
          this.highlightReadingVerse(vNum);
        }
      }
    }
  }

  async playChapterAudio(bookId, chapterNum, startVerse = 1) {"""

target_play_audio = "  async playChapterAudio(bookId, chapterNum, startVerse = 1) {"
if target_play_audio in app_norm and "buildVerseTimingMap(" not in app_norm:
    app_norm = app_norm.replace(target_play_audio, timing_methods)
    print("[OK] Added buildVerseTimingMap, findVerseAtTime, and jumpAudioToVerse")

# D. Upgrade playChapterAudio
old_play_body = """    this.audioState.isPlaying = true;
    this.audioState.isPaused = false;
    this.audioState.currentBook = bookId;
    this.audioState.currentChapter = ch;

    const audioEl = document.getElementById('portal-audio-media-element');
    const mp3Url = getChapterAudioUrl(bookId, ch);

    if (audioEl && mp3Url) {
      if (audioEl.src !== mp3Url) {
        audioEl.src = mp3Url;
        audioEl.playbackRate = this.audioState.speed || 1.0;
        audioEl.load();
      }
      this.updatePlayPauseBtnIcon(true);
      this.showToast(`Đang phát âm thanh phòng thu: ${bookNameVi} đoạn ${ch}`, 'info');
      audioEl.play().catch(err => {
        console.warn('Audio auto-play prevented:', err);
        this.updatePlayPauseBtnIcon(false);
        this.showToast(`Nhấp nút Phát (▶) để nghe ${bookNameVi} đoạn ${ch}`, 'info');
      });
    } else {
      // Fallback
      this.speakCurrentVerse();
    }"""

new_play_body = """    this.audioState.isPlaying = true;
    this.audioState.isPaused = false;
    this.audioState.currentBook = bookId;
    this.audioState.currentChapter = ch;
    this.audioState.currentVerseNum = parseInt(startVerse, 10) || 1;
    this.audioState.timingMap = [];

    // Nạp dữ liệu các câu trong chương để tính toán bản đồ thời gian
    const passage = await bibleEngine.loadPassage(bookId, ch);
    this.audioState.verses = passage?.verses || [];

    const audioEl = document.getElementById('portal-audio-media-element');
    const mp3Url = getChapterAudioUrl(bookId, ch);

    if (audioEl && mp3Url) {
      if (audioEl.src !== mp3Url) {
        audioEl.src = mp3Url;
        audioEl.playbackRate = this.audioState.speed || 1.0;
        audioEl.load();
      }

      const setupTimingMap = () => {
        if (audioEl.duration && this.audioState.verses.length > 0) {
          this.audioState.timingMap = this.buildVerseTimingMap(this.audioState.verses, audioEl.duration);
          if (startVerse > 1) {
            const match = this.audioState.timingMap.find(m => m.verseNum === parseInt(startVerse, 10));
            if (match) audioEl.currentTime = match.startTime;
          }
        }
      };

      if (audioEl.duration && Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
        setupTimingMap();
      } else {
        audioEl.addEventListener('loadedmetadata', setupTimingMap, { once: true });
      }

      // Đánh dấu sáng lên câu bắt đầu
      this.highlightReadingVerse(startVerse);

      this.updatePlayPauseBtnIcon(true);
      this.showToast(`Đang phát âm thanh phòng thu: ${bookNameVi} đoạn ${ch}`, 'info');
      audioEl.play().catch(err => {
        console.warn('Audio auto-play prevented:', err);
        this.updatePlayPauseBtnIcon(false);
        this.showToast(`Nhấp nút Phát (▶) để nghe ${bookNameVi} đoạn ${ch}`, 'info');
      });
    } else {
      // Fallback sang Web Speech API
      this.audioState.currentVerseIndex = Math.max(0, parseInt(startVerse, 10) - 1);
      this.speakCurrentVerse();
    }"""

if old_play_body in app_norm:
    app_norm = app_norm.replace(old_play_body, new_play_body)
    print("[OK] playChapterAudio updated with timing map initialization and initial verse highlight")

# E. Upgrade highlightReadingVerse
old_highlight = """  highlightReadingVerse(verseNum) {
    document.querySelectorAll('.verse-reading-active').forEach(el => el.classList.remove('verse-reading-active'));
    const isPortal = state.activeView === 'portal';
    const selector = isPortal
      ? `#portal-reader-chapter-container .verse-item[data-verse="${verseNum}"]`
      : `.verse-item[data-verse="${verseNum}"]`;
    const target = document.querySelector(selector);
    if (target) {
      target.classList.add('verse-reading-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }"""

new_highlight = """  highlightReadingVerse(verseNum) {
    const vNum = parseInt(verseNum, 10);
    if (!vNum) return;

    // Xóa trạng thái câu đang đọc cũ
    document.querySelectorAll('.verse-reading-active').forEach(el => el.classList.remove('verse-reading-active'));

    // Gắn lớp đánh dấu sáng lên cho câu đang đọc (trên cả Portal Reader và Focus Reader)
    const targets = document.querySelectorAll(`.verse-item[data-verse="${vNum}"]`);
    targets.forEach(el => {
      el.classList.add('verse-reading-active');
    });

    // Cuộn nhẹ nhàng để câu đang đọc luôn nằm trong tầm mắt dễ đọc nhất
    const isPortal = state.activeView === 'portal';
    const activeContainer = isPortal
      ? document.getElementById('portal-reader-chapter-container')
      : document.getElementById('reader-chapter-container');

    if (activeContainer) {
      const activeEl = activeContainer.querySelector(`.verse-item[data-verse="${vNum}"]`);
      if (activeEl) {
        const rect = activeEl.getBoundingClientRect();
        const isInViewport = (rect.top >= 90 && rect.bottom <= (window.innerHeight - 90));
        if (!isInViewport) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }"""

if old_highlight in app_norm:
    app_norm = app_norm.replace(old_highlight, new_highlight)
    print("[OK] highlightReadingVerse updated with all-readers glow and smooth viewport detection")

# F. Upgrade timeupdate in initAudioPlayerControls
old_timeupdate = """      audioEl.addEventListener('timeupdate', () => {
        if (audioEl.duration && !this.audioState.isSeeking) {
          const pct = (audioEl.currentTime / audioEl.duration) * 100;
          const slider = document.getElementById('audio-seek-slider');
          if (slider) slider.value = pct;
          const curTimeEl = document.getElementById('audio-current-time');
          if (curTimeEl) curTimeEl.textContent = this.formatAudioTime(audioEl.currentTime);
        }
      });"""

new_timeupdate = """      audioEl.addEventListener('timeupdate', () => {
        if (audioEl.duration && !this.audioState.isSeeking) {
          const pct = (audioEl.currentTime / audioEl.duration) * 100;
          const slider = document.getElementById('audio-seek-slider');
          if (slider) slider.value = pct;
          const curTimeEl = document.getElementById('audio-current-time');
          if (curTimeEl) curTimeEl.textContent = this.formatAudioTime(audioEl.currentTime);

          // Cập nhật bản đồ thời gian nếu chưa sẵn sàng
          if ((!this.audioState.timingMap || this.audioState.timingMap.length === 0) && this.audioState.verses?.length > 0) {
            this.audioState.timingMap = this.buildVerseTimingMap(this.audioState.verses, audioEl.duration);
          }

          // Tự động đánh dấu sáng lên câu đang đọc (Audio Verse Highlight Sync)
          if (this.audioState.timingMap && this.audioState.timingMap.length > 0) {
            const activeV = this.findVerseAtTime(this.audioState.timingMap, audioEl.currentTime);
            if (activeV && activeV !== this.audioState.currentVerseNum) {
              this.audioState.currentVerseNum = activeV;
              this.highlightReadingVerse(activeV);

              const subEl = document.getElementById('audio-player-subtitle');
              if (subEl) {
                const totalV = this.audioState.verses.length;
                subEl.innerHTML = `<span class="audio-badge-studio"><i class="fa-solid fa-microphone"></i> Studio HD</span> Đang đọc câu <strong>${activeV}</strong> / ${totalV} (Bản Truyền Thống)`;
              }
            }
          }
        }
      });"""

if old_timeupdate in app_norm:
    app_norm = app_norm.replace(old_timeupdate, new_timeupdate)
    print("[OK] timeupdate updated with real-time verse highlight sync")

# G. Upgrade nextVerseAudio and prevVerseAudio
old_next_prev = """  nextVerseAudio() {
    this.nextChapterAudio();
  }

  prevVerseAudio() {
    this.prevChapterAudio();
  }"""

new_next_prev = """  nextVerseAudio() {
    if (this.audioState.timingMap?.length > 0) {
      const curV = this.audioState.currentVerseNum || 1;
      const nextV = curV + 1;
      if (nextV <= this.audioState.timingMap.length) {
        this.jumpAudioToVerse(nextV);
        return;
      }
    }
    this.nextChapterAudio();
  }

  prevVerseAudio() {
    if (this.audioState.timingMap?.length > 0) {
      const curV = this.audioState.currentVerseNum || 1;
      const prevV = curV - 1;
      if (prevV >= 1) {
        this.jumpAudioToVerse(prevV);
        return;
      }
    }
    this.prevChapterAudio();
  }"""

if old_next_prev in app_norm:
    app_norm = app_norm.replace(old_next_prev, new_next_prev)
    print("[OK] nextVerseAudio and prevVerseAudio updated with verse-by-verse audio seeking")

with open(APP_PATH, "w", encoding="utf-8") as f:
    f.write(app_norm)

print("SUCCESS: app.js, components.css, and layout.css updated successfully!")
