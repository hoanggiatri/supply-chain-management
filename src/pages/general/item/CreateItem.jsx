import React, { useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createItem } from "@/services/general/ItemService";
import ItemForm from "@components/general/ItemForm";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";

const CreateItem = () => {
  const navigate = useNavigate();
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
      let payload = formData;

      // Nếu có chọn ảnh thì dùng FormData để gửi kèm file
      if (imageFile) {
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          // Tránh undefined/null bị chuyển thành "undefined"/"null"
          formDataToSend.append(key, value ?? "");
        });
        formDataToSend.append("file", imageFile);
        payload = formDataToSend;
      }

      await createItem(companyId, payload, token);
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

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <div className="flex items-center justify-between mb-4">
          <Typography className="page-title" variant="h4">
            THÊM MỚI HÀNG HÓA
          </Typography>
          <BackButton to="/items" label="Quay lại danh sách" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={
              imagePreview ||
              "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
            }
            alt="Item"
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button
              {...getButtonProps("outlinedSecondary")}
              type="button"
              className="w-full md:w-auto"
              onClick={() =>
                document.getElementById("item-image-input")?.click()
              }
            >
              Chọn ảnh
            </Button>
            <input
              id="item-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <ItemForm
          item={formData}
          onChange={handleChange}
          errors={errors}
          readOnlyFields={{ itemCode: true }}
        />

        <Grid container spacing={2} mt={3} justifyContent="flex-end">
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("success")}
              onClick={handleNavigateToExcelPage}
            >
              Nhập từ Excel
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("primary")}
              onClick={handleSubmit}
            >
              Thêm
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="button"
              {...getButtonProps("outlinedSecondary")}
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CreateItem;
