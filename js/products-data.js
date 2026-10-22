// ==================== TẠP HÓA 23 - Product Data ====================
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Tài Khoản Liên Quân Mobile - Rank Cao Thủ",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 85000,
    originalPrice: 150000,
    rating: 4.8,
    reviews: 234,
    badge: "Hot",
    icon: "⚔️",
    description: "Tài khoản Liên Quân Mobile rank Cao Thủ, có nhiều tướng và trang phục hiếm. Đảm bảo chưa qua tay người khác.",
    stock: 15,
    sold: 512,
    isFlashSale: true
  },
  {
    id: 2,
    name: "Tài Khoản PUBG PC - Level 60+ Nhiều Skin",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 120000,
    originalPrice: 200000,
    rating: 4.7,
    reviews: 189,
    badge: "Sale",
    icon: "🎯",
    description: "Tài khoản PUBG PC level 60+, có hàng trăm skin vũ khí và nhân vật hiếm. Rank Bạch Kim mùa trước.",
    stock: 8,
    sold: 301,
    isFlashSale: false
  },
  {
    id: 3,
    name: "Key Steam Random AAA Game",
    category: "key-game",
    categoryLabel: "Key Game",
    price: 25000,
    originalPrice: 50000,
    rating: 4.5,
    reviews: 876,
    badge: "Hot",
    icon: "🔑",
    description: "Key Steam ngẫu nhiên game AAA. Có thể là GTA V, RDR2, Cyberpunk 2077, Elden Ring... Hoàn tiền nếu trùng.",
    stock: 500,
    sold: 2341,
    isFlashSale: true
  },
  {
    id: 4,
    name: "Tài Khoản Free Fire - Có Nhiều Vật Phẩm",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 55000,
    originalPrice: 90000,
    rating: 4.6,
    reviews: 445,
    badge: "Sale",
    icon: "🔥",
    description: "Tài khoản Free Fire với nhiều skin súng xịn, nhân vật và pet hiếm. Rank Kim Cương mùa trước.",
    stock: 23,
    sold: 789,
    isFlashSale: false
  },
  {
    id: 5,
    name: "Key Windows 11 Pro - Bản Quyền Vĩnh Viễn",
    category: "software",
    categoryLabel: "Phần Mềm",
    price: 45000,
    originalPrice: 80000,
    rating: 4.9,
    reviews: 1203,
    badge: "Best",
    icon: "💻",
    description: "Key Windows 11 Pro bản quyền vĩnh viễn. Kích hoạt ngay lập tức. Hỗ trợ kỹ thuật 24/7.",
    stock: 1000,
    sold: 5621,
    isFlashSale: false
  },
  {
    id: 6,
    name: "Tài Khoản Netflix Premium 1 Tháng",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 35000,
    originalPrice: 60000,
    rating: 4.7,
    reviews: 2341,
    badge: "Hot",
    icon: "🎬",
    description: "Tài khoản Netflix Premium 4K. Xem không giới hạn trên tất cả thiết bị. Đảm bảo đủ 30 ngày.",
    stock: 200,
    sold: 8901,
    isFlashSale: true
  },
  {
    id: 7,
    name: "Key Adobe Photoshop 2025 - 1 Năm",
    category: "software",
    categoryLabel: "Phần Mềm",
    price: 99000,
    originalPrice: 180000,
    rating: 4.8,
    reviews: 567,
    badge: "New",
    icon: "🎨",
    description: "Bản quyền Adobe Photoshop 2025 sử dụng 1 năm. Đầy đủ tính năng AI Generative Fill mới nhất.",
    stock: 50,
    sold: 234,
    isFlashSale: false
  },
  {
    id: 8,
    name: "Gift Code Garena 50.000đ",
    category: "giftcode",
    categoryLabel: "Gift Code",
    price: 47000,
    originalPrice: 50000,
    rating: 5.0,
    reviews: 3456,
    badge: "Hot",
    icon: "🎁",
    description: "Gift Code Garena mệnh giá 50.000đ. Dùng được cho Liên Quân, Free Fire, FIFA Online 4...",
    stock: 300,
    sold: 12345,
    isFlashSale: true
  },
  {
    id: 9,
    name: "Tài Khoản Spotify Premium - 3 Tháng",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 55000,
    originalPrice: 90000,
    rating: 4.8,
    reviews: 1789,
    badge: "Sale",
    icon: "🎵",
    description: "Tài khoản Spotify Premium nghe nhạc không quảng cáo 3 tháng. Chất lượng âm thanh cao nhất.",
    stock: 150,
    sold: 4523,
    isFlashSale: false
  },
  {
    id: 10,
    name: "Tài Khoản Valorant - Nhiều Skin Hiếm",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 200000,
    originalPrice: 350000,
    rating: 4.9,
    reviews: 345,
    badge: "Hot",
    icon: "🎮",
    description: "Tài khoản Valorant rank Vàng với bộ sưu tập skin Phantom, Vandal, Operator hiếm nhất.",
    stock: 5,
    sold: 89,
    isFlashSale: true
  },
  {
    id: 11,
    name: "Key Microsoft Office 2021 Pro Plus",
    category: "software",
    categoryLabel: "Phần Mềm",
    price: 89000,
    originalPrice: 150000,
    rating: 4.9,
    reviews: 2567,
    badge: "Best",
    icon: "📊",
    description: "Key Office 2021 Pro Plus bản quyền vĩnh viễn. Bao gồm Word, Excel, PowerPoint, Outlook...",
    stock: 500,
    sold: 7890,
    isFlashSale: false
  },
  {
    id: 12,
    name: "Tài Khoản YouTube Premium - 1 Tháng",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 30000,
    originalPrice: 59000,
    rating: 4.7,
    reviews: 891,
    badge: "Sale",
    icon: "▶️",
    description: "YouTube Premium xem video không quảng cáo, nghe nhạc YouTube Music. Bao gồm cả gia đình.",
    stock: 100,
    sold: 2341,
    isFlashSale: false
  },
  {
    id: 13,
    name: "Gift Code VNG 100.000đ",
    category: "giftcode",
    categoryLabel: "Gift Code",
    price: 95000,
    originalPrice: 100000,
    rating: 5.0,
    reviews: 4512,
    badge: "Hot",
    icon: "🎮",
    description: "Gift Code VNG mệnh giá 100.000đ. Dùng được cho Garena và các game VNG khác.",
    stock: 200,
    sold: 18920,
    isFlashSale: true
  },
  {
    id: 14,
    name: "Tài Khoản Liên Minh Huyền Thoại - Full Tướng",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 75000,
    originalPrice: 130000,
    rating: 4.6,
    reviews: 678,
    badge: "Sale",
    icon: "🏆",
    description: "Tài khoản LMHT server VN có đủ tướng, nhiều skin hiếm. Rank Bạc mùa trước. Có thể đổi tên.",
    stock: 12,
    sold: 456,
    isFlashSale: false
  },
  {
    id: 15,
    name: "Key Minecraft Java Edition",
    category: "key-game",
    categoryLabel: "Key Game",
    price: 150000,
    originalPrice: 250000,
    rating: 4.8,
    reviews: 1234,
    badge: "Hot",
    icon: "⛏️",
    description: "Key Minecraft Java Edition bản quyền vĩnh viễn. Chơi đầy đủ multiplayer, mod. Không bị ban.",
    stock: 30,
    sold: 1567,
    isFlashSale: false
  },
  {
    id: 16,
    name: "Tài Khoản Disney+ Premium",
    category: "game-account",
    categoryLabel: "Tài Khoản Game",
    price: 40000,
    originalPrice: 70000,
    rating: 4.7,
    reviews: 567,
    badge: "New",
    icon: "🏰",
    description: "Tài khoản Disney+ Premium xem Marvel, Star Wars, Pixar 4K. Thời hạn 1 tháng.",
    stock: 80,
    sold: 1234,
    isFlashSale: false
  },
  {
    id: 17,
    name: "Gift Code Mobile Legends - 250 Diamonds",
    category: "giftcode",
    categoryLabel: "Gift Code",
    price: 50000,
    originalPrice: 65000,
    rating: 4.8,
    reviews: 2341,
    badge: "Sale",
    icon: "💎",
    description: "Gift Code Mobile Legends 250 Diamonds. Nạp trực tiếp vào game, nhận ngay lập tức.",
    stock: 400,
    sold: 8901,
    isFlashSale: true
  },
  {
    id: 18,
    name: "Key CS2 Prime Status",
    category: "key-game",
    categoryLabel: "Key Game",
    price: 65000,
    originalPrice: 120000,
    rating: 4.5,
    reviews: 890,
    badge: "Hot",
    icon: "🔫",
    description: "Key CS2 Prime Status nâng cấp tài khoản. Giảm thiểu hacker, nhận drop xịn hơn.",
    stock: 45,
    sold: 2345,
    isFlashSale: false
  },
  {
    id: 19,
    name: "Tài Khoản Call of Duty Mobile - VIP",
    category: "game-mobile",
    categoryLabel: "Game Mobile",
    price: 45000,
    originalPrice: 80000,
    rating: 4.6,
    reviews: 456,
    badge: "Sale",
    icon: "🪖",
    description: "Tài khoản CoD Mobile VIP có nhiều operator skin, blueprint súng hiếm. Rank Legend.",
    stock: 18,
    sold: 567,
    isFlashSale: false
  },
  {
    id: 20,
    name: "Tài Khoản Genshin Impact - AR 50+",
    category: "game-mobile",
    categoryLabel: "Game Mobile",
    price: 180000,
    originalPrice: 300000,
    rating: 4.9,
    reviews: 1234,
    badge: "Hot",
    icon: "✨",
    description: "Tài khoản Genshin Impact AR 50+ có nhiều character 5 sao hiếm. Kho nguyên thạch đầy.",
    stock: 6,
    sold: 234,
    isFlashSale: true
  },
  {
    id: 21,
    name: "Key Elden Ring - Steam",
    category: "key-game",
    categoryLabel: "Key Game",
    price: 350000,
    originalPrice: 550000,
    rating: 4.9,
    reviews: 789,
    badge: "New",
    icon: "🏺",
    description: "Key Elden Ring Steam bản quyền. Game nhập vai hành động đỉnh cao của FromSoftware.",
    stock: 20,
    sold: 456,
    isFlashSale: false
  },
  {
    id: 22,
    name: "Vật Phẩm DOTA 2 - Arcana Set",
    category: "item-game",
    categoryLabel: "Vật Phẩm Game",
    price: 95000,
    originalPrice: 180000,
    rating: 4.7,
    reviews: 234,
    badge: "Rare",
    icon: "🗡️",
    description: "Set Arcana hiếm cho hero trong DOTA 2. Có hiệu ứng đặc biệt, animation riêng.",
    stock: 10,
    sold: 123,
    isFlashSale: false,
    features: [
      "Set Arcana chính chủ trade qua Steam",
      "Hiệu ứng kỹ năng và âm thanh độc quyền",
      "Giao dịch nhanh qua Steam Trade Offer",
      "Bảo hành trọn đời không thu hồi"
    ],
    instructions: "1. Cung cấp Steam Trade URL của bạn khi đặt hàng.\n2. Đảm bảo tài khoản Steam của bạn đã bật Steam Guard trên 15 ngày.\n3. Chấp nhận đề nghị trao đổi từ bot hệ thống trong vòng 5 phút.\n4. Vào game DOTA 2 và trang bị Arcana ngay lập tức!",
    warranty: "Bảo hành vĩnh viễn không bao giờ bị thu hồi hay lỗi trade."
  },
  // ===== THẺ GARENA =====
  {
    id: 23,
    name: "Thẻ Garena 20.000đ - Nạp Sò & Quân Huy",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 19400,
    originalPrice: 20000,
    rating: 4.9,
    reviews: 1850,
    badge: "Sale",
    icon: "🎟️",
    description: "Thẻ Garena 20.000đ nạp Liên Quân Mobile, Free Fire, FC Online... Nhận 40 Sò hoặc 40 Quân Huy / Kim Cương. Giao mã tự động 3 giây.",
    longDescription: "Thẻ Garena mệnh giá 20.000đ do Công ty Cổ phần Phát triển Thể thao Điện tử Việt Nam (Garena) phát hành. Thẻ dùng để nạp Sò cho tài khoản Garena hoặc nạp trực tiếp vào các tựa game đình đám như Liên Quân Mobile, Free Fire, FC Online (FIFA Online 4), Blade & Soul, Cái Thế Tranh Hùng... Sau khi thanh toán, hệ thống Tạp Hóa 23 sẽ tự động cấp mã thẻ (PIN) và số Seri ngay trên màn hình và gửi sao lưu vào email của bạn.",
    stock: 250,
    sold: 8420,
    isFlashSale: false,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Chiết khấu ưu đãi cực tốt, rẻ hơn mua trực tiếp",
      "Nhận ngay 40 Sò / 40 Quân Huy / 40 Kim Cương",
      "Giao mã thẻ (PIN & Seri) tức thì qua hệ thống tự động",
      "Nạp 100% chuẩn tại trang web chính thức napthe.vn"
    ],
    instructions: "1. Truy cập trang nạp thẻ chính thức của Garena: https://napthe.vn\n2. Đăng nhập tài khoản Garena hoặc tài khoản game (Facebook / Apple ID / Google).\n3. Chọn tựa game bạn muốn nạp (Liên Quân Mobile, Free Fire, FC Online...).\n4. Chọn phương thức thanh toán là 'Thẻ Garena'.\n5. Nhập chính xác Mã nạp (PIN) và Số Seri bạn nhận được từ Tạp Hóa 23.\n6. Nhấn 'Xác nhận' để hoàn tất. Sò hoặc vật phẩm sẽ được cộng vào game ngay lập tức!",
    warranty: "Cam kết thẻ mới 100% chưa qua sử dụng từ đại lý phân phối chính thức Garena. Bảo hành 1 đổi 1 hoặc hoàn tiền 100% trong vòng 24h nếu mã thẻ gặp lỗi kỹ thuật."
  },
  {
    id: 24,
    name: "Thẻ Garena 50.000đ - Chiết Khấu Cao",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 48000,
    originalPrice: 50000,
    rating: 4.9,
    reviews: 3410,
    badge: "Hot",
    icon: "🎟️",
    description: "Thẻ Garena 50.000đ chiết khấu 4%. Quy đổi 100 Sò, 105 Quân Huy Liên Quân hoặc 105 Kim Cương Free Fire. Nhận mã thẻ tức thì.",
    longDescription: "Thẻ Garena mệnh giá 50.000đ là lựa chọn phổ biến nhất của các game thủ Liên Quân và Free Fire để nạp Thẻ Vô Cực hoặc Sổ Sứ Mệnh. Mua tại Tạp Hóa 23 bạn được hưởng mức giá ưu đãi chỉ 48.000đ, tiết kiệm ngay 4%. Mã được sinh từ kho tự động, đảm bảo giao hàng trong 3 giây kể cả nửa đêm.",
    stock: 400,
    sold: 16800,
    isFlashSale: true,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Quy đổi: 100 Sò | 105 Quân Huy Liên Quân | 105 Kim Cương Free Fire",
      "Đủ mua Sổ Sứ Mệnh / Vé Tháng ưu đãi",
      "Hệ thống kho thẻ tự động 24/7",
      "Đổi trả 1-1 nhanh chóng nếu phát sinh sự cố"
    ],
    instructions: "1. Đăng nhập https://napthe.vn\n2. Chọn tựa game cần nạp và phương thức 'Thẻ Garena'\n3. Điền mã PIN & Seri được cung cấp\n4. Kiểm tra tài khoản trong game để nhận Sò/Quân Huy/Kim Cương.",
    warranty: "Bảo hành 100% thẻ sạch, nguồn gốc xuất xứ rõ ràng từ đại lý ủy quyền Garena."
  },
  {
    id: 25,
    name: "Thẻ Garena 100.000đ - Mệnh Giá Bán Chạy Nhất",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 95000,
    originalPrice: 100000,
    rating: 5.0,
    reviews: 7850,
    badge: "Best",
    icon: "🎟️",
    description: "Thẻ Garena mệnh giá 100.000đ chiết khấu 5%. Quy đổi 200 Sò, 210 Quân Huy, 210 Kim Cương. Mệnh giá bán chạy nhất tuần.",
    longDescription: "Thẻ Garena 100.000đ là mệnh giá bán chạy số 1 tại Tạp Hóa 23. Khi nạp vào game, bạn sẽ nhận được 200 Sò hoặc 210 Quân Huy Liên Quân Mobile, 210 Kim Cương Free Fire hoặc 200 FC trong FC Online. Mức chiết khấu 5% giúp bạn tiết kiệm ngay 5.000đ cho mỗi lần nạp, cực kỳ kinh tế khi nạp sự kiện hoặc săn trang phục hiếm.",
    stock: 650,
    sold: 34200,
    isFlashSale: true,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Chiết khấu tối đa 5% - Tiết kiệm 5.000đ trực tiếp",
      "Quy đổi: 200 Sò | 210 Quân Huy | 210 Kim Cương | 200 FC",
      "Mã mới 100% chưa qua kích hoạt",
      "Nhận ngay sau 3 giây từ cổng thanh toán tự động"
    ],
    instructions: "1. Truy cập cổng napthe.vn\n2. Đăng nhập tài khoản game muốn nạp\n3. Chọn biểu tượng Thẻ Garena\n4. Nhập mã thẻ và số Seri từ Tạp Hóa 23\n5. Nhấn 'Xác nhận' là bạn đã hoàn tất nạp 200 Sò!",
    warranty: "Bảo hành 1 đổi 1 tức thì nếu thẻ lỗi hoặc sai mã. Hoàn tiền 100% nếu không nạp được."
  },
  {
    id: 26,
    name: "Thẻ Garena 200.000đ - Tiết Kiệm Tối Đa",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 190000,
    originalPrice: 200000,
    rating: 4.9,
    reviews: 2890,
    badge: "Sale",
    icon: "🎟️",
    description: "Thẻ Garena 200.000đ chiết khấu 5% cực sâu. Nhận 400 Sò, 425 Quân Huy, 425 Kim Cương. Dành cho game thủ nạp sự kiện lớn.",
    longDescription: "Thẻ Garena 200.000đ phù hợp cho người chơi cần nạp số lượng lớn để tham gia các sự kiện vòng quay trang phục bậc SSS, nâng cấp thẻ mùa giải mới hoặc nạp gói nạp tích lũy. Giá chỉ 190.000đ, tiết kiệm ngay 10.000đ tiền mặt so với mệnh giá gốc.",
    stock: 220,
    sold: 11400,
    isFlashSale: false,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Quy đổi: 400 Sò | 425 Quân Huy | 425 Kim Cương",
      "Tiết kiệm ngay 10.000đ tiền mặt",
      "Nhận mã PIN & Seri tự động trong 3 giây",
      "Hỗ trợ kiểm tra lịch sử nạp trực tuyến"
    ],
    instructions: "1. Truy cập website napthe.vn\n2. Chọn tựa game muốn nạp\n3. Nhập số Seri và Mã PIN từ đơn hàng\n4. Xác nhận và mở game để kiểm tra số dư.",
    warranty: "Cam kết 100% mã thẻ sạch, chính hãng từ NPH Garena Việt Nam."
  },
  {
    id: 27,
    name: "Thẻ Garena 500.000đ - VIP Game Thủ",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 475000,
    originalPrice: 500000,
    rating: 5.0,
    reviews: 1920,
    badge: "Hot",
    icon: "🎟️",
    description: "Thẻ Garena 500.000đ nhận 1.000 Sò hoặc 1.070 Quân Huy/Kim Cương. Tiết kiệm ngay 25.000đ. Nhận mã ngay lập tức.",
    longDescription: "Thẻ Garena 500.000đ là gói thẻ lớn dành cho các cao thủ, bang hội hoặc streamer cần nạp lượng lớn Quân Huy, Kim Cương hoặc FC. Tiết kiệm ngay 25.000đ chỉ trong một cú click chuột. Bạn sẽ nhận được 1.000 Sò hoặc 1.070 Quân Huy/Kim Cương cùng đầy đủ mốc quà nạp tích lũy của nhà phát hành.",
    stock: 140,
    sold: 7200,
    isFlashSale: true,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Quy đổi: 1.000 Sò | 1.070 Quân Huy | 1.070 Kim Cương | 1.000 FC",
      "Tiết kiệm khủng 25.000đ cho mỗi mã thẻ",
      "Đủ điều kiện nhận toàn bộ mốc nạp sự kiện VIP",
      "Bảo hành tuyệt đối an toàn 100%"
    ],
    instructions: "1. Vào cổng napthe.vn bằng tài khoản Garena\n2. Nhập mã thẻ và số Seri được gửi tới bạn\n3. Bấm xác nhận, nhận 1.000 Sò trong vòng 1 giây.",
    warranty: "Bảo hành 1 đổi 1 trong vòng 24 giờ. Hỗ trợ khách hàng ưu tiên 24/7."
  },
  {
    id: 28,
    name: "Thẻ Garena 1.000.000đ - Gói Đại Gia",
    category: "the-garena",
    categoryLabel: "Thẻ Garena",
    price: 950000,
    originalPrice: 1000000,
    rating: 5.0,
    reviews: 890,
    badge: "Best",
    icon: "🎟️",
    description: "Thẻ Garena 1.000.000đ chiết khấu cao nhất, nhận 2.000 Sò / 2.150 Quân Huy. Tiết kiệm ngay 50.000đ.",
    longDescription: "Mệnh giá Thẻ Garena cao nhất 1.000.000đ giúp bạn nạp một lần sở hữu trọn bộ vật phẩm sự kiện, skin Huyền Thoại, Tuyệt Sắc hoặc mở gói thẻ cầu thủ Icon trong FC Online. Tiết kiệm ngay 50.000đ tiền mặt tại Tạp Hóa 23.",
    stock: 60,
    sold: 3410,
    isFlashSale: false,
    denominations: [
      { value: 20000, price: 19400, originalPrice: 20000, label: "20.000đ" },
      { value: 50000, price: 48000, originalPrice: 50000, label: "50.000đ" },
      { value: 100000, price: 95000, originalPrice: 100000, label: "100.000đ" },
      { value: 200000, price: 190000, originalPrice: 200000, label: "200.000đ" },
      { value: 500000, price: 475000, originalPrice: 500000, label: "500.000đ" },
      { value: 1000000, price: 950000, originalPrice: 1000000, label: "1.000.000đ" }
    ],
    features: [
      "Mệnh giá tối đa: 2.000 Sò | 2.150 Quân Huy / Kim Cương",
      "Tiết kiệm cực lớn: 50.000đ / thẻ",
      "Mã thẻ phát hành trực tiếp từ Garena",
      "Được nhân viên hỗ trợ riêng nếu có thắc mắc"
    ],
    instructions: "1. Truy cập https://napthe.vn\n2. Đăng nhập tài khoản và chọn tựa game\n3. Điền Seri & PIN để hoàn tất.",
    warranty: "Cam kết thẻ sạch 100%, bảo hành hoàn tiền hoặc đổi mã mới nếu lỗi."
  },

  // ===== KEY STEAM WALLET =====
  {
    id: 29,
    name: "Key Steam Wallet 40.000đ (~$2 USD) - Region VN/Global",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 42000,
    originalPrice: 48000,
    rating: 4.8,
    reviews: 1420,
    badge: "Sale",
    icon: "🎮",
    description: "Key Steam Wallet nạp 40.000đ (~$2 USD) vào ví Steam. Dùng mua game bản quyền, hòm CS2, battle pass Dota 2. Giao code tức thì.",
    longDescription: "Mã thẻ Steam Wallet (Key Steam Wallet Code) mệnh giá 40.000đ tương đương ~$2 USD. Khi kích hoạt thành công trên Steam, số dư ví Steam của bạn sẽ được cộng trực tiếp 40.000 VNĐ. Tiền trong ví Steam có thể sử dụng vĩnh viễn không hết hạn, dùng để mua mọi trò chơi, gói mở rộng DLC, phần mềm hoặc giao dịch vật phẩm trên Steam Community Market (vũ khí CS2, đồ Dota 2, card game, emoticon...).",
    stock: 350,
    sold: 6200,
    isFlashSale: false,
    denominations: [
      { value: 40000, price: 42000, originalPrice: 48000, label: "40.000đ (~$2)" },
      { value: 100000, price: 105000, originalPrice: 120000, label: "100.000đ (~$5)" },
      { value: 200000, price: 210000, originalPrice: 240000, label: "200.000đ (~$10)" },
      { value: 500000, price: 515000, originalPrice: 580000, label: "500.000đ (~$20)" },
      { value: 1000000, price: 1020000, originalPrice: 1150000, label: "1.000.000đ (~$50)" }
    ],
    features: [
      "Nạp tiền an toàn 100% trực tiếp vào ví Steam của bạn",
      "Mã key chính hãng từ Valve Corporation, không sợ âm tiền / lock acc",
      "Kích hoạt được trên cả tài khoản Steam vùng Việt Nam và Quốc Tế",
      "Tự động giao mã 15 ký tự ngay sau khi thanh toán"
    ],
    instructions: "1. Mở phần mềm Steam trên máy tính hoặc truy cập: https://store.steampowered.com/account/redeemwalletcode\n2. Đăng nhập vào tài khoản Steam của bạn.\n3. Điền mã Steam Wallet Code (gồm 15 ký tự chữ và số) mà bạn nhận được từ Tạp Hóa 23 vào ô 'Steam Wallet Code'.\n4. Nhấn nút 'Continue' (Tiếp tục).\n5. Số dư ví Steam của bạn sẽ tăng thêm 40.000đ ngay lập tức!",
    warranty: "Bảo hành 1 đổi 1 trong 24h đối với key chưa sử dụng. Cam kết nguồn tiền sạch 100%, bảo đảm an toàn cho tài khoản Steam của bạn."
  },
  {
    id: 30,
    name: "Key Steam Wallet 100.000đ (~$5 USD) - Nạp Siêu Tốc",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 105000,
    originalPrice: 120000,
    rating: 4.9,
    reviews: 4250,
    badge: "Hot",
    icon: "🎮",
    description: "Mã ví Steam Wallet 100.000đ (~$5 USD). Thích hợp mua game indie, mở hòm CS2, nạp battle pass Dota 2. Giao tức thì trong 3s.",
    longDescription: "Mã nạp ví Steam Wallet 100.000đ là lựa chọn lý tưởng cho các game thủ muốn sắm những tựa game độc lập xuất sắc (Hollow Knight, Celeste, Stardew Valley, Terraria...), mua chìa khóa hòm CS2 hoặc nạp battle pass. Mã kích hoạt tiện lợi không cần thẻ tín dụng quốc tế Visa/MasterCard.",
    stock: 450,
    sold: 19800,
    isFlashSale: true,
    denominations: [
      { value: 40000, price: 42000, originalPrice: 48000, label: "40.000đ (~$2)" },
      { value: 100000, price: 105000, originalPrice: 120000, label: "100.000đ (~$5)" },
      { value: 200000, price: 210000, originalPrice: 240000, label: "200.000đ (~$10)" },
      { value: 500000, price: 515000, originalPrice: 580000, label: "500.000đ (~$20)" },
      { value: 1000000, price: 1020000, originalPrice: 1150000, label: "1.000.000đ (~$50)" }
    ],
    features: [
      "Cộng đúng 100.000 VNĐ vào ví Steam",
      "Được cộng điểm thưởng Steam Points để đổi avatar động, khung trang trí",
      "Kích hoạt nhanh trong 1 phút",
      "Kho mã tự động cập nhật liên tục"
    ],
    instructions: "1. Vào menu Steam > Games > 'Redeem a Steam Wallet Code'\n2. Nhập mã key 15 ký tự nhận được\n3. Nhấn Tiếp tục để nạp tiền vào ví\n4. Mở Steam Store và thoải mái mua sắm game!",
    warranty: "Bảo hành 1 đổi 1 hoặc hoàn tiền 100% nếu mã key không hợp lệ hoặc đã qua sử dụng."
  },
  {
    id: 31,
    name: "Key Steam Wallet 200.000đ (~$10 USD) - Mua Game Bom Tấn",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 210000,
    originalPrice: 240000,
    rating: 4.9,
    reviews: 5890,
    badge: "Best",
    icon: "🎮",
    description: "Mã ví Steam Wallet 200.000đ (~$10 USD). Mệnh giá lý tưởng để tậu game bom tấn mùa Steam Sale, mở khóa chợ Community Market.",
    longDescription: "Với 200.000 VNĐ trong ví Steam, bạn sẵn sàng 'hốt trọn' các tựa game nổi tiếng trong các đợt Steam Summer Sale, Autumn Sale, Winter Sale với mức giảm tới 75% - 90% (The Witcher 3, GTA V, Monster Hunter: World, Resident Evil, Assassin's Creed...). Đặc biệt, nạp trên $5 (khoảng 120.000đ) sẽ mở khóa toàn diện tài khoản Steam bị giới hạn (Limited User Account) để kết bạn và dùng chợ.",
    stock: 380,
    sold: 24600,
    isFlashSale: true,
    denominations: [
      { value: 40000, price: 42000, originalPrice: 48000, label: "40.000đ (~$2)" },
      { value: 100000, price: 105000, originalPrice: 120000, label: "100.000đ (~$5)" },
      { value: 200000, price: 210000, originalPrice: 240000, label: "200.000đ (~$10)" },
      { value: 500000, price: 515000, originalPrice: 580000, label: "500.000đ (~$20)" },
      { value: 1000000, price: 1020000, originalPrice: 1150000, label: "1.000.000đ (~$50)" }
    ],
    features: [
      "Mở khóa tài khoản Steam Limited (cho phép kết bạn, tham gia chợ Steam)",
      "Cộng 200.000 VNĐ vào ví Steam ngay lập tức",
      "Tặng thêm ~800 điểm Steam Points",
      "Bảo đảm an toàn tuyệt đối 100% tài khoản"
    ],
    instructions: "1. Truy cập store.steampowered.com/account/redeemwalletcode\n2. Nhập mã thẻ và nhấn Continue\n3. Tiền vào ví ngay, không cần xác minh thẻ ngân hàng.",
    warranty: "Cam kết mã sạch 100% từ đối tác ủy quyền Valve. Hỗ trợ kích hoạt trọn đời."
  },
  {
    id: 32,
    name: "Key Steam Wallet 500.000đ (~$20 USD) - Game AAA Đỉnh Cao",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 515000,
    originalPrice: 580000,
    rating: 5.0,
    reviews: 3120,
    badge: "Hot",
    icon: "🎮",
    description: "Key nạp Steam Wallet 500.000đ. Đủ để mua các siêu phẩm AAA như Black Myth Wukong, Elden Ring, Cyberpunk 2077, God of War...",
    longDescription: "Mã ví Steam Wallet 500.000đ đem lại trải nghiệm mua sắm game không giới hạn. Mua ngay các tựa game đình đám vừa ra mắt hoặc các gói Season Pass của Call of Duty, Apex Legends, Destiny 2... Không cần thủ tục phức tạp, chỉ cần thanh toán MoMo hoặc chuyển khoản là nhận ngay key sau 3 giây.",
    stock: 210,
    sold: 12900,
    isFlashSale: false,
    denominations: [
      { value: 40000, price: 42000, originalPrice: 48000, label: "40.000đ (~$2)" },
      { value: 100000, price: 105000, originalPrice: 120000, label: "100.000đ (~$5)" },
      { value: 200000, price: 210000, originalPrice: 240000, label: "200.000đ (~$10)" },
      { value: 500000, price: 515000, originalPrice: 580000, label: "500.000đ (~$20)" },
      { value: 1000000, price: 1020000, originalPrice: 1150000, label: "1.000.000đ (~$50)" }
    ],
    features: [
      "Hạn mức 500.000 VNĐ tha hồ mua game AAA",
      "Nhận ngay ~2.000 điểm Steam Points",
      "Giao dịch an toàn, không rủi ro bị khóa nick",
      "Hỗ trợ kỹ thuật nạp mã từ xa 24/7"
    ],
    instructions: "1. Khởi động Steam Client trên PC\n2. Nhấn vào tên bạn ở góc trên bên phải > 'View my wallet'\n3. Chọn 'Redeem a Steam Gift Card or Wallet Code'\n4. Dán mã key và ấn Redeem.",
    warranty: "Bảo hành 1 đổi 1 tức thì nếu phát hiện mã key không hoạt động."
  },
  {
    id: 33,
    name: "Key Steam Wallet 1.000.000đ - VIP Hardcore Gamer",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 1020000,
    originalPrice: 1150000,
    rating: 5.0,
    reviews: 1420,
    badge: "Best",
    icon: "🎮",
    description: "Key nạp Steam Wallet 1.000.000đ. Thỏa sức mua sắm game mới, pre-order game hot nhất năm 2025/2026 và mua dao/găng CS2.",
    longDescription: "Mã ví Steam Wallet 1.000.000đ dành riêng cho các game thủ chuyên nghiệp, nhà sưu tập skin CS2 (dao, găng tay, skin hiếm) hoặc game thủ muốn pre-order các bản Collector / Deluxe Edition của GTA VI, Monster Hunter Wilds, v.v. Tiết kiệm công sức nạp nhiều lần, bảo mật tối đa.",
    stock: 90,
    sold: 5800,
    isFlashSale: true,
    denominations: [
      { value: 40000, price: 42000, originalPrice: 48000, label: "40.000đ (~$2)" },
      { value: 100000, price: 105000, originalPrice: 120000, label: "100.000đ (~$5)" },
      { value: 200000, price: 210000, originalPrice: 240000, label: "200.000đ (~$10)" },
      { value: 500000, price: 515000, originalPrice: 580000, label: "500.000đ (~$20)" },
      { value: 1000000, price: 1020000, originalPrice: 1150000, label: "1.000.000đ (~$50)" }
    ],
    features: [
      "Hạn mức nạp lớn nhất: 1.000.000 VNĐ vào ví Steam",
      "Tặng hơn 4.000 Steam Points đổi đồ trang trí tài khoản",
      "Nạp 1 bước nhận ngay số dư trọn vẹn",
      "Giao dịch bảo mật cấp cao, mã hóa 256-bit"
    ],
    instructions: "1. Truy cập https://store.steampowered.com/account/redeemwalletcode\n2. Nhập mã key 15 ký tự\n3. Bấm xác nhận nạp 1.000.000đ vào ví.",
    warranty: "Bảo hành 1 đổi 1 hoặc hoàn tiền 100% trong 24 giờ. Cam kết uy tín số 1 Việt Nam."
  },
  {
    id: 34,
    name: "Key Steam Wallet $10 USD Global - Nạp Toàn Cầu",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 245000,
    originalPrice: 265000,
    rating: 4.9,
    reviews: 1840,
    badge: "New",
    icon: "💳",
    description: "Thẻ Steam Wallet 10 USD bản Global quốc tế. Tự động quy đổi tỷ giá sang đơn vị tiền tệ tài khoản Steam của bạn (VNĐ, USD, EUR...).",
    longDescription: "Mã Steam Wallet $10 USD Global là phiên bản quốc tế không giới hạn khu vực địa lý. Khi kích hoạt trên tài khoản Việt Nam, Steam sẽ tự động chuyển đổi $10 USD sang khoảng 245.000 - 255.000 VNĐ theo tỷ giá hối đoái hàng ngày của Valve. Kích hoạt được cho mọi tài khoản trên thế giới.",
    stock: 160,
    sold: 7420,
    isFlashSale: false,
    denominations: [
      { value: 245000, price: 245000, originalPrice: 265000, label: "$10 USD" },
      { value: 490000, price: 490000, originalPrice: 530000, label: "$20 USD" },
      { value: 1220000, price: 1220000, originalPrice: 1320000, label: "$50 USD" }
    ],
    features: [
      "Bản Global không khóa vùng, nạp được mọi tài khoản Steam",
      "Tự động chuyển đổi tỷ giá chính xác của Valve",
      "Thích hợp tặng quà bạn bè ở nước ngoài",
      "Giao mã tự động 24/7"
    ],
    instructions: "1. Mở Steam > Games > Redeem a Steam Wallet Code\n2. Nhập mã và bấm Tiếp tục\n3. Steam sẽ hiển thị số tiền quy đổi tương ứng với khu vực tài khoản của bạn.",
    warranty: "Bảo hành mã mới 100% từ nhà phân phối quốc tế."
  },
  {
    id: 35,
    name: "Key Steam Wallet $20 USD Global - Đổi Tỷ Giá Tự Động",
    category: "steam-wallet",
    categoryLabel: "Steam Wallet",
    price: 490000,
    originalPrice: 530000,
    rating: 4.9,
    reviews: 1120,
    badge: "Hot",
    icon: "💳",
    description: "Thẻ Steam Wallet 20 USD Global. Nạp cho mọi tài khoản Steam toàn cầu, quy đổi ~500.000 VNĐ trực tiếp vào ví.",
    longDescription: "Key Steam Wallet $20 USD Global cho phép nạp tiền vào bất kỳ tài khoản Steam nào mà không bị lỗi vùng quốc gia (Region lock). Rất được ưa chuộng bởi những game thủ có tài khoản tạo ở vùng Mỹ, Châu Âu, Nhật Bản hoặc Việt Nam.",
    stock: 110,
    sold: 4320,
    isFlashSale: true,
    denominations: [
      { value: 245000, price: 245000, originalPrice: 265000, label: "$10 USD" },
      { value: 490000, price: 490000, originalPrice: 530000, label: "$20 USD" },
      { value: 1220000, price: 1220000, originalPrice: 1320000, label: "$50 USD" }
    ],
    features: [
      "Kích hoạt toàn cầu không giới hạn IP hay quốc gia",
      "Nhận tương đương ~500.000đ tiền ví Steam",
      "Tích lũy Steam Points đổi skin profile",
      "Giao tự động tức thì"
    ],
    instructions: "1. Đăng nhập Steam Client\n2. Chọn Redeem Steam Wallet Code\n3. Nhập mã 15 ký tự và tận hưởng số dư mới!",
    warranty: "Bảo hành 1 đổi 1 trong 24h đối với key chưa kích hoạt."
  }
];

