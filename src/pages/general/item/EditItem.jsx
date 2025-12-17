import ImageUpload from "@/components/common/ImageUpload";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import { Button } from "@/components/ui/button";
import { getItemById, updateItem, updateItemImage } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import ItemForm from "@components/general/ItemForm";
import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [errors, setErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const validateForm = () => {
    const errors = {};
    const { itemName, itemType, uom, importPrice, exportPrice, isSellable } =
      editedItem;

    if (!itemName?.trim()) errors.itemName = "Tên hàng hóa không được để trống";
    if (!itemType) errors.itemType = "Loại hàng hóa không được để trống";
    if (!uom) errors.uom = "Đơn vị tính không được để trống";

    if (importPrice && (isNaN(importPrice) || Number(importPrice) <= 0)) {
      errors.importPrice = "Giá nhập phải là số và lớn hơn 0 nếu nhập";
    }
    if (exportPrice && (isNaN(exportPrice) || Number(exportPrice) <= 0)) {
      errors.exportPrice = "Giá xuất phải là số và lớn hơn 0 nếu nhập";
    }
    if (isSellable && !exportPrice) {
      errors.exportPrice = "Giá xuất không được để trống nếu là hàng bán";
    }

    return errors;
  };

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getItemById(itemId, token);
        setItem(data);
        setEditedItem(data);
        setImagePreview(data.imageUrl);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy thông tin hàng hóa!"
        );
      }
    };

    fetchItem();
  }, [itemId]);

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

    setEditedItem((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleCancel = () => {
    setEditedItem(item);
    navigate(`/item/${itemId}`);
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // 1. Update Info (JSON)
      // Exclude itemCode and companyId as they are not allowed to be updated
      const itemData = {
        itemName: editedItem.itemName,
        itemType: editedItem.itemType,
        uom: editedItem.uom,
        technicalSpecifications: editedItem.technicalSpecifications,
        description: editedItem.description,
        importPrice: editedItem.importPrice,
        exportPrice: editedItem.exportPrice,
        isSellable: editedItem.isSellable,
      };

      const updatedItem = await updateItem(itemId, itemData, token);

      // 2. Update Image (if changed)
      if (imageFile) {
        await updateItemImage(itemId, imageFile, token);
      }

      // Update local state with the result from updateItem (which contains updated info)
      // Note: If image was updated, updatedItem might not have the new URL immediately depending on backend response,
      // but we can rely on the fact that the operation succeeded.
      setItem(updatedItem);
      setEditedItem(updatedItem);

      toastrService.success("Cập nhật thông tin hàng hóa thành công!");
      navigate(`/item/${itemId}`);
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật thông tin hàng hóa!"
      );
    }
  };

  if (!item) {
    return <LoadingPaper title="CHỈNH SỬA HÀNG HÓA" />;
  }

  const readOnlyFields = {
    itemCode: true,
  };

  const breadcrumbs = (
    <>
      <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate("/items")}>Danh sách</span>
      <span>/</span>
      <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate(`/item/${itemId}`)}>Chi tiết hàng hóa</span>
      <span>/</span>
      <span className="text-gray-900 font-medium">Chỉnh sửa</span>
    </>
  );

  return (
    <FormPageLayout breadcrumbs={breadcrumbs} backLink={`/item/${itemId}`}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Image Upload */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <ImageUpload
            previewUrl={imagePreview}
            onFileChange={handleImageChange}
            inputId="item-image-input"
          />
        </div>

        {/* Right Column: Form */}
        <div className="w-full md:w-2/3 flex flex-col">
          <ItemForm
            item={editedItem}
            onChange={handleChange}
            errors={errors}
            readOnlyFields={readOnlyFields}
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
        </div>
      </div>
    </FormPageLayout>
  );
};

export default EditItem;
