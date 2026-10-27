# -*- coding: utf-8 -*-
"""
Script apply_verse_and_version_routing.py
Nâng cấp toàn diện cơ chế điều hướng URL theo Câu (Verse Deep Linking) & Bản Dịch (Version Query):
1. Khi người dùng nhấp vào bất kỳ câu Kinh Thánh nào (ví dụ câu 6), thanh địa chỉ URL lập tức nhảy và hiển thị số câu đó (#bible/NEH/1/6).
2. Hỗ trợ hiển thị và chia sẻ bản dịch tương ứng (?v=BD2011, ?v=CGKPV, ?v=BTT, v.v.).
3. Tương thích chuẩn xác với định dạng HTTLVN (ví dụ: /doc-kinh-thanh/gie/21?v=BD2011#6 tự động nhận diện Giê-rê-mi 21:6 bản BD2011).
4. Mở link trực tiếp sẽ nạp đúng bản dịch, nhảy đúng sách/chương/câu, cuộn đến câu và mở bảng Đối Chiếu Song Song.
"""

import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

APP_PATH = "E:/kinhthanh/js/app.js"
with open(APP_PATH, "r", encoding="utf-8") as f:
    app_js = f.read()

app_norm = app_js.replace("\r\n", "\n")

# 1. Thêm phương thức stripAccents và resolveBookId vào LogosApp
helper_methods = """  // Loại bỏ dấu tiếng Việt để đối chiếu chuỗi linh hoạt
  stripAccents(str) {
    if (!str || typeof str !== 'string') return '';
    return str.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }

  // Phân giải mã sách chuẩn từ ID chuẩn, slug HTTLVN (gie, ne, sa, ...) hoặc tên sách
  resolveBookId(bookStr) {
    if (!bookStr) return 'GEN';
    const clean = String(bookStr).trim().toUpperCase();
    if (bibleEngine?.books && bibleEngine.books.length > 0) {
      // 1. Khớp trực tiếp ID (GEN, NEH, JER, ...)
      const direct = bibleEngine.books.find(b => b.id === clean);
      if (direct) return direct.id;

      // 2. Khớp slug HTTLVN (gie -> JER, ne -> NEH, sa -> GEN, ...)
      const slugLower = String(bookStr).trim().toLowerCase();
      const slugMatch = bibleEngine.books.find(b => b.httlvn_slug && b.httlvn_slug.toLowerCase() === slugLower);
      if (slugMatch) return slugMatch.id;

      // 3. Khớp tên tiếng Anh hoặc tiếng Việt không dấu
      const normTarget = this.stripAccents(slugLower).replace(/[-–\\s]/g, '');
      const nameMatch = bibleEngine.books.find(b => 
        (b.name_en && b.name_en.toUpperCase() === clean) ||
        (b.name_vi && this.stripAccents(b.name_vi).replace(/[-–\\s]/g, '') === normTarget)
      );
      if (nameMatch) return nameMatch.id;
    }
    return clean;
  }

  // 1.0 Phân tích cú pháp URL Hash cho Single Page Application (SPA Router)"""

target_parse_hash_header = "  // 1.0 Phân tích cú pháp URL Hash cho Single Page Application (SPA Router)"
if target_parse_hash_header in app_norm and "resolveBookId(bookStr)" not in app_norm:
    app_norm = app_norm.replace(target_parse_hash_header, helper_methods)
    print("[OK] Added stripAccents and resolveBookId methods")

# 2. Thay thế parseHash, updateUrlHash, và handleUrlRouting
old_router_block = """  // 1.0 Phân tích cú pháp URL Hash cho Single Page Application (SPA Router)
  parseHash(hashString) {
    const raw = (hashString || (typeof window !== 'undefined' ? window.location.hash : '') || '').replace(/^#\\/?/, '').trim();
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
  }"""

