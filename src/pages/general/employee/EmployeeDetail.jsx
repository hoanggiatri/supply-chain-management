import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEmployeeById,
  deleteEmployee,
} from "@/services/general/EmployeeService";
import toastrService from "@/services/toastrService";
import { EditButton, DeleteButton } from "@/components/common/ActionButtons";
import BackButton from "@components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getEmployeeById(employeeId, token);
        if (data.avatar) {
          data.avatar = `${data.avatar}?t=${Date.now()}`;
        }
        setEmployee(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin nhân viên!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteEmployee(employeeId, token);
      toastrService.success("Xóa nhân viên và tài khoản liên quan thành công!");
      navigate("/employees");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa nhân viên!"
      );
    }
  };

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
      resigned: {
        label: "Đã nghỉ",
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

  const GenderBadge = ({ gender }) => {
    const genderConfig = {
      male: {
        label: "Nam",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      },
      female: {
        label: "Nữ",
        className: "bg-pink-100 text-pink-700 border-pink-200",
      },
      other: {
        label: "Khác",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      },
    };
    const config = genderConfig[gender] || genderConfig.other;

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
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
          {/* Header / Breadcrumb */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className="cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/employees")}
              >
                Danh sách
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                Chi tiết nhân viên
              </span>
            </div>
            <BackButton to="/employees" label="Trở lại" />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column: Avatar */}
              <div className="w-full md:w-2/5 flex flex-col gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 shadow-md">
                  <img
                    src={
                      employee.avatar ||
                      "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
                    }
                    alt="avatar"
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
                      {employee.employeeCode}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    {employee.employeeName}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {employee.position || "Chưa cập nhật"}
                    </span>
                    <StatusBadge status={employee.status} />
                  </div>
                </div>

                {/* Info Section - Grid 2 cột */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                    Thông tin cá nhân
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Ngày sinh" value={employee.dateOfBirth} />
                    <div className="flex items-start py-2">
                      <span className="text-gray-500 w-40 flex-shrink-0 text-sm">
                        Giới tính
                      </span>
                      <span className="text-sm">
                        <GenderBadge gender={employee.gender} />
                      </span>
                    </div>
                    <InfoRow label="Email" value={employee.email} />
                    <InfoRow label="Điện thoại" value={employee.phoneNumber} />
                    <InfoRow
                      label="Bộ phận"
                      value={employee.departmentName}
                      className="text-blue-600 hover:underline cursor-pointer"
                    />
                    <InfoRow label="Chức vụ" value={employee.position} />
                    <div className="md:col-span-2">
                      <InfoRow label="Địa chỉ" value={employee.address} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-auto">
                  <EditButton
                    onClick={() => navigate(`/employee/${employeeId}/edit`)}
                    label="Chỉnh sửa"
                    className="flex-1 h-12 text-base"
                  />
                  <DeleteButton
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        onConfirm: handleDelete,
                      })
                    }
                    label="Xóa"
                    className="flex-1 h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa nhân viên này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
};

export default EmployeeDetail;
