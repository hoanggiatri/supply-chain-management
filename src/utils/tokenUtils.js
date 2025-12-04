import { jwtDecode } from "jwt-decode";

export const setupTokenExpirationCheck = (navigateCallback) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000;
      const timeRemaining = expirationTime - Date.now();

      if (timeRemaining > 0) {
        setTimeout(() => {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.clear();
          if (navigateCallback) {
            navigateCallback("/login");
          } else {
            window.location.href = "/login";
          }
        }, timeRemaining);
      } else {
        // Token đã hết hạn
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.clear();
        if (navigateCallback) {
          navigateCallback("/login");
        } else {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      localStorage.clear();
      if (navigateCallback) {
        navigateCallback("/login");
      } else {
        window.location.href = "/login";
      }
    }
  }
};
