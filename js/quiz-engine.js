/* ==========================================================================
   LOGOS MULTIVERSE - BIBLE QUIZ & VTKTH THEOLOGICAL EXAM ENGINE
   Ngân Hàng Đố Kinh Thánh, Flashcard Câu Gốc & 10 Bộ Đề Thi Thử
   Viện Thánh Kinh Thần Học (Hội Thánh Tin Lành Việt Nam - BTT 1925)
   ========================================================================== */

import { state } from './state.js';

export class QuizEngine {
  constructor() {
    this.db = null;
    this.activeTab = 'quiz'; // 'quiz', 'flashcards', 'sets', 'theology', 'events'
    
    // Quiz state
    this.currentQIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    
    // Flashcard state
    this.currentCardIndex = 0;
    this.isCardFlipped = false;
    
    // Sets state
    this.currentSetId = 1;
    this.showAllSetAnswers = false;
    
    // Theology filter state
    this.theoCategory = 'ALL';
    this.theoSearchQuery = '';
    
    // Events filter state
    this.eventsSearchQuery = '';
  }

  async loadData() {
    if (this.db) return this.db;
    try {
      const resp = await fetch('data/quiz-database.json');
      if (resp.ok) {
        this.db = await resp.json();
      }
    } catch (e) {
      console.warn("Could not fetch quiz-database.json, using fallback", e);
    }

    if (!this.db) {
      this.db = {
        quizData: [
          { q: 'Tin Lành được chính thức truyền đến Việt Nam vào năm nào và tại thành phố nào?', options: ['1911 tại Đà Nẵng', '1921 tại Hà Nội', '1927 tại Sài Gòn', '1914 tại Nha Trang'], correct: 0, exp: 'Năm 1911, các giáo sĩ CMA đầu tiên đặt chân đến Đà Nẵng mở đầu công cuộc truyền giáo chính thức.' },
          { q: 'Ai là Hội trưởng đầu tiên của Tổng Hội Hội Thánh Tin Lành Việt Nam đắc cử năm 1927?', options: ['Mục sư Lê Văn Thái', 'Mục sư Hoàng Trọng Thừa', 'Mục sư Ông Văn Huyên', 'Mục sư Phạm Xuân Tín'], correct: 1, exp: 'Đại hội Đồng Tổng Hội lần thứ nhất năm 1927 tại Đà Nẵng đã bầu Mục sư Hoàng Trọng Thừa làm Hội trưởng đầu tiên.' },
          { q: 'Kinh Thánh Bản Truyền Thống tiếng Việt được xuất bản trọn bộ vào năm nào?', options: ['1925', '1911', '1934', '1926'], correct: 3, exp: 'Bản dịch do cụ Phan Khôi và các giáo sĩ dịch hoàn thành năm 1925 và in ấn phát hành trọn bộ năm 1926 (thường gọi BTT 1925/1926).' }
        ],
        flashcardsData: [
          { cat: "CỰU ƯỚC", verse: "Ban đầu Đức Chúa Trời dựng nên trời đất.", ref: "Sáng-thế Ký 1:1", detail: "Câu mở đầu Kinh Thánh, nền tảng của Thần học Sáng tạo." },
          { cat: "CỰU ƯỚC", verse: "Ta sẽ làm cho mày cùng người nữ, dòng dõi mày cùng dòng dõi người nghịch thù nhau. Người sẽ giày đạp đầu mày, còn mày sẽ cắn gót chân người.", ref: "Sáng-thế Ký 3:15", detail: "Tiền Phúc Âm (Protoevangelium) - Lời tiên tri đầu tiên về Đấng Cứu Thế." }
        ],
        newSetsData: [],
        theologyData: [],
        eventsData: []
      };
    }
    return this.db;
  }

