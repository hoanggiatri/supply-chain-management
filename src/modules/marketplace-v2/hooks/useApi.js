import * as CompanyService from '@/services/general/CompanyService';
import * as ItemService from '@/services/general/ItemService';
import * as ProductService from '@/services/general/ProductService';
import * as WarehouseService from '@/services/general/WarehouseService';
import * as InventoryService from '@/services/inventory/InventoryService';
import * as IssueTicketService from '@/services/inventory/IssueTicketService';
import * as ReceiveTicketService from '@/services/inventory/ReceiveTicketService';
import * as TransferTicketService from '@/services/inventory/TransferTicketService';
import * as PoService from '@/services/purchasing/PoService';
import * as RfqService from '@/services/purchasing/RfqService';
import * as QuotationService from '@/services/sale/QuotationService';
import * as SoService from '@/services/sale/SoService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Helper to get auth data from localStorage
const getAuthData = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    // companyId is stored as a separate key in localStorage
    const companyId = localStorage.getItem('companyId') || user?.companyId || user?.company?.id || null;

    return { user, token, companyId };
  } catch {
    return { user: null, token: null, companyId: null };
  }
};

// ============ RFQ Hooks ============

/**
 * Get all RFQs in company (for Mua hàng department)
 */
export const useRfqsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();
  return useQuery({
    queryKey: ['rfqs', 'company', companyId],
    queryFn: async () => {
      const data = await RfqService.getAllRfqsInCompany(companyId, token);
      return data;
    },
    enabled: !!companyId && !!token,
    staleTime: 0, // Force fresh data
    cacheTime: 0, // No cache
    ...options,
  });
};

/**
 * Get all RFQs requested to company (for Bán hàng department)
 */
export const useRfqsInRequestedCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['rfqs', 'requested', companyId],
    queryFn: () => RfqService.getAllRfqsInRequestedCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get RFQ by ID
 */
export const useRfqById = (rfqId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['rfq', rfqId],
    queryFn: () => RfqService.getRfqById(rfqId, token),
    enabled: !!rfqId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Create RFQ mutation
 */
export const useCreateRfq = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (rfqData) => RfqService.createRfq(rfqData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
    },
  });
};

/**
 * Update RFQ status mutation
 */
export const useUpdateRfqStatus = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ rfqId, status }) => RfqService.updateRfqStatus(rfqId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      queryClient.invalidateQueries({ queryKey: ['rfq'] });
    },
  });
};

// ============ PO Hooks ============

/**
 * Get all POs in company (for Mua hàng department)
 */
export const usePosInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['pos', 'company', companyId],
    queryFn: () => PoService.getAllPosInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get all POs from supplier company (for Bán hàng department)
 */
export const usePosInSupplierCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['pos', 'supplier', companyId],
    queryFn: () => PoService.getAllPosInSupplierCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get PO by ID
 */
export const usePoById = (poId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['po', poId],
    queryFn: () => PoService.getPoById(poId, token),
    enabled: !!poId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Create PO mutation
 */
export const useCreatePo = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (poData) => PoService.createPo(poData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos'] });
    },
  });
};

/**
 * Update PO status mutation
 */
export const useUpdatePoStatus = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ poId, status }) => PoService.updatePoStatus(poId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos'] });
      queryClient.invalidateQueries({ queryKey: ['po'] });
    },
  });
};

/**
 * Get monthly purchase report for dashboard charts
 */
export const useMonthlyPurchaseReport = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['purchase-report', 'monthly', companyId],
    queryFn: () => PoService.getMonthlyPurchaseReport(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// ============ Quotation Hooks ============

/**
 * Get all quotations in company (for Bán hàng department - sent quotations)
 */
export const useQuotationsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['quotations', 'company', companyId],
    queryFn: () => QuotationService.getAllQuotationsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get all quotations in request company (for Mua hàng department - received quotations)
 */
export const useQuotationsInRequestCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['quotations', 'requested', companyId],
    queryFn: () => QuotationService.getAllQuotationsInRequestCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get quotation by ID
 */
export const useQuotationById = (quotationId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => QuotationService.getQuotationById(quotationId, token),
    enabled: !!quotationId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Get quotation by RFQ ID
 */
export const useQuotationByRfq = (rfqId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['quotation', 'rfq', rfqId],
    queryFn: () => QuotationService.getQuotationByRfq(rfqId, token),
    enabled: !!rfqId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Create quotation mutation
 */
export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (quotationData) => QuotationService.createQuotation(quotationData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

/**
 * Update quotation status mutation
 */
export const useUpdateQuotationStatus = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ quotationId, status }) => QuotationService.updateQuotationStatus(quotationId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation'] });
    },
  });
};

