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
const IssueTicketList = lazy(() => import('../pages/Warehouse/Tickets/IssueTicketList'));
const ReceiveTicketList = lazy(() => import('../pages/Warehouse/Tickets/ReceiveTicketList'));
const TransferTicketList = lazy(() => import('../pages/Warehouse/Tickets/TransferTicketList'));
const IssueTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/IssueTicketDetail'));
const ReceiveTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/ReceiveTicketDetail'));
const WarehouseList = lazy(() => import('../pages/Warehouse/Management/WarehouseList'));
const CreateWarehouse = lazy(() => import('../pages/Warehouse/Management/CreateWarehouse'));
const EditWarehouse = lazy(() => import('../pages/Warehouse/Management/EditWarehouse'));
const InventoryList = lazy(() => import('../pages/Warehouse/Inventory/InventoryList'));
const AddInventory = lazy(() => import('../pages/Warehouse/Inventory/AddInventory'));
const TransferTicketDetail = lazy(() => import('../pages/Warehouse/Tickets/TransferTicketDetail'));
const CreateTransferTicket = lazy(() => import('../pages/Warehouse/Tickets/CreateTransferTicket'));
const EditTransferTicket = lazy(() => import('../pages/Warehouse/Tickets/EditTransferTicket'));
const DeliveryList = lazy(() => import('../pages/Warehouse/Delivery/DeliveryList'));
const DeliveryDetail = lazy(() => import('../pages/Warehouse/Delivery/DeliveryDetail'));
const MyProfile = lazy(() => import('../pages/Profile/MyProfile'));

// Manufacturing Pages
const BomList = lazy(() => import('../pages/Manufacturing/Bom/BomList'));
const BomDetail = lazy(() => import('../pages/Manufacturing/Bom/BomDetail'));
const CreateBom = lazy(() => import('../pages/Manufacturing/Bom/CreateBom'));
const EditBom = lazy(() => import('../pages/Manufacturing/Bom/EditBom'));
const MoList = lazy(() => import('../pages/Manufacturing/Mo/MoList'));
const CreateMo = lazy(() => import('../pages/Manufacturing/Mo/CreateMo'));
const MoDetail = lazy(() => import('../pages/Manufacturing/Mo/MoDetail'));
const EditMo = lazy(() => import('../pages/Manufacturing/Mo/EditMo'));

// Stage Pages
const StageList = lazy(() => import('../pages/Manufacturing/Stage/StageList'));
const StageDetail = lazy(() => import('../pages/Manufacturing/Stage/StageDetail'));
const CreateStage = lazy(() => import('../pages/Manufacturing/Stage/CreateStage'));
const EditStage = lazy(() => import('../pages/Manufacturing/Stage/EditStage'));

// Check Inventory
const CheckInventory = lazy(() => import('../pages/Warehouse/Inventory/CheckInventory'));

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
 * Department Constants
 * - Quản trị: Full access to all features
 * - Mua, Bán hàng: Purchase and Sales management (RFQ, Quotation, PO, SO)
 * - Kho, Sản xuất, Vận chuyển: Warehouse, Manufacturing, Delivery
 */
const DEPT_ADMIN = 'Quản trị';
const DEPT_SALES = 'Mua, Bán hàng';
const DEPT_WAREHOUSE = 'Kho, Sản xuất, Vận chuyển';

// All departments (commonly used for shared pages)
const ALL_DEPARTMENTS = [DEPT_ADMIN, DEPT_SALES, DEPT_WAREHOUSE];

/**
 * Marketplace V2 Routes Configuration
 * Routes are protected by role and department
 */
