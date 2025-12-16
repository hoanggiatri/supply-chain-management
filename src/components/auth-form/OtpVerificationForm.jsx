import { sendVerifyOtp, verifyOtp } from "@/services/general/AuthService";
import toastrService from "@/services/toastrService";
import { AlertCircle, ArrowLeft, Loader2, Mail, Package, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    // Focus first input
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors({ ...errors, otp: "" });
    }

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Add pop animation
    if (digit) {
      inputRefs.current[index]?.classList.add("filled");
      setTimeout(() => {
        inputRefs.current[index]?.classList.remove("filled");
      }, 300);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setErrors({ otp: "Vui lòng nhập đủ 6 chữ số" });
      return;
    }

    setIsLoading(true);

    try {
      await verifyOtp({ email, otp: Number(otpString) });
      toastrService.success("Xác thực thành công!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Mã OTP không đúng. Vui lòng thử lại!";
      toastrService.error(errorMessage);
      setErrors({ apiError: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await sendVerifyOtp(email);
      toastrService.success("Mã OTP đã được gửi lại!");
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Lỗi khi gửi lại OTP. Vui lòng thử lại!";
      toastrService.error(errorMessage);
    } finally {
      setIsResending(false);
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
        <h1 className="auth-title">Xác Thực OTP</h1>
        <p className="auth-subtitle">
          Mã xác thực đã được gửi đến email của bạn
        </p>
        {email && (
          <div className="flex items-center justify-center gap-2 mt-3 text-sm" style={{ color: 'var(--auth-primary-light)' }}>
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP Input Boxes */}
        <div className="auth-otp-container mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`auth-otp-input ${errors.otp ? 'error' : ''}`}
            />
          ))}
        </div>

        {/* Error Messages */}
        {errors.otp && (
          <p className="auth-field-error text-center mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.otp}
          </p>
        )}

        {errors.apiError && (
          <div className="auth-error mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.apiError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang xác thực...
            </span>
          ) : (
            "Xác nhận"
          )}
        </button>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="auth-text-muted text-sm mb-2">Chưa nhận được mã?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendTimer > 0 || isResending}
            className={`auth-link text-sm inline-flex items-center gap-2 ${
              resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={resendTimer > 0 ? { pointerEvents: 'none' } : {}}
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi...
              </>
            ) : resendTimer > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Gửi lại sau {resendTimer}s
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Gửi lại mã OTP
              </>
            )}
          </button>
        </div>

        {/* Back to Login */}
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

export default OtpVerificationForm;
