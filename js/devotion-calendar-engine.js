/* ==========================================================================
   DEVOTION CALENDAR ENGINE - TIN LÀNH 365-DAY DYNAMIC DEVOTIONAL ENGINE
   Manages daily memory verses, 4-stream Bible reading plans & daily meditation
   ========================================================================== */

export class DevotionCalendarEngine {
  constructor() {
    this.currentDate = new Date();
    this.database = null;
    this.isLoaded = false;
    this.isViewingToday = true;
  }

  isToday(date = this.currentDate) {
    const now = new Date();
    return date.getDate() === now.getDate() &&
           date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  }

  checkDateRollOver(storage = null) {
    if (!this.isViewingToday) return false;
    const now = new Date();
    if (!this.isToday(this.currentDate)) {
      this.currentDate = now;
      this.isViewingToday = true;
      return true; // Đã sang ngày mới, cần render lại
    }
    return false;
  }

  async loadDatabase() {
    if (this.isLoaded && this.database) return this.database;
    try {
      if (typeof window === 'undefined' && typeof process !== 'undefined') {
        try {
          const fs = await import('fs');
          const data = fs.readFileSync('data/daily-devotions-365.json', 'utf8');
          this.database = JSON.parse(data);
          this.isLoaded = true;
          return this.database;
        } catch (err) {}
      }
      const res = await fetch('data/daily-devotions-365.json');
      if (res.ok) {
        this.database = await res.json();
        this.isLoaded = true;
        return this.database;
      }
    } catch (e) {
      console.warn('Could not load daily-devotions-365.json (offline/test fallback enabled):', e);
    }
    return null;
  }

  getDayOfYear(date = this.currentDate) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay) + 1;
    // Bound between 1 and 365
    return Math.min(365, Math.max(1, day));
  }

  formatDateVi(date = this.currentDate) {
    const daysVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dName = daysVi[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dName}, ${dd}/${mm}/${yyyy}`;
  }

  formatDateInput(date = this.currentDate) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getDateKey(date = this.currentDate) {
    return this.formatDateInput(date);
  }

  getDevotionForDate(date = this.currentDate, storage = null) {
    const dKey = this.getDateKey(date);
    
    // 1. Kiểm tra Admin Override trong LocalStorage trước (nếu người quản trị có sửa riêng cho ngày này)
    if (storage && typeof storage.getDevotionDataForDate === 'function') {
      const override = storage.getDevotionDataForDate(dKey);
      if (override) return { ...override, dateStr: this.formatDateVi(date), isOverride: true };
    }

    const dayOfYear = this.getDayOfYear(date);

    // 2. Lấy dữ liệu từ Database 365 ngày
    if (this.database && this.database[String(dayOfYear)]) {
      const item = this.database[String(dayOfYear)];
      return {
        ...item,
        dateStr: this.formatDateVi(date),
        dayOfYear: dayOfYear,
        isOverride: false
      };
    }

    // 3. Fallback mặc định an toàn tuyệt đối (Ha-ba-cúc 3:19 & 4 Luồng Đọc chuẩn)
    return {
      day: dayOfYear,
      dayOfYear: dayOfYear,
      dateStr: this.formatDateVi(date),
      isOverride: false,
      verse: {
        book: 'HAB',
        ch: 3,
        v: 19,
        ref: 'Ha-ba-cúc 3:19',
        text: 'Đức Giê-hô-va là Chúa, là sức mạnh của tôi, Ngài làm cho chân tôi giống như chân con hươu, Khiến tôi đi trên các nơi cao của mình. (Phó cho quan phường nhạc, khảy đàn mà hát bài nầy).'
      },
      reading_plan: [
        {
          title: 'Cựu Ước & Tân Ước:',
          text: 'Giê-rê-mi 20. Giê-rê-mi 35-36. Cô-lô-se 4.',
          passages: [
            { book: 'JER', ch: 20, name: 'Giê-rê-mi 20' },
            { book: 'JER', ch: 35, name: 'Giê-rê-mi 35-36' },
            { book: 'COL', ch: 4, name: 'Cô-lô-se 4' }
          ],
          audioBook: 'JER',
          audioCh: 20
        },
        {
          title: 'Sáng-thế Ký - Khải-huyền:',
          text: 'Mác 14:12-15:47.',
          passages: [{ book: 'MRK', ch: 14, name: 'Mác 14:12-15:47' }],
          audioBook: 'MRK',
          audioCh: 14
        },
        {
          title: 'Đọc Tân Ước Trong Ba Tháng:',
          text: 'Lu-ca 21-22.',
          passages: [{ book: 'LUK', ch: 21, name: 'Lu-ca 21-22' }],
          audioBook: 'LUK',
          audioCh: 21
        },
        {
          title: 'Đọc Trong Ba Năm:',
          text: 'Gióp 22.',
          passages: [{ book: 'JOB', ch: 22, name: 'Gióp 22' }],
          audioBook: 'JOB',
          audioCh: 22
        }
      ],
      daily_article: {
        title: 'Áp Bức Người Cùng Khốn',
        passage_ref: 'Châm Ngôn 22:22-23',
        book: 'PRO',
        ch: 22,
        v: 22,
        content: 'Chớ bóc lột kẻ nghèo khó bởi vì họ nghèo khó, và cũng đừng ức hiếp kẻ khốn cùng nơi cửa thành. Vì Đức Giê-hô-va sẽ bênh vực duyên cớ của họ...'
      }
    };
  }

  prevDay(storage = null) {
    const prev = new Date(this.currentDate);
    prev.setDate(prev.getDate() - 1);
    this.currentDate = prev;
    this.isViewingToday = this.isToday(this.currentDate);
    return this.getDevotionForDate(this.currentDate, storage);
  }

  nextDay(storage = null) {
    const next = new Date(this.currentDate);
    next.setDate(next.getDate() + 1);
    this.currentDate = next;
    this.isViewingToday = this.isToday(this.currentDate);
    return this.getDevotionForDate(this.currentDate, storage);
  }

  today(storage = null) {
    this.currentDate = new Date();
    this.isViewingToday = true;
    return this.getDevotionForDate(this.currentDate, storage);
  }

  setDate(dateStrOrObj, storage = null) {
    if (dateStrOrObj instanceof Date) {
      this.currentDate = new Date(dateStrOrObj);
    } else if (typeof dateStrOrObj === 'string') {
      const parts = dateStrOrObj.split('-');
      if (parts.length === 3) {
        this.currentDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        this.currentDate = new Date(dateStrOrObj);
      }
    }
    this.isViewingToday = this.isToday(this.currentDate);
    return this.getDevotionForDate(this.currentDate, storage);
  }
}

export const devotionCalendarEngine = new DevotionCalendarEngine();
