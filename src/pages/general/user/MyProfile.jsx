import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { getUserByEmployeeId } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { EditButton } from "@/components/common/ActionButtons";
import { Skeleton } from "@/components/ui/skeleton";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-base font-semibold text-gray-900">
      {value || "--"}
    </span>
  </div>
);

const SectionCard = ({ title, children, highlight = false }) => (
  <div
    className={`rounded-2xl border ${
      highlight
        ? "bg-gray-50 border-gray-200 shadow-sm"
        : "bg-white border-gray-100 shadow-sm"
    } p-6`}
  >
    {title && (
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
    )}
    {children}
  </div>
);

const MyProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeRes = await getEmployeeById(employeeId, token);

        if (employeeRes.avatar) {
          employeeRes.avatar = `${employeeRes.avatar}?t=${Date.now()}`;
        }

        setEmployee({
          ...employeeRes,
          gender: employeeRes.gender || "",
          address: employeeRes.address || "",
          phoneNumber: employeeRes.phoneNumber || "",
          dateOfBirth: employeeRes.dateOfBirth || "",
        });

        const userRes = await getUserByEmployeeId(employeeId, token);
        setUser(userRes);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải thông tin người dùng!"
        );
      }
    };

    fetchData();
  }, [token]);

  if (!employee || !user) {
    return (
      <FormPageLayout backLink="/" backLabel="Quay lại trang chủ">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-[350px] w-full" />
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout backLink="/" backLabel="Quay lại trang chủ">
      <div className="space-y-10 pb-10">
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center gap-6 shadow-sm">
          <div className="w-24 h-24 rounded-full overflow-hidden border shadow-sm">
            <img
              src={employee.avatar || "https://i.ibb.co/MBtjqXQ/no-avatar.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {employee.fullName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {employee.positionName} — {employee.departmentName}
            </p>
          </div>
        </div>

        {/* GRID INFO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <SectionCard title="Thông tin nhân viên" highlight>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem label="Họ và tên" value={employee.fullName} />
              <InfoItem label="Giới tính" value={employee.gender} />
              <InfoItem label="Ngày sinh" value={employee.dateOfBirth} />
              <InfoItem label="Số điện thoại" value={employee.phoneNumber} />
              <InfoItem label="Địa chỉ" value={employee.address} />
              <InfoItem label="Mã nhân viên" value={employee.employeeCode} />
              <InfoItem label="Phòng ban" value={employee.departmentName} />
              <InfoItem label="Chức vụ" value={employee.positionName} />
            </div>
          </SectionCard>

          <SectionCard title="Thông tin tài khoản" highlight>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem label="Tên đăng nhập" value={user.username} />
              <InfoItem label="Email" value={user.email} />
              <InfoItem label="Vai trò" value={role} />
              <InfoItem
                label="Trạng thái"
                value={user.active ? "Đang hoạt động" : "Đã khoá"}
              />
            </div>
          </SectionCard>
        </div>

        {/* ACTION CARD */}
        <SectionCard>
          <div className="flex justify-end gap-3 pt-4">
            <EditButton
              onClick={() =>
                navigate(`/employee/${employee.id}/edit`, {
                  state: { from: "my-profile" },
                })
              }
              label="Sửa thông tin nhân viên"
              className="min-w-[180px]"
            />

            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => navigate(`/user/${employeeId}/edit`)}
            >
              Sửa tài khoản
            </Button>
          </div>
        </SectionCard>
      </div>
    </FormPageLayout>
  );
};

export default MyProfile;
