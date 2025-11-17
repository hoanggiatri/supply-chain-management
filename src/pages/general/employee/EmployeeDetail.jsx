import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeForm from "@components/general/EmployeeForm";
import {
  getEmployeeById,
  deleteEmployee,
} from "@/services/general/EmployeeService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
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
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa nhân viên này không?")) return;

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

  if (!employee) {
    return <LoadingPaper title="THÔNG TIN NHÂN VIÊN" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN NHÂN VIÊN
        </Typography>

        <Box mb={3}>
          <img
            src={
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
        </Box>

        <EmployeeForm
          employee={employee}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={Object.keys(employee)}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate(`/employee/${employeeId}/edit`)}
          >
            Sửa
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeDetail;
