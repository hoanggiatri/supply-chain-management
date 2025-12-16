import { forgotPassword } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, Package } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await forgotPassword(email);
      localStorage.setItem("forgotEmail", email);
      toastrService.success("Kiểm tra email để nhận mã OTP.");
      navigate("/verify-forgot-password-otp");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Không thể gửi OTP! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({ apiError: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
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
        <div className="flex justify-center mb-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(102, 126, 234, 0.2)' }}
          >
            <KeyRound className="w-8 h-8" style={{ color: 'var(--auth-primary-light)' }} />
          </div>
        </div>
        <h1 className="auth-title">Quên Mật Khẩu</h1>
        <p className="auth-subtitle">
          Nhập email của bạn để nhận mã xác thực
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
              placeholder="your@email.com"
              value={email}
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
              Đang gửi...
            </span>
          ) : (
            "Gửi mã OTP"
          )}
        </button>

        {/* Back to Login Link */}
        <p className="mt-6 text-center auth-text-muted text-sm">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="auth-link"
          >
            ← Quay lại đăng nhập
          </button>
        </p>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
