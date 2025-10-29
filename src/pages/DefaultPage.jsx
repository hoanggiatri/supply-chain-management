import React from "react";
import { Container, Typography, Button, Grid, } from "@mui/material";
import { useNavigate } from "react-router-dom";

import imgcard1 from "@assets/img/card/manufacture.png";
import imgcard2 from "@assets/img/card/purchase.png";
import imgcard3 from "@assets/img/card/sale.png";
import imgcard4 from "@assets/img/card/inventory.png";
import imgcard5 from "@assets/img/card/delivery.png";
import imgcard6 from "@assets/img/card/analytic.png";
import FeatureCard from "@components/content-components/FeatureCard";

const features = [
  { title: "Quản lý sản xuất", description: "Theo dõi và tối ưu quy trình sản xuất.", image: imgcard1 },
  { title: "Quản lý mua hàng", description: "Kiểm soát nhập hàng và nhà cung cấp.", image: imgcard2 },
  { title: "Quản lý bán hàng", description: "Xử lý đơn hàng và chăm sóc khách hàng.", image: imgcard3 },
  { title: "Quản lý kho", description: "Theo dõi tồn kho và điều chỉnh linh hoạt.", image: imgcard4 },
  { title: "Quản lý vận chuyển", description: "Giao hàng chính xác và nhanh chóng.", image: imgcard5 },
  { title: "Báo cáo & phân tích", description: "Thống kê dữ liệu theo thời gian thực.", image: imgcard6 }
];

const DefaultPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" style={{ textAlign: "center"}}>
      <Typography variant="h3">
        HỆ THỐNG QUẢN LÝ CHUỖI CUNG ỨNG
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ p: 1 }}>
        Giúp doanh nghiệp tối ưu hóa quản lý sản xuất, mua hàng, bán hàng, kho và vận chuyển.
      </Typography>
      <Button variant="contained" color="default" onClick={() => navigate("/register")}>
        Bắt đầu ngay
      </Button>

      <Grid container spacing={2} sx={{ pt: 2 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DefaultPage;
