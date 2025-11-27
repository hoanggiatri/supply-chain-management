import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  transferProduct,
} from "@/services/general/ProductService";
import { getAllCompanies } from "@/services/general/CompanyService";
import ProductQRCode from "@/components/general/product/ProductQRCode";
import toastrService from "@/services/toastrService";
import { Button } from "@material-tailwind/react";
import { getButtonProps } from "@/utils/buttonStyles";
import BackButton from "@components/common/BackButton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [transferCompanyId, setTransferCompanyId] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductById(productId, token);
        setProduct(productData);

        try {
          const companiesData = await getAllCompanies(token);
          if (Array.isArray(companiesData)) {
            setCompanies(companiesData);
          } else if (companiesData.content) {
            setCompanies(companiesData.content);
          } else {
            setCompanies([]);
          }
        } catch (e) {
          console.error("Failed to load companies", e);
        }
      } catch (error) {
        toastrService.error("Lỗi khi tải thông tin sản phẩm");
      }
    };
    fetchData();
  }, [productId, token]);

  const handleTransfer = async () => {
    if (!transferCompanyId) {
      toastrService.warning("Vui lòng chọn công ty để chuyển");
      return;
    }
    if (
      product.company &&
      (String(transferCompanyId) === String(product.company.companyId) ||
        String(transferCompanyId) === String(product.company.id))
    ) {
      toastrService.error("Không thể chuyển sản phẩm về cùng một công ty!");
      return;
    }
    try {
      await transferProduct(productId, transferCompanyId, token);
      toastrService.success("Chuyển sản phẩm thành công!");
      const updated = await getProductById(productId, token);
      setProduct(updated);
    } catch (error) {
      toastrService.error("Lỗi khi chuyển sản phẩm");
    }
  };

  if (!product)
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );

  return (
    <Container>
      <Paper className="paper-container" elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h4" gutterBottom className="!mb-0">
            CHI TIẾT SẢN PHẨM
          </Typography>
          <BackButton to="/products" label="Quay lại danh sách" />
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              <Typography variant="subtitle1">
                <strong>Tên Hàng Hóa:</strong> {product.item?.itemName}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Mã Hàng Hóa:</strong> {product.item?.itemCode}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Số Serial:</strong> {product.serialNumber}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Số Lô (Batch):</strong> {product.batchNumber}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Trạng Thái:</strong> {product.status}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Công Ty Hiện Tại:</strong>{" "}
                {product.company?.name || "N/A"}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Ngày Tạo:</strong>{" "}
                {new Date(product.createdDate).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Chuyển Sản Phẩm (Transfer)
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                select
                label="Chọn Công Ty Đích"
                size="small"
                sx={{ width: 250 }}
                value={transferCompanyId}
                onChange={(e) => setTransferCompanyId(e.target.value)}
              >
                {companies.map((comp) => (
                  <MenuItem key={comp.companyId} value={comp.companyId}>
                    {comp.companyName || comp.name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="button"
                {...getButtonProps("warning")}
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    onConfirm: handleTransfer,
                  })
                }
              >
                Chuyển
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} display="flex" justifyContent="center">
            <ProductQRCode
              qrCode={product.qrCode}
              productId={product.productId}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button
            type="button"
            {...getButtonProps("outlinedSecondary")}
            onClick={() => navigate("/products")}
          >
            Quay lại danh sách
          </Button>
        </Box>
      </Paper>

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, onConfirm: null })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
        title="Xác nhận chuyển sản phẩm"
        message="Bạn có chắc chắn muốn chuyển sản phẩm này?"
        confirmText="Chuyển"
        cancelText="Hủy"
        confirmButtonProps="warning"
      />
    </Container>
  );
};

export default ProductDetail;
