# -*- coding: utf-8 -*-
"""
Script apply_spa_hash_routing.py
Nâng cấp kiến trúc Single Page Application (SPA) Deep Link Hash Routing cho Logos MultiVerse:
1. Tự động đồng bộ hóa URL Hash (#portal, #bible/JHN/1, #tsk, #blog, #community, #media, #donate) khi nhấp tab hoặc đổi chương.
2. Hỗ trợ mở link trực tiếp vào bất kỳ tab hoặc đoạn Kinh Thánh nào.
3. Hỗ trợ đầy đủ phím Back / Forward của trình duyệt (popstate & hashchange).
"""

import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

APP_PATH = "E:/kinhthanh/js/app.js"

with open(APP_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Constructor: Add this.isRoutingFromHash = false;
target_cons = "this.quizAdminManageMode = false;"
if target_cons in content and "this.isRoutingFromHash = false;" not in content:
    content = content.replace(target_cons, f"{target_cons}\n    this.isRoutingFromHash = false;")
    print("[OK] Constructor updated with this.isRoutingFromHash = false;")

# 2. Add SPA router methods before switchView(viewName)
router_methods = """  // 1.0 Phân tích cú pháp URL Hash cho Single Page Application (SPA Router)
  parseHash(hashString) {
    const raw = (hashString || (typeof window !== 'undefined' ? window.location.hash : '') || '').replace(/^#\/?/, '').trim();
    if (!raw) return { view: 'portal', book: null, chapter: null, verse: null, subtab: null };

    const parts = raw.split('/').filter(Boolean);
    const prefix = (parts[0] || '').toLowerCase();

    let view = 'portal';
    if (['bible', 'focus-reader', 'doc', 'kinhthanh'].includes(prefix)) {
      view = 'bible';
    } else if (['tsk', 'crossref', 'doichieu'].includes(prefix)) {
      view = 'tsk';
    } else if (['blog', 'baiviet'].includes(prefix)) {
      view = 'blog';
    } else if (['community', 'congdong'].includes(prefix)) {
      view = 'community';
    } else if (['media', 'video'].includes(prefix)) {
      view = 'media';
    } else if (['donate', 'danghien'].includes(prefix)) {
      view = 'donate';
    } else if (['portal', 'home', 'trangchu', 'tinhnguyen'].includes(prefix)) {
      view = 'portal';
    }

    const book = parts[1] && parts[1].length <= 5 ? parts[1].toUpperCase() : null;
    const chapter = parts[2] ? parseInt(parts[2], 10) : null;
    const verse = parts[3] ? parseInt(parts[3], 10) : null;
    const subtab = parts[1] ? parts[1].toLowerCase() : null;

    return { view, book, chapter, verse, subtab };
  }

  // 1.1 Cập nhật URL Hash trên thanh địa chỉ trình duyệt (Deep Linking SPA Routing)
  updateUrlHash(viewName, bookId = null, chapterNum = null, replace = false) {
    if (typeof window === 'undefined' || this.isRoutingFromHash) return;

    let targetHash = `#${viewName}`;
    if (viewName === 'bible') {
      const b = (bookId || state.currentBook || 'JHN').toUpperCase();
      const c = parseInt(chapterNum || state.currentChapter, 10) || 1;
      targetHash = `#bible/${b}/${c}`;
    } else if (viewName === 'tsk') {
      const b = (bookId || state.currentBook || 'JHN').toUpperCase();
      const c = parseInt(chapterNum || state.currentChapter, 10) || 1;
      targetHash = `#tsk/${b}/${c}`;
    }

    if (window.location.hash === targetHash) return;

    try {
      if (replace) {
        window.history.replaceState({ view: viewName, book: bookId, chapter: chapterNum }, '', targetHash);
      } else {
        window.history.pushState({ view: viewName, book: bookId, chapter: chapterNum }, '', targetHash);
      }
    } catch (e) {
      window.location.hash = targetHash;
    }
  }

  // 1.2 Điều hướng ứng dụng theo URL Hash & Lịch sử Trình duyệt (Back / Forward)
  handleUrlRouting(isNavEvent = false) {
    if (typeof window === 'undefined') return;

    const route = this.parseHash(window.location.hash);
    const currentView = state.activeView;
    const currentBook = (state.currentBook || '').toUpperCase();
    const currentChapter = parseInt(state.currentChapter, 10);

    const isSameView = currentView === route.view;
    const isSamePassage = (!route.book || (route.book === currentBook && (!route.chapter || route.chapter === currentChapter)));

    if (isNavEvent && isSameView && isSamePassage) {
      return;
    }

    this.isRoutingFromHash = true;
    try {
      if (route.book && route.chapter) {
        state.setPassage(route.book, route.chapter, route.verse || 1);
      }

      if (currentView !== route.view) {
        state.setActiveView(route.view);
      } else {
        if (route.view === 'portal') {
          if (route.subtab === 'reader') {
            this.switchPortalTab('reader');
          } else {
            this.renderPortalView();
          }
        } else if (route.view === 'tsk') {
          this.renderTSKView();
        }
      }

      // Nếu người dùng vào URL gốc không có hash, tự động gán #portal trên thanh địa chỉ
      if (!window.location.hash) {
        window.history.replaceState({ view: 'portal' }, '', '#portal');
      }
    } finally {
      setTimeout(() => {
        this.isRoutingFromHash = false;
      }, 60);
    }
  }

  // 1. Navigation & Render View Panels
  switchView(viewName) {"""

target_switch = "  // 1. Navigation & Render View Panels\n  switchView(viewName) {"
content_normalized = content.replace("\r\n", "\n")
if target_switch in content_normalized and "parseHash(" not in content_normalized:
    content_normalized = content_normalized.replace(target_switch, router_methods)
    print("[OK] Added parseHash, updateUrlHash, and handleUrlRouting before switchView")
    content = content_normalized

# 3. In switchView(viewName): call this.updateUrlHash(viewName) at the end
target_end_switch = """    const headerTskBtn = document.getElementById('mobile-header-tsk-btn');
    if (headerTskBtn) {
      headerTskBtn.classList.toggle('active', viewName === 'tsk');
    }
  }"""
replace_end_switch = """    const headerTskBtn = document.getElementById('mobile-header-tsk-btn');
    if (headerTskBtn) {
      headerTskBtn.classList.toggle('active', viewName === 'tsk');
    }

    // Cập nhật URL Hash trên thanh địa chỉ trình duyệt (Deep Linking SPA Routing)
    this.updateUrlHash(viewName);
  }"""

content_normalized = content.replace("\r\n", "\n")
if target_end_switch in content_normalized and "this.updateUrlHash(viewName);" not in content_normalized:
    content_normalized = content_normalized.replace(target_end_switch, replace_end_switch)
    print("[OK] Added this.updateUrlHash(viewName) to end of switchView")
    content = content_normalized

# 4. In handleStateEvent under PASSAGE_CHANGED: call this.updateUrlHash
target_passage_changed = """      case 'PASSAGE_CHANGED':
        storage.recordPassageVisit(data.book, data.chapter);
        this.renderChapter(data.book, data.chapter).then(() => {"""
replace_passage_changed = """      case 'PASSAGE_CHANGED':
        storage.recordPassageVisit(data.book, data.chapter);
        if (state.activeView === 'bible') {
          this.updateUrlHash('bible', data.book, data.chapter, true);
        } else if (state.activeView === 'tsk') {
          this.updateUrlHash('tsk', data.book, data.chapter, true);
        }
        this.renderChapter(data.book, data.chapter).then(() => {"""

content_normalized = content.replace("\r\n", "\n")
if target_passage_changed in content_normalized and "this.updateUrlHash('bible'" not in content_normalized:
    content_normalized = content_normalized.replace(target_passage_changed, replace_passage_changed)
    print("[OK] Added URL hash updating on PASSAGE_CHANGED")
    content = content_normalized

# 5. In init(): update initial route parsing and routing execution
target_init_block = """    // Thiết lập view ban đầu: Nếu URL có hash cụ thể thì mở tab đó, mặc định lấy Cổng Tĩnh Nguyện 'portal' làm nền chính
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#bible' || window.location.search.includes('view=bible')) {
        state.setActiveView('bible');
      } else if (window.location.hash === '#tsk' || window.location.search.includes('view=tsk')) {
        state.setActiveView('tsk');
      } else if (window.location.hash === '#donate' || window.location.search.includes('view=donate')) {
        state.setActiveView('donate');
      } else if (window.location.hash === '#blog' || window.location.search.includes('view=blog')) {
        state.setActiveView('blog');
      } else if (window.location.hash === '#community' || window.location.search.includes('view=community')) {
        state.setActiveView('community');
      } else if (window.location.hash === '#media' || window.location.search.includes('view=media')) {
        state.setActiveView('media');
      } else {
        state.setActiveView('portal');
      }

      if (window.innerWidth >= 992) {
        // Trên máy tính (>= 992px): Mặc định mở ngay Bảng Đối Chiếu (Drawer Inspector) cho Câu 1
        state.setReadingMode('standard');
        state.setDrawerTab('parallel');
        state.selectVerse(1, true);
      }
    }"""

replace_init_block = """    // 8. Kích hoạt định tuyến theo URL Hash (SPA Routing)
    if (typeof window !== 'undefined') {
      this.handleUrlRouting(false);

      if (window.innerWidth >= 992 && state.activeView === 'bible') {
        // Trên máy tính (>= 992px): Mặc định mở ngay Bảng Đối Chiếu (Drawer Inspector) cho Câu 1
        state.setReadingMode('standard');
        state.setDrawerTab('parallel');
        state.selectVerse(state.currentVerse || 1, true);
      }
    }"""

content_normalized = content.replace("\r\n", "\n")
if target_init_block in content_normalized:
    content_normalized = content_normalized.replace(target_init_block, replace_init_block)
    print("[OK] Replaced static hash check in init() with this.handleUrlRouting(false)")
    content = content_normalized

# 6. In init() before renderChapter: parse initial route
target_render_start = """    // 5. Render nội dung ban đầu (Giăng 1)
    this.updatePrimaryVersionLabel();"""
replace_render_start = """    // 5. Khởi tạo bộ định tuyến ban đầu từ URL Hash nếu có (Deep Linking)
    if (typeof window !== 'undefined') {
      const initialRoute = this.parseHash(window.location.hash);
      if (initialRoute.book && initialRoute.chapter) {
        state.currentBook = initialRoute.book;
        state.currentChapter = initialRoute.chapter;
        if (initialRoute.verse) state.currentVerse = initialRoute.verse;
      }
    }

    this.updatePrimaryVersionLabel();"""

content_normalized = content.replace("\r\n", "\n")
if target_render_start in content_normalized:
    content_normalized = content_normalized.replace(target_render_start, replace_render_start)
    print("[OK] Added initial route parsing before renderChapter in init()")
    content = content_normalized

# 7. In bindEvents(): update brand-home-btn to portal & register popstate / hashchange
target_brand_home = """    // Brand Logo Home
    document.getElementById('brand-home-btn')?.addEventListener('click', () => {
      state.setActiveView('bible');
    });"""

replace_brand_home = """    // Brand Logo Home (Về trang chủ Cổng Tĩnh Nguyện #portal)
    document.getElementById('brand-home-btn')?.addEventListener('click', () => {
      state.setActiveView('portal');
    });

    // Browser Back / Forward History Navigation (popstate & hashchange)
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => this.handleUrlRouting(true));
      window.addEventListener('hashchange', () => this.handleUrlRouting(true));
    }"""

content_normalized = content.replace("\r\n", "\n")
if target_brand_home in content_normalized:
    content_normalized = content_normalized.replace(target_brand_home, replace_brand_home)
    print("[OK] Updated brand-home-btn to portal and registered popstate & hashchange listeners")
    content = content_normalized

# Write back to file with proper encoding
with open(APP_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: app.js successfully updated with SPA Hash Routing!")
