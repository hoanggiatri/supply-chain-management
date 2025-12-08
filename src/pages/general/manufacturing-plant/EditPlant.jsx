import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlantForm from "@components/general/PlantForm";
import {
  getPlantById,
  updatePlant,
} from "@/services/general/ManufacturePlantService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, X } from "lucide-react";
import { BuildingOfficeIcon } from "@heroicons/react/24/solid";

const EditPlant = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [editedPlant, setEditedPlant] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const validateForm = () => {
    const errors = {};
    const { plantName, plantCode } = editedPlant;

    if (!plantName?.trim()) errors.plantName = "Tên xưởng không được để trống";
    if (!plantCode?.trim()) errors.plantCode = "Mã xưởng không được để trống";

    return errors;
  };

  useEffect(() => {
    const fetchPlant = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getPlantById(plantId, token);
        setPlant(data);
        setEditedPlant(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin xưởng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [plantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditedPlant(plant);
    navigate(`/plant/${plantId}`);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const { companyId, plantCode, plantId, ...payload } = editedPlant || {};
      const updatedPlant = await updatePlant(plantId, payload, token);
      setPlant(updatedPlant);
      setEditedPlant(updatedPlant);
      toastrService.success("Cập nhật xưởng thành công!");
      navigate(`/plant/${plantId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật xưởng!"
      );
    }
  };

  const readOnlyFields = {
    plantCode: true,
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbItems={[
          { label: "Danh sách xưởng", path: "/plants" },
          { label: "Chỉnh sửa" },
        ]}
        backLink="/plants"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!plant) return null;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách xưởng", path: "/plants" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/plants"
      backLabel="Quay lại danh sách"
    >
      <PlantForm
        plant={editedPlant}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={readOnlyFields}
      />

      <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 gap-2 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default EditPlant;
