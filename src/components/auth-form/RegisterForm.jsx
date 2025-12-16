import { registerCompany } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";
import {
    AlertCircle,
    ArrowLeft,
    Briefcase,
    Building2,
    Check,
    ChevronLeft,
    ChevronRight,
    Eye, EyeOff,
    IdCard,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Package,
    Phone,
    User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    taxCode: "",
    address: "",
    companyType: "",
    mainIndustry: "",
    representativeName: "",
    phoneNumber: "",
    email: "",
    employeeCode: "",
    password: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordShown((cur) => !cur);

  const steps = [
    { number: 1, title: "Công ty" },
    { number: 2, title: "Đại diện" },
    { number: 3, title: "Tài khoản" },
  ];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = "Tên công ty không được để trống";
      if (!formData.taxCode.trim()) newErrors.taxCode = "Mã số thuế là bắt buộc";
      if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống";
      if (!formData.companyType) newErrors.companyType = "Vui lòng chọn loại hình công ty";
    } else if (step === 2) {
      if (!formData.mainIndustry.trim()) newErrors.mainIndustry = "Ngành chính không được để trống";
      if (!formData.representativeName.trim()) newErrors.representativeName = "Người đại diện không được để trống";
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Số điện thoại không được để trống";
      else if (!/^\d{10,11}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    } else if (step === 3) {
      if (!formData.email.trim()) newErrors.email = "Email không được để trống";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email không hợp lệ";
      if (!formData.employeeCode.trim()) newErrors.employeeCode = "Mã nhân viên không được để trống";
      if (!formData.password.trim()) newErrors.password = "Mật khẩu không được để trống";
      else if (formData.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      if (!formData.termsAccepted) newErrors.termsAccepted = "Bạn phải đồng ý với điều khoản";
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const stepErrors = validateStep(3);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { termsAccepted, ...payload } = formData;
      await registerCompany(payload);
      localStorage.setItem("registeredEmail", formData.email);
      toastrService.success("Kiểm tra email để nhận mã OTP.", "Đăng ký thành công!");
      navigate("/otp-verification");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại.";
      toastrService.error(errorMessage);
      setErrors({ apiError: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="auth-steps">
      {steps.map((step, index) => (
        <div key={step.number} className="auth-step">
          <div
            className={`auth-step-circle ${
              currentStep > step.number
                ? "completed"
                : currentStep === step.number
                ? "active"
                : "pending"
            }`}
          >
            {currentStep > step.number ? (
              <Check className="w-4 h-4" />
            ) : (
              step.number
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`auth-step-line ${
                currentStep > step.number ? "active" : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      {/* Company Name */}
      <div>
        <label className="auth-label">Tên công ty</label>
        <div className="auth-input-wrapper">
          <Building2 className="auth-input-icon w-5 h-5" />
          <input
            name="companyName"
            placeholder="Nhập tên công ty"
            value={formData.companyName}
            onChange={handleChange}
            className={`auth-input ${errors.companyName ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.companyName && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.companyName}
          </p>
        )}
      </div>

      {/* Tax Code */}
      <div>
        <label className="auth-label">Mã số thuế</label>
        <div className="auth-input-wrapper">
          <IdCard className="auth-input-icon w-5 h-5" />
          <input
            name="taxCode"
            placeholder="Nhập mã số thuế"
            value={formData.taxCode}
            onChange={handleChange}
            className={`auth-input ${errors.taxCode ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.taxCode && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.taxCode}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="auth-label">Địa chỉ</label>
        <div className="auth-input-wrapper">
          <MapPin className="auth-input-icon w-5 h-5" />
          <input
            name="address"
            placeholder="Nhập địa chỉ công ty"
            value={formData.address}
            onChange={handleChange}
            className={`auth-input ${errors.address ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.address && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.address}
          </p>
        )}
      </div>

      {/* Company Type */}
      <div>
        <label className="auth-label">Loại hình công ty</label>
        <select
          name="companyType"
          value={formData.companyType}
          onChange={handleChange}
          className={`auth-select ${errors.companyType ? 'error' : ''}`}
        >
          <option value="">Chọn loại hình công ty</option>
          <option value="Doanh nghiệp sản xuất">Doanh nghiệp sản xuất</option>
          <option value="Doanh nghiệp thương mại">Doanh nghiệp thương mại</option>
        </select>
        {errors.companyType && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.companyType}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      {/* Main Industry */}
      <div>
        <label className="auth-label">Ngành nghề chính</label>
        <div className="auth-input-wrapper">
          <Briefcase className="auth-input-icon w-5 h-5" />
          <input
            name="mainIndustry"
            placeholder="Nhập ngành nghề chính"
            value={formData.mainIndustry}
            onChange={handleChange}
            className={`auth-input ${errors.mainIndustry ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.mainIndustry && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.mainIndustry}
          </p>
        )}
      </div>

      {/* Representative Name */}
      <div>
        <label className="auth-label">Người đại diện</label>
        <div className="auth-input-wrapper">
          <User className="auth-input-icon w-5 h-5" />
          <input
            name="representativeName"
            placeholder="Nhập tên người đại diện"
            value={formData.representativeName}
            onChange={handleChange}
            className={`auth-input ${errors.representativeName ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.representativeName && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.representativeName}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="auth-label">Số điện thoại</label>
        <div className="auth-input-wrapper">
          <Phone className="auth-input-icon w-5 h-5" />
          <input
            name="phoneNumber"
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`auth-input ${errors.phoneNumber ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.phoneNumber && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.phoneNumber}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      {/* Email */}
      <div>
        <label className="auth-label">Email</label>
        <div className="auth-input-wrapper">
          <Mail className="auth-input-icon w-5 h-5" />
          <input
            name="email"
            type="email"
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

      {/* Employee Code */}
      <div>
        <label className="auth-label">Mã nhân viên</label>
        <div className="auth-input-wrapper">
          <IdCard className="auth-input-icon w-5 h-5" />
          <input
            name="employeeCode"
            placeholder="Nhập mã nhân viên"
            value={formData.employeeCode}
            onChange={handleChange}
            className={`auth-input ${errors.employeeCode ? 'error' : ''}`}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        {errors.employeeCode && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.employeeCode}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="auth-label">Mật khẩu</label>
        <div className="auth-input-wrapper">
          <Lock className="auth-input-icon w-5 h-5" />
          <input
            name="password"
            type={passwordShown ? "text" : "password"}
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
            {passwordShown ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="auth-field-error">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div 
        className="auth-checkbox-wrapper"
        onClick={() => setFormData({ ...formData, termsAccepted: !formData.termsAccepted })}
      >
        <div className={`auth-checkbox ${formData.termsAccepted ? 'checked' : ''}`}>
          {formData.termsAccepted && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="auth-checkbox-label">
          Tôi đồng ý với điều khoản sử dụng
        </span>
      </div>
      {errors.termsAccepted && (
        <p className="auth-field-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors.termsAccepted}
        </p>
      )}
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
      <div className="text-center mb-6">
        <h1 className="auth-title">Đăng Ký</h1>
        <p className="auth-subtitle">
          Đăng ký tài khoản để sử dụng hệ thống SCMS
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <form onSubmit={handleSubmit}>
        {/* Step Content */}
        <div className="min-h-[280px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* API Error */}
        {errors.apiError && (
          <div className="auth-error">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.apiError}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="auth-button flex-1"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.2)' 
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                Quay lại
              </span>
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="auth-button flex-1"
            >
              <span className="flex items-center justify-center gap-2">
                Tiếp theo
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>
          ) : (
            <button
              type="submit"
              className={`auth-button flex-1 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !formData.termsAccepted}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          )}
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center auth-text-muted text-sm">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="auth-link"
          >
            Đăng nhập
          </button>
        </p>
      </form>
    </>
  );
};

export default RegisterForm;