const DEFAULT_CATEGORIES = [
  {
    id: "all",
    label: "Tất Cả",
    icon: "🏪",
    description: "Toàn bộ các mặt hàng đang có mặt tại Tạp Hóa 23.",
    tags: ["Tất Cả", "Toàn Sàn"]
  },
  {
    id: "the-garena",
    label: "Thẻ Garena",
    icon: "🎟️",
    description: "Nạp Sò, Quân Huy Liên Quân, Kim Cương Free Fire, FC Online giá tốt nhất thị trường. Nhận mã thẻ ngay sau khi thanh toán.",
    tags: ["Liên Quân", "FC Online", "Free Fire", "Chiết khấu cao"]
  },
  {
    id: "steam-wallet",
    label: "Key Steam Wallet",
    icon: "🎮",
    description: "Mã nạp tiền Steam Wallet Code chính hãng khu vực Việt Nam và Toàn Cầu. Tự động quy đổi VND, bảo hành vĩnh viễn.",
    tags: ["Steam Wallet VND", "Global", "Nạp tự động"]
  },
  {
    id: "game-account",
    label: "Tài Khoản Game",
    icon: "🎯",
    description: "Acc Valorant nhiều skin VIP, Acc LMHT full tướng, Acc CS2 Prime, Genshin Impact... Đổi thông tin 100%, bảo hành uy tín.",
    tags: ["Valorant", "LMHT", "CS2 Prime", "Full Thông Tin"]
  },
  {
    id: "key-game",
    label: "Key Game",
    icon: "🔑",
    description: "Key kích hoạt Steam, Epic Games, EA Play bản quyền vĩnh viễn. Đầy đủ các bom tấn AAA, Random Key tỉ lệ trúng game khủng.",
    tags: ["Steam Key", "Game AAA", "Bản quyền 100%"]
  },
  {
    id: "giftcode",
    label: "Gift Code",
    icon: "🎁",
    description: "Discord Nitro, Robux Roblox, Xbox Game Pass, Google Play Gift Card... Mua sắm an toàn, nạp nhanh trong 1 phút.",
    tags: ["Discord Nitro", "Robux", "Xbox Pass"]
  },
  {
    id: "software",
    label: "Phần Mềm",
    icon: "🎬",
    description: "Tài khoản Netflix Premium Ultra HD 4K, Spotify Premium, YouTube Premium, Canva Pro, Windows 11 bản quyền giá siêu tiết kiệm.",
    tags: ["Netflix 4K", "Spotify", "YouTube Premium", "Windows 11"]
  },
  {
    id: "game-mobile",
    label: "Game Mobile",
    icon: "📱",
    description: "Tài khoản và nạp gói cho các game mobile thịnh hành: Genshin Impact, Honkai Star Rail, Tốc Chiến, Free Fire...",
    tags: ["Genshin", "Honkai", "Tốc Chiến"]
  },
  {
    id: "item-game",
    label: "Vật Phẩm Game",
    icon: "🛡️",
    description: "Giao dịch vật phẩm ingame, skin súng, trang phục sự kiện giới hạn với mức giá cạnh tranh và hỗ trợ tận tình.",
    tags: ["Skin Game", "Vật Phẩm", "Tiền Ingame"]
  }
];

