import { login } from "@/services/general/AuthService";
import { getCompanyById } from "@/services/general/CompanyService";
import { getDepartmentById } from "@/services/general/DepartmentService";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { setupTokenExpirationCheck } from "@utils/tokenUtils";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await login(formData);

      const { accessToken, role, employeeId } = response;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);
      localStorage.setItem("employeeId", employeeId);

      const employeeData = await getEmployeeById(employeeId, accessToken);
      const { departmentId, departmentName, employeeName } = employeeData;
      localStorage.setItem("departmentId", departmentId);
      localStorage.setItem("departmentName", departmentName);
      localStorage.setItem("employeeName", employeeName);

      const departmentData = await getDepartmentById(departmentId, accessToken);
      const { companyId } = departmentData;
      localStorage.setItem("companyId", companyId);

      const companyData = await getCompanyById(companyId, accessToken);
      const { companyType, address } = companyData;
      localStorage.setItem("companyType", companyType);
      localStorage.setItem("companyAddress", address);

      setupTokenExpirationCheck(navigate);

      if (role === "user") {
        const dept = departmentName?.toLowerCase() || '';
        
        if (dept.includes('kho') || dept.includes('warehouse')) {
          navigate("/marketplace-v2/warehouse");
        } else if (dept.includes('mua') || dept.includes('purchasing') || dept.includes('procurement')) {
          navigate("/marketplace-v2/dashboard");
        } else if (dept.includes('bán') || dept.includes('ban') || dept.includes('sales')) {
          navigate("/marketplace-v2/dashboard");
        } else {
          navigate("/marketplace-v2/dashboard");
        }
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại! Vui lòng thử lại.";
      setErrors({ apiError: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Back to Home */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium auth-link"
        style={{ color: 'var(--auth-text-muted)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Trang chủ
      </button>

      {/* Logo */}
      <div 
        className="auth-logo cursor-pointer" 
        onClick={() => navigate("/")}
        title="Quay lại trang chủ"
      >
        <div className="auth-logo-icon">
          <Package className="w-6 h-6 text-white" />
        </div>
        <span className="auth-logo-text">SCMS</span>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="auth-title">Đăng Nhập</h1>
        <p className="auth-subtitle">
          Đăng nhập để sử dụng hệ thống quản lý chuỗi cung ứng
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="mb-5">
          <label className="auth-label">Email</label>
          <div className="auth-input-wrapper">
            <Mail className="auth-input-icon w-5 h-5" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`auth-input ${errors.email ? 'error' : ''}`}
              style={{ paddingLeft: '44px' }}
            />
          </div>
          {errors.email && (
            <p className="auth-field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-5">
          <label className="auth-label">Mật khẩu</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon w-5 h-5" />
            <input
              id="password"
              type={passwordShown ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`auth-input ${errors.password ? 'error' : ''}`}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="auth-password-toggle"
            >
              {passwordShown ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="auth-field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {/* API Error */}
        {errors.apiError && (
          <div className="auth-error">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.apiError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`auth-button mt-6 ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang đăng nhập...
            </span>
          ) : (
            "Đăng nhập"
          )}
        </button>

        {/* Forgot Password Link */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="auth-link text-sm"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center auth-text-muted text-sm">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="auth-link"
          >
            Đăng ký ngay
          </button>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
