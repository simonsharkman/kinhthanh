/* ==========================================================================
   LOGOS MULTIVERSE - CROSS-REFERENCE & BIBLEHUB TSK ENGINE
   Dedicated "KT Đối Chiếu" Tab (https://biblehub.com/tsk/)
   Supports 2 Full Editions:
   1. Vietnamese (Theo Bản Truyền Thống 1925 - BTT)
   2. English (Original BibleHub Treasury of Scripture Knowledge)
   ========================================================================== */

import { bibleEngine } from './bible-engine.js?v=3.7.0';

export class CrossRefEngine {
  constructor() {
    this.activeLangMode = 'vi'; // 'vi' (Vietnamese - BTT 1925) | 'en' (English - BibleHub TSK)
    this.viewScope = 'verse';   // 'verse' (Từng câu chuẩn BibleHub 1-1.htm) | 'chapter' (Toàn bộ chương)
    this.showBookDirectory = false;
    this.liveCache = {};        // Cache dữ liệu trực tiếp từ /api/biblehub-tsk

    this.tskDb = {
      // Treasury of Scripture Knowledge pre-mapped links (fallback)
      "JHN.1.1": [
        { ref: "Sáng thế ký 1:1", note: "Ban đầu Đức Chúa Trời dựng nên trời đất - Chúa Giê-xu đã hiện hữu trước mọi sự sáng tạo." },
        { ref: "1 Giăng 1:1-2", note: "Điều có từ trước vô cùng, điều chúng tôi đã nghe, điều mắt chúng tôi đã thấy... về Lời Sự Sống." },
        { ref: "Khải huyền 19:13", note: "Danh Ngài xưng là Lời Đức Chúa Trời (The Word of God)." },
        { ref: "Châm ngôn 8:22-30", note: "Sự khôn ngoan hằng hữu của Đức Chúa Trời đồng công tạo dựng." },
        { ref: "Cô-lô-se 1:15-17", note: "Ngài là hình ảnh của Đức Chúa Trời vô hình, sanh ra trước hết thảy mọi tạo vật." }
      ],
      "JHN.1.14": [
        { ref: "Phi-líp 2:6-8", note: "Ngài vốn có hình Đức Chúa Trời... trở nên giống như loài người, vâng phục cho đến chết." },
        { ref: "1 Ti-mô-thê 3:16", note: "Sự mầu nhiệm của sự tin kính là lớn lắm: Đấng đã được bày tỏ ra trong xác thịt." },
        { ref: "Xuất Ê-díp-tô Ký 25:8", note: "Họ sẽ làm cho Ta một Đền Tạm để Ta ngự giữa họ (Dựng lều tạm giữa con người)." },
        { ref: "Hê-bơ-rơ 2:14", note: "Vì con cái có phần về huyết và thịt, chính Ngài cũng dự phần vào đó." }
      ],
      "JHN.1.29": [
        { ref: "Xuất Ê-díp-tô Ký 12:3-13", note: "Chiên con Lễ Vượt Qua không tì vết, huyết bôi trên cửa cứu mạng con đầu lòng." },
        { ref: "Ê-sai 53:7", note: "Người bị hà hiếp, bị khốn khổ, nhưng không hề mở miệng; như chiên con bị dắt đến hàng làm thịt." },
        { ref: "1 Phi-e-rơ 1:19", note: "Được chuộc bởi huyết báu Đấng Christ, dường như huyết chiên con không lỗi không vít." },
        { ref: "Khải huyền 5:6", note: "Chiên Con như đã bị giết đứng giữa ngai vinh hiển tiếp nhận lời ca khen của cả vũ trụ." }
      ]
    };
  }

