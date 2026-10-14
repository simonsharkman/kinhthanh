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
        break;
      case 'VERSE_SELECTED':
        this.highlightActiveVerse(data.verse);
        this.renderDrawerContent();
        this.toggleDrawer(data.isDrawerOpen);
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
    const html = bibleEngine.renderChapterHTML(this.currentPassageData, state.activeVersions);
    readerContainer.innerHTML = html;

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
        state.setDrawerTab('metaphors');
        state.selectVerse(el.closest('.verse-item').dataset.verse, true);
        const metaphor = hermeneuticsEngine.getMetaphorById(metaphorId);
        if (metaphor) {
          const drawerBody = document.getElementById('drawer-body');
          if (drawerBody) drawerBody.innerHTML = hermeneuticsEngine.renderMetaphorCard(metaphor);
        }
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

        const baseText = versesList.length > 0 ? versesList[0].text : '';
        versesList.forEach((item, idx) => {
          let displayText = item.text;
          if (idx > 0 && item.lang === 'vi') {
            displayText = bibleEngine.diffWords(item.text, baseText);
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
        break;
      }

      case 'metaphors': {
        // Tab 2: Ẩn Dụ & Biểu Tượng Thần Học
        const currVerseObj = this.currentPassageData.verses.find(v => v.verse_num === state.currentVerse);
        let metaphor = null;
        if (currVerseObj && currVerseObj.metaphor_id) {
          metaphor = hermeneuticsEngine.getMetaphorById(currVerseObj.metaphor_id);
        } else {
          metaphor = hermeneuticsEngine.metaphors[0] || null;
        }
        drawerBody.innerHTML = hermeneuticsEngine.renderMetaphorCard(metaphor);

        drawerBody.querySelectorAll('.crossref-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            const passage = pill.dataset.passage;
            alert(`Khám phá phân đoạn: ${passage}`);
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
            const quote = crossRefEngine.fetchVersePreview(ref);
            alert(`[${ref}]\n\n${quote}`);
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
        break;
      }
    }
  }

  toggleDrawer(isOpen) {
    const drawer = document.getElementById('drawer-inspector');
    if (drawer) {
      drawer.classList.toggle('open', isOpen);
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
    if (modal) modal.classList.remove('hidden');
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

  // 7. Modals: Book Picker & Version Selector
  populateBookPicker() {
    const grid = document.getElementById('books-grid');
    if (!grid) return;

    let html = '';
    bibleEngine.books.forEach(b => {
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

  populateVersionSelector() {
    const container = document.getElementById('versions-checkbox-list');
    if (!container) return;

    let html = '';
    ALL_TRANSLATIONS.forEach(t => {
      const isChecked = state.activeVersions.includes(t.id);
      html += `
        <label class="version-option-item">
          <input type="checkbox" value="${t.id}" ${isChecked ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-gold);">
          <div style="flex: 1;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9rem;">${t.id} — ${t.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${t.category} • Ngôn ngữ: ${t.lang.toUpperCase()}</div>
          </div>
        </label>
      `;
    });
    container.innerHTML = html;

    container.querySelectorAll('input[type="checkbox"]').forEach(box => {
      box.addEventListener('change', () => {
        state.toggleVersion(box.value);
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
        document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const genre = pill.dataset.genre;
        if (genre !== 'all') {
          const firstBook = bibleEngine.books.find(b => b.genre === genre);
          if (firstBook) state.setPassage(firstBook.id, 1, 1);
        }
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

    document.getElementById('submit-admin-auth-btn')?.addEventListener('click', () => {
      const key = document.getElementById('admin-secret-key-input').value;
      if (state.verifyAdminSecret(key)) {
        document.getElementById('admin-auth-modal').classList.add('hidden');
        document.getElementById('admin-secret-key-input').value = '';
        alert('Xác thực Quản Trị Viên thành công! Bạn có quyền sửa Banner và tạo Blog.');
      } else {
        alert('Mã bí mật không chính xác. Mẹo: Mã mặc định là logos777');
      }
    });

    // Admin Banner Edit Trigger
    document.getElementById('admin-banner-edit-trigger')?.addEventListener('click', () => {
      this.openAdminBannerModal();
    });

    document.getElementById('save-admin-banner-btn')?.addEventListener('click', () => {
      this.saveAdminBannerFromModal();
    });

    // Modals open triggers
    document.getElementById('book-nav-trigger')?.addEventListener('click', () => {
      document.getElementById('book-picker-modal')?.classList.remove('hidden');
    });

    document.getElementById('translations-modal-trigger')?.addEventListener('click', () => {
      document.getElementById('version-selector-modal')?.classList.remove('hidden');
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
    });

    // Omni-Search Input & Dropdown
    const searchInput = document.getElementById('omni-search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = bibleEngine.searchScripture(query, hermeneuticsEngine.metaphors);

        if (results.length === 0) {
          searchDropdown.classList.add('hidden');
          return;
        }

        let html = '';
        results.forEach(r => {
          html += `
            <div class="search-item" data-type="${r.type}" data-book="${r.book_id || ''}" data-ch="${r.chapter || ''}" data-v="${r.verse || ''}" data-metaphor="${r.metaphor_id || ''}">
              <div>
                <span class="search-item-badge">${r.badge}</span>
                <strong>${r.title}</strong>
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${r.subtitle}</div>
            </div>
          `;
        });
        searchDropdown.innerHTML = html;
        searchDropdown.classList.remove('hidden');

        searchDropdown.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            const type = item.dataset.type;
            if (type === 'coordinate' || type === 'book') {
              state.setPassage(item.dataset.book, item.dataset.ch, item.dataset.v || 1);
              state.setActiveView('bible');
            } else if (type === 'metaphor') {
              state.setDrawerTab('metaphors');
              state.setDrawerOpen(true);
              const m = hermeneuticsEngine.getMetaphorById(item.dataset.metaphor);
              if (m) {
                const drawerBody = document.getElementById('drawer-body');
                if (drawerBody) drawerBody.innerHTML = hermeneuticsEngine.renderMetaphorCard(m);
              }
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
}

// Auto-bootstrap when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const app = new LogosApp();
  app.init();
  window.logosApp = app;
});
