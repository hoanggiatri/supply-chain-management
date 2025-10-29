import React, { useEffect, useState } from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import { getAllCompanies, monthlyCompanyReport } from "@/services/general/CompanyService";
import { getAllUsers, monthlyUserReport } from "@/services/general/UserService";
import PieChart from "@/components/content-components/PieChart";
import MonthlyBarChart from "@/components/content-components/MonthlyBarChart";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { ArrowUpward } from "@mui/icons-material";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [monthlyCompanyData, setMonthlyCompanyData] = useState([]);
  const [monthlyUserData, setMonthlyUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const companyList = await getAllCompanies(token);
      setCompanies(companyList);
      const monthly = await monthlyCompanyReport(token);
      setMonthlyCompanyData(monthly);
      const userList = await getAllUsers(token);
      setUsers(userList);
      const monthlyUsers = await monthlyUserReport(token);
      setMonthlyUserData(monthlyUsers);
    };

    fetchData();
  }, [token]);

  if (companies.length === 0 && users.length === 0) {
    return <LoadingPaper title="DASHBOARD HỆ THỐNG" />;
  }
  const currentMonthNewCompanies = monthlyCompanyData[monthlyCompanyData.length - 1]?.totalQuantity || 0;
  const percentCompanyThisMonth = ((currentMonthNewCompanies / companies.length) * 100).toFixed(2);
  const currentMonthNewUsers = monthlyUserData[monthlyUserData.length - 1]?.totalQuantity || 0;
  const percentUserThisMonth = ((currentMonthNewUsers / users.length) * 100).toFixed(2);

  const companyTypeData = [
    {
      label: "Doanh nghiệp sản xuất",
      value: companies.filter((c) => c.companyType === "Doanh nghiệp sản xuất").length
    },
    {
      label: "Doanh nghiệp thương mại",
      value: companies.filter((c) => c.companyType === "Doanh nghiệp thương mại").length
    }
  ];

  const companyStatusData = [
    {
      label: "Đang hoạt động",
      value: companies.filter((c) => c.status === "Đang hoạt động").length
    },
    {
      label: "Ngừng hoạt động",
      value: companies.filter((c) => c.status === "Ngừng hoạt động").length
    }
  ];

  const userRoleData = [
    {
      label: "Quản trị viên hệ thống",
      value: users.filter((u) => u.role === "S-ADMIN").length
    },
    {
      label: "Quản trị viên công ty",
      value: users.filter((u) => u.role === "C-ADMIN").length
    },
    {
      label: "Người dùng",
      value: users.filter((u) => u.role === "USER").length
    }
  ];

  const userStatusData = [
    {
      label: "Đang hoạt động",
      value: users.filter((u) => u.status === "Đang hoạt động").length
    },
    {
      label: "Đã bị khóa",
      value: users.filter((u) => u.status === "Đã bị khóa").length
    }
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h4">Số lượng công ty</Typography>
              <Typography variant="h1">{companies.length}</Typography>
              <Typography variant="subtitle1" color="green" display="flex" alignItems="center" justifyContent="center">
                <ArrowUpward sx={{ color: "green" }}/>
                {currentMonthNewCompanies} công ty ({percentCompanyThisMonth}%)
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h4">Số lượng người dùng</Typography>
              <Typography variant="h1">{users.length}</Typography>
              <Typography variant="subtitle1" color="green" display="flex" alignItems="center" justifyContent="center">
                <ArrowUpward sx={{ color: "green" }}/>
                {currentMonthNewUsers} người dùng ({percentUserThisMonth}%)
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={6} md={3}>
            <PieChart data={companyTypeData} labelField="label" valueField="value" title="Loại công ty" />
          </Grid>
          <Grid item xs={6} md={3}>
            <PieChart data={companyStatusData} labelField="label" valueField="value" title="Trạng thái công ty" />
          </Grid>
          <Grid item xs={6} md={3}>
            <PieChart data={userRoleData} labelField="label" valueField="value" title="Phân quyền người dùng" />
          </Grid>
          <Grid item xs={6} md={3}>
            <PieChart data={userStatusData} labelField="label" valueField="value" title="Trạng thái người dùng" />
          </Grid>

          <Grid item xs={12} md={6}>
            <MonthlyBarChart
              data={monthlyCompanyData}
              metric="totalQuantity"
              label="Số lượng công ty đăng ký"
              color="#05518B"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MonthlyBarChart
              data={monthlyUserData}
              metric="totalQuantity"
              label="Số lượng người dùng đăng ký"
              color="#389E0D"
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
