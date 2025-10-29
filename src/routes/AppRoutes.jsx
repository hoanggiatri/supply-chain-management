import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayout from "@layouts/SideBarLayout";
import PrivateRoute from "./PrivateRoute";

import DefaultPage from "@pages/DefaultPage";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminVerifyOtp from "@/pages/admin/AdminVerifyOtp";
import Dashboard from "@/pages/admin/Dashboard";

import Register from "@pages/authentication/Register";
import OtpVerification from "@pages/authentication/OtpVerification";
import Login from "@pages/authentication/Login";
import ForgotPassword from "@pages/authentication/ForgotPassword";
import OtpForgotPassword from "@pages/authentication/OtpForgotPassword";
import ResetPassword from "@pages/authentication/ResetPassword";

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

import BomInCompany from "@/pages/manufacturing/bom/BomInCompany";
import CreateBom from "@/pages/manufacturing/bom/CreateBom";
import BomDetail from "@/pages/manufacturing/bom/BomDetail";
import EditBom from "@/pages/manufacturing/bom/EditBom";
import ManufactureReport from "@/pages/manufacturing/mo/ManufactureReport";

import MoInCompany from "@/pages/manufacturing/mo/MoInCompany";
import CreateMo from "@/pages/manufacturing/mo/CreateMo";
import MoDetail from "@/pages/manufacturing/mo/MoDetail";
import EditMo from "@/pages/manufacturing/mo/EditMo";

import StageInCompany from "@/pages/manufacturing/stage/StageInCompany";
import CreateStage from "@/pages/manufacturing/stage/CreateStage";
import StageDetail from "@/pages/manufacturing/stage/StageDetail";
import EditStage from "@/pages/manufacturing/stage/EditStage";

import Inventory from "@/pages/inventory/inventory/Inventory";
import CheckInventory from "@/pages/inventory/inventory/CheckInventory";
import InventoryCount from "@/pages/inventory/inventory/InventoryCount";
import CreateInventory from "@/pages/inventory/inventory/CreateInventory";

import ItInCompany from "@/pages/inventory/issue-ticket/ItInCompany";
import ItDetail from "@/pages/inventory/issue-ticket/ItDetail";
import IssueReport from "@/pages/inventory/issue-ticket/IssueReport";

import RtInCompany from "@/pages/inventory/receive-ticket/RtInCompany";
import RtDetail from "@/pages/inventory/receive-ticket/RtDetail";
import ReceiveReport from "@/pages/inventory/receive-ticket/ReceiveReport";

import TtInCompany from "@/pages/inventory/transfer-ticket/TtInCompany";
import TtDetail from "@/pages/inventory/transfer-ticket/TtDetail";
import EditTt from "@/pages/inventory/transfer-ticket/EditTt";
import CreateTt from "@/pages/inventory/transfer-ticket/CreateTt";

import SupplierSearch from "@/pages/purchasing/supplier/SupplierSearch";
import SupplierDetail from "@/pages/purchasing/supplier/SupplierDetail";

import CreateRfq from "@/pages/purchasing/rfq/CreateRfq";
import RfqInCompany from "@/pages/purchasing/rfq/RfqInCompany";
import RfqDetail from "@/pages/purchasing/rfq/RfqDetail";

import RfqInSupplierCompany from "@/pages/sale/supplier-rfq/RfqInSupplierCompany";
import SupplierRfqDetail from "@/pages/sale/supplier-rfq/SupplierRfqDetail";

import CreateQuotation from "@/pages/sale/quotation/CreateQuotation";
import QuotationDetail from "@/pages/sale/quotation/QuotationDetail";
import QuotationInCompany from "@/pages/sale/quotation/QuotationInCompany";

import QuotationInCustomerCompany from "@/pages/purchasing/customer-quotation/QuotationInCustomerCompany";
import CustomerQuotationDetail from "@/pages/purchasing/customer-quotation/CustomerQuotationDetail";

import CreatePo from "@/pages/purchasing/po/CreatePo";
import PoInCompany from "@/pages/purchasing/po/PoInCompany";
import PoDetail from "@/pages/purchasing/po/PoDetail";
import PoInSupplierCompany from "@/pages/sale/supplier-po/PoInSupplierCompany";
import SupplierPoDetail from "@/pages/sale/supplier-po/SupplierPoDetail";
import PurchaseReport from "@/pages/purchasing/po/PurchaseReport";

import CreateSo from "@/pages/sale/so/CreateSo";
import SoInCompany from "@/pages/sale/so/SoInCompany";
import SoDetail from "@/pages/sale/so/SoDetail";
import SalesReport from "@/pages/sale/so/SalesReport";

