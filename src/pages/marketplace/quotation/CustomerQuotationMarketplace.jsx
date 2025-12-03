import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Typography, Card, CardBody, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  OrderCard,
  StatusFilterChips,
  SearchInput,
  EmptyState,
  formatDate,
} from "@/components/marketplace";
import { getAllQuotationsInRequestCompany } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";

const CUSTOMER_QUOTATION_STATUSES = [
  "Tất cả",
  "Đã báo giá",
  "Đã chấp nhận",
  "Đã từ chối",
];

const CustomerQuotationMarketplace = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  // Fetch Quotations for customer
  useEffect(() => {
    const fetchQuotations = async () => {
      setLoading(true);
      try {
        const data = await getAllQuotationsInRequestCompany(companyId, token);
        setQuotations(data || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message || "Không thể lấy danh sách báo giá!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [companyId, token]);

  // Filter and search Quotations
  const filteredQuotations = useMemo(() => {
    let result = quotations;

    // Filter by status
    if (filterStatus && filterStatus !== "Tất cả") {
      result = result.filter((q) => q.status === filterStatus);
    }

    // Search by code, rfq code, or company name
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter((q) => {
        const codeMatch = q.quotationCode?.toLowerCase().includes(searchLower);
        const rfqMatch = q.rfqCode?.toLowerCase().includes(searchLower);
        const companyMatch = q.companyName?.toLowerCase().includes(searchLower);
        const itemMatch = q.quotationDetails?.some(
          (detail) =>
            detail.itemCode?.toLowerCase().includes(searchLower) ||
            detail.itemName?.toLowerCase().includes(searchLower)
        );
        return codeMatch || rfqMatch || companyMatch || itemMatch;
      });
    }

    return result;
  }, [quotations, filterStatus, search]);

  // Handlers
  const handleCardClick = useCallback(
    (rfqId) => {
      navigate(`/marketplace/customer-quotation/${rfqId}`);
    },
    [navigate]
  );

  const handleClearFilter = useCallback(() => {
    setFilterStatus("Tất cả");
    setSearch("");
  }, []);

  // Get first item image from Quotation
  const getFirstItemImage = (quotation) => {
    const firstDetail = quotation.quotationDetails?.[0];
    return firstDetail?.imageUrl || firstDetail?.itemImageUrl || null;
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              BÁO GIÁ TỪ NHÀ CUNG CẤP
            </Typography>
          </div>

          {/* Status Filter Chips */}
          <StatusFilterChips
            statuses={CUSTOMER_QUOTATION_STATUSES}
            selectedStatus={filterStatus}
            onSelectStatus={setFilterStatus}
            data={quotations}
            getStatus={(q) => q.status}
          />

          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo mã báo giá, mã RFQ, hoặc tên NCC..."
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredQuotations.length === 0 && (
            <EmptyState
              title="Không có báo giá"
              description={
                search || filterStatus !== "Tất cả"
                  ? "Không có kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi điều kiện tìm kiếm."
                  : "Hiện tại chưa có báo giá nào từ nhà cung cấp."
              }
              showClearFilter={search !== "" || filterStatus !== "Tất cả"}
              onClearFilter={handleClearFilter}
            />
          )}

          {/* Quotation Cards Grid */}
          {!loading && filteredQuotations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQuotations.map((q) => (
                <OrderCard
                  key={q.quotationId}
                  id={q.quotationId}
                  code={q.quotationCode}
                  title={q.companyName || "N/A"}
                  subtitle={`RFQ: ${q.rfqCode || ""}`}
                  status={q.status}
                  imageUrl={getFirstItemImage(q)}
                  itemCount={q.quotationDetails?.length || 0}
                  totalAmount={q.totalAmount}
                  date={formatDate(q.createdOn)}
                  onClick={() => handleCardClick(q.rfqId)}
                  type="order"
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredQuotations.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-gray-50">
              <Typography variant="small" color="gray">
                Hiển thị {filteredQuotations.length} / {quotations.length} báo
                giá
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomerQuotationMarketplace;




