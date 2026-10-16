/* ==========================================================================
   LOGOS MULTIVERSE - THEOLOGICAL AI COPILOT & AUTONOMOUS AGENT
   Deep Hermeneutics, Biblical Characters Encyclopedia, Web Copilot & Live Search
   ========================================================================== */

import { storage } from './storage.js';
import { state } from './state.js';

export class AIAssistant {
  constructor() {
    this.apiKey = storage.getPreference('openai_api_key', '');
    this.isWebSearchEnabled = true;
    this.history = [];

    // Pre-loaded Theological Knowledge Base for deep zero-setup exegesis
    this.bookAuthorsAndThemes = {
      JHN: {
        author_human: 'Trước giả: Sứ đồ Giăng (Người môn đồ được Chúa yêu)',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 85 – 95 S.C., viết tại thành Ê-phê-sô',
        genre: 'Phúc Âm Thần Học & Khải Thị',
        key_themes: 'Thần tính của Đấng Christ, Ngôi Lời (Logos) Nhập Thể, 7 Dấu Lạ (Sēmeia), Sự Sống Đời Đời',
        key_words: [
          { word: 'Logos (G3056)', meaning: 'Ngôi Lời, Lời Phán sáng tạo, Thân vị Thần tính hằng hữu' },
          { word: 'En archē (G1722 G746)', meaning: 'Trong khởi nguyên đời đời trước mọi thời gian' },
          { word: 'Theos (G2316)', meaning: 'Đức Chúa Trời Tối Cao' },
          { word: 'Sarx (G4561)', meaning: 'Xác thịt nhân loại (Mầu nhiệm Nhập thể)' },
          { word: 'Zōē (G2222)', meaning: 'Sự sống thần thượng vĩnh cửu' },
          { word: 'Phōs (G5457)', meaning: 'Ánh sáng chân lý xua tan bóng tối' }
        ]
      },
      MAT: {
        author_human: 'Trước giả: Sứ đồ Ma-thi-ơ (Lê-vi, người thâu thuế)',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 60 – 70 S.C.',
        genre: 'Phúc Âm Nước Trời & Lời Tiên Tri',
        key_themes: 'Chúa Giê-xu là Đấng Mê-si-a làm trọn Lời Tiên Tri Cựu Ước, Vua Nước Trời, Bài Giảng Trên Núi',
        key_words: [
          { word: 'Basileia tou Theou (G932)', meaning: 'Vương quốc Nước Trời' },
          { word: 'Plēroō (G4137)', meaning: 'Làm trọn vẹn lời tiên tri' }
        ]
      },
      MRK: {
        author_human: 'Trước giả: Giăng-Mác (Người cộng sự trung tín của Sứ đồ Phi-e-rơ)',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 55 – 65 S.C. tại Rô-ma',
        genre: 'Phúc Âm Hành Động & Đấng Phục Vụ Chịu Khổ',
        key_themes: 'Con Người đến để phục vụ và phó sự sống làm giá chuộc nhiều người (Mác 10:45)',
        key_words: [{ word: 'Euthys (G2112)', meaning: 'Tức thì, ngay lập tức (nhấn mạnh hành động)' }]
      },
      LUK: {
        author_human: 'Trước giả: Bác sĩ Lu-ca (Người đồng công của Sứ đồ Phao-lô)',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 60 – 62 S.C.',
        genre: 'Phúc Âm Lịch Sử, Lòng Thương Xót & Ơn Cứu Rỗi Phổ Quát',
        key_themes: 'Tìm và cứu kẻ bị hư mất, đầy dẫy Đức Thánh Linh, các dụ ngôn nhân từ (Người Sa-ma-ri, Con hoang đàng)',
        key_words: [{ word: 'Sōzō (G4982)', meaning: 'Cứu rỗi, chữa lành trọn vẹn cả linh hồn và thể xác' }]
      },
      GEN: {
        author_human: 'Trước giả: Đấng tiên tri Môi-se',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng 1440 – 1400 T.C. trong đồng vắng',
        genre: 'Sách Luật Pháp (Torah / Pentateuch)',
        key_themes: 'Sự Sáng Tạo hoàn hảo, Sa ngã, Lời hứa Đấng Mê-si-a (Sáng thế 3:15), Giao ước với Áp-ra-ham',
        key_words: [
          { word: 'Bereshit (H7225)', meaning: 'Ban đầu, cội rễ khởi nguyên' },
          { word: 'Bara (H1254)', meaning: 'Sáng tạo từ hư vô (quyền năng độc hữu của Đức Chúa Trời)' },
          { word: 'Elohim (H430)', meaning: 'Đức Chúa Trời Quyền Năng Oai Nghi' }
        ]
      },
      JOS: {
        author_human: 'Trước giả: Giô-suê, con trai của Nun',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng 1400 – 1370 T.C.',
        genre: 'Lịch Sử Chinh Phục & Phân Chia Đất Hứa',
        key_themes: 'Đức Chúa Trời thành tín làm trọn lời hứa ban xứ Ca-na-an; Sự vâng phục dẫn đến đắc thắng; Giao ước tại Si-chem (Giô-suê 24:15)',
        key_words: [
          { word: 'Hazak ve-amats (H2388 H553)', meaning: 'Hãy vững lòng bền chí' },
          { word: 'Nahalah (H5159)', meaning: 'Cơ nghiệp, sản nghiệp đời đời' }
        ]
      },
      JON: {
        author_human: 'Trước giả: Đấng tiên tri Giô-na, con của A-mi-tai',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng 780 – 760 T.C. thời vua Giê-rô-bô-am II',
        genre: 'Tiên Tri Tự Thuật & Dấu Lạ Mê-si-a',
        key_themes: 'Lòng thương xót phổ quát của Chúa cho muôn dân; Sự bất tuân và sự sửa phạt; Dấu lạ 3 ngày 3 đêm báo trước sự Phục Sinh của Đấng Christ',
        key_words: [
          { word: 'Dag Gadol (H1709 H1419)', meaning: 'Con cá lớn sắm sẵn' },
          { word: 'Teshuvah (H8666)', meaning: 'Sự ăn năn quay đầu' }
        ]
      },
      ISA: {
        author_human: 'Trước giả: Đấng tiên tri Ê-sai, con của A-mốt',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng 740 – 680 T.C. tại Giê-ru-sa-lem',
        genre: 'Đại Tiên Tri Phúc Âm Cựu Ước',
        key_themes: 'Đấng Thánh của Y-sơ-ra-ên; Tiên tri Đấng Emmanuel (Ê-sai 7:14); Tôi Tớ Chịu Khổ chuộc tội (Ê-sai 53); Trời Mới Đất Mới',
        key_words: [
          { word: 'Qadosh Yisrael (H6918)', meaning: 'Đấng Thánh của Y-sơ-ra-ên' },
          { word: 'Emmanuel (H6005)', meaning: 'Đức Chúa Trời ở cùng chúng ta' }
        ]
      },
      PSA: {
        author_human: 'Trước giả: Vua Đa-vít, A-sáp, con cháu Cô-rê, Môi-se, Sa-lô-môn',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Trải dài từ thời Môi-se (1400 T.C.) đến thời Hồi hương (500 T.C.)',
        genre: 'Thơ Ca Thánh & Khôn Ngoan',
        key_themes: 'Thờ phượng, than khóc, xưng tội, sự đắc thắng của Đấng Mê-si-a (Đấng Chăn Chiên Thi thiên 23)',
        key_words: [
          { word: 'Hesed (H2617)', meaning: 'Tình yêu giao ước thành tín, nhân từ bất diệt' },
          { word: 'Shalom (H7965)', meaning: 'Sự bình an trọn vẹn, thịnh vượng tâm linh' }
        ]
      },
      ROM: {
        author_human: 'Trước giả: Sứ đồ Phao-lô',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 57 S.C. từ thành Cô-rinh-tô',
        genre: 'Thư Tín Thần Học Cốt Lõi',
        key_themes: 'Sự công bình của Đức Chúa Trời, xưng công bình bởi đức tin nơi Đấng Christ, quyền năng Thánh Linh',
        key_words: [
          { word: 'Dikaiosynē (G1343)', meaning: 'Sự công chính, xưng công bình' },
          { word: 'Charis (G5485)', meaning: 'Ân điển nhưng không vượt mọi tội lỗi' }
        ]
      },
      REV: {
        author_human: 'Trước giả: Sứ đồ Giăng (lưu đày tại đảo Bát-mô)',
        author_divine: 'Đức Chúa Trời là Tác Giả Tối Thượng soi dẫn',
        date: 'Khoảng năm 95 S.C. thời hoàng đế La Mã Domitian',
        genre: 'Khải Huyền & Tiên Tri Khải Thị',
        key_themes: 'Đấng Christ Đắc Thắng, Chiên Con trên Ngai, Sự sụp đổ của Ba-by-lôn, Trời Mới & Đất Mới',
        key_words: [
          { word: 'Apokalypsis (G602)', meaning: 'Sự khải thị, vén mở bức màn thiên thượng' },
          { word: 'Arnion (G721)', meaning: 'Chiên Con đắc thắng đã bị giết' }
        ]
      }
    };

    // Deep Biblical Characters Encyclopedia
    this.biblicalCharacters = {
      jonah: {
        names: ['giô-na', 'giona', 'jona', 'jonah'],
        title: 'ĐẤNG TIÊN TRI GIÔ-NA (JONAH)',
        role: 'Tiên tri Cựu Ước của Vương quốc phía Bắc (Y-sơ-ra-ên), trước giả sách Giô-na',
        origin: 'Con của A-mi-tai, quê quán tại Gát-hê-phe thuộc chi phái Sa-bu-lôn (Ga-li-lê). Chức vụ diễn ra khoảng năm 780–760 T.C. dưới triều vua Giê-rô-bô-am II (2 Các Vua 14:25).',
        narrative: `
          • <strong>Sứ mạng bất khả thi:</strong> Đức Chúa Trời phán biểu Giô-na hãy đi đến thành <em>Ni-ni-ve</em> — đại kinh đô hung ác, tàn bạo của đế quốc A-si-ri — để rao báo sự phán xét.<br>
          • <strong>Chạy trốn khỏi mặt Chúa:</strong> Giô-na không muốn dân ngoại bang tàn ác được cứu, nên ông xuống cảng Giốp-bê, trả tiền đò trốn lên tàu đi <em>Ta-rơ-si</em> (vùng biển Tây Ban Nha ngày nay, hướng hoàn toàn ngược lại).<br>
          • <strong>Cơn bão lớn & Bụng cá:</strong> Chúa giáng bão tố dữ dội giữa biển. Giô-na xưng nhận tội bất tuân và bảo các thủy thủ ném ông xuống biển để biển lặng. Chúa sắm sẵn một con cá lớn nuốt Giô-na, ông ở trong bụng cá <em>3 ngày và 3 đêm</em>.<br>
          • <strong>Ăn năn & Ni-ni-ve được cứu:</strong> Từ đáy biển sâu trong bụng cá, Giô-na cầu nguyện dâng lời tạ ơn Chúa. Cá mửa ông lên đất liền. Lần thứ hai, ông vâng phục đến Ni-ni-ve rao báo: <em>"Còn bốn mươi ngày nữa, Ni-ni-ve sẽ bị đổ nhào!"</em>. Toàn thể thành Ni-ni-ve từ vua đến thứ dân đều tin Đức Chúa Trời, kiêng ăn mặc bao gai. Chúa thấy họ lìa bỏ điều ác nên dủ lòng thương xót tha thứ.<br>
          • <strong>Bài học cây dây leo:</strong> Giô-na giận dữ vì Ni-ni-ve không bị hủy diệt. Chúa cho cây dây leo mọc lên che mát rồi cho sâu cắn héo, qua đó dạy Giô-na: Nếu ông tiếc một cái cây mình chẳng tốn công trồng, thì lẽ nào Đức Chúa Trời không đoái thương hơn 12 vạn người cùng vô số súc vật trong thành Ni-ni-ve?
        `,
        typology: `
          • <strong>Dấu lạ tiên tri Giô-na (Ma-thi-ơ 12:39–41; Lu-ca 11:29–32):</strong> Chính Đức Chúa Giê-xu đã xác nhận Giô-na là nhân vật lịch sử và công bố hình bóng tiên tri tối thượng: <em>"Vì như Giô-na đã ở trong bụng cá lớn ba ngày ba đêm, thì Con Người cũng sẽ ở trong lòng đất ba ngày ba đêm như vậy."</em> Sự kiện Giô-na ra khỏi bụng cá là hình bóng tiên tri về sự <strong>Chết Chuộc Tội & Phục Sinh Khải Hoàn</strong> của Đấng Christ.<br>
          • <strong>Tình Yêu Cứu Chuộc Vượt Biên Giới:</strong> Sách Giô-na là lời tuyên ngôn Cựu Ước rằng ơn cứu rỗi của Đức Chúa Trời không dành riêng cho một dân tộc mà mở rộng cho toàn thể nhân loại biết ăn năn.
        `,
        application: [
          'Không một ai có thể chạy trốn khỏi sự hiện diện và quyền tể trị của Đức Chúa Trời.',
          'Hạ mình từ bỏ tinh thần cố chấp, hẹp hòi; học lấy tấm lòng nhân từ bao dung của Chúa đối với những người lầm lạc.',
          'Vững tin nơi Đấng Christ Phục Sinh — Đấng vĩ đại hơn Giô-na bội phần.'
        ],
        target_book: 'JON',
        target_chapter: 1,
        cross_refs: ['Giô-na 1:1–17', 'Giô-na 2:1–10', 'Giô-na 3:1–10', 'Giô-na 4:1–11', 'Ma-thi-ơ 12:39–41', '2 Các Vua 14:25']
      },
      moses: {
        names: ['môi-se', 'moise', 'môise', 'moses'],
        title: 'ĐẤNG TIÊN TRI MÔI-SE (MOSES)',
        role: 'Lãnh tụ vĩ đại giải phóng dân Y-sơ-ra-ên, trước giả Ngũ Kinh Luật Pháp (Torah)',
        origin: 'Thuộc chi phái Lê-vi, sinh tại Ai Cập thời kỳ tuyển dân bị áp bức; được công chúa Pha-ra-ôn nhận làm con nuôi trong cung điện 40 năm, chăn chiên nơi đồng vắng Ma-đi-an 40 năm, và dẫn dắt tuyển dân 40 năm.',
        narrative: `
          • Được Chúa gọi qua bụi gai cháy không tàn tại núi Hô-rếp (Xuất 3).<br>
          • Nhân danh Đức Giê-hô-va đối đầu Pha-ra-ôn với 10 Tai Vạ, thiết lập Lễ Vượt Qua.<br>
          • Dẫn dân sự qua Biển Đỏ rẽ lối, nhận 10 Điều Răn và Luật Pháp Giao Ước tại núi Si-na-i.<br>
          • Dựng Đền Tạm (Tabernacle) theo đúng khuôn mẫu thiên thượng.
        `,
        typology: `
          • Môi-se là hình bóng về Đấng Trung Bảo của Giao Ước. Phục truyền 18:15 tiên báo: <em>"Từ giữa anh em ngươi, Giê-hô-va Đức Chúa Trời ngươi sẽ dấy lên cho ngươi một Đấng Tiên Tri như ta; các ngươi hãy nghe theo Đấng ấy!"</em> — Đấng đó chính là Đức Chúa Giê-xu Christ (Công vụ 3:22; Hê-bơ-rơ 3:1–6).
        `,
        application: [
          'Bước đi bởi đức tin kiên định, thà cùng chịu khổ với dân Chúa hơn là hưởng lạc thú tạm bợ của trần gian (Hê-bơ-rơ 11:24–26).',
          'Lòng khiêm nhường tột bậc trước mặt Đức Chúa Trời.'
        ],
        target_book: 'EXO',
        target_chapter: 12,
        cross_refs: ['Xuất Ê-díp-tô Ký 3:1–15', 'Xuất Ê-díp-tô Ký 12:1–14', 'Phục-truyền 18:15', 'Hê-bơ-rơ 3:1–6']
      },
      abraham: {
        names: ['áp-ra-ham', 'apraham', 'abraham', 'áp-ram'],
        title: 'TỔ PHỤ ĐỨC TIN ÁP-RA-HAM (ABRAHAM)',
        role: 'Tổ phụ của dân tộc Y-sơ-ra-ên và là cha của mọi kẻ có đức tin',
        origin: 'Nguyên danh Áp-ram, xuất thân từ xứ U-rơ của người Canh-đê, được Chúa gọi ra đi khi 75 tuổi đến vùng đất Ca-na-an hứa nguyện.',
        narrative: `
          • Nhận Giao Ước Áp-ra-ham (Sáng thế 12, 15, 17): dòng dõi đông như sao trên trời, như cát bờ biển, và qua ông muôn dân sẽ được phước.<br>
          • Đức tin được kể là công bình (Sáng thế 15:6; Rô-ma 4:3).<br>
          • Dâng Y-sác trên núi Mô-ri-a: vâng phục tuyệt đối, tin rằng Chúa có quyền năng khiến kẻ chết sống lại (Sáng thế 22; Hê-bơ-rơ 11:19).
        `,
        typology: `
          • Hình ảnh Áp-ra-ham dâng người con một yêu dấu Y-sác trên đồi Mô-ri-a chính là hình bóng tiên báo Đức Chúa Cha hy sinh Con Độc Sanh là Chúa Giê-xu trên đồi Gô-gô-tha. Con chiên đực mắc sừng trong bụi gai thay thế Y-sác là hình bóng về Chiên Con Đấng Christ chuộc tội thay nhân loại.
        `,
        application: [
          'Vâng lời Chúa dấn bước ngay cả khi chưa thấy rõ con đường phía trước.',
          'Tin cậy nơi sự tiếp trợ trọn vẹn của Đức Giê-hô-va Di-rê (Chúa sẽ sắm sẵn).'
        ],
        target_book: 'GEN',
        target_chapter: 12,
        cross_refs: ['Sáng-thế Ký 12:1–3', 'Sáng-thế Ký 15:1–6', 'Sáng-thế Ký 22:1–19', 'Rô-ma 4:1–12', 'Ga-la-ti 3:6–9']
      },
      david: {
        names: ['đa-vít', 'davit', 'david'],
        title: 'VUA ĐA-VÍT — NGƯỜI VỪA LÒNG ĐỨC CHÚA TRỜI',
        role: 'Vị vua thứ hai của Y-sơ-ra-ên, chiến binh dũng cảm, thi nhân & người lập giao ước vương quyền',
        origin: 'Con trai út của Gie-sê, người Bết-lê-hem chi phái Giu-đa. Từ người chăn chiên nơi đồng vắng được tiên tri Sa-mu-ên xức dầu làm vua.',
        narrative: `
          • Đánh bại người khổng lồ Gô-li-át bằng đức tin nơi danh Đức Giê-hô-va Vạn Quân (1 Sa-mu-ên 17).<br>
          • Thống nhất 12 chi phái Y-sơ-ra-ên, biến Giê-ru-sa-lem thành thủ đô và rước Hòm Giao Ước về Sion.<br>
          • Trước giả của phần lớn các bài Thánh Ca trong Thi Thiên (trong đó có Thi Thiên 23: <em>"Đức Giê-hô-va là Đấng chăn giữ tôi"</em>).<br>
          • Giao ước Đa-vít (2 Sa-mu-ên 7): Chúa hứa lập ngôi nước dòng dõi ông vững bền đời đời.
        `,
        typology: `
          • Đa-vít là hình bóng tiên tri về Vua Cứu Thế Giê-xu. Tân Ước mở đầu bằng: <em>"Gia phả Đức Chúa Giê-xu Christ, con cháu Đa-vít"</em> (Ma-thi-ơ 1:1). Đấng Christ ngự trên ngôi Đa-vít và trị vì vương quốc đời đời không hề dứt.
        `,
        application: [
          'Tìm kiếm Chúa hết lòng, thờ phượng Ngài với tinh thần chân thật và ngợi khen không ngơi nghỉ.',
          'Khi lầm lỡ phạm tội, lập tức ăn năn tan vỡ như Đa-vít trong Thi Thiên 51 để nhận ơn tha thứ phục hồi.'
        ],
        target_book: 'PSA',
        target_chapter: 23,
        cross_refs: ['1 Sa-mu-ên 17:45–47', '2 Sa-mu-ên 7:12–16', 'Thi-thiên 23:1–6', 'Thi-thiên 51:1–12', 'Ma-thi-ơ 1:1']
      },
      joshua: {
        names: ['giô-suê', 'giosue', 'joshua', 'yôsua', 'y-yôsuê'],
        title: 'LÃNH TỤ GIÔ-SUÊ (JOSHUA) — NGƯỜI DẪN DÂN VÀO ĐẤT HỨA',
        role: 'Người kế vị Môi-se, tổng chỉ huy quân sự đưa tuyển dân qua sông Giô-đanh chiếm Ca-na-an',
        origin: 'Con trai của Nun, thuộc chi phái Ép-ra-im. Từng làm trợ thủ trung tín cho Môi-se suốt 40 năm trong đồng vắng.',
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
        cross_refs: ['Giô-suê 1:1–9', 'Giô-suê 24:1–15', 'Giô-suê 24:2', 'Hê-bơ-rơ 4:8–10']
      },
      isaiah: {
        names: ['ê-sai', 'esai', 'isaiah', 'y-êsai'],
        title: 'ĐẤNG TIÊN TRI PHÚC ÂM Ê-SAI (ISAIAH)',
        role: 'Đại tiên tri tại vương quốc Giu-đa, trước giả sách Ê-sai',
        origin: 'Con của A-mốt, sống tại Giê-ru-sa-lem, thi hành chức vụ trong thời 4 đời vua: Ô-xia, Giô-tham, A-cha và Ê-xê-chia (740–680 T.C.).',
        narrative: `
          • Nhận khải tượng về sự oai nghiêm thánh khiết của Chúa trên Ngai cao (Ê-sai 6): <em>"Thánh thay, thánh thay, thánh thay là Đức Giê-hô-va Vạn Quân!"</em>.<br>
          • Tình nguyện dấn thân: <em>"Có tôi đây, xin hãy sai tôi!"</em>.<br>
          • Công bố các lời tiên tri chấn động về sự sụp đổ của các nước đế quốc và tương lai tái lập Giê-ru-sa-lem.
        `,
        typology: `
          • Được mệnh danh là "Sách Phúc Âm thứ năm" trong Cựu Ước vì chứa đựng bức tranh trọn vẹn về Đấng Mê-si-a:<br>
            - Đấng Emmanuel sinh bởi trinh nữ (Ê-sai 7:14; 9:5).<br>
            - Đấng Tôi Tớ Chịu Khổ (Ê-sai 53): <em>"Ngài vì tội lỗi chúng ta mà bị vết, vì sự gian ác chúng ta mà bị thương... bởi lằn đòn Ngài chúng ta được lành bệnh"</em>.<br>
            - Sự sáng rạng ngời cho dân ngoại bang và Vương quốc Trời Mới Đất Mới (Ê-sai 65–66).
        `,
        application: [
          'Nhận biết sự thánh khiết tuyệt đối của Đức Chúa Trời để luôn sống kính sợ Ngài.',
          'Khắc sâu tình yêu chuộc tội vô điều kiện của Chúa Giê-xu qua phân đoạn Ê-sai 53.'
        ],
        target_book: 'ISA',
        target_chapter: 53,
        cross_refs: ['Ê-sai 6:1–8', 'Ê-sai 7:14', 'Ê-sai 9:5–6', 'Ê-sai 53:1–12', 'Ma-thi-ơ 1:22–23', '1 Phi-e-rơ 2:24']
      },
      paul: {
        names: ['phao-lô', 'phaolo', 'paul', 'sau-lơ', 'saulo'],
        title: 'SỨ ĐỒ PHA-LÔ (APOSTLE PAUL)',
        role: 'Sứ đồ cho các dân ngoại bang, nhà thần học kiệt xuất, trước giả 13 thư tín Tân Ước',
        origin: 'Người Do Thái dòng dõi Bên-gia-min, sinh tại Tạc-sơ, có quốc tịch La Mã, môn sinh xuất sắc của giáo sư Ga-ma-li-ên.',
        narrative: `
          • Ban đầu là Sau-lơ hung hăng bắt bớ Hội Thánh Chúa tàn nhẫn.<br>
          • Gặp Chúa Giê-xu Phục Sinh trên đường Đa-mách qua ánh sáng chói lòa từ trời và được biến cải hoàn toàn (Công vụ 9).<br>
          • Thực hiện 3 hành trình truyền giáo vĩ đại khắp Tiểu Á, Hy Lạp và Rô-ma, thành lập hàng loạt Hội Thánh.<br>
          • Trung kiên đến giọt máu cuối cùng: <em>"Ta đã đánh trận tốt lành, đã xong sự chạy, đã giữ được đức tin"</em> (2 Ti-mô-thê 4:7).
        `,
        typology: `
          • Là minh chứng vĩ đại nhất cho quyền năng của Ân Điển Cứu Rỗi: Biến kẻ tội lỗi tột bực trở thành chiến sĩ thập tự giá vĩ đại của Đấng Christ.
        `,
        application: [
          'Không hổ thẹn về Phúc Âm vì đó là quyền phép của Đức Chúa Trời để cứu mọi kẻ tin (Rô-ma 1:16).',
          'Sống đời sống tận hiến: "Tôi sống, không phải là tôi sống nữa, bèn là Đấng Christ sống trong tôi" (Ga-la-ti 2:20).'
        ],
        target_book: 'ROM',
        target_chapter: 8,
        cross_refs: ['Công vụ 9:1–19', 'Rô-ma 1:16–17', 'Rô-ma 8:1–39', 'Ga-la-ti 2:20', '2 Ti-mô-thê 4:7–8']
      },
      peter: {
        names: ['phi-e-rơ', 'phiero', 'peter', 'si-môn', 'cephas'],
        title: 'SỨ ĐỒ PHI-E-RƠ (APOSTLE PETER)',
        role: 'Vị môn đồ lãnh đạo trong nhóm Mười Hai Sứ Đồ, trước giả 1 & 2 Phi-e-rơ',
        origin: 'Người đánh cá tại Bết-sai-đa xứ Ga-li-lê, con của Giô-na, anh của sứ đồ An-rê.',
        narrative: `
          • Được Chúa gọi khi đang thả lưới: <em>"Hãy theo Ta, Ta sẽ khiến các ngươi trở nên tay đánh lưới người"</em>.<br>
          • Lời tuyên xưng đức tin kinh điển tại Sê-sa-rê Phi-líp: <em>"Thầy là Đấng Christ, Con Đức Chúa Trời Hằng Sống!"</em> (Ma-thi-ơ 16:16).<br>
          • Từng tự phụ rồi vấp ngã chối Chúa 3 lần trong đêm bị xét xử, sau đó khóc lóc đắng cay và được Chúa phục hồi tình yêu thương bên bờ hồ Ti-bê-ri-át (Giăng 21).<br>
          • Đầy dẫy Đức Thánh Linh trong Lễ Ngũ Tuần giảng Phúc Âm khiến 3.000 người ăn năn tin nhận Chúa.
        `,
        typology: `
          • Biểu tượng của sự phục hồi trong ân sủng: Từ hòn đá lung lay vấp ngã biến thành cột trụ vững vàng của Hội Thánh ban đầu.
        `,
        application: [
          'Đứng dậy sau những vấp ngã nhờ lòng nhân từ vô lượng của Đấng Christ.',
          'Nuôi dưỡng bầy chiên của Chúa với tinh thần tự nguyện và gương mẫu.'
        ],
        target_book: 'ACT',
        target_chapter: 2,
        cross_refs: ['Ma-thi-ơ 16:16–18', 'Lu-ca 22:54–62', 'Giăng 21:15–19', 'Công vụ 2:14–41', '1 Phi-e-rơ 1:3–9']
      },
      jesus: {
        names: ['chúa giê-xu', 'chúa jêsus', 'giê-xu', 'jesu', 'jesus', 'đấng christ', 'christ', 'ngôi lời'],
        title: 'ĐỨC CHÚA GIÊ-XU CHRIST — ĐẤNG CỨU THẾ TỐI THƯỢNG',
        role: 'Ngôi Hai Ba Ngôi Đức Chúa Trời, Đấng Cứu Chuộc Duy Nhất của nhân loại',
        origin: 'Hằng hữu đời đời cùng Đức Chúa Cha; nhập thể sinh bởi nữ đồng trinh Ma-ri tại Bết-lê-hem theo lời tiên tri.',
        narrative: `
          • Ngôi Lời trở nên xác thịt, chan chứa ân điển và chân lý (Giăng 1:14).<br>
          • Thi hành chức vụ 3 năm rưỡi: rao giảng Nước Trời, chữa lành mọi bệnh tật, đuổi quỷ, làm sống lại kẻ chết.<br>
          • Vâng phục cho đến chết trên Thập Tự Giá tại đồi Gô-gô-tha đặng đền tội thay cho toàn thể nhân loại.<br>
          • Ngày thứ ba sống lại vinh hiển, thăng thiên và ngự bên hữu Đức Chúa Cha, sẽ tái lâm trong vinh quang.
        `,
        typology: `
          • Ngài là trung tâm và đỉnh cao của toàn bộ 66 sách Thánh Kinh: Là Chiên Con Lễ Vượt Qua hoàn hảo, Đấng Tiên Tri lớn hơn Môi-se, Thầy Tế Lễ Thượng Phẩm đời đời theo ban Mên-chi-xê-đéc, và Vua muôn vua, Chúa muôn chúa.
        `,
        application: [
          'Tin nhận Chúa Giê-xu để nhận ơn tha tội và sự sống đời đời.',
          'Bước đi theo dấu chân Ngài trong tình yêu thương và sự khiêm nhường.'
        ],
        target_book: 'JHN',
        target_chapter: 1,
        cross_refs: ['Giăng 1:1–14', 'Giăng 3:16', 'Giăng 14:6', 'Phi-líp 2:5–11', 'Khải-huyền 1:7–8']
      }
    };
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    storage.savePreference('openai_api_key', this.apiKey);
  }

