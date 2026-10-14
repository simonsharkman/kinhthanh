/* ==========================================================================
   LOGOS MULTIVERSE - BLOG & COMMUNITY SYSTEM (WITH ZERO-TAMPER PROTECTION)
   Master Author Journal, Student Community Circles & Live Fellowship Chat
   ========================================================================== */

import { bereaGuardian } from './berea-guardian.js';
import { storage } from './storage.js';

export class BlogSystem {
  constructor() {
    this.masterBlogs = [];
    this.communityBranches = [];
    this.communityPosts = [];
    this.chatMessages = [
      { id: 1, author: "Mục sư Quản Nhiệm", time: "08:15", text: "Chào quý học viên! Chúc một ngày học Lời Chúa trong ơn phước và sự soi dẫn của Chúa Thánh Linh.", verseRef: "Giăng 1:1" },
      { id: 2, author: "Bác Hai (Tín đồ)", time: "08:22", text: "Đối chiếu bản dịch BTT và BDM ở Giăng 1:14 giúp tôi hiểu sâu hơn về mầu nhiệm Ngôi Lời cắm trại giữa nhân loại.", verseRef: "Giăng 1:14" }
    ];
    this.isLoaded = false;
  }

  async init() {
    await this.loadArticles();
    this.isLoaded = true;
  }

  async loadArticles() {
    try {
      const res = await fetch('data/default-articles.json');
      const data = await res.json();
      this.masterBlogs = data.master_blogs || [];
      this.communityBranches = data.community_branches || [];
      this.communityPosts = data.community_posts || [];

      // Merge saved user posts from storage
      const savedPosts = storage.getPreference('community_posts', []);
      if (Array.isArray(savedPosts) && savedPosts.length > 0) {
        this.communityPosts = [...this.communityPosts, ...savedPosts];
      }
      return data;
    } catch (e) {
      console.error('Failed to load articles:', e);
      return {};
    }
  }

  // Zero-Tamper Guardrail Check: Guest users cannot edit master blogs or core articles
  canEditMasterBlog(userRole) {
    return userRole === 'admin';
  }

