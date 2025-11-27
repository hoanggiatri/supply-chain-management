import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import DataTable from "@components/content-components/DataTable";
import { getAllInventory } from "@/services/inventory/InventoryService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@/components/common/BackButton";

const Inventory = () => {
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

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
      setInventories(data);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi lấy tồn kho!"
      );
    }
  };

  const columns = [
    { id: "warehouseCode", label: "Mã kho" },
    { id: "warehouseName", label: "Tên kho" },
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "onDemandQuantity", label: "Cần dùng" },
  ];

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" className="page-title">
          TỒN KHO
        </Typography>
        <BackButton />
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
        onRequestSort={handleRequestSort}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        search={search}
        height="calc(100vh - 360px)"
        setSearch={setSearch}
        renderRow={(inv, index) => {
          const isLast = index === inventories.length - 1;
          const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
          return (
            <tr key={`${inv.warehouseCode}-${inv.itemCode}-${index}`}>
              <td className={classes}>{inv.warehouseCode}</td>
              <td className={classes}>{inv.warehouseName}</td>
              <td className={classes}>{inv.itemCode}</td>
              <td className={classes}>{inv.itemName}</td>
              <td className={classes}>{inv.quantity}</td>
              <td className={classes}>{inv.onDemandQuantity}</td>
            </tr>
          );
        }}
      />
    </div>
  );
};

export default Inventory;
