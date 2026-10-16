/* ==========================================================================
   LOGOS MULTIVERSE - MASTER APPLICATION ORCHESTRATOR
   Integrates Parallel Bible Engine, Hermeneutics, Media, AI & Community
   ========================================================================== */

import { state, ALL_TRANSLATIONS } from './state.js';
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

    // 2. Thiết lập giao diện theme
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    this.updateAdminBannerUI(state.adminBannerConfig);
    this.updateRoleUI(state.currentUserRole);

    // 3. Đăng ký theo dõi State changes
    state.subscribe((event, data) => this.handleStateEvent(event, data));

    // 4. Gắn kết sự kiện UI
    this.bindEvents();
    this.initFloatingAI();

    // 5. Render nội dung ban đầu (Giăng 1)
    await this.renderChapter(state.currentBook, state.currentChapter);
    this.populateBookPicker();
    this.populateVersionSelector();

    console.log('✨ Logos MultiVerse đã sẵn sàng phục vụ học viên!');
  }

  // State Event Listener
  handleStateEvent(event, data) {
    switch (event) {
      case 'PASSAGE_CHANGED':
        this.renderChapter(data.book, data.chapter);
        this.updateShelfActiveState(data.book, data.chapter);
        this.updateFloatingAIChips();
        break;
      case 'VERSE_SELECTED':
        this.highlightActiveVerse(data.verse);
        this.renderDrawerContent();
        this.toggleDrawer(data.isDrawerOpen);
        setTimeout(() => {
          const activeEl = document.querySelector(`.verse-item[data-verse="${data.verse}"]`);
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 120);
        break;
      case 'VERSIONS_CHANGED':
        this.updateActiveVersionsCount();
        this.renderChapter(state.currentBook, state.currentChapter);
        if (state.isDrawerOpen) this.renderDrawerContent();
        break;
      case 'THEME_CHANGED':
        document.documentElement.setAttribute('data-theme', data.theme);
        break;
      case 'ROLE_CHANGED':
        this.updateRoleUI(data.role);
        if (state.activeView === 'blog') this.renderBlogView();
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
    }
  }

  // 1. Navigation & Render View Panels
  switchView(viewName) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.view-panel').forEach(p => p.classList.add('hidden'));

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    const targetPanel = document.getElementById(`${viewName === 'bible' ? 'focus-reader' : viewName + '-view'}`);
    if (targetPanel) {
      targetPanel.classList.remove('hidden');
      targetPanel.classList.add('active');
    }

    if (viewName === 'blog') this.renderBlogView();
    if (viewName === 'community') this.renderCommunityView();
    if (viewName === 'media') this.renderMediaView();
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
    const html = bibleEngine.renderChapterHTML(this.currentPassageData, state.activeVersions);
    readerContainer.innerHTML = html;

    // Tự động tải trước các bản dịch đang kích hoạt (đặc biệt là tiếng Sắc tộc / HTTLVN)
    bibleEngine.ensurePassageTranslations(bookId, chapterNum, state.activeVersions).then(loaded => {
      if (loaded && state.currentBook === bookId && state.currentChapter === chapterNum) {
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

    // Gắn sự kiện click cho từng câu
    readerContainer.querySelectorAll('.verse-item').forEach(el => {
      el.addEventListener('click', () => {
        const verseNum = el.dataset.verse;
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
        state.selectVerse(el.closest('.verse-item').dataset.verse, true);
        this.renderDrawerContent();
      });
    });

    // Tự động highlight câu đang chọn
    this.highlightActiveVerse(state.currentVerse);
  }

  highlightActiveVerse(verseNum) {
    document.querySelectorAll('.verse-item').forEach(el => {
      el.classList.toggle('verse-highlight-active', el.dataset.verse == verseNum);
    });
  }

  // 3. Render Drawer Content (5 Tabs: Đối chiếu, Ẩn dụ, KT giải thích KT, Bối cảnh, AI)
  renderDrawerContent() {
    const drawerBody = document.getElementById('drawer-body');
    const drawerTitle = document.getElementById('drawer-verse-title');
    const drawerBadge = document.getElementById('drawer-verse-genre');
    if (!drawerBody || !this.currentPassageData) return;

    const book = bibleEngine.getBookById(state.currentBook) || { name_vi: state.currentBook, genre: 'torah' };
    const verseRefStr = `${book.name_vi} ${state.currentChapter}:${state.currentVerse}`;
    const verseKey = `${state.currentBook}.${state.currentChapter}.${state.currentVerse}`;

    if (drawerTitle) drawerTitle.textContent = `Khảo Cứu: ${verseRefStr}`;
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
        const versesList = bibleEngine.getParallelVerses(state.currentBook, state.currentChapter, state.currentVerse, state.activeVersions);
        let html = `
          <div class="parallel-grid animate-fade-in">
            <div class="metaphor-card" style="border-color: var(--accent-gold-border); margin-bottom: 0.5rem;">
              <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.35rem;">
                <i class="fa-solid fa-columns"></i> Đối Chiếu Song Song ${versesList.length} Bản Dịch
              </h4>
              <p style="font-size: 0.82rem; color: var(--text-muted);">
                Làm nổi bật sự khác biệt từ ngữ giữa các bản dịch để nhìn thấy sắc thái thần học chính xác nhất.
              </p>
            </div>
        `;

        // Base text cho diff words: Chỉ dùng bản dịch tiếng Việt làm chuẩn (ưu tiên BTT 1925 hoặc bản vi đầu tiên)
        const baseViItem = versesList.find(i => i.version_id === 'BTT' && i.lang === 'vi') || versesList.find(i => i.lang === 'vi');
        const baseViText = baseViItem ? baseViItem.text : '';

        versesList.forEach((item, idx) => {
          let displayText = item.text;
          // Chỉ so sánh diff từ ngữ nếu là bản dịch tiếng Việt, khác với bản baseVi, và baseViText tồn tại
          if (item.lang === 'vi' && baseViItem && item.version_id !== baseViItem.version_id && baseViText) {
            displayText = bibleEngine.diffWords(item.text, baseViText);
          }

          html += `
            <div class="parallel-verse-card">
              <div class="parallel-card-header">
                <span class="version-code-badge">${item.version_id} • ${item.version_name}</span>
                <span class="version-name-label">${item.category}</span>
              </div>
              <div class="parallel-card-text ${item.version_id === 'INTERLINEAR' ? 'interlinear-text' : ''}">
                ${displayText}
              </div>
            </div>
          `;
        });

        html += `</div>`;
        drawerBody.innerHTML = html;

        // Tự động kiểm tra và tải các bản dịch còn thiếu / đang hiển thị loading pulse từ HTTLVN
        const needsFetch = versesList.some(v => typeof v.text === 'string' && v.text.includes('httlvn-loading-pulse'));
        if (needsFetch) {
          bibleEngine.ensurePassageTranslations(state.currentBook, state.currentChapter, state.activeVersions).then(loaded => {
            if (loaded && state.activeDrawerTab === 'parallel') {
              this.renderDrawerContent();
            }
          });
        }
        break;
      }

      case 'metaphors': {
        // Tab 2: Ẩn Dụ & Biểu Tượng Thần Học - Tự Động Đồng Bộ Theo Nội Dung Đang Mở
        const book = bibleEngine.getBookById(state.currentBook) || { id: state.currentBook, name_vi: state.currentBook };
        const detectionResult = hermeneuticsEngine.detectPassageMetaphors({
          book: { id: state.currentBook, name_vi: book.name_vi },
          chapterNum: state.currentChapter,
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
        // Tab 3: Kinh Thánh Tự Giải Thích Kinh Thánh (TSK)
        const currVerseObj = this.currentPassageData.verses.find(v => v.verse_num === state.currentVerse);
        const refs = (currVerseObj && currVerseObj.cross_refs) ? currVerseObj.cross_refs : null;
        drawerBody.innerHTML = crossRefEngine.renderCrossReferenceHTML(verseKey, refs);

        drawerBody.querySelectorAll('.crossref-peek-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const ref = btn.dataset.ref;
            this.openPassagePreviewDialog(ref);
          });
        });
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

          const responseText = await aiAssistant.ask(queryText, {
            ref: verseRefStr,
            book: book.name_vi,
            chapter: state.currentChapter,
            verse: state.currentVerse
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

        const keyBtn = drawerBody.querySelector('#ai-configure-key-btn');
        if (keyBtn) {
          keyBtn.addEventListener('click', () => {
            const currentKey = aiAssistant.getApiKey();
            const newKey = prompt('Nhập OpenAI API Key của bạn (bỏ trống để dùng AI Thần Học Offline miễn phí sẵn có):', currentKey);
            if (newKey !== null) {
              aiAssistant.setApiKey(newKey);
              this.renderDrawerContent();
            }
          });
        }

        const webToggleBtn = drawerBody.querySelector('#ai-web-search-toggle-btn');
        if (webToggleBtn) {
          webToggleBtn.addEventListener('click', () => {
            const cur = aiAssistant.getWebSearchEnabled();
            aiAssistant.setWebSearchEnabled(!cur);
            this.renderDrawerContent();
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
    }
    document.body.classList.toggle('drawer-open', isOpen);
    const appBody = document.getElementById('app-body');
    if (appBody) {
      appBody.classList.toggle('drawer-open', isOpen);
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
        alert('Mở trình soạn thảo Markdown cho Quản trị viên...');
      });
    }
  }

  renderCommunityView() {
    const commView = document.getElementById('community-view');
    if (!commView) return;
    commView.innerHTML = blogSystem.renderCommunityCirclesHTML();

    // Xử lý gửi bài chia sẻ cộng đồng
    const submitBtn = commView.querySelector('#submit-community-post-btn');
    const alertBox = commView.querySelector('#berea-validation-alert');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const author = commView.querySelector('#community-author-input').value;
        const branch_id = commView.querySelector('#community-branch-select').value;
        const title = commView.querySelector('#community-title-input').value;
        const content = commView.querySelector('#community-content-input').value;

        const res = blogSystem.submitCommunityPost({ author, branch_id, title, content });
        if (!res.success) {
          alertBox.innerHTML = bereaGuardian.renderGuardianNoticeHTML(res.reason, res.reminder);
          alertBox.classList.remove('hidden');
        } else {
          alertBox.classList.add('hidden');
          alert('Bài viết của bạn đã vượt qua sự kiểm duyệt của Agent Berea và được xuất bản thành công!');
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

  // 5. Admin Banner UI & Customization Modal
  updateAdminBannerUI(banner) {
    const bannerContainer = document.getElementById('admin-banner-container');
    const bannerBar = document.getElementById('admin-banner-bar');
    const bannerText = document.getElementById('banner-text');
    const actionLink = document.getElementById('banner-action-link');

    if (!banner.visible) {
      if (bannerContainer) bannerContainer.style.display = 'none';
      return;
    }

    if (bannerContainer) bannerContainer.style.display = 'block';
    if (bannerBar) {
      bannerBar.className = `admin-banner ${banner.theme || 'theme-gold'}`;
    }
    if (bannerText) {
      bannerText.innerHTML = banner.text;
    }
    if (actionLink) {
      actionLink.textContent = banner.btnText || 'Khám Phá';
      actionLink.onclick = (e) => {
        e.preventDefault();
        state.setPassage('JHN', 1, 1);
        state.setActiveView('bible');
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

    const b = state.adminBannerConfig;
    document.getElementById('admin-banner-badge-input').value = b.badge;
    document.getElementById('admin-banner-text-input').value = b.text.replace(/<[^>]*>/g, '');
    document.getElementById('admin-banner-btn-text-input').value = b.btnText;
    document.getElementById('admin-banner-theme-select').value = b.theme;
    document.getElementById('admin-banner-visible-checkbox').checked = b.visible;

    modal.classList.remove('hidden');
  }

  saveAdminBannerFromModal() {
    try {
      const updated = {
        badge: document.getElementById('admin-banner-badge-input').value,
        text: document.getElementById('admin-banner-text-input').value,
        btnText: document.getElementById('admin-banner-btn-text-input').value,
        theme: document.getElementById('admin-banner-theme-select').value,
        visible: document.getElementById('admin-banner-visible-checkbox').checked
      };

      state.updateAdminBanner(updated);
      document.getElementById('admin-banner-modal').classList.add('hidden');
      alert('Đã cập nhật Banner Quản Trị Viên thành công!');
    } catch (e) {
      alert(`Lỗi: ${e.message}`);
    }
  }

  // 6. Admin Authentication Gate Modal
  openAdminAuthModal() {
    const modal = document.getElementById('admin-auth-modal');
    if (modal) {
      modal.classList.remove('hidden');
      setTimeout(() => {
        const input = document.getElementById('admin-secret-key-input');
        if (input) {
          input.focus();
          input.select();
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
        state.setActiveView(btn.dataset.view);
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

    // Theme Toggle
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      state.toggleTheme();
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
      const key = (document.getElementById('admin-secret-key-input')?.value || '').trim();
      if (state.verifyAdminSecret(key)) {
        document.getElementById('admin-auth-modal').classList.add('hidden');
        document.getElementById('admin-secret-key-input').value = '';
        alert('Xác thực Quản Trị Viên thành công! Bạn có quyền sửa Banner và tạo Blog.');
      } else {
        alert('Mã bí mật không chính xác. Mẹo: Mã mặc định là logos777');
      }
    };

    document.getElementById('submit-admin-auth-btn')?.addEventListener('click', handleAdminAuthSubmit);
    document.getElementById('admin-secret-key-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdminAuthSubmit();
      }
    });

    // Admin Banner Edit Trigger
    document.getElementById('admin-banner-edit-trigger')?.addEventListener('click', () => {
      this.openAdminBannerModal();
    });

    document.getElementById('save-admin-banner-btn')?.addEventListener('click', () => {
      this.saveAdminBannerFromModal();
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
      state.setActiveVersions(['BTT', 'BTHD', 'BDM']);
      this.populateVersionSelector();
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

      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = bibleEngine.searchScripture(query, hermeneuticsEngine.metaphors);

        if (results.length === 0) {
          searchDropdown.classList.add('hidden');
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
          if (r.type === 'ai_topic') {
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

    if (verseNum > 1) {
      setTimeout(() => {
        state.setCurrentVerse(verseNum);
        state.setDrawerOpen(true);
        const verseEl = document.querySelector(`.verse-item[data-verse="${verseNum}"]`);
        if (verseEl) {
          verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
    }
  }

  // Ask AI Copilot anywhere
  askAIAboutTopic(topicQuery) {
    const widget = document.getElementById('floating-ai-widget');
    if (widget) {
      widget.classList.remove('hidden');
      this.updateFloatingAIChips();
      const input = document.getElementById('floating-ai-input');
      const sendBtn = document.getElementById('floating-ai-send-btn');
      if (input && sendBtn) {
        input.value = topicQuery;
        sendBtn.click();
        return;
      }
    }

    state.setDrawerTab('ai');
    state.setDrawerOpen(true);
    setTimeout(() => {
      const input = document.getElementById('ai-user-query-input');
      const sendBtn = document.getElementById('ai-send-btn');
      if (input && sendBtn) {
        input.value = `Tìm các câu Kinh Thánh và giải nghĩa thần học về: "${topicQuery}"`;
        sendBtn.click();
      }
    }, 200);
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

    if (!fabBtn || !widget) return;

    // Toggle widget open/close
    fabBtn.addEventListener('click', () => {
      const isHidden = widget.classList.contains('hidden');
      if (isHidden) {
        widget.classList.remove('hidden');
        this.updateFloatingAIChips();
        if (messagesContainer && messagesContainer.children.length === 0) {
          const currentBookObj = bibleEngine.getBookById(state.currentBook);
          const bookNameVi = currentBookObj ? currentBookObj.name_vi : state.currentBook;
          this.addFloatingAIMessage('assistant', `
            Chào bạn! Tôi là <strong>Trợ Lý Thần Học Berea AI</strong>.<br>
            Tôi có thể phân tích bối cảnh trước giả, giải nghĩa nguyên ngữ Hy Lạp/Hê-bơ-rơ của <strong>${bookNameVi} đoạn ${state.currentChapter}</strong>, và <em>tự động tra cứu không gian mạng</em>. Bạn cần tìm hiểu điều gì?
          `);
        }
        input?.focus();
      } else {
        widget.classList.add('hidden');
      }
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

      try {
        const responseText = await aiAssistant.ask(q, {
          ref: refStr,
          book: bookNameVi,
          bookId: state.currentBook,
          chapter: state.currentChapter,
          verse: state.currentVerse || 1
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

    sendBtn?.addEventListener('click', () => executeFloatingQuery());
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        executeFloatingQuery();
      }
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
}

// Auto-bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const app = new LogosApp();
  app.init();
  window.logosApp = app;
});
