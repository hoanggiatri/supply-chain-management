import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import toastrService from "@/services/toastrService";

const BomForm = ({ bom, onChange, errors = {}, readOnlyFields, setBom }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        const filtered = data.filter(
          (item) =>
            item.itemType === "Thành phẩm" || item.itemType === "Bán thành phẩm"
        );

        if (
          bom?.itemCode &&
          !filtered.some((item) => item.itemCode === bom.itemCode)
        ) {
          filtered.unshift({
            itemCode: bom.itemCode,
            itemName: bom.itemName,
            itemId: bom.itemId,
          });
        }

        setItems(filtered);
        setFilteredItems(filtered);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy hàng hóa!"
        );
      }
    };
    fetchItems();
  }, [companyId, token, bom]);

  const handleItemCodeChange = (selected) => {
    const selectedItem = items.find(
      (item) => item.itemCode === selected?.value
    );
    setBom((prev) => ({
      ...prev,
      itemCode: selectedItem ? selectedItem.itemCode : "",
      itemName: selectedItem ? selectedItem.itemName : "",
      itemId: selectedItem ? selectedItem.itemId : "",
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã BOM"
          name="bomCode"
          value={bom.bomCode}
          onChange={onChange}
          placeholder="Mã BOM được tạo tự động"
          required
          inputProps={{ readOnly: isFieldReadOnly("bomCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={filteredItems.map((item) => ({
            label: item.itemCode + " - " + item.itemName,
            value: item.itemCode,
          }))}
          value={bom.itemCode}
          onChange={handleItemCodeChange}
          placeholder="Chọn hàng hóa"
          error={errors.itemCode}
          helperText={errors.itemCode}
          size="small"
          disabled={isFieldReadOnly("itemCode")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên hàng hóa"
          name="itemName"
          value={bom.itemName}
          onChange={onChange}
          required
          error={!!errors.itemName}
          helperText={errors.itemName}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required error={!!errors.status}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={bom.status || ""}
            label="Trạng thái"
            onChange={onChange}
            inputProps={{ readOnly: isFieldReadOnly("status") }}
          >
            <MenuItem value="Đang sử dụng">Đang sử dụng</MenuItem>
            <MenuItem value="Ngừng sử dụng">Ngừng sử dụng</MenuItem>
          </Select>
          {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mô tả"
          name="description"
          value={bom.description}
          onChange={onChange}
          multiline
          minRows={3}
          InputProps={{ readOnly: isFieldReadOnly("description") }}
        />
      </Grid>
    </Grid>
  );
};

export default BomForm;
