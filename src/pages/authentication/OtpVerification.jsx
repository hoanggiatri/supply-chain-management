import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import OtpVerificationForm from "@components/auth-form/OtpVerificationForm";

class OtpVerification extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            Xác thực OTP
          </Typography>
          <OtpVerificationForm />
        </Paper>
      </Container>
    );
  }
}

export default OtpVerification;
