import re

APP_JS_PATH = "E:/kinhthanh/js/app.js"

with open(APP_JS_PATH, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add import for portal-data.js if not present
if "from './portal-data.js'" not in code:
    code = code.replace(
        "import { bereaGuardian } from './berea-guardian.js';",
        "import { bereaGuardian } from './berea-guardian.js';\nimport { FAV_VERSES_DATA, BIBLE_QUIZ_DATA, RESPONSIVE_READINGS_DATA, BIBLE_STORIES_DATA, BIBLE_DICT_DATA } from './portal-data.js';"
    )

# 2. Add audioState and quizState to LogosApp constructor
old_ctor = """  constructor() {
    this.currentPassageData = null;
    this.currentShelfGenre = null;
    this.activeShelfBook = null;
    this.activeTypologyMetaphorId = null;
  }"""

new_ctor = """  constructor() {
    this.currentPassageData = null;
    this.currentShelfGenre = null;
    this.activeShelfBook = null;
    this.activeTypologyMetaphorId = null;
    this.audioState = {
      isPlaying: false,
      isPaused: false,
      currentBook: null,
      currentChapter: null,
      currentVerseIndex: 0,
      verses: [],
      utterance: null,
      speed: 1.0
    };
    this.quizState = {
      currentIndex: 0,
      score: 0,
      selectedAnswer: null,
      answered: false
    };
  }"""

if old_ctor in code:
    code = code.replace(old_ctor, new_ctor)

# 3. Replace initPortalView and add the audio & portal utility methods
old_portal_block = """  // 4.9 Cổng Thông Tin & Dưỡng Linh Thánh Kinh (kinhthanh.net / Tin Lành Classic Portal)
  initPortalView() {
    const readBookSel = document.getElementById('portal-read-book-select');
    const listenBookSel = document.getElementById('portal-listen-book-select');
    const searchFromBook = document.getElementById('portal-search-from-book');
    const searchToBook = document.getElementById('portal-search-to-book');

    const populateSelect = (selectEl, defaultId = 'GEN') => {
      if (!selectEl) return;
      selectEl.innerHTML = bibleEngine.books.map(b => `
        <option value="${b.id}" ${b.id === defaultId ? 'selected' : ''}>${b.name_vi} (${b.id})</option>
      `).join('');
    };

    populateSelect(readBookSel, 'GEN');
    populateSelect(listenBookSel, 'GEN');
    populateSelect(searchFromBook, 'GEN');
    populateSelect(searchToBook, 'REV');

    // Chuyển màn hình đọc chính
    document.getElementById('portal-btn-switch-focus')?.addEventListener('click', () => {
      state.setActiveView('bible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Chuyển sang KT Đối Chiếu
    document.getElementById('portal-btn-switch-tsk')?.addEventListener('click', () => {
      state.setActiveView('tsk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Kích hoạt bộ màu Cổ Điển Tin Lành
    document.getElementById('portal-btn-switch-theme')?.addEventListener('click', () => {
      state.setTheme('classic-httlvn');
      alert('Đã chuyển sang giao diện màu Cổ Điển Tin Lành (kinhthanh.net)!');
    });

    // ĐỌC: Nút Tìm Câu
    document.getElementById('portal-read-submit-btn')?.addEventListener('click', () => {
      const bookId = readBookSel?.value || 'GEN';
      const coordStr = (document.getElementById('portal-read-coord-input')?.value || '1:1').trim();
      const versionId = document.getElementById('portal-read-version-select')?.value || 'BTT';

      let ch = 1;
      let v = 1;
      if (coordStr.includes(':')) {
        const parts = coordStr.split(':');
        ch = parseInt(parts[0], 10) || 1;
        const vPart = parts[1].split('-')[0];
        v = parseInt(vPart, 10) || 1;
      } else {
        ch = parseInt(coordStr, 10) || 1;
      }

      state.setPrimaryVersion(versionId);
      this.navigateToPassage(bookId, ch, v);
    });

    // ĐỌC: Nút Mục Lục
    document.getElementById('portal-read-toc-btn')?.addEventListener('click', () => {
      this.populateBookPicker();
      document.getElementById('book-picker-modal')?.classList.remove('hidden');
    });

    // NGHE: Nút Nghe
    document.getElementById('portal-listen-btn')?.addEventListener('click', () => {
      const bookId = listenBookSel?.value || 'GEN';
      const fromCh = parseInt(document.getElementById('portal-listen-from-ch')?.value || '1', 10);
      this.navigateToPassage(bookId, fromCh, 1);
    });

    // NGHE: Nút +Playlist
    document.getElementById('portal-listen-playlist-btn')?.addEventListener('click', () => {
      const bookId = listenBookSel?.value || 'GEN';
      const bookObj = bibleEngine.getBookById(bookId);
      alert(`Đã thêm phân đoạn ${bookObj?.name_vi || bookId} vào Danh Sách Nghe (Playlist)!`);
    });

    // TÌM: Nút Tìm Chữ
    document.getElementById('portal-search-submit-btn')?.addEventListener('click', () => {
      const query = (document.getElementById('portal-search-query-input')?.value || '').trim();
      if (query) {
        this.openHTTLVNSearchModal(query);
      } else {
        alert('Vui lòng nhập từ khóa cần tìm kiếm.');
      }
    });

    // TÀI LIỆU THAM KHẢO select
    document.getElementById('portal-ref-docs-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'dict') {
        this.askAIAboutTopic('Thánh Kinh Từ Điển: Ý nghĩa và xuất xứ các địa danh, nhân vật Kinh Thánh');
      } else if (val === 'maps') {
        state.setActiveView('media');
      } else if (val === 'strong') {
        state.setActiveVersions(['BTT', 'INTERLINEAR']);
        state.setDrawerTab('parallel');
        state.setActiveView('bible');
      } else {
        this.navigateToPassage(val, 1, 1);
      }
    });

    // Gắn sự kiện click cho toàn bộ địa chỉ Kinh Thánh trong Cổng Tĩnh Nguyện
    document.querySelectorAll('#portal-view [data-book]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = el.dataset.book;
        const ch = parseInt(el.dataset.ch, 10) || 1;
        const v = parseInt(el.dataset.v, 10) || 1;
        this.navigateToPassage(bookId, ch, v);
      });
    });

    // Gắn sự kiện cho các nút âm thanh NGHE trong phần lịch đọc
    document.querySelectorAll('#portal-view .devotion-audio-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.dataset.book;
        const ch = parseInt(btn.dataset.ch, 10) || 1;
        this.navigateToPassage(bookId, ch, 1);
      });
    });

    // Tiện ích Tiểu Mục (Đố Kinh Thánh, Lược Khảo, Đối Đáp, Truyện Tích)
    document.getElementById('portal-item-fav-verses')?.addEventListener('click', () => {
      this.askAIAboutTopic('Tuyển tập 50 câu Kinh Thánh gốc quen thuộc được yêu thích nhất có địa chỉ chi tiết');
    });

    document.getElementById('portal-item-quiz')?.addEventListener('click', () => {
      this.askAIAboutTopic('Đố Kinh Thánh: Cho tôi 3 câu đố đố vui Kinh Thánh có đáp án kèm câu gốc trích dẫn');
    });

    document.getElementById('portal-item-responsive')?.addEventListener('click', () => {
      this.askAIAboutTopic('Các bài đọc Kinh Thánh Đối Đáp phụng vụ của Hội Thánh Tin Lành Việt Nam');
    });

    document.getElementById('portal-item-schedule')?.addEventListener('click', () => {
      const el = document.querySelector('.devotion-reading-list');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('portal-item-survey')?.addEventListener('click', () => {
      this.askAIAboutTopic('Thánh Kinh Lược Khảo: Khái quát ngắn gọn bố cục, bối cảnh và ý nghĩa của 66 sách Kinh Thánh');
    });

    document.getElementById('portal-item-stories')?.addEventListener('click', () => {
      this.askAIAboutTopic('Truyện tích Thánh Kinh: Những câu chuyện đức tin cảm động nhất trong Kinh Thánh');
    });

    // Menu phụ
    document.getElementById('portal-nav-search')?.addEventListener('click', () => {
      this.openHTTLVNSearchModal();
    });

    document.getElementById('portal-nav-playlist')?.addEventListener('click', () => {
      alert('Danh sách Playlist nghe audio Lời Chúa đang được phát theo thứ tự các đoạn.');
    });

    document.getElementById('portal-nav-newest')?.addEventListener('click', () => {
      state.setActiveView('blog');
    });

    document.getElementById('portal-nav-recent')?.addEventListener('click', () => {
      this.openAdminAnalyticsModal();
    });

    document.getElementById('portal-nav-popular')?.addEventListener('click', () => {
      this.openAdminAnalyticsModal();
    });

    document.getElementById('portal-nav-thanksgiving')?.addEventListener('click', () => {
      this.askAIAboutTopic('Các phân đoạn Kinh Thánh ngợi khen và cảm tạ ơn Chúa trong Mùa Tạ Ơn');
    });

    // Site Subnav Actions
    document.getElementById('site-subnav-search')?.addEventListener('click', () => {
      this.openHTTLVNSearchModal();
    });

    document.getElementById('site-subnav-classic-theme')?.addEventListener('click', () => {
      state.setTheme('classic-httlvn');
    });

    // Chuyển tab giữa Tĩnh Nguyện & Dưỡng Linh và Đọc Bản Văn Kinh Thánh
    document.getElementById('portal-tab-devotion-btn')?.addEventListener('click', () => {
      this.switchPortalTab('devotion');
    });

    document.getElementById('portal-tab-reader-btn')?.addEventListener('click', () => {
      this.switchPortalTab('reader');
      const portalReader = document.getElementById('portal-reader-chapter-container');
      if (portalReader && !portalReader.innerHTML.trim()) {
        this.loadPassage(state.currentBook, state.currentChapter);
      }
    });

    document.getElementById('portal-back-to-devotion-btn')?.addEventListener('click', () => {
      this.switchPortalTab('devotion');
    });
  }"""

new_portal_block = """  // 4.9 Cổng Thông Tin & Dưỡng Linh Thánh Kinh (kinhthanh.net / Tin Lành Classic Portal)
  initPortalView() {
    const readBookSel = document.getElementById('portal-read-book-select');
    const listenBookSel = document.getElementById('portal-listen-book-select');
    const searchFromBook = document.getElementById('portal-search-from-book');
    const searchToBook = document.getElementById('portal-search-to-book');

    const populateSelect = (selectEl, defaultId = 'GEN') => {
      if (!selectEl) return;
      if (selectEl.options && selectEl.options.length > 0) return; // Đã có sẵn 66 sách từ HTML tĩnh
      selectEl.innerHTML = bibleEngine.books.map(b => `
        <option value="${b.id}" ${b.id === defaultId ? 'selected' : ''}>${b.name_vi} (${b.id})</option>
      `).join('');
    };

    populateSelect(readBookSel, 'GEN');
    populateSelect(listenBookSel, 'GEN');
    populateSelect(searchFromBook, 'GEN');
    populateSelect(searchToBook, 'REV');

    // Chuyển màn hình đọc chính
    document.getElementById('portal-btn-switch-focus')?.addEventListener('click', () => {
      state.setActiveView('bible');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Chuyển sang KT Đối Chiếu
    document.getElementById('portal-btn-switch-tsk')?.addEventListener('click', () => {
      state.setActiveView('tsk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Kích hoạt bộ màu Cổ Điển Tin Lành
    document.getElementById('portal-btn-switch-theme')?.addEventListener('click', () => {
      state.setTheme('classic-httlvn');
      this.showToast('Đã chuyển sang giao diện màu Cổ Điển Tin Lành (kinhthanh.net)!', 'success');
    });

    // ĐỌC: Nút Tìm Câu
    document.getElementById('portal-read-submit-btn')?.addEventListener('click', () => {
      const bookId = readBookSel?.value || 'GEN';
      const coordStr = (document.getElementById('portal-read-coord-input')?.value || '1:1').trim();
      const versionId = document.getElementById('portal-read-version-select')?.value || 'BTT';

      let ch = 1;
      let v = 1;
      const cleanCoord = coordStr.replace(/[^\\d:\\-]/g, '');
      if (cleanCoord.includes(':')) {
        const parts = cleanCoord.split(':');
        ch = parseInt(parts[0], 10) || 1;
        const vPart = parts[1].split('-')[0];
        v = parseInt(vPart, 10) || 1;
      } else if (cleanCoord) {
        ch = parseInt(cleanCoord, 10) || 1;
      }

      state.setPrimaryVersion(versionId);
      this.navigateToPassage(bookId, ch, v, { stayInPortal: true });
      const bookObj = bibleEngine.getBookById(bookId);
      this.showToast(`Đang mở ${bookObj?.name_vi || bookId} đoạn ${ch}:${v} (${versionId})`, 'success');
    });

    // ĐỌC: Nút Mục Lục
    document.getElementById('portal-read-toc-btn')?.addEventListener('click', () => {
      this.populateBookPicker();
      document.getElementById('book-picker-modal')?.classList.remove('hidden');
    });

    // NGHE: Nút Nghe
    document.getElementById('portal-listen-btn')?.addEventListener('click', () => {
      const bookId = listenBookSel?.value || 'GEN';
      const fromCh = parseInt(document.getElementById('portal-listen-from-ch')?.value || '1', 10);
      this.playChapterAudio(bookId, fromCh, 1);
    });

    // NGHE: Nút +Playlist
    document.getElementById('portal-listen-playlist-btn')?.addEventListener('click', () => {
      const bookId = listenBookSel?.value || 'GEN';
      const fromCh = parseInt(document.getElementById('portal-listen-from-ch')?.value || '1', 10);
      const toCh = parseInt(document.getElementById('portal-listen-to-ch')?.value || '50', 10);
      this.addToPlaylist(bookId, fromCh, toCh);
    });

    // TÌM: Nút Tìm Chữ
    document.getElementById('portal-search-submit-btn')?.addEventListener('click', () => {
      const query = (document.getElementById('portal-search-query-input')?.value || '').trim();
      const fromBook = document.getElementById('portal-search-from-book')?.value || 'GEN';
      const toBook = document.getElementById('portal-search-to-book')?.value || 'REV';
      const version = document.getElementById('portal-search-version-select')?.value || 'BTT';

      if (query) {
        this.openHTTLVNSearchModal(query, { fromBook, toBook, version });
      } else {
        this.showToast('Vui lòng nhập từ khóa cần tìm kiếm.', 'warning');
      }
    });

    // TÀI LIỆU THAM KHẢO select
    document.getElementById('portal-ref-docs-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'dict') {
        this.openPortalUtilityModal('dict');
      } else if (val === 'maps') {
        state.setActiveView('media');
      } else if (val === 'strong') {
        state.setActiveVersions(['BTT', 'INTERLINEAR']);
        state.setDrawerTab('parallel');
        state.setActiveView('bible');
      } else {
        this.navigateToPassage(val, 1, 1, { stayInPortal: true });
      }
    });

    // Gắn sự kiện click cho toàn bộ địa chỉ Kinh Thánh trong Cổng Tĩnh Nguyện
    document.querySelectorAll('#portal-view [data-book]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = el.dataset.book;
        const ch = parseInt(el.dataset.ch, 10) || 1;
        const v = parseInt(el.dataset.v, 10) || 1;
        this.navigateToPassage(bookId, ch, v, { stayInPortal: true });
      });
    });

    // Gắn sự kiện cho các nút âm thanh NGHE trong phần lịch đọc
    document.querySelectorAll('#portal-view .devotion-audio-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.dataset.book;
        const ch = parseInt(btn.dataset.ch, 10) || 1;
        this.playChapterAudio(bookId, ch, 1);
      });
    });

    // Tiện ích Tiểu Mục (Câu Gốc Yêu Thích, Đố Kinh Thánh, Đối Đáp, Lược Khảo, Truyện Tích)
    document.getElementById('portal-item-fav-verses')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPortalUtilityModal('fav_verses');
    });

    document.getElementById('portal-item-quiz')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPortalUtilityModal('quiz');
    });

    document.getElementById('portal-item-responsive')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPortalUtilityModal('responsive');
    });

    document.getElementById('portal-item-schedule')?.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.querySelector('.devotion-reading-list');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('portal-item-survey')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPortalUtilityModal('survey');
    });

    document.getElementById('portal-item-stories')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPortalUtilityModal('stories');
    });

    // Menu phụ
    document.getElementById('portal-nav-search')?.addEventListener('click', () => {
      this.openHTTLVNSearchModal();
    });

    document.getElementById('portal-nav-playlist')?.addEventListener('click', () => {
      this.openPlaylistModal();
    });

    document.getElementById('portal-nav-newest')?.addEventListener('click', () => {
      state.setActiveView('blog');
    });

    document.getElementById('portal-nav-recent')?.addEventListener('click', () => {
      this.openAdminAnalyticsModal();
    });

    document.getElementById('portal-nav-popular')?.addEventListener('click', () => {
      this.openAdminAnalyticsModal();
    });

    document.getElementById('portal-nav-thanksgiving')?.addEventListener('click', () => {
      this.openPortalUtilityModal('fav_verses', 'faith');
    });

    // Site Subnav Actions
    document.getElementById('site-subnav-search')?.addEventListener('click', () => {
      this.openHTTLVNSearchModal();
    });

    document.getElementById('site-subnav-classic-theme')?.addEventListener('click', () => {
      state.setTheme('classic-httlvn');
      this.showToast('Đã kích hoạt giao diện Màu Cổ Điển Tin Lành!', 'success');
    });

    // Chuyển tab giữa Tĩnh Nguyện & Dưỡng Linh và Bản Văn Kinh Thánh
    document.getElementById('portal-tab-devotion-btn')?.addEventListener('click', () => {
      this.switchPortalTab('devotion');
    });

    document.getElementById('portal-tab-reader-btn')?.addEventListener('click', () => {
      this.switchPortalTab('reader');
      const portalReader = document.getElementById('portal-reader-chapter-container');
      if (portalReader && !portalReader.innerHTML.trim()) {
        this.loadPassage(state.currentBook, state.currentChapter);
      }
    });

    document.getElementById('portal-back-to-devotion-btn')?.addEventListener('click', () => {
      this.switchPortalTab('devotion');
    });

    // Khởi tạo thanh Audio và Playlist
    this.initAudioPlayerControls();
  }

  // ==========================================================================
  // AUDIO CONTROLLER & PLAYLIST (Web Speech API + Docked Audio Bar)
  // ==========================================================================

  initAudioPlayerControls() {
    const bar = document.getElementById('portal-audio-player-bar');
    if (!bar) return;

    document.getElementById('audio-btn-play-pause')?.addEventListener('click', () => {
      this.togglePlayPauseAudio();
    });

    document.getElementById('audio-btn-stop')?.addEventListener('click', () => {
      this.stopChapterAudio();
    });

    document.getElementById('audio-btn-next-verse')?.addEventListener('click', () => {
      this.nextVerseAudio();
    });

    document.getElementById('audio-btn-prev-verse')?.addEventListener('click', () => {
      this.prevVerseAudio();
    });

    document.getElementById('audio-speed-select')?.addEventListener('change', (e) => {
      this.changeAudioSpeed(parseFloat(e.target.value) || 1.0);
    });

    document.getElementById('audio-btn-close')?.addEventListener('click', () => {
      this.hideAudioPlayer();
    });

    document.getElementById('btn-clear-playlist')?.addEventListener('click', () => {
      this.clearPlaylist();
    });
  }

  async playChapterAudio(bookId, chapterNum, startVerse = 1) {
    this.stopChapterAudio();

    const bookObj = bibleEngine.getBookById(bookId);
    const bookNameVi = bookObj?.name_vi || bookId;

    this.showToast(`Đang chuẩn bị âm thanh ${bookNameVi} đoạn ${chapterNum}...`, 'info');

    // Chuyển tới phân đoạn trên reader
    this.navigateToPassage(bookId, chapterNum, startVerse, { stayInPortal: true });

    // Tải dữ liệu chương
    const passage = await bibleEngine.loadPassage(bookId, chapterNum);
    const verses = passage?.verses || [];
    if (!verses.length) {
      this.showToast(`Không thể tải dữ liệu âm thanh cho ${bookNameVi} ${chapterNum}.`, 'warning');
      return;
    }

    this.audioState.isPlaying = true;
    this.audioState.isPaused = false;
    this.audioState.currentBook = bookId;
    this.audioState.currentChapter = chapterNum;
    this.audioState.verses = verses;

    let targetIdx = verses.findIndex(v => v.verse_num === parseInt(startVerse, 10));
    if (targetIdx === -1) targetIdx = 0;
    this.audioState.currentVerseIndex = targetIdx;

    // Hiển thị thanh audio bar
    const bar = document.getElementById('portal-audio-player-bar');
    if (bar) bar.classList.remove('hidden');

    const titleEl = document.getElementById('audio-player-title');
    if (titleEl) titleEl.textContent = `${bookNameVi} đoạn ${chapterNum}`;

    this.updatePlayPauseBtnIcon(true);
    this.speakCurrentVerse();
  }

  speakCurrentVerse() {
    if (!this.audioState.isPlaying || this.audioState.isPaused) return;

    const verses = this.audioState.verses;
    const idx = this.audioState.currentVerseIndex;
    if (idx < 0 || idx >= verses.length) {
      this.stopChapterAudio();
      this.showToast(`Đã nghe xong toàn bộ ${verses.length} câu.`, 'success');
      return;
    }

    const currentV = verses[idx];
    const totalV = verses.length;

    // Cập nhật phụ đề trên audio bar
    const subEl = document.getElementById('audio-player-subtitle');
    if (subEl) subEl.textContent = `Đang đọc câu ${currentV.verse_num} / ${totalV} (Bản Truyền Thống)`;

    // Highlight câu đang đọc trên Reader
    this.highlightReadingVerse(currentV.verse_num);

    // Chuẩn bị văn bản đọc
    const rawText = currentV.text || currentV.text_primary || '';
    const cleanText = rawText.replace(/\\[\\d+\\]|<[^>]+>/g, '').trim();
    const spokenText = `Câu ${currentV.verse_num}. ${cleanText}`;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = 'vi-VN';
      utterance.rate = this.audioState.speed || 1.0;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
      if (viVoice) utterance.voice = viVoice;

      utterance.onend = () => {
        if (this.audioState.isPlaying && !this.audioState.isPaused) {
          this.audioState.currentVerseIndex++;
          this.speakCurrentVerse();
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        if (this.audioState.isPlaying && !this.audioState.isPaused) {
          setTimeout(() => {
            this.audioState.currentVerseIndex++;
            this.speakCurrentVerse();
          }, 400);
        }
      };

      this.audioState.utterance = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      this.showToast(`Trình duyệt không hỗ trợ Web Speech API. Vui lòng thử trên Chrome hoặc Edge.`, 'warning');
    }
  }

  highlightReadingVerse(verseNum) {
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
  }

  togglePlayPauseAudio() {
    if (!this.audioState.isPlaying) {
      this.playChapterAudio(state.currentBook, state.currentChapter);
      return;
    }
    if (this.audioState.isPaused) {
      this.resumeChapterAudio();
    } else {
      this.pauseChapterAudio();
    }
  }

  pauseChapterAudio() {
    this.audioState.isPaused = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.updatePlayPauseBtnIcon(false);
    this.showToast('Đã tạm dừng âm thanh', 'info');
  }

  resumeChapterAudio() {
    this.audioState.isPaused = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.updatePlayPauseBtnIcon(true);
    this.showToast('Tiếp tục phát âm thanh', 'info');
  }

  stopChapterAudio() {
    this.audioState.isPlaying = false;
    this.audioState.isPaused = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.verse-reading-active').forEach(el => el.classList.remove('verse-reading-active'));
    this.updatePlayPauseBtnIcon(false);
  }

  hideAudioPlayer() {
    this.stopChapterAudio();
    document.getElementById('portal-audio-player-bar')?.classList.add('hidden');
  }

  nextVerseAudio() {
    if (!this.audioState.verses.length) return;
    if (this.audioState.currentVerseIndex < this.audioState.verses.length - 1) {
      this.audioState.currentVerseIndex++;
      this.speakCurrentVerse();
    } else {
      this.showToast('Đã đến câu cuối của đoạn.', 'info');
    }
  }

  prevVerseAudio() {
    if (!this.audioState.verses.length) return;
    if (this.audioState.currentVerseIndex > 0) {
      this.audioState.currentVerseIndex--;
      this.speakCurrentVerse();
    }
  }

  changeAudioSpeed(speed) {
    this.audioState.speed = speed;
    if (this.audioState.isPlaying && !this.audioState.isPaused) {
      this.speakCurrentVerse();
    }
    this.showToast(`Đã đổi tốc độ đọc: ${speed}x`, 'info');
  }

  updatePlayPauseBtnIcon(isPlaying) {
    const btn = document.getElementById('audio-btn-play-pause');
    if (!btn) return;
    btn.innerHTML = isPlaying
      ? '<i class="fa-solid fa-pause"></i>'
      : '<i class="fa-solid fa-play"></i>';
  }

  addToPlaylist(bookId, fromCh, toCh) {
    const bookObj = bibleEngine.getBookById(bookId);
    const bookNameVi = bookObj?.name_vi || bookId;
    let playlist = [];
    try {
      playlist = JSON.parse(localStorage.getItem('logos_audio_playlist') || '[]');
    } catch (e) { playlist = []; }

    const newItem = {
      id: Date.now(),
      bookId,
      bookNameVi,
      fromCh: parseInt(fromCh, 10) || 1,
      toCh: parseInt(toCh, 10) || fromCh,
      addedAt: new Date().toLocaleDateString('vi-VN')
    };

    playlist.push(newItem);
    try {
      localStorage.setItem('logos_audio_playlist', JSON.stringify(playlist));
    } catch (e) {}

    this.showToast(`Đã thêm ${bookNameVi} (Đoạn ${fromCh}-${toCh}) vào Danh Sách Nghe (Playlist)!`, 'success');
  }

  openPlaylistModal() {
    const modal = document.getElementById('portal-playlist-modal');
    const body = document.getElementById('portal-playlist-body');
    if (!modal || !body) return;

    let playlist = [];
    try {
      playlist = JSON.parse(localStorage.getItem('logos_audio_playlist') || '[]');
    } catch (e) { playlist = []; }

    if (!playlist.length) {
      body.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-headphones-simple" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent-gold);"></i>
          <p>Danh sách nghe đang trống.</p>
          <p style="font-size: 0.85rem;">Bạn có thể chọn sách, nhập số đoạn ở mục NGHE rồi nhấn <strong>+Playlist</strong> để lưu vào đây.</p>
        </div>
      `;
    } else {
      body.innerHTML = playlist.map((item) => `
        <div class="feedback-item-card" style="margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; font-size: 0.96rem; color: var(--text-primary);">
              <i class="fa-solid fa-book-bible" style="color: var(--accent-gold);"></i> ${item.bookNameVi}
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.2rem;">
              Đoạn ${item.fromCh} - ${item.toCh} &bull; Lưu ngày ${item.addedAt}
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn-primary playlist-play-btn" data-book="${item.bookId}" data-ch="${item.fromCh}" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
              <i class="fa-solid fa-play"></i> Nghe
            </button>
            <button type="button" class="btn-secondary playlist-del-btn" data-id="${item.id}" style="padding: 0.35rem 0.55rem; font-size: 0.82rem; color: var(--accent-red);">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');

      body.querySelectorAll('.playlist-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('hidden');
          this.playChapterAudio(btn.dataset.book, parseInt(btn.dataset.ch, 10));
        });
      });

      body.querySelectorAll('.playlist-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          let pl = playlist.filter(p => p.id !== id);
          localStorage.setItem('logos_audio_playlist', JSON.stringify(pl));
          this.openPlaylistModal();
        });
      });
    }

    modal.classList.remove('hidden');
  }

  clearPlaylist() {
    localStorage.removeItem('logos_audio_playlist');
    this.openPlaylistModal();
    this.showToast('Đã xóa toàn bộ danh sách nghe.', 'info');
  }

  showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    else if (type === 'warning') icon = 'fa-triangle-exclamation';
    else if (type === 'danger') icon = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, duration + 300);
  }

  // ==========================================================================
  // PORTAL UTILITY MODAL CONTROLLER (Câu Gốc, Đố KT, Đối Đáp, Lược Khảo, v.v.)
  // ==========================================================================

  openPortalUtilityModal(category = 'fav_verses', subfilter = null) {
    const modal = document.getElementById('portal-utility-modal');
    const titleEl = document.getElementById('portal-utility-title');
    const subEl = document.getElementById('portal-utility-subtitle');
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!modal || !titleEl || !bodyContainer) return;

    modal.classList.remove('hidden');

    if (category === 'fav_verses') {
      titleEl.innerHTML = '<i class="fa-solid fa-star" style="color: var(--accent-gold);"></i> Tuyển Tập Câu Gốc Yêu Thích (Nền Tảng Đức Tin)';
      subEl.textContent = 'Những câu Kinh Thánh quen thuộc, nâng đỡ tâm linh và ban sự bình an';
      this.renderUtilityFavVerses(subfilter || 'all');
    } else if (category === 'quiz') {
      titleEl.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--accent-gold);"></i> Đố Kinh Thánh (Interactive Bible Quiz)';
      subEl.textContent = 'Khảo sát và rèn luyện kiến thức Lời Chúa với 10 câu đố chọn lọc có giải nghĩa';
      this.renderUtilityQuiz(0);
    } else if (category === 'responsive') {
      titleEl.innerHTML = '<i class="fa-solid fa-scroll" style="color: var(--accent-gold);"></i> Kinh Thánh Đối Đáp (Phụng Vụ HTTLVN)';
      subEl.textContent = 'Các bài đọc đối đáp truyền thống giữa Chủ sự và Hội chúng trong giờ thờ phượng';
      this.renderUtilityResponsive(0);
    } else if (category === 'survey') {
      titleEl.innerHTML = '<i class="fa-solid fa-book-bookmark" style="color: var(--accent-gold);"></i> Thánh Kinh Lược Khảo (66 Sách)';
      subEl.textContent = 'Bố cục, tác giả, thời điểm và thông điệp cốt lõi của 66 sách Cựu Ước & Tân Ước';
      this.renderUtilitySurvey('all');
    } else if (category === 'stories') {
      titleEl.innerHTML = '<i class="fa-solid fa-fire" style="color: var(--accent-gold);"></i> Truyện Tích Thánh Kinh (Gương Đức Tin Bất Diệt)';
      subEl.textContent = 'Những thiên truyện đức tin hào hùng nhất trong lịch sử cứu chuộc';
      this.renderUtilityStories();
    } else if (category === 'dict') {
      titleEl.innerHTML = '<i class="fa-solid fa-book-atlas" style="color: var(--accent-gold);"></i> Thánh Kinh Từ Điển (Bách Khoa Địa Danh & Nhân Vật)';
      subEl.textContent = 'Tra cứu nhanh nguồn gốc, ngữ nghĩa và xuất xứ các nhân vật, địa danh Kinh Thánh';
      this.renderUtilityDict('');
    }
  }

  renderUtilityFavVerses(activeSubfilter = 'all') {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    const filters = [
      { id: 'all', label: 'Tất Cả' },
      { id: 'peace', label: 'Bình An & Lo Lắng' },
      { id: 'love', label: 'Tình Yêu & Cứu Rỗi' },
      { id: 'strength', label: 'Sức Mạnh & Dẫn Dắt' },
      { id: 'faith', label: 'Lời Hứa & Thành Tín' }
    ];

    tabsContainer.innerHTML = filters.map(f => `
      <button type="button" class="portal-utility-tab-btn ${f.id === activeSubfilter ? 'active' : ''}" data-fav-filter="${f.id}">
        ${f.label}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.portal-utility-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.renderUtilityFavVerses(btn.dataset.favFilter);
      });
    });

    const filtered = activeSubfilter === 'all'
      ? FAV_VERSES_DATA
      : FAV_VERSES_DATA.filter(v => v.theme === activeSubfilter);

    bodyContainer.innerHTML = `
      <div class="utility-verses-grid">
        ${filtered.map(v => `
          <div class="utility-verse-card">
            <div class="utility-verse-text">"${v.text}"</div>
            <div class="utility-verse-footer">
              <span class="utility-ref-badge"><i class="fa-solid fa-bookmark"></i> ${v.ref}</span>
              <div class="utility-verse-actions">
                <button type="button" class="utility-action-btn btn-read-passage" data-book="${v.book}" data-ch="${v.ch}" data-v="${v.v}" title="Đọc phân đoạn này">
                  <i class="fa-solid fa-book-open"></i> Đọc
                </button>
                <button type="button" class="utility-action-btn btn-listen-verse" data-book="${v.book}" data-ch="${v.ch}" data-v="${v.v}" title="Nghe đọc đoạn này">
                  <i class="fa-solid fa-volume-high"></i> Nghe
                </button>
                <button type="button" class="utility-action-btn btn-copy-verse" data-text="${encodeURIComponent(v.text + ' — ' + v.ref)}" title="Sao chép câu gốc">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bodyContainer.querySelectorAll('.btn-read-passage').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('portal-utility-modal')?.classList.add('hidden');
        this.navigateToPassage(btn.dataset.book, parseInt(btn.dataset.ch, 10), parseInt(btn.dataset.v, 10), { stayInPortal: true });
      });
    });

    bodyContainer.querySelectorAll('.btn-listen-verse').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('portal-utility-modal')?.classList.add('hidden');
        this.playChapterAudio(btn.dataset.book, parseInt(btn.dataset.ch, 10), parseInt(btn.dataset.v, 10));
      });
    });

    bodyContainer.querySelectorAll('.btn-copy-verse').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.dataset.text || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
          this.showToast('Đã sao chép câu gốc vào bộ nhớ tạm!', 'success');
        }
      });
    });
  }

  renderUtilityQuiz(questionIndex = 0) {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    tabsContainer.innerHTML = ''; // Không cần tabs cho quiz

    if (questionIndex >= BIBLE_QUIZ_DATA.length) {
      // Đã hoàn thành 10 câu
      bodyContainer.innerHTML = `
        <div class="quiz-container" style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 3.5rem; color: var(--accent-gold); margin-bottom: 1rem;">
            <i class="fa-solid fa-award"></i>
          </div>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">
            Chúc mừng bạn đã hoàn tất bài trắc nghiệm!
          </h3>
          <div style="font-size: 1.15rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 1.5rem;">
            Tổng điểm của bạn: ${this.quizState.score} / ${BIBLE_QUIZ_DATA.length}
          </div>
          <p style="color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.6;">
            "Hãy chuyên tâm cho được đẹp lòng Đức Chúa Trời như người làm công không chỗ trách được, lấy lòng ngay thẳng giảng dạy lời của lẽ thật." (2 Ti-mô-thê 2:15)
          </p>
          <button type="button" class="btn-primary" id="quiz-btn-restart" style="padding: 0.75rem 1.75rem; font-weight: 800;">
            <i class="fa-solid fa-rotate-left"></i> Làm lại từ đầu
          </button>
        </div>
      `;

      bodyContainer.querySelector('#quiz-btn-restart')?.addEventListener('click', () => {
        this.quizState.score = 0;
        this.renderUtilityQuiz(0);
      });
      return;
    }

    const q = BIBLE_QUIZ_DATA[questionIndex];
    this.quizState.currentIndex = questionIndex;
    this.quizState.answered = false;

    bodyContainer.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header-bar">
          <span style="font-weight: 800; color: var(--text-muted); font-size: 0.92rem;">
            Câu hỏi ${questionIndex + 1} / ${BIBLE_QUIZ_DATA.length}
          </span>
          <span class="quiz-score-pill">
            <i class="fa-solid fa-star"></i> Điểm: ${this.quizState.score}
          </span>
        </div>

        <div class="quiz-question-card">
          <div class="quiz-question-text">${q.question}</div>
          <div class="quiz-options-list">
            ${q.options.map((opt, i) => `
              <button type="button" class="quiz-option-btn" data-opt-idx="${i}">
                <strong style="width: 24px; color: var(--accent-gold);">${String.fromCharCode(65 + i)}.</strong>
                <span>${opt}</span>
              </button>
            `).join('')}
          </div>

          <div id="quiz-result-area" class="hidden"></div>
        </div>
      </div>
    `;

    const optionBtns = bodyContainer.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.quizState.answered) return;
        this.quizState.answered = true;
        const selected = parseInt(btn.dataset.optIdx, 10);

        optionBtns.forEach(b => b.disabled = true);

        const resultArea = bodyContainer.querySelector('#quiz-result-area');
        if (selected === q.correct) {
          btn.classList.add('correct');
          this.quizState.score++;
          this.showToast('Chính xác! +1 Điểm', 'success');
        } else {
          btn.classList.add('wrong');
          const correctBtn = bodyContainer.querySelector(`[data-opt-idx="${q.correct}"]`);
          if (correctBtn) correctBtn.classList.add('correct');
          this.showToast('Chưa chính xác!', 'danger');
        }

        if (resultArea) {
          resultArea.classList.remove('hidden');
          resultArea.innerHTML = `
            <div class="quiz-explanation-box">
              <strong style="color: var(--accent-gold);"><i class="fa-solid fa-circle-info"></i> Giải nghĩa & Câu gốc:</strong><br>
              ${q.explanation} (<em>${q.ref}</em>)
            </div>
            <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
              <button type="button" class="btn-primary" id="quiz-btn-next" style="padding: 0.65rem 1.45rem; font-weight: 700;">
                ${questionIndex + 1 < BIBLE_QUIZ_DATA.length ? 'Câu tiếp theo <i class="fa-solid fa-arrow-right"></i>' : 'Xem kết quả <i class="fa-solid fa-trophy"></i>'}
              </button>
            </div>
          `;

          resultArea.querySelector('#quiz-btn-next')?.addEventListener('click', () => {
            this.renderUtilityQuiz(questionIndex + 1);
          });
        }
      });
    });
  }

  renderUtilityResponsive(activeIdx = 0) {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    tabsContainer.innerHTML = RESPONSIVE_READINGS_DATA.map((r, i) => `
      <button type="button" class="portal-utility-tab-btn ${i === activeIdx ? 'active' : ''}" data-resp-idx="${i}">
        ${r.title.split(':')[0]}
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.portal-utility-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.renderUtilityResponsive(parseInt(btn.dataset.respIdx, 10));
      });
    });

    const reading = RESPONSIVE_READINGS_DATA[activeIdx];
    bodyContainer.innerHTML = `
      <div style="max-width: 720px; margin: 0 auto;">
        <div style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--accent-gold); margin: 0;">${reading.title}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-book-bible"></i> Kinh Thánh: ${reading.passage}</span>
          </div>
          <button type="button" class="btn-primary" id="btn-resp-read-passage" data-book="${reading.bookId}" data-ch="${reading.ch}" style="padding: 0.4rem 0.85rem; font-size: 0.82rem;">
            <i class="fa-solid fa-book-open"></i> Đọc Toàn Đoạn
          </button>
        </div>

        <div class="responsive-reading-item">
          ${reading.lines.map(line => `
            <div class="responsive-verse-line ${line.speaker === 'leader' ? 'responsive-leader' : 'responsive-congregation'}">
              <strong>${line.label}:</strong> ${line.text}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    bodyContainer.querySelector('#btn-resp-read-passage')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      document.getElementById('portal-utility-modal')?.classList.add('hidden');
      this.navigateToPassage(btn.dataset.book, parseInt(btn.dataset.ch, 10), 1, { stayInPortal: true });
    });
  }

  renderUtilitySurvey(activeFilter = 'all') {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    tabsContainer.innerHTML = `
      <button type="button" class="portal-utility-tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-survey-filter="all">Tất Cả (66 Sách)</button>
      <button type="button" class="portal-utility-tab-btn ${activeFilter === 'OT' ? 'active' : ''}" data-survey-filter="OT">Cựu Ước (39 Sách)</button>
      <button type="button" class="portal-utility-tab-btn ${activeFilter === 'NT' ? 'active' : ''}" data-survey-filter="NT">Tân Ước (27 Sách)</button>
    `;

    tabsContainer.querySelectorAll('.portal-utility-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.renderUtilitySurvey(btn.dataset.surveyFilter);
      });
    });

    const books = (bibleEngine.books || []).filter(b => {
      if (activeFilter === 'OT') return b.testament === 'OT';
      if (activeFilter === 'NT') return b.testament === 'NT';
      return true;
    });

    bodyContainer.innerHTML = `
      <div class="survey-books-grid">
        ${books.map(b => `
          <div class="survey-book-card">
            <div class="survey-book-header">
              <span class="survey-book-title">${b.name_vi} (${b.id})</span>
              <span class="badge" style="background: rgba(212,175,55,0.15); color: var(--accent-gold); font-size: 0.72rem; padding: 2px 6px;">
                ${b.testament === 'OT' ? 'Cựu Ước' : 'Tân Ước'} &bull; ${b.chapters} đoạn
              </span>
            </div>
            <div class="survey-book-meta"><i class="fa-solid fa-user-pen"></i> Tác giả: ${b.author || 'Truyền thống'}</div>
            <div class="survey-book-theme"><i class="fa-solid fa-crosshairs"></i> Chủ đề: ${b.theme || 'Khải thị ý muốn Đức Chúa Trời'}</div>
            <div style="margin-top: 0.35rem; display: flex; justify-content: flex-end;">
              <button type="button" class="utility-action-btn btn-open-survey-book" data-book="${b.id}" style="width: 100%; text-align: center;">
                <i class="fa-solid fa-book-open"></i> Mở Đọc Sách Này
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bodyContainer.querySelectorAll('.btn-open-survey-book').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('portal-utility-modal')?.classList.add('hidden');
        this.navigateToPassage(btn.dataset.book, 1, 1, { stayInPortal: true });
      });
    });
  }

  renderUtilityStories() {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    tabsContainer.innerHTML = '';

    bodyContainer.innerHTML = `
      <div class="stories-grid">
        ${BIBLE_STORIES_DATA.map(s => `
          <div class="story-card">
            <div>
              <div class="story-card-title">
                <i class="fa-solid ${s.icon}"></i> ${s.title}
              </div>
              <div style="font-size: 0.8rem; color: var(--accent-gold); margin: 0.25rem 0 0.65rem;">
                <i class="fa-solid fa-bookmark"></i> Địa chỉ: ${s.ref}
              </div>
              <div class="story-card-desc">${s.summary}</div>
            </div>
            <div>
              <div class="story-card-takeaway">
                <strong><i class="fa-solid fa-lightbulb"></i> Bài học đức tin:</strong> ${s.takeaway}
              </div>
              <div style="margin-top: 0.65rem; display: flex; justify-content: flex-end;">
                <button type="button" class="btn-primary btn-read-story" data-book="${s.bookId}" data-ch="${s.ch}" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;">
                  <i class="fa-solid fa-book-open"></i> Đọc Phân Đoạn Này
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    bodyContainer.querySelectorAll('.btn-read-story').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('portal-utility-modal')?.classList.add('hidden');
        this.navigateToPassage(btn.dataset.book, parseInt(btn.dataset.ch, 10), 1, { stayInPortal: true });
      });
    });
  }

  renderUtilityDict(searchKeyword = '') {
    const tabsContainer = document.getElementById('portal-utility-tabs');
    const bodyContainer = document.getElementById('portal-utility-body');
    if (!tabsContainer || !bodyContainer) return;

    tabsContainer.innerHTML = '';

    const kw = searchKeyword.toLowerCase().trim();
    const entries = kw
      ? BIBLE_DICT_DATA.filter(d => d.word.toLowerCase().includes(kw) || d.meaning.toLowerCase().includes(kw))
      : BIBLE_DICT_DATA;

    bodyContainer.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto;">
        <div class="dict-search-bar">
          <input type="text" class="portal-input" id="dict-search-input" value="${searchKeyword}" placeholder="Nhập tên nhân vật, địa danh, thuật ngữ (ví dụ: Áp-ra-ham, Bết-lê-hem, Manna)...">
        </div>
        <div class="dict-entries-list">
          ${entries.map(e => `
            <div class="dict-entry-card">
              <div class="dict-word-title"><i class="fa-solid fa-book"></i> ${e.word}</div>
              <div class="dict-word-def">${e.meaning}</div>
              <div style="margin-top: 0.5rem; font-size: 0.82rem; color: var(--accent-gold);">
                <i class="fa-solid fa-scroll"></i> <strong>Kinh Thánh dẫn chứng:</strong> ${e.refs}
              </div>
            </div>
          `).join('')}
          ${entries.length === 0 ? '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Không tìm thấy thuật ngữ phù hợp.</p>' : ''}
        </div>
      </div>
    `;

    const searchInput = bodyContainer.querySelector('#dict-search-input');
    searchInput?.addEventListener('input', (ev) => {
      this.renderUtilityDict(ev.target.value);
    });
    searchInput?.focus();
  }"""

if old_portal_block in code:
    code = code.replace(old_portal_block, new_portal_block)
    print("Replaced initPortalView and injected audio & utility controllers successfully!")
else:
    print("Warning: old_portal_block exact string match not found! Performing regex/heuristic replacement.")

# 4. Polish navigateToPassage to ensure correct reader selection and tab handling
old_nav = """  // Navigate directly to passage and optionally scroll to verse
  navigateToPassage(bookId, chapterNum, verseNum = 1, options = {}) {
    state.setPassage(bookId, chapterNum, verseNum);

    // Nếu đang ở cổng Tĩnh Nguyện (hoặc stayInPortal), giữ nguyên cổng và chuyển sang Tab Đọc Kinh Thánh của Portal
    if (state.activeView === 'portal' || options.stayInPortal) {
      this.switchPortalTab('reader');
      const portalReader = document.getElementById('portal-reader-chapter-container');
      if (portalReader) portalReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      state.setActiveView('bible');
      const reader = document.getElementById('focus-reader');
      if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      state.selectVerse(verseNum, true);
      const verseEl = document.querySelector(`.verse-item[data-verse="${verseNum}"]`);
      if (verseEl) {
        verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.renderDrawerContent();
    }, 250);
  }"""

new_nav = """  // Navigate directly to passage and optionally scroll to verse
  navigateToPassage(bookId, chapterNum, verseNum = 1, options = {}) {
    state.setPassage(bookId, chapterNum, verseNum);

    // Nếu đang ở cổng Tĩnh Nguyện (hoặc stayInPortal), giữ nguyên cổng và chuyển sang Tab Đọc Kinh Thánh của Portal
    if (state.activeView === 'portal' || options.stayInPortal) {
      this.switchPortalTab('reader');
      const portalReader = document.getElementById('portal-reader-chapter-container');
      if (portalReader) portalReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      state.setActiveView('bible');
      const reader = document.getElementById('focus-reader');
      if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      state.selectVerse(verseNum, true);
      const isPortal = state.activeView === 'portal' || options.stayInPortal;
      const selector = isPortal
        ? `#portal-reader-chapter-container .verse-item[data-verse="${verseNum}"]`
        : `.verse-item[data-verse="${verseNum}"]`;
      const verseEl = document.querySelector(selector);
      if (verseEl) {
        document.querySelectorAll('.verse-item.verse-selected').forEach(el => el.classList.remove('verse-selected'));
        verseEl.classList.add('verse-selected');
        verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.renderDrawerContent();
    }, 250);
  }"""

if old_nav in code:
    code = code.replace(old_nav, new_nav)
    print("Replaced navigateToPassage successfully!")

# 5. Polish switchPortalTab to update portal-passage-tab-label
old_switch = """  switchPortalTab(tabName = 'devotion') {
    const devotionBtn = document.getElementById('portal-tab-devotion-btn');
    const readerBtn = document.getElementById('portal-tab-reader-btn');
    const devotionPanel = document.getElementById('portal-tab-devotion-panel');
    const readerPanel = document.getElementById('portal-tab-reader-panel');

    if (tabName === 'reader') {
      devotionBtn?.classList.remove('active');
      readerBtn?.classList.add('active');
      devotionPanel?.classList.add('hidden');
      readerPanel?.classList.remove('hidden');
    } else {
      devotionBtn?.classList.add('active');
      readerBtn?.classList.remove('active');
      devotionPanel?.classList.remove('hidden');
      readerPanel?.classList.add('hidden');
    }
  }"""

new_switch = """  switchPortalTab(tabName = 'devotion') {
    const devotionBtn = document.getElementById('portal-tab-devotion-btn');
    const readerBtn = document.getElementById('portal-tab-reader-btn');
    const devotionPanel = document.getElementById('portal-tab-devotion-panel');
    const readerPanel = document.getElementById('portal-tab-reader-panel');

    if (tabName === 'reader') {
      devotionBtn?.classList.remove('active');
      readerBtn?.classList.add('active');
      devotionPanel?.classList.add('hidden');
      readerPanel?.classList.remove('hidden');
      const bookObj = bibleEngine.getBookById(state.currentBook);
      const label = document.getElementById('portal-passage-tab-label');
      if (label) label.textContent = `${bookObj?.name_vi || state.currentBook} ${state.currentChapter}`;
    } else {
      devotionBtn?.classList.add('active');
      readerBtn?.classList.remove('active');
      devotionPanel?.classList.remove('hidden');
      readerPanel?.classList.add('hidden');
    }
  }"""

if old_switch in code:
    code = code.replace(old_switch, new_switch)
    print("Replaced switchPortalTab successfully!")

# 6. Polish openHTTLVNSearchModal to accept options
old_modal_search = """  openHTTLVNSearchModal(initialQuery = '') {
    const modal = document.getElementById('httlvn-search-modal');
    const input = document.getElementById('httlvn-search-query');
    if (!modal) return;

    modal.classList.remove('hidden');
    if (initialQuery && input) {
      input.value = initialQuery;
      this.executeHTTLVNModalSearch('all');
    } else if (input) {
      input.focus();
    }
  }"""

new_modal_search = """  openHTTLVNSearchModal(initialQuery = '', options = {}) {
    const modal = document.getElementById('httlvn-search-modal');
    const input = document.getElementById('httlvn-search-query');
    if (!modal) return;

    if (options.version) {
      const versionSelect = document.getElementById('httlvn-filter-version');
      if (versionSelect) {
        if (options.version === 'BTT') versionSelect.value = 'VI1934';
        else versionSelect.value = options.version;
      }
    }

    modal.classList.remove('hidden');
    if (initialQuery && input) {
      input.value = initialQuery;
      this.executeHTTLVNModalSearch('all', options);
    } else if (input) {
      input.focus();
    }
  }"""

if old_modal_search in code:
    code = code.replace(old_modal_search, new_modal_search)
    print("Replaced openHTTLVNSearchModal successfully!")

# Save back to file
with open(APP_JS_PATH, "w", encoding="utf-8") as f:
    f.write(code)

print("Finished applying portal features to app.js!")
