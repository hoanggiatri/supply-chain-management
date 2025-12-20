import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, allowedRoles, allowedDepartments }) => {
  const [redirectPath, setRedirectPath] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.trim();
  const departmentName = localStorage.getItem("departmentName")?.trim();

  useEffect(() => {
    if (!token) {
      toastrService.warning("Bạn chưa đăng nhập!");
      setRedirectPath("/login");
    } else if (!allowedRoles.includes(role)) {
      toastrService.error("Bạn không có quyền truy cập vào trang này!");
      setRedirectPath("/unauthorized");
    } else if (
      allowedDepartments &&
      // c_admin có quyền truy cập tất cả departments
      role !== "c_admin" &&
      !allowedDepartments.includes(departmentName?.trim())
    ) {
      toastrService.error("Bạn không có quyền truy cập vào trang này!");
      setRedirectPath("/unauthorized");
    }
  }, [token, role, departmentName, allowedRoles, allowedDepartments]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return element;
};

export default PrivateRoute;
