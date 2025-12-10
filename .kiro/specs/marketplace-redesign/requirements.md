# Requirements Document
Có thể bổ sung các thư viện hiện đại thuận tiện nhất nếu cần (nhưng phải tương thích với version react hiện tại)
## Introduction

Thiết kế lại hoàn toàn giao diện Marketplace cho hệ thống quản lý chuỗi cung ứng (SCM). Hệ thống mới sẽ được xây dựng trong folder riêng biệt, không phụ thuộc vào layout cũ, với giao diện hiện đại, hiệu ứng CSS ấn tượng, tối ưu trải nghiệm người dùng cho 2 role chính: Mua hàng (Purchasing) và Bán hàng (Sales). Hệ thống sử dụng các API hiện có mà không thay đổi backend.

## Glossary

- **Marketplace**: Nền tảng giao dịch B2B cho phép mua bán hàng hóa giữa các doanh nghiệp
- **RFQ (Request for Quotation)**: Yêu cầu báo giá từ người mua gửi đến nhà cung cấp
- **Quotation**: Báo giá từ nhà cung cấp phản hồi RFQ
- **PO (Purchase Order)**: Đơn đặt hàng từ người mua
- **SO (Sales Order)**: Đơn bán hàng từ nhà cung cấp
- **Purchasing Department**: Phòng Mua hàng - quản lý RFQ, nhận báo giá, tạo PO
- **Sales Department**: Phòng Bán hàng - nhận RFQ, tạo báo giá, quản lý SO
- **Glass Morphism**: Hiệu ứng kính mờ trong thiết kế UI hiện đại
- **Micro-interactions**: Các hiệu ứng nhỏ phản hồi tương tác người dùng
- **Skeleton Loading**: Hiệu ứng loading hiển thị khung xương của nội dung

## Requirements

### Requirement 1: Cấu trúc thư mục và kiến trúc mới

**User Story:** As a developer, I want a completely separate folder structure for the new marketplace, so that the new system is independent and maintainable without affecting the existing codebase.

#### Acceptance Criteria

1. THE New_Marketplace_System SHALL organize all new components under `src/modules/marketplace-v2/` directory with subdirectories for components, pages, layouts, hooks, and styles
2. THE New_Marketplace_System SHALL maintain complete independence from existing marketplace components in `src/components/marketplace/` and `src/pages/marketplace/`
3. THE New_Marketplace_System SHALL reuse only the existing API services from `src/services/` without modification
4. THE New_Marketplace_System SHALL export a dedicated route configuration for integration with the main router

### Requirement 2: Layout hiện đại với hiệu ứng Glass Morphism

**User Story:** As a user, I want a modern and visually appealing layout with glass morphism effects, so that I have an impressive and professional experience when using the marketplace.

#### Acceptance Criteria

1. THE New_Layout SHALL display a sticky header with glass morphism effect (backdrop-filter blur, semi-transparent background) containing logo, navigation menu, notifications, and user profile
2. THE New_Layout SHALL render a collapsible sidebar for desktop view with smooth slide animation (300ms ease-in-out transition)
3. WHEN the viewport width is less than 1024px THEN THE New_Layout SHALL transform the sidebar into a bottom navigation bar with icon-only display
4. THE New_Layout SHALL apply a gradient background (from blue-50 to indigo-50) to the main content area
5. WHEN a user hovers over navigation items THEN THE New_Layout SHALL display a scale transform (1.02) with box-shadow elevation effect

### Requirement 3: Dashboard với Data Visualization

**User Story:** As a purchasing/sales manager, I want an interactive dashboard with real-time metrics and charts, so that I can quickly understand business performance at a glance.

#### Acceptance Criteria

1. THE Dashboard SHALL display 4 metric cards showing: Total RFQs, Pending Quotations, Active Orders, and Monthly Revenue with animated counter effect on load
2. WHEN data is loading THEN THE Dashboard SHALL display skeleton loading animation for each metric card
3. THE Dashboard SHALL render an interactive line/bar chart showing order trends using the existing monthly report APIs
4. THE Dashboard SHALL display a recent activities timeline with fade-in stagger animation (100ms delay between items)
5. WHEN a user clicks on a metric card THEN THE Dashboard SHALL navigate to the corresponding list page with a smooth page transition

### Requirement 4: Danh sách đơn hàng với Kanban View

**User Story:** As a purchasing/sales staff, I want to view orders in both card grid and kanban board layouts, so that I can manage orders efficiently based on their status.

#### Acceptance Criteria