let PRODUCTS = [];
let CATEGORIES = [];

// ============================================================================
// REVIEW SERVICE (DATABASE READY ARCHITECTURE)
// ============================================================================
/**
 * Mô hình dữ liệu chuẩn hoá cho Đánh Giá Sản Phẩm (Reviews)
 * Sẵn sàng kết nối trực tiếp với Database Backend (PostgreSQL / MySQL / Supabase / Firebase / Node.js API).
 *
 * Entity Database Schema:
 * ----------------------------------------------------------------------------
 * Table: `product_reviews`
 * Column              Type            Constraint
 * id                  VARCHAR(64)     PRIMARY KEY (UUID / REV-xxx)
 * product_id          INTEGER         NOT NULL (FK -> products.id)
 * user_id             VARCHAR(64)     NULLABLE (FK -> users.username / id)
 * author_name         VARCHAR(128)    NOT NULL
 * author_avatar       VARCHAR(255)    NULLABLE
 * rating              SMALLINT        NOT NULL CHECK (rating BETWEEN 1 AND 5)
 * comment             TEXT            NOT NULL
 * is_verified         BOOLEAN         DEFAULT TRUE
 * status              VARCHAR(24)     DEFAULT 'approved' ('approved', 'pending', 'hidden')
 * created_at          TIMESTAMPTZ     DEFAULT CURRENT_TIMESTAMP
 * updated_at          TIMESTAMPTZ     DEFAULT CURRENT_TIMESTAMP
 * ----------------------------------------------------------------------------
 */

