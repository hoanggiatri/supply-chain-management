import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import OtpFogotPasswordForm from "@components/auth-form/OtpFogotPasswordForm";

class OtpForgotPassword extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            Xác thực OTP
          </Typography>
          <OtpFogotPasswordForm />
        </Paper>
      </Container>
    );
  }
}

export default OtpForgotPassword;
