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
      toastrService.success("Xóa nhân viên & tài khoản liên quan thành công!");
      navigate("/employees");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa nhân viên!"
      );
    }
  };

  const InfoRow = ({ label, value, className = "" }) => (
    <div className="flex items-start py-2">
      <span className="text-gray-600 w-36 flex-shrink-0 text-sm font-medium">
        {label}:
      </span>
      <span className={`text-gray-900 text-sm ${className}`}>
        {value || "---"}
      </span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const config = {
      active: "bg-green-50 text-green-700 border-green-200",
      inactive: "bg-amber-50 text-amber-700 border-amber-200",
      resigned: "bg-red-50 text-red-700 border-red-200",
    }[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config}`}
      >
        {
          {
            active: "Đang hoạt động",
            inactive: "Ngừng hoạt động",
            resigned: "Đã nghỉ",
          }[status]
        }
      </span>
    );
  };

  const GenderBadge = ({ gender }) => {
    const config = {
      male: "bg-blue-50 text-blue-700 border-blue-200",
      female: "bg-pink-50 text-pink-700 border-pink-200",
      other: "bg-gray-50 text-gray-700 border-gray-200",
    }[gender];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${config}`}
      >
        {{ male: "Nam", female: "Nữ", other: "Khác" }[gender]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Skeleton className="h-40 w-40 rounded-full mb-4" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
            <div className="text-sm text-gray-500 flex items-center gap-1">
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

          {/* Body */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="w-full md:w-1/4 flex justify-center md:justify-start">
                <div className="w-40 h-40 rounded-xl overflow-hidden border bg-white shadow hover:shadow-lg transition-all">
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

              {/* Info */}
              <div className="w-full md:w-3/4 flex flex-col">
                {/* Header Info */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                    {employee.employeeCode}
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900">
                    {employee.employeeName}
                  </h1>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {employee.position || "Chưa cập nhật"}
                    </span>
                    <StatusBadge status={employee.status} />
                    <GenderBadge gender={employee.gender} />
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-gray-50 rounded-lg border p-5 shadow-sm mb-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    THÔNG TIN NHÂN VIÊN
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <InfoRow label="Ngày sinh" value={employee.dateOfBirth} />
                    <InfoRow label="Email" value={employee.email} />
                    <InfoRow label="Điện thoại" value={employee.phoneNumber} />
                    <InfoRow label="Bộ phận" value={employee.departmentName} />
                    <InfoRow label="Chức vụ" value={employee.position} />
                    <InfoRow label="Ngày bắt đầu" value={employee.startDate} />
                    <div className="md:col-span-2">
                      <InfoRow label="Địa chỉ" value={employee.address} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <EditButton
                    label="Chỉnh sửa"
                    onClick={() => navigate(`/employee/${employeeId}/edit`)}
                    className="h-12 text-base font-semibold"
                  />
                  <DeleteButton
                    label="Xóa"
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        onConfirm: handleDelete,
                      })
                    }
                    className="h-12 text-base font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
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
