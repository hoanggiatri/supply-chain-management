import PrivateRoute from "../PrivateRoute";

import CheckInventory from "@/pages/inventory/inventory/CheckInventory";
import CreateInventory from "@/pages/inventory/inventory/CreateInventory";
import InventoryCount from "@/pages/inventory/inventory/InventoryCount";

import IssueReport from "@/pages/inventory/issue-ticket/IssueReport";
import ItDetail from "@/pages/inventory/issue-ticket/ItDetail";
import ItInCompany from "@/pages/inventory/issue-ticket/ItInCompany";

import ReceiveReport from "@/pages/inventory/receive-ticket/ReceiveReport";
import RtDetail from "@/pages/inventory/receive-ticket/RtDetail";
import RtInCompany from "@/pages/inventory/receive-ticket/RtInCompany";

import CreateTt from "@/pages/inventory/transfer-ticket/CreateTt";
import EditTt from "@/pages/inventory/transfer-ticket/EditTt";
import TtDetail from "@/pages/inventory/transfer-ticket/TtDetail";
import TtInCompany from "@/pages/inventory/transfer-ticket/TtInCompany";

const inventoryRoutes = [
  {
    path: "/check-inventory/:type/:id",
    element: (
      <PrivateRoute
        element={<CheckInventory />}
        allowedRoles={["c_admin", "user"]}
      />
    ),
  },
  {
    path: "/inventory-count",
    element: (
      <PrivateRoute
        element={<InventoryCount />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/create-inventory",
    element: (
      <PrivateRoute
        element={<CreateInventory />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/issue-tickets",
    element: (
      <PrivateRoute
        element={<ItInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/issue-ticket/:ticketId",
    element: (
      <PrivateRoute
        element={<ItDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/issue-report",
    element: (
      <PrivateRoute
        element={<IssueReport />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/receive-tickets",
    element: (
      <PrivateRoute
        element={<RtInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/receive-ticket/:ticketId",
    element: (
      <PrivateRoute
        element={<RtDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/receive-report",
    element: (
      <PrivateRoute
        element={<ReceiveReport />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/transfer-tickets",
    element: (
      <PrivateRoute
        element={<TtInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/transfer-ticket/:ticketId",
    element: (
      <PrivateRoute
        element={<TtDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/transfer-ticket/:ticketId/edit",
    element: (
      <PrivateRoute
        element={<EditTt />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
  {
    path: "/create-transfer-ticket",
    element: (
      <PrivateRoute
        element={<CreateTt />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Kho"]}
      />
    ),
  },
];

export default inventoryRoutes;

