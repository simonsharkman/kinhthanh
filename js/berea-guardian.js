/* ==========================================================================
   LOGOS MULTIVERSE - BEREA GUARDIAN AGENT
   Real-Time Content Moderation, Anti-Vandalism & Biblical Ethics Sentinel
   (Inspired by the noble Bereans in Acts 17:11 & Colossians 4:6)
   ========================================================================== */

export class BereaGuardian {
  constructor() {
    this.name = "Berea Sentinel Agent";
    this.scriptureMotto = "Lời nói anh em phải luôn luôn có ân hậu, nêm thêm muối, để anh em biết phải đối đáp thế nào với mỗi người. (Cô-lô-se 4:6)";

    // Prohibited words, spam signals, hostility patterns
    this.toxicPatterns = [
      /\b(lừa đảo|chửi|địt|đụ|cặc|lồn|chết đi|đồ ngu|mẹ mày|bố mày)\b/i,
      /\b(xóa hết kinh thánh|phá hoại|hack|ddos)\b/i,
      /\b(mua bán sim|cho vay tiền|cá độ|casino online|lô đề|soi cầu)\b/i,
      /\b(tà giáo|chống chúa|báng bổ)\b/i
    ];
  }

  // Real-time inspection of user submissions
  inspectContent(text) {
    if (!text || text.trim().length === 0) {
      return {
        passed: false,
        reason: "Nội dung bài viết hoặc bình luận không được để trống.",
        reminder: "Hãy viết những lời khích lệ và gây dựng đức tin cho anh chị em."
      };
    }

    const clean = text.trim();

    // Check minimum meaningful length
    if (clean.length < 3) {
      return {
        passed: false,
        reason: "Nội dung quá ngắn để tạo thành một lời chia sẻ có ý nghĩa.",
        reminder: "Hãy chia sẻ rõ ràng hơn suy ngẫm của bạn."
      };
    }

    // Check toxicity and spam
    for (const pattern of this.toxicPatterns) {
      if (pattern.test(clean)) {
        return {
          passed: false,
          reason: "Nội dung chứa từ ngữ khiếm nhã, thô tục, quảng cáo rác hoặc vi phạm tiêu chuẩn đạo đức cộng đồng.",
          reminder: `Agent Berea nhắc nhở: "${this.scriptureMotto}"\nXin hãy chọn lọc lời lẽ tôn trọng và gây dựng lẫn nhau trong tình yêu thương.`
        };
      }
    }

    return {
      passed: true,
      safe_clean_text: clean,
      reason: "Hợp lệ",
      reminder: null
    };
  }

  // Render Berea Guardian Alert Box
  renderGuardianNoticeHTML(reason, reminder) {
    return `
      <div class="metaphor-card animate-fade-in" style="border-left: 4px solid var(--status-warning); background: rgba(245, 158, 11, 0.08);">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--status-warning); font-weight: 700; margin-bottom: 0.4rem;">
          <i class="fa-solid fa-shield-halved"></i>
          <span>AGENT BEREA - THÔNG BÁO KIỂM DUYỆT ĐẠO ĐỨC</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.5rem;">
          <strong>Lý do từ chối:</strong> ${reason}
        </p>
        <p style="font-size: 0.86rem; color: var(--accent-gold-light); font-style: italic; background: rgba(0,0,0,0.25); padding: 0.65rem; border-radius: 6px; border-left: 2px solid var(--accent-gold);">
          <i class="fa-solid fa-quote-left" style="color: var(--accent-gold); margin-right: 0.35rem;"></i>
          ${reminder}
        </p>
      </div>
    `;
  }
}

export const bereaGuardian = new BereaGuardian();
