import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Box } from "@mui/material";
import { getCompanyById } from "@/services/general/CompanyService";
import CompanyForm from "@components/general/CompanyForm";
import { useParams, useNavigate } from "react-router-dom";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const Company = () => {
  const [company, setCompany] = useState(null);
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      const token = localStorage.getItem("token");
      console.log(companyId);

      try {
        const data = await getCompanyById(companyId, token);

        if (data.logoUrl) {
          data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
        }

        setCompany(data);
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi lấy thông tin công ty!");
      }
    };

    fetchCompany();
  }, [companyId]);

  if (!company) {
    return <LoadingPaper title="THÔNG TIN CÔNG TY" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          THÔNG TIN CÔNG TY
        </Typography>

        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <img
            src={company.logoUrl || "https://cdn-icons-png.freepik.com/512/2774/2774806.png"}
            alt=""
            style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
          />
        </Box>

        <CompanyForm companyData={company} onChange={() => { }} errors={[]} readOnly />

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="default" onClick={() => navigate(`/admin/company/${companyId}/edit`)}>
            Sửa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Company;
