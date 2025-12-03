import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumbs as MTBreadcrumbs,
  Typography,
} from "@material-tailwind/react";

/**
 * Breadcrumbs - Navigation path component
 * Auto-generates breadcrumbs based on current path or accepts custom items
 */

// Path label mappings
const PATH_LABELS = {
  marketplace: "Marketplace",
  rfqs: "Yêu cầu báo giá",
  rfq: "Chi tiết RFQ",
  quotations: "Báo giá",
  quotation: "Chi tiết báo giá",
  pos: "Đơn mua hàng",
  po: "Chi tiết PO",
  sos: "Đơn bán hàng",
  so: "Chi tiết SO",
  "supplier-rfqs": "Yêu cầu từ KH",
  "supplier-rfq": "Chi tiết yêu cầu",
  "supplier-pos": "Đơn đặt hàng",
  "supplier-po": "Chi tiết đơn",
  "customer-quotations": "Báo giá từ NCC",
  "customer-quotation": "Chi tiết báo giá",
  dashboard: "Dashboard",
  "supplier-search": "Tìm NCC",
  supplier: "Nhà cung cấp",
  "create-rfq": "Tạo RFQ",
  "create-quotation": "Tạo báo giá",
  "create-po": "Tạo PO",
  "create-so": "Tạo SO",
  "my-profile": "Hồ sơ của tôi",
};

const Breadcrumbs = ({ items, className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Generate breadcrumb items from path if not provided
  const generateBreadcrumbs = () => {
    if (items && items.length > 0) {
      return items;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Trang chủ", path: "/" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip ID segments (UUIDs or numeric IDs)
      const isId =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          segment
        ) || /^\d+$/.test(segment);

      if (!isId) {
        const label = PATH_LABELS[segment] || segment;
        breadcrumbs.push({
          label,
          path: currentPath,
        });
      } else if (index > 0) {
        // If it's an ID, update the previous breadcrumb to include details
        const prevBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
        prevBreadcrumb.path = currentPath;
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Truncate if too many items
  const truncateItems = (items) => {
    if (items.length <= 4) return items;

    return [
      items[0],
      { label: "...", path: null },
      items[items.length - 2],
      items[items.length - 1],
    ];
  };

  const displayItems = truncateItems(breadcrumbItems);

  return (
    <div className={`hidden md:block ${className}`}>
      <MTBreadcrumbs className="bg-transparent p-0">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === "...";

          if (isEllipsis) {
            return (
              <span key="ellipsis" className="text-blue-gray-400">
                •••
              </span>
            );
          }

          if (isLast) {
            return (
              <Typography
                key={item.path}
                variant="small"
                className="text-blue-gray-900 font-medium"
              >
                {item.label}
              </Typography>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-blue-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              {item.label}
            </button>
          );
        })}
      </MTBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
