import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import StageForm from "@/components/manufacturing/StageForm";
import { Button } from "@/components/ui/button";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import {
    deleteStage,
    getStageById,
} from "@/services/manufacturing/StageService";
import toastrService from "@/services/toastrService";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    {
      accessorKey: "stageOrder",
      header: createSortableHeader("Thứ tự"),
    },
    {
      accessorKey: "stageName",
      header: createSortableHeader("Tên công đoạn"),
    },
    {
      accessorKey: "estimatedTime",
      header: createSortableHeader("Thời gian dự kiến (phút)"),
    },
    {
      accessorKey: "description",
      header: createSortableHeader("Ghi chú"),
      cell: ({ getValue }) => getValue() || "-",
    },
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

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách quy trình", path: "/stages" },
        { label: "Chi tiết" },
      ]}
      backLink="/stages"
      backLabel="Quay lại danh sách"
    >
      <StageForm
        stage={stage}
        onChange={() => {}}
        errors={{}}
        readOnlyFields={readOnlyFields}
        setStage={setStage}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách công đoạn
      </h2>

      <DataTable
        columns={columns}
        data={stageDetails}
        loading={loading}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="default"
          onClick={() => navigate(`/stage/${stageId}/edit`)}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="w-4 h-4" />
          Sửa
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() =>
            setConfirmDialog({
              open: true,
              onConfirm: handleDelete,
            })
          }
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Xóa
        </Button>
      </div>

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
    </FormPageLayout>
  );
};

export default StageDetail;
