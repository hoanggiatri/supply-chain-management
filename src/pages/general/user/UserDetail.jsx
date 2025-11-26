import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "@components/general/UserForm";
import { getUserById } from "@/services/general/UserService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
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

  if (!user) {
    return <LoadingPaper title="THÔNG TIN TÀI KHOẢN" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN TÀI KHOẢN
        </Typography>

        <UserForm
          user={user}
          onChange={() => {}}
          errors={{}}
          readOnly
          role={role}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate(`/user/${userId}/edit`)}
          >
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserDetail;