const marketplaceV2Routes = [
  // ============ Common Routes (All Departments) ============

  // My Profile - All departments
  {
    path: '/marketplace-v2/my-profile',
    element: (
      <PrivateRoute
        element={withSuspense(MyProfile)()}
        allowedRoles={['user']}
        allowedDepartments={ALL_DEPARTMENTS}
      />
    ),
  },

  // ============ Purchase & Sales Routes ============
  // Department: "Mua, Bán hàng" and "Quản trị"

  // Dashboard (Mua, Bán hàng)
  {
    path: '/marketplace-v2/dashboard',
    element: (
      <PrivateRoute
        element={withSuspense(Dashboard)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // RFQ Detail
  {
    path: '/marketplace-v2/rfq/:id',
    element: (
      <PrivateRoute
        element={withSuspense(RfqDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // Quotation Detail
  {
    path: '/marketplace-v2/quotation/:id',
    element: (
      <PrivateRoute
        element={withSuspense(QuotationDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // Sales Orders List
  {
    path: '/marketplace-v2/sos',
    element: (
      <PrivateRoute
        element={withSuspense(SoList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // Sales Order Detail
  {
    path: '/marketplace-v2/so/:id',
    element: (
      <PrivateRoute
        element={withSuspense(SoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // RFQ List - Purchasing
  {
    path: '/marketplace-v2/rfqs',
    element: (
      <PrivateRoute
        element={withSuspense(RfqList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // Quotations received - Purchasing
  {
    path: '/marketplace-v2/customer-quotations',
    element: (
      <PrivateRoute
        element={withSuspense(QuotationList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // PO List - Purchasing
  {
    path: '/marketplace-v2/pos',
    element: (
      <PrivateRoute
        element={withSuspense(PoList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_SALES]}
      />
    ),
  },

  // ============ Warehouse, Manufacturing, Delivery Routes ============
  // Department: "Kho, Sản xuất, Vận chuyển" and "Quản trị"

  // Warehouse Dashboard
  {
    path: '/marketplace-v2/warehouse',
    element: (
      <PrivateRoute
        element={withSuspense(WarehouseDashboard)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },
  {
    path: '/marketplace-v2/warehouse/management/create',
    element: (
      <PrivateRoute
        element={withSuspense(CreateWarehouse)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },
  {
    path: '/marketplace-v2/warehouse/management/edit/:id',
    element: (
      <PrivateRoute
        element={withSuspense(EditWarehouse)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Delivery List
  {
    path: '/marketplace-v2/warehouse/delivery',
    element: (
      <PrivateRoute
        element={withSuspense(DeliveryList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Delivery Detail
  {
    path: '/marketplace-v2/warehouse/delivery/:doId',
    element: (
      <PrivateRoute
        element={withSuspense(DeliveryDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE, DEPT_SALES]}
      />
    ),
  },

  // Issue Ticket List
  {
    path: '/marketplace-v2/warehouse/issue-tickets',
    element: (
      <PrivateRoute
        element={withSuspense(IssueTicketList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Receive Ticket List
  {
    path: '/marketplace-v2/warehouse/receive-tickets',
    element: (
      <PrivateRoute
        element={withSuspense(ReceiveTicketList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Transfer Ticket List
  {
    path: '/marketplace-v2/warehouse/transfer-tickets',
    element: (
      <PrivateRoute
        element={withSuspense(TransferTicketList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
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
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Edit Transfer Ticket
  {
    path: '/marketplace-v2/warehouse/edit-transfer/:id',
    element: (
      <PrivateRoute
        element={withSuspense(EditTransferTicket)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // ============ Manufacturing Routes ============
  // Department: "Kho, Sản xuất, Vận chuyển" and "Quản trị"

  // BOM List
  {
    path: '/marketplace-v2/boms',
    element: (
      <PrivateRoute
        element={withSuspense(BomList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // BOM Detail
  {
    path: '/marketplace-v2/bom/:itemId',
    element: (
      <PrivateRoute
        element={withSuspense(BomDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Create BOM
  {
    path: '/marketplace-v2/bom/create',
    element: (
      <PrivateRoute
        element={withSuspense(CreateBom)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Edit BOM
  {
    path: '/marketplace-v2/bom/:itemId/edit',
    element: (
      <PrivateRoute
        element={withSuspense(EditBom)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // MO List
  {
    path: '/marketplace-v2/mos',
    element: (
      <PrivateRoute
        element={withSuspense(MoList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Create MO
  {
    path: '/marketplace-v2/mo/create',
    element: (
      <PrivateRoute
        element={withSuspense(CreateMo)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Check Inventory (supports: mo, tt, po) - Shared between departments
  {
    path: '/marketplace-v2/check-inventory/:type/:id',
    element: (
      <PrivateRoute
        element={withSuspense(CheckInventory)()}
        allowedRoles={['user']}
        allowedDepartments={ALL_DEPARTMENTS}
      />
    ),
  },

  // MO Detail
  {
    path: '/marketplace-v2/mo/:moId',
    element: (
      <PrivateRoute
        element={withSuspense(MoDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Edit MO
  {
    path: '/marketplace-v2/mo/:moId/edit',
    element: (
      <PrivateRoute
        element={withSuspense(EditMo)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // ============ Stage (Manufacturing Process) Routes ============
  // Department: "Kho, Sản xuất, Vận chuyển" and "Quản trị"

  // Stage List
  {
    path: '/marketplace-v2/stages',
    element: (
      <PrivateRoute
        element={withSuspense(StageList)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Create Stage
  {
    path: '/marketplace-v2/stage/create',
    element: (
      <PrivateRoute
        element={withSuspense(CreateStage)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Stage Detail
  {
    path: '/marketplace-v2/stage/:stageId',
    element: (
      <PrivateRoute
        element={withSuspense(StageDetail)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },

  // Edit Stage
  {
    path: '/marketplace-v2/stage/:stageId/edit',
    element: (
      <PrivateRoute
        element={withSuspense(EditStage)()}
        allowedRoles={['user']}
        allowedDepartments={[DEPT_ADMIN, DEPT_WAREHOUSE]}
      />
    ),
  },
];

export default marketplaceV2Routes;
