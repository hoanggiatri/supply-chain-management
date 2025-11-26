import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EmployeeForm from "@components/general/EmployeeForm";
import UserForm from "@components/general/UserForm";

import { getEmployeeById } from "@/services/general/EmployeeService";
import { getUserByEmployeeId } from "@/services/general/UserService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

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
    return <LoadingPaper title="THÔNG TIN CÁ NHÂN" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN CÁ NHÂN
        </Typography>

        <Grid container direction="column" spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              THÔNG TIN NHÂN VIÊN:
            </Typography>

            <Box mb={3}>
              <img
                src={
                  employee.avatar ||
                  "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg"
                }
                alt="avatar"
                style={{
                  width: 100,
                  height: 100,
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

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                type="button"
                {...getButtonProps("primary")}
                onClick={() => navigate(`/employee/${employee.id}/edit`)}
              >
                Sửa thông tin
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ pb: 3 }}>
              THÔNG TIN TÀI KHOẢN:
            </Typography>

            <UserForm
              user={user}
              onChange={() => {}}
              errors={{}}
              readOnly
              role={role}
            />

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                type="button"
                {...getButtonProps("primary")}
                onClick={() => navigate(`/user/${employeeId}/edit`)}
              >
                Sửa tài khoản
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MyProfile;
