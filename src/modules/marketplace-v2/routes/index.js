import PrivateRoute from '@/routes/PrivateRoute';
import { lazy, Suspense } from 'react';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const OrderList = lazy(() => import('../pages/Orders'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const RfqList = lazy(() => import('../pages/PurchaseManagement/Rfq/RfqList'));
const RfqDetail = lazy(() => import('../pages/PurchaseManagement/Rfq/RfqDetail'));
const QuotationList = lazy(() => import('../pages/PurchaseManagement/Quotation/QuotationList'));
const QuotationDetail = lazy(() => import('../pages/PurchaseManagement/Quotation/QuotationDetail'));
const PoList = lazy(() => import('../pages/PurchaseManagement/Po/PoList'));
const PoDetail = lazy(() => import('../pages/PurchaseManagement/Po/PoDetail'));
const CreatePo = lazy(() => import('../pages/PurchaseManagement/Po/CreatePo'));
const CreateFormWizard = lazy(() => import('../pages/CreateForm'));
const Suppliers = lazy(() => import('../pages/PurchaseManagement/Supplier/Suppliers'));
const SupplierDetail = lazy(() => import('../pages/PurchaseManagement/Supplier/SupplierDetail'));
const Report = lazy(() => import('../pages/PurchaseManagement/Report'));
const CustomerRfqList = lazy(() => import('../pages/SalesManagement/CustomerRfq/CustomerRfqList'));
const CustomerRfqDetail = lazy(() => import('../pages/SalesManagement/CustomerRfq/CustomerRfqDetail'));
const SentQuotationList = lazy(() => import('../pages/SalesManagement/Quotation/SentQuotationList'));
const SentQuotationDetail = lazy(() => import('../pages/SalesManagement/Quotation/SentQuotationDetail'));
const CreateQuotation = lazy(() => import('../pages/SalesManagement/Quotation/CreateQuotation'));
const CustomerPoList = lazy(() => import('../pages/SalesManagement/CustomerPo/CustomerPoList'));
const CustomerPoDetail = lazy(() => import('../pages/SalesManagement/CustomerPo/CustomerPoDetail'));
const SoList = lazy(() => import('../pages/SalesManagement/So/SoList'));
const SoDetail = lazy(() => import('../pages/SalesManagement/So/SoDetail'));
const CreateSo = lazy(() => import('../pages/SalesManagement/So/CreateSo'));

// Warehouse Pages
const WarehouseDashboard = lazy(() => import('../pages/Warehouse/Dashboard/WarehouseDashboard'));
const TicketList = lazy(() => import('../pages/Warehouse/Tickets/TicketList'));
const IssueTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/IssueTicketDetail'));
const ReceiveTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/ReceiveTicketDetail'));
const WarehouseList = lazy(() => import('../pages/Warehouse/Management/WarehouseList'));
const CreateWarehouse = lazy(() => import('../pages/Warehouse/Management/CreateWarehouse'));
const EditWarehouse = lazy(() => import('../pages/Warehouse/Management/EditWarehouse'));
const InventoryList = lazy(() => import('../pages/Warehouse/Inventory/InventoryList'));
const AddInventory = lazy(() => import('../pages/Warehouse/Inventory/AddInventory'));
const TransferTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/TransferTicketDetail'));
const CreateTransferTicket = lazy(() => import('../pages/Warehouse/Tickets/CreateTransferTicket'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p style={{ color: 'var(--mp-text-secondary)' }}>Đang tải...</p>
    </div>
  </div>
);

// Wrap component with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

/**
 * Marketplace V2 Routes Configuration
 * All routes are protected and require 'user' role with Mua hàng/Bán hàng department
 */
const marketplaceV2Routes = [
  // Dashboard
  {
    path: '/marketplace-v2/dashboard',
    element: (
      <PrivateRoute
        element={withSuspense(Dashboard)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Suppliers List
  {
    path: '/marketplace-v2/suppliers',
    element: (
      <PrivateRoute
        element={withSuspense(Suppliers)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Supplier Detail
  {
    path: '/marketplace-v2/supplier/:id',
    element: (
      <PrivateRoute
        element={withSuspense(SupplierDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Purchase Report
  {
    path: '/marketplace-v2/purchase-report',
    element: (
      <PrivateRoute
        element={withSuspense(Report)({ type: 'purchase' })}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sales Report
  {
    path: '/marketplace-v2/sales-report',
    element: (
      <PrivateRoute
        element={withSuspense(Report)({ type: 'sales' })}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Create RFQ - Purchasing
  {
    path: '/marketplace-v2/create-rfq',
    element: (
      <PrivateRoute
        element={withSuspense(CreateFormWizard)({ type: 'rfq' })}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Create Quotation - Sales
  {
    path: '/marketplace-v2/create-quotation',
    element: (
      <PrivateRoute
        element={withSuspense(CreateFormWizard)({ type: 'quotation' })}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },



  // Order Detail - RFQ (uses dedicated RfqDetail component)
  {
    path: '/marketplace-v2/rfq/:id',
    element: (
      <PrivateRoute
        element={withSuspense(RfqDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Order Detail - Quotation (uses dedicated QuotationDetail component)
  {
    path: '/marketplace-v2/quotation/:id',
    element: (
      <PrivateRoute
        element={withSuspense(QuotationDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sales Orders - Sales
  {
    path: '/marketplace-v2/sos',
    element: (
      <PrivateRoute
        element={withSuspense(SoList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sales Order Detail - Sales
  {
    path: '/marketplace-v2/so/:id',
    element: (
      <PrivateRoute
        element={withSuspense(SoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // RFQ List - Purchasing (uses dedicated RfqList component)
  {
    path: '/marketplace-v2/rfqs',
    element: (
      <PrivateRoute
        element={withSuspense(RfqList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Quotations received - Purchasing (uses dedicated QuotationList component)
  {
    path: '/marketplace-v2/customer-quotations',
    element: (
      <PrivateRoute
        element={withSuspense(QuotationList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // PO List - Purchasing (uses dedicated PoList component)
  {
    path: '/marketplace-v2/pos',
    element: (
      <PrivateRoute
        element={withSuspense(PoList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // PO Detail - Purchasing
  {
    path: '/marketplace-v2/po/:id',
    element: (
      <PrivateRoute
        element={withSuspense(PoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Create PO - from Quotation
  {
    path: '/marketplace-v2/create-po/:quotationId',
    element: (
      <PrivateRoute
        element={withSuspense(CreatePo)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // RFQ from customers - Sales  
  {
    path: '/marketplace-v2/supplier-rfqs',
    element: (
      <PrivateRoute
        element={withSuspense(CustomerRfqList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Customer RFQ Detail - Sales
  {
    path: '/marketplace-v2/supplier-rfq/:id',
    element: (
      <PrivateRoute
        element={withSuspense(CustomerRfqDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Create Quotation from RFQ - Sales
  {
    path: '/marketplace-v2/sales/create-quotation/:rfqId',
    element: (
      <PrivateRoute
        element={withSuspense(CreateQuotation)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Quotations sent - Sales
  {
    path: '/marketplace-v2/sent-quotations',
    element: (
      <PrivateRoute
        element={withSuspense(SentQuotationList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sent Quotation Detail - Sales
  {
    path: '/marketplace-v2/sent-quotation/:id',
    element: (
      <PrivateRoute
        element={withSuspense(SentQuotationDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // PO from customers - Sales
  {
    path: '/marketplace-v2/customer-pos',
    element: (
      <PrivateRoute
        element={withSuspense(CustomerPoList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Customer PO Detail - Sales
  {
    path: '/marketplace-v2/customer-po/:id',
    element: (
      <PrivateRoute
        element={withSuspense(CustomerPoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sales Orders - Sales
  {
    path: '/marketplace-v2/sos',
    element: (
      <PrivateRoute
        element={withSuspense(SoList)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Sales Order Detail - Sales
  {
    path: '/marketplace-v2/so/:id',
    element: (
      <PrivateRoute
        element={withSuspense(SoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // Create Sales Order - Sales
  {
    path: '/marketplace-v2/create-so/:poId',
    element: (
      <PrivateRoute
        element={withSuspense(CreateSo)()}
        allowedRoles={['user']}
        allowedDepartments={['Mua hàng', 'Bán hàng']}
      />
    ),
  },

  // ============ Warehouse Routes ============

  // Warehouse Dashboard
  {
    path: '/marketplace-v2/warehouse',
    element: (
      <PrivateRoute
        element={withSuspense(WarehouseDashboard)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Warehouse Management
  {
    path: '/marketplace-v2/warehouse/management',
    element: (
      <PrivateRoute
        element={withSuspense(WarehouseList)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },
  {
    path: '/marketplace-v2/warehouse/management/create',
    element: (
      <PrivateRoute
        element={withSuspense(CreateWarehouse)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },
  {
    path: '/marketplace-v2/warehouse/management/edit/:id',
    element: (
      <PrivateRoute
        element={withSuspense(EditWarehouse)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Inventory Add
  {
    path: '/marketplace-v2/warehouse/inventory/add',
    element: (
      <PrivateRoute
        element={withSuspense(AddInventory)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Ticket List
  {
    path: '/marketplace-v2/warehouse/tickets',
    element: (
      <PrivateRoute
        element={withSuspense(TicketList)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Issue Ticket Detail
  {
    path: '/marketplace-v2/warehouse/issue-ticket/:id',
    element: (
      <PrivateRoute
        element={withSuspense(IssueTicketDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Receive Ticket Detail
  {
    path: '/marketplace-v2/warehouse/receive-ticket/:id',
    element: (
      <PrivateRoute
        element={withSuspense(ReceiveTicketDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Inventory List
  {
    path: '/marketplace-v2/warehouse/inventory',
    element: (
      <PrivateRoute
        element={withSuspense(InventoryList)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Transfer Ticket Detail
  {
    path: '/marketplace-v2/warehouse/transfer-ticket/:id',
    element: (
      <PrivateRoute
        element={withSuspense(TransferTicketDetail)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },

  // Create Transfer Ticket
  {
    path: '/marketplace-v2/warehouse/create-transfer',
    element: (
      <PrivateRoute
        element={withSuspense(CreateTransferTicket)()}
        allowedRoles={['user']}
        allowedDepartments={['Kho']}
      />
    ),
  },
];

export default marketplaceV2Routes;
