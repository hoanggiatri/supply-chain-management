import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "@components/general/UserForm";
import { getUserById, updateUser } from "@/services/general/UserService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const UpdateUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getRole("role");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId, token);
        setUser(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin người dùng!"
        );
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { email } = user;

    if (!email?.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email không hợp lệ";
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await updateUser(userId, user, token);
      toastrService.success("Cập nhật tài khoản thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật tài khoản!"
      );
    }
  };

  if (!user) {
    return <LoadingPaper title="CHỈNH SỬA TÀI KHOẢN" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHỈNH SỬA TÀI KHOẢN
        </Typography>

        <UserForm
          user={user}
          onChange={handleChange}
          errors={errors}
          role={role}
        />

        <Box
          mt={3}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button variant="contained" color="default" onClick={handleSave}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateUser;
