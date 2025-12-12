import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import SupplierRfqForm from "@/components/purchasing/SupplierRfqForm";
import { getRfqById } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import {
  Box,
  Button,
  Container,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SupplierRfqDetail = () => {
  const { rfqId } = useParams();
  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchRfq = async () => {
      setLoading(true);
      try {
        const data = await getRfqById(rfqId, token);
        setRfq(data);
      } catch (error) {
        toastrService.error(error.response?.data?.message || "Lỗi khi tải RFQ");
      } finally {
        setLoading(false);
      }
    };
    fetchRfq();
  }, [rfqId, token]);

  const columns = [
    { id: "supplierItemCode", label: "Mã hàng hóa" },
    { id: "supplierItemName", label: "Tên hàng hóa" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
  ];

  const filteredDetails =
    rfq?.rfqDetails?.sort((a, b) => {
      if (orderBy && a[orderBy] !== undefined && b[orderBy] !== undefined) {
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      }
      return 0;
    }) || [];

  const paginatedDetails = filteredDetails.slice(
    (page - 1) * rowsPerPage,
    (page - 1) * rowsPerPage + rowsPerPage
  );

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (!rfq) return <LoadingPaper title="THÔNG TIN YÊU CẦU BÁO GIÁ" />;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN YÊU CẦU BÁO GIÁ
        </Typography>
        {rfq.status === "Chưa báo giá" && (
          <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="default"
              onClick={() => navigate(`/create-quotation/${rfqId}`)}
            >
              Gửi báo giá
            </Button>
          </Box>
        )}
        <SupplierRfqForm rfq={rfq} />
        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH HÀNG HÓA YÊU CẦU BÁO GIÁ:
        </Typography>
        <DataTable
          rows={paginatedDetails}
          columns={columns}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(1);
          }}
          search={search}
          setSearch={setSearch}
          isLoading={loading}
          renderRow={(detail, index) => (
            <TableRow key={index}>
              <TableCell>{detail.supplierItemCode}</TableCell>
              <TableCell>{detail.supplierItemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default SupplierRfqDetail;
