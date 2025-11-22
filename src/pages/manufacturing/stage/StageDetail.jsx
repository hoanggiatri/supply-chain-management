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
import StageForm from "@/components/manufacturing/StageForm";
import {
  deleteStage,
  getStageById,
} from "@/services/manufacturing/StageService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";

const StageDetail = () => {
  const { stageId } = useParams();
  const [stage, setStage] = useState(null);
  const [stageDetails, setStageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("stageOrder");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchStage = async () => {
      setLoading(true);
      try {
        const data = await getStageById(stageId, token);
        setStage(data);
        setStageDetails(
          Array.isArray(data.stageDetails) ? data.stageDetails : []
        );
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi lấy thông tin công đoạn!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStage();
  }, [stageId, token]);

  const readOnlyFields = {
    stageCode: true,
    stageName: true,
    description: true,
    status: true,
  };

  const columns = [
    { id: "stageOrder", label: "Thứ tự" },
    { id: "stageName", label: "Tên công đoạn" },
    { id: "estimatedTime", label: "Thời gian dự kiến (phút)" },
    { id: "description", label: "Ghi chú" },
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

  const filteredDetails = Array.isArray(stageDetails)
    ? stageDetails.sort((a, b) => {
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
    if (!window.confirm("Bạn có chắc muốn xóa công đoạn này không?")) return;
    try {
      await deleteStage(stage.stageId, token);
      toastrService.success("Xóa công đoạn thành công!");
      navigate("/stages");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi khi xóa công đoạn!"
      );
    }
  };

  if (!stage) {
    return <LoadingPaper title="THÔNG TIN QUY TRÌNH SẢN XUẤT" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN QUY TRÌNH SẢN XUẤT
        </Typography>

        <StageForm
          stage={stage}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={readOnlyFields}
          setStage={setStage}
        />

        <Typography variant="h5" mt={3} mb={3}>
          DANH SÁCH CÔNG ĐOẠN:
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
              <TableCell>{detail.stageOrder}</TableCell>
              <TableCell>{detail.stageName}</TableCell>
              <TableCell>{detail.estimatedTime}</TableCell>
              <TableCell>{detail.description}</TableCell>
            </TableRow>
          )}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="default"
            onClick={() => navigate(`/stage/${stageId}/edit`)}
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

export default StageDetail;
