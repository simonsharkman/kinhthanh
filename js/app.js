/* ==========================================================================
   LOGOS MULTIVERSE - MASTER APPLICATION ORCHESTRATOR
   Integrates Parallel Bible Engine, Hermeneutics, Media, AI & Community
   ========================================================================== */

import { state, ALL_TRANSLATIONS, THEMES_LIST, FONT_SIZES } from './state.js';
import { storage } from './storage.js';
import { bibleEngine } from './bible-engine.js';
import { hermeneuticsEngine } from './hermeneutics-engine.js';
import { crossRefEngine } from './crossref-engine.js';
import { mediaEngine } from './media-engine.js';
import { aiAssistant } from './ai-assistant.js';
import { blogSystem } from './blog-community.js';
import { bereaGuardian } from './berea-guardian.js';

class LogosApp {
  constructor() {
    this.currentPassageData = null;
    this.currentShelfGenre = null;
    this.activeShelfBook = null;
    this.activeTypologyMetaphorId = null;
  }

  async init() {
    console.log('🏛️ Khởi động Logos MultiVerse Studio Edition...');

    // 1. Khởi tạo toàn bộ dữ liệu & engines
    await Promise.all([
      bibleEngine.init(),
      hermeneuticsEngine.init(),
      mediaEngine.init(),
      blogSystem.init()
    ]);

    // 2. Thiết lập giao diện theme & font size
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    document.documentElement.setAttribute('data-font-size', state.currentFontSize);
    this.updateThemeUI(state.currentTheme);
    this.updateFontSizeUI(state.currentFontSize);
    this.initThemeSelectorModal();
    this.updateAdminBannerUI(state.adminBannerConfig);
    this.updateRoleUI(state.currentUserRole);

    // 3. Đăng ký theo dõi State changes
    state.subscribe((event, data) => this.handleStateEvent(event, data));

    // 4. Gắn kết sự kiện UI
    this.bindEvents();
    this.initMobileResponsiveUX();

    // Dọn dẹp bộ nhớ đệm cục bộ nếu có thiết lập cũ
    try {
      localStorage.removeItem('logos_pref_reading_mode');
      localStorage.removeItem('logos_pref_ai_popup');
    } catch (e) {}

    // 5. Render nội dung ban đầu (Giăng 1)
    this.updatePrimaryVersionLabel();
    this.populatePrimaryVersionSelector();
    await this.renderChapter(state.currentBook, state.currentChapter);
    this.populateBookPicker();
    this.populateVersionSelector();
    storage.recordSessionVisit();
    this.updateHeaderVisitorCount();
    storage.recordPassageVisit(state.currentBook, state.currentChapter);

    // 6. Khởi tạo Google AdSense (Cho phép Google hiển thị quảng cáo duy trì Website)
    this.initGoogleAdSense();

    // 7. Khởi tạo Cổng Thông Tin & Dưỡng Linh Cổ Điển Tin Lành
    this.initPortalView();

    // Nếu URL có #portal / ?view=portal, #tsk / ?view=tsk hoặc #donate / ?view=donate thì tự động mở ngay Tab tương ứng
    if (typeof window !== 'undefined' && (window.location.hash === '#portal' || window.location.search.includes('view=portal'))) {
      state.setActiveView('portal');
    } else if (typeof window !== 'undefined' && (window.location.hash === '#tsk' || window.location.search.includes('view=tsk'))) {
      state.setActiveView('tsk');
    } else if (typeof window !== 'undefined' && (window.location.hash === '#donate' || window.location.search.includes('view=donate'))) {
      state.setActiveView('donate');
    } else if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      // Trên máy tính (>= 992px): Mặc định mở ngay Bảng Đối Chiếu (Drawer Inspector) cho Câu 1
      state.setReadingMode('standard');
      state.setDrawerTab('parallel');
      state.selectVerse(1, true);
    }

