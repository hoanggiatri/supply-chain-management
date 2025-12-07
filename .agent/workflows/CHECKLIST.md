# 📋 Migration Checklist

Track your progress through the Shadcn/UI migration.

---

## Phase 1: Setup & Core Components ⏳

### 1.1 Install Shadcn/UI

- [ ] Install Tailwind CSS dependencies
- [ ] Install Shadcn/UI dependencies
- [ ] Run `npx shadcn-ui@latest init`
- [ ] Verify `components.json` created
- [ ] Verify `lib/utils.ts` created
- [ ] Test `cn()` utility function

### 1.2 Setup React Hook Form + Zod

- [ ] Install `react-hook-form`
- [ ] Install `@hookform/resolvers`
- [ ] Install `zod`
- [ ] Create `lib/form-utils.js`
- [ ] Test validation schemas

### 1.3 Create Base Form Components

- [ ] Install Shadcn form components
- [ ] Create `FormInput` wrapper
- [ ] Create `FormSelect` wrapper
- [ ] Create `FormCheckbox` wrapper
- [ ] Create `FormDatePicker` wrapper
- [ ] Create `FormTextarea` wrapper
- [ ] Test all form components

### 1.4 Setup Sonner Toast

- [ ] Install Sonner
- [ ] Add `<Toaster />` to App
- [ ] Create `toastService.js` wrapper
- [ ] Replace all `toastrService` imports
- [ ] Test toast notifications

### 1.5 Setup React Query

- [ ] Install `@tanstack/react-query`
- [ ] Install `@tanstack/react-query-devtools`
- [ ] Create `queryClient.js`
- [ ] Wrap App with `QueryClientProvider`
- [ ] Create example custom hook
- [ ] Test React Query DevTools

**Phase 1 Complete:** [ ]

---

## Phase 2: Common Components ⏳

### 2.1 DataTable Migration

- [ ] Install `@tanstack/react-table`
- [ ] Install Shadcn table components
- [ ] Create new `DataTable` component
- [ ] Create `table-helpers.jsx`
- [ ] Migrate `ItemInCompany` to use new DataTable
- [ ] Test sorting, filtering, pagination
- [ ] Remove old DataTable component

### 2.2 StatusSummaryCard

- [ ] Install Shadcn Card & Badge
- [ ] Create new `StatusSummaryCard`
- [ ] Migrate all pages using old component
- [ ] Test display and styling
- [ ] Remove old component

### 2.3 SelectAutocomplete → Combobox

- [ ] Install Shadcn Command & Popover
- [ ] Create `Combobox` component
- [ ] Migrate all pages using SelectAutocomplete
- [ ] Test search and selection
- [ ] Remove old component

### 2.4 ConfirmDialog → AlertDialog

- [ ] Install Shadcn AlertDialog
- [ ] Create new `ConfirmDialog`
- [ ] Migrate all pages using old dialog
- [ ] Test confirm/cancel actions
- [ ] Remove old component

### 2.5 LoadingPaper → Skeleton

- [ ] Install Shadcn Skeleton
- [ ] Create `TableSkeleton` component
- [ ] Create `CardSkeleton` component
- [ ] Migrate all loading states
- [ ] Test loading animations
- [ ] Remove old LoadingPaper

**Phase 2 Complete:** [ ]

---

## Phase 3: Product Module ⏳

### 3.1 Setup

- [ ] Create `useProducts` hook
- [ ] Create `useProduct` hook
- [ ] Test React Query integration

### 3.2 AllProducts Page

- [ ] Migrate page to Shadcn components
- [ ] Implement new DataTable
- [ ] Add loading skeleton
- [ ] Test search and navigation
- [ ] Remove old Material Tailwind imports

### 3.3 ProductDetail Page

- [ ] Install Shadcn Tabs & Separator
- [ ] Migrate page layout
- [ ] Implement tabs (Info, History)
- [ ] Add loading skeleton
- [ ] Test navigation and data display

### 3.4 ScanQR Page

- [ ] Install `react-qr-scanner`
- [ ] Create ScanQR page
- [ ] Implement camera access
- [ ] Add error handling
- [ ] Test QR scanning

### 3.5 ProductQRModal

- [ ] Install `qrcode.react`
- [ ] Install Shadcn Dialog
- [ ] Create ProductQRModal
- [ ] Implement download feature
- [ ] Test QR generation and download

### 3.6 QRScannerModal

- [ ] Create QRScannerModal
- [ ] Implement scanning logic
- [ ] Add error handling
- [ ] Test modal open/close
- [ ] Test QR parsing

**Phase 3 Complete:** [ ]

---

## Phase 4: Manufacturing Module ⏳

### 4.1 MO Pages

- [ ] Create `useMos` hook
- [ ] Migrate MoInCompany
- [ ] Migrate MoDetail
- [ ] Create MoForm with React Hook Form
- [ ] Test CRUD operations

### 4.2 BOM Pages

