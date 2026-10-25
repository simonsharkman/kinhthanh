/* ==========================================================================
   LOGOS MULTIVERSE - BLOG & COMMUNITY SYSTEM (WITH ZERO-TAMPER PROTECTION)
   Master Author Journal, Student Community Circles & Live Fellowship Chat
   Enhanced Admin Capabilities: Create, Edit, Moderate, Media & Docs
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
      
      const defaultMaster = data.master_blogs || [];
      const savedMaster = storage.getMasterBlogs(null);
      if (Array.isArray(savedMaster) && savedMaster.length > 0) {
        this.masterBlogs = savedMaster;
      } else {
        this.masterBlogs = defaultMaster;
        storage.saveMasterBlogs(this.masterBlogs);
      }

      this.communityBranches = data.community_branches || [];

      const defaultPosts = (data.community_posts || []).map(p => ({
        ...p,
        status: p.status || 'approved'
      }));
      const savedPosts = storage.getCommunityPosts(null);
      if (Array.isArray(savedPosts) && savedPosts.length > 0) {
        this.communityPosts = savedPosts;
      } else {
        this.communityPosts = defaultPosts;
        storage.saveCommunityPosts(this.communityPosts);
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

  // --- Admin Master Blog Management Methods ---
  createMasterBlog(articleData) {
    const newArticle = {
      id: `art_${Date.now()}`,
      title_vi: (articleData.title_vi || 'Khảo Luận Mới').trim(),
      author: (articleData.author || 'Quản Trị Viên').trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      category: articleData.category || 'Khảo Luận Thần Học',
      summary: (articleData.summary || '').trim(),
      content: (articleData.content || '').trim(),
      tags: Array.isArray(articleData.tags) ? articleData.tags : (articleData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      cover_image: (articleData.cover_image || '').trim(),
      documents: Array.isArray(articleData.documents) ? articleData.documents : []
    };

    this.masterBlogs.unshift(newArticle);
    storage.saveMasterBlogs(this.masterBlogs);
    storage.recordArticleVisit(newArticle.id, newArticle.title_vi);
    return { success: true, article: newArticle };
  }

  updateMasterBlog(articleId, updatedData) {
    const idx = this.masterBlogs.findIndex(a => a.id === articleId);
    if (idx === -1) {
      return { success: false, reason: 'Không tìm thấy bài viết để sửa.' };
    }

    const current = this.masterBlogs[idx];
    this.masterBlogs[idx] = {
      ...current,
      title_vi: (updatedData.title_vi !== undefined ? updatedData.title_vi : current.title_vi).trim(),
      author: (updatedData.author !== undefined ? updatedData.author : current.author).trim(),
      category: updatedData.category || current.category,
      summary: (updatedData.summary !== undefined ? updatedData.summary : current.summary).trim(),
      content: (updatedData.content !== undefined ? updatedData.content : current.content).trim(),
      tags: Array.isArray(updatedData.tags) ? updatedData.tags : (updatedData.tags ? updatedData.tags.split(',').map(t => t.trim()).filter(Boolean) : current.tags),
      cover_image: updatedData.cover_image !== undefined ? updatedData.cover_image.trim() : current.cover_image,
      documents: Array.isArray(updatedData.documents) ? updatedData.documents : current.documents
    };

    storage.saveMasterBlogs(this.masterBlogs);
    return { success: true, article: this.masterBlogs[idx] };
  }

  deleteMasterBlog(articleId) {
    const prevLen = this.masterBlogs.length;
    this.masterBlogs = this.masterBlogs.filter(a => a.id !== articleId);
    if (this.masterBlogs.length < prevLen) {
      storage.saveMasterBlogs(this.masterBlogs);
      return { success: true };
    }
    return { success: false, reason: 'Không tìm thấy bài viết.' };
  }

  getMasterBlog(articleId) {
    return this.masterBlogs.find(a => a.id === articleId) || null;
  }

  // --- Admin Community Moderation Methods ---
  approveCommunityPost(postId) {
    const post = this.communityPosts.find(p => p.id === postId);
    if (post) {
      post.status = 'approved';
      storage.saveCommunityPosts(this.communityPosts);
      return { success: true, post };
    }
    return { success: false, reason: 'Không tìm thấy bài viết.' };
  }

  rejectCommunityPost(postId) {
    const post = this.communityPosts.find(p => p.id === postId);
    if (post) {
      post.status = 'rejected';
      storage.saveCommunityPosts(this.communityPosts);
      return { success: true, post };
    }
    return { success: false, reason: 'Không tìm thấy bài viết.' };
  }

  getCommunityPost(postId) {
    return this.communityPosts.find(p => p.id === postId) || null;
  }

  updateCommunityPost(postId, updatedData) {
    const idx = this.communityPosts.findIndex(p => p.id === postId);
    if (idx === -1) {
      return { success: false, reason: 'Không tìm thấy bài viết cộng đồng để sửa.' };
    }

    const current = this.communityPosts[idx];
    this.communityPosts[idx] = {
      ...current,
      title: (updatedData.title !== undefined ? updatedData.title : current.title).trim(),
      author: (updatedData.author !== undefined ? updatedData.author : current.author).trim(),
      branch_id: updatedData.branch_id || current.branch_id,
      status: updatedData.status || current.status || 'approved',
      content: (updatedData.content !== undefined ? updatedData.content : current.content).trim(),
      date: updatedData.date || current.date
    };

    storage.saveCommunityPosts(this.communityPosts);
    return { success: true, post: this.communityPosts[idx] };
  }

  deleteCommunityPost(postId) {
    const prevLen = this.communityPosts.length;
    this.communityPosts = this.communityPosts.filter(p => p.id !== postId);
    if (this.communityPosts.length < prevLen) {
      storage.saveCommunityPosts(this.communityPosts);
      return { success: true };
    }
    return { success: false, reason: 'Không tìm thấy bài viết.' };
  }

  // Render Master Blog View
  renderMasterBlogHTML(currentUserRole = 'guest') {
    const isAdmin = this.canEditMasterBlog(currentUserRole);

    let html = `
      <div class="blog-wrapper" style="max-width: 980px; margin: 0 auto; padding: 2rem;">
        <div class="chapter-header">
          <span class="chapter-badge" style="background: var(--accent-gold); color: #000;">
            <i class="fa-solid fa-feather-pointed"></i> TÁC PHẨM NGHIÊN CỨU THẦN HỌC
          </span>
          <h2 class="chapter-title">BLOG KHẢO LUẬN & SUY NGẪM KINH THÁNH</h2>
          <p class="chapter-subtitle">Các bài nghiên cứu chuyên sâu về nguyên ngữ, lịch sử cứu chuộc, bối cảnh văn hóa và ứng nghiệm tiên tri</p>
          ${isAdmin ? `
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="admin-create-blog-btn" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.4rem;">
                <i class="fa-solid fa-circle-plus"></i> Viết Khảo Luận Mới (Quyền Quản Trị)
              </button>
            </div>
          ` : `
            <div style="margin-top: 0.75rem; font-size: 0.82rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.4rem; background: var(--bg-surface); padding: 0.35rem 0.85rem; border-radius: 20px; border: 1px solid var(--border-subtle);">
              <i class="fa-solid fa-shield-halved" style="color: var(--accent-gold);"></i> Chế độ Đọc An Toàn (Zero-Tamper Protection) — Nội dung chính thức được bảo vệ bất biến.
            </div>
          `}
        </div>

        <div class="articles-grid" style="display: flex; flex-direction: column; gap: 2.25rem;">
    `;

    this.masterBlogs.forEach(art => {
      const tagsHTML = (art.tags || []).map(t =>
        `<span style="background: var(--bg-card); color: var(--accent-gold); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.78rem; border: 1px solid var(--accent-gold-border);">#${t}</span>`
      ).join(' ');

      // Render Documents List if present
      let docsHTML = '';
      if (Array.isArray(art.documents) && art.documents.length > 0) {
        docsHTML = `
          <div class="article-documents-box" style="margin-top: 1.25rem; padding: 1rem; background: rgba(212, 175, 55, 0.05); border-radius: 8px; border: 1px solid var(--accent-gold-border);">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.4rem;">
              <i class="fa-solid fa-file-pdf"></i> TÀI LIỆU & BẢN ĐỒ THẦN HỌC ĐÍNH KÈM:
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${art.documents.map(doc => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-subtle);">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <i class="fa-solid ${doc.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-lines'}" style="color: var(--accent-gold);"></i>
                    <div>
                      <strong style="font-size: 0.88rem; color: var(--text-primary); display: block;">${doc.name}</strong>
                      <small style="color: var(--text-muted); font-size: 0.75rem;">${doc.type || 'PDF'} • ${doc.size || 'Tài liệu nghiên cứu'}</small>
                    </div>
                  </div>
                  <a href="${doc.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                    <i class="fa-solid fa-download"></i> Xem / Tải Về
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // Render Cover Image if present
      let coverImageHTML = '';
      if (art.cover_image && art.cover_image.trim()) {
        coverImageHTML = `
          <div style="margin-bottom: 1.25rem; border-radius: 8px; overflow: hidden; max-height: 340px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 14px rgba(0,0,0,0.3);">
            <img src="${art.cover_image}" alt="${art.title_vi}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.style.display='none'">
          </div>
        `;
      }

      // Admin Action Toolbar on card
      let adminToolbarHTML = '';
      if (isAdmin) {
        adminToolbarHTML = `
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-medium);">
            <span style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 700; margin-right: auto;">
              <i class="fa-solid fa-shield-halved"></i> QUYỀN QUẢN TRỊ VIÊN:
            </span>
            <button class="btn-secondary btn-edit-article" data-id="${art.id}" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-pen-to-square"></i> Sửa Bài
            </button>
            <button class="btn-secondary btn-delete-article" data-id="${art.id}" style="padding: 0.3rem 0.75rem; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--status-error); border-color: rgba(220, 53, 69, 0.4);">
              <i class="fa-solid fa-trash-can"></i> Xóa
            </button>
          </div>
        `;
      }

      html += `
        <article class="parallel-verse-card" style="padding: 2rem; border-left: 4px solid var(--accent-gold);">
          ${coverImageHTML}
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

          ${docsHTML}

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-top: 1rem;">
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">CHỦ ĐỀ:</span>
            ${tagsHTML}
          </div>

          ${adminToolbarHTML}
        </article>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  // Render Community Branches & Discussion View with Admin Moderation Queue
  renderCommunityCirclesHTML(currentUserRole = 'guest') {
    const isAdmin = currentUserRole === 'admin';

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

    // Filter posts for public display
    const visiblePosts = isAdmin 
      ? this.communityPosts 
      : this.communityPosts.filter(p => !p.status || p.status === 'approved');

    let postsHTML = visiblePosts.map(p => {
      let statusBadge = '';
      if (isAdmin && p.status) {
        if (p.status === 'pending') {
          statusBadge = `<span style="background: rgba(255, 193, 7, 0.2); color: #ffc107; border: 1px solid #ffc107; font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;">⏳ Chờ Quản Trị Duyệt</span>`;
        } else if (p.status === 'rejected') {
          statusBadge = `<span style="background: rgba(220, 53, 69, 0.2); color: #dc3545; border: 1px solid #dc3545; font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;">❌ Đã Từ Chối</span>`;
        } else {
          statusBadge = `<span style="background: rgba(40, 167, 69, 0.2); color: #28a745; border: 1px solid #28a745; font-size: 0.68rem; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;">✅ Đã Phê Duyệt</span>`;
        }
      }

      let adminActions = '';
      if (isAdmin) {
        adminActions = `
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end; margin-top: 0.6rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-subtle);">
            ${p.status !== 'approved' ? `<button class="btn-secondary btn-mod-approve" data-id="${p.id}" style="padding: 0.2rem 0.55rem; font-size: 0.72rem; color: #28a745; border-color: rgba(40, 167, 69, 0.4);"><i class="fa-solid fa-check"></i> Duyệt Bài</button>` : ''}
            ${p.status !== 'rejected' ? `<button class="btn-secondary btn-mod-reject" data-id="${p.id}" style="padding: 0.2rem 0.55rem; font-size: 0.72rem; color: #ffc107; border-color: rgba(255, 193, 7, 0.4);"><i class="fa-solid fa-ban"></i> Từ Chối</button>` : ''}
            <button class="btn-secondary btn-edit-community-post" data-id="${p.id}" style="padding: 0.2rem 0.55rem; font-size: 0.72rem; color: var(--accent-gold); border-color: rgba(212, 175, 55, 0.4);"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
            <button class="btn-secondary btn-mod-delete" data-id="${p.id}" style="padding: 0.2rem 0.55rem; font-size: 0.72rem; color: #dc3545; border-color: rgba(220, 53, 69, 0.4);"><i class="fa-solid fa-trash"></i> Xóa</button>
          </div>
        `;
      }

      return `
        <div class="parallel-verse-card" style="margin-bottom: 1rem; border-left: 3px solid ${p.status === 'pending' ? '#ffc107' : (p.status === 'rejected' ? '#dc3545' : 'var(--accent-gold)')};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.4rem;">
            <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.88rem;">
              <i class="fa-solid fa-user-graduate"></i> ${p.author}
            </span>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              ${statusBadge}
              <span style="font-size: 0.75rem; color: var(--text-muted);">${p.date}</span>
            </div>
          </div>
          <h4 style="font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.4rem;">${p.title}</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${p.content}</p>
          ${adminActions}
        </div>
      `;
    }).join('');

    // Admin Moderation Queue Banner if Admin
    let adminModerationQueueHTML = '';
    if (isAdmin) {
      const pendingPosts = this.communityPosts.filter(p => p.status === 'pending');
      adminModerationQueueHTML = `
        <div class="metaphor-card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(20, 20, 28, 0.95) 100%); border: 1px solid var(--accent-gold); border-left: 5px solid var(--accent-gold);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--font-brand); color: var(--accent-gold); font-size: 1.2rem; margin: 0; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-clipboard-check"></i> HÀNG ĐỢI DUYỆT BÀI CỘNG ĐỒNG (QUYỀN QUẢN TRỊ)
            </h3>
            <span class="banner-badge" style="background: ${pendingPosts.length > 0 ? '#ffc107' : 'var(--status-success)'}; color: #000; font-weight: 700;">
              ${pendingPosts.length} BÀI CHỜ DUYỆT
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Quản trị viên có toàn quyền kiểm tra, phê duyệt cho phép xuất bản công khai hoặc từ chối các bài chia sẻ của học viên gửi vào các nhánh.
          </p>
          ${pendingPosts.length === 0 ? `
            <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">
              <i class="fa-solid fa-circle-check" style="color: var(--status-success);"></i> Hiện không có bài viết nào đang chờ duyệt. Mọi bài viết đã được xử lý.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${pendingPosts.map(p => `
                <div style="padding: 0.85rem; background: var(--bg-surface); border-radius: 6px; border: 1px solid var(--border-medium);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                    <strong style="color: var(--accent-gold-light); font-size: 0.95rem;">${p.title}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${p.author} • ${p.date}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.65rem;">${p.content}</p>
                  <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    <button class="btn-primary btn-mod-approve" data-id="${p.id}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <i class="fa-solid fa-check"></i> Duyệt Xuất Bản
                    </button>
                    <button class="btn-secondary btn-mod-reject" data-id="${p.id}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem; color: #ffc107;">
                      <i class="fa-solid fa-ban"></i> Từ Chối
                    </button>
                    <button class="btn-secondary btn-edit-community-post" data-id="${p.id}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem; color: var(--accent-gold); border-color: rgba(212, 175, 55, 0.4);">
                      <i class="fa-solid fa-pen-to-square"></i> Sửa
                    </button>
                    <button class="btn-secondary btn-mod-delete" data-id="${p.id}" style="padding: 0.35rem 0.85rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem; color: #dc3545;">
                      <i class="fa-solid fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;
    }

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
      <div class="community-wrapper" style="max-width: 1020px; margin: 0 auto; padding: 2rem;">
        <div class="chapter-header">
          <span class="chapter-badge" style="background: var(--genre-acts); color: #fff;">
            <i class="fa-solid fa-users"></i> THÔNG CÔNG & TRAO ĐỔI LỜI CHÚA
          </span>
          <h2 class="chapter-title">CÁC NHÁNH CỘNG ĐỒNG BEREA</h2>
          <p class="chapter-subtitle">Học viên tham gia thảo luận, gửi bài suy ngẫm dưới sự điều phối của Berea Guardian Agent</p>
        </div>

        ${adminModerationQueueHTML}

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
                Mọi bài viết được kiểm duyệt qua <strong>Agent Berea</strong> và sẽ được <strong>Quản Trị Viên</strong> phê duyệt trước khi xuất bản công khai.
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
              <i class="fa-solid fa-newspaper"></i> Bài Đăng Của Học Viên
            </h3>
            <div id="community-posts-list">${postsHTML || '<p style="color: var(--text-muted); font-size: 0.88rem;">Chưa có bài viết nào trong nhánh này.</p>'}</div>
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

  // Submit Community Post with Berea Guardian Check & Pending Status
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
      status: 'pending',
      replies_count: 0
    };

    this.communityPosts.unshift(newPost);
    storage.saveCommunityPosts(this.communityPosts);

    return {
      success: true,
      post: newPost,
      status: 'pending'
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
