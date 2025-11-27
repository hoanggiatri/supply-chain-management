import React, { useEffect, useState } from "react";
import { Input, Select, Option, Typography } from "@material-tailwind/react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Input
          label="Mã phiếu"
          name="ticketCode"
          value={ticket.ticketCode || ""}
          onChange={onChange}
          placeholder="Mã phiếu được tạo tự động"
          readOnly={isFieldReadOnly("ticketCode")}
          color="blue"
          className="w-full placeholder:opacity-100"
        />
      </div>

      <div>
        <Input
          label="Lý do"
          name="reason"
          value={ticket.reason || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("reason")}
          color="blue"
          className="w-full placeholder:opacity-100"
        />
        {errors.reason && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.reason}
          </Typography>
        )}
      </div>

      <div>
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
      </div>

      <div>
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
      </div>

      <div>
        <Select
          label="Trạng thái"
          name="status"
          value={ticket.status || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("status")}
          color="blue"
          className="w-full"
        >
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Chờ xuất kho">Chờ xuất kho</Option>
          <Option value="Chờ nhập kho">Chờ nhập kho</Option>
          <Option value="Đã hoàn thành">Đã hoàn thành</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>
        {errors.status && (
          <Typography variant="small" color="red" className="mt-1">
            {errors.status}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default TtForm;
