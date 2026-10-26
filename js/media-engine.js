/* ==========================================================================
   LOGOS MULTIVERSE - VISUAL MEDIA & KNOWLEDGE PORTALS ENGINE
   Maps, Archaeology Artifacts, The Bible Project Video Embeds & Academic Portals
   Seasonal Media Management & Full Admin Studio (v3.0)
   ========================================================================== */

import { storage } from './storage.js';

export const MEDIA_SEASONS = [
  { id: 'all', name: 'Tất Cả Mùa', icon: 'fa-layer-group' },
  { id: 'christmas', name: 'Mùa Giáng Sinh', icon: 'fa-star' },
  { id: 'easter', name: 'Mùa Phục Sinh & Thương Khó', icon: 'fa-cross' },
  { id: 'worship', name: 'Mùa Bồi Linh & Thánh Nhạc', icon: 'fa-music' },
  { id: 'harvest', name: 'Năm Mới & Mùa Gặt', icon: 'fa-wheat-awn' },
  { id: 'academic', name: 'Thường Niên & Khảo Cứu', icon: 'fa-book-atlas' }
];

export class MediaEngine {
  constructor() {
    this.mediaData = { maps: [], archaeology: [], bible_project_videos: [] };
    this.currentSeason = 'all';
    this.isLoaded = false;
  }

  async init() {
    await this.loadMedia();
    this.isLoaded = true;
  }

  async loadMedia() {
    const saved = storage.getVisualMediaLibrary();
    if (saved && saved.bible_project_videos && saved.bible_project_videos.length > 0) {
      this.mediaData = saved;
      return this.mediaData;
    }

    try {
      const res = await fetch('data/visual-media-library.json');
      const data = await res.json();
      
      // Gán mùa vụ mặc định cho các video ban đầu nếu chưa có
      if (data.bible_project_videos) {
        data.bible_project_videos.forEach(v => {
          if (!v.season) {
            if (v.id.includes('john') || v.id.includes('luke')) v.season = 'christmas';
            else if (v.id.includes('exodus') || v.id.includes('romans')) v.season = 'easter';
            else v.season = 'academic';
          }
        });
      }

      this.mediaData = data;
      storage.saveVisualMediaLibrary(this.mediaData);
      return this.mediaData;
    } catch (e) {
      console.error('Failed to load visual media:', e);
      return this.mediaData;
    }
  }

  saveMedia() {
    storage.saveVisualMediaLibrary(this.mediaData);
  }

  setSeason(seasonId) {
    this.currentSeason = seasonId || 'all';
  }

  // --- Admin Media CRUD Handlers ---
  createMediaVideo(videoData) {
    if (!this.mediaData.bible_project_videos) {
      this.mediaData.bible_project_videos = [];
    }
    const newVideo = {
      id: `media_video_${Date.now()}`,
      book_id: videoData.book_id || 'GEN',
      title_vi: videoData.title_vi || 'Video Thánh Kinh Mới',
      description: videoData.description || '',
      youtube_id: videoData.youtube_id || '',
      duration: videoData.duration || '0:00',
      language: videoData.language || 'Tiếng Việt / Phụ đề chuẩn',
      season: videoData.season || 'academic',
      created_at: new Date().toISOString()
    };
    this.mediaData.bible_project_videos.unshift(newVideo);
    this.saveMedia();
    return newVideo;
  }

  updateMediaVideo(videoId, updatedData) {
    const idx = (this.mediaData.bible_project_videos || []).findIndex(v => v.id === videoId);
    if (idx === -1) return null;

    this.mediaData.bible_project_videos[idx] = {
      ...this.mediaData.bible_project_videos[idx],
      ...updatedData
    };
    this.saveMedia();
    return this.mediaData.bible_project_videos[idx];
  }

  deleteMediaVideo(videoId) {
    if (!this.mediaData.bible_project_videos) return false;
    const initialLen = this.mediaData.bible_project_videos.length;
    this.mediaData.bible_project_videos = this.mediaData.bible_project_videos.filter(v => v.id !== videoId);
    if (this.mediaData.bible_project_videos.length < initialLen) {
      this.saveMedia();
      return true;
    }
    return false;
  }

  getMediaVideo(videoId) {
    return (this.mediaData.bible_project_videos || []).find(v => v.id === videoId) || null;
  }

