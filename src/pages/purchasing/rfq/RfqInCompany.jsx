import { AddButton } from "@/components/common/ActionButtons";
import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllRfqsInCompany } from "@/services/purchasing/RfqService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RfqInCompany = () => {
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
        const data = await getAllRfqsInCompany(companyId, token);
        setRfqs(data);
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
    "Quá hạn báo giá": "Quá hạn báo giá",
    "Đã chấp nhận": "Đã chấp nhận",
    "Đã từ chối": "Đã từ chối",
    "Đã hủy": "Đã hủy",
  };

  const statusColors = {
    "Chưa báo giá": "bg-purple-100 text-purple-700",
    "Đã báo giá": "bg-blue-100 text-blue-700",
    "Quá hạn báo giá": "bg-red-100 text-red-700",
    "Đã chấp nhận": "bg-green-100 text-green-700",
    "Đã từ chối": "bg-amber-100 text-amber-700",
    "Đã hủy": "bg-red-100 text-red-700",
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
      accessorKey: "requestedCompanyName",
      header: createSortableHeader("Công ty báo giá"),
    },
    {
      accessorKey: "needByDate",
      header: createSortableHeader("Hạn báo giá"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleDateString("vi-VN") : "";
      },
    },
    {
      accessorKey: "createdBy",
      header: createSortableHeader("Người tạo"),
    },
    {
      accessorKey: "createdOn",
      header: createSortableHeader("Ngày tạo"),
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? new Date(value).toLocaleString("vi-VN") : "";
      },
    },
    {
      accessorKey: "lastUpdatedOn",
      header: createSortableHeader("Cập nhật"),
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
      actions={
        <AddButton
          onClick={() => navigate("/create-rfq")}
          label="Thêm mới"
        />
      }
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={rfqs}
          statusLabels={[
            "Tất cả",
            "Chưa báo giá",
            "Đã báo giá",
            "Quá hạn báo giá",
            "Đã chấp nhận",
            "Đã từ chối",
            "Đã hủy",
          ]}
          getStatus={(rfq) => rfq.status}
          statusColors={{
            "Tất cả": "#000",
            "Chưa báo giá": "#9c27b0",
            "Đã báo giá": "#2196f3",
            "Quá hạn báo giá": "#f44336",
            "Đã chấp nhận": "#4caf50",
            "Đã từ chối": "#ff9800",
            "Đã hủy": "#f44336",
          }}
          onSelectStatus={(status) => setFilterStatus(status)}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredRfqs}
        loading={loading}
        onRowClick={(row) => navigate(`/rfq/${row.rfqId}`)}
        exportFileName="Danh_sach_yeu_cau_bao_gia"
        exportMapper={(row = {}) => ({
          "Mã yêu cầu": row.rfqCode || "",
          "Công ty báo giá": row.requestedCompanyName || "",
          "Hạn báo giá": row.needByDate
            ? new Date(row.needByDate).toLocaleDateString("vi-VN")
            : "",
          "Người tạo": row.createdBy || "",
          "Ngày tạo": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Cập nhật": row.lastUpdatedOn
            ? new Date(row.lastUpdatedOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default RfqInCompany;