  async render(container) {
    if (!container) return;
    await this.loadData();

    container.innerHTML = `
      <div class="quiz-container animate-fade-in">
        <!-- Header -->
        <header class="quiz-hero-header">
          <div class="quiz-hero-badge">
            <i class="fa-solid fa-graduation-cap"></i> KHẢO THÍ & DƯỠNG LINH
          </div>
          <h1 class="quiz-hero-title">ĐỐ KINH THÁNH & ÔN THI VIỆN THÁNH KINH THẦN HỌC</h1>
          <p class="quiz-hero-subtitle">
            Cẩm nang luyện thi trắc nghiệm, Flashcard thuộc lòng câu gốc kim cương & 10 bộ đề thi thử tuyển sinh chính thức của Hội Thánh Tin Lành Việt Nam (Bản Truyền Thống 1925).
          </p>
        </header>

        <!-- Navigation Tabs -->
        <div class="quiz-nav-subtabs" role="tablist">
          <button class="quiz-subtab-btn ${this.activeTab === 'quiz' ? 'active' : ''}" data-quiz-tab="quiz">
            <i class="fa-solid fa-square-check"></i> <span>Trắc Nghiệm Thi Thử</span>
          </button>
          <button class="quiz-subtab-btn ${this.activeTab === 'flashcards' ? 'active' : ''}" data-quiz-tab="flashcards">
            <i class="fa-solid fa-clone"></i> <span>Flashcard Câu Gốc (${this.db.flashcardsData?.length || 0})</span>
          </button>
          <button class="quiz-subtab-btn ${this.activeTab === 'sets' ? 'active' : ''}" data-quiz-tab="sets">
            <i class="fa-solid fa-book-bookmark"></i> <span>10 Bộ Đề Thi (${this.db.newSetsData?.length || 0} Câu)</span>
          </button>
          <button class="quiz-subtab-btn ${this.activeTab === 'theology' ? 'active' : ''}" data-quiz-tab="theology">
            <i class="fa-solid fa-landmark"></i> <span>Thần Học & Giáo Lý (${this.db.theologyData?.length || 0})</span>
          </button>
          <button class="quiz-subtab-btn ${this.activeTab === 'events' ? 'active' : ''}" data-quiz-tab="events">
            <i class="fa-solid fa-map-location-dot"></i> <span>Sự Kiện Ở Đoạn Nào?</span>
          </button>
        </div>

        <!-- Tab Content Viewport -->
        <div class="quiz-tab-content-pane" id="quiz-tab-pane">
          ${this.renderActiveTabHTML()}
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  renderActiveTabHTML() {
    switch (this.activeTab) {
      case 'quiz':
        return this.renderQuizTab();
      case 'flashcards':
        return this.renderFlashcardsTab();
      case 'sets':
        return this.renderSetsTab();
      case 'theology':
        return this.renderTheologyTab();
      case 'events':
        return this.renderEventsTab();
      default:
        return this.renderQuizTab();
    }
  }

  // 1. Trắc Nghiệm Thi Thử (Multiple-Choice Quiz)
  renderQuizTab() {
    const list = this.db.quizData || [];
    if (list.length === 0) return `<p class="quiz-empty-msg">Chưa có câu hỏi trắc nghiệm.</p>`;

    if (this.currentQIndex >= list.length) {
      // Completed Screen
      const percentage = Math.round((this.quizScore / list.length) * 100);
      let praise = "Hãy tiếp tục tra xem Lời Chúa mỗi ngày!";
      if (percentage === 100) praise = "Xuất sắc! Bạn nắm vững Kinh Thánh và Lịch sử Hội Thánh rất tuyệt vời!";
      else if (percentage >= 80) praise = "Rất tốt! Kiến thức Thánh Kinh của bạn rất vững vàng!";

      return `
        <div class="quiz-result-card animate-scale-up">
          <div class="result-trophy-icon"><i class="fa-solid fa-award"></i></div>
          <h2 class="result-title">Hoàn Thành Bài Thi Thử!</h2>
          <div class="result-score-big">${this.quizScore} / ${list.length}</div>
          <div class="result-percentage">Đạt ${percentage}% tổng điểm</div>
          <p class="result-praise">${praise}</p>
          <button type="button" class="btn-primary quiz-restart-btn" id="quiz-btn-restart">
            <i class="fa-solid fa-rotate-right"></i> Làm Lại Từ Đầu
          </button>
        </div>
      `;
    }

    const cur = list[this.currentQIndex];
    return `
      <div class="quiz-play-box animate-fade-in">
        <div class="quiz-meta-row">
          <span class="quiz-counter-tag"><i class="fa-solid fa-circle-question"></i> Câu hỏi ${this.currentQIndex + 1} / ${list.length}</span>
          <span class="quiz-score-tag"><i class="fa-solid fa-star"></i> Điểm: ${this.quizScore}</span>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${((this.currentQIndex) / list.length) * 100}%;"></div>
        </div>

        <div class="quiz-question-text">${cur.q}</div>

        <div class="quiz-options-list" id="quiz-options-list">
          ${cur.options.map((opt, i) => `
            <button type="button" class="quiz-option-btn" data-option-index="${i}">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span class="opt-label">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-feedback-box hidden" id="quiz-feedback-box">
          <div class="feedback-title" id="quiz-feedback-title"></div>
          <div class="feedback-exp" id="quiz-feedback-exp">${cur.exp || ''}</div>
          <button type="button" class="btn-primary quiz-next-q-btn" id="quiz-btn-next-q">
            ${this.currentQIndex + 1 === list.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'} <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // 2. Flashcard Câu Gốc
  renderFlashcardsTab() {
    const list = this.db.flashcardsData || [];
    if (list.length === 0) return `<p class="quiz-empty-msg">Chưa có Flashcard.</p>`;

    const card = list[this.currentCardIndex] || list[0];
    return `
      <div class="flashcards-wrapper animate-fade-in">
        <div class="fc-controls-top">
          <span class="fc-counter-badge"><i class="fa-solid fa-clone"></i> Thẻ ${this.currentCardIndex + 1} / ${list.length}</span>
          <button type="button" class="fc-shuffle-btn" id="fc-btn-shuffle" title="Đảo ngẫu nhiên thẻ">
            <i class="fa-solid fa-shuffle"></i> Ngẫu nhiên
          </button>
        </div>

        <div class="flashcard-scene" id="flashcard-scene">
          <div class="flashcard-card ${this.isCardFlipped ? 'flipped' : ''}" id="flashcard-inner">
            <!-- Mặt Trước: Câu gốc -->
            <div class="flashcard-face flashcard-front">
              <span class="fc-cat-badge">${card.cat || 'KINH THÁNH'}</span>
              <div class="fc-verse-text">"${card.verse}"</div>
              <div class="fc-hint-action"><i class="fa-solid fa-hand-pointer"></i> Nhấp thẻ để xem Địa chỉ & Giải nghĩa</div>
            </div>

            <!-- Mặt Sau: Địa chỉ & Giải nghĩa -->
            <div class="flashcard-face flashcard-back">
              <span class="fc-back-title">ĐỊA CHỈ THÁNH KINH</span>
              <div class="fc-ref-highlight">${card.ref}</div>
              <div class="fc-detail-text">${card.detail || ''}</div>
              <div class="fc-hint-action"><i class="fa-solid fa-rotate-left"></i> Nhấp thẻ để lật lại</div>
            </div>
          </div>
        </div>

        <div class="fc-nav-bar">
          <button type="button" class="fc-nav-btn" id="fc-btn-prev" title="Thẻ trước">
            <i class="fa-solid fa-chevron-left"></i> Trước
          </button>
          <button type="button" class="btn-primary fc-flip-trigger-btn" id="fc-btn-flip">
            <i class="fa-solid fa-arrows-rotate"></i> Lật Thẻ
          </button>
          <button type="button" class="fc-nav-btn" id="fc-btn-next" title="Thẻ sau">
            Sau <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  // 3. 10 Bộ Đề Thi Thử VTKTH
  renderSetsTab() {
    const list = this.db.newSetsData || [];
    const setsMeta = [
      { id: 1, title: "SỰ SÁNG TẠO, GIAO ƯỚC & SỰ CỨU RỖI CĂN BẢN" },
      { id: 2, title: "LỊCH SỬ DÂN Y-SƠ-RA-ÊN, CÁC VUA & TIÊN TRI" },
      { id: 3, title: "THƠ CA, KHÔN NGOAN & THI THIÊN ĐẤNG MÊ-SI" },
      { id: 4, title: "CÁC SÁCH ĐẠI TIÊN TRI & BỐI CẢNH LƯU ĐÀY" },
      { id: 5, title: "CÁC SÁCH TIỂU TIÊN TRI & SỨ ĐIỆP NGÀY CỦA CHÚA" },
      { id: 6, title: "PHÚC ÂM QUAN PHÒNG & CHÚC VỤ CHÚA JÊSUS" },
      { id: 7, title: "LỊCH SỬ HỘI THÁNH BAN ĐẦU & SÁCH CÔNG VỤ" },
      { id: 8, title: "CÁC THƯ TÍN PHAOLÔ - THẦN HỌC & GIÁO LÝ" },
      { id: 9, title: "CÁC THƯ TÍN CHUNG & ĐỨC TIN THỰC HÀNH" },
      { id: 10, title: "SÁCH KHẢI HUYỀN & THẦN HỌC MẠT THẾ" }
    ];

    const currentQuestions = list.filter(item => item.set_id === this.currentSetId);

    return `
      <div class="exam-sets-wrapper animate-fade-in">
        <!-- Sets Picker Tabs -->
        <div class="exam-sets-picker-scroll">
          ${setsMeta.map(s => `
            <button type="button" class="exam-set-pill ${s.id === this.currentSetId ? 'active' : ''}" data-set-id="${s.id}">
              Đề ${s.id < 10 ? '0' + s.id : s.id}
            </button>
          `).join('')}
        </div>

        <div class="exam-set-banner">
          <div class="set-banner-info">
            <span class="set-badge">BỘ ĐỀ SỐ ${this.currentSetId}</span>
            <h2 class="set-banner-title">${setsMeta.find(s => s.id === this.currentSetId)?.title || ''}</h2>
            <span class="set-count">${currentQuestions.length} Câu hỏi trắc nghiệm & ôn thi chuyên sâu</span>
          </div>
          <button type="button" class="btn-secondary toggle-all-answers-btn" id="btn-toggle-all-answers">
            <i class="fa-solid fa-eye"></i> ${this.showAllSetAnswers ? 'Ẩn Hết Đáp Án' : 'Hiện Hết Đáp Án'}
          </button>
        </div>

        <div class="exam-questions-list">
          ${currentQuestions.map(q => `
            <div class="exam-question-card" data-q-num="${q.q_num}">
              <div class="eq-header">
                <span class="eq-num">Câu ${q.q_num}</span>
                <span class="eq-topic">${q.a}</span>
              </div>
              <div class="eq-text">${q.q}</div>
              <div class="eq-answer-box ${this.showAllSetAnswers ? '' : 'hidden'}" id="ans-box-${q.set_id}-${q.q_num}">
                <div class="eq-answer-label"><i class="fa-solid fa-check-double"></i> ĐÁP ÁN: <b>${q.a}</b></div>
                ${q.exp ? `<div class="eq-answer-exp">💡 <b>Cơ sở Thánh Kinh:</b> ${q.exp}</div>` : ''}
              </div>
              <button type="button" class="eq-toggle-btn" data-target="ans-box-${q.set_id}-${q.q_num}">
                <i class="fa-solid fa-chevron-down"></i> <span>${this.showAllSetAnswers ? 'Ẩn đáp án' : 'Xem đáp án'}</span>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Thần Học & Giáo Lý (200 Câu)
  renderTheologyTab() {
    const list = this.db.theologyData || [];
    const query = this.theoSearchQuery.toLowerCase().trim();
    const secFilter = this.theoCategory;

    const filtered = list.filter(item => {
      const matchSec = (secFilter === 'ALL') || item.section.startsWith(secFilter);
      const matchQuery = !query || item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
      return matchSec && matchQuery;
    });

    return `
      <div class="theology-wrapper animate-fade-in">
        <!-- Search and Filter Bar -->
        <div class="theology-filter-bar">
          <div class="theology-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="theology-search-input" value="${this.theoSearchQuery}" placeholder="Tìm nhanh trong 200 câu Thần học, Giáo lý, Lịch sử Hội Thánh..." />
            ${this.theoSearchQuery ? '<button type="button" id="theology-search-clear" class="btn-clear"><i class="fa-solid fa-xmark"></i></button>' : ''}
          </div>

          <div class="theology-section-tabs">
            <button class="theo-sec-pill ${secFilter === 'ALL' ? 'active' : ''}" data-theo-sec="ALL">Tất Cả (200)</button>
            <button class="theo-sec-pill ${secFilter === 'PHẦN I' ? 'active' : ''}" data-theo-sec="PHẦN I">I. Thần Học & Giáo Lý</button>
            <button class="theo-sec-pill ${secFilter === 'PHẦN II' ? 'active' : ''}" data-theo-sec="PHẦN II">II. Lễ Nghi & Giáo Nghi</button>
            <button class="theo-sec-pill ${secFilter === 'PHẦN III' ? 'active' : ''}" data-theo-sec="PHẦN III">III. Đạo Đức Học</button>
            <button class="theo-sec-pill ${secFilter === 'PHẦN IV' ? 'active' : ''}" data-theo-sec="PHẦN IV">IV. Lịch Sử Hội Thánh</button>
          </div>
        </div>

        <div class="theology-results-count">
          Hiển thị <b>${filtered.length}</b> / ${list.length} câu hỏi chuyên đề
        </div>

        <!-- Cards List -->
        <div class="theology-cards-grid">
          ${filtered.map(item => `
            <div class="theology-item-card">
              <div class="theo-card-header">
                <span class="theo-id-badge">#${item.id}</span>
                <span class="theo-sec-tag">${item.section.split(':')[1]?.trim() || item.section}</span>
              </div>
              <h3 class="theo-q-title">${item.q}</h3>
              <div class="theo-a-body">
                <i class="fa-solid fa-quote-left theo-quote-icon"></i>
                <div class="theo-a-text">${item.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 5. Sự Kiện Ở Đoạn Nào?
  renderEventsTab() {
    const list = this.db.eventsData || [];
    const query = this.eventsSearchQuery.toLowerCase().trim();
    const filtered = list.filter(item => {
      return !query || item.name.toLowerCase().includes(query) || item.ref.toLowerCase().includes(query) || (item.note && item.note.toLowerCase().includes(query));
    });

    return `
      <div class="events-wrapper animate-fade-in">
        <div class="events-hero-bar">
          <div class="events-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="events-search-input" value="${this.eventsSearchQuery}" placeholder="Tra cứu sự kiện (ví dụ: nước thành rượu, hài cốt khô, lễ ngũ tuần, tiệc ly)..." />
            ${this.eventsSearchQuery ? '<button type="button" id="events-search-clear" class="btn-clear"><i class="fa-solid fa-xmark"></i></button>' : ''}
          </div>
        </div>

        <div class="events-table-card">
          <table class="events-table">
            <thead>
              <tr>
                <th style="width: 50px;">STT</th>
                <th>Sự Kiện Kinh Thánh Kinh Điển</th>
                <th style="width: 220px;">Địa Chỉ Đoạn</th>
                <th>Ghi Chú Thần Học</th>
                <th style="width: 110px;">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((item, idx) => `
                <tr class="event-tr">
                  <td class="event-idx">${idx + 1}</td>
                  <td class="event-name"><b>${item.name}</b></td>
                  <td class="event-ref"><span class="event-ref-pill">${item.ref}</span></td>
                  <td class="event-note">${item.note || ''}</td>
                  <td class="event-action">
                    <button type="button" class="event-goto-btn" data-event-ref="${item.ref}" title="Đọc phân đoạn này">
                      <i class="fa-solid fa-book-open"></i> Đọc
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  bindEvents(container) {
    if (!container) return;

    // Subtab switching
    container.querySelectorAll('.quiz-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.dataset.quizTab;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          container.querySelectorAll('.quiz-subtab-btn').forEach(b => b.classList.toggle('active', b === btn));
          pane.innerHTML = this.renderActiveTabHTML();
          this.bindTabEvents(container);
        }
      });
    });

    this.bindTabEvents(container);
  }

  bindTabEvents(container) {
    // Tab 1: Quiz interaction
    if (this.activeTab === 'quiz') {
      const list = this.db.quizData || [];
      const cur = list[this.currentQIndex];

      container.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.quizAnswered) return;
          this.quizAnswered = true;

          const chosen = parseInt(btn.dataset.optionIndex, 10);
          const isCorrect = (chosen === cur.correct);
          if (isCorrect) this.quizScore++;

          container.querySelectorAll('.quiz-option-btn').forEach((b, i) => {
            if (i === cur.correct) {
              b.classList.add('correct');
              b.innerHTML += ` <i class="fa-solid fa-circle-check" style="margin-left: auto;"></i>`;
            } else if (i === chosen && !isCorrect) {
              b.classList.add('incorrect');
              b.innerHTML += ` <i class="fa-solid fa-circle-xmark" style="margin-left: auto;"></i>`;
            }
          });

          const fbBox = container.querySelector('#quiz-feedback-box');
          const fbTitle = container.querySelector('#quiz-feedback-title');
          if (fbBox && fbTitle) {
            fbBox.classList.remove('hidden');
            fbBox.classList.add(isCorrect ? 'correct-fb' : 'wrong-fb');
            fbTitle.innerHTML = isCorrect
              ? `<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i> Chính xác!`
              : `<i class="fa-solid fa-circle-xmark" style="color: #f87171;"></i> Chưa chính xác! Đáp án đúng là: <b>${cur.options[cur.correct]}</b>`;
          }
        });
      });

