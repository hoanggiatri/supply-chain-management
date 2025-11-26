import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Grid, Box, Button, Divider, TextField, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, transferProduct } from "@/services/general/ProductService";
import { getAllCompanies } from "@/services/general/CompanyService";
import ProductQRCode from "@/components/general/product/ProductQRCode";
import toastrService from "@/services/toastrService";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [product, setProduct] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [transferCompanyId, setTransferCompanyId] = useState("");

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
        if (product.company && (String(transferCompanyId) === String(product.company.companyId) || String(transferCompanyId) === String(product.company.id))) {
            toastrService.error("Không thể chuyển sản phẩm về cùng một công ty!");
            return;
        }
        if (window.confirm("Bạn có chắc chắn muốn chuyển sản phẩm này?")) {
            try {
                await transferProduct(productId, transferCompanyId, token);
                toastrService.success("Chuyển sản phẩm thành công!");
                const updated = await getProductById(productId, token);
                setProduct(updated);
            } catch (error) {
                toastrService.error("Lỗi khi chuyển sản phẩm");
            }
        }
    };

    if (!product) return <Container><Typography>Loading...</Typography></Container>;

    return (
        <Container>
            <Paper className="paper-container" elevation={3} sx={{ p: 4, mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>
                            CHI TIẾT SẢN PHẨM
                        </Typography>
                        <Box mb={2}>
                            <Typography variant="subtitle1"><strong>Tên Hàng Hóa:</strong> {product.item?.itemName}</Typography>
                            <Typography variant="subtitle1"><strong>Mã Hàng Hóa:</strong> {product.item?.itemCode}</Typography>
                            <Typography variant="subtitle1"><strong>Số Serial:</strong> {product.serialNumber}</Typography>
                            <Typography variant="subtitle1"><strong>Số Lô (Batch):</strong> {product.batchNumber}</Typography>
                            <Typography variant="subtitle1"><strong>Trạng Thái:</strong> {product.status}</Typography>
                            <Typography variant="subtitle1"><strong>Công Ty Hiện Tại:</strong> {product.company?.name || "N/A"}</Typography>
                            <Typography variant="subtitle1"><strong>Ngày Tạo:</strong> {new Date(product.createdDate).toLocaleString()}</Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>Chuyển Sản Phẩm (Transfer)</Typography>
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
                            <Button variant="contained" color="warning" onClick={handleTransfer}>
                                Chuyển
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4} display="flex" justifyContent="center">
                        <ProductQRCode qrCode={product.qrCode} productId={product.productId} />
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Button variant="outlined" onClick={() => navigate("/products")}>
                        Quay lại danh sách
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductDetail;
