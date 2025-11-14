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
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllInventory } from "@/services/inventory/InventoryService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import SelectAutocomplete from "@components/content-components/SelectAutocomplete";
import toastrService from "@/services/toastrService";

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
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TỒN KHO
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
          setSearch={setSearch}
          renderRow={(inv, index) => (
            <TableRow key={index} hover>
              <TableCell>{inv.warehouseCode}</TableCell>
              <TableCell>{inv.warehouseName}</TableCell>
              <TableCell>{inv.itemCode}</TableCell>
              <TableCell>{inv.itemName}</TableCell>
              <TableCell>{inv.quantity}</TableCell>
              <TableCell>{inv.onDemandQuantity}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default Inventory;
