import React from "react";
import { Container, Typography, } from "@mui/material";

const HomePage = () => {
  return (
    <Container maxWidth="lg" style={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h3" gutterBottom>
        HỆ THỐNG QUẢN LÝ CHUỖI CUNG ỨNG
      </Typography>
      <img
        src={"https://blog.cedarmanagement.co.uk/wp-content/uploads/2020/04/Supply-chain-blog-cover-desktop-size-15-04.png"}
        alt=""
        style={{ width: "100%", height: "auto", borderRadius: 8 , padding: "0px 50px"}}
      />
    </Container>
  );
};

export default HomePage;
