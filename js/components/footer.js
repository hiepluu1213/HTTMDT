/**
 * Footer + thanh tiện ích nổi (dùng chung mọi trang)
 */
window.SITE_PARTS = window.SITE_PARTS || {};
SITE_PARTS['footer'] = `
  <footer class="main-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px; cursor:pointer;" onclick="navigateTo('home')">
            <div class="logo-badge" style="width:36px; height:36px; font-size:1.1rem;">
              <i class="fa-solid fa-feather-pointed"></i>
            </div>
            <h3 style="color:#FFF; font-size:1.4rem; margin:0; font-family:var(--font-serif);">EcoVintage</h3>
          </div>
          <p>
            Nền tảng Thương mại Điện tử đồ Second-hand và Vintage uy tín tại Việt Nam với cơ chế bảo vệ giao dịch qua ví ký quỹ an toàn 48h.
          </p>
          <div class="social-icons-row">
            <a href="https://facebook.com" target="_blank" class="social-btn" title="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://skype.com" target="_blank" class="social-btn" title="Nick Skype: ecovintage.support"><i class="fa-brands fa-skype"></i></a>
            <a href="https://zalo.me" target="_blank" class="social-btn" title="Zalo OA: EcoVintage"><i class="fa-solid fa-comment-dots"></i></a>
            <a href="https://instagram.com" target="_blank" class="social-btn" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Danh Mục Đồ Cũ</h4>
          <div class="footer-links">
            <a href="javascript:void(0)" onclick="navigateTo('products', 'fashion')">Thời trang Vintage 70s-90s</a>
            <a href="javascript:void(0)" onclick="navigateTo('products', 'books')">Sách cũ & Văn học cổ</a>
            <a href="javascript:void(0)" onclick="navigateTo('products', 'decor')">Đèn & Đồ Decor đồng cổ</a>
            <a href="javascript:void(0)" onclick="navigateTo('products', 'fashion', 'fashion-accessories')">Túi xách da thủ công</a>
            <a href="javascript:void(0)" onclick="navigateTo('products', 'decor', 'decor-clock')">Đồng hồ cơ Liên Xô</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Chính Sách & Điều Khoản</h4>
          <div class="footer-links">
            <a href="javascript:void(0)" onclick="openTermsModal('checkout')">Điều khoản thanh toán & Ký quỹ</a>
            <a href="javascript:void(0)" onclick="openTermsModal('seller')">Điều khoản người bán đồ cũ</a>
            <a href="javascript:void(0)" onclick="navigateTo('escrow')">Quyền kiểm tra hàng 48 giờ</a>
            <a href="javascript:void(0)" onclick="navigateTo('about')">Sứ mệnh kinh tế tuần hoàn</a>
            <a href="javascript:void(0)" onclick="navigateTo('contact')">Quy trình giải quyết khiếu nại</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Kênh Hỗ Trực Tiếp</h4>
          <p style="margin-bottom:8px;"><i class="fa-solid fa-phone" style="color:var(--color-gold); margin-right:6px;"></i> Hotline: <strong>1900 888 999</strong></p>
          <p style="margin-bottom:8px;"><i class="fa-brands fa-skype" style="color:#00AFF0; margin-right:6px;"></i> Skype: <strong>ecovintage_vn</strong></p>
          <p style="margin-bottom:8px;"><i class="fa-solid fa-envelope" style="color:var(--color-gold); margin-right:6px;"></i> Email: <strong>hotro@ecovintage.vn</strong></p>
          <p><i class="fa-solid fa-shield-halved" style="color:#2ECC71; margin-right:6px;"></i> Cổng thanh toán ký quỹ: <strong>Mã hóa 256-bit SSL</strong></p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 EcoVintage E-Commerce Platform. Bản quyền thuộc về Đồ Cũ & Vintage Việt Nam.</span>
        <span>Phục vụ trên mọi trình duyệt: Chrome, Firefox, Safari, Edge, Cốc Cốc.</span>
      </div>
    </div>
  </footer>

  <div class="floating-support-bar">
    <!-- Nút gọi Hotline -->
    <a href="javascript:void(0)" onclick="openLiveChat('phone')" class="float-action-btn phone" title="Gọi Hotline: 1900 888 999">
      <i class="fa-solid fa-phone"></i>
      <span class="tooltip-text">Hotline 1900 888 999</span>
    </a>

    <!-- Nút cuộn lên đầu trang -->
    <a href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})" class="float-action-btn top" title="Lên đầu trang">
      <i class="fa-solid fa-arrow-up"></i>
      <span class="tooltip-text">Lên đầu trang</span>
    </a>
  </div>
`;
