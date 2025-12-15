import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {/* Kho */}
      <div className="space-y-2">
        <Label htmlFor="warehouseId">
          Kho <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={warehouses.map((wh) => ({
            label: wh.warehouseCode + " - " + wh.warehouseName,
            value: wh.warehouseId,
          }))}
          value={inventory.warehouseId}
          onChange={handleWarehouseChange}
          placeholder="Chọn kho"
          error={!!errors.warehouseId}
          helperText={errors.warehouseId}
        />
      </div>

      {/* Hàng hóa */}
      <div className="space-y-2">
        <Label htmlFor="itemId">
          Hàng hóa <span className="text-red-500">*</span>
        </Label>
        <Combobox
          options={items.map((item) => ({
            label: item.itemCode + " - " + item.itemName,
            value: item.itemId,
          }))}
          value={inventory.itemId}
          onChange={handleItemChange}
          placeholder="Chọn hàng hóa"
          error={!!errors.itemId}
          helperText={errors.itemId}
        />
      </div>

      {/* Số lượng tồn kho */}
      <div className="space-y-2">
        <Label htmlFor="quantity">
          Số lượng tồn kho <span className="text-red-500">*</span>
        </Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={0}
          value={inventory.quantity}
          onChange={onChange}
          className={errors.quantity ? "border-red-500" : ""}
          placeholder="Nhập số lượng tồn kho"
        />
        {errors.quantity && (
          <p className="text-sm text-red-500">{errors.quantity}</p>
        )}
      </div>

      {/* Số lượng cần dùng */}
      <div className="space-y-2">
        <Label htmlFor="onDemandQuantity">Số lượng cần dùng</Label>
        <Input
          id="onDemandQuantity"
          name="onDemandQuantity"
          type="number"
          min={0}
          value={inventory.onDemandQuantity}
          onChange={onChange}
          className={errors.onDemandQuantity ? "border-red-500" : ""}
          placeholder="Nhập số lượng cần dùng"
        />
        {errors.onDemandQuantity && (
          <p className="text-sm text-red-500">{errors.onDemandQuantity}</p>
        )}
      </div>
    </div>
  );
};

export default InventoryForm;
