/**
 * ECOVINTAGE - DỮ LIỆU KHỞI TẠO HỆ THỐNG
 * Nền tảng TMĐT Đồ Second-hand / Vintage
 */

const INITIAL_CATEGORIES = [
  {
    id: "fashion",
    name: "Thời trang Vintage",
    icon: "fa-shirt",
    description: "Trang phục retro, áo khoác denim, đầm cổ điển và phụ kiện da",
    subcategories: [
      { id: "fashion-jacket", name: "Áo khoác & Denim Retro" },
      { id: "fashion-dress", name: "Váy & Áo sơ mi Cổ điển" },
      { id: "fashion-accessories", name: "Phụ kiện Da & Túi xách Cổ" }
    ]
  },
  {
    id: "books",
    name: "Sách cũ & Sưu tầm",
    icon: "fa-book-open",
    description: "Văn học kinh điển, triết học, lịch sử và các ấn bản hiếm",
    subcategories: [
      { id: "books-classic", name: "Văn học Kinh điển" },
      { id: "books-history", name: "Triết học & Lịch sử" },
      { id: "books-rare", name: "Sách hiếm & Ấn bản Đầu" }
    ]
  },
  {
    id: "decor",
    name: "Đồ Decor & Đồ xưa",
    icon: "fa-couch",
    description: "Đèn bàn đồng, máy hát đĩa, đồ gốm sứ mộc và đồng hồ quả lắc",
    subcategories: [
      { id: "decor-lighting", name: "Đèn bàn & Quạt cổ" },
      { id: "decor-clock", name: "Đồng hồ cơ & Máy hát" },
      { id: "decor-ceramic", name: "Đồ gốm sứ & Tranh Vintage" }
    ]
  }
];

