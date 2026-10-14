/* ==========================================================================
   LOGOS MULTIVERSE - PARALLEL BIBLE ENGINE
   Multi-Translation Comparison, Verse Alignment & Text Diffing
   ========================================================================== */

import { ALL_TRANSLATIONS } from './state.js';
import { storage } from './storage.js';

export class BibleEngine {
  constructor() {
    this.books = [];
    this.passagesCache = {};
    this.isLoaded = false;
  }

  async init() {
    await this.loadBooks();
    await this.loadPassage('JHN', 1);
    this.isLoaded = true;
  }

  async loadBooks() {
    try {
      const res = await fetch('data/books-metadata.json');
      this.books = await res.json();
      return this.books;
    } catch (e) {
      console.error('Failed to load books metadata:', e);
      return [];
    }
  }

  getBookById(bookId) {
    return this.books.find(b => b.id === bookId) || null;
  }

  async loadPassage(bookId, chapterNum) {
    const key = `${bookId}.${chapterNum}`;
    if (this.passagesCache[key]) {
      return this.passagesCache[key];
    }

    // Try IndexedDB offline storage first
    const cached = await storage.getCachedPassage(key);
    if (cached) {
      this.passagesCache[key] = cached;
      return cached;
    }

    try {
      const res = await fetch('data/default-bible-passages.json');
      const allPassages = await res.json();
      if (allPassages[key]) {
        this.passagesCache[key] = allPassages[key];
        await storage.cachePassage(key, allPassages[key]);
        return allPassages[key];
      }
    } catch (e) {
      console.warn('Local passages fetch failed:', e);
    }

    // Fallback template for any chapter
    const book = this.getBookById(bookId) || { name_vi: bookId, name_en: bookId };
    const fallbackPassage = {
      ref: `${book.name_vi} ${chapterNum}`,
      book_id: bookId,
      chapter_num: chapterNum,
      title_vi: `${book.name_vi} - Đoạn ${chapterNum}`,
      verses: [
        {
          verse_num: 1,
          text_primary: `Văn bản Lời Chúa đoạn ${chapterNum} sách ${book.name_vi}. Khám phá Lời Hằng Sống với ánh sáng của Thánh Linh.`,
          metaphor_id: null,
          translations: {
            BTT: `[BTT 1925] ${book.name_vi} ${chapterNum}:1 - Đức Giê-hô-va phán cùng dân sự Ngài trong sự thành tín và công chính trọn vẹn.`,
            BDM: `[BDM 2002] ${book.name_vi} ${chapterNum}:1 - Đức Chúa Trời phán dạy dân Ngài trong tình yêu thương và sự cứu rỗi vĩnh cửu.`,
            KJV: `[KJV 1611] ${book.name_en} ${chapterNum}:1 - In the faithful word of the Lord, let righteousness shine forth upon His people.`,
            ESV: `[ESV] ${book.name_en} ${chapterNum}:1 - The word of God endures forever, guiding the righteous in His eternal truth.`
          },
          cross_refs: ["Thi thiên 119:105", "2 Ti-mô-thê 3:16"]
        }
      ]
    };

    this.passagesCache[key] = fallbackPassage;
    return fallbackPassage;
  }

