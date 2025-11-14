import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import RegisterForm from "@components/auth-form/RegisterForm";

class Register extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            ĐĂNG KÝ
          </Typography>
          <RegisterForm />
        </Paper>
      </Container>
    );
  }
}

export default Register;
