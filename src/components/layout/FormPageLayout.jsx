import React from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@components/common/BackButton";

const FormPageLayout = ({
  children,
  breadcrumbs,
  breadcrumbItems, // New prop: array of {label, path} objects for clickable breadcrumbs
  backLink = -1,
  backLabel = "Trở lại",
  className = "",
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
    return breadcrumbs;
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header - Only show if there are breadcrumbs */}
          {(breadcrumbs || breadcrumbItems) && (
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {renderBreadcrumbs()}
              </div>
              {backLink && <BackButton to={backLink} label={backLabel} />}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FormPageLayout;