  // Render HTML for Focus Reader Canvas
  renderChapterHTML(passageData, activeVersions = ['BTT', 'BDM']) {
    const book = this.getBookById(passageData.book_id) || { genre: 'torah', name_vi: passageData.book_id };
    const genreColor = `var(--genre-${book.genre}, var(--accent-gold))`;

    let html = `
      <div class="chapter-header">
        <span class="chapter-badge" style="background: ${genreColor}; color: #fff;">
          ${book.name_vi.toUpperCase()} • ĐOẠN ${passageData.chapter_num}
        </span>
        <h2 class="chapter-title">${passageData.title_vi || passageData.ref}</h2>
        <p class="chapter-subtitle">Nhấp vào từng câu để mở bảng đối chiếu và giải nghĩa chuyên sâu</p>
      </div>
      <div class="chapter-verses-list">
    `;

    passageData.verses.forEach(v => {
      // Find metaphor indicator
      let metaphorIcon = '';
      if (v.metaphor_id) {
        metaphorIcon = `<span class="metaphor-trigger" data-metaphor="${v.metaphor_id}" title="Có hình ảnh ẩn dụ: Nhấp để xem giải nghĩa">✦ [Ẩn dụ]</span>`;
      }

      html += `
        <div class="verse-item" data-verse="${v.verse_num}">
          <span class="verse-number">${v.verse_num}</span>
          <span class="verse-text">${v.text_primary}</span>
          ${metaphorIcon}
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  // Get Parallel Translations for a single verse
  getParallelVerses(bookId, chapterNum, verseNum, selectedVersions = null) {
    const key = `${bookId}.${chapterNum}`;
    const passage = this.passagesCache[key];
    if (!passage) return [];

    const verse = passage.verses.find(v => v.verse_num === parseInt(verseNum, 10));
    if (!verse || !verse.translations) return [];

    const versionsToInclude = selectedVersions || ALL_TRANSLATIONS.map(t => t.id);
    const results = [];

    ALL_TRANSLATIONS.forEach(t => {
      if (versionsToInclude.includes(t.id) && verse.translations[t.id]) {
        results.push({
          version_id: t.id,
          version_name: t.name,
          category: t.category,
          lang: t.lang,
          text: verse.translations[t.id]
        });
      }
    });

    return results;
  }

  // Word-level diff highlighter between two translation texts
  diffWords(textA, textB) {
    if (!textA || !textB) return textA;
    const wordsA = textA.split(/\s+/);
    const wordsB = new Set(textB.toLowerCase().replace(/[,.:;?!]/g, '').split(/\s+/));

    return wordsA.map(word => {
      const clean = word.toLowerCase().replace(/[,.:;?!]/g, '');
      if (!wordsB.has(clean) && clean.length > 2) {
        return `<span class="word-diff-highlight">${word}</span>`;
      }
      return word;
    }).join(' ');
  }

  // Omni-Search Engine
  searchScripture(query, metaphorsDatabase = []) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    const results = [];

    // 1. Search coordinates (e.g. "Giang 1", "Giang 1:1", "Mat 5:13", "Gen 1")
    const coordMatch = q.match(/^([a-z0-9\s]+?)\s*(\d+)(?::(\d+))?$/i);
    if (coordMatch) {
      const searchBook = coordMatch[1].trim().toLowerCase();
      const chapter = parseInt(coordMatch[2], 10);
      const verse = coordMatch[3] ? parseInt(coordMatch[3], 10) : 1;

      const matchedBook = this.books.find(b =>
        b.name_vi.toLowerCase().includes(searchBook) ||
        b.name_en.toLowerCase().includes(searchBook) ||
        b.id.toLowerCase() === searchBook
      );

      if (matchedBook) {
        results.push({
          type: 'coordinate',
          badge: 'TỌA ĐỘ',
          title: `${matchedBook.name_vi} ${chapter}:${verse}`,
          subtitle: `Nhảy đến ${matchedBook.name_vi} đoạn ${chapter}`,
          book_id: matchedBook.id,
          chapter: chapter,
          verse: verse
        });
      }
    }

    // 2. Search Metaphors
    metaphorsDatabase.forEach(m => {
      if (m.title_vi.toLowerCase().includes(q) || m.theological_meaning.toLowerCase().includes(q)) {
        results.push({
          type: 'metaphor',
          badge: 'ẨN DỤ',
          title: m.title_vi,
          subtitle: m.theological_meaning.substring(0, 75) + '...',
          metaphor_id: m.id
        });
      }
    });

    // 3. Search Books
    this.books.forEach(b => {
      if (b.name_vi.toLowerCase().includes(q) || b.theme.toLowerCase().includes(q)) {
        results.push({
          type: 'book',
          badge: 'SÁCH',
          title: `${b.name_vi} (${b.name_en})`,
          subtitle: `${b.theme.substring(0, 60)}...`,
          book_id: b.id,
          chapter: 1,
          verse: 1
        });
      }
    });

    return results.slice(0, 8);
  }
}

export const bibleEngine = new BibleEngine();