  getApiKey() {
    return this.apiKey;
  }

  setWebSearchEnabled(enabled) {
    this.isWebSearchEnabled = !!enabled;
  }

  getWebSearchEnabled() {
    return this.isWebSearchEnabled;
  }

  // Dynamic Context-Aware Prompt Suggestions
  getSuggestedPrompts(verseRef = 'Giăng 1:1', bookMetadata = null) {
    const bookName = bookMetadata?.name_vi || 'Giăng';

    return [
      `Giô-na là ai và ý nghĩa dấu lạ Giô-na trong Tân Ước?`,
      `Mở sách Giô-suê đoạn 24 và bật đối chiếu 6 bản dịch`,
      `Phân tích toàn diện ${bookName} đoạn 1 (Bối cảnh, trước giả, thần học)`,
      `Từ gốc nguyên ngữ Hy Lạp/Hê-bơ-rơ và mã Strong's của ${verseRef}?`,
      `Tra cứu không gian mạng: Tư liệu lịch sử & khảo cổ về ${bookName}?`
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

  // Autonomous Web Copilot Action Dispatcher: Controls the Web Application Directly
  parseAndExecuteCopilotCommand(question) {
    const q = question.toLowerCase().trim();
    let actionResult = null;

    // 1. Navigation Command (e.g. "mở sách Giô-na", "chuyển sang Giô-suê 24", "đọc Thi thiên 23", "mở Ê-sai 53")
    const bookRegexMap = [
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:giô-na|giona|jonah)(?:\s+(\d+))?/i, bookId: 'JON', defaultCh: 1, nameVi: 'Giô-na' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:giô-suê|giosue|joshua)(?:\s+(\d+))?/i, bookId: 'JOS', defaultCh: 24, nameVi: 'Giô-suê' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:ê-sai|esai|isaiah)(?:\s+(\d+))?/i, bookId: 'ISA', defaultCh: 1, nameVi: 'Ê-sai' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:thi-thiên|thithiên|psalm)(?:\s+(\d+))?/i, bookId: 'PSA', defaultCh: 23, nameVi: 'Thi-thiên' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:sáng-thế|sangthe|genesis)(?:\s+(\d+))?/i, bookId: 'GEN', defaultCh: 1, nameVi: 'Sáng-thế Ký' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:giăng|giang|john)(?:\s+(\d+))?/i, bookId: 'JHN', defaultCh: 1, nameVi: 'Giăng' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:rô-ma|roma|romans)(?:\s+(\d+))?/i, bookId: 'ROM', defaultCh: 8, nameVi: 'Rô-ma' },
      { regex: /(?:mở|chuyển|đọc|xem)(?:\s+sách|\s+đoạn)?\s+(?:ma-thi-ơ|mathio|matthew)(?:\s+(\d+))?/i, bookId: 'MAT', defaultCh: 5, nameVi: 'Ma-thi-ơ' }
    ];

    for (const b of bookRegexMap) {
      const match = q.match(b.regex);
      if (match) {
        const targetChapter = match[1] ? parseInt(match[1], 10) : b.defaultCh;
        try {
          state.setPassage(b.bookId, targetChapter);
          actionResult = {
            executed: true,
            type: 'NAVIGATE',
            message: `Đã tự động chuyển trang web đến: <strong>${b.nameVi} đoạn ${targetChapter}</strong>`,
            bookId: b.bookId,
            chapter: targetChapter
          };
        } catch (e) {
          console.warn('Copilot navigate error:', e);
        }
        break;
      }
    }

    // 2. Parallel Translations Switch Command (e.g. "bật bản dịch ê-đê", "đối chiếu bản gia-rai", "chọn bản kjv")
    if (q.includes('bản dịch') || q.includes('đối chiếu') || q.includes('bản')) {
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
        state.setDrawerTab('parallel');
        state.setDrawerOpen(true);
        actionResult = {
          executed: true,
          type: 'TRANSLATIONS',
          message: `Đã tự động kích hoạt đối chiếu các bản dịch: <strong>${targetVersions.join(', ')}</strong> và mở bảng đối chiếu.`,
          versions: targetVersions
        };
      }
    }

    // 3. Open Drawer Tool Tab Command (e.g. "mở đối chiếu", "mở ẩn dụ", "mở bối cảnh", "mở giải thích")
    if (q.includes('mở đối chiếu') || q.includes('xem đối chiếu')) {
      state.setDrawerTab('parallel');
      state.setDrawerOpen(true);
      actionResult = { executed: true, type: 'DRAWER', message: 'Đã mở bảng đối chiếu song song đa bản dịch.' };
    } else if (q.includes('mở ẩn dụ') || q.includes('xem ẩn dụ') || q.includes('biểu tượng')) {
      state.setDrawerTab('metaphors');
      state.setDrawerOpen(true);
      actionResult = { executed: true, type: 'DRAWER', message: 'Đã mở bảng giải nghĩa ẩn dụ & hình bóng thần học.' };
    } else if (q.includes('bối cảnh') && (q.includes('mở') || q.includes('xem'))) {
      state.setDrawerTab('context');
      state.setDrawerOpen(true);
      actionResult = { executed: true, type: 'DRAWER', message: 'Đã mở bảng khảo cứu bối cảnh lịch sử & trước giả.' };
    } else if (q.includes('đóng bảng') || q.includes('tắt bảng') || q.includes('đóng đối chiếu')) {
      state.setDrawerOpen(false);
      actionResult = { executed: true, type: 'DRAWER', message: 'Đã đóng bảng khảo cứu bên phải.' };
    }

    // 4. Theme Toggle Command (e.g. "chế độ tối", "chế độ sáng", "đổi giao diện")
    if (q.includes('chế độ tối') || q.includes('giao diện tối') || q.includes('ban đêm')) {
      state.setTheme('dark');
      actionResult = { executed: true, type: 'THEME', message: 'Đã chuyển sang giao diện Than Đá Hoàng Gia (Dark Mode).' };
    } else if (q.includes('chế độ sáng') || q.includes('giao diện sáng') || q.includes('giấy cổ') || q.includes('parchment')) {
      state.setTheme('parchment');
      actionResult = { executed: true, type: 'THEME', message: 'Đã chuyển sang giao diện Giấy Cổ Điển (Parchment Mode).' };
    }

    return actionResult;
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

    const actionButtons = `
      <div class="copilot-action-bar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; padding-top: 0.8rem; border-top: 1px dashed var(--border-medium);">
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
    `;

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

        ${actionButtons}
      </div>
    `;

    if (webData) {
      html += this.formatWebDataCitations(webData);
    }

    return html;
  }

  // Deep Chapter Masterclass Generator
  generateChapterMasterclass(bookName, chapterNum, bookMeta) {
    const isJohn = bookName.toLowerCase().includes('giăng') || bookName.toLowerCase().includes('john');

    if (isJohn && chapterNum === 1) {
      return `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">GIẢI NGHĨA CHUYÊN SÂU TOÀN DIỆN</span>
            <h3 style="color: var(--accent-gold); margin: 0.4rem 0;">PHÚC ÂM GIĂNG • ĐOẠN 1: NGÔI LỜI NHẬP THỂ & CHIÊN CON CỦA ĐỨC CHÚA TRỜI</h3>
          </div>

          <div class="masterclass-section">
            <h4 style="color: var(--accent-gold);"><i class="fa-solid fa-scroll"></i> 1. TRƯỚC GIẢ & BỐI CẢNH LỊCH SỬ</h4>
            <p>
              • <strong>Trước giả con người:</strong> Sứ đồ Giăng — người môn đồ được Chúa Giê-xu yêu quý, nhân chứng sống tận mắt thấy sự vinh hiển của Ngài.<br>
              • <strong>Tác Giả Tối Thượng:</strong> <em>Chính Đức Chúa Trời là Tác Giả Tối Thượng</em> soi dẫn từng câu chữ trong Thánh Kinh.<br>
              • <strong>Thời gian & Địa điểm:</strong> Khoảng năm 85 – 95 S.C. tại thành Ê-phê-sô.<br>
              • <strong>Mục đích thần học:</strong> Khẳng định thần tính tuyệt đối và nhân tính trọn vẹn của Đức Chúa Giê-xu Christ, đập tan tà giáo Ngộ Đạo (Gnosticism) sơ khai chối bỏ sự Nhập Thể.
            </p>
          </div>

          <div class="masterclass-section">
            <h4 style="color: var(--accent-gold);"><i class="fa-solid fa-sitemap"></i> 2. CẤU TRÚC THẦN HỌC 3 KHÚC CỦA ĐOẠN 1</h4>
            <ul style="padding-left: 1.2rem; line-height: 1.6;">
              <li><strong>Phần 1: Khúc Mở Đầu Vinh Hiển (Prologue 1:1–18):</strong> Ngôi Lời (Logos) hằng hữu từ trước vô cùng, đồng đẳng với Đức Chúa Trời, Đấng Sáng Tạo muôn loài, trở nên xác thịt ở giữa loài người, chan chứa ân điển và chân lý.</li>
              <li><strong>Phần 2: Lời Chứng Của Giăng Báp-tít (1:19–34):</strong> Khước từ danh hiệu Đấng Mê-si-a, Giăng tự nhận là tiếng kêu trong đồng vắng và công bố danh hiệu tối thượng: <em>"Kìa, Chiên Con của Đức Chúa Trời, Đấng cất tội lỗi thế gian đi!"</em> (1:29).</li>
              <li><strong>Phần 3: Kêu Gọi Những Môn Đồ Đầu Tiên (1:35–51):</strong> Lời mời <em>"Hãy đến và xem"</em>. An-rê, Phi-e-rơ, Phi-líp và Na-tha-na-ên xưng nhận: <em>"Thầy là Con Đức Chúa Trời, là Vua dân Y-sơ-ra-ên!"</em>.</li>
            </ul>
          </div>

          <div class="masterclass-section">
            <h4 style="color: var(--accent-gold);"><i class="fa-solid fa-language"></i> 3. PHÂN TÍCH TỪ KHÓA NGUYÊN NGỮ HY LẠP (KOINE GREEK) & STRONG'S</h4>
            <div class="strong-chips-grid" style="display: grid; gap: 0.5rem; margin-top: 0.3rem;">
              <div style="background: rgba(255,255,255,0.03); padding: 0.5rem; border-left: 3px solid var(--accent-gold); border-radius: 4px;">
                <code>Logos (G3056 - ὁ λόγος)</code>: Không chỉ là "lời nói" thông thường, mà là <strong>Ngôi Lời Hằng Hữu</strong> — Đấng Thần Vị nắm giữ nguyên lý vận hành cõi tạo vật, liên kết chặt chẽ với Lời phán sáng tạo trong Sáng thế ký 1.
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 0.5rem; border-left: 3px solid var(--accent-gold); border-radius: 4px;">
                <code>En archē (G1722 G746 - Ἐν ἀρχῇ)</code>: "Ban đầu" — dội lại âm hưởng Sáng thế ký 1:1, nhưng ở đây động từ ở thì chưa hoàn thành (ēn - đã hằng có), khẳng định Ngôi Lời không có khởi điểm mà hằng hữu đời đời.
              </div>
              <div style="background: rgba(255,255,255,0.03); padding: 0.5rem; border-left: 3px solid var(--accent-gold); border-radius: 4px;">
                <code>Sarx egeneto (G4561 G1096 - σὰρξ ἐγένε토)</code>: "Trở nên xác thịt" — khẳng định Đấng Thần Thánh mang lấy bản tính con người thật sự mà không hề phạm tội.
              </div>
            </div>
          </div>

          <div class="masterclass-section">
            <h4 style="color: var(--accent-gold);"><i class="fa-solid fa-seedling"></i> 4. 3 BÀI HỌC ỨNG DỤNG CHO ĐỜI SỐNG HÔM NAY</h4>
            <ol style="padding-left: 1.2rem; line-height: 1.6;">
              <li><strong>Đón nhận quyền làm con Đức Chúa Trời:</strong> <em>"Hễ ai đã nhận Ngài, thì Ngài ban cho quyền phép trở nên con cái Đức Chúa Trời"</em> (Giăng 1:12) — Đức tin cá nhân biến đổi thân vị chúng ta.</li>
              <li><strong>Sống như ngọn đèn soi chiếu Sự Sáng:</strong> Noi gương Giăng Báp-tít, nhận thức mình không phải là nguồn sáng mà là người chỉ đường dẫn người khác đến với Đấng Christ.</li>
              <li><strong>Mời gọi tha nhân bằng hành động "Hãy Đến & Xem":</strong> Không cần tranh luận giáo lý cao siêu, hãy mời người thân bạn hữu đến trải nghiệm chính Chúa Giê-xu.</li>
            </ol>
          </div>
        </div>
      `;
    }

    const authorHuman = bookMeta?.author_human || `Trước giả được Đức Chúa Trời soi dẫn`;
    return `
      <div class="theological-masterclass-card animate-fade-in">
        <div class="masterclass-header">
          <span class="badge-gold">GIẢI NGHĨA CHUYÊN SÂU BEREA</span>
          <h3 style="color: var(--accent-gold); margin: 0.4rem 0;">${bookName.toUpperCase()} • ĐOẠN ${chapterNum}</h3>
        </div>
        <p><strong>Trước giả con người:</strong> ${authorHuman} • <strong>Đức Chúa Trời là Tác Giả Tối Thượng</strong>.</p>
        <p>Phân đoạn này chứa đựng sự soi sáng thần học đặc biệt trong toàn cảnh giao ước cứu rỗi. Hãy đối chiếu các câu then chốt với nguyên văn để đón nhận trọn vẹn sứ điệp.</p>
      </div>
    `;
  }

  // Offline Deep Theological Engine (Zero-Setup & Intelligent Dispatch)
  queryOfflineTheology(question, context = {}, webData = null) {
    const q = question.toLowerCase().trim();
    const ref = context.ref || 'Giăng 1:1';
    const bookName = context.book || 'Giăng';
    const chapterNum = context.chapter || 1;
    const bookMeta = this.bookAuthorsAndThemes[context.bookId || 'JHN'] || this.bookAuthorsAndThemes.JHN;

    // 0. Autonomous Copilot Action Command Check
    const copilotResult = this.parseAndExecuteCopilotCommand(question);

    // 1. Biblical Character Query ("giô-na là ai", "ai là môi-se", "kể về đavit", v.v.)
    const characterMatch = this.findCharacterMatch(question);
    if (characterMatch) {
      return this.renderCharacterMasterclass(characterMatch, copilotResult, webData);
    }

    // 2. Whole Chapter Study Query ("làm hộ", "giúp tôi", "phân tích đoạn", "tổng quan")
    if (
      (q.includes('giăng 1') || q.includes('giang 1') || q.includes('đoạn 1') || q.includes('chương 1')) &&
      (q.includes('làm hộ') || q.includes('giúp') || q.includes('tổng quan') || q.includes('toàn bộ') || q.includes('phân tích'))
    ) {
      let responseHTML = this.generateChapterMasterclass('Giăng', 1, bookMeta);
      if (webData) {
        responseHTML += this.formatWebDataCitations(webData);
      }
      return responseHTML;
    }

    // 3. Original Languages & Strong's Query
    if (q.includes('nguyên ngữ') || q.includes('hy lạp') || q.includes('hê-bơ-rơ') || q.includes('strong') || q.includes('từ gốc') || q.includes('logos')) {
      let html = `
        <div class="theological-masterclass-card animate-fade-in">
          <div class="masterclass-header">
            <span class="badge-gold">PHÂN TÍCH NGUYÊN NGỮ & MÃ STRONG'S</span>
            <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">PHÂN ĐOẠN: ${ref}</h4>
          </div>
          <p>Dưới sự soi dẫn của <strong>Đức Chúa Trời là Tác Giả Tối Thượng</strong>, trước giả đã dùng những thuật ngữ nguyên ngữ đầy quyền năng:</p>
          <div class="strong-chips-grid" style="display: grid; gap: 0.6rem; margin: 0.6rem 0;">
            <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.6rem; border-radius: 6px;">
              <strong style="color: var(--accent-gold);">1. Logos (G3056 - ὁ λόγος)</strong> [Phát âm: <em>lo'-gos</em>]<br>
              • <strong>Ý nghĩa gốc:</strong> Lời phán sáng tạo, tư tưởng khải thị, lý trí vĩnh hằng có thân vị.<br>
              • <strong>Thần học Giăng:</strong> Khác với triết học Hy Lạp xem Logos là lực lượng vô vị thân, Tân Ước khẳng định Logos là một <em>Thân Vị sống động</em>: <em>"Ngôi Lời đã trở nên xác thịt, ở giữa chúng ta"</em> (Giăng 1:14).
            </div>
            <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.6rem; border-radius: 6px;">
              <strong style="color: var(--accent-gold);">2. En archē (G1722 G746 - Ἐν ἀρχῇ)</strong><br>
              • <strong>Ý nghĩa gốc:</strong> Trong điểm khởi nguyên tối sơ.<br>
              • <strong>Đối chiếu Cựu Ước:</strong> Trực tiếp song hành với <code>Bereshit (H7225)</code> trong Sáng thế ký 1:1, công bố Chúa Giê-xu đã hiện hữu trước khi vật chất được dựng nên.
            </div>
            <div style="background: rgba(212,175,55,0.06); border-left: 3px solid var(--accent-gold); padding: 0.6rem; border-radius: 6px;">
              <strong style="color: var(--accent-gold);">3. Pros ton Theon (πρὸς τὸν θεόν)</strong><br>
              • <strong>Cú pháp học:</strong> Giới từ <code>pros</code> đi với đối cách biểu thị mối tương giao <em>mặt-đối-mặt</em>, bình đẳng, thân thiết sâu nhiệm giữa Đức Chúa Con và Đức Chúa Cha trong Ba Ngôi Hiệp Một.
            </div>
          </div>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return html;
    }

    // 4. Historical & Cultural Context Query
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
            • <strong>Thời gian & Bối cảnh:</strong> ${bookMeta.date}. Đế chế La Mã cai trị toàn vùng Địa Trung Hải, văn hóa Hy Lạp (Hellenism) phổ biến sâu rộng.<br>
            • <strong>Sứ mạng trước thuật:</strong> Công bố chân lý Đấng Christ cứu chuộc cho cả tuyển dân Do Thái lẫn dân ngoại bang, bảo vệ đức tin thuần khiết trước làn sóng triết thuyết ngoại lai.
          </p>
        </div>
      `;
      if (webData) html += this.formatWebDataCitations(webData);
      return html;
    }

    // 5. Metaphor & Symbolism Query
    if (q.includes('ẩn dụ') || q.includes('biểu tượng') || q.includes('hình ảnh') || q.includes('chiên') || q.includes('nho') || q.includes('hạt giống') || q.includes('muối')) {
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
      return html;
    }

    // 6. Practical Life Application Query
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
      return html;
    }

    // 7. General Intelligent Response with Copilot Action Bar
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
      <div class="theological-masterclass-card animate-fade-in">
        ${actionBadge}
        <div class="masterclass-header">
          <span class="badge-gold">TRỢ LÝ THẦN HỌC BEREA AI COPILOT</span>
          <h4 style="color: var(--accent-gold); margin: 0.3rem 0;">TRA CỨU: "${question}"</h4>
        </div>
        <p><strong>Bối cảnh phân đoạn hiện tại:</strong> ${ref} (${bookName} đoạn ${chapterNum})</p>
        <p>
          Thắc mắc của bạn chạm đến chiều sâu thần học của Kinh Thánh. Dưới sự soi dẫn của <strong>Đức Chúa Trời là Tác Giả Tối Thượng</strong>, các <strong>trước giả</strong> Thánh Kinh luôn hướng toàn bộ mạch văn về sự vinh hiển của Chúa Cứu Thế Giê-xu.
        </p>
        <div style="background: rgba(255,255,255,0.03); padding: 0.6rem; border-radius: 6px; margin: 0.5rem 0;">
          💡 <em>Lời khuyên tra cứu Berea:</em> Bạn có thể ra lệnh trực tiếp cho AI quản trị trang web bằng cách gõ: <code>mở sách Giô-na 1</code>, <code>chuyển sang Giô-suê 24</code>, <code>đối chiếu bản Ê-đê và KJV</code>, hoặc <code>đổi giao diện tối</code>.
        </div>
        <div class="copilot-action-bar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.8rem;">
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="JON" data-chapter="1" style="background: var(--accent-gold); color: #121212; border: none; font-weight: 700; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-book-open"></i> Mở Giô-na 1
          </button>
          <button class="copilot-action-btn btn-sm" data-action="navigate" data-book="JOS" data-chapter="24" style="background: rgba(255,255,255,0.06); border: 1px solid var(--accent-gold-border); color: var(--accent-gold); font-weight: 600; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-columns"></i> Mở Giô-suê 24
          </button>
          <button class="copilot-action-btn btn-sm" data-action="compare" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: var(--text-primary); font-weight: 600; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer;">
            <i class="fa-solid fa-sliders"></i> Mở Đối Chiếu Bản Dịch
          </button>
        </div>
      </div>
    `;

    if (webData) {
      html += this.formatWebDataCitations(webData);
    }

    return html;
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

  // OpenAI ChatGPT Integration
  async queryOpenAI(question, context = {}, webData = null) {
    if (!this.apiKey) {
      throw new Error('Chưa cấu hình OpenAI API Key.');
    }

    const webContext = webData
      ? `\nDữ liệu tra cứu trực tuyến mới nhất từ không gian mạng:\n` + webData.map(w => `- ${w.title}: ${w.snippet}`).join('\n')
      : '';

    const systemPrompt = `Bạn là Trợ Lý Thần Học Kinh Thánh cao cấp kiêm AI Copilot của hệ thống Logos MultiVerse.
QUY TẮC BẮT BUỘC VỀ ĐỨC TIN:
1. Những người viết sách Kinh Thánh (Môi-se, Đa-vít, Phao-lô, Giăng, Giô-na...) BẮT BUỘC gọi là "Trước giả".
2. Chỉ mỗi Đức Chúa Trời là "Tác Giả Tối Thượng" soi dẫn Thánh Kinh.
3. Giải thích Lời Chúa cách trung thực, sâu sắc, tôn trọng chân lý Kinh Thánh dựa trên nguyên tắc "Kinh Thánh tự giải nghĩa Kinh Thánh", kết hợp phân tích nguyên ngữ Hy Lạp (Koine Greek) / Hê-bơ-rơ (Biblical Hebrew) kèm mã Strong's, bối cảnh lịch sử Cận Đông cổ đại, hình bóng Đấng Christ trong Tân Ước và bài học thực tiễn.
Văn phong trang trọng, ân cần, uyên bác, định dạng Markdown rõ ràng.
Bối cảnh phân đoạn hiện tại: Sách ${context.book || 'Giăng'}, Đoạn ${context.chapter || 1}, Câu ${context.verse || 1}.${webContext}`;

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
    let text = data.choices[0].message.content;

    if (webData) {
      text += this.formatWebDataCitations(webData);
    }
    return text;
  }

  // Master ask dispatch (Web Live Search + Deep Theological Synthesis + Copilot Action Dispatch)
  async ask(question, context = {}) {
    let webData = null;

    if (this.isWebSearchEnabled) {
      try {
        webData = await this.searchOnlineWeb(question);
      } catch (e) {
        console.warn('Online web search skipped:', e);
      }
    }

    if (this.apiKey) {
      try {
        return await this.queryOpenAI(question, context, webData);
      } catch (e) {
        console.warn('OpenAI query failed, falling back to autonomous theology engine:', e);
        return this.queryOfflineTheology(question, context, webData) + `
          <div style="font-size: 0.74rem; color: var(--status-warning); margin-top: 0.5rem;">
            <i class="fa-solid fa-triangle-exclamation"></i> Đã tự động chuyển sang Trợ Lý Thần Học Độc Lập do sự cố kết nối API (${e.message}).
          </div>
        `;
      }
    } else {
      return this.queryOfflineTheology(question, context, webData);
    }
  }

  // Render AI Chat Interface for Drawer Inspector
  renderAIChatHTML(context = {}) {
    const prompts = this.getSuggestedPrompts(context.ref || 'Giăng 1:1', { name_vi: context.book || 'Giăng', id: 'JHN' });
    const promptsHTML = prompts.map(p =>
      `<button class="suggested-prompt-chip" data-prompt="${p}">${p}</button>`
    ).join('');

    return `
      <div class="ai-chat-container animate-fade-in">
        <div class="metaphor-card" style="padding: 1rem; border-color: var(--accent-gold-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
            <span style="font-weight: 700; color: var(--accent-gold); font-size: 0.88rem; display: flex; align-items: center; gap: 0.35rem;">
              <i class="fa-solid fa-robot"></i> TRỢ LÝ THẦN HỌC BEREA AI COPILOT
              <span class="online-indicator" title="Sẵn sàng tra cứu không gian mạng" style="font-size: 0.7rem; color: #58a6ff; font-weight: normal; margin-left: 0.3rem;">
                <span class="online-dot"></span> Live Web
              </span>
            </span>
            <div style="display: flex; gap: 0.35rem;">
              <button id="ai-web-search-toggle-btn" class="btn-sm" style="background: ${this.isWebSearchEnabled ? 'rgba(88, 166, 255, 0.15)' : 'transparent'}; border: 1px solid ${this.isWebSearchEnabled ? '#58a6ff' : 'var(--border-medium)'}; color: ${this.isWebSearchEnabled ? '#58a6ff' : 'var(--text-muted)'}; font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;">
                <i class="fa-solid fa-globe"></i> ${this.isWebSearchEnabled ? 'Web: BẬT' : 'Web: TẮT'}
              </button>
              <button id="ai-configure-key-btn" style="background: transparent; border: 1px solid var(--border-medium); color: var(--text-muted); font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer;">
                <i class="fa-solid fa-key"></i> ${this.apiKey ? 'Đã có Key' : 'Thêm ChatGPT Key'}
              </button>
            </div>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.4rem;">
            Trợ lý thần học thông minh: Tra cứu nhân vật, giáo lý, bối cảnh, từ gốc Hy Lạp/Hê-bơ-rơ và tự động điều khiển trang web theo lệnh của bạn.
          </p>
          <div class="ai-prompts-row">${promptsHTML}</div>
        </div>

        <div id="ai-messages-list" class="ai-messages-list">
          <div class="ai-message assistant">
            <i class="fa-solid fa-dove" style="color: var(--accent-gold); margin-top: 2px;"></i>
            <div>
              Chào bạn! Tôi là <strong>Trợ Lý Thần Học Berea AI Copilot</strong> của Logos MultiVerse. Bạn có thể hỏi tôi bất kỳ điều gì về nhân vật (VD: <em>"Giô-na là ai?"</em>, <em>"Kể về Môi-se"</em>), hoặc ra lệnh cho tôi quản trị trang web (VD: <em>"Mở sách Giô-suê 24"</em>, <em>"Bật đối chiếu bản Ê-đê và KJV"</em>).
            </div>
          </div>
        </div>

        <div class="ai-input-wrapper">
          <input type="text" id="ai-user-query-input" class="ai-input-box" placeholder="Hỏi nhân vật, từ gốc, hoặc ra lệnh 'Mở Giô-na 1'...">
          <button id="ai-send-btn" class="btn-primary" style="padding: 0.65rem 1rem; border-radius: 20px;" title="Gửi câu hỏi hoặc mệnh lệnh">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    `;
  }
}

export const aiAssistant = new AIAssistant();
