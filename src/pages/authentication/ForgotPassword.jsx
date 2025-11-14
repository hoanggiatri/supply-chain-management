import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import ForgotPasswordForm from "@components/auth-form/ForgotPasswordForm";

class ForgotPassword extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            Lấy lại mật khẩu
          </Typography>
          <ForgotPasswordForm />
        </Paper>
      </Container>
    );
  }
}

export default ForgotPassword;
