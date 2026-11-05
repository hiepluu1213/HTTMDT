# EcoVintage – Nền tảng thương mại điện tử đồ second-hand / vintage

> **Đề tài:** Hệ thống cho phép người dùng vừa mua vừa bán lại đồ cũ (quần áo, sách, đồ decor), tích hợp tính năng định giá tự động dựa trên ảnh chụp và cơ chế ví điện tử ký quỹ trung gian an toàn.
> **Công nghệ:** HTML5, CSS3, JavaScript thuần (ES6+). Không dùng framework, không cần cài đặt hay chạy máy chủ.

---

## 1. Giới thiệu

**EcoVintage** là website thương mại điện tử dành cho thị trường đồ cũ và đồ vintage tại Việt Nam. Ngoài các chức năng mua bán thông thường, hệ thống có hai tính năng nổi bật:

1. **Định giá tự động qua ảnh (AI Photo Valuation):** người bán tải ảnh món đồ lên, hệ thống quét ảnh, ước lượng độ hao mòn, độ "zin" của chất liệu và gợi ý khoảng giá thị trường.
2. **Ví ký quỹ Escrow:** tiền của người mua được giữ trong ví trung gian, người mua có 48 giờ kiểm tra món đồ; chỉ khi hài lòng thì tiền mới được giải ngân cho người bán, nếu đồ sai mô tả thì được hoàn 100%.

Giao diện theo phong cách vintage: nền giấy kraft, xanh sage và vàng đồng.

---

## 2. Đối chiếu bảng đặc tả yêu cầu website

| STT | Module | Yêu cầu | Cách thực hiện |
| :-: | :-- | :-- | :-- |
| 1 | **Trang chủ** | Giao diện thân thiện, menu rõ ràng, slide banner, tìm kiếm, tin tức, liên hệ, chạy ổn định trên các trình duyệt phổ biến. | Menu điều hướng nhiều mục, mục Sản phẩm có menu thả xuống 2 cấp. Banner tự chuyển slide sau mỗi 5,5 giây và có nút điều hướng. Ô tìm kiếm hiển thị gợi ý ngay khi gõ, tìm theo tên, mã SKU, danh mục và mô tả. Trang chủ có khu vực sản phẩm mới; thanh menu có mục Tin tức và Liên hệ. |
| 2 | **Giới thiệu** | Giới thiệu tổng quan, thêm/sửa/xóa/ẩn hiện nội dung, soạn thảo văn bản, nêu sứ mệnh và tầm nhìn. | Trang giới thiệu về kinh tế tuần hoàn và cam kết với môi trường. Ở chế độ Admin có thể sửa tiêu đề và nội dung bài giới thiệu, nội dung được lưu lại trên trình duyệt. |
| 3 | **Sản phẩm** | Phân cấp tối đa 2 cấp, hiển thị theo danh mục, thêm/xóa/sửa/ẩn hiện sản phẩm, thông tin gồm tên, mã SKU, giá, chi tiết, đánh giá, chia sẻ mạng xã hội. | 3 danh mục cấp 1 (Thời trang vintage, Sách cũ và sưu tầm, Đồ decor và đồ xưa), mỗi danh mục có 3 danh mục cấp 2. Bộ lọc theo danh mục, tình trạng (95% / 90% / 85%) và thanh trượt khoảng giá; sắp xếp theo mới nhất, giá tăng, giá giảm, xem nhiều. Cửa sổ chi tiết có thư viện ảnh, SKU, thông số, người bán, đánh giá sao kèm nhận xét và nút chia sẻ Facebook, Zalo, Twitter, sao chép liên kết. Cửa sổ quản lý cho phép đăng bán mới, ẩn/hiện và xóa sản phẩm. |
| 4 | **Giỏ hàng và đơn hàng** | Quản lý giỏ hàng, nhiều hình thức thanh toán, khuyến mại / giảm giá. | Giỏ hàng tăng giảm số lượng, xóa món, tính tổng tiền tức thì, có nút **Mua ngay**. Mã giảm giá: `VINTAGE10` (giảm 10%, đơn từ 300.000đ), `ECOGREEN` (giảm 50.000đ, đơn từ 500.000đ), `FREESHIP` (giảm 30.000đ, đơn từ 200.000đ). Thanh toán bằng ví ký quỹ Escrow, chuyển khoản QR Napas hoặc COD. Đặt hàng xong có trang xác nhận kèm mã đơn. |
| 5 | **Tin tức – Sự kiện** | Danh sách hàng dọc, sắp xếp từ mới đến cũ, chi tiết bài viết có chia sẻ và tin liên quan. | Danh sách bài viết xếp dọc, tự sắp xếp theo ngày đăng mới nhất. Cửa sổ đọc bài có nút chia sẻ mạng xã hội và gợi ý các tin liên quan. |
| 6 | **Tiện ích** | Hiển thị kênh chat, số hotline, địa chỉ email. | Nút gọi hotline **1900 888 999** và nút cuộn lên đầu trang nổi ở góc phải mọi trang. Chân trang và trang Liên hệ có hotline, email `support@ecovintage.vn`, địa chỉ showroom và liên kết Facebook, Zalo. Trong chi tiết sản phẩm có nút chat với người bán. |
| 7 | **Liên hệ** | Form tiếp nhận thông tin khách (họ tên, địa chỉ, email, nội dung) và bản đồ. | Form đủ các trường trên; khi gửi sẽ hiện hộp thoại xác nhận thông tin đã tiếp nhận. Trang có bản đồ Google Maps showroom tại 45 Tràng Tiền, Hoàn Kiếm, Hà Nội và nút mở chỉ đường. |

