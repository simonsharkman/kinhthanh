/* ==========================================================================
   LOGOS MULTIVERSE - THEOLOGICAL AI COPILOT & CHATGPT ASSISTANT
   Smart Theological Q&A Engine + OpenAI ChatGPT Integration
   ========================================================================== */

import { storage } from './storage.js';

export class AIAssistant {
  constructor() {
    this.apiKey = storage.getPreference('openai_api_key', '');
    this.history = [];
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    storage.savePreference('openai_api_key', this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  // Dynamic Context-Aware Prompt Suggestions
  getSuggestedPrompts(verseRef = 'Giăng 1:1', bookMetadata = null) {
    return [
      `Bối cảnh lịch sử và văn hóa của ${verseRef} là gì?`,
      `Có những hình ảnh ẩn dụ nào trong ${verseRef} và ý nghĩa Cựu Ước là gì?`,
      `Chữ nguyên ngữ Hy Lạp/Hê-bơ-rơ quan trọng nhất ở đây là gì?`,
      `Bài học ứng dụng thực tế cho đời sống Cơ Đốc ngày nay?`
    ];
  }

  // Offline Smart Theological Engine (Zero-Setup)
  queryOfflineTheology(question, context = {}) {
    const q = question.toLowerCase();
    const ref = context.ref || 'Giăng 1:1';

    if (q.includes('bối cảnh') || q.includes('lịch sử') || q.includes('văn hóa')) {
      return `
        <strong>[Bối cảnh Lịch sử & Văn hóa - ${ref}]:</strong><br>
        Phân đoạn này được đặt trong bối cảnh thế kỷ thứ nhất dưới ách thống trị của Đế chế La Mã và sự giao thoa văn hóa Hy Lạp - Do Thái. Tác giả sử dụng các khái niệm quen thuộc với người đương thời để công bố chân lý đời đời: Đấng Mê-si-a không chỉ là niềm hy vọng riêng của tuyển dân Do Thái mà là Đấng Cứu Thế cho toàn thể nhân loại.
      `;
    }

    if (q.includes('ẩn dụ') || q.includes('biểu tượng') || q.includes('chiên') || q.includes('nho')) {
      return `
        <strong>[Giải nghĩa Biểu Tượng & Hình Bóng Thần Học - ${ref}]:</strong><br>
        Theo nguyên tắc <em>"Kinh Thánh tự giải nghĩa Kinh Thánh"</em> (Scriptura Sacra sui ipsius interpres), các hình ảnh trong Tân Ước luôn bắt rễ sâu xa từ các giao ước Cựu Ước. Ví dụ: hình ảnh Chiên Con bắt nguồn từ Lễ Vượt Qua (Xuất Ê-díp-tô Ký 12) và bài ca Người Tôi Tớ chịu khổ (Ê-sai 53) để chỉ về sự hy sinh chuộc tội hoàn hảo của Đấng Christ.
      `;
    }

    if (q.includes('nguyên ngữ') || q.includes('hy lạp') || q.includes('hê-bơ-rơ') || q.includes('strong')) {
      return `
        <strong>[Phân tích Nguyên Ngữ & Mã Strong's - ${ref}]:</strong><br>
        Từ khóa then chốt trong nguyên văn là <code>Logos (G3056)</code> nghĩa là Lời phán, Ngôi Lời, Lý trí thánh. Khác với triết học Hy Lạp xem Logos là lực lượng vô vị thân, Kinh Thánh khẳng định Logos là một Thân Vị sống động: <em>"Ngôi Lời đã trở nên xác thịt, ở giữa chúng ta"</em> (Giăng 1:14).
      `;
    }

    if (q.includes('ứng dụng') || q.includes('thực tế') || q.includes('đời sống')) {
      return `
        <strong>[Ứng Dụng Thực Tiễn Cho Đời Sống - ${ref}]:</strong><br>
        1. <strong>Đức tin vững vàng:</strong> Biết rằng Đấng Christ nắm quyền tể trị tuyệt đối trên vũ trụ và đời sống cá nhân.<br>
        2. <strong>Nếp sống môn đồ:</strong> Để Lời Hằng Sống hướng dẫn mọi quyết định và cư ngụ phong phú trong lòng (Cô-lô-se 3:16).<br>
        3. <strong>Sứ mạng:</strong> Chiếu rọi ánh sáng chân lý và ân điển giữa một thế giới đầy bóng tối.
      `;
    }

    return `
      <strong>[Trợ Lý Thần Học Berea - ${ref}]:</strong><br>
      Câu hỏi sâu sắc của bạn: <em>"${question}"</em>.<br>
      Để hiểu trọn vẹn, hãy luôn tra cứu câu này trong sự đối chiếu 3 chiều: (1) Ngữ cảnh mạch văn của toàn bộ chương; (2) Sự ứng nghiệm giữa Cựu Ước và Tân Ước; (3) Mối tương giao cầu nguyện để Đức Thánh Linh soi sáng lẽ thật.
    `;
  }

  // OpenAI ChatGPT Integration
  async queryOpenAI(question, context = {}) {
    if (!this.apiKey) {
      throw new Error('Chưa cấu hình OpenAI API Key.');
    }

    const systemPrompt = `Bạn là Trợ Lý Thần Học Kinh Thánh cao cấp của hệ thống Logos MultiVerse.
Nhiệm vụ của bạn là giải thích Lời Chúa cách trung thực, sâu sắc, tôn trọng chân lý Kinh Thánh, dựa trên nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh", kết hợp bối cảnh lịch sử văn hóa Cận Đông cổ đại và phân tích nguyên ngữ Hy Lạp/Hê-bơ-rơ. Hãy trả lời ngắn gọn, súc tích, văn phong trang trọng, ân cần.
Bối cảnh phân đoạn hiện tại: Sách ${context.book || 'Giăng'}, Đoạn ${context.chapter || 1}, Câu ${context.verse || 1}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error ? err.error.message : 'Lỗi kết nối OpenAI API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Master ask dispatch
  async ask(question, context = {}) {
    if (this.apiKey) {
      try {
        return await this.queryOpenAI(question, context);
      } catch (e) {
        console.warn('OpenAI API query failed, falling back to local theology engine:', e);
        return this.queryOfflineTheology(question, context) + `<br><small style="color: var(--status-warning);">(Đã chuyển sang chế độ AI Offline do lỗi kết nối API: ${e.message})</small>`;
      }
    } else {
      return this.queryOfflineTheology(question, context);
    }
  }

  // Render AI Chat Interface for Drawer Inspector
  renderAIChatHTML(context = {}) {
    const prompts = this.getSuggestedPrompts(context.ref || 'Giăng 1:1');
    const promptsHTML = prompts.map(p =>
      `<button class="suggested-prompt-chip" data-prompt="${p}">${p}</button>`
    ).join('');

    return `
      <div class="ai-chat-container animate-fade-in">
        <div class="metaphor-card" style="padding: 1rem; border-color: var(--accent-gold-border);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.88rem;">
              <i class="fa-solid fa-robot"></i> TRỢ LÝ THẦN HỌC BEREA
            </span>
            <button id="ai-configure-key-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-muted); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;">
              <i class="fa-solid fa-key"></i> ${this.apiKey ? 'Đã có API Key' : 'Thêm ChatGPT Key'}
            </button>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem;">
            Hỏi đáp tức thì về bối cảnh, từ vựng nguyên ngữ và ý nghĩa hình ảnh ẩn dụ cho phân đoạn đang đọc.
          </p>
          <div class="ai-prompts-row">${promptsHTML}</div>
        </div>

        <div id="ai-messages-list" class="ai-messages-list">
          <div class="ai-message assistant">
            <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
            <div>
              Chào bạn! Tôi là Trợ Lý Thần Học của <strong>Logos MultiVerse</strong>. Bạn có thắc mắc gì về phân đoạn <strong>${context.ref || 'Giăng 1:1'}</strong> không? Hãy chọn các gợi ý nhanh phía trên hoặc đặt câu hỏi bên dưới.
            </div>
          </div>
        </div>

        <div class="ai-input-wrapper">
          <input type="text" id="ai-user-query-input" class="ai-input-box" placeholder="Hỏi về bối cảnh, ẩn dụ, từ gốc hoặc ứng dụng...">
          <button id="ai-send-btn" class="btn-primary" style="padding: 0.65rem 1rem; border-radius: 20px;">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  }
}

export const aiAssistant = new AIAssistant();
