import React, { useState } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createInventory } from "@/services/inventory/InventoryService";
import InventoryForm from "@/components/inventory/InventoryForm";
import toastrService from "@/services/toastrService";

const CreateInventory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [errors, setErrors] = useState({});

  const [inventory, setInventory] = useState({
    warehouseId: "",
    warehouseCode: "",
    itemId: "",
    itemCode: "",
    quantity: 0,
    onDemandQuantity: 0,
  });

  const validateForm = () => {
    const formErrors = {};
    if (!inventory.warehouseId) formErrors.warehouseId = "Phải chọn kho";
    if (!inventory.itemId) formErrors.itemId = "Phải chọn hàng hóa";
    if (inventory.quantity === "" || inventory.quantity < 0)
      formErrors.quantity = "Số lượng phải >= 0";
    if (inventory.onDemandQuantity === "" || inventory.onDemandQuantity < 0)
      formErrors.onDemandQuantity = "Số lượng cần dùng phải >= 0";
    return formErrors;
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

    setInventory((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const inv = {
        warehouseId: inventory.warehouseId,
        itemId: inventory.itemId,
        quantity: inventory.quantity,
        onDemandQuantity: inventory.onDemandQuantity,
      };

      console.log(inv);

      await createInventory(inv, token);
      toastrService.success("Thêm mới tồn kho thành công!");
      navigate("/inventory-count");
    } catch (error) {
      console.log(error.response);
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo tồn kho!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/inventory-count");
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÊM MỚI TỒN KHO
        </Typography>

        <InventoryForm
          inventory={inventory}
          onChange={handleChange}
          setInventory={setInventory}
          errors={errors}
        />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button variant="contained" color="default" onClick={handleSubmit}>
              Thêm
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="default" onClick={handleCancel}>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateInventory;
