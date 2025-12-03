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
import { getAllPosInCompany } from "@/services/purchasing/PoService";
import toastrService from "@/services/toastrService";

const PO_STATUSES = [
  "Tất cả",
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang vận chuyển",
  "Chờ nhập kho",
  "Đã hoàn thành",
  "Đã hủy",
];

const PoMarketplace = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  // Fetch POs
  useEffect(() => {
    const fetchPos = async () => {
      setLoading(true);
      try {
        const data = await getAllPosInCompany(companyId, token);
        setPos(data || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn mua hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPos();
  }, [companyId, token]);

  // Filter and search POs
  const filteredPos = useMemo(() => {
    let result = pos;

    // Filter by status
    if (filterStatus && filterStatus !== "Tất cả") {
      result = result.filter((po) => po.status === filterStatus);
    }

    // Search by code, company name, or quotation code
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter((po) => {
        const codeMatch = po.poCode?.toLowerCase().includes(searchLower);
        const companyMatch = po.supplierCompanyName
          ?.toLowerCase()
          .includes(searchLower);
        const quotationMatch = po.quotationCode
          ?.toLowerCase()
          .includes(searchLower);
        const itemMatch = po.poDetails?.some(
          (detail) =>
            detail.itemCode?.toLowerCase().includes(searchLower) ||
            detail.itemName?.toLowerCase().includes(searchLower)
        );
        return codeMatch || companyMatch || quotationMatch || itemMatch;
      });
    }

    return result;
  }, [pos, filterStatus, search]);

  // Handlers
  const handleCardClick = useCallback(
    (poId) => {
      navigate(`/marketplace/po/${poId}`);
    },
    [navigate]
  );

  const handleClearFilter = useCallback(() => {
    setFilterStatus("Tất cả");
    setSearch("");
  }, []);

  // Get first item image from PO
  const getFirstItemImage = (po) => {
    const firstDetail = po.poDetails?.[0];
    return firstDetail?.imageUrl || firstDetail?.itemImageUrl || null;
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              ĐƠN MUA HÀNG
            </Typography>
          </div>

          {/* Status Filter Chips */}
          <StatusFilterChips
            statuses={PO_STATUSES}
            selectedStatus={filterStatus}
            onSelectStatus={setFilterStatus}
            data={pos}
            getStatus={(po) => po.status}
          />

          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo mã đơn, tên NCC, hoặc mã báo giá..."
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPos.length === 0 && (
            <EmptyState
              title="Không tìm thấy đơn mua hàng"
              description={
                search || filterStatus !== "Tất cả"
                  ? "Không có kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi điều kiện tìm kiếm."
                  : "Bạn chưa có đơn mua hàng nào."
              }
              showClearFilter={search !== "" || filterStatus !== "Tất cả"}
              onClearFilter={handleClearFilter}
            />
          )}

          {/* PO Cards Grid */}
          {!loading && filteredPos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPos.map((po) => (
                <OrderCard
                  key={po.poId}
                  id={po.poId}
                  code={po.poCode}
                  title={po.supplierCompanyName}
                  subtitle={`Mã NCC: ${po.supplierCompanyCode || ""}`}
                  status={po.status}
                  imageUrl={getFirstItemImage(po)}
                  itemCount={po.poDetails?.length || 0}
                  totalAmount={po.totalAmount}
                  date={formatDate(po.createdOn)}
                  badges={[
                    {
                      label: "Báo giá",
                      value: po.quotationCode || "N/A",
                    },
                    {
                      label: "Thanh toán",
                      value: po.paymentMethod || "N/A",
                    },
                  ]}
                  onClick={() => handleCardClick(po.poId)}
                  type="order"
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredPos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-gray-50">
              <Typography variant="small" color="gray">
                Hiển thị {filteredPos.length} / {pos.length} đơn mua hàng
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PoMarketplace;