import DoInCompany from "@/pages/delivery/DoInCompany";
import DoDetail from "@/pages/delivery/DoDetail";
import UpdateDoProcess from "@/pages/delivery/UpdateDoProcess";
import DoProcess from "@/pages/delivery/DoProcess";

import AllCompanies from "@/pages/admin/AllCompanies";
import Company from "@/pages/admin/Company";
import UpdateCompany from "@/pages/admin/UpdateCompany";

import AllUsers from "@/pages/admin/AllUsers";
import User from "@/pages/admin/User";
import UpdateUser from "@/pages/admin/UpdateUser";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route element={<NavBarLayout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-forgot-password-otp" element={<OtpForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/login-admin" element={<AdminLogin />} />
          <Route path="/admin-verify-otp/:email" element={<AdminVerifyOtp />} />
        </Route>

        <Route element={<SideBarLayout role={"S-ADMIN"} />}>
          <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} allowedRoles={["S-ADMIN"]} />} />
          <Route path="/admin/all-company" element={<PrivateRoute element={<AllCompanies />} allowedRoles={["S-ADMIN"]} />} />
          <Route path="/admin/company/:companyId" element={<PrivateRoute element={<Company />} allowedRoles={["S-ADMIN"]} />} />
          <Route path="/admin/company/:companyId/edit" element={<PrivateRoute element={<UpdateCompany />} allowedRoles={["S-ADMIN"]} />} />

          <Route path="/admin/all-user" element={<PrivateRoute element={<AllUsers />} allowedRoles={["S-ADMIN"]} />} />
          <Route path="/admin/user/:userId" element={<PrivateRoute element={<User />} allowedRoles={["S-ADMIN"]} />} />
          <Route path="/admin/user/:userId/edit" element={<PrivateRoute element={<UpdateUser />} allowedRoles={["S-ADMIN"]} />} />

        </Route>

        <Route element={<SideBarLayout />}>
          <Route path="/homepage" element={<PrivateRoute element={<HomePage />} allowedRoles={["C-ADMIN", "USER"]} />} />
          <Route path="/my-profile" element={<PrivateRoute element={<MyProfile />} allowedRoles={["C-ADMIN", "USER", "S-ADMIN"]} />} />

          <Route path="/company" element={<PrivateRoute element={<CompanyDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/company/edit" element={<PrivateRoute element={<EditCompany />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/departments" element={<PrivateRoute element={<DepartmentInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/department/:departmentId" element={<PrivateRoute element={<DepartmentDetail />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/employees" element={<PrivateRoute element={<EmployeeInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/employee/:employeeId" element={<PrivateRoute element={<EmployeeDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/employee/:employeeId/edit" element={<PrivateRoute element={<EditEmployee />} allowedRoles={["C-ADMIN", "USER"]} />} />
          <Route path="/create-employee" element={<PrivateRoute element={<CreateEmployee />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/users" element={<PrivateRoute element={<UserInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/user/:userId" element={<PrivateRoute element={<UserDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/user/:userId/edit" element={<PrivateRoute element={<EditUser />} allowedRoles={["C-ADMIN", "USER", "S-ADMIN"]} />} />

          <Route path="/items" element={<PrivateRoute element={<ItemInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/item/:itemId" element={<PrivateRoute element={<ItemDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/create-item" element={<PrivateRoute element={<CreateItem />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/item/:itemId/edit" element={<PrivateRoute element={<EditItem />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/create-item-from-excel" element={<PrivateRoute element={<CreateItemFromExcel />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/warehouses" element={<PrivateRoute element={<WarehouseInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/warehouse/:warehouseId" element={<PrivateRoute element={<WarehouseDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/create-warehouse" element={<PrivateRoute element={<CreateWarehouse />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/warehouse/:warehouseId/edit" element={<PrivateRoute element={<EditWarehouse />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/plants" element={<PrivateRoute element={<PlantInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/plant/:plantId" element={<PrivateRoute element={<PlantDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/create-plant" element={<PrivateRoute element={<CreatePlant />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/plant/:plantId/edit" element={<PrivateRoute element={<EditPlant />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/lines" element={<PrivateRoute element={<LineInCompany />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/line/:lineId" element={<PrivateRoute element={<LineDetail />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/create-line" element={<PrivateRoute element={<CreateLine />} allowedRoles={["C-ADMIN"]} />} />
          <Route path="/line/:lineId/edit" element={<PrivateRoute element={<EditLine />} allowedRoles={["C-ADMIN"]} />} />

          <Route path="/boms" element={<PrivateRoute element={<BomInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/create-bom" element={<PrivateRoute element={<CreateBom />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/bom/:itemId" element={<PrivateRoute element={<BomDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/bom/:itemId/edit" element={<PrivateRoute element={<EditBom />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />

          <Route path="/mos" element={<PrivateRoute element={<MoInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/create-mo" element={<PrivateRoute element={<CreateMo />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/mo/:moId" element={<PrivateRoute element={<MoDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/mo/:moId/edit" element={<PrivateRoute element={<EditMo />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/manufacture-report" element={<PrivateRoute element={<ManufactureReport />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />

          <Route path="/stages" element={<PrivateRoute element={<StageInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/create-stage" element={<PrivateRoute element={<CreateStage />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/stage/:itemId" element={<PrivateRoute element={<StageDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />
          <Route path="/stage/:itemId/edit" element={<PrivateRoute element={<EditStage />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Sản xuất"]} />} />

          <Route path="/inventory" element={<PrivateRoute element={<Inventory />} allowedRoles={["C-ADMIN", "USER"]} />} />
          <Route path="/check-inventory/:type/:id" element={<PrivateRoute element={<CheckInventory />} allowedRoles={["C-ADMIN", "USER"]} />} />
          <Route path="/inventory-count" element={<PrivateRoute element={<InventoryCount />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/create-inventory" element={<PrivateRoute element={<CreateInventory />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />

          <Route path="/issue-tickets" element={<PrivateRoute element={<ItInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/issue-ticket/:ticketId" element={<PrivateRoute element={<ItDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/issue-report" element={<PrivateRoute element={<IssueReport />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />

          <Route path="/receive-tickets" element={<PrivateRoute element={<RtInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/receive-ticket/:ticketId" element={<PrivateRoute element={<RtDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/receive-report" element={<PrivateRoute element={<ReceiveReport />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />

          <Route path="/transfer-tickets" element={<PrivateRoute element={<TtInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/transfer-ticket/:ticketId" element={<PrivateRoute element={<TtDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/transfer-ticket/:ticketId/edit" element={<PrivateRoute element={<EditTt />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />
          <Route path="/create-transfer-ticket" element={<PrivateRoute element={<CreateTt />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Kho"]} />} />

          <Route path="/supplier-search" element={<PrivateRoute element={<SupplierSearch />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/supplier/:supplierId" element={<PrivateRoute element={<SupplierDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />

          <Route path="/create-rfq" element={<PrivateRoute element={<CreateRfq />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/rfqs" element={<PrivateRoute element={<RfqInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/rfq/:rfqId" element={<PrivateRoute element={<RfqDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />

          <Route path="/supplier-rfqs" element={<PrivateRoute element={<RfqInSupplierCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/supplier-rfq/:rfqId" element={<PrivateRoute element={<SupplierRfqDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />

          <Route path="/create-quotation/:rfqId" element={<PrivateRoute element={<CreateQuotation />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/quotations" element={<PrivateRoute element={<QuotationInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/quotation/:rfqId" element={<PrivateRoute element={<QuotationDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />

          <Route path="/customer-quotations" element={<PrivateRoute element={<QuotationInCustomerCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/customer-quotation/:rfqId" element={<PrivateRoute element={<CustomerQuotationDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />

          <Route path="/create-po/:quotationId" element={<PrivateRoute element={<CreatePo />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/pos" element={<PrivateRoute element={<PoInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/po/:poId" element={<PrivateRoute element={<PoDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />
          <Route path="/purchase-report" element={<PrivateRoute element={<PurchaseReport />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Mua hàng"]} />} />

          <Route path="/supplier-pos" element={<PrivateRoute element={<PoInSupplierCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/supplier-po/:poId" element={<PrivateRoute element={<SupplierPoDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />

          <Route path="/create-so/:poId" element={<PrivateRoute element={<CreateSo />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/sos" element={<PrivateRoute element={<SoInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/so/:soId" element={<PrivateRoute element={<SoDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />
          <Route path="/sales-report" element={<PrivateRoute element={<SalesReport />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Bán hàng"]} />} />

          <Route path="/dos" element={<PrivateRoute element={<DoInCompany />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Vận chuyển"]} />} />
          <Route path="/do/:doId" element={<PrivateRoute element={<DoDetail />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Vận chuyển"]} />} />
          <Route path="/update-do-process/:doId" element={<PrivateRoute element={<UpdateDoProcess />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Vận chuyển"]} />} />
          <Route path="/do-process/:doId" element={<PrivateRoute element={<DoProcess />} allowedRoles={["C-ADMIN", "USER"]} allowedDepartments={["Quản trị", "Vận chuyển"]} />} />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
