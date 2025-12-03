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
import { getAllRfqsInRequestedCompany } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";

const SUPPLIER_RFQ_STATUSES = ["Tất cả", "Chưa báo giá"];

const SupplierRfqMarketplace = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  // Fetch RFQs for supplier
  useEffect(() => {
    const fetchRfqs = async () => {
      setLoading(true);
      try {
        const data = await getAllRfqsInRequestedCompany(companyId, token);
        // Filter only pending RFQs
        const filteredData = data.filter(
          (rfq) => rfq.status === "Chưa báo giá"
        );
        setRfqs(filteredData || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Có lỗi khi lấy danh sách yêu cầu báo giá!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRfqs();
  }, [companyId, token]);

  // Filter and search RFQs
  const filteredRfqs = useMemo(() => {
    let result = rfqs;

    // Filter by status
    if (filterStatus && filterStatus !== "Tất cả") {
      result = result.filter((rfq) => rfq.status === filterStatus);
    }

    // Search by code, company name, or item name
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter((rfq) => {
        const codeMatch = rfq.rfqCode?.toLowerCase().includes(searchLower);
        const companyMatch = rfq.companyName
          ?.toLowerCase()
          .includes(searchLower);
        const itemMatch = rfq.rfqDetails?.some(
          (detail) =>
            detail.itemCode?.toLowerCase().includes(searchLower) ||
            detail.itemName?.toLowerCase().includes(searchLower)
        );
        return codeMatch || companyMatch || itemMatch;
      });
    }

    return result;
  }, [rfqs, filterStatus, search]);

  // Handlers
  const handleCardClick = useCallback(
    (rfqId) => {
      navigate(`/marketplace/supplier-rfq/${rfqId}`);
    },
    [navigate]
  );

  const handleClearFilter = useCallback(() => {
    setFilterStatus("Tất cả");
    setSearch("");
  }, []);

  // Get first item image from RFQ
  const getFirstItemImage = (rfq) => {
    const firstDetail = rfq.rfqDetails?.[0];
    return firstDetail?.imageUrl || firstDetail?.itemImageUrl || null;
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              YÊU CẦU BÁO GIÁ TỪ KHÁCH HÀNG
            </Typography>
          </div>

          {/* Status Filter Chips */}
          <StatusFilterChips
            statuses={SUPPLIER_RFQ_STATUSES}
            selectedStatus={filterStatus}
            onSelectStatus={setFilterStatus}
            data={rfqs}
            getStatus={(rfq) => rfq.status}
          />

          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo mã, tên công ty, hoặc tên sản phẩm..."
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRfqs.length === 0 && (
            <EmptyState
              title="Không có yêu cầu báo giá"
              description={
                search || filterStatus !== "Tất cả"
                  ? "Không có kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi điều kiện tìm kiếm."
                  : "Hiện tại chưa có yêu cầu báo giá nào từ khách hàng."
              }
              showClearFilter={search !== "" || filterStatus !== "Tất cả"}
              onClearFilter={handleClearFilter}
            />
          )}

          {/* RFQ Cards Grid */}
          {!loading && filteredRfqs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRfqs.map((rfq) => (
                <OrderCard
                  key={rfq.rfqId}
                  id={rfq.rfqId}
                  code={rfq.rfqCode}
                  title={rfq.companyName}
                  subtitle={`Hạn báo giá: ${
                    formatDate(rfq.needByDate) || "N/A"
                  }`}
                  status={rfq.status}
                  imageUrl={getFirstItemImage(rfq)}
                  itemCount={rfq.rfqDetails?.length || 0}
                  date={formatDate(rfq.createdOn)}
                  badges={[
                    {
                      label: "Hạn",
                      value: formatDate(rfq.needByDate) || "N/A",
                    },
                  ]}
                  onClick={() => handleCardClick(rfq.rfqId)}
                  type="order"
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredRfqs.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-gray-50">
              <Typography variant="small" color="gray">
                Hiển thị {filteredRfqs.length} yêu cầu báo giá cần xử lý
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SupplierRfqMarketplace;




