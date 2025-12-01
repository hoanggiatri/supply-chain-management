import PrivateRoute from "../PrivateRoute";

import HomePage from "@pages/HomePage";
import Unauthorized from "@pages/Unauthorized";
import MyProfile from "@pages/general/user/MyProfile";

import CompanyDetail from "@pages/general/company/CompanyDetail";
import EditCompany from "@/pages/general/company/EditCompany";

import DepartmentInCompany from "@pages/general/department/DepartmentInCompany";
import DepartmentDetail from "@pages/general/department/DepartmentDetail";

import EmployeeInCompany from "@pages/general/employee/EmployeeInCompany";
import EmployeeDetail from "@pages/general/employee/EmployeeDetail";
import EditEmployee from "@pages/general/employee/EditEmployee";
import CreateEmployee from "@pages/general/employee/CreateEmployee";

import UserInCompany from "@pages/general/user/UserInCompany";
import UserDetail from "@pages/general/user/UserDetail";
import EditUser from "@pages/general/user/EditUser";

import ItemInCompany from "@pages/general/item/ItemInCompany";
import ItemDetail from "@/pages/general/item/ItemDetail";
import EditItem from "@/pages/general/item/EditItem";
import CreateItem from "@/pages/general/item/CreateItem";
import CreateItemFromExcel from "@/pages/general/item/CreateItemFromExcel";

import WarehouseInCompany from "@pages/general/warehouse/WarehouseInCompany";
import WarehouseDetail from "@pages/general/warehouse/WarehouseDetail";
import EditWarehouse from "@/pages/general/warehouse/EditWarehouse";
import CreateWarehouse from "@pages/general/warehouse/CreateWarehouse";

import PlantInCompany from "@/pages/general/manufacturing-plant/PlantInCompany";
import PlantDetail from "@/pages/general/manufacturing-plant/PlantDetail";
import EditPlant from "@/pages/general/manufacturing-plant/EditPlant";
import CreatePlant from "@/pages/general/manufacturing-plant/CreatePlant";

import LineInCompany from "@/pages/general/manufacturing-line/LineInCompany";
import LineDetail from "@/pages/general/manufacturing-line/LineDetail";
import EditLine from "@/pages/general/manufacturing-line/EditLine";
import CreateLine from "@/pages/general/manufacturing-line/CreateLine";

import AllProducts from "@/pages/general/product/AllProducts";
import ProductDetail from "@/pages/general/product/ProductDetail";
import ScanQR from "@/pages/general/product/ScanQR";

const generalRoutes = [
  {
    path: "/homepage",
    element: (
      <PrivateRoute element={<HomePage />} allowedRoles={["c_admin", "user"]} />
    ),
  },
  {
    path: "/my-profile",
    element: (
      <PrivateRoute
        element={<MyProfile />}
        allowedRoles={["c_admin", "user", "s_admin"]}
      />
    ),
  },
  {
    path: "/company",
    element: (
      <PrivateRoute element={<CompanyDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/company/edit",
    element: (
      <PrivateRoute element={<EditCompany />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/departments",
    element: (
      <PrivateRoute
        element={<DepartmentInCompany />}
        allowedRoles={["c_admin"]}
      />
    ),
  },
  {
    path: "/department/:departmentId",
    element: (
      <PrivateRoute element={<DepartmentDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/employees",
    element: (
      <PrivateRoute
        element={<EmployeeInCompany />}
        allowedRoles={["c_admin"]}
      />
    ),
  },
  {
    path: "/employee/:employeeId",
    element: (
      <PrivateRoute element={<EmployeeDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/employee/:employeeId/edit",
    element: (
      <PrivateRoute
        element={<EditEmployee />}
        allowedRoles={["c_admin", "user"]}
      />
    ),
  },
  {
    path: "/create-employee",
    element: (
      <PrivateRoute element={<CreateEmployee />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/users",
    element: (
      <PrivateRoute element={<UserInCompany />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/user/:userId",
    element: (
      <PrivateRoute element={<UserDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/user/:userId/edit",
    element: (
      <PrivateRoute
        element={<EditUser />}
        allowedRoles={["c_admin", "user", "s_admin"]}
      />
    ),
  },
  {
    path: "/items",
    element: (
      <PrivateRoute element={<ItemInCompany />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/item/:itemId",
    element: (
      <PrivateRoute element={<ItemDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/create-item",
    element: (
      <PrivateRoute element={<CreateItem />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/item/:itemId/edit",
    element: <PrivateRoute element={<EditItem />} allowedRoles={["c_admin"]} />,
  },
  {
    path: "/create-item-from-excel",
    element: (
      <PrivateRoute
        element={<CreateItemFromExcel />}
        allowedRoles={["c_admin"]}
      />
    ),
  },
  {
    path: "/warehouses",
    element: (
      <PrivateRoute
        element={<WarehouseInCompany />}
        allowedRoles={["c_admin"]}
      />
    ),
  },
  {
    path: "/warehouse/:warehouseId",
    element: (
      <PrivateRoute element={<WarehouseDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/create-warehouse",
    element: (
      <PrivateRoute element={<CreateWarehouse />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/warehouse/:warehouseId/edit",
    element: (
      <PrivateRoute element={<EditWarehouse />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/plants",
    element: (
      <PrivateRoute element={<PlantInCompany />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/plant/:plantId",
    element: (
      <PrivateRoute element={<PlantDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/create-plant",
    element: (
      <PrivateRoute element={<CreatePlant />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/plant/:plantId/edit",
    element: (
      <PrivateRoute element={<EditPlant />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/lines",
    element: (
      <PrivateRoute element={<LineInCompany />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/line/:lineId",
    element: (
      <PrivateRoute element={<LineDetail />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/create-line",
    element: (
      <PrivateRoute element={<CreateLine />} allowedRoles={["c_admin"]} />
    ),
  },
  {
    path: "/line/:lineId/edit",
    element: <PrivateRoute element={<EditLine />} allowedRoles={["c_admin"]} />,
  },
  {
    path: "/products",
    element: (
      <PrivateRoute
        element={<AllProducts />}
        allowedRoles={["c_admin", "user"]}
      />
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <PrivateRoute
        element={<ProductDetail />}
        allowedRoles={["c_admin", "user"]}
      />
    ),
  },
  {
    path: "/products/scan",
    element: (
      <PrivateRoute element={<ScanQR />} allowedRoles={["c_admin", "user"]} />
    ),
  },
  { path: "/unauthorized", element: <Unauthorized /> },
];

export default generalRoutes;
