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
import { getAllSosInCompany } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";

const SO_STATUSES = [
  "Tất cả",
  "Chờ xuất kho",
  "Chờ vận chuyển",
  "Đang vận chuyển",
  "Đã hoàn thành",
];

const SoMarketplace = () => {
  const [sos, setSos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  // Fetch SOs
  useEffect(() => {
    const fetchSos = async () => {
      setLoading(true);
      try {
        const data = await getAllSosInCompany(companyId, token);
        setSos(data || []);
      } catch (error) {
        toastrService.error(
          error.response?.data?.message ||
            "Không thể lấy danh sách đơn bán hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSos();
  }, [companyId, token]);

  // Filter and search SOs
  const filteredSos = useMemo(() => {
    let result = sos;

    // Filter by status
    if (filterStatus && filterStatus !== "Tất cả") {
      result = result.filter((so) => so.status === filterStatus);
    }

    // Search by code, company name, or PO code
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      result = result.filter((so) => {
        const codeMatch = so.soCode?.toLowerCase().includes(searchLower);
        const companyMatch = so.customerCompanyName
          ?.toLowerCase()
          .includes(searchLower);
        const poMatch = so.poCode?.toLowerCase().includes(searchLower);
        const itemMatch = so.soDetails?.some(
          (detail) =>
            detail.itemCode?.toLowerCase().includes(searchLower) ||
            detail.itemName?.toLowerCase().includes(searchLower)
        );
        return codeMatch || companyMatch || poMatch || itemMatch;
      });
    }

    return result;
  }, [sos, filterStatus, search]);

  // Handlers
  const handleCardClick = useCallback(
    (soId) => {
      navigate(`/marketplace/so/${soId}`);
    },
    [navigate]
  );

  const handleClearFilter = useCallback(() => {
    setFilterStatus("Tất cả");
    setSearch("");
  }, []);

  // Get first item image from SO
  const getFirstItemImage = (so) => {
    const firstDetail = so.soDetails?.[0];
    return firstDetail?.imageUrl || firstDetail?.itemImageUrl || null;
  };

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <CardBody>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              ĐƠN BÁN HÀNG
            </Typography>
          </div>

          {/* Status Filter Chips */}
          <StatusFilterChips
            statuses={SO_STATUSES}
            selectedStatus={filterStatus}
            onSelectStatus={setFilterStatus}
            data={sos}
            getStatus={(so) => so.status}
          />

          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng, hoặc mã PO..."
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-12 w-12" color="blue" />
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredSos.length === 0 && (
            <EmptyState
              title="Không tìm thấy đơn bán hàng"
              description={
                search || filterStatus !== "Tất cả"
                  ? "Không có kết quả phù hợp với bộ lọc của bạn. Hãy thử thay đổi điều kiện tìm kiếm."
                  : "Bạn chưa có đơn bán hàng nào."
              }
              showClearFilter={search !== "" || filterStatus !== "Tất cả"}
              onClearFilter={handleClearFilter}
            />
          )}

          {/* SO Cards Grid */}
          {!loading && filteredSos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSos.map((so) => (
                <OrderCard
                  key={so.soId}
                  id={so.soId}
                  code={so.soCode}
                  title={so.customerCompanyName}
                  subtitle={`Mã KH: ${so.customerCompanyCode || ""}`}
                  status={so.status}
                  imageUrl={getFirstItemImage(so)}
                  itemCount={so.soDetails?.length || 0}
                  totalAmount={so.totalAmount}
                  date={formatDate(so.createdOn)}
                  badges={[
                    {
                      label: "Đơn mua",
                      value: so.poCode || "N/A",
                    },
                    {
                      label: "Thanh toán",
                      value: so.paymentMethod || "N/A",
                    },
                  ]}
                  onClick={() => handleCardClick(so.soId)}
                  type="order"
                />
              ))}
            </div>
          )}

          {/* Results count */}
          {!loading && filteredSos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-blue-gray-50">
              <Typography variant="small" color="gray">
                Hiển thị {filteredSos.length} / {sos.length} đơn bán hàng
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default SoMarketplace;

