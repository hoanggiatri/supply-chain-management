import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllRfqsInRequestedCompany } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RfqInSupplierCompany = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchRfqs = async () => {
      setLoading(true);
      try {
        const data = await getAllRfqsInRequestedCompany(companyId, token);
        const filteredData = data.filter(
          (rfq) => rfq.status === "Chưa báo giá" || rfq.status === "Đã báo giá"
        );
        setRfqs(filteredData);
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

  const filteredRfqs =
    !filterStatus || filterStatus === "Tất cả"
      ? rfqs
      : rfqs.filter((rfq) => rfq.status === filterStatus);

  const statusLabels = {
    "Chưa báo giá": "Chưa báo giá",
    "Đã báo giá": "Đã báo giá",
  };

  const statusColors = {
    "Chưa báo giá": "bg-amber-100 text-amber-700",
    "Đã báo giá": "bg-green-100 text-green-700",
  };

  const columns = [
    {
      accessorKey: "rfqCode",
      header: createSortableHeader("Mã yêu cầu"),
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
      accessorKey: "companyName",
      header: createSortableHeader("Công ty yêu cầu"),
    },
    {
      accessorKey: "needByDate",
      header: createSortableHeader("Hạn báo giá"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày yêu cầu"),
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
      breadcrumbs="Yêu cầu báo giá"
      title="Danh sách yêu cầu báo giá"
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={rfqs}
          statusLabels={["Tất cả", "Chưa báo giá", "Đã báo giá"]}
          getStatus={(rfq) => rfq.status}
          statusColors={{
            "Tất cả": "#000",
            "Chưa báo giá": "#ff9800",
            "Đã báo giá": "#4caf50",
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRfqs}
        loading={loading}
        onRowClick={(row) => navigate(`/supplier-rfq/${row.rfqId}`)}
        exportFileName="Danh_sach_yeu_cau_bao_gia_nhan"
        exportMapper={(row = {}) => ({
          "Mã yêu cầu": row.rfqCode || "",
          "Công ty yêu cầu": row.companyName || "",
          "Hạn báo giá": row.needByDate
            ? new Date(row.needByDate).toLocaleString("vi-VN")
            : "",
          "Ngày yêu cầu": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default RfqInSupplierCompany;
