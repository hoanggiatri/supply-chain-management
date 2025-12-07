import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LineForm from "@components/general/LineForm";
import {
  getLineById,
  updateLine,
} from "@/services/general/ManufactureLineService";
import toastrService from "@/services/toastrService";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

const EditLine = () => {
  const { lineId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [line, setLine] = useState(null);
  const [editedLine, setEditedLine] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const validateForm = () => {
    const errors = {};
    const { lineName, lineCode, plantId, capacity } = editedLine;

    if (!plantId) errors.plantId = "Vui lòng chọn xưởng";
    if (!lineName?.trim())
      errors.lineName = "Tên dây chuyền không được để trống";
    if (!lineCode?.trim())
      errors.lineCode = "Mã dây chuyền không được để trống";
    if (capacity && (isNaN(capacity) || Number(capacity) <= 0)) {
      errors.capacity = "Công suất phải lớn hơn 0";
    }
    return errors;
  };

  useEffect(() => {
    const fetchLineById = async () => {
      try {
        const data = await getLineById(lineId, token);
        setLine(data);
        setEditedLine(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Lỗi khi lấy thông tin dây chuyền!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLineById();
  }, [lineId, token]);

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

    setEditedLine((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCancel = () => {
    setEditedLine(line);
    navigate(`/line/${lineId}`);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const updatedLine = await updateLine(lineId, editedLine, token);
      setLine(updatedLine);
      setEditedLine(updatedLine);
      toastrService.success("Cập nhật dây chuyền thành công!");
      navigate(`/line/${lineId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi cập nhật dây chuyền!"
      );
    }
  };

  const readOnlyFields = {
    lineCode: true,
  };

  if (loading) {
    return (
      <FormPageLayout
        breadcrumbItems={[
          { label: "Danh sách dây chuyền", path: "/lines" },
          { label: "Chỉnh sửa" },
        ]}
        backLink="/lines"
      >
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-lg" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </FormPageLayout>
    );
  }

  if (!line) return null;

  return (
    <FormPageLayout
      breadcrumbItems={[
        { label: "Danh sách dây chuyền", path: "/lines" },
        { label: "Chỉnh sửa" },
      ]}
      backLink="/lines"
      backLabel="Quay lại danh sách"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Icon Placeholder */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center shadow-sm">
            <WrenchScrewdriverIcon className="w-16 h-16 text-cyan-600" />
          </div>
          <div className="text-sm text-gray-500">
            Icon đại diện cho dây chuyền
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <LineForm
            line={editedLine}
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

export default EditLine;