const DEFAULT_SEED_REVIEWS = [
  {
    id: "REV-1001",
    productId: 1,
    userId: "namnh",
    authorName: "Nguyễn Hoàng Nam",
    authorAvatar: "N",
    rating: 5,
    comment: "Giao hàng cực kỳ nhanh, vừa chuyển khoản MoMo xong là web hiện mã thẻ ngay lập tức. Nạp vào game nhận đúng số lượng, chiết khấu rẻ hơn hẳn mua trực tiếp!",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T20:15:00.000Z"
  },
  {
    id: "REV-1002",
    productId: 1,
    userId: "minhtd",
    authorName: "Trần Đức Minh",
    authorAvatar: "T",
    rating: 5,
    comment: "Uy tín 100%, lúc đầu còn hơi lo nhưng nạp thử thẻ 100k vào ngon lành cành đào. Sẽ ủng hộ shop dài dài!",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T17:30:00.000Z"
  },
  {
    id: "REV-1003",
    productId: 1,
    userId: "linhlt",
    authorName: "Lê Thùy Linh",
    authorAvatar: "L",
    rating: 5,
    comment: "Chăm sóc khách hàng siêu nhiệt tình, mình nhập nhầm ký tự được admin hỗ trợ hướng dẫn tận tình trong 2 phút.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-20T11:45:00.000Z"
  },
  {
    id: "REV-1004",
    productId: 2,
    userId: "quanghuy",
    authorName: "Hà Quang Huy",
    authorAvatar: "H",
    rating: 5,
    comment: "Acc PUBG chuẩn mô tả, level cao và nhiều skin hiếm. Đổi pass và mail thành công trong 5 phút. Rất hài lòng!",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T14:10:00.000Z"
  },
  {
    id: "REV-1005",
    productId: 2,
    userId: "tuananh",
    authorName: "Phạm Tuấn Anh",
    authorAvatar: "P",
    rating: 4,
    comment: "Tài khoản chơi mượt, rank Bạch Kim đúng như shop cam kết. Giá hợp lý so với thị trường.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-20T09:40:00.000Z"
  },
  {
    id: "REV-1006",
    productId: 3,
    userId: "duongvu",
    authorName: "Vũ Hải Dương",
    authorAvatar: "V",
    rating: 5,
    comment: "Random trúng ngay Cyberpunk 2077 quá đã anh em ơi! Key kích hoạt phát ăn luôn không cần VPN gì cả.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T16:00:00.000Z"
  },
  {
    id: "REV-1007",
    productId: 3,
    userId: "khanhng",
    authorName: "Nguyễn Duy Khánh",
    authorAvatar: "K",
    rating: 5,
    comment: "Mua lần 2 rồi, nhận key trong 3 giây. Giá 25k mà trúng game AAA quá hời. 10/10 uy tín!",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-20T20:10:00.000Z"
  },
  {
    id: "REV-1008",
    productId: 4,
    userId: "minhquan",
    authorName: "Võ Minh Quân",
    authorAvatar: "Q",
    rating: 5,
    comment: "Nick Free Fire ngon, đúng thông tin đăng bán, có trang phục quỷ kiếm dạ xoa xịn xò.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T18:20:00.000Z"
  },
  {
    id: "REV-1009",
    productId: 5,
    userId: "hoangit",
    authorName: "Đỗ Minh Hoàng",
    authorAvatar: "Đ",
    rating: 5,
    comment: "Key Win 11 Pro kích hoạt online thành công ngay lập tức. Bản quyền vĩnh viễn chuẩn Microsoft, cảm ơn shop nhiều!",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T12:00:00.000Z"
  },
  {
    id: "REV-1010",
    productId: 6,
    userId: "lananh",
    authorName: "Bùi Lan Anh",
    authorAvatar: "B",
    rating: 5,
    comment: "Tài khoản Netflix 4K xem cực nét, profile riêng tư không bị văng. Đã dùng thử 2 tuần rất ổn định.",
    isVerifiedPurchase: true,
    status: "approved",
    createdAt: "2026-10-21T10:30:00.000Z"
  }
];

