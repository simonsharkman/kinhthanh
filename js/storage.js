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

  // Admin Banner Storage (Supports Verse, Announcement & Ad Banner with Image, URL & Marquee)
  saveAdminBanner(config) {
    this.savePreference('admin_banner', config);
  }

  getAdminBanner() {
    const banner = this.getPreference('admin_banner', null);
    if (!banner || (banner.text && banner.text.includes('Ban đầu có Ngôi Lời'))) {
      return {
        visible: true,
        type: 'announcement', // 'verse', 'announcement', 'ad'
        badge: 'THÔNG BÁO',
        text: '🔔 Chương trình Đọc Kinh Thánh Trọn Năm 2026 & Bồi Linh Hội Thánh đang diễn ra. Chúc quý con cái Chúa được tươi mới trong Lời Ngài!',
        btnText: 'Vào Cổng Tĩnh Nguyện',
        theme: 'theme-crimson',
        targetRef: '#portal',
        targetUrl: '#portal',
        imageUrl: '',
        marquee: true,
        useAdSense: false
      };
    }
    return banner;
  }

  // Master Blogs Storage
  saveMasterBlogs(blogs) {
    this.savePreference('master_blogs', blogs);
  }

  getMasterBlogs(defaultBlogs = []) {
    return this.getPreference('master_blogs', defaultBlogs);
  }

  // Community Posts Storage
  saveCommunityPosts(posts) {
    this.savePreference('community_posts', posts);
  }

  getCommunityPosts(defaultPosts = []) {
    return this.getPreference('community_posts', defaultPosts);
  }

  // Reader Analytics & Metrics Intelligence
  getAnalytics() {
    const defaultData = {
      total_visits: 1845,
      unique_visitors: 420,
      total_verses_read: 16850,
      avg_time_minutes: 24,
      top_passages: [
        { ref: 'JHN.1', label: 'Giăng 1 (Ngôi Lời Nhập Thể)', count: 542, percent: 89 },
        { ref: 'PSA.23', label: 'Thi Thiên 23 (Chúa Là Đấng Chăn Giữ)', count: 485, percent: 80 },
        { ref: 'GEN.1', label: 'Sáng Thế Ký 1 (Sự Sáng Tạo)', count: 430, percent: 71 },
        { ref: 'ROM.8', label: 'Rô-ma 8 (Đắc Thắng Trong Đấng Christ)', count: 390, percent: 64 },
        { ref: 'REV.21', label: 'Khải Huyền 21 (Trời Mới Đất Mới)', count: 345, percent: 57 },
        { ref: 'JOS.24', label: 'Giô-suê 24 (Ta Và Nhà Ta Phục Sự Chúa)', count: 295, percent: 48 },
        { ref: '1CO.13', label: '1 Cô-rinh-tô 13 (Bài Ca Yêu Thương)', count: 260, percent: 43 }
      ],
      top_translations: [
        { id: 'BTT', name: 'Bản Truyền Thống 1925 (BTT)', count: 1420, percent: 86 },
        { id: 'BDM', name: 'Bản Dịch Mới 2002 (BDM)', count: 960, percent: 58 },
        { id: 'BTHD', name: 'Bản Truyền Thống Hiệu Đính (RVV11)', count: 820, percent: 50 },
        { id: 'ORIGINAL', name: 'Interlinear Hy Lạp / Hê-bơ-rơ + Strong’s', count: 710, percent: 43 },
        { id: 'KJV', name: 'King James Version 1611 (KJV)', count: 615, percent: 37 },
        { id: 'EDE', name: 'Kinh Thánh Tiếng Ê-đê (RRB)', count: 340, percent: 21 },
        { id: 'JARAI', name: 'Kinh Thánh Tiếng Gia-rai (JBSV)', count: 285, percent: 17 }
      ],
      top_metaphors: [
        { name: 'Chiên Con (Lamb of God)', count: 580 },
        { name: 'Cây Nho Thật (True Vine)', count: 520 },
        { name: 'Bánh Sự Sống (Bread of Life)', count: 460 },
        { name: 'Nước Sống (Living Water)', count: 410 },
        { name: 'Đá Góc Nhà (Chief Cornerstone)', count: 375 },
        { name: 'Muối & Ánh Sáng (Salt & Light)', count: 330 }
      ],
      top_articles: [
        { id: 'art_logos_incarnation', title: "Ngôi Lời Nhập Thể: Mầu Nhiệm 'Logos'", views: 1120 },
        { id: 'art_typology_lamb', title: 'Hành Trình Chiên Con: Sợi Chỉ Đỏ Cứu Chuộc', views: 890 }
      ],
      top_queries: [
        { query: 'Giăng 3:16', count: 380 },
        { query: 'Ngôi Lời', count: 310 },
        { query: 'Cứu Rỗi', count: 250 },
        { query: 'Đền Tạm', count: 215 },
        { query: 'Khải Huyền', count: 180 }
      ]
    };
    return this.getPreference('analytics_data', defaultData);
  }

  saveAnalytics(data) {
    this.savePreference('analytics_data', data);
  }

  recordPassageVisit(book, chapter) {
    const data = this.getAnalytics();
    data.total_verses_read = (data.total_verses_read || 0) + 1;
    const refKey = `${book}.${chapter}`;
    let item = data.top_passages.find(p => p.ref === refKey);
    if (item) {
      item.count += 1;
    } else {
      data.top_passages.push({
        ref: refKey,
        label: `${book} ${chapter}`,
        count: 1,
        percent: 10
      });
    }
    // Recompute percentage based on max
    const maxCount = Math.max(...data.top_passages.map(p => p.count), 1);
    data.top_passages.forEach(p => {
      p.percent = Math.min(100, Math.round((p.count / maxCount) * 100));
    });
    data.top_passages.sort((a, b) => b.count - a.count);
    this.saveAnalytics(data);
  }

  recordTranslationUsed(versionId) {
    const data = this.getAnalytics();
    let item = data.top_translations.find(t => t.id === versionId);
    if (item) {
      item.count += 1;
    } else {
      data.top_translations.push({
        id: versionId,
        name: versionId,
        count: 1,
        percent: 10
      });
    }
    const maxCount = Math.max(...data.top_translations.map(t => t.count), 1);
    data.top_translations.forEach(t => {
      t.percent = Math.min(100, Math.round((t.count / maxCount) * 100));
    });
    data.top_translations.sort((a, b) => b.count - a.count);
    this.saveAnalytics(data);
  }

  recordArticleVisit(articleId, title = '') {
    const data = this.getAnalytics();
    let item = data.top_articles.find(a => a.id === articleId);
    if (item) {
      item.views = (item.views || 0) + 1;
    } else {
      data.top_articles.push({
        id: articleId,
        title: title || articleId,
        views: 1
      });
    }
    data.top_articles.sort((a, b) => (b.views || 0) - (a.views || 0));
    this.saveAnalytics(data);
  }

  recordSearchQuery(query) {
    if (!query || query.trim().length < 2) return;
    const cleanQ = query.trim();
    const data = this.getAnalytics();
    let item = data.top_queries.find(q => q.query.toLowerCase() === cleanQ.toLowerCase());
    if (item) {
      item.count += 1;
    } else {
      data.top_queries.push({ query: cleanQ, count: 1 });
    }
    data.top_queries.sort((a, b) => b.count - a.count);
    if (data.top_queries.length > 15) {
      data.top_queries = data.top_queries.slice(0, 15);
    }
    this.saveAnalytics(data);
  }

  recordSessionVisit() {
    try {
      if (!sessionStorage.getItem('logos_session_recorded')) {
        sessionStorage.setItem('logos_session_recorded', 'true');
        const data = this.getAnalytics();
        data.total_visits = (data.total_visits || 0) + 1;
        if (!localStorage.getItem('logos_unique_user')) {
          localStorage.setItem('logos_unique_user', 'true');
          data.unique_visitors = (data.unique_visitors || 0) + 1;
        }
        this.saveAnalytics(data);
      }
    } catch (e) {
      // ignore in restricted environments
    }
  }

  // Website Feedbacks & Reader Suggestions (Tiếp nhận góp ý xây dựng Website)
  getWebsiteFeedbacks() {
    const defaultFeedbacks = [
      {
        id: 'fb_default_1',
        author: 'Tín hữu Hội Thánh Tin Lành Buôn Ma Thuột',
        contact: 'Ẩn danh',
        category: 'Lời tâm tình & Cầu nguyện',
        message: 'Cảm tạ Chúa vì trang web có cả bản dịch tiếng Ê-đê, Gia-rai, KTHD và mục Kinh Thánh Đối Chiếu TSK rất chi tiết. Xin Chúa ban ơn và tiếp trợ cho anh Y Simon Ktul duy trì trang web phục vụ Hội Thánh!',
        created_at: '2026-10-25'
      },
      {
        id: 'fb_default_2',
        author: 'Độc giả Thánh Kinh',
        contact: 'Ẩn danh',
        category: 'Góp ý tính năng & Giao diện',
        message: 'Giao diện chia đôi 50/50 trên điện thoại để đối chiếu nhiều bản dịch cùng lúc rất tiện lợi khi học Kinh Thánh nhóm nhỏ.',
        created_at: '2026-10-25'
      }
    ];
    return this.getPreference('website_feedbacks', defaultFeedbacks);
  }

  saveWebsiteFeedback(feedback) {
    const list = this.getWebsiteFeedbacks();
    const item = {
      id: `fb_${Date.now()}`,
      author: (feedback.author || 'Độc giả yêu mến Lời Chúa').trim(),
      contact: (feedback.contact || '').trim(),
      category: feedback.category || 'Góp ý xây dựng Website',
      message: (feedback.message || '').trim(),
      created_at: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    this.savePreference('website_feedbacks', list);
    return item;
  }

  deleteWebsiteFeedback(id) {
    const list = this.getWebsiteFeedbacks().filter(item => item.id !== id);
    this.savePreference('website_feedbacks', list);
    return list;
  }

  // Google AdSense Configuration (Cho phép Google hiển thị quảng cáo duy trì Website)
  getAdSenseConfig() {
    return this.getPreference('google_adsense_config', {
      enabled: true,
      publisherId: 'ca-pub-9368045059000000',
      slotReaderBottom: '9368045059',
      slotDonatePage: '3680450590',
      autoAds: true
    });
  }

  saveAdSenseConfig(config) {
    const current = this.getAdSenseConfig();
    const updated = { ...current, ...config };
    this.savePreference('google_adsense_config', updated);
    return updated;
  }

  // --- 1. Portal Devotion CMS Storage ---
  getDevotionData(fallback = null) {
    const defaultData = fallback || {
      verse: {
        book: 'HAB',
        ch: 3,
        v: 19,
        ref: 'Ha-ba-cúc 3:19',
        text: 'Đức Giê-hô-va là Chúa, là sức mạnh của tôi, Ngài làm cho chân tôi giống như chân con hươu, Khiến tôi đi trên các nơi cao của mình. (Phó cho quan phường nhạc, khảy đàn mà hát bài nầy).'
      },
      reading_plan: [
        { title: 'Cựu Ước & Tân Ước:', text: 'Giê-rê-mi 20. Giê-rê-mi 35-36. Cô-lô-se 4.', audioBook: 'JER', audioCh: 20 },
        { title: 'Sáng-thế Ký - Khải-huyền:', text: 'Mác 14:12-15:47.', audioBook: 'MRK', audioCh: 14 },
        { title: 'Đọc Tân Ước Trong Ba Tháng:', text: 'Lu-ca 21-22.', audioBook: 'LUK', audioCh: 21 },
        { title: 'Đọc Trong Ba Năm:', text: 'Gióp 22.', audioBook: 'JOB', audioCh: 22 }
      ],
      daily_article: {
        title: 'Áp Bức Người Cùng Khốn',
        passage_ref: 'Châm Ngôn 22:22-23',
        book: 'PRO',
        ch: 22,
        v: 22,
        content: 'Chớ bóc lột kẻ nghèo khó bởi vì họ nghèo khó, và cũng đừng ức hiếp kẻ khốn cùng nơi cửa thành. Vì Đức Giê-hô-va sẽ bênh vực duyên cớ của họ...'
      },
      spiritual_guide: [
        { need: 'Cảm thấy buồn rầu', passages: 'Giăng 14, Thi-thiên 46' },
        { need: 'Cảm thấy Đức Chúa Trời dường như ở xa', passages: 'Thi-thiên 139' },
        { need: 'Cần can đảm', passages: 'Giô-suê 1:1-9' },
        { need: 'Cần đảm bảo', passages: 'Rô-ma 8' },
        { need: 'Cần biết ý muốn của Đức Chúa Trời cho cuộc đời bạn', passages: 'Châm-ngôn 3:1-6' },
        { need: 'Cần những chỉ dẫn trong đời sống', passages: 'Ma-thi-ơ 5-7, Rô-ma 12' }
      ]
    };
    return this.getPreference('portal_devotion_data', defaultData);
  }

  saveDevotionData(data) {
    this.savePreference('portal_devotion_data', data);
    return data;
  }

  getDevotionDataForDate(dateKey) {
    if (!dateKey) return null;
    return this.getPreference(`portal_devotion_date_${dateKey}`, null);
  }

  saveDevotionDataForDate(dateKey, data) {
    if (!dateKey) return;
    this.savePreference(`portal_devotion_date_${dateKey}`, data);
    return data;
  }

  // --- 2. Scripture Verse Correction Storage (Hiệu đính Lời Chúa khi phát hiện lỗi) ---
  getVerseCorrections() {
    return this.getPreference('verse_corrections', {});
  }

  getVerseCorrection(bookId, chapterNum, verseNum, version = 'BTT') {
    const all = this.getVerseCorrections();
    const key = `${bookId}_${chapterNum}_${verseNum}_${version}`.toUpperCase();
    return all[key] || null;
  }

  saveVerseCorrection({ bookId, chapterNum, verseNum, version = 'BTT', originalText = '', correctedText, note = '' }) {
    const all = this.getVerseCorrections();
    const key = `${bookId}_${chapterNum}_${verseNum}_${version}`.toUpperCase();
    all[key] = {
      bookId,
      chapterNum: parseInt(chapterNum, 10),
      verseNum: parseInt(verseNum, 10),
      version,
      originalText,
      correctedText: (correctedText || '').trim(),
      note: (note || '').trim(),
      updated_at: new Date().toLocaleString('vi-VN')
    };
    this.savePreference('verse_corrections', all);
    return all[key];
  }

  deleteVerseCorrection(bookId, chapterNum, verseNum, version = 'BTT') {
    const all = this.getVerseCorrections();
    const key = `${bookId}_${chapterNum}_${verseNum}_${version}`.toUpperCase();
    if (all[key]) {
      delete all[key];
      this.savePreference('verse_corrections', all);
      return true;
    }
    return false;
  }

  // --- 3. Seasonal Visual Media Library Storage ---
  getVisualMediaLibrary() {
    return this.getPreference('visual_media_library', null);
  }

  saveVisualMediaLibrary(mediaData) {
    this.savePreference('visual_media_library', mediaData);
    return mediaData;
  }

  // --- 4. TIỂU MỤC CMS STORAGE (Câu Gốc, Đố Kinh Thánh, Truyện Tích, Đối Đáp) ---
  getUtilityFavVerses() {
    return this.getPreference('utility_fav_verses', null);
  }

  saveUtilityFavVerses(list) {
    this.savePreference('utility_fav_verses', list);
    return list;
  }

  resetUtilityFavVerses() {
    localStorage.removeItem('logos_pref_utility_fav_verses');
  }

  getUtilityQuizzes() {
    return this.getPreference('utility_quizzes', null);
  }

  saveUtilityQuizzes(list) {
    this.savePreference('utility_quizzes', list);
    return list;
  }

  resetUtilityQuizzes() {
    localStorage.removeItem('logos_pref_utility_quizzes');
  }

  getUtilityStories() {
    return this.getPreference('utility_stories', null);
  }

  saveUtilityStories(list) {
    this.savePreference('utility_stories', list);
    return list;
  }

  resetUtilityStories() {
    localStorage.removeItem('logos_pref_utility_stories');
  }

  getUtilityResponsiveReadings() {
    return this.getPreference('utility_responsive', null);
  }

  saveUtilityResponsiveReadings(list) {
    this.savePreference('utility_responsive', list);
    return list;
  }

  resetUtilityResponsiveReadings() {
    localStorage.removeItem('logos_pref_utility_responsive');
  }

  getUtilityStrongDict() {
    return this.getPreference('utility_strong_dict', null);
  }

  saveUtilityStrongDict(list) {
    this.savePreference('utility_strong_dict', list);
    return list;
  }

  resetUtilityStrongDict() {
    localStorage.removeItem('logos_pref_utility_strong_dict');
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
