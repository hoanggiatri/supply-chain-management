import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";

const TtForm = ({
  ticket,
  onChange,
  errors = {},
  readOnlyFields,
  setTicket,
}) => {
  const [filteredFromWarehouses, setFilteredFromWarehouses] = useState([]);
  const [filteredToWarehouses, setFilteredToWarehouses] = useState([]);
  const [fromWarehouses, setFromWarehouses] = useState([]);
  const [toWarehouses, setToWarehouses] = useState([]);

  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");

  const isFieldReadOnly = (field) => readOnlyFields?.[field] ?? false;

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getAllWarehousesInCompany(companyId, token);

        const fromWarehouses = data;
        const toWarehouses = data;
        if (
          ticket?.fromWarehouseCode &&
          !fromWarehouses.some(
            (w) => w.warehouseCode === ticket.fromWarehouseCode
          )
        ) {
          fromWarehouses.unshift({
            warehouseCode: ticket.fromWarehouseCode,
            warehouseName: ticket.fromWarehouseName,
            warehouseId: ticket.fromWarehouseId,
          });
        }

        if (
          ticket?.toWarehouseCode &&
          !toWarehouses.some((w) => w.warehouseCode === ticket.toWarehouseCode)
        ) {
          toWarehouses.unshift({
            warehouseCode: ticket.toWarehouseCode,
            warehouseName: ticket.toWarehouseName,
            warehouseId: ticket.toWarehouseId,
          });
        }

        console.log("code", ticket);
        console.log(fromWarehouses, toWarehouses);

        setFromWarehouses(fromWarehouses);
        setFilteredFromWarehouses(fromWarehouses);

        setToWarehouses(toWarehouses);
        setFilteredToWarehouses(toWarehouses);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy hàng hóa!"
        );
      }
    };
    fetchWarehouses();
  }, [companyId, token, ticket]);

  const handleFromWarehouseChange = (selected) => {
    const selectedWarehouse = fromWarehouses.find(
      (w) => w.warehouseCode === selected?.value
    );
    setTicket((prev) => ({
      ...prev,
      fromWarehouseId: selectedWarehouse?.warehouseId || "",
      fromWarehouseCode: selectedWarehouse?.warehouseCode || "",
      fromWarehouseName: selectedWarehouse?.warehouseName || "",
    }));
  };

  const handleToWarehouseChange = (selected) => {
    const selectedWarehouse = toWarehouses.find(
      (w) => w.warehouseCode === selected?.value
    );
    setTicket((prev) => ({
      ...prev,
      toWarehouseId: selectedWarehouse?.warehouseId || "",
      toWarehouseCode: selectedWarehouse?.warehouseCode || "",
      toWarehouseName: selectedWarehouse?.warehouseName || "",
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Mã phiếu"
          name="ticketCode"
          value={ticket.ticketCode}
          onChange={onChange}
          placeholder="Mã phiếu được tạo tự động"
          InputProps={{ readOnly: isFieldReadOnly("ticketCode") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Lý do"
          name="reason"
          value={ticket.reason}
          onChange={onChange}
          error={!!errors.reason}
          helperText={errors.reason}
          InputProps={{ readOnly: isFieldReadOnly("reason") }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={filteredFromWarehouses.map((w) => ({
            label: w.warehouseCode + " - " + w.warehouseName,
            value: w.warehouseCode,
          }))}
          value={ticket.fromWarehouseCode}
          onChange={handleFromWarehouseChange}
          placeholder="Chọn kho xuất"
          error={errors.fromWarehouseCode}
          helperText={errors.fromWarehouseCode}
          size="small"
          disabled={isFieldReadOnly("fromWarehouseCode")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <SelectAutocomplete
          options={filteredToWarehouses.map((w) => ({
            label: w.warehouseCode + " - " + w.warehouseName,
            value: w.warehouseCode,
          }))}
          value={ticket.toWarehouseCode}
          onChange={handleToWarehouseChange}
          placeholder="Chọn kho nhập"
          error={errors.toWarehouseCode}
          helperText={errors.toWarehouseCode}
          size="small"
          disabled={isFieldReadOnly("toWarehouseCode")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!errors.status}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            name="status"
            value={ticket.status || ""}
            label="Trạng thái"
            onChange={onChange}
            inputProps={{ readOnly: isFieldReadOnly("status") }}
          >
            <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
            <MenuItem value="Chờ xuất kho">Chờ xuất kho</MenuItem>
            <MenuItem value="Chờ nhập kho">Chờ nhập kho</MenuItem>
            <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
            <MenuItem value="Đã hủy">Đã hủy</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default TtForm;