const INITIAL_PRODUCTS = [
  {
    id: "SP-1001",
    sku: "VNT-JKT-01",
    name: "Áo khoác Denim Levi's Type III Vintage thập niên 80s",
    categoryId: "fashion",
    subcategoryId: "fashion-jacket",
    categoryName: "Áo khoác & Denim Retro",
    price: 680000,
    originalPrice: 1500000,
    condition: "92% (Good Patina)",
    conditionType: "good",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Thái An Vintage",
      phone: "0912 345 678",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      joinedYear: "2023",
      verified: true
    },
    shortDesc: "Chất jeans dày dặn, phai màu tự nhiên (faded) cực đẹp chuẩn dáng vintage 80s.",
    description: "Áo khoác jeans Levi's cúc đồng nguyên bản sản xuất thập niên 1980 tại Mỹ. Vải denim dệt chéo 14oz chắc chắn, độ sờn rách tự nhiên tôn vinh giá trị thời gian. Đã qua giặt sấy khử khuẩn cẩn thận, form áo đứng chuẩn Unisex phù hợp người từ 55kg - 72kg.",
    specifications: {
      "Chất liệu": "100% Cotton Denim dệt thô",
      "Size": "L (Rộng vai: 48cm, Dài: 64cm)",
      "Năm sản xuất ước tính": "Khoảng 1985",
      "Tình trạng chi tiết": "Sờn nhẹ ở cổ tay áo, cúc đồng hơi ố nhẹ tạo vân thời gian"
    },
    views: 1240,
    reviews: [
      { author: "Hải Đăng", rating: 5, date: "2026-10-15", comment: "Áo cực chất, đúng màu vintage như ảnh chụp. Giao hàng ví ký quỹ rất an tâm!" },
      { author: "Trần Mai", rating: 5, date: "2026-10-20", comment: "Vải dày và thơm tho, đóng gói giấy kraft thân thiện môi trường." }
    ]
  },
  {
    id: "SP-1002",
    sku: "VNT-DRS-02",
    name: "Đầm Xòe Hoa Nhí Vintage Phong Cách Parisian 1970s",
    categoryId: "fashion",
    subcategoryId: "fashion-dress",
    categoryName: "Váy & Áo sơ mi Cổ điển",
    price: 390000,
    originalPrice: 850000,
    condition: "95% (Like New)",
    conditionType: "like-new",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Tiệm Cũ Cô Ba",
      phone: "0988 776 554",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      rating: 4.8,
      joinedYear: "2024",
      verified: true
    },
    shortDesc: "Đầm dáng xòe lụa tơ sống nhẹ nhàng, họa tiết hoa nhí phong cách hoài cổ Paris.",
    description: "Đầm vintage chất liệu lụa satin mờ có lót trong tinh tế. Họa tiết hoa đồng nội trang nhã, đường chiết eo tôn dáng cổ điển thập niên 70. Hàng tuyển chọn không một vết sờn chỉ hay phai màu.",
    specifications: {
      "Chất liệu": "Lụa mềm vintage dệt thủ công",
      "Size": "M (Vòng ngực: 86cm, Eo: 68-72cm)",
      "Phong cách": "Retro Parisian Chic",
      "Tình trạng": "Gần như mới, khuy ngọc trai nguyên vẹn"
    },
    views: 890,
    reviews: [
      { author: "Bích Ngọc", rating: 5, date: "2026-10-18", comment: "Đầm mặc lên như tiểu thư Pháp xưa, rất xinh!" }
    ]
  },
  {
    id: "SP-1003",
    sku: "VNT-BAG-03",
    name: "Túi Da Bò Thủ Công Dáng Cặp Bác Sĩ (Gladstone Bag)",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    categoryName: "Phụ kiện Da & Túi xách Cổ",
    price: 950000,
    originalPrice: 2200000,
    condition: "88% (Patina Đậm Nét)",
    conditionType: "patina",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Vintage Leather Hub",
      phone: "0934 112 233",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      joinedYear: "2022",
      verified: true
    },
    shortDesc: "Túi da bò thật lên nước bóng màu caramel sậm, khóa cài kim loại đồng nguyên khối.",
    description: "Mẫu túi bác sĩ cổ điển dáng miệng mở khung kim loại, da bò sáp càng dùng càng bóng đẹp. Ngăn chứa rộng rãi vừa laptop 14 inch và tập sách sổ tay, thích hợp cho người yêu nét lịch lãm hoài cổ.",
    specifications: {
      "Chất liệu": "Da bò sáp tự nhiên 100%",
      "Kích thước": "38cm x 26cm x 14cm",
      "Khóa & Phụ kiện": "Đồng đúc nguyên khối chống gỉ",
      "Tình trạng": "Da đã lên patina tự nhiên tuyệt đẹp, kết cấu bền chắc vĩnh cửu"
    },
    views: 1560,
    reviews: [
      { author: "Quốc Tuấn", rating: 5, date: "2026-10-22", comment: "Mùi da thật rất thơm, phom cứng cáp mang đi làm ai cũng khen độc lạ." }
    ]
  },
  {
    id: "SP-1004",
    sku: "BOK-CLS-04",
    name: "Bộ Tiểu Thuyết 'Những Người Khốn Khổ' - Bản In NXB Văn Học 1986",
    categoryId: "books",
    subcategoryId: "books-classic",
    categoryName: "Văn học Kinh điển",
    price: 320000,
    originalPrice: 600000,
    condition: "90% (Trang Vàng Thời Gian)",
    conditionType: "good",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Hiệu Sách Cũ Tràng Tiền",
      phone: "0904 999 888",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      joinedYear: "2021",
      verified: true
    },
    shortDesc: "Trọn bộ 3 tập dịch bởi các học giả hàng đầu, giấy bãi bằng vàng ngả mùi hoài niệm.",
    description: "Tác phẩm kinh điển của Victor Hugo qua bản dịch xuất sắc nhất. Sách nguyên vẹn không rách rời gáy, chữ in chì rõ nét, giấy giữ được hương thơm mộc của sách xưa. Một ấn bản sưu tầm đáng giá cho tủ sách gia đình.",
    specifications: {
      "Tác giả": "Victor Hugo",
      "Năm xuất bản": "1986",
      "Nhà xuất bản": "NXB Văn Học",
      "Số trang": "3 tập - 1,420 trang",
      "Tình trạng": "Gáy nguyên, ruột sạch không gạch xóa"
    },
    views: 740,
    reviews: [
      { author: "Đức Trí", rating: 5, date: "2026-10-12", comment: "Tìm cuốn này bao lâu mới thấy, bản dịch cổ này đọc văn phong rất mượt." }
    ]
  },
  {
    id: "SP-1005",
    sku: "BOK-RARE-05",
    name: "Tập Thơ 'Điêu Tàn' Chế Lan Viên - Bản In Giới Hạn Sưu Tầm",
    categoryId: "books",
    subcategoryId: "books-rare",
    categoryName: "Sách hiếm & Ấn bản Đầu",
    price: 1200000,
    originalPrice: 2000000,
    condition: "85% (Hiếm Có)",
    conditionType: "patina",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Tủ Sách Xưa Khang",
      phone: "0915 223 344",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      joinedYear: "2020",
      verified: true
    },
    shortDesc: "Ấn bản sưu tầm quý hiếm của phong trào Thơ Mới, có chữ ký lưu niệm của nhà nghiên cứu.",
    description: "Ấn phẩm quý dành riêng cho giới chơi sách xưa. Giữ nguyên nét bìa gốc thời kỳ đầu, chất lượng giấy còn độ dai tốt, được bảo quản trong bọc kính chống ẩm chuyên dụng.",
    specifications: {
      "Thể loại": "Thơ Mới / Sưu tầm quý",
      "Đặc tính": "Có triện cổ và bút tích",
      "Độ hiếm": "Hạng Sưu Tầm Cực Hiếm",
      "Tình trạng": "Được phục chế gáy sách bằng keo hữu cơ chuyên dụng"
    },
    views: 2100,
    reviews: [
      { author: "Nhà Sưu Tầm Minh", rating: 5, date: "2026-10-05", comment: "Sách đúng mô tả, người bán đóng gói 3 lớp xốp khí chống sốc rất chu đáo." }
    ]
  },
  {
    id: "SP-1006",
    sku: "DEC-LAMP-06",
    name: "Đèn Bàn Thân Đồng Đúc Bankers Lamp Thập Niên 1960",
    categoryId: "decor",
    subcategoryId: "decor-lighting",
    categoryName: "Đèn bàn & Quạt cổ",
    price: 1450000,
    originalPrice: 2800000,
    condition: "90% (Hoạt Động Tốt)",
    conditionType: "good",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Hoài Niệm Decor",
      phone: "0977 445 667",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      rating: 4.9,
      joinedYear: "2023",
      verified: true
    },
    shortDesc: "Chao thủy tinh xanh ngọc lục bảo (emerald green), thân đồng nguyên chất bóng màu cổ.",
    description: "Đèn bàn ngân hàng kinh điển châu Âu. Dây kéo giật bằng kim loại truyền thống kêu 'tách' đanh giòn vui tai. Dây điện đã được thay mới bọc dù an toàn chuẩn hiện đại nhưng giữ trọn nét hoài cổ thập niên 60.",
    specifications: {
      "Chất liệu": "Chao thủy tinh thổi tay 2 lớp + Đồng đúc",
      "Kích thước": "Cao 39cm, chao rộng 25cm",
      "Đuôi bóng": "E27 (tương thích đèn LED vintage ánh sáng vàng)",
      "Điện áp": "220V chuẩn Việt Nam"
    },
    views: 1820,
    reviews: [
      { author: "Kiến Trúc Sư Hoàng", rating: 5, date: "2026-10-19", comment: "Để bàn làm việc gỗ sồi nhìn cực kỳ ấm cúng và sang trọng." }
    ]
  },
  {
    id: "SP-1007",
    sku: "DEC-CLOK-07",
    name: "Đồng Hồ Cơ Lên Cót Để Bàn Slava Cổ Điển Liên Xô",
    categoryId: "decor",
    subcategoryId: "decor-clock",
    categoryName: "Đồng hồ cơ & Máy hát",
    price: 780000,
    originalPrice: 1600000,
    condition: "88% (Bộ Máy Chuẩn Xác)",
    conditionType: "patina",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Đồng Hồ Cổ Hà Thành",
      phone: "0903 555 123",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      rating: 5.0,
      joinedYear: "2021",
      verified: true
    },
    shortDesc: "Máy cơ 11 chân kính chạy 2 ngày một lần lên cót, chuông reo cơ học vang ấm.",
    description: "Mẫu đồng hồ báo thức huyền thoại sản xuất tại Liên Xô thời kỳ Xô Viết. Vỏ kim loại mạ crom có dấu ấn thời gian nhẹ. Bộ máy cơ đã được thợ lau dầu căn chỉnh chu kỳ sai số chỉ dưới 30 giây/ngày.",
    specifications: {
      "Xuất xứ": "Made in USSR (Liên Xô)",
      "Cơ chế": "Lên cót tay bằng núm vặn",
      "Kích thước": "Đường kính mặt 9cm",
      "Tình trạng": "Đã lau dầu, chuông gõ đanh rõ ràng"
    },
    views: 930,
    reviews: [
      { author: "Bác Lâm", rating: 5, date: "2026-10-14", comment: "Đồng hồ chuẩn Liên Xô ngày xưa, tiếng tích tắc nghe hoài niệm quá." }
    ]
  },
  {
    id: "SP-1008",
    sku: "DEC-CERM-08",
    name: "Bình Gốm Lái Thiêu Họa Tiết Hoa Cúc Cổ Thập Niên 70",
    categoryId: "decor",
    subcategoryId: "decor-ceramic",
    categoryName: "Đồ gốm sứ & Tranh Vintage",
    price: 520000,
    originalPrice: 1100000,
    condition: "92% (Men Cốt Lành Tít)",
    conditionType: "good",
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    seller: {
      name: "Tiệm Gốm Mộc Sài Gòn",
      phone: "0918 889 900",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 4.8,
      joinedYear: "2023",
      verified: true
    },
    shortDesc: "Men lam vẽ tay truyền thống của lò Lái Thiêu xưa, màu men rạn tự nhiên theo thời gian.",
    description: "Bình gốm mộc mạc lưu giữ hồn quê hương Nam Bộ xưa. Tác phẩm vẽ tay từng nét cúc đại đóa tự do phóng khoáng. Cốt gốm dày dặn, không nứt mẻ, cắm hoa sen hoặc cành đào ngày Tết hay để decor góc phòng khách đều rất duyên.",
    specifications: {
      "Dòng gốm": "Gốm cổ Lái Thiêu (Bình Dương)",
      "Kỹ thuật": "Men lam vẽ tay thủ công",
      "Kích thước": "Cao 28cm, bụng rộng 16cm",
      "Tình trạng": "Men rạn tơ tự nhiên, không rạn vỡ cốt"
    },
    views: 1150,
    reviews: [
      { author: "Chị Thảo", rating: 5, date: "2026-10-21", comment: "Bình gốm ở ngoài mộc và sâu sắc hơn trong ảnh, cắm hoa cúc họa mi tuyệt đẹp!" }
    ]
  }
];

