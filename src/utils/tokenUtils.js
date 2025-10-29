import { jwtDecode } from "jwt-decode";

export const setupTokenExpirationCheck = () => {
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
          window.location.href = "/login";
        }, timeRemaining);
      } else {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
    }
  }
};
