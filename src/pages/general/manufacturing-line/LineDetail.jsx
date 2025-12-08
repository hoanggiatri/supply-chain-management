import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLineById } from "@/services/general/ManufactureLineService";
import toastrService from "@/services/toastrService";
import { EditButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const LineDetail = () => {
  const { lineId } = useParams();
  const [line, setLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLine = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getLineById(lineId, token);
        setLine(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin dây chuyền!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLine();
  }, [lineId]);

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
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!line) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/lines")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết dây chuyền
              </span>
            </div>
            <BackButton to="/lines" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Icon */}
              <div className="w-full md:w-1/4 flex flex-col gap-4">
                <div className="aspect-square bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-lg flex items-center justify-center shadow-sm border border-cyan-200">
                  <WrenchScrewdriverIcon className="w-20 h-20 text-cyan-600" />
                </div>
              </div>

              {/* Right Column: Info */}
              <div className="w-full md:w-3/4 flex flex-col">
                {/* Title Section */}
                <div className="mb-4">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {line.lineName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {line.lineCode}
                    </span>
                  </div>
                </div>

                {/* Info Card - Merged */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-6 mb-6 border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
                    <InfoRow
                      label="Mã dây chuyền"
                      value={line.lineCode}
                      className="font-medium"
                    />
                    <InfoRow label="Tên dây chuyền" value={line.lineName} />
                    <InfoRow label="Xưởng" value={line.plantName} />
                    <InfoRow label="Công suất" value={line.capacity} />
                    <div className="col-span-1 lg:col-span-2">
                      <InfoRow
                        label="Mô tả"
                        value={line.description || "Chưa có mô tả"}
                      />
                    </div>
                    {/* Performance */}
                    <div className="col-span-1 lg:col-span-2 mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">
                          {line.activeOrderCount || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Đang sản xuất
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">
                          {line.totalOrderCount || 0}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Tổng công lệnh
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <EditButton
                    onClick={() => navigate(`/line/${lineId}/edit`)}
                    label="Sửa dây chuyền"
                    className="w-full h-12 text-base"
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

export default LineDetail;
