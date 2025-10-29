import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ItemForm from "@components/general/ItemForm";
import { getItemById, deleteItem } from "@/services/general/ItemService";
import LoadingPaper from "@/components/content-components/LoadingPaper";

const ItemDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getItemById(itemId, token);
        setItem(data);
      } catch (error) {
        alert(error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin hàng hóa!");
      }
    };

    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa hàng hóa này không?")) return;

    const token = localStorage.getItem("token");
    try {
      await deleteItem(itemId, token);
      alert("Xóa hàng hóa thành công!");
      navigate("/items");
    } catch (error) {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi xóa hàng hóa!");
    }
  };

  if (!item) {
    return <LoadingPaper title="THÔNG TIN HÀNG HÓA" />;
  }

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        <Typography className="page-title" variant="h4">
          THÔNG TIN HÀNG HÓA
        </Typography>

        <ItemForm item={item} onChange={() => {}} errors={{}} readOnlyFields={Object.keys(item)} />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="default" onClick={() => navigate(`/item/${itemId}/edit`)}>
            Sửa
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ItemDetail;
