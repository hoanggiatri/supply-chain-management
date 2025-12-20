import React from "react";
import { useNavigate } from "react-router-dom";

const ListPageLayout = ({
  children,
  title,
  description,
  actions,
  breadcrumbs = "Danh sách",
  breadcrumbItems, // New prop: array of {label, path} objects for clickable breadcrumbs
}) => {
  const navigate = useNavigate();

  // Render breadcrumbs based on whether breadcrumbItems is provided
  const renderBreadcrumbs = () => {
    if (breadcrumbItems && Array.isArray(breadcrumbItems)) {
      return breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {item.path ? (
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ));
    }
    // Default breadcrumb with Home link
    return (
      <>
        <span
          className="cursor-pointer hover:text-blue-600"
          onClick={() => navigate("/")}
        >
          Trang chủ
        </span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{breadcrumbs}</span>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Content */}
          <div className="p-6">
            {/* Title and Actions */}
            {(title || actions) && (
              <div className="mb-6 flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-lg font-semibold text-gray-900">
                      {title}
                    </h1>
                  )}
                  {/* {description && (
                    <p className="text-sm text-gray-900 mt-1">{description}</p>
                  )} */}
                </div>
                {actions && <div className="flex gap-2">{actions}</div>}
              </div>
            )}

            {/* Main Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPageLayout;
