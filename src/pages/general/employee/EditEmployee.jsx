import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "@components/general/EmployeeForm";
import {
  getEmployeeById,
  updateEmployee,
  updateEmployeeAvatar,
} from "@/services/general/EmployeeService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/common/ImageUpload";

const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const validateForm = () => {
    const errors = {};
    const { position, employeeName, email, phoneNumber, gender } =
      editedEmployee || {};

    if (!position) errors.position = "Chức vụ không được để trống";
    if (!employeeName?.trim())
      errors.employeeName = "Họ và tên không được để trống";

    if (!email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!phoneNumber?.trim())
      errors.phoneNumber = "Số điện thoại không được để trống";
    if (!/^\d{10,11}$/.test(phoneNumber))
      errors.phoneNumber = "Số điện thoại không hợp lệ";
    if (
      !gender ||
      !["male", "female", "other"].includes(String(gender).toLowerCase())
    ) {
      errors.gender = "Giới tính phải là: male, female, other";
    }
    return errors;
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getEmployeeById(employeeId, token);

        if (data.avatar) {
          data.avatar = `${data.avatar}?t=${Date.now()}`;
        }

        setEmployee(data);
        setEditedEmployee(data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "departmentId" ? (value === "" ? "" : Number(value)) : value;
    setEditedEmployee((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    navigate(-1);
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const { id, departmentName, avatar, ...payload } = editedEmployee || {};

      const updatedEmployee = await updateEmployee(employeeId, payload, token);

      setEmployee(updatedEmployee);
      setEditedEmployee(updatedEmployee);
      toastrService.success("Cập nhật thông tin nhân viên thành công!");
      navigate(`/employee/${employeeId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin nhân viên!"
      );
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    const token = localStorage.getItem("token");

    try {
      await updateEmployeeAvatar(employeeId, avatarFile, token);

      // Fetch lại thông tin employee từ server để lấy URL avatar mới
      const updatedEmployee = await getEmployeeById(employeeId, token);

      // Thêm timestamp để tránh cache
      if (updatedEmployee.avatar) {
        updatedEmployee.avatar = `${updatedEmployee.avatar}?t=${Date.now()}`;
      }

      setEmployee(updatedEmployee);
      setEditedEmployee(updatedEmployee);
      setAvatarFile(null);
      setAvatarPreview(null);

      toastrService.success("Cập nhật ảnh đại diện thành công!");
      navigate(`/employee/${employeeId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật ảnh đại diện!"
      );
    }
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbs="Danh sách nhân viên / Chỉnh sửa"
        backLink="/employees"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!employee) return null;

  const readOnlyFields = {
    employeeCode: true,
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách nhân viên", path: "/employees" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/employees"
      backLabel="Quay lại danh sách"
    >
      {/* Title với icon */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          CHỈNH SỬA THÔNG TIN NHÂN VIÊN
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8 mb-8 bg-white rounded-lg border border-gray-200 p-6">
        {/* Left: Avatar tròn */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-50 shadow-md mb-3">
            <img
              src={
                avatarPreview ||
                employee.avatar ||
                "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            id="employee-avatar-input"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <label
            htmlFor="employee-avatar-input"
            className="block w-32 px-3 py-2 text-xs text-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
          >
            Chọn ảnh
          </label>
          {avatarFile && (
            <Button onClick={handleUploadImage} size="sm" className="w-32 mt-2">
              Cập nhật ảnh
            </Button>
          )}
        </div>

        {/* Right: Form với Grid 2 cột */}
        <div className="flex-1 w-full">
          <EmployeeForm
            employee={editedEmployee}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleSave}>Lưu thay đổi</Button>
      </div>
    </FormPageLayout>
  );
};

export default EditEmployee;
