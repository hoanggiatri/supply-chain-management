import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Box, Button, TextField, MenuItem, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createProduct } from "@/services/general/ProductService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";

const CreateProduct = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("companyId");

    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        itemId: "",
        batchNumber: "",
        quantity: 1 // Optional: if creating multiple
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getAllItemsInCompany(companyId, token);
                setItems(data);
            } catch (error) {
                toastrService.error("Không thể tải danh sách hàng hóa");
            }
        };
        fetchItems();
    }, [companyId, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(formData.itemId, { batchNumber: formData.batchNumber }, token);
            toastrService.success("Tạo sản phẩm thành công!");
            navigate("/products");
        } catch (error) {
            toastrService.error(error.response?.data?.message || "Lỗi khi tạo sản phẩm");
        }
    };

    return (
        <Container maxWidth="md">
            <Paper className="paper-container" elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    TẠO SẢN PHẨM MỚI (GENERATE QR)
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Chọn Hàng Hóa (Item)"
                                name="itemId"
                                value={formData.itemId}
                                onChange={handleChange}
                                required
                            >
                                {items.map((item) => (
                                    <MenuItem key={item.itemId} value={item.itemId}>
                                        {item.itemCode} - {item.itemName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Số Lô (Batch Number)"
                                name="batchNumber"
                                value={formData.batchNumber}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button variant="outlined" onClick={() => navigate("/products")}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Tạo & Tạo QR
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateProduct;
