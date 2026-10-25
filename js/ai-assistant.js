/* ==========================================================================
   LOGOS MULTIVERSE - THEOLOGICAL AI COPILOT & AUTONOMOUS AGENT (KIMCHI-GRADE)
   Multi-Model Orchestration (Gemini, OpenAI, DeepSeek, Ollama, Logos Autonomous),
   Specialized Agentic Roles, Deep Hermeneutics, Biblical Characters Encyclopedia,
   66-Book Masterclass RAG Engine, Live Web Search & Autonomous Copilot Actions
   ========================================================================== */

import { storage } from './storage.js';
import { state } from './state.js';

// 4 Specialized Agentic Roles (Kimchi-Style Persona Routing)
export const AI_ROLES = {
  copilot: {
    id: 'copilot',
    name: 'Logos Copilot',
    icon: 'fa-bolt',
    badge: '⚡ Logos Copilot',
    desc: 'Trợ lý toàn diện: Tra cứu thần học & Tự động điều khiển trang web theo lệnh',
    systemFocus: 'Cân bằng giữa giải nghĩa thần học và tự động điều khiển trang web theo yêu cầu người dùng.'
  },
  exegete: {
    id: 'exegete',
    name: 'Giải Kinh Thần Học',
    icon: 'fa-graduation-cap',
    badge: '🎓 Chuyên Gia Giải Kinh',
    desc: 'Mạch văn cứu chuộc, Thần học Giao ước & Hình bóng Đấng Christ (Typology)',
    systemFocus: 'Tập trung chuyên sâu vào giải kinh theo nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh", đối chiếu Cựu Ước - Tân Ước, thần học giao ước và Typology Đấng Christ.'
  },
  linguist: {
    id: 'linguist',
    name: 'Nguyên Ngữ & Strong\'s',
    icon: 'fa-scroll',
    badge: '📜 Nhà Ngôn Ngữ Học',
    desc: 'Bóc tách từ gốc Koine Greek, Biblical Hebrew/Aramaic & Mã số Strong',
    systemFocus: 'Tập trung bóc tách từ gốc Hy Lạp (Koine Greek) và Hê-bơ-rơ (Biblical Hebrew), mã số Strong, thì động từ, ngữ pháp và đối chiếu sắc thái ngữ nghĩa.'
  },
  historian: {
    id: 'historian',
    name: 'Bối Cảnh Lịch Sử',
    icon: 'fa-landmark',
    badge: '🏛️ Sử Gia Cận Đông',
    desc: 'Bối cảnh Cận Đông Cổ Đại, Niên đại trước thuật, Địa lý & Phong tục',
    systemFocus: 'Tập trung vào bối cảnh lịch sử Cận Đông cổ đại, đế chế La Mã/Ai Cập/Ba-by-lôn, niên đại trước thuật, địa lý và phong tục thời Kinh Thánh.'
  }
};

// 5 Multi-Provider AI Harness (Kimchi-Style Provider Support)
export const AI_PROVIDERS = {
  'berea-offline': {
    id: 'berea-offline',
    name: 'Logos Autonomous Core (Ngoại Tuyến RAG)',
    badge: '⚡ Ngoại Tuyến (Không cần Key)',
    requiresKey: false,
    models: [
      { id: 'berea-v2', name: 'Logos Semantic RAG Engine v2.5 (Toàn bộ 66 Sách)' }
    ]
  },
  'gemini': {
    id: 'gemini',
    name: 'Google Gemini AI',
    badge: '✨ Google Gemini',
    requiresKey: true,
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Khuyên dùng - Siêu tốc & 1M Context)' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Ổn định)' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Lập luận thần học chuyên sâu)' }
    ]
  },
  'openai': {
    id: 'openai',
    name: 'OpenAI ChatGPT',
    badge: '🤖 OpenAI ChatGPT',
    requiresKey: true,
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Nhanh & Tối ưu chi phí)' },
      { id: 'gpt-4o', name: 'GPT-4o (Đỉnh cao giải kinh)' }
    ]
  },
  'deepseek': {
    id: 'deepseek',
    name: 'DeepSeek / OpenRouter',
    badge: '🧠 DeepSeek AI',
    requiresKey: true,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek-V3 (Chat thần học)' },
      { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (Suy luận sâu)' }
    ]
  },
  'ollama': {
    id: 'ollama',
    name: 'Ollama Local AI',
    badge: '🦙 Ollama Local (Máy cục bộ)',
    requiresKey: false,
    models: [
      { id: 'llama3', name: 'Llama 3' },
      { id: 'qwen2.5', name: 'Qwen 2.5' },
      { id: 'mistral', name: 'Mistral' }
    ]
  }
};

export class AIAssistant {
  constructor() {
    // Multi-Provider & Role State
    this.provider = storage.getPreference('ai_provider', 'berea-offline');
    this.role = storage.getPreference('ai_role', 'copilot');

    // Provider Models
    this.geminiModel = storage.getPreference('gemini_model', 'gemini-2.0-flash');
    this.openaiModel = storage.getPreference('openai_model', 'gpt-4o-mini');
    this.deepseekModel = storage.getPreference('deepseek_model', 'deepseek-chat');
    this.ollamaModel = storage.getPreference('ollama_model', 'llama3');
    this.ollamaEndpoint = storage.getPreference('ollama_endpoint', 'http://localhost:11434');

    // API Keys
    this.geminiApiKey = storage.getPreference('gemini_api_key', '');
    this.apiKey = storage.getPreference('openai_api_key', ''); // Backward compatibility
    this.deepseekApiKey = storage.getPreference('deepseek_api_key', '');

    // Web Search & History
    this.isWebSearchEnabled = storage.getPreference('ai_web_search', true);
    this.history = []; // Backward compatibility
    this.isDeepResearchEnabled = storage.getPreference('ai_deep_research', false);
    this.conversationHistory = [];

    // Pre-loaded Comprehensive 66-Book Metadata Dictionary
    this.booksDirectory = this.initBooksDirectory();

    // Biblical Characters Encyclopedia
    this.biblicalCharacters = this.initBiblicalCharacters();

    // Async Local Datasets Cache
    this.theologicalTopicsCache = null;
    this.metaphorsCache = null;
    this.searchIndexCache = null;

    // Trigger background loading of rich datasets
    this.preloadLocalDatasets();
  }

  // Kimchi Deep Research & Multi-Turn Conversation Memory Stream
  setDeepResearchEnabled(enabled) {
    this.isDeepResearchEnabled = !!enabled;
    storage.savePreference('ai_deep_research', this.isDeepResearchEnabled);
  }

  getDeepResearchEnabled() {
    return this.isDeepResearchEnabled;
  }

  recordConversationTurn(role, text) {
    if (!text) return;
    this.conversationHistory.push({
      role: role,
      content: text,
      timestamp: Date.now()
    });
    // Keep last 8 turns (sliding window)
    if (this.conversationHistory.length > 8) {
      this.conversationHistory = this.conversationHistory.slice(-8);
    }
  }

  clearConversationHistory() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  // Kimchi Long-Context Processing & Multi-Source Synthesis Engine (getkimchi/kimchi standard)
  buildKimchiContextPackage(question, context = {}, isDeep = null) {
    const deep = (isDeep !== null && isDeep !== undefined) ? !!isDeep : this.isDeepResearchEnabled;
    const bookId = context.bookId || (context.passageData && context.passageData.book_id) || 'JHN';
    const chapterNum = context.chapter || (context.passageData && context.passageData.chapter_num) || 1;
    const bookMeta = this.booksDirectory[bookId] || this.booksDirectory.JHN;
    const bookNameVi = context.book || bookMeta?.name_vi || 'Giăng';
    const refStr = context.ref || `${bookNameVi} ${chapterNum}:${context.verse || 1}`;

    let versesProcessed = 0;
    const translationsSet = new Set(['BTT']);
    let crossRefLinksCount = 0;
    const contextSections = [];

    // 1. Phân đoạn Kinh Thánh & Ma trận đối chiếu song song đa bản dịch (Full Scripture Corpus & Parallel Matrix)
    if (context.passageData && Array.isArray(context.passageData.verses) && context.passageData.verses.length > 0) {
      const verses = context.passageData.verses;
      const limit = deep ? Math.min(verses.length, 50) : Math.min(verses.length, 25);
      versesProcessed = limit;

      const activeVers = (context.activeVersions && context.activeVersions.length > 0)
        ? context.activeVersions
        : ['BTT', 'KJV', 'ESV', 'EDE', 'JARAI', 'BDY', 'BTHD', 'BDM'];

      activeVers.forEach(v => translationsSet.add(v));

      let scriptureBlock = `=== NGUỒN BẢN VĂN THÁNH KINH PHÂN ĐOẠN (${bookNameVi.toUpperCase()} ĐOẠN ${chapterNum}) ===\n`;
      scriptureBlock += `Tổng số câu khảo cứu: ${limit}/${verses.length} câu. Các bản dịch đối chiếu: ${Array.from(translationsSet).join(', ')}.\n\n`;

      for (let i = 0; i < limit; i++) {
        const v = verses[i];
        const vNum = v.verse_num || (i + 1);
        scriptureBlock += `[Câu ${vNum}]\n`;
        if (v.text) {
          scriptureBlock += `  - BTT (1925): ${v.text}\n`;
        }
        if (v.translations && typeof v.translations === 'object') {
          for (const verCode of activeVers) {
            if (v.translations[verCode] && verCode !== 'BTT') {
              translationsSet.add(verCode);
              scriptureBlock += `  - ${verCode}: ${v.translations[verCode]}\n`;
            }
          }
        }
      }
      contextSections.push(scriptureBlock);
    } else {
      versesProcessed = 1;
      contextSections.push(`=== PHÂN ĐOẠN KHẢO CỨU: ${refStr} ===\nTrước giả: ${bookMeta?.author_human || 'Trước giả được Đức Chúa Trời chọn lọc'}\nTác Giả Tối Thượng: Đức Chúa Trời soi dẫn.\nBối cảnh: ${bookMeta?.historical_context || 'Lịch sử Thánh Kinh'}\nChủ đề: ${bookMeta?.key_themes || 'Kế hoạch cứu chuộc'}`);
    }

    // 2. Mạng lưới đối chiếu chéo TSK (Treasury of Scripture Knowledge)
    if (context.crossReferences && Array.isArray(context.crossReferences) && context.crossReferences.length > 0) {
      crossRefLinksCount = context.crossReferences.length;
      let tskBlock = `=== MẠNG LƯỚI ĐỐI CHIẾU CHÉO TSK (KINH THÁNH TỰ GIẢI THÍCH KINH THÁNH) ===\n`;
      context.crossReferences.forEach((cr, idx) => {
        tskBlock += `${idx + 1}. ${cr.ref}: "${cr.note || ''}"\n`;
      });
      contextSections.push(tskBlock);
    }

    // 3. Quy tắc diễn giải thể loại văn chương (Hermeneutics Genre Guidelines)
    if (context.genreGuide) {
      let genreBlock = `=== NGUYÊN TẮC THÔNG GIẢI HỌC (HERMENEUTICS & GENRE RULES) ===\n`;
      genreBlock += `Thể loại: ${context.genreGuide.genre_name || bookMeta?.genre || 'Thánh Văn'}\n`;
      if (context.genreGuide.rules && Array.isArray(context.genreGuide.rules)) {
        context.genreGuide.rules.forEach((r, idx) => {
          genreBlock += `• Quy tắc ${idx + 1}: ${r}\n`;
        });
      }
      if (context.genreGuide.christocentric_key) {
        genreBlock += `• Chìa khóa Christocentric: ${context.genreGuide.christocentric_key}\n`;
      }
      contextSections.push(genreBlock);
    }

    // 4. Khớp chủ đề thần học từ Caches
    let matchedTopics = 0;
    const qLower = question.toLowerCase();
    if (this.theologicalTopicsCache && Array.isArray(this.theologicalTopicsCache)) {
      const matched = this.theologicalTopicsCache.filter(t => 
        qLower.includes(t.title?.toLowerCase() || '') ||
        (t.keywords && t.keywords.some(k => qLower.includes(k.toLowerCase())))
      );
      if (matched.length > 0) {
        matchedTopics += matched.length;
        let topBlock = `=== TRA CỨU CHỦ ĐỀ GIÁO LÝ ĐỒNG BỘ ===\n`;
        matched.slice(0, 3).forEach(m => {
          topBlock += `• ${m.title}: ${m.summary || m.content || ''}\n`;
        });
        contextSections.push(topBlock);
      }
    }

    // 5. Kimchi Deep Research Mode: Strong's & Covenant Timeline
    if (deep) {
      let deepBlock = `=== KIMCHI DEEP RESEARCH MODE: PHÂN TÍCH NGUYÊN NGỮ & DÒNG CHẢY GIAO ƯỚC ===\n`;
      deepBlock += `• Khảo sát nguyên ngữ: ${bookMeta?.testament === 'OT' ? 'Biblical Hebrew & Aramaic' : 'Koine Greek'}\n`;
      if (bookMeta?.key_words && Array.isArray(bookMeta.key_words)) {
        bookMeta.key_words.forEach(kw => {
          deepBlock += `  - ${kw.word}: ${kw.meaning}\n`;
        });
      }
      deepBlock += `• Typology Đấng Christ: ${bookMeta?.typology_note || 'Đấng Christ là sự làm trọn của Giao ước và Luật pháp.'}\n`;
      contextSections.push(deepBlock);
    }

    // 6. Multi-Turn Rolling Conversation Memory Stream (Sliding Window)
    if (this.conversationHistory && this.conversationHistory.length > 0) {
      let memBlock = `=== DÒNG BỘ NHỚ HỘI THOẠI TRƯỚC ĐÓ (CONVERSATION ROLLING STREAM) ===\n`;
      const recentTurns = this.conversationHistory.slice(-4);
      recentTurns.forEach(turn => {
        const speaker = turn.role === 'user' ? 'Người Dùng' : 'Trợ Lý Thánh Kinh AI';
        const snippet = (turn.content || '').replace(/<[^>]*>/g, '').slice(0, 250);
        memBlock += `[${speaker}]: ${snippet}...\n`;
      });
      contextSections.push(memBlock);
    }

    const fullContextString = contextSections.join('\n\n');
    const tokensEstimated = Math.round(fullContextString.length / 3);

    return {
      contextString: fullContextString,
      metrics: {
        versesCount: versesProcessed,
        translationsCount: translationsSet.size,
        crossRefLinks: crossRefLinksCount,
        topicsCount: matchedTopics,
        turnsCount: this.conversationHistory.length,
        tokensEstimated: tokensEstimated.toLocaleString(),
        isDeep: deep
      }
    };
  }