    console.log('✨ Logos MultiVerse đã sẵn sàng phục vụ học viên!');
  }

  // State Event Listener
  handleStateEvent(event, data) {
    switch (event) {
      case 'PRIMARY_VERSION_CHANGED':
        this.updatePrimaryVersionLabel();
        this.populatePrimaryVersionSelector();
        storage.recordTranslationUsed(data.primaryVersion);
        this.renderChapter(state.currentBook, state.currentChapter);
        break;
      case 'PASSAGE_CHANGED':
        storage.recordPassageVisit(data.book, data.chapter);
        this.renderChapter(data.book, data.chapter).then(() => {
          if (state.isDrawerOpen) {
            this.renderDrawerContent();
          }
          if (state.activeView === 'tsk') {
            this.renderTSKView();
          }
        });
        this.updateShelfActiveState(data.book, data.chapter);
        break;
      case 'VERSE_SELECTED':
        if (state.activeView === 'tsk') {
          this.renderTSKView();
          break;
        }
        if (typeof window !== 'undefined' && window.innerWidth <= 991 && state.activeDrawerTab !== 'parallel') {
          state.activeDrawerTab = 'parallel';
        }
        this.highlightActiveVerse(data.verse);
        this.renderDrawerContent();
        this.toggleDrawer(data.isDrawerOpen);
        setTimeout(() => {
          const activeEl = document.querySelector(`.verse-item[data-verse="${data.verse}"]`);
          if (activeEl) {
            if (window.innerWidth <= 991) {
              // Trên điện thoại: Căn chỉnh câu đang chọn vào chính giữa nửa trên (#app-body) khi chia đôi màn hình 50/50
              const appBody = document.getElementById('app-body');
              if (appBody && state.isDrawerOpen) {
                const bodyRect = appBody.getBoundingClientRect();
                const verseRect = activeEl.getBoundingClientRect();
                const offsetInside = (verseRect.top - bodyRect.top) + appBody.scrollTop;
                const centerTarget = offsetInside - (appBody.clientHeight / 2) + (verseRect.height / 2);
                appBody.scrollTo({ top: Math.max(0, centerTarget), behavior: 'smooth' });
              } else {
                const rect = activeEl.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetY = scrollTop + rect.top - 110;
                window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
              }
            } else {
              activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }, 120);
        break;
      case 'TSK_LANGUAGE_CHANGED':
        crossRefEngine.activeLangMode = data.tskLanguage;
        if (state.activeView === 'tsk') {
          this.renderTSKView();
        }
        if (state.isDrawerOpen && state.activeDrawerTab === 'crossref') {
          this.renderDrawerContent();
        }
        break;
      case 'VERSIONS_CHANGED':
        if (Array.isArray(data.activeVersions)) {
          data.activeVersions.forEach(v => storage.recordTranslationUsed(v));
        }
        this.updateActiveVersionsCount();
        this.renderChapter(state.currentBook, state.currentChapter);
        if (state.isDrawerOpen) this.renderDrawerContent();
        break;
      case 'THEME_CHANGED':
        document.documentElement.setAttribute('data-theme', data.theme);
        this.updateThemeUI(data.theme);
        break;
      case 'FONT_SIZE_CHANGED':
        document.documentElement.setAttribute('data-font-size', data.fontSize);
        this.updateFontSizeUI(data.fontSize);
        break;
      case 'ROLE_CHANGED':
        this.updateRoleUI(data.role);
        if (state.activeView === 'blog') this.renderBlogView();
        if (state.activeView === 'community') this.renderCommunityView();
        if (state.activeView === 'donate') this.renderDonateView();
        break;
      case 'BANNER_CHANGED':
        this.updateAdminBannerUI(data.banner);
        break;
      case 'VIEW_CHANGED':
        this.switchView(data.view);
        break;
      case 'DRAWER_TOGGLED':
        this.toggleDrawer(data.isOpen);
        break;
      case 'DRAWER_TAB_CHANGED':
        this.renderDrawerContent();
        break;
      case 'READING_MODE_CHANGED':
        this.updateReadingModeUI(data.readingMode);
        this.renderChapter(state.currentBook, state.currentChapter);
        break;
    }
  }

  // 1. Navigation & Render View Panels
  switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));

    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (btn.id === 'top-nav-ai-btn' || btn.dataset.view === 'ai') return;
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const targetPanel = document.getElementById(`${viewName === 'bible' ? 'focus-reader' : viewName + '-view'}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      targetPanel.classList.add('active');
    }

    // Ẩn thanh lọc thể loại khi mở Tab riêng (như KT Đối Chiếu, Dâng Hiến) để hiển thị toàn màn hình
    const genreBar = document.getElementById('genre-filter-bar');
    const genreShelf = document.getElementById('genre-bookshelf');
    if (genreBar) genreBar.classList.toggle('hidden', viewName !== 'bible');
    if (genreShelf && viewName !== 'bible') genreShelf.classList.add('hidden');

    if (viewName === 'portal') {
      if (state.isDrawerOpen) {
        state.setDrawerOpen(false);
      }
      this.renderPortalView();
    }
    if (viewName === 'tsk') {
      if (state.isDrawerOpen) {
        state.setDrawerOpen(false);
      }
      this.renderTSKView();
    }
    if (viewName === 'blog') this.renderBlogView();
    if (viewName === 'community') this.renderCommunityView();
    if (viewName === 'media') this.renderMediaView();
    if (viewName === 'donate') {
      if (state.isDrawerOpen) {
        state.setDrawerOpen(false);
      }
      this.renderDonateView();
    }

    // Cập nhật trạng thái nút Đọc, KT Đối Chiếu, Cổng Tĩnh Nguyện & Dâng Hiến trên mobile bottom nav và header
    const mobileReadBtn = document.getElementById('btn-mobile-read');
    if (mobileReadBtn) {
      mobileReadBtn.classList.toggle('active', viewName === 'bible');
    }
    const mobilePortalBtn = document.getElementById('btn-mobile-portal');
    if (mobilePortalBtn) {
      mobilePortalBtn.classList.toggle('active', viewName === 'portal');
    }
    const mobileTskBtn = document.getElementById('btn-mobile-tsk');
    if (mobileTskBtn) {
      mobileTskBtn.classList.toggle('active', viewName === 'tsk');
    }
    const mobileDonateBtn = document.getElementById('btn-mobile-donate');
    if (mobileDonateBtn) {
      mobileDonateBtn.classList.toggle('active', viewName === 'donate');
    }
    const headerTskBtn = document.getElementById('mobile-header-tsk-btn');
    if (headerTskBtn) {
      headerTskBtn.classList.toggle('active', viewName === 'tsk');
    }
  }

  // 2. Render Chapter into Focus Reader
  async renderChapter(bookId, chapterNum) {
    const readerContainer = document.getElementById('reader-chapter-container');
    if (!readerContainer) return;

    readerContainer.innerHTML = `
      <div style="text-align: center; padding: 4rem 0;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-gold);"></i>
        <p style="margin-top: 1rem; color: var(--text-muted);">Đang tải Lời Chúa và đối chiếu các bản dịch...</p>
      </div>
    `;

    this.currentPassageData = await bibleEngine.loadPassage(bookId, chapterNum);
    this.activeTypologyMetaphorId = null;

    // Trên cả máy tính và điện thoại: Nửa trên (#focus-reader) luôn hiển thị bản đọc chính thuần khiết
    // Khi đối chiếu trên điện thoại sẽ chia đều 50/50: nửa trên bản đọc chính, nửa dưới (#drawer-inspector) các bản đối chiếu
    const effectiveMode = 'standard';

    // Render theo Chế độ Đọc Thường hoặc Chế độ Đọc Đối Chiếu Trực Tiếp (trên mobile)
    let html = '';
    if (effectiveMode === 'parallel') {
      html = bibleEngine.renderChapterParallelHTML(this.currentPassageData, state.activeVersions, state.primaryVersion);
    } else {
      html = bibleEngine.renderChapterHTML(this.currentPassageData, state.activeVersions, state.primaryVersion);
    }
    readerContainer.innerHTML = html;

    // Tự động tải trước các bản dịch đang kích hoạt và bản đọc chính (đặc biệt là tiếng Sắc tộc / HTTLVN / CGKPV)
    const versionsToEnsure = Array.from(new Set([...state.activeVersions, state.primaryVersion]));
    bibleEngine.ensurePassageTranslations(bookId, chapterNum, versionsToEnsure).then(loaded => {
      if (loaded && state.currentBook === bookId && state.currentChapter === chapterNum) {
        if (effectiveMode === 'parallel') {
          readerContainer.innerHTML = bibleEngine.renderChapterParallelHTML(this.currentPassageData, state.activeVersions, state.primaryVersion);
          this.rebindReaderVerseEvents(readerContainer);
        } else if (state.primaryVersion && state.primaryVersion !== 'BTT') {
          readerContainer.innerHTML = bibleEngine.renderChapterHTML(this.currentPassageData, state.activeVersions, state.primaryVersion);
          this.rebindReaderVerseEvents(readerContainer);
        }
        if (state.activeDrawerTab === 'parallel' && state.isDrawerOpen) {
          this.renderDrawerContent();
        }
      }
    });

    // Cập nhật nhãn header
    const book = bibleEngine.getBookById(bookId);
    const currentPassageLabel = document.getElementById('current-passage-label');
    if (currentPassageLabel && book) {
      currentPassageLabel.textContent = `${book.name_vi} ${chapterNum}`;
    }

    this.rebindReaderVerseEvents(readerContainer);

    // Tự động highlight câu đang chọn
    this.highlightActiveVerse(state.currentVerse);

    // Tự động cập nhật bảng khảo cứu Drawer nếu đang mở để đồng bộ ngay lập tức
    if (state.isDrawerOpen) {
      this.renderDrawerContent();
    }
  }

  rebindReaderVerseEvents(readerContainer) {
    if (!readerContainer) return;

    // Gắn sự kiện click cho từng câu trong chế độ đọc thường
    readerContainer.querySelectorAll('.verse-item').forEach(el => {
      el.addEventListener('click', () => {
        const verseNum = el.dataset.verse;
        state.selectVerse(verseNum, true);
      });
    });

    // Gắn sự kiện click cho thẻ đối chiếu trong chế độ đối chiếu trực tiếp
    readerContainer.querySelectorAll('.verse-compare-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.compare-quick-drawer-btn')) {
          const verseNum = card.dataset.verse;
          state.selectVerse(verseNum, true);
        }
      });
    });

    readerContainer.querySelectorAll('.compare-quick-drawer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const verseNum = btn.dataset.verse;
        state.selectVerse(verseNum, true);
      });
    });

    // Gắn sự kiện click cho icon ẩn dụ
    readerContainer.querySelectorAll('.metaphor-trigger').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const metaphorId = el.dataset.metaphor;
        this.activeTypologyMetaphorId = metaphorId;
        state.setDrawerTab('metaphors');
        const parentVerse = el.closest('.verse-item') || el.closest('.verse-compare-card');
        state.selectVerse(parentVerse?.dataset?.verse || 1, true);
        this.renderDrawerContent();
      });
    });

    // Gắn sự kiện chuyển nhanh Đoạn trước / Đoạn tiếp ngay trên đầu & cuối chương đọc
    readerContainer.querySelectorAll('.chapter-step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.chapterStep, 10) || 0;
        const book = bibleEngine.getBookById(state.currentBook);
        const maxCh = book?.chapters_count || 1;
        const targetCh = state.currentChapter + step;
        if (targetCh >= 1 && targetCh <= maxCh) {
          state.setPassage(state.currentBook, targetCh, 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  highlightActiveVerse(verseNum) {
    document.querySelectorAll('.verse-item').forEach(el => {
      el.classList.toggle('verse-highlight-active', el.dataset.verse == verseNum);
    });
    document.querySelectorAll('.verse-compare-card').forEach(card => {
      card.classList.toggle('active', card.dataset.verse == verseNum);
    });
  }

  // 3. Render Drawer Content (5 Tabs: Đối chiếu, Ẩn dụ, KT giải thích KT, Bối cảnh, AI)
  renderDrawerContent() {
    const drawerBody = document.getElementById('drawer-body');
    const drawerTitle = document.getElementById('drawer-verse-title');
    const drawerBadge = document.getElementById('drawer-verse-genre');
    if (!drawerBody || !this.currentPassageData) return;

    // Luôn ưu tiên đồng bộ theo phân đoạn đang hiển thị trên Focus Reader
    const currentBookId = this.currentPassageData.book_id || state.currentBook;
    const currentChapterNum = this.currentPassageData.chapter_num || state.currentChapter;
    if (state.currentBook !== currentBookId) state.currentBook = currentBookId;
    if (state.currentChapter !== currentChapterNum) state.currentChapter = currentChapterNum;

    // Giới hạn câu chọn hợp lệ theo phân đoạn đang mở
    const totalVerses = (this.currentPassageData.verses && this.currentPassageData.verses.length) || 1;
    if (!state.currentVerse || state.currentVerse < 1) state.currentVerse = 1;
    if (state.currentVerse > totalVerses) state.currentVerse = totalVerses;

    const book = bibleEngine.getBookById(currentBookId) || { name_vi: currentBookId, genre: 'torah' };
    const verseRefStr = `${book.name_vi} ${currentChapterNum}:${state.currentVerse}`;
    const verseKey = `${currentBookId}.${currentChapterNum}.${state.currentVerse}`;

    // Trên điện thoại (<= 991px): Luôn khóa vào tab 'parallel' để chỉ tập trung vào các bản đối chiếu, không hiện mục thừa
    if (typeof window !== 'undefined' && window.innerWidth <= 991) {
      state.activeDrawerTab = 'parallel';
    }

    if (drawerTitle) {
      drawerTitle.textContent = state.activeDrawerTab === 'parallel'
        ? `Đối Chiếu: ${verseRefStr}`
        : `Khảo Cứu: ${verseRefStr}`;
    }
    if (drawerBadge) {
      drawerBadge.textContent = book.genre.toUpperCase();
      drawerBadge.style.background = `var(--genre-${book.genre}, var(--accent-gold))`;
      drawerBadge.style.color = '#fff';
    }

    // Render drawer version selector chips bar
    this.renderDrawerVersionChips();

    // Active Tab button highlighting
    document.querySelectorAll('.drawer-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === state.activeDrawerTab);
    });

    switch (state.activeDrawerTab) {
      case 'parallel': {
        // Tab 1: Đối Chiếu Song Song Đa Bản Dịch & Diff Words
        const versesList = bibleEngine.getParallelVerses(currentBookId, currentChapterNum, state.currentVerse, state.activeVersions);
        let html = `
          <div class="parallel-grid animate-fade-in">
            <div class="metaphor-card parallel-intro-banner" style="border-color: var(--accent-gold-border); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.25rem;">
                  <i class="fa-solid fa-columns"></i> Đối Chiếu Song Song ${versesList.length} Bản Dịch
                </h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                  So sánh từ ngữ và nguyên ngữ gốc để nắm bắt sâu sắc từng câu Kinh Thánh.
                </p>
              </div>
              <button id="parallel-add-versions-btn" class="drawer-action-btn" style="background: var(--accent-gold); color: #000; border: none; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.82rem;">
                <i class="fa-solid fa-layer-group"></i> Chọn Bản Dịch
              </button>
            </div>
        `;

        // Base text cho diff words: Chỉ dùng bản dịch tiếng Việt làm chuẩn (ưu tiên BTT 1925 hoặc bản vi đầu tiên)
        const baseViItem = versesList.find(i => i.version_id === 'BTT' && i.lang === 'vi') || versesList.find(i => i.lang === 'vi');
        const baseViText = baseViItem ? baseViItem.text : '';

        versesList.forEach((item, idx) => {
          let displayText = item.text;
          if (item.version_id === 'INTERLINEAR') {
            displayText = this.renderInterlinearWordTiles(item, currentBookId, currentChapterNum);
          } else if (item.lang === 'vi' && baseViItem && item.version_id !== baseViItem.version_id && baseViText) {
            displayText = bibleEngine.diffWords(item.text, baseViText);
          }

          html += `
            <div class="parallel-verse-card clickable-popout-card" data-version="${item.version_id}">
              <div class="parallel-card-header">
                <span class="version-code-badge">${item.version_id} • ${item.version_name}</span>
                <button class="card-popout-btn" data-version="${item.version_id}" aria-label="Mở cửa sổ đọc">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở cửa sổ đọc
                </button>
              </div>
              <div class="parallel-card-text ${item.version_id === 'INTERLINEAR' ? 'interlinear-text' : ''}">
                ${displayText}
              </div>
              <div class="parallel-card-footer-hint">
                <i class="fa-regular fa-window-restore"></i> Nhấp để đọc trọn đoạn ${verseRefStr} trong cửa sổ riêng
              </div>
            </div>
          `;
        });

        html += `</div>`;
        drawerBody.innerHTML = html;

        // Gắn sự kiện nút Chọn Bản Dịch ngay trong header đối chiếu
        drawerBody.querySelector('#parallel-add-versions-btn')?.addEventListener('click', () => {
          this.populateVersionSelector('vi');
          document.getElementById('version-selector-modal')?.classList.remove('hidden');
        });

        // Gắn sự kiện mở cửa sổ đọc độc lập khi nhấp vào thẻ bản dịch hoặc nút mở
        drawerBody.querySelectorAll('.parallel-verse-card.clickable-popout-card').forEach(card => {
          card.addEventListener('click', () => {
            const vId = card.dataset.version;
            this.openPopoutReader(currentBookId, currentChapterNum, vId, state.currentVerse);
          });
        });
        drawerBody.querySelectorAll('.card-popout-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const vId = btn.dataset.version;
            this.openPopoutReader(currentBookId, currentChapterNum, vId, state.currentVerse);
          });
        });
        drawerBody.querySelectorAll('.btn-s4a-link, .tsk-external-link').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
          });
        });

        // Gắn sự kiện click vào bất kỳ địa chỉ Kinh Thánh Đối Chiếu (TSK) nào để xem nhanh câu đó
        drawerBody.querySelectorAll('.tsk-ref-link').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ref = btn.dataset.ref;
            if (ref) this.openPassagePreviewDialog(ref);
          });
        });

        // Tự động kiểm tra và tải các bản dịch còn thiếu / đang hiển thị loading pulse từ HTTLVN hoặc TSK
        const needsFetch = versesList.some(v => typeof v.text === 'string' && (v.text.includes('httlvn-loading-pulse') || v.text.includes('tsk-fallback-block')));
        if (needsFetch) {
          bibleEngine.ensurePassageTranslations(currentBookId, currentChapterNum, state.activeVersions).then(loaded => {
            if (loaded && state.activeDrawerTab === 'parallel') {
              this.renderDrawerContent();
            }
          });
        }
        break;
      }

      case 'metaphors': {
        // Tab 2: Ẩn Dụ & Biểu Tượng Thần Học - Tự Động Đồng Bộ Theo Nội Dung Đang Mở
        const book = bibleEngine.getBookById(currentBookId) || { id: currentBookId, name_vi: currentBookId };
        const detectionResult = hermeneuticsEngine.detectPassageMetaphors({
          book: { id: currentBookId, name_vi: book.name_vi },
          chapterNum: currentChapterNum,
          verses: this.currentPassageData.verses,
          selectedVerseNum: state.currentVerse,
          preferredMetaphorId: this.activeTypologyMetaphorId || null
        });

        drawerBody.innerHTML = hermeneuticsEngine.renderTypologyTabHTML(detectionResult, {
          bookName: book.name_vi,
          chapterNum: state.currentChapter,
          selectedVerseNum: state.currentVerse
        });

        // Gắn sự kiện chuyển đổi giữa các chip biểu tượng
        drawerBody.querySelectorAll('.metaphor-tab-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            this.activeTypologyMetaphorId = chip.dataset.metaphorId;
            this.renderDrawerContent();
          });
        });

        // Gắn sự kiện click phân đoạn trọng tâm
        drawerBody.querySelectorAll('.crossref-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            const passage = pill.dataset.passage;
            this.openPassagePreviewDialog(passage);
          });
        });
        break;
      }

      case 'crossref': {
        // Tab 3: Kinh Thánh Đối Chiếu (BibleHub TSK & Bản Truyền Thống 1925)
        const currVerseObj = this.currentPassageData.verses.find(v => v.verse_num === state.currentVerse);
        const refs = (currVerseObj && currVerseObj.cross_refs) ? currVerseObj.cross_refs : null;
        drawerBody.innerHTML = crossRefEngine.renderCrossReferenceHTML(verseKey, refs);

        drawerBody.querySelectorAll('.crossref-peek-btn, .tsk-ref-link').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ref = btn.dataset.ref;
            if (ref) this.openPassagePreviewDialog(ref);
          });
        });

        drawerBody.querySelectorAll('.tsk-verse-anchor-link').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const b = btn.dataset.tskJumpBook;
            const c = parseInt(btn.dataset.tskJumpCh, 10) || 1;
            const v = parseInt(btn.dataset.tskJumpV, 10) || 1;
            if (b) {
              state.setPassage(b, c, v);
            }
          });
        });

        drawerBody.querySelector('#drawer-open-full-tsk-tab-btn')?.addEventListener('click', () => {
          state.setActiveView('tsk');
        });

        drawerBody.querySelectorAll('.tsk-lang-toggle-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const lang = btn.dataset.tskLang || 'vi';
            state.setTSKLanguage(lang);
          });
        });

        if (!bibleEngine.tskBookCache[currentBookId.toUpperCase()]) {
          bibleEngine.fetchTSKBook(currentBookId).then(tskBook => {
            if (tskBook && state.activeDrawerTab === 'crossref') {
              this.renderDrawerContent();
            }
          });
        }
        break;
      }

      case 'context': {
        // Tab 4: Bối Cảnh Lịch Sử & 8 Thể Loại Văn Chương
        drawerBody.innerHTML = hermeneuticsEngine.renderGenreGuideHTML(book.genre, book);
        break;
      }

      case 'ai': {
        // Tab 5: Trợ Lý AI Thần Học Berea
        drawerBody.innerHTML = aiAssistant.renderAIChatHTML({
          ref: verseRefStr,
          book: book.name_vi,
          chapter: state.currentChapter,
          verse: state.currentVerse
        });

        // Gắn sự kiện gửi câu hỏi AI
        const sendBtn = drawerBody.querySelector('#ai-send-btn');
        const input = drawerBody.querySelector('#ai-user-query-input');
        const messagesList = drawerBody.querySelector('#ai-messages-list');

        const executeQuery = async (queryText) => {
          if (!queryText.trim()) return;
          // Add user message bubble
          const userMsg = document.createElement('div');
          userMsg.className = 'ai-message user';
          userMsg.textContent = queryText;
          messagesList.appendChild(userMsg);
          input.value = '';

          // Add loading bubble
          const loadingMsg = document.createElement('div');
          loadingMsg.className = 'ai-message assistant';
          loadingMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang suy ngẫm và phân tích thần học...';
          messagesList.appendChild(loadingMsg);
          messagesList.scrollTop = messagesList.scrollHeight;

          const genreKey = book.genre || 'gospel';
          const genreGuide = hermeneuticsEngine?.getGenreGuide ? hermeneuticsEngine.getGenreGuide(genreKey) : (hermeneuticsEngine?.genreGuides?.[genreKey] || null);
          const crossRefs = crossRefEngine.getCrossReferences(verseKey);

          const responseText = await aiAssistant.ask(queryText, {
            ref: verseRefStr,
            book: book.name_vi,
            bookId: currentBookId,
            chapter: currentChapterNum,
            verse: state.currentVerse,
            passageData: this.currentPassageData,
            activeVersions: state.activeVersions,
            crossReferences: crossRefs,
            genreGuide: genreGuide
          });

          loadingMsg.innerHTML = `
            <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
            <div>${responseText}</div>
          `;
          this.bindCopilotActionButtons(loadingMsg);
          messagesList.scrollTop = messagesList.scrollHeight;
        };

        if (sendBtn && input) {
          sendBtn.addEventListener('click', () => executeQuery(input.value));
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeQuery(input.value);
          });
        }

        drawerBody.querySelectorAll('.suggested-prompt-chip').forEach(chip => {
          chip.addEventListener('click', () => executeQuery(chip.dataset.prompt));
        });

        // Role buttons in drawer
        drawerBody.querySelectorAll('.fab-role-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            aiAssistant.setRole(role);
            this.updateFloatingAIRolePills();
            drawerBody.querySelectorAll('.fab-role-btn').forEach(b => b.classList.toggle('active', b.dataset.role === role));
          });
        });

        const keyBtn = drawerBody.querySelector('#ai-configure-key-btn');
        if (keyBtn) {
          keyBtn.addEventListener('click', () => {
            this.openAISettingsModal();
          });
        }

        const badgeBtn = drawerBody.querySelector('#ai-model-badge-btn');
        if (badgeBtn) {
          badgeBtn.addEventListener('click', () => {
            this.openAISettingsModal();
          });
        }

        const deepToggleBtn = drawerBody.querySelector('#ai-deep-research-toggle-btn');
        if (deepToggleBtn) {
          deepToggleBtn.addEventListener('click', () => {
            const cur = aiAssistant.getDeepResearchEnabled();
            aiAssistant.setDeepResearchEnabled(!cur);
            this.renderDrawerContent();
            const floatingDeepBtn = document.getElementById('floating-deep-research-btn');
            if (floatingDeepBtn) {
              const isNow = aiAssistant.getDeepResearchEnabled();
              floatingDeepBtn.classList.toggle('active', isNow);
              const textSpan = floatingDeepBtn.querySelector('.ctrl-btn-text');
              if (textSpan) textSpan.textContent = isNow ? 'Deep: BẬT' : 'Deep: TẮT';
            }
          });
        }

        const clearHistoryBtn = drawerBody.querySelector('#ai-clear-history-btn');
        if (clearHistoryBtn) {
          clearHistoryBtn.addEventListener('click', () => {
            aiAssistant.clearConversationHistory();
            if (messagesList) {
              messagesList.innerHTML = `
                <div class="ai-message assistant">
                  <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
                  <div>Đã làm mới dòng bộ nhớ hội thoại Kimchi Stream. Sẵn sàng tiếp nhận câu hỏi mới!</div>
                </div>
              `;
            }
            const floatingMsgs = document.getElementById('floating-ai-messages');
            if (floatingMsgs) {
              floatingMsgs.innerHTML = `
                <div class="floating-ai-msg assistant animate-fade-in">
                  <div class="fab-avatar"><i class="fa-solid fa-dove"></i></div>
                  <div class="fab-bubble">Đã làm mới dòng bộ nhớ hội thoại Kimchi Stream. Sẵn sàng hỗ trợ bạn!</div>
                </div>
              `;
            }
          });
        }

        const webToggleBtn = drawerBody.querySelector('#ai-web-search-toggle-btn');
        if (webToggleBtn) {
          webToggleBtn.addEventListener('click', () => {
            const cur = aiAssistant.getWebSearchEnabled();
            aiAssistant.setWebSearchEnabled(!cur);
            this.renderDrawerContent();
            const floatingWebBtn = document.getElementById('floating-web-toggle-btn');
            if (floatingWebBtn) {
              const isNow = aiAssistant.getWebSearchEnabled();
              floatingWebBtn.classList.toggle('active', isNow);
              const textSpan = floatingWebBtn.querySelector('.ctrl-btn-text');
              if (textSpan) textSpan.textContent = isNow ? 'Web: BẬT' : 'Web: TẮT';
            }
          });
        }
        break;
      }
    }
  }

  toggleDrawer(isOpen) {
    const drawer = document.getElementById('drawer-inspector');
    if (drawer) {
      drawer.classList.toggle('open', isOpen);
      if (!isOpen) drawer.classList.remove('expanded');
    }
    document.body.classList.toggle('drawer-open', isOpen);
    document.body.classList.toggle('mobile-split-active', isOpen);
    const appBody = document.getElementById('app-body');
    if (appBody) {
      appBody.classList.toggle('drawer-open', isOpen);
    }
    // Đồng bộ nút Đối Chiếu trên Mobile Header với trạng thái chia đôi màn hình 50/50
    const headerCompareBtn = document.getElementById('mobile-header-compare-btn');
    const headerCompareLabel = document.getElementById('mobile-header-compare-label');
    if (headerCompareBtn) {
      headerCompareBtn.classList.toggle('active', isOpen);
      const icon = headerCompareBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-book-open' : 'fa-solid fa-columns';
      }
    }
    if (headerCompareLabel) {
      headerCompareLabel.textContent = isOpen ? 'Đọc Thường' : 'Đối Chiếu';
    }
    // Cập nhật trạng thái nút Đối Chiếu trên Mobile Bottom Nav
    const parallelBtn = document.getElementById('btn-mobile-parallel');
    if (parallelBtn) {
      parallelBtn.classList.toggle('active', isOpen && state.activeDrawerTab === 'parallel');
    }
  }

  // Render các chip chọn bản dịch nhanh ngay trên đỉnh bảng khảo cứu (Handwritten Request)
  renderDrawerVersionChips() {
    const container = document.getElementById('drawer-version-chips');
    if (!container) return;

    let html = '';
    state.activeVersions.forEach(vId => {
      const t = ALL_TRANSLATIONS.find(item => item.id === vId);
      const name = t ? t.id : vId;
      html += `
        <span class="drawer-vchip active" data-vid="${vId}" title="${t ? t.name : vId}">
          ${name}
          ${state.activeVersions.length > 1 ? `<span class="drawer-vchip-remove" data-vid="${vId}">&times;</span>` : ''}
        </span>
      `;
    });

    html += `
      <button class="drawer-vchip add-more" id="drawer-add-version-chip-btn" title="Thêm bản dịch đối chiếu">
        <i class="fa-solid fa-plus"></i> Thêm
      </button>
    `;

    container.innerHTML = html;

    // Bắt sự kiện xóa bản dịch
    container.querySelectorAll('.drawer-vchip-remove').forEach(rmBtn => {
      rmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vId = rmBtn.dataset.vid;
        state.toggleVersion(vId);
      });
    });

    // Bắt sự kiện thêm bản dịch
    container.querySelector('#drawer-add-version-chip-btn')?.addEventListener('click', () => {
      this.populateVersionSelector('vi');
      document.getElementById('version-selector-modal')?.classList.remove('hidden');
    });
  }

  // Mở hộp thoại đọc câu Kinh Thánh trọng tâm
  async openPassagePreviewDialog(refString) {
    const modal = document.getElementById('passage-preview-modal');
    const titleEl = document.getElementById('preview-passage-title');
    const genreEl = document.getElementById('preview-passage-genre');
    const bodyEl = document.getElementById('preview-passage-body');
    const gotoBtn = document.getElementById('preview-goto-chapter-btn');
    if (!modal || !bodyEl) return;

    modal.classList.remove('hidden');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-scroll"></i> ${refString}`;
    if (bodyEl) bodyEl.innerHTML = `<div class="loading-state" style="padding: 2rem; text-align: center; color: var(--accent-gold);"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải câu Kinh Thánh...</div>`;

    const data = await bibleEngine.getVersesByRef(refString);
    if (genreEl) {
      const gColor = `var(--genre-${data.book?.genre || 'prophecy'}, var(--accent-gold))`;
      genreEl.textContent = (data.book?.genre || 'KINH THÁNH').toUpperCase();
      genreEl.style.background = gColor;
      genreEl.style.color = '#fff';
    }

    let versesHtml = '';
    if (data.verses && data.verses.length > 0) {
      data.verses.forEach(v => {
        versesHtml += `
          <div class="preview-verse-row">
            <span class="preview-vnum">${v.verse_num}</span>
            <span class="preview-vtext">${v.text}</span>
          </div>
        `;
      });
    } else {
      versesHtml = `<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">Chưa có bản văn chi tiết cho phân đoạn này.</p>`;
    }
    bodyEl.innerHTML = versesHtml;

    // Gắn sự kiện chuyển đến đọc cả chương
    if (gotoBtn) {
      gotoBtn.onclick = () => {
        modal.classList.add('hidden');
        if (data.book && data.chapter) {
          state.setPassage(data.book.id, data.chapter, data.verseStart || 1);
        }
      };
    }
  }

  // 4. Render Blog, Community & Media Panels
  renderBlogView() {
    const blogView = document.getElementById('blog-view');
    if (!blogView) return;
    blogView.innerHTML = blogSystem.renderMasterBlogHTML(state.currentUserRole);

    const createBlogBtn = blogView.querySelector('#admin-create-blog-btn');
    if (createBlogBtn) {
      createBlogBtn.addEventListener('click', () => {
        this.openAdminArticleModal();
      });
    }

    // Gắn sự kiện Sửa bài khảo luận
    blogView.querySelectorAll('.btn-edit-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openAdminArticleModal(id);
      });
    });

    // Gắn sự kiện Xóa bài khảo luận
    blogView.querySelectorAll('.btn-delete-article').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Bạn có chắc chắn muốn xóa bài khảo luận này không?')) {
          blogSystem.deleteMasterBlog(id);
          this.renderBlogView();
        }
      });
    });
  }

  renderCommunityView() {
    const commView = document.getElementById('community-view');
    if (!commView) return;
    commView.innerHTML = blogSystem.renderCommunityCirclesHTML(state.currentUserRole);

    // Gắn sự kiện Duyệt bài cho Quản trị viên
    commView.querySelectorAll('.btn-mod-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        blogSystem.approveCommunityPost(id);
        alert('Đã phê duyệt xuất bản bài viết cộng đồng thành công!');
        this.renderCommunityView();
      });
    });

    commView.querySelectorAll('.btn-mod-reject').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        blogSystem.rejectCommunityPost(id);
        alert('Đã từ chối hiển thị bài viết.');
        this.renderCommunityView();
      });
    });

    commView.querySelectorAll('.btn-mod-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (confirm('Bạn có chắc chắn muốn xóa bài chia sẻ này khỏi hệ thống không?')) {
          blogSystem.deleteCommunityPost(id);
          this.renderCommunityView();
        }
      });
    });

    // Gắn sự kiện Sửa bài viết cộng đồng cho Quản trị viên
    commView.querySelectorAll('.btn-edit-community-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        this.openAdminCommunityPostModal(id);
      });
    });

    // Xử lý gửi bài chia sẻ cộng đồng
    const submitBtn = commView.querySelector('#submit-community-post-btn');
    const alertBox = commView.querySelector('#berea-validation-alert');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const author = commView.querySelector('#community-author-input').value;
        const branch_id = commView.querySelector('#community-branch-select').value;
        const title = commView.querySelector('#community-title-input').value;
        const content = commView.querySelector('#community-content-input').value;

        if (!title.trim() || !content.trim()) {
          alert('Vui lòng nhập đầy đủ tiêu đề và nội dung bài chia sẻ.');
          return;
        }

        const res = blogSystem.submitCommunityPost({ author, branch_id, title, content });
        if (!res.success) {
          alertBox.innerHTML = bereaGuardian.renderGuardianNoticeHTML(res.reason, res.reminder);
          alertBox.classList.remove('hidden');
        } else {
          alertBox.classList.add('hidden');
          alert('Bài viết của bạn đã vượt qua sự kiểm duyệt của Agent Berea và đang chờ Quản Trị Viên phê duyệt trước khi xuất bản công khai!');
          this.renderCommunityView();
        }
      });
    }

    // Xử lý chat thảo luận
    const chatBtn = commView.querySelector('#chat-send-btn');
    const chatInput = commView.querySelector('#chat-user-msg-input');
    if (chatBtn && chatInput) {
      const sendChat = () => {
        const text = chatInput.value;
        if (!text.trim()) return;
        const res = blogSystem.sendChatMessage('Bạn', text);
        if (!res.success) {
          alert(`Agent Berea nhắc nhở:\n${res.reason}\n\n${res.reminder}`);
        } else {
          chatInput.value = '';
          this.renderCommunityView();
        }
      };
      chatBtn.addEventListener('click', sendChat);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChat();
      });
    }
  }

  renderMediaView() {
    const mediaView = document.getElementById('media-view');
    if (mediaView) {
      mediaView.innerHTML = mediaEngine.renderMediaHubHTML();
    }
  }

  // 4.5 Render Dedicated "KT Đối Chiếu" Tab (#tsk-view - https://biblehub.com/tsk/ in English & Vietnamese BTT 1925)
  async renderTSKView() {
    const tskView = document.getElementById('tsk-view');
    if (!tskView) return;
    const container = tskView.querySelector('.tsk-container') || tskView;

    const bookId = (state.currentBook || 'JHN').toUpperCase();
    const chapterNum = parseInt(state.currentChapter, 10) || 1;
    let verseNum = parseInt(state.currentVerse, 10) || 1;
    const lang = state.tskLanguage || 'vi';

    // Ensure passage & local 66-book TSK database are loaded
    const [passageData] = await Promise.all([
      bibleEngine.loadPassage(bookId, chapterNum),
      bibleEngine.fetchTSKBook(bookId)
    ]);
    this.currentPassageData = passageData;

    const totalVerses = (passageData?.verses && passageData.verses.length) || 1;
    if (verseNum < 1) verseNum = 1;
    if (verseNum > totalVerses) verseNum = totalVerses;

    const cachedLive = crossRefEngine.liveCache[`${bookId}.${chapterNum}.${verseNum}`] || null;

    container.innerHTML = crossRefEngine.renderTSKHubHTML({
      bookId,
      chapterNum,
      verseNum,
      lang,
      passageData,
      liveData: cachedLive
    });

    this.bindTSKViewEvents(container, bookId, chapterNum, verseNum, totalVerses);

    // Fetch live BibleHub TSK metadata (Outline, Jump to Previous/Next, Parallel Verses, Live TSK) if not cached yet
    if (!cachedLive) {
      crossRefEngine.fetchLiveBibleHubData(bookId, chapterNum, verseNum).then(liveData => {
        if (
          liveData &&
          state.activeView === 'tsk' &&
          (state.currentBook || '').toUpperCase() === bookId &&
          parseInt(state.currentChapter, 10) === chapterNum &&
          parseInt(state.currentVerse, 10) === verseNum
        ) {
          container.innerHTML = crossRefEngine.renderTSKHubHTML({
            bookId,
            chapterNum,
            verseNum,
            lang: state.tskLanguage || 'vi',
            passageData: this.currentPassageData,
            liveData
          });
          this.bindTSKViewEvents(container, bookId, chapterNum, verseNum, totalVerses);
        }
      });
    }
  }

  bindTSKViewEvents(container, bookId, chapterNum, verseNum, totalVerses) {
    if (!container) return;

    // 1. Chuyển đổi 2 phiên bản ngôn ngữ: Vietnamese (Bản Truyền Thống 1925) <-> English (BibleHub TSK)
    container.querySelectorAll('.tsk-edition-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const edition = btn.dataset.tskEdition || 'vi';
        state.setTSKLanguage(edition);
      });
    });

    // 2. Bật/tắt bảng Danh Mục 66 Sách (Index of /tsk/)
    container.querySelector('#tsk-toggle-directory-btn')?.addEventListener('click', () => {
      crossRefEngine.showBookDirectory = !crossRefEngine.showBookDirectory;
      this.renderTSKView();
    });

    // 3. Nhấp chọn sách từ Danh Mục 66 Sách
    container.querySelectorAll('.tsk-dir-book-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetBook = chip.dataset.dirBook;
        if (targetBook) {
          crossRefEngine.showBookDirectory = false;
          state.setPassage(targetBook, 1, 1);
        }
      });
    });

    // 4. Dropdown chọn Sách / Đoạn / Câu
    container.querySelector('#tsk-select-book')?.addEventListener('change', (e) => {
      state.setPassage(e.target.value, 1, 1);
    });

    container.querySelector('#tsk-select-chapter')?.addEventListener('change', (e) => {
      const ch = parseInt(e.target.value, 10) || 1;
      state.setPassage(bookId, ch, 1);
    });

    container.querySelector('#tsk-select-verse')?.addEventListener('change', (e) => {
      const v = parseInt(e.target.value, 10) || 1;
      crossRefEngine.viewScope = 'verse';
      state.selectVerse(v, state.isDrawerOpen);
    });

    // 5. Nút Câu Trước (◄ Prev) & Câu Tiếp (Next ►)
    container.querySelector('#tsk-prev-verse-btn')?.addEventListener('click', () => {
      crossRefEngine.viewScope = 'verse';
      if (verseNum > 1) {
        state.selectVerse(verseNum - 1, state.isDrawerOpen);
      } else if (chapterNum > 1) {
        state.setPassage(bookId, chapterNum - 1, 1);
      }
    });

    container.querySelector('#tsk-next-verse-btn')?.addEventListener('click', () => {
      crossRefEngine.viewScope = 'verse';
      const bookObj = bibleEngine.getBookById(bookId);
      const maxCh = bookObj?.chapters_count || 1;
      if (verseNum < totalVerses) {
        state.selectVerse(verseNum + 1, state.isDrawerOpen);
      } else if (chapterNum < maxCh) {
        state.setPassage(bookId, chapterNum + 1, 1);
      }
    });

    // 6. Chuyển đổi chế độ Xem Từng Câu <-> Xem Cả Đoạn
    container.querySelector('#tsk-scope-toggle-btn')?.addEventListener('click', () => {
      crossRefEngine.viewScope = crossRefEngine.viewScope === 'chapter' ? 'verse' : 'chapter';
      this.renderTSKView();
    });

    // 7. Nhấp chọn nhanh câu trên thanh Verse Pills hoặc Bố Cục Chương (Chapter Outline)
    container.querySelectorAll('.tsk-vnum-pill, .tsk-outline-vbtn, .tsk-focus-single-btn').forEach(pill => {
      pill.addEventListener('click', () => {
        const v = parseInt(pill.dataset.tskVpill, 10) || 1;
        crossRefEngine.viewScope = 'verse';
        state.selectVerse(v, state.isDrawerOpen);
      });
    });

    // 8. Nhấp vào địa chỉ câu đối chiếu (.tsk-verse-anchor-link) hoặc chủ đề (.tsk-jump-chip) để mở câu đó ngay trong tab KT Đối Chiếu
    container.querySelectorAll('.tsk-verse-anchor-link, .tsk-jump-chip').forEach(link => {
      link.addEventListener('click', () => {
        const b = link.dataset.tskJumpBook;
        const c = parseInt(link.dataset.tskJumpCh, 10) || 1;
        const v = parseInt(link.dataset.tskJumpV, 10) || 1;
        if (b) {
          crossRefEngine.viewScope = 'verse';
          state.setPassage(b, c, v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 9. Nút Xem Đoạn Nhanh (Modal Peek)
    container.querySelectorAll('.tsk-peek-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ref = btn.dataset.ref;
        if (ref) this.openPassagePreviewDialog(ref);
      });
    });
  }

  // 4.6 Google AdSense Engine & Mục "Dâng Hiến Xây Dựng Website" (VCB 9368045059 - Y Simon Ktul - LH 0368045059)
  initGoogleAdSense() {
    const adConfig = storage.getAdSenseConfig();
    const pubId = adConfig.publisherId || 'ca-pub-9368045059000000';

    // Cập nhật thẻ meta và script Google AdSense trên <head>
    const metaTag = document.getElementById('google-adsense-meta');
    if (metaTag) metaTag.setAttribute('content', pubId);

    const scriptTag = document.getElementById('google-adsense-script');
    if (scriptTag && !scriptTag.src.includes(pubId)) {
      scriptTag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(pubId)}`;
    }

    // Ẩn/hiện khung quảng cáo cuối chương đọc theo cấu hình
    const readerAdFooter = document.getElementById('reader-adsense-footer');
    if (readerAdFooter) {
      readerAdFooter.classList.toggle('hidden', !adConfig.enabled);
      const ins = readerAdFooter.querySelector('ins.adsbygoogle');
      if (ins) {
        ins.setAttribute('data-ad-client', pubId);
        ins.setAttribute('data-ad-slot', adConfig.slotReaderBottom || '9368045059');
      }
      readerAdFooter.querySelector('[data-open-donate="true"]')?.addEventListener('click', () => {
        state.setActiveView('donate');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    this.triggerAdSensePush();
  }

  triggerAdSensePush() {
    try {
      const adConfig = storage.getAdSenseConfig();
      if (!adConfig.enabled || typeof window === 'undefined') return;
      window.adsbygoogle = window.adsbygoogle || [];
      document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status])').forEach(() => {
        try {
          window.adsbygoogle.push({});
        } catch (err) {
          // Bỏ qua lỗi khi chạy local hoặc chưa có quảng cáo phân phối
        }
      });
    } catch (e) {}
  }

  renderDonateView() {
    const container = document.getElementById('donate-container') || document.querySelector('#donate-view .donate-container');
    if (!container) return;

    const feedbacks = storage.getWebsiteFeedbacks();
    const adConfig = storage.getAdSenseConfig();
    const isAdmin = state.currentUserRole === 'admin';
    const qrUrl = 'https://img.vietqr.io/image/VCB-9368045059-compact2.png?accountName=Y%20SIMON%20KTUL&addInfo=Dang%20hien%20xay%20dung%20Web%20Kinh%20Thanh';

    container.innerHTML = `
      <div class="donate-page-wrapper">
        <!-- Hero Banner: Lời Tâm Tình Dâng Hiến Xây Dựng Website -->
        <section class="donate-hero-card">
          <div class="donate-hero-badge">
            <i class="fa-solid fa-hand-holding-heart"></i> MỤC VỤ LỜI CHÚA TRỰC TUYẾN • DÂNG HIẾN & ĐỒNG HÀNH
          </div>
          <h2 class="donate-hero-title">Dâng Hiến Xây Dựng Website</h2>
          <p class="donate-hero-verse">
            “Mỗi người hãy theo lòng mình đã định mà dâng, không phải phàn nàn hay vì ép uổng; vì Đức Chúa Trời yêu kẻ dâng của cách vui lòng.”
            <span>— 2 Cô-rinh-tô 9:7 (BTT 1925)</span>
          </p>
        </section>

        <!-- Lưới 2 Cột: Cột Trái = Đôi Lời Tâm Tình & Công Dụng Web | Cột Phải = Thông Tin Tài Khoản VCB & Mã QR -->
        <div class="donate-main-grid">
          <!-- Cột 1: Đôi Lời Tâm Tình (Dựa vào công dụng thực tế của Website) -->
          <article class="donate-story-card">
            <div class="donate-card-header">
              <i class="fa-solid fa-feather-pointed"></i>
              <h3>Đôi Lời Tâm Tình Cùng Quý Con Dân Chúa & Độc Giả</h3>
            </div>
            <div class="donate-story-content">
              <p>
                Quý tôi con Chúa và độc giả thân mến trong tình yêu của Đấng Christ,
              </p>
              <p>
                Trang web <strong>Logos MultiVerse — Nền Tảng Đối Chiếu & Nghiên Cứu Kinh Thánh</strong> được hình thành từ tấm lòng khao khát đem Lời Hằng Sống của Đức Chúa Trời đến gần hơn với mọi tín hữu Việt Nam và các buôn làng sắc tộc hoàn toàn <strong>miễn phí</strong>, mọi lúc, mọi nơi trên cả điện thoại lẫn máy tính.
              </p>
              <p>
                Nhờ ơn Chúa ban, hiện nay trang web đang phục vụ cộng đồng với những công dụng thiết thực cho sự học và suy ngẫm Lời Chúa mỗi ngày:
              </p>
              <ul class="donate-utility-list">
                <li>
                  <i class="fa-solid fa-book-open-reader"></i>
                  <div>
                    <strong>Đối chiếu đa bản dịch Kinh Thánh (50/50 trực quan):</strong> So sánh tức thì giữa <em>Bản Truyền Thống 1925 (BTT)</em>, <em>Bản Dịch Mới (BDM)</em>, <em>Kinh Thánh Hiện Đại (KTHD)</em>, <em>Bản Công Giáo (CGKPV)</em> và các bản dịch quốc tế <em>KJV, ESV</em>.
                  </div>
                </li>
                <li>
                  <i class="fa-solid fa-mountain-sun"></i>
                  <div>
                    <strong>Gìn giữ & lan tỏa Kinh Thánh tiếng các dân tộc anh em:</strong> Tích hợp bản dịch Kinh Thánh tiếng <em>Ê-đê, Gia-rai, Ba-na, K'Ho, H'Mông, M'Nông...</em> giúp đồng bào sắc tộc đọc và tra cứu Lời Chúa ngay bằng tiếng mẹ đẻ của mình.
                  </div>
                </li>
                <li>
                  <i class="fa-solid fa-book-atlas"></i>
                  <div>
                    <strong>Kho Kinh Thánh Đối Chiếu (BibleHub TSK) song ngữ Việt – Anh:</strong> Hơn 31.102 câu Kinh Thánh kèm mạng lưới tham chiếu chéo giúp học viên dùng chính Kinh Thánh để giải thích Kinh Thánh một cách trung tín.
                  </div>
                </li>
                <li>
                  <i class="fa-solid fa-language"></i>
                  <div>
                    <strong>Khảo cứu nguyên ngữ & Giải nghĩa chuyên sâu:</strong> Tra cứu từ nguyên <em>Hê-bơ-rơ / Hy Lạp (Interlinear Strong's)</em>, giải nghĩa hình ảnh ẩn dụ, bối cảnh lịch sử và 8 thể loại văn chương Kinh Thánh.
                  </div>
                </li>
              </ul>
              <p>
                Để duy trì tên miền, hệ thống máy chủ lưu trữ dữ liệu tốc độ cao, cũng như tiếp tục số hóa, cập nhật thêm nhiều bản dịch và tài liệu giải kinh chuẩn mực phục vụ Hội Thánh chung, chúng tôi rất trân trọng và biết ơn mọi sự cầu thay, góp ý và dự phần <strong>dâng hiến tự nguyện</strong> của quý vị.
              </p>
              <p class="donate-blessing-note">
                Mỗi lời cầu nguyện, mỗi ý kiến đóng góp và mỗi phần dâng hiến dù nhỏ hay lớn đều là nguồn khích lệ quý báu để mục vụ tiếp tục vững bước. Nguyện xin Đức Chúa Trời ban phước dư dật trên đời sống, gia đình và chức vụ của quý vị!
              </p>
            </div>
          </article>

          <!-- Cột 2: Thông Tin Tài Khoản Dâng Hiến (VCB 9368045059 - Y Simon Ktul - LH 0368045059) -->
          <aside class="donate-bank-card">
            <div class="donate-card-header">
              <i class="fa-solid fa-building-columns"></i>
              <h3>Thông Tin Dâng Hiến & Liên Hệ Trực Tiếp</h3>
            </div>

            <!-- Khung chi tiết Ngân hàng VCB -->
            <div class="bank-details-box">
              <div class="bank-row">
                <span class="bank-label"><i class="fa-solid fa-landmark"></i> Ngân hàng:</span>
                <div class="bank-value-wrap">
                  <strong class="bank-name-badge">VCB — Vietcombank</strong>
                  <span class="bank-sub">Ngân hàng TMCP Ngoại thương Việt Nam</span>
                </div>
              </div>

              <div class="bank-row highlight-account-row">
                <span class="bank-label"><i class="fa-solid fa-credit-card"></i> Số tài khoản:</span>
                <div class="bank-value-inline">
                  <strong class="bank-account-number" id="donate-stk-text">9368045059</strong>
                  <button type="button" class="copy-pill-btn" data-copy="9368045059" title="Sao chép số tài khoản VCB">
                    <i class="fa-regular fa-copy"></i> Sao chép STK
                  </button>
                </div>
              </div>

              <div class="bank-row">
                <span class="bank-label"><i class="fa-solid fa-user-check"></i> Người nhận:</span>
                <div class="bank-value-inline">
                  <strong class="bank-recipient-name">Y Simon Ktul</strong>
                  <button type="button" class="copy-pill-btn" data-copy="Y Simon Ktul" title="Sao chép tên người nhận">
                    <i class="fa-regular fa-copy"></i> Sao chép
                  </button>
                </div>
              </div>

              <div class="bank-row">
                <span class="bank-label"><i class="fa-solid fa-phone-volume"></i> Liên hệ (LH):</span>
                <div class="bank-value-inline">
                  <strong class="bank-phone-number">0368045059</strong>
                  <div class="contact-quick-actions">
                    <a href="tel:0368045059" class="contact-action-pill call-pill" title="Gọi điện trực tiếp cho Y Simon Ktul">
                      <i class="fa-solid fa-phone"></i> Gọi ngay
                    </a>
                    <a href="https://zalo.me/0368045059" target="_blank" rel="noopener noreferrer" class="contact-action-pill zalo-pill" title="Nhắn Zalo cho Y Simon Ktul (0368045059)">
                      <i class="fa-solid fa-comment-dots"></i> Zalo
                    </a>
                    <button type="button" class="copy-pill-btn" data-copy="0368045059" title="Sao chép số điện thoại">
                      <i class="fa-regular fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="bank-row">
                <span class="bank-label"><i class="fa-solid fa-pen"></i> Nội dung gợi ý:</span>
                <div class="bank-value-inline">
                  <span class="bank-transfer-memo">Dang hien xay dung Web Kinh Thanh</span>
                  <button type="button" class="copy-pill-btn" data-copy="Dang hien xay dung Web Kinh Thanh">
                    <i class="fa-regular fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mã QR VietQR tự động của Vietcombank 9368045059 - Y Simon Ktul -->
            <div class="donate-qr-box">
              <div class="qr-box-title">
                <i class="fa-solid fa-qrcode"></i> Quét Mã VietQR Chuyển Khoản Nhanh 24/7
              </div>
              <div class="qr-image-frame">
                <img src="${qrUrl}" alt="VietQR VCB 9368045059 - Y Simon Ktul" class="donate-vietqr-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="qr-offline-fallback" style="display: none;">
                  <i class="fa-solid fa-building-columns"></i>
                  <strong>VCB: 9368045059</strong>
                  <span>Người nhận: Y Simon Ktul</span>
                  <span>LH: 0368045059</span>
                </div>
              </div>
              <p class="qr-caption">
                Mở ứng dụng Ngân hàng bất kỳ và quét mã QR để tự động điền Số tài khoản <strong>9368045059 (VCB)</strong> — <strong>Y Simon Ktul</strong>.
              </p>
            </div>
          </aside>
        </div>

        <!-- Hộp Tiếp Nhận Góp Ý & Tâm Tình Độc Giả -->
        <section class="donate-feedback-section">
          <div class="donate-card-header">
            <i class="fa-solid fa-comments"></i>
            <h3>Tiếp Nhận Góp Ý & Đóng Góp Xây Dựng Website</h3>
          </div>
          <p class="feedback-intro-text">
            Mọi ý kiến đóng góp về bản dịch, tính năng đối chiếu, báo lỗi hiển thị hoặc đề xuất bổ sung Kinh Thánh tiếng dân tộc đều được anh <strong>Y Simon Ktul (LH: 0368045059)</strong> trân trọng lắng nghe và ghi nhận:
          </p>

          <form id="website-feedback-form" class="website-feedback-form">
            <div class="feedback-form-row">
              <div class="feedback-field">
                <label for="fb-author-input"><i class="fa-solid fa-user"></i> Họ tên / Quý danh của bạn</label>
                <input type="text" id="fb-author-input" placeholder="Ví dụ: Anh/Chị Nguyễn Văn A (hoặc để trống)" maxlength="80">
              </div>
              <div class="feedback-field">
                <label for="fb-contact-input"><i class="fa-solid fa-address-book"></i> Số điện thoại / Email liên hệ (Tuỳ chọn)</label>
                <input type="text" id="fb-contact-input" placeholder="Để chúng tôi phản hồi khi cần..." maxlength="80">
              </div>
              <div class="feedback-field">
                <label for="fb-category-select"><i class="fa-solid fa-tag"></i> Chủ đề góp ý</label>
                <select id="fb-category-select">
                  <option value="Góp ý tính năng & Giao diện">Góp ý tính năng & Giao diện</option>
                  <option value="Báo lỗi Bản dịch / Câu đối chiếu">Báo lỗi Bản dịch / Câu đối chiếu</option>
                  <option value="Đề xuất thêm Kinh Thánh tiếng dân tộc">Đề xuất thêm Kinh Thánh tiếng dân tộc</option>
                  <option value="Lời tâm tình & Cầu nguyện">Lời tâm tình & Cầu nguyện</option>
                </select>
              </div>
            </div>

            <div class="feedback-field">
              <label for="fb-message-input"><i class="fa-solid fa-pen-to-square"></i> Nội dung góp ý / Lời tâm tình *</label>
              <textarea id="fb-message-input" rows="4" required placeholder="Nhập ý kiến đóng góp, phát hiện lỗi câu Kinh Thánh hoặc lời tâm tình của bạn tại đây..."></textarea>
            </div>

            <div class="feedback-submit-bar">
              <button type="submit" class="btn-primary feedback-submit-btn">
                <i class="fa-solid fa-paper-plane"></i> Gửi Góp Ý Lên Hệ Thống
              </button>
              <a href="https://zalo.me/0368045059" target="_blank" rel="noopener noreferrer" class="feedback-zalo-direct-btn">
                <i class="fa-solid fa-comment-dots"></i> Nhắn Trực Tiếp Zalo (0368045059 - Y Simon Ktul)
              </a>
            </div>
          </form>

          <!-- Danh sách Góp ý & Lời tâm tình đã tiếp nhận -->
          <div class="feedback-list-wrap">
            <h4 class="feedback-list-title">
              <i class="fa-solid fa-heart" style="color: var(--accent-gold);"></i> Các Ý Kiến Đóng Góp & Lời Tâm Tình Gần Đây (${feedbacks.length})
            </h4>
            <div class="feedback-items-grid" id="feedback-items-grid">
              ${feedbacks.map(item => `
                <div class="feedback-item-card" data-fb-id="${item.id}">
                  <div class="feedback-item-top">
                    <div class="feedback-author-info">
                      <strong><i class="fa-solid fa-user-circle"></i> ${item.author}</strong>
                      <span class="feedback-cat-badge">${item.category}</span>
                    </div>
                    <div class="feedback-meta-right">
                      <span class="feedback-date">${item.created_at}</span>
                      ${isAdmin ? `<button type="button" class="feedback-del-btn" data-del-fb="${item.id}" title="Xoá góp ý này">&times;</button>` : ''}
                    </div>
                  </div>
                  <p class="feedback-item-msg">${item.message}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Khu vực Quảng Cáo Google AdSense & Cài Đặt Cho Phép Google Hiển Thị Quảng Cáo Duy Trì Web -->
        <section class="donate-adsense-section">
          <div class="donate-card-header">
            <i class="fa-solid fa-rectangle-ad"></i>
            <h3>Quảng Cáo Google AdSense — Đồng Hành Duy Trì Máy Chủ</h3>
          </div>
          <p class="adsense-explain-text">
            Bên cạnh sự dâng hiến tự nguyện, Website cho phép <strong>Google AdSense</strong> hiển thị quảng cáo văn minh ở cuối trang để tạo thêm nguồn thu nhập nhỏ duy trì tên miền và máy chủ dữ liệu Kinh Thánh miễn phí cho mọi người.
          </p>

          <!-- Khung hiển thị Google AdSense trực tiếp -->
          <div class="adsense-slot-card donate-adsense-box ${adConfig.enabled ? '' : 'hidden'}">
            <div class="adsense-slot-header">
              <span class="adsense-badge"><i class="fa-brands fa-google"></i> Google AdSense (${adConfig.publisherId})</span>
              <span class="adsense-status-pill"><i class="fa-solid fa-circle-check"></i> Đang cho phép hiển thị quảng cáo</span>
            </div>
            <div class="adsense-unit-wrap">
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="${adConfig.publisherId}"
                   data-ad-slot="${adConfig.slotDonatePage || '3680450590'}"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>

          <!-- Bảng cấu hình nhanh mã Google AdSense cho Chủ Website (Y Simon Ktul) -->
          <details class="adsense-config-details">
            <summary>
              <i class="fa-solid fa-sliders"></i> Cấu Hình Mã Google AdSense Của Chủ Website (Y Simon Ktul)
            </summary>
            <div class="adsense-config-body">
              <div class="feedback-form-row">
                <div class="feedback-field">
                  <label for="adsense-pub-id-input">Google AdSense Publisher ID (Mã nhà xuất bản):</label>
                  <input type="text" id="adsense-pub-id-input" value="${adConfig.publisherId}" placeholder="ca-pub-XXXXXXXXXXXXXXXX">
                </div>
                <div class="feedback-field">
                  <label for="adsense-slot-input">Mã vùng quảng cáo (Ad Slot ID):</label>
                  <input type="text" id="adsense-slot-input" value="${adConfig.slotReaderBottom || '9368045059'}" placeholder="Ví dụ: 9368045059">
                </div>
                <div class="feedback-field" style="justify-content: flex-end;">
                  <label class="adsense-toggle-label">
                    <input type="checkbox" id="adsense-enabled-checkbox" ${adConfig.enabled ? 'checked' : ''}>
                    <span>Cho phép Google hiển thị quảng cáo trên Website</span>
                  </label>
                </div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                  <i class="fa-solid fa-circle-info" style="color: var(--accent-gold);"></i> Đã tích hợp sẵn thẻ <code>&lt;script async src="...adsbygoogle.js"&gt;</code> và tệp <code>/ads.txt</code> ở thư mục gốc.
                </span>
                <button type="button" id="save-adsense-config-btn" class="btn-primary">
                  <i class="fa-solid fa-floppy-disk"></i> Lưu Cấu Hình Quảng Cáo Google
                </button>
              </div>
            </div>
          </details>
        </section>
      </div>
    `;

    this.bindDonateViewEvents(container);
    this.triggerAdSensePush();
  }

  bindDonateViewEvents(container) {
    if (!container) return;

    // 1. Nút sao chép nhanh Số tài khoản VCB (9368045059), Tên người nhận (Y Simon Ktul), SĐT (0368045059)
    container.querySelectorAll('.copy-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.dataset.copy || '';
        if (!textToCopy) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textToCopy);
        }
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Đã chép`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('copied');
        }, 1800);
      });
    });

    // 2. Gửi Form Tiếp Nhận Góp Ý
    const form = container.querySelector('#website-feedback-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = container.querySelector('#fb-author-input')?.value || '';
      const contact = container.querySelector('#fb-contact-input')?.value || '';
      const category = container.querySelector('#fb-category-select')?.value || 'Góp ý xây dựng Website';
      const message = container.querySelector('#fb-message-input')?.value || '';

      if (!message.trim()) {
        alert('Vui lòng nhập nội dung góp ý hoặc lời tâm tình của bạn!');
        return;
      }

      storage.saveWebsiteFeedback({ author, contact, category, message });
      this.renderDonateView();
      alert('Cảm ơn bạn đã gửi góp ý xây dựng Website! Ý kiến của bạn đã được ghi nhận.');
    });

    // 3. Xoá góp ý (dành cho Quản trị viên)
    container.querySelectorAll('.feedback-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delFb;
        if (id) {
          storage.deleteWebsiteFeedback(id);
          this.renderDonateView();
        }
      });
    });

    // 4. Lưu cấu hình Google AdSense
    container.querySelector('#save-adsense-config-btn')?.addEventListener('click', () => {
      const pubInput = container.querySelector('#adsense-pub-id-input')?.value.trim() || 'ca-pub-9368045059000000';
      const slotInput = container.querySelector('#adsense-slot-input')?.value.trim() || '9368045059';
      const enabled = container.querySelector('#adsense-enabled-checkbox')?.checked ?? true;

      storage.saveAdSenseConfig({
        publisherId: pubInput,
        slotReaderBottom: slotInput,
        slotDonatePage: slotInput,
        enabled
      });
      this.initGoogleAdSense();
      this.renderDonateView();
      alert('Đã lưu cấu hình hiển thị quảng cáo Google AdSense thành công!');
    });
  }

  // 4.9 Cổng Thông Tin & Dưỡng Linh Thánh Kinh (kinhthanh.net / Tin Lành Classic Portal)
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
  }

  renderPortalView() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 5. Admin Banner UI & Customization Modal (Supports Verse, Announcement & Ad Banner with Image, URL & Marquee)
  updateAdminBannerUI(banner) {
    const bannerContainer = document.getElementById('admin-banner-container');
    const bannerBar = document.getElementById('admin-banner-bar');
    const bannerBadge = document.getElementById('banner-badge');
    const bannerText = document.getElementById('banner-text');
    const bannerTextWrap = document.getElementById('banner-text-wrap');
    const bannerMedia = document.getElementById('banner-media-container');
    const actionLink = document.getElementById('banner-action-link');

    if (!banner || !banner.visible) {
      if (bannerContainer) bannerContainer.style.display = 'none';
      return;
    }

    if (bannerContainer) bannerContainer.style.display = 'block';

    const type = banner.type || 'verse';
    const modeClass = type === 'ad' ? 'banner-mode-ad' : (type === 'announcement' ? 'banner-mode-announcement' : 'banner-mode-verse');

    if (bannerBar) {
      bannerBar.className = `admin-banner ${banner.theme || 'theme-gold'} ${modeClass}`;
    }

    if (bannerBadge) {
      let icon = 'fa-scroll';
      if (type === 'ad') icon = 'fa-rectangle-ad';
      else if (type === 'announcement') icon = 'fa-bullhorn';
      bannerBadge.innerHTML = `<i class="fa-solid ${icon}"></i> ${banner.badge || (type === 'ad' ? 'TÀI TRỢ' : (type === 'announcement' ? 'THÔNG BÁO' : 'CÂU GỐC'))}`;
    }

    if (bannerMedia) {
      if (type === 'ad' && banner.imageUrl) {
        bannerMedia.innerHTML = `<img src="${banner.imageUrl}" alt="Nhà tài trợ">`;
        bannerMedia.classList.remove('hidden');
      } else {
        bannerMedia.innerHTML = '';
        bannerMedia.classList.add('hidden');
      }
    }

    if (bannerTextWrap) {
      bannerTextWrap.classList.toggle('is-marquee', Boolean(banner.marquee));
    }

    if (bannerText) {
      bannerText.innerHTML = banner.text;
    }

    if (actionLink) {
      actionLink.textContent = banner.btnText || 'Khám Phá';
      actionLink.onclick = (e) => {
        const url = banner.targetUrl || banner.targetRef || '#bible';
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          window.open(url, '_blank', 'noopener,noreferrer');
          return;
        }
        e.preventDefault();
        if (url === '#portal' || url === 'portal') {
          state.setActiveView('portal');
        } else if (url === '#donate' || url === 'donate') {
          state.setActiveView('donate');
        } else if (url === '#tsk' || url === 'tsk') {
          state.setActiveView('tsk');
        } else if (url.includes('.')) {
          const parts = url.split('.');
          state.setPassage(parts[0], parseInt(parts[1], 10) || 1, parseInt(parts[2], 10) || 1);
          state.setActiveView('bible');
        } else {
          state.setActiveView('bible');
        }
      };
    }
  }

  openAdminBannerModal() {
    if (state.currentUserRole !== 'admin') {
      this.openAdminAuthModal();
      return;
    }

    const modal = document.getElementById('admin-banner-modal');
    if (!modal) return;

    const b = state.adminBannerConfig || {};
    const typeSelect = document.getElementById('admin-banner-type-select');
    if (typeSelect) typeSelect.value = b.type || 'verse';

    const badgeInput = document.getElementById('admin-banner-badge-input');
    if (badgeInput) badgeInput.value = b.badge || 'CÂU GỐC TUẦN';

    const textInput = document.getElementById('admin-banner-text-input');
    if (textInput) textInput.value = (b.text || '').replace(/<[^>]*>/g, '');

    const btnInput = document.getElementById('admin-banner-btn-text-input');
    if (btnInput) btnInput.value = b.btnText || 'Khám Phá Đối Chiếu';

    const themeSelect = document.getElementById('admin-banner-theme-select');
    if (themeSelect) themeSelect.value = b.theme || 'theme-gold';

    const urlInput = document.getElementById('admin-banner-url-input');
    if (urlInput) urlInput.value = b.targetUrl || b.targetRef || '#bible';

    const imgInput = document.getElementById('admin-banner-img-input');
    if (imgInput) imgInput.value = b.imageUrl || '';

    const marqueeCheckbox = document.getElementById('admin-banner-marquee-checkbox');
    if (marqueeCheckbox) marqueeCheckbox.checked = Boolean(b.marquee);

    const adsenseCheckbox = document.getElementById('admin-banner-adsense-checkbox');
    if (adsenseCheckbox) adsenseCheckbox.checked = Boolean(b.useAdSense);

    const visibleCheckbox = document.getElementById('admin-banner-visible-checkbox');
    if (visibleCheckbox) visibleCheckbox.checked = b.visible ?? true;

    modal.classList.remove('hidden');
  }

  saveAdminBannerFromModal() {
    try {
      const type = document.getElementById('admin-banner-type-select')?.value || 'verse';
      const badge = document.getElementById('admin-banner-badge-input')?.value.trim() || 'THÔNG BÁO';
      const text = document.getElementById('admin-banner-text-input')?.value.trim() || '';
      const btnText = document.getElementById('admin-banner-btn-text-input')?.value.trim() || 'Xem Thêm';
      const theme = document.getElementById('admin-banner-theme-select')?.value || 'theme-gold';
      const targetUrl = document.getElementById('admin-banner-url-input')?.value.trim() || '#bible';
      const imageUrl = document.getElementById('admin-banner-img-input')?.value.trim() || '';
      const marquee = document.getElementById('admin-banner-marquee-checkbox')?.checked ?? false;
      const useAdSense = document.getElementById('admin-banner-adsense-checkbox')?.checked ?? false;
      const visible = document.getElementById('admin-banner-visible-checkbox')?.checked ?? true;

      const updated = {
        type,
        badge,
        text,
        btnText,
        theme,
        targetUrl,
        targetRef: targetUrl,
        imageUrl,
        marquee,
        useAdSense,
        visible
      };

      state.updateAdminBanner(updated);
      document.getElementById('admin-banner-modal').classList.add('hidden');
      alert('Đã cập nhật và xuất bản Banner thành công!');
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  }

  // 6. Admin Authentication Gate Modal
  openAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    if (modal) {
      modal.classList.remove('hidden');
      const errorMsg = document.getElementById('admin-auth-error-msg');
      if (errorMsg) errorMsg.classList.add('hidden');

      setTimeout(() => {
        const userInput = document.getElementById('admin-username-input');
        const passInput = document.getElementById('admin-password-input');
        if (userInput && !userInput.value) {
          userInput.focus();
        } else if (passInput) {
          passInput.focus();
          passInput.select();
        }
      }, 100);
    }
  }

  updateRoleUI(role) {
    const roleLabel = document.getElementById('role-label');
    const authBtn = document.getElementById('role-auth-btn');
    if (roleLabel) {
      roleLabel.textContent = role === 'admin' ? 'Quản Trị' : 'Khách';
    }
    if (authBtn) {
      authBtn.style.borderColor = role === 'admin' ? 'var(--accent-gold)' : 'var(--border-subtle)';
    }
    this.updateHeaderVisitorCount();
  }

  updateHeaderVisitorCount() {
    const analyticsBtn = document.getElementById('admin-analytics-btn');
    const analyticsLabel = document.getElementById('analytics-label');
    if (analyticsLabel) {
      const data = storage.getAnalytics();
      const visits = data.total_visits || 1845;
      const formatted = visits >= 1000 ? `${(visits / 1000).toFixed(1)}k` : visits;
      analyticsLabel.textContent = `${formatted} xem`;
      if (analyticsBtn) {
        analyticsBtn.classList.remove('hidden');
        analyticsBtn.title = `Thống kê độc giả: ${visits.toLocaleString('vi-VN')} lượt xem (Nhấp để xem chi tiết)`;
      }
    }
  }

  // 6.1 Admin Article Studio Modal (Create / Edit Master Theological Journals)
  openAdminArticleModal(articleId = null) {
    if (state.currentUserRole !== 'admin') {
      this.openAdminAuthModal();
      return;
    }
    const modal = document.getElementById('admin-article-modal');
    if (!modal) return;

    const modalTitle = document.getElementById('admin-article-modal-title');
    const idInput = document.getElementById('admin-art-id');
    const titleInput = document.getElementById('admin-art-title');
    const authorInput = document.getElementById('admin-art-author');
    const catInput = document.getElementById('admin-art-category');
    const sumInput = document.getElementById('admin-art-summary');
    const contInput = document.getElementById('admin-art-content');
    const tagsInput = document.getElementById('admin-art-tags');
    const imgInput = document.getElementById('admin-art-image');
    const imgPrevWrap = document.getElementById('admin-art-img-preview');
    const imgPrevTag = document.getElementById('admin-art-img-preview-tag');
    const docNameInput = document.getElementById('admin-art-doc-name');
    const docMetaInput = document.getElementById('admin-art-doc-meta');
    const docUrlInput = document.getElementById('admin-art-doc-url');

    if (articleId) {
      const art = blogSystem.getMasterBlog(articleId);
      if (art) {
        if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: var(--accent-gold);"></i> CHỈNH SỬA KHẢO LUẬN THẦN HỌC';
        if (idInput) idInput.value = art.id;
        if (titleInput) titleInput.value = art.title_vi || '';
        if (authorInput) authorInput.value = art.author || '';
        if (catInput) catInput.value = art.category || 'Thần Học Phúc Âm';
        if (sumInput) sumInput.value = art.summary || '';
        if (contInput) contInput.value = art.content || '';
        if (tagsInput) tagsInput.value = (art.tags || []).join(', ');
        if (imgInput) imgInput.value = art.cover_image || '';
        if (art.cover_image && imgPrevTag && imgPrevWrap) {
          imgPrevTag.src = art.cover_image;
          imgPrevWrap.classList.remove('hidden');
        } else if (imgPrevWrap) {
          imgPrevWrap.classList.add('hidden');
        }

        const firstDoc = (art.documents && art.documents[0]) || null;
        if (firstDoc) {
          if (docNameInput) docNameInput.value = firstDoc.name || '';
          if (docMetaInput) docMetaInput.value = `${firstDoc.type || 'PDF'} • ${firstDoc.size || '1.8 MB'}`;
          if (docUrlInput) docUrlInput.value = firstDoc.url || '';
        } else {
          if (docNameInput) docNameInput.value = '';
          if (docMetaInput) docMetaInput.value = 'PDF • 1.8 MB';
          if (docUrlInput) docUrlInput.value = '';
        }
      }
    } else {
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-feather-pointed" style="color: var(--accent-gold);"></i> SOẠN THẢO KHẢO LUẬN THẦN HỌC';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (authorInput) authorInput.value = 'Quản Trị Viên / Mục Sư';
      if (catInput) catInput.value = 'Thần Học Phúc Âm';
      if (sumInput) sumInput.value = '';
      if (contInput) contInput.value = '';
      if (tagsInput) tagsInput.value = 'Ngôi Lời, Khảo Luận, Thần Học';
      if (imgInput) imgInput.value = '';
      if (imgPrevWrap) imgPrevWrap.classList.add('hidden');
      if (docNameInput) docNameInput.value = '';
      if (docMetaInput) docMetaInput.value = 'PDF • 1.8 MB';
      if (docUrlInput) docUrlInput.value = '';
    }

    modal.classList.remove('hidden');
  }

  saveAdminArticleFromModal() {
    const idInput = document.getElementById('admin-art-id');
    const title = (document.getElementById('admin-art-title')?.value || '').trim();
    const author = (document.getElementById('admin-art-author')?.value || 'Quản Trị Viên').trim();
    const category = document.getElementById('admin-art-category')?.value || 'Thần Học Phúc Âm';
    const summary = (document.getElementById('admin-art-summary')?.value || '').trim();
    const content = (document.getElementById('admin-art-content')?.value || '').trim();
    const tagsRaw = (document.getElementById('admin-art-tags')?.value || '').trim();
    const cover_image = (document.getElementById('admin-art-image')?.value || '').trim();
    const docName = (document.getElementById('admin-art-doc-name')?.value || '').trim();
    const docMeta = (document.getElementById('admin-art-doc-meta')?.value || '').trim();
    const docUrl = (document.getElementById('admin-art-doc-url')?.value || '').trim();

    if (!title || !content) {
      alert('Vui lòng nhập tiêu đề và nội dung bài khảo luận.');
      return;
    }

    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const documents = [];
    if (docName && docUrl) {
      const parts = docMeta.split('•').map(p => p.trim());
      documents.push({
        name: docName,
        type: parts[0] || 'PDF',
        size: parts[1] || 'Tài liệu nghiên cứu',
        url: docUrl
      });
    }

    const articleData = {
      title_vi: title,
      author,
      category,
      summary,
      content,
      tags,
      cover_image,
      documents
    };

    if (idInput && idInput.value) {
      blogSystem.updateMasterBlog(idInput.value, articleData);
      alert('Đã cập nhật bài khảo luận thành công!');
    } else {
      blogSystem.createMasterBlog(articleData);
      alert('Đã xuất bản bài khảo luận mới thành công!');
    }

    document.getElementById('admin-article-modal')?.classList.add('hidden');
    this.renderBlogView();
  }

  // 6.15 Admin Community Post Studio Modal (Edit Any Community Post)
  openAdminCommunityPostModal(postId) {
    if (state.currentUserRole !== 'admin') {
      this.openAdminAuthModal();
      return;
    }
    const modal = document.getElementById('admin-community-post-modal');
    if (!modal) return;

    const post = blogSystem.getCommunityPost(postId);
    if (!post) {
      alert('Không tìm thấy bài viết cộng đồng cần sửa.');
      return;
    }

    const idInput = document.getElementById('admin-comm-post-id');
    const titleInput = document.getElementById('admin-comm-post-title');
    const authorInput = document.getElementById('admin-comm-post-author');
    const statusSelect = document.getElementById('admin-comm-post-status');
    const branchSelect = document.getElementById('admin-comm-post-branch');
    const contentInput = document.getElementById('admin-comm-post-content');

    if (idInput) idInput.value = post.id;
    if (titleInput) titleInput.value = post.title || '';
    if (authorInput) authorInput.value = post.author || '';
    if (statusSelect) statusSelect.value = post.status || 'approved';
    if (branchSelect) branchSelect.value = post.branch_id || 'branch_devotion';
    if (contentInput) contentInput.value = post.content || '';

    modal.classList.remove('hidden');
  }

  saveAdminCommunityPostFromModal() {
    const idInput = document.getElementById('admin-comm-post-id');
    const title = (document.getElementById('admin-comm-post-title')?.value || '').trim();
    const author = (document.getElementById('admin-comm-post-author')?.value || '').trim();
    const status = document.getElementById('admin-comm-post-status')?.value || 'approved';
    const branch_id = document.getElementById('admin-comm-post-branch')?.value || 'branch_devotion';
    const content = (document.getElementById('admin-comm-post-content')?.value || '').trim();

    if (!idInput || !idInput.value) return;
    if (!title || !content) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung bài chia sẻ.');
      return;
    }

    const res = blogSystem.updateCommunityPost(idInput.value, {
      title,
      author,
      status,
      branch_id,
      content
    });

    if (res.success) {
      alert('Đã cập nhật bài viết cộng đồng thành công!');
      document.getElementById('admin-community-post-modal')?.classList.add('hidden');
      this.renderCommunityView();
    } else {
      alert(res.reason || 'Có lỗi xảy ra khi lưu bài viết.');
    }
  }

  // 6.2 Admin Reader Analytics Intelligence Modal
  openAdminAnalyticsModal() {
    if (state.currentUserRole !== 'admin') {
      this.openAdminAuthModal();
      return;
    }
    const modal = document.getElementById('admin-analytics-modal');
    if (!modal) return;
    this.renderAnalyticsDashboard();
    modal.classList.remove('hidden');
  }

  renderAnalyticsDashboard() {
    const data = storage.getAnalytics();
    if (!data) return;

    // Update KPI counters
    const visitsEl = document.getElementById('analytics-metric-visits');
    const usersEl = document.getElementById('analytics-metric-users');
    const versesEl = document.getElementById('analytics-metric-verses');
    const timeEl = document.getElementById('analytics-metric-time');

    if (visitsEl) visitsEl.textContent = (data.total_visits || 1845).toLocaleString('vi-VN');
    if (usersEl) usersEl.textContent = (data.unique_visitors || 420).toLocaleString('vi-VN');
    if (versesEl) versesEl.textContent = (data.total_verses_read || 16850).toLocaleString('vi-VN');
    if (timeEl) timeEl.textContent = `${data.avg_time_minutes || 24} phút`;

    // 1. Top Passages
    const passagesList = document.getElementById('analytics-top-passages-list');
    if (passagesList) {
      passagesList.innerHTML = (data.top_passages || []).slice(0, 6).map(p => `
        <div style="font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <strong style="color: var(--text-primary);">${p.label || p.ref}</strong>
            <span style="color: var(--accent-gold); font-weight: 700;">${p.count} lượt đọc</span>
          </div>
          <div style="height: 6px; background: var(--bg-surface); border-radius: 3px; overflow: hidden; border: 1px solid var(--border-subtle);">
            <div style="height: 100%; width: ${p.percent || 50}%; background: linear-gradient(90deg, var(--accent-gold) 0%, #ffe082 100%);"></div>
          </div>
        </div>
      `).join('');
    }

    // 2. Top Translations
    const transList = document.getElementById('analytics-top-translations-list');
    if (transList) {
      transList.innerHTML = (data.top_translations || []).slice(0, 6).map(t => `
        <div style="font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
            <strong style="color: var(--text-primary);">${t.name || t.id}</strong>
            <span style="color: #17a2b8; font-weight: 700;">${t.count} tra cứu</span>
          </div>
          <div style="height: 6px; background: var(--bg-surface); border-radius: 3px; overflow: hidden; border: 1px solid var(--border-subtle);">
            <div style="height: 100%; width: ${t.percent || 50}%; background: linear-gradient(90deg, #17a2b8 0%, #5bc0de 100%);"></div>
          </div>
        </div>
      `).join('');
    }

    // 3. Top Metaphors
    const metaList = document.getElementById('analytics-top-metaphors-list');
    if (metaList) {
      metaList.innerHTML = (data.top_metaphors || []).slice(0, 5).map(m => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.6rem; background: var(--bg-surface); border-radius: 4px; border-left: 3px solid var(--accent-gold); font-size: 0.82rem;">
          <span style="color: var(--text-primary); font-weight: 600;"><i class="fa-solid fa-seedling" style="color: var(--accent-gold);"></i> ${m.name}</span>
          <span class="banner-badge" style="background: var(--bg-card); color: var(--accent-gold); border: 1px solid var(--accent-gold-border); font-size: 0.72rem;">${m.count} tra cứu</span>
        </div>
      `).join('');
    }

    // 4. Top Queries & Articles
    const queriesList = document.getElementById('analytics-top-queries-list');
    if (queriesList) {
      const queriesHTML = (data.top_queries || []).slice(0, 4).map(q => `
        <span style="background: var(--bg-surface); border: 1px solid var(--border-medium); padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; color: var(--text-primary);">
          🔍 ${q.query} (${q.count})
        </span>
      `).join(' ');

      const articlesHTML = (data.top_articles || []).slice(0, 2).map(a => `
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.4rem;">
          <i class="fa-solid fa-file-lines" style="color: var(--accent-gold);"></i> <strong>${a.title}</strong>: <span style="color: var(--accent-gold);">${a.views || 0} xem</span>
        </div>
      `).join('');

      queriesList.innerHTML = `
        <div style="margin-bottom: 0.5rem; font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">TỪ KHÓA TÌM KIẾM NHIỀU:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.65rem;">${queriesHTML}</div>
        <div style="border-top: 1px dashed var(--border-subtle); padding-top: 0.4rem;">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.3rem;">BÀI KHẢO LUẬN XEM NHẤT:</div>
          ${articlesHTML}
        </div>
      `;
    }
  }

  // 6.5 Kệ Sách Động Theo Thể Loại & Chọn Chương Mở Đọc
  renderGenreBookshelf(genreKey) {
    const shelfContainer = document.getElementById('genre-bookshelf');
    if (!shelfContainer) return;

    this.currentShelfGenre = genreKey;
    shelfContainer.classList.remove('hidden');

    const genreGuide = hermeneuticsEngine.getGenreGuide(genreKey);
    let genreTitle = 'Tất Cả 66 Sách Kinh Thánh';
    let genreIcon = 'fa-book-bible';
    let genreColor = 'var(--accent-gold)';
    let genreTip = 'Toàn bộ 66 sách Kinh Thánh gồm 39 sách Cựu Ước và 27 sách Tân Ước. Chọn bất kỳ sách nào bên dưới để mở đọc và đối chiếu song song.';

    if (genreKey !== 'all' && genreGuide) {
      genreTitle = `Thể Loại: ${genreGuide.name_vi}`;
      genreIcon = genreGuide.icon || 'fa-layer-group';
      genreColor = genreGuide.color || 'var(--accent-gold)';
      const principle = (genreGuide.hermeneutical_principles && genreGuide.hermeneutical_principles[0]) 
        || genreGuide.core_definition 
        || 'Hiểu đúng thể loại văn chương là chìa khóa mở ra lẽ thật của Lời Chúa.';
      genreTip = principle;
    }

    const books = genreKey === 'all' 
      ? bibleEngine.books 
      : bibleEngine.books.filter(b => b.genre === genreKey);

    let html = `
      <div class="shelf-header" style="--genre-shelf-color: ${genreColor};">
        <div class="shelf-title">
          <i class="fa-solid ${genreIcon} shelf-title-icon" style="color: ${genreColor};"></i>
          <span>${genreTitle}</span>
          <span class="shelf-count-pill">${books.length} Sách</span>
        </div>
        <div class="shelf-guideline-tip" style="--genre-shelf-color: ${genreColor};">
          <i class="fa-solid fa-lightbulb" style="color: var(--accent-gold); margin-right: 0.35rem;"></i>
          <strong>Nguyên tắc:</strong> ${genreTip}
        </div>
        <button class="shelf-close-btn" id="shelf-close-btn" title="Thu gọn kệ sách">
          <i class="fa-solid fa-chevron-up"></i> Thu Gọn
        </button>
      </div>

      <!-- Danh Sách Sách Trong Thể Loại -->
      <div class="shelf-books-grid" id="shelf-books-grid">
    `;

    books.forEach(b => {
      const isCurrentBook = b.id === state.currentBook;
      const testamentStr = b.testament === 'OT' ? 'Cựu Ước' : 'Tân Ước';
      const bColor = `var(--genre-${b.genre}, var(--accent-gold))`;

      html += `
        <div class="shelf-book-card ${isCurrentBook ? 'active-book' : ''}" data-book-id="${b.id}" style="--genre-color: ${bColor};">
          <div>
            <div class="shelf-book-name">
              <span>${b.name_vi}</span>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">${b.name_en}</span>
            </div>
            <div class="shelf-book-meta">
              <span>${testamentStr}</span> • <span>${b.chapters_count} Chương</span> • <span>${b.id}</span>
            </div>
            <div class="shelf-book-theme" title="${b.theme || ''}">
              ${b.theme || 'Khám phá Lời Hằng Sống với ánh sáng của Thánh Linh.'}
            </div>
          </div>
          <div class="shelf-book-footer">
            <span class="shelf-action-label"><i class="fa-solid fa-book-open"></i> Mở Chọn Chương</span>
            <i class="fa-solid fa-angle-right" style="font-size: 0.75rem;"></i>
          </div>
        </div>
      `;
    });

    html += `
      </div>

      <!-- Khay Chọn Chương Cụ Thể (Shelf Chapters Tray) -->
      <div id="shelf-chapters-tray" class="shelf-chapters-tray">
        <!-- Render nội dung chương của sách đang chọn -->
      </div>
    `;

    shelfContainer.innerHTML = html;

    // Gắn sự kiện nút Thu Gọn
    shelfContainer.querySelector('#shelf-close-btn')?.addEventListener('click', () => {
      shelfContainer.classList.add('hidden');
    });

    // Gắn sự kiện click từng thẻ sách
    shelfContainer.querySelectorAll('.shelf-book-card').forEach(card => {
      card.addEventListener('click', () => {
        const bookId = card.dataset.bookId;
        this.selectShelfBook(bookId);
      });
    });

    // Mặc định chọn sách hiện tại hoặc sách đầu tiên trong danh sách
    const initialBook = books.find(b => b.id === state.currentBook) || books[0];
    if (initialBook) {
      this.selectShelfBook(initialBook.id, false);
    }
  }

  selectShelfBook(bookId, loadPassageImmediately = false) {
    this.activeShelfBook = bookId;

    // Highlight card
    document.querySelectorAll('.shelf-book-card').forEach(card => {
      card.classList.toggle('active-book', card.dataset.bookId === bookId);
    });

    const book = bibleEngine.getBookById(bookId);
    if (!book) return;

    const tray = document.getElementById('shelf-chapters-tray');
    if (!tray) return;

    tray.classList.remove('hidden');

    const isOT = book.testament === 'OT';
    const testamentBadge = isOT ? 'Cựu Ước' : 'Tân Ước';
    const bColor = `var(--genre-${book.genre}, var(--accent-gold))`;

    let trayHTML = `
      <div class="tray-header">
        <div class="tray-title">
          <i class="fa-solid fa-book-bookmark" style="color: ${bColor};"></i>
          <span>Danh Sách Đoạn: <strong style="color: var(--text-primary);">${book.name_vi}</strong> (${book.name_en})</span>
          <span style="font-size: 0.78rem; background: rgba(255,255,255,0.06); padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--text-muted);">
            ${testamentBadge} • ${book.chapters_count} Đoạn • Trước giả: ${book.author || 'Được Thánh Linh cảm thúc'}
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button id="tray-read-ch1-btn" style="background: var(--accent-gold); color: #000; font-weight: 700; border: none; padding: 0.35rem 0.85rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-play"></i> Đọc Ngay Đoạn 1
          </button>
        </div>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.65rem;">
        <i class="fa-solid fa-arrow-pointer" style="color: var(--accent-gold);"></i> Nhấp vào bất kỳ đoạn nào bên dưới để mở đọc trực tiếp và đối chiếu song song:
      </div>
      <div class="tray-chapters-list">
    `;

    for (let c = 1; c <= book.chapters_count; c++) {
      const isCurrent = (book.id === state.currentBook && c === state.currentChapter);
      trayHTML += `
        <button class="tray-chapter-btn ${isCurrent ? 'current-ch' : ''}" data-chapter="${c}" title="Mở đọc ${book.name_vi} đoạn ${c}">
          Đoạn ${c}
        </button>
      `;
    }

    trayHTML += `</div>`;
    tray.innerHTML = trayHTML;

    // Sự kiện nút "Đọc Ngay Đoạn 1"
    tray.querySelector('#tray-read-ch1-btn')?.addEventListener('click', () => {
      this.openPassageFromShelf(book.id, 1);
    });

    // Sự kiện click từng nút đoạn
    tray.querySelectorAll('.tray-chapter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.dataset.chapter, 10);
        this.openPassageFromShelf(book.id, ch);
      });
    });

    if (loadPassageImmediately) {
      this.openPassageFromShelf(book.id, 1);
    }
  }

  openPassageFromShelf(bookId, chapterNum) {
    state.setPassage(bookId, chapterNum, 1);
    state.setActiveView('bible');

    // Cập nhật nút đoạn active trong tray
    document.querySelectorAll('.tray-chapter-btn').forEach(btn => {
      btn.classList.toggle('current-ch', parseInt(btn.dataset.chapter, 10) === chapterNum);
    });

    // Cuộn mượt xuống Focus Reader
    const reader = document.getElementById('focus-reader');
    if (reader) {
      reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const book = bibleEngine.getBookById(bookId);
    console.log(`📖 Đã mở: ${book?.name_vi || bookId} - Đoạn ${chapterNum}`);
  }

  updateShelfActiveState(bookId, chapterNum) {
    document.querySelectorAll('.shelf-book-card').forEach(card => {
      card.classList.toggle('active-book', card.dataset.bookId === bookId);
    });
    document.querySelectorAll('.tray-chapter-btn').forEach(btn => {
      btn.classList.toggle('current-ch', parseInt(btn.dataset.chapter, 10) === chapterNum);
    });
  }

  // 7. Modals: Book Picker & Version Selector
  populateBookPicker(testament = 'OT') {
    const grid = document.getElementById('books-grid');
    if (!grid) return;

    this.currentPickerTestament = testament;
    const filteredBooks = bibleEngine.books.filter(b => b.testament === testament);

    let html = '';
    filteredBooks.forEach(b => {
      html += `
        <div class="book-card-item" data-book-id="${b.id}" style="--genre-color: var(--genre-${b.genre}, var(--accent-gold));">
          <div style="font-weight: 700; color: var(--text-primary);">${b.name_vi}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${b.chapters_count} đoạn</div>
        </div>
      `;
    });
    grid.innerHTML = html;

    grid.querySelectorAll('.book-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const bookId = card.dataset.bookId;
        this.openChaptersSelector(bookId);
      });
    });
  }

  openChaptersSelector(bookId) {
    const book = bibleEngine.getBookById(bookId);
    if (!book) return;

    const booksGrid = document.getElementById('books-grid');
    const chaptersGrid = document.getElementById('chapters-grid');
    if (!chaptersGrid || !booksGrid) return;

    booksGrid.classList.add('hidden');
    chaptersGrid.classList.remove('hidden');

    let html = `
      <div style="grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <button id="back-to-books-btn" style="background: transparent; border: none; color: var(--accent-gold); font-size: 0.88rem; cursor: pointer;">
          <i class="fa-solid fa-arrow-left"></i> Chọn Sách Khác
        </button>
        <span style="font-weight: 700; color: var(--text-primary);">${book.name_vi} (${book.chapters_count} Đoạn)</span>
      </div>
    `;

    for (let c = 1; c <= book.chapters_count; c++) {
      html += `<button class="chapter-btn" data-chapter="${c}">${c}</button>`;
    }
    chaptersGrid.innerHTML = html;

    chaptersGrid.querySelector('#back-to-books-btn').addEventListener('click', () => {
      chaptersGrid.classList.add('hidden');
      booksGrid.classList.remove('hidden');
    });

    chaptersGrid.querySelectorAll('.chapter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = parseInt(btn.dataset.chapter, 10);
        state.setPassage(bookId, ch, 1);
        document.getElementById('book-picker-modal').classList.add('hidden');
        chaptersGrid.classList.add('hidden');
        booksGrid.classList.remove('hidden');
      });
    });
  }

  populateVersionSelector(activeCategory = 'vi') {
    this.activeVersionCategory = activeCategory || this.activeVersionCategory || 'vi';
    const container = document.getElementById('versions-checkbox-list');
    if (!container) return;

    // Filter translations based on category
    let filtered = ALL_TRANSLATIONS;
    if (this.activeVersionCategory === 'vi') {
      filtered = ALL_TRANSLATIONS.filter(t => t.category === 'Tiếng Việt');
    } else if (this.activeVersionCategory === 'ethnic') {
      filtered = ALL_TRANSLATIONS.filter(t => t.category === 'Sắc Tộc');
    } else if (this.activeVersionCategory === 'intl') {
      filtered = ALL_TRANSLATIONS.filter(t => t.category === 'Quốc Tế' || t.category === 'Nguyên Ngữ');
    }

    let html = '';
    filtered.forEach(t => {
      const isChecked = state.activeVersions.includes(t.id);
      const isEthnic = t.category === 'Sắc Tộc';
      html += `
        <label class="version-option-card ${isChecked ? 'selected' : ''}">
          <input type="checkbox" value="${t.id}" ${isChecked ? 'checked' : ''}>
          <div class="version-option-content">
            <div class="version-option-header">
              <span class="version-badge-code">${t.id} ${t.code ? `(${t.code})` : ''}</span>
              ${isEthnic ? `<span class="version-badge-ethnic"><i class="fa-solid fa-mountain"></i> Sắc Tộc</span>` : ''}
              <span class="version-option-name">${t.name}</span>
            </div>
            <div class="version-option-note">${t.note || t.category}</div>
          </div>
        </label>
      `;
    });
    container.innerHTML = html;

    // Attach checkbox changes
    container.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.addEventListener('change', () => {
        state.toggleVersion(box.value);
        box.closest('.version-option-card')?.classList.toggle('selected', box.checked);
        this.updateSelectedVersionsSummary();
      });
    });

    this.updateSelectedVersionsSummary();

    // Update active tab button style
    document.querySelectorAll('.version-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.vtab === this.activeVersionCategory);
    });
  }

  updateSelectedVersionsSummary() {
    const summaryEl = document.getElementById('selected-versions-summary');
    if (summaryEl) {
      summaryEl.textContent = `Đang chọn: ${state.activeVersions.length} bản dịch (${state.activeVersions.join(', ')})`;
    }
  }

  updatePrimaryVersionLabel() {
    const label = document.getElementById('primary-version-label');
    if (!label) return;
    const transObj = ALL_TRANSLATIONS.find(t => t.id === state.primaryVersion || t.code === state.primaryVersion);
    if (transObj) {
      if (transObj.id === 'CGKPV') {
        label.textContent = 'CGKPV (Công Giáo)';
      } else if (transObj.id === 'BTT') {
        label.textContent = 'BTT 1925';
      } else {
        label.textContent = `${transObj.id} (${transObj.category})`;
      }
    } else {
      label.textContent = state.primaryVersion || 'BTT 1925';
    }
  }

  populatePrimaryVersionSelector() {
    const container = document.getElementById('primary-version-list');
    if (!container) return;

    const categories = [
      { id: 'vi', title: 'Bản Dịch Tiếng Việt Phổ Biến (Tin Lành)', icon: 'fa-flag', filter: t => t.category === 'Tiếng Việt' && t.id !== 'CGKPV' },
      { id: 'cgkpv', title: 'Bản Dịch Công Giáo Chính Thống (CGKPV)', icon: 'fa-cross', filter: t => t.id === 'CGKPV' },
      { id: 'ethnic', title: 'Bản Dịch Các Thứ Tiếng Sắc Tộc Việt Nam (HTTLVN)', icon: 'fa-mountain', filter: t => t.category === 'Sắc Tộc' },
      { id: 'intl', title: 'Bản Dịch Kinh Điển Quốc Tế & Nguyên Ngữ Hy Lạp/Hê-bơ-rơ', icon: 'fa-globe', filter: t => t.category === 'Quốc Tế' || t.category === 'Nguyên Ngữ' }
    ];

    let html = '';
    categories.forEach(cat => {
      const transList = ALL_TRANSLATIONS.filter(cat.filter);
      if (transList.length === 0) return;

      html += `
        <div class="primary-version-category-section">
          <div class="primary-version-category-title">
            <i class="fa-solid ${cat.icon}"></i> ${cat.title}
          </div>
          <div class="primary-version-grid">
      `;

      transList.forEach(t => {
        const isActive = state.primaryVersion === t.id;
        html += `
          <div class="primary-version-item ${isActive ? 'active' : ''}" data-version-id="${t.id}" title="Chọn đọc ${t.name}">
            <div class="pvi-info">
              <div class="pvi-name">
                ${isActive ? '<i class="fa-solid fa-circle-check" style="color: var(--accent-gold); margin-right: 0.35rem;"></i>' : ''}
                ${t.name}
              </div>
              <div class="pvi-note">${t.note || t.category}</div>
            </div>
            <span class="pvi-badge">${t.id}</span>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.primary-version-item').forEach(item => {
      item.addEventListener('click', () => {
        const vId = item.dataset.versionId;
        state.setPrimaryVersion(vId);
        document.getElementById('primary-version-modal')?.classList.add('hidden');
      });
    });
  }

  // Hiển thị trực quan từng chữ bản dịch Interlinear (Hê-bơ-rơ / Hy Lạp) kèm phiên âm, Strong's, và link Scripture4All
  renderInterlinearWordTiles(item, bookId, chapterNum) {
    const book = bibleEngine.getBookById(bookId);
    const isOT = book?.testament === 'OT';
    const pdfUrl = item.scripture4all_pdf || bibleEngine.getScripture4AllPdfUrl(bookId, chapterNum);
    const sourceTitle = isOT 
      ? 'Cựu Ước Hê-bơ-rơ (Westminster Leningrad Codex - WLC)' 
      : 'Tân Ước Hy Lạp (Scrivener Textus Receptus - ScrTR)';

    let words = item.interlinear_words;
    if (!words || !Array.isArray(words) || words.length === 0) {
      // Parse tokens from item.text e.g. "WORD (translit - strong - gloss)"
      words = [];
      const tokenRegex = /([^\s\(\)]+)\s*\(([^)]+)\)/g;
      let m;
      while ((m = tokenRegex.exec(item.text)) !== null) {
        const orig = m[1];
        const parts = m[2].split(' - ').map(s => s.trim());
        const translit = parts[0] || '';
        const strong = parts[1] || '';
        const gloss = parts.slice(2).join(' - ') || '';
        words.push({ orig, translit, strong, gloss, meaning_vi: gloss });
      }
    }

    const verseNum = state.currentVerse || 1;
    const verseCoord = `${chapterNum}:${verseNum}`;

    let tilesHtml = '';
    if (words && words.length > 0) {
      tilesHtml = words.map(w => `
        <div class="s4a-word-col interlinear-word-tile">
          <div class="s4a-orig tile-orig ${isOT ? 'hebrew-text orig-hebrew' : 'greek-text orig-greek'}">${w.orig || ''}</div>
          <div class="s4a-translit tile-translit">${w.translit || ''}</div>
          ${w.strong ? `<div class="s4a-strong tile-strong">${w.strong}</div>` : ''}
          ${w.pos ? `<div class="s4a-pos">${w.pos}</div>` : ''}
          <div class="s4a-gloss tile-gloss">${(w.gloss || '').toUpperCase()}</div>
          ${(w.meaning_vi && w.meaning_vi.toLowerCase() !== (w.gloss || '').toLowerCase()) ? `<div class="s4a-subgloss">${w.meaning_vi}</div>` : ''}
        </div>
      `).join('');
    } else {
      tilesHtml = `<div class="s4a-raw-text">${item.text}</div>`;
    }

    return `
      <div class="s4a-interlinear-wrapper interlinear-container">
        <div class="s4a-interlinear-header interlinear-header-bar">
          <span class="s4a-source-badge source-tag"><i class="fa-solid fa-scroll"></i> ${sourceTitle}</span>
          ${pdfUrl ? `
            <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" class="btn-s4a-link" title="Mở file PDF gốc từ Scripture4All.org">
              <i class="fa-solid fa-file-pdf"></i> Xem PDF Gốc Scripture4All.org
            </a>
          ` : ''}
        </div>
        <div class="s4a-interlinear-content ${isOT ? 'rtl-flow rtl-direction' : 'ltr-flow ltr-direction'}">
          <span class="s4a-verse-tag">${verseCoord}</span>
          <div class="s4a-words-stream interlinear-words-grid">
            ${tilesHtml}
          </div>
        </div>
      </div>
    `;
  }

  // Mở cửa sổ đọc độc lập theo bản dịch đã chọn mà không ảnh hưởng cửa sổ chính
  async openPopoutReader(bookId, chapterNum, versionId, targetVerseNum = 1) {
    const modal = document.getElementById('popout-reader-modal');
    const body = document.getElementById('popout-reader-body');
    const badge = document.getElementById('popout-version-badge');
    const title = document.getElementById('popout-reader-title');
    const refTag = document.getElementById('popout-current-ref-display');
    const subtitle = document.getElementById('popout-reader-subtitle');
    if (!modal || !body) return;

    const book = bibleEngine.getBookById(bookId) || { id: bookId, name_vi: bookId, chapters_count: 1 };
    const transObj = ALL_TRANSLATIONS.find(t => t.id === versionId || t.code === versionId) || { id: versionId, name: versionId, category: 'Bản Dịch' };

    if (badge) badge.textContent = `${transObj.name} (${transObj.id})`;
    if (title) title.innerHTML = `<i class="fa-solid fa-book-open-reader" style="color: var(--accent-gold);"></i> ${book.name_vi} - Đoạn ${chapterNum}`;
    if (refTag) refTag.textContent = `${book.name_vi} ${chapterNum} • ${transObj.id}`;
    
    if (subtitle) {
      if (versionId === 'INTERLINEAR') {
        const s4aUrl = bibleEngine.getScripture4AllPdfUrl(bookId, chapterNum);
        subtitle.innerHTML = `Bản gốc ${book.testament === 'OT' ? 'Hê-bơ-rơ (Westminster Leningrad Codex - WLC)' : 'Hy Lạp (Scrivener Textus Receptus - ScrTR)'} • ${s4aUrl ? `<a href="${s4aUrl}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: underline; font-weight: 600;"><i class="fa-solid fa-file-pdf"></i> Mở PDF Gốc Scripture4All.org</a>` : ''}`;
      } else {
        subtitle.textContent = `Bản dịch: ${transObj.name} (${transObj.category}) • Cửa sổ đọc độc lập`;
      }
    }

    modal.dataset.currentBook = bookId;
    modal.dataset.currentChapter = chapterNum;
    modal.dataset.currentVersion = versionId;
    modal.dataset.currentVerse = targetVerseNum;

    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 0;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-gold);"></i>
        <p style="margin-top: 1rem; color: var(--text-muted);">Đang tải toàn bộ phân đoạn theo bản dịch ${transObj.name}...</p>
      </div>
    `;
    modal.classList.remove('hidden');

    let passageData = await bibleEngine.loadPassage(bookId, chapterNum);
    await bibleEngine.ensurePassageTranslations(bookId, chapterNum, [versionId]);
    const updatedPassage = bibleEngine.passagesCache[`${bookId}.${chapterNum}`] || passageData;

    let versesHtml = '';
    updatedPassage.verses.forEach(v => {
      let vText = '';
      if (v.translations && (v.translations[versionId] || (transObj.code && v.translations[transObj.code]))) {
        vText = v.translations[versionId] || v.translations[transObj.code];
      } else {
        vText = bibleEngine.generateVerseTranslation(v, versionId, book, chapterNum);
      }
      if (!vText || typeof vText !== 'string') {
        vText = v.text_primary;
      }

      const isTarget = v.verse_num == targetVerseNum;
      versesHtml += `
        <div class="popout-verse-item ${isTarget ? 'verse-focus-target' : ''}" data-verse="${v.verse_num}">
          <span class="popout-vnum">${v.verse_num}</span>
          <span class="popout-vtext">${vText}</span>
        </div>
      `;
    });

    body.innerHTML = versesHtml;

    setTimeout(() => {
      const targetEl = body.querySelector('.verse-focus-target');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        body.scrollTop = 0;
      }
    }, 120);
  }

  openHTTLVNSearchModal(initialQuery = '') {
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
  }

  async executeHTTLVNModalSearch(activeFilter = 'all') {
    const input = document.getElementById('httlvn-search-query');
    const query = (input?.value || '').trim();
    if (!query) return;

    const versionSelect = document.getElementById('httlvn-filter-version');
    const scopeSelect = document.getElementById('httlvn-filter-scope');
    const statsBar = document.getElementById('httlvn-search-stats');
    const statsText = document.getElementById('httlvn-stats-text');
    const resultsContainer = document.getElementById('httlvn-search-results');

    const versionCode = versionSelect?.value || 'VI1934';
    const scope = scopeSelect?.value || 'all';

    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.2rem; color: var(--accent-gold);"></i>
          <p style="margin-top: 1rem;">Đang tra cứu từ khóa <b>"${query}"</b> theo chuẩn Hội Thánh Tin Lành Việt Nam...</p>
        </div>
      `;
    }

    let startSlug = 'sa';
    let endSlug = 'kh';
    if (scope === 'OT') { startSlug = 'sa'; endSlug = 'ma'; }
    else if (scope === 'NT') { startSlug = 'mat'; endSlug = 'kh'; }
    else if (scope === 'torah') { startSlug = 'sa'; endSlug = 'phu'; }
    else if (scope === 'gospels') { startSlug = 'mat'; endSlug = 'gi'; }
    else if (scope === 'epistles') { startSlug = 'ro'; endSlug = 'giu'; }

    const res = await bibleEngine.searchHTTLVN(query, versionCode, startSlug, endSlug);
    this.currentHTTLVNResults = res.items || [];

    const otBookIds = ['GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'];

    const countAll = this.currentHTTLVNResults.length;
    const countOT = this.currentHTTLVNResults.filter(it => otBookIds.includes(it.book_id)).length;
    const countNT = countAll - countOT;

    if (statsBar && statsText) {
      statsBar.classList.remove('hidden');
      statsText.innerHTML = `Với từ khóa: <b>"${query}"</b> đã tìm thấy <b>${res.total}</b> kết quả${res.time_ms ? ` (trong <b>${res.time_ms}</b> ms)` : ''}.`;

      const elAll = document.getElementById('stats-count-all');
      const elOT = document.getElementById('stats-count-ot');
      const elNT = document.getElementById('stats-count-nt');
      if (elAll) elAll.textContent = countAll;
      if (elOT) elOT.textContent = countOT;
      if (elNT) elNT.textContent = countNT;

      document.querySelectorAll('.httlvn-stats-tabs .stats-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === activeFilter);
      });
    }

    let displayItems = this.currentHTTLVNResults;
    if (activeFilter === 'OT') {
      displayItems = this.currentHTTLVNResults.filter(it => otBookIds.includes(it.book_id));
    } else if (activeFilter === 'NT') {
      displayItems = this.currentHTTLVNResults.filter(it => !otBookIds.includes(it.book_id));
    }

    if (displayItems.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-empty-state">
          <i class="fa-solid fa-face-frown"></i>
          <p>Không tìm thấy câu Kinh Thánh nào phù hợp với từ khóa <b>"${query}"</b>.</p>
        </div>
      `;
      return;
    }

    let html = '';
    displayItems.forEach((item, i) => {
      html += `
        <div class="httlvn-result-item" data-book="${item.book_id}" data-ch="${item.chapter}" data-v="${item.verse}">
          <div class="httlvn-result-header">
            <span class="httlvn-result-ref">
              <i class="fa-solid fa-scroll" style="color: var(--accent-gold); font-size: 0.85rem;"></i>
              ${item.ref}
            </span>
            <span class="httlvn-result-index">#${item.index || i + 1}</span>
          </div>
          <div class="httlvn-result-snippet">
            ${item.snippet}
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;

    resultsContainer.querySelectorAll('.httlvn-result-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const b = itemEl.dataset.book;
        const c = parseInt(itemEl.dataset.ch, 10);
        const v = parseInt(itemEl.dataset.v, 10);
        this.navigateToPassage(b, c, v);
        document.getElementById('httlvn-search-modal')?.classList.add('hidden');
      });
    });
  }

  updateActiveVersionsCount() {
    const label = document.getElementById('active-versions-count');
    if (label) {
      label.textContent = `${state.activeVersions.length} Bản Dịch`;
    }
  }

  // 8. Event Binding
  bindEvents() {
    // Brand Logo Home
    document.getElementById('brand-home-btn')?.addEventListener('click', () => {
      state.setActiveView('bible');
    });

    // Top Navigation Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Trên điện thoại: Nhấp lại vào nút KT Đối Chiếu khi đang mở sẽ quay về đọc Kinh Thánh
        if (btn.dataset.view === 'tsk' && state.activeView === 'tsk' && typeof window !== 'undefined' && window.innerWidth <= 991) {
          state.setActiveView('bible');
          return;
        }
        state.setActiveView(btn.dataset.view);
        if (btn.dataset.view === 'bible' && window.innerWidth >= 992) {
          state.setDrawerTab('parallel');
          state.selectVerse(state.currentVerse || 1, true);
        }
      });
    });

    // Genre filter pills
    document.querySelectorAll('.genre-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.genre-pill').forEach(p => {
          p.classList.remove('active');
          p.classList.remove('genre-selected');
        });
        const genre = pill.dataset.genre;
        if (genre !== 'all') {
          pill.classList.add('genre-selected');
        } else {
          pill.classList.add('active');
        }

        // Mở và hiển thị kệ sách tương ứng với thể loại đã chọn
        this.renderGenreBookshelf(genre);
      });
    });

    // Drawer Inspector Controls
    document.getElementById('drawer-close-btn')?.addEventListener('click', () => {
      state.setDrawerOpen(false);
    });

    document.querySelectorAll('.drawer-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        state.setDrawerTab(tabBtn.dataset.tab);
      });
    });

    // Theme Palette Modal Trigger
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      this.openThemeSelectorModal();
    });

    // Admin Auth Button
    document.getElementById('role-auth-btn')?.addEventListener('click', () => {
      if (state.currentUserRole === 'admin') {
        if (confirm('Bạn đang ở quyền Quản Trị Viên. Bạn có muốn đăng xuất về quyền Khách không?')) {
          state.logoutAdmin();
        }
      } else {
        this.openAdminAuthModal();
      }
    });

    const handleAdminAuthSubmit = () => {
      const userInput = document.getElementById('admin-username-input');
      const passInput = document.getElementById('admin-password-input');
      const secretInput = document.getElementById('admin-secret-key-input');
      const errorMsg = document.getElementById('admin-auth-error-msg');
      const errorText = document.getElementById('admin-auth-error-text');

      const username = (userInput?.value || '').trim();
      const password = (passInput?.value || secretInput?.value || '').trim();

      if (!username && !password) {
        if (errorMsg) {
          errorMsg.classList.remove('hidden');
          if (errorText) errorText.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu!';
        }
        return;
      }

      // Zero-leak security: Validate username & password without revealing secrets
      const isSuccess = state.verifyAdminCredentials(username || 'admin', password);

      if (isSuccess) {
        document.getElementById('admin-auth-modal').classList.add('hidden');
        if (userInput) userInput.value = '';
        if (passInput) passInput.value = '';
        if (secretInput) secretInput.value = '';
        if (errorMsg) errorMsg.classList.add('hidden');

        // Re-render views immediately so all edit buttons appear
        if (state.activeView === 'blog') this.renderBlogView();
        if (state.activeView === 'community') this.renderCommunityView();

        alert('Đăng nhập Quản Trị Viên thành công! Toàn bộ quyền chỉnh sửa bài viết đã được kích hoạt.');
      } else {
        if (errorMsg) {
          errorMsg.classList.remove('hidden');
          if (errorText) errorText.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại!';
        }
        if (passInput) {
          passInput.focus();
          passInput.select();
        }
      }
    };

    document.getElementById('submit-admin-auth-btn')?.addEventListener('click', handleAdminAuthSubmit);
    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAdminAuthSubmit();
    });
    document.getElementById('admin-username-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const passInput = document.getElementById('admin-password-input');
        if (passInput && !passInput.value) {
          passInput.focus();
        } else {
          handleAdminAuthSubmit();
        }
      }
    });
    document.getElementById('admin-password-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdminAuthSubmit();
      }
    });
    document.getElementById('admin-secret-key-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdminAuthSubmit();
      }
    });

    // Toggle password visibility
    document.getElementById('admin-toggle-pwd-btn')?.addEventListener('click', () => {
      const passInput = document.getElementById('admin-password-input');
      const toggleBtn = document.getElementById('admin-toggle-pwd-btn');
      if (passInput) {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        if (toggleBtn) {
          toggleBtn.innerHTML = isPass ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
        }
      }
    });

    // Admin Community Post Save Button
    document.getElementById('save-admin-community-post-btn')?.addEventListener('click', () => {
      this.saveAdminCommunityPostFromModal();
    });

    // Admin Banner Edit Trigger (From banner bar & main header)
    document.getElementById('admin-banner-edit-trigger')?.addEventListener('click', () => {
      this.openAdminBannerModal();
    });

    document.getElementById('header-admin-banner-btn')?.addEventListener('click', () => {
      this.openAdminBannerModal();
    });

    document.getElementById('save-admin-banner-btn')?.addEventListener('click', () => {
      this.saveAdminBannerFromModal();
    });

    // Preset buttons in Admin Banner Modal
    document.getElementById('btn-banner-preset-verse')?.addEventListener('click', () => {
      const typeSelect = document.getElementById('admin-banner-type-select');
      const badgeInput = document.getElementById('admin-banner-badge-input');
      const textInput = document.getElementById('admin-banner-text-input');
      const btnInput = document.getElementById('admin-banner-btn-text-input');
      const themeSelect = document.getElementById('admin-banner-theme-select');
      const urlInput = document.getElementById('admin-banner-url-input');
      const marqueeCheck = document.getElementById('admin-banner-marquee-checkbox');

      if (typeSelect) typeSelect.value = 'verse';
      if (badgeInput) badgeInput.value = 'CÂU GỐC TUẦN';
      if (textInput) textInput.value = '"Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời." (Giăng 1:1)';
      if (btnInput) btnInput.value = 'Khám Phá Đối Chiếu';
      if (themeSelect) themeSelect.value = 'theme-gold';
      if (urlInput) urlInput.value = 'JHN.1.1';
      if (marqueeCheck) marqueeCheck.checked = false;
    });

    document.getElementById('btn-banner-preset-announcement')?.addEventListener('click', () => {
      const typeSelect = document.getElementById('admin-banner-type-select');
      const badgeInput = document.getElementById('admin-banner-badge-input');
      const textInput = document.getElementById('admin-banner-text-input');
      const btnInput = document.getElementById('admin-banner-btn-text-input');
      const themeSelect = document.getElementById('admin-banner-theme-select');
      const urlInput = document.getElementById('admin-banner-url-input');
      const marqueeCheck = document.getElementById('admin-banner-marquee-checkbox');

      if (typeSelect) typeSelect.value = 'announcement';
      if (badgeInput) badgeInput.value = 'THÔNG BÁO';
      if (textInput) textInput.value = '🔔 Chương trình Đọc Kinh Thánh Trọn Năm 2026 & Bồi Linh Hội Thánh đang diễn ra. Chúc quý con cái Chúa được tươi mới trong Lời Ngài!';
      if (btnInput) btnInput.value = 'Vào Cổng Tĩnh Nguyện';
      if (themeSelect) themeSelect.value = 'theme-crimson';
      if (urlInput) urlInput.value = '#portal';
      if (marqueeCheck) marqueeCheck.checked = true;
    });

    document.getElementById('btn-banner-preset-ad')?.addEventListener('click', () => {
      const typeSelect = document.getElementById('admin-banner-type-select');
      const badgeInput = document.getElementById('admin-banner-badge-input');
      const textInput = document.getElementById('admin-banner-text-input');
      const btnInput = document.getElementById('admin-banner-btn-text-input');
      const themeSelect = document.getElementById('admin-banner-theme-select');
      const urlInput = document.getElementById('admin-banner-url-input');
      const marqueeCheck = document.getElementById('admin-banner-marquee-checkbox');

      if (typeSelect) typeSelect.value = 'ad';
      if (badgeInput) badgeInput.value = 'TÀI TRỢ';
      if (textInput) textInput.value = 'Đồng hành dâng hiến cùng Logos MultiVerse duy trì máy chủ & phát triển bản dịch sắc tộc (VCB: 9368045059 - Y Simon Ktul).';
      if (btnInput) btnInput.value = 'Dâng Hiến Ngay';
      if (themeSelect) themeSelect.value = 'theme-navy';
      if (urlInput) urlInput.value = '#donate';
      if (marqueeCheck) marqueeCheck.checked = false;
    });

    document.getElementById('admin-banner-type-select')?.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'verse') {
        document.getElementById('btn-banner-preset-verse')?.click();
      } else if (val === 'announcement') {
        document.getElementById('btn-banner-preset-announcement')?.click();
      } else if (val === 'ad') {
        document.getElementById('btn-banner-preset-ad')?.click();
      }
    });

    // Admin Article Studio Events
    document.getElementById('save-admin-article-btn')?.addEventListener('click', () => {
      this.saveAdminArticleFromModal();
    });

    // Sample Image Selectors for Admin Article Studio
    document.querySelectorAll('.btn-sample-img').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        const imgInput = document.getElementById('admin-art-image');
        const imgPrevWrap = document.getElementById('admin-art-img-preview');
        const imgPrevTag = document.getElementById('admin-art-img-preview-tag');
        if (imgInput) imgInput.value = url;
        if (imgPrevTag) imgPrevTag.src = url;
        if (imgPrevWrap) imgPrevWrap.classList.remove('hidden');
      });
    });

    const artImgInput = document.getElementById('admin-art-image');
    if (artImgInput) {
      artImgInput.addEventListener('input', () => {
        const url = artImgInput.value.trim();
        const imgPrevWrap = document.getElementById('admin-art-img-preview');
        const imgPrevTag = document.getElementById('admin-art-img-preview-tag');
        if (url && imgPrevTag && imgPrevWrap) {
          imgPrevTag.src = url;
          imgPrevWrap.classList.remove('hidden');
        } else if (imgPrevWrap) {
          imgPrevWrap.classList.add('hidden');
        }
      });
    }

    // Admin Reader Analytics Intelligence Events
    document.getElementById('admin-analytics-btn')?.addEventListener('click', () => {
      this.openAdminAnalyticsModal();
    });

    document.getElementById('refresh-analytics-btn')?.addEventListener('click', () => {
      this.renderAnalyticsDashboard();
      alert('Đã làm mới số liệu phân tích độc giả mới nhất!');
    });

    // Testament tabs in Book Picker Modal
    document.querySelectorAll('.testament-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.testament-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const testament = tab.dataset.testament; // 'OT' or 'NT'
        this.populateBookPicker(testament);
        document.getElementById('books-grid')?.classList.remove('hidden');
        document.getElementById('chapters-grid')?.classList.add('hidden');
      });
    });

    // Modals open triggers
    document.getElementById('book-nav-trigger')?.addEventListener('click', () => {
      const currentBook = bibleEngine.getBookById(state.currentBook);
      const testament = currentBook ? currentBook.testament : 'OT';
      document.querySelectorAll('.testament-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.testament === testament);
      });
      this.populateBookPicker(testament);
      document.getElementById('books-grid')?.classList.remove('hidden');
      document.getElementById('chapters-grid')?.classList.add('hidden');
      document.getElementById('book-picker-modal')?.classList.remove('hidden');
    });

    document.getElementById('translations-modal-trigger')?.addEventListener('click', () => {
      this.populateVersionSelector('vi');
      document.getElementById('version-selector-modal')?.classList.remove('hidden');
    });

    // Version Category Tabs inside modal
    document.querySelectorAll('.version-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.populateVersionSelector(btn.dataset.vtab);
      });
    });

    // Version Quick Actions
    document.getElementById('quick-select-vi-btn')?.addEventListener('click', () => {
      state.setActiveVersions(['BTT', 'KTHD', 'BTHD', 'BDM']);
      this.populateVersionSelector('vi');
    });

    document.getElementById('quick-select-ethnic-btn')?.addEventListener('click', () => {
      const merged = Array.from(new Set([...state.activeVersions, 'EDE', 'JARAI', 'BRU', 'HMONG_W']));
      state.setActiveVersions(merged);
      this.populateVersionSelector('ethnic');
      bibleEngine.ensurePassageTranslations(state.currentBook, state.currentChapter, merged).then(() => {
        if (state.activeDrawerTab === 'parallel' && state.isDrawerOpen) {
          this.renderDrawerContent();
        }
      });
    });

    document.getElementById('quick-select-all-btn')?.addEventListener('click', () => {
      state.setActiveVersions(ALL_TRANSLATIONS.map(t => t.id));
      this.populateVersionSelector();
    });

    document.getElementById('quick-clear-btn')?.addEventListener('click', () => {
      state.setActiveVersions(['BTT']);
      this.populateVersionSelector();
    });

    // HTTLVN Search Modal Event Bindings
    document.getElementById('httlvn-search-submit-btn')?.addEventListener('click', () => {
      this.executeHTTLVNModalSearch('all');
    });

    document.getElementById('httlvn-search-query')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.executeHTTLVNModalSearch('all');
      }
    });

    document.getElementById('httlvn-filter-version')?.addEventListener('change', () => {
      this.executeHTTLVNModalSearch('all');
    });

    document.getElementById('httlvn-filter-scope')?.addEventListener('change', () => {
      this.executeHTTLVNModalSearch('all');
    });

    document.querySelectorAll('.httlvn-stats-tabs .stats-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.executeHTTLVNModalSearch(tab.dataset.filter);
      });
    });

    // Modals close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (modalId) document.getElementById(modalId)?.classList.add('hidden');
      });
    });

    document.getElementById('save-versions-btn')?.addEventListener('click', () => {
      document.getElementById('version-selector-modal')?.classList.add('hidden');
      this.updateActiveVersionsCount();
      bibleEngine.ensurePassageTranslations(state.currentBook, state.currentChapter, state.activeVersions).then(() => {
        if (state.activeDrawerTab === 'parallel' && state.isDrawerOpen) {
          this.renderDrawerContent();
        }
      });
      this.renderChapter(state.currentBook, state.currentChapter);
      if (state.isDrawerOpen) this.renderDrawerContent();
    });

    // Drawer inline version manage button
    document.getElementById('drawer-manage-versions-btn')?.addEventListener('click', () => {
      this.populateVersionSelector('vi');
      document.getElementById('version-selector-modal')?.classList.remove('hidden');
    });

    // Preview Modal close buttons
    document.getElementById('preview-close-btn')?.addEventListener('click', () => {
      document.getElementById('passage-preview-modal')?.classList.add('hidden');
    });

    // Nút mở Modal Chọn Bản Đọc Chính (Primary Reading Version)
    document.getElementById('primary-version-trigger')?.addEventListener('click', () => {
      this.populatePrimaryVersionSelector();
      document.getElementById('primary-version-modal')?.classList.remove('hidden');
    });

    // Cửa Sổ Đọc Độc Lập (Popout Reader Window Events)
    document.getElementById('popout-prev-chapter-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('popout-reader-modal');
      const bookId = modal.dataset.currentBook || state.currentBook;
      const ch = parseInt(modal.dataset.currentChapter || state.currentChapter, 10);
      const vId = modal.dataset.currentVersion || state.primaryVersion;
      if (ch > 1) {
        this.openPopoutReader(bookId, ch - 1, vId, 1);
      }
    });

    document.getElementById('popout-next-chapter-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('popout-reader-modal');
      const bookId = modal.dataset.currentBook || state.currentBook;
      const ch = parseInt(modal.dataset.currentChapter || state.currentChapter, 10);
      const vId = modal.dataset.currentVersion || state.primaryVersion;
      const book = bibleEngine.getBookById(bookId);
      const maxCh = book ? book.chapters_count : 150;
      if (ch < maxCh) {
        this.openPopoutReader(bookId, ch + 1, vId, 1);
      }
    });

    document.getElementById('popout-copy-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('popout-reader-modal');
      const bookId = modal.dataset.currentBook || state.currentBook;
      const ch = modal.dataset.currentChapter || state.currentChapter;
      const vId = modal.dataset.currentVersion || state.primaryVersion;
      const book = bibleEngine.getBookById(bookId) || { name_vi: bookId };
      const transObj = ALL_TRANSLATIONS.find(t => t.id === vId || t.code === vId);

      const items = document.querySelectorAll('#popout-reader-body .popout-verse-item');
      let textToCopy = `=== ${book.name_vi} ${ch} (${transObj ? transObj.name : vId}) ===\n\n`;
      items.forEach(it => {
        const num = it.querySelector('.popout-vnum')?.textContent.trim();
        const txt = it.querySelector('.popout-vtext')?.textContent.trim();
        if (num && txt) textToCopy += `${num}. ${txt}\n`;
      });
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert(`Đã sao chép toàn bộ phân đoạn ${book.name_vi} ${ch} (${transObj ? transObj.name : vId}) vào bộ nhớ tạm!`);
      }).catch(err => {
        console.warn('Copy failed:', err);
      });
    });

    document.getElementById('popout-open-tab-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('popout-reader-modal');
      const bookId = modal.dataset.currentBook || state.currentBook;
      const ch = modal.dataset.currentChapter || state.currentChapter;
      const vId = modal.dataset.currentVersion || state.primaryVersion;
      const book = bibleEngine.getBookById(bookId) || { name_vi: bookId };
      const transObj = ALL_TRANSLATIONS.find(t => t.id === vId || t.code === vId) || { name: vId, id: vId };

      const bodyHtml = document.getElementById('popout-reader-body')?.innerHTML || '';
      const w = window.open('', '_blank', 'width=900,height=800,scrollbars=yes,resizable=yes');
      if (w) {
        w.document.write(`
          <!DOCTYPE html>
          <html lang="vi" data-theme="${state.currentTheme}">
          <head>
            <meta charset="utf-8">
            <title>${book.name_vi} ${ch} - ${transObj.name}</title>
            <link rel="stylesheet" href="css/design-tokens.css">
            <link rel="stylesheet" href="css/components.css">
            <link rel="stylesheet" href="css/layout.css">
            <style>
              body { padding: 2.5rem 3rem; max-width: 860px; margin: 0 auto; background: var(--bg-deep, #0a0d14); color: var(--text-primary, #e6edf3); font-family: var(--font-body, system-ui); }
              .header { border-bottom: 2px solid var(--accent-gold, #d4af37); padding-bottom: 1.25rem; margin-bottom: 2rem; }
              .header h1 { font-family: var(--font-brand, Georgia); color: var(--accent-gold, #d4af37); margin: 0; font-size: 1.8rem; }
              .header p { color: var(--text-muted, #8b949e); margin-top: 0.5rem; font-size: 0.95rem; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${book.name_vi} - Đoạn ${ch}</h1>
              <p>Bản dịch: <b>${transObj.name} (${transObj.id})</b> • Logos MultiVerse Independent Window</p>
            </div>
            <div class="popout-verses-container">${bodyHtml}</div>
          </body>
          </html>
        `);
        w.document.close();
      }
    });

    // Đóng bất kỳ Modal nào khi nhấn phím Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
          modal.classList.add('hidden');
        });
      }
    });

    // Omni-Search Input & Dropdown (AI Suggestion, Full-Text Scripture, Coordinates & Metaphors)
    const searchInput = document.getElementById('omni-search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    if (searchInput && searchDropdown) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = searchInput.value.trim();
          if (q) {
            searchDropdown.classList.add('hidden');
            this.openHTTLVNSearchModal(q);
          }
        }
      });

      const renderDefaultSuggestions = () => {
        let html = `
          <div style="padding: 0.85rem 1rem 0.65rem 1rem; border-bottom: 1px solid var(--border-subtle); background: rgba(212, 175, 55, 0.04);">
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--accent-gold); letter-spacing: 0.06em; margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-compass"></i> GỢI Ý ĐỊA CHỈ & PHÂN ĐOẠN PHỔ BIẾN
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem;">
              <button type="button" class="quick-suggest-chip" data-book="JHN" data-ch="3" data-v="16" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 Giăng 3:16</button>
              <button type="button" class="quick-suggest-chip" data-book="PSA" data-ch="23" data-v="1" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 Thi Thiên 23</button>
              <button type="button" class="quick-suggest-chip" data-book="ROM" data-ch="8" data-v="28" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 Rô-ma 8:28</button>
              <button type="button" class="quick-suggest-chip" data-book="GEN" data-ch="1" data-v="1" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 Sáng Thế Ký 1:1</button>
              <button type="button" class="quick-suggest-chip" data-book="1CO" data-ch="13" data-v="4" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 1 Cô-rinh-tô 13</button>
              <button type="button" class="quick-suggest-chip" data-book="REV" data-ch="21" data-v="1" style="background: var(--bg-card); border: 1px solid var(--border-medium); border-radius: 12px; padding: 0.25rem 0.6rem; font-size: 0.76rem; color: var(--text-primary); cursor: pointer;">📍 Khải Huyền 21</button>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); line-height: 1.5;">
              💡 <em>Gõ tên sách (vd: Giăng), địa chỉ (vd: Giăng 3:16) hoặc từ khóa (vd: Yêu thương, Chiên con)...</em>
            </div>
          </div>
        `;
        searchDropdown.innerHTML = html;
        searchDropdown.classList.remove('hidden');

        searchDropdown.querySelectorAll('.quick-suggest-chip').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const b = btn.dataset.book;
            const c = parseInt(btn.dataset.ch, 10);
            const v = parseInt(btn.dataset.v, 10) || 1;
            this.navigateToPassage(b, c, v);
            searchDropdown.classList.add('hidden');
            searchInput.value = '';
          });
        });
      };

      searchInput.addEventListener('focus', () => {
        if (!searchInput.value.trim()) {
          renderDefaultSuggestions();
        }
      });

      searchInput.addEventListener('click', () => {
        if (!searchInput.value.trim()) {
          renderDefaultSuggestions();
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = searchInput.value.trim();
          if (q) {
            const results = bibleEngine.searchScripture(q, hermeneuticsEngine.metaphors);
            const coordItem = results.find(r => r.type === 'coordinate');
            if (coordItem) {
              searchDropdown.classList.add('hidden');
              this.navigateToPassage(coordItem.book_id, coordItem.chapter, coordItem.verse);
              searchInput.value = '';
              searchInput.blur();
              return;
            }
            searchDropdown.classList.add('hidden');
            this.openHTTLVNSearchModal(q);
          }
        }
      });

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (!query.trim()) {
          renderDefaultSuggestions();
          return;
        }

        const results = bibleEngine.searchScripture(query, hermeneuticsEngine.metaphors);

        if (results.length === 0) {
          searchDropdown.innerHTML = `
            <div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
              Không tìm thấy địa chỉ hoặc câu trực tiếp cho "<strong>${query}</strong>".<br>
              <button type="button" class="btn-primary" style="margin-top: 0.65rem; padding: 0.35rem 0.75rem; font-size: 0.78rem;" id="btn-fallback-httlvn">
                <i class="fa-solid fa-magnifying-glass"></i> Mở Tra Cứu Toàn Văn HTTLVN
              </button>
            </div>
          `;
          searchDropdown.classList.remove('hidden');
          searchDropdown.querySelector('#btn-fallback-httlvn')?.addEventListener('click', () => {
            searchDropdown.classList.add('hidden');
            this.openHTTLVNSearchModal(query.trim());
          });
          return;
        }

        let html = `
          <div class="search-item search-item-httlvn-action" data-type="open_httlvn_search" data-query="${encodeURIComponent(query)}" style="background: rgba(212, 175, 55, 0.08); border-bottom: 1px dashed var(--accent-gold-border);">
            <div class="search-item-header">
              <span class="search-item-badge" style="background: var(--accent-gold); color: #000; font-weight: 700;"><i class="fa-solid fa-magnifying-glass-location"></i> HTTLVN</span>
              <strong style="color: var(--accent-gold-light);">Tra cứu toàn văn chuẩn HTTLVN cho "${query}"</strong>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
              Nhấn <span style="background: rgba(0,0,0,0.4); padding: 1px 4px; border-radius: 3px; color: var(--accent-gold);">Enter</span> để tìm trên các bản dịch & tiếng sắc tộc.
            </div>
          </div>
        `;
        results.forEach(r => {
          if (r.type === 'coordinate') {
            html += `
              <div class="search-item search-item-coord" data-type="coordinate" data-book="${r.book_id}" data-ch="${r.chapter}" data-v="${r.verse}" style="background: rgba(212, 175, 55, 0.12); border-left: 3px solid var(--accent-gold);">
                <div class="search-item-header">
                  <span class="search-item-badge" style="background: var(--accent-gold); color: #000; font-weight: 700;">${r.badge}</span>
                  <strong class="verse-ref" style="color: var(--accent-gold-light); font-size: 0.95rem;">${r.title}</strong>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem;">${r.subtitle}</div>
              </div>
            `;
          } else if (r.type === 'ai_topic') {
            html += `
              <div class="search-item search-item-ai" data-type="ai_topic" data-topic-id="${r.id}">
                <div class="search-item-header">
                  <span class="search-item-badge ai-badge">${r.badge}</span>
                  <strong class="ai-topic-title">${r.title}</strong>
                  <span class="ai-topic-category">${r.category}</span>
                </div>
                <div class="ai-topic-insight">
                  <span class="ai-sparkle">💡 Gợi ý AI:</span> ${r.ai_insight}
                </div>
                <div class="ai-topic-passages">
                  <span class="ai-passages-label">Địa chỉ Kinh Thánh liên quan (nhấp để đọc ngay):</span>
                  <div class="ai-passage-chips">
                    ${r.passages.map(p => `
                      <button type="button" class="ai-passage-chip" data-book="${p.book_id}" data-ch="${p.chapter}" data-v="${p.verse}" title="${p.snippet}">
                        📍 ${p.ref}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `;
          } else if (r.type === 'verse') {
            html += `
              <div class="search-item search-item-verse" data-type="verse" data-book="${r.book_id}" data-ch="${r.chapter}" data-v="${r.verse}">
                <div class="search-item-header">
                  <span class="search-item-badge verse-badge">${r.badge}</span>
                  <strong class="verse-ref">${r.title}</strong>
                </div>
                <div class="verse-snippet">${r.subtitle}</div>
              </div>
            `;
          } else if (r.type === 'ask_ai') {
            html += `
              <div class="search-item search-item-copilot" data-type="ask_ai" data-query="${encodeURIComponent(r.query)}">
                <div class="search-item-header">
                  <span class="search-item-badge ai-badge">${r.badge}</span>
                  <strong class="copilot-title">${r.title}</strong>
                </div>
                <div class="copilot-subtitle">${r.subtitle}</div>
              </div>
            `;
          } else {
            html += `
              <div class="search-item" data-type="${r.type}" data-book="${r.book_id || ''}" data-ch="${r.chapter || ''}" data-v="${r.verse || ''}" data-metaphor="${r.metaphor_id || ''}">
                <div class="search-item-header">
                  <span class="search-item-badge">${r.badge}</span>
                  <strong>${r.title}</strong>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${r.subtitle}</div>
              </div>
            `;
          }
        });
        searchDropdown.innerHTML = html;
        searchDropdown.classList.remove('hidden');

        // Gắn sự kiện click cho các chip câu Kinh Thánh trong thẻ AI
        searchDropdown.querySelectorAll('.ai-passage-chip').forEach(chip => {
          chip.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const b = chip.dataset.book;
            const c = parseInt(chip.dataset.ch, 10);
            const v = parseInt(chip.dataset.v, 10) || 1;
            this.navigateToPassage(b, c, v);
            searchDropdown.classList.add('hidden');
            searchInput.value = '';
          });
        });

        // Gắn sự kiện click cho từng mục trong search-item
        searchDropdown.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            const type = item.dataset.type;
            if (type === 'open_httlvn_search') {
              const q = decodeURIComponent(item.dataset.query || '');
              searchDropdown.classList.add('hidden');
              this.openHTTLVNSearchModal(q);
            } else if (type === 'coordinate' || type === 'book' || type === 'verse') {
              const b = item.dataset.book;
              const c = parseInt(item.dataset.ch, 10) || 1;
              const v = parseInt(item.dataset.v, 10) || 1;
              this.navigateToPassage(b, c, v);
            } else if (type === 'ai_topic') {
              const firstChip = item.querySelector('.ai-passage-chip');
              if (firstChip) {
                const b = firstChip.dataset.book;
                const c = parseInt(firstChip.dataset.ch, 10);
                const v = parseInt(firstChip.dataset.v, 10) || 1;
                this.navigateToPassage(b, c, v);
              }
            } else if (type === 'metaphor') {
              state.setDrawerTab('metaphors');
              state.setDrawerOpen(true);
              const m = hermeneuticsEngine.getMetaphorById(item.dataset.metaphor);
              if (m) {
                const drawerBody = document.getElementById('drawer-body');
                if (drawerBody) drawerBody.innerHTML = hermeneuticsEngine.renderMetaphorCard(m);
              }
            } else if (type === 'ask_ai') {
              const rawQuery = decodeURIComponent(item.dataset.query || '');
              this.askAIAboutTopic(rawQuery);
            }
            searchDropdown.classList.add('hidden');
            searchInput.value = '';
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.add('hidden');
        }
      });
    }
  }

  // Navigate directly to passage and optionally scroll to verse
  navigateToPassage(bookId, chapterNum, verseNum = 1) {
    state.setPassage(bookId, chapterNum, verseNum);
    state.setActiveView('bible');
    const reader = document.getElementById('focus-reader');
    if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      state.selectVerse(verseNum, true);
      const verseEl = document.querySelector(`.verse-item[data-verse="${verseNum}"]`);
      if (verseEl) {
        verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.renderDrawerContent();
    }, 250);
  }

  // Open Floating AI Copilot Widget (Kimchi-Grade)
  openFloatingAI(query = null) {
    const widget = document.getElementById('floating-ai-widget');
    const input = document.getElementById('floating-ai-input');
    const messagesContainer = document.getElementById('floating-ai-messages');
    if (!widget) return;

    widget.classList.remove('hidden');
    this.updateFloatingAIChips();
    this.updateFloatingAIModelBadge();
    this.updateFloatingAIRolePills();

    if (messagesContainer && messagesContainer.children.length === 0) {
      const currentBookObj = bibleEngine.getBookById(state.currentBook);
      const bookNameVi = currentBookObj ? currentBookObj.name_vi : state.currentBook;
      this.addFloatingAIMessage('assistant', `
        Chào bạn! Tôi là <strong>Trợ Lý Thần Học Berea AI (Kimchi-Grade Long Context)</strong>.<br>
        Tôi có thể nạp toàn bộ chương <strong>${bookNameVi} đoạn ${state.currentChapter}</strong>, đối chiếu ma trận bản dịch song song (BTT, KJV, ESV, CGKPV, Ê-đê, Gia-rai, Ba-na...), phân tích TSK, tra cứu không gian mạng và phân tích thần học. Hãy đặt câu hỏi hoặc chọn các thẻ gợi ý bên dưới!
      `);
    }

    if (query) {
      if (input) input.value = query;
      const sendBtn = document.getElementById('floating-ai-send-btn');
      sendBtn?.click();
    } else {
      input?.focus();
    }
  }

  toggleFloatingAI() {
    const widget = document.getElementById('floating-ai-widget');
    if (!widget) return;
    if (widget.classList.contains('hidden')) {
      this.openFloatingAI();
    } else {
      widget.classList.add('hidden');
    }
  }

  // Ask AI Copilot anywhere
  askAIAboutTopic(topicQuery) {
    this.openFloatingAI(`Tìm các câu Kinh Thánh và giải nghĩa thần học về: "${topicQuery}"`);
  }

  // Floating AI Copilot FAB & Pop-up Widget
  initFloatingAI() {
    const fabBtn = document.getElementById('floating-ai-fab');
    const widget = document.getElementById('floating-ai-widget');
    const closeBtn = document.getElementById('floating-ai-close-btn');
    const dockBtn = document.getElementById('floating-dock-btn');
    const webToggleBtn = document.getElementById('floating-web-toggle-btn');
    const sendBtn = document.getElementById('floating-ai-send-btn');
    const input = document.getElementById('floating-ai-input');
    const messagesContainer = document.getElementById('floating-ai-messages');
    const topNavAiBtn = document.getElementById('top-nav-ai-btn');
    const headerAiBtn = document.getElementById('header-ai-trigger-btn');

    if (!fabBtn || !widget) return;

    // Toggle widget open/close
    fabBtn.addEventListener('click', () => {
      this.toggleFloatingAI();
    });

    topNavAiBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openFloatingAI();
    });

    headerAiBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openFloatingAI();
    });

    closeBtn?.addEventListener('click', () => {
      widget.classList.add('hidden');
    });

    // Dock to Drawer Inspector
    dockBtn?.addEventListener('click', () => {
      widget.classList.add('hidden');
      state.setDrawerTab('ai');
      state.setDrawerOpen(true);
    });

    // Web Search Toggle
    webToggleBtn?.addEventListener('click', () => {
      const current = aiAssistant.getWebSearchEnabled();
      aiAssistant.setWebSearchEnabled(!current);
      const isNow = aiAssistant.getWebSearchEnabled();
      webToggleBtn.classList.toggle('active', isNow);
      const textSpan = webToggleBtn.querySelector('.ctrl-btn-text');
      if (textSpan) textSpan.textContent = isNow ? 'Web: BẬT' : 'Web: TẮT';
      const statusLabel = document.getElementById('floating-ai-status-label');
      if (statusLabel) {
        statusLabel.textContent = isNow ? 'Trực tuyến • Không gian mạng' : 'Chế độ Nội bộ • Kinh Thánh';
      }
    });

    // Send query
    const executeFloatingQuery = async () => {
      const q = (input.value || '').trim();
      if (!q) return;

      this.addFloatingAIMessage('user', q);
      input.value = '';

      // Add loading indicator with live web search text
      const isWeb = aiAssistant.getWebSearchEnabled();
      const loadingEl = this.addFloatingAIMessage('assistant', `
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-gold);">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span>${isWeb ? 'Đang tra cứu Thần học & quét dữ liệu không gian mạng...' : 'Đang phân tích thần học & nguyên văn Kinh Thánh...'}</span>
        </div>
      `);

      const currentBookObj = bibleEngine.getBookById(state.currentBook);
      const bookNameVi = currentBookObj ? currentBookObj.name_vi : state.currentBook;
      const refStr = `${bookNameVi} ${state.currentChapter}:${state.currentVerse || 1}`;
      const verseKey = `${state.currentBook}.${state.currentChapter}.${state.currentVerse || 1}`;
      const crossRefs = crossRefEngine.getCrossReferences(verseKey);
      const genreKey = currentBookObj?.genre || 'gospel';
      const genreGuide = hermeneuticsEngine?.getGenreGuide ? hermeneuticsEngine.getGenreGuide(genreKey) : (hermeneuticsEngine?.genreGuides?.[genreKey] || null);

      try {
        const responseText = await aiAssistant.ask(q, {
          ref: refStr,
          book: bookNameVi,
          bookId: state.currentBook,
          chapter: state.currentChapter,
          verse: state.currentVerse || 1,
          passageData: this.currentPassageData,
          activeVersions: state.activeVersions,
          crossReferences: crossRefs,
          genreGuide: genreGuide
        });

        loadingEl.innerHTML = responseText;
        this.bindCopilotActionButtons(loadingEl);
      } catch (err) {
        loadingEl.innerHTML = `<span style="color: var(--status-danger);">Lỗi: ${err.message}</span>`;
      }

      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    };

    // Deep Research Mode Button
    const deepBtn = document.getElementById('floating-deep-research-btn');
    if (deepBtn) {
      const isDeepInit = aiAssistant.getDeepResearchEnabled();
      deepBtn.classList.toggle('active', isDeepInit);
      const textSpan = deepBtn.querySelector('.ctrl-btn-text');
      if (textSpan) textSpan.textContent = isDeepInit ? 'Deep: BẬT' : 'Deep: TẮT';

      deepBtn.addEventListener('click', () => {
        const cur = aiAssistant.getDeepResearchEnabled();
        aiAssistant.setDeepResearchEnabled(!cur);
        const isNow = aiAssistant.getDeepResearchEnabled();
        deepBtn.classList.toggle('active', isNow);
        if (textSpan) textSpan.textContent = isNow ? 'Deep: BẬT' : 'Deep: TẮT';
        const drawerDeepBtn = document.getElementById('ai-deep-research-toggle-btn');
        if (drawerDeepBtn) {
          drawerDeepBtn.classList.toggle('active', isNow);
          drawerDeepBtn.innerHTML = `<i class="fa-solid fa-dna"></i> ${isNow ? 'Deep: BẬT' : 'Deep: TẮT'}`;
        }
      });
    }

    // Clear Conversation History Button
    const clearHistoryBtn = document.getElementById('floating-clear-history-btn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => {
        aiAssistant.clearConversationHistory();
        if (messagesContainer) {
          messagesContainer.innerHTML = `
            <div class="floating-ai-msg assistant animate-fade-in">
              <div class="fab-avatar"><i class="fa-solid fa-dove"></i></div>
              <div class="fab-bubble">Đã làm mới dòng bộ nhớ hội thoại Kimchi Stream. Sẵn sàng hỗ trợ bạn!</div>
            </div>
          `;
        }
        const drawerMsgs = document.getElementById('ai-messages-list');
        if (drawerMsgs) {
          drawerMsgs.innerHTML = `
            <div class="ai-message assistant">
              <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
              <div>Đã làm mới dòng bộ nhớ hội thoại Kimchi Stream. Sẵn sàng tiếp nhận câu hỏi mới!</div>
            </div>
          `;
        }
      });
    }

    // Settings Modal Trigger
    const settingsBtn = document.getElementById('floating-ai-settings-btn');
    settingsBtn?.addEventListener('click', () => {
      this.openAISettingsModal();
    });

    // Initialize Model Badge & Role Pills
    this.updateFloatingAIModelBadge();
    this.updateFloatingAIRolePills();

    // Role Buttons Selection
    widget.querySelectorAll('.fab-role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        aiAssistant.setRole(role);
        this.updateFloatingAIRolePills();
        document.querySelectorAll('#drawer-inspector .fab-role-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.role === role);
        });
      });
    });

    sendBtn?.addEventListener('click', () => executeFloatingQuery());
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        executeFloatingQuery();
      }
    });
  }

  // Update Active AI Model Badge
  updateFloatingAIModelBadge() {
    const badge = document.getElementById('floating-ai-model-badge');
    if (!badge) return;
    const pInfo = aiAssistant.getActiveProviderInfo();
    badge.innerHTML = `<i class="fa-solid fa-microchip"></i> ${pInfo.badge}`;
  }

  // Update Active Role Pills styling
  updateFloatingAIRolePills() {
    const currentRole = aiAssistant.getRole();
    document.querySelectorAll('.fab-role-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === currentRole);
    });
  }

  // Open AI Multi-Model Configuration Modal (Kimchi-Style)
  openAISettingsModal() {
    const modal = document.getElementById('ai-settings-modal');
    if (!modal) return;

    const providerSelect = document.getElementById('ai-provider-select');
    const roleSelect = document.getElementById('ai-default-role-select');

    if (providerSelect) providerSelect.value = aiAssistant.getProvider();
    if (roleSelect) roleSelect.value = aiAssistant.getRole();

    providerSelect?.dispatchEvent(new Event('change'));
    modal.classList.remove('hidden');
  }

  // Initialize AI Multi-Model Configuration Modal Listeners
  initAISettingsModal() {
    const modal = document.getElementById('ai-settings-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('ai-settings-close-btn');
    const cancelBtn = document.getElementById('ai-settings-cancel-btn');
    const saveBtn = document.getElementById('ai-settings-save-btn');
    const providerSelect = document.getElementById('ai-provider-select');
    const modelSelect = document.getElementById('ai-model-select');
    const apiKeyGroup = document.getElementById('ai-api-key-group');
    const apiKeyInput = document.getElementById('ai-api-key-input');
    const apiKeyLabel = document.getElementById('ai-api-key-label');
    const apiKeyHelpLink = document.getElementById('ai-api-key-help-link');
    const toggleKeyVisibilityBtn = document.getElementById('ai-toggle-key-visibility-btn');
    const ollamaGroup = document.getElementById('ai-ollama-group');
    const ollamaEndpointInput = document.getElementById('ai-ollama-endpoint-input');
    const roleSelect = document.getElementById('ai-default-role-select');
    const testBtn = document.getElementById('ai-test-connection-btn');
    const testStatus = document.getElementById('ai-test-status');

    const updateProviderFields = () => {
      const provId = providerSelect.value;
      const providers = aiAssistant.getProvidersList();
      const p = providers.find(x => x.id === provId);

      // Populate models
      if (modelSelect) {
        modelSelect.innerHTML = (p?.models || []).map(m => `
          <option value="${m.id}">${m.name}</option>
        `).join('');
        modelSelect.value = aiAssistant.getModel(provId);
      }

      if (provId === 'berea-offline') {
        apiKeyGroup?.classList.add('hidden');
        ollamaGroup?.classList.add('hidden');
      } else if (provId === 'ollama') {
        apiKeyGroup?.classList.add('hidden');
        ollamaGroup?.classList.remove('hidden');
        if (ollamaEndpointInput) ollamaEndpointInput.value = aiAssistant.getOllamaEndpoint();
      } else {
        apiKeyGroup?.classList.remove('hidden');
        ollamaGroup?.classList.add('hidden');
        if (apiKeyInput) apiKeyInput.value = aiAssistant.getApiKey(provId);

        if (provId === 'gemini') {
          if (apiKeyLabel) apiKeyLabel.textContent = 'Google Gemini API Key';
          if (apiKeyHelpLink) {
            apiKeyHelpLink.href = 'https://aistudio.google.com/app/apikey';
            apiKeyHelpLink.textContent = 'Lấy Gemini API Key miễn phí (Google AI Studio)';
          }
        } else if (provId === 'deepseek') {
          if (apiKeyLabel) apiKeyLabel.textContent = 'DeepSeek API Key';
          if (apiKeyHelpLink) {
            apiKeyHelpLink.href = 'https://platform.deepseek.com/';
            apiKeyHelpLink.textContent = 'Lấy DeepSeek API Key';
          }
        } else {
          if (apiKeyLabel) apiKeyLabel.textContent = 'OpenAI API Key';
          if (apiKeyHelpLink) {
            apiKeyHelpLink.href = 'https://platform.openai.com/api-keys';
            apiKeyHelpLink.textContent = 'Lấy OpenAI API Key';
          }
        }
      }
      if (testStatus) testStatus.style.display = 'none';
    };

    providerSelect?.addEventListener('change', updateProviderFields);

    toggleKeyVisibilityBtn?.addEventListener('click', () => {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleKeyVisibilityBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else {
        apiKeyInput.type = 'password';
        toggleKeyVisibilityBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });

    testBtn?.addEventListener('click', async () => {
      if (!testStatus) return;
      testStatus.style.display = 'block';
      testStatus.style.background = 'rgba(88, 166, 255, 0.1)';
      testStatus.style.border = '1px solid #58a6ff';
      testStatus.style.color = '#58a6ff';
      testStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang kiểm tra kết nối với mô hình...';

      const provId = providerSelect.value;
      const keyVal = (apiKeyInput?.value || '').trim();

      try {
        if (provId === 'berea-offline') {
          testStatus.style.background = 'rgba(46, 160, 67, 0.15)';
          testStatus.style.border = '1px solid #2ea043';
          testStatus.style.color = '#3fb950';
          testStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Berea Autonomous Core (Offline RAG) luôn sẵn sàng 100%! Không cần kết nối internet.';
          return;
        }

        if (provId === 'gemini') {
          if (!keyVal) throw new Error('Vui lòng nhập Gemini API Key trước khi kiểm tra.');
          const mod = modelSelect?.value || 'gemini-2.0-flash';
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${keyVal}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Ping: Berea AI' }] }] })
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error?.message || `Lỗi phản hồi (${res.status})`);
          }
        } else if (provId === 'openai') {
          if (!keyVal) throw new Error('Vui lòng nhập OpenAI API Key trước khi kiểm tra.');
          const res = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${keyVal}` }
          });
          if (!res.ok) throw new Error('OpenAI API Key không hợp lệ.');
        } else if (provId === 'deepseek') {
          if (!keyVal) throw new Error('Vui lòng nhập DeepSeek API Key trước khi kiểm tra.');
          const res = await fetch('https://api.deepseek.com/models', {
            headers: { 'Authorization': `Bearer ${keyVal}` }
          });
          if (!res.ok) throw new Error('DeepSeek API Key không hợp lệ.');
        } else if (provId === 'ollama') {
          const endpoint = (ollamaEndpointInput?.value || 'http://localhost:11434').replace(/\/$/, '');
          const res = await fetch(`${endpoint}/api/tags`);
          if (!res.ok) throw new Error(`Không thể kết nối với Ollama tại ${endpoint}.`);
        }

        testStatus.style.background = 'rgba(46, 160, 67, 0.15)';
        testStatus.style.border = '1px solid #2ea043';
        testStatus.style.color = '#3fb950';
        testStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Kết nối thành công! Mô hình đã sẵn sàng hoạt động.';
      } catch (err) {
        testStatus.style.background = 'rgba(248, 81, 73, 0.15)';
        testStatus.style.border = '1px solid #f85149';
        testStatus.style.color = '#f85149';
        testStatus.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${err.message}`;
      }
    });

    saveBtn?.addEventListener('click', () => {
      const provId = providerSelect?.value || 'berea-offline';
      const modelId = modelSelect?.value || 'berea-v2';
      const keyVal = (apiKeyInput?.value || '').trim();
      const roleId = roleSelect?.value || 'copilot';
      const ollamaEndpoint = (ollamaEndpointInput?.value || 'http://localhost:11434').trim();

      aiAssistant.setProvider(provId);
      aiAssistant.setModel(provId, modelId);
      aiAssistant.setApiKey(keyVal, provId);
      aiAssistant.setRole(roleId);
      aiAssistant.setOllamaEndpoint(ollamaEndpoint);

      this.updateFloatingAIModelBadge();
      this.updateFloatingAIRolePills();
      this.renderDrawerContent();

      modal.classList.add('hidden');
    });

    closeBtn?.addEventListener('click', () => modal.classList.add('hidden'));
    cancelBtn?.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Bind interactive Copilot Action Buttons inside chat bubbles
  bindCopilotActionButtons(container) {
    if (!container) return;
    container.querySelectorAll('.copilot-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        const book = btn.dataset.book;
        const chapter = parseInt(btn.dataset.chapter, 10);
        const query = btn.dataset.query;

        if (action === 'navigate' && book) {
          state.setPassage(book, chapter || 1);
        } else if (action === 'compare') {
          if (book) {
            state.setPassage(book, chapter || 1);
          }
          state.setDrawerTab('parallel');
          state.setDrawerOpen(true);
        } else if (action === 'search' && query) {
          const searchInput = document.getElementById('omni-search-input');
          if (searchInput) {
            searchInput.value = query;
            searchInput.focus();
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      });
    });
  }

  addFloatingAIMessage(sender, htmlContent) {
    const container = document.getElementById('floating-ai-messages');
    if (!container) return null;

    const msg = document.createElement('div');
    msg.className = `floating-ai-msg ${sender}`;

    const icon = sender === 'assistant'
      ? `<div class="fab-avatar" style="width: 26px; height: 26px; font-size: 0.75rem;"><i class="fa-solid fa-robot"></i></div>`
      : `<div class="fab-avatar" style="width: 26px; height: 26px; font-size: 0.75rem; background: rgba(255,255,255,0.1); border-color: var(--border-medium); color: #fff;"><i class="fa-solid fa-user"></i></div>`;

    const bubble = document.createElement('div');
    bubble.className = 'floating-ai-msg-bubble';
    bubble.innerHTML = htmlContent;

    msg.innerHTML = icon;
    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  updateFloatingAIChips() {
    const chipsBar = document.getElementById('floating-ai-chips-bar');
    if (!chipsBar) return;

    const currentBookObj = bibleEngine.getBookById(state.currentBook);
    const bookNameVi = currentBookObj ? currentBookObj.name_vi : state.currentBook;
    const refStr = `${bookNameVi} ${state.currentChapter}:${state.currentVerse || 1}`;

    const prompts = aiAssistant.getSuggestedPrompts(refStr, currentBookObj);
    chipsBar.innerHTML = prompts.map(p => `
      <button class="fab-chip" data-prompt="${p}">${p}</button>
    `).join('');

    chipsBar.querySelectorAll('.fab-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('floating-ai-input');
        if (input) {
          input.value = btn.dataset.prompt;
          const sendBtn = document.getElementById('floating-ai-send-btn');
          sendBtn?.click();
        }
      });
    });
  }

  // 11.8 Quản lý Bảng Màu Sắc & Cỡ Chữ (Theme Palette & Typography Studio)
  openThemeSelectorModal() {
    this.populateThemeSelectorModal();
    const modal = document.getElementById('theme-selector-modal');
    modal?.classList.remove('hidden');
  }

  populateThemeSelectorModal() {
    const grid = document.getElementById('themes-grid');
    if (!grid) return;

    grid.innerHTML = THEMES_LIST.map(theme => {
      const isActive = state.currentTheme === theme.id;
      return `
        <div class="theme-card ${isActive ? 'active' : ''}" data-theme-id="${theme.id}">
          <div class="theme-card-header">
            <div class="theme-card-title">
              <i class="fa-solid ${theme.icon}" style="color: ${theme.palette[3]};"></i>
              <span>${theme.name}</span>
            </div>
            <span class="theme-active-badge"><i class="fa-solid fa-check"></i> Đang dùng</span>
          </div>

          <div class="theme-swatches-row">
            <div class="theme-swatch-circle" style="background: ${theme.palette[0]};" title="Màu nền chính"></div>
            <div class="theme-swatch-circle" style="background: ${theme.palette[1]};" title="Màu bề mặt"></div>
            <div class="theme-swatch-circle" style="background: ${theme.palette[2]};" title="Màu chữ"></div>
            <div class="theme-swatch-circle" style="background: ${theme.palette[3]};" title="Màu điểm nhấn"></div>
          </div>

          <div class="theme-preview-strip" style="background: ${theme.previewCard}; color: ${theme.previewText}; border-color: ${theme.previewAccent};">
            <span style="color: ${theme.previewAccent}; font-weight: 700; margin-right: 4px;">1</span> Ban đầu có Ngôi Lời...
          </div>

          <div class="theme-desc">${theme.subtitle}</div>
        </div>
      `;
    }).join('');

    // Gắn sự kiện chuyển đổi màu sắc 1-chạm
    grid.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.dataset.themeId;
        state.setTheme(themeId);
      });
    });

    this.updateFontSizeUI(state.currentFontSize);
  }

  initThemeSelectorModal() {
    const fontOptions = document.getElementById('font-size-options');
    if (!fontOptions) return;

    fontOptions.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        state.setFontSize(size);
      });
    });
  }

  updateThemeUI(themeId) {
    const themeObj = THEMES_LIST.find(t => t.id === themeId) || THEMES_LIST[0];

    // Cập nhật nhãn màu trên thanh Header
    const label = document.getElementById('current-theme-label');
    if (label && themeObj) {
      label.textContent = themeObj.name.split(' ')[0];
    }

    // Làm nổi bật thẻ đang chọn trong modal
    document.querySelectorAll('#themes-grid .theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.themeId === themeId);
    });

    // Cập nhật dòng trạng thái trên Menu Mobile
    const mobileText = document.getElementById('mobile-theme-status-text');
    if (mobileText && themeObj) {
      mobileText.textContent = `Giao Diện: ${themeObj.name}`;
    }
  }

  updateFontSizeUI(fontSize = 'medium') {
    document.querySelectorAll('#font-size-options .font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === fontSize);
    });
  }

  // 12. Triển khai Hệ Thống Điều Hướng & Đối Chiếu Di Động (Mobile Responsive UX)
  initMobileResponsiveUX() {
    const btnRead = document.getElementById('btn-mobile-read');
    const btnParallel = document.getElementById('btn-mobile-parallel');
    const btnTsk = document.getElementById('btn-mobile-tsk');
    const btnBooks = document.getElementById('btn-mobile-books');
    const btnSearch = document.getElementById('btn-mobile-search');
    const btnDonate = document.getElementById('btn-mobile-donate');
    const btnMenu = document.getElementById('btn-mobile-menu');
    const drawer = document.getElementById('drawer-inspector');
    const dragHandle = document.getElementById('bottom-sheet-drag-handle');
    const mobileMenuModal = document.getElementById('mobile-menu-modal');

    const headerCompareBtn = document.getElementById('mobile-header-compare-btn');
    const headerTskBtn = document.getElementById('mobile-header-tsk-btn');

    // Nút mở Tab Riêng "KT Đối Chiếu" trên Header & Bottom Nav Mobile
    headerTskBtn?.addEventListener('click', () => {
      if (state.activeView === 'tsk') {
        state.setActiveView('bible');
      } else {
        state.setActiveView('tsk');
      }
    });

    btnTsk?.addEventListener('click', () => {
      state.setActiveView('tsk');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnDonate?.addEventListener('click', () => {
      state.setActiveView('donate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Nút Bật/Tắt Chế Độ Đối Chiếu Chia Đôi Màn Hình 50/50 (Trên / Dưới) trên Header Mobile
    headerCompareBtn?.addEventListener('click', () => {
      if (state.activeView !== 'bible') {
        state.setActiveView('bible');
      }
      if (typeof window !== 'undefined' && window.innerWidth <= 991) {
        if (state.isDrawerOpen) {
          state.setDrawerOpen(false);
        } else {
          state.setReadingMode('standard');
          state.setDrawerTab('parallel');
          state.selectVerse(state.currentVerse || 1, true);
        }
      } else {
        state.toggleReadingMode();
      }
    });

    // Nút 1: Đọc Kinh Thánh (Chế độ đọc chuẩn)
    btnRead?.addEventListener('click', () => {
      state.setActiveView('bible');
      state.setReadingMode('standard');
      drawer?.classList.remove('expanded');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Nút 2: Mở Chế Độ Đối Chiếu Đa Bản Dịch Trực Tiếp hoặc Mở Bảng Đối Chiếu Bottom Sheet
    btnParallel?.addEventListener('click', () => {
      if (state.readingMode !== 'parallel') {
        state.setReadingMode('parallel');
      } else {
        // Nếu đã ở chế độ đối chiếu, chuyển đổi mở/đóng Bottom Sheet
        if (state.isDrawerOpen && state.activeDrawerTab === 'parallel') {
          state.setDrawerOpen(false);
        } else {
          state.setDrawerTab('parallel');
          state.setDrawerOpen(true);
        }
      }
    });

    // Nút 3: Chọn Sách & Chương Nhanh
    btnBooks?.addEventListener('click', () => {
      this.populateBookPicker();
      document.getElementById('book-picker-modal')?.classList.remove('hidden');
    });

    // Nút 4: Tìm Kiếm Nhanh
    btnSearch?.addEventListener('click', () => {
      const searchInput = document.getElementById('omni-search-input');
      if (searchInput) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchInput.focus();
        searchInput.select();
      }
    });

    // Nút 5: Menu Khám Phá
    btnMenu?.addEventListener('click', () => {
      if (mobileMenuModal) {
        // Cập nhật trạng thái Quản trị viên trên menu
        const statusText = document.getElementById('mobile-admin-status-text');
        if (statusText) {
          statusText.textContent = state.currentUserRole === 'admin' 
            ? 'Quản Trị Viên (Đang Đăng Nhập)' 
            : 'Đăng Nhập Quản Trị';
        }
        mobileMenuModal.classList.remove('hidden');
      }
    });

    // Thanh Kéo Bottom Sheet (Drag Handle Gestures & Tap)
    if (dragHandle && drawer) {
      // Chạm vào thanh kéo để chuyển đổi độ cao 56vh <-> 82vh (Mở rộng để tra cứu nhiều bản dịch)
      dragHandle.addEventListener('click', () => {
        drawer.classList.toggle('expanded');
      });

      // Vuốt xuống để đóng Bottom Sheet
      let touchStartY = 0;
      dragHandle.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      dragHandle.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        if (deltaY > 50) {
          // Vuốt xuống quá 50px -> Đóng Drawer
          state.setDrawerOpen(false);
          drawer.classList.remove('expanded');
        } else if (deltaY < -40) {
          // Vuốt lên quá 40px -> Mở rộng toàn màn hình
          drawer.classList.add('expanded');
        }
      }, { passive: true });
    }

    // Xử lý các nút trong Menu Khám Phá Mobile
    if (mobileMenuModal) {
      mobileMenuModal.querySelectorAll('.mobile-menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetNav = btn.dataset.nav;
          mobileMenuModal.classList.add('hidden');
          if (targetNav === 'bible' || targetNav === 'tsk' || targetNav === 'blog' || targetNav === 'community' || targetNav === 'media' || targetNav === 'donate') {
            state.setActiveView(targetNav);
          } else if (targetNav === 'versions') {
            this.populateVersionSelector('vi');
            document.getElementById('version-selector-modal')?.classList.remove('hidden');
          }
        });
      });

      // Nút Chọn Nhanh 66 Sách trong Lưới Menu Mobile
      document.getElementById('mobile-menu-books-shortcut-btn')?.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
        this.populateBookPicker();
        document.getElementById('book-picker-modal')?.classList.remove('hidden');
      });

      // Nút Theme trong Menu Mobile
      document.getElementById('mobile-menu-theme-btn')?.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
        this.openThemeSelectorModal();
      });

      // Nút Chọn Sách trong Menu Mobile
      document.getElementById('mobile-menu-books-btn')?.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
        this.populateBookPicker();
        document.getElementById('book-picker-modal')?.classList.remove('hidden');
      });

      // Nút Quản Trị trong Menu Mobile
      document.getElementById('mobile-menu-admin-btn')?.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
        if (state.currentUserRole === 'admin') {
          if (confirm('Bạn đang ở quyền Quản Trị Viên. Bạn có muốn đăng xuất về quyền Khách không?')) {
            state.logoutAdmin();
          }
        } else {
          this.openAdminAuthModal();
        }
      });
    }
  }

  // Cập nhật giao diện khi chuyển đổi chế độ đọc (Đọc Thường <-> Đọc Đối Chiếu)
  updateReadingModeUI(mode) {
    const isParallel = mode === 'parallel';
    const headerBtn = document.getElementById('mobile-header-compare-btn');
    const headerLabel = document.getElementById('mobile-header-compare-label');
    if (headerBtn) {
      headerBtn.classList.toggle('active', isParallel);
      const icon = headerBtn.querySelector('i');
      if (icon) {
        icon.className = isParallel ? 'fa-solid fa-book-open' : 'fa-solid fa-columns';
      }
    }
    if (headerLabel) {
      headerLabel.textContent = isParallel ? 'Đọc Thường' : 'Đối Chiếu';
    }

    const mobileReadBtn = document.getElementById('btn-mobile-read');
    const mobileParallelBtn = document.getElementById('btn-mobile-parallel');
    if (mobileReadBtn) mobileReadBtn.classList.toggle('active', !isParallel && state.activeView === 'bible');
    if (mobileParallelBtn) mobileParallelBtn.classList.toggle('active', isParallel && state.activeView === 'bible');
  }
}

// Auto-bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const app = new LogosApp();
  app.init();
  window.logosApp = app;
});
