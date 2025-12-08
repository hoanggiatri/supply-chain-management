import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEmployee,
  updateEmployeeAvatar,
} from "@/services/general/EmployeeService";
import EmployeeForm from "@components/general/EmployeeForm";
import ImageUpload from "@/components/common/ImageUpload";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeName: "",
    position: "",
    gender: "",
    address: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    startDate: "",
    departmentId: "",
    username: "",
    password: "",
    role: "",
    status: "",
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.departmentId)
      errors.departmentId = "Bộ phận không được để trống";
    if (!formData.position?.trim())
      errors.position = "Chức vụ không được để trống";
    if (!formData.employeeCode?.trim())
      errors.employeeCode = "Mã nhân viên không được để trống";
    if (!formData.employeeName?.trim())
      errors.employeeName = "Họ và tên không được để trống";
    if (!formData.email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!formData.phoneNumber?.trim())
      errors.phoneNumber = "SĐT không được để trống";
    else if (!/^\d{10,11}$/.test(formData.phoneNumber))
      errors.phoneNumber = "SĐT không hợp lệ";
    if (!formData.username?.trim())
      errors.username = "Tên đăng nhập không được để trống";
    if (!formData.password.trim())
      errors.password = "Mật khẩu không được để trống";
    else if (formData.password.length < 8)
      errors.password = "Mật khẩu phải ≥ 8 ký tự";
    if (!formData.role) errors.role = "Vai trò không được để trống";
    if (!formData.status) errors.status = "Trạng thái không được để trống";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "departmentId" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = { ...formData };
      if (payload.dateOfBirth)
        payload.dateOfBirth = new Date(payload.dateOfBirth).toISOString();
      if (payload.startDate)
        payload.startDate = new Date(payload.startDate).toISOString();

      const newEmployee = await createEmployee(payload, token);

      // Upload avatar if selected
      if (imageFile && newEmployee?.employeeId) {
        try {
          await updateEmployeeAvatar(newEmployee.employeeId, imageFile, token);
        } catch (imageError) {
          console.error("Failed to upload avatar:", imageError);
          toastrService.warning("Tạo nhân viên thành công nhưng lỗi tải ảnh!");
        }
      }

      toastrService.success("Tạo nhân viên thành công!");
      navigate("/employees");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo nhân viên!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách nhân viên", path: "/employees" },
        { label: "Thêm mới" },
      ]}
      backLink="/employees"
      backLabel="Quay lại danh sách"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Avatar Upload */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageUpload
            previewUrl={imagePreview}
            onFileChange={handleImageChange}
            inputId="employee-avatar-input"
            label="Chọn ảnh đại diện"
            helpText="Định dạng: JPG, PNG. Tối đa 5MB."
            variant="square"
            placeholderImage="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
          />
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <EmployeeForm
            employee={formData}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={{}}
            mode="create"
          />

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Hủy
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              <Save className="w-4 h-4" />
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default CreateEmployee;
