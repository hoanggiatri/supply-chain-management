import axios from "axios";
import toastrService from "@/services/toastrService";

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // List of auth pages where we should NOT auto-redirect on 401
      const authPages = [
        "/login",
        "/register",
        "/otp-verification",
        "/forgot-password",
        "/verify-forgot-password-otp",
        "/reset-password",
        "/login-admin",
        "/admin-verify-otp",
      ];
      const currentPath = window.location.pathname;
      const isAuthPage = authPages.some((page) => currentPath.startsWith(page));

      if (error.response?.status === 401) {
        // Only redirect if NOT on an auth page (means session expired while using app)
        if (!isAuthPage) {
          const errorMessage =
            error.response?.data?.message || "Phiên đăng nhập đã hết hạn!";
          toastrService.error(errorMessage);
          localStorage.clear();
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        }
        // If on auth page, just let the error propagate to be handled by the form
      }

      if (error.response?.status === 403) {
        const errorMessage =
          error.response?.data?.message || "Bạn không có quyền truy cập!";
        toastrService.error(errorMessage);
        setTimeout(() => {
          window.location.href = "/unauthorized";
        }, 500);
      }

      return Promise.reject(error);
    }
  );
};
