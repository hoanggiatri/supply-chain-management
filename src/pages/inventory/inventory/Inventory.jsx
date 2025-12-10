import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { DataTable } from "@/components/ui/data-table";
import { useInventoryWithFilters } from "@/hooks/useInventory";
import { useItems } from "@/hooks/useItems";
import { useWarehouses } from "@/hooks/useWarehouses";
import { getInventoryColumns } from "./inventoryColumns";
import InventoryFilter from "@/components/inventory/InventoryFilter";
import { AddButton } from "@components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";
import toastService from "@/services/toastService";
import { getButtonProps } from "@/utils/buttonStyles";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";

const Inventory = () => {
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");

  // Custom hooks for data fetching
  const { data: inventories = [], isLoading: inventoryLoading, error: inventoryError } = useInventoryWithFilters(companyId);
  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useItems(companyId);
  const { data: warehouses = [], isLoading: warehousesLoading, error: warehousesError } = useWarehouses(companyId);

  // Error handling
  if (inventoryError) {
    toastService.error(
      inventoryError.response?.data?.message ||
        "Có lỗi khi lấy dữ liệu tồn kho!"
    );
  }

  if (itemsError) {
    toastService.error(
      itemsError.response?.data?.message ||
        "Có lỗi khi lấy danh sách hàng hóa!"
    );
  }

  if (warehousesError) {
    toastService.error(
      warehousesError.response?.data?.message ||
        "Có lỗi khi lấy danh sách kho!"
    );
  }

  const handleFilter = () => {
    let filtered = inventories;
    
    if (selectedItemCode) {
      filtered = filtered.filter(inv => inv.itemCode === selectedItemCode);
    }
    
    if (selectedWarehouseCode) {
      filtered = filtered.filter(inv => inv.warehouseCode === selectedWarehouseCode);
    }
    
    setFilteredData(filtered);
  };

  const handleViewInventory = () => {
    handleFilter();
    
    // Provide feedback to user
    const filtered = inventories.filter(inv => {
      const itemMatch = !selectedItemCode || inv.itemCode === selectedItemCode;
      const warehouseMatch = !selectedWarehouseCode || inv.warehouseCode === selectedWarehouseCode;
      return itemMatch && warehouseMatch;
    });
    
    if (filtered.length === 0) {
      toastService.info("Không tìm thấy dữ liệu tồn kho theo bộ lọc");
    } else {
      toastService.success(`Tìm thấy ${filtered.length} bản ghi tồn kho`);
    }
  };

  const loading = inventoryLoading || itemsLoading || warehousesLoading;
  const columns = getInventoryColumns();

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              TỒN KHO
            </Typography>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate("/create-inventory")}
            >
              Thêm mới
            </Button>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <SelectAutocomplete
                  options={items.map((item) => ({
                    label: `${item.itemCode} - ${item.itemName}`,
                    value: item.itemCode,
                  }))}
                  value={selectedItemCode}
                  onChange={(selected) =>
                    setSelectedItemCode(selected?.value || "")
                  }
                  placeholder="Chọn hàng hóa"
                />
              </div>

              <div className="md:col-span-1">
                <SelectAutocomplete
                  options={warehouses.map((w) => ({
                    label: `${w.warehouseCode} - ${w.warehouseName}`,
                    value: w.warehouseCode,
                  }))}
                  value={selectedWarehouseCode}
                  onChange={(selected) =>
                    setSelectedWarehouseCode(selected?.value || "")
                  }
                  placeholder="Chọn kho"
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  {...getButtonProps("primary")}
                  onClick={handleViewInventory}
                  className="w-full"
                >
                  Xem tồn kho
                </Button>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData.length > 0 ? filteredData : inventories}
            loading={loading}
            emptyMessage="Chưa có dữ liệu tồn kho"
            height="calc(100vh - 360px)"
            exportFileName="Ton_kho"
            exportMapper={(inv = {}) => ({
              "Mã kho": inv.warehouseCode || "",
              "Tên kho": inv.warehouseName || "",
              "Mã hàng hóa": inv.itemCode || "",
              "Tên hàng hóa": inv.itemName || "",
              "Số lượng": inv.quantity ?? 0,
              "Cần dùng": inv.onDemandQuantity ?? 0,
            })}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Inventory;