- [ ] Create `useBoms` hook
- [ ] Migrate BomInCompany
- [ ] Migrate BomDetail
- [ ] Test BOM display

### 4.3 Process Components

- [ ] Create ProcessCard component
- [ ] Implement timeline visualization
- [ ] Add stage indicators
- [ ] Test process flow display

**Phase 4 Complete:** [ ]

---

## Phase 5: Inventory Module ⏳

### 5.1 Inventory Overview

- [ ] Create `useInventory` hook
- [ ] Migrate Inventory page
- [ ] Add stock level indicators
- [ ] Implement low stock alerts

### 5.2 Receive Tickets

- [ ] Create `useReceiveTickets` hook
- [ ] Migrate RtInCompany
- [ ] Migrate RtDetail
- [ ] Test receiving process

### 5.3 Issue Tickets

- [ ] Create `useIssueTickets` hook
- [ ] Migrate ItInCompany
- [ ] Migrate ItDetail
- [ ] Test issue process

### 5.4 Transfer Tickets

- [ ] Create `useTransferTickets` hook
- [ ] Migrate TtInCompany
- [ ] Migrate TtDetail
- [ ] Migrate CreateTt form
- [ ] Test transfer process

**Phase 5 Complete:** [ ]

---

## Phase 6: Purchasing & Sales ⏳

### 6.1 Purchasing Module

- [ ] Migrate SupplierSearch
- [ ] Migrate RfqInCompany
- [ ] Migrate QuotationInCustomerCompany
- [ ] Migrate PoInCompany
- [ ] Migrate PurchaseReport
- [ ] Test purchasing flow

### 6.2 Sales Module

- [ ] Migrate RfqInSupplierCompany
- [ ] Migrate QuotationInCompany
- [ ] Migrate PoInSupplierCompany
- [ ] Migrate SoInCompany
- [ ] Migrate SalesReport
- [ ] Test sales flow

### 6.3 Delivery Module

- [ ] Migrate DoInCompany
- [ ] Migrate DoDetail
- [ ] Migrate DoProcess
- [ ] Test delivery tracking

**Phase 6 Complete:** [ ]

---

## Phase 7: Polish & Optimization ⏳

### 7.1 Animations

- [ ] Install Framer Motion
- [ ] Create animation variants
- [ ] Add page transitions
- [ ] Add modal animations
- [ ] Add button hover effects
- [ ] Add loading animations

### 7.2 Dark Mode

- [ ] Install next-themes
- [ ] Create ThemeProvider
- [ ] Wrap App with ThemeProvider
- [ ] Create ThemeToggle component
- [ ] Add to Header
- [ ] Test dark mode switching
- [ ] Fix any dark mode styling issues

### 7.3 Performance

- [ ] Implement code splitting
- [ ] Optimize React Query settings
- [ ] Add memoization where needed
- [ ] Optimize images
- [ ] Run Lighthouse audit
- [ ] Fix performance issues

### 7.4 Accessibility

- [ ] Install @axe-core/react
- [ ] Run accessibility audit
- [ ] Fix keyboard navigation issues
- [ ] Add proper ARIA labels
- [ ] Ensure color contrast
- [ ] Test with screen reader

### 7.5 Testing

- [ ] Install testing libraries
- [ ] Write unit tests for components
- [ ] Write integration tests for pages
- [ ] Write E2E tests for critical flows
- [ ] Achieve 80%+ coverage
- [ ] Fix failing tests

### 7.6 Documentation

- [ ] Update README
- [ ] Document component usage
- [ ] Create API documentation
- [ ] Add deployment guide
- [ ] Create Storybook (optional)

**Phase 7 Complete:** [ ]

---

## Final Checks ✅

### Code Quality

- [ ] No ESLint errors
- [ ] No console errors
- [ ] All imports cleaned up
- [ ] Material Tailwind completely removed
- [ ] Code formatted consistently

### Functionality

- [ ] All pages working
- [ ] All forms validating
- [ ] All CRUD operations working
- [ ] Navigation working
- [ ] Authentication working

### Performance

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB

### Accessibility

- [ ] WCAG 2.1 Level AA compliant
- [ ] Keyboard navigation 100%
- [ ] Screen reader compatible
- [ ] Color contrast AAA

### Testing

- [ ] All tests passing
- [ ] Coverage > 80%
- [ ] E2E tests passing
- [ ] No flaky tests

### Deployment

- [ ] Build successful
- [ ] Preview working
- [ ] Environment variables set
- [ ] Deployed to production
- [ ] Production tested

---

## 🎉 Migration Complete!

**Date Completed:** ****\_\_\_****

**Team Members:**

- [ ] Frontend Lead: ****\_\_\_****
- [ ] Developer 1: ****\_\_\_****
- [ ] Developer 2: ****\_\_\_****
- [ ] QA: ****\_\_\_****
- [ ] Designer: ****\_\_\_****

**Notes:**

---

---

---

**Lessons Learned:**

---

---

---

**Future Improvements:**

---

---

---