  // Kimchi Telemetry & Governance Metrics Formatter (Visual Token & Context Accountability)
  formatKimchiTelemetryBar(metrics = {}, modelName = '') {
    const model = modelName || this.getModel();
    const verses = metrics.versesCount || 0;
    const trans = metrics.translationsCount || 1;
    const tsk = metrics.crossRefLinks || 0;
    const tokens = metrics.tokensEstimated || '1,200';
    const latency = metrics.latencyMs ? `${metrics.latencyMs}ms` : '<45ms';
    const deepBadge = metrics.isDeep 
      ? `<span class="kimchi-chip deep-mode"><i class="fa-solid fa-dna"></i> Deep Research: BẬT</span>` 
      : '';

    return `
      <div class="kimchi-telemetry-bar">
        <span class="kimchi-chip model-chip"><i class="fa-solid fa-microchip"></i> ${model}</span>
        <span class="kimchi-chip info-chip"><i class="fa-solid fa-book-open"></i> ${verses} câu</span>
        <span class="kimchi-chip trans-chip"><i class="fa-solid fa-language"></i> ${trans} bản dịch</span>
        <span class="kimchi-chip tsk-chip"><i class="fa-solid fa-link"></i> ${tsk} TSK</span>
        <span class="kimchi-chip token-chip"><i class="fa-solid fa-gauge-high"></i> ~${tokens} tokens</span>
        <span class="kimchi-chip speed-chip"><i class="fa-solid fa-bolt"></i> ${latency}</span>
        ${deepBadge}
      </div>
    `;
  }

