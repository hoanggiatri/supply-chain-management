import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "@/services/general/EmployeeService";
import EmployeeForm from "@components/general/EmployeeForm";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});

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
      await createEmployee(payload, token);
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
      <EmployeeForm
        employee={formData}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{}}
        mode="create"
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>Thêm mới</Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateEmployee;
