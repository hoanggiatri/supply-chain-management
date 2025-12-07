import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WarehouseForm from "@components/general/WarehouseForm";
import {
  getWarehouseById,
  updateWarehouse,
} from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import { Button } from "@/components/ui/button";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";

const EditWarehouse = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [editedWarehouse, setEditedWarehouse] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const validateForm = () => {
    const errors = {};
    const { warehouseName, warehouseType, maxCapacity } = editedWarehouse;

    if (!warehouseName?.trim())
      errors.warehouseName = "Tên kho không được để trống";
    if (!warehouseType) errors.warehouseType = "Loại kho không được để trống";
    if (maxCapacity == null || maxCapacity === "")
      errors.maxCapacity = "Sức chứa tối đa không được để trống";
    else if (isNaN(maxCapacity) || maxCapacity <= 0)
      errors.maxCapacity = "Sức chứa phải là số lớn hơn 0";

    return errors;
  };

  useEffect(() => {
    const fetchWarehouse = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getWarehouseById(warehouseId, token);
        setWarehouse(data);
        setEditedWarehouse(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin kho!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === "number") {
      const num = parseFloat(value);
      if (isNaN(num)) {
        newValue = "";
      } else {
        newValue = num < 0 ? 0 : num;
      }
    }

    setEditedWarehouse((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCancel = () => {
    setEditedWarehouse(warehouse);
    navigate(`/warehouse/${warehouseId}`);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const {
        warehouseId: _wid,
        companyId,
        warehouseCode,
        ...payload
      } = editedWarehouse || {};
      const updatedWarehouse = await updateWarehouse(
        warehouseId,
        payload,
        token
      );
      setWarehouse(updatedWarehouse);
      setEditedWarehouse(updatedWarehouse);
      toastrService.success("Cập nhật kho thành công!");
      navigate(`/warehouse/${warehouseId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật kho!"
      );
    }
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbItems={[
          { label: "Danh sách kho", path: "/warehouses" },
          { label: "Chỉnh sửa" },
        ]}
        backLink="/warehouses"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!warehouse) return null;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách kho", path: "/warehouses" },
        { label: "Chỉnh sửa" },
      ]}
      backLink={`/warehouse/${warehouseId}`}
      backLabel="Quay lại chi tiết"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Icon Placeholder */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm">
            <BuildingStorefrontIcon className="w-16 h-16 text-orange-600" />
          </div>
          <div className="text-sm text-gray-500">
            Icon đại diện cho kho hàng
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <WarehouseForm
            warehouse={editedWarehouse}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={{}}
          />

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default EditWarehouse;
