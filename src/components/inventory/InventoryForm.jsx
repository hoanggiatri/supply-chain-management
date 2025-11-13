import React, { useState, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import SelectAutocomplete from "../content-components/SelectAutocomplete";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";

const InventoryForm = ({ inventory, onChange, setInventory, errors }) => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsData = await getAllItemsInCompany(companyId, token);
        setItems(itemsData);

        const warehousesData = await getAllWarehousesInCompany(
          companyId,
          token
        );
        setWarehouses(warehousesData);
      } catch (error) {
        toastrService.error(
          error?.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
      }
    };
    fetchData();
  }, [companyId, token]);

  const handleWarehouseChange = (selected) => {
    const selectedWarehouse = warehouses.find(
      (warehouse) => warehouse.warehouseId === selected?.value
    );
    setInventory((prev) => ({
      ...prev,
      warehouseCode: selectedWarehouse?.warehouseCode || "",
      warehouseId: selectedWarehouse?.warehouseId || "",
      warehouseName: selectedWarehouse?.warehouseName || "",
    }));
  };

  const handleItemChange = (selected) => {
    const selectedItem = items.find((item) => item.itemId === selected?.value);
    setInventory((prev) => ({
      ...prev,
      itemCode: selectedItem?.itemCode || "",
      itemId: selectedItem?.itemId || "",
      itemName: selectedItem?.itemName || "",
    }));
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={warehouses.map((wh) => ({
            label: wh.warehouseCode + " - " + wh.warehouseName,
            value: wh.warehouseId,
          }))}
          value={inventory.warehouseId}
          onChange={handleWarehouseChange}
          placeholder="Chọn kho"
          error={errors.warehouseId}
          helperText={errors.warehouseId}
          size="small"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={items.map((item) => ({
            label: item.itemCode + " - " + item.itemName,
            value: item.itemId,
          }))}
          value={inventory.itemId}
          onChange={handleItemChange}
          placeholder="Chọn hàng hóa"
          error={errors.itemId}
          helperText={errors.itemId}
          size="small"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          name="quantity"
          label="Số lượng tồn kho"
          value={inventory.quantity}
          onChange={onChange}
          error={!!errors.quantity}
          helperText={errors.quantity}
          inputProps={{ min: 0 }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="number"
          name="onDemandQuantity"
          label="Số lượng cần dùng"
          value={inventory.onDemandQuantity}
          onChange={onChange}
          error={!!errors.onDemandQuantity}
          helperText={errors.onDemandQuantity}
          inputProps={{ min: 0 }}
        />
      </Grid>
    </Grid>
  );
};

export default InventoryForm;