const INITIAL_NEWS = [
  {
    id: "news-1",
    topic: "Phong Cách Sống Xanh",
    title: "Kinh Tế Tuần Hoàn: Vì Sao Săn Đồ Second-Hand Đang Trở Thành Phong Cách Sống Của Gen Z?",
    summary: "Không chỉ tiết kiệm chi phí, tái sử dụng thời trang và sách cũ là hành động cụ thể giảm thiểu hàng nghìn tấn rác thải công nghiệp ra môi trường mỗi năm.",
    content: "Thời trang nhanh (Fast Fashion) đang là một trong những ngành công nghiệp gây ô nhiễm nguồn nước và phát thải carbon lớn nhất toàn cầu. Trước thực trạng đó, làn sóng 'Thrift Shopping' và sưu tầm đồ Vintage bùng nổ mạnh mẽ trong giới trẻ. Một chiếc áo khoác jeans cũ có tuổi đời 30 năm nhưng chất lượng vải denim dệt thô vẫn bền bỉ hơn rất nhiều sản phẩm công nghiệp đại trà ngày nay. Việc trao cho món đồ cũ một vòng đời thứ hai không chỉ thể hiện cá tính riêng biệt mà còn là cam kết bảo vệ hành tinh xanh.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    date: "2026-10-28",
    author: "Ban Biên Tập EcoVintage",
    views: 3420,
    relatedIds: ["news-2", "news-3"]
  },
  {
    id: "news-2",
    topic: "Kinh Nghiệm Săn Đồ",
    title: "5 Bí Quyết Kiểm Tra Độ 'Zin' Của Áo Khoác Denim & Túi Da Vintage",
    summary: "Hướng dẫn nhận biết cúc đinh tán, tem tag cổ áo, đường chỉ khâu đôi và cách ngửi mùi da thật để không bị mua nhầm đồ giả cổ.",
    content: "Khi mua đồ da và denim vintage, điều đầu tiên là hãy quan sát phần kim loại như khóa kéo (Zipper), cúc đồng (Rivets). Các thương hiệu lớn như Talon, Scovill, Ideal thường in dập chìm trên khóa kéo của thập niên 70-80. Đối với đồ da, vân da tự nhiên không đều tăm tắp như da PU nhân tạo; mặt sau của da thật sẽ có lớp lông mịn và mùi sáp đặc trưng. Ngoài ra, việc sử dụng cơ chế Ví ký quỹ trung gian của EcoVintage sẽ giúp bạn có trọn vẹn 48 giờ cầm nắm kiểm tra thực tế trước khi tiền được chuyển đến người bán.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    date: "2026-10-25",
    author: "Chuyên Gia Đồ Xưa Trần Nam",
    views: 2850,
    relatedIds: ["news-1", "news-3"]
  },
  {
    id: "news-3",
    topic: "Công Nghệ & Bảo Mật",
    title: "Cơ Chế Ví Điện Tử Ký Quỹ Escrow: Lời Giải Cho Nỗi Lo Mua Phải 'Đồ Cũ Không Như Hình'",
    summary: "Tìm hiểu cách hệ sinh thái ký quỹ giữ tiền an toàn 48h giúp loại bỏ 100% rủi pro lừa đảo khi giao dịch đồ second-hand trực tuyến.",
    content: "Rào cản lớn nhất khi mua đồ cũ qua mạng là chất lượng không đúng như người bán cam kết. Để giải quyết triệt để vấn đề này, EcoVintage tiên phong triển khai cơ chế Ký Quỹ Độc Lập (Escrow Protection). Khi người mua đặt hàng, tiền sẽ được tạm giữ an toàn trong Ví Ký Quỹ. Người bán gửi hàng qua đối tác vận chuyển; khi người mua nhận được kiện hàng, họ có 48 giờ để thẩm định chất lượng. Chỉ khi người mua bấm 'Đồng ý nhận hàng' hoặc hết 48 giờ không có khiếu nại, tiền mới được giải ngân vào tài khoản người bán. Nếu phát hiện gian lận, người mua được hoàn tiền 100%.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    date: "2026-10-20",
    author: "Đội Ngũ An Toàn Giao Dịch",
    views: 1980,
    relatedIds: ["news-1", "news-2"]
  }
];

const INITIAL_COUPONS = [
  { code: "VINTAGE10", discountPercent: 10, minSpend: 300000, description: "Giảm 10% cho đơn hàng từ 300K" },
  { code: "ECOGREEN", discountAmount: 50000, minSpend: 500000, description: "Giảm 50.000đ ủng hộ phong cách sống xanh" },
  { code: "FREESHIP", discountAmount: 30000, minSpend: 200000, description: "Hỗ trợ 30.000đ phí vận chuyển an toàn" }
];
