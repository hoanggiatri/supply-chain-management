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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Icon Placeholder */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
            <BuildingOfficeIcon className="w-16 h-16 text-purple-600" />
          </div>
          <div className="text-sm text-gray-500">
            Icon đại diện cho xưởng sản xuất
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <PlantForm
            plant={editedPlant}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
          />

          <div className="mt-6 flex justify-end gap-2 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="button" onClick={handleSave}>
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default EditPlant;
