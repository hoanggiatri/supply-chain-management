import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Input,
  Card,
  CardBody,
} from "@material-tailwind/react";
import DataTable from "@components/content-components/DataTable";
import {
  getAllInventory,
  updateInventory,
} from "@/services/inventory/InventoryService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const InventoryCount = () => {
  const [inventories, setInventories] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("warehouseCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    }
  };

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

  const columns = [
    { id: "warehouseCode", label: "Mã kho" },
    { id: "warehouseName", label: "Tên kho" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng hiện tại" },
    { id: "actualQuantity", label: "Số lượng thực tế" },
    { id: "onDemandQuantity", label: "Số lượng cần dùng" },
    { id: "actualOnDemandQuantity", label: "Số lượng cần dùng thực tế" },
    { id: "action", label: "Hành động" },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              CẬP NHẬT TỒN KHO
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
            rows={inventories}
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={(property) => {
              const isAsc = orderBy === property && order === "asc";
              setOrder(isAsc ? "desc" : "asc");
              setOrderBy(property);
            }}
            page={page}
            height="calc(100vh - 450px)"
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
            search={search}
            setSearch={setSearch}
            renderRow={(inventory, index) => {
              const isLast = index === inventories.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={inventory.inventoryId || index}>
                  <td className={classes}>{inventory.warehouseCode}</td>
                  <td className={classes}>{inventory.warehouseName}</td>
                  <td className={classes}>{inventory.itemCode}</td>
                  <td className={classes}>{inventory.itemName}</td>
                  <td className={classes}>{inventory.quantity}</td>
                  <td className={classes}>
                    <Input
                      type="number"
                      color="blue"
                      size="md"
                      className="w-full placeholder:opacity-100"
                      value={
                        inventory.actualQuantity === null
                          ? ""
                          : inventory.actualQuantity
                      }
                      onChange={(e) => {
                        const { value } = e.target;
                        const newInventories = inventories.map((inv) =>
                          inv.inventoryId === inventory.inventoryId
                            ? {
                                ...inv,
                                actualQuantity:
                                  value === ""
                                    ? null
                                    : Number.parseFloat(value),
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
                                actualQuantity:
                                  inv.actualQuantity === null
                                    ? 0
                                    : inv.actualQuantity,
                              }
                            : inv
                        );
                        setInventories(newInventories);
                      }}
                      min={0}
                    />
                  </td>
                  <td className={classes}>{inventory.onDemandQuantity}</td>
                  <td className={classes}>
                    <Input
                      type="number"
                      color="blue"
                      size="md"
                      className="w-full placeholder:opacity-100"
                      value={
                        inventory.actualOnDemandQuantity === null
                          ? ""
                          : inventory.actualOnDemandQuantity
                      }
                      onChange={(e) => {
                        const { value } = e.target;
                        const newInventories = inventories.map((inv) =>
                          inv.inventoryId === inventory.inventoryId
                            ? {
                                ...inv,
                                actualOnDemandQuantity:
                                  value === ""
                                    ? null
                                    : Number.parseFloat(value),
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
                                actualOnDemandQuantity:
                                  inv.actualOnDemandQuantity === null
                                    ? 0
                                    : inv.actualOnDemandQuantity,
                              }
                            : inv
                        );
                        setInventories(newInventories);
                      }}
                      min={0}
                    />
                  </td>
                  <td className={classes}>
                    {(inventory.actualQuantity !== inventory.quantity ||
                      inventory.actualOnDemandQuantity !==
                        inventory.onDemandQuantity) && (
                      <Button
                        type="button"
                        {...getButtonProps("success")}
                        size="sm"
                        onClick={() => handleSaveInventory(inventory)}
                      >
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
