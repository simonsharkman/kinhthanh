/* ==========================================================================
   LOGOS MULTIVERSE - HERMENEUTICS & TYPOLOGY ENGINE
   Metaphor Deconstruction, Biblical Genre Rules & Historical Context
   ========================================================================== */

export class HermeneuticsEngine {
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
          <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.5rem;">
            <i class="fa-solid fa-book-bookmark"></i> Bối Cảnh Sách: ${bookMetadata.name_vi}
          </h4>
          <p style="font-size: 0.88rem; margin-bottom: 0.35rem;"><strong>Tác giả:</strong> ${bookMetadata.author}</p>
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
          <h4 class="metaphor-card-title" style="color: ${genre.color};">
            <i class="fa-solid ${genre.icon}"></i>
            <span>Quy Chuẩn Giải Kinh: Thể Loại ${genre.name_vi}</span>
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1rem;">
            ${genre.core_definition}
          </p>

          <div class="metaphor-section-label" style="color: ${genre.color};">
            <i class="fa-solid fa-compass"></i> Các Nguyên Tắc Giải Nghĩa Cốt Lõi:
          </div>
          <ul style="padding-left: 1.25rem; font-size: 0.88rem; color: var(--text-primary); margin-top: 0.4rem;">
            ${principlesList}
          </ul>

          <div class="metaphor-section" style="margin-top: 1rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.08); border-radius: 6px; border-left: 3px solid var(--status-danger);">
            <div style="font-weight: 700; color: #f87171; font-size: 0.8rem; text-transform: uppercase;">
              <i class="fa-solid fa-circle-exclamation"></i> Cạm Bẫy Giải Kinh Cần Tránh:
            </div>
            <p style="font-size: 0.86rem; color: var(--text-primary); margin-top: 0.25rem;">
              ${genre.common_pitfalls}
            </p>
          </div>
        </div>
      </div>
    `;
  }
}

export const hermeneuticsEngine = new HermeneuticsEngine();
