/* ==========================================================================
   LOGOS MULTIVERSE - HERMENEUTICS & TYPOLOGY ENGINE
   Metaphor Deconstruction, Biblical Genre Rules & Historical Context
   ========================================================================== */

export class HermeneuticsEngine {
  static METAPHOR_SIGNATURES = {
    lamb_of_god: {
      id: 'lamb_of_god',
      bookPassages: [
        { book: 'JHN', chapters: [1] },
        { book: 'ISA', chapters: [53] },
        { book: 'EXO', chapters: [12] },
        { book: 'LEV', chapters: [16] },
        { book: 'REV', chapters: [5, 7, 14, 19, 21, 22] },
        { book: '1CO', chapters: [5] },
        { book: '1PE', chapters: [1] },
        { book: 'GEN', chapters: [4, 22] },
        { book: 'ACT', chapters: [8] }
      ],
      keywords: [
        'chiên con của đức chúa trời',
        'chiên con',
        'huyết chiên con',
        'chiên của lễ',
        'chiên lễ vượt qua',
        'của lễ chiên',
        'chiên câm trước kẻ hớt lông',
        'chiên bị đem đi hàng làm thịt',
        'chiên con đã chịu giết',
        'chiên đực thế cho y-sác'
      ]
    },
    true_vine: {
      id: 'true_vine',
      bookPassages: [
        { book: 'JHN', chapters: [15] },
        { book: 'PSA', chapters: [80] },
        { book: 'ISA', chapters: [5] },
        { book: 'JER', chapters: [2] },
        { book: 'ROM', chapters: [11] },
        { book: 'MAT', chapters: [20, 21] },
        { book: 'MRK', chapters: [12] }
      ],
      keywords: [
        'cây nho thật',
        'ta là gốc nho',
        'ta là cây nho',
        'gốc nho và nhánh',
        'cây nho và nhánh nho',
        'vườn nho của chúa',
        'người trồng nho',
        'nhánh nào trong ta'
      ]
    },
    bread_of_life: {
      id: 'bread_of_life',
      bookPassages: [
        { book: 'JHN', chapters: [6] },
        { book: 'EXO', chapters: [16] },
        { book: 'LEV', chapters: [24] },
        { book: '1CO', chapters: [11] },
        { book: 'MAT', chapters: [26] },
        { book: 'MRK', chapters: [14] },
        { book: 'LUK', chapters: [22] },
        { book: 'DEU', chapters: [8] }
      ],
      keywords: [
        'bánh sự sống',
        'bánh của sự sống',
        'bánh hằng sống',
        'bánh từ trời',
        'bánh ma-na',
        'bánh trần thiết',
        'thịt ta thật là đồ ăn',
        'bánh của đức chúa trời'
      ]
    },
    salt_and_light: {
      id: 'salt_and_light',
      bookPassages: [
        { book: 'MAT', chapters: [5] },
        { book: 'LUK', chapters: [14] },
        { book: 'PSA', chapters: [119] },
        { book: 'ISA', chapters: [60] },
        { book: 'PHP', chapters: [2] },
        { book: 'LEV', chapters: [2] }
      ],
      keywords: [
        'muối của đất',
        'ánh sáng của thế gian',
        'sự sáng của thế gian',
        'muối mất mặn',
        'giao ước muối',
        'sự sáng soi trong tối tăm',
        'ngọn đèn cho chân tôi'
      ],
      excludeKeywords: [
        'sa-tan',
        'quỉ sa-tan',
        'thiên sứ sáng',
        'thiên thần sáng',
        'sáng chói',
        'sáng láng'
      ]
    },
    living_water: {
      id: 'living_water',
      bookPassages: [
        { book: 'JHN', chapters: [4, 7] },
        { book: 'EXO', chapters: [17] },
        { book: 'NUM', chapters: [20] },
        { book: 'JER', chapters: [2, 17] },
        { book: 'EZK', chapters: [47] },
        { book: 'REV', chapters: [7, 21, 22] },
        { book: '1CO', chapters: [10] },
        { book: 'ISA', chapters: [12, 55] }
      ],
      keywords: [
        'nước sống',
        'nước hằng sống',
        'sông nước sự sống',
        'sông nước sống',
        'mạch nước sống',
        'mạch nước hằng sống',
        'nguồn nước sống',
        'hòn đá hô-rếp phun nước',
        'uống nước ta cho'
      ]
    },
    leaven: {
      id: 'leaven',
      bookPassages: [
        { book: 'EXO', chapters: [12, 13] },
        { book: 'LEV', chapters: [2, 23] },
        { book: 'MAT', chapters: [13, 16] },
        { book: 'MRK', chapters: [8] },
        { book: 'LUK', chapters: [12, 13] },
        { book: '1CO', chapters: [5] },
        { book: 'GAL', chapters: [5] }
      ],
      keywords: [
        'bánh không men',
        'lễ bánh không men',
        'men của người pha-ri-si',
        'men pha-ri-si',
        'men sa-đu-sê',
        'men của sa-đu-sê',
        'một chút men làm dậy',
        'tẩy trừ men cũ',
        'bột mới không men',
        'men cũ'
      ]
    },
    fire: {
      id: 'fire',
      bookPassages: [
        { book: 'EXO', chapters: [3, 13, 19] },
        { book: '1KI', chapters: [18] },
        { book: 'ISA', chapters: [6] },
        { book: 'ACT', chapters: [2] },
        { book: 'HEB', chapters: [12] },
        { book: '1PE', chapters: [1] },
        { book: 'MAL', chapters: [3] },
        { book: 'DAN', chapters: [3] }
      ],
      keywords: [
        'bụi gai cháy',
        'trụ lửa',
        'than hồng trên bàn thờ',
        'than hồng chạm miệng',
        'lửa từ trời giáng xuống',
        'lửa luyện bạc',
        'vàng thử lửa',
        'lưỡi như bằng lửa',
        'lửa thánh linh',
        'đám lửa thiêu đốt'
      ]
    },
    cornerstone: {
      id: 'cornerstone',
      bookPassages: [
        { book: 'PSA', chapters: [118] },
        { book: 'ISA', chapters: [28] },
        { book: 'DAN', chapters: [2] },
        { book: 'MAT', chapters: [21] },
        { book: 'MRK', chapters: [12] },
        { book: 'LUK', chapters: [20] },
        { book: 'ACT', chapters: [4] },
        { book: 'EPH', chapters: [2] },
        { book: '1PE', chapters: [2] }
      ],
      keywords: [
        'đá góc nhà',
        'hòn đá góc nhà',
        'đá góc',
        'hòn đá góc',
        'đá vấp chân',
        'hòn đá thợ xây loại ra',
        'hòn đá thử nghiệm',
        'đá góc móng'
      ]
    }
  };

