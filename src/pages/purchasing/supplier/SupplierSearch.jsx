import React, { useEffect, useState } from "react";
import { Container, Paper, TextField, Grid, Card, CardContent, Typography, InputAdornment } from "@mui/material";
import { getAllCompanies } from "@/services/general/CompanyService";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SupplierSearch = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState("");

  const token = localStorage.getItem("token");
  const companyId = Number(localStorage.getItem("companyId"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCompanies(token);
        const filtered = data.filter(company => company.companyId !== companyId);
        setSuppliers(filtered);
        setFilteredSuppliers(filtered);
      } catch (err) {
        alert("Lỗi khi tải nhà cung cấp!");
      }
    };
    fetchData();
  }, [companyId, token]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchSupplier(value);

    const filtered = suppliers.filter(supplier =>
      Object.values({
        companyName: supplier.companyName,
        companyCode: supplier.companyCode,
        taxCode: supplier.taxCode,
        mainIndustry: supplier.mainIndustry,
        representativeName: supplier.representativeName,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
      }).some(field =>
        field?.toLowerCase().includes(value)
      )
    );

    setFilteredSuppliers(filtered);
  };


  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          TÌM KIẾM NHÀ CUNG CẤP
        </Typography>

        <TextField
          fullWidth
          label="Tìm kiếm nhà cung cấp"
          value={searchSupplier}
          placeholder="Nhập từ khóa tìm kiếm"
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredSuppliers.map((supplier) => (
            <Grid item sm={12} key={supplier.companyId} onClick={() => navigate(`/supplier/${supplier.companyId}`)}>
              <Card variant="outlined" sx={{ cursor: "pointer" }}>
                <CardContent>
                  <Typography variant="h5" sx={{ pb: 1 }}>{supplier.companyCode} - {supplier.companyName}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography>Mã số thuế: {supplier.taxCode || "Không có"}</Typography>
                      <Typography>Ngành nghề chính: {supplier.mainIndustry || "Không có"}</Typography>
                      <Typography>Người đại diện: {supplier.representativeName || "Không có"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography>Số điện thoại: {supplier.phoneNumber || "Không có"}</Typography>
                      <Typography>Email: {supplier.email || "Không có"}</Typography>
                      <Typography>Địa chỉ: {supplier.address || "Không có"}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SupplierSearch;