      container.querySelector('#quiz-btn-next-q')?.addEventListener('click', () => {
        this.currentQIndex++;
        this.quizAnswered = false;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderQuizTab();
          this.bindTabEvents(container);
        }
      });

      container.querySelector('#quiz-btn-restart')?.addEventListener('click', () => {
        this.currentQIndex = 0;
        this.quizScore = 0;
        this.quizAnswered = false;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderQuizTab();
          this.bindTabEvents(container);
        }
      });
    }

    // Tab 2: Flashcards interaction
    if (this.activeTab === 'flashcards') {
      const list = this.db.flashcardsData || [];
      const cardInner = container.querySelector('#flashcard-inner');

      const toggleFlip = () => {
        this.isCardFlipped = !this.isCardFlipped;
        cardInner?.classList.toggle('flipped', this.isCardFlipped);
      };

      container.querySelector('#flashcard-scene')?.addEventListener('click', toggleFlip);
      container.querySelector('#fc-btn-flip')?.addEventListener('click', toggleFlip);

      container.querySelector('#fc-btn-prev')?.addEventListener('click', () => {
        this.isCardFlipped = false;
        this.currentCardIndex = (this.currentCardIndex - 1 + list.length) % list.length;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderFlashcardsTab();
          this.bindTabEvents(container);
        }
      });

      container.querySelector('#fc-btn-next')?.addEventListener('click', () => {
        this.isCardFlipped = false;
        this.currentCardIndex = (this.currentCardIndex + 1) % list.length;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderFlashcardsTab();
          this.bindTabEvents(container);
        }
      });

      container.querySelector('#fc-btn-shuffle')?.addEventListener('click', () => {
        this.isCardFlipped = false;
        this.currentCardIndex = Math.floor(Math.random() * list.length);
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderFlashcardsTab();
          this.bindTabEvents(container);
        }
      });
    }

    // Tab 3: Sets interaction
    if (this.activeTab === 'sets') {
      container.querySelectorAll('.exam-set-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.currentSetId = parseInt(pill.dataset.setId, 10);
          const pane = container.querySelector('#quiz-tab-pane');
          if (pane) {
            pane.innerHTML = this.renderSetsTab();
            this.bindTabEvents(container);
          }
        });
      });

      container.querySelector('#btn-toggle-all-answers')?.addEventListener('click', () => {
        this.showAllSetAnswers = !this.showAllSetAnswers;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderSetsTab();
          this.bindTabEvents(container);
        }
      });

      container.querySelectorAll('.eq-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.target;
          const box = container.querySelector(`#${targetId}`);
          if (box) {
            const isHidden = box.classList.toggle('hidden');
            const span = btn.querySelector('span');
            if (span) span.textContent = isHidden ? 'Xem đáp án' : 'Ẩn đáp án';
          }
        });
      });
    }

    // Tab 4: Theology interaction
    if (this.activeTab === 'theology') {
      const searchInput = container.querySelector('#theology-search-input');
      const searchClear = container.querySelector('#theology-search-clear');

      searchInput?.addEventListener('input', (e) => {
        this.theoSearchQuery = e.target.value;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderTheologyTab();
          this.bindTabEvents(container);
          // Restore focus
          const input = container.querySelector('#theology-search-input');
          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }
      });

      searchClear?.addEventListener('click', () => {
        this.theoSearchQuery = '';
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderTheologyTab();
          this.bindTabEvents(container);
        }
      });

      container.querySelectorAll('.theo-sec-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.theoCategory = pill.dataset.theoSec;
          const pane = container.querySelector('#quiz-tab-pane');
          if (pane) {
            pane.innerHTML = this.renderTheologyTab();
            this.bindTabEvents(container);
          }
        });
      });
    }

    // Tab 5: Events interaction
    if (this.activeTab === 'events') {
      const searchInput = container.querySelector('#events-search-input');
      const searchClear = container.querySelector('#events-search-clear');

      searchInput?.addEventListener('input', (e) => {
        this.eventsSearchQuery = e.target.value;
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderEventsTab();
          this.bindTabEvents(container);
          const input = container.querySelector('#events-search-input');
          if (input) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }
      });

      searchClear?.addEventListener('click', () => {
        this.eventsSearchQuery = '';
        const pane = container.querySelector('#quiz-tab-pane');
        if (pane) {
          pane.innerHTML = this.renderEventsTab();
          this.bindTabEvents(container);
        }
      });

      // Quick jump to Bible reader
      container.querySelectorAll('.event-goto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const rawRef = btn.dataset.eventRef; // e.g. "Sáng-thế Ký 1 - 2" or "Giăng 2"
          const parsed = this.parseScriptureRef(rawRef);
          if (parsed) {
            state.setPassage(parsed.bookId, parsed.chapter, 1);
            state.setActiveView('bible');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    }
  }

  parseScriptureRef(refStr) {
    if (!refStr) return null;
    const clean = refStr.split('-')[0].trim(); // Take first chapter if range
    const match = clean.match(/^([^\d]+)\s*(\d+)/);
    if (!match) return null;

    const bookNameVi = match[1].trim();
    const ch = parseInt(match[2], 10) || 1;

    const mapping = {
      'Sáng-thế Ký': 'GEN', 'Xuất Ê-díp-tô Ký': 'EXO', 'Lê-vi Ký': 'LEV', 'Dân-số Ký': 'NUM', 'Phục-truyền Luật-lệ Ký': 'DEU',
      'Giô-suê': 'JOS', 'Quan Xét': 'JDG', 'Ru-tơ': 'RUT', '1 Sa-mu-ên': '1SA', '2 Sa-mu-ên': '2SA',
      '1 Các Vua': '1KI', '2 Các Vua': '2KI', '1 Sử-ký': '1CH', '2 Sử-ký': '2CH', 'E-xơ-ra': 'EZR', 'Nê-hê-mi': 'NEH', 'Ê-xơ-tê': 'EST',
      'Gióp': 'JOB', 'Thi-thiên': 'PSA', 'Châm-ngôn': 'PRO', 'Truyền-đạo': 'ECC', 'Nhã-ca': 'SNG',
      'Ê-sai': 'ISA', 'Giê-rê-mi': 'JER', 'Ca-thương': 'LAM', 'Ê-xê-chi-ên': 'EZK', 'Đa-ni-ên': 'DAN',
      'Ô-sê': 'HOS', 'Giô-ên': 'JOL', 'A-mốt': 'AMO', 'Áp-đia': 'OBA', 'Giô-na': 'JON', 'Mi-chê': 'MIC', 'Na-hum': 'NAM', 'Ha-ba-cúc': 'HAB', 'Sô-phô-ni': 'ZEP', 'A-ghê': 'HAG', 'Xa-cha-ri': 'ZEC', 'Ma-la-chi': 'MAL',
      'Ma-thi-ơ': 'MAT', 'Mác': 'MRK', 'Lu-ca': 'LUK', 'Giăng': 'JHN', 'Công-vụ': 'ACT', 'Công-vụ các Sứ-đồ': 'ACT',
      'Rô-ma': 'ROM', '1 Cô-rinh-tô': '1CO', '2 Cô-rinh-tô': '2CO', 'Ga-la-ti': 'GAL', 'Ê-phê-sô': 'EPH', 'Phi-líp': 'PHP', 'Cô-lô-se': 'COL',
      '1 Tê-sa-lô-ni-ca': '1TH', '2 Tê-sa-lô-ni-ca': '2TH', '1 Ti-mô-thê': '1TI', '2 Ti-mô-thê': '2TI', 'Tít': 'TIT', 'Phi-lê-môn': 'PHM',
      'Hê-bơ-rơ': 'HEB', 'Gia-cơ': 'JAS', '1 Phi-e-rơ': '1PE', '2 Phi-e-rơ': '2PE', '1 Giăng': '1JN', '2 Giăng': '2JN', '3 Giăng': '3JN', 'Giu-đe': 'JUD', 'Khải-huyền': 'REV'
    };

    const bookId = mapping[bookNameVi] || 'GEN';
    return { bookId, chapter: ch };
  }
}

export const quizEngine = new QuizEngine();