const ReviewService = {
  STORAGE_KEY: 'tapHoa23ProductReviews',

  // Cấu hình Database Backend tương lai (khi có DB thực tế, chỉ cần bật USE_REMOTE_API = true)
  API_CONFIG: {
    USE_REMOTE_API: false,
    BASE_URL: 'https://api.taphoa23.vn/api/v1/reviews'
  },

  getAllReviews() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Khởi tạo seed data nếu chưa có
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_SEED_REVIEWS));
      return [...DEFAULT_SEED_REVIEWS];
    } catch (e) {
      return [...DEFAULT_SEED_REVIEWS];
    }
  },

  saveAllReviews(reviews) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to storage:', e);
    }
  },

  getProductReviews(productId, includePending = false) {
    const numId = parseInt(productId, 10);
    const all = this.getAllReviews();
    return all
      .filter(r => r.productId === numId && (includePending ? true : (r.status === 'approved' || !r.status)))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getProductReviewStats(productId) {
    const reviews = this.getProductReviews(productId);
    const count = reviews.length;
    if (count === 0) {
      return {
        count: 0,
        averageRating: 5.0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = Math.round((sum / count) * 10) / 10;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });
    return {
      count,
      averageRating: avg,
      distribution: dist
    };
  },

  addReview(reviewData) {
    const all = this.getAllReviews();
    const numProductId = parseInt(reviewData.productId, 10);
    const rating = Math.min(5, Math.max(1, parseInt(reviewData.rating, 10) || 5));
    const authorName = String(reviewData.authorName || 'Khách hàng').trim();
    const comment = String(reviewData.comment || '').trim();
    const avatar = reviewData.authorAvatar || authorName.charAt(0).toUpperCase() || '👤';

    const newReview = {
      id: 'REV-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      productId: numProductId,
      userId: reviewData.userId || null,
      authorName: authorName,
      authorAvatar: avatar,
      rating: rating,
      comment: comment,
      isVerifiedPurchase: reviewData.isVerifiedPurchase !== false,
      status: reviewData.status || 'approved',
      createdAt: new Date().toISOString()
    };

    all.unshift(newReview);
    this.saveAllReviews(all);

    // Đồng bộ tức thì chỉ số đánh giá của sản phẩm trong PRODUCTS
    this.syncProductStats(numProductId);

    return newReview;
  },

  syncProductStats(productId) {
    const numId = parseInt(productId, 10);
    if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
      const prod = PRODUCTS.find(p => p.id === numId);
      if (prod) {
        const stats = this.getProductReviewStats(numId);
        prod.reviews = stats.count;
        if (stats.count > 0) {
          prod.rating = stats.averageRating;
        }
        if (typeof saveProducts === 'function') {
          saveProducts();
        }
      }
    }
  },

  syncAllProducts() {
    if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) return;
    let changed = false;
    PRODUCTS.forEach(p => {
      const stats = this.getProductReviewStats(p.id);
      if (p.reviews !== stats.count || (stats.count > 0 && Math.abs(p.rating - stats.averageRating) > 0.05)) {
        p.reviews = stats.count;
        if (stats.count > 0) {
          p.rating = stats.averageRating;
        }
        changed = true;
      }
    });
    if (changed && typeof saveProducts === 'function') {
      saveProducts();
    }
  },

  // Phương thức async sẵn sàng cho việc gọi API backend sau này
  async fetchReviewsFromApi(productId) {
    if (!this.API_CONFIG.USE_REMOTE_API) {
      return this.getProductReviews(productId);
    }
    const response = await fetch(`${this.API_CONFIG.BASE_URL}?productId=${productId}`);
    return await response.json();
  },

  async postReviewToApi(reviewData) {
    if (!this.API_CONFIG.USE_REMOTE_API) {
      return this.addReview(reviewData);
    }
    const response = await fetch(this.API_CONFIG.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return await response.json();
  }
};

