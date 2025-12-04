import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ItemForm from "@components/general/ItemForm";
import {
  getItemById,
  deleteItem,
  updateItemImage,
} from "@/services/general/ItemService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();

  const fetchItem = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await getItemById(itemId, token);
      setItem(data);
      if (data.imageUrl) {
        setImagePreview(`${data.imageUrl}?t=${Date.now()}`);
      }
    } catch (error) {
      toastrService.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy thông tin hàng hóa!"
      );
    }
  };

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    const token = localStorage.getItem("token");
    try {
      setIsUploading(true);
      await updateItemImage(itemId, imageFile, token);
      toastrService.success("Cập nhật ảnh hàng hóa thành công!");
      setImageFile(null);
      await fetchItem();
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh!"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteItem(itemId, token);
      toastrService.success("Xóa hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      toastrService.error(
        error.response?.data?.message || "Có lỗi xảy ra khi xóa hàng hóa!"
      );
    }
  };

  if (!item) {
    return <LoadingPaper title="THÔNG TIN HÀNG HÓA" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography className="page-title" variant="h4">
            THÔNG TIN HÀNG HÓA
          </Typography>
          <BackButton to="/items" label="Quay lại danh sách" />
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          mb={3}
          gap={2}
        >
          <Box
            component="img"
            src={
              imagePreview ||
              item?.imageUrl ||
              "https://cdn-icons-png.freepik.com/512/2774/2774806.png"
            }
            alt="Item"
            sx={{
              width: 128,
              height: 128,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              {...getButtonProps("outlinedSecondary")}
              type="button"
              className="w-full md:w-auto"
              onClick={() =>
                document.getElementById("item-image-input-detail")?.click()
              }
            >
              Chọn ảnh
            </Button>
            <input
              id="item-image-input-detail"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              {...getButtonProps("primary")}
              type="button"
              className="w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!imageFile || isUploading}
              onClick={handleUploadImage}
            >
              {isUploading ? "Đang cập nhật..." : "Cập nhật ảnh"}
            </Button>
          </Box>
        </Box>

        <ItemForm
          item={item}
          onChange={() => {}}
          errors={{}}
          readOnlyFields={Object.keys(item)}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            type="button"
            {...getButtonProps("primary")}
            onClick={() => navigate(`/item/${itemId}/edit`)}
          >
            Sửa
          </Button>
          <Button
            type="button"
            {...getButtonProps("danger")}
            onClick={() =>
              setConfirmDialog({
                open: true,
                onConfirm: handleDelete,
              })
            }
          >
            Xóa
          </Button>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa hàng hóa này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmButtonProps="danger"
      />
    </Container>
  );
};

export default ItemDetail;