// ============ SO Hooks ============

/**
 * Get all SOs in company (for Bán hàng department)
 */
export const useSosInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['sos', 'company', companyId],
    queryFn: () => SoService.getAllSosInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000,
    ...options,
  });
};

/**
 * Get SO by ID
 */
export const useSoById = (soId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['so', soId],
    queryFn: () => SoService.getSoById(soId, token),
    enabled: !!soId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Get SO by PO ID
 */
export const useSoByPoId = (poId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['so', 'po', poId],
    queryFn: () => SoService.getSoByPoId(poId, token),
    enabled: !!poId && !!token,
    staleTime: 60 * 1000,
    ...options,
  });
};

/**
 * Create SO mutation
 */
export const useCreateSo = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (soData) => SoService.createSo(soData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos'] });
    },
  });
};

/**
 * Update SO status mutation
 */
export const useUpdateSoStatus = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ soId, status }) => SoService.updateSoStatus(soId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos'] });
      queryClient.invalidateQueries({ queryKey: ['so'] });
    },
  });
};

/**
 * Get monthly sales report for dashboard charts
 */
export const useMonthlySalesReport = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['sales-report', 'monthly', companyId],
    queryFn: () => SoService.getMonthlySalesReport(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============ Company Hooks ============

/**
 * Get all companies (for supplier selection)
 */
export const useCompanies = (options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyService.getAllCompanies(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get company by ID
 */
export const useCompanyById = (companyId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => CompanyService.getCompanyById(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============ Product Hooks ============

/**
 * Get all items in company (using ItemService)
 */
export const useProducts = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['items', companyId],
    queryFn: () => ItemService.getAllItemsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Get all items in a specific company by companyId
 * Used to fetch items from supplier company
 */
export const useItemsByCompany = (targetCompanyId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['items', targetCompanyId],
    queryFn: () => ItemService.getAllItemsInCompany(targetCompanyId, token),
    enabled: !!targetCompanyId && !!token,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Get product by ID
 */
export const useProductById = (productId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductService.getProductById(productId, token),
    enabled: !!productId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============ Warehouse Hooks ============

/**
 * Get all warehouses in company
 */
export const useWarehousesInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['warehouses', 'company', companyId],
    queryFn: () => WarehouseService.getAllWarehousesInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Get warehouse by ID
 */
export const useWarehouseById = (warehouseId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['warehouse', warehouseId],
    queryFn: () => WarehouseService.getWarehouseById(warehouseId, token),
    enabled: !!warehouseId && !!token,
    staleTime: 0,
    ...options,
  });
};

/**
 * Create warehouse
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  const { companyId, token } = getAuthData();

  return useMutation({
    mutationFn: (warehouseData) => WarehouseService.createWarehouse(companyId, warehouseData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};

/**
 * Update warehouse
 */
export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ warehouseId, data }) => WarehouseService.updateWarehouse(warehouseId, data, token),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', variables.warehouseId] });
    },
  });
};

// ============ Inventory Hooks ============

/**
 * Get all inventory in company
 */
export const useInventoryInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['inventory', 'company', companyId],
    queryFn: () => InventoryService.getAllInventory(0, 0, companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
};

/**
 * Get all items in company
 */