if (typeof window !== 'undefined') {
  window.ReviewService = ReviewService;
}

function loadProductsAndCategories() {
  try {
    const savedP = localStorage.getItem('tapHoa23Products');
    PRODUCTS = savedP ? JSON.parse(savedP) : [...DEFAULT_PRODUCTS];
  } catch (e) {
    PRODUCTS = [...DEFAULT_PRODUCTS];
  }

  try {
    const savedC = localStorage.getItem('tapHoa23Categories');
    CATEGORIES = savedC ? JSON.parse(savedC) : [...DEFAULT_CATEGORIES];
  } catch (e) {
    CATEGORIES = [...DEFAULT_CATEGORIES];
  }

  // Tự động đồng bộ số lượng đánh giá thực tế từ ReviewService cho tất cả sản phẩm
  if (typeof ReviewService !== 'undefined' && typeof ReviewService.syncAllProducts === 'function') {
    ReviewService.syncAllProducts();
  }

  // Automatically discover and sync any new categories from custom products
  let hasNewCat = false;
  PRODUCTS.forEach(p => {
    if (p.category && p.category !== 'all') {
      const exists = CATEGORIES.some(c => c.id === p.category || c.label.toLowerCase() === (p.categoryLabel || p.category).toLowerCase());
      if (!exists) {
        let cleanIcon = '🏷️';
        if (p.icon && typeof p.icon === 'string' && !p.icon.startsWith('http') && !p.icon.startsWith('data:') && p.icon.length <= 8) {
          cleanIcon = p.icon;
        }
        let cleanLabel = (p.categoryLabel || p.category || '').replace(/https?:\/\/[^\s]+/g, '').trim() || p.category;
        const slug = slugifyCategory(cleanLabel);
        CATEGORIES.push({
          id: slug,
          label: cleanLabel,
          icon: cleanIcon,
          description: `Tổng hợp các mặt hàng ${cleanLabel} uy tín và giá ưu đãi tại Tạp Hóa 23.`,
          tags: [cleanLabel, 'Chính Hãng', 'Bảo Hành Uy Tín']
        });
        hasNewCat = true;
      }
    }
  });

  // Strict Sanitizer: Clean existing CATEGORIES and ensure description & tags exist
  CATEGORIES.forEach(c => {
    if (!c.icon || typeof c.icon !== 'string' || c.icon.includes('http') || c.icon.includes('data:') || c.icon.length > 8) {
      c.icon = '🏷️';
      hasNewCat = true;
    }
    if (c.label && typeof c.label === 'string' && (c.label.includes('http://') || c.label.includes('https://'))) {
      c.label = c.label.replace(/https?:\/\/[^\s]+/g, '').trim() || c.id || 'Mặt Hàng Mới';
      hasNewCat = true;
    }
    if (!c.description) {
      const def = DEFAULT_CATEGORIES.find(d => d.id === c.id || d.label.toLowerCase() === c.label.toLowerCase());
      c.description = def && def.description ? def.description : `Tổng hợp các mặt hàng ${c.label} uy tín và giá ưu đãi tại Tạp Hóa 23.`;
      hasNewCat = true;
    }
    if (!c.tags || !Array.isArray(c.tags) || c.tags.length === 0) {
      const def = DEFAULT_CATEGORIES.find(d => d.id === c.id || d.label.toLowerCase() === c.label.toLowerCase());
      c.tags = def && def.tags ? [...def.tags] : [c.label, 'Chính Hãng', 'Bảo Hành Uy Tín'];
      hasNewCat = true;
    }
  });

  if (hasNewCat || !localStorage.getItem('tapHoa23Categories')) {
    try {
      localStorage.setItem('tapHoa23Categories', JSON.stringify(CATEGORIES));
    } catch (e) { }
  }
}
loadProductsAndCategories();

