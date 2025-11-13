import { Navigate } from "react-router-dom";
import toastrService from "@/services/toastrService";

const PublicRoute = ({ element, redirectPath }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    const targetPath =
      redirectPath || (role === "s_admin" ? "/admin/dashboard" : "/homepage");

    toastrService.info("Bạn đã đăng nhập!");
    return <Navigate to={targetPath} replace />;
  }

  return element;
};

export default PublicRoute;
