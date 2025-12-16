import { resetPassword } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Eye, EyeOff,
    Loader2,
    Lock,
    Package,
    ShieldCheck,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({ email: "", newPassword: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (storedEmail) {
      setFormData((prevData) => ({ ...prevData, email: storedEmail }));
    }
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  // Password strength indicators
  const passwordChecks = {
    minLength: formData.newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.newPassword),
    hasLowercase: /[a-z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword),
  };

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return '#f5576c';
    if (passwordStrength === 2) return '#fbbf24';
    if (passwordStrength === 3) return '#4facfe';
    return '#10b981';
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return 'Yếu';
    if (passwordStrength === 2) return 'Trung bình';
    if (passwordStrength === 3) return 'Tốt';
    return 'Mạnh';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu";
    else if (formData.newPassword.length < 8) newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!confirmPassword) newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (confirmPassword !== formData.newPassword) newErrors.confirmPassword = "Mật khẩu không khớp";
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
      await resetPassword(formData);
      toastrService.success("Đặt lại mật khẩu thành công!");
      localStorage.removeItem("forgotEmail");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Thay đổi thất bại! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({ apiError: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordCheck = ({ passed, label }) => (
    <div className="flex items-center gap-2 text-xs">
      {passed ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <X className="w-3.5 h-3.5 text-gray-500" />
      )}
      <span className={passed ? 'text-green-400' : 'text-gray-500'}>{label}</span>
    </div>
  );

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
            style={{ background: 'rgba(16, 185, 129, 0.2)' }}
          >
            <ShieldCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <h1 className="auth-title">Đặt Lại Mật Khẩu</h1>
        <p className="auth-subtitle">
          Nhập mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* New Password Field */}
        <div className="mb-5">
          <label className="auth-label">Mật khẩu mới</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon w-5 h-5" />
            <input
              name="newPassword"
              type={passwordShown ? "text" : "password"}
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              className={`auth-input ${errors.newPassword ? 'error' : ''}`}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setPasswordShown(!passwordShown)}
              className="auth-password-toggle"
            >
              {passwordShown ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="auth-field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.newPassword}
            </p>
          )}

          {/* Password Strength Meter */}
          {formData.newPassword && (
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${(passwordStrength / 4) * 100}%`,
                      background: getStrengthColor()
                    }}
                  />
                </div>
                <span 
                  className="text-xs font-medium"
                  style={{ color: getStrengthColor() }}
                >
                  {getStrengthLabel()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <PasswordCheck passed={passwordChecks.minLength} label="Ít nhất 8 ký tự" />
                <PasswordCheck passed={passwordChecks.hasUppercase} label="Chữ hoa" />
                <PasswordCheck passed={passwordChecks.hasLowercase} label="Chữ thường" />
                <PasswordCheck passed={passwordChecks.hasNumber} label="Có số" />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-5">
          <label className="auth-label">Xác nhận mật khẩu</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon w-5 h-5" />
            <input
              type={confirmPasswordShown ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: "" });
                }
              }}
              className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
              style={{ paddingLeft: '44px', paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
              className="auth-password-toggle"
            >
              {confirmPasswordShown ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="auth-field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.confirmPassword}
            </p>
          )}
          {confirmPassword && confirmPassword === formData.newPassword && (
            <p className="flex items-center gap-1 text-green-400 text-xs mt-2">
              <Check className="w-3.5 h-3.5" />
              Mật khẩu khớp
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
              Đang cập nhật...
            </span>
          ) : (
            "Đặt lại mật khẩu"
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

export default ResetPasswordForm;
