import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { createPlant } from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import PlantForm from "@components/general/PlantForm";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePlant = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [plant, setPlant] = useState({
    plantName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlant((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!plant.plantName.trim())
      newErrors.plantName = "Tên xưởng không được để trống";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { companyId: _cid, ...payload } = plant || {};
      await createPlant(companyId, payload, token);
      toastrService.success("Tạo xưởng thành công!");
      navigate("/plants");
    } catch (err) {
      toastrService.error(err.response?.data?.message || "Lỗi khi tạo xưởng!");
    }
  };

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách xưởng", path: "/plants" },
        { label: "Thêm mới" },
      ]}
      backLink="/plants"
      backLabel="Quay lại danh sách"
    >
      <PlantForm
        plant={plant}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{}}
      />

      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={() => navigate("/plants")}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 gap-2 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default CreatePlant;
