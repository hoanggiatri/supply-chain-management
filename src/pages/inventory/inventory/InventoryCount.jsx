import { AddButton } from "@/components/common/ActionButtons";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { createSortableHeader, DataTable } from "@/components/ui/data-table";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import {
  getAllInventory,
  updateInventory,
} from "@/services/inventory/InventoryService";
import toastrService from "@/services/toastrService";
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InventoryCount = () => {
  const [inventories, setInventories] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchItemsAndWarehouses = async () => {
      try {
        const itemsData = await getAllItemsInCompany(companyId, token);
        const warehousesData = await getAllWarehousesInCompany(
          companyId,
          token
        );
        setItems(itemsData);
        setWarehouses(warehousesData);
      } catch (error) {
        toastrService.error("Có lỗi khi tải dữ liệu kho và hàng hóa!");
      }
    };
    fetchItemsAndWarehouses();
  }, [companyId, token]);

  const handleViewInventory = async () => {
    setLoading(true);
    try {
      const itemId = selectedItemCode
        ? items.find((i) => i.itemCode === selectedItemCode)?.itemId || 0
        : 0;
      const warehouseId = selectedWarehouseCode
        ? warehouses.find((w) => w.warehouseCode === selectedWarehouseCode)
            ?.warehouseId || 0
        : 0;

      const data = await getAllInventory(itemId, warehouseId, companyId, token);
      const withActualQuantity = data.map((inventory) => ({
        ...inventory,
        actualQuantity: inventory.quantity,
        actualOnDemandQuantity: inventory.onDemandQuantity,
      }));

      setInventories(withActualQuantity);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi lấy tồn kho!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto load all inventory data when items and warehouses are loaded
  useEffect(() => {
    if (items.length > 0 && warehouses.length > 0 && inventories.length === 0) {
      handleViewInventory();
    }
  }, [items, warehouses]);

  const handleSaveInventory = async (inventory) => {
    try {
      const quantityToSave =
        inventory.actualQuantity === null ? 0 : inventory.actualQuantity;
      const onDemandToSave =
        inventory.actualOnDemandQuantity === null
          ? 0
          : inventory.actualOnDemandQuantity;
      const itemIdToSave = Number(inventory.itemId);
      const warehouseIdToSave = Number(inventory.warehouseId);

      if (!itemIdToSave || !warehouseIdToSave) {
        toastrService.warning(
          "Không tìm thấy mã kho hoặc hàng hóa hợp lệ để cập nhật"
        );
        return;
      }

      await updateInventory(
        inventory.inventoryId,
        {
          itemId: itemIdToSave,
          warehouseId: warehouseIdToSave,
          quantity: quantityToSave,
          onDemandQuantity: onDemandToSave,
        },
        token
      );

      const newInventories = inventories.map((inv) =>
        inv.inventoryId === inventory.inventoryId
          ? {
              ...inv,
              actualQuantity: quantityToSave,
              quantity: quantityToSave,
              actualOnDemandQuantity: onDemandToSave,
              onDemandQuantity: onDemandToSave,
            }
          : inv
      );
      setInventories(newInventories);

      toastrService.success("Cập nhật tồn kho thành công!");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi cập nhật tồn kho!"
      );
    }
  };

  const getInventoryCountColumns = () => [
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
          <span className="font-semibold text-gray-600">
            {value ? Number(value).toLocaleString() : "0"}
          </span>
        );
      },
    },
    {
      accessorKey: "actualQuantity",
      header: createSortableHeader("Số lượng thực tế"),
      cell: () => null // Will be handled by renderRow
    },
    {
      accessorKey: "onDemandQuantity",
      header: createSortableHeader("Số lượng cần dùng"),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className="font-semibold text-orange-600">
            {value ? Number(value).toLocaleString() : "0"}
          </span>
        );
      },
    },
    {
      accessorKey: "actualOnDemandQuantity",
      header: createSortableHeader("Số lượng cần dùng thực tế"),
      cell: () => null // Will be handled by renderRow
    },
    {
      accessorKey: "action",
      header: createSortableHeader("Hành động"),
      cell: () => null // Will be handled by renderRow
    },
  ];

  const columns = getInventoryCountColumns();

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CẬP NHẬT TỒN KHO
            </Typography>
            <AddButton
              label="Thêm mới"
              onClick={() => navigate("/create-inventory")}
            />
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Combobox
                  options={items.map((item) => ({
                    label: `${item.itemCode} - ${item.itemName}`,
                    value: item.itemCode,
                  }))}
                  value={selectedItemCode}
                  onChange={(selected) =>
                    setSelectedItemCode(selected?.value || "")
                  }
                  placeholder="Chọn hàng hóa"
                  searchPlaceholder="Tìm hàng hóa..."
                />
              </div>

              <div className="md:col-span-1">
                <Combobox
                  options={warehouses.map((w) => ({
                    label: `${w.warehouseCode} - ${w.warehouseName}`,
                    value: w.warehouseCode,
                  }))}
                  value={selectedWarehouseCode}
                  onChange={(selected) =>
                    setSelectedWarehouseCode(selected?.value || "")
                  }
                  placeholder="Chọn kho"
                  searchPlaceholder="Tìm kho..."
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  onClick={handleViewInventory}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Xem tồn kho
                </Button>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={inventories}
            loading={loading}
            emptyMessage="Chưa có dữ liệu tồn kho"
            height="calc(100vh - 450px)"
            renderRow={(inventory, index) => {
              const hasChanges = 
                inventory.actualQuantity !== inventory.quantity ||
                inventory.actualOnDemandQuantity !== inventory.onDemandQuantity;
              
              return (
                <tr key={inventory.inventoryId || index} className="group even:bg-[#F8F9FC] odd:bg-white">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{inventory.warehouseCode}</td>
                  <td className="px-6 py-4 text-sm font-medium">{inventory.warehouseName}</td>
                  <td className="px-6 py-4 text-sm font-medium">{inventory.itemCode}</td>
                  <td className="px-6 py-4 text-sm">{inventory.itemName}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {inventory.quantity ? Number(inventory.quantity).toLocaleString() : "0"}
                  </td>
                  <td className="px-3 py-3 w-40">
                    <div className="relative">
                      <div className="flex items-center gap-1">
                        <div className="relative flex-1 min-w-[80px]">
                          <input
                            type="number"
                            value={inventory.actualQuantity === null ? "" : inventory.actualQuantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newInventories = inventories.map((inv) =>
                                inv.inventoryId === inventory.inventoryId
                                  ? {
                                      ...inv,
                                      actualQuantity: value === "" ? null : Number.parseFloat(value),
                                    }
                                  : inv
                              );
                              setInventories(newInventories);
                            }}
                            onBlur={() => {
                              const newInventories = inventories.map((inv) =>
                                inv.inventoryId === inventory.inventoryId
                                  ? {
                                      ...inv,
                                      actualQuantity: inv.actualQuantity === null ? 0 : inv.actualQuantity,
                                    }
                                  : inv
                              );
                              setInventories(newInventories);
                            }}
                            min={0}
                            className="w-full px-2 py-1.5 text-sm font-medium border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 bg-white hover:bg-blue-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                        </div>
                        {inventory.actualQuantity !== null && inventory.actualQuantity !== inventory.quantity && (
                          <span className="text-xs text-blue-600 font-medium whitespace-nowrap">
                            {inventory.actualQuantity > inventory.quantity ? "+" : ""}
                            {Number(inventory.actualQuantity - inventory.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                    {inventory.onDemandQuantity ? Number(inventory.onDemandQuantity).toLocaleString() : "0"}
                  </td>
                  <td className="px-3 py-3 w-40">
                    <div className="relative">
                      <div className="flex items-center gap-1">
                        <div className="relative flex-1 min-w-[80px]">
                          <input
                            type="number"
                            value={inventory.actualOnDemandQuantity === null ? "" : inventory.actualOnDemandQuantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newInventories = inventories.map((inv) =>
                                inv.inventoryId === inventory.inventoryId
                                  ? {
                                      ...inv,
                                      actualOnDemandQuantity: value === "" ? null : Number.parseFloat(value),
                                    }
                                  : inv
                              );
                              setInventories(newInventories);
                            }}
                            onBlur={() => {
                              const newInventories = inventories.map((inv) =>
                                inv.inventoryId === inventory.inventoryId
                                  ? {
                                      ...inv,
                                      actualOnDemandQuantity: inv.actualOnDemandQuantity === null ? 0 : inv.actualOnDemandQuantity,
                                    }
                                  : inv
                              );
                              setInventories(newInventories);
                            }}
                            min={0}
                            className="w-full px-2 py-1.5 text-sm font-medium border border-gray-300 rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-all duration-200 bg-white hover:bg-orange-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                          />
                        </div>
                        {inventory.actualOnDemandQuantity !== null && inventory.actualOnDemandQuantity !== inventory.onDemandQuantity && (
                          <span className="text-xs text-orange-600 font-medium whitespace-nowrap">
                            {inventory.actualOnDemandQuantity > inventory.onDemandQuantity ? "+" : ""}
                            {Number(inventory.actualOnDemandQuantity - inventory.onDemandQuantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {hasChanges && (
                      <Button
                        size="sm"
                        onClick={() => handleSaveInventory(inventory)}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        Lưu
                      </Button>
                    )}
                  </td>
                </tr>
              );
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default InventoryCount;
