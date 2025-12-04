import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import LoadingPaper from "@/components/content-components/LoadingPaper";
import { getCompanyById } from "@/services/general/CompanyService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import ItemCard from "@/components/marketplace/ItemCard";

const SupplierDetail = () => {
  const { supplierId } = useParams();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem đang ở marketplace context hay không
  const isMarketplaceContext = location.pathname.startsWith("/marketplace/");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyData = await getCompanyById(supplierId, token);
        setCompany(companyData);

        const itemData = await getAllItemsInCompany(supplierId, token);
        const sellableItems = itemData.filter(
          (item) => item.isSellable === true
        );
        setItems(sellableItems);
      } catch (error) {
        toastrService.error("Lỗi khi tải dữ liệu nhà cung cấp!");
      }
    };

    fetchData();
  }, [supplierId, token]);

  if (!company) return <LoadingPaper title="THÔNG TIN NHÀ CUNG CẤP" />;

  const logoUrl = company.logoUrl || company.logo;

  return (
    <Container>
      <Paper className="paper-container" elevation={3}>
        {/* Header + action */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography className="page-title" variant="h4">
            THÔNG TIN NHÀ CUNG CẤP
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const createRfqPath = isMarketplaceContext
                ? "/marketplace/create-rfq"
                : "/create-rfq";
              navigate(createRfqPath, {
                state: {
                  supplierId,
                  from: isMarketplaceContext ? "marketplace" : "company",
                },
              });
            }}
          >
            Yêu cầu báo giá
          </Button>
        </Box>

        {/* Company info - không dùng input, trình bày đẹp hơn */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={3}
          alignItems={{ xs: "flex-start", md: "center" }}
          mb={4}
        >
          {/* Logo / Avatar */}
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              bgcolor: "#ECEFF1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid #CFD8DC",
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={company.companyName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography variant="h4" color="primary">
                {company.companyName?.charAt(0)?.toUpperCase() || "N"}
              </Typography>
            )}
          </Box>

          {/* General info */}
          <Box flex={1}>
            <Typography variant="h5" gutterBottom>
              {company.companyName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {company.mainIndustry || "Chưa cập nhật ngành nghề chính"}
            </Typography>

            <Box
              mt={2}
              display="grid"
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
              gap={1.5}
            >
              <Typography variant="body2">
                <strong>Mã công ty:</strong> {company.companyCode}
              </Typography>
              <Typography variant="body2">
                <strong>Mã số thuế:</strong> {company.taxCode || "Không có"}
              </Typography>
              <Typography variant="body2">
                <strong>Người đại diện:</strong>{" "}
                {company.representativeName || "Không có"}
              </Typography>
              <Typography variant="body2">
                <strong>Chức vụ:</strong> {company.representativeTitle || "—"}
              </Typography>
              <Typography variant="body2">
                <strong>Số điện thoại:</strong>{" "}
                {company.phoneNumber || company.phone || "Không có"}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {company.email || "Không có"}
              </Typography>
              <Typography variant="body2" sx={{ gridColumn: { md: "1 / 3" } }}>
                <strong>Địa chỉ:</strong> {company.address || "Không có"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Items with images */}
        <Box mt={2}>
          <Typography variant="h5" mb={2}>
            HÀNG HÓA CUNG CẤP
          </Typography>

          {items.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Nhà cung cấp chưa có hàng hóa bán.
            </Typography>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <ItemCard
                  key={item.itemId || item.id}
                  itemCode={item.itemCode || item.code}
                  itemName={item.itemName}
                  imageUrl={item.imageUrl || item.image}
                  quantity={item.minimumOrderQuantity || 1}
                  note={item.description || item.technicalSpecifications}
                />
              ))}
            </div>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SupplierDetail;
