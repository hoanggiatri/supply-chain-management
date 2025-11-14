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
import DataTable from "@components/content-components/DataTable";
import { useNavigate } from "react-router-dom";
import { getAllPlantsInCompany } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";

const PlantInCompany = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("plantName");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const result = await getAllPlantsInCompany(companyId, token);
        setPlants(result);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi tải danh sách xưởng!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && token) {
      fetchPlants();
    }
  }, [companyId, token]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const columns = [
    { id: "plantCode", label: "Mã xưởng" },
    { id: "plantName", label: "Tên xưởng" },
    { id: "description", label: "Mô tả" },
  ];

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          DANH SÁCH XƯỞNG SẢN XUẤT
        </Typography>

        <Box mt={3} mb={3}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate("/create-plant")}
          >
            Thêm mới
          </Button>
        </Box>

        <DataTable
          rows={plants}
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
          renderRow={(plant) => (
            <TableRow
              key={plant.plantId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/plant/${plant.plantId}`)}
            >
              <TableCell>{plant.plantCode}</TableCell>
              <TableCell>{plant.plantName}</TableCell>
              <TableCell>{plant.description}</TableCell>
            </TableRow>
          )}
        />
      </Paper>
    </Container>
  );
};

export default PlantInCompany;
