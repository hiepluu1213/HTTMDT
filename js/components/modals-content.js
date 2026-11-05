/**
 * Modal: chi tiết tin tức, sửa giới thiệu, xác nhận liên hệ
 */
window.SITE_PARTS = window.SITE_PARTS || {};
SITE_PARTS['modals-content'] = `
  <div class="modal-overlay" id="modal-news-detail">
    <div class="modal-dialog" style="max-width:860px;">
      <button class="modal-close-btn" onclick="closeModal('modal-news-detail')">&times;</button>
      <div id="news-detail-modal-body">
        <!-- Render động từ js/app.js -->
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-edit-about">
    <div class="modal-dialog" style="max-width:620px; padding:30px;">
      <button class="modal-close-btn" onclick="closeModal('modal-edit-about')">&times;</button>
      <h3 style="font-size:1.35rem; margin-bottom:8px;"><i class="fa-solid fa-pen-nib" style="color:var(--color-primary)"></i> Soạn Thảo Giới Thiệu Công Ty</h3>
      <p style="font-size:0.84rem; color:var(--text-muted); margin-bottom:18px;">Tính năng dành cho ban quản trị cập nhật sứ mệnh, tầm nhìn và thông điệp nền tảng.</p>

      <form onsubmit="handleSaveAbout(event)">
        <div class="form-group">
          <label class="form-label" for="edit-about-title-input">Tiêu đề bài giới thiệu</label>
          <input type="text" id="edit-about-title-input" class="form-control" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="edit-about-text-input">Nội dung chi tiết</label>
          <textarea id="edit-about-text-input" class="form-control" style="min-height:160px;" required></textarea>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" class="btn-outline-white" style="color:var(--text-main); border-color:var(--border-color);" onclick="closeModal('modal-edit-about')">Hủy</button>
          <button type="submit" class="btn-primary">Lưu Thay Đổi</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-overlay" id="modal-contact-confirm">
    <div class="modal-dialog" style="max-width:480px; padding:32px; text-align:center;">
      <div style="width:60px; height:60px; background:var(--color-primary-light); color:var(--color-primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.8rem; margin:0 auto 14px;">
        <i class="fa-solid fa-envelope-circle-check"></i>
      </div>
      <h3 style="font-size:1.4rem; margin-bottom:6px;">Đã Tiếp Nhận Thông Tin!</h3>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:16px;">
        Cảm ơn bạn <strong id="contact-confirm-name"></strong>! Hệ sinh thái EcoVintage đã ghi nhận yêu cầu và tự động gửi thư xác nhận tới:
      </p>
      <div style="background:var(--bg-body); padding:10px; border-radius:8px; font-weight:600; color:var(--color-primary); margin-bottom:18px;">
        <span id="contact-confirm-email"></span>
      </div>
      <p style="font-size:0.8rem; color:var(--text-light); margin-bottom:20px;">
        Bộ phận chăm sóc khách hàng sẽ liên hệ với bạn trong vòng 30 phút theo địa chỉ: <span id="contact-confirm-addr"></span>.
      </p>
      <button class="btn-primary" style="width:100%; justify-content:center;" onclick="closeModal('modal-contact-confirm')">Đóng thông báo</button>
    </div>
  </div>
`;
