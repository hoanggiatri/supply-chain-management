import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayoutMT from "@layouts/SideBarLayoutMT";
import MarketplaceLayout from "@layouts/MarketplaceLayout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import adminRoutes from "./modules/adminRoutes";
import deliveryRoutes from "./modules/deliveryRoutes";
import generalRoutes from "./modules/generalRoutes";
import inventoryRoutes from "./modules/inventoryRoutes";
import manufacturingRoutes from "./modules/manufacturingRoutes";
import publicRoutes from "./modules/publicRoutes";
import purchasingRoutes from "./modules/purchasingRoutes";
import salesRoutes from "./modules/salesRoutes";
import marketplaceRoutes from "./modules/marketplaceRoutes";

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

        {/* Marketplace routes (for user role with Mua hàng/Bán hàng department) */}
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
