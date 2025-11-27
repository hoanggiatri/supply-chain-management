import React, { useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createWarehouse } from "@/services/general/WarehouseService";
import WarehouseForm from "@components/general/WarehouseForm";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";

const CreateWarehouse = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [warehouse, setWarehouse] = useState({
    // companyId,
    warehouseName: "",
    description: "",
    maxCapacity: 0,
    warehouseType: "",
    status: "",
  });

  const [errors, setErrors] = useState({});

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

    setWarehouse((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};
    if (!warehouse.warehouseName.trim())
      newErrors.warehouseName = "Tên kho không được để trống";
    if (!warehouse.maxCapacity || warehouse.maxCapacity <= 0)
      newErrors.maxCapacity = "Sức chứa phải lớn hơn 0";
    if (!warehouse.warehouseType)
      newErrors.warehouseType = "Loại kho không được để trống";
    if (!warehouse.status) newErrors.status = "Trạng thái không được để trống";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createWarehouse(companyId, warehouse, token);
      toastrService.success("Tạo kho hàng thành công!");
      navigate("/warehouses");
    } catch (err) {
      toastrService.error(err.response?.data?.message || "Lỗi khi tạo kho!");
    }
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <div className="flex items-center justify-between mb-4">
          <Typography className="page-title" variant="h4">
            THÊM MỚI KHO HÀNG
          </Typography>
          <BackButton to="/warehouses" label="Quay lại danh sách" />
        </div>

        <WarehouseForm
          warehouse={warehouse}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{}}
        />

        <Grid container spacing={2} justifyContent="flex-end" mt={2}>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Lưu
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={() => navigate("/warehouses")}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateWarehouse;
