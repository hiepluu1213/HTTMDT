/**
 * Modal: chi tiết SP, đăng bán, quản lý SP, giỏ hàng/thanh toán, điều khoản
 */
window.SITE_PARTS = window.SITE_PARTS || {};
SITE_PARTS['modals-shop'] = `
  <div class="modal-overlay" id="modal-product-detail">
    <div class="modal-dialog" style="max-width:960px;">
      <button class="modal-close-btn" onclick="closeModal('modal-product-detail')">&times;</button>
      <div id="product-detail-modal-body">
        <!-- Render động từ js/app.js -->
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-sell-product">
    <div class="modal-dialog" style="max-width:720px; padding:32px;">
      <button class="modal-close-btn" onclick="closeModal('modal-sell-product')">&times;</button>
      <div style="border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:20px;">
        <span class="section-tag"><i class="fa-solid fa-circle-plus"></i> Ký gửi đồ cũ</span>
        <h2 style="font-size:1.6rem; margin-top:4px;">Đăng Bán Sản Phẩm Second-Hand / Vintage</h2>
        <p style="font-size:0.86rem; color:var(--text-muted); margin:0;">Tải ảnh chụp từ máy và nhập thông tin để niêm yết lên sàn EcoVintage.</p>
      </div>

      <form id="sell-product-form" onsubmit="handleSaveProduct(event)">
        <div class="form-group">
          <label class="form-label" for="sell-name">Tên sản phẩm *</label>
          <input type="text" id="sell-name" class="form-control" placeholder="Ví dụ: Áo khoác da bò biker cổ điển 1980s" required>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group">
            <label class="form-label" for="sell-category">Danh mục chính (Cấp 1) *</label>
            <select id="sell-category" class="form-control" onchange="onSellCategoryChange()" required>
              <option value="fashion">Thời trang Vintage</option>
              <option value="books">Sách cũ & Sưu tầm</option>
              <option value="decor">Đồ Decor & Đồ xưa</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="sell-subcategory">Danh mục con (Cấp 2) *</label>
            <select id="sell-subcategory" class="form-control" required>
              <option value="fashion-jacket">Áo khoác & Denim Retro</option>
              <option value="fashion-dress">Váy & Áo sơ mi Cổ điển</option>
              <option value="fashion-accessories">Phụ kiện Da & Túi xách Cổ</option>
            </select>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group">
            <label class="form-label" for="sell-price">Giá mong muốn bán (VNĐ) *</label>
            <input type="number" id="sell-price" class="form-control" placeholder="Ví dụ: 650000" min="10000" step="10000" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sell-condition">Độ mới / Tình trạng *</label>
            <input type="text" id="sell-condition" class="form-control" placeholder="Ví dụ: 92% (Chất vải đanh, sờn nhẹ)" required>
          </div>
        </div>

        <!-- PHẦN TẢI TỆP ẢNH LÊN THAY CHO LINK ẢNH THEO YÊU CẦU NGƯỜI DÙNG -->
        <div class="form-group">
          <label class="form-label">Tải tệp ảnh chụp sản phẩm từ máy tính *</label>
          <div class="file-upload-box" onclick="document.getElementById('sell-file-input').click()">
            <input type="file" id="sell-file-input" accept="image/*" style="display:none;" onchange="handleSellPhotoUpload(event)">
            
            <div id="sell-upload-prompt">
              <i class="fa-solid fa-cloud-arrow-up" style="font-size:2.2rem; color:var(--color-accent); margin-bottom:8px;"></i>
              <div style="font-weight:600; font-size:0.92rem; color:var(--text-main);">Nhấn vào đây để chọn tệp ảnh từ thiết bị</div>
              <span style="font-size:0.78rem; color:var(--text-muted); display:block; margin-top:2px;">Hỗ trợ ảnh định dạng JPG, PNG, WEBP chụp thực tế</span>
            </div>

            <!-- Khung xem trước ảnh tải lên -->
            <div class="file-preview-wrap" id="sell-file-preview-wrap">
              <img id="sell-preview-img" src="" alt="Ảnh sản phẩm tải lên">
              <button type="button" class="btn-remove-preview" onclick="removeSellPhoto(event)" title="Xóa ảnh này">&times;</button>
            </div>
          </div>
        </div>

        <!-- AI ĐỊNH GIÁ QUA ẢNH (MÔ PHỎNG) -->
        <div class="form-group">
          <button type="button" class="btn-primary" style="background:var(--color-gold);" onclick="runAIValuation()">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Định giá tự động bằng AI từ ảnh
          </button>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:8px;">(Mô phỏng cho bản demo)</span>
          <div id="ai-scan-box" class="ai-scan-box" style="display:none;">
            <div class="ai-scan-img-wrap"><img id="ai-scan-img" src="" alt="Ảnh đang quét"><div class="ai-scan-line"></div></div>
            <div id="ai-scan-text" style="font-size:0.85rem; color:var(--text-muted); text-align:center; margin-top:8px;">Đang phân tích chất liệu, độ sờn rách...</div>
          </div>
          <div id="ai-result-box" class="ai-result-box" style="display:none;"></div>
        </div>

        <div class="form-group">
          <label class="form-label" for="sell-description">Mô tả chi tiết món đồ *</label>
          <textarea id="sell-description" class="form-control" placeholder="Nêu rõ xuất xứ, kích cỡ (size), dấu ấn thời gian, lỗi nhỏ nếu có..." required></textarea>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-group">
            <label class="form-label" for="sell-seller-name">Tên người bán / Tiệm đồ *</label>
            <input type="text" id="sell-seller-name" class="form-control" placeholder="Ví dụ: Tiệm Đồ Cũ An Yên" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sell-seller-phone">Số điện thoại liên hệ *</label>
            <input type="tel" id="sell-seller-phone" class="form-control" placeholder="0912 xxx xxx" required>
          </div>
        </div>

        <!-- PHẦN ĐIỀU KHOẢN KHI ĐĂNG BÁN ĐỒ CŨ THEO YÊU CẦU NGƯỜI DÙNG -->
        <div class="terms-agreement-box">
          <input type="checkbox" id="seller-terms-agree" required>
          <label for="seller-terms-agree" style="cursor:pointer;">
            Tôi cam kết mô tả trung thực 100% tình trạng đồ cũ, chịu trách nhiệm hoàn tiền nếu hàng giao bị lỗi/rách không đúng cam kết và tuân thủ <a href="javascript:void(0)" class="terms-link" onclick="openTermsModal('seller')">Điều khoản người bán đồ cũ & Ví Ký Quỹ EcoVintage</a>.
          </label>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:16px;">
          <button type="button" class="btn-outline-white" style="color:var(--text-main); border-color:var(--border-color);" onclick="closeModal('modal-sell-product')">Hủy bỏ</button>
          <button type="submit" class="btn-primary"><i class="fa-solid fa-cloud-arrow-up"></i> Xác Nhận Đăng Bán</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-overlay" id="modal-manage-products">
    <div class="modal-dialog" style="max-width:850px; padding:28px;">
      <button class="modal-close-btn" onclick="closeModal('modal-manage-products')">&times;</button>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <div>
          <h3 style="font-size:1.35rem; margin:0;"><i class="fa-solid fa-boxes-stacked" style="color:var(--color-primary)"></i> Quản Lý Sản Phẩm Đăng Bán</h3>
          <span style="font-size:0.82rem; color:var(--text-muted)">Thao tác thêm, xóa, ẩn hoặc hiển thị sản phẩm trên danh mục</span>
        </div>
        <button class="btn-primary" style="padding:8px 16px; font-size:0.85rem;" onclick="closeModal('modal-manage-products'); openModal('modal-sell-product');">
          <i class="fa-solid fa-plus"></i> Đăng món mới
        </button>
      </div>

      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:0.88rem;">
          <thead>
            <tr style="background:var(--bg-subtle); border-bottom:1px solid var(--border-color);">
              <th style="padding:10px; text-align:left;">Mã SKU</th>
              <th style="padding:10px; text-align:left;">Tên món đồ</th>
              <th style="padding:10px; text-align:left;">Giá bán</th>
              <th style="padding:10px; text-align:left;">Trạng thái</th>
              <th style="padding:10px; text-align:left;">Thao tác</th>
            </tr>
          </thead>
          <tbody id="manage-products-table-body">
            <!-- Render động bằng JS -->
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-cart">
    <div class="modal-dialog" style="max-width:880px; padding:30px;">
      <button class="modal-close-btn" onclick="closeModal('modal-cart')">&times;</button>
      
      <div style="border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:18px;">
        <span class="section-tag"><i class="fa-solid fa-bag-shopping"></i> Giỏ hàng của bạn</span>
        <h2 style="font-size:1.55rem; margin-top:4px;">Thanh Toán Đơn Hàng</h2>
      </div>

      <div id="cart-empty-message" style="text-align:center; padding:40px 0; display:none;">
        <i class="fa-solid fa-cart-shopping" style="font-size:3.5rem; color:#DDD; margin-bottom:14px;"></i>
        <h4 style="font-size:1.15rem;">Giỏ hàng hiện đang trống</h4>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:18px;">Hãy dạo một vòng kho đồ cũ và chọn cho mình những món đồ vintage độc bản nhé!</p>
        <button class="btn-primary" onclick="closeModal('modal-cart'); navigateTo('products');">Khám phá sản phẩm</button>
      </div>

      <div id="cart-active-content">
        <!-- BẢNG CÁC BƯỚC TIẾP THEO CHO HÌNH THỨC THANH TOÁN -->
        <div class="checkout-stepper">
          <div class="step-indicator active" id="indicator-step-1">
            <span class="indicator-badge">1</span>
            <span>Thông tin & Hình thức</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-indicator" id="indicator-step-2">
            <span class="indicator-badge">2</span>
            <span>Xác nhận & Ký quỹ an toàn</span>
          </div>
        </div>

        <!-- BẢNG SẢN PHẨM TRONG GIỎ HÀNG -->
        <div style="overflow-x:auto;">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="cart-items-tbody">
              <!-- Render động bằng JS -->
            </tbody>
          </table>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:12px 18px; border-radius:10px; margin:16px 0; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <i class="fa-solid fa-ticket" style="color:var(--color-gold); font-size:1.2rem;"></i>
            <span style="font-size:0.88rem; font-weight:600;">Mã giảm giá:</span>
            <input type="text" id="coupon-input" class="form-control" placeholder="VINTAGE10 hoặc ECOGREEN" style="width:190px; padding:6px 10px; text-transform:uppercase;">
            <button class="btn-primary" style="padding:6px 14px; font-size:0.85rem;" onclick="applyCouponCode()">Áp Dụng</button>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted);">
            Gợi ý: <strong style="color:var(--color-primary)">VINTAGE10</strong> (-10%), <strong style="color:var(--color-accent)">ECOGREEN</strong> (-50K)
          </div>
        </div>

        <!-- BƯỚC 1: THÔNG TIN NGƯỜI NHẬN & CHỌN PHƯƠNG THỨC -->
        <div id="checkout-step-1">
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:28px;" class="checkout-grid">
            <div>
              <h4 style="font-size:1.05rem; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:6px;">1. Thông tin người nhận:</h4>
              <div class="form-group">
                <input type="text" id="checkout-name" class="form-control" placeholder="Họ và tên người nhận *" required>
              </div>
              <div class="form-group">
                <input type="tel" id="checkout-phone" class="form-control" placeholder="Số điện thoại nhận hàng *" required>
              </div>
              <div class="form-group">
                <input type="text" id="checkout-address" class="form-control" placeholder="Địa chỉ giao hàng chi tiết *" required>
              </div>

              <h4 style="font-size:1.05rem; margin-top:16px; margin-bottom:10px;">2. Chọn hình thức thanh toán:</h4>
              
              <label class="payment-radio-box escrow-opt">
                <input type="radio" name="payment_method" value="escrow" checked style="accent-color:var(--color-gold); width:18px; height:18px;">
                <div>
                  <strong style="color:var(--color-primary); display:block; font-size:0.92rem;"><i class="fa-solid fa-shield-halved" style="color:var(--color-gold)"></i> Ví Ký Quỹ Escrow An Toàn (Khuyên Dùng)</strong>
                  <span style="font-size:0.78rem; color:var(--text-muted);">Tiền được tạm giữ an toàn. Chỉ giải ngân cho người bán sau 48h khi bạn kiểm tra và xác nhận hài lòng.</span>
                </div>
              </label>

              <label class="payment-radio-box">
                <input type="radio" name="payment_method" value="banking" style="accent-color:var(--color-primary); width:18px; height:18px;">
                <div>
                  <strong style="display:block; font-size:0.92rem;"><i class="fa-solid fa-qrcode"></i> Chuyển khoản QR Napas 24/7</strong>
                  <span style="font-size:0.78rem; color:var(--text-muted);">Quét mã QR chuyển khoản trực tiếp qua ngân hàng.</span>
                </div>
              </label>

              <label class="payment-radio-box">
                <input type="radio" name="payment_method" value="cod" style="accent-color:var(--color-primary); width:18px; height:18px;">
                <div>
                  <strong style="display:block; font-size:0.92rem;"><i class="fa-solid fa-truck"></i> Thanh toán tiền mặt khi nhận hàng (COD)</strong>
                  <span style="font-size:0.78rem; color:var(--text-muted);">Trả tiền cho nhân viên giao hàng sau khi đồng kiểm kiện hàng.</span>
                </div>
              </label>
            </div>

            <!-- Tóm tắt số tiền -->
            <div style="background:var(--bg-body); border-radius:12px; padding:20px; border:1px solid var(--border-color); align-self:start;">
              <h4 style="font-size:1.05rem; margin-bottom:14px;">Tóm tắt đơn hàng</h4>
              
              <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                <span style="color:var(--text-muted)">Tạm tính:</span>
                <strong id="cart-subtotal">0 ₫</strong>
              </div>

              <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.9rem;">
                <span style="color:var(--text-muted)">Giảm giá voucher:</span>
                <strong id="cart-discount" style="color:var(--color-danger)">0 ₫</strong>
              </div>

              <div style="display:flex; justify-content:space-between; margin-bottom:14px; font-size:0.9rem;">
                <span style="color:var(--text-muted)">Phí vận chuyển bảo hiểm:</span>
                <span style="color:var(--color-success); font-weight:600;">Miễn phí</span>
              </div>

              <div style="display:flex; justify-content:space-between; padding-top:14px; border-top:1.5px dashed var(--border-color); margin-bottom:20px;">
                <strong style="font-size:1.1rem;">Tổng thanh toán:</strong>
                <strong id="cart-grand-total" style="font-size:1.4rem; color:var(--color-primary); font-family:var(--font-serif);">0 ₫</strong>
              </div>

              <!-- NÚT BƯỚC TIẾP THEO -->
              <button type="button" class="btn-primary" style="width:100%; justify-content:center; padding:12px;" onclick="proceedToPaymentStep2()">
                Tiếp tục: Thanh toán an toàn <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- BƯỚC 2: XÁC THỰC CHI TIẾT THANH TOÁN & ĐIỀU KHOẢN -->
        <div id="checkout-step-2" style="display:none;">
          <div id="step-2-method-content">
            <!-- Render động bằng JS: Hướng dẫn Escrow / QR Napas / COD -->
          </div>

          <!-- PHẦN ĐIỀU KHOẢN KHI THANH TOÁN THEO YÊU CẦU NGƯỜI DÙNG -->
          <div class="terms-agreement-box">
            <input type="checkbox" id="checkout-terms-agree" required>
            <label for="checkout-terms-agree" style="cursor:pointer;">
              Tôi đã đọc, hiểu rõ và đồng ý với <a href="javascript:void(0)" class="terms-link" onclick="openTermsModal('checkout')">Điều khoản thanh toán & Chính sách giữ tiền 48h của Ví Ký Quỹ Escrow EcoVintage</a>.
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
            <button type="button" class="btn-outline-white" style="color:var(--text-main); border-color:var(--border-color);" onclick="backToPaymentStep1()">
              <i class="fa-solid fa-arrow-left"></i> Quay lại chỉnh sửa thông tin
            </button>
            <button type="button" class="btn-primary" style="padding:12px 28px;" onclick="confirmFinalOrder(event)">
              <i class="fa-solid fa-lock"></i> Xác Nhận Đặt Hàng & Hoàn Tất
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-terms-checkout">
    <div class="modal-dialog" style="max-width:680px; padding:32px;">
      <button class="modal-close-btn" onclick="closeModal('modal-terms-checkout')">&times;</button>
      <h3 style="font-size:1.35rem; color:var(--color-primary); margin-bottom:12px;">
        <i class="fa-solid fa-shield-halved" style="color:var(--color-gold);"></i> Điều Khoản Thanh Toán & Ví Ký Quỹ Escrow
      </h3>
      <div style="max-height:360px; overflow-y:auto; font-size:0.88rem; color:var(--text-main); line-height:1.7; padding-right:8px;">
        <p><strong>1. Nguyên tắc giữ tiền độc lập:</strong> Toàn bộ số tiền đặt mua sản phẩm của quý khách sẽ được giữ trong tài khoản Ví Ký Quỹ trung gian của EcoVintage. Người bán hoàn toàn không thể tiếp cận hay rút số tiền này cho đến khi đơn hàng hoàn tất.</p>
        <p><strong>2. Thời hạn kiểm tra 48 giờ:</strong> Tính từ thời điểm đơn vị vận chuyển cập nhật giao hàng thành công, quý khách có trọn vẹn 48 giờ để mở kiện hàng, thử đồ và đối chiếu với mô tả của người bán.</p>
        <p><strong>3. Quyền khiếu nại & hoàn tiền 100%:</strong> Trong vòng 48h, nếu sản phẩm có lỗi rách, vỡ, hỏng hóc hoặc khác biệt nghiêm trọng so với mô tả mà không được thông báo trước, quý khách có quyền bấm "Yêu cầu Trả hàng/Hoàn tiền". Hệ thống sẽ tạm dừng giải ngân và hỗ trợ thu hồi hàng miễn phí, hoàn lại 100% số tiền đã cọc.</p>
        <p><strong>4. Giải ngân tự động:</strong> Nếu sau 48h kể từ khi nhận hàng mà quý khách không có bất kỳ phản hồi hoặc khiếu nại nào, hệ thống sẽ mặc định giao dịch thành công và giải ngân cho người bán.</p>
      </div>
      <div style="text-align:right; margin-top:20px;">
        <button class="btn-primary" onclick="closeModal('modal-terms-checkout')">Tôi Đã Hiểu</button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-terms-seller">
    <div class="modal-dialog" style="max-width:680px; padding:32px;">
      <button class="modal-close-btn" onclick="closeModal('modal-terms-seller')">&times;</button>
      <h3 style="font-size:1.35rem; color:var(--color-primary); margin-bottom:12px;">
        <i class="fa-solid fa-file-contract" style="color:var(--color-accent);"></i> Điều Khoản Dành Cho Người Bán Đồ Cũ
      </h3>
      <div style="max-height:360px; overflow-y:auto; font-size:0.88rem; color:var(--text-main); line-height:1.7; padding-right:8px;">
        <p><strong>1. Cam kết trung thực 100%:</strong> Người bán có nghĩa vụ tải lên ảnh chụp thật của sản phẩm, mô tả chi tiết mọi khuyết điểm, vết sờn, ố màu hoặc vết trầy xước nếu có. Tuyệt đối không sử dụng ảnh mạng hoặc chỉnh sửa quá đà che giấu lỗi.</p>
        <p><strong>2. Nghiêm cấm hàng giả / hàng vi phạm pháp luật:</strong> EcoVintage kiên quyết cấm buôn bán hàng giả, hàng nhái thương hiệu hoặc đồ cổ thuộc diện di vật quốc gia bị cấm lưu hành. Tài khoản vi phạm sẽ bị khóa vĩnh viễn.</p>
        <p><strong>3. Quy chuẩn đóng gói:</strong> Người bán phải đóng gói sản phẩm cẩn thận, bọc xốp bóng khí hoặc giấy kraft chống va đập, đảm bảo sản phẩm nguyên vẹn trong suốt quá trình vận chuyển.</p>
        <p><strong>4. Chấp thuận cơ chế ký quỹ:</strong> Người bán đồng ý rằng tiền thanh toán chỉ được cộng vào ví của mình sau khi người mua kiểm tra hàng trong 48 giờ và xác nhận đúng mô tả.</p>
      </div>
      <div style="text-align:right; margin-top:20px;">
        <button class="btn-primary" onclick="closeModal('modal-terms-seller')">Tôi Đồng Ý</button>
      </div>
    </div>
  </div>
`;
