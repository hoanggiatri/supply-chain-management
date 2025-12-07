import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPlant } from "@/services/general/ManufacturePlantService";
import PlantForm from "@components/general/PlantForm";
import toastrService from "@/services/toastrService";
import { Button } from "@/components/ui/button";
import FormPageLayout from "@/components/layout/FormPageLayout";

const CreatePlant = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  const [plant, setPlant] = useState({
    plantCode: "",
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
      const { companyId: _cid, plantCode, ...payload } = plant || {};
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

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={() => navigate("/plants")}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </div>
    </FormPageLayout>
  );
};

export default CreatePlant;