  // Render Master Blog View
  renderMasterBlogHTML(currentUserRole = 'guest') {
    const isAdmin = this.canEditMasterBlog(currentUserRole);

    let html = `
      <div class="blog-wrapper" style="max-width: 960px; margin: 0 auto; padding: 2rem;">
        <div class="chapter-header">
          <span class="chapter-badge" style="background: var(--accent-gold); color: #000;">
            <i class="fa-solid fa-feather-pointed"></i> TÁC PHẨM NGHIÊN CỨU THẦN HỌC
          </span>
          <h2 class="chapter-title">BLOG KHẢO LUẬN & SUY NGẪM KINH THÁNH</h2>
          <p class="chapter-subtitle">Các bài nghiên cứu chuyên sâu về nguyên ngữ, lịch sử cứu chuộc và ứng nghiệm tiên tri</p>
          ${isAdmin ? `
            <div style="margin-top: 1rem;">
              <button id="admin-create-blog-btn" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-plus"></i> Viết Khảo Luận Mới (Quyền Quản Trị)
              </button>
            </div>
          ` : `
            <div style="margin-top: 0.75rem; font-size: 0.82rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.4rem; background: var(--bg-surface); padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid var(--border-subtle);">
              <i class="fa-solid fa-shield-halved" style="color: var(--accent-gold);"></i> Chế độ Đọc An Toàn (Zero-Tamper Protection) — Nội dung chính thức được bảo vệ bất biến.
            </div>
          `}
        </div>

        <div class="articles-grid" style="display: flex; flex-direction: column; gap: 2rem;">
    `;

    this.masterBlogs.forEach(art => {
      const tagsHTML = (art.tags || []).map(t =>
        `<span style="background: var(--bg-card); color: var(--accent-gold); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.78rem; border: 1px solid var(--accent-gold-border);">#${t}</span>`
      ).join(' ');

      html += `
        <article class="parallel-verse-card" style="padding: 2rem; border-left: 4px solid var(--accent-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <span class="banner-badge" style="background: var(--genre-epistles); color: #fff;">${art.category}</span>
            <span style="font-size: 0.82rem; color: var(--text-muted);">
              <i class="fa-solid fa-user-pen"></i> ${art.author} • <i class="fa-regular fa-calendar"></i> ${art.date}
            </span>
          </div>

          <h3 style="font-family: var(--font-brand); color: var(--accent-gold-light); font-size: 1.45rem; line-height: 1.35; margin-bottom: 0.75rem;">
            ${art.title_vi}
          </h3>

          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem;">
            ${art.summary}
          </p>

          <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: 8px; border-left: 3px solid var(--accent-gold); font-size: 0.92rem; line-height: 1.8; color: var(--text-primary); margin-bottom: 1rem; white-space: pre-line;">
            ${art.content}
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">CHỦ ĐỀ:</span>
            ${tagsHTML}
          </div>
        </article>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  // Render Community Branches & Discussion View
  renderCommunityCirclesHTML() {
    let branchesHTML = this.communityBranches.map(b => `
      <div class="parallel-verse-card branch-card" data-branch="${b.id}" style="cursor: pointer; border-left: 3px solid var(--accent-gold);">
        <h4 style="font-family: var(--font-brand); color: var(--accent-gold-light); font-size: 1.15rem; margin-bottom: 0.4rem;">
          <i class="fa-solid fa-circle-nodes"></i> ${b.title_vi}
        </h4>
        <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
          ${b.description}
        </p>
        <span style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 600;">
          <i class="fa-solid fa-comments"></i> ${b.posts_count} bài chia sẻ • Nhấp để tham gia
        </span>
      </div>
    `).join('');

    let postsHTML = this.communityPosts.map(p => `
      <div class="parallel-verse-card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
          <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.88rem;">
            <i class="fa-solid fa-user-graduate"></i> ${p.author}
          </span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${p.date}</span>
        </div>
        <h4 style="font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.4rem;">${p.title}</h4>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${p.content}</p>
      </div>
    `).join('');

    let chatHTML = this.chatMessages.map(m => `
      <div class="ai-message assistant" style="flex-direction: column; gap: 0.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
          <strong style="color: var(--accent-gold);">${m.author}</strong>
          <span style="color: var(--text-muted);">${m.time}</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-primary); margin: 0;">${m.text}</p>
        ${m.verseRef ? `<span class="crossref-pill" style="align-self: flex-start; margin-top: 0.25rem; font-size: 0.72rem;">#${m.verseRef}</span>` : ''}
      </div>
    `).join('');

    return `
      <div class="community-wrapper" style="max-width: 1000px; margin: 0 auto; padding: 2rem;">
        <div class="chapter-header">
          <span class="chapter-badge" style="background: var(--genre-acts); color: #fff;">
            <i class="fa-solid fa-users"></i> THÔNG CÔNG & TRAO ĐỔI LỜI CHÚA
          </span>
          <h2 class="chapter-title">CÁC NHÁNH CỘNG ĐỒNG BEREA</h2>
          <p class="chapter-subtitle">Học viên tham gia thảo luận, gửi bài suy ngẫm dưới sự điều phối của Berea Guardian Agent</p>
        </div>

        <!-- 3 Study Branches -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
          ${branchesHTML}
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem;">
          <!-- Post Submission & Articles -->
          <div>
            <div class="metaphor-card" style="border-color: var(--accent-gold-border); margin-bottom: 2rem;">
              <h3 style="font-family: var(--font-brand); color: var(--accent-gold); font-size: 1.15rem; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-pen-fancy"></i> Gửi Bài Suy Ngẫm Vào Nhánh Cộng Đồng
              </h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
                Mọi bài viết được kiểm duyệt bởi <strong>Agent Berea</strong> nhằm duy trì sự tôn trọng, thánh khiết và yêu thương.
              </p>
              <div id="berea-validation-alert" class="hidden" style="margin-bottom: 1rem;"></div>
              <div class="form-group">
                <label>Bút danh / Tên của bạn:</label>
                <input type="text" id="community-author-input" placeholder="Ví dụ: Tín đồ Tê-sa-lô-ni-ca">
              </div>
              <div class="form-group">
                <label>Chọn Nhánh Thảo Luận:</label>
                <select id="community-branch-select">
                  <option value="branch_devotion">Nhánh 1: Suy Ngẫm & Ứng Dụng Đời Sống</option>
                  <option value="branch_original_languages">Nhánh 2: Nghiên Cứu Nguyên Ngữ & Thể Loại</option>
                  <option value="branch_typology_symbols">Nhánh 3: Giải Mã Hình Ảnh Ẩn Dụ & Tiên Tri</option>
                </select>
              </div>
              <div class="form-group">
                <label>Tiêu đề bài chia sẻ:</label>
                <input type="text" id="community-title-input" placeholder="Tiêu đề bài học...">
              </div>
              <div class="form-group">
                <label>Nội dung chia sẻ (Có thể trích câu như #Giang 1:1):</label>
                <textarea id="community-content-input" rows="4" placeholder="Viết cảm nhận của bạn..."></textarea>
              </div>
              <button id="submit-community-post-btn" class="btn-primary" style="width: 100%;">
                <i class="fa-solid fa-paper-plane"></i> Gửi Bài Chia Sẻ (Kiểm Duyệt Qua Berea Agent)
              </button>
            </div>

            <h3 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 1rem;">
              <i class="fa-solid fa-newspaper"></i> Bài Đăng Mới Của Học Viên
            </h3>
            <div id="community-posts-list">${postsHTML}</div>
          </div>

          <!-- Live Fellowship Chat -->
          <div>
            <div class="metaphor-card" style="border-color: var(--border-medium); height: 600px; display: flex; flex-direction: column;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <h4 style="font-family: var(--font-brand); color: var(--accent-gold-light); font-size: 1.05rem; margin: 0;">
                  <i class="fa-solid fa-comments"></i> Phòng Chat Thảo Luận
                </h4>
                <span class="banner-badge" style="background: var(--status-success); color: #fff; font-size: 0.68rem;">Trực Tuyến</span>
              </div>
              <div id="chat-messages-box" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.65rem; padding-right: 0.25rem;">
                ${chatHTML}
              </div>
              <div style="margin-top: 0.75rem; display: flex; gap: 0.4rem;">
                <input type="text" id="chat-user-msg-input" class="ai-input-box" placeholder="Nhập tin nhắn thảo luận (#Giang 1:1)...">
                <button id="chat-send-btn" class="btn-primary" style="padding: 0.5rem 0.85rem; border-radius: 20px;">
                  <i class="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Submit Community Post with Berea Guardian Check
  submitCommunityPost(data) {
    const textToCheck = `${data.title} ${data.content}`;
    const inspectResult = bereaGuardian.inspectContent(textToCheck);

    if (!inspectResult.passed) {
      return {
        success: false,
        reason: inspectResult.reason,
        reminder: inspectResult.reminder
      };
    }

    const newPost = {
      id: `post_${Date.now()}`,
      branch_id: data.branch_id || 'branch_devotion',
      author: data.author.trim() || 'Học Viên Ẩn Danh',
      date: new Date().toLocaleDateString('vi-VN'),
      title: data.title.trim(),
      content: data.content.trim(),
      replies_count: 0
    };

    this.communityPosts.unshift(newPost);
    storage.savePreference('community_posts', this.communityPosts);

    return {
      success: true,
      post: newPost
    };
  }

  // Send Chat message with Berea Guardian inspection
  sendChatMessage(author, text) {
    const inspectResult = bereaGuardian.inspectContent(text);
    if (!inspectResult.passed) {
      return {
        success: false,
        reason: inspectResult.reason,
        reminder: inspectResult.reminder
      };
    }

    const newMsg = {
      id: Date.now(),
      author: author || 'Bạn',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
      verseRef: null
    };

    const verseMatch = text.match(/#([a-zA-Z0-9\s]+?\d+:\d+)/);
    if (verseMatch) {
      newMsg.verseRef = verseMatch[1];
    }

    this.chatMessages.push(newMsg);
    return {
      success: true,
      message: newMsg
    };
  }
}

export const blogSystem = new BlogSystem();
