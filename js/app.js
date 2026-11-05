/**
 * ECOVINTAGE - JAVASCRIPT APPLICATION CORE
 * Quản lý tương tác, Điều hướng đa trang, Live Search Dropdown, Giỏ hàng đa bước, Ví Ký quỹ Escrow, CRUD Sản phẩm & Tin tức
 */

// ==========================================
// 1. STATE & STORAGE MANAGEMENT
// ==========================================
const AppState = {
  currentPage: 'home',
  products: [],
  categories: [],
  news: [],
  cart: [],
  appliedCoupon: null,
  walletBalance: 2500000,
  escrowOrders: [],
  checkoutStep: 1,
  pendingOrderData: null,
  filters: {
    category: 'all',
    subcategory: 'all',
    condition: 'all',
    maxPrice: 3000000,
    searchQuery: '',
    sortBy: 'newest'
  }
};

let currentSellImageBase64 = '';

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
// Dùng khi nhúng chuỗi vào onclick="fn('...')" — tránh vỡ khi có dấu ' hoặc "
function jsArg(s) {
  return escapeHtml(String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
}
function decodeEntities(s) {
  return new DOMParser().parseFromString(String(s), 'text/html').documentElement.textContent;
}
function safeSetItem(key, value) {
  try { localStorage.setItem(key, value); return true; }
  catch (e) { showToast('Bộ nhớ trình duyệt đã đầy, dữ liệu mới có thể không được lưu (hãy dùng ảnh nhỏ hơn).', 'danger'); return false; }
}

// Khởi tạo và nạp dữ liệu từ LocalStorage
function initStorage() {
  const savedProducts = localStorage.getItem('ecovintage_products');
  AppState.products = savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;

  const savedNews = localStorage.getItem('ecovintage_news');
  AppState.news = savedNews ? JSON.parse(savedNews) : INITIAL_NEWS;

  const savedCart = localStorage.getItem('ecovintage_cart');
  AppState.cart = savedCart ? JSON.parse(savedCart) : [];

  AppState.categories = INITIAL_CATEGORIES;

  const savedWallet = localStorage.getItem('ecovintage_wallet');
  if (savedWallet) AppState.walletBalance = parseInt(savedWallet, 10);

  const savedEscrow = localStorage.getItem('ecovintage_escrow_orders');
  AppState.escrowOrders = savedEscrow ? JSON.parse(savedEscrow) : [];
}

function saveProductsToStorage() {
  safeSetItem('ecovintage_products', JSON.stringify(AppState.products));
}

function saveNewsToStorage() {
  localStorage.setItem('ecovintage_news', JSON.stringify(AppState.news));
}

function saveCartToStorage() {
  localStorage.setItem('ecovintage_cart', JSON.stringify(AppState.cart));
  updateCartBadge();
}

function saveWalletToStorage() {
  safeSetItem('ecovintage_wallet', AppState.walletBalance.toString());
}

function saveEscrowToStorage() {
  safeSetItem('ecovintage_escrow_orders', JSON.stringify(AppState.escrowOrders));
}

// ==========================================
// 2. UTILITIES & FORMATTING
// ==========================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'danger') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 3. PAGE NAVIGATION & TASKBAR ACTIVE LOGIC
// ==========================================
const PAGE_FILES = {
  'home': 'index.html',
  'products': 'products.html',
  'escrow': 'escrow.html',
  'about': 'about.html',
  'news': 'news.html',
  'contact': 'contact.html',
  'order-success': 'order-success.html'
};

function currentPageId() {
  return document.body.dataset.page || 'home';
}

function navigateTo(pageId, categoryFilter = null, subcategoryFilter = null) {
  // Khác trang -> mở file HTML tương ứng (kèm tham số lọc cho trang sản phẩm)
  if (pageId !== currentPageId()) {
    const params = new URLSearchParams();
    if (pageId === 'products') {
      if (categoryFilter) params.set('cat', categoryFilter);
      if (subcategoryFilter) params.set('sub', subcategoryFilter);
      if (AppState.filters.searchQuery.trim()) params.set('q', AppState.filters.searchQuery.trim());
    }
    const qs = params.toString();
    window.location.href = (PAGE_FILES[pageId] || 'index.html') + (qs ? '?' + qs : '');
    return;
  }

  // Cùng trang sản phẩm: chỉ cập nhật bộ lọc
  if (pageId === 'products') {
    if (categoryFilter) AppState.filters.category = categoryFilter;
    if (subcategoryFilter) AppState.filters.subcategory = subcategoryFilter;
    renderCategoryTree();
    renderProducts();
  }

  if (pageId === 'order-success') renderOrderSuccess();
  const navMenu = document.getElementById('nav-links-menu');
  if (navMenu) navMenu.classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sáng taskbar theo trang hiện tại + đọc tham số lọc từ URL
function initPageContext() {
  const pageId = currentPageId();
  AppState.currentPage = pageId;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-page') === pageId);
  });
  const params = new URLSearchParams(window.location.search);
  if (pageId === 'products') {
    if (params.get('cat')) AppState.filters.category = params.get('cat');
    if (params.get('sub')) AppState.filters.subcategory = params.get('sub');
    if (params.get('q')) {
      AppState.filters.searchQuery = params.get('q');
      const si = document.getElementById('header-search-input');
      if (si) si.value = params.get('q');
    }
  }
}

// ==========================================
// 4. LIVE SEARCH DROPDOWN
// ==========================================
function initLiveSearch() {
  const searchInput = document.getElementById('header-search-input');
  const dropdown = document.getElementById('live-search-dropdown');
  if (!searchInput || !dropdown) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length === 0) {
      dropdown.classList.remove('show');
      dropdown.innerHTML = '';
      return;
    }

    const matches = AppState.products.filter(p => {
      if (p.status === 'hidden') return false;
      const matchName = p.name.toLowerCase().includes(query);
      const matchSku = p.sku.toLowerCase().includes(query);
      const matchCat = p.categoryName.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      return matchName || matchSku || matchCat || matchDesc;
    });

    if (matches.length === 0) {
      dropdown.innerHTML = `
        <div class="live-search-empty">
          <i class="fa-solid fa-box-open" style="font-size:1.8rem; color:var(--text-light); margin-bottom:8px; display:block;"></i>
          Không tìm thấy món đồ nào cho từ khóa "<strong>${escapeHtml(e.target.value)}</strong>"
        </div>
      `;
      dropdown.classList.add('show');
      return;
    }

    const displayItems = matches.slice(0, 5);
    let html = `
      <div class="live-search-header">
        <span>GỢI Ý TÌM KIẾM (${matches.length} KẾT QUẢ)</span>
        <span>Bấm để xem chi tiết</span>
      </div>
    `;

    displayItems.forEach(p => {
      html += `
        <div class="live-search-item" onclick="onSelectLiveSearchResult('${p.id}')">
          <img src="${p.images[0]}" alt="${p.name}" class="live-search-thumb">
          <div class="live-search-info">
            <div class="live-search-title">${p.name}</div>
            <div class="live-search-meta">
              <span class="live-search-cat">${p.categoryName}</span>
              <span class="live-search-price">${formatCurrency(p.price)}</span>
              <span class="condition-badge ${p.conditionType==='like-new'?'like-new':''}" style="position:static; font-size:0.65rem; padding:2px 6px;">${p.condition}</span>
            </div>
          </div>
        </div>
      `;
    });

    html += `
      <div class="live-search-footer" onclick="viewAllSearchResults('${jsArg(query)}')">
        Xem tất cả ${matches.length} kết quả trong Danh Mục Sản Phẩm <i class="fa-solid fa-arrow-right" style="margin-left:6px;"></i>
      </div>
    `;

    dropdown.innerHTML = html;
    dropdown.classList.add('show');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  const searchForm = document.getElementById('search-form-el');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      viewAllSearchResults(query);
    });
  }
}

function onSelectLiveSearchResult(productId) {
  const dropdown = document.getElementById('live-search-dropdown');
  if (dropdown) dropdown.classList.remove('show');
  viewProductDetail(productId);
}