export const useItemsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['items', 'company', companyId],
    queryFn: () => ItemService.getAllItemsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Update inventory (edit quantity)
 */
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ inventoryId, data }) => InventoryService.updateInventory(inventoryId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (data) => InventoryService.createInventory(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

/**
 * Get all issue tickets in company
 */
export const useIssueTicketsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['issueTickets', 'company', companyId],
    queryFn: () => IssueTicketService.getAllIssueTicketsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 0,
    cacheTime: 0,
    ...options,
  });
};

/**
 * Get issue ticket by ID
 */
export const useIssueTicketById = (ticketId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['issueTicket', ticketId],
    queryFn: () => IssueTicketService.getIssueTicketById(ticketId, token),
    enabled: !!ticketId && !!token,
    staleTime: 0,
    ...options,
  });
};

/**
 * Update issue ticket status
 */
export const useUpdateIssueTicketStatus = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ ticketId, request }) => IssueTicketService.updateIssueTicketStatus(ticketId, request, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issueTickets'] });
      queryClient.invalidateQueries({ queryKey: ['issueTicket'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

/**
 * Get monthly issue report
 */
export const useMonthlyIssueReport = (issueType = 'Tất cả', warehouseId = 0, options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['issueReport', 'monthly', companyId, issueType, warehouseId],
    queryFn: () => IssueTicketService.getMonthlyIssueReport(companyId, issueType, warehouseId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============ Receive Ticket Hooks ============

/**
 * Get all receive tickets in company
 */
export const useReceiveTicketsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['receiveTickets', 'company', companyId],
    queryFn: () => ReceiveTicketService.getAllReceiveTicketsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 0,
    cacheTime: 0,
    ...options,
  });
};

/**
 * Get receive ticket by ID
 */
export const useReceiveTicketById = (ticketId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['receiveTicket', ticketId],
    queryFn: () => ReceiveTicketService.getReceiveTicketById(ticketId, token),
    enabled: !!ticketId && !!token,
    staleTime: 0,
    ...options,
  });
};

/**
 * Update receive ticket
 */
export const useUpdateReceiveTicket = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ ticketId, request }) => ReceiveTicketService.updateReceiveTicket(ticketId, request, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receiveTickets'] });
      queryClient.invalidateQueries({ queryKey: ['receiveTicket'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

/**
 * Get monthly receive report
 */
export const useMonthlyReceiveReport = (receiveType = 'Tất cả', warehouseId = 0, options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['receiveReport', 'monthly', companyId, receiveType, warehouseId],
    queryFn: () => ReceiveTicketService.getMonthlyReceiveReport(companyId, receiveType, warehouseId, token),
    enabled: !!companyId && !!token,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============ Transfer Ticket Hooks ============

/**
 * Get all transfer tickets in company
 */
export const useTransferTicketsInCompany = (options = {}) => {
  const { companyId, token } = getAuthData();

  return useQuery({
    queryKey: ['transferTickets', 'company', companyId],
    queryFn: () => TransferTicketService.getAllTransferTicketsInCompany(companyId, token),
    enabled: !!companyId && !!token,
    staleTime: 0,
    cacheTime: 0,
    ...options,
  });
};

/**
 * Get transfer ticket by ID
 */
export const useTransferTicketById = (ticketId, options = {}) => {
  const { token } = getAuthData();

  return useQuery({
    queryKey: ['transferTicket', ticketId],
    queryFn: () => TransferTicketService.getTransferTicketById(ticketId, token),
    enabled: !!ticketId && !!token,
    staleTime: 0,
    ...options,
  });
};

/**
 * Create transfer ticket
 */
export const useCreateTransferTicket = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: (request) => TransferTicketService.createTransferTicket(request, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferTickets'] });
    },
  });
};

/**
 * Update transfer ticket
 */
export const useUpdateTransferTicket = () => {
  const queryClient = useQueryClient();
  const { token } = getAuthData();

  return useMutation({
    mutationFn: ({ ticketId, request }) => TransferTicketService.updateTransferTicket(ticketId, request, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transferTickets'] });
      queryClient.invalidateQueries({ queryKey: ['transferTicket'] });
      queryClient.invalidateQueries({ queryKey: ['issueTickets'] });
      queryClient.invalidateQueries({ queryKey: ['receiveTickets'] });
    },
  });
};
