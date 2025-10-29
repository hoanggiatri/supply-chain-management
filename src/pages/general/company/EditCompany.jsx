import React, { useEffect, useState, } from "react";
import { Container, Paper, Typography, Button, Box, } from "@mui/material";
import { getCompanyById, updateCompany, updateCompanyLogo } from "@/services/general/CompanyService";
import CompanyForm from "@components/general/CompanyForm";
import { useNavigate } from "react-router-dom";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const EditCompany = () => {
  const [company, setCompany] = useState(null);
  const [editedCompany, setEditedCompany] = useState(null);
  const [errors, setErrors] = useState({});

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchCompany = async () => {
        const companyId = localStorage.getItem("companyId");
        const token = localStorage.getItem("token");
        if (!companyId) return;
  
        try {
          const data = await getCompanyById(companyId, token);
  
          if (data.logoUrl) {
            data.logoUrl = `${data.logoUrl}?t=${Date.now()}`;
          }
  
          setCompany(data);
          setEditedCompany(data);
        } catch (error) {
          alert(error.response?.data?.message || "Lỗi khi lấy thông tin công ty!");
        }
      };
  
      fetchCompany();
    }, []);

  const validateForm = () => {
    const errors = {};
    const { companyName, representativeName, address, country, phoneNumber, email, startDate, joinDate } = editedCompany;
    if (!companyName.trim()) errors.companyName = "Tên công ty không được để trống";
    if (!address.trim()) errors.address = "Địa chỉ không được để trống";
    if (!country.trim()) errors.country = "Quốc gia không được để trống";
    if (!representativeName.trim()) errors.representativeName = "Người đại diện không được để trống";
    if (!phoneNumber.trim()) errors.phoneNumber = "Số điện thoại không được để trống";
    if (!/^\d{10,11}$/.test(phoneNumber)) errors.phoneNumber = "Số điện thoại không hợp lệ";
    if (!email.trim()) errors.email = "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email không hợp lệ";
    if (startDate && joinDate && new Date(startDate) > new Date(joinDate)) {
      errors.startDate = "Ngày bắt đầu phải trước ngày tham gia";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditedCompany(company);
    navigate("/company");
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const companyId = localStorage.getItem("companyId");
    const token = localStorage.getItem("token");

    try {
      await updateCompany(companyId, editedCompany, token);

      const updatedCompany = await getCompanyById(companyId, token);

      setCompany(updatedCompany);
      setEditedCompany(updatedCompany);
      alert("Cập nhật thông tin thành công!");
      navigate("/company");

    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadLogo = async () => {
    const companyId = localStorage.getItem("companyId");
    const token = localStorage.getItem("token");

    try {
      const newLogoUrl = await updateCompanyLogo(companyId, logoFile, token);
      const updatedLogoUrl = `${newLogoUrl}?${Date.now()}`;
      setCompany((prev) => ({ ...prev, logoUrl: updatedLogoUrl }));
      setLogoFile(null);
      setLogoPreview(null);
      alert("Cập nhật logo thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Cập nhật logo thất bại!");
    }
  };

  if (!company) {
    return <LoadingPaper title="CHỈNH SỬA THÔNG TIN CÔNG TY" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3} >
        <Typography className="page-title" variant="h4" >
          CHỈNH SỬA THÔNG TIN CÔNG TY
        </Typography>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
            <img
              src={logoPreview || company.logoUrl || "https://cdn-icons-png.freepik.com/512/2774/2774806.png"}
              alt=""
              style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
            />
          <Box display="flex" flexDirection="column" gap={1}>
            <Button variant="outlined" color="default" component="label"> Chọn logo
              <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
            </Button>
            <Button variant="contained" color="default" disabled={!logoFile} onClick={handleUploadLogo}> Cập nhật logo </Button>
          </Box>
        </Box>

          <CompanyForm companyData={editedCompany} onChange={handleChange} errors={errors} />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSave}>Lưu</Button>
          <Button variant="outlined" color="default" onClick={handleCancel}>Hủy</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCompany;
