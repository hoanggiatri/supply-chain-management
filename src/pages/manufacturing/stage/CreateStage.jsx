import FormPageLayout from "@/components/layout/FormPageLayout";
import StageDetailTable from "@/components/manufacturing/StageDetailTable";
import StageForm from "@/components/manufacturing/StageForm";
import { Button } from "@/components/ui/button";
import {
    checkIsItemCreatedStage,
    createStage,
} from "@/services/manufacturing/StageService";
import toastrService from "@/services/toastrService";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateStage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [errors, setErrors] = useState({ stageDetailErrors: [] });
  const [stageDetails, setStageDetails] = useState([]);

  const [stage, setStage] = useState({
    companyId,
    stageCode: "",
    itemId: "",
    itemCode: "",
    itemName: "",
    description: "",
    status: "",
  });

  const validateForm = () => {
    const formErrors = {};
    if (!stage.itemCode) formErrors.itemCode = "Phải chọn hàng hóa";
    if (!stage.itemName) formErrors.itemName = "Chưa có tên hàng hóa";
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
          message: "Phải nhập tên công đoạn",
        });
      }
      if (detail.estimatedTime < 0) {
        tableErrors.push({ index, field: "estimatedTime", message: ">= 0" });
      }
    });

    return tableErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStage((prev) => ({ ...prev, [name]: value }));
  };

  const performCreateStage = async () => {
    const request = {
      itemId: stage.itemId,
      description: stage.description,
      status: stage.status,
      stageDetails: stageDetails.map((detail) => ({
        stageName: detail.stageName,
        stageOrder: detail.stageOrder,
        estimatedTime: detail.estimatedTime,
        description: detail.description,
      })),
    };

    try {
      await createStage(request, token);
      toastrService.success("Tạo công đoạn sản xuất thành công!");
      navigate("/stages");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi tạo Stage!"
      );
    }
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
      const checkResult = await checkIsItemCreatedStage(stage.itemId, token);
      const isCreated = checkResult === true || checkResult === "true";

      if (isCreated) {
        const result = await toastrService.confirm(
          "Hàng hóa đã được tạo. Nếu tiếp tục tạo sẽ vô hiệu quy trình sản xuất đã có.",
          "Xác nhận",
          {
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }
        );

        if (result.isConfirmed) {
          await performCreateStage();
        }
      } else {
        await performCreateStage();
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi kiểm tra hoặc tạo Stage!"
      );
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách quy trình", path: "/stages" },
        { label: "Thêm mới" },
      ]}
      backLink="/stages"
      backLabel="Quay lại danh sách"
    >
      <StageForm
        stage={stage}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{ stageCode: true }}
        setStage={setStage}
      />

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
        Danh sách công đoạn
      </h2>

      <StageDetailTable
        stageDetails={stageDetails}
        setStageDetails={setStageDetails}
        errors={errors.stageDetailErrors}
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
          Thêm
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreateStage;