function saveProducts() {
  localStorage.setItem('tapHoa23Products', JSON.stringify(PRODUCTS));
}

function saveCategories() {
  localStorage.setItem('tapHoa23Categories', JSON.stringify(CATEGORIES));
}

// Format VND price
function formatPrice(price) {
  if (typeof price !== 'number') price = Number(price) || 0;
  return price.toLocaleString('vi-VN') + 'đ';
}

// Get badge color
function getBadgeColor(badge) {
  const colors = {
    'Hot': '#ef4444',
    'Sale': '#f97316',
    'New': '#22c55e',
    'Best': '#eab308',
    'Rare': '#cbd5e1',
    'Hết Hàng': '#ef4444'
  };
  return colors[badge] || '#6b7280';
}

// Helper: Get product by ID
function getProductById(id) {
  loadProductsAndCategories();
  const numId = parseInt(id, 10);
  return PRODUCTS.find(p => p.id === numId) || null;
}

// Helper: Get related products
function getRelatedProducts(product, limit = 4) {
  loadProductsAndCategories();
  if (!product) return [];
  return PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.badge === 'Hot' || p.badge === 'Best'))
    .slice(0, limit);
}

// ==================== CATEGORY MANAGEMENT FUNCTIONS ====================

function slugifyCategory(text) {
  if (!text) return 'danh-muc-' + Date.now();
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || ('cat-' + Date.now());
}

function getCategories() {
  loadProductsAndCategories();
  return CATEGORIES;
}

function addCategory({ name, label, icon, description, tags }) {
  loadProductsAndCategories();
  const cleanLabel = (label || name || '').replace(/https?:\/\/[^\s]+/g, '').trim();
  if (!cleanLabel) return null;
  const slug = slugifyCategory(cleanLabel);

  // Check if exists
  let existing = CATEGORIES.find(c => c.id === slug || c.label.toLowerCase() === cleanLabel.toLowerCase());
  if (existing) {
    existing.label = cleanLabel;
    if (icon) existing.icon = icon;
    if (description) existing.description = description;
    if (tags) existing.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    saveCategories();
    return existing;
  }

  const cleanIcon = (icon && typeof icon === 'string' && !icon.startsWith('http') && !icon.startsWith('data:') && icon.length <= 8)
    ? icon
    : '🏷️';

  const parsedTags = Array.isArray(tags)
    ? tags
    : (typeof tags === 'string' && tags.trim() ? tags.split(',').map(t => t.trim()).filter(Boolean) : [cleanLabel, 'Chính Hãng', 'Bảo Hành']);

  const newCat = {
    id: slug,
    label: cleanLabel,
    icon: cleanIcon,
    description: description && description.trim() ? description.trim() : `Tổng hợp các mặt hàng ${cleanLabel} chất lượng và giá ưu đãi nhất tại Tạp Hóa 23.`,
    tags: parsedTags
  };

  CATEGORIES.push(newCat);
  saveCategories();
  return newCat;
}

