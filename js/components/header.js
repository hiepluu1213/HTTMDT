/**
 * Header + Menu điều hướng (dùng chung mọi trang)
 */
window.SITE_PARTS = window.SITE_PARTS || {};
SITE_PARTS['header'] = `
  <!-- =========================================================================
       HEADER & THANH ĐIỀU HƯỚNG TASKBAR (SÁNG / TẮT ĐỘNG, LIVE SEARCH DROPDOWN)
       ========================================================================= -->
  <header class="main-header">
    <div class="container">
      <div class="header-inner">
        <!-- Logo thương hiệu -->
        <a href="javascript:void(0)" onclick="navigateTo('home')" class="brand-logo">
          <div class="logo-badge">
            <i class="fa-solid fa-feather-pointed"></i>
          </div>
          <div class="brand-text">
            <h1>EcoVintage</h1>
            <span class="brand-tagline">Second-hand & Sưu tầm Vintage</span>
          </div>
        </a>

        <!-- Module Tìm kiếm có GỢI Ý KẾT QUẢ NGAY PHÍA DƯỚI -->
        <div class="header-search">
          <form class="search-form" id="search-form-el" onsubmit="event.preventDefault();">
            <input type="text" id="header-search-input" class="search-input" placeholder="Tìm quần áo denim, sách cổ, đèn bàn, mã SKU..." autocomplete="off">
            <button type="submit" class="search-btn" title="Tìm kiếm">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <!-- LIVE SEARCH DROPDOWN: HIỆN ĐỒ CẦN TÌM KIẾM NGAY DƯỚI THANH TÌM KIẾM -->
          <div class="live-search-dropdown" id="live-search-dropdown">
            <!-- Render động bằng JS khi người dùng gõ từ khóa -->
          </div>
        </div>

        <!-- Các nút hành động chính -->
        <div class="header-actions">
          <!-- Nút Đăng Bán / Ký Gửi đồ cũ -->
          <button class="btn-sell-nav" onclick="openModal('modal-sell-product')">
            <i class="fa-solid fa-circle-plus"></i>
            <span>Đăng Bán Đồ Cũ</span>
          </button>

          <!-- Nút Quản lý sản phẩm (CRUD Admin / Seller) -->
          <button class="icon-action-btn" onclick="openProductManagerModal()" title="Quản lý danh sách sản phẩm (Sửa/Xóa/Ẩn)">
            <i class="fa-solid fa-sliders"></i>
          </button>

          <!-- Nút Giỏ hàng -->
          <button class="icon-action-btn" onclick="openCartModal()" title="Xem giỏ hàng">
            <i class="fa-solid fa-bag-shopping"></i>
            <span class="cart-count-badge" id="cart-count-badge">0</span>
          </button>

          <!-- Nút bật menu mobile -->
          <button class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Menu Mobile">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Thanh Taskbar điều hướng -->
    <nav class="nav-menu-bar">
      <div class="container nav-menu-inner">
        <ul class="nav-links" id="nav-links-menu">
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="home" onclick="navigateTo('home')">
              <i class="fa-solid fa-house"></i> Trang Chủ
            </a>
          </li>
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="about" onclick="navigateTo('about')">
              <i class="fa-solid fa-book-bookmark"></i> Giới Thiệu
            </a>
          </li>

          <!-- MENU SẢN PHẨM PHÂN CẤP 2 CẤP -->
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="products" onclick="navigateTo('products')">
              <i class="fa-solid fa-gem"></i> Danh Mục Đồ Cũ <i class="fa-solid fa-chevron-down" style="font-size:0.75rem;"></i>
            </a>
            <ul class="dropdown-menu">
              <!-- Cấp 1: Thời trang -->
              <li class="dropdown-item">
                <a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'fashion')">
                  <span><i class="fa-solid fa-shirt" style="width:20px; color:var(--color-accent);"></i> Thời trang Vintage</span>
                  <i class="fa-solid fa-chevron-right" style="font-size:0.75rem;"></i>
                </a>
                <!-- Cấp 2: Thời trang -->
                <ul class="submenu-level2">
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'fashion', 'fashion-jacket')">Áo khoác & Denim Retro</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'fashion', 'fashion-dress')">Váy & Áo sơ mi Cổ điển</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'fashion', 'fashion-accessories')">Phụ kiện Da & Túi xách Cổ</a></li>
                </ul>
              </li>

              <!-- Cấp 1: Sách cũ -->
              <li class="dropdown-item">
                <a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'books')">
                  <span><i class="fa-solid fa-book-open" style="width:20px; color:var(--color-primary);"></i> Sách cũ & Sưu tầm</span>
                  <i class="fa-solid fa-chevron-right" style="font-size:0.75rem;"></i>
                </a>
                <!-- Cấp 2: Sách cũ -->
                <ul class="submenu-level2">
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'books', 'books-classic')">Văn học Kinh điển</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'books', 'books-history')">Triết học & Lịch sử</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'books', 'books-rare')">Sách hiếm & Ấn bản Đầu</a></li>
                </ul>
              </li>

              <!-- Cấp 1: Đồ Decor -->
              <li class="dropdown-item">
                <a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'decor')">
                  <span><i class="fa-solid fa-couch" style="width:20px; color:var(--color-gold);"></i> Đồ Decor & Đồ xưa</span>
                  <i class="fa-solid fa-chevron-right" style="font-size:0.75rem;"></i>
                </a>
                <!-- Cấp 2: Đồ Decor -->
                <ul class="submenu-level2">
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'decor', 'decor-lighting')">Đèn bàn & Quạt cổ</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'decor', 'decor-clock')">Đồng hồ cơ & Máy hát</a></li>
                  <li><a href="javascript:void(0)" class="dropdown-link" onclick="navigateTo('products', 'decor', 'decor-ceramic')">Đồ gốm sứ & Tranh Vintage</a></li>
                </ul>
              </li>
            </ul>
          </li>

          <!-- Mục Ví Ký Quỹ Escrow -->
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="escrow" onclick="navigateTo('escrow')">
              <i class="fa-solid fa-shield-halved"></i> Ví Ký Quỹ Escrow
            </a>
          </li>

          <!-- Mục Tin Tức - Sự Kiện -->
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="news" onclick="navigateTo('news')">
              <i class="fa-regular fa-newspaper"></i> Tin Tức - Sự Kiện
            </a>
          </li>

          <!-- Mục Liên Hệ -->
          <li class="nav-item">
            <a href="javascript:void(0)" class="nav-link" data-page="contact" onclick="navigateTo('contact')">
              <i class="fa-regular fa-address-book"></i> Liên Hệ
            </a>
          </li>
        </ul>

        <div style="font-size:0.84rem; color:var(--text-muted); display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-shield-heart" style="color:var(--color-primary)"></i> Giao dịch Ký Quỹ An Toàn 48H
        </div>
      </div>
    </nav>
  </header>
`;
