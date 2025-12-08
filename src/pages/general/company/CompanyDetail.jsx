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
    <div className="flex items-start py-2.5">
      <span className="text-gray-600 w-36 flex-shrink-0 text-sm font-medium">
        {label}:
      </span>
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
              <Skeleton className="h-[200px] w-[200px] rounded-lg mb-4" />
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
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column: Logo */}
              <div className="w-full md:w-1/4 flex flex-col items-center md:items-start">
                <div className="w-[200px] h-[200px] rounded-lg overflow-hidden border-2 border-gray-300 bg-white shadow-lg hover:shadow-xl transition-shadow">
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
              <div className="w-full md:w-3/4 flex flex-col">
                {/* Title Section */}
                <div className="mb-6">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                      {company.companyCode}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {company.companyName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors">
                      {companyTypeLabels[company.companyType] ||
                        company.companyType}
                    </span>
                    <StatusBadge status={company.status} />
                  </div>
                </div>

                {/* Info Section - Card duy nhất */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100 p-5 shadow-sm hover:shadow-md transition-shadow mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    THÔNG TIN CHI TIẾT
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
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
                <div className="mt-auto">
                  <EditButton
                    onClick={() => navigate("/company/edit")}
                    label="Chỉnh sửa thông tin"
                    className="w-full h-12 text-base font-semibold"
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