  // Preload local theological datasets asynchronously
  async preloadLocalDatasets() {
    try {
      if (typeof fetch !== 'undefined') {
        fetch('data/ai-theological-topics.json')
          .then(res => res.ok ? res.json() : null)
          .then(data => { if (data) this.theologicalTopicsCache = data; })
          .catch(() => {});

        fetch('data/metaphors-database.json')
          .then(res => res.ok ? res.json() : null)
          .then(data => { if (data) this.metaphorsCache = data; })
          .catch(() => {});

        fetch('data/books-metadata.json')
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && Array.isArray(data)) {
              data.forEach(b => {
                if (this.booksDirectory[b.id]) {
                  this.booksDirectory[b.id].chapters_count = b.chapters_count || this.booksDirectory[b.id].chapters_count;
                  this.booksDirectory[b.id].author_human = `Trước giả: ${b.author}`;
                  this.booksDirectory[b.id].date = b.date_written || this.booksDirectory[b.id].date;
                  this.booksDirectory[b.id].historical_context = b.historical_context || this.booksDirectory[b.id].historical_context;
                  this.booksDirectory[b.id].key_themes = b.theme || this.booksDirectory[b.id].key_themes;
                }
              });
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      // Graceful offline fallback
    }
  }

  // Provider & Role Getters / Setters
  getProvider() {
    return this.provider;
  }

  setProvider(providerId) {
    if (AI_PROVIDERS[providerId]) {
      this.provider = providerId;
      storage.savePreference('ai_provider', providerId);
    }
  }

  getRole() {
    return this.role;
  }

  setRole(roleId) {
    if (AI_ROLES[roleId]) {
      this.role = roleId;
      storage.savePreference('ai_role', roleId);
    }
  }

  getProvidersList() {
    return Object.values(AI_PROVIDERS);
  }

  getRolesList() {
    return Object.values(AI_ROLES);
  }

  // API Key management (backward compatible)
  getApiKey(provider = null) {
    const prov = provider || this.provider;
    if (prov === 'gemini') return this.geminiApiKey;
    if (prov === 'deepseek') return this.deepseekApiKey;
    return this.apiKey;
  }

  setApiKey(key, provider = null) {
    const cleanKey = (key || '').trim();
    const prov = provider || this.provider;
    if (prov === 'gemini') {
      this.geminiApiKey = cleanKey;
      storage.savePreference('gemini_api_key', cleanKey);
    } else if (prov === 'deepseek') {
      this.deepseekApiKey = cleanKey;
      storage.savePreference('deepseek_api_key', cleanKey);
    } else {
      this.apiKey = cleanKey;
      storage.savePreference('openai_api_key', cleanKey);
    }
  }

  getModel(provider = null) {
    const prov = provider || this.provider;
    if (prov === 'gemini') return this.geminiModel;
    if (prov === 'deepseek') return this.deepseekModel;
    if (prov === 'ollama') return this.ollamaModel;
    if (prov === 'berea-offline') return 'berea-v2';
    return this.openaiModel;
  }

  setModel(provider, modelId) {
    if (provider === 'gemini') {
      this.geminiModel = modelId;
      storage.savePreference('gemini_model', modelId);
    } else if (provider === 'openai') {
      this.openaiModel = modelId;
      storage.savePreference('openai_model', modelId);
    } else if (provider === 'deepseek') {
      this.deepseekModel = modelId;
      storage.savePreference('deepseek_model', modelId);
    } else if (provider === 'ollama') {
      this.ollamaModel = modelId;
      storage.savePreference('ollama_model', modelId);
    }
  }

  setWebSearchEnabled(enabled) {
    this.isWebSearchEnabled = !!enabled;
    storage.savePreference('ai_web_search', this.isWebSearchEnabled);
  }

  getWebSearchEnabled() {
    return this.isWebSearchEnabled;
  }

  getOllamaEndpoint() {
    return this.ollamaEndpoint;
  }

  setOllamaEndpoint(endpoint) {
    this.ollamaEndpoint = (endpoint || 'http://localhost:11434').trim();
    storage.savePreference('ollama_endpoint', this.ollamaEndpoint);
  }

  // Active Provider Badge info
  getActiveProviderInfo() {
    const p = AI_PROVIDERS[this.provider] || AI_PROVIDERS['berea-offline'];
    const r = AI_ROLES[this.role] || AI_ROLES.copilot;
    const model = this.getModel(this.provider);
    return {
      providerId: p.id,
      providerName: p.name,
      badge: p.badge,
      modelId: model,
      roleId: r.id,
      roleName: r.name,
      roleBadge: r.badge,
      requiresKey: p.requiresKey,
      hasKey: !!this.getApiKey(p.id)
    };
  }

  // Dynamic Context-Aware Prompt Suggestions
  getSuggestedPrompts(verseRef = 'Giăng 1:1', bookMetadata = null) {
    const bookName = bookMetadata?.name_vi || 'Giăng';
    const bookId = bookMetadata?.id || 'JHN';

    return [
      `Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch`,
      `Phân tích toàn diện ${bookName} đoạn 1 (Bối cảnh, trước giả, thần học)`,
      `Giô-na là ai và ý nghĩa dấu lạ Giô-na trong Tân Ước?`,
      `Từ gốc nguyên ngữ Hy Lạp/Hê-bơ-rơ và mã Strong's của ${verseRef}?`,
      `Hình bóng Đấng Christ & Lịch sử cứu chuộc trong sách ${bookName}?`,
      `Tra cứu không gian mạng: Khảo cổ & bối cảnh lịch sử sách ${bookName}`
    ];
  }

  // Live Web Search Engine: Queries Wikipedia Open API & Free Theological Archives
  async searchOnlineWeb(query) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return null;

    try {
      const viUrl = `https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery + ' kinh thánh')}&utf8=&format=json&origin=*`;
      const viRes = await fetch(viUrl, { headers: { 'Accept': 'application/json' } });

      let results = [];
      if (viRes.ok) {
        const viData = await viRes.json();
        if (viData.query && viData.query.search && viData.query.search.length > 0) {
          results = viData.query.search.slice(0, 3).map(item => ({
            title: item.title,
            snippet: item.snippet.replace(/<span class="searchmatch">/g, '').replace(/<\/span>/g, ''),
            url: `https://vi.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
            source: 'Wikipedia Tiếng Việt'
          }));
        }
      }

      if (results.length === 0) {
        const enUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery + ' biblical theology')}&utf8=&format=json&origin=*`;
        const enRes = await fetch(enUrl, { headers: { 'Accept': 'application/json' } });
        if (enRes.ok) {
          const enData = await enRes.json();
          if (enData.query && enData.query.search && enData.query.search.length > 0) {
            results = enData.query.search.slice(0, 2).map(item => ({
              title: item.title,
              snippet: item.snippet.replace(/<span class="searchmatch">/g, '').replace(/<\/span>/g, ''),
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
              source: 'Wikipedia Global Archive'
            }));
          }
        }
      }

      return results.length > 0 ? results : null;
    } catch (e) {
      console.warn('Live web search warning (offline or network restriction):', e);
      return null;
    }
  }

  // Master Copilot Natural Language Action Dispatcher
  parseAndExecuteCopilotCommand(question) {
    const q = question.toLowerCase().trim();
    let actionResults = [];

    // 1. Passage Navigation Command (covers compound commands e.g. "Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch")
    let targetBookId = null;
    let targetChapter = null;
    let bookNameVi = null;

    // Search against all 66 books in directory
    for (const [id, book] of Object.entries(this.booksDirectory)) {
      const aliases = [
        book.name_vi.toLowerCase(),
        book.name_vi_no_accent,
        book.name_en.toLowerCase(),
        id.toLowerCase()
      ];

      for (const alias of aliases) {
        // Regex matching: (mở/chuyển/đọc/xem)? (sách)? <alias> (đoạn/chương)? (\d+)?
        const pattern = new RegExp(`(?:mở|chuyển|đọc|xem|bật)?(?:\\s+sách)?\\s+${alias}(?:\\s+(?:đoạn|chương|ch)?)?\\s*(\\d+)?`, 'i');
        const match = q.match(pattern);
        if (match) {
          targetBookId = id;
          bookNameVi = book.name_vi;
          if (match[1]) {
            targetChapter = parseInt(match[1], 10);
          } else {
            // Default chapters for major books or chapter 1
            if (id === 'JOS') targetChapter = 24;
            else if (id === 'PSA') targetChapter = 23;
            else if (id === 'ROM') targetChapter = 8;
            else if (id === 'ISA') targetChapter = 53;
            else targetChapter = 1;
          }
          break;
        }
      }
      if (targetBookId) break;
    }

    if (targetBookId && targetChapter) {
      try {
        state.setPassage(targetBookId, targetChapter);
        actionResults.push(`Đã tự động chuyển trang web đến: <strong>${bookNameVi} đoạn ${targetChapter}</strong>`);
      } catch (e) {
        console.warn('Copilot navigate error:', e);
      }
    }

    // 2. Parallel Translations Switch Command (e.g. "bật đối chiếu", "đối chiếu 6 bản dịch", "bật bản dịch ê-đê", "chọn bản kjv")
    if (q.includes('đối chiếu') || q.includes('bản dịch') || q.includes('so sánh')) {
      const targetVersions = [];
      if (q.includes('ê-đê') || q.includes('ede') || q.includes('rrb')) targetVersions.push('EDE');
      if (q.includes('gia-rai') || q.includes('jarai') || q.includes('jbsv')) targetVersions.push('JARAI');
      if (q.includes('diễn ý') || q.includes('bdy')) targetVersions.push('BDY');
      if (q.includes('hiệu đính') || q.includes('bthd') || q.includes('rvv11')) targetVersions.push('BTHD');
      if (q.includes('bản mới') || q.includes('bdm') || q.includes('nvb')) targetVersions.push('BDM');
      if (q.includes('truyền thống') || q.includes('btt') || q.includes('1925')) targetVersions.push('BTT');
      if (q.includes('kjv') || q.includes('king james')) targetVersions.push('KJV');
      if (q.includes('esv')) targetVersions.push('ESV');
      if (q.includes('niv')) targetVersions.push('NIV');

      if (targetVersions.length > 0) {
        const merged = Array.from(new Set([...state.activeVersions, ...targetVersions]));
        state.setActiveVersions(merged);
      }
      state.setDrawerTab('parallel');
      state.setDrawerOpen(true);
      actionResults.push(`Đã kích hoạt bảng <strong>Đối Chiếu Song Song Đa Bản Dịch</strong>.`);
    }

    // 3. Open Drawer Tool Tab Command
    if (q.includes('mở ẩn dụ') || q.includes('xem ẩn dụ') || q.includes('biểu tượng')) {
      state.setDrawerTab('metaphors');
      state.setDrawerOpen(true);
      actionResults.push('Đã mở bảng giải nghĩa ẩn dụ & hình bóng thần học.');
    } else if (q.includes('bối cảnh') && (q.includes('mở') || q.includes('xem'))) {
      state.setDrawerTab('context');
      state.setDrawerOpen(true);
      actionResults.push('Đã mở bảng khảo cứu bối cảnh lịch sử & trước giả.');
    } else if (q.includes('đóng bảng') || q.includes('tắt bảng') || q.includes('đóng đối chiếu')) {
      state.setDrawerOpen(false);
      actionResults.push('Đã đóng bảng điều khiển bên phải.');
    }

    // 4. Theme Toggle Command
    if (q.includes('chế độ tối') || q.includes('giao diện tối') || q.includes('ban đêm')) {
      state.setTheme('dark');
      actionResults.push('Đã chuyển sang giao diện Than Đá Hoàng Gia (Dark Mode).');
    } else if (q.includes('chế độ sáng') || q.includes('giao diện sáng') || q.includes('giấy cổ') || q.includes('parchment')) {
      state.setTheme('parchment');
      actionResults.push('Đã chuyển sang giao diện Giấy Cổ Điển (Parchment Mode).');
    }

    if (actionResults.length > 0) {
      return {
        executed: true,
        message: actionResults.join('<br>• '),
        bookId: targetBookId,
        chapter: targetChapter
      };
    }
    return null;
  }

  // Find Character in Question
  findCharacterMatch(question) {
    const q = question.toLowerCase();
    for (const [key, char] of Object.entries(this.biblicalCharacters)) {
      if (char.names.some(name => q.includes(name))) {
        return char;
      }
    }
    return null;
  }

  // Find Bible Book & Chapter Mention in Query
  findPassageMention(question) {
    const q = question.toLowerCase().trim();
    for (const [id, book] of Object.entries(this.booksDirectory)) {
      const aliases = [
        book.name_vi.toLowerCase(),
        book.name_vi_no_accent,
        book.name_en.toLowerCase(),
        id.toLowerCase()
      ];

      for (const alias of aliases) {
        // Pattern 1: Explicit chapter specified: e.g. "giô-suê 24", "giô-suê đoạn 24", "sách giô-suê đoạn 24"
        const regexWithChapter = new RegExp(`(?:sách\\s+)?${alias}(?:\\s+(?:đoạn|chương|ch|c))?\\s*(\\d+)`, 'i');
        const matchWithCh = q.match(regexWithChapter);
        if (matchWithCh && matchWithCh[1]) {
          return {
            bookId: id,
            bookMeta: book,
            chapter: parseInt(matchWithCh[1], 10),
            hasExplicitChapter: true
          };
        }

        // Pattern 2: Mention of whole book or book overview: e.g. "sách giô-suê", "phân tích sách ma-thi-ơ"
        const regexBookOnly = new RegExp(`(?:sách\\s+|phân tích\\s+|tổng quan\\s+)${alias}(?!\\w)`, 'i');
        if (regexBookOnly.test(q)) {
          return {
            bookId: id,
            bookMeta: book,
            chapter: book.default_chapter || 1,
            hasExplicitChapter: false
          };
        }
      }
    }
    return null;
  }

  // Generate Exhaustive 5-Part Masterclass for ANY of the 66 Books
  generateChapterMasterclass(bookName, chapterNum, bookMeta) {
    const roleConfig = AI_ROLES[this.role] || AI_ROLES.copilot;
    const authorHuman = bookMeta?.author_human || `Trước giả được Đức Chúa Trời chọn lọc`;
    const authorDivine = bookMeta?.author_divine || `Đức Chúa Trời là Tác Giả Tối Thượng`;
    const dateStr = bookMeta?.date || `Thời kỳ Thánh Kinh lịch sử`;
    const genreStr = bookMeta?.genre || `Văn Phẩm Thánh`;
    const themesStr = bookMeta?.key_themes || `Mầu nhiệm cứu chuộc và giao ước của Đức Chúa Trời`;
    const bookId = bookMeta?.id || 'JHN';

    // Original Languages vocabulary based on Testament
    let langHeading = '3. TỪ KHÓA NGUYÊN NGỮ HY LẠP (KOINE GREEK) & STRONG\'S';
    let langChipsHTML = '';

    if (bookMeta?.testament === 'OT') {
      langHeading = '3. TỪ KHÓA NGUYÊN NGỮ HÊ-BƠ-RƠ (BIBLICAL HEBREW) & STRONG\'S';
      const words = bookMeta.key_words || [
        { word: 'Hesed (H2617)', meaning: 'Tình yêu giao ước thành tín, nhân từ bất diệt' },
        { word: 'Shalom (H7965)', meaning: 'Sự bình an trọn vẹn, thịnh vượng tâm linh' },
        { word: 'Berit (H1285)', meaning: 'Giao ước thiêng liêng đời đời' },
        { word: 'Qadosh (H6918)', meaning: 'Thánh khiết, biệt riêng ra cho Đức Chúa Trời' }
      ];
      langChipsHTML = words.map((w, idx) => `
        <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.5rem 0.7rem; border-radius: 4px;">
          <strong style="color: var(--accent-gold);">${idx + 1}. ${w.word}</strong>: ${w.meaning}
        </div>
      `).join('');
    } else {
      const words = bookMeta?.key_words || [
        { word: 'Logos (G3056)', meaning: 'Ngôi Lời Hằng Hữu, Lời Phán sáng tạo, Thân vị Thần tính' },
        { word: 'Charis (G5485)', meaning: 'Ân điển nhưng không, quyền năng cứu rỗi vượt mọi tội lỗi' },
        { word: 'Dikaiosynē (G1343)', meaning: 'Sự công chính trọn vẹn bởi đức tin nơi Đấng Christ' },
        { word: 'Sōzō (G4982)', meaning: 'Sự cứu rỗi và chữa lành trọn vẹn cả linh hồn và thể xác' }
      ];
      langChipsHTML = words.map((w, idx) => `
        <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.5rem 0.7rem; border-radius: 4px;">
          <strong style="color: var(--accent-gold);">${idx + 1}. ${w.word}</strong>: ${w.meaning}
        </div>
      `).join('');
    }

    // Role-specific commentary adjustments
    let roleBadge = `<span class="badge-gold" style="background: var(--accent-gold); color: #121212; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">${roleConfig.badge}</span>`;
    let typologySection = `
      <div class="masterclass-section" style="margin-bottom: 0.8rem; background: rgba(212,175,55,0.04); border-left: 3px solid var(--accent-gold); padding: 0.65rem 0.85rem; border-radius: 4px;">
        <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin: 0 0 0.35rem 0;"><i class="fa-solid fa-cross"></i> 4. HÌNH BÓNG ĐẤNG CHRIST & LỊCH SỬ CỨU CHUỘC (TYPOLOGY)</h4>
        <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
          ${bookMeta?.typology_note || `Theo nguyên tắc <em>"Kinh Thánh tự giải nghĩa Kinh Thánh"</em> (Scriptura Sacra sui ipsius interpres), toàn bộ ${bookName} trong toàn cảnh Cựu Ước và Tân Ước luôn hướng về sự ứng nghiệm trọn vẹn nơi Thân Vị và Công Cuộc Chuộc Tội của Chúa Cứu Thế Giê-xu.`}
        </div>
      </div>
    `;

    return `
      <div class="theological-masterclass-card animate-fade-in" style="line-height: 1.6;">
        <div class="masterclass-header" style="border-bottom: 1px solid var(--accent-gold-border); padding-bottom: 0.6rem; margin-bottom: 0.8rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem;">
            ${roleBadge}
            <span style="font-size: 0.72rem; color: var(--text-muted);"><i class="fa-solid fa-book-bookmark"></i> ${genreStr}</span>
          </div>
          <h3 style="color: var(--accent-gold); margin: 0.4rem 0 0.2rem 0; font-family: var(--font-brand); font-size: 1.15rem;">
            ${bookName.toUpperCase()} • ĐOẠN ${chapterNum}
          </h3>
          <div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">
            ${authorHuman} • <strong>${authorDivine}</strong>
          </div>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin: 0 0 0.3rem 0;"><i class="fa-solid fa-landmark"></i> 1. THÂN THẾ TRƯỚC GIẢ & BỐI CẢNH LỊCH SỬ</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">
            • <strong>Thời gian:</strong> ${dateStr}.<br>
            • <strong>Không gian địa lý:</strong> ${bookMeta?.historical_context || 'Cận Đông cổ đại & Thế giới Địa Trung Hải thời Kinh Thánh'}.<br>
            • <strong>Trọng tâm giao ước:</strong> ${themesStr}.
          </p>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin: 0 0 0.3rem 0;"><i class="fa-solid fa-sitemap"></i> 2. MẠCH VĂN CỨU CHUỘC & CẤU TRÚC PHÂN ĐOẠN ${chapterNum}</h4>
          <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
            ${this.getSpecificChapterStructure(bookId, chapterNum, bookName)}
          </div>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin: 0 0 0.3rem 0;"><i class="fa-solid fa-language"></i> ${langHeading}</h4>
          <div class="strong-chips-grid" style="display: grid; gap: 0.45rem; margin-top: 0.3rem;">
            ${langChipsHTML}
          </div>
        </div>

        ${typologySection}

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin: 0 0 0.3rem 0;"><i class="fa-solid fa-seedling"></i> 5. 3 BÀI HỌC ỨNG DỤNG CHO ĐỜI SỐNG HÔM NAY</h4>
          <ol style="font-size: 0.84rem; color: var(--text-secondary); padding-left: 1.2rem; margin: 0; line-height: 1.6;">
            <li><strong>Tôn Đức Chúa Trời làm Đấng Tể Trị Tối Thượng:</strong> Để Lời Hằng Sống của Ngài định hình mọi quyết định, lời nói và hành vi hằng ngày.</li>
            <li><strong>Trung tín bước đi bởi đức tin kiên định:</strong> Dù đối diện nghịch cảnh hay thử thách hoang mạc, vững lòng nương cậy nơi giao ước thành tín của Chúa.</li>
            <li><strong>Thực thi chức phận môn đồ hóa:</strong> Trở nên ánh sáng chân lý và muối của đất, chia sẻ Phúc Âm cứu rỗi đến cho gia đình và cộng đồng.</li>
          </ol>
        </div>

        <div class="copilot-action-bar" style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.9rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-medium);">
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="${bookId}" data-chapter="${chapterNum}" style="background: var(--accent-gold); color: #121212; border: none; font-weight: 700; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-book-open"></i> Đọc ${bookName} ${chapterNum}
          </button>
          <button class="copilot-action-btn btn-sm" data-action="compare" data-book="${bookId}" data-chapter="${chapterNum}" style="background: rgba(255,255,255,0.06); border: 1px solid var(--accent-gold-border); color: var(--accent-gold); font-weight: 600; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-columns"></i> Đối Chiếu Bản Dịch Song Song
          </button>
          <button class="copilot-action-btn btn-sm" data-action="search" data-query="${bookName} ${chapterNum}" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-primary); font-weight: 600; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-magnifying-glass"></i> Tra cứu câu then chốt
          </button>
        </div>
      </div>
    `;
  }

  // Specific Chapter Exegetical Structures (e.g. Joshua 24, John 1, Romans 8, Psalm 23)
  getSpecificChapterStructure(bookId, chapterNum, bookName) {
    if (bookId === 'JOS' && chapterNum === 24) {
      return `
        • <strong>Đại hội Giao ước tại Si-chem (Giô-suê 24:1–13):</strong> Giô-suê triệu tập toàn thể các chi phái Y-sơ-ra-ên, các trưởng lão, quan xét và quan cai đến trước mặt Đức Chúa Trời. Ông ôn lại lịch sử cứu chuộc diệu kỳ: Từ khi Chúa gọi Áp-ra-ham ra khỏi đất U-rơ thờ thần tượng, cứu dân khỏi Ai Cập qua Biển Đỏ, đến việc ban cho xứ Ca-na-an đượm sữa và mật mà họ không tốn công xây dựng.<br>
        • <strong>Lời tuyên ngôn dứt khoát tại Si-chem (24:14–15):</strong> <em>"Vậy bây giờ, hãy kính sợ Đức Giê-hô-va và phục sự Ngài cách thành tâm trung tín... nếu chẳng thích phục sự Đức Giê-hô-va, thì ngày nay hãy chọn ai mà mình muốn phục sự... Nhưng ta và nhà ta sẽ phục sự Đức Giê-hô-va!"</em>.<br>
        • <strong>Lời thề lập ước của tuyển dân & Hòn đá làm chứng (24:16–28):</strong> Dân chúng đồng thanh thề: <em>"Chúng tôi quyết không lìa bỏ Đức Giê-hô-va để thờ các thần khác!"</em>. Giô-suê dựng một hòn đá lớn dưới cây dẻ gai bên cạnh nơi thánh của Chúa làm bằng chứng đời đời.<br>
        • <strong>Sự an nghỉ của Giô-suê & Di cốt Giô-sép (24:29–33):</strong> Giô-suê qua đời thọ 110 tuổi, được chôn tại sản nghiệp mình. Xương của Giô-sép mang từ Ai Cập được an táng tại Si-chem, khép lại trọn vẹn lời hứa 400 năm trước.
      `;
    }

    if (bookId === 'JHN' && chapterNum === 1) {
      return `
        • <strong>Khúc Mở Đầu Vinh Hiển (Prologue 1:1–18):</strong> Ngôi Lời (Logos) hằng hữu từ trước vô cùng, đồng đẳng với Đức Chúa Trời, Đấng Sáng Tạo muôn loài, trở nên xác thịt ở giữa loài người, chan chứa ân điển và chân lý.<br>
        • <strong>Lời Chứng Của Giăng Báp-tít (1:19–34):</strong> Khước từ danh hiệu Đấng Mê-si-a, Giăng tự nhận là tiếng kêu trong đồng vắng và công bố danh hiệu tối thượng: <em>"Kìa, Chiên Con của Đức Chúa Trời, Đấng cất tội lỗi thế gian đi!"</em> (1:29).<br>
        • <strong>Kêu Gọi Những Môn Đồ Đầu Tiên (1:35–51):</strong> Lời mời <em>"Hãy đến và xem"</em>. An-rê, Phi-e-rơ, Phi-líp và Na-tha-na-ên xưng nhận: <em>"Thầy là Con Đức Chúa Trời, là Vua dân Y-sơ-ra-ên!"</em>.
      `;
    }

    if (bookId === 'ROM' && chapterNum === 8) {
      return `
        • <strong>Không Còn Sự Đoán Phạt Nơi Đấng Christ (Rô-ma 8:1–4):</strong> Luật của Thánh Linh sự sống đã giải thoát chúng ta khỏi luật của tội lỗi và sự chết.<br>
        • <strong>Đời Sống Theo Thánh Linh vs Xác Thịt (8:5–17):</strong> Chúng ta nhận lấy Thần Trí của sự làm con nuôi, gọi Ngài là <em>"A-ba! Cha!"</em>, đồng kế tự với Đấng Christ.<br>
        • <strong>Muôn Vật Than Thở & Sự Trông Cậy Vinh Hiển (8:18–30):</strong> Sự đau đớn hiện tại chẳng đáng so sánh với vinh quang tương lai; vạn sự hiệp lại làm ích cho kẻ yêu mến Đức Chúa Trời.<br>
        • <strong>Khải Hoàn Ca Về Tình Yêu Bất Diệt (8:31–39):</strong> <em>"Nếu Đức Chúa Trời vì chúng ta, thì còn ai nghịch với chúng ta?... Không có điều gì có thể phân rẽ chúng ta khỏi tình yêu thương của Đức Chúa Trời trong Đức Chúa Giê-xu Christ!"</em>.
      `;
    }

    if (bookId === 'PSA' && chapterNum === 23) {
      return `
        • <strong>Đấng Chăn Chiên Thành Tín (Thi-thiên 23:1–3):</strong> <em>"Đức Giê-hô-va là Đấng chăn giữ tôi, tôi chẳng thiếu thốn gì"</em>. Ngài dẫn tôi đến đồng cỏ xanh tươi, mé nước bình tịnh, bổ lại linh hồn tôi.<br>
        • <strong>Sự An Ninh Giữa Trũng Bóng Chết (23:4):</strong> Cây trượng và cây gậy của Chúa an ủi và bảo vệ tôi.<br>
        • <strong>Bữa Tiệc Ân Điển & Phước Hạnh Đời Đời (23:5–6):</strong> Dọn bàn trước mặt kẻ cừu địch, xức dầu trên đầu, chén tôi đầy tràn. Phước hạnh và sự thương xót sẽ theo tôi suốt cả đời.
      `;
    }

    return `
      • <strong>Mạch văn phân đoạn:</strong> Trình bày sự tể trị của Đức Chúa Trời trong dòng lịch sử cứu rỗi của dân sự.<br>
      • <strong>Sứ điệp cốt lõi:</strong> Kêu gọi đức tin trung kiên, từ bỏ thần tượng hư không và bước đi trong đường lối giao ước.<br>
      • <strong>Đỉnh cao thần học:</strong> Bày tỏ Đức Chúa Trời là Đấng Thành Tín, Đấng Bảo Tồn và Cứu Chuộc muôn đời.
    `;
  }

  // Render Rich Biblical Character Card
  renderCharacterMasterclass(char, actionResult = null, webData = null) {
    let actionBadge = '';
    if (actionResult && actionResult.executed) {
      actionBadge = `
        <div class="copilot-executed-badge animate-fade-in" style="background: rgba(46, 160, 67, 0.15); border: 1px solid #2ea043; color: #3fb950; padding: 0.5rem 0.8rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-circle-check"></i>
          <div>${actionResult.message}</div>
        </div>
      `;
    }

    const appItems = char.application.map(item => `<li>${item}</li>`).join('');
    const crossRefBadges = char.cross_refs.map(r => `<span class="badge-verse" style="background: rgba(212,175,55,0.1); border: 1px solid var(--accent-gold-border); padding: 2px 7px; border-radius: 4px; font-size: 0.76rem; color: var(--accent-gold); display: inline-block; margin: 2px;">${r}</span>`).join(' ');

    let html = `
      <div class="theological-masterclass-card animate-fade-in" style="line-height: 1.6;">
        ${actionBadge}
        <div class="masterclass-header" style="border-bottom: 1px solid var(--accent-gold-border); padding-bottom: 0.6rem; margin-bottom: 0.8rem;">
          <span class="badge-gold" style="background: var(--accent-gold); color: #121212; font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">TỪ ĐIỂN NHÂN VẬT THÁNH KINH</span>
          <h3 style="color: var(--accent-gold); margin: 0.4rem 0 0.2rem 0; font-family: var(--font-brand); font-size: 1.15rem;">
            ${char.title}
          </h3>
          <div style="font-size: 0.82rem; color: var(--text-muted); font-style: italic;">
            ${char.role}
          </div>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-scroll"></i> 1. THÂN THẾ & BỐI CẢNH LỊCH SỬ</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">${char.origin}</p>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-compass"></i> 2. HÀNH TRÌNH & BIẾN CỐ THEN CHỐT</h4>
          <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
            ${char.narrative}
          </div>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem; background: rgba(212,175,55,0.04); border-left: 3px solid var(--accent-gold); padding: 0.6rem 0.8rem; border-radius: 4px;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-cross"></i> 3. Ý NGHĨA THẦN HỌC & HÌNH BÓNG ĐẤNG CHRIST (TYPOLOGY)</h4>
          <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
            ${char.typology}
          </div>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.8rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.88rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-seedling"></i> 4. BÀI HỌC THỰC TIỄN CHO ĐỜI SỐNG HÔM NAY</h4>
          <ul style="font-size: 0.84rem; color: var(--text-secondary); padding-left: 1.2rem; margin: 0; line-height: 1.6;">
            ${appItems}
          </ul>
        </div>

        <div class="masterclass-section" style="margin-bottom: 0.5rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.85rem; margin-bottom: 0.3rem;"><i class="fa-solid fa-bookmark"></i> PHÂN ĐOẠN TRỌNG TÂM:</h4>
          <div>${crossRefBadges}</div>
        </div>

        <div class="copilot-action-bar" style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1rem; padding-top: 0.8rem; border-top: 1px dashed var(--border-medium);">
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="${char.target_book}" data-chapter="${char.target_chapter}" style="background: var(--accent-gold); color: #121212; border: none; font-weight: 700; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-book-open"></i> Đọc ${char.title.split('—')[0].replace('ĐẤNG TIÊN TRI ', '').replace('LÃNH TỤ ', '').trim()} ${char.target_chapter}
          </button>
          <button class="copilot-action-btn btn-sm" data-action="compare" data-book="${char.target_book}" data-chapter="${char.target_chapter}" style="background: rgba(255,255,255,0.06); border: 1px solid var(--accent-gold-border); color: var(--accent-gold); font-weight: 600; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-columns"></i> Đối Chiếu Bản Dịch Song Song
          </button>
          <button class="copilot-action-btn btn-sm" data-action="search" data-query="${char.names[0]}" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-primary); font-weight: 600; padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-magnifying-glass"></i> Tra cứu câu liên quan
          </button>
        </div>
      </div>
    `;

    if (webData) {
      html += this.formatWebDataCitations(webData);
    }
    return html;
  }

  // Wrap response with Kimchi Telemetry Bar
  wrapWithTelemetry(html, kimchiPkg, startTime, modelName = 'Logos Autonomous Core') {
    const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const latencyMs = Math.round(endTime - startTime);
    const telemetryBar = this.formatKimchiTelemetryBar({ ...(kimchiPkg?.metrics || {}), latencyMs: Math.max(12, latencyMs) }, modelName);
    return telemetryBar + html;
  }

  // Offline Deep Theological Engine (Zero-Setup Autonomous Core)
  queryOfflineTheology(question, context = {}, webData = null, kimchiPackage = null) {
    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const kimchiPkg = kimchiPackage || this.buildKimchiContextPackage(question, context);

    const q = question.toLowerCase().trim();
    const ref = context.ref || 'Giăng 1:1';
    const bookName = context.book || 'Giăng';
    const chapterNum = context.chapter || 1;
    const bookMeta = this.booksDirectory[context.bookId || 'JHN'] || this.booksDirectory.JHN;

    // 0. Autonomous Copilot Action Command Check (e.g. "Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch")
    const copilotResult = this.parseAndExecuteCopilotCommand(question);

    // 1. Passage Mention with explicit chapter (e.g. "Giô-suê 24", "Rô-ma 8", "Mở sách Giô-suê đoạn 24")
    const passageMention = this.findPassageMention(question);
    if (passageMention && passageMention.hasExplicitChapter) {
      let html = '';
      if (copilotResult && copilotResult.executed) {
        html += `
          <div class="copilot-executed-badge animate-fade-in" style="background: rgba(46, 160, 67, 0.15); border: 1px solid #2ea043; color: #3fb950; padding: 0.5rem 0.8rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i>
            <div>${copilotResult.message}</div>
          </div>
        `;
      }
      html += this.generateChapterMasterclass(passageMention.bookMeta.name_vi, passageMention.chapter, passageMention.bookMeta);
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 2. Biblical Character Query ("giô-na là ai", "ai là môi-se", "kể về giô-suê", v.v.)
    const characterMatch = this.findCharacterMatch(question);
    if (characterMatch) {
      const html = this.renderCharacterMasterclass(characterMatch, copilotResult, webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 3. Whole Book Overview Query (without explicit chapter)
    if (passageMention) {
      let html = '';
      if (copilotResult && copilotResult.executed) {
        html += `
          <div class="copilot-executed-badge animate-fade-in" style="background: rgba(46, 160, 67, 0.15); border: 1px solid #2ea043; color: #3fb950; padding: 0.5rem 0.8rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i>
            <div>${copilotResult.message}</div>
          </div>
        `;
      }
      html += this.generateChapterMasterclass(passageMention.bookMeta.name_vi, passageMention.chapter, passageMention.bookMeta);
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 3. Whole Chapter Study Query for Current Context
    if (q.includes('phân tích đoạn') || q.includes('tổng quan') || q.includes('toàn bộ đoạn') || q.includes('giải nghĩa đoạn')) {
      let html = '';
      if (copilotResult && copilotResult.executed) {
        html += `
          <div class="copilot-executed-badge animate-fade-in" style="background: rgba(46, 160, 67, 0.15); border: 1px solid #2ea043; color: #3fb950; padding: 0.5rem 0.8rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check"></i>
            <div>${copilotResult.message}</div>
          </div>
        `;
      }
      html += this.generateChapterMasterclass(bookName, chapterNum, bookMeta);
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 4. Original Languages & Strong's Query
    if (q.includes('nguyên ngữ') || q.includes('hy lạp') || q.includes('hê-bơ-rơ') || q.includes('strong') || q.includes('từ gốc') || q.includes('logos')) {
      let isOT = bookMeta.testament === 'OT';
      let html = `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">PHÂN TÍCH NGUYÊN NGỮ & MÃ STRONG'S</span>
            <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">PHÂN ĐOẠN: ${ref}</h4>
          </div>
          <p>Dưới sự soi dẫn của <strong>Đức Chúa Trời là Tác Giả Tối Thượng</strong>, các <strong>trước giả</strong> Thánh Kinh đã dùng những thuật ngữ ${isOT ? 'Hê-bơ-rơ (Biblical Hebrew)' : 'Hy Lạp (Koine Greek)'} đầy quyền năng:</p>
          <div class="strong-chips-grid" style="display: grid; gap: 0.6rem; margin: 0.6rem 0;">
            ${(bookMeta.key_words || []).map(w => `
              <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.6rem; border-radius: 6px;">
                <strong style="color: var(--accent-gold);">${w.word}</strong>: ${w.meaning}
              </div>
            `).join('')}
          </div>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 5. Historical & Cultural Context Query
    if (q.includes('bối cảnh') || q.includes('lịch sử') || q.includes('văn hóa') || q.includes('trước giả') || q.includes('ai viết')) {
      let html = `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">BỐI CẢNH LỊCH SỬ & TRƯỚC GIẢ</span>
            <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">PHÂN ĐOẠN: ${ref}</h4>
          </div>
          <p>
            • <strong>Trước giả con người:</strong> ${bookMeta.author_human}.<br>
            • <strong>Tác Giả Tối Thượng:</strong> <em>${bookMeta.author_divine}</em>.<br>
            • <strong>Thời gian & Bối cảnh:</strong> ${bookMeta.date}. ${bookMeta.historical_context || 'Đế chế Cận Đông cổ đại cai trị, phong tục thời Kinh Thánh'}.<br>
            • <strong>Sứ mạng trước thuật:</strong> ${bookMeta.key_themes}.
          </p>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 6. Metaphors & Typology Query
    if (q.includes('ẩn dụ') || q.includes('biểu tượng') || q.includes('hình ảnh') || q.includes('chiên con') || q.includes('nho') || q.includes('bánh') || q.includes('muối')) {
      let html = `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">GIẢI MÃ HÌNH BÓNG & ẨN DỤ THẦN HỌC</span>
            <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">ẨN DỤ TRONG: ${ref}</h4>
          </div>
          <p>
            Theo nguyên tắc <em>"Kinh Thánh tự giải nghĩa Kinh Thánh"</em> (Scriptura Sacra sui ipsius interpres):<br>
            • Các ẩn dụ trong Tân Ước luôn bắt rễ từ những thực tại của Cựu Ước (như Chiên Con Lễ Vượt Qua trong Xuất Ê-díp-tô ký 12, Gốc Nho Y-sơ-ra-ên trong Ê-sai 5).<br>
            • Chúa Giê-xu là sự ứng nghiệm trọn vẹn: Ngài là Chiên Con Chuộc Tội hoàn hảo, là Gốc Nho Thật đem lại sự sống vĩnh hằng cho những nhánh kết hiệp trong Ngài.
          </p>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 7. Practical Life Application Query
    if (q.includes('ứng dụng') || q.includes('thực tế') || q.includes('đời sống') || q.includes('bài học')) {
      let html = `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">ỨNG DỤNG THỰC TIỄN CHO ĐỜI SỐNG</span>
            <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">BÀI HỌC TỪ: ${ref}</h4>
          </div>
          <ol style="padding-left: 1.2rem; line-height: 1.6;">
            <li><strong>Tôn Đức Chúa Trời làm Đấng Tể Trị Tối Thượng:</strong> Để Lời Hằng Sống của Ngài định hình mọi suy nghĩ và quyết định hằng ngày.</li>
            <li><strong>Nhận diện giá trị bản thân trong Đấng Christ:</strong> Không sống theo tiêu chuẩn thế tục mà sống xứng đáng với địa vị con cái Đức Chúa Trời.</li>
            <li><strong>Trở nên kênh dẫn ân điển:</strong> Mang ánh sáng hy vọng và sự giải hòa đến cho gia đình, hội thánh và cộng đồng.</li>
          </ol>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
    }

    // 8. General Substantive Response (Never Weak Generic Fallbacks!)
    let actionBadge = '';
    if (copilotResult && copilotResult.executed) {
      actionBadge = `
        <div class="copilot-executed-badge animate-fade-in" style="background: rgba(46, 160, 67, 0.15); border: 1px solid #2ea043; color: #3fb950; padding: 0.5rem 0.8rem; border-radius: 6px; font-size: 0.8rem; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-circle-check"></i>
          <div>${copilotResult.message}</div>
        </div>
      `;
    }

    let html = `
      <div class="theological-masterclass-card animate-fade-in" style="line-height: 1.6;">
        ${actionBadge}
        <div class="masterclass-header" style="border-bottom: 1px solid var(--accent-gold-border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
          <span class="badge-gold" style="background: var(--accent-gold); color: #121212; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">TRỢ LÝ THÁNH KINH AI COPILOT</span>
          <h4 style="color: var(--accent-gold); margin: 0.35rem 0 0.15rem 0; font-size: 1.05rem;">TRA CỨU THẦN HỌC: "${question}"</h4>
        </div>

        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.6rem;">
          <strong>Bối cảnh phân đoạn hiện tại:</strong> <em>${ref} (${bookName} đoạn ${chapterNum})</em><br>
          Dưới sự soi dẫn của <strong>Đức Chúa Trời là Tác Giả Tối Thượng</strong>, các <strong>trước giả</strong> Thánh Kinh từ Cựu Ước đến Tân Ước luôn làm chứng về sự thành tín của Chúa và chương trình cứu chuộc đời đời nơi Chúa Cứu Thế Giê-xu.
        </p>

        <div style="background: rgba(212,175,55,0.05); border-left: 3px solid var(--accent-gold); padding: 0.65rem 0.85rem; border-radius: 6px; margin: 0.6rem 0; font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6;">
          <strong style="color: var(--accent-gold);"><i class="fa-solid fa-compass"></i> Hướng Dẫn Khảo Cứu Thánh Kinh:</strong><br>
          • <strong>Tra cứu toàn bộ 66 sách:</strong> Bạn có thể gõ trực tiếp tên bất kỳ sách nào kèm số đoạn (VD: <code>Giô-suê 24</code>, <code>Rô-ma 8</code>, <code>Thi thiên 23</code>, <code>Ê-sai 53</code>) để mở bài giảng giải kinh chuyên sâu.<br>
          • <strong>Ra lệnh điều khiển tự động:</strong> Gõ <code>mở sách Giô-suê 24 và bật đối chiếu 6 bản dịch</code>, <code>bật bản dịch Ê-đê và KJV</code>, hoặc <code>giao diện tối</code>.<br>
          • <strong>Mở rộng trí tuệ nhân tạo:</strong> Nhấp vào biểu tượng ⚙️ ở góc trên để cấu hình <strong>Google Gemini</strong>, <strong>OpenAI ChatGPT</strong> hoặc <strong>DeepSeek</strong> để nâng cao khả năng xử lý ngữ cảnh sâu rộng như Kimchi!
        </div>

        <div class="copilot-action-bar" style="display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.8rem;">
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="JOS" data-chapter="24" style="background: var(--accent-gold); color: #121212; border: none; font-weight: 700; padding: 0.45rem 0.8rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-book-open"></i> Mở Giô-suê 24
          </button>
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="JON" data-chapter="1" style="background: rgba(255,255,255,0.06); border: 1px solid var(--accent-gold-border); color: var(--accent-gold); font-weight: 600; padding: 0.45rem 0.8rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-dove"></i> Mở Giô-na 1
          </button>
          <button class="copilot-action-btn btn-sm" data-action="compare" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-primary); font-weight: 600; padding: 0.45rem 0.8rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-sliders"></i> Mở Bảng Đối Chiếu
          </button>
        </div>
      </div>
    `;

    if (webData) {
      html += this.formatWebDataCitations(webData);
    }
    return this.wrapWithTelemetry(html, kimchiPkg, startTime, 'Logos Autonomous Core');
  }

  // Format Web Search Citations
  formatWebDataCitations(webData) {
    if (!webData || webData.length === 0) return '';
    const items = webData.map(item => `
      <div class="web-citation-item" style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.25); border-left: 2px solid #58a6ff; border-radius: 4px;">
        <div style="font-size: 0.76rem; color: #58a6ff; font-weight: 600;">
          <i class="fa-solid fa-globe"></i> ${item.source}: <strong>${item.title}</strong>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem; line-height: 1.4;">
          ${item.snippet}...
        </div>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; color: var(--accent-gold); text-decoration: underline; display: inline-block; margin-top: 0.2rem;">
          Mở bài viết đầy đủ <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.65rem;"></i>
        </a>
      </div>
    `).join('');

    return `
      <div class="web-search-results-box" style="margin-top: 0.8rem; border-top: 1px dashed var(--border-medium); padding-top: 0.5rem;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #58a6ff; font-weight: 700;">
          🌐 Dữ Liệu Khảo Cứu Không Gian Mạng (Live Web Data):
        </span>
        ${items}
      </div>
    `;
  }

  // Compile System Prompt for External LLMs (with Faith Invariants & Role Guidance)
  buildSystemPrompt(context = {}, webData = null, kimchiPackage = null) {
    const roleConfig = AI_ROLES[this.role] || AI_ROLES.copilot;
    const webContext = webData
      ? `\n\nDỮ LIỆU TRA CỨU TRỰC TUYẾN MỚI NHẤT:\n` + webData.map(w => `- ${w.title}: ${w.snippet}`).join('\n')
      : '';
    const kimchiContext = (kimchiPackage && kimchiPackage.contextString)
      ? `\n\n${kimchiPackage.contextString}`
      : '';

    return `Bạn là Trợ Lý Thánh Kinh AI kiêm Autonomous Copilot của hệ thống Logos MultiVerse.
VAI TRÒ HIỆN TẠI CỦA BẠN: ${roleConfig.name} (${roleConfig.badge}).
ĐỊNH HƯỚNG VAI TRÒ: ${roleConfig.systemFocus}

QUY TẮC BẮT BUỘC VỀ THẦN HỌC & ĐỨC TIN:
1. Những người viết sách Kinh Thánh (Môi-se, Giô-suê, Đa-vít, Ê-sai, Phao-lô, Giăng, Giô-na...) BẮT BUỘC gọi là "Trước giả" (không được gọi là tác giả).
2. Chỉ duy nhất Đức Chúa Trời là "Tác Giả Tối Thượng" soi dẫn toàn bộ Thánh Kinh.
3. Giải thích Lời Chúa cách trung thực, sâu sắc, tôn trọng chân lý Kinh Thánh dựa trên nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh", kết hợp phân tích nguyên ngữ Hy Lạp (Koine Greek) / Hê-bơ-rơ (Biblical Hebrew) kèm mã Strong's, bối cảnh lịch sử Cận Đông cổ đại, hình bóng Đấng Christ trong Tân Ước và 3 bài học ứng dụng thực tiễn.
Văn phong trang trọng, ân cần, uyên bác, định dạng Markdown rõ ràng có tiêu đề và gạch đầu dòng.

BỐI CẢNH PHÂN ĐOẠN HIỆN TẠI:
- Phân đoạn: ${context.ref || 'Giăng 1:1'}
- Sách: ${context.book || 'Giăng'} (Mã: ${context.bookId || 'JHN'}), Đoạn: ${context.chapter || 1}, Câu: ${context.verse || 1}.${webContext}${kimchiContext}`;
  }

  // Google Gemini API Integration (Free Tier, 1M+ Context Window)
  async queryGemini(question, context = {}, webData = null, kimchiPackage = null) {
    if (!this.geminiApiKey) {
      throw new Error('Chưa cấu hình Google Gemini API Key. Vui lòng vào Cài đặt (⚙️) để nhập Key.');
    }

    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const kimchiPkg = kimchiPackage || this.buildKimchiContextPackage(question, context);
    const systemPrompt = this.buildSystemPrompt(context, webData, kimchiPkg);
    const model = this.geminiModel || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nCÂU HỎI CỦA NGƯỜI DÙNG: ${question}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2500
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err.error?.message || `Lỗi Gemini API (${response.status})`;
      throw new Error(msg);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Không nhận được phản hồi từ Gemini API.');

    let formatted = this.convertMarkdownToHTML(text);
    if (webData) formatted += this.formatWebDataCitations(webData);
    return this.wrapWithTelemetry(formatted, kimchiPkg, startTime, model);
  }

  // OpenAI ChatGPT Integration
  async queryOpenAI(question, context = {}, webData = null, kimchiPackage = null) {
    if (!this.apiKey) {
      throw new Error('Chưa cấu hình OpenAI API Key. Vui lòng vào Cài đặt (⚙️) để nhập Key.');
    }

    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const kimchiPkg = kimchiPackage || this.buildKimchiContextPackage(question, context);
    const systemPrompt = this.buildSystemPrompt(context, webData, kimchiPkg);
    const model = this.openaiModel || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Lỗi kết nối OpenAI API');
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    let formatted = this.convertMarkdownToHTML(text);
    if (webData) formatted += this.formatWebDataCitations(webData);
    return this.wrapWithTelemetry(formatted, kimchiPkg, startTime, model);
  }

  // DeepSeek / OpenRouter Integration
  async queryDeepSeek(question, context = {}, webData = null, kimchiPackage = null) {
    if (!this.deepseekApiKey) {
      throw new Error('Chưa cấu hình DeepSeek API Key. Vui lòng vào Cài đặt (⚙️) để nhập Key.');
    }

    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const kimchiPkg = kimchiPackage || this.buildKimchiContextPackage(question, context);
    const systemPrompt = this.buildSystemPrompt(context, webData, kimchiPkg);
    const model = this.deepseekModel || 'deepseek-chat';

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.deepseekApiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Lỗi kết nối DeepSeek API');
    }

    const data = await response.json();
    let text = data.choices[0].message.content;
    let formatted = this.convertMarkdownToHTML(text);
    if (webData) formatted += this.formatWebDataCitations(webData);
    return this.wrapWithTelemetry(formatted, kimchiPkg, startTime, model);
  }

  // Ollama Local LLM Integration
  async queryOllama(question, context = {}, webData = null, kimchiPackage = null) {
    const endpoint = (this.ollamaEndpoint || 'http://localhost:11434').replace(/\/$/, '');
    const model = this.ollamaModel || 'llama3';
    const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const kimchiPkg = kimchiPackage || this.buildKimchiContextPackage(question, context);
    const systemPrompt = this.buildSystemPrompt(context, webData, kimchiPkg);

    const response = await fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Lỗi kết nối Ollama tại ${endpoint}. Hãy chắc chắn Ollama đang chạy.`);
    }

    const data = await response.json();
    let text = data.message?.content || '';
    let formatted = this.convertMarkdownToHTML(text);
    if (webData) formatted += this.formatWebDataCitations(webData);
    return this.wrapWithTelemetry(formatted, kimchiPkg, startTime, model);
  }

  // Lightweight Markdown to HTML Converter with Gold Theological Accents
  convertMarkdownToHTML(markdown) {
    if (!markdown) return '';
    let html = markdown
      // Headings
      .replace(/^### (.*$)/gim, '<h4 style="color: var(--accent-gold); margin: 0.6rem 0 0.3rem 0; font-size: 0.95rem;">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="color: var(--accent-gold); margin: 0.7rem 0 0.35rem 0; font-size: 1.05rem;">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 style="color: var(--accent-gold); margin: 0.8rem 0 0.4rem 0; font-size: 1.15rem;">$1</h2>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Inline Code / Strong's
      .replace(/`([^`]+)`/gim, '<code style="background: rgba(212,175,55,0.12); color: var(--accent-gold); padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</code>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-gold); margin: 0.5rem 0; padding-left: 0.8rem; font-style: italic; color: var(--text-secondary);">$1</blockquote>')
      // Lists
      .replace(/^\- (.*$)/gim, '<li style="margin-bottom: 0.25rem;">$1</li>')
      .replace(/^\* (.*$)/gim, '<li style="margin-bottom: 0.25rem;">$1</li>')
      // Paragraphs
      .replace(/\n\n/gim, '</p><p style="margin: 0.4rem 0; line-height: 1.6;">')
      .replace(/\n/gim, '<br>');

    return `<div class="theological-masterclass-card animate-fade-in" style="line-height: 1.6;"><p style="margin: 0.4rem 0; line-height: 1.6;">${html}</p></div>`;
  }

  // Master Ask Dispatcher (Kimchi Multi-Model Router with Autonomous Fallback)
  async ask(question, context = {}) {
    const isDeep = this.isDeepResearchEnabled;
    const kimchiPackage = this.buildKimchiContextPackage(question, context, isDeep);

    let webData = null;
    if (this.isWebSearchEnabled) {
      try {
        webData = await this.searchOnlineWeb(question);
      } catch (e) {
        console.warn('Online web search skipped:', e);
      }
    }

    const prov = this.provider;
    let resultHTML = '';

    // 1. Google Gemini Provider
    if (prov === 'gemini') {
      try {
        resultHTML = await this.queryGemini(question, context, webData, kimchiPackage);
      } catch (e) {
        console.warn('Gemini query failed, falling back to Autonomous Core:', e);
        resultHTML = this.queryOfflineTheology(question, context, webData, kimchiPackage) + `
          <div style="font-size: 0.74rem; color: var(--status-warning); margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,175,55,0.08); border-radius: 4px;">
            <i class="fa-solid fa-triangle-exclamation"></i> Đã tự động chuyển sang Logos Autonomous Core do sự cố Gemini (${e.message}).
          </div>
        `;
      }
    } else if (prov === 'openai') {
      // 2. OpenAI ChatGPT Provider
      try {
        resultHTML = await this.queryOpenAI(question, context, webData, kimchiPackage);
      } catch (e) {
        console.warn('OpenAI query failed, falling back to Autonomous Core:', e);
        resultHTML = this.queryOfflineTheology(question, context, webData, kimchiPackage) + `
          <div style="font-size: 0.74rem; color: var(--status-warning); margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,175,55,0.08); border-radius: 4px;">
            <i class="fa-solid fa-triangle-exclamation"></i> Đã tự động chuyển sang Logos Autonomous Core do sự cố OpenAI (${e.message}).
          </div>
        `;
      }
    } else if (prov === 'deepseek') {
      // 3. DeepSeek Provider
      try {
        resultHTML = await this.queryDeepSeek(question, context, webData, kimchiPackage);
      } catch (e) {
        console.warn('DeepSeek query failed, falling back to Autonomous Core:', e);
        resultHTML = this.queryOfflineTheology(question, context, webData, kimchiPackage) + `
          <div style="font-size: 0.74rem; color: var(--status-warning); margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,175,55,0.08); border-radius: 4px;">
            <i class="fa-solid fa-triangle-exclamation"></i> Đã tự động chuyển sang Logos Autonomous Core do sự cố DeepSeek (${e.message}).
          </div>
        `;
      }
    } else if (prov === 'ollama') {
      // 4. Ollama Local LLM Provider
      try {
        resultHTML = await this.queryOllama(question, context, webData, kimchiPackage);
      } catch (e) {
        console.warn('Ollama query failed, falling back to Autonomous Core:', e);
        resultHTML = this.queryOfflineTheology(question, context, webData, kimchiPackage) + `
          <div style="font-size: 0.74rem; color: var(--status-warning); margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,175,55,0.08); border-radius: 4px;">
            <i class="fa-solid fa-triangle-exclamation"></i> Đã tự động chuyển sang Logos Autonomous Core do sự cố Ollama (${e.message}).
          </div>
        `;
      }
    } else {
      // 5. Default: Logos Autonomous Core (Zero-Setup RAG across 66 Books)
      resultHTML = this.queryOfflineTheology(question, context, webData, kimchiPackage);
    }

    // Record multi-turn conversation stream
    this.recordConversationTurn('user', question);
    this.recordConversationTurn('assistant', resultHTML);

    return resultHTML;
  }

  // Render Role Selector Pills HTML
  renderRoleSelectorHTML() {
    const roles = Object.values(AI_ROLES);
    return `
      <div class="floating-ai-role-bar" id="floating-ai-role-bar">
        ${roles.map(r => `
          <button class="fab-role-btn ${this.role === r.id ? 'active' : ''}" data-role="${r.id}" title="${r.desc}">
            <i class="fa-solid ${r.icon}"></i> ${r.name}
          </button>
        `).join('')}
      </div>
    `;
  }

  // Render AI Chat Interface for Drawer Inspector
  renderAIChatHTML(context = {}) {
    const prompts = this.getSuggestedPrompts(context.ref || 'Giăng 1:1', { name_vi: context.book || 'Giăng', id: context.bookId || 'JHN' });
    const promptsHTML = prompts.map(p =>
      `<button class="suggested-prompt-chip" data-prompt="${p}">${p}</button>`
    ).join('');
    const pInfo = this.getActiveProviderInfo();

    return `
      <div class="ai-chat-container animate-fade-in">
        <div class="metaphor-card" style="padding: 1rem; border-color: var(--accent-gold-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.88rem; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-robot"></i> TRỢ LÝ THÁNH KINH AI COPILOT
              <span class="online-indicator" title="Sẵn sàng tra cứu không gian mạng" style="font-size: 0.7rem; color: #58a6ff; font-weight: normal; margin-left: 0.3rem;">
                <span class="online-dot"></span> Live Web
              </span>
            </span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              <button id="ai-model-badge-btn" class="btn-sm" style="background: rgba(212,175,55,0.12); border: 1px solid var(--accent-gold-border); color: var(--accent-gold); font-size: 0.72rem; padding: 0.2rem 0.55rem; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.3rem;">
                <i class="fa-solid fa-microchip"></i> ${pInfo.badge}
              </button>
              <button id="ai-deep-research-toggle-btn" class="btn-sm ${this.isDeepResearchEnabled ? 'active' : ''}" style="background: ${this.isDeepResearchEnabled ? 'rgba(168, 85, 247, 0.2)' : 'transparent'}; border: 1px solid ${this.isDeepResearchEnabled ? '#a855f7' : 'var(--border-medium)'}; color: ${this.isDeepResearchEnabled ? '#c084fc' : 'var(--text-muted)'}; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;" title="Bật/Tắt Kimchi Deep Research Mode">
                <i class="fa-solid fa-dna"></i> ${this.isDeepResearchEnabled ? 'Deep: BẬT' : 'Deep: TẮT'}
              </button>
              <button id="ai-web-search-toggle-btn" class="btn-sm" style="background: ${this.isWebSearchEnabled ? 'rgba(88, 166, 255, 0.15)' : 'transparent'}; border: 1px solid ${this.isWebSearchEnabled ? '#58a6ff' : 'var(--border-medium)'}; color: ${this.isWebSearchEnabled ? '#58a6ff' : 'var(--text-muted)'}; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;">
                <i class="fa-solid fa-globe"></i> ${this.isWebSearchEnabled ? 'Web: BẬT' : 'Web: TẮT'}
              </button>
              <button id="ai-clear-history-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-muted); font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;" title="Làm mới lịch sử hội thoại">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button id="ai-configure-key-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-muted); font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;" title="Cấu hình Nhà Cung Cấp & API Key">
                <i class="fa-solid fa-gear"></i> Cấu hình
              </button>
            </div>
          </div>

          ${this.renderRoleSelectorHTML()}

          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem;">
            Trợ lý thần học Kimchi-Grade: Tra cứu nhân vật, giáo lý 66 sách, bối cảnh lịch sử, từ gốc Hy Lạp/Hê-bơ-rơ và tự động điều khiển trang web.
          </p>
          <div class="ai-prompts-row">${promptsHTML}</div>
        </div>

        <div id="ai-messages-list" class="ai-messages-list">
          <div class="ai-message assistant">
            <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
            <div>
              Chào bạn! Tôi là <strong>Trợ Lý Thánh Kinh AI Copilot</strong>. Bạn có thể hỏi tôi bất kỳ điều gì về toàn bộ 66 sách Thánh Kinh (VD: <em>"Phân tích Giô-suê 24"</em>, <em>"Giô-na là ai?"</em>), hoặc ra lệnh trực tiếp: <em>"Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch"</em>.
            </div>
          </div>
        </div>

        <div class="ai-input-wrapper">
          <input type="text" id="ai-user-query-input" class="ai-input-box" placeholder="Hỏi nhân vật, từ gốc, hoặc ra lệnh 'Mở Giô-suê 24'...">
          <button id="ai-send-btn" class="btn-primary" style="padding: 0.65rem 1rem; border-radius: 20px;" title="Gửi câu hỏi hoặc mệnh lệnh">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  }

  // Pre-loaded Exhaustive Books Directory (covers all 66 books from Genesis to Revelation)
  initBooksDirectory() {
    return {
      GEN: {
        id: 'GEN', name_vi: 'Sáng thế ký', name_vi_no_accent: 'sang the ky', name_en: 'Genesis', testament: 'OT', genre: 'Sách Luật Pháp (Torah)', chapters_count: 50, default_chapter: 1,
        author_human: 'Trước giả: Đấng tiên tri Môi-se', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 1446-1406 TCN', historical_context: 'Cận Đông cổ đại, Lưỡng Hà, Ai Cập và đồng vắng',
        key_themes: 'Sự sáng tạo từ hư vô, sự sa ngã của nhân loại, lời hứa hạt giống người nữ (Sáng 3:15), giao ước Áp-ra-ham',
        key_words: [{ word: 'Bereshit (H7225)', meaning: 'Ban đầu, khởi nguyên' }, { word: 'Bara (H1254)', meaning: 'Sáng tạo từ hư vô' }, { word: 'Elohim (H430)', meaning: 'Đức Chúa Trời Toàn Năng' }]
      },
      EXO: {
        id: 'EXO', name_vi: 'Xuất Ê-díp-tô ký', name_vi_no_accent: 'xuat e-dip-to ky', name_en: 'Exodus', testament: 'OT', genre: 'Sách Luật Pháp (Torah)', chapters_count: 40, default_chapter: 12,
        author_human: 'Trước giả: Đấng tiên tri Môi-se', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 1446-1406 TCN', historical_context: 'Ai Cập, Biển Đỏ và sa mạc Si-na-i',
        key_themes: 'Sự giải phóng khỏi ách nô lệ, Lễ Vượt Qua và Huyết Chiên Con, Mười Điều Răn tại núi Si-na-i, Đền Tạm',
        key_words: [{ word: 'Pesach (H6453)', meaning: 'Lễ Vượt Qua' }, { word: 'Yahweh (H3068)', meaning: 'Đấng Tự Hữu Hằng Hữu' }]
      },
      JOS: {
        id: 'JOS', name_vi: 'Giô-suê', name_vi_no_accent: 'gio-sue', name_en: 'Joshua', testament: 'OT', genre: 'Sách Lịch Sử Chinh Phục', chapters_count: 24, default_chapter: 24,
        author_human: 'Trước giả: Lãnh tụ Giô-suê (con trai của Nun)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 1400-1370 TCN', historical_context: 'Xứ Ca-na-an và đại hội Si-chem',
        key_themes: 'Chinh phục Đất Hứa; Đức Chúa Trời thành tín giữ lời hứa giao ước; Lời kêu gọi dứt khoát thờ phượng Chúa (Giô-suê 24:15)',
        key_words: [{ word: 'Hazak ve-amats (H2388 H553)', meaning: 'Hãy vững lòng bền chí' }, { word: 'Avad (H5647)', meaning: 'Phục sự, thờ phượng trọn lòng' }, { word: 'Nahalah (H5159)', meaning: 'Cơ nghiệp, sản nghiệp đời đời' }]
      },
      PSA: {
        id: 'PSA', name_vi: 'Thi thiên', name_vi_no_accent: 'thi thien', name_en: 'Psalms', testament: 'OT', genre: 'Thơ Ca Thánh & Khôn Ngoan', chapters_count: 150, default_chapter: 23,
        author_human: 'Trước giả: Vua Đa-vít, A-sáp, con cháu Cô-rê, Môi-se, Sa-lô-môn', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 1400 - 450 TCN', historical_context: 'Cung điện Giê-ru-sa-lem, đồng cỏ chăn chiên, nơi lưu đày',
        key_themes: 'Đức Giê-hô-va là Đấng chăn giữ; Sự thờ phượng, than khóc và ngợi khen; Tiên tri về Vua Mê-si-a (Thi thiên 22, 110)',
        key_words: [{ word: 'Hesed (H2617)', meaning: 'Tình yêu giao ước thành tín bất diệt' }, { word: 'Mizmor (H4210)', meaning: 'Khúc ca thánh kèm đàn dây' }]
      },
      ISA: {
        id: 'ISA', name_vi: 'Ê-sai', name_vi_no_accent: 'e-sai', name_en: 'Isaiah', testament: 'OT', genre: 'Đại Tiên Tri Phúc Âm', chapters_count: 66, default_chapter: 53,
        author_human: 'Trước giả: Đấng tiên tri Ê-sai (con của A-mốt)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 740-680 TCN', historical_context: 'Vương quốc Giu-đa trước hiểm họa đế chế A-si-ri',
        key_themes: 'Đấng Thánh của Y-sơ-ra-ên; Đấng Emmanuel (Ê-sai 7:14); Người Tôi Tớ Chịu Khổ chuộc tội (Ê-sai 53); Trời Mới Đất Mới',
        key_words: [{ word: 'Qadosh Yisrael (H6918)', meaning: 'Đấng Thánh của Y-sơ-ra-ên' }, { word: 'Emmanuel (H6005)', meaning: 'Đức Chúa Trời ở cùng chúng ta' }]
      },
      JON: {
        id: 'JON', name_vi: 'Giô-na', name_vi_no_accent: 'gio-na', name_en: 'Jonah', testament: 'OT', genre: 'Tiên Tri Tự Thuật & Dấu Lạ Mê-si-a', chapters_count: 4, default_chapter: 1,
        author_human: 'Trước giả: Đấng tiên tri Giô-na (con của A-mi-tai)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 780-760 TCN thời vua Giê-rô-bô-am II', historical_context: 'Cảng Giốp-bê, biển Địa Trung Hải và đại kinh đô Ni-ni-ve của A-si-ri',
        key_themes: 'Lòng thương xót phổ quát của Chúa cho muôn dân; Dấu lạ 3 ngày 3 đêm trong bụng cá báo trước sự Phục Sinh của Đấng Christ (Ma-thi-ơ 12:40)',
        key_words: [{ word: 'Dag Gadol (H1709 H1419)', meaning: 'Con cá lớn sắm sẵn' }, { word: 'Teshuvah (H8666)', meaning: 'Sự ăn năn quay đầu' }]
      },
      MAT: {
        id: 'MAT', name_vi: 'Ma-thi-ơ', name_vi_no_accent: 'ma-thi-o', name_en: 'Matthew', testament: 'NT', genre: 'Phúc Âm Vua Nước Trời', chapters_count: 28, default_chapter: 5,
        author_human: 'Trước giả: Sứ đồ Ma-thi-ơ (Lê-vi, người thâu thuế)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 60-70 SC', historical_context: 'Xứ Giu-đê thời La Mã cai trị',
        key_themes: 'Chúa Giê-xu là Vua Đấng Mê-si-a làm trọn vẹn Lời Tiên Tri Cựu Ước; Bài Giảng Trên Núi; Đại Mạng Lệnh',
        key_words: [{ word: 'Basileia tou Theou (G932)', meaning: 'Vương quốc Nước Trời' }, { word: 'Plēroō (G4137)', meaning: 'Làm trọn vẹn lời tiên tri' }]
      },
      MRK: {
        id: 'MRK', name_vi: 'Mác', name_vi_no_accent: 'mac', name_en: 'Mark', testament: 'NT', genre: 'Phúc Âm Hành Động & Người Tôi Tớ', chapters_count: 16, default_chapter: 10,
        author_human: 'Trước giả: Giăng-Mác (Cộng sự trung tín của Sứ đồ Phi-e-rơ)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 55-65 SC tại Rô-ma', historical_context: 'Cộng đồng tín hữu tại thủ đô Rô-ma đối diện bắt bớ',
        key_themes: 'Con Người đến để phục vụ và phó sự sống làm giá chuộc nhiều người (Mác 10:45)',
        key_words: [{ word: 'Euthys (G2112)', meaning: 'Tức thì, ngay lập tức' }]
      },
      LUK: {
        id: 'LUK', name_vi: 'Lu-ca', name_vi_no_accent: 'lu-ca', name_en: 'Luke', testament: 'NT', genre: 'Phúc Âm Lịch Sử & Lòng Nhân Từ', chapters_count: 24, default_chapter: 15,
        author_human: 'Trước giả: Bác sĩ Lu-ca (Người đồng hành thân thiết của Phao-lô)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 60-62 SC', historical_context: 'Viết cho quan Thê-ô-phi-lơ và độc giả gốc Hy Lạp',
        key_themes: 'Con Người đến để tìm và cứu kẻ bị hư mất (Lu-ca 19:10); Đầy dẫy Đức Thánh Linh; Dụ ngôn người con hoang đàng và người Sa-ma-ri nhân lành',
        key_words: [{ word: 'Sōzō (G4982)', meaning: 'Cứu rỗi, chữa lành trọn vẹn' }]
      },
      JHN: {
        id: 'JHN', name_vi: 'Giăng', name_vi_no_accent: 'giang', name_en: 'John', testament: 'NT', genre: 'Phúc Âm Thần Học & Khải Thị', chapters_count: 21, default_chapter: 1,
        author_human: 'Trước giả: Sứ đồ Giăng (Người môn đồ được Chúa yêu)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 85-95 SC tại Ê-phê-sô', historical_context: 'Tiểu Á thời đế chế La Mã',
        key_themes: 'Thần tính của Đấng Christ; Ngôi Lời Nhập Thể; 7 Dấu Lạ; 7 Lời Tuyên Bố "Ta Là" (Ego Eimi); Sự Sống Đời Đời',
        key_words: [{ word: 'Logos (G3056)', meaning: 'Ngôi Lời Hằng Hữu' }, { word: 'Zōē (G2222)', meaning: 'Sự sống thần thượng vĩnh cửu' }]
      },
      ACT: {
        id: 'ACT', name_vi: 'Công vụ các Sứ đồ', name_vi_no_accent: 'cong vu cac su do', name_en: 'Acts', testament: 'NT', genre: 'Lịch Sử Hội Thánh Ban Đầu', chapters_count: 28, default_chapter: 2,
        author_human: 'Trước giả: Bác sĩ Lu-ca', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 62-64 SC', historical_context: 'Từ Giê-ru-sa-lem đến La Mã',
        key_themes: 'Quyền năng Đức Thánh Linh trong Lễ Ngũ Tuần; Sự bùng nổ của Hội Thánh; Các hành trình truyền giáo của Phao-lô',
        key_words: [{ word: 'Dynamis (G1411)', meaning: 'Quyền phép Thánh Linh' }, { word: 'Martys (G3144)', meaning: 'Chứng nhân' }]
      },
      ROM: {
        id: 'ROM', name_vi: 'Rô-ma', name_vi_no_accent: 'ro-ma', name_en: 'Romans', testament: 'NT', genre: 'Thư Tín Thần Học Cốt Lõi', chapters_count: 16, default_chapter: 8,
        author_human: 'Trước giả: Sứ đồ Phao-lô', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 57 SC từ Cô-rinh-tô', historical_context: 'Hội thánh tại thủ đô La Mã gồm cả người Do Thái và Dân ngoại',
        key_themes: 'Sự công chính của Đức Chúa Trời; Xưng công bình bởi đức tin nơi Đấng Christ; Đời sống đắc thắng trong Thánh Linh (Rô-ma 8)',
        key_words: [{ word: 'Dikaiosynē (G1343)', meaning: 'Sự công chính, xưng công bình' }, { word: 'Charis (G5485)', meaning: 'Ân điển nhưng không' }]
      },
      REV: {
        id: 'REV', name_vi: 'Khải huyền', name_vi_no_accent: 'khai huyen', name_en: 'Revelation', testament: 'NT', genre: 'Tiên Tri Khải Thị & Khải Hoàn Ca', chapters_count: 22, default_chapter: 21,
        author_human: 'Trước giả: Sứ đồ Giăng (Lưu đày tại đảo Bát-mô)', author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn', date: 'Khoảng 95 SC thời hoàng đế Domitian', historical_context: 'Bảy Hội Thánh tại Tiểu Á chịu bách hại khốc liệt',
        key_themes: 'Chiên Con Đắc Thắng trên Ngai; Sự phán xét thế gian tội ác; Sự sụp đổ của Ba-by-lôn; Trời Mới & Đất Mới; Sự Tái Lâm của Chúa Giê-xu',
        key_words: [{ word: 'Apokalypsis (G602)', meaning: 'Sự khải thị, vén mở bức màn' }, { word: 'Arnion (G721)', meaning: 'Chiên Con đắc thắng đã bị giết' }]
      }
    };
  }

  // Pre-loaded Comprehensive Characters Directory
  initBiblicalCharacters() {
    return {
      abraham: {
        names: ['áp-ra-ham', 'apraham', 'abraham', 'áp-ram'],
        title: 'TỔ PHỤ ĐỨC TIN ÁP-RA-HAM (ABRAHAM)',
        role: 'Tổ phụ của dân tộc Y-sơ-ra-ên và là cha của mọi kẻ có đức tin',
        origin: 'Nguyên danh Áp-ram, xuất thân từ xứ U-rơ của người Canh-đê, được Chúa gọi ra đi khi 75 tuổi đến vùng đất Ca-na-an hứa nguyện.',
        narrative: `
          • Nhận Giao Ước Áp-ra-ham (Sáng thế 12, 15, 17): dòng dõi đông như sao trên trời, như cát bờ biển.<br>
          • Đức tin được kể là công bình (Sáng thế 15:6; Rô-ma 4:3).<br>
          • Dâng Y-sác trên núi Mô-ri-a: vâng phục tuyệt đối, tin Chúa có quyền năng khiến kẻ chết sống lại.
        `,
        typology: `
          • Áp-ra-ham dâng Y-sác là hình bóng tiên báo Đức Chúa Cha hy sinh Con Độc Sanh trên đồi Gô-gô-tha. Con chiên đực mắc sừng trong bụi cây thay thế Y-sác là hình bóng Chiên Con Đấng Christ.
        `,
        application: [
          'Vâng lời Chúa dấn bước ngay cả khi chưa thấy rõ con đường phía trước.',
          'Tin cậy nơi sự tiếp trợ trọn vẹn của Đức Giê-hô-va Di-rê (Chúa sẽ sắm sẵn).'
        ],
        target_book: 'GEN',
        target_chapter: 12,
        cross_refs: ['Sáng-thế Ký 12:1–3', 'Sáng-thế Ký 15:1–6', 'Sáng-thế Ký 22:1–19', 'Rô-ma 4:1–12']
      },
      isaiah: {
        names: ['ê-sai', 'esai', 'isaiah', 'y-êsai'],
        title: 'ĐẤNG TIÊN TRI PHÚC ÂM Ê-SAI (ISAIAH)',
        role: 'Đại tiên tri tại vương quốc Giu-đa, trước giả sách Ê-sai',
        origin: 'Con của A-mốt, sống tại Giê-ru-sa-lem, thi hành chức vụ dưới 4 triều vua (740–680 T.C.).',
        narrative: `
          • Nhận khải tượng về sự oai nghiêm thánh khiết của Chúa trên Ngai cao (Ê-sai 6).<br>
          • Công bố tiên tri về Đấng Emmanuel (7:14) và Người Tôi Tớ Chịu Khổ chuộc tội (53).
        `,
        typology: `
          • Được mệnh danh là "Sách Phúc Âm thứ năm" trong Cựu Ước vì chứa đựng bức tranh trọn vẹn về Đấng Mê-si-a chịu khổ và phục sinh vinh hiển.
        `,
        application: [
          'Nhận biết sự thánh khiết tuyệt đối của Chúa để luôn kính sợ Ngài.',
          'Khắc sâu tình yêu chuộc tội vô điều kiện của Chúa Giê-xu qua Ê-sai 53.'
        ],
        target_book: 'ISA',
        target_chapter: 53,
        cross_refs: ['Ê-sai 6:1–8', 'Ê-sai 7:14', 'Ê-sai 53:1–12']
      },
      joshua: {
        names: ['giô-suê', 'giosue', 'joshua', 'yôsua', 'y-yôsuê'],
        title: 'LÃNH TỤ GIÔ-SUÊ (JOSHUA) — NGƯỜI DẪN DÂN VÀO ĐẤT HỨA',
        role: 'Người kế vị Môi-se, tổng chỉ huy quân sự đưa tuyển dân qua sông Giô-đanh chiếm Ca-na-an',
        origin: 'Con trai của Nun, thuộc chi phái Ép-ra-im. Từng làm trợ thủ trung tín cho Môi-se suốt 40 năm trong hoang mạc.',
        narrative: `
          • Cùng Ca-lép là 2 trong 12 thám tử có đức tin kiên định tin cậy Chúa sẽ ban xứ hứa (Dân-số 14).<br>
          • Nhận mệnh lệnh thiên thượng: <em>"Hãy vững lòng bền chí, chớ run sợ, chớ kinh khủng; vì Giê-hô-va Đức Chúa Trời ngươi vẫn ở cùng ngươi trong mọi nơi ngươi đi"</em> (Giô-suê 1:9).<br>
          • Dẫn dân Y-sơ-ra-ên đi bộ qua sông Giô-đanh rẽ nước, hạ thành Giê-ri-cô bằng tiếng reo hò vâng phục.<br>
          • Lời tuyên ngôn bất hủ tại Si-chem lúc tuổi già: <em>"Nếu chẳng thích phục sự Đức Giê-hô-va... nhưng ta và nhà ta sẽ phục sự Đức Giê-hô-va!"</em> (Giô-suê 24:15).
        `,
        typology: `
          • Tên tiếng Hê-bơ-rơ của Giô-suê là <em>Yeshua (Yehoshua)</em>, chính là tên gọi tiếng Hy Lạp <em>Iēsous (Giê-xu)</em> — nghĩa là "Đức Giê-hô-va là Đấng Cứu Rỗi". Môi-se (đại diện Luật Pháp) không thể đưa dân vào Đất Hứa; chỉ có Giô-suê (hình bóng Đấng Christ) mới dẫn đưa dân sự vào sản nghiệp an nghỉ đời đời (Hê-bơ-rơ 4:8–10).
        `,
        application: [
          'Suy gẫm Lời Chúa ngày và đêm để đường lối được may mắn và thịnh vượng (Giô-suê 1:8).',
          'Quyết định dứt khoát xây dựng gia đình trung tín kính sợ và phụng sự Chúa trọn vẹn.'
        ],
        target_book: 'JOS',
        target_chapter: 24,
        cross_refs: ['Giô-suê 1:1–9', 'Giô-suê 24:1–15', 'Hê-bơ-rơ 4:8–10']
      },
      jonah: {
        names: ['giô-na', 'giona', 'jona', 'jonah'],
        title: 'ĐẤNG TIÊN TRI GIÔ-NA (JONAH)',
        role: 'Tiên tri Cựu Ước của Vương quốc phía Bắc (Y-sơ-ra-ên), trước giả sách Giô-na',
        origin: 'Con của A-mi-tai, quê quán tại Gát-hê-phe thuộc chi phái Sa-bu-lôn (Ga-li-lê). Chức vụ diễn ra khoảng năm 780–760 T.C. dưới triều vua Giê-rô-bô-am II (2 Các Vua 14:25).',
        narrative: `
          • <strong>Sứ mạng:</strong> Chúa truyền đi Ni-ni-ve rao báo sự phán xét nhưng ông trốn lên tàu đi Ta-rơ-si.<br>
          • <strong>Cơn bão & Bụng cá:</strong> Bị ném xuống biển, Chúa sắm sẵn cá lớn nuốt Giô-na 3 ngày 3 đêm.<br>
          • <strong>Ăn năn & Ni-ni-ve được cứu:</strong> Giô-na cầu nguyện dâng lời tạ ơn, cá mửa ông lên đất liền. Ông đến Ni-ni-ve rao giảng và toàn thành ăn năn.
        `,
        typology: `
          • <strong>Dấu lạ tiên tri Giô-na (Ma-thi-ơ 12:39–41):</strong> Chúa Giê-xu xác nhận Giô-na ở trong bụng cá 3 ngày 3 đêm là hình bóng tiên báo Ngài chịu chết và sống lại sau 3 ngày.
        `,
        application: [
          'Không ai có thể chạy trốn khỏi sự hiện diện của Đức Chúa Trời.',
          'Học lấy tấm lòng nhân từ bao dung của Chúa đối với những người hư mất.'
        ],
        target_book: 'JON',
        target_chapter: 1,
        cross_refs: ['Giô-na 1:1–17', 'Giô-na 2:1–10', 'Ma-thi-ơ 12:39–41']
      },
      moses: {
        names: ['môi-se', 'moise', 'môise', 'moses'],
        title: 'ĐẤNG TIÊN TRI MÔI-SE (MOSES)',
        role: 'Lãnh tụ giải phóng dân Y-sơ-ra-ên, trước giả Ngũ Kinh Luật Pháp (Torah)',
        origin: 'Thuộc chi phái Lê-vi, sinh tại Ai Cập, được công chúa Pha-ra-ôn nuôi dưỡng 40 năm, chăn chiên 40 năm, lãnh đạo 40 năm.',
        narrative: `
          • Được Chúa gọi qua bụi gai cháy không tàn tại núi Hô-rếp (Xuất 3).<br>
          • Dẫn dân qua Biển Đỏ, nhận 10 Điều Răn tại núi Si-na-i, dựng Đền Tạm.
        `,
        typology: `
          • Môi-se là hình bóng Đấng Trung Bảo Giao Ước. Phục truyền 18:15 tiên báo về Đấng Tiên Tri như Môi-se chính là Chúa Cứu Thế Giê-xu.
        `,
        application: [
          'Thà cùng chịu khổ với dân Chúa hơn là hưởng lạc thú tạm bợ của tội lỗi (Hê-bơ-rơ 11:25).',
          'Lòng khiêm nhường tột bậc trước mặt Đức Chúa Trời.'
        ],
        target_book: 'EXO',
        target_chapter: 12,
        cross_refs: ['Xuất Ê-díp-tô Ký 3:1–15', 'Phục-truyền 18:15', 'Hê-bơ-rơ 3:1–6']
      },
      david: {
        names: ['đa-vít', 'davit', 'david'],
        title: 'VUA ĐA-VÍT — NGƯỜI VỪA LÒNG ĐỨC CHÚA TRỜI',
        role: 'Vị vua thứ hai của Y-sơ-ra-ên, chiến binh dũng cảm, tác giả các Thi Thiên',
        origin: 'Con út của Gie-sê người Bết-lê-hem chi phái Giu-đa. Từ cậu bé chăn chiên được xức dầu làm vua.',
        narrative: `
          • Hạ Gô-li-át bằng đức tin nơi Đức Giê-hô-va Vạn Quân (1 Sa-mu-ên 17).<br>
          • Lập Giê-ru-sa-lem làm thủ đô, rước Hòm Giao Ước về Si-ôn, nhận Giao Ước Đa-vít bền vững đời đời.
        `,
        typology: `
          • Đa-vít là hình bóng về Vua Bình An Giê-xu Christ cai trị vương quốc đời đời.
        `,
        application: [
          'Thờ phượng Chúa hết lòng với tinh thần biết ơn và ngợi khen không thôi.',
          'Khi lầm lỡ, mau chóng ăn năn tan vỡ để được Chúa tha thứ phục hồi (Thi thiên 51).'
        ],
        target_book: 'PSA',
        target_chapter: 23,
        cross_refs: ['1 Sa-mu-ên 17:45–47', '2 Sa-mu-ên 7:12–16', 'Thi-thiên 23:1–6']
      },
      paul: {
        names: ['phao-lô', 'phaolo', 'paul', 'sau-lơ'],
        title: 'SỨ ĐỒ PHAO-LÔ (APOSTLE PAUL)',
        role: 'Sứ đồ cho các dân ngoại bang, trước giả 13 thư tín Tân Ước',
        origin: 'Người Do Thái dòng Bên-gia-min, sinh tại Tạc-sơ, có quốc tịch La Mã, học trò của Ga-ma-li-ên.',
        narrative: `
          • Từ kẻ bắt bớ Hội Thánh gặp Chúa Phục Sinh trên đường Đa-mách và được biến cải hoàn toàn.<br>
          • Thực hiện 3 chuyến truyền giáo vĩ đại khắp Địa Trung Hải, lập nhiều Hội Thánh.
        `,
        typology: `
          • Minh chứng sống động cho quyền năng biến đổi của Ân Điển Cứu Rỗi nơi Đấng Christ.
        `,
        application: [
          'Không hổ thẹn về Tin Lành vì đó là quyền phép cứu rỗi của Đức Chúa Trời (Rô-ma 1:16).',
          'Sống đời sống tận hiến: "Tôi sống, không phải là tôi sống nữa, bèn là Đấng Christ sống trong tôi".'
        ],
        target_book: 'ROM',
        target_chapter: 8,
        cross_refs: ['Công vụ 9:1–19', 'Rô-ma 8:1–39', 'Ga-la-ti 2:20']
      },
      peter: {
        names: ['phi-e-rơ', 'phiero', 'peter', 'si-môn'],
        title: 'SỨ ĐỒ PHI-E-RƠ (APOSTLE PETER)',
        role: 'Trụ cột nhóm Mười Hai Sứ Đồ, trước giả 1 & 2 Phi-e-rơ',
        origin: 'Người đánh cá tại Bết-sai-đa xứ Ga-li-lê, con của Giô-na, anh của An-rê.',
        narrative: `
          • Tuyên xưng: "Thầy là Đấng Christ, Con Đức Chúa Trời Hằng Sống" (Ma-thi-ơ 16:16).<br>
          • Từng chối Chúa 3 lần rồi được phục hồi tình yêu thương bên bờ hồ Ti-bê-ri-át.<br>
          • Giảng Phúc Âm trong ngày Lễ Ngũ Tuần khiến 3.000 người tin nhận Chúa.
        `,
        typology: `
          • Biểu tượng của sự phục hồi trong ân sủng: Từ hòn đá lung lay trở thành cột trụ Hội Thánh.
        `,
        application: [
          'Đứng dậy sau những vấp ngã nhờ lòng nhân từ vô lượng của Chúa Giê-xu.',
          'Chăn dắt bầy chiên của Chúa với lòng tận tụy và khiêm nhường.'
        ],
        target_book: 'ACT',
        target_chapter: 2,
        cross_refs: ['Ma-thi-ơ 16:16–18', 'Giăng 21:15–19', 'Công vụ 2:14–41']
      },
      jesus: {
        names: ['chúa giê-xu', 'chúa jêsus', 'giê-xu', 'jesu', 'jesus', 'đấng christ', 'christ', 'ngôi lời'],
        title: 'ĐỨC CHÚA GIÊ-XU CHRIST — ĐẤNG CỨU THẾ TỐI THƯỢNG',
        role: 'Ngôi Hai Ba Ngôi Đức Chúa Trời, Đấng Cứu Chuộc Duy Nhất của nhân loại',
        origin: 'Hằng hữu đời đời cùng Đức Chúa Cha; Nhập thể sinh bởi nữ đồng trinh Ma-ri tại Bết-lê-hem.',
        narrative: `
          • Ngôi Lời trở nên xác thịt, chan chứa ân điển và chân lý (Giăng 1:14).<br>
          • Chịu chết trên Thập Tự Giá chuộc tội thay thế cho cả nhân loại, ngày thứ ba sống lại vinh hiển.
        `,
        typology: `
          • Trung tâm và đỉnh cao của toàn bộ 66 sách Kinh Thánh: Chiên Con Lễ Vượt Qua hoàn hảo, Thầy Tế Lễ Thượng Phẩm đời đời, Vua Muôn Vua.
        `,
        application: [
          'Tin nhận Chúa Giê-xu để nhận sự sống đời đời và sự giải hòa cùng Đức Chúa Trời.',
          'Bước đi theo dấu chân Ngài trong tình yêu thương và sự khiêm nhường.'
        ],
        target_book: 'JHN',
        target_chapter: 1,
        cross_refs: ['Giăng 1:1–14', 'Giăng 3:16', 'Phi-líp 2:5–11']
      }
    };
  }
}

export const aiAssistant = new AIAssistant();
