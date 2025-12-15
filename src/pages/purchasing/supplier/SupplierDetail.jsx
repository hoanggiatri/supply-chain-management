import LoadingPaper from "@/components/content-components/LoadingPaper";
import FormPageLayout from "@/components/layout/FormPageLayout";
import ItemCard from "@/components/marketplace/ItemCard";
import { Button } from "@/components/ui/button";
import { getCompanyById } from "@/services/general/CompanyService";
import { getAllItemsInCompany } from "@/services/general/ItemService";
import toastrService from "@/services/toastrService";
import { Building2, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SupplierDetail = () => {
  const { supplierId } = useParams();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

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
    <FormPageLayout
      breadcrumbItems={[
        { label: "Nhà cung cấp", path: "/suppliers" },
        { label: "Chi tiết" },
      ]}
      backLink="/suppliers"
      backLabel="Quay lại danh sách"
    >
      {/* Action button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="default"
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
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="w-4 h-4" />
          Yêu cầu báo giá
        </Button>
      </div>

      {/* Company info */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start mb-8">
        {/* Logo / Avatar */}
        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={company.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-10 h-10 text-blue-600" />
          )}
        </div>

        {/* General info */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {company.companyName}
          </h2>
          <p className="text-gray-500 mt-1">
            {company.mainIndustry || "Chưa cập nhật ngành nghề chính"}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <p className="text-sm text-gray-700">
              <strong>Mã công ty:</strong> {company.companyCode}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Mã số thuế:</strong> {company.taxCode || "Không có"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Người đại diện:</strong>{" "}
              {company.representativeName || "Không có"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Chức vụ:</strong> {company.representativeTitle || "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Số điện thoại:</strong>{" "}
              {company.phoneNumber || company.phone || "Không có"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {company.email || "Không có"}
            </p>
            <p className="text-sm text-gray-700 md:col-span-2">
              <strong>Địa chỉ:</strong> {company.address || "Không có"}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hàng hóa cung cấp
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-500">Nhà cung cấp chưa có hàng hóa bán.</p>
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
      </div>
    </FormPageLayout>
  );
};

export default SupplierDetail;
