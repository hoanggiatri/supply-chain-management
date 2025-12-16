import "@/styles/auth.css";
import { AlertTriangle, ArrowLeft, Home, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Unauthorized Page - Standalone page (no layout) with Aurora theme
 * Displayed when user tries to access a page they don't have permission to view
 */
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout min-h-screen flex items-center justify-center p-4">
      {/* Floating Orbs */}
      <div className="auth-orb auth-orb-1" style={{ background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)' }} />
      <div className="auth-orb auth-orb-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
      <div className="auth-orb auth-orb-3" />

      {/* Particles */}
      <div className="auth-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="auth-particle" />
        ))}
      </div>

      {/* Content Card */}
      <div className="auth-card p-10 w-full max-w-lg relative z-10 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center relative"
            style={{ 
              background: 'rgba(245, 87, 108, 0.15)',
              boxShadow: '0 0 40px rgba(245, 87, 108, 0.3)'
            }}
          >
            <ShieldX className="w-12 h-12 text-red-400" />
            <div 
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(251, 191, 36, 0.2)' }}
            >
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div 
          className="text-8xl font-bold mb-4"
          style={{ 
            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          403
        </div>

        {/* Title */}
        <h1 className="auth-title text-2xl mb-3">
          Không có quyền truy cập
        </h1>

        {/* Description */}
        <p className="auth-subtitle mb-8">
          Bạn không có quyền truy cập trang này. 
          Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="auth-button flex items-center justify-center gap-2"
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              flex: 1
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          
          <button
            onClick={() => navigate("/homepage")}
            className="auth-button flex items-center justify-center gap-2"
            style={{ flex: 1 }}
          >
            <Home className="w-5 h-5" />
            Trang chủ
          </button>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-sm" style={{ color: 'var(--auth-text-muted)' }}>
          Cần hỗ trợ?{" "}
          <button 
            className="auth-link"
            onClick={() => window.location.href = "mailto:support@scms.vn"}
          >
            Liên hệ hỗ trợ
          </button>
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