  constructor() {
    this.metaphors = [];
    this.genres = {};
    this.isLoaded = false;
  }

  async init() {
    await this.loadMetaphors();
    await this.loadGenres();
    this.isLoaded = true;
  }

  async loadMetaphors() {
    try {
      const res = await fetch('data/metaphors-database.json');
      this.metaphors = await res.json();
      return this.metaphors;
    } catch (e) {
      console.error('Failed to load metaphors database:', e);
      return [];
    }
  }

  async loadGenres() {
    try {
      const res = await fetch('data/genre-guides.json');
      this.genres = await res.json();
      return this.genres;
    } catch (e) {
      console.error('Failed to load genre guides:', e);
      return {};
    }
  }

  getMetaphorById(metaphorId) {
    return this.metaphors.find(m => m.id === metaphorId) || null;
  }

  getGenreGuide(genreId) {
    return this.genres[genreId] || null;
  }

  // Tự động nhận diện biểu tượng theo sách, chương và câu đang mở
  detectPassageMetaphors({ book, chapterNum, verses = [], selectedVerseNum = null, preferredMetaphorId = null }) {
    const bookId = ((book && (book.id || book.book_id)) || '').toUpperCase();
    const chapter = parseInt(chapterNum, 10);
    const selectedV = selectedVerseNum != null ? parseInt(selectedVerseNum, 10) : null;

    const matchesMap = new Map();

    const addMatch = (mId, verseNum, reason) => {
      const metaphor = this.getMetaphorById(mId);
      if (!metaphor) return;
      if (!matchesMap.has(mId)) {
        matchesMap.set(mId, {
          metaphor,
          matchedVerses: new Set(),
          isExplicit: false,
          isChapterMatch: false
        });
      }
      const entry = matchesMap.get(mId);
      if (verseNum != null) entry.matchedVerses.add(verseNum);
      if (reason === 'explicit') entry.isExplicit = true;
      if (reason === 'chapter') entry.isChapterMatch = true;
    };

    // 1. Quét từng câu để tìm thẻ metaphor_id hoặc từ khóa trong tiếng Việt (chống khớp sai từ vựng tiếng Anh như countrymen -> men)
    verses.forEach(v => {
      const vNum = parseInt(v.verse_num || v.verse, 10);
      if (v.metaphor_id) {
        addMatch(v.metaphor_id, vNum, 'explicit');
      }

      // Quét các bản dịch tiếng Việt của câu
      const viParts = [
        v.text_primary,
        v.text,
        v.translations?.BTT,
        v.translations?.BDM,
        v.translations?.KTHD,
        v.translations?.CGKPV
      ].filter(Boolean);
      const viText = viParts.join(' ').toLowerCase();

      Object.keys(HermeneuticsEngine.METAPHOR_SIGNATURES).forEach(mId => {
        const sig = HermeneuticsEngine.METAPHOR_SIGNATURES[mId];

        // Loại trừ nếu câu có chứa các từ khóa tiêu cực hoặc sai ngữ cảnh (ví dụ: Satan giả làm thiên sứ sáng)
        if (sig.excludeKeywords && sig.excludeKeywords.some(ex => viText.includes(ex))) {
          return;
        }

        const hasKeyword = sig.keywords.some(kw => viText.includes(kw));
        if (hasKeyword) {
          addMatch(mId, vNum, 'keyword');
        }
      });
    });

    // 2. Quét đặc trưng sách & chương (passage signature)
    Object.keys(HermeneuticsEngine.METAPHOR_SIGNATURES).forEach(mId => {
      const sig = HermeneuticsEngine.METAPHOR_SIGNATURES[mId];
      const foundPassage = sig.bookPassages.find(p => p.book === bookId && p.chapters.includes(chapter));
      if (foundPassage) {
        addMatch(mId, null, 'chapter');
      }
    });

    // Chuyển kết quả sang mảng
    const detectedList = Array.from(matchesMap.values()).map(item => ({
      metaphor: item.metaphor,
      matchedVerses: Array.from(item.matchedVerses).sort((a, b) => a - b),
      isExplicit: item.isExplicit,
      isChapterMatch: item.isChapterMatch
    }));

    // Sắp xếp độ ưu tiên:
    // 1. Ưu tiên preferredMetaphorId do người dùng vừa bấm chọn
    // 2. Ưu tiên biểu tượng có chứa câu đang chọn (selectedVerseNum)
    // 3. Ưu tiên biểu tượng có thẻ gán chính thức (isExplicit)
    // 4. Ưu tiên biểu tượng có nhiều câu xuất hiện nhất
    detectedList.sort((a, b) => {
      if (preferredMetaphorId) {
        if (a.metaphor.id === preferredMetaphorId) return -1;
        if (b.metaphor.id === preferredMetaphorId) return 1;
      }
      if (selectedV != null) {
        const aHasV = a.matchedVerses.includes(selectedV);
        const bHasV = b.matchedVerses.includes(selectedV);
        if (aHasV && !bHasV) return -1;
        if (!aHasV && bHasV) return 1;
      }
      if (a.isExplicit && !b.isExplicit) return -1;
      if (!a.isExplicit && b.isExplicit) return 1;
      return b.matchedVerses.length - a.matchedVerses.length;
    });

    let activeMetaphor = null;
    let isFallback = false;

    if (detectedList.length > 0) {
      activeMetaphor = detectedList[0].metaphor;
    } else {
      isFallback = true;
      activeMetaphor = (preferredMetaphorId && this.getMetaphorById(preferredMetaphorId)) || this.metaphors[0] || null;
    }

    return {
      detected: detectedList,
      activeMetaphor,
      isFallback,
      allMetaphors: this.metaphors
    };
  }

