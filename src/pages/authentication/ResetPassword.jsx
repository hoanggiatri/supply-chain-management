import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import ResetPasswordForm from "@components/auth-form/ResetPasswordForm";

class ResetPassword extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            Đặt lại mật khẩu
          </Typography>
          <ResetPasswordForm />
        </Paper>
      </Container>
    );
  }
}

export default ResetPassword;
