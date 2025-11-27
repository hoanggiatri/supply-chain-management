import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ItemForm from "@components/general/ItemForm";
import { getItemById, deleteItem } from "@/services/general/ItemService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getItemById(itemId, token);
        setItem(data);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy thông tin hàng hóa!"
        );
      }
    };

    fetchItem();
  }, [itemId]);

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