---

## 3. Hai tính năng nổi bật

### 3.1. Định giá tự động bằng ảnh chụp
Nằm trong form **Đăng bán sản phẩm**:
1. Người bán tải ảnh món đồ (ảnh được nén tự động trước khi lưu).
2. Bấm **Định giá tự động bằng AI từ ảnh**: hiệu ứng quét laser cùng các bước *nhận diện vật thể, phân tích chất liệu và đường may, ước lượng độ hao mòn, đối chiếu giá thị trường*.
3. Kết quả gồm chất liệu nhận diện, mức độ còn lại, độ "zin" ước tính, khoảng giá thị trường và giá gợi ý.
4. Bấm áp dụng để điền giá và tình trạng vào form, không cần gõ lại.

> Đây là bản mô phỏng: kết quả được tạo từ nội dung ảnh và danh mục đã chọn, không gọi mô hình AI thật.

### 3.2. Ví ký quỹ Escrow
1. **Đặt hàng:** người mua chọn thanh toán bằng ví ký quỹ, số tiền bị trừ khỏi ví (số dư ban đầu 2.500.000đ, có nút nạp thêm để thử nghiệm) và được giữ lại, người bán chưa nhận tiền.
2. **Giao hàng:** đơn xuất hiện ở trang **Ví ký quỹ** với trạng thái *Đang giữ tiền* và đồng hồ đếm ngược 48 giờ.
3. **Kiểm tra:** người mua kiểm tra thực tế món đồ (độ sờn, đường may, đúng mô tả).
4. **Kết thúc:** bấm *Hài lòng* để giải ngân cho người bán, hoặc *Sai mô tả* để được hoàn 100% về ví.

---

## 4. Các chức năng khác

- **Mỗi món đồ cũ chỉ bán được một chiếc:** thêm vào giỏ lần nữa sẽ bị từ chối.
- **Coupon có điều kiện:** mã chỉ áp dụng khi đơn đạt mức chi tiêu tối thiểu, nếu không sẽ có thông báo rõ lý do.
- **Chế độ Admin:** nút ở góc dưới bên trái bật/tắt các công cụ quản trị (quản lý sản phẩm, sửa trang giới thiệu); khách thường không thấy các công cụ này.
- **Điều khoản:** khi đăng bán và khi thanh toán, người dùng phải tick đồng ý điều khoản.
- **An toàn dữ liệu nhập:** nội dung người dùng nhập được xử lý để không chèn được mã HTML.
- **Giao diện responsive:** hiển thị tốt trên máy tính, máy tính bảng (dưới 992px) và điện thoại (dưới 768px).

---

## 5. Cấu trúc mã nguồn

```
HTTMDT/
├── index.html            # Trang chủ
├── products.html         # Sản phẩm (lọc 2 cấp, tìm kiếm) – nhận tham số ?cat=&sub=&q=
├── escrow.html           # Ví ký quỹ và đơn hàng của tôi
├── about.html            # Giới thiệu
├── news.html             # Tin tức – Sự kiện
├── contact.html          # Liên hệ
├── order-success.html    # Đặt hàng thành công
├── css/
│   ├── base.css          # Biến màu, reset, chữ, nút và form dùng chung
│   ├── layout.css        # Banner trang, header, menu, chế độ admin
│   ├── footer.css        # Chân trang và nút nổi
│   ├── modals.css        # Cửa sổ, thông báo, bảng giỏ hàng, định giá AI
│   ├── checkout.css      # Các bước thanh toán, tải ảnh, điều khoản
│   ├── home.css, products.css, escrow.css, about.css, news.css, contact.css, order-success.css
│   └── responsive.css    # Media queries (nạp cuối cùng)
└── js/
    ├── data.js           # Dữ liệu ban đầu: danh mục, sản phẩm, tin tức, mã giảm giá
    ├── app.js            # Logic chính: giỏ hàng, Escrow, định giá, quản lý sản phẩm, lọc, tìm kiếm...
    ├── layout.js         # Chèn header, footer và các cửa sổ dùng chung vào mỗi trang
    └── components/       # header.js, footer.js, modals-shop.js, modals-content.js
```

