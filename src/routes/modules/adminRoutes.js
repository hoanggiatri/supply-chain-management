import PrivateRoute from "../PrivateRoute";

import Dashboard from "@/pages/admin/Dashboard";
import AllCompanies from "@/pages/admin/AllCompanies";
import Company from "@/pages/admin/Company";
import UpdateCompany from "@/pages/admin/UpdateCompany";
import AllUsers from "@/pages/admin/AllUsers";
import User from "@/pages/admin/User";
import UpdateUser from "@/pages/admin/UpdateUser";

const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <PrivateRoute element={<Dashboard />} allowedRoles={["s_admin"]} />,
  },
  {
    path: "/admin/all-company",
    element: (
      <PrivateRoute element={<AllCompanies />} allowedRoles={["s_admin"]} />
    ),
  },
  {
    path: "/admin/company/:companyId",
    element: <PrivateRoute element={<Company />} allowedRoles={["s_admin"]} />,
  },
  {
    path: "/admin/company/:companyId/edit",
    element: (
      <PrivateRoute element={<UpdateCompany />} allowedRoles={["s_admin"]} />
    ),
  },
  {
    path: "/admin/all-user",
    element: <PrivateRoute element={<AllUsers />} allowedRoles={["s_admin"]} />,
  },
  {
    path: "/admin/user/:userId",
    element: <PrivateRoute element={<User />} allowedRoles={["s_admin"]} />,
  },
  {
    path: "/admin/user/:userId/edit",
    element: (
      <PrivateRoute element={<UpdateUser />} allowedRoles={["s_admin"]} />
    ),
  },
];

export default adminRoutes;

