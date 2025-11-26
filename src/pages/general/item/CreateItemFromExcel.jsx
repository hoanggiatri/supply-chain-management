import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";
import DataTable from "@/components/content-components/DataTable";
import useExcelUpload from "@/hooks/useExcelUpload";
import { useNavigate } from "react-router-dom";
import { createItem } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const CreateItemFromExcel = () => {
  const navigate = useNavigate();
  const { excelData: initialExcelData, handleExcelUpload } = useExcelUpload();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemName");
  const [page, setPage] = useState(1);
  const companyId = localStorage.getItem("companyId");
  const token = localStorage.getItem("token");
  const [excelData, setExcelData] = useState(initialExcelData || []);
  const [fileName, setFileName] = useState("");

  const columns = [
    { id: "itemName", label: "Tên hàng hóa" },
    { id: "itemType", label: "Loại hàng hóa" },
    { id: "uom", label: "Đơn vị tính" },
    { id: "technicalSpecifications", label: "Thông số kỹ thuật" },
    { id: "importPrice", label: "Giá nhập" },
    { id: "exportPrice", label: "Giá xuất" },
    { id: "description", label: "Mô tả" },
    { id: "isSellable", label: "Hàng bán" },
  ];

  const handleDataLoaded = (data) => {
    console.log("Dữ liệu đã được tải lên:", data);

    const mappedData = data.map((item) => ({
      itemName: item["Tên hàng hóa"],
      itemType: item["Loại hàng hóa"],
      uom: item["Đơn vị tính"],
      importPrice: item["Giá nhập"],
      exportPrice: item["Giá xuất"],
      technicalSpecifications: item["Thông số kỹ thuật"],
      description: item["Mô tả"],
      isSellable: item["Hàng bán"],
    }));

    setExcelData(mappedData);
  };

  const handleSubmit = async () => {
    try {
      for (const item of excelData) {
        const newItemData = {
          itemName: item.itemName || "",
          itemType: item.itemType || "",
          uom: item.uom || "",
          importPrice: item.importPrice || 0,
          exportPrice: item.exportPrice || 0,
          technicalSpecifications: item.technicalSpecifications || "",
          description: item.description || "",
          isSellable: item.isSellable || false,
        };

        console.log("Thêm item:", newItemData);

        await createItem(companyId, newItemData, token);
      }

      toastrService.success("Thêm tất cả hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi thêm hàng hóa!"
      );
    }
  };

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          NHẬP HÀNG HÓA TỪ EXCEL
        </Typography>

        <Grid container spacing={2} mt={3} mb={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Button
                type="button"
                {...getButtonProps("primary")}
                component="label"
              >
                Tải file Excel
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  hidden
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      setFileName(e.target.files[0].name);
                      handleExcelUpload(e, handleDataLoaded);
                    }
                  }}
                />
              </Button>
              {fileName && (
                <Typography variant="body1" ml={1}>
                  {fileName}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {excelData.length > 0 && (
          <>
            <DataTable
              rows={excelData}
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
              onPageChange={(_, newPage) => setPage(newPage + 1)}
              onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
              search={search}
              setSearch={setSearch}
              renderRow={(row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => {
                    if (column.id === "isSellable") {
                      return (
                        <TableCell key={column.id}>
                          {row[column.id] === 1 || row[column.id] === "1"
                            ? "Có"
                            : "Không"}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    );
                  })}
                </TableRow>
              )}
            />
            <Grid container spacing={2} mt={3} justifyContent="flex-end">
              <Grid item>
                <Button
                  type="button"
                  {...getButtonProps("primary")}
                  onClick={handleSubmit}
                >
                  Thêm tất cả
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  {...getButtonProps("outlinedSecondary")}
                  onClick={() => navigate("/items")}
                >
                  Hủy
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CreateItemFromExcel;
