import PrivateRoute from "../PrivateRoute";

import RfqInSupplierCompany from "@/pages/sale/supplier-rfq/RfqInSupplierCompany";
import SupplierRfqDetail from "@/pages/sale/supplier-rfq/SupplierRfqDetail";

import CreateQuotation from "@/pages/sale/quotation/CreateQuotation";
import QuotationDetail from "@/pages/sale/quotation/QuotationDetail";
import QuotationInCompany from "@/pages/sale/quotation/QuotationInCompany";

import PoInSupplierCompany from "@/pages/sale/supplier-po/PoInSupplierCompany";
import SupplierPoDetail from "@/pages/sale/supplier-po/SupplierPoDetail";

import CreateSo from "@/pages/sale/so/CreateSo";
import SoInCompany from "@/pages/sale/so/SoInCompany";
import SoDetail from "@/pages/sale/so/SoDetail";
import SalesReport from "@/pages/sale/so/SalesReport";

const salesRoutes = [
  {
    path: "/supplier-rfqs",
    element: (
      <PrivateRoute
        element={<RfqInSupplierCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/supplier-rfq/:rfqId",
    element: (
      <PrivateRoute
        element={<SupplierRfqDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/create-quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<CreateQuotation />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/quotations",
    element: (
      <PrivateRoute
        element={<QuotationInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<QuotationDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/supplier-pos",
    element: (
      <PrivateRoute
        element={<PoInSupplierCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/supplier-po/:poId",
    element: (
      <PrivateRoute
        element={<SupplierPoDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/create-so/:poId",
    element: (
      <PrivateRoute
        element={<CreateSo />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/sos",
    element: (
      <PrivateRoute
        element={<SoInCompany />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/so/:soId",
    element: (
      <PrivateRoute
        element={<SoDetail />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
  {
    path: "/sales-report",
    element: (
      <PrivateRoute
        element={<SalesReport />}
        allowedRoles={["c_admin", "user"]}
        allowedDepartments={["Quản trị", "Bán hàng"]}
      />
    ),
  },
];

export default salesRoutes;

