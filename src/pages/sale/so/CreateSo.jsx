import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TableRow,
  TableCell,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getPoById, updatePoStatus } from "@/services/purchasing/PoService";
import { createSo } from "@/services/sale/SoService";
import SoForm from "@/components/sale/SoForm";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import DataTable from "@/components/content-components/DataTable";
import { increaseOnDemand } from "@/services/inventory/InventoryService";
import { createIssueTicket } from "@/services/inventory/IssueTicketService";
import toastrService from "@/services/toastrService";

const CreateSo = () => {
  const { poId } = useParams();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const poWarehouseId = localStorage.getItem("poWarehouseId");
  const employeeName = localStorage.getItem("employeeName");
  const companyAddress = localStorage.getItem("companyAddress");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [po, setPo] = useState(null);
  const [so, setSo] = useState({});
  const [soDetails, setSoDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const poData = await getPoById(poId, token);
        setPo(poData);
        console.log(poData);

        setSo({
          companyId: poData.supplierCompanyId,
          customerCompanyId: poData.companyId,
          poId: poData.poId,
          paymentMethod: poData.paymentMethod,
          createdBy: employeeName,
          deliveryToAddress: poData.deliveryToAddress,
          deliveryFromAddress: companyAddress,
          status: "Chờ xuất kho",
        });

        const details = poData.purchaseOrderDetails.map((d) => ({
          itemId: d.supplierItemId,
          itemCode: d.supplierItemCode,
          itemName: d.supplierItemName,
          quantity: d.quantity,
          itemPrice: d.itemPrice,
          discount: d.discount,
          note: d.note,
        }));

        setSoDetails(details);
      } catch (err) {
        toastrService.error(
          err.response?.data?.message || "Không thể tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [poId, token, employeeName, companyAddress]);

  const handleSubmit = async () => {
    try {
      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        companyId: Number(so.companyId),
        customerCompanyId: Number(so.customerCompanyId),
        poId: Number(so.poId),
        paymentMethod: so.paymentMethod,
        deliveryToAddress: so.deliveryToAddress,
        deliveryFromAddress: so.deliveryFromAddress,
        createdBy: so.createdBy,
        status: so.status,
      };
      const createdSo = await createSo(request, token);
      const soCode = createdSo.soCode;
      console.log(soCode);

      const issueTicketRequest = {
        companyId: Number(companyId),
        warehouseId: Number(poWarehouseId),
        reason: "Xuất kho để bán hàng",
        issueType: "Bán hàng",
        referenceCode: soCode,
        status: "Chờ xác nhận",
        createdBy: employeeName,
        issueDate: new Date().toISOString(),
      };

      await createIssueTicket(issueTicketRequest, token);

      await Promise.all(
        soDetails.map((d) =>
          increaseOnDemand(
            {
              warehouseId: Number(poWarehouseId),
              itemId: Number(d.itemId),
              onDemandQuantity: parseFloat(d.quantity),
            },
            token
          )
        )
      );

      await updatePoStatus(poId, "Đã xác nhận", token);

      toastrService.success("Tạo đơn bán hàng thành công!");
      navigate("/supplier-pos");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể tạo đơn bán hàng!"
      );
    }
  };

  const handleCancel = () => {
    navigate(-2);
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
    { id: "itemPrice", label: "Đơn giá (VNĐ)" },
    { id: "discount", label: "Chiết khấu (VNĐ)" },
    { id: "total", label: "Thành tiền (VNĐ)" },
  ];

  const filteredDetails = [...soDetails].sort((a, b) => {
    if (orderBy) {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  if (!po) return <LoadingPaper title="TẠO ĐƠN BÁN HÀNG" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TẠO ĐƠN BÁN HÀNG
        </Typography>

        <SoForm so={so} setSo={setSo} po={po} />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA:
        </Typography>

        <DataTable
          rows={paginatedDetails}
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
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          search={search}
          setSearch={setSearch}
          isLoading={loading}
          renderRow={(row, index) => (
            <TableRow key={index}>
              <TableCell>{row.itemCode}</TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell>{row.itemPrice.toLocaleString()}</TableCell>
              <TableCell>{row.discount.toLocaleString()}</TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {(
                    row.itemPrice * row.quantity -
                    row.discount
                  ).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        />

        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            {[
              {
                label: "Tổng tiền hàng (VNĐ):",
                value: po.subTotal.toLocaleString(),
              },
              { label: "Thuế (%):", value: po.taxRate },
              {
                label: "Tiền thuế (VNĐ):",
                value: po.taxAmount.toLocaleString(),
              },
              {
                label: "Tổng cộng (VNĐ):",
                value: po.totalAmount.toLocaleString(),
              },
            ].map((item, index) => (
              <Grid
                container
                key={index}
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item mb={3}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography fontWeight="bold" align="right">
                    {item.value}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={handleSubmit}>
            Tạo đơn bán hàng
          </Button>
          <Button variant="outlined" color="default" onClick={handleCancel}>
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateSo;
