import React, { useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createItem } from "@/services/general/ItemService";
import ItemForm from "@components/general/ItemForm";

const CreateItem = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    companyId: companyId,
    itemName: "",
    itemType: "",
    isSellable: true,
    uom: "",
    technicalSpecifications: "",
    importPrice: 0,
    exportPrice: 0,
  });
  

  const validateForm = () => {
    const errors = {};
    if (!formData.itemName?.trim()) errors.itemName = "Tên hàng hóa không được để trống";
    if (!formData.itemType?.trim()) errors.itemType = "Loại hàng hóa không được để trống";
    if (!formData.uom?.trim()) errors.uom = "Đơn vị tính không được để trống";
    if (formData.importPrice && (isNaN(formData.importPrice) || Number(formData.importPrice) <= 0)) {
      errors.importPrice = "Giá nhập phải là số và lớn hơn 0 nếu nhập";
    }
    if (formData.exportPrice && (isNaN(formData.exportPrice) || Number(formData.exportPrice) <= 0)) {
      errors.exportPrice = "Giá xuất phải là số và lớn hơn 0 nếu nhập";
    }
    if (formData.isSellable && !formData.exportPrice) {
      errors.exportPrice = "Giá xuất không được để trống nếu là hàng bán";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }
  
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log(formData);
      await createItem(companyId, formData, token);
      alert("Thêm hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi khi thêm hàng hóa!");
    }
  };

  const handleCancel = () => {
    navigate("/items");
  };

  const handleNavigateToExcelPage = () => {
    navigate("/create-item-from-excel");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI HÀNG HÓA
        </Typography>

        <ItemForm item={formData} onChange={handleChange} errors={errors} readOnlyFields={{ itemCode: true }}/>

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="success" onClick={handleNavigateToExcelPage}>Nhập từ Excel</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>Thêm</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" onClick={handleCancel}>Hủy</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateItem;
