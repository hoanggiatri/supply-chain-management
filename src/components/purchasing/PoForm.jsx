import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SelectAutocomplete from "../content-components/SelectAutocomplete";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";

const PoForm = ({ quotation, po = {}, setPo, errors, readOnlyFields }) => {
  const [warehouses, setWarehouses] = useState([]);
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPo((prev) => ({ ...prev, [name]: value }));
  };

  const handleWarehouseChange = (selected) => {
    const selectedWarehouse = warehouses.find(
      (warehouse) => warehouse.warehouseId === selected?.value
    );
    setPo((prev) => ({
      ...prev,
      receiveWarehouseCode: selectedWarehouse?.warehouseCode || "",
      receiveWarehouseId: selectedWarehouse?.warehouseId || "",
      receiveWarehouseName: selectedWarehouse?.warehouseName || "",
    }));
  };

  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã đơn mua hàng"
          value={po?.poCode || ""}
          placeholder="Mã đơn mua hàng được tạo tự động"
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã báo giá"
          value={quotation?.quotationCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã công ty cung cấp"
          value={quotation?.companyCode || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Tên công ty cung cấp"
          value={quotation?.companyName || ""}
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="datetime-local"
          label="Ngày đặt hàng"
          value={formatDateTimeLocal(po?.createdOn || new Date().toISOString())}
          InputLabelProps={{ shrink: true }}
          name="createdOn"
          InputProps={{ readOnly: true }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl
          fullWidth
          required
          error={!!errors.paymentMethod}
          helperText={errors.paymentMethod}
        >
          <InputLabel>Phương thức thanh toán</InputLabel>
          <Select
            name="paymentMethod"
            value={po?.paymentMethod || ""}
            label="Phương thức thanh toán"
            onChange={handleChange}
            disabled={isFieldReadOnly("paymentMethod")}
          >
            <MenuItem value="Ghi công nợ">Ghi công nợ</MenuItem>
            <MenuItem value="Chuyển khoản">Chuyển khoản</MenuItem>
            <MenuItem value="Tiền mặt">Tiền mặt</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={warehouses.map((wh) => ({
            label: wh.warehouseCode + " - " + wh.warehouseName,
            value: wh.warehouseId,
          }))}
          value={po?.receiveWarehouseId}
          onChange={handleWarehouseChange}
          placeholder="Chọn kho *"
          error={errors.receiveWarehouseId}
          helperText={errors.receiveWarehouseId}
          size="small"
          disabled={isFieldReadOnly("receiveWarehouseId")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Địa chỉ giao hàng"
          name="deliveryToAddress"
          value={po?.deliveryToAddress || ""}
          onChange={handleChange}
          error={!!errors.deliveryToAddress}
          helperText={errors.deliveryToAddress}
          InputProps={{ readOnly: isFieldReadOnly("deliveryToAddress") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Trạng thái</InputLabel>
          <Select name="status" value={po?.status} label="Trạng thái" readOnly>
            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
            <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
            <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
            <MenuItem value="Chờ nhập kho">Chờ nhập kho</MenuItem>
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PoForm;
