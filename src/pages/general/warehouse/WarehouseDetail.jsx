import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWarehouseById } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { EditButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";

const WarehouseDetail = () => {
  const { warehouseId } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWarehouse = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getWarehouseById(warehouseId, token);
        setWarehouse(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin kho!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

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
        label: "Đang hoạt động",
        className: "bg-green-100 text-green-700 border-green-200",
      },
      inactive: {
        label: "Ngừng hoạt động",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      },
      closed: {
        label: "Đã đóng",
        className: "bg-red-100 text-red-700 border-red-200",
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
              <Skeleton className="h-32 w-32 rounded-lg mb-4" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!warehouse) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/warehouses")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Chi tiết kho</span>
            </div>
            <BackButton to="/warehouses" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Icon */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm">
                  <BuildingStorefrontIcon className="w-16 h-16 text-orange-600" />
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/5 flex flex-col">
                {/* Title Section */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {warehouse.warehouseName}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {warehouse.warehouseCode}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      {warehouse.warehouseType}
                    </span>
                    <StatusBadge status={warehouse.status} />
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🏭 Thông tin kho
                  </h2>
                  <div className="space-y-1">
                    <InfoRow
                      label="Mã kho"
                      value={warehouse.warehouseCode}
                      className="font-medium"
                    />
                    <InfoRow label="Tên kho" value={warehouse.warehouseName} />
                    <InfoRow label="Loại kho" value={warehouse.warehouseType} />
                    <InfoRow
                      label="Mô tả"
                      value={warehouse.description || "Chưa có mô tả"}
                    />
                  </div>
                </div>

                {/* Capacity Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📦 Thông số kho
                  </h2>
                  <div className="space-y-3">
                    <InfoRow
                      label="Sức chứa tối đa"
                      value={`${warehouse.maxCapacity} m³`}
                    />
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">
                          Đang sử dụng
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          0%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate(`/warehouse/${warehouseId}/edit`)}
                    label="Sửa kho"
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

export default WarehouseDetail;
