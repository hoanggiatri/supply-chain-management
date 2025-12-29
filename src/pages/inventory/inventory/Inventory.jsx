import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { useInventoryWithFilters } from "@/hooks/useInventory";
import { useItems } from "@/hooks/useItems";
import { useWarehouses } from "@/hooks/useWarehouses";
import toastService from "@/services/toastService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddButton } from "@/components/common/ActionButtons";

const Inventory = () => {
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");

  // Custom hooks for data fetching
  const { data: queryData, isLoading: inventoryLoading, error: inventoryError } = useInventoryWithFilters(companyId);
  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useItems(companyId);
  const { data: warehouses = [], isLoading: warehousesLoading, error: warehousesError } = useWarehouses(companyId);

  // Ensure inventories is always an array
  const inventories = Array.isArray(queryData) ? queryData : (queryData?.data || queryData?.content || []);

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

  const columns = [
    {
      accessorKey: "warehouseCode",
      header: createSortableHeader("Mã kho"),
      cell: ({ getValue }) => <span className="font-medium text-blue-600">{getValue() || ""}</span>
    },
    {
      accessorKey: "warehouseName",
      header: createSortableHeader("Tên kho"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "itemCode",
      header: createSortableHeader("Mã hàng hóa"),
      cell: ({ getValue }) => <span className="font-medium">{getValue() || ""}</span>
    },
    {
      accessorKey: "itemName",
      header: createSortableHeader("Tên hàng hóa"),
      cell: ({ getValue }) => <span>{getValue() || ""}</span>
    },
    {
      accessorKey: "quantity",
      header: createSortableHeader("Số lượng"),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className="font-semibold text-gray-900">
            {value ? Number(value).toLocaleString() : "0"}
          </span>
        );
      },
    },
    {
      accessorKey: "onDemandQuantity",
      header: createSortableHeader("Cần dùng"),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className="font-semibold text-orange-600">
            {value ? Number(value).toLocaleString() : "0"}
          </span>
        );
      },
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Kho / Tồn kho"
      title="Danh sách tồn kho"
      description="Theo dõi số lượng hàng hóa tồn kho hiện tại"
      actions={
        <AddButton
          label="Thêm tồn kho"
          onClick={() => navigate("/create-inventory")}
        />
      }
    >
      <div className="mb-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
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
              onClick={handleViewInventory}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Lọc kết quả
            </Button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData.length > 0 ? filteredData : inventories}
        loading={loading}
        emptyMessage="Chưa có dữ liệu tồn kho"
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
    </ListPageLayout>
  );
};

export default Inventory;
