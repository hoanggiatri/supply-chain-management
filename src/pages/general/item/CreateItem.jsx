import ImageUpload from "@/components/common/ImageUpload";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { createItem, updateItemImage } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import ItemForm from "@components/general/ItemForm";
import { useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateItem = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const [errors, setErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    isSellable: true,
    uom: "",
    technicalSpecifications: "",
    description: "",
    importPrice: 0,
    exportPrice: 0,
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.itemName?.trim())
      errors.itemName = "Tên hàng hóa không được để trống";
    if (!formData.itemType?.trim())
      errors.itemType = "Loại hàng hóa không được để trống";
    if (!formData.uom?.trim()) errors.uom = "Đơn vị tính không được để trống";
    if (
      formData.importPrice &&
      (isNaN(formData.importPrice) || Number(formData.importPrice) <= 0)
    ) {
      errors.importPrice = "Giá nhập phải là số và lớn hơn 0 nếu nhập";
    }
    if (
      formData.exportPrice &&
      (isNaN(formData.exportPrice) || Number(formData.exportPrice) <= 0)
    ) {
      errors.exportPrice = "Giá xuất phải là số và lớn hơn 0 nếu nhập";
    }
    if (formData.isSellable && !formData.exportPrice) {
      errors.exportPrice = "Giá xuất không được để trống nếu là hàng bán";
    }
    return errors;
  };

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

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // 1. Create Item (JSON)
      const payload = {
        ...formData,
        // Ensure numbers are numbers
        importPrice: Number(formData.importPrice) || 0,
        exportPrice: Number(formData.exportPrice) || 0,
      };

      const newItem = await createItem(companyId, payload, token);

      // 2. Upload Image (if selected)
      if (imageFile && newItem?.itemId) {
        try {
          await updateItemImage(newItem.itemId, imageFile, token);
        } catch (imageError) {
          console.error("Failed to upload image:", imageError);
          toastrService.warning("Tạo hàng hóa thành công nhưng lỗi tải ảnh!");
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["items", companyId] });
      toastrService.success("Thêm hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Lỗi khi thêm hàng hóa!"
      );
    }
  };

  const handleCancel = () => {
    navigate("/items");
  };

  const handleNavigateToExcelPage = () => {
    navigate("/create-item-from-excel");
  };

  const breadcrumbs = (
    <>
      <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate("/items")}>Danh sách</span>
      <span>/</span>
      <span className="text-gray-900 font-medium">Thêm mới hàng hóa</span>
    </>
  );

  return (
    <FormPageLayout breadcrumbs={breadcrumbs} backLink="/items">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Image Upload */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageUpload
            previewUrl={imagePreview}
            onFileChange={handleImageChange}
            inputId="item-image-input"
          >
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleNavigateToExcelPage}
                className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Nhập từ Excel
              </Button>
            </div>
          </ImageUpload>
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <ItemForm
            item={formData}
            onChange={handleChange}
            errors={errors}
            hiddenFields={{ itemCode: true }}
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
              onClick={handleSubmit}
              className="gap-2 bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              <Save className="w-4 h-4" />
              Thêm
            </Button>
          </div>
        </div>
      </div>
    </FormPageLayout>
  );
};

export default CreateItem;
