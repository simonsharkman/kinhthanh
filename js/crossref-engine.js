/* ==========================================================================
   LOGOS MULTIVERSE - CROSS-REFERENCE ENGINE
   "Kinh Thánh Tự Giải Thích Kinh Thánh" (Scripture Interprets Scripture)
   ========================================================================== */

export class CrossRefEngine {
  constructor() {
    this.tskDb = {
      // Treasury of Scripture Knowledge pre-mapped links
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

  getCrossReferences(verseKey) {
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

  // Render Cross-Reference HTML panel
  renderCrossReferenceHTML(verseKey, defaultRefs = null) {
    const list = defaultRefs || this.getCrossReferences(verseKey);

    let html = `
      <div class="crossref-container animate-fade-in">
        <div class="metaphor-card" style="border-left: 3px solid var(--accent-gold);">
          <h4 style="font-family: var(--font-brand); color: var(--accent-gold); margin-bottom: 0.5rem;">
            <i class="fa-solid fa-link"></i> Chuỗi Liên Kết: Kinh Thánh Tự Giải Nghĩa Kinh Thánh
          </h4>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
            Nguyên tắc nền tảng của Cải Chánh (Scriptura Sacra sui ipsius interpres): Lấy phân đoạn sáng tỏ giải thích phân đoạn ẩn ý, đối chiếu hình bóng Cựu Ước với ứng nghiệm Tân Ước.
          </p>
        </div>
        <div class="crossref-items-list" style="display: flex; flex-direction: column; gap: 0.85rem;">
    `;

    list.forEach(item => {
      const refText = typeof item === 'string' ? item : item.ref;
      const noteText = typeof item === 'object' && item.note ? item.note : '';
      const previewQuote = this.fetchVersePreview(refText);

      html += `
        <div class="parallel-verse-card">
          <div class="parallel-card-header">
            <span class="version-code-badge"><i class="fa-solid fa-arrow-turn-down-right"></i> ${refText}</span>
            <button class="banner-action-btn crossref-peek-btn" data-ref="${refText}" style="padding: 0.15rem 0.5rem; font-size: 0.75rem;">
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