new_router_block = """  // 1.0 Phân tích cú pháp URL Hash cho Single Page Application (SPA Router)
  parseHash(hashString) {
    let raw = (hashString || (typeof window !== 'undefined' ? (window.location.hash || window.location.pathname) : '') || '').trim();
    if (!raw || raw === '#' || raw === '/') {
      return { view: 'portal', book: null, chapter: null, verse: null, version: null, subtab: null };
    }

    // 1. Tách query params (?v=BD2011, etc.)
    let version = null;
    const vMatch = raw.match(/[?&]v=([A-Za-z0-9_\\-]+)/i) || 
      (typeof window !== 'undefined' && window.location.search ? window.location.search.match(/[?&]v=([A-Za-z0-9_\\-]+)/i) : null);
    if (vMatch) {
      version = vMatch[1].toUpperCase();
    }

    // 2. Tách verse nếu có dạng #6 ở cuối URL (ví dụ: .../21?v=BD2011#6 hoặc .../21#6)
    let verseFromHash = null;
    const secondHashMatch = raw.match(/(?:#|\\?v=.*?#)(\\d+)$/);
    if (secondHashMatch) {
      verseFromHash = parseInt(secondHashMatch[1], 10);
    }

    // Làm sạch chuỗi trước khi split
    let cleanPath = raw.split('?')[0].replace(/^#\\/?/, '').replace(/^\\//, '');

    // Nếu có dấu hai chấm chapter:verse (ví dụ: NEH/1:6)
    let verseFromColon = null;
    if (cleanPath.includes(':')) {
      const colonParts = cleanPath.split(':');
      cleanPath = colonParts[0];
      verseFromColon = parseInt(colonParts[1], 10);
    }

    const parts = cleanPath.split('/').filter(Boolean);
    const prefix = (parts[0] || '').toLowerCase();

    let view = 'portal';
    let bookPart = null;
    let chPart = null;
    let vPart = verseFromHash || verseFromColon;

    if (['bible', 'focus-reader', 'doc', 'kinhthanh', 'doc-kinh-thanh'].includes(prefix)) {
      view = 'bible';
      bookPart = parts[1];
      chPart = parts[2];
      if (parts[3] && !vPart) vPart = parseInt(parts[3], 10);
    } else if (['tsk', 'crossref', 'doichieu'].includes(prefix)) {
      view = 'tsk';
      bookPart = parts[1];
      chPart = parts[2];
      if (parts[3] && !vPart) vPart = parseInt(parts[3], 10);
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
    } else {
      // Trường hợp URL trực tiếp tên sách (ví dụ: #NEH/1/6 hoặc #gie/21#6)
      const testBook = this.resolveBookId(prefix);
      if (testBook) {
        view = 'bible';
        bookPart = prefix;
        chPart = parts[1];
        if (parts[2] && !vPart) vPart = parseInt(parts[2], 10);
      }
    }

    const resolvedBook = bookPart ? this.resolveBookId(bookPart) : null;
    const chapter = chPart ? parseInt(chPart, 10) : null;
    const verse = vPart ? parseInt(vPart, 10) : null;
    const subtab = parts[1] ? parts[1].toLowerCase() : null;

    return { view, book: resolvedBook, chapter, verse, version, subtab };
  }

  // 1.1 Cập nhật URL Hash trên thanh địa chỉ trình duyệt (Deep Linking SPA Routing)
  updateUrlHash(viewName, bookId = null, chapterNum = null, verseNum = null, versionCode = null, replace = false) {
    if (typeof window === 'undefined' || this.isRoutingFromHash) return;

    let targetHash = `#${viewName}`;
    const vCode = versionCode || state.primaryVersion || 'BTT';
    const versionQuery = vCode && vCode !== 'BTT' ? `?v=${vCode}` : '';

    if (viewName === 'bible' || viewName === 'portal') {
      const b = this.resolveBookId(bookId || state.currentBook || 'JHN');
      const c = parseInt(chapterNum || state.currentChapter, 10) || 1;
      const v = verseNum ? parseInt(verseNum, 10) : (state.currentVerse ? parseInt(state.currentVerse, 10) : null);
      if (viewName === 'bible') {
        if (v && v > 0) {
          targetHash = `#bible/${b}/${c}/${v}${versionQuery}`;
        } else {
          targetHash = `#bible/${b}/${c}${versionQuery}`;
        }
      } else {
        if (v && v > 0) {
          targetHash = `#portal/${b}/${c}/${v}${versionQuery}`;
        } else {
          targetHash = `#portal`;
        }
      }
    } else if (viewName === 'tsk') {
      const b = this.resolveBookId(bookId || state.currentBook || 'JHN');
      const c = parseInt(chapterNum || state.currentChapter, 10) || 1;
      const v = verseNum ? parseInt(verseNum, 10) : (state.currentVerse ? parseInt(state.currentVerse, 10) : null);
      if (v && v > 0) {
        targetHash = `#tsk/${b}/${c}/${v}`;
      } else {
        targetHash = `#tsk/${b}/${c}`;
      }
    }

    if (window.location.hash === targetHash) return;

    try {
      if (replace) {
        window.history.replaceState({ view: viewName, book: bookId, chapter: chapterNum, verse: verseNum }, '', targetHash);
      } else {
        window.history.pushState({ view: viewName, book: bookId, chapter: chapterNum, verse: verseNum }, '', targetHash);
      }
    } catch (e) {
      window.location.hash = targetHash;
    }
  }

  // 1.2 Điều hướng ứng dụng theo URL Hash & Lịch sử Trình duyệt (Back / Forward)
  handleUrlRouting(isNavEvent = false) {
    if (typeof window === 'undefined') return;

    const route = this.parseHash(window.location.hash || window.location.pathname);
    const currentView = state.activeView;
    const currentBook = (state.currentBook || '').toUpperCase();
    const currentChapter = parseInt(state.currentChapter, 10);
    const currentVerse = parseInt(state.currentVerse, 10);
    const currentVersion = state.primaryVersion || 'BTT';

    const isSameView = currentView === route.view;
    const isSamePassage = (!route.book || (route.book === currentBook && (!route.chapter || route.chapter === currentChapter)));
    const isSameVerse = (!route.verse || route.verse === currentVerse);
    const isSameVersion = (!route.version || route.version === currentVersion);

    if (isNavEvent && isSameView && isSamePassage && isSameVerse && isSameVersion) {
      return;
    }

    this.isRoutingFromHash = true;
    try {
      // 1. Thiết lập bản dịch được chỉ định trong URL (nếu có)
      if (route.version && route.version !== state.primaryVersion) {
        state.setPrimaryVersion(route.version);
      }

      // 2. Chuyển phân đoạn sách và chương
      if (route.book && route.chapter) {
        state.setPassage(route.book, route.chapter, route.verse || 1);
      }

      // 3. Chuyển View nếu khác
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

      // 4. Chọn và cuộn đến câu được chỉ định trong URL
      if (route.verse) {
        setTimeout(() => {
          state.selectVerse(route.verse, true);
          this.highlightActiveVerse(route.verse);
        }, 150);
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
  }"""