  // Academic Portals Deep Links
  getDeepLinks(bookId = 'JHN', chapterNum = 1, verseNum = 1) {
    const bookMapping = {
      'GEN': 'genesis', 'EXO': 'exodus', 'LEV': 'leviticus', 'NUM': 'numbers', 'DEU': 'deuteronomy',
      'PSA': 'psalms', 'PRO': 'proverbs', 'ISA': 'isaiah', 'MAT': 'matthew', 'MRK': 'mark',
      'LUK': 'luke', 'JHN': 'john', 'ACT': 'acts', 'ROM': 'romans', '1CO': '1_corinthians',
      'HEB': 'hebrews', 'REV': 'revelation'
    };

    const slug = bookMapping[bookId] || 'john';
    return {
      bibleHubInterlinear: `https://biblehub.com/interlinear/${slug}/${chapterNum}-${verseNum}.htm`,
      bibleHubCommentary: `https://biblehub.com/commentaries/${slug}/${chapterNum}-${verseNum}.htm`,
      stepBible: `https://www.stepbible.org/?q=reference=${bookId}.${chapterNum}.${verseNum}&options=VNHUG`,
      openBibleGeocoding: `https://www.openbible.info/geo/`
    };
  }

  // Render Full Media Hub View
  renderMediaHubHTML(currentUserRole = 'guest') {
    const isAdmin = currentUserRole === 'admin';

    // 1. Season Filter Bar
    const seasonTabsHTML = MEDIA_SEASONS.map(s => `
      <button type="button" class="media-season-pill ${this.currentSeason === s.id ? 'active' : ''}" data-season="${s.id}">
        <i class="fa-solid ${s.icon}"></i> ${s.name}
      </button>
    `).join('');

    // 2. Filter Videos by Current Season
    const allVideos = this.mediaData.bible_project_videos || [];
    const filteredVideos = allVideos.filter(v => {
      if (this.currentSeason === 'all') return true;
      return v.season === this.currentSeason;
    });

    const mapsHTML = (this.mediaData.maps || []).map(m => `
      <div class="parallel-verse-card" style="padding: 0; overflow: hidden;">
        <div style="height: 220px; overflow: hidden; position: relative;">
          <img src="${m.image_url}" alt="${m.title_vi}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-normal);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <span class="banner-badge" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.75); color: var(--accent-gold); border: 1px solid var(--accent-gold-border);">
            ${m.period}
          </span>
        </div>
        <div style="padding: 1.25rem;">
          <h4 style="font-family: var(--font-brand); color: var(--accent-gold-light); margin-bottom: 0.4rem; font-size: 1.1rem;">
            <i class="fa-solid fa-map-location-dot"></i> ${m.title_vi}
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">${m.description}</p>
        </div>
      </div>
    `).join('');

    const archaeologyHTML = (this.mediaData.archaeology || []).map(a => `
      <div class="parallel-verse-card" style="padding: 0; overflow: hidden;">
        <div style="height: 220px; overflow: hidden; position: relative;">
          <img src="${a.image_url}" alt="${a.title_vi}" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-normal);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <span class="banner-badge" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.75); color: #fff;">
            ${a.dating}
          </span>
        </div>
        <div style="padding: 1.25rem;">
          <h4 style="font-family: var(--font-brand); color: var(--accent-gold-light); margin-bottom: 0.4rem; font-size: 1.1rem;">
            <i class="fa-solid fa-monument"></i> ${a.title_vi}
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">${a.description}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
            <i class="fa-solid fa-location-dot"></i> Địa điểm khai quật: ${a.artifacts_site}
          </p>
        </div>
      </div>
    `).join('');

    const videosHTML = filteredVideos.map(v => {
      const seasonObj = MEDIA_SEASONS.find(s => s.id === v.season) || { name: 'Thường Niên' };
      return `
      <div class="parallel-verse-card media-video-card" data-video-id="${v.id}" style="padding: 1.25rem; border-left: 3px solid #e11d48; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span class="banner-badge" style="background: #e11d48; color: #fff;">
              <i class="fa-brands fa-youtube"></i> THE BIBLE PROJECT
            </span>
            <span class="banner-badge" style="background: rgba(212, 175, 55, 0.2); color: var(--accent-gold); border: 1px solid var(--accent-gold-border);">
              ${seasonObj.name}
            </span>
          </div>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            <span style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> ${v.duration}</span>
            ${isAdmin ? `
              <button type="button" class="btn-edit-media" data-id="${v.id}" title="Chỉnh sửa video theo mùa" style="background: var(--bg-surface); border: 1px solid var(--border-medium); color: var(--accent-gold); padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </button>
              <button type="button" class="btn-delete-media" data-id="${v.id}" title="Xóa video này" style="background: rgba(220, 53, 69, 0.15); border: 1px solid #dc3545; color: #ff6b6b; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                <i class="fa-solid fa-trash"></i>
              </button>
            ` : ''}
          </div>
        </div>
        <h4 style="font-family: var(--font-brand); color: var(--accent-gold-light); font-size: 1.15rem; margin-bottom: 0.5rem;">
          ${v.title_vi}
        </h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem; flex-grow: 1;">
          ${v.description}
        </p>
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: var(--shadow-md);">
          <iframe src="https://www.youtube-nocookie.com/embed/${v.youtube_id}" title="${v.title_vi}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top:0; left: 0; width: 100%; height: 100%;"></iframe>
        </div>
      </div>
    `;
    }).join('');

    return `
      <div class="media-hub-container" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
        <div class="chapter-header">
          <span class="chapter-badge" style="background: var(--genre-history); color: #fff;">TRUNG TÂM TRI THỨC TRỰC QUAN</span>
          <h2 class="chapter-title"><i class="fa-solid fa-photo-film"></i> BẢN ĐỒ, KHẢO CỔ & VIDEO KINH THÁNH</h2>
          <p class="chapter-subtitle">Kết nối hình ảnh lịch sử Cận Đông, cuộn da Biển Chết và các video giải thích phân loại theo từng mùa vụ</p>
          
          <!-- Thanh Quản Trị Viên: Bổ Sung Media Mùa Lễ Mới -->
          ${isAdmin ? `
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="admin-create-media-btn" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700; background: linear-gradient(135deg, #e11d48, #be123c);">
                <i class="fa-solid fa-circle-plus"></i> Cập Nhật / Thêm Media Mùa Mới (Quyền Quản Trị)
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Section 0: Thanh Lọc Theo Mùa Vụ (Seasons Filter Bar) -->
        <div class="media-seasons-bar" style="display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; justify-content: center;">
          ${seasonTabsHTML}
        </div>

        <!-- Section 1: The Bible Project Videos -->
        <div style="margin-bottom: 3rem;">
          <h3 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-play-circle"></i> Video Hoạt Họa & Bài Giảng Theo Mùa (${filteredVideos.length})
            </span>
          </h3>
          ${filteredVideos.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(440px, 1fr)); gap: 1.5rem;">
              ${videosHTML}
            </div>
          ` : `
            <div style="padding: 2.5rem; text-align: center; background: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: 8px; color: var(--text-muted);">
              <i class="fa-solid fa-video-slash" style="font-size: 2rem; margin-bottom: 0.75rem; display: block; color: var(--accent-gold);"></i>
              Chưa có video nào cho mùa vụ đã chọn. Quý Quản Trị Viên có thể nhấn nút "Cập Nhật / Thêm Media Mùa Mới" để bổ sung ngay!
            </div>
          `}
        </div>

        <!-- Section 2: Archaeological Discoveries -->
        <div style="margin-bottom: 3rem;">
          <h3 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-landmark"></i> Phát Hiện Khảo Cổ Học Kinh Thánh
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
            ${archaeologyHTML}
          </div>
        </div>

        <!-- Section 3: Satellite Maps -->
        <div style="margin-bottom: 3rem;">
          <h3 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-map"></i> Bản Đồ Địa Lý & Các Tuyến Đường Thánh
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
            ${mapsHTML}
          </div>
        </div>

        <!-- Section 4: Academic Portals Deep Links -->
        <div class="metaphor-card" style="border-color: var(--accent-gold); background: var(--bg-card);">
          <h3 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.75rem;">
            <i class="fa-solid fa-globe"></i> Cổng Tra Cứu Học Thuật Quốc Tế (One-Click Deep Links)
          </h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            Truy cập tức thì các thư viện nguyên bản Hy Lạp / Hê-bơ-rơ và bình giải học thuật hàng đầu thế giới:
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="https://www.scripture4all.org/OnlineInterlinear/Hebrew_Index.htm" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; background: #6366f1; color: #fff; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-scroll"></i> Scripture4All Interlinear (Cựu Ước Hê-bơ-rơ WLC)
            </a>
            <a href="https://www.scripture4all.org/OnlineInterlinear/Greek_Index.htm" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; background: #4f46e5; color: #fff; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-scroll"></i> Scripture4All Interlinear (Tân Ước Hy Lạp ScrTR)
            </a>
            <a href="https://biblehub.com/interlinear/john/1-1.htm" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> BibleHub Interlinear & Lexicon
            </a>
            <a href="https://www.stepbible.org/?q=reference=JHN.1.1&options=VNHUG" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; background: #0891b2; color: #fff; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> StepBible (Tyndale House Cambridge)
            </a>
            <a href="https://www.openbible.info/geo/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; background: #059669; color: #fff; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> OpenBible Địa Lý Vệ Tinh
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Create Video Embed
  createVideoEmbed(youtubeId) {
    return `<iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1" frameborder="0" allowfullscreen style="width: 100%; height: 400px; border-radius: 8px;"></iframe>`;
  }

  openVideoModal(youtubeId, title = 'Video The Bible Project') {
    let modal = document.getElementById('video-player-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'video-player-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 800px;">
        <div class="modal-header">
          <h3><i class="fa-brands fa-youtube" style="color: #e11d48;"></i> ${title}</h3>
          <button class="modal-close-btn" onclick="document.getElementById('video-player-modal').classList.add('hidden')">&times;</button>
        </div>
        <div style="padding: 1.5rem;">
          ${this.createVideoEmbed(youtubeId)}
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  }
}

export const mediaEngine = new MediaEngine();
