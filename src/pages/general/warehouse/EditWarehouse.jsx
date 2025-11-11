import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseForm from "@components/general/WarehouseForm";
import {
  getWarehouseById,
  updateWarehouse,
} from "@/services/general/WarehouseService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const EditWarehouse = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [editedWarehouse, setEditedWarehouse] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const { warehouseName, warehouseType, maxCapacity } = editedWarehouse;

    if (!warehouseName?.trim())
      errors.warehouseName = "Tên kho không được để trống";
    if (!warehouseType) errors.warehouseType = "Loại kho không được để trống";
    if (maxCapacity == null || maxCapacity === "")
      errors.maxCapacity = "Sức chứa tối đa không được để trống";
    else if (isNaN(maxCapacity) || maxCapacity <= 0)
      errors.maxCapacity = "Sức chứa phải là số lớn hơn 0";

    return errors;
  };

  useEffect(() => {
    const fetchWarehouse = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getWarehouseById(warehouseId, token);
        setWarehouse(data);
        setEditedWarehouse(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin kho!"
        );
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

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

    setEditedWarehouse((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCancel = () => {
    setEditedWarehouse(warehouse);
    navigate(`/warehouse/${warehouseId}`);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const {
        warehouseId: _wid,
        companyId,
        warehouseCode,
        ...payload
      } = editedWarehouse || {};
      const updatedWarehouse = await updateWarehouse(
        warehouseId,
        payload,
        token
      );
      setWarehouse(updatedWarehouse);
      setEditedWarehouse(updatedWarehouse);
      toastrService.success("Cập nhật kho thành công!");
      navigate(`/warehouse/${warehouseId}`);
    } catch (error) {
      toastrService.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật kho!");
    }
  };

  if (!warehouse) return null;

  if (!warehouse) {
    return <LoadingPaper title="CHỈNH SỬA THÔNG TIN KHO HÀNG" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CHỈNH SỬA THÔNG TIN KHO HÀNG
        </Typography>

        <WarehouseForm
          warehouse={editedWarehouse}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={[]}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSave}>
            Lưu
          </Button>
          <Button variant="outlined" color="default" onClick={handleCancel}>
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditWarehouse;