if old_router_block in app_norm:
    app_norm = app_norm.replace(old_router_block, new_router_block)
    print("[OK] Replaced router block with verse & version deep link router")

# 3. Cập nhật handleStateEvent cho VERSE_SELECTED
old_verse_selected = """      case 'VERSE_SELECTED':
        if (state.activeView === 'tsk') {
          this.renderTSKView();
          break;
        }
        if (typeof window !== 'undefined' && window.innerWidth <= 991 && state.activeDrawerTab !== 'parallel') {
          state.activeDrawerTab = 'parallel';
        }
        this.highlightActiveVerse(data.verse);
        this.renderDrawerContent();
        this.toggleDrawer(data.isDrawerOpen);"""

new_verse_selected = """      case 'VERSE_SELECTED':
        if (state.activeView === 'tsk') {
          this.renderTSKView();
          this.updateUrlHash('tsk', state.currentBook, state.currentChapter, data.verse, null, true);
          break;
        }
        if (typeof window !== 'undefined' && window.innerWidth <= 991 && state.activeDrawerTab !== 'parallel') {
          state.activeDrawerTab = 'parallel';
        }
        this.highlightActiveVerse(data.verse);
        this.renderDrawerContent();
        this.toggleDrawer(data.isDrawerOpen);

        // Cập nhật ngay lập tức nhánh URL trên thanh địa chỉ có số câu và bản dịch (e.g. #bible/NEH/1/6)
        if (state.activeView === 'bible') {
          this.updateUrlHash('bible', state.currentBook, state.currentChapter, data.verse, state.primaryVersion, true);
        } else if (state.activeView === 'portal') {
          this.updateUrlHash('portal', state.currentBook, state.currentChapter, data.verse, state.primaryVersion, true);
        }"""

if old_verse_selected in app_norm:
    app_norm = app_norm.replace(old_verse_selected, new_verse_selected)
    print("[OK] VERSE_SELECTED event updated to synchronize URL hash with verse and version")

# 4. Cập nhật handleStateEvent cho PRIMARY_VERSION_CHANGED
old_version_changed = """      case 'PRIMARY_VERSION_CHANGED':
        this.updatePrimaryVersionLabel();
        this.populatePrimaryVersionSelector();
        const pReadSel = document.getElementById('portal-read-version-select');
        if (pReadSel && pReadSel.value !== data.primaryVersion) {
          pReadSel.value = data.primaryVersion;
        }
        storage.recordTranslationUsed(data.primaryVersion);
        this.renderChapter(state.currentBook, state.currentChapter);
        break;"""

