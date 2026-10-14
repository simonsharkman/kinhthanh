/* ==========================================================================
   LOGOS MULTIVERSE - STORAGE ENGINE
   IndexedDB (LogosDB) & LocalStorage Offline Cache
   ========================================================================== */

const DB_NAME = 'LogosMultiVerseDB';
const DB_VERSION = 1;
const STORE_PASSAGES = 'passages_cache';
const STORE_NOTES = 'study_notes';
const STORE_BOOKMARKS = 'bookmarks';

export class LogosStorage {
  constructor() {
    this.db = null;
    this.initIndexedDB();
  }

  initIndexedDB() {
    if (typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not supported, falling back to LocalStorage');
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PASSAGES)) {
        db.createObjectStore(STORE_PASSAGES, { keyPath: 'passage_key' });
      }
      if (!db.objectStoreNames.contains(STORE_NOTES)) {
        db.createObjectStore(STORE_NOTES, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'verse_ref' });
      }
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
    };
  }

  // Preference Storage (LocalStorage)
  savePreference(key, value) {
    try {
      localStorage.setItem(`logos_pref_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  getPreference(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`logos_pref_${key}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  // Admin Banner Storage
  saveAdminBanner(config) {
    this.savePreference('admin_banner', config);
  }

  getAdminBanner() {
    return this.getPreference('admin_banner', {
      visible: true,
      badge: 'CÂU GỐC TUẦN',
      text: '"Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời." (Giăng 1:1)',
      btnText: 'Khám Phá Đối Chiếu',
      theme: 'theme-gold',
      targetRef: 'JHN.1.1'
    });
  }

  // Passage Offline Caching via IndexedDB
  async cachePassage(passageKey, data) {
    if (!this.db) {
      this.savePreference(`cache_${passageKey}`, data);
      return;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([STORE_PASSAGES], 'readwrite');
      const store = tx.objectStore(STORE_PASSAGES);
      const req = store.put({ passage_key: passageKey, data, cached_at: Date.now() });
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async getCachedPassage(passageKey) {
    if (!this.db) {
      return this.getPreference(`cache_${passageKey}`, null);
    }
    return new Promise((resolve) => {
      const tx = this.db.transaction([STORE_PASSAGES], 'readonly');
      const store = tx.objectStore(STORE_PASSAGES);
      const req = store.get(passageKey);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = () => resolve(null);
    });
  }
}

export const storage = new LogosStorage();
