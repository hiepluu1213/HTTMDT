/**
 * ECOVINTAGE - LAYOUT
 * Chèn Header / Footer / Modal dùng chung vào mỗi trang (chạy được khi mở file trực tiếp, không cần server).
 */
(function () {
  const P = window.SITE_PARTS || {};
  const put = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  put('site-header', P['header']);
  put('site-footer', P['footer']);
  put('site-modals', (P['modals-shop'] || '') + (P['modals-content'] || ''));
})();
