import MarketplaceLayout from "@layouts/MarketplaceLayout";
import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayoutMT from "@layouts/SideBarLayoutMT";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Marketplace V2 (New redesigned version)
import { MarketplaceV2Layout } from "@/modules/marketplace-v2";
import marketplaceV2Routes from "@/modules/marketplace-v2/routes";

// Auth pages (standalone, no layout)
import ForgotPassword from "@pages/authentication/ForgotPassword";
import Login from "@pages/authentication/Login";
import OtpForgotPassword from "@pages/authentication/OtpForgotPassword";
import OtpVerification from "@pages/authentication/OtpVerification";
import Register from "@pages/authentication/Register";
import ResetPassword from "@pages/authentication/ResetPassword";
import NotFound from "@pages/NotFound";
import Unauthorized from "@pages/Unauthorized";
import PublicRoute from "./PublicRoute";

// Landing page
import DefaultPage from "@pages/DefaultPage";

import adminRoutes from "./modules/adminRoutes";
import deliveryRoutes from "./modules/deliveryRoutes";
import generalRoutes from "./modules/generalRoutes";
import inventoryRoutes from "./modules/inventoryRoutes";
import manufacturingRoutes from "./modules/manufacturingRoutes";
import marketplaceRoutes from "./modules/marketplaceRoutes";
import purchasingRoutes from "./modules/purchasingRoutes";
import salesRoutes from "./modules/salesRoutes";

// Admin login routes
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminVerifyOtp from "@/pages/admin/AdminVerifyOtp";

const renderRoutes = (routes) =>
  routes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));

// Traditional sidebar routes (for c_admin and other roles)
const companyRoutes = [
  ...generalRoutes,
  ...manufacturingRoutes,
  ...inventoryRoutes,
  ...purchasingRoutes,
  ...salesRoutes,
  ...deliveryRoutes,
];

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth routes - Standalone, no layout/header */}
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/otp-verification" element={<PublicRoute element={<OtpVerification />} />} />
        <Route path="/forgot-password" element={<PublicRoute element={<ForgotPassword />} />} />
        <Route path="/verify-forgot-password-otp" element={<PublicRoute element={<OtpForgotPassword />} />} />
        <Route path="/reset-password" element={<PublicRoute element={<ResetPassword />} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Admin auth routes */}
        <Route path="/login-admin" element={<PublicRoute element={<AdminLogin />} redirectPath="/admin/dashboard" />} />
        <Route path="/admin-verify-otp/:email" element={<AdminVerifyOtp />} />

        {/* Landing page with NavBar */}
        <Route element={<NavBarLayout />}>
          <Route path="/" element={<DefaultPage />} />
        </Route>

        {/* System Admin routes */}
        <Route element={<SideBarLayoutMT role={"s_admin"} />}>
          {renderRoutes(adminRoutes)}
        </Route>

        {/* Marketplace V2 routes (New redesigned version) */}
        <Route element={<MarketplaceV2Layout />}>
          {renderRoutes(marketplaceV2Routes)}
        </Route>

        {/* Marketplace routes (Legacy - for user role with Mua hàng/Bán hàng department) */}
        <Route element={<MarketplaceLayout />}>
          {renderRoutes(marketplaceRoutes)}
        </Route>

        {/* Traditional sidebar routes (for c_admin and other roles) */}
        <Route element={<SideBarLayoutMT />}>
          {renderRoutes(companyRoutes)}
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;

