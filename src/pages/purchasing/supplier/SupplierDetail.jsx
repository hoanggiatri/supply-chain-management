import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Box, TableRow, TableCell, Button } from "@mui/material";
import CompanyForm from "@components/general/CompanyForm";
import DataTable from "@components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getCompanyById } from "@/services/general/CompanyService";
import { getAllItemsInCompany } from "@/services/general/ItemService";

const SupplierDetail = () => {
  const { supplierId } = useParams();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyData = await getCompanyById(supplierId, token);
        setCompany(companyData);

        const itemData = await getAllItemsInCompany(supplierId, token);
        const sellableItems = itemData.filter(item => item.isSellable === true);
        setItems(sellableItems);

      } catch (error) {
        alert("Lỗi khi tải dữ liệu nhà cung cấp!");
      }
    };

    fetchData();
  }, [supplierId, token]);

  if (!company) return <LoadingPaper title="THÔNG TIN NHÀ CUNG CẤP" />;

  const columns = [
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "uom", label: "Đơn vị tính" },
    { id: "technicalSpecifications", label: "Thông số kỹ thuật" },
    { id: "description", label: "Mô tả" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">THÔNG TIN NHÀ CUNG CẤP</Typography>

        <Box mt={3} mb={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-rfq", { state: { supplierId } })}
          >
            Yêu cầu báo giá
          </Button>
        </Box>

        <CompanyForm companyData={company} readOnly onChange={() => { }} errors={{}} />

        <Box mt={5}>
          <Typography variant="h5" mb={3}>DANH SÁCH HÀNG HÓA:</Typography>
          <DataTable
            rows={items}
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
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(1);
            }}
            renderRow={(item) => (
              <TableRow key={item.itemId}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>{item.technicalSpecifications}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            )}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default SupplierDetail;
