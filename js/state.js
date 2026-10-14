/* ==========================================================================
   LOGOS MULTIVERSE - REACTIVE STATE MANAGEMENT
   Observer Pattern with Event Dispatching
   ========================================================================== */

import { storage } from './storage.js';

export const ALL_TRANSLATIONS = [
  { id: 'BTT', name: 'Bản Truyền Thống 1925', lang: 'vi', category: 'Truyền Thống' },
  { id: 'BDM', name: 'Bản Dịch Mới 2002', lang: 'vi', category: 'Hiện Đại' },
  { id: 'BPT', name: 'Bản Phổ Thông', lang: 'vi', category: 'Diễn Ý' },
  { id: 'BD2011', name: 'Bản Dịch 2011 (Đặng Ngọc Báu)', lang: 'vi', category: 'Hiện Đại' },
  { id: 'BHD', name: 'Bản Hiện Đại', lang: 'vi', category: 'Diễn Ý' },
  { id: 'CGKPV', name: 'Bản Công Giáo (GKPV)', lang: 'vi', category: 'Phụng Vụ' },
  { id: 'KJV', name: 'King James Version 1611', lang: 'en', category: 'Kinh Điển' },
  { id: 'ESV', name: 'English Standard Version', lang: 'en', category: 'Học Thuật' },
  { id: 'NIV', name: 'New International Version', lang: 'en', category: 'Hiện Đại' },
  { id: 'INTERLINEAR', name: 'Interlinear Hy Lạp/Hê-bơ-rơ + Strong’s', lang: 'original', category: 'Nguyên Ngữ' }
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
      if (this.activeVersions.length < 6) {
        this.activeVersions.push(versionId);
      } else {
        alert('Tối đa có thể mở song song 6 bản dịch cùng lúc để đảm bảo thẩm mỹ.');
        return;
      }
    }
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
