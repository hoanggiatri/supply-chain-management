import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "@components/general/EmployeeForm";
import {
  getEmployeeById,
  updateEmployee,
  updateEmployeeAvatar,
} from "@/services/general/EmployeeService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const EditEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [errors, setErrors] = useState({});

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

  if (!employee) {
    return <LoadingPaper title="CHỈNH SỬA THÔNG TIN NHÂN VIÊN" />;
  }

  const readOnlyFields = {
    employeeCode: true,
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHỈNH SỬA THÔNG TIN NHÂN VIÊN
        </Typography>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <img
            src={
              avatarPreview ||
              employee.avatar ||
              "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
            }
            alt="avatar"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
          <Box display="flex" flexDirection="column" gap={2}>
            <Button variant="outlined" color="default" component="label">
              Chọn ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
            <Button
              variant="contained"
              color="default"
              disabled={!avatarFile}
              onClick={handleUploadImage}
            >
              Cập nhật ảnh
            </Button>
          </Box>
        </Box>

        <EmployeeForm
          employee={editedEmployee}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={readOnlyFields}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSave}>
            Lưu
          </Button>
          <Button variant="outlined" color="default" onClick={handleCancel}>
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditEmployee;
