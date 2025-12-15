import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllQuotationsInCompany } from "@/services/sale/QuotationService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QuotationInCompany = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchQuotations = async () => {
      setLoading(true);
      try {
        const data = await getAllQuotationsInCompany(companyId, token);
        setQuotations(data);
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

  const filteredQuotations =
    !filterStatus || filterStatus === "Tất cả"
      ? quotations
      : quotations.filter((q) => q.status === filterStatus);

  const statusLabels = {
    "Đã báo giá": "Đã báo giá",
    "Đã chấp nhận": "Đã chấp nhận",
    "Đã từ chối": "Đã từ chối",
  };

  const statusColors = {
    "Đã báo giá": "bg-blue-100 text-blue-700",
    "Đã chấp nhận": "bg-green-100 text-green-700",
    "Đã từ chối": "bg-red-100 text-red-700",
  };

  const columns = [
    {
      accessorKey: "quotationCode",
      header: createSortableHeader("Mã báo giá"),
      cell: ({ getValue }) => {
        const code = getValue();
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {code}
          </span>
        );
      },
    },
    {
      accessorKey: "rfqCode",
      header: createSortableHeader("Mã yêu cầu"),
    },
    {
      accessorKey: "createdBy",
      header: createSortableHeader("Người báo giá"),
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày báo giá"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
    },
    {
      accessorKey: "status",
      header: createSortableHeader("Trạng thái"),
      cell: ({ getValue }) => {
        const status = getValue();
        const label = statusLabels[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

        return (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  return (
    <ListPageLayout
      breadcrumbs="Báo giá"
      title="Danh sách báo giá"
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={quotations}
          statusLabels={[
            "Tất cả",
            "Đã báo giá",
            "Đã chấp nhận",
            "Đã từ chối",
          ]}
          getStatus={(quotation) => quotation.status}
          statusColors={{
            "Tất cả": "#000",
            "Đã báo giá": "#2196f3",
            "Đã từ chối": "#f44336",
            "Đã chấp nhận": "#4caf50",
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredQuotations}
        loading={loading}
        onRowClick={(row) => navigate(`/quotation/${row.rfqId}`)}
        exportFileName="Danh_sach_bao_gia"
        exportMapper={(row = {}) => ({
          "Mã báo giá": row.quotationCode || "",
          "Mã yêu cầu": row.rfqCode || "",
          "Người báo giá": row.createdBy || "",
          "Ngày báo giá": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default QuotationInCompany;
