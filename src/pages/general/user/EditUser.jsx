import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "@components/general/UserForm";
import UpdatePasswordForm from "@components/general/UpdatePasswordForm";
import { getUserById, updateUser } from "@/services/general/UserService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";

const EditUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography className="page-title" variant="h4">
            CHỈNH SỬA TÀI KHOẢN
          </Typography>
          <BackButton to="/users" label="Quay lại danh sách" />
        </Box>

        <UserForm
          user={user}
          onChange={handleChange}
          errors={errors}
          role={role}
        />

        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {!showPasswordForm ? (
            <Button
              type="button"
              {...getButtonProps("success")}
              onClick={() => setShowPasswordForm(true)}
            >
              Thay đổi mật khẩu
            </Button>
          ) : (
            <span />
          )}

          <Box display="flex" gap={2}>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate(`/user/${userId}`)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSave}
            >
              Lưu
            </Button>
          </Box>
        </Box>
        {showPasswordForm && (
          <Box mt={3}>
            <UpdatePasswordForm
              userId={userId}
              onSuccess={() => setShowPasswordForm(false)}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EditUser;
