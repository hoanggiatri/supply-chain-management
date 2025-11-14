import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableRow,
  TableCell,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import {
  getAllInventory,
  checkInventory,
  increaseOnDemand,
} from "@/services/inventory/InventoryService";
import { getBomByItemId } from "@/services/manufacturing/BomService";
import { getAllWarehousesInCompany } from "@/services/general/WarehouseService";
import { getMoById, updateMo } from "@/services/manufacturing/MoService";
import { createIssueTicket } from "@/services/inventory/IssueTicketService";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTransferTicketById,
  updateTransferTicket,
} from "@/services/inventory/TransferTicketService";
import { getPoById } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const CheckInventory = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [bomDetails, setBomDetails] = useState([]);
  const [ttDetails, setTtDetails] = useState([]);
  const [poDetails, setPoDetails] = useState([]);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [inventoryResults, setInventoryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const companyId = parseInt(localStorage.getItem("companyId"));
  const employeeName = localStorage.getItem("employeeName");
  const navigate = useNavigate();
  const { type, id } = useParams();

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getAllWarehousesInCompany(companyId, token);
        setWarehouses(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải danh sách kho!"
        );
      }
    };
    fetchWarehouses();
  }, [companyId, token]);

  useEffect(() => {
    const fetchDataByType = async () => {
      try {
        if (type === "mo") {
          const mo = await getMoById(id, token);
          setQuantity(mo.quantity);
          const bom = await getBomByItemId(mo.itemId, token);
          setBomDetails(bom.bomDetails);
        }

        if (type === "tt") {
          const tt = await getTransferTicketById(id, token);
          setTtDetails(tt.transferTicketDetails);
          setSelectedWarehouseId(tt.fromWarehouseId);
        }

        if (type === "po") {
          const po = await getPoById(id, token);
          setPoDetails(po.purchaseOrderDetails);
        }
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải dữ liệu!"
        );
      }
    };
    fetchDataByType();
  }, [type, id, token]);

  const handleWarehouseChange = (e) => {
    setSelectedWarehouseId(e.target.value);
  };

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

  const handleCheckInventory = async () => {
    if (!selectedWarehouseId) {
      toastrService.warning("Vui lòng chọn kho!");
      return;
    }

    setLoading(true);
    try {
      let results = [];

      if (type === "mo") {
        results = await Promise.all(
          bomDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.itemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity * quantity;
            const check = await checkInventory(
              detail.itemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      if (type === "tt") {
        results = await Promise.all(
          ttDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.itemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity;
            const check = await checkInventory(
              detail.itemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      if (type === "po") {
        results = await Promise.all(
          poDetails.map(async (detail) => {
            const inventories = await getAllInventory(
              detail.supplierItemId,
              selectedWarehouseId,
              companyId,
              token
            );
            const amountAvailabled =
              inventories[0]?.quantity - inventories[0]?.onDemandQuantity || 0;
            const amountNeeded = detail.quantity;
            const check = await checkInventory(
              detail.supplierItemId,
              selectedWarehouseId,
              amountNeeded,
              token
            );
            return {
              ...detail,
              quantityNeeded: amountNeeded,
              available: amountAvailabled,
              enough: check,
            };
          })
        );
      }

      setInventoryResults(results);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tải tồn kho!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (inventoryResults.length === 0) {
      toastrService.warning("Vui lòng kiểm tra tồn kho trước!");
      return;
    }

    try {
      const allEnough = inventoryResults.every((r) => r.enough);
      if (allEnough) {
        if (type === "mo") {
          const mo = await getMoById(id, token);
          const updatedMo = { ...mo, status: "Chờ sản xuất" };
          await updateMo(id, updatedMo, token);

          const issueTicketRequest = {
            companyId: companyId,
            warehouseId: parseInt(selectedWarehouseId),
            reason: "Xuất kho để sản xuất",
            issueType: "Sản xuất",
            referenceCode: mo.moCode,
            status: "Chờ xác nhận",
            createdBy: employeeName,
            issueDate: new Date().toISOString(),
          };
          await createIssueTicket(issueTicketRequest, token);

          await Promise.all(
            inventoryResults.map((r) =>
              increaseOnDemand(
                {
                  warehouseId: selectedWarehouseId,
                  itemId: r.itemId,
                  onDemandQuantity: r.quantityNeeded,
                },
                token
              )
            )
          );

          toastrService.success("Đã xác nhận công lệnh sản xuất!");
          navigate(-1);
        }

        if (type === "tt") {
          const tt = await getTransferTicketById(id, token);
          console.log("tt", tt);
          const updatedTt = {
            companyId: companyId,
            status: "Chờ xuất kho",
            reason: tt?.reason,
            fromWarehouseId: parseInt(tt?.fromWarehouseId),
            toWarehouseId: parseInt(tt?.toWarehouseId),
            createdBy: employeeName,
            transferTicketDetails: (tt?.transferTicketDetails || []).map(
              (d) => ({
                itemId: parseInt(d.itemId),
                quantity: parseFloat(d.quantity),
                note: d.note,
              })
            ),
          };
          await updateTransferTicket(id, updatedTt, token);

          const issueTicketRequest = {
            companyId: companyId,
            warehouseId: parseInt(selectedWarehouseId),
            reason: "Xuất kho để chuyển kho",
            issueType: "Chuyển kho",
            referenceCode: tt.ticketCode,
            status: "Chờ xác nhận",
            createdBy: employeeName,
            issueDate: new Date().toISOString(),
          };

          await createIssueTicket(issueTicketRequest, token);

          await Promise.all(
            inventoryResults.map((r) =>
              increaseOnDemand(
                {
                  warehouseId: selectedWarehouseId,
                  itemId: r.itemId,
                  onDemandQuantity: r.quantityNeeded,
                },
                token
              )
            )
          );

          toastrService.success("Đã xác nhận phiếu chuyển kho!");
          navigate(-1);
        }

        if (type === "po") {
          localStorage.setItem("poWarehouseId", selectedWarehouseId);
          navigate(`/create-so/${id}`);
        }
      } else {
        toastrService.warning("Có nguyên liệu không đủ số lượng!");
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi xác nhận tồn kho!"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantityNeeded", label: "Số lượng cần" },
    { id: "available", label: "Tồn kho sẵn có" },
    { id: "enough", label: "Đủ hàng" },
  ];

  return (
    <Container>
      <Paper elevation={3} className="paper-container">
        <Typography variant="h4" className="page-title">
          KIỂM TRA TỒN KHO
        </Typography>

        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Kho xuất</InputLabel>
                <Select
                  value={selectedWarehouseId}
                  onChange={handleWarehouseChange}
                  label="Kho xuất"
                  disabled={type === "tt"}
                >
                  {warehouses.map((wh) => (
                    <MenuItem key={wh.warehouseId} value={wh.warehouseId}>
                      {wh.warehouseCode} - {wh.warehouseName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="default"
                onClick={handleCheckInventory}
                disabled={!selectedWarehouseId || loading}
              >
                Kiểm tra tồn kho
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <DataTable
            rows={inventoryResults}
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
            renderRow={(row, index) => (
              <TableRow key={`${row.itemId || row.supplierItemId}-${index}`}>
                <TableCell>
                  {type === "po" ? row.supplierItemCode : row.itemCode}
                </TableCell>
                <TableCell>
                  {type === "po" ? row.supplierItemName : row.itemName}
                </TableCell>
                <TableCell>
                  {row.enough === "Không có tồn kho" ? "-" : row.quantityNeeded}
                </TableCell>
                <TableCell>
                  {row.enough === "Không có tồn kho" ? "-" : row.available}
                </TableCell>
                <TableCell>
                  {{
                    Đủ: "✔️ Đủ",
                    "Không đủ": "❌ Không đủ",
                    "Không có tồn kho": "⚠️ Không có tồn kho",
                  }[row.enough] || "⏳"}
                </TableCell>
              </TableRow>
            )}
          />
        </Box>

        {inventoryResults.length > 0 && (
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="default"
              onClick={handleConfirm}
              disabled={loading}
            >
              Xác nhận
            </Button>
            <Button
              variant="outlined"
              color="default"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CheckInventory;
