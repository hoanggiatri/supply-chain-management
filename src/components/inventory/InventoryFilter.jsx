import React from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";

const InventoryFilter = ({ 
  items, 
  warehouses, 
  selectedItemCode, 
  selectedWarehouseCode, 
  onItemChange, 
  onWarehouseChange, 
  onFilter, 
  loading 
}) => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardBody>
        <Typography variant="h6" color="blue-gray" className="mb-4 font-semibold">
          Bộ lọc tồn kho
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SelectAutocomplete
              options={items.map((item) => ({
                label: item.itemCode + " - " + item.itemName,
                value: item.itemCode,
              }))}
              value={selectedItemCode}
              onChange={(selected) => onItemChange(selected?.value || "")}
              placeholder="Chọn hàng hóa"
              size="small"
            />
          </div>
          <div>
            <SelectAutocomplete
              options={warehouses.map((warehouse) => ({
                label: warehouse.warehouseCode + " - " + warehouse.warehouseName,
                value: warehouse.warehouseCode,
              }))}
              value={selectedWarehouseCode}
              onChange={(selected) => onWarehouseChange(selected?.value || "")}
              placeholder="Chọn kho"
              size="small"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            color="blue"
            onClick={onFilter}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Đang tải..." : "Xem tồn kho"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default InventoryFilter;
