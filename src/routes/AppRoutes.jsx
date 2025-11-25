import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBarLayout from "@layouts/NavBarLayout";
import SideBarLayoutMT from "@layouts/SideBarLayoutMT";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

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

import ProductInCompany from "@/pages/general/product/ProductInCompany";
import CreateProduct from "@/pages/general/product/CreateProduct";
import ProductDetail from "@/pages/general/product/ProductDetail";
import QRScanPage from "@/pages/general/product/QRScanPage";

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
          <Route
            path="/register"
            element={<PublicRoute element={<Register />} />}
          />
          <Route
            path="/otp-verification"
            element={<PublicRoute element={<OtpVerification />} />}
          />
          <Route path="/login" element={<PublicRoute element={<Login />} />} />
          <Route
            path="/forgot-password"
            element={<PublicRoute element={<ForgotPassword />} />}
          />
          <Route
            path="/verify-forgot-password-otp"
            element={<PublicRoute element={<OtpForgotPassword />} />}
          />
          <Route
            path="/reset-password"
            element={<PublicRoute element={<ResetPassword />} />}
          />

          <Route
            path="/login-admin"
            element={
              <PublicRoute
                element={<AdminLogin />}
                redirectPath="/admin/dashboard"
              />
            }
          />
          <Route path="/admin-verify-otp/:email" element={<AdminVerifyOtp />} />
        </Route>

        <Route element={<SideBarLayoutMT role={"s_admin"} />}>
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute
                element={<Dashboard />}
                allowedRoles={["s_admin"]}
              />
            }
          />
          <Route
            path="/admin/all-company"
            element={
              <PrivateRoute
                element={<AllCompanies />}
                allowedRoles={["s_admin"]}
              />
            }
          />
          <Route
            path="/admin/company/:companyId"
            element={
              <PrivateRoute element={<Company />} allowedRoles={["s_admin"]} />
            }
          />
          <Route
            path="/admin/company/:companyId/edit"
            element={
              <PrivateRoute
                element={<UpdateCompany />}
                allowedRoles={["s_admin"]}
              />
            }
          />

          <Route
            path="/admin/all-user"
            element={
              <PrivateRoute element={<AllUsers />} allowedRoles={["s_admin"]} />
            }
          />
          <Route
            path="/admin/user/:userId"
            element={
              <PrivateRoute element={<User />} allowedRoles={["s_admin"]} />
            }
          />
          <Route
            path="/admin/user/:userId/edit"
            element={
              <PrivateRoute
                element={<UpdateUser />}
                allowedRoles={["s_admin"]}
              />
            }
          />
        </Route>

        <Route element={<SideBarLayoutMT />}>
          <Route
            path="/homepage"
            element={
              <PrivateRoute
                element={<HomePage />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/my-profile"
            element={
              <PrivateRoute
                element={<MyProfile />}
                allowedRoles={["c_admin", "user", "s_admin"]}
              />
            }
          />

          <Route
            path="/company"
            element={
              <PrivateRoute
                element={<CompanyDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/company/edit"
            element={
              <PrivateRoute
                element={<EditCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/departments"
            element={
              <PrivateRoute
                element={<DepartmentInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/department/:departmentId"
            element={
              <PrivateRoute
                element={<DepartmentDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/employees"
            element={
              <PrivateRoute
                element={<EmployeeInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/employee/:employeeId"
            element={
              <PrivateRoute
                element={<EmployeeDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/employee/:employeeId/edit"
            element={
              <PrivateRoute
                element={<EditEmployee />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/create-employee"
            element={
              <PrivateRoute
                element={<CreateEmployee />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute
                element={<UserInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/user/:userId"
            element={
              <PrivateRoute
                element={<UserDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/user/:userId/edit"
            element={
              <PrivateRoute
                element={<EditUser />}
                allowedRoles={["c_admin", "user", "s_admin"]}
              />
            }
          />

          <Route
            path="/items"
            element={
              <PrivateRoute
                element={<ItemInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/item/:itemId"
            element={
              <PrivateRoute
                element={<ItemDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/create-item"
            element={
              <PrivateRoute
                element={<CreateItem />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/item/:itemId/edit"
            element={
              <PrivateRoute element={<EditItem />} allowedRoles={["c_admin"]} />
            }
          />
          <Route
            path="/create-item-from-excel"
            element={
              <PrivateRoute
                element={<CreateItemFromExcel />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute
                element={<ProductInCompany />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/create-product"
            element={
              <PrivateRoute
                element={<CreateProduct />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={
              <PrivateRoute
                element={<ProductDetail />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/scan-qr"
            element={
              <PrivateRoute
                element={<QRScanPage />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />

          <Route
            path="/warehouses"
            element={
              <PrivateRoute
                element={<WarehouseInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/warehouse/:warehouseId"
            element={
              <PrivateRoute
                element={<WarehouseDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/create-warehouse"
            element={
              <PrivateRoute
                element={<CreateWarehouse />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/warehouse/:warehouseId/edit"
            element={
              <PrivateRoute
                element={<EditWarehouse />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/plants"
            element={
              <PrivateRoute
                element={<PlantInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/plant/:plantId"
            element={
              <PrivateRoute
                element={<PlantDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/create-plant"
            element={
              <PrivateRoute
                element={<CreatePlant />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/plant/:plantId/edit"
            element={
              <PrivateRoute
                element={<EditPlant />}
                allowedRoles={["c_admin"]}
              />
            }
          />

          <Route
            path="/lines"
            element={
              <PrivateRoute
                element={<LineInCompany />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/line/:lineId"
            element={
              <PrivateRoute
                element={<LineDetail />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/create-line"
            element={
              <PrivateRoute
                element={<CreateLine />}
                allowedRoles={["c_admin"]}
              />
            }
          />
          <Route
            path="/line/:lineId/edit"
            element={
              <PrivateRoute element={<EditLine />} allowedRoles={["c_admin"]} />
            }
          />

          <Route
            path="/boms"
            element={
              <PrivateRoute
                element={<BomInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/create-bom"
            element={
              <PrivateRoute
                element={<CreateBom />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/bom/:itemId"
            element={
              <PrivateRoute
                element={<BomDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/bom/:itemId/edit"
            element={
              <PrivateRoute
                element={<EditBom />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />

          <Route
            path="/mos"
            element={
              <PrivateRoute
                element={<MoInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/create-mo"
            element={
              <PrivateRoute
                element={<CreateMo />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/mo/:moId"
            element={
              <PrivateRoute
                element={<MoDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/mo/:moId/edit"
            element={
              <PrivateRoute
                element={<EditMo />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/manufacture-report"
            element={
              <PrivateRoute
                element={<ManufactureReport />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />

          <Route
            path="/stages"
            element={
              <PrivateRoute
                element={<StageInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/create-stage"
            element={
              <PrivateRoute
                element={<CreateStage />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/stage/:stageId"
            element={
              <PrivateRoute
                element={<StageDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />
          <Route
            path="/stage/:stageId/edit"
            element={
              <PrivateRoute
                element={<EditStage />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Sản xuất"]}
              />
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute
                element={<Inventory />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/check-inventory/:type/:id"
            element={
              <PrivateRoute
                element={<CheckInventory />}
                allowedRoles={["c_admin", "user"]}
              />
            }
          />
          <Route
            path="/inventory-count"
            element={
              <PrivateRoute
                element={<InventoryCount />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/create-inventory"
            element={
              <PrivateRoute
                element={<CreateInventory />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />

          <Route
            path="/issue-tickets"
            element={
              <PrivateRoute
                element={<ItInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/issue-ticket/:ticketId"
            element={
              <PrivateRoute
                element={<ItDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/issue-report"
            element={
              <PrivateRoute
                element={<IssueReport />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />

          <Route
            path="/receive-tickets"
            element={
              <PrivateRoute
                element={<RtInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/receive-ticket/:ticketId"
            element={
              <PrivateRoute
                element={<RtDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/receive-report"
            element={
              <PrivateRoute
                element={<ReceiveReport />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />

          <Route
            path="/transfer-tickets"
            element={
              <PrivateRoute
                element={<TtInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/transfer-ticket/:ticketId"
            element={
              <PrivateRoute
                element={<TtDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/transfer-ticket/:ticketId/edit"
            element={
              <PrivateRoute
                element={<EditTt />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />
          <Route
            path="/create-transfer-ticket"
            element={
              <PrivateRoute
                element={<CreateTt />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Kho"]}
              />
            }
          />

          <Route
            path="/supplier-search"
            element={
              <PrivateRoute
                element={<SupplierSearch />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/supplier/:supplierId"
            element={
              <PrivateRoute
                element={<SupplierDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />

          <Route
            path="/create-rfq"
            element={
              <PrivateRoute
                element={<CreateRfq />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/rfqs"
            element={
              <PrivateRoute
                element={<RfqInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/rfq/:rfqId"
            element={
              <PrivateRoute
                element={<RfqDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />

          <Route
            path="/supplier-rfqs"
            element={
              <PrivateRoute
                element={<RfqInSupplierCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/supplier-rfq/:rfqId"
            element={
              <PrivateRoute
                element={<SupplierRfqDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />

          <Route
            path="/create-quotation/:rfqId"
            element={
              <PrivateRoute
                element={<CreateQuotation />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/quotations"
            element={
              <PrivateRoute
                element={<QuotationInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/quotation/:rfqId"
            element={
              <PrivateRoute
                element={<QuotationDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />

          <Route
            path="/customer-quotations"
            element={
              <PrivateRoute
                element={<QuotationInCustomerCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/customer-quotation/:rfqId"
            element={
              <PrivateRoute
                element={<CustomerQuotationDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />

          <Route
            path="/create-po/:quotationId"
            element={
              <PrivateRoute
                element={<CreatePo />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/pos"
            element={
              <PrivateRoute
                element={<PoInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/po/:poId"
            element={
              <PrivateRoute
                element={<PoDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />
          <Route
            path="/purchase-report"
            element={
              <PrivateRoute
                element={<PurchaseReport />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Mua hàng"]}
              />
            }
          />

          <Route
            path="/supplier-pos"
            element={
              <PrivateRoute
                element={<PoInSupplierCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/supplier-po/:poId"
            element={
              <PrivateRoute
                element={<SupplierPoDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />

          <Route
            path="/create-so/:poId"
            element={
              <PrivateRoute
                element={<CreateSo />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/sos"
            element={
              <PrivateRoute
                element={<SoInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/so/:soId"
            element={
              <PrivateRoute
                element={<SoDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />
          <Route
            path="/sales-report"
            element={
              <PrivateRoute
                element={<SalesReport />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Bán hàng"]}
              />
            }
          />

          <Route
            path="/dos"
            element={
              <PrivateRoute
                element={<DoInCompany />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Vận chuyển"]}
              />
            }
          />
          <Route
            path="/do/:doId"
            element={
              <PrivateRoute
                element={<DoDetail />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Vận chuyển"]}
              />
            }
          />
          <Route
            path="/update-do-process/:doId"
            element={
              <PrivateRoute
                element={<UpdateDoProcess />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Vận chuyển"]}
              />
            }
          />
          <Route
            path="/do-process/:doId"
            element={
              <PrivateRoute
                element={<DoProcess />}
                allowedRoles={["c_admin", "user"]}
                allowedDepartments={["Quản trị", "Vận chuyển"]}
              />
            }
          />

          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
