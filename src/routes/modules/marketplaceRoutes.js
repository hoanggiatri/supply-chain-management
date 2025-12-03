import PrivateRoute from "../PrivateRoute";

// Marketplace - Purchasing (Mua hàng)
import RfqMarketplace from "@/pages/marketplace/rfq/RfqMarketplace";
import RfqDetailMarketplace from "@/pages/marketplace/rfq/RfqDetailMarketplace";
import CustomerQuotationMarketplace from "@/pages/marketplace/quotation/CustomerQuotationMarketplace";
import CustomerQuotationDetailMarketplace from "@/pages/marketplace/quotation/CustomerQuotationDetailMarketplace";
import PoMarketplace from "@/pages/marketplace/po/PoMarketplace";
import PoDetailMarketplace from "@/pages/marketplace/po/PoDetailMarketplace";

// Marketplace - Sales (Bán hàng)
import SupplierRfqMarketplace from "@/pages/marketplace/rfq/SupplierRfqMarketplace";
import SupplierRfqDetailMarketplace from "@/pages/marketplace/rfq/SupplierRfqDetailMarketplace";
import QuotationMarketplace from "@/pages/marketplace/quotation/QuotationMarketplace";
import QuotationDetailMarketplace from "@/pages/marketplace/quotation/QuotationDetailMarketplace";
import SupplierPoMarketplace from "@/pages/marketplace/po/SupplierPoMarketplace";
import SupplierPoDetailMarketplace from "@/pages/marketplace/po/SupplierPoDetailMarketplace";
import SoMarketplace from "@/pages/marketplace/so/SoMarketplace";
import SoDetailMarketplace from "@/pages/marketplace/so/SoDetailMarketplace";

// Shared pages (existing)
import SupplierSearch from "@/pages/purchasing/supplier/SupplierSearch";
import SupplierDetail from "@/pages/purchasing/supplier/SupplierDetail";
import CreateRfq from "@/pages/purchasing/rfq/CreateRfq";
import CreatePo from "@/pages/purchasing/po/CreatePo";
import CreateQuotation from "@/pages/sale/quotation/CreateQuotation";
import CreateSo from "@/pages/sale/so/CreateSo";
import MyProfile from "@/pages/general/user/MyProfile";
import Dashboard from "@/pages/marketplace/Dashboard";

/**
 * Marketplace Routes - Card-based UI for purchasing and sales
 * Only accessible by 'user' role with appropriate department
 */
const marketplaceRoutes = [
  // ==========================================
  // SHARED ROUTES (Both departments)
  // ==========================================
  {
    path: "/marketplace/dashboard",
    element: (
      <PrivateRoute
        element={<Dashboard />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng", "Bán hàng"]}
      />
    ),
  },

  {
    path: "/my-profile",
    element: (
      <PrivateRoute
        element={<MyProfile />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng", "Bán hàng"]}
      />
    ),
  },

  // ==========================================
  // PURCHASING DEPARTMENT ROUTES (Mua hàng)
  // ==========================================

  // Supplier Search
  {
    path: "/supplier-search",
    element: (
      <PrivateRoute
        element={<SupplierSearch />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },
  {
    path: "/supplier/:supplierId",
    element: (
      <PrivateRoute
        element={<SupplierDetail />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // Create RFQ
  {
    path: "/create-rfq",
    element: (
      <PrivateRoute
        element={<CreateRfq />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // Create PO
  {
    path: "/create-po/:quotationId",
    element: (
      <PrivateRoute
        element={<CreatePo />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // RFQ - Yêu cầu báo giá (tạo và quản lý)
  {
    path: "/marketplace/rfqs",
    element: (
      <PrivateRoute
        element={<RfqMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/rfq/:rfqId",
    element: (
      <PrivateRoute
        element={<RfqDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // Customer Quotation - Báo giá từ NCC (xem và xử lý)
  {
    path: "/marketplace/customer-quotations",
    element: (
      <PrivateRoute
        element={<CustomerQuotationMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/customer-quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<CustomerQuotationDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // PO - Đơn mua hàng (quản lý)
  {
    path: "/marketplace/pos",
    element: (
      <PrivateRoute
        element={<PoMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/po/:poId",
    element: (
      <PrivateRoute
        element={<PoDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Mua hàng"]}
      />
    ),
  },

  // ==========================================
  // SALES DEPARTMENT ROUTES (Bán hàng)
  // ==========================================

  // Create Quotation
  {
    path: "/create-quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<CreateQuotation />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },

  // Create SO
  {
    path: "/create-so/:poId",
    element: (
      <PrivateRoute
        element={<CreateSo />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },

  // Supplier RFQ - Yêu cầu báo giá từ khách hàng
  {
    path: "/marketplace/supplier-rfqs",
    element: (
      <PrivateRoute
        element={<SupplierRfqMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/supplier-rfq/:rfqId",
    element: (
      <PrivateRoute
        element={<SupplierRfqDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },

  // Quotation - Báo giá (tạo và quản lý)
  {
    path: "/marketplace/quotations",
    element: (
      <PrivateRoute
        element={<QuotationMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/quotation/:rfqId",
    element: (
      <PrivateRoute
        element={<QuotationDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },

  // Supplier PO - Đơn đặt hàng từ khách hàng
  {
    path: "/marketplace/supplier-pos",
    element: (
      <PrivateRoute
        element={<SupplierPoMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/supplier-po/:poId",
    element: (
      <PrivateRoute
        element={<SupplierPoDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },

  // SO - Đơn bán hàng (quản lý)
  {
    path: "/marketplace/sos",
    element: (
      <PrivateRoute
        element={<SoMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },
  {
    path: "/marketplace/so/:soId",
    element: (
      <PrivateRoute
        element={<SoDetailMarketplace />}
        allowedRoles={["user"]}
        allowedDepartments={["Bán hàng"]}
      />
    ),
  },
];

export default marketplaceRoutes;