1. THE Order_List_Page SHALL provide a toggle switch to change between Grid View and Kanban View with smooth crossfade transition
2. WHEN Grid View is active THEN THE Order_List_Page SHALL display orders as cards in a responsive grid (1 column mobile, 2 tablet, 3-4 desktop)
3. WHEN Kanban View is active THEN THE Order_List_Page SHALL display orders grouped by status in horizontal scrollable columns
4. THE Order_Card SHALL display: order code, company name, status badge with color coding, item count, total amount, and creation date
5. WHEN a user hovers over an Order_Card THEN THE Order_Card SHALL elevate with shadow and display a subtle glow effect matching the status color
6. THE Order_List_Page SHALL provide real-time search filtering with 300ms debounce and highlight matching text in results

### Requirement 5: Chi tiết đơn hàng với Timeline và Actions

**User Story:** As a user, I want to view order details with a visual timeline of status changes and quick action buttons, so that I can track progress and take actions efficiently.

#### Acceptance Criteria

1. THE Order_Detail_Page SHALL display order information in a two-column layout: main content (70%) and sidebar (30%) on desktop
2. THE Order_Detail_Page SHALL render a vertical timeline showing all status changes with timestamps and animated connecting lines
3. THE Order_Detail_Page SHALL display item list as expandable cards with product images, quantities, prices, and subtotals
4. WHEN status allows actions THEN THE Order_Detail_Page SHALL display floating action buttons with tooltip labels and ripple effect on click
5. WHEN a user confirms a status change THEN THE Order_Detail_Page SHALL display a confirmation modal with slide-up animation

### Requirement 6: Form tạo/chỉnh sửa với Multi-step Wizard

**User Story:** As a user, I want to create RFQs and orders through a guided multi-step form, so that I can complete complex forms without feeling overwhelmed.

#### Acceptance Criteria

1. THE Create_Form SHALL organize input fields into logical steps: Basic Info, Item Selection, Review & Submit
2. THE Create_Form SHALL display a progress indicator showing current step with completed steps marked with checkmark animation
3. WHEN navigating between steps THEN THE Create_Form SHALL animate content with horizontal slide transition
4. THE Create_Form SHALL validate each step before allowing progression and display inline error messages with shake animation
5. WHEN form submission succeeds THEN THE Create_Form SHALL display a success animation (checkmark with confetti effect) before redirecting

### Requirement 7: Responsive Design và Mobile Experience

**User Story:** As a mobile user, I want the marketplace to work seamlessly on my phone, so that I can manage orders on the go.

#### Acceptance Criteria

1. THE New_Marketplace_System SHALL adapt layout for 3 breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
2. WHEN on mobile THEN THE New_Marketplace_System SHALL display a bottom navigation bar with 5 main menu items and center floating action button
3. WHEN on mobile THEN THE Order_Card SHALL stack information vertically with swipe gestures for quick actions
4. THE New_Marketplace_System SHALL support pull-to-refresh gesture on list pages with custom loading animation
5. WHEN network is slow THEN THE New_Marketplace_System SHALL display optimistic UI updates with rollback on failure

### Requirement 8: Theming và Dark Mode Support

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE New_Marketplace_System SHALL provide a theme toggle in the header with sun/moon icon animation
2. WHEN dark mode is active THEN THE New_Marketplace_System SHALL apply dark color palette with adjusted glass morphism effects (darker backdrop, lighter borders)
3. THE New_Marketplace_System SHALL persist theme preference in localStorage and apply on initial load without flash
4. THE New_Marketplace_System SHALL use CSS custom properties for all theme colors enabling smooth 200ms transition between themes

### Requirement 9: Notifications và Real-time Updates

**User Story:** As a user, I want to receive notifications for important events, so that I can stay informed about order status changes and new requests.

#### Acceptance Criteria

1. THE Header SHALL display a notification bell icon with unread count badge (animated pulse when new notifications arrive)
2. WHEN a user clicks the notification bell THEN THE System SHALL display a dropdown panel with notification list and slide-down animation
3. THE Notification_Item SHALL display: icon based on type, title, description, timestamp, and read/unread indicator
4. WHEN a user clicks a notification THEN THE System SHALL navigate to the relevant page and mark notification as read

### Requirement 10: Performance và Loading States

**User Story:** As a user, I want fast page loads and smooth interactions, so that I can work efficiently without waiting.

#### Acceptance Criteria

1. THE New_Marketplace_System SHALL implement lazy loading for route components with suspense fallback showing branded loading spinner
2. THE New_Marketplace_System SHALL display skeleton screens matching content layout during data fetching
3. THE New_Marketplace_System SHALL cache API responses using React Query with 5-minute stale time for list data
4. WHEN an API call fails THEN THE System SHALL display an error state with retry button and fade-in error message
5. THE New_Marketplace_System SHALL implement virtual scrolling for lists exceeding 50 items to maintain 60fps scroll performance
