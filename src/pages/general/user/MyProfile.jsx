import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "@components/general/EmployeeForm";
import UserForm from "@components/general/UserForm";
import { getEmployeeById } from "@/services/general/EmployeeService";
import { getUserByEmployeeId } from "@/services/general/UserService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
        // Xử lý các giá trị null
        if (!employeeRes.gender) employeeRes.gender = "";
        if (!employeeRes.address) employeeRes.address = "";
        if (!employeeRes.phoneNumber) employeeRes.phoneNumber = "";
        if (!employeeRes.dateOfBirth) employeeRes.dateOfBirth = "";
        setEmployee(employeeRes);

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
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  const readOnlyFields = Object.keys(employee).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  const userReadOnlyFields = Object.keys(user).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  return (
    <FormPageLayout backLink="/" backLabel="Quay lại trang chủ">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin nhân viên
          </h3>

          <div className="mb-6">
            <img
              src={
                employee.avatar ||
                "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          <EmployeeForm
            employee={employee}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={readOnlyFields}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => navigate(`/employee/${employee.id}/edit`)}
            >
              Sửa thông tin
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin tài khoản
          </h3>

          <UserForm
            user={user}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={userReadOnlyFields}
            role={role}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => navigate(`/user/${employeeId}/edit`)}
            >
              Sửa tài khoản
            </Button>
          </div>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default MyProfile;
