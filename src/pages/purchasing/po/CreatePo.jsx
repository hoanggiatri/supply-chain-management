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
import { getQuotationById } from "@/services/sale/QuotationService";
import { createPo } from "@/services/purchasing/PoService";
import PoForm from "@/components/purchasing/PoForm";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import DataTable from "@/components/content-components/DataTable";
import toastrService from "@/services/toastrService";

const CreatePo = () => {
  const { quotationId } = useParams();
  const token = localStorage.getItem("token");
  const employeeName = localStorage.getItem("employeeName");
  const companyAddress = localStorage.getItem("companyAddress");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [quotation, setQuotation] = useState(null);
  const [po, setPo] = useState({});
  const [quotationDetails, setQuotationDetails] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const quotationData = await getQuotationById(quotationId, token);
        setQuotation(quotationData);

        setPo({
          companyId: quotationData.requestCompanyId,
          supplierCompanyId: quotationData.companyId,
          quotationId: quotationData.quotationId,
          paymentMethod: "Ghi công nợ",
          receiveWarehouseId: "",
          createdBy: employeeName,
          deliveryToAddress: companyAddress,
          status: "Chờ xác nhận",
        });

        const details = quotationData.quotationDetails.map((d) => ({
          itemId: d.customerItemId,
          itemCode: d.customerItemCode,
          itemName: d.customerItemName,
          discount: d.discount,
          quantity: d.quantity,
          note: d.note,
          supplierItemId: d.itemId,
          supplierItemCode: d.itemCode,
          supplierItemName: d.itemName,
          itemPrice: d.itemPrice,
        }));
        setQuotationDetails(details);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotationId, employeeName, companyAddress, token]);

  const validate = () => {
    const newErrors = {};
    if (!po.receiveWarehouseId)
      newErrors.receiveWarehouseId = "Chưa chọn kho nhập hàng về!";
    if (!po.deliveryToAddress.trim())
      newErrors.deliveryToAddress = "Địa chỉ giao hàng không được để trống";
    if (!po.paymentMethod)
      newErrors.paymentMethod = "Chưa chọn phương thức thanh toán";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Only send allowed fields, exclude read-only and computed fields
      const request = {
        companyId: Number(po.companyId),
        supplierCompanyId: Number(po.supplierCompanyId),
        quotationId: Number(po.quotationId),
        receiveWarehouseId: Number(po.receiveWarehouseId),
        paymentMethod: po.paymentMethod,
        deliveryToAddress: po.deliveryToAddress,
        createdBy: po.createdBy,
        status: po.status,
      };
      await createPo(request, token);
      toastrService.success("Tạo đơn mua hàng thành công!");
      navigate("/customer-quotations");
    } catch (err) {
      toastrService.error(
        err.response?.data?.message || "Không thể tạo đơn mua hàng!"
      );
    }
  };

  const columns = [
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "supplierItemCode", label: "Mã hàng hóa NCC" },
    { id: "supplierItemName", label: "Tên hàng hóa NCC" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
    { id: "itemPrice", label: "Đơn giá (VNĐ)" },
    { id: "discount", label: "Chiết khấu (VNĐ)" },
    { id: "total", label: "Thành tiền (VNĐ)" },
  ];

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

  const filteredDetails = Array.isArray(quotationDetails)
    ? quotationDetails.sort((a, b) => {
        if (orderBy) {
          if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  if (!quotation) return <LoadingPaper title="TẠO ĐƠN MUA HÀNG" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          TẠO ĐƠN MUA HÀNG
        </Typography>

        <PoForm
          po={po}
          setPo={setPo}
          quotation={quotation}
          errors={errors}
          readOnlyFields={[]}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA BÁO GIÁ:
        </Typography>

        <DataTable
          rows={paginatedDetails}
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
          isLoading={loading}
          renderRow={(detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.itemCode}</TableCell>
              <TableCell>{detail.itemName}</TableCell>
              <TableCell>{detail.supplierItemCode}</TableCell>
              <TableCell>{detail.supplierItemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
              <TableCell>{detail.itemPrice.toLocaleString()}</TableCell>
              <TableCell>{detail.discount.toLocaleString()}</TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {(
                    detail.itemPrice * detail.quantity -
                    detail.discount
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
                value: quotation.subTotal.toLocaleString(),
              },
              { label: "Thuế (%):", value: quotation.taxRate },
              {
                label: "Tiền thuế (VNĐ):",
                value: quotation.taxAmount.toLocaleString(),
              },
              {
                label: "Tổng cộng (VNĐ):",
                value: quotation.totalAmount.toLocaleString(),
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
            Tạo đơn mua hàng
          </Button>
          <Button
            variant="outlined"
            color="default"
            onClick={() => navigate(-1)}
          >
            Hủy
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePo;
