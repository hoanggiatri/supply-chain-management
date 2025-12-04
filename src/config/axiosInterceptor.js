import axios from "axios";
import toastrService from "@/services/toastrService";

export const setupAxiosInterceptors = () => {
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.message || "Phiên đăng nhập đã hết hạn!";
                toastrService.error(errorMessage);
                localStorage.clear();
                setTimeout(() => {
                    window.location.href = "/login";
                }, 500);
            }

            if (error.response?.status === 403) {
                const errorMessage = error.response?.data?.message || "Bạn không có quyền truy cập!";
                toastrService.error(errorMessage);
                setTimeout(() => {
                    window.location.href = "/unauthorized";
                }, 500);
            }

            return Promise.reject(error);
        }
    );
};
