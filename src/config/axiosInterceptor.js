import toastrService from "@/services/toastrService";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if expired or invalid
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // Add 5 second buffer to avoid edge cases
    return decoded.exp * 1000 < Date.now() + 5000;
  } catch (e) {
    return true;
  }
};

/**
 * Handle token expiration - clear storage and redirect to login
 */
const handleTokenExpired = () => {
  localStorage.clear();
  toastrService.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};

/**
 * Check token validity on app initialization
 * Should be called once when the app starts
 */
export const validateTokenOnInit = () => {
  const token = localStorage.getItem("token");

  // If no token, user is not logged in - that's fine
  if (!token) return;

  // If token exists but is expired, clear and redirect
  if (isTokenExpired(token)) {
    handleTokenExpired();
  }
};

/**
 * Setup Axios interceptors for request and response
 */
export const setupAxiosInterceptors = () => {
  // Request interceptor - check token before each request
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      // Skip token check for auth endpoints
      const isAuthEndpoint = config.url?.includes("/auth/");
      if (isAuthEndpoint) {
        return config;
      }

      // If token exists, validate it
      if (token) {
        if (isTokenExpired(token)) {
          // Token expired - reject the request and handle logout
          handleTokenExpired();
          return Promise.reject(new Error("Token expired"));
        }

        // Token valid - add to header if not already present
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle 401 and 403 responses
  axios.interceptors.response.use(
    (response) => {
      // Check if backend returned statusCode >= 400 in response body
      if (response.data && response.data.statusCode >= 400) {
        const error = new Error(response.data.message || "Có lỗi xảy ra!");
        error.response = {
          ...response,
          status: response.data.statusCode,
          data: response.data
        };
        return Promise.reject(error);
      }
      return response;
    },
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