  // Fetch live BibleHub TSK page metadata (Chapter Outline, Jump Links, BibleHub Parallel Verses, Live TSK)
  async fetchLiveBibleHubData(bookId, chapterNum, verseNum) {
    const bId = (bookId || 'JHN').toUpperCase();
    const ch = parseInt(chapterNum, 10) || 1;
    const v = parseInt(verseNum, 10) || 1;
    const key = `${bId}.${ch}.${v}`;
    if (this.liveCache[key]) return this.liveCache[key];

    try {
      const res = await fetch(`/api/biblehub-tsk?book=${encodeURIComponent(bId)}&chapter=${ch}&verse=${v}`);
      if (res && res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          this.liveCache[key] = data;
          return data;
        }
      }
    } catch (e) {
      // Offline or static file server fallback
    }
    return null;
  }

  getCrossReferences(verseKey) {
    if (verseKey && typeof verseKey === 'string') {
      const [bId, chStr, vStr] = verseKey.split('.');
      const tskGroups = bibleEngine?.tskBookCache?.[bId?.toUpperCase()]?.chapters?.[chStr]?.[vStr];
      if (Array.isArray(tskGroups) && tskGroups.length > 0) {
        const extracted = [];
        tskGroups.forEach(g => {
          (g.refs || []).forEach(r => {
            if (extracted.length < 25) {
              extracted.push({
                ref: r.r_vi,
                ref_en: r.r_en,
                note: r.t_vi ? `[${g.h_vi}] ${r.t_vi}` : `Đối chiếu cụm «${g.h_vi}» (${g.h_en})`
              });
            }
          });
        });
        if (extracted.length > 0) return extracted;
      }
    }
    return this.tskDb[verseKey] || [
      { ref: "Thi thiên 119:105", note: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi." },
      { ref: "2 Ti-mô-thê 3:16", note: "Cả Kinh Thánh đều là bởi Đức Chúa Trời soi dẫn, có ích cho sự dạy dỗ, bẻ trách, sửa trị..." }
    ];
  }

  // Quick peek preview of verse content without page jump
  fetchVersePreview(verseRef) {
    const previews = {
      "Sáng thế ký 1:1": "Ban đầu Đức Chúa Trời dựng nên trời đất.",
      "1 Giăng 1:1-2": "Điều có từ trước vô cùng, điều chúng tôi đã nghe, điều mắt chúng tôi đã thấy, điều chúng tôi đã chiêm ngưỡng và tay chúng tôi đã sờ chạm về Lời Sự Sống...",
      "Khải huyền 19:13": "Ngài mặc áo nhúng trong máu; danh Ngài xưng là Lời Đức Chúa Trời.",
      "Ê-sai 53:7": "Người bị hà hiếp, bị khốn khổ, nhưng không hề mở miệng; như chiên con bị dắt đến hàng làm thịt...",
      "Xuất Ê-díp-tô Ký 12:3": "Mỗi người hãy bắt một con chiên con cho gia đình mình... chiên đực một tuổi, không tì vít.",
      "Thi thiên 119:105": "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.",
      "1 Phi-e-rơ 1:19": "Nhưng bởi huyết báu Đấng Christ, dường như huyết chiên con không lỗi không vít."
    };
    return previews[verseRef] || `[Trích đoạn đối chiếu từ ${verseRef}] Lời Đức Chúa Trời thành tín đời đời, soi sáng cho tấm lòng tìm kiếm chân lý.`;
  }

  // Render full dedicated "KT Đối Chiếu" Tab (#tsk-view) with 2 selectable editions: English & Vietnamese (Bản Truyền Thống 1925)
  renderTSKHubHTML({ bookId = 'JHN', chapterNum = 1, verseNum = 1, lang = 'vi', passageData = null, liveData = null } = {}) {
    const isVi = lang !== 'en';
    this.activeLangMode = isVi ? 'vi' : 'en';

    const bId = (bookId || 'JHN').toUpperCase();
    const chNum = parseInt(chapterNum, 10) || 1;
    const vNum = parseInt(verseNum, 10) || 1;
    const books = bibleEngine?.books || [];
    const currentBook = bibleEngine?.getBookById(bId) || { id: bId, name_vi: bId, name_en: bId, chapters_count: 21, testament: 'NT' };
    const totalChapters = currentBook.chapters_count || 1;
    const versesList = passageData?.verses || [];
    const totalVerses = versesList.length || 30;
    const currentVerseObj = versesList.find(v => v.verse_num === vNum) || versesList[0] || { verse_num: vNum, text_primary: '', translations: {} };

    const tskUrl = bibleEngine?.getBibleHubTSKUrl
      ? bibleEngine.getBibleHubTSKUrl(bId, chNum, vNum)
      : `https://biblehub.com/tsk/john/${chNum}-${vNum}.htm`;

    // Main Top Verse Text (#topver)
    const verseTextVi = (currentVerseObj.translations && (currentVerseObj.translations.BTT || currentVerseObj.translations.VI1934))
      || currentVerseObj.text_primary
      || '';
    const verseTextEn = liveData?.top_verse_en
      || (currentVerseObj.translations && (currentVerseObj.translations.KJV || currentVerseObj.translations.ESV))
      || '';

    const displayBookName = isVi ? currentBook.name_vi : (currentBook.name_en || currentBook.name_vi);
    const breadcrumbLabel = isVi
      ? `Kinh Thánh Đối Chiếu (TSK) &rsaquo; ${currentBook.name_vi} &rsaquo; Đoạn ${chNum} &rsaquo; Câu ${vNum}`
      : `BibleHub TSK &rsaquo; ${currentBook.name_en} &rsaquo; Chapter ${chNum} &rsaquo; Verse ${vNum}`;

    const tskBookObj = bibleEngine?.tskBookCache?.[bId] || null;
    const chapterTSKMap = tskBookObj?.chapters?.[String(chNum)] || {};
    const localGroups = chapterTSKMap[String(vNum)] || [];

    // 1. Header & Language Switcher (2 Editions: Vietnamese BTT 1925 & English BibleHub TSK)
    let html = `
      <div class="tsk-page-wrapper animate-fade-in">
        <!-- Thanh Tiêu Đề & Chọn Phiên Bản Ngôn Ngữ (Vietnamese BTT 1925 / English BibleHub) -->
        <div class="tsk-hero-bar">
          <div class="tsk-hero-left">
            <div class="tsk-breadcrumbs">${breadcrumbLabel}</div>
            <h2 class="tsk-hero-title">
              <i class="fa-solid fa-book-atlas" style="color: var(--accent-gold);"></i>
              ${isVi ? `KINH THÁNH ĐỐI CHIẾU — ${currentBook.name_vi.toUpperCase()} ${chNum}:${vNum}` : `TREASURY OF SCRIPTURE KNOWLEDGE — ${(currentBook.name_en || bId).toUpperCase()} ${chNum}:${vNum}`}
            </h2>
            <p class="tsk-hero-subtitle">
              ${isVi
                ? 'Toàn bộ hệ thống Kinh Thánh Đối Chiếu từ <b>biblehub.com/tsk/</b> được chuyển ngữ theo <b>Bản Truyền Thống 1925 (BTT)</b>'
                : 'Complete cross-reference concordance, chapter outline, and parallel verses from <b>https://biblehub.com/tsk/</b>'}
            </p>
          </div>

          <!-- Bộ Chuyển Đổi 2 Bản: Vietnamese (BTT 1925) & English (BibleHub TSK) -->
          <div class="tsk-edition-selector" role="group" aria-label="Chọn bản ngôn ngữ KT Đối Chiếu">
            <button type="button" class="tsk-edition-btn ${isVi ? 'active' : ''}" data-tsk-edition="vi">
              <i class="fa-solid fa-scroll"></i>
              <div>
                <div class="ed-main">Vietnamese (Bản Truyền Thống)</div>
                <div class="ed-sub">Kinh Thánh Đối Chiếu BTT 1925</div>
              </div>
            </button>
            <button type="button" class="tsk-edition-btn ${!isVi ? 'active' : ''}" data-tsk-edition="en">
              <i class="fa-solid fa-globe"></i>
              <div>
                <div class="ed-main">English (BibleHub TSK)</div>
                <div class="ed-sub">Original Treasury of Scripture</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Thanh Điều Hướng Sách / Đoạn / Câu & Mục Lục 66 Sách (Index of /tsk) -->
        <div class="tsk-nav-toolbar">
          <div class="tsk-nav-top-row">
            <div class="tsk-nav-selectors">
              <button type="button" id="tsk-toggle-directory-btn" class="tsk-dir-btn ${this.showBookDirectory ? 'active' : ''}">
                <i class="fa-solid fa-table-cells"></i> ${isVi ? 'Danh Mục 66 Sách (/tsk/)' : '66 Books Index (/tsk/)'}
              </button>

              <select id="tsk-select-book" class="tsk-select" aria-label="Chọn sách">
                ${books.map(b => `
                  <option value="${b.id}" ${b.id === bId ? 'selected' : ''}>
                    ${isVi ? `${b.name_vi} (${b.name_en})` : `${b.name_en} (${b.name_vi})`}
                  </option>
                `).join('')}
              </select>

              <select id="tsk-select-chapter" class="tsk-select" aria-label="Chọn đoạn">
                ${Array.from({ length: totalChapters }, (_, i) => i + 1).map(c => `
                  <option value="${c}" ${c === chNum ? 'selected' : ''}>
                    ${isVi ? `Đoạn ${c}` : `Chapter ${c}`}
                  </option>
                `).join('')}
              </select>

              <select id="tsk-select-verse" class="tsk-select" aria-label="Chọn câu">
                ${Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => `
                  <option value="${v}" ${v === vNum ? 'selected' : ''}>
                    ${isVi ? `Câu ${v}` : `Verse ${v}`}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="tsk-nav-extra-actions">
              <button type="button" id="tsk-scope-toggle-btn" class="tsk-scope-btn ${this.viewScope === 'chapter' ? 'active' : ''}">
                <i class="fa-solid ${this.viewScope === 'chapter' ? 'fa-list-ol' : 'fa-crosshairs'}"></i>
                ${this.viewScope === 'chapter'
                  ? (isVi ? 'Đang xem: Cả Đoạn' : 'Mode: Full Chapter')
                  : (isVi ? 'Xem Cả Đoạn' : 'Full Chapter TSK')}
              </button>

              <a href="${tskUrl}" target="_blank" rel="noopener noreferrer" class="tsk-biblehub-origin-btn" title="Mở trang gốc trên BibleHub.com">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> biblehub.com/tsk
              </a>
            </div>
          </div>

          <!-- Thanh Chuyển Câu Nổi Bật Tách Đôi 2 Bên Trái - Phải -->
          <div class="tsk-prev-next-split-bar">
            <button type="button" id="tsk-prev-verse-btn" class="tsk-arrow-btn tsk-arrow-left" title="${isVi ? 'Chuyển về câu trước' : 'Previous Verse'}">
              <span class="arrow-icon"><i class="fa-solid fa-chevron-left"></i></span>
              <span class="arrow-text">
                <span class="arrow-main">${isVi ? '◄ CÂU TRƯỚC' : '◄ PREV VERSE'}</span>
                <span class="arrow-sub">${vNum > 1 ? `${displayBookName} ${chNum}:${vNum - 1}` : (chNum > 1 ? `${displayBookName} ${chNum - 1}` : displayBookName)}</span>
              </span>
            </button>

            <div class="tsk-coord-center">
              <span class="tsk-coord-pill">
                <i class="fa-solid fa-book-open-reader"></i> ${displayBookName} ${chNum}:${vNum}
              </span>
            </div>

            <button type="button" id="tsk-next-verse-btn" class="tsk-arrow-btn tsk-arrow-right" title="${isVi ? 'Chuyển sang câu tiếp theo' : 'Next Verse'}">
              <span class="arrow-text">
                <span class="arrow-main">${isVi ? 'CÂU TIẾP ►' : 'NEXT VERSE ►'}</span>
                <span class="arrow-sub">${vNum < totalVerses ? `${displayBookName} ${chNum}:${vNum + 1}` : (chNum < totalChapters ? `${displayBookName} ${chNum + 1}:1` : displayBookName)}</span>
              </span>
              <span class="arrow-icon"><i class="fa-solid fa-chevron-right"></i></span>
            </button>
          </div>
        </div>
    `;

    // 2. Collapsible 66-Book Directory (Giống https://biblehub.com/tsk/ Index of /tsk)
    if (this.showBookDirectory) {
      const otBooks = books.filter(b => b.testament === 'OT');
      const ntBooks = books.filter(b => b.testament === 'NT');
      html += `
        <div class="tsk-directory-panel animate-fade-in">
          <div class="tsk-dir-section">
            <h4><i class="fa-solid fa-scroll"></i> ${isVi ? 'Cựu Ước (39 Sách — Old Testament /tsk/)' : 'Old Testament (39 Books — Index of /tsk/)'}</h4>
            <div class="tsk-dir-grid">
              ${otBooks.map(b => `
                <button type="button" class="tsk-dir-book-chip ${b.id === bId ? 'active' : ''}" data-dir-book="${b.id}">
                  <span class="dir-bname">${isVi ? b.name_vi : b.name_en}</span>
                  <span class="dir-bslug">${b.chapters_count} ch</span>
                </button>
              `).join('')}
            </div>
          </div>
          <div class="tsk-dir-section" style="margin-top: 0.85rem;">
            <h4><i class="fa-solid fa-cross"></i> ${isVi ? 'Tân Ước (27 Sách — New Testament /tsk/)' : 'New Testament (27 Books — Index of /tsk/)'}</h4>
            <div class="tsk-dir-grid">
              ${ntBooks.map(b => `
                <button type="button" class="tsk-dir-book-chip ${b.id === bId ? 'active' : ''}" data-dir-book="${b.id}">
                  <span class="dir-bname">${isVi ? b.name_vi : b.name_en}</span>
                  <span class="dir-bslug">${b.chapters_count} ch</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // 3. Quick Verse Number Bar for current chapter (nhấp chọn câu cực nhanh)
    html += `
      <div class="tsk-verse-pills-bar">
        <span class="vbar-label">${isVi ? `Câu trong ${currentBook.name_vi} ${chNum}:` : `${currentBook.name_en} ${chNum} Verses:`}</span>
        <div class="vbar-pills">
          ${Array.from({ length: totalVerses }, (_, i) => i + 1).map(v => `
            <button type="button" class="tsk-vnum-pill ${v === vNum && this.viewScope === 'verse' ? 'active' : ''}" data-tsk-vpill="${v}">
              ${v}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // 4. Nếu người dùng chọn chế độ "Xem Cả Đoạn" (Full Chapter TSK): Hiển thị toàn bộ các câu trong đoạn
    if (this.viewScope === 'chapter') {
      html += `<div class="tsk-full-chapter-list">`;
      versesList.forEach(vObj => {
        const vn = vObj.verse_num;
        const vGroups = chapterTSKMap[String(vn)] || [];
        const vTextVi = (vObj.translations && (vObj.translations.BTT || vObj.translations.VI1934)) || vObj.text_primary || '';
        const vTextEn = (vObj.translations && (vObj.translations.KJV || vObj.translations.ESV)) || '';

        html += `
          <div class="tsk-chapter-verse-block" id="tsk-ch-verse-${vn}">
            <div class="tsk-topver-banner">
              <div class="topver-coord">
                <span class="topver-badge">${displayBookName} ${chNum}:${vn}</span>
                <button type="button" class="tsk-focus-single-btn" data-tsk-vpill="${vn}">
                  <i class="fa-solid fa-expand"></i> ${isVi ? 'Xem chi tiết câu này' : 'Focus Verse'}
                </button>
              </div>
              <div class="topver-text">${isVi ? vTextVi : (vTextEn || vTextVi)}</div>
            </div>
            <div class="tsk-leftbox-body">
              ${this.renderGroupsListHTML(vGroups, isVi)}
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
      return html;
    }

    // 5. Chế độ Chuẩn BibleHub TSK (Single Verse 3-Box Layout: #topver + #leftbox + #centbox & #combox)
    html += `
      <!-- Banner Câu Trọng Tâm (#topver trên BibleHub TSK) -->
      <div class="tsk-topver-banner">
        <div class="topver-coord">
          <span class="topver-badge">
            <i class="fa-solid fa-bookmark"></i> ${displayBookName} ${chNum}:${vNum}
            (${isVi ? 'Bản Truyền Thống 1925' : 'BibleHub TSK'})
          </span>
        </div>
        <div class="topver-text">
          “${isVi ? (verseTextVi || verseTextEn) : (verseTextEn || verseTextVi)}”
        </div>
        ${isVi && verseTextEn ? `<div class="topver-subtext"><b>EN:</b> “${verseTextEn}”</div>` : ''}
        ${!isVi && verseTextVi ? `<div class="topver-subtext"><b>VI (BTT 1925):</b> “${verseTextVi}”</div>` : ''}
      </div>

      <!-- Bố Cục 2 Cột Chuẩn BibleHub TSK: Cột Trái (#leftbox TSK) & Cột Phải (#centbox Outline + #combox Parallel Verses) -->
      <div class="tsk-main-columns">
        <!-- CỘT CHÍNH (#leftbox): Treasury of Scripture Knowledge / Kinh Thánh Đối Chiếu -->
        <section class="tsk-col-leftbox">
          <div class="tsk-section-header">
            <h3>
              <i class="fa-solid fa-link"></i>
              ${isVi ? 'Kho Tàng Kinh Thánh Đối Chiếu (Theo Bản Truyền Thống 1925)' : 'Treasury of Scripture Knowledge (Cross-References)'}
            </h3>
            <span class="tsk-count-badge">
              ${localGroups.reduce((acc, g) => acc + (g.refs ? g.refs.length : 0), 0)} ${isVi ? 'câu đối chiếu' : 'cross-references'}
            </span>
          </div>
          <div class="tsk-leftbox-body">
            ${this.renderGroupsListHTML(localGroups, isVi, liveData?.groups_live)}
          </div>
        </section>

        <!-- CỘT PHỤ (#centbox & #combox): Chapter Outline, Topical Jumps & Parallel Verses -->
        <aside class="tsk-col-sidebox">
          <!-- Khối 1 (#centbox): Chapter Outline & Jump to Previous / Next từ BibleHub -->
          <div class="tsk-side-card">
            <div class="tsk-section-header">
              <h3>
                <i class="fa-solid fa-list-check"></i>
                ${isVi ? `Bố Cục Chương (${currentBook.name_vi} ${chNum})` : `Chapter Outline (${currentBook.name_en} ${chNum})`}
              </h3>
            </div>
            <div class="tsk-outline-body">
              ${this.renderOutlineAndJumpsHTML(bId, chNum, vNum, isVi, liveData, passageData)}
            </div>
          </div>

          <!-- Khối 2 (#combox): Parallel Verses (Các Bản Dịch Song Song cho câu hiện tại) -->
          <div class="tsk-side-card">
            <div class="tsk-section-header">
              <h3>
                <i class="fa-solid fa-columns"></i>
                ${isVi ? `Các Bản Dịch Tiếng Việt (${currentBook.name_vi} ${chNum}:${vNum})` : `Parallel Verses (${currentBook.name_en} ${chNum}:${vNum})`}
              </h3>
            </div>
            <div class="tsk-parallel-side-body">
              ${this.renderParallelBoxHTML(bId, chNum, vNum, isVi, currentVerseObj, liveData)}
            </div>
          </div>
        </aside>
      </div>
    </div>
    `;

    return html;
  }

  // Render danh sách các cụm từ khóa (.hdg) và toàn bộ 100% các câu đối chiếu (.tskverse)
  renderGroupsListHTML(localGroups = [], isVi = true, liveGroups = null) {
    const groups = (Array.isArray(localGroups) && localGroups.length > 0)
      ? localGroups
      : (Array.isArray(liveGroups) ? liveGroups : []);

    if (!groups || groups.length === 0) {
      return `
        <div class="tsk-empty-notice">
          <i class="fa-solid fa-book-open"></i>
          ${isVi
            ? 'Đang tải dữ liệu Kinh Thánh Đối Chiếu cho câu này...'
            : 'Loading Treasury of Scripture Knowledge cross-references...'}
        </div>
      `;
    }

    let html = '';
    groups.forEach((g, gIdx) => {
      // Nếu có liveGroups từ BibleHub và đang ở chế độ English, ưu tiên câu trích dẫn live từ BibleHub nếu có
      const liveGroup = (Array.isArray(liveGroups) && liveGroups[gIdx]) ? liveGroups[gIdx] : null;
      const headingMain = isVi ? `${g.h_vi || g.h_en}.` : `${g.h_en || g.h_vi}.`;
      const headingSub = isVi && g.h_en && g.h_vi !== g.h_en
        ? `<span class="tsk-hdg-sub">(${g.h_en})</span>`
        : (!isVi && g.h_vi && g.h_vi !== g.h_en ? `<span class="tsk-hdg-sub">(${g.h_vi})</span>` : '');

      html += `
        <div class="tsk-hdg-block">
          <div class="tsk-hdg-title">
            <i class="fa-solid fa-diamond" style="font-size: 0.6rem; color: var(--accent-gold);"></i>
            <span class="tsk-hdg-main">${headingMain}</span>
            ${headingSub}
          </div>
          <div class="tsk-verses-stack">
      `;

      const refs = g.refs || [];
      refs.forEach((r, rIdx) => {
        const liveRef = (liveGroup && Array.isArray(liveGroup.refs) && liveGroup.refs[rIdx]) ? liveGroup.refs[rIdx] : null;
        const refTitle = isVi ? (r.r_vi || r.r_en) : (liveRef?.r_en || r.r_en || r.r_vi);
        const verseQuote = isVi
          ? (r.t_vi || r.t_en || '')
          : (liveRef?.t_en || r.t_en || r.t_vi || '');

        html += `
          <div class="tsk-verse-entry">
            <div class="tsk-verse-entry-header">
              <button type="button" class="tsk-verse-anchor-link" data-tsk-jump-book="${r.b}" data-tsk-jump-ch="${r.c}" data-tsk-jump-v="${r.v}" data-ref="${r.r_vi || r.r_en}" title="${isVi ? `Nhấp để xem đối chiếu ${r.r_vi}` : `Click to open ${r.r_en}`}">
                ${refTitle}
              </button>
              <button type="button" class="tsk-peek-modal-btn tsk-ref-link" data-ref="${r.r_vi || r.r_en}" title="${isVi ? 'Đọc câu này trong cửa sổ xem nhanh' : 'Quick preview passage'}">
                <i class="fa-solid fa-eye"></i> ${isVi ? 'Xem đoạn' : 'Peek'}
              </button>
            </div>
            <div class="tsk-verse-entry-text">
              ${verseQuote}
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    return html;
  }

  // Render Bố Cục Chương (#centbox: Chapter Outline & Jump to Previous / Next)
  renderOutlineAndJumpsHTML(bookId, chapterNum, verseNum, isVi, liveData, passageData) {
    let html = '';

    if (liveData && Array.isArray(liveData.outline) && liveData.outline.length > 0) {
      html += `<div class="tsk-outline-list">`;
      liveData.outline.forEach(item => {
        html += `
          <div class="tsk-outline-row">
            <button type="button" class="tsk-outline-vbtn" data-tsk-vpill="${item.verse}">
              ${isVi ? `Câu ${item.verse}` : `v.${item.verse}`}
            </button>
            <span class="tsk-outline-desc">${item.text_en}</span>
          </div>
        `;
      });
      html += `</div>`;
    } else {
      const titleVi = passageData?.title_vi || `${bookId} ${chapterNum}`;
      html += `
        <div class="tsk-outline-list">
          <div class="tsk-outline-row">
            <button type="button" class="tsk-outline-vbtn" data-tsk-vpill="1">${isVi ? 'Câu 1' : 'v.1'}</button>
            <span class="tsk-outline-desc">${titleVi}</span>
          </div>
        </div>
      `;
    }

    if (liveData && ((liveData.jump_prev && liveData.jump_prev.length > 0) || (liveData.jump_next && liveData.jump_next.length > 0))) {
      if (liveData.jump_prev && liveData.jump_prev.length > 0) {
        html += `
          <div class="tsk-jump-box">
            <div class="tsk-jump-label"><i class="fa-solid fa-backward-step"></i> ${isVi ? 'Chủ đề câu trước (Jump to Previous):' : 'Jump to Previous:'}</div>
            <div class="tsk-jump-chips">
              ${liveData.jump_prev.map(j => `
                <button type="button" class="tsk-jump-chip" data-tsk-jump-book="${j.b}" data-tsk-jump-ch="${j.c}" data-tsk-jump-v="${j.v}">
                  &larr; ${j.word} (${j.b} ${j.c}:${j.v})
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
      if (liveData.jump_next && liveData.jump_next.length > 0) {
        html += `
          <div class="tsk-jump-box">
            <div class="tsk-jump-label"><i class="fa-solid fa-forward-step"></i> ${isVi ? 'Chủ đề câu tiếp (Jump to Next):' : 'Jump to Next:'}</div>
            <div class="tsk-jump-chips">
              ${liveData.jump_next.map(j => `
                <button type="button" class="tsk-jump-chip" data-tsk-jump-book="${j.b}" data-tsk-jump-ch="${j.c}" data-tsk-jump-v="${j.v}">
                  ${j.word} (${j.b} ${j.c}:${j.v}) &rarr;
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }
    }

    return html;
  }

  // Render Khối Các Bản Dịch Song Song (#combox: Parallel Verses) theo ngôn ngữ đã chọn
  renderParallelBoxHTML(bookId, chapterNum, verseNum, isVi, verseObj, liveData) {
    if (!isVi && liveData && Array.isArray(liveData.parallel_en) && liveData.parallel_en.length > 0) {
      return liveData.parallel_en.map(p => `
        <div class="tsk-combox-item">
          <div class="tsk-combox-vname">${p.version}</div>
          <div class="tsk-combox-vtext">${p.text}</div>
        </div>
      `).join('');
    }

    const versionIds = isVi
      ? ['BTT', 'KTHD', 'BTHD', 'BDM', 'BD2011', 'BPT', 'CGKPV']
      : ['KJV', 'ESV', 'NKJV', 'NIV', 'INTERLINEAR'];

    const parallelItems = bibleEngine?.getParallelVerses
      ? bibleEngine.getParallelVerses(bookId, chapterNum, verseNum, versionIds)
      : [];

    return parallelItems.map(item => `
      <div class="tsk-combox-item">
        <div class="tsk-combox-vname">${item.version_id} • ${item.version_name}</div>
        <div class="tsk-combox-vtext">${item.text}</div>
      </div>
    `).join('');
  }

  // Render Cross-Reference HTML panel inside Drawer Inspector (Tab "KT Đối Chiếu" bên phải)
  renderCrossReferenceHTML(verseKey, defaultRefs = null) {
    const parts = (verseKey || 'JHN.1.1').split('.');
    const bId = (parts[0] || 'JHN').toUpperCase();
    const chNum = parseInt(parts[1], 10) || 1;
    const vNum = parseInt(parts[2], 10) || 1;
    const localGroups = bibleEngine?.tskBookCache?.[bId]?.chapters?.[String(chNum)]?.[String(vNum)];
    const tskUrl = bibleEngine?.getBibleHubTSKUrl ? bibleEngine.getBibleHubTSKUrl(bId, chNum, vNum) : 'https://biblehub.com/tsk/';
    const isVi = this.activeLangMode !== 'en';

    let html = `
      <div class="crossref-container animate-fade-in">
        <div class="metaphor-card" style="border-left: 3px solid var(--accent-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
            <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin: 0;">
              <i class="fa-solid fa-book-atlas"></i> KT Đối Chiếu (BibleHub TSK)
            </h4>
            <div class="tsk-lang-switch-group" style="display: inline-flex; gap: 0.35rem;">
              <button type="button" class="tsk-lang-toggle-btn ${isVi ? 'active' : ''}" data-tsk-lang="vi">
                Vietnamese (BTT)
              </button>
              <button type="button" class="tsk-lang-toggle-btn ${!isVi ? 'active' : ''}" data-tsk-lang="en">
                English (TSK)
              </button>
            </div>
          </div>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
            Dữ liệu từ <a href="${tskUrl}" target="_blank" rel="noopener" style="color: var(--accent-gold); text-decoration: underline;">biblehub.com/tsk</a>.
          </p>
          <button type="button" id="drawer-open-full-tsk-tab-btn" class="btn-primary" style="width: 100%; padding: 0.4rem 0.75rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i> Mở Tab Riêng "KT Đối Chiếu" Toàn Màn Hình
          </button>
        </div>
    `;

    if (Array.isArray(localGroups) && localGroups.length > 0) {
      html += `<div class="parallel-verse-card" style="padding: 0.85rem;">`;
      html += this.renderGroupsListHTML(localGroups, isVi);
      html += `</div></div>`;
      return html;
    }

    const list = defaultRefs || this.getCrossReferences(verseKey);
    html += `<div class="crossref-items-list" style="display: flex; flex-direction: column; gap: 0.85rem;">`;

    list.forEach(item => {
      const refText = typeof item === 'string' ? item : item.ref;
      const noteText = typeof item === 'object' && item.note ? item.note : '';
      const previewQuote = this.fetchVersePreview(refText);

      html += `
        <div class="parallel-verse-card">
          <div class="parallel-card-header">
            <span class="version-code-badge"><i class="fa-solid fa-arrow-turn-down-right"></i> ${refText}</span>
            <button class="banner-action-btn crossref-peek-btn tsk-ref-link" data-ref="${refText}" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">
              <i class="fa-solid fa-eye"></i> Xem Nhanh
            </button>
          </div>
          <div class="parallel-card-text" style="font-size: 0.95rem; font-style: italic; color: var(--accent-gold-light);">
            "${previewQuote}"
          </div>
          ${noteText ? `<p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem;"><i class="fa-solid fa-lightbulb" style="color: var(--accent-gold);"></i> ${noteText}</p>` : ''}
        </div>
      `;
    });

    html += `</div></div>`;
    return html;
  }
}

export const crossRefEngine = new CrossRefEngine();