function viewAllSearchResults(query) {
  const dropdown = document.getElementById('live-search-dropdown');
  if (dropdown) dropdown.classList.remove('show');

  AppState.filters.searchQuery = query;
  AppState.filters.category = 'all';
  AppState.filters.subcategory = 'all';
  navigateTo('products');
  if (currentPageId() === 'products') showToast(`Hiển thị kết quả tìm kiếm cho: "${query}"`, 'info');
}

// ==========================================
// 5. BANNER SLIDER LOGIC
// ==========================================
let currentSlide = 0;
let slideInterval = null;

function initSlider() {
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slider-dots .dot');
  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  window.nextSlide = function() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  window.prevSlide = function() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  window.goToSlide = function(idx) {
    showSlide(idx);
    resetInterval();
  };

  function resetInterval() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(window.nextSlide, 5500);
  }

  resetInterval();
}

// ==========================================
// 7. HOME PAGE HIGHLIGHTS
// ==========================================
function renderHomeHighlights() {
  const container = document.getElementById('home-new-products-grid');
  if (!container) return;

  const latest = AppState.products.filter(p => p.status !== 'hidden').slice(0, 4);

  container.innerHTML = latest.map(p => {
    const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const condClass = p.conditionType === 'like-new' ? 'like-new' : (p.conditionType === 'patina' ? 'patina' : '');

    return `
      <div class="product-card">
        <div class="product-thumb-box">
          <img src="${p.images[0]}" alt="${p.name}" class="product-thumb-img" loading="lazy">
          <span class="condition-badge ${condClass}">${p.condition}</span>
          <span class="sku-badge">${p.sku}</span>
        </div>
        <div class="product-card-body">
          <span class="product-cat-tag">${p.categoryName}</span>
          <a href="javascript:void(0)" onclick="viewProductDetail('${p.id}')" class="product-name-link" title="${p.name}">
            ${p.name}
          </a>
          <div class="product-seller-row">
            <img src="${p.seller.avatar}" alt="${p.seller.name}" class="seller-avatar-mini">
            <span>${p.seller.name} ${p.seller.verified ? '<i class="fa-solid fa-certificate" style="color:var(--color-primary); font-size:0.75rem;"></i>' : ''}</span>
          </div>
          <div class="product-price-row">
            <span class="current-price">${formatCurrency(p.price)}</span>
            ${p.originalPrice ? `<span class="original-price">${formatCurrency(p.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="discount-pill">-${discount}%</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn-add-cart" onclick="addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
            </button>
            <button class="btn-quick-view" onclick="viewProductDetail('${p.id}')" title="Xem chi tiết">
              <i class="fa-regular fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 8. PRODUCT CATALOG & 2-LEVEL CATEGORIES
// ==========================================
function renderCategoryTree() {
  const catContainer = document.getElementById('category-filter-tree');
  if (!catContainer) return;

  let html = `
    <div class="cat-tree-item ${AppState.filters.category === 'all' ? 'active' : ''}">
      <button class="cat-btn" onclick="filterByCategory('all')">
        <span><i class="fa-solid fa-layer-group" style="margin-right:8px; color:var(--color-primary)"></i> Tất cả sản phẩm</span>
        <span class="count-badge">(${AppState.products.filter(p => p.status !== 'hidden').length})</span>
      </button>
    </div>
  `;

  AppState.categories.forEach(cat => {
    const count = AppState.products.filter(p => p.categoryId === cat.id && p.status !== 'hidden').length;
    const isCatActive = AppState.filters.category === cat.id;

    html += `
      <div class="cat-tree-item ${isCatActive ? 'active' : ''}">
        <button class="cat-btn" onclick="filterByCategory('${cat.id}')">
          <span><i class="fa-solid ${cat.icon}" style="margin-right:8px; color:var(--color-accent)"></i> ${cat.name}</span>
          <span class="count-badge">(${count})</span>
        </button>
        <div class="subcat-list">
          ${cat.subcategories.map(sub => {
            const subCount = AppState.products.filter(p => p.subcategoryId === sub.id && p.status !== 'hidden').length;
            const isSubActive = AppState.filters.subcategory === sub.id;
            return `
              <button class="subcat-btn ${isSubActive ? 'active' : ''}" onclick="filterBySubcategory('${cat.id}', '${sub.id}')">
                ↳ ${sub.name} <span style="font-size:0.75rem; opacity:0.8">(${subCount})</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  catContainer.innerHTML = html;
}

function filterByCategory(catId) {
  AppState.filters.category = catId;
  AppState.filters.subcategory = 'all';
  renderCategoryTree();
  renderProducts();
}

function filterBySubcategory(catId, subcatId) {
  AppState.filters.category = catId;
  AppState.filters.subcategory = subcatId;
  renderCategoryTree();
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('filter-results-count');
  if (!grid) return;

  let filtered = AppState.products.filter(p => {
    if (p.status === 'hidden') return false;
    if (AppState.filters.category !== 'all' && p.categoryId !== AppState.filters.category) return false;
    if (AppState.filters.subcategory !== 'all' && p.subcategoryId !== AppState.filters.subcategory) return false;
    if (AppState.filters.condition !== 'all' && p.conditionType !== AppState.filters.condition) return false;
    if (p.price > AppState.filters.maxPrice) return false;

    if (AppState.filters.searchQuery.trim() !== '') {
      const q = AppState.filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  if (AppState.filters.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.filters.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.filters.sortBy === 'popular') {
    filtered.sort((a, b) => b.views - a.views);
  } else {
    filtered.sort((a, b) => ((b.createdAt || 0) - (a.createdAt || 0)) || (b.id > a.id ? 1 : -1));
  }

  if (countEl) countEl.innerText = `Hiển thị ${filtered.length} sản phẩm phù hợp`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; background:#FFF; border-radius:12px; border:1px solid var(--border-color)">
        <i class="fa-solid fa-box-open" style="font-size:3rem; color:var(--text-light); margin-bottom:12px"></i>
        <h3>Không tìm thấy sản phẩm phù hợp</h3>
        <p style="color:var(--text-muted); margin-top:6px">Vui lòng điều chỉnh lại bộ lọc giá hoặc danh mục tìm kiếm.</p>
        <button class="btn-primary" style="margin-top:16px" onclick="resetAllFilters()">Xóa bộ lọc</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const condClass = p.conditionType === 'like-new' ? 'like-new' : (p.conditionType === 'patina' ? 'patina' : '');

    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-thumb-box">
          <img src="${p.images[0]}" alt="${p.name}" class="product-thumb-img" loading="lazy">
          <span class="condition-badge ${condClass}">${p.condition}</span>
          <span class="sku-badge">${p.sku}</span>
        </div>
        <div class="product-card-body">
          <span class="product-cat-tag">${p.categoryName}</span>
          <a href="javascript:void(0)" onclick="viewProductDetail('${p.id}')" class="product-name-link" title="${p.name}">
            ${p.name}
          </a>
          <div class="product-seller-row">
            <img src="${p.seller.avatar}" alt="${p.seller.name}" class="seller-avatar-mini">
            <span>${p.seller.name} ${p.seller.verified ? '<i class="fa-solid fa-certificate" style="color:var(--color-primary); font-size:0.75rem;"></i>' : ''}</span>
          </div>
          <div class="product-price-row">
            <span class="current-price">${formatCurrency(p.price)}</span>
            ${p.originalPrice ? `<span class="original-price">${formatCurrency(p.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="discount-pill">-${discount}%</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn-add-cart" onclick="addToCart('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
            </button>
            <button class="btn-quick-view" onclick="viewProductDetail('${p.id}')" title="Xem chi tiết">
              <i class="fa-regular fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function resetAllFilters() {
  AppState.filters.category = 'all';
  AppState.filters.subcategory = 'all';
  AppState.filters.condition = 'all';
  AppState.filters.maxPrice = 3000000;
  AppState.filters.searchQuery = '';
  AppState.filters.sortBy = 'newest';

  const priceInput = document.getElementById('price-range-slider');
  const priceDisplay = document.getElementById('price-slider-val');
  if (priceInput) priceInput.value = 3000000;
  if (priceDisplay) priceDisplay.innerText = formatCurrency(3000000);

  const searchInput = document.getElementById('header-search-input');
  if (searchInput) searchInput.value = '';

  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) sortSelect.value = 'newest';

  renderCategoryTree();
  renderProducts();
  showToast('Đã xóa tất cả bộ lọc', 'info');
}

// ==========================================
// 9. PRODUCT DETAIL MODAL & SOCIAL SHARE
// ==========================================
function viewProductDetail(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  product.views = (product.views || 0) + 1;
  saveProductsToStorage();

  const container = document.getElementById('product-detail-modal-body');
  if (!container) return;

  const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  let specsHtml = '';
  if (product.specifications) {
    specsHtml = Object.entries(product.specifications).map(([key, val]) => `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed var(--border-color); font-size:0.88rem;">
        <span style="color:var(--text-muted)">${key}:</span>
        <strong style="color:var(--text-main); text-align:right">${val}</strong>
      </div>
    `).join('');
  }

  let reviewsHtml = '';
  if (product.reviews && product.reviews.length > 0) {
    reviewsHtml = product.reviews.map(r => `
      <div style="background:var(--bg-body); border-radius:8px; padding:12px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong style="font-size:0.9rem">${r.author}</strong>
          <span style="color:var(--color-gold); font-size:0.8rem">
            ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
          </span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">${r.comment}</p>
        <span style="font-size:0.75rem; color:var(--text-light); display:block; margin-top:4px;">${r.date}</span>
      </div>
    `).join('');
  } else {
    reviewsHtml = '<p style="color:var(--text-muted); font-size:0.88rem;">Chưa có nhận xét nào. Hãy là người đầu tiên trải nghiệm!</p>';
  }

  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1.1fr; gap:30px; padding:30px;" class="modal-detail-grid">
      <div>
        <div style="border-radius:12px; overflow:hidden; border:1px solid var(--border-color); margin-bottom:12px;">
          <img id="detail-main-img" src="${product.images[0]}" alt="${product.name}" style="width:100%; height:340px; object-fit:cover;">
        </div>
        <div style="display:flex; gap:10px;">
          ${product.images.map((img, idx) => `
            <img src="${img}" alt="Thumb" style="width:65px; height:65px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${idx===0?'var(--color-primary)':'transparent'};" onclick="switchDetailImg('${img}', this)">
          `).join('')}
        </div>
        
        <div style="background:#FAF7F2; border:1px solid var(--border-color); border-radius:12px; padding:16px; margin-top:20px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${product.seller.avatar}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;">
            <div>
              <h5 style="margin:0; font-size:0.95rem;">${product.seller.name} ${product.seller.verified ? '<i class="fa-solid fa-circle-check" style="color:#27AE60"></i>' : ''}</h5>
              <span style="font-size:0.78rem; color:var(--text-muted)">Gia nhập: ${product.seller.joinedYear} • Đánh giá: <strong>${product.seller.rating}★</strong></span>
            </div>
          </div>
          <div style="display:flex; gap:8px; margin-top:12px;">
            <a href="tel:${product.seller.phone}" class="btn-outline-white" style="flex:1; justify-content:center; font-size:0.8rem; padding:6px; color:var(--text-main); border-color:var(--border-color);">
              <i class="fa-solid fa-phone"></i> Gọi người bán
            </a>
            <button class="btn-outline-white" style="flex:1; justify-content:center; font-size:0.8rem; padding:6px; color:var(--text-main); border-color:var(--border-color);" onclick="openChatSeller('${jsArg(product.seller.name)}')">
              <i class="fa-solid fa-comments"></i> Nhắn tin
            </button>
          </div>
        </div>
      </div>

      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <span style="font-size:0.8rem; background:var(--color-primary-light); color:var(--color-primary); padding:3px 10px; border-radius:20px; font-weight:600;">
            ${product.categoryName}
          </span>
          <span style="font-size:0.8rem; color:var(--text-muted); font-family:monospace;">Mã: ${product.sku}</span>
        </div>

        <h2 style="font-size:1.6rem; line-height:1.25; margin-bottom:12px;">${product.name}</h2>

        <div style="display:flex; align-items:baseline; gap:14px; margin-bottom:18px;">
          <span style="font-size:1.8rem; font-weight:700; color:var(--color-primary); font-family:var(--font-serif);">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span style="font-size:1rem; color:var(--text-light); text-decoration:line-through;">${formatCurrency(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="discount-pill" style="font-size:0.8rem;">Tiết kiệm ${discount}%</span>` : ''}
        </div>

        <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin-bottom:18px;">
          ${product.description}
        </p>

        <div style="margin-bottom:20px;">
          <h4 style="font-size:0.95rem; margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:6px;">Thông số & Tình trạng đồ cũ:</h4>
          ${specsHtml}
        </div>

        <div style="background:#FFF9E6; border:1px solid #FFE499; border-radius:8px; padding:12px; margin-bottom:20px; display:flex; align-items:center; gap:12px;">
          <i class="fa-solid fa-shield-halved" style="font-size:1.5rem; color:var(--color-gold);"></i>
          <span style="font-size:0.82rem; color:#7A5E00; line-height:1.4;">
            <strong>Bảo vệ người mua 48h:</strong> Tiền được giữ trong Ví ký quỹ độc lập, chỉ thanh toán khi bạn nhận và xác nhận đồ đúng mô tả.
          </span>
        </div>

        <div style="display:flex; gap:12px; margin-bottom:24px;">
          <button class="btn-primary" style="flex:1; justify-content:center; padding:12px;" onclick="buyNow('${product.id}')">
            <i class="fa-solid fa-bolt"></i> Mua ngay (Ví ký quỹ an toàn)
          </button>
          <button class="btn-outline-white" style="padding:12px 18px; color:var(--color-primary); border-color:var(--border-color);" onclick="addToCart('${product.id}')" title="Thêm vào giỏ">
            <i class="fa-solid fa-cart-plus" style="font-size:1.1rem; color:var(--color-primary)"></i>
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:10px; padding-top:14px; border-top:1px solid var(--border-color);">
          <span style="font-size:0.84rem; color:var(--text-muted)">Chia sẻ món đồ:</span>
          <button class="social-btn" style="background:#1877F2; color:#FFF" onclick="shareSocial('facebook', '${jsArg(product.name)}')" title="Facebook"><i class="fa-brands fa-facebook-f"></i></button>
          <button class="social-btn" style="background:#0068FF; color:#FFF; font-size:0.75rem; font-weight:700" onclick="shareSocial('zalo', '${jsArg(product.name)}')" title="Zalo">Zalo</button>
          <button class="social-btn" style="background:#1DA1F2; color:#FFF" onclick="shareSocial('twitter', '${jsArg(product.name)}')" title="Twitter"><i class="fa-brands fa-x-twitter"></i></button>
          <button class="social-btn" style="background:#555; color:#FFF" onclick="copyProductLink('${product.id}')" title="Sao chép link"><i class="fa-solid fa-link"></i></button>
        </div>

        <div style="margin-top:28px;">
          <h4 style="font-size:1rem; margin-bottom:12px;">Đánh giá của khách hàng (${product.reviews ? product.reviews.length : 0})</h4>
          ${reviewsHtml}

          <form onsubmit="submitReview(event, '${product.id}')" style="margin-top:14px; background:var(--bg-body); padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; margin-bottom:8px;">
              <input type="text" id="review-author" class="form-control" placeholder="Tên của bạn" required style="flex:1; padding:6px 10px; font-size:0.85rem;">
              <select id="review-stars" class="form-control" style="width:110px; padding:6px 10px; font-size:0.85rem;">
                <option value="5">5 ★★★★★</option>
                <option value="4">4 ★★★★☆</option>
                <option value="3">3 ★★★☆☆</option>
              </select>
            </div>
            <textarea id="review-comment" class="form-control" placeholder="Cảm nhận thực tế về tình trạng món đồ..." required style="min-height:60px; font-size:0.85rem; padding:6px 10px; margin-bottom:8px;"></textarea>
            <button type="submit" class="btn-primary" style="padding:6px 16px; font-size:0.82rem;">Gửi đánh giá</button>
          </form>
        </div>
      </div>
    </div>
  `;

  openModal('modal-product-detail');
}

function switchDetailImg(src, thumbEl) {
  const mainImg = document.getElementById('detail-main-img');
  if (mainImg) mainImg.src = src;

  const thumbs = thumbEl.parentElement.querySelectorAll('img');
  thumbs.forEach(t => t.style.borderColor = 'transparent');
  thumbEl.style.borderColor = 'var(--color-primary)';
}

function shareSocial(network, title) {
  title = decodeEntities(title);
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Săn ngay đồ Vintage cực chất: ${title} trên EcoVintage!`);
  
  if (network === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  else if (network === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  else if (network === 'zalo') window.open(`https://zalo.me/share?url=${url}`, '_blank');
  showToast(`Đang chia sẻ lên ${network.toUpperCase()}`, 'success');
}

function copyProductLink(id) {
  navigator.clipboard.writeText(window.location.href);
  showToast('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!', 'success');
}

function submitReview(e, productId) {
  e.preventDefault();
  const author = escapeHtml(document.getElementById('review-author').value.trim());
  const rating = parseInt(document.getElementById('review-stars').value, 10);
  const comment = escapeHtml(document.getElementById('review-comment').value.trim());

  const product = AppState.products.find(p => p.id === productId);
  if (product) {
    if (!product.reviews) product.reviews = [];
    const today = new Date().toISOString().split('T')[0];
    product.reviews.unshift({ author, rating, date: today, comment });
    saveProductsToStorage();
    showToast('Cảm ơn bạn đã gửi đánh giá khách quan!', 'success');
    viewProductDetail(productId);
  }
}

// ==========================================
// 10. CRUD QUẢN LÝ SẢN PHẨM & TẢI ẢNH LÊN TỪ TỆP
// ==========================================
function onSellCategoryChange() {
  const catSelect = document.getElementById('sell-category');
  const subcatSelect = document.getElementById('sell-subcategory');
  if (!catSelect || !subcatSelect) return;

  const selectedCatId = catSelect.value;
  const categoryObj = AppState.categories.find(c => c.id === selectedCatId);

  if (categoryObj) {
    subcatSelect.innerHTML = categoryObj.subcategories.map(s => `
      <option value="${s.id}">${s.name}</option>
    `).join('');
  } else {
    subcatSelect.innerHTML = '<option value="">-- Vui lòng chọn danh mục chính --</option>';
  }
}

// Xử lý tải ảnh từ tệp lên (File Upload) theo yêu cầu người dùng
function handleSellPhotoUpload(event) {
  const file = event.target.files ? event.target.files[0] : null;
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, PNG, WEBP)', 'danger');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    compressImage(e.target.result, 800, 0.8, function(compressed) {
    currentSellImageBase64 = compressed;
    const previewWrap = document.getElementById('sell-file-preview-wrap');
    const previewImg = document.getElementById('sell-preview-img');
    const uploadPrompt = document.getElementById('sell-upload-prompt');

    if (previewWrap && previewImg) {
      previewImg.src = currentSellImageBase64;
      previewWrap.style.display = 'block';
    }
    if (uploadPrompt) {
      uploadPrompt.style.display = 'none';
    }
    showToast('Đã tải ảnh lên thành công!', 'success');
    });
  };
  reader.readAsDataURL(file);
}

// Nén ảnh bằng canvas để không làm đầy localStorage
function compressImage(dataUrl, maxSize, quality, cb) {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    cb(canvas.toDataURL('image/jpeg', quality));
  };
  img.onerror = () => cb(dataUrl);
  img.src = dataUrl;
}

function removeSellPhoto(event) {
  if (event) event.stopPropagation();
  currentSellImageBase64 = '';
  const aiRes = document.getElementById('ai-result-box'); if (aiRes) aiRes.style.display = 'none';
  const fileInput = document.getElementById('sell-file-input');
  if (fileInput) fileInput.value = '';

  const previewWrap = document.getElementById('sell-file-preview-wrap');
  const uploadPrompt = document.getElementById('sell-upload-prompt');
  if (previewWrap) previewWrap.style.display = 'none';
  if (uploadPrompt) uploadPrompt.style.display = 'block';
}

function handleSaveProduct(event) {
  event.preventDefault();

  // Kiểm tra điều khoản người bán
  const termsAgree = document.getElementById('seller-terms-agree');
  if (!termsAgree || !termsAgree.checked) {
    showToast('Vui lòng đọc và tích đồng ý với Điều khoản người bán đồ cũ!', 'danger');
    return;
  }

  // Kiểm tra ảnh tải lên
  if (!currentSellImageBase64) {
    showToast('Vui lòng tải lên ảnh chụp sản phẩm từ máy tính của bạn!', 'danger');
    return;
  }

  const name = escapeHtml(document.getElementById('sell-name').value.trim());
  const catId = document.getElementById('sell-category').value;
  const subcatId = document.getElementById('sell-subcategory').value;
  const price = parseInt(document.getElementById('sell-price').value, 10);
  const condition = escapeHtml(document.getElementById('sell-condition').value.trim());
  const desc = escapeHtml(document.getElementById('sell-description').value.trim());
  const sellerName = escapeHtml(document.getElementById('sell-seller-name').value.trim()) || 'Thành Viên EcoVintage';
  const sellerPhone = escapeHtml(document.getElementById('sell-seller-phone').value.trim()) || '0988 123 456';

  const catObj = AppState.categories.find(c => c.id === catId);
  const subcatObj = catObj ? catObj.subcategories.find(s => s.id === subcatId) : null;

  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newSku = `VNT-${catId.slice(0,3).toUpperCase()}-${randNum}`;

  const newProduct = {
    id: `SP-${Date.now().toString().slice(-4)}`,
    sku: newSku,
    name: name,
    categoryId: catId,
    subcategoryId: subcatId,
    categoryName: subcatObj ? subcatObj.name : 'Đồ Second-hand Tuyển Chọn',
    price: price,
    originalPrice: Math.round(price * 1.4),
    condition: condition,
    conditionType: /like new|9[5-9]%|100%/i.test(condition) ? 'like-new' : 'good',
    status: 'active',
    createdAt: Date.now(),
    images: [currentSellImageBase64],
    seller: {
      name: sellerName,
      phone: sellerPhone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      joinedYear: '2026',
      verified: true
    },
    shortDesc: desc.slice(0, 100) + '...',
    description: desc,
    specifications: {
      "Xuất xứ": "Chính hãng tuyển chọn",
      "Tình trạng": condition,
      "Giao dịch an toàn": "Bảo vệ qua Ví ký quỹ Escrow 48h"
    },
    views: 1,
    reviews: []
  };

  AppState.products.unshift(newProduct);
  saveProductsToStorage();

  closeModal('modal-sell-product');
  renderCategoryTree();
  renderProducts();
  renderHomeHighlights();

  showToast(`Đã đăng bán thành công món đồ: "${newProduct.name}"!`, 'success');
  
  // Reset form & ảnh tải lên
  document.getElementById('sell-product-form').reset();
  const sc = document.getElementById('ai-scan-box'); if (sc) sc.style.display = 'none';
  removeSellPhoto();
}

function openProductManagerModal() {
  const container = document.getElementById('manage-products-table-body');
  if (!container) return;

  container.innerHTML = AppState.products.map(p => `
    <tr>
      <td style="padding:10px; font-family:monospace;">${p.sku}</td>
      <td style="padding:10px; display:flex; align-items:center; gap:8px;">
        <img src="${p.images[0]}" style="width:36px; height:36px; object-fit:cover; border-radius:4px;">
        <span style="font-weight:600; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</span>
      </td>
      <td style="padding:10px;">${formatCurrency(p.price)}</td>
      <td style="padding:10px;">
        <span class="condition-badge ${p.status === 'hidden' ? '' : 'like-new'}" style="position:static; font-size:0.7rem;">
          ${p.status === 'hidden' ? 'Đã Ẩn' : 'Đang Bán'}
        </span>
      </td>
      <td style="padding:10px;">
        <button class="btn-outline-white" style="padding:4px 8px; font-size:0.75rem; color:var(--text-main); border-color:var(--border-color);" onclick="toggleHideProduct('${p.id}')">
          <i class="fa-solid ${p.status === 'hidden' ? 'fa-eye' : 'fa-eye-slash'}"></i> ${p.status === 'hidden' ? 'Hiện' : 'Ẩn'}
        </button>
        <button class="btn-outline-white" style="padding:4px 8px; font-size:0.75rem; color:var(--color-danger); border-color:#F5C6CB;" onclick="deleteProduct('${p.id}')">
          <i class="fa-solid fa-trash"></i> Xóa
        </button>
      </td>
    </tr>
  `).join('');

  openModal('modal-manage-products');
}

function toggleHideProduct(productId) {
  const p = AppState.products.find(item => item.id === productId);
  if (p) {
    p.status = p.status === 'hidden' ? 'active' : 'hidden';
    saveProductsToStorage();
    openProductManagerModal();
    renderProducts();
    renderHomeHighlights();
    showToast(`Đã ${p.status === 'hidden' ? 'ẩn' : 'hiển thị'} sản phẩm ${p.sku}`, 'info');
  }
}

function deleteProduct(productId) {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
    AppState.products = AppState.products.filter(p => p.id !== productId);
    saveProductsToStorage();
    openProductManagerModal();
    renderCategoryTree();
    renderProducts();
    renderHomeHighlights();
    showToast('Đã xóa sản phẩm thành công', 'success');
  }
}

// ==========================================
// 11. CART & CÁC BƯỚC TIẾP THEO CHO THANH TOÁN (MULTI-STEP CHECKOUT)
// ==========================================
function addToCart(productId) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const existItem = AppState.cart.find(item => item.id === productId);
  if (existItem) {
    showToast('Đồ cũ/vintage chỉ có 1 chiếc duy nhất — món này đã nằm trong giỏ của bạn.', 'info');
    return;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      seller: product.seller.name
    });
  }

  saveCartToStorage();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

function updateCartBadge() {
  const count = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count-badge');
  if (badge) badge.innerText = count;
}

function openCartModal() {
  // Luôn bắt đầu từ bước 1
  setCheckoutStep(1);
  renderCartView();
  openModal('modal-cart');
}

function computeCartTotals() {
  const subtotal = AppState.cart.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount = 0;
  const c = AppState.appliedCoupon;
  if (c && subtotal >= (c.minSpend || 0)) {
    discount = c.discountPercent ? Math.round(subtotal * c.discountPercent / 100) : (c.discountAmount || 0);
  }
  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

function renderCartView() {
  const container = document.getElementById('cart-items-tbody');
  const emptyBox = document.getElementById('cart-empty-message');
  const cartContent = document.getElementById('cart-active-content');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-grand-total');

  if (!container) return;

  if (AppState.cart.length === 0) {
    if (emptyBox) emptyBox.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  if (emptyBox) emptyBox.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';

  let subtotal = 0;

  container.innerHTML = AppState.cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <tr>
        <td>
          <div class="cart-item-preview">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div>
              <strong style="font-size:0.92rem; display:block; max-width:260px; line-height:1.3;">${item.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Người bán: ${item.seller} • ${item.sku}</span>
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight:600; color:var(--color-primary);">${formatCurrency(item.price)}</span>
        </td>
        <td>
          <div class="qty-control">
            <button class="qty-btn" onclick="changeCartQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="changeCartQty('${item.id}', 1)">+</button>
          </div>
        </td>
        <td>
          <strong style="color:var(--color-primary); font-family:var(--font-serif);">${formatCurrency(itemTotal)}</strong>
        </td>
        <td>
          <button style="color:var(--color-danger); padding:4px;" onclick="removeFromCart('${item.id}')" title="Xóa món này">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const { discount: discountAmount, total: grandTotal } = computeCartTotals();

  if (subtotalEl) subtotalEl.innerText = formatCurrency(subtotal);
  if (discountEl) discountEl.innerText = `-${formatCurrency(discountAmount)}`;
  if (totalEl) totalEl.innerText = formatCurrency(grandTotal);
}

function changeCartQty(id, delta) {
  const item = AppState.cart.find(i => i.id === id);
  if (item) {
    if (delta > 0) { showToast('Mỗi món đồ cũ chỉ có 1 chiếc nên không thể tăng số lượng.', 'info'); return; }
    item.quantity += delta;
    if (item.quantity <= 0) {
      AppState.cart = AppState.cart.filter(i => i.id !== id);
    }
    saveCartToStorage();
    renderCartView();
  }
}

function removeFromCart(id) {
  AppState.cart = AppState.cart.filter(i => i.id !== id);
  saveCartToStorage();
  renderCartView();
  showToast('Đã xóa món đồ khỏi giỏ hàng', 'info');
}

function applyCouponCode() {
  const codeInput = document.getElementById('coupon-input');
  if (!codeInput) return;
  const code = codeInput.value.trim().toUpperCase();

  const coupon = INITIAL_COUPONS.find(c => c.code === code);
  if (coupon) {
    const sub = computeCartTotals().subtotal;
    if (sub < (coupon.minSpend || 0)) {
      showToast(`Mã ${coupon.code} chỉ áp dụng cho đơn từ ${formatCurrency(coupon.minSpend)}.`, 'danger');
      return;
    }
    AppState.appliedCoupon = coupon;
    renderCartView();
    showToast(`Áp dụng mã ${coupon.code} thành công: ${coupon.description}`, 'success');
  } else {
    showToast('Mã không hợp lệ. Hãy thử: VINTAGE10 hoặc ECOGREEN', 'danger');
  }
}

function buyNow(productId) {
  addToCart(productId);
  closeModal('modal-product-detail');
  openCartModal();
}

// Chuyển đổi giữa Bước 1 & Bước 2 trong thanh toán
function setCheckoutStep(stepNumber) {
  AppState.checkoutStep = stepNumber;
  const step1Wrap = document.getElementById('checkout-step-1');
  const step2Wrap = document.getElementById('checkout-step-2');
  const indicator1 = document.getElementById('indicator-step-1');
  const indicator2 = document.getElementById('indicator-step-2');

  if (stepNumber === 1) {
    if (step1Wrap) step1Wrap.style.display = 'block';
    if (step2Wrap) step2Wrap.style.display = 'none';
    if (indicator1) indicator1.classList.add('active');
    if (indicator2) indicator2.classList.remove('active');
  } else if (stepNumber === 2) {
    if (step1Wrap) step1Wrap.style.display = 'none';
    if (step2Wrap) step2Wrap.style.display = 'block';
    if (indicator1) indicator1.classList.remove('active');
    if (indicator2) indicator2.classList.add('active');
  }
}

// BƯỚC TIẾP THEO CHO THANH TOÁN
function proceedToPaymentStep2() {
  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
  const grandTotal = document.getElementById('cart-grand-total').innerText;

  if (!name || !phone || !address) {
    showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!', 'danger');
    return;
  }

  const totalNum = computeCartTotals().total;
  if (paymentMethod === 'escrow' && AppState.walletBalance < totalNum) {
    showToast(`Số dư Ví ký quỹ (${formatCurrency(AppState.walletBalance)}) không đủ. Hãy nạp thêm ở trang Ví Ký Quỹ hoặc chọn phương thức khác.`, 'danger');
    return;
  }

  // Lưu thông tin tạm
  AppState.pendingOrderData = {
    name,
    phone,
    address,
    paymentMethod,
    grandTotal,
    totalNum,
    items: [...AppState.cart]
  };

  // Cập nhật nội dung chi tiết theo phương thức đã chọn
  renderStep2PaymentDetails(paymentMethod, grandTotal);

  // Chuyển sang Bước 2
  setCheckoutStep(2);
}

function backToPaymentStep1() {
  setCheckoutStep(1);
}

function renderStep2PaymentDetails(method, totalAmount) {
  const container = document.getElementById('step-2-method-content');
  if (!container) return;

  const tempOrderId = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;
  AppState.pendingOrderData.tempOrderId = tempOrderId;

  if (method === 'escrow') {
    container.innerHTML = `
      <div class="payment-detail-card" style="border-color:var(--color-gold); background:#FFFDF8;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#FAF2DB; color:var(--color-gold); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h4 style="margin:0; font-size:1.05rem; color:var(--color-primary);">Kích Hoạt Bảo Vệ Ví Ký Quỹ Escrow</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">Số tiền <strong>${totalAmount}</strong> sẽ được tạm khóa bảo lưu an toàn</span>
          </div>
        </div>

        <div style="background:#FFF; border:1px solid #EADBBE; border-radius:8px; padding:16px; font-size:0.86rem; line-height:1.6; margin-bottom:16px;">
          <p style="margin:0 0 8px 0;"><i class="fa-solid fa-circle-check" style="color:#27AE60; margin-right:6px;"></i> <strong>Cơ chế bảo vệ 48H:</strong> Sau khi nhận hàng, bạn có 48 giờ để mặc thử và kiểm tra chất lượng thực tế.</p>
          <p style="margin:0 0 8px 0;"><i class="fa-solid fa-circle-check" style="color:#27AE60; margin-right:6px;"></i> <strong>Giải ngân minh bạch:</strong> Tiền chỉ chuyển cho người bán khi bạn xác nhận "Hài lòng với món đồ".</p>
          <p style="margin:0;"><i class="fa-solid fa-circle-check" style="color:#27AE60; margin-right:6px;"></i> <strong>Hoàn tiền 100%:</strong> Miễn phí gửi trả và hoàn 100% tiền nếu đồ bị rách hoặc sai mô tả.</p>
        </div>

        <div style="font-size:0.84rem; color:var(--text-muted); display:flex; justify-content:space-between; padding:8px 0; border-top:1px dashed #E0D4C0;">
          <span>Mã bảo lưu dự kiến:</span>
          <strong style="font-family:monospace; color:var(--color-primary);">${tempOrderId}</strong>
        </div>
        <div style="font-size:0.84rem; color:var(--text-muted); display:flex; justify-content:space-between; padding:8px 0; border-top:1px dashed #E0D4C0;">
          <span>Số dư ví hiện tại:</span><strong>${formatCurrency(AppState.walletBalance)}</strong>
        </div>
      </div>
    `;
  } else if (method === 'banking') {
    container.innerHTML = `
      <div class="payment-detail-card" style="border-color:var(--color-primary);">
        <h4 style="margin-bottom:10px; font-size:1.05rem; text-align:center; color:var(--color-primary);">
          <i class="fa-solid fa-qrcode"></i> Quét Mã Chuyển Khoản Napas 24/7
        </h4>

        <div class="qr-code-box">
          <div class="qr-mock-img">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://ecovintage.vn/pay/${tempOrderId}" alt="VietQR" style="width:150px; height:150px; border-radius:6px;">
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Quét bằng ứng dụng Ngân hàng hoặc MoMo</span>
        </div>

        <table class="bank-info-table">
          <tr>
            <td style="color:var(--text-muted)">Ngân hàng:</td>
            <td><strong>MB Bank (Ngân hàng Quân Đội)</strong></td>
          </tr>
          <tr>
            <td style="color:var(--text-muted)">Số tài khoản:</td>
            <td><strong style="color:var(--color-primary); font-size:0.95rem;">1903 4567 8901</strong></td>
          </tr>
          <tr>
            <td style="color:var(--text-muted)">Chủ tài khoản:</td>
            <td><strong>ECOVINTAGE HUB VIETNAM</strong></td>
          </tr>
          <tr>
            <td style="color:var(--text-muted)">Số tiền cần chuyển:</td>
            <td><strong style="color:var(--color-accent); font-size:1.05rem; font-family:var(--font-serif);">${totalAmount}</strong></td>
          </tr>
          <tr>
            <td style="color:var(--text-muted)">Nội dung CK:</td>
            <td><strong style="font-family:monospace; color:var(--color-primary);">${tempOrderId}</strong></td>
          </tr>
        </table>
      </div>
    `;
  } else if (method === 'cod') {
    container.innerHTML = `
      <div class="payment-detail-card">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#EBF3EE; color:var(--color-primary); display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
            <i class="fa-solid fa-truck"></i>
          </div>
          <div>
            <h4 style="margin:0; font-size:1.05rem;">Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)</h4>
            <span style="font-size:0.8rem; color:var(--text-muted);">Đồng kiểm hàng hóa trước khi thanh toán cho bưu tá</span>
          </div>
        </div>

        <div style="background:var(--bg-body); border-radius:8px; padding:14px; font-size:0.86rem; line-height:1.5;">
          <p style="margin:0 0 6px 0;">📦 Kiện hàng sẽ được bưu tá giao tới: <strong>${AppState.pendingOrderData.address}</strong></p>
          <p style="margin:0 0 6px 0;">📞 Người nhận: <strong>${AppState.pendingOrderData.name} - ${AppState.pendingOrderData.phone}</strong></p>
          <p style="margin:0;">💵 Số tiền chuẩn bị thanh toán cho shipper: <strong style="color:var(--color-primary);">${totalAmount}</strong></p>
        </div>
      </div>
    `;
  }
}

// XÁC NHẬN ĐẶT HÀNG CUỐI CÙNG & CHUYỂN SANG TRANG RIÊNG BIỆT THÀNH CÔNG
function confirmFinalOrder(event) {
  event.preventDefault();

  // Kiểm tra điều khoản thanh toán
  const termsCheckbox = document.getElementById('checkout-terms-agree');
  if (!termsCheckbox || !termsCheckbox.checked) {
    showToast('Vui lòng đọc và tích đồng ý với Điều khoản thanh toán & Ký quỹ an toàn!', 'danger');
    return;
  }

  const orderData = AppState.pendingOrderData;
  if (!orderData) {
    showToast('Lỗi dữ liệu đơn hàng. Vui lòng thử lại!', 'danger');
    return;
  }

  const finalOrderId = orderData.tempOrderId || `ECO-${Math.floor(100000 + Math.random() * 900000)}`;

  // 0. Escrow: trừ ví, khóa tiền, tạo đơn ký quỹ
  if (orderData.paymentMethod === 'escrow') {
    if (AppState.walletBalance < orderData.totalNum) {
      showToast('Số dư Ví ký quỹ không đủ!', 'danger');
      return;
    }
    AppState.walletBalance -= orderData.totalNum;
    saveWalletToStorage();
    const now = Date.now();
    AppState.escrowOrders.unshift({
      id: finalOrderId,
      items: orderData.items.map(i => ({ name: i.name, sku: i.sku, image: i.image, quantity: i.quantity })),
      total: orderData.totalNum,
      status: 'holding',
      createdAt: now,
      deadline: now + 48 * 3600 * 1000
    });
    saveEscrowToStorage();
  }

  // 1. Lưu biên nhận để trang order-success.html hiển thị
  safeSetItem('ecovintage_last_order', JSON.stringify({
    id: finalOrderId,
    time: new Date().toLocaleString('vi-VN'),
    paymentMethod: orderData.paymentMethod,
    name: orderData.name,
    phone: orderData.phone,
    address: orderData.address,
    grandTotal: orderData.grandTotal,
    items: orderData.items
  }));

  // 2. ĐỂ TRỐNG THÔNG TIN ĐIỀN MUA HÀNG (RESET FORM HOÀN TOÀN) theo yêu cầu người dùng
  document.getElementById('checkout-name').value = '';
  document.getElementById('checkout-phone').value = '';
  document.getElementById('checkout-address').value = '';
  termsCheckbox.checked = false;
  setCheckoutStep(1);

  // 3. Đóng modal giỏ hàng
  closeModal('modal-cart');

  // 4. Xóa giỏ hàng
  AppState.cart = [];
  AppState.appliedCoupon = null;
  AppState.pendingOrderData = null;
  saveCartToStorage();

  // 5. Chuyển sang trang "Đặt hàng thành công"
  navigateTo('order-success');
}

function renderOrderSuccess() {
  const box = document.getElementById('success-order-id');
  if (!box) return;
  let o = null;
  try { o = JSON.parse(localStorage.getItem('ecovintage_last_order')); } catch (e) {}
  if (!o) { window.location.replace('index.html'); return; }

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
  set('success-order-id', o.id);
  set('success-order-time', o.time);
  const methodLabel = { escrow: 'Ví Ký Quỹ Escrow (Bảo lưu 48h)', banking: 'Chuyển khoản QR Napas 24/7', cod: 'Thanh toán tiền mặt khi nhận hàng (COD)' }[o.paymentMethod];
  set('success-order-method', methodLabel);
  set('success-buyer-name', o.name);
  set('success-buyer-phone', o.phone);
  set('success-buyer-address', o.address);
  set('success-grand-total', o.grandTotal);

  const tbody = document.getElementById('success-order-items-tbody');
  if (tbody) {
    tbody.innerHTML = o.items.map(item => `
      <tr>
        <td style="padding:10px; display:flex; align-items:center; gap:10px;">
          <img src="${item.image}" style="width:40px; height:40px; border-radius:6px; object-fit:cover;">
          <div>
            <strong style="font-size:0.88rem; display:block;">${item.name}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">Mã: ${item.sku}</span>
          </div>
        </td>
        <td style="padding:10px; text-align:center;">x${item.quantity}</td>
        <td style="padding:10px; text-align:right; font-weight:600; color:var(--color-primary);">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `).join('');
  }

  const successPage = document.querySelector('#page-order-success .container');
  if (o.paymentMethod === 'escrow' && successPage && !document.getElementById('success-escrow-link')) {
    successPage.insertAdjacentHTML('beforeend', '<div id="success-escrow-link" style="text-align:center; margin:20px 0;"><button class="btn-primary" onclick="navigateTo(\'escrow\')"><i class="fa-solid fa-shield-halved"></i> Theo dõi đơn ký quỹ 48h</button></div>');
  }
}

// ==========================================
// 11b. ESCROW WALLET & ORDERS (mô phỏng)
// ==========================================
function topUpWallet() {
  AppState.walletBalance += 1000000;
  saveWalletToStorage();
  renderEscrowPage();
  showToast('Đã nạp 1.000.000đ vào ví (demo).', 'success');
}

function resolveEscrow(orderId, action) {
  const o = AppState.escrowOrders.find(x => x.id === orderId);
  if (!o || o.status !== 'holding') return;
  if (action === 'release') {
    o.status = 'released';
    showToast('Đã giải ngân cho người bán. Cảm ơn bạn đã xác nhận!', 'success');
  } else {
    o.status = 'refunded';
    AppState.walletBalance += o.total;
    saveWalletToStorage();
    showToast(`Đã hoàn 100% (${formatCurrency(o.total)}) về ví của bạn.`, 'success');
  }
  saveEscrowToStorage();
  renderEscrowPage();
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Đã hết 48h';
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function renderEscrowPage() {
  const bal = document.getElementById('escrow-wallet-balance');
  if (bal) bal.innerText = formatCurrency(AppState.walletBalance);
  const list = document.getElementById('escrow-orders-list');
  if (!list) return;

  if (AppState.escrowOrders.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; margin:0;">Chưa có đơn ký quỹ nào. Hãy thêm món đồ vào giỏ và chọn thanh toán bằng <strong>Ví Ký Quỹ Escrow</strong>.</p>';
    return;
  }

  const labels = { holding: 'Đang giữ tiền', released: 'Đã giải ngân', refunded: 'Đã hoàn tiền' };
  list.innerHTML = AppState.escrowOrders.map(o => {
    const done = o.status !== 'holding';
    const steps = `
      <div class="escrow-steps">
        <span class="done">1. Đã đặt cọc</span>
        <span class="done">2. Đã gửi hàng</span>
        <span class="${done ? 'done' : 'now'}">3. Kiểm tra 48h</span>
        <span class="${done ? 'done' : ''}">4. ${o.status === 'refunded' ? 'Hoàn tiền' : 'Giải ngân'}</span>
      </div>`;
    return `
      <div class="escrow-order">
        <div class="escrow-order-head">
          <strong style="font-family:monospace;">${o.id}</strong>
          <span class="escrow-status ${o.status}">${labels[o.status]}</span>
        </div>
        <div style="font-size:0.88rem;">${o.items.map(i => `${escapeHtml(i.name)} <span style="color:var(--text-muted)">(${i.sku})</span>`).join('<br>')}</div>
        ${steps}
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.88rem;">Số tiền ký quỹ: <strong style="color:var(--color-primary);">${formatCurrency(o.total)}</strong>
            ${o.status === 'holding' ? ` • Còn lại: <strong class="escrow-countdown" data-deadline="${o.deadline}">${formatCountdown(o.deadline - Date.now())}</strong>` : ''}</span>
          ${o.status === 'holding' ? `
          <div style="display:flex; gap:8px;">
            <button class="btn-primary" style="padding:6px 12px; font-size:0.8rem;" onclick="resolveEscrow('${o.id}', 'release')"><i class="fa-solid fa-circle-check"></i> Hài lòng – giải ngân</button>
            <button class="btn-outline-white" style="padding:6px 12px; font-size:0.8rem; color:var(--color-danger); border-color:#F5C6CB;" onclick="resolveEscrow('${o.id}', 'refund')"><i class="fa-solid fa-rotate-left"></i> Sai mô tả – hoàn tiền</button>
          </div>` : ''}
        </div>
      </div>`;
  }).join('');
}

setInterval(() => {
  document.querySelectorAll('.escrow-countdown').forEach(el => {
    el.innerText = formatCountdown(parseInt(el.dataset.deadline, 10) - Date.now());
  });
}, 1000);

// ==========================================
// 11c. AI PHOTO VALUATION (MÔ PHỎNG — không phải AI thật)
// ==========================================
function runAIValuation() {
  if (!currentSellImageBase64) {
    showToast('Hãy tải ảnh sản phẩm lên trước khi định giá!', 'danger');
    return;
  }
  const scanBox = document.getElementById('ai-scan-box');
  const resBox = document.getElementById('ai-result-box');
  const scanImg = document.getElementById('ai-scan-img');
  const scanText = document.getElementById('ai-scan-text');
  scanImg.src = currentSellImageBase64;
  resBox.style.display = 'none';
  scanBox.style.display = 'block';

  const stages = ['Đang nhận diện vật thể...', 'Đang phân tích chất liệu & đường may...', 'Đang ước lượng độ hao mòn...', 'Đang đối chiếu giá thị trường...'];
  stages.forEach((t, i) => setTimeout(() => { scanText.innerText = t; }, i * 600));

  setTimeout(() => {
    scanBox.style.display = 'none';
    // Kết quả giả lập, ổn định theo ảnh (hash đơn giản)
    const s = currentSellImageBase64;
    let hash = 0;
    for (let i = 0; i < s.length; i += 97) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    const catId = document.getElementById('sell-category').value;
    const ranges = { fashion: [250000, 900000], books: [50000, 450000], decor: [350000, 1800000] };
    const [lo, hi] = ranges[catId] || [100000, 800000];
    const wear = 80 + (hash % 17);                       // 80–96%
    const mid = lo + ((hash >> 3) % 100) / 100 * (hi - lo);
    const round = v => Math.round(v / 10000) * 10000;
    const pMin = round(mid * 0.88), pMax = round(mid * 1.12), pSuggest = round(mid);
    const authentic = 70 + (hash % 28);
    const matMap = { fashion: 'Vải/da tự nhiên', books: 'Giấy in ngả vàng', decor: 'Kim loại/gốm cổ' };
    const condText = `${wear}% (${wear >= 95 ? 'Like new' : wear >= 90 ? 'Good, sờn nhẹ' : 'Patina, có dấu ấn thời gian'})`;

    resBox.innerHTML = `
      <div><i class="fa-solid fa-circle-check" style="color:#27AE60"></i> <strong>Kết quả phân tích (mô phỏng)</strong></div>
      <div>• Chất liệu nhận diện: <strong>${matMap[catId] || 'Hỗn hợp'}</strong></div>
      <div>• Mức độ còn lại: <strong>${wear}%</strong> • Độ "zin" ước tính: <strong>${authentic}%</strong></div>
      <div>• Khoảng giá thị trường: <strong>${formatCurrency(pMin)} – ${formatCurrency(pMax)}</strong></div>
      <div>Giá gợi ý: <span class="ai-price">${formatCurrency(pSuggest)}</span></div>
      <button type="button" class="btn-primary" style="margin-top:8px; padding:6px 14px; font-size:0.82rem;" onclick="applyAIValuation(${pSuggest}, '${condText}')">
        <i class="fa-solid fa-check"></i> Áp dụng giá &amp; tình trạng này
      </button>`;
    resBox.style.display = 'block';
  }, stages.length * 600 + 200);
}

function applyAIValuation(price, cond) {
  document.getElementById('sell-price').value = price;
  document.getElementById('sell-condition').value = cond;
  showToast('Đã điền giá và tình trạng gợi ý vào form.', 'success');
}

// ==========================================
// 11d. ADMIN MODE (ẩn công cụ quản trị với khách thường)
// ==========================================
function initAdminMode() {
  document.querySelectorAll('[onclick^="openProductManagerModal"], [onclick^="openEditAboutModal"]').forEach(el => el.classList.add('admin-only'));
  const btn = document.createElement('button');
  btn.className = 'admin-toggle';
  const apply = (on) => {
    document.body.classList.toggle('is-admin', on);
    btn.classList.toggle('on', on);
    btn.innerHTML = `<i class="fa-solid fa-user-gear"></i> Admin: ${on ? 'BẬT' : 'TẮT'}`;
    try { localStorage.setItem('ecovintage_admin', on ? '1' : '0'); } catch (e) {}
  };
  let saved = false;
  try { saved = localStorage.getItem('ecovintage_admin') === '1'; } catch (e) {}
  btn.addEventListener('click', () => apply(!document.body.classList.contains('is-admin')));
  document.body.appendChild(btn);
  apply(saved);
}

// ==========================================
// 12. TERMS & CONDITIONS MODALS
// ==========================================
function openTermsModal(type) {
  if (type === 'checkout') {
    openModal('modal-terms-checkout');
  } else if (type === 'seller') {
    openModal('modal-terms-seller');
  }
}

// ==========================================
// 13. NEWS & EVENTS (BỐ TRÍ HÀNG DỌC TỪ MỚI ĐẾN CŨ)
// ==========================================
function renderNewsVertical() {
  const container = document.getElementById('news-vertical-container');
  if (!container) return;

  const sortedNews = [...AppState.news].sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = sortedNews.map(item => `
    <article class="news-card-vertical" id="news-${item.id}">
      <div class="news-img-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
      </div>
      <div class="news-body-content">
        <div>
          <div class="news-meta-row">
            <span class="news-topic-badge">${item.topic}</span>
            <span><i class="fa-regular fa-calendar"></i> ${item.date}</span>
            <span><i class="fa-regular fa-user"></i> ${item.author}</span>
          </div>
          <a href="javascript:void(0)" onclick="viewNewsDetail('${item.id}')" class="news-title-link">
            ${item.title}
          </a>
          <p class="news-summary-text">${item.summary}</p>
        </div>
        <div class="news-footer-row">
          <span style="color:var(--text-light); font-size:0.8rem;"><i class="fa-regular fa-eye"></i> ${item.views || 1200} lượt đọc</span>
          <button class="read-more-btn" onclick="viewNewsDetail('${item.id}')">
            Đọc tiếp chi tiết <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function viewNewsDetail(newsId) {
  const article = AppState.news.find(n => n.id === newsId);
  if (!article) return;

  const container = document.getElementById('news-detail-modal-body');
  if (!container) return;

  let relatedHtml = '';
  if (article.relatedIds && article.relatedIds.length > 0) {
    const relatedList = AppState.news.filter(n => article.relatedIds.includes(n.id));
    relatedHtml = `
      <div style="margin-top:30px; padding-top:20px; border-top:1px solid var(--border-color);">
        <h4 style="font-size:1.1rem; margin-bottom:14px;">Tin liên quan nên đọc:</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          ${relatedList.map(r => `
            <div style="display:flex; gap:10px; cursor:pointer;" onclick="viewNewsDetail('${r.id}')">
              <img src="${r.image}" style="width:70px; height:70px; object-fit:cover; border-radius:6px;">
              <div>
                <strong style="font-size:0.85rem; line-height:1.3; display:block;">${r.title}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${r.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="padding:30px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <span class="news-topic-badge">${article.topic}</span>
        <span style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-regular fa-calendar"></i> ${article.date}</span>
        <span style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-regular fa-user"></i> ${article.author}</span>
      </div>

      <h1 style="font-size:1.9rem; line-height:1.25; margin-bottom:16px;">${article.title}</h1>

      <p style="font-size:1.05rem; font-weight:600; color:var(--color-primary); line-height:1.55; margin-bottom:20px; border-left:3px solid var(--color-gold); padding-left:14px;">
        ${article.summary}
      </p>

      <div style="border-radius:12px; overflow:hidden; margin-bottom:24px;">
        <img src="${article.image}" alt="${article.title}" style="width:100%; max-height:420px; object-fit:cover;">
      </div>

      <div style="font-size:1rem; line-height:1.8; color:var(--text-main); margin-bottom:24px;">
        ${article.content}
      </div>

      <div style="display:flex; align-items:center; gap:12px; padding:14px 0; border-top:1px solid var(--border-color); border-bottom:1px solid var(--border-color);">
        <strong style="font-size:0.88rem;">Chia sẻ bài viết:</strong>
        <button class="social-btn" style="background:#1877F2; color:#FFF;" onclick="shareSocial('facebook', '${jsArg(article.title)}')"><i class="fa-brands fa-facebook-f"></i></button>
        <button class="social-btn" style="background:#0068FF; color:#FFF; font-size:0.75rem; font-weight:700" onclick="shareSocial('zalo', '${jsArg(article.title)}')">Zalo</button>
        <button class="social-btn" style="background:#1DA1F2; color:#FFF;" onclick="shareSocial('twitter', '${jsArg(article.title)}')"><i class="fa-brands fa-x-twitter"></i></button>
      </div>

      ${relatedHtml}
    </div>
  `;

  openModal('modal-news-detail');
}

// ==========================================
// 14. ABOUT & CONTACT MODULES
// ==========================================
function openEditAboutModal() {
  const currentTitle = document.getElementById('about-display-title').innerText;
  const currentText = document.getElementById('about-display-text').innerText;

  document.getElementById('edit-about-title-input').value = currentTitle;
  document.getElementById('edit-about-text-input').value = currentText;

  openModal('modal-edit-about');
}

function handleSaveAbout(event) {
  event.preventDefault();
  const newTitle = document.getElementById('edit-about-title-input').value;
  const newText = document.getElementById('edit-about-text-input').value;

  document.getElementById('about-display-title').innerText = newTitle;
  document.getElementById('about-display-text').innerText = newText;

  localStorage.setItem('ecovintage_about_title', newTitle);
  localStorage.setItem('ecovintage_about_text', newText);

  closeModal('modal-edit-about');
  showToast('Cập nhật thông tin giới thiệu thành công!', 'success');
}

function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('contact-name').value;
  const address = document.getElementById('contact-address').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  document.getElementById('contact-confirm-name').innerText = name;
  document.getElementById('contact-confirm-email').innerText = email;
  document.getElementById('contact-confirm-addr').innerText = address;

  openModal('modal-contact-confirm');
  document.getElementById('contact-form-el').reset();
  showToast('Đã gửi thông tin liên hệ thành công!', 'success');
}

function openChatSeller(sellerName) {
  showToast(`💬 Đang kết nối kênh chat an toàn với người bán: ${decodeEntities(sellerName)} (mô phỏng)`, 'info');
}

function openLiveChat(channel) {
  if (channel === 'phone') window.location.href = 'tel:1900888999';
}

// ==========================================
// 15. DOM READY INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initPageContext();
  initAdminMode();
  initSlider();
  initLiveSearch();
  renderCategoryTree();
  renderProducts();
  renderHomeHighlights();
  renderNewsVertical();
  renderEscrowPage();
  renderOrderSuccess();
  updateCartBadge();

  const savedAboutTitle = localStorage.getItem('ecovintage_about_title');
  const savedAboutText = localStorage.getItem('ecovintage_about_text');
  if (savedAboutTitle && document.getElementById('about-display-title')) {
    document.getElementById('about-display-title').innerText = savedAboutTitle;
  }
  if (savedAboutText && document.getElementById('about-display-text')) {
    document.getElementById('about-display-text').innerText = savedAboutText;
  }

  const priceSlider = document.getElementById('price-range-slider');
  const priceVal = document.getElementById('price-slider-val');
  if (priceSlider && priceVal) {
    priceSlider.addEventListener('input', (e) => {
      AppState.filters.maxPrice = parseInt(e.target.value, 10);
      priceVal.innerText = formatCurrency(AppState.filters.maxPrice);
      renderProducts();
    });
  }

  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.filters.sortBy = e.target.value;
      renderProducts();
    });
  }

  const conditionRadios = document.querySelectorAll('input[name="filter-condition"]');
  conditionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.filters.condition = e.target.value;
      renderProducts();
    });
  });

  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links-menu');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
});
