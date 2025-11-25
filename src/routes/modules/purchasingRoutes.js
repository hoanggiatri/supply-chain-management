import PrivateRoute from "../PrivateRoute";

import SupplierSearch from "@/pages/purchasing/supplier/SupplierSearch";
import SupplierDetail from "@/pages/purchasing/supplier/SupplierDetail";

import CreateRfq from "@/pages/purchasing/rfq/CreateRfq";
import RfqInCompany from "@/pages/purchasing/rfq/RfqInCompany";
import RfqDetail from "@/pages/purchasing/rfq/RfqDetail";

import QuotationInCustomerCompany from "@/pages/purchasing/customer-quotation/QuotationInCustomerCompany";
import CustomerQuotationDetail from "@/pages/purchasing/customer-quotation/CustomerQuotationDetail";

import CreatePo from "@/pages/purchasing/po/CreatePo";
import PoInCompany from "@/pages/purchasing/po/PoInCompany";
import PoDetail from "@/pages/purchasing/po/PoDetail";
import PurchaseReport from "@/pages/purchasing/po/PurchaseReport";

const purchasingRoutes = [
  {
    path: "/supplier-search",
    element: (
      <PrivateRoute
        element={<SupplierSearch />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/supplier/:supplierId",
    element: (
      <PrivateRoute
        element={<SupplierDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/create-rfq",
    element: (
      <PrivateRoute
        element={<CreateRfq />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/rfqs",
    element: (
      <PrivateRoute
        element={<RfqInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/rfq/:rfqId",
    element: (
      <PrivateRoute
        element={<RfqDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/customer-quotations",
    element: (
      <PrivateRoute
        element={<QuotationInCustomerCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/customer-quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<CustomerQuotationDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/create-po/:quotationId",
    element: (
      <PrivateRoute
        element={<CreatePo />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/pos",
    element: (
      <PrivateRoute
        element={<PoInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/po/:poId",
    element: (
      <PrivateRoute
        element={<PoDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
  {
    path: "/purchase-report",
    element: (
      <PrivateRoute
        element={<PurchaseReport />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Mua hàng"]}
      />
    ),
  },
];

export default purchasingRoutes;

