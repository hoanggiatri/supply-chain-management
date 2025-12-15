import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import StageDetailTable from "@/components/manufacturing/StageDetailTable";
import StageForm from "@/components/manufacturing/StageForm";
import { Button } from "@/components/ui/button";
import {
    getStageById,
    updateStage,
} from "@/services/manufacturing/StageService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditStage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stage, setStage] = useState(null);
  const [stageDetails, setStageDetails] = useState([]);
  const [errors, setErrors] = useState({ stageDetailErrors: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stageData = await getStageById(stageId, token);
        setStage({
          ...stageData,
          stageCode: stageData.stageCode || "",
          description: stageData.description || "",
          status: stageData.status || "",
        });
        setStageDetails(stageData.stageDetails || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Có lỗi khi tải dữ liệu!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [stageId, token]);

  const validateForm = () => {
    const formErrors = {};
    if (!stage.stageCode) formErrors.stageCode = "Phải nhập mã công đoạn";
    if (!stage.status?.trim())
      formErrors.status = "Trạng thái không được để trống";
    return formErrors;
  };

  const validateStageDetails = () => {
    const tableErrors = [];

    stageDetails.forEach((detail, index) => {
      if (!detail.stageName?.trim()) {
        tableErrors.push({
          index,
          field: "stageName",
          message: "Tên công đoạn không được để trống",
        });
      }
      if (detail.estimatedTime < 0) {
        tableErrors.push({ index, field: "estimatedTime", message: ">= 0" });
      }
    });

    return tableErrors;
  };

  const readOnlyFields = {
    stageCode: true,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    const stageDetailErrors = validateStageDetails();

    if (
      Object.keys(validationErrors).length > 0 ||
      stageDetailErrors.length > 0
    ) {
      setErrors({ ...validationErrors, stageDetailErrors });
      return;
    }

    try {
      const request = {
        description: stage.description,
        status: stage.status,
      };

      await updateStage(stageId, request, token);
      toastrService.success("Cập nhật công đoạn thành công!");
      navigate(-1);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật công đoạn!"
      );
    }
  };

  if (loading) {
    return <LoadingPaper title="CẬP NHẬT QUY TRÌNH SẢN XUẤT" />;
  }

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách quy trình", path: "/stages" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/stages"
      backLabel="Quay lại danh sách"
    >
      <StageForm
        stage={stage}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={readOnlyFields}
        setStage={setStage}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách công đoạn
      </h2>

      <StageDetailTable
        stageDetails={stageDetails}
        errors={errors.stageDetailErrors}
        readOnly
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/stages")}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default EditStage;
