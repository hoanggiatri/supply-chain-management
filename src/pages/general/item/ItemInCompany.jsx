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
import { getAllItemsInCompany } from "@/services/general/ItemService";
import { useNavigate } from "react-router-dom";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const ItemInCompany = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemCode");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getAllItemsInCompany(companyId, token);
        setItems(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách hàng hóa!"
        );
      }
    };

    fetchItems();
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
    { id: "itemCode", label: "Mã hàng hóa" },
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "itemType", label: "Loại hàng hóa" },
    { id: "uom", label: "Đơn vị tính" },
    { id: "technicalSpecifications", label: "Thông số kỹ thuật" },
    { id: "importPrice", label: "Giá nhập" },
    { id: "exportPrice", label: "Giá xuất" },
    { id: "description", label: "Mô tả" },
    { id: "isSellable", label: "Hàng bán" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH HÀNG HÓA
        </Typography>
        <Box mt={3} mb={3}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate("/create-item")}
          >
            Thêm mới
          </Button>
        </Box>
        <DataTable
          rows={items}
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
          renderRow={(item) => (
            <TableRow
              key={item.itemId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/item/${item.itemId}`)}
            >
              <TableCell>{item.itemCode || ""}</TableCell>
              <TableCell>{item.itemName || ""}</TableCell>
              <TableCell>{item.itemType || ""}</TableCell>
              <TableCell>{item.uom || ""}</TableCell>
              <TableCell>{item.technicalSpecifications || ""}</TableCell>
              <TableCell>
                {item.importPrice !== null
                  ? item.importPrice.toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>
                {item.exportPrice !== null
                  ? item.exportPrice.toLocaleString()
                  : ""}
              </TableCell>
              <TableCell>{item.description || ""}</TableCell>
              <TableCell>{item.isSellable ? "Có" : "Không"}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default ItemInCompany;
