import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getWarehouseById,
    updateWarehouse,
} from "@/services/general/WarehouseService";
import toastrService from "@/services/toastrService";
import WarehouseForm from "@components/general/WarehouseForm";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
      
      // Ensure maxCapacity is a number
      if (payload.maxCapacity !== undefined) {
        payload.maxCapacity = Number(payload.maxCapacity);
      }
      
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
      <WarehouseForm
        warehouse={editedWarehouse}
        onChange={handleChange}
        errors={errors}
        readOnlyFields={{}}
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Hủy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleSave}
          className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          <Save className="w-4 h-4" />
          Lưu
        </Button>
      </div>
    </FormPageLayout>
  );
};

export default EditWarehouse;