function renameCategory(targetCatId, newLabel, newIcon, newDesc, newTags) {
  loadProductsAndCategories();
  const cleanNewName = (newLabel || '').replace(/https?:\/\/[^\s]+/g, '').trim();
  if (!cleanNewName) return null;

  const cat = CATEGORIES.find(c => c.id === targetCatId || c.label.toLowerCase() === (targetCatId || '').toLowerCase());
  if (!cat || cat.id === 'all') return null;

  const oldSlug = cat.id;
  const oldLabel = cat.label;
  const newSlug = slugifyCategory(cleanNewName);

  // Update category properties
  cat.id = newSlug;
  cat.label = cleanNewName;
  if (newIcon && typeof newIcon === 'string' && !newIcon.startsWith('http') && !newIcon.startsWith('data:') && newIcon.length <= 8) {
    cat.icon = newIcon;
  }
  if (newDesc !== undefined && typeof newDesc === 'string') {
    cat.description = newDesc.trim();
  }
  if (newTags !== undefined) {
    cat.tags = Array.isArray(newTags)
      ? newTags
      : (typeof newTags === 'string' ? newTags.split(',').map(t => t.trim()).filter(Boolean) : cat.tags);
  } else if (Array.isArray(cat.tags)) {
    // Automatically update tag that was identical to oldLabel
    cat.tags = cat.tags.map(t => t.toLowerCase() === oldLabel.toLowerCase() ? cleanNewName : t);
  }

  // Update all matching products in PRODUCTS
  let updatedCount = 0;
  PRODUCTS.forEach(p => {
    if (p.category === oldSlug || p.category === targetCatId || p.categoryLabel === oldLabel) {
      p.category = newSlug;
      p.categoryLabel = cleanNewName;
      if (Array.isArray(p.tags)) {
        p.tags = p.tags.map(t => t.toLowerCase() === oldLabel.toLowerCase() ? cleanNewName : t);
      }
      updatedCount++;
    }
  });

  // Sync to cart items in localStorage
  try {
    const savedCart = localStorage.getItem('tapHoa23Cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      let changed = false;
      cart.forEach(item => {
        if (item.category === oldSlug || item.category === targetCatId || item.categoryLabel === oldLabel) {
          item.category = newSlug;
          item.categoryLabel = cleanNewName;
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('tapHoa23Cart', JSON.stringify(cart));
      }
    }
  } catch (e) { }

  saveCategories();
  saveProducts();
  return { category: cat, updatedCount, oldSlug, oldLabel, newSlug, newLabel: cleanNewName };
}

function deleteCategory(targetCatId, deleteAssociatedProducts = true) {
  loadProductsAndCategories();
  if (!targetCatId || targetCatId === 'all') return false;

  const catIndex = CATEGORIES.findIndex(c => c.id === targetCatId || c.label.toLowerCase() === (targetCatId || '').toLowerCase());
  if (catIndex === -1) return false;

  const targetCat = CATEGORIES[catIndex];
  const targetSlug = targetCat.id;
  const targetLabel = targetCat.label;

  CATEGORIES.splice(catIndex, 1);
  saveCategories();

  if (deleteAssociatedProducts) {
    PRODUCTS = PRODUCTS.filter(p => p.category !== targetSlug && p.category !== targetCatId && p.categoryLabel !== targetLabel);
    saveProducts();
  }

  return true;
}

// Product Management Helpers for Admin
function addProduct(newProduct) {
  loadProductsAndCategories();
  const maxId = PRODUCTS.reduce((max, p) => Math.max(max, p.id || 0), 0);
  newProduct.id = maxId + 1;
  if (!newProduct.rating) newProduct.rating = 5.0;
  if (!newProduct.reviews) newProduct.reviews = 1;
  newProduct.sold = Number(newProduct.sold) || 0;
  if (newProduct.isOutOfStock === undefined) {
    newProduct.isOutOfStock = Number(newProduct.stock) <= 0;
  }

  // Normalize images array
  if (!Array.isArray(newProduct.images)) {
    newProduct.images = newProduct.images ? [newProduct.images] : [];
  }
  if (newProduct.images.length > 0 && (!newProduct.icon || newProduct.icon === '📦')) {
    newProduct.icon = newProduct.images[0];
  } else if (newProduct.icon && newProduct.images.length === 0) {
    newProduct.images = [newProduct.icon];
  }

  // Clean category label and slug
  let cleanLabel = (newProduct.categoryLabel || newProduct.category || '').replace(/https?:\/\/[^\s]+/g, '').trim() || 'Mặt Hàng Khác';
  const catSlug = slugifyCategory(cleanLabel);
  newProduct.category = catSlug;
  newProduct.categoryLabel = cleanLabel;

  // Auto-create category in CATEGORIES if not already present
  const existingCat = CATEGORIES.find(c => c.id === catSlug || c.label.toLowerCase() === cleanLabel.toLowerCase());
  if (!existingCat) {
    let cleanIcon = '🏷️';
    if (newProduct.icon && typeof newProduct.icon === 'string' && !newProduct.icon.startsWith('http') && !newProduct.icon.startsWith('data:') && newProduct.icon.length <= 8) {
      cleanIcon = newProduct.icon;
    }
    CATEGORIES.push({
      id: catSlug,
      label: cleanLabel,
      icon: cleanIcon,
      description: `Tổng hợp các mặt hàng ${cleanLabel} uy tín và giá ưu đãi tại Tạp Hóa 23.`,
      tags: [cleanLabel, 'Chính Hãng', 'Bảo Hành Uy Tín']
    });
    saveCategories();
  }

  PRODUCTS.unshift(newProduct);
  saveProducts();
  return newProduct;
}

function updateProduct(id, updatedFields) {
  loadProductsAndCategories();
  const numId = parseInt(id, 10);
  const idx = PRODUCTS.findIndex(p => p.id === numId);
  if (idx !== -1) {
    const oldProduct = { ...PRODUCTS[idx] };
    const oldCatSlug = oldProduct.category;
    const oldCatLabel = oldProduct.categoryLabel;

    if (updatedFields.sold !== undefined) {
      updatedFields.sold = Number(updatedFields.sold) || 0;
    }
    if (updatedFields.images && !Array.isArray(updatedFields.images)) {
      updatedFields.images = [updatedFields.images];
    }

    if (updatedFields.categoryLabel || updatedFields.category) {
      let cLabel = (updatedFields.categoryLabel || updatedFields.category || '').replace(/https?:\/\/[^\s]+/g, '').trim();
      if (cLabel) {
        const cSlug = slugifyCategory(cLabel);
        updatedFields.category = cSlug;
        updatedFields.categoryLabel = cLabel;

        // Auto-create category if not exists
        const existingCat = CATEGORIES.find(c => c.id === cSlug || c.label.toLowerCase() === cLabel.toLowerCase());
        if (!existingCat) {
          let cleanIcon = '🏷️';
          if (updatedFields.icon && typeof updatedFields.icon === 'string' && !updatedFields.icon.startsWith('http') && !updatedFields.icon.startsWith('data:') && updatedFields.icon.length <= 8) {
            cleanIcon = updatedFields.icon;
          }
          CATEGORIES.push({
            id: cSlug,
            label: cLabel,
            icon: cleanIcon,
            description: `Tổng hợp các mặt hàng ${cLabel} uy tín và giá ưu đãi tại Tạp Hóa 23.`,
            tags: [cLabel, 'Chính Hãng', 'Bảo Hành Uy Tín']
          });
          saveCategories();
        }
      }
    }

    PRODUCTS[idx] = { ...PRODUCTS[idx], ...updatedFields };

    // If category was changed, check if old category now has 0 products
    if (oldCatSlug && oldCatSlug !== 'all' && updatedFields.category && updatedFields.category !== oldCatSlug) {
      const remainingOld = PRODUCTS.filter(p => p.category === oldCatSlug || (oldCatLabel && p.categoryLabel === oldCatLabel)).length;
      if (remainingOld === 0) {
        CATEGORIES = CATEGORIES.filter(c => c.id !== oldCatSlug && c.label !== oldCatLabel);
        saveCategories();
      }
    }

    saveProducts();
    return PRODUCTS[idx];
  }
  return null;
}

function toggleProductStock(id) {
  loadProductsAndCategories();
  const numId = parseInt(id, 10);
  const p = PRODUCTS.find(item => item.id === numId);
  if (p) {
    p.isOutOfStock = !p.isOutOfStock;
    if (p.isOutOfStock) {
      p.status = 'out_of_stock';
    } else {
      p.status = 'available';
      if (Number(p.stock) <= 0) p.stock = 10;
    }
    saveProducts();
    return p;
  }
  return null;
}

function deleteProduct(id) {
  loadProductsAndCategories();
  const numId = parseInt(id, 10);
  const targetProduct = PRODUCTS.find(p => p.id === numId);
  if (!targetProduct) return;

  const targetCatSlug = targetProduct.category;
  const targetCatLabel = targetProduct.categoryLabel;

  PRODUCTS = PRODUCTS.filter(p => p.id !== numId);
  saveProducts();

  // If ALL products in that category have been deleted, the category disappears!
  if (targetCatSlug && targetCatSlug !== 'all') {
    const remainingCount = PRODUCTS.filter(p => p.category === targetCatSlug || (targetCatLabel && p.categoryLabel === targetCatLabel)).length;
    if (remainingCount === 0) {
      CATEGORIES = CATEGORIES.filter(c => c.id !== targetCatSlug && c.label !== targetCatLabel);
      saveCategories();
    }
  }
}

