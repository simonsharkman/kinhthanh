/* ==========================================================================
   LOGOS MULTIVERSE - REACTIVE STATE MANAGEMENT
   Observer Pattern with Event Dispatching
   ========================================================================== */

import { storage } from './storage.js';

export const ALL_TRANSLATIONS = [
  // 1. Nhóm Bản Dịch Tiếng Việt (HTTLVN, Bible.com & Phổ Biến)
  { id: 'BTT', code: 'VI1934', name: 'Bản Truyền Thống 1925', lang: 'vi', category: 'Tiếng Việt', note: 'Bản dịch chuẩn mực lịch sử của Hội Thánh Tin Lành Việt Nam' },
  { id: 'KTHD', code: 'KTHD', name: 'Kinh Thánh Hiện Đại (KTHD)', lang: 'vi', category: 'Tiếng Việt', note: 'Bản dịch Kinh Thánh Hiện Đại (Bible.com #1638 / Biblica) văn phong hiện đại, gần gũi, dễ hiểu' },
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

export const THEMES_LIST = [
  {
    id: 'dark',
    name: 'Dạ Kim Hoàng Gia',
    subtitle: 'Nền tối trầm mặc • Vàng kim quý phái (Chống mỏi mắt ban đêm)',
    icon: 'fa-moon',
    palette: ['#0a0d14', '#121824', '#f1f5f9', '#d4af37'],
    previewBg: '#0a0d14',
    previewCard: '#121824',
    previewText: '#f1f5f9',
    previewAccent: '#d4af37'
  },
  {
    id: 'parchment',
    name: 'Giấy Cổ Cuộn Kinh',
    subtitle: 'Tone kem ngà ấm áp • Chữ nâu sẫm cổ điển (Dịu mắt ban ngày)',
    icon: 'fa-scroll',
    palette: ['#fcf8ee', '#f4ecd8', '#272118', '#966708'],
    previewBg: '#fcf8ee',
    previewCard: '#f4ecd8',
    previewText: '#272118',
    previewAccent: '#966708'
  },
  {
    id: 'light',
    name: 'Trang Sách Trắng Tinh',
    subtitle: 'Nền trắng tinh khôi • Chữ đen mực sắc nét như trang sách in',
    icon: 'fa-sun',
    palette: ['#ffffff', '#f8fafc', '#0f172a', '#b45309'],
    previewBg: '#ffffff',
    previewCard: '#f8fafc',
    previewText: '#0f172a',
    previewAccent: '#b45309'
  },
  {
    id: 'sepia',
    name: 'Hổ Phách Hoàng Hôn',
    subtitle: 'Nâu trà ấm dịu • Triệt tiêu ánh sáng xanh khi đọc lâu',
    icon: 'fa-mug-saucer',
    palette: ['#f5ebd7', '#ebdcc4', '#382618', '#a05214'],
    previewBg: '#f5ebd7',
    previewCard: '#ebdcc4',
    previewText: '#382618',
    previewAccent: '#a05214'
  },
  {
    id: 'midnight',
    name: 'Biển Hồ Ga-li-lê',
    subtitle: 'Xanh thẫm huyền bí • Ngọc lam đại dương sâu lắng tĩnh tâm',
    icon: 'fa-water',
    palette: ['#080e1a', '#0f1b2f', '#e2e8f0', '#38bdf8'],
    previewBg: '#080e1a',
    previewCard: '#0f1b2f',
    previewText: '#e2e8f0',
    previewAccent: '#38bdf8'
  },
  {
    id: 'sage',
    name: 'Vườn Ô-liu Tĩnh Lặng',
    subtitle: 'Xanh lục bảo thiền tịnh • An định và thanh thản tâm hồn',
    icon: 'fa-seedling',
    palette: ['#0a1410', '#11221b', '#ecfdf5', '#10b981'],
    previewBg: '#0a1410',
    previewCard: '#11221b',
    previewText: '#ecfdf5',
    previewAccent: '#10b981'
  }
];

export const FONT_SIZES = [
  { id: 'small', label: 'Nhỏ (17px)', size: '1.05rem', lineHeight: '1.75' },
  { id: 'medium', label: 'Vừa (19px)', size: '1.18rem', lineHeight: '1.9' },
  { id: 'large', label: 'Lớn (22px)', size: '1.35rem', lineHeight: '2.0' },
  { id: 'xlarge', label: 'Rất Lớn (25px)', size: '1.55rem', lineHeight: '2.15' }
];

export class AppState {
  constructor() {
    this.listeners = [];

    // Current Reading Context
    this.currentBook = 'JHN';
    this.currentChapter = 1;
    this.currentVerse = 1;
    this.currentGenre = 'all';

    // Primary Reading Bible Version (Bản Kinh Thánh đọc chính trên màn hình chính)
    this.primaryVersion = storage.getPreference('primary_version', 'BTT');

    // Active Parallel Translations (Tự động bật sẵn KTHD - Kinh Thánh Hiện Đại trong danh sách đối chiếu)
    const savedVersions = storage.getPreference('active_versions', ['BTT', 'KTHD', 'BDM', 'KJV', 'ESV']);
    this.activeVersions = Array.isArray(savedVersions)
      ? savedVersions.filter(v => v !== 'TSK_BTT' && v !== 'TSK')
      : ['BTT', 'KTHD', 'BDM', 'KJV', 'ESV'];
    if (this.activeVersions.length === 0) {
      this.activeVersions = ['BTT', 'KTHD', 'BDM', 'KJV', 'ESV'];
    }
    if (!storage.getPreference('kthd_auto_added_v1', false)) {
      if (!this.activeVersions.includes('KTHD')) {
        const bttIdx = this.activeVersions.indexOf('BTT');
        if (bttIdx !== -1) {
          this.activeVersions.splice(bttIdx + 1, 0, 'KTHD');
        } else {
          this.activeVersions.unshift('KTHD');
        }
      }
      storage.savePreference('kthd_auto_added_v1', true);
    }
    storage.savePreference('active_versions', this.activeVersions);

    // Ngôn ngữ hiển thị cho Tab riêng biệt "KT Đối Chiếu" (BibleHub TSK): 'vi' (Vietnamese - BTT 1925) hoặc 'en' (English - BibleHub TSK)
    this.tskLanguage = storage.getPreference('tsk_language', 'vi');

    // Visual Theme (dark, parchment, light, sepia, midnight, sage)
    this.currentTheme = storage.getPreference('theme', 'dark');

    // Font Size Preference (small, medium, large, xlarge)
    this.currentFontSize = storage.getPreference('font_size', 'medium');

    // User Role: 'guest' or 'admin'
    this.currentUserRole = storage.getPreference('user_role', 'guest');

    // Admin Banner Configuration
    this.adminBannerConfig = storage.getAdminBanner();

    // Active View: 'bible', 'blog', 'community', 'media'
    this.activeView = 'bible';

    // Active Drawer Tab: 'parallel', 'metaphors', 'crossref', 'context', 'ai'
    this.activeDrawerTab = 'parallel';
    this.isDrawerOpen = false;

    // Chế độ hiển thị: Trên máy tính (>= 992px) luôn luôn là 'standard' (Đọc chuẩn + Bảng Đối Chiếu Drawer Inspector bên phải)
    // Chế độ 'parallel' chỉ áp dụng khi người dùng trên thiết bị di động (< 992px) chuyển đổi
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 991;
    this.readingMode = isMobile ? storage.getPreference('reading_mode', 'standard') : 'standard';
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

  setCurrentVerse(verseNum) {
    this.selectVerse(verseNum, true);
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
      if (this.activeVersions.length < 25) {
        this.activeVersions.push(versionId);
      } else {
        alert('Tối đa có thể chọn 25 bản dịch để đối chiếu song song.');
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

  // Quản lý Bản Kinh Thánh Đọc Chính (Primary Reading Version)
  setPrimaryVersion(versionId) {
    if (!versionId) return;
    this.primaryVersion = versionId;
    storage.savePreference('primary_version', versionId);
    this.notify('PRIMARY_VERSION_CHANGED', { primaryVersion: versionId });
  }

  // Theme & Color Palette Management
  setTheme(themeName) {
    this.currentTheme = themeName;
    storage.savePreference('theme', themeName);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeName);
    }
    this.notify('THEME_CHANGED', { theme: themeName });
  }

  setFontSize(fontSize) {
    this.currentFontSize = fontSize;
    storage.savePreference('font_size', fontSize);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-font-size', fontSize);
    }
    this.notify('FONT_SIZE_CHANGED', { fontSize });
  }

  toggleTheme() {
    const themeOrder = ['dark', 'parchment', 'light', 'sepia', 'midnight', 'sage'];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    this.setTheme(themeOrder[nextIndex]);
  }

  // Quản lý Chế Độ Đọc: 'standard' (Đọc thường) | 'parallel' (Đọc đối chiếu đa bản dịch trực tiếp)
  setReadingMode(mode) {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      mode = 'standard';
    }
    if (this.readingMode === mode) return;
    this.readingMode = mode;
    storage.savePreference('reading_mode', mode);
    this.notify('READING_MODE_CHANGED', { readingMode: this.readingMode });
  }

  toggleReadingMode() {
    if (typeof window !== 'undefined' && window.innerWidth >= 992) {
      this.setReadingMode('standard');
      return 'standard';
    }
    const nextMode = this.readingMode === 'parallel' ? 'standard' : 'parallel';
    this.setReadingMode(nextMode);
    return nextMode;
  }

  // Role Authentication Gate (Username & Password)
  verifyAdminCredentials(username, password) {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim();

    // Tài khoản quản trị mặc định: admin / logos777 (hoặc tài khoản tùy chỉnh trong storage)
    const customCreds = storage.getPreference('admin_credentials', null);
    const validUser = (customCreds?.username || 'admin').toLowerCase();
    const validPass = customCreds?.password || 'logos777';

    if (u === validUser && p === validPass) {
      this.currentUserRole = 'admin';
      storage.savePreference('user_role', 'admin');
      this.notify('ROLE_CHANGED', { role: 'admin' });
      return true;
    }
    return false;
  }

  verifyAdminSecret(secretKey) {
    // Zero-tamper security: Admin key validation (backward compatibility)
    return this.verifyAdminCredentials('admin', secretKey);
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

  setTSKLanguage(lang) {
    const cleanLang = (lang === 'en') ? 'en' : 'vi';
    this.tskLanguage = cleanLang;
    storage.savePreference('tsk_language', cleanLang);
    this.notify('TSK_LANGUAGE_CHANGED', { lang: cleanLang });
  }
}

export const state = new AppState();
