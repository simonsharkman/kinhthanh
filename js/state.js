/* ==========================================================================
   LOGOS MULTIVERSE - REACTIVE STATE MANAGEMENT
   Observer Pattern with Event Dispatching
   ========================================================================== */

import { storage } from './storage.js';

export const ALL_TRANSLATIONS = [
  // 1. Nhóm Bản Dịch Tiếng Việt (HTTLVN & Phổ Biến)
  { id: 'BTT', code: 'VI1934', name: 'Bản Truyền Thống 1925', lang: 'vi', category: 'Tiếng Việt', note: 'Bản dịch chuẩn mực lịch sử của Hội Thánh Tin Lành Việt Nam' },
  { id: 'BTHD', code: 'RVV11', name: 'Bản Truyền Thống Hiệu Đính 2010', lang: 'vi', category: 'Tiếng Việt', note: 'Hiệu đính ngữ nghĩa chính xác từ nguyên bản Hy Lạp / Hê-bơ-rơ (RVV11)' },
  { id: 'BDM', code: 'NVB', name: 'Bản Dịch Mới 2002', lang: 'vi', category: 'Tiếng Việt', note: 'Văn phong tiếng Việt hiện đại, sáng sủa, dễ hiểu' },
  { id: 'BD2011', code: 'BD2011', name: 'Bản Dịch 2011 (Đặng Ngọc Báu)', lang: 'vi', category: 'Tiếng Việt', note: 'Bản dịch công phu từ bản văn gốc của MS Đặng Ngọc Báu' },
  { id: 'BPT', code: 'BPT', name: 'Bản Phổ Thông', lang: 'vi', category: 'Tiếng Việt', note: 'Từ ngữ giản dị, trong sáng, phù hợp cho mọi lứa tuổi' },
  { id: 'BDY', code: 'BDY', name: 'Bản Diễn Ý', lang: 'vi', category: 'Tiếng Việt', note: 'Diễn giải sáng rõ ý nghĩa thần học sâu sắc của thông điệp' },
  { id: 'CGKPV', code: 'CGKPV', name: 'Bản Công Giáo (CGKPV)', lang: 'vi', category: 'Tiếng Việt', note: 'Bản dịch chính thức của Nhóm Phiên Dịch Các Giờ Kinh Phụng Vụ' },

  // 2. Nhóm Bản Dịch Sắc Tộc Việt Nam (HTTLVN Ethnic Minority Languages)
  { id: 'EDE', code: 'RRB', name: 'Klei Aê Diê Blŭ 2015 (Tiếng Ê-đê)', lang: 'rrb', category: 'Sắc Tộc', note: 'Kinh Thánh tiếng Ê-đê của Hội Thánh Tin Lành Việt Nam' },
  { id: 'JARAI', code: 'JBSV', name: 'Hră Ơi Adai Pơhiăp 2016 (Tiếng Gia-rai)', lang: 'jra', category: 'Sắc Tộc', note: 'Kinh Thánh tiếng Gia-rai' },
  { id: 'BRU', code: 'BRU', name: 'Parnai Yiang Sursĩ (Tiếng Bru-Vân Kiều)', lang: 'bru', category: 'Sắc Tộc', note: 'Kinh Thánh tiếng Bru (Vân Kiều)' },
  { id: 'HMONG_W', code: 'HMOWSV', name: 'Vajtswv Txojlus (Tiếng H’Mông Trắng)', lang: 'mww', category: 'Sắc Tộc', note: 'Kinh Thánh Hmoob Dawb' },
  { id: 'HMONG_B', code: 'HMOBSV', name: 'Vaajtswv Txujlug (Tiếng H’Mông Xanh)', lang: 'hnj', category: 'Sắc Tộc', note: 'Kinh Thánh Moob Leeg' },
  { id: 'MNONG', code: 'BBSV', name: 'Nau Brah Ndu Ngơi (Tiếng M’Nông)', lang: 'bbz', category: 'Sắc Tộc', note: 'Kinh Thánh tiếng M’Nông' },
  { id: 'DAO', code: 'IUMINR', name: 'Ging-Sou (Tiếng Dao)', lang: 'ium', category: 'Sắc Tộc', note: 'Kinh Thánh tiếng Dao (Iu Mien)' },

  // 3. Nhóm Quốc Tế & Nguyên Ngữ
  { id: 'NKJV', code: 'NKJV', name: 'New King James Version', lang: 'en', category: 'Quốc Tế', note: 'Chuẩn học thuật tiếng Anh hiện đại' },
  { id: 'NIV', code: 'NIV', name: 'New International Version', lang: 'en', category: 'Quốc Tế', note: 'Bản dịch quốc tế thông dụng số 1 thế giới' },
  { id: 'KJV', code: 'KJV', name: 'King James Version 1611', lang: 'en', category: 'Quốc Tế', note: 'Bản dịch kinh điển Anh ngữ 1611' },
  { id: 'ESV', code: 'ESV', name: 'English Standard Version', lang: 'en', category: 'Quốc Tế', note: 'Bản dịch học thuật tương đương văn tự' },
  { id: 'RCUV', code: 'RCUV', name: '和合本修訂版 (Tiếng Hoa Phồn Thể)', lang: 'zh-Hant', category: 'Quốc Tế', note: 'Kinh Thánh tiếng Hoa Phồn Thể' },
  { id: 'RCUVSS', code: 'RCUVSS', name: '和合本修订版 (Tiếng Hoa Giản Thể)', lang: 'zh-Hans', category: 'Quốc Tế', note: 'Kinh Thánh tiếng Hoa Giản Thể' },
  { id: 'INTERLINEAR', code: 'ORIGINAL', name: 'Interlinear Hy Lạp/Hê-bơ-rơ + Strong’s', lang: 'original', category: 'Nguyên Ngữ', note: 'Bản văn gốc Hy Lạp (Tân Ước) & Hê-bơ-rơ (Cựu Ước) kèm mã Strong’s' }
];

