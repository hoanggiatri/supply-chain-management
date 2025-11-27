import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteStage,
  getStageById,
} from "@/services/manufacturing/StageService";
import toastrService from "@/services/toastrService";
import StageForm from "@/components/manufacturing/StageForm";
import DataTable from "@/components/content-components/DataTable";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import BackButton from "@/components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";

const StageDetail = () => {
  const { stageId } = useParams();
  const [stage, setStage] = useState(null);
  const [stageDetails, setStageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
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

  const handleDelete = async () => {
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

  const sortedDetails = Array.isArray(stageDetails)
    ? [...stageDetails].sort((a, b) => {
        if (orderBy) {
          if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
          if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  return (
    <div className="p-6">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              THÔNG TIN QUY TRÌNH SẢN XUẤT
            </Typography>
            <BackButton to="/stages" label="Quay lại danh sách" />
          </div>

          <StageForm
            stage={stage}
            onChange={() => {}}
            errors={{}}
            readOnlyFields={readOnlyFields}
            setStage={setStage}
          />

          <Typography variant="h5" color="blue-gray" className="mt-6 mb-4">
            DANH SÁCH CÔNG ĐOẠN
          </Typography>

          <DataTable
            rows={sortedDetails}
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
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(Number(event.target.value))
            }
            search={search}
            setSearch={setSearch}
            loading={loading}
            renderRow={(detail, index) => {
              const isLast = index === sortedDetails.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
              return (
                <tr key={`${detail.stageOrder}-${detail.stageName}-${index}`}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.stageOrder}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.stageName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.estimatedTime}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {detail.description || "-"}
                    </Typography>
                  </td>
                </tr>
              );
            }}
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={() => navigate(`/stage/${stageId}/edit`)}
            >
              Sửa
            </Button>
            <Button
              type="button"
              {...getButtonProps("danger")}
              onClick={() =>
                setConfirmDialog({
                  open: true,
                  onConfirm: handleDelete,
                })
              }
            >
              Xóa
            </Button>
          </div>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa công đoạn này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmButtonProps="danger"
      />
    </div>
  );
};

export default StageDetail;