  // Render toàn bộ giao diện Tab Ẩn Dụ & Biểu Tượng đồng bộ động
  renderTypologyTabHTML(result, { bookName, chapterNum, selectedVerseNum }) {
    const { detected, activeMetaphor, isFallback, allMetaphors } = result;

    let headerHTML = '';

    if (!isFallback && detected.length > 0) {
      const chipsHTML = detected.map(item => {
        const isActive = activeMetaphor && item.metaphor.id === activeMetaphor.id;
        const versesStr = item.matchedVerses.length > 0 ? ` (câu ${item.matchedVerses.join(', ')})` : '';
        return `
          <button class="metaphor-tab-chip ${isActive ? 'active' : ''}" data-metaphor-id="${item.metaphor.id}" title="Xem giải nghĩa ${item.metaphor.title_vi}">
            <i class="fa-solid ${item.metaphor.icon || 'fa-dove'}"></i>
            <span>${item.metaphor.title_vi.split('(')[0].trim()}${versesStr}</span>
          </button>
        `;
      }).join('');

      headerHTML = `
        <div class="passage-typology-banner">
          <div class="typology-banner-header">
            <span class="badge-gold"><i class="fa-solid fa-sparkles"></i> ĐỒNG BỘ THEO NỘI DUNG ĐANG MỞ</span>
            <h4>${bookName} • Đoạn ${chapterNum}</h4>
          </div>
          <p class="typology-banner-desc">
            Phát hiện <strong>${detected.length}</strong> hình ảnh biểu tượng trọng tâm trong phân đoạn này:
          </p>
          <div class="typology-chips-bar">
            ${chipsHTML}
          </div>
        </div>
      `;
    } else {
      // Phân đoạn không có biểu tượng ẩn dụ trực tiếp
      const allChipsHTML = (allMetaphors || []).map(m => {
        const isActive = activeMetaphor && m.id === activeMetaphor.id;
        return `
          <button class="metaphor-tab-chip ${isActive ? 'active' : ''}" data-metaphor-id="${m.id}" title="Xem giải nghĩa ${m.title_vi}">
            <i class="fa-solid ${m.icon || 'fa-dove'}"></i>
            <span>${m.title_vi.split('(')[0].trim()}</span>
          </button>
        `;
      }).join('');

      headerHTML = `
        <div class="passage-typology-banner fallback-notice">
          <div class="typology-banner-header">
            <span class="badge-muted"><i class="fa-solid fa-circle-info"></i> THÔNG BÁO BỐI CẢNH</span>
            <h4>${bookName} ${chapterNum}:${selectedVerseNum}</h4>
          </div>
          <p class="typology-banner-desc">
            Phân đoạn hiện tại tập trung vào bối cảnh/giáo lý mà không có biểu tượng ẩn dụ cốt lõi trong từ điển trọng tâm.
            <br>
            Bạn có thể nhấp chọn bất kỳ hình ảnh nào bên dưới để tra cứu biểu tượng thần học:
          </p>
          <div class="typology-chips-bar">
            ${allChipsHTML}
          </div>
        </div>
      `;
    }

    const cardHTML = this.renderMetaphorCard(activeMetaphor);

    // Khu vực khám phá các biểu tượng khác
    let exploreOthersHTML = '';
    if (!isFallback && detected.length > 0) {
      const otherMetaphors = (allMetaphors || []).filter(m => !detected.some(d => d.metaphor.id === m.id));
      if (otherMetaphors.length > 0) {
        const otherChipsHTML = otherMetaphors.map(m => `
          <button class="metaphor-tab-chip" data-metaphor-id="${m.id}" style="font-size: 0.78rem;">
            <i class="fa-solid ${m.icon || 'fa-dove'}"></i>
            <span>${m.title_vi.split('(')[0].trim()}</span>
          </button>
        `).join('');

        exploreOthersHTML = `
          <div class="typology-explore-others">
            <div class="explore-others-title">
              <i class="fa-solid fa-book-atlas"></i> Tra Cứu Các Biểu Tượng Khác Xuyên Suốt Kinh Thánh:
            </div>
            <div class="typology-chips-bar" style="margin-top: 0.5rem;">
              ${otherChipsHTML}
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="passage-metaphors-wrapper animate-fade-in">
        ${headerHTML}
        ${cardHTML}
        ${exploreOthersHTML}
      </div>
    `;
  }

  // Render Metaphor Breakdown Card (Typology)
  renderMetaphorCard(metaphor) {
    if (!metaphor) {
      return `
        <div class="empty-state">
          <i class="fa-solid fa-dove" style="font-size: 2rem; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
          <p>Chọn câu có ký hiệu ✦ hoặc tra cứu từ khóa ẩn dụ để xem giải nghĩa chuyên sâu.</p>
        </div>
      `;
    }

    const keyPassagesHTML = (metaphor.key_passages || []).map(p =>
      `<span class="crossref-pill" data-passage="${p}"><i class="fa-solid fa-bookmark"></i> ${p}</span>`
    ).join(' ');

    return `
      <div class="metaphor-card animate-fade-in">
        <h4 class="metaphor-card-title">
          <i class="fa-solid ${metaphor.icon || 'fa-dove'}"></i>
          <span>${metaphor.title_vi}</span>
        </h4>
        <span class="banner-badge" style="margin-bottom: 0.75rem; display: inline-block;">
          Phân loại: ${metaphor.symbol_category}
        </span>

        <div class="metaphor-section">
          <div class="metaphor-section-label">
            <i class="fa-solid fa-cross"></i> Ý Nghĩa Thần Học Cốt Lõi
          </div>
          <p style="color: var(--text-primary); line-height: 1.7;">${metaphor.theological_meaning}</p>
        </div>

        <div class="metaphor-section">
          <div class="metaphor-section-label">
            <i class="fa-solid fa-scroll"></i> Hình Bóng Cựu Ước (Old Testament Shadow)
          </div>
          <p style="color: var(--text-secondary); line-height: 1.7;">${metaphor.ot_shadow}</p>
        </div>

        <div class="metaphor-section">
          <div class="metaphor-section-label">
            <i class="fa-solid fa-sun"></i> Ứng Nghiệm Tân Ước (New Testament Fulfillment)
          </div>
          <p style="color: var(--text-secondary); line-height: 1.7;">${metaphor.nt_fulfillment}</p>
        </div>

        <div class="metaphor-section">
          <div class="metaphor-section-label">
            <i class="fa-solid fa-triangle-exclamation"></i> Lưu Ý Giải Kinh (Hermeneutics Note)
          </div>
          <p style="color: var(--accent-gold-light); font-style: italic; font-size: 0.88rem;">${metaphor.hermeneutical_notes}</p>
        </div>

        <div class="metaphor-section">
          <div class="metaphor-section-label">
            <i class="fa-solid fa-book-open"></i> Các Phân Đoạn Trọng Tâm
          </div>
          <div style="margin-top: 0.4rem;">${keyPassagesHTML}</div>
        </div>
      </div>
    `;
  }

  // Render Genre & Historical Context Guide
  renderGenreGuideHTML(genreId, bookMetadata = null) {
    const genre = this.getGenreGuide(genreId);
    if (!genre) return '<p>Chưa có dữ liệu thể loại.</p>';

    const principlesList = genre.hermeneutical_principles.map(p =>
      `<li style="margin-bottom: 0.5rem; line-height: 1.6;">${p}</li>`
    ).join('');

    let bookContextHTML = '';
    if (bookMetadata) {
      bookContextHTML = `
        <div class="metaphor-card" style="border-color: var(--border-medium); margin-bottom: 1rem;">
          <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-book-bookmark"></i> Bối Cảnh Sách: ${bookMetadata.name_vi}
          </h4>
          <p style="font-size: 0.88rem; margin-bottom: 0.35rem; color: var(--accent-gold-light);">
            <strong>Tác Giả Tối Thượng:</strong> Đức Chúa Trời (Thánh Linh soi dẫn — 2 Ti-mô-thê 3:16)
          </p>
          <p style="font-size: 0.88rem; margin-bottom: 0.35rem;">
            <strong>Trước giả (Người được cảm thúc chép lại):</strong> ${bookMetadata.author}
          </p>
          <p style="font-size: 0.88rem; margin-bottom: 0.35rem;"><strong>Niên đại:</strong> ${bookMetadata.date_written}</p>
          <p style="font-size: 0.88rem; margin-bottom: 0.35rem;"><strong>Chủ đề:</strong> ${bookMetadata.theme}</p>
          <p style="font-size: 0.88rem;"><strong>Bối cảnh lịch sử & địa lý:</strong> ${bookMetadata.historical_context}</p>
        </div>
      `;
    }

    return `
      <div class="genre-guide-container animate-fade-in">
        ${bookContextHTML}

        <div class="metaphor-card" style="border-left: 4px solid ${genre.color};">
          <h4 class="metaphor-card-title" style="display: flex; align-items: center; gap: 0.65rem; color: var(--accent-gold-light); font-family: var(--font-brand); font-size: 1.15rem; margin-bottom: 0.75rem;">
            <i class="fa-solid ${genre.icon}" style="color: ${genre.color}; font-size: 1.3rem;"></i>
            <span>Quy Chuẩn Giải Kinh: <span style="color: ${genre.color}; font-weight: 700;">Thể Loại ${genre.name_vi}</span></span>
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">
            ${genre.core_definition}
          </p>

          <div class="metaphor-section-label" style="color: var(--accent-gold); font-size: 0.88rem; font-weight: 700; margin-top: 0.85rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-compass" style="color: ${genre.color};"></i> Các Nguyên Tắc Giải Nghĩa Cốt Lõi:
          </div>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-primary); margin-top: 0.4rem; line-height: 1.6;">
            ${principlesList}
          </ul>

          <div class="metaphor-section" style="margin-top: 1.25rem; padding: 0.9rem 1.15rem; background: rgba(217, 119, 6, 0.08); border-radius: 8px; border: 1px solid var(--border-subtle); border-left: 4px solid var(--accent-gold);">
            <div style="font-weight: 700; color: var(--accent-gold-light); font-size: 0.82rem; text-transform: uppercase; display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.35rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> Cạm Bẫy Giải Kinh Cần Tránh:
            </div>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0;">
              ${genre.common_pitfalls}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

export const hermeneuticsEngine = new HermeneuticsEngine();