export class AppState {
  constructor() {
    this.listeners = [];

    // Current Reading Context
    this.currentBook = 'JHN';
    this.currentChapter = 1;
    this.currentVerse = 1;
    this.currentGenre = 'all';

    // Active Parallel Translations
    const savedVersions = storage.getPreference('active_versions', ['BTT', 'BDM', 'KJV', 'ESV']);
    this.activeVersions = Array.isArray(savedVersions) ? savedVersions : ['BTT', 'BDM', 'KJV', 'ESV'];

    // Visual Theme (dark or parchment)
    this.currentTheme = storage.getPreference('theme', 'dark');

    // User Role: 'guest' or 'admin'
    this.currentUserRole = storage.getPreference('user_role', 'guest');

    // Admin Banner Configuration
    this.adminBannerConfig = storage.getAdminBanner();

    // Active View: 'bible', 'blog', 'community', 'media'
    this.activeView = 'bible';

    // Active Drawer Tab: 'parallel', 'metaphors', 'crossref', 'context', 'ai'
    this.activeDrawerTab = 'parallel';
    this.isDrawerOpen = false;
  }

  // Observer Pattern
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(eventType, data = {}) {
    for (const callback of this.listeners) {
      try {
        callback(eventType, data, this);
      } catch (err) {
        console.error('State listener error:', err);
      }
    }
  }

  // Navigation Methods
  setPassage(bookId, chapter, verse = 1) {
    this.currentBook = bookId;
    this.currentChapter = parseInt(chapter, 10);
    this.currentVerse = parseInt(verse, 10);
    this.notify('PASSAGE_CHANGED', { book: this.currentBook, chapter: this.currentChapter, verse: this.currentVerse });
  }

  setBookAndChapter(bookId, chapter) {
    this.setPassage(bookId, chapter, 1);
  }

  selectVerse(verseNum, openDrawer = true) {
    this.currentVerse = parseInt(verseNum, 10);
    if (openDrawer) {
      this.isDrawerOpen = true;
    }
    this.notify('VERSE_SELECTED', { verse: this.currentVerse, isDrawerOpen: this.isDrawerOpen });
  }

  // Translation Management
  toggleVersion(versionId) {
    if (this.activeVersions.includes(versionId)) {
      if (this.activeVersions.length > 1) {
        this.activeVersions = this.activeVersions.filter(v => v !== versionId);
      } else {
        alert('Phải giữ lại ít nhất 1 bản dịch để đối chiếu.');
        return;
      }
    } else {
      if (this.activeVersions.length < 20) {
        this.activeVersions.push(versionId);
      } else {
        alert('Tối đa có thể chọn 20 bản dịch để đối chiếu song song.');
        return;
      }
    }
    storage.savePreference('active_versions', this.activeVersions);
    this.notify('VERSIONS_CHANGED', { activeVersions: this.activeVersions });
  }

  setActiveVersions(versionsList) {
    if (!Array.isArray(versionsList) || versionsList.length === 0) return;
    this.activeVersions = Array.from(new Set(versionsList));
    storage.savePreference('active_versions', this.activeVersions);
    this.notify('VERSIONS_CHANGED', { activeVersions: this.activeVersions });
  }

  // Theme Toggling
  setTheme(themeName) {
    this.currentTheme = themeName;
    storage.savePreference('theme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);
    this.notify('THEME_CHANGED', { theme: themeName });
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'parchment' : 'dark';
    this.setTheme(nextTheme);
  }

  // Role Authentication Gate
  verifyAdminSecret(secretKey) {
    // Zero-tamper security: Admin key validation
    const masterSecret = 'logos777';
    if (secretKey === masterSecret) {
      this.currentUserRole = 'admin';
      storage.savePreference('user_role', 'admin');
      this.notify('ROLE_CHANGED', { role: 'admin' });
      return true;
    }
    return false;
  }

  logoutAdmin() {
    this.currentUserRole = 'guest';
    storage.savePreference('user_role', 'guest');
    this.notify('ROLE_CHANGED', { role: 'guest' });
  }

  // Admin Banner Updates
  updateAdminBanner(config) {
    if (this.currentUserRole !== 'admin') {
      throw new Error('Chỉ có Quản trị viên mới có quyền cập nhật Banner.');
    }
    this.adminBannerConfig = { ...this.adminBannerConfig, ...config };
    storage.saveAdminBanner(this.adminBannerConfig);
    this.notify('BANNER_CHANGED', { banner: this.adminBannerConfig });
  }

  // View Navigation
  setActiveView(viewName) {
    this.activeView = viewName;
    this.notify('VIEW_CHANGED', { view: viewName });
  }

  // Drawer Controls
  setDrawerOpen(isOpen) {
    this.isDrawerOpen = isOpen;
    this.notify('DRAWER_TOGGLED', { isOpen });
  }

  setDrawerTab(tabName) {
    this.activeDrawerTab = tabName;
    this.notify('DRAWER_TAB_CHANGED', { tab: tabName });
  }
}

export const state = new AppState();
