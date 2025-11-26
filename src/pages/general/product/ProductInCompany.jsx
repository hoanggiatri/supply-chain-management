import React, { useEffect, useState } from "react";
import {
  Container,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import DataTable from "@components/content-components/DataTable";
import { getAllProductsByCompany } from "@/services/general/ProductService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const ProductInCompany = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("serialNumber");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProductsByCompany(companyId, token);
        setProducts(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách sản phẩm!"
        );
      }
    };

    fetchProducts();
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

  const columns = [
    { id: "serialNumber", label: "Số Serial" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "batchNumber", label: "Số lô (Batch)" },
    { id: "status", label: "Trạng thái" },
    { id: "createdDate", label: "Ngày tạo" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH SẢN PHẨM (QR)
        </Typography>
        <Box mt={3} mb={3} display="flex" gap={2}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-product")}
          >
            Thêm mới
          </Button>
          <Button
            type="button"
            {...getButtonProps("secondary")}
            onClick={() => navigate("/scan-qr")}
          >
            Quét QR
          </Button>
        </Box>
        <DataTable
          rows={products}
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
          renderRow={(product) => (
            <TableRow
              key={product.productId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <TableCell>{product.serialNumber || ""}</TableCell>
              <TableCell>{product.item?.itemName || ""}</TableCell>
              <TableCell>{product.batchNumber || ""}</TableCell>
              <TableCell>{product.status || "Active"}</TableCell>
              <TableCell>
                {product.createdDate
                  ? new Date(product.createdDate).toLocaleDateString()
                  : ""}
              </TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default ProductInCompany;
