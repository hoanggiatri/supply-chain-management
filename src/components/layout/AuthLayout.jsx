import "@/styles/auth.css";

/**
 * AuthLayout - Premium authentication layout with Aurora Flow theme
 * Features:
 * - Animated aurora gradient background
 * - Floating gradient orbs
 * - Particle effects
 * - Glassmorphism card container
 */
const AuthLayout = ({ children, maxWidth = "28rem" }) => {
  return (
    <div className="auth-layout min-h-screen flex items-center justify-center p-4">
      {/* Floating Orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* Particles */}
      <div className="auth-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="auth-particle" />
        ))}
      </div>

      {/* Content Container */}
      <div
        className="auth-card p-8 w-full relative z-10"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
