import Swal from 'sweetalert2';

/**
 * Cấu hình mặc định cho toast
 */
const defaultToastConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
};

/**
 * Toast Service - Sử dụng SweetAlert2 để hiển thị thông báo
 */
const toastrService = {
  /**
   * Hiển thị toast thành công
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   */
  success: (message, title = 'Thành công!', options = {}) => {
    return Swal.fire({
      ...defaultToastConfig,
      icon: 'success',
      title: title,
      text: message,
      ...options
    });
  },

  /**
   * Hiển thị toast lỗi
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   */
  error: (message, title = 'Lỗi!', options = {}) => {
    return Swal.fire({
      ...defaultToastConfig,
      icon: 'error',
      title: title,
      text: message,
      timer: 4000, // Lỗi hiển thị lâu hơn một chút
      ...options
    });
  },

  /**
   * Hiển thị toast cảnh báo
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   */
  warning: (message, title = 'Cảnh báo!', options = {}) => {
    return Swal.fire({
      ...defaultToastConfig,
      icon: 'warning',
      title: title,
      text: message,
      ...options
    });
  },

  /**
   * Hiển thị toast thông tin
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   */
  info: (message, title = 'Thông tin', options = {}) => {
    return Swal.fire({
      ...defaultToastConfig,
      icon: 'info',
      title: title,
      text: message,
      ...options
    });
  },

  /**
   * Hiển thị dialog xác nhận
   * @param {string} message - Nội dung xác nhận
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   * @returns {Promise} - Promise trả về kết quả xác nhận
   */
  confirm: (message, title = 'Xác nhận', options = {}) => {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      ...options
    });
  },

  /**
   * Hiển thị dialog xác nhận xóa
   * @param {string} message - Nội dung xác nhận
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   * @returns {Promise} - Promise trả về kết quả xác nhận
   */
  confirmDelete: (message = 'Bạn có chắc chắn muốn xóa?', title = 'Xác nhận xóa', options = {}) => {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      ...options
    });
  },

  /**
   * Hiển thị alert đơn giản (thay thế window.alert)
   * @param {string} message - Nội dung thông báo
   * @param {string} title - Tiêu đề (optional)
   * @param {object} options - Tùy chọn bổ sung (optional)
   */
  alert: (message, title = 'Thông báo', options = {}) => {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
      ...options
    });
  },

  /**
   * Hiển thị loading
   * @param {string} message - Nội dung loading
   * @param {string} title - Tiêu đề (optional)
   */
  loading: (message = 'Đang xử lý...', title = '') => {
    return Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  /**
   * Đóng toast/dialog đang hiển thị
   */
  close: () => {
    Swal.close();
  }
};

export default toastrService;
