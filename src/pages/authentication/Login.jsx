import React, { Component } from "react";
import { Container, Paper, Typography } from "@mui/material";
import LoginForm from "@components/auth-form/LoginForm";

class Login extends Component {
  render() {
    return (
      <Container maxWidth="sm">
        <Paper className="paper-container" elevation={3} >
          <Typography className="page-title" variant="h4" >
            ĐĂNG NHẬP
          </Typography>
          <LoginForm />
        </Paper>
      </Container>
    );
  }
}

export default Login;