new_version_changed = """      case 'PRIMARY_VERSION_CHANGED':
        this.updatePrimaryVersionLabel();
        this.populatePrimaryVersionSelector();
        const pReadSel = document.getElementById('portal-read-version-select');
        if (pReadSel && pReadSel.value !== data.primaryVersion) {
          pReadSel.value = data.primaryVersion;
        }
        storage.recordTranslationUsed(data.primaryVersion);
        this.renderChapter(state.currentBook, state.currentChapter);
        if (state.activeView === 'bible') {
          this.updateUrlHash('bible', state.currentBook, state.currentChapter, state.currentVerse, data.primaryVersion, true);
        }
        break;"""

if old_version_changed in app_norm:
    app_norm = app_norm.replace(old_version_changed, new_version_changed)
    print("[OK] PRIMARY_VERSION_CHANGED event updated to synchronize URL hash with version query")

# 5. Cập nhật PASSAGE_CHANGED trong handleStateEvent
old_passage_changed = """      case 'PASSAGE_CHANGED':
        storage.recordPassageVisit(data.book, data.chapter);
        if (state.activeView === 'bible') {
          this.updateUrlHash('bible', data.book, data.chapter, true);
        } else if (state.activeView === 'tsk') {
          this.updateUrlHash('tsk', data.book, data.chapter, true);
        }"""

new_passage_changed = """      case 'PASSAGE_CHANGED':
        storage.recordPassageVisit(data.book, data.chapter);
        if (state.activeView === 'bible') {
          this.updateUrlHash('bible', data.book, data.chapter, data.verse || state.currentVerse || 1, state.primaryVersion, true);
        } else if (state.activeView === 'tsk') {
          this.updateUrlHash('tsk', data.book, data.chapter, data.verse || state.currentVerse || 1, null, true);
        }"""

if old_passage_changed in app_norm:
    app_norm = app_norm.replace(old_passage_changed, new_passage_changed)
    print("[OK] PASSAGE_CHANGED event updated to preserve verse and version")

# 6. Cập nhật switchView: truyền đầy đủ tham số cho updateUrlHash
old_switch_hash = """    // Cập nhật URL Hash trên thanh địa chỉ trình duyệt (Deep Linking SPA Routing)
    this.updateUrlHash(viewName);
  }"""

new_switch_hash = """    // Cập nhật URL Hash trên thanh địa chỉ trình duyệt (Deep Linking SPA Routing)
    this.updateUrlHash(viewName, state.currentBook, state.currentChapter, state.currentVerse, state.primaryVersion, false);
  }"""

if old_switch_hash in app_norm:
    app_norm = app_norm.replace(old_switch_hash, new_switch_hash)
    print("[OK] switchView updated with full verse & version arguments")

# 7. Cập nhật init() ban đầu
old_init_parse = """    // 5. Khởi tạo bộ định tuyến ban đầu từ URL Hash nếu có (Deep Linking)
    if (typeof window !== 'undefined') {
      const initialRoute = this.parseHash(window.location.hash);
      if (initialRoute.book && initialRoute.chapter) {
        state.currentBook = initialRoute.book;
        state.currentChapter = initialRoute.chapter;
        if (initialRoute.verse) state.currentVerse = initialRoute.verse;
      }
    }"""

new_init_parse = """    // 5. Khởi tạo bộ định tuyến ban đầu từ URL Hash nếu có (Deep Linking)
    if (typeof window !== 'undefined') {
      const initialRoute = this.parseHash(window.location.hash || window.location.pathname);
      if (initialRoute.version) {
        state.primaryVersion = initialRoute.version;
      }
      if (initialRoute.book && initialRoute.chapter) {
        state.currentBook = initialRoute.book;
        state.currentChapter = initialRoute.chapter;
        if (initialRoute.verse) state.currentVerse = initialRoute.verse;
      }
    }"""

if old_init_parse in app_norm:
    app_norm = app_norm.replace(old_init_parse, new_init_parse)
    print("[OK] init() updated to parse initial version & verse")

with open(APP_PATH, "w", encoding="utf-8") as f:
    f.write(app_norm)

print("SUCCESS: app.js updated with full verse & version deep link routing!")
