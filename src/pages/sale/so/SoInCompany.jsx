import ListPageLayout from "@/components/layout/ListPageLayout";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { StatusSummaryCard } from "@/components/ui/status-summary-card";
import { getAllSosInCompany } from "@/services/sale/SoService";
import toastrService from "@/services/toastrService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SoInCompany = () => {
  const [sos, setSos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");
  const companyId = localStorage.getItem("companyId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSos = async () => {
      setLoading(true);
      try {
        const data = await getAllSosInCompany(companyId, token);
        setSos(data);
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

  const filteredSos =
    filterStatus === "Tất cả"
      ? sos
      : sos.filter((so) => so.status === filterStatus);

  const statusLabels = {
    "Chờ xuất kho": "Chờ xuất kho",
    "Chờ vận chuyển": "Chờ vận chuyển",
    "Đang vận chuyển": "Đang vận chuyển",
    "Đã hoàn thành": "Đã hoàn thành",
  };

  const statusColors = {
    "Chờ xuất kho": "bg-purple-100 text-purple-700",
    "Chờ vận chuyển": "bg-amber-100 text-amber-700",
    "Đang vận chuyển": "bg-blue-100 text-blue-700",
    "Đã hoàn thành": "bg-green-100 text-green-700",
  };

  const columns = [
    {
      accessorKey: "soCode",
      header: createSortableHeader("Mã đơn bán"),
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
      accessorKey: "poCode",
      header: createSortableHeader("Mã đơn mua"),
    },
    {
      accessorKey: "customerCompanyCode",
      header: createSortableHeader("Mã KH"),
    },
    {
      accessorKey: "customerCompanyName",
      header: createSortableHeader("Tên khách hàng"),
    },
    {
      accessorKey: "paymentMethod",
      header: createSortableHeader("PTTT"),
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
      breadcrumbs="Đơn bán hàng"
      title="Danh sách đơn bán hàng"
    >
      <div className="mb-6">
        <StatusSummaryCard
          data={sos}
          statusLabels={[
            "Tất cả",
            "Chờ xuất kho",
            "Chờ vận chuyển",
            "Đang vận chuyển",
            "Đã hoàn thành",
          ]}
          getStatus={(so) => so.status}
          statusColors={{
            "Tất cả": "#000",
            "Chờ xuất kho": "#9c27b0",
            "Chờ vận chuyển": "#ff9800",
            "Đang vận chuyển": "#2196f3",
            "Đã hoàn thành": "#4caf50",
          }}
          onSelectStatus={setFilterStatus}
          selectedStatus={filterStatus}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredSos}
        loading={loading}
        onRowClick={(row) => navigate(`/so/${row.soId}`)}
        exportFileName="Danh_sach_don_ban_hang"
        exportMapper={(row = {}) => ({
          "Mã đơn bán": row.soCode || "",
          "Mã đơn mua": row.poCode || "",
          "Mã KH": row.customerCompanyCode || "",
          "Tên khách hàng": row.customerCompanyName || "",
          "PTTT": row.paymentMethod || "",
          "Người tạo": row.createdBy || "",
          "Ngày tạo": row.createdOn
            ? new Date(row.createdOn).toLocaleString("vi-VN")
            : "",
          "Trạng thái": statusLabels[row.status] || row.status || "",
        })}
      />
    </ListPageLayout>
  );
};

export default SoInCompany;
