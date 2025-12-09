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

  const InfoRow = ({ label, value }) => (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-none">
      <span className="text-gray-600 text-sm w-40">{label}</span>
      <span className="text-gray-900 text-sm text-right flex-1">
        {value || "---"}
      </span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const map = {
      active: "bg-green-100 text-green-700 border border-green-200",
      inactive: "bg-amber-100 text-amber-700 border border-amber-200",
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${map[status]}`}
      >
        {status === "active" ? "Hoạt động" : "Ngưng hoạt động"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <Skeleton className="h-[160px] w-[160px] rounded-lg mb-5" />
            <Skeleton className="h-7 w-1/3 mb-4" />
            <Skeleton className="h-[300px] w-full" />
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
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Thông tin công ty
            </h2>
            <BackButton to="/homepage" label="Trang chủ" />
          </div>

          {/* Body */}
          <div className="p-6 space-y-8">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex justify-center md:block">
                <div className="w-[180px] h-[180px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
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

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {company.companyCode}
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  {company.companyName}
                </h1>

                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {companyTypeLabels[company.companyType] ||
                      company.companyType}
                  </span>

                  <StatusBadge status={company.status} />
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                THÔNG TIN CHI TIẾT
              </h3>

              <div className="space-y-2">
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

            {/* Edit Button */}
            <EditButton
              onClick={() => navigate("/company/edit")}
              label="Chỉnh sửa thông tin"
              className="w-full h-12 text-base font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
