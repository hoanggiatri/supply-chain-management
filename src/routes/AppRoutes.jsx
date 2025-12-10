import MarketplaceLayout from "@layouts/MarketplaceLayout";
import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayoutMT from "@layouts/SideBarLayoutMT";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Marketplace V2 (New redesigned version)
import { MarketplaceV2Layout } from "@/modules/marketplace-v2";
import marketplaceV2Routes from "@/modules/marketplace-v2/routes";

import adminRoutes from "./modules/adminRoutes";
import deliveryRoutes from "./modules/deliveryRoutes";
import generalRoutes from "./modules/generalRoutes";
import inventoryRoutes from "./modules/inventoryRoutes";
import manufacturingRoutes from "./modules/manufacturingRoutes";
import marketplaceRoutes from "./modules/marketplaceRoutes";
import publicRoutes from "./modules/publicRoutes";
import purchasingRoutes from "./modules/purchasingRoutes";
import salesRoutes from "./modules/salesRoutes";

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
        {/* Public routes (Login, Register, etc.) */}
        <Route element={<NavBarLayout />}>{renderRoutes(publicRoutes)}</Route>

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
      </Routes>
    </Router>
  );
}

export default AppRoutes;

