import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TableRow,
  TableCell,
  Box,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import DataTable from "@/components/content-components/DataTable";
import BomForm from "@/components/manufacturing/BomForm";
import { getBomByItemId, deleteBom } from "@/services/manufacturing/BomService";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const BomDetail = () => {
  const { itemId } = useParams();
  const [bom, setBom] = useState(null);
  const [bomDetails, setBomDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchBom = async () => {
      setLoading(true);
      try {
        const data = await getBomByItemId(itemId, token);
        setBom(data);
        setBomDetails(Array.isArray(data.bomDetails) ? data.bomDetails : []);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi khi lấy thông tin BOM!");
      } finally {
        setLoading(false);
      }
    };
    fetchBom();
  }, [itemId, token]);

  const readOnlyFields = {
    bomCode: true,
    itemCode: true,
    itemName: true,
    description: true,
    status: true,
  };

  const columns = [
    { id: "itemCode", label: "Mã NVL" },
    { id: "itemName", label: "Tên NVL" },
    { id: "quantity", label: "Số lượng" },
    { id: "note", label: "Ghi chú" },
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

  const filteredDetails = Array.isArray(bomDetails)
    ? bomDetails.sort((a, b) => {
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

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa BOM này không?")) return;

    const token = localStorage.getItem("token");
    try {
      await deleteBom(bom.bomId, token);
      alert("Xóa BOM thành công!");
      navigate("/boms");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa BOM!");
    }
  };

  if (!bom) {
    return <LoadingPaper title="THÔNG TIN BOM" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN BOM
        </Typography>

        <BomForm
          bom={bom}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={readOnlyFields}
          setBom={setBom}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH NGUYÊN VẬT LIỆU:
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
              <TableCell>{detail.quantity}</TableCell>
              <TableCell>{detail.note}</TableCell>
            </TableRow>
          )}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate(`/bom/${bom.itemId}/edit`)}
          >
            Sửa
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BomDetail;
