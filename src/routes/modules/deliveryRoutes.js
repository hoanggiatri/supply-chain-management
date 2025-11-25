import PrivateRoute from "../PrivateRoute";

import DoInCompany from "@/pages/delivery/DoInCompany";
import DoDetail from "@/pages/delivery/DoDetail";
import UpdateDoProcess from "@/pages/delivery/UpdateDoProcess";
import DoProcess from "@/pages/delivery/DoProcess";

const deliveryRoutes = [
  {
    path: "/dos",
    element: (
      <PrivateRoute
        element={<DoInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Vận chuyển"]}
      />
    ),
  },
  {
    path: "/do/:doId",
    element: (
      <PrivateRoute
        element={<DoDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Vận chuyển"]}
      />
    ),
  },
  {
    path: "/update-do-process/:doId",
    element: (
      <PrivateRoute
        element={<UpdateDoProcess />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Vận chuyển"]}
      />
    ),
  },
  {
    path: "/do-process/:doId",
    element: (
      <PrivateRoute
        element={<DoProcess />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Vận chuyển"]}
      />
    ),
  },
];

export default deliveryRoutes;

