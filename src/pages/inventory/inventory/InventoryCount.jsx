import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import {
  getAllInventory,
  updateInventory,
} from "@/services/inventory/InventoryService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import { useNavigate } from "react-router-dom";

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
        alert("Có lỗi khi tải dữ liệu kho và hàng hóa!");
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
      alert(error.response?.data?.message || "Có lỗi khi lấy tồn kho!");
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
        alert("Không tìm thấy mã kho hoặc hàng hóa hợp lệ để cập nhật");
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

      alert("Cập nhật tồn kho thành công!");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi khi cập nhật tồn kho!");
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
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          CẬP NHẬT TỒN KHO
        </Typography>

        <Box mt={3} mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <SelectAutocomplete
                options={items.map((item) => ({
                  label: item.itemCode + " - " + item.itemName,
                  value: item.itemCode,
                }))}
                value={selectedItemCode}
                onChange={(selected) =>
                  setSelectedItemCode(selected?.value || "")
                }
                placeholder="Chọn hàng hóa"
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <SelectAutocomplete
                options={warehouses.map((w) => ({
                  label: w.warehouseCode + " - " + w.warehouseName,
                  value: w.warehouseCode,
                }))}
                value={selectedWarehouseCode}
                onChange={(selected) =>
                  setSelectedWarehouseCode(selected?.value || "")
                }
                placeholder="Chọn kho"
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="default"
                fullWidth
                onClick={handleViewInventory}
              >
                Xem tồn kho
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-inventory")}
          >
            Thêm mới
          </Button>
        </Box>

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
          rowsPerPage={rowsPerPage}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(1);
          }}
          search={search}
          setSearch={setSearch}
          renderRow={(inventory, index) => (
            <TableRow key={index} hover>
              <TableCell>{inventory.warehouseCode}</TableCell>
              <TableCell>{inventory.warehouseName}</TableCell>
              <TableCell>{inventory.itemCode}</TableCell>
              <TableCell>{inventory.itemName}</TableCell>
              <TableCell>{inventory.quantity}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={
                    inventory.actualQuantity === null
                      ? ""
                      : inventory.actualQuantity
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const newInventories = inventories.map((inv) =>
                      inv.inventoryId === inventory.inventoryId
                        ? {
                            ...inv,
                            actualQuantity: value === "" ? null : Number(value),
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
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell>{inventory.onDemandQuantity}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  size="small"
                  value={
                    inventory.actualOnDemandQuantity === null
                      ? ""
                      : inventory.actualOnDemandQuantity
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const newInventories = inventories.map((inv) =>
                      inv.inventoryId === inventory.inventoryId
                        ? {
                            ...inv,
                            actualOnDemandQuantity:
                              value === "" ? null : Number(value),
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
                  inputProps={{ min: 0 }}
                />
              </TableCell>
              <TableCell>
                {(inventory.actualQuantity !== inventory.quantity ||
                  inventory.actualOnDemandQuantity !==
                    inventory.onDemandQuantity) && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleSaveInventory(inventory)}
                  >
                    Lưu
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default InventoryCount;
