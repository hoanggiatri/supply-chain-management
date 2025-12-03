import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  OrderCard,
  StatusFilterChips,
  SearchInput,
  EmptyState,
  formatDate,
} from "@/components/marketplace";
import { getAllRfqsInCompany } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { getButtonProps } from "@/utils/buttonStyles";

const RFQ_STATUSES = [
  "Tất cả",
  "Chưa báo giá",
  "Đã báo giá",
  "Quá hạn báo giá",
  "Đã chấp nhận",
  "Đã từ chối",
  "Đã hủy",
];

const RfqMarketplace = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  // Fetch RFQs
  useEffect(() => {
    const fetchRfqs = async () => {
      setLoading(true);
      try {
        const data = await getAllRfqsInCompany(companyId, token);
        setRfqs(data || []);
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
        const companyMatch = rfq.requestedCompanyName
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
      navigate(`/marketplace/rfq/${rfqId}`);
    },
    [navigate]
  );

  const handleClearFilter = useCallback(() => {
    setFilterStatus("Tất cả");
    setSearch("");
  }, []);

  const handleCreateRfq = useCallback(() => {
    navigate("/create-rfq");
  }, [navigate]);

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
              YÊU CẦU BÁO GIÁ
            </Typography>
            <Button {...getButtonProps("primary")} onClick={handleCreateRfq}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Tạo yêu cầu mới
            </Button>
          </div>

          {/* Status Filter Chips */}
          <StatusFilterChips
            statuses={RFQ_STATUSES}
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
              title="Không tìm thấy yêu cầu báo giá"
              description={
                search || filterStatus !== "Tất cả"
                  ? "Không có kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi điều kiện tìm kiếm."
                  : "Bạn chưa có yêu cầu báo giá nào. Hãy tạo yêu cầu mới để bắt đầu."
              }
              showClearFilter={search !== "" || filterStatus !== "Tất cả"}
              onClearFilter={handleClearFilter}
              actionLabel={rfqs.length === 0 ? "Tạo yêu cầu mới" : undefined}
              onAction={rfqs.length === 0 ? handleCreateRfq : undefined}
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
                  title={rfq.requestedCompanyName}
                  subtitle={`Người tạo: ${rfq.createdBy || ""}`}
                  status={rfq.status}
                  imageUrl={getFirstItemImage(rfq)}
                  itemCount={rfq.rfqDetails?.length || 0}
                  date={formatDate(rfq.needByDate)}
                  badges={[
                    {
                      label: "Hạn báo giá",
                      value: formatDate(rfq.needByDate),
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
                Hiển thị {filteredRfqs.length} / {rfqs.length} yêu cầu báo giá
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default RfqMarketplace;

