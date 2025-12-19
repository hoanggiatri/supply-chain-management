import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";
import { scanQRCodeDetail } from "@/services/general/ProductService";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const ProductVerification = () => {
    const { qrCode } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [productDetail, setProductDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!qrCode) return;

            try {
                setLoading(true);
                const data = await scanQRCodeDetail(qrCode, token);
                setProductDetail(data);
            } catch (error) {
                toastrService.error(
                    error.response?.data?.message || "Không tìm thấy thông tin sản phẩm!"
                );
                // Optional: redirect or show error state
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [qrCode, token]);

    const getStatusColor = (status) => {
        const statusMap = {
            PRODUCED: "orange",
            IN_WAREHOUSE: "green",
            ISSUED: "blue",
            SOLD: "purple",
            DELIVERED: "deep-purple",
        };
        return statusMap[status] || "gray";
    };

    if (loading) return <LoadingPaper title="Đang xác thực thông tin sản phẩm..." />;

    if (!productDetail) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <Typography variant="h5" color="red" className="mb-4">
                    Không tìm thấy sản phẩm
                </Typography>
                <Button {...getButtonProps("secondary")} onClick={() => navigate("/")}>
                    Về trang chủ
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Card className="shadow-lg bg-white">
                <CardBody className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
                        <div>
                            <Typography variant="h4" color="blue-gray" className="font-bold">
                                THÔNG TIN SẢN PHẨM
                            </Typography>
                            <Typography variant="small" color="gray" className="mt-1">
                                Mã QR: {qrCode}
                            </Typography>
                        </div>

                        <Button
                            {...getButtonProps("primary")}
                            size="sm"
                            onClick={() => navigate(`/products/${productDetail.productId}`)}
                        >
                            Xem chi tiết đầy đủ
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Tên sản phẩm
                            </Typography>
                            <Typography variant="h6" className="font-bold text-blue-gray-900">
                                {productDetail.itemName}
                            </Typography>
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Mã sản phẩm (Item Code)
                            </Typography>
                            <Typography variant="h6" className="font-semibold">
                                {productDetail.itemCode}
                            </Typography>
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Serial Number
                            </Typography>
                            <Chip
                                value={productDetail.serialNumber}
                                color="blue"
                                size="sm"
                                variant="ghost"
                                className="w-max"
                            />
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Batch Number
                            </Typography>
                            <Typography variant="h6" className="font-semibold">
                                {productDetail.batchNo}
                            </Typography>
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Trạng thái
                            </Typography>
                            <Chip
                                value={productDetail.status}
                                color={getStatusColor(productDetail.status)}
                                size="sm"
                                variant="ghost"
                                className="w-max"
                            />
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Product ID
                            </Typography>
                            <Typography variant="small" className="font-mono">
                                {productDetail.productId}
                            </Typography>
                        </div>

                        {productDetail.currentCompanyName && (
                            <div className="md:col-span-2">
                                <Typography variant="small" color="gray" className="mb-1">
                                    Công ty hiện tại
                                </Typography>
                                <Typography variant="h6" className="font-semibold">
                                    {productDetail.currentCompanyName}
                                </Typography>
                            </div>
                        )}

                        {productDetail.manufacturerCompanyName && (
                            <div className="md:col-span-2">
                                <Typography variant="small" color="gray" className="mb-1">
                                    Nhà sản xuất
                                </Typography>
                                <Typography variant="h6" className="font-semibold">
                                    {productDetail.manufacturerCompanyName}
                                </Typography>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ProductVerification;
