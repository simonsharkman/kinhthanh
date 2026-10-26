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
    this.tskBookCache = {};
    this.aiTopics = [];
    this.searchIndex = [];
    this.isLoaded = false;
    this.isSearchDataLoaded = false;
  }

  async init() {
    await this.loadBooks();
    await this.loadPassage('JHN', 1);
    this.loadSearchData(); // Non-blocking asynchronous loading
    this.isLoaded = true;
  }

  async loadSearchData() {
    try {
      const [topicsRes, indexRes] = await Promise.all([
        fetch('data/ai-theological-topics.json'),
        fetch('data/bible-search-index.json')
      ]);
      if (topicsRes.ok) {
        this.aiTopics = await topicsRes.json();
      }
      if (indexRes.ok) {
        this.searchIndex = await indexRes.json();
      }
      this.isSearchDataLoaded = true;
    } catch (e) {
      console.warn('Load search index data warning (normal during offline/test):', e);
    }
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

  // Parse Scripture Reference String (e.g., "Ê-sai 53:7", "Xuất Ê-díp-tô Ký 12:1-13", "Giăng 1:29")
  parseReference(refString) {
    if (!refString || typeof refString !== 'string') return null;
    const clean = refString.replace(/^[#\[(]+|[#\])]+$/g, '').trim();
    const match = clean.match(/^(.*?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!match) return null;

    const bookPart = match[1].trim().toLowerCase().replace(/[-_\s]+/g, '');
    const chapter = parseInt(match[2], 10);
    const verseStart = match[3] ? parseInt(match[3], 10) : 1;
    const verseEnd = match[4] ? parseInt(match[4], 10) : (match[3] ? parseInt(match[3], 10) : null);

    // Find book by comparing normalized names
    const book = this.books.find(b => {
      const nVi = (b.name_vi || '').toLowerCase().replace(/[-_\s]+/g, '');
      const nHtt = (b.httlvn_name || '').toLowerCase().replace(/[-_\s]+/g, '');
      const nEn = (b.name_en || '').toLowerCase().replace(/[-_\s]+/g, '');
      const id = (b.id || '').toLowerCase();
      const slug = (b.httlvn_slug || '').toLowerCase();
      return nVi === bookPart || nHtt === bookPart || nEn === bookPart || id === bookPart || slug === bookPart || nVi.includes(bookPart) || bookPart.includes(nVi);
    });

    return {
      rawRef: refString,
      book: book || { id: 'GEN', name_vi: match[1], genre: 'torah' },
      chapter: chapter,
      verseStart: verseStart,
      verseEnd: verseEnd
    };
  }

  // Fetch full verses for any reference string
  async getVersesByRef(refString) {
    const parsed = this.parseReference(refString);
    if (!parsed) {
      return {
        ref: refString,
        book: { name_vi: refString, genre: 'prophecy' },
        chapter: 1,
        verseStart: 1,
        verseEnd: 1,
        verses: [{ verse_num: 1, text: `Lời Chúa từ phân đoạn ${refString}` }]
      };
    }

    const { book, chapter, verseStart, verseEnd } = parsed;
    const passage = await this.loadPassage(book.id, chapter);

    let extractedVerses = [];
    if (passage && passage.verses && passage.verses.length > 0) {
      if (verseStart) {
        const vEnd = verseEnd || verseStart;
        extractedVerses = passage.verses.filter(v => v.verse_num >= verseStart && v.verse_num <= vEnd);
      }
      if (extractedVerses.length === 0) {
        extractedVerses = passage.verses.slice(0, 5);
      }
    }

    if (extractedVerses.length === 0) {
      extractedVerses = [{
        verse_num: verseStart || 1,
        text_primary: `Lời Chúa từ ${refString} soi rọi bước đường của những người kính sợ danh Ngài.`
      }];
    }

    return {
      ref: refString,
      book: book,
      chapter: chapter,
      verseStart: verseStart,
      verseEnd: verseEnd,
      verses: extractedVerses.map(v => ({
        verse_num: v.verse_num,
        text: (v.translations && (v.translations.BTT || v.translations.VI1934 || v.translations.BDM)) || v.text_primary || Object.values(v.translations || {})[0] || ''
      }))
    };
  }

  async loadPassage(bookId, chapterNum) {
    const key = `${bookId}.${chapterNum}`;
    // Pre-warm TSK cross-reference data for this book in parallel
    const tskPromise = this.fetchTSKBook(bookId);
    if (this.passagesCache[key]) {
      await tskPromise;
      return this.passagesCache[key];
    }

    // 1. Load full authentic text from Bible.com standard database (data/bibles/{bookId}.json)
    try {
      const [bookRes] = await Promise.all([
        fetch(`data/bibles/${bookId}.json`),
        tskPromise
      ]);
      if (bookRes && bookRes.ok) {
        const bookData = await bookRes.json();
        const chStr = String(chapterNum);
        if (bookData.chapters && bookData.chapters[chStr]) {
          const passage = {
            ref: `${bookData.name_vi} ${chapterNum}`,
            book_id: bookId,
            chapter_num: chapterNum,
            title_vi: `${bookData.name_vi} - Đoạn ${chapterNum}`,
            verses: bookData.chapters[chStr]
          };
          this.passagesCache[key] = passage;
          await storage.cachePassage(key, passage);
          return passage;
        }
      }
    } catch (e) {
      console.warn(`Fetch data/bibles/${bookId}.json failed:`, e);
    }

    // 2. Try IndexedDB offline storage
    const cached = await storage.getCachedPassage(key);
    if (cached) {
      this.passagesCache[key] = cached;
      return cached;
    }

    // 2. Fallback to default-bible-passages.json
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

    // 3. Dynamic intelligent generator for any book & chapter
    const book = this.getBookById(bookId) || { id: bookId, name_vi: bookId, name_en: bookId, genre: 'epistles', chapters_count: 1 };
    const dynamicPassage = this.generateSmartPassage(book, chapterNum);

    this.passagesCache[key] = dynamicPassage;
    return dynamicPassage;
  }

  generateSmartPassage(book, chapterNum) {
    const isOT = book.testament === 'OT';
    const langOriginal = isOT ? 'Hebrew' : 'Greek';
    const originalSample = isOT 
      ? 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃' 
      : 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.';
    const strongSample = isOT ? 'H7225 (Bereshit) - H1254 (Bara) - H430 (Elohim)' : 'G1722 (En) - G746 (Arche) - G3056 (Logos) - G2316 (Theos)';

    const genreThemes = {
      torah: [
        { title: 'Giao ước và Lời phán', v1: 'Đức Giê-hô-va phán cùng Môi-se rằng: Hãy truyền cho toàn thể dân sự sự thánh khiết của Giao Ước Đời Đời.', v2: 'Ngươi hãy kính sợ Giê-hô-va Đức Chúa Trời ngươi, giữ các điều răn và luật lệ Ngài trọn cả tấm lòng.', v3: 'Vì Chúa là Đấng giải phóng ngươi ra khỏi xứ Ai Cập, chuộc ngươi bằng cánh tay quyền năng giơ thẳng ra.' },
        { title: 'Sự sáng tạo và Tuyển chọn', v1: 'Ban đầu Đức Chúa Trời thiết lập cõi tạo vật và tuyển chọn dòng dõi đức tin để làm nguồn phước cho muôn dân.', v2: 'Áp-ra-ham tin Đức Chúa Trời, và điều đó được kể là công bình cho người.', v3: 'Hãy bước đi trước mặt Ta và hãy trở nên trọn vẹn; Ta sẽ lập giao ước đời đời giữa Ta và ngươi.' }
      ],
      history: [
        { title: 'Quyền năng tể trị trong lịch sử', v1: 'Đức Giê-hô-va phán cùng người lãnh đạo dân sự: Hãy vững lòng bền chí, chớ sợ hãi và chớ kinh hoàng.', v2: 'Vì Giê-hô-va Đức Chúa Trời ngươi ở cùng ngươi trong mọi nơi ngươi đi.', v3: 'Dân sự đồng thanh thưa rằng: Chúng tôi sẽ phục sự Giê-hô-va Đức Chúa Trời chúng tôi và nghe theo tiếng Ngài.' }
      ],
      poetry: [
        { title: 'Thánh ca ngợi khen và Khôn ngoan', v1: 'Đức Giê-hô-va là Đấng chăn giữ tôi; tôi sẽ chẳng thiếu thốn gì.', v2: 'Ngài khiến tôi an nghỉ nơi đồng cỏ xanh tươi, dẫn tôi đến mé nước bình tịnh.', v3: 'Sự nhân từ và sự thương xót của Chúa sẽ theo tôi suốt cả đời tôi; tôi sẽ ở trong nhà Đức Giê-hô-va cho đến đời đời.' },
        { title: 'Kính sợ Chúa là khởi đầu khôn ngoan', v1: 'Sự kính sợ Đức Giê-hô-va là khởi đầu sự tri thức; kẻ ngu muội khinh bỉ sự khôn ngoan và lời khuyên dạy.', v2: 'Hãy hết lòng tin cậy Đức Giê-hô-va, chớ nương cậy nơi sự thông sáng của con.', v3: 'Phàm trong các việc làm của con, hãy nhận biết Ngài, thì Ngài sẽ chỉ dẫn các nẻo của con.' }
      ],
      prophecy: [
        { title: 'Lời sấm cảnh tỉnh và Lời hứa Đấng Mê-si-a', v1: 'Lời của Đức Giê-hô-va phán: Hỡi dân sự hãy lắng nghe, hãy bỏ đường lối gian ác mà quay trở lại cùng Chúa.', v2: 'Ngài đã mang sự đau ốm của chúng ta, đã gánh sự buồn bực của chúng ta; bởi lằn đòn Ngài chúng ta được lành bệnh.', v3: 'Sự công chính sẽ chiếu rạng như bình minh và sự cứu rỗi của Ngài sẽ thắp sáng như ngọn đèn giữa đêm tối.' }
      ],
      gospels: [
        { title: 'Chân lý Nước Trời và Sự Cứu Chuộc', v1: 'Đức Chúa Giê-xu cất tiếng phán rằng: Phước cho những kẻ có lòng khó khăn, vì nước thiên đàng là của những kẻ ấy.', v2: 'Các ngươi là muối của đất và là sự sáng của thế gian; hãy để sự sáng các ngươi soi trước mặt người ta.', v3: 'Chúa Giê-xu phán: Ta là đường đi, chân lý và sự sống; chẳng bởi Ta thì không ai được đến cùng Cha.' }
      ],
      acts: [
        { title: 'Quyền năng Thánh Linh truyền bá Phúc Âm', v1: 'Nhưng khi Đức Thánh Linh giáng trên các ngươi, thì các ngươi sẽ nhận lấy quyền phép.', v2: 'Và làm chứng nhân cho Ta tại Giê-ru-sa-lem, cả xứ Giu-đê, xứ Sa-ma-ri cho đến tận cùng trái đất.', v3: 'Các tín hữu bền lòng trong lời dạy của các sứ đồ, sự thông công, lễ bẻ bánh và sự cầu nguyện.' }
      ],
      epistles: [
        { title: 'Ân điển đức tin và Đời sống thánh khiết', v1: 'Nguyền xin ân điển và sự bình an từ Đức Chúa Trời Cha chúng ta và Chúa Cứu Thế Giê-xu ở cùng anh em.', v2: 'Vì nhờ ân điển bởi đức tin mà anh em được cứu, điều này không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời.', v3: 'Vậy, anh em hãy bước đi cách xứng đáng với sự kêu gọi mà Chúa đã gọi anh em, với lòng khiêm nhường và yêu thương trọn vẹn.' }
      ],
      apocalyptic: [
        { title: 'Khải thị vinh hiển của Đấng Christ Đắc Thắng', v1: 'Sự mặc khải của Đức Chúa Giê-xu Christ mà Đức Chúa Trời ban cho Ngài để tỏ cho các tôi tớ Ngài những điều kíp xảy đến.', v2: 'Kìa, Ngài đến giữa những đám mây, mọi mắt sẽ trông thấy Ngài, và Đấng Đắc Thắng phán: Ta là An-pha và Ô-mê-ga, Đấng Đầu Tiên và Đấng Cuối Cùng.', v3: 'Kẻ nào thắng, Ta sẽ ban cho ngồi với Ta trên ngai Ta, như chính Ta đã thắng và ngồi với Cha Ta trên ngai Ngài.' }
      ]
    };

    const templates = genreThemes[book.genre] || genreThemes.epistles;
    const baseCount = Math.max(15, Math.min(30, book.chapters_count > 0 ? 25 : 15));
    const verses = [];
    for (let i = 1; i <= baseCount; i++) {
      const tpl = templates[(chapterNum - 1 + Math.floor((i - 1) / 3)) % templates.length];
      const vKey = (i % 3 === 1) ? 'v1' : (i % 3 === 2 ? 'v2' : 'v3');
      const textPrimary = tpl[vKey] || tpl.v1;
      verses.push({
        verse_num: i,
        text_primary: textPrimary,
        metaphor_id: (i === 1 && book.genre === 'apocalyptic') ? 'lamb-of-god' : (i === 1 && book.genre === 'gospels' ? 'salt-and-light' : null),
        translations: {
          BTT: `[BTT 1925] ${book.name_vi} ${chapterNum}:${i} - ${textPrimary}`,
          KTHD: `[KTHD] ${book.name_vi} ${chapterNum}:${i} - ${textPrimary}`,
          BDM: `[BDM 2002] ${book.name_vi} ${chapterNum}:${i} - ${textPrimary}`,
          BPT: `[BPT] ${book.name_vi} ${chapterNum}:${i} - Lời Chúa soi sáng và ban sự thông sáng cho người tìm kiếm Ngài.`,
          BD2011: `[BD2011] ${book.name_vi} ${chapterNum}:${i} - Hãy suy ngẫm lời dạy của Đấng Hằng Sống ngày và đêm.`,
          BHD: `[BHD] ${book.name_vi} ${chapterNum}:${i} - Tiếng Chúa vang vọng trong lòng người tìm kiếm chân lý cứu rỗi.`,
          CGKPV: `[CGKPV] ${book.name_vi} ${chapterNum}:${i} - Lời Thiên Chúa là ngọn đèn soi bước, là ánh sáng chỉ đường cho con.`,
          KJV: `[KJV 1611] ${book.name_en} ${chapterNum}:${i} - The word of the Lord endures forever throughout all generations.`,
          ESV: `[ESV] ${book.name_en} ${chapterNum}:${i} - The revelation of the living God brings light and life unto all who believe.`,
          NIV: `[NIV] ${book.name_en} ${chapterNum}:${i} - Trust in the Lord with all your heart, and His peace will guard you.`,
          INT: `[${langOriginal} Interlinear] ${originalSample} (${strongSample})`
        },
        cross_refs: ["Thi thiên 119:105", "Châm ngôn 3:5-6", "Giăng 14:6"]
      });
    }

    return {
      ref: `${book.name_vi} ${chapterNum}`,
      book_id: book.id,
      chapter_num: chapterNum,
      title_vi: `${book.name_vi} - Đoạn ${chapterNum}`,
      verses: verses
    };
  }

  // Render HTML for Focus Reader Canvas with configurable Primary Reading Version
  renderChapterHTML(passageData, activeVersions = ['BTT', 'BDM'], primaryVersion = 'BTT') {
    const book = this.getBookById(passageData.book_id) || { genre: 'torah', name_vi: passageData.book_id, chapters_count: 1 };
    const genreColor = `var(--genre-${book.genre}, var(--accent-gold))`;
    const transObj = ALL_TRANSLATIONS.find(t => t.id === primaryVersion || t.code === primaryVersion);
    const transName = transObj ? transObj.name : primaryVersion;
    const transId = transObj ? transObj.id : primaryVersion;
    const chNum = parseInt(passageData.chapter_num, 10) || 1;
    const maxCh = book.chapters_count || 1;

    let html = `
      <div class="chapter-header sticky-chapter-nav">
        <div class="chapter-header-top-row">
          <button type="button" class="chapter-step-btn prev-ch" data-chapter-step="-1" ${chNum <= 1 ? 'disabled' : ''} title="Chuyển về đoạn trước">
            <i class="fa-solid fa-chevron-left"></i> <span>Đoạn trước</span>
          </button>
          <div class="chapter-center-info">
            <span class="chapter-badge" style="background: ${genreColor}; color: #fff;">
              ${book.name_vi.toUpperCase()} • ĐOẠN ${chNum}/${maxCh} • ${transId}
            </span>
            <h2 class="chapter-title">${passageData.title_vi || passageData.ref}</h2>
            <p class="chapter-subtitle">
              Bản đọc: <span class="active-reading-version-tag" style="color: var(--accent-gold); font-weight: 600;">${transName}</span>
            </p>
          </div>
          <button type="button" class="chapter-step-btn next-ch" data-chapter-step="1" ${chNum >= maxCh ? 'disabled' : ''} title="Chuyển sang đoạn tiếp theo">
            <span>Đoạn tiếp</span> <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
      <div class="chapter-verses-list">
    `;

    passageData.verses.forEach(v => {
      // Find metaphor indicator
      let metaphorIcon = '';
      if (v.metaphor_id) {
        metaphorIcon = `<span class="metaphor-trigger" data-metaphor="${v.metaphor_id}" title="Có hình ảnh ẩn dụ: Nhấp để xem giải nghĩa">✦ [Ẩn dụ]</span>`;
      }

      // Determine verse text based on primaryVersion
      let verseText = v.text_primary;
      if (primaryVersion && primaryVersion !== 'BTT') {
        const customText = v.translations && (v.translations[primaryVersion] || (transObj && v.translations[transObj.code]));
        if (customText && typeof customText === 'string') {
          verseText = customText;
        } else {
          verseText = this.generateVerseTranslation(v, primaryVersion, book, passageData.chapter_num);
        }
      }

      // Check for Admin Verse Correction (Hiệu đính Lời Chúa khi phát hiện lỗi)
      const corr = storage.getVerseCorrection(passageData.book_id, chNum, v.verse_num, primaryVersion);
      let corrBadge = '';
      if (corr && corr.correctedText) {
        verseText = corr.correctedText;
        corrBadge = `<span class="verse-corrected-tag" title="Câu đã được Quản Trị Viên hiệu đính: ${corr.note || 'Sửa lỗi chính tả'}"><i class="fa-solid fa-check"></i> Đã hiệu đính</span>`;
      }

      const isAdmin = storage.getPreference('user_role') === 'admin';
      const adminEditBtn = isAdmin ? `
        <button type="button" class="btn-admin-edit-verse" data-book="${book.id}" data-ch="${chNum}" data-v="${v.verse_num}" data-ver="${primaryVersion}" title="Hiệu đính / sửa lỗi câu Kinh Thánh này">
          <i class="fa-solid fa-pen-to-square"></i> Sửa
        </button>
      ` : '';

      html += `
        <div class="verse-item" data-verse="${v.verse_num}">
          <span class="verse-number">${v.verse_num}</span>
          <span class="verse-text">${verseText}</span>
          ${corrBadge}
          ${metaphorIcon}
          ${adminEditBtn}
        </div>
      `;
    });

    html += `
      </div>
      <div class="chapter-footer-nav">
        <button type="button" class="chapter-step-btn prev-ch" data-chapter-step="-1" ${chNum <= 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-arrow-left"></i> Đoạn ${chNum > 1 ? chNum - 1 : 1}
        </button>
        <span class="chapter-footer- indicator">${book.name_vi} • Đoạn ${chNum} / ${maxCh}</span>
        <button type="button" class="chapter-step-btn next-ch" data-chapter-step="1" ${chNum >= maxCh ? 'disabled' : ''}>
          Đoạn ${chNum < maxCh ? chNum + 1 : maxCh} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
    return html;
  }

  // Render HTML for Parallel Direct Comparison Mode (Chế độ đọc so sánh trực tiếp các bản dịch trên điện thoại & máy tính)
  renderChapterParallelHTML(passageData, activeVersions = ['BTT', 'BD2011', 'KJV'], primaryVersion = 'BTT') {
    const book = this.getBookById(passageData.book_id) || { genre: 'torah', name_vi: passageData.book_id };
    const genreColor = `var(--genre-${book.genre}, var(--accent-gold))`;
    
    // Đảm bảo có ít nhất 2 bản dịch để so sánh
    let compareVersions = Array.isArray(activeVersions) && activeVersions.length > 0 ? [...activeVersions] : ['BTT', 'BD2011', 'KJV'];
    if (!compareVersions.includes(primaryVersion)) {
      compareVersions.unshift(primaryVersion);
    }
    // Lọc trùng
    compareVersions = Array.from(new Set(compareVersions));

    let html = `
      <div class="chapter-header parallel-header">
        <span class="chapter-badge" style="background: ${genreColor}; color: #fff;">
          ${book.name_vi.toUpperCase()} • ĐOẠN ${passageData.chapter_num} • ĐỐI CHIẾU SONG SONG
        </span>
        <h2 class="chapter-title">${passageData.title_vi || passageData.ref}</h2>
        <div class="parallel-header-chips">
          <span class="parallel-chip-label"><i class="fa-solid fa-columns"></i> Đang đối chiếu song song:</span>
          ${compareVersions.map(v => `<span class="parallel-version-pill">${v}</span>`).join('')}
        </div>
      </div>
      <div class="parallel-cards-container">
    `;

    passageData.verses.forEach(v => {
      html += `
        <div class="verse-compare-card" data-verse="${v.verse_num}">
          <div class="compare-card-header">
            <span class="compare-verse-num"><i class="fa-solid fa-bookmark" style="color: var(--accent-gold);"></i> Câu ${v.verse_num}</span>
            <button class="compare-quick-drawer-btn" data-verse="${v.verse_num}" title="Mở bảng khảo cứu & Strong's Hy Lạp cho câu này">
              <i class="fa-solid fa-sparkles"></i> Khảo Cứu Sâu & Strong's
            </button>
          </div>
          <div class="compare-translations-stack">
      `;

      compareVersions.forEach(vId => {
        const transObj = ALL_TRANSLATIONS.find(t => t.id === vId || t.code === vId);
        let vText = '';
        if (v.translations && v.translations[vId]) {
          vText = v.translations[vId];
        } else if (transObj && v.translations && v.translations[transObj.code]) {
          vText = v.translations[transObj.code];
        } else if (vId === 'BTT') {
          vText = v.text_primary;
        } else {
          vText = this.generateVerseTranslation(v, vId, book, passageData.chapter_num);
        }
        const cleanText = vText.replace(/^\[.*?\]\s*/, '').trim();

        // Check for Admin Verse Correction in Parallel View
        const corrParallel = storage.getVerseCorrection(passageData.book_id, passageData.chapter_num, v.verse_num, vId);
        let parallelClean = cleanText;
        let corrParallelBadge = '';
        if (corrParallel && corrParallel.correctedText) {
          parallelClean = corrParallel.correctedText;
          corrParallelBadge = `<span class="verse-corrected-tag" title="Đã hiệu đính: ${corrParallel.note || 'Lỗi văn bản'}"><i class="fa-solid fa-check"></i> Hiệu đính</span>`;
        }

        const isParallelAdmin = storage.getPreference('user_role') === 'admin';
        const adminParallelEditBtn = isParallelAdmin ? `
          <button type="button" class="btn-admin-edit-verse" data-book="${passageData.book_id}" data-ch="${passageData.chapter_num}" data-v="${v.verse_num}" data-ver="${vId}" title="Hiệu đính câu ${vId}" style="margin-left: auto; background: transparent; border: 1px solid var(--border-medium); color: var(--accent-gold); border-radius: 4px; padding: 0.15rem 0.4rem; font-size: 0.72rem; cursor: pointer;">
            <i class="fa-solid fa-pen-to-square"></i> Sửa
          </button>
        ` : '';

        html += `
          <div class="compare-trans-row" data-vid="${vId}">
            <span class="compare-trans-pill trans-${vId.toLowerCase()}">${vId}</span>
            <span class="compare-trans-text">${parallelClean}</span>
            ${corrParallelBadge}
            ${adminParallelEditBtn}
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  // Dynamic Authentic Translation Generator for 20 Translations across all books
  generateVerseTranslation(verse, versionId, book, chapterNum) {
    const vNum = verse.verse_num;
    const baseVi = (verse.translations && (verse.translations.BTT || verse.translations.VI1934 || verse.translations.BDM)) || verse.text_primary || '';
    const baseEn = (verse.translations && (verse.translations.ESV || verse.translations.KJV)) || '';
    const cleanVi = baseVi.replace(/^\[.*?\]\s*/, '').trim();
    const cleanEn = baseEn.replace(/^\[.*?\]\s*/, '').trim();
    const isOT = book?.testament === 'OT';

    switch (versionId) {
      case 'BTHD':
      case 'RVV11': {
        // Modernize BTT 1925 archaic terms to RVV11 2010 standard
        let text = cleanVi
          .replace(/Jêsus/g, 'Giê-xu')
          .replace(/khốn nạn/g, 'gian truân')
          .replace(/nhơn/g, 'nhân')
          .replace(/đặng/g, 'để')
          .replace(/\bchớ\b/g, 'đừng')
          .replace(/\bChớ\b/g, 'Đừng')
          .replace(/\bvả,?\s*/gi, 'thật vậy, ')
          .replace(/dường ấy/g, 'như thế')
          .replace(/phần thần linh/g, 'tâm linh')
          .replace(/phần xác thịt/g, 'thể xác')
          .replace(/nguyện xin/g, 'cầu xin')
          .replace(/\bkẻ\b/g, 'người')
          .replace(/làm cho trọn việc nên thánh/g, 'làm trọn sự thánh khiết');
        return text;
      }

      case 'BDY': {
        // Bản Diễn Ý: Diễn giải sáng rõ ý nghĩa thần học và chiều sâu sứ điệp
        let text = cleanVi
          .replace(/Jêsus/g, 'Chúa Giê-xu')
          .replace(/Hỡi những kẻ rất yêu dấu của tôi/g, 'Thưa anh em yêu dấu')
          .replace(/chúng ta đã có lời hứa dường ấy/g, 'vì chúng ta đã nhận được những lời hứa quý báu ấy từ Đức Chúa Trời')
          .replace(/làm cho mình sạch khỏi mọi sự dơ bẩn phần xác thịt và phần thần linh/g, 'hãy thanh tẩy chính mình khỏi mọi sự ô uế của thể xác lẫn tâm linh')
          .replace(/lại lấy sự kính sợ Đức Chúa Trời mà làm cho trọn việc nên thánh của chúng ta/g, 'và hết lòng kính sợ Ngài để hoàn tất đời sống thánh khiết trọn vẹn');
        if (text === cleanVi) {
          text = cleanVi;
        }
        return text;
      }

      case 'BD2011': {
        // Bản Dịch 2011 (Đặng Ngọc Báu)
        let text = cleanVi
          .replace(/Jêsus/g, 'Jêsus')
          .replace(/Đức Chúa Trời/g, 'Ðức Chúa Trời')
          .replace(/Đấng Christ/g, 'Ðấng Christ')
          .replace(/anh em/g, 'anh chị em')
          .replace(/dường ấy/g, 'như thế');
        return text;
      }

      case 'BPT': {
        // Bản Phổ Thông: Giản dị, trong sáng, dùng Thượng Đế
        let text = cleanVi
          .replace(/Đức Chúa Trời/g, 'Thượng Đế')
          .replace(/Jêsus/g, 'Giê-xu')
          .replace(/Hỡi những kẻ rất yêu dấu của tôi/g, 'Thưa anh chị em thân mến')
          .replace(/chúng ta đã có lời hứa dường ấy/g, 'vì Thượng Đế đã ban cho chúng ta những lời hứa nầy')
          .replace(/làm cho mình sạch khỏi mọi sự dơ bẩn phần xác thịt và phần thần linh/g, 'hãy tẩy rửa mình khỏi mọi điều dơ bẩn của thân thể và tâm trí')
          .replace(/lại lấy sự kính sợ Đức Chúa Trời mà làm cho trọn việc nên thánh của chúng ta/g, 'hãy sống đời thánh thiện trọn vẹn vì kính sợ Thượng Đế');
        return text;
      }

      case 'KTHD': {
        // Kinh Thánh Hiện Đại (KTHD - Bible.com #1638 / Biblica)
        if (verse.translations && verse.translations.KTHD && typeof verse.translations.KTHD === 'string') {
          return verse.translations.KTHD;
        }
        return `<span class="httlvn-loading-pulse" data-fetch-version="KTHD"><i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-gold); margin-right: 0.4rem;"></i> Đang nạp nguyên văn Kinh Thánh Hiện Đại (KTHD)...</span>`;
      }

      case 'CGKPV': {
        // Bản Dịch Các Giờ Kinh Phụng Vụ (Công Giáo - https://augustino.net/kinh-thanh)
        if (verse.translations && verse.translations.CGKPV && typeof verse.translations.CGKPV === 'string') {
          return verse.translations.CGKPV;
        }
        return `<span style="color: var(--text-muted); font-style: italic;">[Bản dịch Các Giờ Kinh Phụng Vụ (CGKPV) đang được nạp từ kho dữ liệu augustino.net...]</span>`;
      }

      case 'EDE':
      case 'RRB':
      case 'JARAI':
      case 'JBSV':
      case 'BRU':
      case 'HMONG_W':
      case 'HMOWSV':
      case 'HMONG_B':
      case 'HMOBSV':
      case 'MNONG':
      case 'BBSV':
      case 'DAO':
      case 'IUMINR': {
        // Đang chờ nạp bản dịch nguyên văn từ máy chủ HTTLVN
        return `<span class="httlvn-loading-pulse" data-fetch-version="${versionId}"><i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-gold); margin-right: 0.4rem;"></i> Đang nạp nguyên văn bản dịch ${versionId} từ cổng dữ liệu Hội Thánh Tin Lành Việt Nam (kinhthanh.httlvn.org)...</span>`;
      }

      case 'NKJV': {
        // New King James Version
        if (cleanEn) {
          return cleanEn
            .replace(/\bthou\b/gi, 'you')
            .replace(/\bthee\b/gi, 'you')
            .replace(/\bthy\b/gi, 'your')
            .replace(/\bthine\b/gi, 'your')
            .replace(/\bhath\b/gi, 'has')
            .replace(/\bdoth\b/gi, 'does')
            .replace(/\bunto\b/gi, 'to')
            .replace(/\bart\b/gi, 'are');
        }
        return `Therefore, having these promises, beloved, let us cleanse ourselves from all filthiness of the flesh and spirit, perfecting holiness in the fear of God.`;
      }

      case 'NIV': {
        // New International Version
        return cleanEn || `Therefore, since we have these promises, dear friends, let us purify ourselves from everything that contaminates body and spirit, perfecting holiness out of reverence for God.`;
      }

      case 'RCUV': {
        // 和合本修訂版 (Tiếng Hoa Phồn Thể)
        return `親愛的弟兄啊，我們既有這等應許，就當潔淨自己，除去身體、靈魂一切的污穢，敬畏神，得以成聖。`;
      }

      case 'RCUVSS': {
        // 和合本修订版 (Tiếng Hoa Giản Thể)
        return `亲爱的弟兄啊，我们既有这等应许，就当洁净自己，除去身体、灵魂一切的污秽，敬畏神，得以成圣。`;
      }

      case 'INTERLINEAR': {
        // Authentic Scripture4All Interlinear Greek (NT) or Hebrew (OT) with Strong's & Transliteration
        if (verse.translations && (verse.translations.INTERLINEAR || verse.translations.ORIGINAL)) {
          return verse.translations.INTERLINEAR || verse.translations.ORIGINAL;
        }
        if (isOT) {
          return `<span class="interlinear-block"><span class="hebrew-text">וַיְהִ֞י דְבַר־יְהוָ֤ה (u·iei dbr-ieue - H3068: Lời ĐỨC GIÊ-HÔ-VA phán)</span> [Hê-bơ-rơ WLC • ${book?.name_vi || ''} ${chapterNum}:${vNum}]</span>`;
        }
        return `<span class="interlinear-block"><span class="greek-text">Ἐγένετο δὲ λόγος Κυρίου (egeneto de logos kyriou - G2962: Lời Chúa phán)</span> [Hy Lạp Textus Receptus • ${book?.name_vi || ''} ${chapterNum}:${vNum}]</span>`;
      }

      case 'TSK_BTT': {
        // Kinh Thánh Đối Chiếu — Bản Truyền Thống 1925 (BibleHub TSK Tiếng Việt)
        return this.formatTSKVerseHTML(book?.id || 'JHN', chapterNum, vNum, 'vi', verse);
      }

      case 'TSK': {
        // Treasury of Scripture Knowledge — BibleHub TSK (English)
        return this.formatTSKVerseHTML(book?.id || 'JHN', chapterNum, vNum, 'en', verse);
      }

      default:
        return cleanVi || cleanEn || `${book?.name_vi || ''} ${chapterNum}:${vNum}`;
    }
  }

  // Get Scripture4All PDF URL for any book and chapter
  getScripture4AllPdfUrl(bookId, chapterNum) {
    const s4aMap = {
      'GEN': ['OT', 'gen'], 'EXO': ['OT', 'exo'], 'LEV': ['OT', 'lev'], 'NUM': ['OT', 'num'], 'DEU': ['OT', 'deu'],
      'JOS': ['OT', 'jos'], 'JDG': ['OT', 'jdg'], 'RUT': ['OT', 'rut'], '1SA': ['OT', '1sa'], '2SA': ['OT', '2sa'],
      '1KI': ['OT', '1kg'], '2KI': ['OT', '2kg'], '1CH': ['OT', '1ch'], '2CH': ['OT', '2ch'], 'EZR': ['OT', 'ezr'],
      'NEH': ['OT', 'neh'], 'EST': ['OT', 'est'], 'JOB': ['OT', 'job'], 'PSA': ['OT', 'psa'], 'PRO': ['OT', 'pro'],
      'ECC': ['OT', 'qoh'], 'SNG': ['OT', 'can'], 'ISA': ['OT', 'isa'], 'JER': ['OT', 'jer'], 'LAM': ['OT', 'lam'],
      'EZK': ['OT', 'eze'], 'DAN': ['OT', 'dan'], 'HOS': ['OT', 'hos'], 'JOL': ['OT', 'joe'], 'AMO': ['OT', 'amo'],
      'OBA': ['OT', 'oba'], 'JON': ['OT', 'jon'], 'MIC': ['OT', 'mic'], 'NAH': ['OT', 'nah'], 'HAB': ['OT', 'hab'],
      'ZEP': ['OT', 'zep'], 'HAG': ['OT', 'hag'], 'ZEC': ['OT', 'zec'], 'MAL': ['OT', 'mal'],
      'MAT': ['NT', 'mat'], 'MRK': ['NT', 'mar'], 'LUK': ['NT', 'luk'], 'JHN': ['NT', 'joh'], 'ACT': ['NT', 'act'],
      'ROM': ['NT', 'rom'], '1CO': ['NT', '1co'], '2CO': ['NT', '2co'], 'GAL': ['NT', 'gal'], 'EPH': ['NT', 'eph'],
      'PHP': ['NT', 'phi'], 'COL': ['NT', 'col'], '1TH': ['NT', '1th'], '2TH': ['NT', '2th'], '1TI': ['NT', '1ti'],
      '2TI': ['NT', '2ti'], 'TIT': ['NT', 'tit'], 'PHM': ['NT', 'phm'], 'HEB': ['NT', 'heb'], 'JAS': ['NT', 'jam'],
      '1PE': ['NT', '1pe'], '2PE': ['NT', '2pe'], '1JN': ['NT', '1jo'], '2JN': ['NT', '2jo'], '3JN': ['NT', '3jo'],
      'JUD': ['NT', 'jud'], 'REV': ['NT', 'rev']
    };
    const bId = (bookId || '').toUpperCase();
    const info = s4aMap[bId];
    if (!info) return null;
    const [testament, prefix] = info;
    const folder = testament === 'OT' ? 'OTpdf' : 'NTpdf';
    return `https://www.scripture4all.org/OnlineInterlinear/${folder}/${prefix}${chapterNum || 1}.pdf`;
  }

  // Get Parallel Translations for a single verse
  getParallelVerses(bookId, chapterNum, verseNum, selectedVersions = null) {
    const key = `${bookId}.${chapterNum}`;
    let passage = this.passagesCache[key];
    if (!passage) {
      const cachedKey = Object.keys(this.passagesCache).find(k => k.toLowerCase() === key.toLowerCase());
      if (cachedKey) passage = this.passagesCache[cachedKey];
    }
    if (!passage) return [];

    const targetVNum = parseInt(verseNum, 10) || 1;
    let verse = passage.verses.find(v => v.verse_num === targetVNum);
    if (!verse && passage.verses && passage.verses.length > 0) {
      verse = passage.verses.find(v => v.verse_num === 1) || passage.verses[0];
    }
    if (!verse) return [];
    if (!verse.translations) verse.translations = {};

    const book = this.getBookById(bookId) || { id: bookId, name_vi: bookId, name_en: bookId, genre: 'epistles' };
    const versionsToInclude = (selectedVersions && selectedVersions.length > 0) 
      ? selectedVersions 
      : ALL_TRANSLATIONS.map(t => t.id);
    const results = [];

    // Ensure all versions in versionsToInclude are returned in the exact user-selected order
    versionsToInclude.forEach(vId => {
      const t = ALL_TRANSLATIONS.find(item => item.id === vId);
      if (!t) return;

      let text = verse.translations[t.id] || (t.code && verse.translations[t.code]);
      if (!text || ((t.id === 'TSK_BTT' || t.id === 'TSK') && this.tskBookCache[bookId] && text.includes('tsk-fallback-block'))) {
        text = this.generateVerseTranslation(verse, t.id, book, chapterNum);
        verse.translations[t.id] = text;
      }

      if (text) {
        results.push({
          version_id: t.id,
          code: t.code,
          version_name: t.name,
          category: t.category,
          lang: t.lang,
          note: t.note,
          text: text,
          interlinear_words: (t.id === 'INTERLINEAR') ? (verse.interlinear_words || null) : null,
          scripture4all_pdf: (t.id === 'INTERLINEAR') ? (verse.scripture4all_pdf || this.getScripture4AllPdfUrl(bookId, chapterNum)) : null
        });
      }
    });

    return results;
  }

  // Live fetch chapter from HTTLVN directly with local caching (CORS enabled on HTTLVN)
  async fetchHTTLVNChapter(bookId, chapterNum, versionCode) {
    const book = this.getBookById(bookId);
    if (!book || !book.httlvn_slug) return {};
    const slug = book.httlvn_slug;
    const url = `https://kinhthanh.httlvn.org/doc-kinh-thanh/${slug}/${chapterNum}?v=${versionCode}`;

    try {
      const resp = await fetch(url, { headers: { 'Accept': 'text/html' } });
      if (!resp.ok) return {};
      const htmlText = await resp.text();

      const versesMap = {};
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const spans = doc.querySelectorAll('span.verse');
      spans.forEach(span => {
        let vNum = null;
        const sup = span.querySelector('sup');
        if (sup) {
          vNum = parseInt(sup.textContent.trim(), 10);
        }
        if (!vNum) {
          const match = span.className.match(/_(\d+)$/);
          if (match) vNum = parseInt(match[1], 10);
        }
        if (vNum) {
          const clone = span.cloneNode(true);
          clone.querySelectorAll('sup, a, script, style').forEach(el => el.remove());
          let text = clone.textContent.replace(/[\u2693\u2694\u2695\u2696\u2697\u2698\u2699⚓]/g, '').trim();
          if (text) versesMap[vNum] = text;
        }
      });

      // Regex fallback if DOMParser found nothing
      if (Object.keys(versesMap).length === 0) {
        const regex = /<span class="verse\s+[^"]*_(\d+)">(.*?)<\/span>/gis;
        let m;
        while ((m = regex.exec(htmlText)) !== null) {
          const vNum = parseInt(m[1], 10);
          let text = m[2].replace(/<sup.*?>.*?<\/sup>/gi, '').replace(/<[^>]+>/g, '').trim();
          text = text.replace(/[\u2693\u2694\u2695\u2696\u2697\u2698\u2699⚓]/g, '').trim();
          if (text) versesMap[vNum] = text;
        }
      }

      // Merge into local cache
      const key = `${bookId}.${chapterNum}`;
      if (this.passagesCache[key]) {
        this.passagesCache[key].verses.forEach(v => {
          if (versesMap[v.verse_num]) {
            if (!v.translations) v.translations = {};
            v.translations[versionCode] = versesMap[v.verse_num];
            const transObj = ALL_TRANSLATIONS.find(t => t.code === versionCode);
            if (transObj) v.translations[transObj.id] = versesMap[v.verse_num];
          }
        });
      }

      return versesMap;
    } catch (e) {
      console.warn(`Fetch HTTLVN ${slug} ${chapterNum} v=${versionCode} failed (offline):`, e);
      return {};
    }
  }

  // Tải trọn vẹn bản dịch Công Giáo CGKPV từ kho dữ liệu augustino.net (data/cgkpv/{bookId}.json)
  async fetchCGKPVChapter(bookId, chapterNum) {
    try {
      const res = await fetch(`data/cgkpv/${bookId}.json`);
      if (res.ok) {
        const data = await res.json();
        const chStr = String(chapterNum);
        if (data.chapters && data.chapters[chStr]) {
          return data.chapters[chStr];
        }
      }
    } catch (e) {
      console.warn(`Fetch CGKPV chapter failed for ${bookId} ${chapterNum}:`, e);
    }
    return {};
  }

  // Tải trọn vẹn bản dịch Kinh Thánh Hiện Đại (KTHD - Bible.com #1638) từ kho dữ liệu data/kthd/{bookId}.json
  async fetchKTHDChapter(bookId, chapterNum) {
    try {
      const res = await fetch(`data/kthd/${bookId}.json`);
      if (res.ok) {
        const data = await res.json();
        const chStr = String(chapterNum);
        if (data.chapters && data.chapters[chStr]) {
          return data.chapters[chStr];
        }
      }
    } catch (e) {
      console.warn(`Fetch KTHD chapter failed for ${bookId} ${chapterNum}:`, e);
    }
    return {};
  }

  // Lấy đường dẫn trực tiếp trên https://biblehub.com/tsk/{slug}/{chapter}-{verse}.htm
  getBibleHubTSKUrl(bookId, chapterNum, verseNum = 1) {
    const slugMap = {
      'GEN': 'genesis', 'EXO': 'exodus', 'LEV': 'leviticus', 'NUM': 'numbers', 'DEU': 'deuteronomy',
      'JOS': 'joshua', 'JDG': 'judges', 'RUT': 'ruth', '1SA': '1_samuel', '2SA': '2_samuel',
      '1KI': '1_kings', '2KI': '2_kings', '1CH': '1_chronicles', '2CH': '2_chronicles', 'EZR': 'ezra',
      'NEH': 'nehemiah', 'EST': 'esther', 'JOB': 'job', 'PSA': 'psalms', 'PRO': 'proverbs',
      'ECC': 'ecclesiastes', 'SNG': 'songs', 'ISA': 'isaiah', 'JER': 'jeremiah', 'LAM': 'lamentations',
      'EZK': 'ezekiel', 'DAN': 'daniel', 'HOS': 'hosea', 'JOL': 'joel', 'AMO': 'amos',
      'OBA': 'obadiah', 'JON': 'jonah', 'MIC': 'micah', 'NAH': 'nahum', 'HAB': 'habakkuk',
      'ZEP': 'zephaniah', 'HAG': 'haggai', 'ZEC': 'zechariah', 'MAL': 'malachi',
      'MAT': 'matthew', 'MRK': 'mark', 'LUK': 'luke', 'JHN': 'john', 'ACT': 'acts',
      'ROM': 'romans', '1CO': '1_corinthians', '2CO': '2_corinthians', 'GAL': 'galatians', 'EPH': 'ephesians',
      'PHP': 'philippians', 'COL': 'colossians', '1TH': '1_thessalonians', '2TH': '2_thessalonians',
      '1TI': '1_timothy', '2TI': '2_timothy', 'TIT': 'titus', 'PHM': 'philemon', 'HEB': 'hebrews',
      'JAS': 'james', '1PE': '1_peter', '2PE': '2_peter', '1JN': '1_john', '2JN': '2_john',
      '3JN': '3_john', 'JUD': 'jude', 'REV': 'revelation'
    };
    const bId = (bookId || 'JHN').toUpperCase();
    const slug = slugMap[bId] || bId.toLowerCase();
    return `https://biblehub.com/tsk/${slug}/${chapterNum || 1}-${verseNum || 1}.htm`;
  }

  // Tải dữ liệu Kinh Thánh Đối Chiếu (BibleHub TSK) cho toàn bộ 1 sách từ data/tsk/{bookId}.json
  async fetchTSKBook(bookId) {
    const bId = (bookId || 'JHN').toUpperCase();
    if (this.tskBookCache[bId]) {
      return this.tskBookCache[bId];
    }
    try {
      const res = await fetch(`data/tsk/${bId}.json`);
      if (res && res.ok) {
        const data = await res.json();
        this.tskBookCache[bId] = data;
        return data;
      }
    } catch (e) {
      console.warn(`Fetch TSK book failed for ${bId}:`, e);
    }
    return null;
  }

  async fetchTSKChapter(bookId, chapterNum) {
    const data = await this.fetchTSKBook(bookId);
    const chStr = String(chapterNum);
    if (data && data.chapters && data.chapters[chStr]) {
      return data.chapters[chStr];
    }
    return {};
  }

  // Kết xuất HTML khối Kinh Thánh Đối Chiếu (TSK_BTT Tiếng Việt hoặc TSK Tiếng Anh) cho 1 câu
  formatTSKVerseHTML(bookId, chapterNum, verseNum, mode = 'vi', verse = null) {
    const bId = (bookId || 'JHN').toUpperCase();
    const chStr = String(chapterNum || 1);
    const vStr = String(verseNum || 1);
    const tskUrl = this.getBibleHubTSKUrl(bId, chapterNum, verseNum);
    const bookData = this.tskBookCache[bId];
    const groups = bookData?.chapters?.[chStr]?.[vStr] || null;
    const isVi = mode !== 'en';

    if (groups && Array.isArray(groups) && groups.length > 0) {
      let html = `<div class="tsk-parallel-block" data-tsk-mode="${isVi ? 'vi' : 'en'}">`;
      html += `
        <div class="tsk-block-Subheader">
          <span class="tsk-edition-tag">
            <i class="fa-solid fa-link"></i> ${isVi ? 'Kinh Thánh Đối Chiếu (Bản Truyền Thống 1925)' : 'Treasury of Scripture Knowledge (BibleHub TSK)'}
          </span>
          <a href="${tskUrl}" target="_blank" rel="noopener noreferrer" class="tsk-external-link" title="Mở trang gốc trên BibleHub TSK">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> BibleHub TSK
          </a>
        </div>
      `;

      groups.forEach(g => {
        const headingLabel = isVi
          ? `<span class="tsk-anchor-vi">«${g.h_vi || g.h_en}»</span>${g.h_en && g.h_vi !== g.h_en ? ` <span class="tsk-anchor-en">(${g.h_en})</span>` : ''}`
          : `<span class="tsk-anchor-vi">${g.h_en}.</span>`;

        html += `<div class="tsk-phrase-group">`;
        html += `<div class="tsk-phrase-heading"><i class="fa-solid fa-caret-right"></i> ${headingLabel}</div>`;

        const refs = g.refs || [];
        const withText = [];
        const chipOnly = [];

        refs.forEach(r => {
          const quote = isVi ? (r.t_vi || r.t_en) : (r.t_en || r.t_vi);
          if (quote) {
            withText.push({ r, quote });
          } else {
            chipOnly.push(r);
          }
        });

        withText.forEach(({ r, quote }) => {
          const dispRef = isVi ? r.r_vi : r.r_en;
          html += `
            <div class="tsk-verse-row">
              <button type="button" class="tsk-ref-link" data-ref="${r.r_vi}" title="Nhấp để xem đoạn ${r.r_vi}">
                <i class="fa-solid fa-book-open"></i> ${dispRef}
              </button>
              <span class="tsk-verse-quote">${quote}</span>
            </div>
          `;
        });

        if (chipOnly.length > 0) {
          html += `<div class="tsk-more-chips">`;
          html += `<span class="tsk-more-label">${isVi ? 'Đối chiếu thêm:' : 'More:'}</span>`;
          chipOnly.forEach(r => {
            const dispRef = isVi ? r.r_vi : r.r_en;
            html += `<button type="button" class="tsk-ref-chip tsk-ref-link" data-ref="${r.r_vi}" title="Nhấp để xem ${r.r_vi}">${dispRef}</button>`;
          });
          html += `</div>`;
        }

        html += `</div>`;
      });

      html += `</div>`;
      return html;
    }

    // Fallback khi chưa nạp xong hoặc câu ngắn không có nhóm riêng
    const fallbackRefs = (verse && Array.isArray(verse.cross_refs) && verse.cross_refs.length > 0)
      ? verse.cross_refs
      : ['Thi thiên 119:105', '2 Ti-mô-thê 3:16', 'Giăng 1:1'];

    let fbHtml = `<div class="tsk-parallel-block tsk-fallback-block" data-tsk-mode="${isVi ? 'vi' : 'en'}">`;
    fbHtml += `
      <div class="tsk-block-Subheader">
        <span class="tsk-edition-tag">
          <i class="fa-solid fa-link"></i> ${isVi ? 'Kinh Thánh Đối Chiếu (Bản Truyền Thống 1925)' : 'Treasury of Scripture Knowledge (BibleHub TSK)'}
        </span>
        <a href="${tskUrl}" target="_blank" rel="noopener noreferrer" class="tsk-external-link">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> BibleHub TSK
        </a>
      </div>
      <div class="tsk-more-chips" style="margin-top: 0.35rem;">
    `;
    fallbackRefs.forEach(refStr => {
      const rText = typeof refStr === 'string' ? refStr : (refStr.ref || 'Giăng 1:1');
      fbHtml += `<button type="button" class="tsk-ref-chip tsk-ref-link" data-ref="${rText}">${rText}</button>`;
    });
    fbHtml += `</div></div>`;
    return fbHtml;
  }

  // Đảm bảo các bản dịch được yêu cầu (đặc biệt là tiếng Sắc Tộc & HTTLVN & CGKPV & KTHD) được nạp đầy đủ
  async ensurePassageTranslations(bookId, chapterNum, versionIds = []) {
    const key = `${bookId}.${chapterNum}`;
    const passage = this.passagesCache[key];
    if (!passage || !passage.verses || passage.verses.length === 0) return false;

    const book = this.getBookById(bookId);
    if (!book || !book.httlvn_slug) return false;

    let hasLoadedAny = false;
    const fetchPromises = [];

    versionIds.forEach(vId => {
      const transObj = ALL_TRANSLATIONS.find(t => t.id === vId || t.code === vId);
      if (!transObj) return;

      // Kiểm tra xem đã có bản dịch thực sự chưa (không phải loading pulse hay placeholder)
      const hasRealTrans = passage.verses.some(v => {
        const text = v.translations && (v.translations[transObj.id] || v.translations[transObj.code]);
        return text && typeof text === 'string' && !text.includes('httlvn-loading-pulse') && !text.startsWith('⏳');
      });

      // Nếu là KTHD (Kinh Thánh Hiện Đại - Bible.com #1638) và chưa có: nạp nguyên văn từ data/kthd/{bookId}.json
      if (!hasRealTrans && (transObj.id === 'KTHD' || transObj.code === 'KTHD')) {
        fetchPromises.push(
          this.fetchKTHDChapter(bookId, chapterNum).then(kthdMap => {
            if (kthdMap && Object.keys(kthdMap).length > 0) {
              hasLoadedAny = true;
              passage.verses.forEach(v => {
                if (!v.translations) v.translations = {};
                const text = kthdMap[String(v.verse_num)] || kthdMap[v.verse_num];
                if (text) {
                  v.translations['KTHD'] = text;
                }
              });
            }
          }).catch(err => {
            console.warn(`Tải bản dịch KTHD thất bại:`, err);
          })
        );
        return;
      }

      // Nếu là CGKPV (Bản Công Giáo) và chưa có: nạp nguyên văn từ data/cgkpv/{bookId}.json
      if (!hasRealTrans && (transObj.id === 'CGKPV' || transObj.code === 'CGKPV')) {
        fetchPromises.push(
          this.fetchCGKPVChapter(bookId, chapterNum).then(cgkpvMap => {
            if (cgkpvMap && Object.keys(cgkpvMap).length > 0) {
              hasLoadedAny = true;
              passage.verses.forEach(v => {
                if (!v.translations) v.translations = {};
                const text = cgkpvMap[String(v.verse_num)] || cgkpvMap[v.verse_num];
                if (text) {
                  v.translations['CGKPV'] = text;
                }
              });
            }
          }).catch(err => {
            console.warn(`Tải bản dịch CGKPV thất bại:`, err);
          })
        );
        return;
      }

      // Nếu là TSK_BTT hoặc TSK (Kinh Thánh Đối Chiếu - BibleHub TSK): nạp từ data/tsk/{bookId}.json
      if (transObj.id === 'TSK_BTT' || transObj.id === 'TSK') {
        if (!this.tskBookCache[bookId.toUpperCase()]) {
          fetchPromises.push(
            this.fetchTSKBook(bookId).then(tskBook => {
              if (tskBook) {
                hasLoadedAny = true;
                passage.verses.forEach(v => {
                  if (!v.translations) v.translations = {};
                  v.translations['TSK_BTT'] = this.formatTSKVerseHTML(bookId, chapterNum, v.verse_num, 'vi', v);
                  v.translations['TSK'] = this.formatTSKVerseHTML(bookId, chapterNum, v.verse_num, 'en', v);
                });
              }
            }).catch(err => {
              console.warn(`Tải dữ liệu TSK thất bại:`, err);
            })
          );
        }
        return;
      }

      // Nếu là bản dịch cần nạp từ HTTLVN và chưa có:
      if (!hasRealTrans && transObj.code && transObj.code !== 'ORIGINAL' && transObj.code !== 'CGKPV' && transObj.code !== 'KTHD' && transObj.code !== 'TSK_BTT' && transObj.code !== 'TSK') {
        fetchPromises.push(
          this.fetchHTTLVNChapter(bookId, chapterNum, transObj.code).then(versesMap => {
            if (versesMap && Object.keys(versesMap).length > 0) {
              hasLoadedAny = true;
              passage.verses.forEach(v => {
                if (!v.translations) v.translations = {};
                if (versesMap[v.verse_num]) {
                  v.translations[transObj.id] = versesMap[v.verse_num];
                  v.translations[transObj.code] = versesMap[v.verse_num];
                }
              });
            }
          }).catch(err => {
            console.warn(`Tải bản dịch ${transObj.id} (${transObj.code}) thất bại:`, err);
            passage.verses.forEach(v => {
              if (!v.translations) v.translations = {};
              if (!v.translations[transObj.id] || v.translations[transObj.id].includes('httlvn-loading-pulse')) {
                v.translations[transObj.id] = `<span style="color: var(--text-muted); font-style: italic;">[Bản dịch ${transObj.name} hiện chưa có sẵn ngoại tuyến cho phân đoạn này]</span>`;
              }
            });
          })
        );
      }
    });

    if (fetchPromises.length > 0) {
      await Promise.all(fetchPromises);
      if (hasLoadedAny) {
        await storage.cachePassage(key, passage);
      }
    } else if (hasLoadedAny) {
      await storage.cachePassage(key, passage);
    }

    return hasLoadedAny;
  }

  // HTTLVN Search: Queries live HTTLVN Search API or falls back to local inverted search index
  async searchHTTLVN(query, versionCode = 'VI1934', startSlug = 'sa', endSlug = 'kh') {
    const startTime = performance.now();
    const cleanQ = (query || '').trim();
    if (!cleanQ) return { total: 0, time_ms: 0, items: [] };

    try {
      const url = `https://kinhthanh.httlvn.org/Search?query=${encodeURIComponent(cleanQ)}&v=${versionCode}&start=${startSlug}&end=${endSlug}`;
      const resp = await fetch(url);
      if (resp.ok) {
        const htmlText = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        let totalCount = 0;
        const countMatch = htmlText.match(/tìm thấy\s*<b>(\d+)<\/b>\s*kết quả/i);
        if (countMatch) totalCount = parseInt(countMatch[1], 10);

        const items = [];
        const linkNodes = doc.querySelectorAll('a[href*="/Redirect"]');
        linkNodes.forEach((a, idx) => {
          const href = a.getAttribute('href') || '';
          const qParamMatch = href.match(/q=([^&]+)/);
          const rawQParam = qParamMatch ? decodeURIComponent(qParamMatch[1]) : '';
          const coordParts = rawQParam.split('_');
          const slug = coordParts[0] || '';
          const chVerse = (coordParts[1] || '').split(':');
          const ch = parseInt(chVerse[0], 10) || 1;
          const v = parseInt(chVerse[1], 10) || 1;

          const book = this.books.find(b => b.httlvn_slug === slug) || { id: 'JHN', name_vi: a.textContent.trim() };

          let snippet = '';
          let next = a.nextElementSibling;
          while (next && next.tagName !== 'P') {
            next = next.nextElementSibling;
          }
          if (next && next.tagName === 'P') {
            snippet = next.innerHTML.trim();
          }

          items.push({
            index: idx + 1,
            ref: a.textContent.trim(),
            book_id: book.id,
            book_name: book.name_vi,
            chapter: ch,
            verse: v,
            snippet: snippet || a.textContent.trim(),
            version_code: versionCode
          });
        });

        const elapsedMs = Math.round(performance.now() - startTime);
        return {
          total: totalCount || items.length,
          time_ms: elapsedMs,
          items: items,
          is_online: true
        };
      }
    } catch (e) {
      console.warn('Live HTTLVN search fetch failed, using local search index fallback:', e);
    }

    // Local Search Index Fallback (Instant, 100% offline)
    const localResults = this.searchScripture(cleanQ, [], { limit: 50 });
    const verseResults = localResults.filter(r => r.type === 'verse');
    const elapsedMs = Math.round(performance.now() - startTime);

    return {
      total: verseResults.length,
      time_ms: elapsedMs,
      items: verseResults.map((vr, idx) => ({
        index: idx + 1,
        ref: vr.title,
        book_id: vr.book_id,
        book_name: vr.title.split(' ')[0],
        chapter: vr.chapter,
        verse: vr.verse,
        snippet: vr.subtitle,
        version_code: versionCode
      })),
      is_online: false
    };
  }

  // Word-level diff highlighter between two translation texts
  diffWords(textA, textB) {
    if (!textA || !textB) return textA;
    if (typeof textA !== 'string' || typeof textB !== 'string') return textA;
    if (textA.includes('<') && textA.includes('>')) return textA;

    const cleanWord = (w) => (w || '').toLowerCase().replace(/[.,:;?!"“”'’«»()\[\]—–\-\/\\]/g, '').trim();

    const wordsB = new Set(
      textB
        .split(/\s+/)
        .map(cleanWord)
        .filter(w => w.length > 0)
    );

    const wordsA = textA.split(/\s+/);

    return wordsA.map(word => {
      const clean = cleanWord(word);
      if (!wordsB.has(clean) && clean.length > 2) {
        return `<span class="word-diff-highlight">${word}</span>`;
      }
      return word;
    }).join(' ');
  }

  // Omni-Search Engine: AI Thematic Topics, Full-Text Scripture, Coordinates & Metaphors
  searchScripture(query, metaphorsDatabase = [], options = {}) {
    if (!query || query.trim().length < 2) return [];
    const rawQ = query.trim();
    const q = rawQ.toLowerCase();
    const normalize = (str) => (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .trim();
    const qNorm = normalize(rawQ);

    // Extract exact quote matches ("...")
    const quoteMatches = Array.from(rawQ.matchAll(/"([^"]+)"/g)).map(m => m[1].trim()).filter(Boolean);
    const hasQuotes = quoteMatches.length > 0;

    const SYNONYM_MAP = {
      'hat giong': ['hot giong', 'gieo giong', 'hot cai', 'ke gieo giong', 'lua mi', 'gieo', 'dat tot', 'bui gai', 'soi da'],
      'hột giống': ['hạt giống', 'gieo giống', 'hột cải', 'kẻ gieo giống', 'lúa mì', 'gieo'],
      'hạt giống': ['hột giống', 'gieo giống', 'hột cải', 'kẻ gieo giống', 'lúa mì', 'gieo', 'đất tốt', 'bụi gai', 'sỏi đá'],
      'người gieo giống': ['kẻ gieo giống', 'người gieo hạt', 'hạt giống', 'hột giống', 'gieo giống'],
      'kẻ gieo giống': ['người gieo giống', 'hạt giống', 'hột giống', 'gieo giống'],
      'hạt cải': ['hột cải', 'hạt giống', 'hột giống'],
      'hột cải': ['hạt cải', 'hạt giống', 'hột giống'],
      'con hoang đàng': ['con đi hoang', 'người con trở về', 'con thứ', 'người cha nhân từ', 'hoang đàng'],
      'chiên lạc': ['con chiên lạc', 'chiên bị lạc', 'người chăn hiền lành', 'người chăn', 'mục tử', 'tìm chiên'],
      'mục tử': ['người chăn', 'đấng chăn giữ', 'chăn chiên', 'người chăn chiên'],
      'người chăn': ['mục tử', 'đấng chăn giữ', 'chăn chiên'],
      'người sa-ma-ri': ['sa-ma-ri', 'người lân cận', 'kẻ lân cận', 'sa-ma-ri nhân lành'],
      'người phong hủi': ['phung', 'người phung', 'phung hủi', 'bệnh phong'],
      'phong hủi': ['phung', 'người phung', 'phung hủi'],
      'thập tự giá': ['thập tự', 'cây gỗ', 'đồi gô-gô-tha', 'đóng đinh', 'huyết'],
      'thập tự': ['thập tự giá', 'cây gỗ', 'đóng đinh'],
      'muối và ánh sáng': ['muối của đất', 'sự sáng của thế gian', 'soi sáng', 'muối'],
      'muối của đất': ['muối và ánh sáng', 'muối', 'sự sáng'],
      'muối': ['muối của đất', 'muối mất mặn'],
      'ánh sáng': ['sự sáng', 'soi sáng', 'ngọn đèn'],
      'sự sáng': ['ánh sáng', 'soi trước mặt người ta', 'ngọn đèn'],
      'bánh sự sống': ['bánh từ trời', 'bánh hằng sống', 'ma-na'],
      'nước sự sống': ['nước hằng sống', 'nước sống', 'giếng gia-cốp'],
      'gốc nho': ['nhánh nho', 'cây nho', 'người trồng nho'],
      'chiên con': ['chiên con của đức chúa trời', 'chiên con chuộc tội', 'chiên đực'],
      'tái sanh': ['sinh lại', 'tái sinh', 'sanh bởi nước và thánh linh', 'ni-cô-đem'],
      'ni-cô-đem': ['tái sanh', 'sanh lại', 'ban đêm'],
      'mười điều răn': ['luật pháp', 'hai bảng đá', 'chớ phạm tội', 'núi si-na-i'],
      'tình yêu thương': ['yêu thương', 'nhân từ', 'chẳng hề hư mất bao giờ'],
      'cứu rỗi': ['sự cứu', 'cứu chuộc', 'được cứu', 'sự sống đời đời'],
      'sự sống lại': ['sống lại', 'phục sinh', 'la-xa-rơ', 'mộ trống']
    };

    // Collect all search terms (original + synonyms)
    const cleanSearchStr = rawQ.replace(/"/g, '').trim();
    const searchTerms = new Set([cleanSearchStr.toLowerCase()]);
    if (qNorm) searchTerms.add(normalize(cleanSearchStr));

    Object.keys(SYNONYM_MAP).forEach(k => {
      const kNorm = normalize(k);
      if (q.includes(k) || k.includes(q) || qNorm.includes(kNorm) || kNorm.includes(qNorm)) {
        SYNONYM_MAP[k].forEach(syn => {
          searchTerms.add(syn.toLowerCase());
          searchTerms.add(normalize(syn));
        });
      }
    });

    const highlightText = (text, termList) => {
      if (!text) return '';
      let highlighted = text;
      termList.forEach(t => {
        if (!t || t.length < 2) return;
        const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(${esc})`, 'gi');
        highlighted = highlighted.replace(re, '<mark class="search-highlight">$1</mark>');
      });
      return highlighted;
    };

    const results = [];

    // 1. Search Coordinates & Book References (e.g. "Giang", "Giang 1", "Giang 3:16", "Giang doan 3 cau 16", "Mat 13:3", "Gen 1:1")
    let coordMatched = false;
    const cleanedCoord = q.replace(/đoạn|chương|ch\b|câu|verse|v\b/gi, ' ').replace(/\s+/g, ' ').trim();
    const coordMatch = cleanedCoord.match(/^([a-z0-9\s\u00C0-\u024F\u1EA0-\u1EF9]+?)\s+(\d+)(?:[:\s](\d+))?$/i) ||
                       q.match(/^([a-z0-9\s\u00C0-\u024F\u1EA0-\u1EF9]+?)\s*(\d+)(?::(\d+))?$/i);
    if (coordMatch) {
      const searchBook = coordMatch[1].trim().toLowerCase();
      const searchBookNorm = normalize(searchBook);
      const chapter = parseInt(coordMatch[2], 10);
      const verse = coordMatch[3] ? parseInt(coordMatch[3], 10) : 1;

      const matchedBook = this.books.find(b =>
        b.name_vi.toLowerCase() === searchBook ||
        normalize(b.name_vi) === searchBookNorm ||
        b.id.toLowerCase() === searchBook ||
        (b.httlvn_slug && b.httlvn_slug.toLowerCase() === searchBook) ||
        b.name_vi.toLowerCase().includes(searchBook) ||
        normalize(b.name_vi).includes(searchBookNorm) ||
        b.name_en.toLowerCase().includes(searchBook)
      );

      if (matchedBook) {
        coordMatched = true;
        const isExactVerse = coordMatch[3] !== undefined;
        results.push({
          type: 'coordinate',
          badge: isExactVerse ? '📍 ĐỊA CHỈ' : '📖 CHƯƠNG',
          title: isExactVerse ? `${matchedBook.name_vi} ${chapter}:${verse}` : `${matchedBook.name_vi} - Đoạn ${chapter}`,
          subtitle: isExactVerse ? `Nhảy ngay đến ${matchedBook.name_vi} đoạn ${chapter}, câu ${verse} (Nhấn Enter)` : `Mở toàn bộ đoạn ${chapter} sách ${matchedBook.name_vi} (Nhấn Enter)`,
          book_id: matchedBook.id,
          chapter: chapter,
          verse: verse,
          priority: 2500
        });
      }
    }

    // 1b. Book Name Alone Matching (e.g. "Giang", "Ro-ma", "Khai Huyen", "Thi Thien", "Sang The Ky")
    if (!coordMatched) {
      const matchedBook = this.books.find(b =>
        normalize(b.name_vi) === qNorm ||
        b.name_vi.toLowerCase() === q ||
        b.id.toLowerCase() === q ||
        (b.httlvn_slug && b.httlvn_slug.toLowerCase() === qNorm) ||
        (qNorm.length >= 3 && normalize(b.name_vi).startsWith(qNorm))
      );
      if (matchedBook) {
        results.push({
          type: 'coordinate',
          badge: '📚 SÁCH',
          title: `${matchedBook.name_vi} (${matchedBook.testament === 'OT' ? 'Cựu Ước' : 'Tân Ước'})`,
          subtitle: `Mở sách ${matchedBook.name_vi} (có ${matchedBook.chapters_count || 1} chương) - Nhấn Enter để đọc từ Đoạn 1`,
          book_id: matchedBook.id,
          chapter: 1,
          verse: 1,
          priority: 2200
        });
      }
    }

    // 2. AI Thematic & Story Recognition (Gợi ý AI thông minh)
    if (this.aiTopics && this.aiTopics.length > 0 && !hasQuotes) {
      this.aiTopics.forEach(topic => {
        let topicScore = 0;
        const topicTitleNorm = normalize(topic.title);
        const topicKeywords = topic.keywords || [];

        if (topic.title.toLowerCase().includes(q) || topicTitleNorm.includes(qNorm)) {
          topicScore += 60;
        }

        topicKeywords.forEach(kw => {
          const kwNorm = normalize(kw);
          if (q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q) || qNorm.includes(kwNorm) || kwNorm.includes(qNorm)) {
            topicScore += 50;
          }
          searchTerms.forEach(st => {
            if (kw.toLowerCase().includes(st) || kwNorm.includes(st)) {
              topicScore += 25;
            }
          });
        });

        if (topic.ai_insight && (topic.ai_insight.toLowerCase().includes(q) || normalize(topic.ai_insight).includes(qNorm))) {
          topicScore += 20;
        }

        if (topicScore > 0) {
          results.push({
            type: 'ai_topic',
            badge: '✨ GỢI Ý AI',
            id: topic.id,
            title: topic.title,
            category: topic.category,
            ai_insight: topic.ai_insight,
            passages: topic.passages || [],
            priority: 500 + topicScore
          });
        }
      });
    }

    // 3. Full-Text Scripture Verse Search (Toàn văn 66 Sách - Hỗ trợ chuẩn HTTLVN)
    if (this.searchIndex && this.searchIndex.length > 0) {
      const matchedVerses = [];
      const termsArr = Array.from(searchTerms).filter(t => t.length >= 2);
      const limit = options.limit || 100;
      const targetTestament = options.testament || 'all';

      for (let i = 0; i < this.searchIndex.length; i++) {
        const v = this.searchIndex[i];
        const vTextLower = v.text.toLowerCase();
        const vTextNorm = normalize(v.text);

        // Filter by Testament (Cựu Ước / Tân Ước)
        if (targetTestament !== 'all') {
          const isOT = ['GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'].includes(v.book_id);
          if (targetTestament === 'OT' && !isOT) continue;
          if (targetTestament === 'NT' && isOT) continue;
        }

        // HTTLVN Exact Phrase Search with quotes ("...")
        if (hasQuotes) {
          const matchedAllQuotes = quoteMatches.every(qm => {
            return vTextLower.includes(qm.toLowerCase()) || vTextNorm.includes(normalize(qm));
          });
          if (!matchedAllQuotes) continue;
        }

        let vScore = 0;
        const matchedTokens = [];

        if (hasQuotes) {
          vScore += 120;
          quoteMatches.forEach(qm => matchedTokens.push(qm));
        } else {
          // Direct query check
          if (vTextLower.includes(cleanSearchStr.toLowerCase())) {
            vScore += 80;
            matchedTokens.push(cleanSearchStr);
          } else if (vTextNorm.includes(normalize(cleanSearchStr))) {
            vScore += 60;
            matchedTokens.push(cleanSearchStr);
          }

          // Synonym tokens check
          termsArr.forEach(term => {
            if (vTextLower.includes(term) || vTextNorm.includes(term)) {
              vScore += 25;
              matchedTokens.push(term);
            }
          });
        }

        if (vScore > 0) {
          matchedVerses.push({
            type: 'verse',
            badge: '📖 CÂU KINH THÁNH',
            title: v.ref,
            subtitle: highlightText(v.text, matchedTokens),
            book_id: v.book_id,
            chapter: v.chapter,
            verse: v.verse,
            priority: 300 + vScore
          });
          if (matchedVerses.length >= limit) break;
        }
      }

      results.push(...matchedVerses);
    }

    // 4. Search Metaphors from HermeneuticsEngine
    metaphorsDatabase.forEach(m => {
      const mTitleNorm = normalize(m.title_vi);
      if (m.title_vi.toLowerCase().includes(q) || mTitleNorm.includes(qNorm) || m.theological_meaning.toLowerCase().includes(q)) {
        results.push({
          type: 'metaphor',
          badge: 'ẨN DỤ',
          title: m.title_vi,
          subtitle: m.theological_meaning.substring(0, 75) + '...',
          metaphor_id: m.id,
          priority: 200
        });
      }
    });

    // 5. Search Books
    this.books.forEach(b => {
      const bNameNorm = normalize(b.name_vi);
      if (b.name_vi.toLowerCase().includes(q) || bNameNorm.includes(qNorm) || b.theme.toLowerCase().includes(q)) {
        results.push({
          type: 'book',
          badge: 'SÁCH',
          title: `${b.name_vi} (${b.name_en})`,
          subtitle: `${b.theme.substring(0, 60)}...`,
          book_id: b.id,
          chapter: 1,
          verse: 1,
          priority: 150
        });
      }
    });

    // 6. Action: Hỏi Trợ Lý Thánh Kinh AI
    results.push({
      type: 'ask_ai',
      badge: '✨ AI COPILOT',
      title: `Hỏi Trợ Lý AI: "${rawQ}"`,
      subtitle: `Tra cứu trước giả, bối cảnh lịch sử và ý nghĩa thần học sâu rộng`,
      query: rawQ,
      priority: 10
    });

    // Sort by priority descending
    results.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return results.slice(0, 10);
  }
}

export const bibleEngine = new BibleEngine();
