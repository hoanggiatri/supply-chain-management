import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlantById } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import { EditButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

const PlantDetail = () => {
  const { plantId } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlant = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getPlantById(plantId, token);
        setPlant(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin xưởng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [plantId]);

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-2">
      <span className="text-gray-500 w-40 flex-shrink-0 text-sm">{label}</span>
      <span className={`text-gray-900 text-sm ${className}`}>
        {value || "---"}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <Skeleton className="h-32 w-32 rounded-lg mb-4" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/plants")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Chi tiết xưởng</span>
            </div>
            <BackButton to="/plants" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Icon */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                  <BuildingOfficeIcon className="w-16 h-16 text-purple-600" />
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/5 flex flex-col">
                {/* Title Section */}
                <div className="mb-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {plant.plantName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {plant.plantCode}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🏭 Thông tin xưởng
                  </h2>
                  <div className="space-y-1">
                    <InfoRow
                      label="Mã xưởng"
                      value={plant.plantCode}
                      className="font-medium"
                    />
                    <InfoRow label="Tên xưởng" value={plant.plantName} />
                    <InfoRow
                      label="Mô tả"
                      value={plant.description || "Chưa có mô tả"}
                    />
                  </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {plant.lineCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Dây chuyền</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-2xl font-bold text-green-600">
                      {plant.activeLineCount || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Đang hoạt động
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate(`/plant/${plantId}/edit`)}
                    label="Sửa xưởng"
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

export default PlantDetail;