Header, footer và các cửa sổ (modal) nằm trong `js/components/` để dùng chung cho mọi trang. Chúng được nạp bằng thẻ `<script>` thay vì `fetch`, nên có thể mở trực tiếp bằng file mà không cần máy chủ.

**Lưu trữ dữ liệu:** hệ thống chạy hoàn toàn trên trình duyệt. Sản phẩm, tin tức, giỏ hàng, ví, đơn ký quỹ, nội dung trang giới thiệu và trạng thái Admin được lưu trong `localStorage` (các khóa bắt đầu bằng `ecovintage_`). Dữ liệu mẫu ban đầu gồm 7 sản phẩm, 3 bài tin tức và 3 mã giảm giá.

---

## 6. Hướng dẫn chạy

1. Giải nén thư mục dự án.
2. Mở tệp `index.html` bằng trình duyệt (Chrome, Edge, Firefox, Safari...). Không cần cài đặt gì thêm.
3. Cần có kết nối Internet để tải font chữ (Google Fonts), bộ biểu tượng (Font Awesome) và bản đồ.

Để đưa dữ liệu về trạng thái ban đầu: mở công cụ nhà phát triển của trình duyệt (F12) → Application → Local Storage → xóa các khóa bắt đầu bằng `ecovintage_`, rồi tải lại trang.

---

## 7. Kịch bản kiểm thử nhanh

| Chức năng | Các bước |
| :-- | :-- |
| Tìm kiếm | Gõ từ khóa (ví dụ "denim", "đèn") vào ô tìm kiếm trên header, chọn một gợi ý hoặc xem toàn bộ kết quả. |
| Lọc 2 cấp | Vào *Sản phẩm*, chọn *Thời trang vintage* → *Áo khoác và denim retro*; kéo thanh trượt giá, chọn tình trạng, đổi cách sắp xếp. |
| Chi tiết và đánh giá | Mở một sản phẩm, xem thư viện ảnh, viết nhận xét và chọn số sao, đánh giá xuất hiện ngay. Thử các nút chia sẻ. |
| Giỏ hàng và coupon | Thêm một món vào giỏ, tăng giảm số lượng, nhập `VINTAGE10` (cần đơn từ 300.000đ). Thử nút *Mua ngay* ở trang chi tiết. |
| Ví ký quỹ | Chọn thanh toán *Ví ký quỹ Escrow*, đặt hàng, xem biên nhận; vào trang *Ví ký quỹ* để bấm *Hài lòng* hoặc *Sai mô tả*. |
| Định giá bằng ảnh | Mở *Đăng bán*, tải một ảnh lên, bấm *Định giá tự động bằng AI từ ảnh*, áp dụng giá gợi ý rồi lưu sản phẩm. |
| Quản lý (Admin) | Bật nút Admin ở góc dưới bên trái, mở cửa sổ quản lý để ẩn/hiện hoặc xóa sản phẩm, sửa nội dung trang Giới thiệu. |
| Tin tức | Vào *Tin tức*, mở một bài để xem chi tiết và tin liên quan. |
| Liên hệ | Điền họ tên, địa chỉ, email, nội dung, bấm gửi và xem hộp thoại xác nhận; kiểm tra bản đồ showroom. |

---

## 8. Phạm vi và giới hạn

Đây là sản phẩm giao diện và nghiệp vụ chạy phía trình duyệt, không có máy chủ hay cơ sở dữ liệu. Các phần sau được mô phỏng để minh họa luồng hoạt động:

- Định giá bằng ảnh (kết quả giả lập, không dùng AI thật).
- Cổng thanh toán QR Napas và việc chuyển tiền; số dư ví ký quỹ là số liệu thử nghiệm.
- Kênh chat với người bán và email xác nhận gửi khách liên hệ.
- Tài khoản người dùng: chưa có đăng nhập, "Admin" chỉ là công tắc hiển thị công cụ quản trị.

Vì dữ liệu lưu trong `localStorage`, mỗi trình duyệt có dữ liệu riêng và sẽ mất khi xóa dữ liệu duyệt web.
