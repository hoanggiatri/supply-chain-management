import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayoutMT from "@layouts/SideBarLayoutMT";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import adminRoutes from "./modules/adminRoutes";
import deliveryRoutes from "./modules/deliveryRoutes";
import generalRoutes from "./modules/generalRoutes";
import inventoryRoutes from "./modules/inventoryRoutes";
import manufacturingRoutes from "./modules/manufacturingRoutes";
import publicRoutes from "./modules/publicRoutes";
import purchasingRoutes from "./modules/purchasingRoutes";
import salesRoutes from "./modules/salesRoutes";

const renderRoutes = (routes) =>
  routes.map(({ path, element }) => (
    <Route key={path} path={path} element={element} />
  ));

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
        <Route element={<NavBarLayout />}>{renderRoutes(publicRoutes)}</Route>

        <Route element={<SideBarLayoutMT role={"s_admin"} />}>
          {renderRoutes(adminRoutes)}
        </Route>

        <Route element={<SideBarLayoutMT />}>
          {renderRoutes(companyRoutes)}
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
