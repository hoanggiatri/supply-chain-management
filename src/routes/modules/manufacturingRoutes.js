import PrivateRoute from "../PrivateRoute";

import BomInCompany from "@/pages/manufacturing/bom/BomInCompany";
import CreateBom from "@/pages/manufacturing/bom/CreateBom";
import BomDetail from "@/pages/manufacturing/bom/BomDetail";
import EditBom from "@/pages/manufacturing/bom/EditBom";

import MoInCompany from "@/pages/manufacturing/mo/MoInCompany";
import CreateMo from "@/pages/manufacturing/mo/CreateMo";
import MoDetail from "@/pages/manufacturing/mo/MoDetail";
import EditMo from "@/pages/manufacturing/mo/EditMo";
import ManufactureReport from "@/pages/manufacturing/mo/ManufactureReport";

import StageInCompany from "@/pages/manufacturing/stage/StageInCompany";
import CreateStage from "@/pages/manufacturing/stage/CreateStage";
import StageDetail from "@/pages/manufacturing/stage/StageDetail";
import EditStage from "@/pages/manufacturing/stage/EditStage";

const manufacturingRoutes = [
  {
    path: "/boms",
    element: (
      <PrivateRoute
        element={<BomInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/create-bom",
    element: (
      <PrivateRoute
        element={<CreateBom />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/bom/:itemId",
    element: (
      <PrivateRoute
        element={<BomDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/bom/:itemId/edit",
    element: (
      <PrivateRoute
        element={<EditBom />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/mos",
    element: (
      <PrivateRoute
        element={<MoInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/create-mo",
    element: (
      <PrivateRoute
        element={<CreateMo />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/mo/:moId",
    element: (
      <PrivateRoute
        element={<MoDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/mo/:moId/edit",
    element: (
      <PrivateRoute
        element={<EditMo />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/manufacture-report",
    element: (
      <PrivateRoute
        element={<ManufactureReport />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/stages",
    element: (
      <PrivateRoute
        element={<StageInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/create-stage",
    element: (
      <PrivateRoute
        element={<CreateStage />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/stage/:stageId",
    element: (
      <PrivateRoute
        element={<StageDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
  {
    path: "/stage/:stageId/edit",
    element: (
      <PrivateRoute
        element={<EditStage />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Sản xuất"]}
      />
    ),
  },
];

export default manufacturingRoutes;

