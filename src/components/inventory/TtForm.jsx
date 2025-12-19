import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";

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

  const handleSelectChange = (name, value) => {
    if (typeof onChange === "function") {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      

      {/* Kho xuất */}
      <div className="space-y-2">
        <Label htmlFor="fromWarehouseCode">
          Kho xuất <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={filteredFromWarehouses.map((w) => ({
            label: w.warehouseCode + " - " + w.warehouseName,
            value: w.warehouseCode,
          }))}
          value={ticket.fromWarehouseCode}
          onChange={handleFromWarehouseChange}
          placeholder="Chọn kho xuất"
          error={!!errors.fromWarehouseCode}
          helperText={errors.fromWarehouseCode}
          disabled={isFieldReadOnly("fromWarehouseCode")}
        />
      </div>

      {/* Kho nhập */}
      <div className="space-y-2">
        <Label htmlFor="toWarehouseCode">
          Kho nhập <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={filteredToWarehouses.map((w) => ({
            label: w.warehouseCode + " - " + w.warehouseName,
            value: w.warehouseCode,
          }))}
          value={ticket.toWarehouseCode}
          onChange={handleToWarehouseChange}
          placeholder="Chọn kho nhập"
          error={!!errors.toWarehouseCode}
          helperText={errors.toWarehouseCode}
          disabled={isFieldReadOnly("toWarehouseCode")}
        />
      </div>

      {/* Lý do */}
      <div className="space-y-2">
        <Label htmlFor="reason">
          Lý do <span className="text-red-500">*</span>
        </Label>
        <Input
          id="reason"
          name="reason"
          value={ticket.reason || ""}
          onChange={onChange}
          readOnly={isFieldReadOnly("reason")}
          disabled={isFieldReadOnly("reason")}
          className={errors.reason ? "border-red-500" : ""}
          placeholder="Nhập lý do"
        />
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Combobox
          options={[
            { value: "Chờ xác nhận", label: "Chờ xác nhận" },
            { value: "Chờ xuất kho", label: "Chờ xuất kho" },
            { value: "Chờ nhập kho", label: "Chờ nhập kho" },
            { value: "Đã hoàn thành", label: "Đã hoàn thành" },
            { value: "Đã hủy", label: "Đã hủy" },
          ]}
          value={ticket.status}
          onChange={(option) => handleSelectChange("status", option?.value)}
          placeholder="Chọn trạng thái"
          searchPlaceholder="Tìm trạng thái..."
          emptyText="Không tìm thấy trạng thái"
          disabled={isFieldReadOnly("status")}
          className={errors.status ? "border-red-500" : ""}
        />
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
    </div>
  );
};

export default TtForm;
