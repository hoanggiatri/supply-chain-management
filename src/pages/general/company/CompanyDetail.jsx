import React, { useEffect, useState } from "react";
import { getCompanyById } from "@/services/general/CompanyService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { EditButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import { Skeleton } from "@/components/ui/skeleton";

const CompanyDetail = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const companyId = localStorage.getItem("companyId");
      const token = localStorage.getItem("token");
      if (!companyId) return;

      try {
        const data = await getCompanyById(companyId, token);

        if (data.logoUrl) {
          data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
        }

        setCompany(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi lấy thông tin công ty!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-2">
      <span className="text-gray-500 w-40 flex-shrink-0 text-sm">{label}</span>
      <span className={`text-gray-900 text-sm ${className}`}>
        {value || "---"}
      </span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        label: "Hoạt động",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      inactive: {
        label: "Ngưng hoạt động",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
    };
    const config = statusConfig[status] || statusConfig.active;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-40 w-40 rounded-lg mb-4" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) return null;

  const companyTypeLabels = {
    manufacturer: "Nhà sản xuất",
    supplier: "Nhà cung cấp",
    distributor: "Nhà phân phối",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-900 font-medium">
                Thông tin công ty
              </span>
            </div>
            <BackButton to="/homepage" label="Trang chủ" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Logo */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="w-40 h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                  <img
                    src={
                      company.logoUrl ||
                      "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
                    }
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/5 flex flex-col">
                {/* Title Section */}
                <div className="mb-6">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {company.companyCode}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {company.companyName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      {companyTypeLabels[company.companyType] ||
                        company.companyType}
                    </span>
                    <StatusBadge status={company.status} />
                  </div>
                </div>

                {/* Info Section - Grid 2 cột */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                    Thông tin chi tiết
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Địa chỉ" value={company.address} />
                    <InfoRow label="Điện thoại" value={company.phoneNumber} />
                    <InfoRow label="Email" value={company.email} />
                    <InfoRow label="Mã số thuế" value={company.taxCode} />
                    <InfoRow
                      label="Người đại diện"
                      value={company.representativeName}
                    />
                    <InfoRow label="Ngày thành lập" value={company.startDate} />
                    <InfoRow label="Ngày tham gia" value={company.joinDate} />
                    {company.websiteAddress && (
                      <InfoRow label="Website" value={company.websiteAddress} />
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate("/company/edit")}
                    label="Chỉnh sửa thông tin"
                    className="flex-1 h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
